var config = {
    apiKey: "AIzaSyA_FYBc5kMHj6GS529ENXUPz16ryyVSN-w",
    authDomain: "alitasofan.firebaseapp.com",
    databaseURL: "https://alitasofan.firebaseio.com",
    storageBucket: "alitasofan.appspot.com",
    messagingSenderId: "305516175755"
};

firebase.initializeApp(config);

var USER = null;
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        USER = user;
        console.log(user);
    }
});
