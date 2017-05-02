import * as firebase from 'firebase';
import { Promise } from 'es6-promise';

import { ImageInfo } from './imageinfo';

const IS_TESTING = false;
var characterRef = IS_TESTING ? '/test/' : '/characters/';

export class FirebaseDB {

    public static fetchOriginals(): Promise<Array<string>> {
        return new Promise<Array<string>>((result) => {
            firebase.database().ref('origin').once('value', (snapshot: any) => {
                var origins = snapshot.val();
                var originArray: Array<string> = [];
                for (let key in origins) {
                    originArray.push(key);
                }
                result(originArray);
            });
        });
    }

    public static fetchImageInfo(): Promise<Array<ImageInfo>> {
        return new Promise((result, error) => {
            var ref = firebase.database().ref(characterRef);
            ref.orderByChild('timestamp').once('value', (snapshot) => {
                var values = [];
                snapshot.forEach((child) => {
                    var v = child.val();
                    v['key'] = child.key;
                    values.unshift(v);
                    return false; // for each all
                });
                result(values);
            }, (error) => {
                console.dir(error);
            });
        });
    }

    public static isAlitaso(): Promise<any> {
        return new Promise<any>((resolve, error) => {
            firebase.database().ref('alitasoauth').once('value', resolve, error);
        });
    }

    public static writeNewOriginal(originalName): void {
        this.fetchOriginals().then((originals) => {
            if (originals.indexOf(originalName) === -1) {
                firebase.database().ref('origin').child(originalName).set({
                    name: originalName
                });
            }
        });
    }

    public static writeImageData(fileName: string, character: string,
                          original: string, selling: string): firebase.Promise<any> {
        var baseName: string = fileName.split('.')[0];
        var current: Date = new Date();
        var data: ImageInfo = {
            character: character,
            original: original,
            key: baseName,
            selling_point: selling,
            date: current.toISOString(),
            timestamp: current.getTime(),
            like: {
                count: 0,
                users: null
            }
        }
        return firebase.database().ref(characterRef).child(baseName).set(data);
    }

    public static toggleLike(imageId, userId): void {
        var ref = firebase.database().ref(characterRef).child(imageId).child('like');
        ref.transaction((like) => {
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
             }
            return like;
       });
    }
}