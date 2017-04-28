"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebase = require("firebase");
const es6_promise_1 = require("es6-promise");
class FirebaseDB {
    static fetchOriginals() {
        return new es6_promise_1.Promise((result) => {
            firebase.database().ref('origin').once('value', (snapshot) => {
                var origins = snapshot.val();
                var originArray = [];
                for (let key in origins) {
                    originArray.push(key);
                }
                result(originArray);
            });
        });
    }
    static fetchImageInfo() {
        return new es6_promise_1.Promise((result, error) => {
            var ref = firebase.database().ref('/characters/');
            ref.orderByChild('timestamp').once('value', (snapshot) => {
                var values = [];
                snapshot.forEach((child) => {
                    var v = child.val();
                    v['key'] = child.key;
                    values.unshift(v);
                    return false;
                });
                result(values);
            }, (error) => {
                console.dir(error);
            });
        });
    }
    static isAlitaso() {
        return new es6_promise_1.Promise((resolve, error) => {
            firebase.database().ref('alitasoauth').once('value', resolve, error);
        });
    }
    static writeNewOriginal(originalName) {
        this.fetchOriginals().then((originals) => {
            if (originals.indexOf(originalName) === -1) {
                firebase.database().ref('origin').child(originalName).set({
                    name: originalName
                });
            }
        });
    }
    static writeImageData(fileName, character, original, selling) {
        var baseName = fileName.split('.')[0];
        var current = new Date();
        var data = {
            character: character,
            original: original,
            key: baseName,
            selling_point: selling,
            date: current.toISOString(),
            timestamp: current.getTime(),
            like: {
                count: 0,
                users: null
            }
        };
        return firebase.database().ref('characters').child(baseName).set(data);
    }
    static toggleLike(imageId, userId) {
        var ref = firebase.database().ref('characters').child(imageId).child('like');
        ref.transaction((like) => {
            if (like) {
                if (like.users && like.users[userId]) {
                    like.count--;
                    like.users[userId] = null;
                }
                else {
                    like.count++;
                    if (!like.users) {
                        like.users = {};
                    }
                    like.users[userId] = true;
                }
            }
            return like;
        });
    }
}
exports.FirebaseDB = FirebaseDB;
