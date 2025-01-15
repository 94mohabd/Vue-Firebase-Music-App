import { projectFirestore } from "../firebase/config";
import { doc, onSnapshot } from "firebase/firestore";
import { ref, watchEffect } from "vue";

const getDocument = (collection, id) => {
    const document = ref(null);
    const error = ref(null);

    const documentRef = doc(projectFirestore, collection, id);

    const unsub = onSnapshot(documentRef, doc => {
        if (doc.data()) {
            document.value = { ...doc.data(), id: doc.id };
            error.value = null;
        } else {
            error.value = "that document does not exist";
        }
    }, (err) => {
        console.log(err.message);
        error.value = "could not fetch data";
    });

    watchEffect((onInvalidate) => {
        onInvalidate(() => unsub())
    });

    return { error, document };
};

export default getDocument;
