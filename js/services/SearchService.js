import { DISPOSAL_LABELS } from '../config.js';

export class SearchService {
    fuzzySearch(query, text) {
        query = query.toLowerCase();
        text = text.toLowerCase();
        
        let queryIndex = 0;
        let textIndex = 0;
        
        while (queryIndex < query.length && textIndex < text.length) {
            if (query[queryIndex] === text[textIndex]) {
                queryIndex++;
            }
            textIndex++;
        }
        
        return queryIndex === query.length;
    }

    getMatchScore(query, text) {
        query = query.toLowerCase();
        text = text.toLowerCase();
        
        if (text === query) return 1000;
        
        if (text.includes(query)) {
            const position = text.indexOf(query);
            return 900 - position;
        }
        
        let score = 0;
        let queryIndex = 0;
        let lastMatchIndex = -1;
        
        for (let textIndex = 0; textIndex < text.length && queryIndex < query.length; textIndex++) {
            if (query[queryIndex] === text[textIndex]) {
                if (lastMatchIndex === textIndex - 1) {
                    score += 10;
                }
                if (textIndex === 0 || text[textIndex - 1] === ' ') {
                    score += 5;
                }
                score += 1;
                lastMatchIndex = textIndex;
                queryIndex++;
            }
        }
        
        return queryIndex === query.length ? score : 0;
    }

    searchLabels(query) {
        if (!query || query.length < 2) return [];
        
        return DISPOSAL_LABELS
            .map(label => ({
                label: label,
                score: this.getMatchScore(query, label.name)
            }))
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)
            .map(item => item.label);
    }

    filterItems(items, query) {
        if (!query) return items;
        
        return items
            .map(item => ({
                item: item,
                score: this.getMatchScore(query, item.name)
            }))
            .filter(scored => scored.score > 0)
            .sort((a, b) => b.score - a.score)
            .map(scored => scored.item);
    }

    filterByLabels(items, selectedLabels) {
        if (selectedLabels.length === 0) return items;
        
        return items.filter(item => {
            return selectedLabels.every(label => item.matchesLabel(label.id));
        });
    }
}