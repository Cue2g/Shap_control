import * as admin from 'firebase-admin';
const serviceAccount = require('../cred.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore()

export {db}