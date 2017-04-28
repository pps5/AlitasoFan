(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var riot = (typeof window !== "undefined" ? window['riot'] : typeof global !== "undefined" ? global['riot'] : null);
module.exports = riot.tag2('gallery', '<select id="order" onchange="{onChanged}"> <option value="newer">新しい順</option> <option value="older">古い順</option> <option value="like">いいね順</option> </select> <div id="lg-container"> <div each="{item in items}" class="flex-item"> <figure id="{item.key}" class="pic-wrapper" data-sub-html="#lg-caption{item.key}" data-src="{this.getURL(item.key)}" data-tweet-text="{this.getTweetText(item.character)}"> <img class="picture" riot-src="{this.getURL(item.key)}"> <figcaption class="label"> <p>{item.character}</p> <p>{this.getDateString(item.timestamp)}</p> </figcaption> <div id="lg-caption{item.key}" class="lg-caption"> <h3> {item.character}（{item.original}）<br> {this.getDateString(item.timestamp)} </h3> </div> <i class="{this.getLikeClass(item.like.users)}" onclick="{like}"></i> <i class="fa fa-twitter" onclick="{share}"></i> <span class="like-count">{item.like.count} liked</span> </figure> </div>', '', '', function(opts) {
var _this = this;
this.BASE_PIC_URL = 'https://firebasestorage.googleapis.com/v0/b/alitasofan.appspot.com/o/images%2F';
this.URL_SELF = 'https://pps5.github.io/AlitasoFan/';
this.URL_TWEET = 'https://twitter.com/intent/tweet?text=';
document.addEventListener('onAuthStateChanged', function (event) {
    _this.user = event.detail.user;
    _this.update();
});
document.addEventListener('onGalleryItemsChanged', function (event) {
    _this.items = event.detail.items;
});
this.getOrgOrder = function (data) {
    var orgOrder = [];
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var item = data_1[_i];
        orgOrder.push(item.key);
    }
    return orgOrder;
};
this.getDateString = function (timestamp) {
    var date = new Date(timestamp);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return year + '年' + month + '月' + day + '日';
};
this.getURL = function (key) {
    return _this.BASE_PIC_URL + key + '?alt=media';
};
this.getTweetText = function (character) {
    return encodeURIComponent(character + ' #ありたそ画展');
};
this.getLikeClass = function (likeUsers) {
    if (_this.user && likeUsers && likeUsers[_this.user.uid]) {
        return 'fa fa-heart';
    }
    else {
        return 'fa fa-heart-o';
    }
};
this.share = function (event) {
    event.preventDefault();
    var item = event.item.item;

    var tweetURL = encodeURIComponent(_this.URL_SELF + '#lg=1&slide=');
    var slidenum = _this.orgOrder.indexOf(_this.orgOrder.find(function (elem, idx, array) {
        return elem === item.key;
    }));

    var text = _this.getTweetText(item.character);
    window.open(_this.URL_TWEET + text + '&url=' + tweetURL + slidenum);
    event.stopPropagation();
};
this.like = function (event) {
    var like = event.item.item.like;
    if (_this.user) {
        document.dispatchEvent(new CustomEvent('toggleLikeRequest', {
            detail: { item: event.item.item }
        }));
    }
    else {
        document.dispatchEvent(new CustomEvent('loginRequest', {
            detail: { item: event.item.item }
        }));
    }
    event.stopPropagation();
};
this.onChanged = function (event) {
    var value = event.target.value;
    if (value === 'newer') {
        _this.sort('timestamp', false);
    }
    else if (value === 'older') {
        _this.sort('timestamp', true);
    }
    else if (value === 'like') {
        _this.sort('timestamp', false);
        _this.sort('like', false);
    }
};
this.sort = function (key, isAsc) {
    if (isAsc) {
        var num_a = 1;
        var num_b = -1;
    }
    else {
        var num_a = -1;
        var num_b = 1;
    }
    _this.items.sort(function (a, b) {
        var x, y;
        if (key === 'like') {
            x = a[key]['count'];
            y = b[key]['count'];
        }
        else {
            x = a[key];
            y = b[key];
        }
        if (x > y)
            return num_a;
        if (x < y)
            return num_b;
        return 0;
    });
};
this.user = opts.user;
this.orgOrder = this.getOrgOrder(opts.items);
this.items = opts.items;
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
(function (global){
var riot = (typeof window !== "undefined" ? window['riot'] : typeof global !== "undefined" ? global['riot'] : null);
module.exports = riot.tag2('topbar', '<ul class="nav"> <li>ありたそ画展</li> <li show="{is_alitaso}"><a href="post.html">画像投稿</a></li> <li id="loggedin" show="{this.isLoggedIn()}"> <img riot-src="{this.getPhotoURL()}" onclick="{toggle}"> </li> <li show="{!this.isLoggedIn()}" id="login"> <span><i class="fa fa-twitter"></i>Login</span> </li> </ul> <ul show="{dropdown}" class="dropdown-content"> <li>{this.getDisplayName()}</li> <li class="logout" onclick="{logout}">Logout</li> </ul>', 'topbar { width: 100%; position: absolute; top: 0; left: 0; overflow: auto; margin: 0; padding: 0; } topbar .nav,[data-is="topbar"] .nav{ list-style-type: none; margin: 0; padding: 0; overflow: hidden; background-color: #333; } topbar .nav li,[data-is="topbar"] .nav li{ display: inline-block; padding: 20px 16px; color: #f2f2f2; font-size: 20px; } topbar .nav li a,[data-is="topbar"] .nav li a{ color: #f2f2f2; } topbar #login,[data-is="topbar"] #login,topbar #loggedin,[data-is="topbar"] #loggedin{ cursor: pointer; padding: 9px 16px; float: right; } topbar #loggedin img,[data-is="topbar"] #loggedin img{ width: 40px; } topbar #login i,[data-is="topbar"] #login i{ padding: 10px 5px; } topbar .dropdown-content,[data-is="topbar"] .dropdown-content{ position: fixed; top: 55px; right: 10px; margin: 0; padding: 10px 30px; background-color: #f9f9f9; border-radius: 4px; box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2); z-index:1; list-style-type: none; } topbar .dropdown-content li,[data-is="topbar"] .dropdown-content li{ padding: 10px; } topbar .dropdown-content .logout:hover,[data-is="topbar"] .dropdown-content .logout:hover{ background-color: #eee; } topbar .dropdown-content .logout,[data-is="topbar"] .dropdown-content .logout{ cursor: pointer; }', '', function(opts) {
var _this = this;
this.is_alitaso = opts.isAlitaso;
this.user = opts.user;
this.dropdown = false;
document.addEventListener('click', function (event) {
    if (_this.dropdown) {
        _this.dropdown = false;
        _this.update();
    }
});
document.addEventListener('onAuthStateChanged', function (event) {
    _this.user = event.detail.user;
    if (event.detail.isAlitaso) {
        _this.is_alitaso = true;
    }
    else {
        _this.is_alitaso = false;
    }
    _this.update();
});
this.getPhotoURL = function () {
    if (_this.user)
        return _this.user.photoURL;
    else
        return '';
};
this.getDisplayName = function () {
    if (_this.user)
        return _this.user.displayName;
    else
        return '';
};
this.toggle = function (event) {
    _this.dropdown = !_this.dropdown;
    event.stopPropagation();
};
this.isLoggedIn = function () {
    if (_this.user)
        return true;
    else
        return false;
};
this.logout = function (event) {
    console.log(event);
    document.dispatchEvent(new CustomEvent('logoutRequest'));
};
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1,2]);
