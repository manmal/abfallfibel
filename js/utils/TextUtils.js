export class TextUtils {
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