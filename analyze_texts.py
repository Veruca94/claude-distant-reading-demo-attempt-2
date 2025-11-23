#!/usr/bin/env python3
"""
Distant Reading Analysis Script for Shakespeare Plays
Performs text preprocessing, sentiment analysis, and style comparison
Outputs comprehensive JSON data for web visualization
"""

import re
import json
from collections import Counter
from pathlib import Path
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.sentiment import SentimentIntensityAnalyzer
import textstat

# Download required NLTK data
print("Downloading required NLTK data...")
nltk.download('stopwords', quiet=True)
nltk.download('punkt', quiet=True)
nltk.download('vader_lexicon', quiet=True)
nltk.download('punkt_tab', quiet=True)

class TextAnalyzer:
    """Analyzes literary texts for distant reading"""

    def __init__(self):
        self.stop_words = set(stopwords.words('english'))
        self.sia = SentimentIntensityAnalyzer()

    def strip_gutenberg_metadata(self, text):
        """Remove Project Gutenberg header and footer"""
        # Find start marker
        start_patterns = [
            r'\*\*\*\s*START OF TH(IS|E) PROJECT GUTENBERG EBOOK.*?\*\*\*',
            r'\*\*\* START OF THIS PROJECT GUTENBERG EBOOK.*?\*\*\*'
        ]

        for pattern in start_patterns:
            match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
            if match:
                text = text[match.end():]
                break

        # Find end marker
        end_patterns = [
            r'\*\*\*\s*END OF TH(IS|E) PROJECT GUTENBERG EBOOK.*?\*\*\*',
            r'\*\*\* END OF THIS PROJECT GUTENBERG EBOOK.*?\*\*\*'
        ]

        for pattern in end_patterns:
            match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
            if match:
                text = text[:match.start()]
                break

        return text.strip()

    def preprocess_text(self, text):
        """Clean and tokenize text while preserving stage directions"""
        # Strip Gutenberg metadata
        text = self.strip_gutenberg_metadata(text)

        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)

        return text

    def get_words(self, text, remove_stopwords=False):
        """Tokenize text into words"""
        # Tokenize
        words = word_tokenize(text.lower())

        # Keep only alphabetic words
        words = [word for word in words if word.isalpha()]

        # Remove stopwords if requested
        if remove_stopwords:
            words = [word for word in words if word not in self.stop_words]

        return words

    def get_sentences(self, text):
        """Tokenize text into sentences"""
        return sent_tokenize(text)

    def build_bag_of_words(self, words):
        """Create word frequency dictionary"""
        return dict(Counter(words))

    def get_top_words(self, bow, n=200):
        """Get top N most frequent words"""
        return dict(Counter(bow).most_common(n))

    def sentiment_analysis(self, text):
        """Perform VADER sentiment analysis"""
        scores = self.sia.polarity_scores(text)
        return {
            'positive': scores['pos'],
            'negative': scores['neg'],
            'neutral': scores['neu'],
            'compound': scores['compound']
        }

    def calculate_style_metrics(self, text, words, words_no_stop):
        """Calculate comprehensive style metrics"""
        sentences = self.get_sentences(text)

        # Basic counts
        total_words = len(words)
        total_sentences = len(sentences)
        unique_words = len(set(words))

        # Vocabulary richness (Type-Token Ratio)
        vocab_richness = unique_words / total_words if total_words > 0 else 0

        # Average word length
        avg_word_length = sum(len(word) for word in words) / total_words if total_words > 0 else 0

        # Average sentence length
        avg_sentence_length = total_words / total_sentences if total_sentences > 0 else 0

        # Readability scores using textstat
        flesch_reading_ease = textstat.flesch_reading_ease(text)
        flesch_kincaid_grade = textstat.flesch_kincaid_grade(text)
        gunning_fog = textstat.gunning_fog(text)

        return {
            'total_words': total_words,
            'total_sentences': total_sentences,
            'unique_words': unique_words,
            'vocabulary_richness': round(vocab_richness, 4),
            'avg_word_length': round(avg_word_length, 2),
            'avg_sentence_length': round(avg_sentence_length, 2),
            'flesch_reading_ease': round(flesch_reading_ease, 2),
            'flesch_kincaid_grade': round(flesch_kincaid_grade, 2),
            'gunning_fog': round(gunning_fog, 2)
        }

    def analyze_text(self, filepath):
        """Perform complete analysis on a single text"""
        print(f"\nAnalyzing {filepath.name}...")

        # Read file
        with open(filepath, 'r', encoding='utf-8') as f:
            raw_text = f.read()

        # Preprocess
        clean_text = self.preprocess_text(raw_text)

        # Extract title and author from first lines
        lines = raw_text.split('\n')
        title = "Unknown"
        author = "Unknown"

        for line in lines[:30]:
            if line.startswith('Title:'):
                title = line.replace('Title:', '').strip()
            elif line.startswith('Author:'):
                author = line.replace('Author:', '').strip()

        # Get words (with and without stopwords)
        words_all = self.get_words(clean_text, remove_stopwords=False)
        words_no_stop = self.get_words(clean_text, remove_stopwords=True)

        # Build bag of words (without stopwords for analysis)
        bow = self.build_bag_of_words(words_no_stop)
        top_words = self.get_top_words(bow, n=200)

        # Sentiment analysis
        sentiment = self.sentiment_analysis(clean_text)

        # Style metrics
        style_metrics = self.calculate_style_metrics(clean_text, words_all, words_no_stop)

        print(f"  - Total words: {style_metrics['total_words']}")
        print(f"  - Unique words: {style_metrics['unique_words']}")
        print(f"  - Vocabulary richness: {style_metrics['vocabulary_richness']}")
        print(f"  - Sentiment (compound): {sentiment['compound']}")

        return {
            'filename': filepath.name,
            'title': title,
            'author': author,
            'bag_of_words': bow,
            'top_200_words': top_words,
            'sentiment': sentiment,
            'style_metrics': style_metrics,
            'all_words': words_no_stop  # Keep for comparison analysis
        }

    def compare_texts(self, analyses):
        """Generate comparison data between all texts"""
        print("\nGenerating comparison data...")

        comparisons = {}

        # Calculate overlaps and unique words
        for i, analysis1 in enumerate(analyses):
            for j, analysis2 in enumerate(analyses):
                if i < j:  # Only compare each pair once
                    text1_name = analysis1['title']
                    text2_name = analysis2['title']

                    words1 = set(analysis1['all_words'])
                    words2 = set(analysis2['all_words'])

                    overlap = words1.intersection(words2)
                    unique_to_1 = words1 - words2
                    unique_to_2 = words2 - words1

                    key = f"{text1_name}__vs__{text2_name}"
                    comparisons[key] = {
                        'text1': text1_name,
                        'text2': text2_name,
                        'overlap_count': len(overlap),
                        'unique_to_text1': len(unique_to_1),
                        'unique_to_text2': len(unique_to_2),
                        'overlap_words': sorted(list(overlap))[:100],  # Top 100 for display
                    }

        return comparisons

def main():
    """Main analysis pipeline"""
    print("=" * 60)
    print("Shakespeare Plays Distant Reading Analysis")
    print("=" * 60)

    # Initialize analyzer
    analyzer = TextAnalyzer()

    # Find all text files
    text_files = sorted(Path('.').glob('pg*.txt'))

    if not text_files:
        print("Error: No text files found!")
        return

    print(f"\nFound {len(text_files)} text files to analyze")

    # Analyze each text
    analyses = []
    for filepath in text_files:
        analysis = analyzer.analyze_text(filepath)
        # Remove 'all_words' before adding to final output (used only for comparison)
        analyses.append(analysis)

    # Generate comparison data
    comparisons = analyzer.compare_texts(analyses)

    # Remove 'all_words' from final output (it was only needed for comparison)
    for analysis in analyses:
        del analysis['all_words']

    # Prepare final output
    output_data = {
        'texts': analyses,
        'comparisons': comparisons,
        'metadata': {
            'total_texts': len(analyses),
            'analysis_date': '2025-11-23',
            'stopwords_removed': True,
            'top_words_count': 200
        }
    }

    # Write JSON output
    output_file = 'analysis_data.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)

    print(f"\n{'=' * 60}")
    print(f"Analysis complete! Data saved to {output_file}")
    print(f"{'=' * 60}")
    print(f"\nSummary:")
    print(f"  - Texts analyzed: {len(analyses)}")
    print(f"  - Comparisons generated: {len(comparisons)}")
    print(f"  - Output file size: {Path(output_file).stat().st_size / 1024:.2f} KB")

if __name__ == '__main__':
    main()
