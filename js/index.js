'use strict';

const URL_SELF = 'https://pps5.github.io/AlitasoFan/';
const URL_TWEET = 'https://twitter.com/intent/tweet?text=';
const BASE_URL_FOR_IMAGE = 'https://firebasestorage.googleapis.com/v0/b/alitasofan.appspot.com/o/images%2F';

var config = {
    apiKey: "AIzaSyA_FYBc5kMHj6GS529ENXUPz16ryyVSN-w",
    authDomain: "alitasofan.firebaseapp.com",
    databaseURL: "https://alitasofan.firebaseio.com",
    storageBucket: "alitasofan.appspot.com",
    messagingSenderId: "305516175755"
};
firebase.initializeApp(config);

var USER = null;
var isFinishInit = false;
var isUpdatedLikeIcons = false;

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        USER = user;
        document.querySelector('#twitter span').style.display = 'none';
        var twitter = document.getElementById('twitter');
        if (twitter.getElementsByTagName('img').length === 0) {
            var icon = document.createElement('img');
            icon.setAttribute('src', USER.photoURL);
            twitter.appendChild(icon);
        }
        if (isFinishInit && !isUpdatedLikeIcons) {
            updateAllLikeIcons();
        }

        if (user.displayName === 'ありたそ') {
            var ul = document.querySelector('ul');
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.setAttribute('href', 'post.html');
            a.innerHTML = '画像投稿';
            li.appendChild(a);
            ul.appendChild(li);
        }
    }
});

function loginWithTwitter() {
    var provider = new firebase.auth.TwitterAuthProvider();
    firebase.auth().signInWithPopup(provider).then(/* no-op */);
}

var images;
(function() {
    document.querySelector('#twitter span').addEventListener('click', loginWithTwitter);
    fetchImageInfo().then(function(result) {
        images = result;

        var container = document.getElementById('gallery');
        for (let i of images) {
            var imgUrl = BASE_URL_FOR_IMAGE + i.key + '?alt=media';

            var img = document.createElement('img');
            img.className = 'picture';
            img.setAttribute('src', imgUrl);

            var figureElem = createFigureElem(i, img, imgUrl);
            figureElem.appendChild(createFigCaption(i));
            figureElem.appendChild(createLgCaption(i));
            figureElem.appendChild(createLikeButton(i));
            figureElem.appendChild(createShareButton(i));
            figureElem.appendChild(createLikeCount(i));

            var flexItem = document.createElement('div');
            flexItem.className = 'flex-item';
            flexItem.appendChild(figureElem);
            container.appendChild(flexItem);
        }

        document.getElementById('loading').className = 'hide';
        document.getElementById('container').className = '';
        lightGallery(container, {
            selector: '.pic-wrapper',
            share: true
        });
        updateAllLikeIcons();
        isFinishInit = true;
    }, function(error) {
        // no-op
    });
})();

function onClickShare(e) {
    var flexItem = e.target.parentElement.parentElement;
    var galleryContainer = document.getElementById('gallery');
    var index = Array.prototype.indexOf.call(galleryContainer.childNodes, flexItem);

    var shareUrl = encodeURIComponent(URL_SELF + '#lg=1&slide=' + index);
    var shareText = encodeURIComponent(e.target.character + ' #ありたそ画展');
    window.open(URL_TWEET + shareText + '&url=' + shareUrl);
    e.stopPropagation();
}

function onClickLike(e) {
    if (USER) {
        var imgId = e.target.parentElement.id;
        var userId = USER.uid;
        toggleLike(imgId, userId);
        updateLikeCount(e.target.parentNode);
        toggleLikeIcon(e.target);
    } else {
        loginWithTwitter();
    }
    e.stopPropagation();
}

function updateLikeCount(parent) {
    var gallery = document.getElementById('gallery');
    var index = Array.prototype.indexOf.call(gallery.childNodes,
                                             parent.parentElement);
    var countSpan = parent.children[parent.children.length - 1];
    var count = Number(countSpan.innerHTML.split(' ')[0]);

    var like = images[index].like;
    if (like.users && like.users[USER.uid] === true) {
        like.users[USER.uid] = null;
        countSpan.innerHTML = (count - 1) + ' liked';
    } else {
        if (!like.users) {
            like.users = {};
        }
        like.users[USER.uid] = true;
        countSpan.innerHTML = (count + 1) + ' liked';
    }
}

function updateAllLikeIcons() {
    var figureElems = document.getElementsByTagName('figure');

    if (!USER) return;
    for (let index in images) {
        var users = images[index].like.users;
        if (users && users[USER.uid] === true) {
            var iElem = figureElems[index].getElementsByTagName('i')[0];
            iElem.className = 'fa fa-heart';
        }
    }
    isUpdatedLikeIcons = true;
}

function toggleLikeIcon(iElem) {
    if (iElem.className === 'fa fa-heart-o') {
        iElem.className = 'fa fa-heart';
    } else {
        iElem.className = 'fa fa-heart-o';
    }
}

function createFigCaption(info) {
    var figCaption = document.createElement('figcaption');
    figCaption.className = 'label';
    figCaption.innerHTML =
        '<p>' + info.character + '</p>'
        + '<p>' + createLabelDate(info.date) + '</p>';
    return figCaption;
}

function createLikeButton(info) {
    var likeButton = document.createElement('i');
    likeButton.className = 'fa fa-heart-o';
    likeButton.addEventListener('click', onClickLike);
    return likeButton;
}

function createLikeCount(info) {
    var likeCount = document.createElement('span');
    likeCount.className = 'like-count';
    likeCount.innerHTML = info.like.count + ' liked';
    return likeCount;
}

function createShareButton(info) {
    var shareButton = document.createElement('i');
    shareButton.className = 'fa fa-twitter';
    shareButton.character = info.character;
    shareButton.addEventListener('click', onClickShare);
    return shareButton;
}

function createFigureElem(info, imgElem, imgUrl) {
    var figure = document.createElement('figure');
    figure.id = info.key;
    figure.className = 'pic-wrapper';
    figure.appendChild(imgElem);
    figure.setAttribute('data-src', imgUrl);
    figure.setAttribute('data-sub-html', '#lg-caption' + info.key);
    var text = encodeURIComponent(info.character + ' #ありたそ画展');
    figure.setAttribute('data-tweet-text', text);
    return figure;
}

function createLgCaption(info) {
    var lgCaption = document.createElement('div');
    lgCaption.id = 'lg-caption' + info.key;
    lgCaption.className = 'lg-caption';
    lgCaption.innerHTML =
        '<h3>' + info.character + '（' + info.original + '）' + '<br>'
        + '' + createLabelDate(info.date) + '</h3>';
    return lgCaption;
}

function createLabelDate(dateString) {
    var date = new Date(dateString);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return year + '年' + month + '月' + day + '日';
}
