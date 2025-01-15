import { projectFirestore } from "../firebase/config";
import { query, collection, orderBy, onSnapshot, where } from "firebase/firestore";
import { ref, watchEffect } from "vue"

const getCollection = (collec, userId) => {
    const documents = ref(null);
    const error = ref(null);

    let collectionRef = query(collection(projectFirestore, collec), orderBy('createdAt'));

    if (userId) {
        collectionRef = query(
            collection(projectFirestore, collec),
            where('userId', '==', userId), // Filter by userId
            orderBy('createdAt') // Order by createdAt field
        );
    }

    const unsub = onSnapshot(collectionRef, snap => {
        let results = [];
        snap.docs.forEach(doc => {
            // must wait for the server to create the timestamp & send it back
            doc.data().createdAt && results.push({ ...doc.data(), id: doc.id })
        })
        documents.value = results;
        error.value = null;
    }, (err) => {
        console.log(err.message);
        documents.value = null;
        error.value = "could not fetch data";
    });

    watchEffect((onInvalidate) => {
        onInvalidate(() => unsub())
    })
    return { error, documents }
}

export default getCollection