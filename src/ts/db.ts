import * as firebase from 'firebase';
import { Promise } from 'es6-promise';

export class FirebaseDB {

    constructor() {
        console.log('aaa');
    }

    public fetchOriginals(): Promise<Array<string>> {
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

    public fetchImageInfo() {
        return new Promise((result, error) => {
            var ref = firebase.database().ref('/characters/');
            ref.orderByChild('timestamp').once('value', (snapshot) => {
                var values = [];
                snapshot.forEach(() => boolean {

                }
                result(snapshot);
            }, (error) => {
                console.dir(error);
            });
        });
    }

}