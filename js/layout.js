function toggleNav() {
    var x = document.getElementById('globalnav');
    if (x.className === 'topnav') {
        x.className += ' responsive';
    } else {
        x.className = 'topnav';
    }
}
