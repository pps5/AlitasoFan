//================
// Fetch
//================
function fetchOriginals() {
    return new Promise(function(result) {
        firebase.database().ref('origin').once('value', function(snapshot) {
            let origins = snapshot.val();
            let originArray = [];
            for (let key in origins) {
                originArray.push(key);
            }
            result(originArray);
        });
    });
}

function fetchImageInfo() {

    return new Promise(function(result, error) {
        firebase.database().ref('/characters/')
            .orderByChild('timestamp')
            .once('value', function(snapshot) {
                values = [];
                snapshot.forEach(function(child) {
                    var v = child.val();
                    v['key'] = child.key;
                    values.push(v);
                });
                return result(values);
            }, error);
    });
}

//=================
// Put
//=================
function writeNewOriginal(originalName) {
    fetchOriginals().then(function(originals) {
        if (originals.indexOf(originalName) === -1) {
            firebase.database().ref('origin/' + originalName).set({
                name: originalName
            });
        }
    });
}

function writeImageData(fileName, character, original, selling) {
    var baseName = fileName.split('.')[0];
    var current = new Date();
    return firebase.database().ref('characters/' + baseName).set({
        character: character,
        original: original,
        date: current.toISOString(),
        selling_point: selling,
        like: 0
    });
}

//=================
// Update
//=================
function toggleLike(imageId, userId) {
    var ref = firebase.database().ref('characters').child(imageId).child('like');
    ref.transaction(like => {
        if (like) {
            if (like.users && like.users[userId]) {
                like.count--;
                like.users[userId] = null;
            } else {
                like.count++;
                if (!like.users) {
                    like.users = {};
                }
                like.users[userId] = true;
            }
            console.log(like.users);
        }

        return like;
    });
}
