import $ from 'jquery';
import * as firebase from 'firebase';

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

        this.ajaxHandlerScript = 'https://test-project-904fc.firebaseio.com/.json';
        this.userCities = [];
        this.compCities = [];
        this.citiesInfo = [];
        this.currentCityUser = {};
        this.currentCityComp = {};
        this.window = $(window);
        this.userResult = $('.js-user-result');
        this.compResult = $('.js-comp-result');
        this.headerTitle = $('.js-header-title');
        this.innerText = $('.js-inner-text');
        this.form = $('.js-form');
        this.city = $('.js-form-city');
        this.events();
    }

    events() {
        this.window.on('load', () => this.loadData());

        this.form.on('submit', (e) => {
            e.preventDefault();
            const value = this.city.val();
            this.currentCityUser.city = value.toLowerCase();
            this.userCities.push(value);
            console.log(this.currentCityComp.lastChar);
            const liElem = $('<li></li>');
            liElem.text(value);
            this.userResult.append(liElem);
            if (this.currentCityUser.city.substring(0, 1) === this.currentCityComp.lastChar) {
                this.city.val('');
                this.form.fadeOut();
                this.headerTitle.text('Ход компьютера:');
                this.checkCity();
            } else {
                this.userResult.html('');
                console.log('Слово не на последнюю букву компьютера!');
            }
        })
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

    getLastChar(str) {
        return str.slice(-1);
    }

    // makeFirstCharUpper(str) {
    //     return str.substring(0, 1).toUpperCase() + str.slice(1);
    // }

    checkCity() {

        const self = this;
        let getLastCharUser = this.getLastChar(this.currentCityUser.city);

        for (let i of this.citiesInfo) {
            i = i.toLowerCase();
            if (i.substring(0, 1) === getLastCharUser) {
                this.innerText.fadeOut(function() {
                    i = i.substring(0, 1).toUpperCase() + i.slice(1);
                    $(this).text(i).fadeIn();
                    $(this).text(i).fadeOut(2000, function() {
                        self.headerTitle.text('Ваш ход:');
                        self.form.fadeIn();
                    });
                    self.currentCityComp.lastChar = self.getLastChar(i);
                    self.compCities.push(i);
                    console.log(self.compCities);
                    const liElem = $('<li></li>');
                    liElem.text(i);
                    self.compResult.append(liElem);
                });
                break;
            }
        }
    }
}