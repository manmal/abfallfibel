export const DISPOSAL_LABELS = [
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

export const COLOR_SCHEMES = {
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

export const MARKS = {
    CHECK: '✓',
    CROSS: '✗'
};

export const DOM_IDS = {
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