import { projectAuth } from "../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { updateProfile } from "firebase/auth";
import { ref } from "vue";

const error = ref(null);
const isPending = ref(false);

const signup = async (email, password, displayName) => {
    error.value = null;
    isPending.value = true;
    try {
        const res = await createUserWithEmailAndPassword(projectAuth, email, password);
        if (!res) {
            throw new Error("Could not complete the signup");
        }
        await updateProfile(res.user, { displayName });
        error.value = null;
        isPending.value = false;
        return res;
    } catch (err) {
        error.value = err.message;
        console.log(err.message);
        isPending.value = false;
    }
}

const useSignup = () => {
    return { error, signup, isPending }
}

export default useSignup;