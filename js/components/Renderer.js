import { DOM_IDS, MARKS } from '../config.js';
import { ColorManager } from '../utils/ColorManager.js';
import { TextUtils } from '../utils/TextUtils.js';

export class Renderer {
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