# Shakespeare Plays: Distant Reading Analysis

An interactive web-based distant reading analysis of five Shakespeare plays using computational text analysis techniques. This project demonstrates text preprocessing, sentiment analysis, stylometric analysis, and interactive data visualization.

## 📚 Texts Analyzed

- **Romeo and Juliet** (pg1513.txt)
- **A Midsummer Night's Dream** (pg1514.txt)
- **Much Ado about Nothing** (pg1519.txt)
- **Hamlet** (pg1524.txt)
- **Macbeth** (pg1533.txt)

All texts sourced from [Project Gutenberg](https://www.gutenberg.org/).

## 🎯 Features

### Text Analysis
- **Preprocessing**: Automatic removal of Project Gutenberg headers/footers
- **Bag of Words**: Frequency analysis with stopword removal
- **Sentiment Analysis**: VADER sentiment scoring (positive, negative, neutral, compound)
- **Style Metrics**:
  - Vocabulary richness (Type-Token Ratio)
  - Average word and sentence length
  - Readability scores (Flesch Reading Ease, Flesch-Kincaid Grade, Gunning Fog Index)
  - Word and sentence counts

### Interactive Visualizations
- **Word Clouds**: Top 200 words per text
- **Sentiment Charts**: Visual sentiment distribution
- **Comparison Mode**:
  - Side-by-side style metrics
  - Sentiment comparison across multiple texts
  - Vocabulary overlap analysis
  - Word frequency comparisons

## 🛠️ Technologies Used

### Analysis
- **Python 3**: Core analysis language
- **NLTK**: Natural Language Toolkit for tokenization, stopwords, and VADER sentiment analysis
- **TextStat**: Readability and style metrics calculation

### Visualization
- **HTML5/CSS3**: Responsive web interface
- **JavaScript (ES6+)**: Interactive functionality
- **Chart.js**: Sentiment and comparison charts
- **WordCloud2.js**: Word cloud generation

## 📦 Installation & Setup

### Prerequisites
- Python 3.7 or higher
- pip (Python package manager)

### Step 1: Clone the Repository
```bash
git clone https://github.com/Veruca94/claude-distant-reading-demo-attempt-2.git
cd claude-distant-reading-demo-attempt-2
```

### Step 2: Install Python Dependencies
```bash
pip install -r requirements.txt
```

### Step 3: Run the Analysis
```bash
python3 analyze_texts.py
```

This will:
- Process all `.txt` files in the directory
- Generate `analysis_data.json` with all computed metrics
- Display a summary of the analysis

### Step 4: View the Website Locally
```bash
python3 -m http.server 8000
```

Then open your browser to: `http://localhost:8000`

## 🚀 Deploying to GitHub Pages

### Option 1: Deploy from Main Branch
1. Push all files to your GitHub repository
2. Go to repository **Settings** → **Pages**
3. Under **Source**, select the main branch
4. Click **Save**
5. Your site will be available at: `https://[username].github.io/[repository-name]/`

### Option 2: Deploy from `gh-pages` Branch
1. Create a new `gh-pages` branch:
```bash
git checkout -b gh-pages
git push origin gh-pages
```
2. Go to repository **Settings** → **Pages**
3. Select `gh-pages` branch as source
4. Your site will be deployed automatically

## 📊 Analysis Output

The `analysis_data.json` file contains:

```json
{
  "texts": [
    {
      "filename": "pg1513.txt",
      "title": "Romeo and Juliet",
      "author": "William Shakespeare",
      "bag_of_words": { "word": frequency, ... },
      "top_200_words": { "top_word": frequency, ... },
      "sentiment": {
        "positive": 0.xxx,
        "negative": 0.xxx,
        "neutral": 0.xxx,
        "compound": 0.xxx
      },
      "style_metrics": {
        "total_words": 26364,
        "unique_words": 3475,
        "vocabulary_richness": 0.1318,
        "avg_word_length": 4.21,
        "avg_sentence_length": 12.34,
        "flesch_reading_ease": 85.67,
        "flesch_kincaid_grade": 5.43,
        "gunning_fog": 7.89,
        "total_sentences": 2137
      }
    },
    ...
  ],
  "comparisons": {
    "Text1__vs__Text2": {
      "overlap_count": 1234,
      "unique_to_text1": 567,
      "unique_to_text2": 890,
      "overlap_words": ["word1", "word2", ...]
    },
    ...
  },
  "metadata": { ... }
}
```

## 🎨 Using the Website

### Individual View
1. Click on any text in the sidebar
2. View the word cloud of top 200 words
3. Explore sentiment analysis scores
4. Review comprehensive style metrics

### Comparison Mode
1. Click **Compare Texts** button
2. Select 2 or more texts using checkboxes
3. Click **Compare Selected Texts**
4. View:
   - Sentiment comparison chart
   - Style metrics table
   - Vocabulary overlap statistics
   - Word frequency comparisons

## 📁 Project Structure

```
.
├── analyze_texts.py          # Python analysis script
├── requirements.txt          # Python dependencies
├── index.html               # Main webpage
├── styles.css              # Stylesheet
├── app.js                  # JavaScript functionality
├── analysis_data.json      # Generated analysis data
├── pg1513.txt              # Romeo and Juliet
├── pg1514.txt              # A Midsummer Night's Dream
├── pg1519.txt              # Much Ado about Nothing
├── pg1524.txt              # Hamlet
├── pg1533.txt              # Macbeth
└── README.md               # This file
```

## 🔍 Methodology

### Text Preprocessing
1. Load raw text from Project Gutenberg files
2. Strip metadata (headers and footers)
3. Tokenize into words and sentences
4. Remove stopwords (using NLTK English stopwords)
5. Normalize to lowercase

### Sentiment Analysis
- **VADER (Valence Aware Dictionary and sEntiment Reasoner)**
- Scores range from -1 (most negative) to +1 (most positive)
- Compound score is the normalized aggregate

### Readability Metrics
- **Flesch Reading Ease**: 0-100 scale (higher = easier)
- **Flesch-Kincaid Grade**: U.S. grade level
- **Gunning Fog Index**: Years of formal education needed

## 🤝 Contributing

This is a demonstration project. Feel free to fork and adapt for your own text analysis needs!

## 📄 License

The source code is provided as-is for educational purposes. Shakespeare texts are in the public domain via Project Gutenberg.

## 🙏 Acknowledgments

- **Project Gutenberg** for providing public domain texts
- **NLTK** for natural language processing tools
- **TextStat** for readability metrics
- **Chart.js** and **WordCloud2.js** for visualizations

## 📧 Contact

For questions or suggestions about this project, please open an issue on GitHub.

---

**Built with computational literary analysis techniques for distant reading research.**
