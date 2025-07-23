// Configuration
const DISPOSAL_LABELS = [
    { id: 'gelber_sack', name: 'Gelber Sack', type: 'household' },
    { id: 'restmuell', name: 'Restmüll', type: 'household' },
    { id: 'bio', name: 'Bio', type: 'household' },
    { id: 'papier', name: 'Papier', type: 'household' },
    { id: 'glas_container', name: 'Glas-Container', type: 'collection' },
    { id: 'textil_container', name: 'Textil-Container', type: 'collection' },
    { id: 'papier_karton_wsz', name: 'Papier/Karton WSZ', type: 'collection' },
    { id: 'tkb', name: 'TKB', type: 'collection' },
    { id: 'wsz_breitenau', name: 'WSZ Breitenau', type: 'wsz' },
    { id: 'wsz_schloeglmuehl', name: 'WSZ Schlöglmühl', type: 'wsz' },
    { id: 'wsz_grottendorf', name: 'WSZ Grottendorf', type: 'wsz' },
    { id: 'asz_gruene_tonne', name: 'ASZ Grüne Tonne', type: 'paid' }
];

const COLOR_SCHEMES = {
    'Gelber Sack': 'bg-yellow-400 dark:bg-yellow-600 text-gray-900 dark:text-gray-100',
    'Restmüll': 'bg-gray-700 dark:bg-gray-600 text-white',
    'Bio': 'bg-amber-700 dark:bg-amber-800 text-white',
    'Papier': 'bg-red-900 dark:bg-red-800 text-white',
    'Glas-Container': 'bg-green-600 dark:bg-green-700 text-white',
    'Textil-Container': 'bg-green-600 dark:bg-green-700 text-white',
    'Papier/Karton WSZ': 'bg-green-600 dark:bg-green-700 text-white',
    'TKB': 'bg-green-600 dark:bg-green-700 text-white',
    'WSZ Breitenau': 'bg-green-600 dark:bg-green-700 text-white',
    'WSZ Schlöglmühl': 'bg-green-600 dark:bg-green-700 text-white',
    'WSZ Grottendorf': 'bg-green-600 dark:bg-green-700 text-white',
    'ASZ Grüne Tonne': 'bg-red-600 dark:bg-red-700 text-white'
};

const MARKS = {
    CHECK: '✓',
    CROSS: '✗'
};

const DOM_IDS = {
    SEARCH_INPUT: 'searchInput',
    CLEAR_BUTTON: 'clearButton',
    MOBILE_CARDS: 'mobileCards',
    TABLE_BODY: 'tableBody',
    RESULT_COUNT: 'resultCount',
    SELECTED_LABELS: 'selectedLabels',
    AUTOCOMPLETE_DROPDOWN: 'autocompleteDropdown',
    TABLE_SCROLL_CONTAINER: 'tableScrollContainer',
    WSZ_MODAL: 'wszModal'
};

// Models
class DisposalLabel {
    constructor(id, name, type) {
        this.id = id;
        this.name = name;
        this.type = type;
    }

    static fromObject(obj) {
        return new DisposalLabel(obj.id, obj.name, obj.type);
    }
}

class WasteItem {
    constructor(data) {
        this.name = data.name;
        this.specialWaste = data.special_waste || false;
        this.disposalLocations = {
            household: data.disposal_locations?.household || {},
            collectionPoints: data.disposal_locations?.collection_points || {},
            recyclingCenters: data.disposal_locations?.recycling_centers || {},
            paidCollection: data.disposal_locations?.paid_collection || {}
        };
    }

    getActiveDisposalOptions() {
        const options = [];
        
        // Household
        if (this.disposalLocations.household.gelber_sack) options.push('Gelber Sack');
        if (this.disposalLocations.household.restmuell) options.push('Restmüll');
        if (this.disposalLocations.household.bio) options.push('Bio');
        if (this.disposalLocations.household.papier) options.push('Papier');
        
        // Collection points
        if (this.disposalLocations.collectionPoints.glas) options.push('Glas-Container');
        if (this.disposalLocations.collectionPoints.textil) options.push('Textil-Container');
        if (this.disposalLocations.collectionPoints.papier_karton_wsz) options.push('Papier/Karton WSZ');
        if (this.disposalLocations.collectionPoints.tkb) options.push('TKB');
        
        // Recycling centers
        const wertstoffzentren = [];
        if (this.disposalLocations.recyclingCenters.wsz_breitenau) wertstoffzentren.push('Breitenau');
        if (this.disposalLocations.recyclingCenters.wsz_schloeglmuehl) wertstoffzentren.push('Schlöglmühl');
        if (this.disposalLocations.recyclingCenters.wsz_grottendorf) wertstoffzentren.push('Grottendorf');
        
        if (wertstoffzentren.length > 0) {
            options.push({
                type: 'wsz',
                label: `WSZ: ${wertstoffzentren.join(', ')}`,
                centers: wertstoffzentren
            });
        }
        
        return options;
    }

    hasPaidCollection() {
        return this.disposalLocations.paidCollection.asz_gruene_tonne || false;
    }

    matchesLabel(labelId) {
        const mappings = {
            'gelber_sack': () => this.disposalLocations.household.gelber_sack,
            'restmuell': () => this.disposalLocations.household.restmuell,
            'bio': () => this.disposalLocations.household.bio,
            'papier': () => this.disposalLocations.household.papier,
            'glas_container': () => this.disposalLocations.collectionPoints.glas,
            'textil_container': () => this.disposalLocations.collectionPoints.textil,
            'papier_karton_wsz': () => this.disposalLocations.collectionPoints.papier_karton_wsz,
            'tkb': () => this.disposalLocations.collectionPoints.tkb,
            'wsz_breitenau': () => this.disposalLocations.recyclingCenters.wsz_breitenau,
            'wsz_schloeglmuehl': () => this.disposalLocations.recyclingCenters.wsz_schloeglmuehl,
            'wsz_grottendorf': () => this.disposalLocations.recyclingCenters.wsz_grottendorf,
            'asz_gruene_tonne': () => this.disposalLocations.paidCollection.asz_gruene_tonne
        };

        return mappings[labelId] ? mappings[labelId]() : false;
    }
}

// Services
class DataService {
    constructor() {
        this.allItems = [];
    }

    async loadData() {
        try {
            const response = await fetch('waste_disposal_data.json');
            const data = await response.json();
            this.allItems = data.waste_items.map(item => new WasteItem(item));
            return this.allItems;
        } catch (error) {
            console.error('Error loading data:', error);
            throw new Error('Failed to load waste disposal data');
        }
    }

    getAllItems() {
        return this.allItems;
    }

    getItemCount() {
        return this.allItems.length;
    }
}

class SearchService {
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

// Utilities
class ColorManager {
    static getColorClass(optionName) {
        if (COLOR_SCHEMES[optionName]) {
            return COLOR_SCHEMES[optionName];
        }
        
        if (optionName.startsWith('WSZ:')) {
            return COLOR_SCHEMES['WSZ Breitenau'];
        }
        
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
    }
}

class TextUtils {
    static highlightMatch(text, query) {
        if (!query) return text;
        
        const lowerText = text.toLowerCase();
        const lowerQuery = query.toLowerCase();
        let result = '';
        let queryIndex = 0;
        
        for (let i = 0; i < text.length; i++) {
            if (queryIndex < lowerQuery.length && lowerText[i] === lowerQuery[queryIndex]) {
                result += `<span class="bg-yellow-200 dark:bg-gray-700 dark:text-yellow-400 font-semibold">${text[i]}</span>`;
                queryIndex++;
            } else {
                result += text[i];
            }
        }
        
        return result;
    }
}

// Components
class Renderer {
    constructor() {
        this.mobileCards = document.getElementById(DOM_IDS.MOBILE_CARDS);
        this.tableBody = document.getElementById(DOM_IDS.TABLE_BODY);
        this.resultCount = document.getElementById(DOM_IDS.RESULT_COUNT);
    }

    render(items, searchQuery = '', totalItems) {
        this.renderTable(items, searchQuery);
        this.renderMobileCards(items, searchQuery);
        this.updateResultCount(items.length, totalItems);
    }

    renderMobileCards(items, searchQuery) {
        this.mobileCards.innerHTML = '';
        items.forEach(item => {
            const card = this.createMobileCard(item, searchQuery);
            this.mobileCards.appendChild(card);
        });
    }

    createMobileCard(item, searchQuery) {
        const card = document.createElement('div');
        card.className = 'bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900 p-4 space-y-3';
        
        const activeOptions = item.getActiveDisposalOptions();
        
        card.innerHTML = `
            <div class="flex justify-between items-start">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    ${TextUtils.highlightMatch(item.name, searchQuery)}
                </h3>
                ${item.specialWaste ? 
                    '<span class="text-red-600 font-bold text-sm">⚠️ Sonderabfall</span>' : ''}
            </div>
            
            ${activeOptions.length > 0 ? this.renderDisposalOptions(activeOptions) : ''}
            ${item.hasPaidCollection() ? this.renderPaidCollection() : ''}
        `;
        
        return card;
    }

    renderDisposalOptions(options) {
        return `
            <div class="space-y-2">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Entsorgung:</p>
                <div class="flex flex-wrap gap-2">
                    ${options.map(option => this.renderOption(option)).join('')}
                </div>
            </div>
        `;
    }

    renderOption(option) {
        if (typeof option === 'object' && option.type === 'wsz') {
            return `
                <button onclick="window.modalManager.showWszModal()" 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ColorManager.getColorClass(option.label)} hover:shadow-lg transition-shadow cursor-pointer">
                    ${option.label}
                    <span class="ml-2 px-1.5 py-0.5 text-xs rounded-full border border-current">Wo?</span>
                </button>
            `;
        }
        
        return `
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ColorManager.getColorClass(option)}">
                ${option}
            </span>
        `;
    }

    renderPaidCollection() {
        return `
            <div class="pt-2 border-t border-gray-200 dark:border-gray-700">
                <span class="text-sm text-red-500 dark:text-red-400 font-medium">
                    💰 Kostenpflichtige Entsorgung (ASZ Grüne Tonne)
                </span>
            </div>
        `;
    }

    renderTable(items, searchQuery) {
        this.tableBody.innerHTML = '';
        items.forEach((item, index) => {
            const row = this.createTableRow(item, index, searchQuery);
            this.tableBody.appendChild(row);
        });
    }

    createTableRow(item, index, searchQuery) {
        const row = document.createElement('tr');
        row.className = index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900';
        
        row.innerHTML = `
            <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                ${TextUtils.highlightMatch(item.name, searchQuery)}
            </td>
            <td class="px-4 py-3 text-sm text-center">
                ${item.specialWaste ? 
                    '<span class="text-red-600 font-bold">⚠️ Ja</span>' : 
                    '<span class="text-green-600">Nein</span>'}
            </td>
            ${this.renderCheckCell(item.disposalLocations.household.gelber_sack)}
            ${this.renderCheckCell(item.disposalLocations.household.restmuell)}
            ${this.renderCheckCell(item.disposalLocations.household.bio)}
            ${this.renderCheckCell(item.disposalLocations.household.papier)}
            ${this.renderCheckCell(item.disposalLocations.collectionPoints.glas)}
            ${this.renderCheckCell(item.disposalLocations.collectionPoints.textil)}
            ${this.renderCheckCell(item.disposalLocations.collectionPoints.papier_karton_wsz)}
            ${this.renderCheckCell(item.disposalLocations.collectionPoints.tkb)}
            ${this.renderCheckCell(item.disposalLocations.recyclingCenters.wsz_breitenau)}
            ${this.renderCheckCell(item.disposalLocations.recyclingCenters.wsz_schloeglmuehl)}
            ${this.renderCheckCell(item.disposalLocations.recyclingCenters.wsz_grottendorf)}
            ${this.renderCheckCell(item.disposalLocations.paidCollection.asz_gruene_tonne)}
        `;
        
        return row;
    }

    renderCheckCell(value) {
        return `
            <td class="px-2 py-3 text-sm text-center">
                ${value ? 
                    `<span class="text-green-600 font-bold">${MARKS.CHECK}</span>` : 
                    `<span class="text-gray-300 dark:text-gray-600">${MARKS.CROSS}</span>`}
            </td>
        `;
    }

    updateResultCount(shown, total) {
        if (shown === total) {
            this.resultCount.textContent = `Zeige alle ${total} Einträge`;
        } else {
            this.resultCount.textContent = `Zeige ${shown} von ${total} Einträgen`;
        }
    }

    showError(message) {
        this.tableBody.innerHTML = `
            <tr>
                <td colspan="14" class="text-center py-8 text-red-600 dark:text-red-400">
                    <div class="space-y-4">
                        <p class="font-bold">Fehler beim lokalen Laden der Daten aufgrund von CORS-Beschränkungen.</p>
                        <p>Um diese Seite lokal anzuzeigen, haben Sie 3 Optionen:</p>
                        <div class="text-left max-w-2xl mx-auto space-y-2">
                            <p><strong>Option 1:</strong> Verwenden Sie Pythons eingebauten Server:<br>
                            <code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">python3 -m http.server 8000</code><br>
                            Dann öffnen Sie <a href="http://localhost:8000" class="text-blue-600 underline">http://localhost:8000</a></p>
                            
                            <p><strong>Option 2:</strong> Verwenden Sie Node.js http-server:<br>
                            <code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">npx http-server</code><br>
                            Dann öffnen Sie die angezeigte URL</p>
                            
                            <p><strong>Option 3:</strong> Hochladen auf GitHub Pages oder einen beliebigen Webserver</p>
                        </div>
                    </div>
                </td>
            </tr>
        `;
    }
}

class ModalManager {
    constructor() {
        this.modal = document.getElementById(DOM_IDS.WSZ_MODAL);
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideWszModal();
            }
        });
    }

    showWszModal() {
        this.modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    hideWszModal(event) {
        if (!event || event.target.id === DOM_IDS.WSZ_MODAL) {
            this.modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }
}

class AutocompleteManager {
    constructor(onSelectCallback) {
        this.dropdown = document.getElementById(DOM_IDS.AUTOCOMPLETE_DROPDOWN);
        this.onSelectCallback = onSelectCallback;
    }

    show(labels) {
        if (labels.length === 0) {
            this.hide();
            return;
        }
        
        this.dropdown.innerHTML = labels.map(label => `
            <div class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2" 
                 data-label-id="${label.id}" data-label-name="${label.name}">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ColorManager.getColorClass(label.name)}">
                    ${label.name}
                </span>
            </div>
        `).join('');
        
        this.dropdown.querySelectorAll('[data-label-id]').forEach(item => {
            item.addEventListener('click', () => {
                const labelId = item.getAttribute('data-label-id');
                const labelName = item.getAttribute('data-label-name');
                this.onSelectCallback(labelId, labelName);
            });
        });
        
        this.dropdown.classList.remove('hidden');
    }

    hide() {
        this.dropdown.classList.add('hidden');
    }
}

class LabelManager {
    constructor(onChangeCallback) {
        this.selectedLabels = [];
        this.container = document.getElementById(DOM_IDS.SELECTED_LABELS);
        this.searchInput = document.getElementById(DOM_IDS.SEARCH_INPUT);
        this.onChangeCallback = onChangeCallback;
    }

    addLabel(labelId, labelName) {
        if (!this.selectedLabels.find(l => l.id === labelId)) {
            this.selectedLabels.push({ id: labelId, name: labelName });
            this.updateDisplay();
            this.onChangeCallback();
        }
    }

    removeLabel(labelId) {
        this.selectedLabels = this.selectedLabels.filter(l => l.id !== labelId);
        this.updateDisplay();
        this.onChangeCallback();
    }

    getSelectedLabels() {
        return this.selectedLabels;
    }

    clear() {
        this.selectedLabels = [];
        this.updateDisplay();
    }

    updateDisplay() {
        if (this.selectedLabels.length === 0) {
            this.container.innerHTML = '';
            this.searchInput.style.paddingLeft = '1rem';
            return;
        }
        
        this.container.innerHTML = this.selectedLabels.map(label => `
            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${ColorManager.getColorClass(label.name)} pointer-events-auto cursor-pointer" 
                  data-label-id="${label.id}">
                ${label.name}
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </span>
        `).join('');
        
        this.container.querySelectorAll('[data-label-id]').forEach(span => {
            span.addEventListener('click', () => {
                this.removeLabel(span.getAttribute('data-label-id'));
            });
        });
        
        setTimeout(() => {
            const labelsWidth = this.container.offsetWidth;
            if (labelsWidth > 0) {
                this.searchInput.style.paddingLeft = `${labelsWidth + 20}px`;
            }
        }, 0);
    }
}

// Main Application
class App {
    constructor() {
        this.dataService = new DataService();
        this.searchService = new SearchService();
        this.renderer = new Renderer();
        this.modalManager = new ModalManager();
        this.filteredItems = [];
        
        this.initializeComponents();
        this.initializeEventHandlers();
        this.loadAndRenderData();
    }

    initializeComponents() {
        this.autocompleteManager = new AutocompleteManager((labelId, labelName) => {
            this.labelManager.addLabel(labelId, labelName);
            this.searchInput.value = '';
            this.autocompleteManager.hide();
        });

        this.labelManager = new LabelManager(() => {
            this.filterItemsByLabels();
        });

        window.modalManager = this.modalManager;
    }

    initializeEventHandlers() {
        this.searchInput = document.getElementById(DOM_IDS.SEARCH_INPUT);
        this.clearButton = document.getElementById(DOM_IDS.CLEAR_BUTTON);
        this.tableScrollContainer = document.getElementById(DOM_IDS.TABLE_SCROLL_CONTAINER);

        this.searchInput.addEventListener('input', (e) => this.handleSearchInput(e));
        this.searchInput.addEventListener('focus', (e) => this.handleSearchFocus(e));
        this.searchInput.addEventListener('blur', () => this.handleSearchBlur());
        this.clearButton.addEventListener('click', () => this.handleClear());
    }

    async loadAndRenderData() {
        try {
            const items = await this.dataService.loadData();
            this.filteredItems = items;
            this.renderer.render(items, '', this.dataService.getItemCount());
        } catch (error) {
            this.renderer.showError(error.message);
        }
    }

    handleSearchInput(e) {
        const query = e.target.value;
        
        if (query && this.labelManager.getSelectedLabels().length === 0) {
            const matchingLabels = this.searchService.searchLabels(query);
            this.autocompleteManager.show(matchingLabels);
        } else {
            this.autocompleteManager.hide();
        }
        
        this.filterItems(query);
        this.scrollToTop();
    }

    handleSearchFocus(e) {
        const query = e.target.value;
        if (query && this.labelManager.getSelectedLabels().length === 0) {
            const matchingLabels = this.searchService.searchLabels(query);
            this.autocompleteManager.show(matchingLabels);
        }
    }

    handleSearchBlur() {
        setTimeout(() => {
            this.autocompleteManager.hide();
        }, 200);
    }

    handleClear() {
        this.searchInput.value = '';
        this.searchInput.style.paddingLeft = '1rem';
        this.labelManager.clear();
        this.filterItems('');
        this.autocompleteManager.hide();
        this.scrollToTop();
    }

    filterItemsByLabels() {
        const allItems = this.dataService.getAllItems();
        const selectedLabels = this.labelManager.getSelectedLabels();
        
        this.filteredItems = this.searchService.filterByLabels(allItems, selectedLabels);
        
        const searchQuery = this.searchInput.value;
        if (searchQuery) {
            this.filterItems(searchQuery);
        } else {
            this.renderer.render(this.filteredItems, '', this.dataService.getItemCount());
        }
    }

    filterItems(query) {
        const itemsToFilter = this.labelManager.getSelectedLabels().length > 0 
            ? this.filteredItems 
            : this.dataService.getAllItems();
        
        const filtered = this.searchService.filterItems(itemsToFilter, query);
        this.renderer.render(filtered, query, this.dataService.getItemCount());
    }

    scrollToTop() {
        if (this.tableScrollContainer) {
            this.tableScrollContainer.scrollTop = 0;
        }
        window.scrollTo(0, 0);
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new App();
});