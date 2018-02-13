import $ from 'jquery';
import Cities from './Cities';

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
    this.modalResultArrUser = [];
    this.modalResultArrComp = [];
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
        this.resultUser.text(this.modalResultArrUser.length);
        this.resultComp.text(this.modalResultArrComp.length);
    }


    // openModalFailComp() {
    //     this.modalContent.css('transform', 'translateY(0)');
    //     this.overlay.css('visibility', 'visible');
    //     this.closeBtn.css('display', 'block');
    //     this.modal.css('display',  'none');
    //     this.container.css('z-index', '0');
    //     this.title.css('color', 'green');
    //     this.title.text('Поздравляем!');
    //     this.desc.text('У компьютера больше не осталось вариантов, он повторяется');
    // }

    // openModalFailCompByWord() {
    //     this.modalContent.css('transform', 'translateY(0)');
    //     this.overlay.css('visibility', 'visible');
    //     this.closeBtn.css('display', 'block');
    //     this.modal.css('display',  'none');
    //     this.container.css('z-index', '0');
    //     this.title.css('color', 'green');
    //     this.title.text('Поздравляем!');
    //     this.desc.text('Компьютер не может придумать слов на Вашу последнюю букву! Вы победили!');
    // }

    // openModalFailEmpty() {
    //     this.modalContent.css('transform', 'translateY(0)');
    //     this.overlay.css('visibility', 'visible');
    //     this.closeBtn.css('display', 'block');
    //     this.modal.css('display',  'none');
    //     this.container.css('z-index', '0');
    //     this.title.css('color', 'red');
    //     this.title.text('Внимание!');
    //     this.desc.text('Значение не может быть пустым');
    // }

    // openModalFailRepeat() {
    //     this.modalContent.css('transform', 'translateY(0)');
    //     this.overlay.css('visibility', 'visible');
    //     this.closeBtn.css('display', 'block');
    //     this.modal.css('display',  'none');
    //     this.container.css('z-index', '0');
    //     this.title.css('color', 'red');
    //     this.title.text('Внимание!');
    //     this.desc.text('Вы повторяетесь');
    // }



    closeModal() {
            this.modalContent.css('transform', 'translateY(-150%)');
            this.overlay.css('visibility', 'hidden');
            this.closeBtn.css('display', 'none');
            this.container.css('z-index', '10');
            window.location.reload(true);
    }
}

