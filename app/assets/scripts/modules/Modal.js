import $ from 'jquery';
import {ResultService} from './result-service'

export default class Modal {
    constructor() {
        this.document = $(document);
        this.body = document.body;
        this.container = $('.container');
        this.resultUser = $('.js-result-user');
        this.resultComp = $('.js-result-comp');
        this.overlay = $('.overlay');
        this.closeBtn = $('.js-close-btn');
        this.modalContent = $('.js-modal-content');
        this.events();
    }

    events() {
        this.document.on('keyup', (e) => {
            if (e.keyCode == 27) {
                this.closeModal();
            }
        });
        this.closeBtn.on('click', () => this.closeModal());
        // this.body.on('click', (e) => {
        //     if (e.target === this.overlay) {
        //         this.closeModal();
        //     }
        // });
    }

    openModal() {
        this.modalContent.css('transform', 'translateY(0)');
        this.overlay.css('visibility', 'visible');
        this.closeBtn.css('display', 'block');
        this.container.css('z-index', '0');
        this.resultUser.text(ResultService().data.user.length);
        this.resultComp.text(ResultService().data.comp.length);
    }

    closeModal() {
        this.modalContent.css('transform', 'translateY(-150%)');
        this.overlay.css('visibility', 'hidden');
        this.closeBtn.css('display', 'none');
        this.container.css('z-index', '10');
        window.location.reload(true);
    }
}

