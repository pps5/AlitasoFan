import * as firebase from 'firebase';
import {FirebaseDB} from './db';

class App {

    readonly CONFIG = {
        apiKey: "AIzaSyA_FYBc5kMHj6GS529ENXUPz16ryyVSN-w",
        authDomain: "alitasofan.firebaseapp.com",
        databaseURL: "https://alitasofan.firebaseio.com",
        storageBucket: "alitasofan.appspot.com",
        messagingSenderId: "305516175755"
    };

    constructor() {
        var app = firebase.initializeApp(this.CONFIG);
        var db = new FirebaseDB();
        db.fetchOriginals().then(result => {
            console.log(result);
        });
        db.fetchImageInfo().then(result => {
            console.log(result);
        });
    }
}
var a = new App();