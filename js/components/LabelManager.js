import { DOM_IDS } from '../config.js';
import { ColorManager } from '../utils/ColorManager.js';

export class LabelManager {
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