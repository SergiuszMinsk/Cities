import $ from 'jquery';
import {ResultService} from './result-service'

export default class Modal {
    constructor() {
        this.document = $(document);
        this.body = $('body');
        this.citiesDeclensions = ['город', 'городов', 'города'];
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

    getDeclension (number, cases) {
        const numberString = number.toString();
        let title = null;
        if ((/1|21|31|41|51$/).test(numberString)) {
            title = cases[0];
        } else if ((/2|3|4|22|23|24|32|33|34$/).test(numberString)) {
            title = cases[2];
        } else {
            title = cases[1];
        }
        return title;
    }

    openModal() {
        this.userResult = ResultService().data.user.length;
        this.compResult = ResultService().data.comp.length;
        this.modalContent.css('transform', 'translateY(0)');
        this.overlay.css('visibility', 'visible');
        this.closeBtn.css('display', 'block');
        this.container.css('z-index', '0');
        this.resultUser.text(`${this.userResult} ${this.getDeclension(this.userResult, this.citiesDeclensions)}`);
        this.resultComp.text(`${this.compResult} ${this.getDeclension(this.compResult, this.citiesDeclensions)}`);
    }

    closeModal() {
        this.modalContent.css('transform', 'translateY(-150%)');
        this.overlay.css('visibility', 'hidden');
        this.closeBtn.css('display', 'none');
        this.container.css('z-index', '10');
        window.location.reload(true);
    }
}

