import $ from 'jquery';
import * as firebase from 'firebase';
import Modal from './Modal';
import {ResultService} from './result-service'

export default class Cities {

    constructor() {

        //Firebase config
        if (!firebase.apps.length) {

            const config = {
                apiKey: "AIzaSyDdDGhVyntUqImmJHpnLpk6crSW935lUqc",
                authDomain: "test-project-904fc.firebaseapp.com",
                databaseURL: "https://test-project-904fc.firebaseio.com/",
                projectId: "test-project-904fc",
                storageBucket: "",
                messagingSenderId: "1082433347999"
            }

            firebase.initializeApp(config);
        }

        this.modal = new Modal();
        this.window = $(window);
        this.ajaxHandlerScript = 'https://test-project-904fc.firebaseio.com/.json';
        this.citiesInfo = [];
        this.currentCityUser = null;
        this.currentCityComp = null;
        this.titleMessages = {
            comp: 'Ход компьютера',
            user: 'Ваш ход:'
        }
        this.errorMesages = {
            emptyValue: 'Значение не может быть пустым',
            lastCharMatch: 'Слово не на последнюю букву компьютера!',
            compDoesntKnowWord: 'Компьютер не может придумать слов на Вашу последнюю букву! Вы победили!',
            compRepeatWord: 'Или компьютер или Вы повторяетесь - игра закончена'
        }
        this.error = $('.js-error');
        this.userResult = $('.js-user-result');
        this.compResult = $('.js-comp-result');
        this.headerTitle = $('.js-header-title');
        this.innerText = $('.js-inner-text');
        this.form = $('.js-form');
        this.formInput = $('.js-form-input');
        this.events();
    }

    events() {
        this.window.on('load', () => {
            this.loadData(); //Загрузка json с городами с сервиса firebase, выбрал этот способ, потому что хотелось как-то сэмулировать запрос к серверу и ранее уже делал такое:)
        });

        this.formInput.on('input', () => this.error.text(''));
        this.formInput.on('input', () => this.error.text(''));

        this.form.on('submit', (e) => {
            e.preventDefault();
            let value = this.formInput.val().toLowerCase();

            if (value !== '') {
                this.checkRepeat(value, () => {
                    this.currentCityUser = value;
                    if (this.compareLastChar()) {
                        const liElem = $('<li>');
                        ResultService().data.user.push(value);

                        liElem.text(this.makeFirstCharUpper(value));
                        this.userResult.append(liElem);
                        this.form.val('');
                        this.headerTitle.text(this.titleMessages.comp);
                        this.initYmap(value, 'user');
                        this.stepCityComp();
                    } else {
                        this.showError(this.errorMesages.lastCharMatch, false);
                    }
                });
            } else {
                this.showError(this.errorMesages.emptyValue, false);
            }
        });
    }

    compareLastChar() {
        return this.currentCityComp ?
            this.currentCityUser[0] === this.getLastChar(this.currentCityComp) :
            true;
    }

    initYmap(city, type) {
        // Поиск координат центра город
        ymaps.geocode(city, {results: 1}).then(function (res) {
            // Выбираем первый результат геокодирования.
            var firstGeoObject = res.geoObjects.get(0);
            // Создаем карту с нужным центром.
            $('#ymap-' + type).empty();
            var myMap = new ymaps.Map('ymap-' + type, {
                center: firstGeoObject.geometry.getCoordinates(),
                zoom: 11
            });
            myMap.container.fitToViewport();
        });
    }

    checkRepeat(city, cb) {
        [...ResultService().data.user, ...ResultService().data.comp].includes(city) ?
            this.showError(this.errorMesages.compRepeatWord) :
            cb && cb();
    }

    showError(text, modal = true) {
        this.error.text(text);

        if (modal) {
            setTimeout(() => this.modal.openModal(), 2000);
        }
    }

    loadData() {
        return fetch(this.ajaxHandlerScript, {
            method: 'get'
        })
            .then(response => response.json())
            .then(data => this.citiesInfo = data);
    }


    getLastChar(str) {
        return str[str.length - 1];
    }

    randomWord(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    makeFirstCharUpper(str) {
        return str[0].toUpperCase() + str.slice(1);
    }

    stepCityComp() {
        const self = this;
        const arrTheSameChar = [];
        const lastCharUser = this.getLastChar(this.currentCityUser);

        for (let city of this.citiesInfo) {
            city = city.toLowerCase();
            if (city[0] === lastCharUser) {
                arrTheSameChar.push(city);
            }
        }

        if (!arrTheSameChar.length) {
            this.showError(this.errorMesages.compDoesntKnowWord);
        }

        this.form.fadeOut();
        this.innerText.fadeOut(function () {
            if (arrTheSameChar.length) {
                let value = self.randomWord(arrTheSameChar).toLowerCase();
                var $this = $(this);

                self.checkRepeat(value, () => {
                    const liElem = $('<li>');
                    $this.text(value).fadeIn().fadeOut(2000, () => {
                        self.headerTitle.text(self.titleMessages.user);
                        self.formInput.val('');
                        self.form.fadeIn();
                    });

                    ResultService().data.comp.push(value);
                    self.currentCityComp = value;
                    liElem.text(self.makeFirstCharUpper(value));
                    self.compResult.append(liElem);
                    self.initYmap(value, 'comp');
                });
            }
        });
    }
}



