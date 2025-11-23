# CLAUDE.md - AI Assistant Guide for Shakespeare Distant Reading Project

## Project Overview

This is a **distant reading analysis system** for Shakespeare plays that combines Python-based computational text analysis with an interactive web visualization interface. The project analyzes five Shakespeare plays from Project Gutenberg using NLP techniques including bag-of-words, sentiment analysis, and stylometric analysis.

**Primary Purpose:** Educational demonstration of computational literary analysis (distant reading) applied to classical texts.

**Tech Stack:**
- **Backend Analysis:** Python 3 with NLTK, TextStat
- **Frontend Visualization:** Vanilla JavaScript (ES6+), HTML5, CSS3
- **Libraries:** Chart.js, WordCloud2.js
- **Data Format:** JSON
- **Deployment:** GitHub Pages (static site)

---

## Repository Structure

```
.
├── analyze_texts.py          # Python analysis script (main backend)
├── requirements.txt          # Python dependencies
├── analysis_data.json        # Generated analysis results (388KB)
├── index.html               # Main web interface
├── app.js                   # Frontend application logic (21KB)
├── styles.css              # Stylesheet (11KB)
├── pg1513.txt              # Romeo and Juliet
├── pg1514.txt              # A Midsummer Night's Dream
├── pg1519.txt              # Much Ado about Nothing
├── pg1524.txt              # Hamlet
├── pg1533.txt              # Macbeth
└── README.md               # User-facing documentation
```

**Key Files to Know:**
- `analyze_texts.py` - The analysis engine (line 1-284)
- `app.js` - Frontend state management and visualization
- `analysis_data.json` - The data bridge between Python and JavaScript
- `index.html` - Single-page application structure

---

## Codebase Architecture

### Python Analysis Pipeline (`analyze_texts.py`)

**Main Class:** `TextAnalyzer` (line 25-223)

**Key Methods:**

| Method | Lines | Purpose |
|--------|-------|---------|
| `strip_gutenberg_metadata()` | 32-58 | Remove Project Gutenberg headers/footers |
| `preprocess_text()` | 60-68 | Clean and normalize text |
| `get_words()` | 70-82 | Tokenize and optionally remove stopwords |
| `build_bag_of_words()` | 88-90 | Create word frequency dictionary |
| `sentiment_analysis()` | 96-104 | VADER sentiment scoring |
| `calculate_style_metrics()` | 106-139 | Compute readability and style metrics |
| `analyze_text()` | 141-191 | Main analysis orchestrator |
| `compare_texts()` | 193-223 | Generate vocabulary overlap data |

**Analysis Flow:**
1. Load text files matching pattern `pg*.txt`
2. Strip Gutenberg metadata
3. Tokenize (words and sentences)
4. Remove stopwords for bag-of-words
5. Calculate sentiment scores (VADER)
6. Calculate style metrics (vocabulary richness, readability scores)
7. Generate comparison data (vocabulary overlaps)
8. Export to `analysis_data.json`

**Important Pattern:** The script keeps two word lists:
- `words_all` - All words (for accurate counts)
- `words_no_stop` - Stopwords removed (for meaningful analysis)

### Frontend Architecture (`app.js`, `index.html`)

**State Management:** Global variables (line 5-10 in app.js)
- `analysisData` - Loaded JSON data
- `currentTextIndex` - Selected text
- `sentimentChart`, `comparisonSentimentChart`, `wordFrequencyChart` - Chart.js instances

**Key Functions:**
- `loadAnalysisData()` - Fetch and parse JSON
- `selectText(index)` - Display individual text analysis
- `runComparison()` - Multi-text comparison mode
- `renderWordCloud()` - WordCloud2.js integration
- `createSentimentChart()` - Chart.js bar chart

**UI Modes:**
1. **Individual View** - Single text analysis (word cloud, sentiment, style metrics)
2. **Comparison View** - Multi-text side-by-side analysis

---

## Data Flow

```
┌──────────────────┐
│  pg*.txt files   │ (Project Gutenberg texts)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ analyze_texts.py │ (Python processing)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│analysis_data.json│ (JSON output)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│     app.js       │ (JavaScript loads and visualizes)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   index.html     │ (User interface)
└──────────────────┘
```

### JSON Structure (`analysis_data.json`)

```json
{
  "texts": [
    {
      "filename": "pg1513.txt",
      "title": "Romeo and Juliet",
      "author": "William Shakespeare",
      "bag_of_words": { "word": frequency, ... },
      "top_200_words": { "word": frequency, ... },
      "sentiment": {
        "positive": 0.xxx,
        "negative": 0.xxx,
        "neutral": 0.xxx,
        "compound": 0.xxx
      },
      "style_metrics": {
        "total_words": int,
        "unique_words": int,
        "vocabulary_richness": float,
        "avg_word_length": float,
        "avg_sentence_length": float,
        "flesch_reading_ease": float,
        "flesch_kincaid_grade": float,
        "gunning_fog": float,
        "total_sentences": int
      }
    }
  ],
  "comparisons": {
    "Text1__vs__Text2": {
      "overlap_count": int,
      "unique_to_text1": int,
      "unique_to_text2": int,
      "overlap_words": ["word1", "word2", ...]
    }
  },
  "metadata": {
    "total_texts": int,
    "analysis_date": "YYYY-MM-DD",
    "stopwords_removed": true,
    "top_words_count": 200
  }
}
```

---

## Development Workflows

### Setting Up the Development Environment

```bash
# Clone repository
git clone https://github.com/Veruca94/claude-distant-reading-demo-attempt-2.git
cd claude-distant-reading-demo-attempt-2

# Install Python dependencies
pip install -r requirements.txt

# Run analysis (regenerates analysis_data.json)
python3 analyze_texts.py

# Start local web server
python3 -m http.server 8000
# Then open http://localhost:8000
```

### Adding New Texts

1. **Add text file** in Project Gutenberg format with pattern `pg*.txt`
2. **Ensure metadata** includes `Title:` and `Author:` in first 30 lines
3. **Re-run analysis:** `python3 analyze_texts.py`
4. **Refresh browser** to see new text in visualization

### Modifying Analysis Metrics

**To add new style metrics:**
1. Update `calculate_style_metrics()` in `analyze_texts.py` (line 106-139)
2. Add new metric to return dictionary
3. Re-run analysis script
4. Update `index.html` and `app.js` to display new metric

**To change sentiment analysis:**
- VADER is implemented in `sentiment_analysis()` (line 96-104)
- Could swap for TextBlob or custom lexicon
- Must maintain same JSON output structure

### Modifying Visualizations

**Word Cloud:**
- Configured in `renderWordCloud()` in `app.js`
- Uses top 200 words by default (configurable)
- WordCloud2.js options: color, size, shape

**Charts:**
- Chart.js used for sentiment and comparison visualizations
- Chart instances stored globally to enable proper cleanup
- Always destroy old chart before creating new one

---

## Code Conventions

### Python (`analyze_texts.py`)

**Style:**
- Uses docstrings for all functions
- Type hints not used (vanilla Python 3)
- Returns dictionaries for structured data
- Uses `pathlib.Path` for file operations

**Naming:**
- Snake_case for functions and variables
- Class names in PascalCase
- Private methods prefixed with underscore (none used here)

**Error Handling:**
- Minimal error handling (educational context)
- Relies on file existence
- Could be improved for production use

**Key Patterns:**
```python
# Always strip Gutenberg metadata before analysis
clean_text = self.preprocess_text(raw_text)

# Keep two word lists for different purposes
words_all = self.get_words(clean_text, remove_stopwords=False)
words_no_stop = self.get_words(clean_text, remove_stopwords=True)

# Round all metrics for readability
'vocabulary_richness': round(vocab_richness, 4)
```

### JavaScript (`app.js`)

**Style:**
- ES6+ features (async/await, arrow functions, const/let)
- No build process (vanilla JS, no transpilation)
- Global state pattern (not ideal but simple)
- JSDoc comments for major functions

**Naming:**
- camelCase for variables and functions
- UPPER_CASE for constants (though none defined)

**DOM Manipulation:**
- Direct DOM API (no frameworks)
- Event delegation where appropriate
- Clear element before populating

**Chart Management:**
```javascript
// Always destroy before recreating
if (sentimentChart) {
    sentimentChart.destroy();
}
sentimentChart = new Chart(ctx, config);
```

### CSS (`styles.css`)

**Organization:**
- Mobile-first responsive design
- CSS Grid for layout
- CSS custom properties (variables) for theming
- BEM-like naming for components

---

## Dependencies

### Python Dependencies (`requirements.txt`)

```
nltk==3.8.1        # Natural Language Toolkit
textstat==0.7.3    # Readability metrics
```

**NLTK Data Downloads Required:**
- `stopwords` - English stopwords list
- `punkt` - Sentence tokenizer
- `punkt_tab` - Word tokenizer
- `vader_lexicon` - Sentiment analysis lexicon

**Note:** Script auto-downloads NLTK data on first run (line 19-23)

### Frontend Dependencies (CDN-loaded)

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/wordcloud@1.2.2/src/wordcloud2.min.js"></script>
```

**No build process** - All dependencies loaded via CDN.

---

## Important Implementation Details

### Text Preprocessing Quirks

1. **Gutenberg Header/Footer Removal:**
   - Uses regex to find `*** START OF THIS PROJECT GUTENBERG EBOOK ***`
   - Handles variations in casing and spacing
   - Essential for accurate word counts

2. **Tokenization:**
   - Uses NLTK's `word_tokenize()` and `sent_tokenize()`
   - Filters to alphabetic words only (`word.isalpha()`)
   - Converts to lowercase for normalization

3. **Stopwords:**
   - Uses NLTK's English stopwords list
   - Removed for bag-of-words and word clouds
   - Kept for accurate total word counts

### Readability Metrics Interpretation

- **Flesch Reading Ease:** 0-100 scale, higher = easier (90+ = 5th grade, 60-70 = 8th-9th grade)
- **Flesch-Kincaid Grade:** U.S. school grade level
- **Gunning Fog Index:** Years of formal education required
- **Vocabulary Richness (TTR):** Unique words / Total words (0-1 scale)

### Comparison Analysis

**Vocabulary Overlap:**
- Uses Python set operations (`intersection`, difference)
- Stores top 100 overlapping words (truncated for JSON size)
- Comparison key format: `"Text1__vs__Text2"` (double underscore separator)

---

## Common Tasks for AI Assistants

### Task 1: Add a New Analysis Metric

**Example:** Add average syllables per word

1. **Modify `analyze_texts.py`:**
   ```python
   # In calculate_style_metrics() method
   avg_syllables = textstat.syllable_count(text) / total_words

   # Add to return dict
   'avg_syllables_per_word': round(avg_syllables, 2)
   ```

2. **Update `index.html`:**
   ```html
   <div class="metric-card">
       <div class="metric-label">Avg Syllables/Word</div>
       <div id="style-avg-syllables" class="metric-value"></div>
   </div>
   ```

3. **Update `app.js`:**
   ```javascript
   document.getElementById('style-avg-syllables').textContent =
       data.style_metrics.avg_syllables_per_word;
   ```

4. **Re-run analysis:** `python3 analyze_texts.py`

### Task 2: Change Visualization Colors

**Modify `app.js` chart configurations:**
```javascript
// Example: Change sentiment chart colors
backgroundColor: [
    'rgba(75, 192, 192, 0.5)',  // Positive - teal
    'rgba(255, 206, 86, 0.5)',  // Neutral - yellow
    'rgba(255, 99, 132, 0.5)'   // Negative - red
]
```

### Task 3: Add Export Functionality

**Add CSV export button:**
1. Create export function in `app.js`
2. Convert JSON data to CSV format
3. Use Blob API and download link
4. Add button to UI

### Task 4: Improve Error Handling

**Python:**
- Add try/except around file operations
- Validate text files have required metadata
- Handle missing NLTK data gracefully

**JavaScript:**
- Add loading states
- Handle missing analysis_data.json
- Validate chart data before rendering

---

## Git Workflow

### Branch Naming Convention

This project uses AI-assisted development branches:
- Pattern: `claude/<description>-<session-id>`
- Example: `claude/text-preprocessing-bow-01XaJwE9zxcdJ7wgNKTe9W7Q`

### Commit Message Style

Review recent commits for conventions:
```bash
git log --oneline -10
```

**Pattern observed:**
- Descriptive, action-oriented messages
- Focus on "what" and "why", not implementation details
- Example: "Add complete distant reading analysis system for Shakespeare plays"

### Pushing Changes

```bash
# Always use -u flag for new branches
git push -u origin claude/<branch-name>

# Branch names must start with 'claude/' and include session ID
# Network failures should retry with exponential backoff
```

---

## Testing and Quality Assurance

### Manual Testing Checklist

**Python Analysis:**
- [ ] Script runs without errors
- [ ] All 5 texts analyzed
- [ ] `analysis_data.json` generated (should be ~380KB)
- [ ] Console output shows summary statistics
- [ ] No NLTK download errors

**Web Interface:**
- [ ] Page loads without JavaScript errors
- [ ] All 5 texts appear in sidebar
- [ ] Individual view displays all metrics
- [ ] Word cloud renders properly
- [ ] Sentiment chart displays
- [ ] Comparison mode works with 2+ texts selected
- [ ] Responsive layout works on mobile

### Common Issues

**Issue:** "No text files found!"
- **Solution:** Ensure `.txt` files match pattern `pg*.txt`

**Issue:** Word cloud doesn't render
- **Solution:** Check `top_200_words` exists in JSON, verify canvas element

**Issue:** Chart.js errors
- **Solution:** Destroy old chart instance before creating new one

**Issue:** NLTK data download fails
- **Solution:** Manually run `nltk.download('all')` in Python REPL

---

## Performance Considerations

### Python Analysis

- **Runtime:** ~5-10 seconds for 5 texts on modern hardware
- **Memory:** Minimal (~50MB peak)
- **Bottleneck:** NLTK tokenization and VADER sentiment analysis

**Optimization opportunities:**
- Cache NLTK stopwords (currently reloaded)
- Parallelize text processing
- Use faster tokenizers (spaCy)

### Frontend Performance

- **Load Time:** Depends on `analysis_data.json` size (currently 388KB)
- **Rendering:** Word cloud can be slow with 200+ words
- **Memory:** Chart.js instances must be properly destroyed to prevent leaks

**Optimization opportunities:**
- Lazy load comparison data
- Virtualize large word lists
- Debounce comparison calculations

---

## Deployment

### GitHub Pages Setup

**Current deployment:** Hosted on GitHub Pages from main branch

**Files required for deployment:**
- `index.html`
- `app.js`
- `styles.css`
- `analysis_data.json`

**Files NOT needed for deployment:**
- `analyze_texts.py`
- `requirements.txt`
- `.txt` files (already processed)

### Regenerating Data

**Important:** If texts or analysis logic changes:
1. Run `python3 analyze_texts.py` locally
2. Commit updated `analysis_data.json`
3. Push to GitHub
4. GitHub Pages will auto-deploy

---

## AI Assistant Best Practices

### When Modifying Python Analysis

1. **Always read the file first** before making changes
2. **Preserve the JSON structure** - frontend depends on it
3. **Round all numeric outputs** for readability
4. **Test with actual text files** to verify output
5. **Update README.md** if analysis methodology changes

### When Modifying Frontend

1. **Check browser console** for errors
2. **Destroy chart instances** before recreating
3. **Maintain responsive design** - test mobile layout
4. **Preserve existing CSS classes** - they're used in JavaScript
5. **Don't break backward compatibility** with existing `analysis_data.json`

### When Adding Features

1. **Start with README.md** - does it fit the project scope?
2. **Check dependencies** - prefer vanilla solutions over new libraries
3. **Maintain simplicity** - this is an educational project
4. **Document in CLAUDE.md** - update this file!
5. **Test end-to-end** - Python → JSON → Web interface

### Code Style Guidelines

**DO:**
- Use descriptive variable names
- Add comments for complex logic
- Follow existing patterns
- Keep functions focused and small

**DON'T:**
- Add unnecessary dependencies
- Over-engineer solutions
- Break existing functionality
- Ignore error cases

---

## Key Files Reference

### Files to Read Before Modifying

| Task | Files to Read |
|------|---------------|
| Add analysis metric | `analyze_texts.py`, `app.js`, `index.html` |
| Change visualization | `app.js`, `styles.css` |
| Modify UI layout | `index.html`, `styles.css` |
| Fix data pipeline | `analyze_texts.py`, check JSON output |
| Update documentation | `README.md`, `CLAUDE.md` |

### Files to NEVER Modify

- `.txt` files - These are original Project Gutenberg texts
- `.git/` directory - Git internals
- CDN-loaded libraries - External dependencies

---

## Troubleshooting Guide

### Python Issues

**Import errors:**
```bash
pip install --upgrade -r requirements.txt
```

**NLTK data missing:**
```python
import nltk
nltk.download('all')
```

**JSON encoding errors:**
- Check for non-ASCII characters in text
- Verify `ensure_ascii=False` in `json.dump()`

### JavaScript Issues

**"analysisData is null":**
- Check `analysis_data.json` exists
- Verify JSON is valid (`python3 -m json.tool analysis_data.json`)
- Check browser console for fetch errors

**Chart not updating:**
- Destroy old chart instance first
- Verify canvas element exists in DOM
- Check Chart.js loaded (view console)

**Word cloud not rendering:**
- Ensure `top_200_words` object exists
- Check canvas dimensions (needs height/width)
- Verify WordCloud2.js loaded

---

## Future Enhancement Ideas

**Analysis:**
- Add named entity recognition (NER)
- Identify character speech patterns
- Part-of-speech tagging analysis
- Topic modeling (LDA)

**Visualization:**
- Network graphs of character co-occurrence
- Timeline of sentiment through play
- Interactive word frequency explorer
- Download/export functionality

**Technical:**
- Add unit tests for Python analysis
- Implement caching layer
- Progressive web app (PWA) features
- Backend API for dynamic analysis

---

## Glossary

**Distant Reading:** Computational analysis of large text corpora, contrasted with "close reading" of individual passages.

**Bag of Words (BoW):** Text representation that counts word frequencies, ignoring grammar and word order.

**VADER:** Valence Aware Dictionary and sEntiment Reasoner - lexicon and rule-based sentiment analysis tool.

**Type-Token Ratio (TTR):** Ratio of unique words to total words, measuring vocabulary diversity.

**Stopwords:** Common words (the, is, at) often removed in text analysis as they carry little semantic meaning.

**Flesch Reading Ease:** Readability formula based on sentence length and syllable count.

**Project Gutenberg:** Digital library of public domain books.

---

## Contact and Resources

**Repository:** https://github.com/Veruca94/claude-distant-reading-demo-attempt-2

**Key Documentation:**
- [NLTK Documentation](https://www.nltk.org/)
- [TextStat Documentation](https://pypi.org/project/textstat/)
- [Chart.js Documentation](https://www.chartjs.org/docs/)
- [Project Gutenberg](https://www.gutenberg.org/)

**For AI Assistants:**
- This file (`CLAUDE.md`) should be your primary reference
- Always read relevant source files before making changes
- Test changes end-to-end (Python → JSON → Web)
- Maintain backward compatibility with existing data structures

---

**Last Updated:** 2025-11-23
**Version:** 1.0
**Maintained for:** AI-assisted development with Claude
