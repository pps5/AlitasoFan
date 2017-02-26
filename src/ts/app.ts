import * as firebase from 'firebase';
import * as riot from 'riot';
import * as lightGallery from 'lightgallery.js';

import { FirebaseDB } from './db';
import { ImageInfo } from './imageinfo';

class App {

    user: firebase.UserInfo;
    images: Array<ImageInfo>;
    isAlitaso: boolean;

    readonly CONFIG = {
        apiKey: "AIzaSyA_FYBc5kMHj6GS529ENXUPz16ryyVSN-w",
        authDomain: "alitasofan.firebaseapp.com",
        databaseURL: "https://alitasofan.firebaseio.com",
        storageBucket: "alitasofan.appspot.com",
        messagingSenderId: "305516175755"
    };

    constructor() {
        var app = firebase.initializeApp(this.CONFIG);
        firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

        document.addEventListener('loginRequest', this.onRequestedLogin);
        document.addEventListener('logoutRequest', this.onRequestedLogout);
        document.addEventListener('toggleLikeRequest', this.onRequestedToggleLike);

        this.mountTopbar();
        FirebaseDB.fetchImageInfo().then((images) => {
            this.images = images;
            this.mountGallery();
        });
    }

    private onRequestedLogin = (event): void => {
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
    }

    private onRequestedLogout = (event): void => {
        firebase.auth().signOut().then((resolve) => {
            // no-op; update views in onAuthStateChanged()
        }, (reject) => {
            var errorDiv = document.getElementById('error');
            errorDiv.className = 'fadeIn';
            setTimeout(() => {
                errorDiv.className = 'fadeOut';
            }, 3000);
        });
    }

    private onRequestedToggleLike = (event): void => {
        if (this.user) {
            var target: ImageInfo;
            var eventItem: ImageInfo = event.detail.item;
            for (let item of this.images) {
                if (item.key === eventItem.key) {
                    target = item;
                }
            }
            if (!target) return; // just in case

            FirebaseDB.toggleLike(target.key, this.user.uid);
            var like = target.like;
            if (like.users && like.users[this.user.uid]) {
                like.count--;
                like.users[this.user.uid] = null;
            } else {
                like.count++;
                if (!like.users) {
                    like.users = {};
                }
                like.users[this.user.uid] = true;
            }
        }
    }

    private onAuthStateChanged = (user): void => {
        document.dispatchEvent(new CustomEvent('onAuthStateChanged', {
            detail: { user: user }
        }));

        if (user) {
            this.user = user;
            FirebaseDB.isAlitaso().then((resolve) => {
                // not alitaso -> alitaso; maybe alitaso logged in
                if (!this.isAlitaso) {
                    this.isAlitaso = true;
                    document.dispatchEvent(new CustomEvent('onAuthStateChanged', {
                        detail: { user: user, isAlitaso: true }
                    }));
                }
            }, (error) => {
                // alitaso -> not alitaso; maybe alitaso logged out
                if (this.isAlitaso) {
                    this.isAlitaso = false;
                    document.dispatchEvent(new CustomEvent('onAuthStateChanged', {
                        detail: { user: user, isAlitaso: false }
                    }));
                }
            });
        } else {
            // any user logged out
            this.user = null;
            this.isAlitaso = false;
        }
    }

    private mountTopbar = (): void => {
        riot.mount('topbar', {
            isAlitaso: this.isAlitaso,
            user: this.user
        });
        document.querySelector('#login span').addEventListener('click', this.onRequestedLogin);
    }

    private mountGallery = (): void => {
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
    }
}
var app = new App();