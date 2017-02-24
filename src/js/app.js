"use strict";
exports.__esModule = true;
var firebase = require("firebase");
var db_1 = require("./db");
var App = (function () {
    function App() {
        this.CONFIG = {
            apiKey: "AIzaSyA_FYBc5kMHj6GS529ENXUPz16ryyVSN-w",
            authDomain: "alitasofan.firebaseapp.com",
            databaseURL: "https://alitasofan.firebaseio.com",
            storageBucket: "alitasofan.appspot.com",
            messagingSenderId: "305516175755"
        };
        var app = firebase.initializeApp(this.CONFIG);
        var db = new db_1.FirebaseDB();
        db.fetchOriginals().then(function (result) {
            console.log(result);
        });
        db.fetchImageInfo().then(function (result) {
            console.log(result);
        });
    }
    return App;
}());
var a = new App();
