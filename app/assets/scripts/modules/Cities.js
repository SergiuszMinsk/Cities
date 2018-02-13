import $ from 'jquery';
import * as firebase from 'firebase';
import Modal from './Modal';

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
        this.userCities = [];
        this.compCities = [];
        this.citiesInfo = [];
        this.currentCityUser = {};
        this.currentCityComp = {};
        this.titleMessages = {
            comp: 'Ход компьютера',
            user: 'Ваш ход:'
        }
        this.errorMesages = {
            emptyValue: 'Значение не может быть пустым',
            lastCharMatch: 'Слово не на последнюю букву компьютера!',
            compDoesntKnowWord: 'Компьютер не может придумать слов на Вашу последнюю букву! Вы победили!'
        }
        this.error = $('.js-error');
        this.userResult = $('.js-user-result');
        this.compResult = $('.js-comp-result');
        this.headerTitle = $('.js-header-title');
        this.innerText = $('.js-inner-text');
        this.formFirstChoice = $('.js-form-firstChoice');
        this.form = $('.js-form');
        this.city = $('.js-form-city');
        this.cityFirstChoice = $('.js-form-city-first-choice');
        this.ymapsUser = $.extend({}, ymaps);
        this.ymapsComp = $.extend({}, ymaps);
        this.mapContainer = $('.map-container');
        this.map = $('#map');
        this.events();
    }

    events() {
        this.window.on('load', () => {
            this.loadData();
            this.form.hide();
        });

       this.cityFirstChoice.on('input', () => this.error.text(''));
       this.city.on('input', () => this.error.text(''));

        this.formFirstChoice.on('submit', (e) => {
            e.preventDefault();
            const self = this;
            let value = this.cityFirstChoice.val().toLowerCase();
            this.currentCityUser.city = value;
            value = value.substring(0, 1).toUpperCase() + value.slice(1);

                    this.ymapsUser.ready(init);

                    function init() {
                        // Поиск координат центра город
                        ymaps.geocode(value, {results: 1}).then(function (res) {
                            // Выбираем первый результат геокодирования.
                            var firstGeoObject = res.geoObjects.get(0),
                                // Создаем карту с нужным центром.
                                myMap = new ymaps.Map("map", {
                                    center: firstGeoObject.geometry.getCoordinates(),
                                    zoom: 11
                                });
                            console.log(myMap);
                            myMap.container.fitToViewport();
                        });
                    }

            const liElem = $('<li></li>');
            liElem.text(value);
            this.userResult.append(liElem);
            if (value === '') {
                this.userResult.html('');
                // this.modal.openModalFailEmpty();
                this.error.text(this.errorMesages.emptyValue);
            } else {
                this.userCities.push(value);
                this.modal.modalResultArrUser = this.userCities;
                this.headerTitle.text(this.titleMessages.comp);
                this.formFirstChoice.hide();
                this.checkCity();
            }
        });

        this.form.on('submit', (e) => {
            e.preventDefault();
            let value = this.city.val().toLowerCase();
            this.currentCityUser.city = value;

            // let checkRepeatWord = false;
            // for (let i of this.userCities) {
            //     if ( i === this.currentCityUser.city ) {
            //         checkRepeatWord = true;
            //     }
            // }
            //
            // if (checkRepeatWord) {
            //     this.error.text('Вы повторили слово, придумайте что-нибудь другое');
            // }

              if (this.currentCityUser.city.substring(0, 1) === this.currentCityComp.lastChar) {
                this.userCities.push(value);
                value = value.substring(0, 1).toUpperCase() + value.slice(1);

                  this.ymapsUser.ready(init);

                  function init() {
                      // Поиск координат центра город
                      ymaps.geocode(value, {results: 1}).then(function (res) {
                          // Выбираем первый результат геокодирования.
                          var firstGeoObject = res.geoObjects.get(0),
                              // Создаем карту с нужным центром.
                              myMap = new ymaps.Map("map", {
                                  center: firstGeoObject.geometry.getCoordinates(),
                                  zoom: 11
                              });
                          myMap.container.fitToViewport();

                      });
                  }
                const liElem = $('<li></li>');
                liElem.text(value);
                this.userResult.append(liElem);
                this.city.val('');
                this.form.fadeOut();
                this.headerTitle.text(this.titleMessages.comp);
                this.checkCity();
            } else {
                this.error.text(this.errorMesages.lastCharMatch);
            }
        });
    }

    loadData() {
        return fetch(this.ajaxHandlerScript, {
            method: 'get'
        })
            .then(response => {
                let contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    return response.json()
                }
                throw new TypeError("получен не JSON!");
            })
            .then(data => {
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        this.citiesInfo.push(data[key]);
                    }
                }
            });
    }

    // getCityGeoCode() {
    //
    //
    // }

    getLastChar(str) {
        return str.slice(-1);
    }

    randomWord(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // makeFirstCharUpper(str) {
    //     return str.substring(0, 1).toUpperCase() + str.slice(1);
    // }

    checkCity() {

        const self = this;
        const arrTheSameChar = [];

        let getLastCharUser = this.getLastChar(this.currentCityUser.city);

        for (let i of this.citiesInfo) {
            i = i.toLowerCase();
            if (i.substring(0, 1) === getLastCharUser) {
                arrTheSameChar.push(i);
             }
            }

      if (arrTheSameChar.length === 0) {
            // this.modal.openModalFailCompByWord();
            this.error.text(this.errorMesages.compDoesntKnowWord);
          setTimeout(() => {
              self.modal.openModal();
          },1500)
        }

        this.innerText.fadeOut(function() {
            if (arrTheSameChar.length === 0) {
                // self.modal.openModalFailCompByWord();
                self.error.text(self.errorMesages.compDoesntKnowWord);
                setTimeout(() => {
                    self.modal.openModal();
                },1500)
            } else {
                let value = self.randomWord(arrTheSameChar).toLowerCase();
                self.compCities.push(value);
                self.modal.modalResultArrComp = self.compCities;
                value = value.substring(0, 1).toUpperCase() + value.slice(1);

                self.ymapsComp.ready(init);

                function init() {
                    // Поиск координат центра города
                    ymaps.geocode(value, {results: 1}).then(function (res) {
                        // Выбираем первый результат геокодирования.
                        var firstGeoObject = res.geoObjects.get(0),
                            // Создаем карту с нужным центром.
                            myMap = new ymaps.Map("map", {
                                center: firstGeoObject.geometry.getCoordinates(),
                                zoom: 11
                            });
                        myMap.container.fitToViewport();

                    });
                }

                for (let i of self.compCities) {
                    for (let j of self.userCities) {
                        if (value === i || i === j) {
                            self.error.text('У компьютера больше не осталось вариантов, он повторяется!');
                            setTimeout(() => {
                                self.modal.openModal();
                            }, 2000)
                        }
                    }
                }

                $(this).text(value).fadeIn();
                $(this).text(value).fadeOut(2000, function() {
                    self.headerTitle.text(self.titleMessages.user);
                    self.form.fadeIn();
                });

                self.currentCityComp.lastChar = self.getLastChar(value);
                console.log(self.compCities);
                const liElem = $('<li></li>');
                liElem.text(value);
                self.compResult.append(liElem);
            }
        });
    }
}



