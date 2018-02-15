import $ from 'jquery';
import {ResultService} from './result-service'

export default class Modal {
    constructor() {
        this.document = $(document);
        this.body = $('body');
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

    city(length) {
        switch (length) {
            case 0:
                return 'городов';
                break;
            case 1:
                return 'город';
                break;
            case 2:
            case 3:
            case 4:
                return 'города';
                break;
            default:
                return 'городов';
        }
    }

    openModal() {
        this.userResult = ResultService().data.user.length;
        this.compResult = ResultService().data.comp.length;
        this.modalContent.css('transform', 'translateY(0)');
        this.overlay.css('visibility', 'visible');
        this.closeBtn.css('display', 'block');
        this.container.css('z-index', '0');
        this.resultUser.text(`${this.userResult + ' ' + this.city(this.userResult)}`);
        this.resultComp.text(`${this.compResult + ' ' + this.city(this.compResult)}`);
    }

    closeModal() {
        this.modalContent.css('transform', 'translateY(-150%)');
        this.overlay.css('visibility', 'hidden');
        this.closeBtn.css('display', 'none');
        this.container.css('z-index', '10');
        window.location.reload(true);
    }
}

