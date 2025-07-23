import { WasteItem } from '../models/WasteItem.js';

export class DataService {
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