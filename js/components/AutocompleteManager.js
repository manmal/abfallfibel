import { DOM_IDS } from '../config.js';
import { ColorManager } from '../utils/ColorManager.js';

export class AutocompleteManager {
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