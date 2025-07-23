import { DOM_IDS } from '../config.js';

export class ModalManager {
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