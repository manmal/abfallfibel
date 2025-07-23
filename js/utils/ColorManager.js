import { COLOR_SCHEMES } from '../config.js';

export class ColorManager {
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