import { projectAuth } from "../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ref } from "vue";

const error = ref(null);
const isPending = ref(false);

const login = async (email, password) => {
    error.value = null;
    isPending.value = true;
    try {
        const res = await signInWithEmailAndPassword(projectAuth, email, password);
        error.value = null;
        isPending.value = false;
        return res;
    } catch (err) {
        error.value = "Incorect login credentials";
        console.log(err.message);
        isPending.value = false;
    }

}

const useLogin = () => {
    return { error, login, isPending }
}

export default useLogin;