"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebase = require("firebase");
const riot = require("riot");
const lightGallery = require("lightgallery.js");
const db_1 = require("./db");
class App {
    constructor() {
        this.CONFIG = {
            apiKey: "AIzaSyA_FYBc5kMHj6GS529ENXUPz16ryyVSN-w",
            authDomain: "alitasofan.firebaseapp.com",
            databaseURL: "https://alitasofan.firebaseio.com",
            storageBucket: "alitasofan.appspot.com",
            messagingSenderId: "305516175755"
        };
        this.onRequestedLogin = (event) => {
            var provider = new firebase.auth.TwitterAuthProvider();
            firebase.auth().signInWithPopup(provider).then((resolve) => {
                if (event.detail.item) {
                    document.dispatchEvent(new CustomEvent('toggleLikeRequest', {
                        detail: event.detail
                    }));
                }
            }, (reject) => {
                var errorDiv = document.getElementById('error');
                errorDiv.className = 'fadeIn';
                setTimeout(() => {
                    errorDiv.className = 'fadeOut';
                }, 3000);
            });
        };
        this.onRequestedLogout = (event) => {
            firebase.auth().signOut().then((resolve) => {
                console.log(resolve);
            }, (reject) => {
                var errorDiv = document.getElementById('error');
                errorDiv.className = 'fadeIn';
                setTimeout(() => {
                    errorDiv.className = 'fadeOut';
                }, 3000);
            });
        };
        this.onRequestedToggleLike = (event) => {
            if (this.user) {
                var target;
                var eventItem = event.detail.item;
                for (let item of this.images) {
                    if (item.key === eventItem.key) {
                        target = item;
                    }
                }
                if (target) {
                    db_1.FirebaseDB.toggleLike(target.key, this.user.uid);
                    var like = target.like;
                    if (like.users && like.users[this.user.uid]) {
                        like.count--;
                        like.users[this.user.uid] = null;
                    }
                    else {
                        like.count++;
                        if (!like.users) {
                            like.users = {};
                        }
                        like.users[this.user.uid] = true;
                    }
                    this.updateGallery();
                }
            }
        };
        this.onAuthStateChanged = (user) => {
            if (user) {
                this.user = user;
                this.updateGallery();
                db_1.FirebaseDB.isAlitaso().then((resolve) => {
                    if (!this.isAlitaso) {
                        this.isAlitaso = true;
                        this.updateAllView();
                    }
                }, (error) => {
                    if (this.isAlitaso) {
                        this.isAlitaso = false;
                        this.updateAllView();
                    }
                });
            }
            else {
                this.user = null;
                this.isAlitaso = false;
                this.updateAllView();
            }
        };
        this.updateAllView = () => {
            this.updateTopbar();
            this.updateGallery();
        };
        this.updateTopbar = () => {
            riot.mount('topbar', {
                isAlitaso: this.isAlitaso,
                user: this.user
            });
            document.querySelector('#login span').addEventListener('click', this.onRequestedLogin);
        };
        this.updateGallery = () => {
            var loading = document.querySelector('#loading');
            var gallery = document.querySelector('gallery');
            gallery.className = 'hide';
            loading.className = '';
            riot.mount('gallery', {
                user: this.user,
                items: this.images
            });
            loading.className = 'hide';
            gallery.className = '';
            lightGallery(document.querySelector('#lg-container'), {
                selector: '.pic-wrapper',
                share: true
            });
        };
        var app = firebase.initializeApp(this.CONFIG);
        firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
        document.addEventListener('loginRequest', this.onRequestedLogin);
        document.addEventListener('logoutRequest', this.onRequestedLogout);
        document.addEventListener('toggleLikeRequest', this.onRequestedToggleLike);
        this.updateTopbar();
        db_1.FirebaseDB.fetchImageInfo().then((images) => {
            this.images = images;
            this.updateGallery();
        });
    }
}
var app = new App();
