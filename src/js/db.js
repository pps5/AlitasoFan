"use strict";
exports.__esModule = true;
var firebase = require("firebase");
var es6_promise_1 = require("es6-promise");
var FirebaseDB = (function () {
    function FirebaseDB() {
        console.log('aaa');
    }
    FirebaseDB.prototype.fetchOriginals = function () {
        return new es6_promise_1.Promise(function (result) {
            firebase.database().ref('origin').once('value', function (snapshot) {
                var origins = snapshot.val();
                var originArray = [];
                for (var key in origins) {
                    originArray.push(key);
                }
                result(originArray);
            });
        });
    };
    FirebaseDB.prototype.fetchImageInfo = function () {
        return new es6_promise_1.Promise(function (result, error) {
            var ref = firebase.database().ref('/characters/');
            ref.orderByChild('timestamp').once('value', function (snapshot) {
                var values = [];
                console.dir(snapshot.forEach);
                snapshot.forEach(function (child) {
                    console.log(child);
                });
                result(snapshot);
            }, function (error) {
                console.dir(error);
            });
        });
    };
    return FirebaseDB;
}());
exports.FirebaseDB = FirebaseDB;
