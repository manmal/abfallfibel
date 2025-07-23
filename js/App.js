import { DOM_IDS } from './config.js';
import { DataService } from './services/DataService.js';
import { SearchService } from './services/SearchService.js';
import { Renderer } from './components/Renderer.js';
import { ModalManager } from './components/ModalManager.js';
import { AutocompleteManager } from './components/AutocompleteManager.js';
import { LabelManager } from './components/LabelManager.js';

export class App {
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