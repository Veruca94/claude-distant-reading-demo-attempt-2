/**
 * Shakespeare Distant Reading Analysis - Interactive Application
 */

// Global state
let analysisData = null;
let currentTextIndex = null;
let sentimentChart = null;
let comparisonSentimentChart = null;
let wordFrequencyChart = null;

// Initialize application
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load analysis data
        await loadAnalysisData();

        // Set up event listeners
        setupEventListeners();

        // Populate sidebar
        populateTextList();
        populateComparisonCheckboxes();

        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Error initializing application:', error);
        showError('Failed to load analysis data. Please ensure analysis_data.json exists.');
    }
});

/**
 * Load JSON data
 */
async function loadAnalysisData() {
    const response = await fetch('analysis_data.json');
    if (!response.ok) {
        throw new Error('Failed to load analysis data');
    }
    analysisData = await response.json();
    console.log('Loaded data for', analysisData.texts.length, 'texts');
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Mode switching
    document.getElementById('view-mode-btn').addEventListener('click', () => {
        switchMode('individual');
    });

    document.getElementById('compare-mode-btn').addEventListener('click', () => {
        switchMode('comparison');
    });

    // Comparison button
    document.getElementById('run-comparison-btn').addEventListener('click', () => {
        runComparison();
    });
}

/**
 * Populate text list in sidebar
 */
function populateTextList() {
    const textList = document.getElementById('text-list');
    textList.innerHTML = '';

    analysisData.texts.forEach((text, index) => {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.textContent = text.title;
        button.addEventListener('click', () => selectText(index));
        li.appendChild(button);
        textList.appendChild(li);
    });
}

/**
 * Populate comparison checkboxes
 */
function populateComparisonCheckboxes() {
    const container = document.getElementById('comparison-checkboxes');
    container.innerHTML = '';

    analysisData.texts.forEach((text, index) => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = index;
        checkbox.id = `compare-${index}`;

        const span = document.createElement('span');
        span.textContent = text.title;

        label.appendChild(checkbox);
        label.appendChild(span);
        container.appendChild(label);
    });
}

/**
 * Switch between individual and comparison modes
 */
function switchMode(mode) {
    // Update button states
    const viewBtn = document.getElementById('view-mode-btn');
    const compareBtn = document.getElementById('compare-mode-btn');

    if (mode === 'individual') {
        viewBtn.classList.add('active');
        compareBtn.classList.remove('active');
        document.getElementById('individual-view').classList.add('active');
        document.getElementById('comparison-view').classList.remove('active');
    } else {
        viewBtn.classList.remove('active');
        compareBtn.classList.add('active');
        document.getElementById('individual-view').classList.remove('active');
        document.getElementById('comparison-view').classList.add('active');
    }
}

/**
 * Select a text to view
 */
function selectText(index) {
    currentTextIndex = index;
    const text = analysisData.texts[index];

    // Update active state in sidebar
    const buttons = document.querySelectorAll('.text-list button');
    buttons.forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
    });

    // Update header
    document.getElementById('text-title').textContent = text.title;
    document.getElementById('text-author').textContent = `by ${text.author}`;

    // Hide placeholder
    document.querySelector('.text-content .placeholder')?.classList.add('hidden');

    // Show analysis sections
    document.getElementById('wordcloud-section').classList.remove('hidden');
    document.getElementById('sentiment-section').classList.remove('hidden');
    document.getElementById('style-section').classList.remove('hidden');

    // Render visualizations
    renderWordCloud(text);
    renderSentiment(text);
    renderStyleMetrics(text);

    // Switch to individual view if not already
    switchMode('individual');
}

/**
 * Render word cloud
 */
function renderWordCloud(text) {
    const container = document.getElementById('wordcloud-container');
    container.innerHTML = ''; // Clear previous

    // Convert top words to array format for wordcloud2
    const wordList = Object.entries(text.top_200_words).map(([word, freq]) => [word, freq]);

    // Sort by frequency descending
    wordList.sort((a, b) => b[1] - a[1]);

    // Create word cloud
    if (typeof WordCloud !== 'undefined') {
        WordCloud(container, {
            list: wordList,
            gridSize: 8,
            weightFactor: function(size) {
                return Math.pow(size, 0.5) * 12;
            },
            fontFamily: 'Times New Roman, serif',
            color: function() {
                const colors = ['#2c3e50', '#3498db', '#e74c3c', '#27ae60', '#9b59b6', '#f39c12'];
                return colors[Math.floor(Math.random() * colors.length)];
            },
            rotateRatio: 0.3,
            backgroundColor: '#f8f9fa',
            minSize: 12
        });
    } else {
        container.innerHTML = '<p style="padding: 2rem; text-align: center;">Word cloud library not loaded</p>';
    }
}

/**
 * Render sentiment analysis
 */
function renderSentiment(text) {
    const sentiment = text.sentiment;

    // Update metric cards
    document.getElementById('sentiment-compound').textContent = sentiment.compound.toFixed(3);
    document.getElementById('sentiment-positive').textContent = (sentiment.positive * 100).toFixed(1) + '%';
    document.getElementById('sentiment-neutral').textContent = (sentiment.neutral * 100).toFixed(1) + '%';
    document.getElementById('sentiment-negative').textContent = (sentiment.negative * 100).toFixed(1) + '%';

    // Color code compound score
    const compoundElement = document.getElementById('sentiment-compound');
    compoundElement.className = 'metric-value large';
    if (sentiment.compound > 0.05) {
        compoundElement.classList.add('sentiment-positive');
    } else if (sentiment.compound < -0.05) {
        compoundElement.classList.add('sentiment-negative');
    } else {
        compoundElement.classList.add('sentiment-neutral');
    }

    // Render chart
    const ctx = document.getElementById('sentiment-chart').getContext('2d');

    // Destroy previous chart if exists
    if (sentimentChart) {
        sentimentChart.destroy();
    }

    sentimentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Positive', 'Neutral', 'Negative'],
            datasets: [{
                label: 'Sentiment Distribution',
                data: [sentiment.positive, sentiment.neutral, sentiment.negative],
                backgroundColor: [
                    'rgba(39, 174, 96, 0.7)',
                    'rgba(149, 165, 166, 0.7)',
                    'rgba(231, 76, 60, 0.7)'
                ],
                borderColor: [
                    'rgba(39, 174, 96, 1)',
                    'rgba(149, 165, 166, 1)',
                    'rgba(231, 76, 60, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Sentiment Distribution',
                    font: {
                        size: 16
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1,
                    ticks: {
                        callback: function(value) {
                            return (value * 100).toFixed(0) + '%';
                        }
                    }
                }
            }
        }
    });
}

/**
 * Render style metrics
 */
function renderStyleMetrics(text) {
    const metrics = text.style_metrics;

    // Basic metrics
    document.getElementById('style-total-words').textContent = metrics.total_words.toLocaleString();
    document.getElementById('style-unique-words').textContent = metrics.unique_words.toLocaleString();
    document.getElementById('style-vocab-richness').textContent = metrics.vocabulary_richness.toFixed(4);
    document.getElementById('style-avg-word-length').textContent = metrics.avg_word_length.toFixed(2);
    document.getElementById('style-avg-sentence-length').textContent = metrics.avg_sentence_length.toFixed(2);
    document.getElementById('style-total-sentences').textContent = metrics.total_sentences.toLocaleString();

    // Readability scores
    document.getElementById('style-flesch-ease').textContent = metrics.flesch_reading_ease.toFixed(2);
    document.getElementById('style-flesch-grade').textContent = metrics.flesch_kincaid_grade.toFixed(2);
    document.getElementById('style-gunning-fog').textContent = metrics.gunning_fog.toFixed(2);
}

/**
 * Run comparison analysis
 */
function runComparison() {
    // Get selected texts
    const checkboxes = document.querySelectorAll('#comparison-checkboxes input[type="checkbox"]:checked');
    const selectedIndices = Array.from(checkboxes).map(cb => parseInt(cb.value));

    if (selectedIndices.length < 2) {
        alert('Please select at least 2 texts to compare');
        return;
    }

    const selectedTexts = selectedIndices.map(i => analysisData.texts[i]);

    // Show results section
    document.getElementById('comparison-results').classList.remove('hidden');

    // Render comparisons
    renderSentimentComparison(selectedTexts);
    renderStyleComparison(selectedTexts);
    renderVocabularyOverlap(selectedTexts, selectedIndices);
    renderWordFrequencyComparison(selectedTexts);

    // Scroll to results
    document.getElementById('comparison-results').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Render sentiment comparison chart
 */
function renderSentimentComparison(texts) {
    const ctx = document.getElementById('comparison-sentiment-chart').getContext('2d');

    // Destroy previous chart if exists
    if (comparisonSentimentChart) {
        comparisonSentimentChart.destroy();
    }

    const labels = texts.map(t => t.title);
    const positiveData = texts.map(t => t.sentiment.positive);
    const neutralData = texts.map(t => t.sentiment.neutral);
    const negativeData = texts.map(t => t.sentiment.negative);
    const compoundData = texts.map(t => t.sentiment.compound);

    comparisonSentimentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Positive',
                    data: positiveData,
                    backgroundColor: 'rgba(39, 174, 96, 0.7)',
                    borderColor: 'rgba(39, 174, 96, 1)',
                    borderWidth: 2
                },
                {
                    label: 'Neutral',
                    data: neutralData,
                    backgroundColor: 'rgba(149, 165, 166, 0.7)',
                    borderColor: 'rgba(149, 165, 166, 1)',
                    borderWidth: 2
                },
                {
                    label: 'Negative',
                    data: negativeData,
                    backgroundColor: 'rgba(231, 76, 60, 0.7)',
                    borderColor: 'rgba(231, 76, 60, 1)',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'Sentiment Scores by Text',
                    font: {
                        size: 18
                    }
                }
            },
            scales: {
                x: {
                    stacked: false
                },
                y: {
                    beginAtZero: true,
                    max: 1,
                    ticks: {
                        callback: function(value) {
                            return (value * 100).toFixed(0) + '%';
                        }
                    }
                }
            }
        }
    });
}

/**
 * Render style comparison table
 */
function renderStyleComparison(texts) {
    const table = document.getElementById('style-comparison-table');
    table.innerHTML = '';

    // Create header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const metricHeader = document.createElement('th');
    metricHeader.textContent = 'Metric';
    headerRow.appendChild(metricHeader);

    texts.forEach(text => {
        const th = document.createElement('th');
        th.textContent = text.title;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create body
    const tbody = document.createElement('tbody');

    const metrics = [
        { key: 'total_words', label: 'Total Words', format: v => v.toLocaleString() },
        { key: 'unique_words', label: 'Unique Words', format: v => v.toLocaleString() },
        { key: 'vocabulary_richness', label: 'Vocabulary Richness', format: v => v.toFixed(4) },
        { key: 'avg_word_length', label: 'Avg Word Length', format: v => v.toFixed(2) },
        { key: 'avg_sentence_length', label: 'Avg Sentence Length', format: v => v.toFixed(2) },
        { key: 'total_sentences', label: 'Total Sentences', format: v => v.toLocaleString() },
        { key: 'flesch_reading_ease', label: 'Flesch Reading Ease', format: v => v.toFixed(2) },
        { key: 'flesch_kincaid_grade', label: 'Flesch-Kincaid Grade', format: v => v.toFixed(2) },
        { key: 'gunning_fog', label: 'Gunning Fog Index', format: v => v.toFixed(2) }
    ];

    metrics.forEach(metric => {
        const row = document.createElement('tr');
        const labelCell = document.createElement('td');
        labelCell.className = 'metric-name';
        labelCell.textContent = metric.label;
        row.appendChild(labelCell);

        texts.forEach(text => {
            const valueCell = document.createElement('td');
            const value = text.style_metrics[metric.key];
            valueCell.textContent = metric.format(value);
            row.appendChild(valueCell);
        });

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
}

/**
 * Render vocabulary overlap analysis
 */
function renderVocabularyOverlap(texts, indices) {
    const container = document.getElementById('vocab-overlap-container');
    container.innerHTML = '';

    // For pairwise comparison
    if (texts.length === 2) {
        const text1 = texts[0];
        const text2 = texts[1];

        // Find comparison data
        const compKey = findComparisonKey(text1.title, text2.title);
        const comparison = analysisData.comparisons[compKey];

        if (comparison) {
            const card = createOverlapCard(comparison);
            container.appendChild(card);
        }
    } else {
        // For multiple texts, show all pairwise comparisons
        for (let i = 0; i < texts.length; i++) {
            for (let j = i + 1; j < texts.length; j++) {
                const text1 = texts[i];
                const text2 = texts[j];

                const compKey = findComparisonKey(text1.title, text2.title);
                const comparison = analysisData.comparisons[compKey];

                if (comparison) {
                    const card = createOverlapCard(comparison);
                    container.appendChild(card);
                }
            }
        }
    }
}

/**
 * Find comparison key in data
 */
function findComparisonKey(title1, title2) {
    const key1 = `${title1}__vs__${title2}`;
    const key2 = `${title2}__vs__${title1}`;

    if (analysisData.comparisons[key1]) {
        return key1;
    } else if (analysisData.comparisons[key2]) {
        return key2;
    }
    return null;
}

/**
 * Create overlap card element
 */
function createOverlapCard(comparison) {
    const card = document.createElement('div');
    card.className = 'overlap-card';

    const title = document.createElement('h4');
    title.textContent = `${comparison.text1} vs ${comparison.text2}`;
    card.appendChild(title);

    const stats = document.createElement('div');
    stats.className = 'overlap-stats';

    const overlapStat = createOverlapStat('Shared Words', comparison.overlap_count);
    const unique1Stat = createOverlapStat(`Unique to ${comparison.text1}`, comparison.unique_to_text1);
    const unique2Stat = createOverlapStat(`Unique to ${comparison.text2}`, comparison.unique_to_text2);

    stats.appendChild(overlapStat);
    stats.appendChild(unique1Stat);
    stats.appendChild(unique2Stat);

    card.appendChild(stats);

    return card;
}

/**
 * Create overlap stat element
 */
function createOverlapStat(label, value) {
    const stat = document.createElement('div');
    stat.className = 'overlap-stat';

    const labelSpan = document.createElement('span');
    labelSpan.className = 'overlap-stat-label';
    labelSpan.textContent = label;

    const valueSpan = document.createElement('span');
    valueSpan.className = 'overlap-stat-value';
    valueSpan.textContent = value.toLocaleString();

    stat.appendChild(labelSpan);
    stat.appendChild(valueSpan);

    return stat;
}

/**
 * Render word frequency comparison
 */
function renderWordFrequencyComparison(texts) {
    const ctx = document.getElementById('word-frequency-chart').getContext('2d');

    // Destroy previous chart if exists
    if (wordFrequencyChart) {
        wordFrequencyChart.destroy();
    }

    // Get top 20 words from each text
    const allWords = new Set();
    texts.forEach(text => {
        const topWords = Object.keys(text.top_200_words).slice(0, 20);
        topWords.forEach(word => allWords.add(word));
    });

    // Get union of top words (limit to reasonable number)
    const wordList = Array.from(allWords).slice(0, 30);

    // Create datasets for each text
    const datasets = texts.map((text, i) => {
        const colors = [
            '#2c3e50', '#3498db', '#e74c3c', '#27ae60', '#9b59b6'
        ];

        return {
            label: text.title,
            data: wordList.map(word => text.top_200_words[word] || 0),
            backgroundColor: colors[i % colors.length] + 'B0',
            borderColor: colors[i % colors.length],
            borderWidth: 2
        };
    });

    wordFrequencyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: wordList,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'Word Frequency Comparison (Top Words)',
                    font: {
                        size: 18
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        maxRotation: 90,
                        minRotation: 45
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Frequency'
                    }
                }
            }
        }
    });
}

/**
 * Show error message
 */
function showError(message) {
    const content = document.querySelector('.content');
    content.innerHTML = `
        <div style="text-align: center; padding: 3rem; color: #e74c3c;">
            <h2>Error</h2>
            <p>${message}</p>
        </div>
    `;
}
