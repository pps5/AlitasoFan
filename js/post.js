firebase.auth().onAuthStateChanged(function(user) {
    if (user == null) {
        document.querySelector('.unauthorized').className = 'unauthorized';
    } else {
        fetchOriginals().then(function(originals) {
            options = '';
            for (let v of originals) {
                options += '<option>' + v + '</option>';
            }
            document.getElementById('originals').innerHTML = options;
        });
    }
});


document.getElementById('twitter-login').addEventListener('click', function(e) {
    var provider = new firebase.auth.TwitterAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
        // no-op
    }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode + ', ' + errorMessage);
    });
});


var storageRef = firebase.storage().ref();
document.getElementById('picture').addEventListener('change', function(e) {
    validate(); // form validation
    var uploadFile = e.target.files[0];
    var fileReader = new FileReader();

    fileReader.onload = function(event) {
        document.getElementById('preview-area').className = '';
        document.getElementById('preview').setAttribute('src', event.target.result);
    }
    fileReader.readAsDataURL(uploadFile);
});


document.getElementById('submit').addEventListener('click', function(e) {
    toggleFormEnabled();
    var notalitaso = document.getElementById('notalitaso');
    notalitaso.style.display = 'none';

    var uploadFile = document.getElementById('picture').files[0];
    var uploadFileName = createUploadFileName(uploadFile);
    uploadImage(uploadFile, uploadFileName).then(function() {
        var character = document.getElementById('character').value;
        var original = document.getElementById('origin').value;
        var sellingPoint = document.getElementById('selling').value;
        writeImageData(uploadFileName, character, original, sellingPoint).then(
            function(result) {
                document.getElementById('new-pic-form').reset();
                document.getElementById('preview-area').className = 'hide';
            }
        );
        writeNewOriginal(original);
        toggleFormEnabled();
    }, function(error) {
        console.log(error);
        if (error.code === 'storage/unauthorized') {
            notalitaso.style.display = '';
        }
        toggleFormEnabled();
    });
});

function createUploadFileName(file) {
    var rand = Math.floor(Math.random() * 100000); // to avoid name conflict
    var split = file.name.split('.');
    return split[0] + rand;
}

function uploadImage(file, name) {
    return new Promise(function(complete, failure) {
        var uploadTask = storageRef.child('images/' + name).put(file);
        uploadTask.on('state_changed', function(snapshot) {
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


document.getElementById('new-pic-form').addEventListener('input', validate);
function validate() {
    var form = document.getElementById('new-pic-form');
    if (form.checkValidity()) {
        document.getElementById('submit').removeAttribute('disabled');
    } else {
        document.getElementById('submit').setAttribute('disabled', 'disabled');
    }
};
