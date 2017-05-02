import * as firebase from 'firebase';
import { FirebaseDB } from './db';

const CONFIG = {
    apiKey: "AIzaSyA_FYBc5kMHj6GS529ENXUPz16ryyVSN-w",
    authDomain: "alitasofan.firebaseapp.com",
    databaseURL: "https://alitasofan.firebaseio.com",
    storageBucket: "alitasofan.appspot.com",
    messagingSenderId: "305516175755"
};
firebase.initializeApp(CONFIG);

var storageRef = firebase.storage().ref();
document.getElementById('new-pic-form').addEventListener('input', validate);

firebase.auth().onAuthStateChanged(user =>  {
    if (user == null) {
        document.querySelector('.unauthorized').className = 'unauthorized';
    } else {
        FirebaseDB.fetchOriginals().then(originals => {
            var options = '';
            for (let v of originals) {
                options += '<option>' + v + '<option>';
            }
            document.getElementById('originals').innerHTML = options;
        });
    }
});

document.getElementById('twitter-login').addEventListener('click', e => {
    var provider = new firebase.auth.TwitterAuthProvider();
    firebase.auth().signInWithPopup(provider).then(result => {
        // no-op
    }).catch(error => {
        var errorCode = error,code;
        var errorMessage = error.message;
        console.log(errorCode + ', ' + errorMessage);
    });
})


document.getElementById('picture').addEventListener('change', e => {

    validate(); // form validation
    var uploadFile = (<HTMLFormElement> e.target).files[0];
    var fileReader = new FileReader();

    fileReader.onload = (event) => {
        document.getElementById('preview-area').className = '';
        document.getElementById('preview').setAttribute('src', (<HTMLFormElement> event.target).result);
    }
    fileReader.readAsDataURL(uploadFile);
})

document.getElementById('submit').addEventListener('click', e => {
    toggleFormEnabled();
    var notalitaso = document.getElementById('notalitaso');
    notalitaso.style.display = 'none';

    var uploadFile: HTMLFormElement = (<HTMLFormElement>document.getElementById('picture')).files[0];
    var uploadFileName = createUploadFileName(uploadFile);

    uploadImage(uploadFile, uploadFileName).then(() => {
        var character = (<HTMLFormElement> document.getElementById('character')).value;
        var original = (<HTMLFormElement> document.getElementById('origin')).value;
        var sellingPoint = (<HTMLFormElement> document.getElementById('selling')).value;

        FirebaseDB.writeImageData(uploadFileName, character, original, sellingPoint).then(result => {
            (<HTMLFormElement> document.getElementById('new-pic-form')).reset();
            document.getElementById('preview-area').className = 'hide';
        });
        FirebaseDB.writeNewOriginal(original);
        toggleFormEnabled();
    }, error => {
        console.log(error);
        if (error.code === 'storage/unauthorized') {
            notalitaso.style.display = '';
        }
        toggleFormEnabled();
    });

})

function createUploadFileName(file) {
    var rand = Math.floor(Math.random() * 100000); // avoid name confliction
    var split = file.name.split('.');
    return split[0] + rand;
}

function uploadImage(file, name) {
    return new Promise((complete, failure) => {
        var uploadTask = storageRef.child('images/' + name).put(file);
        uploadTask.on('state_changed', snapshot => {
            // no-op
        }, failure, complete);
    });
}

function toggleFormEnabled() {
    var inputs = document.getElementsByTagName('input');
    for (let elem of inputs) {
        elem.disabled = !elem.disabled;
    }
}

function validate() {
    var form: HTMLFormElement = <HTMLFormElement> document.getElementById('new-pic-form');
    if (form.checkValidity()) {
        document.getElementById('submit').removeAttribute('disabled');
    } else {
        document.getElementById('submit').setAttribute('disabled', 'disabled');
    }
}