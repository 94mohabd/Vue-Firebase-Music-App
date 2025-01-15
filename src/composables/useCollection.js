import { projectFirestore } from "../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { ref } from "vue"

const useCollection = (collec) => {
    const error = ref(null);
    const isPending = ref(false);

    const addDoct = async (doc) => {
        error.value = null;
        isPending.value = true;
        try {
            const res = await addDoc(collection(projectFirestore, collec), doc);
            isPending.value = false;
            return res;
        } catch (err) {
            console.log(err.message);
            error.value = "could not send the message";
            isPending.value = false;
        }
    }
    return { error, addDoct, isPending }
}

export default useCollection