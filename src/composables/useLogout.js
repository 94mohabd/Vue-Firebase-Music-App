import { projectAuth } from "../firebase/config";
import { signOut } from "firebase/auth";
import { ref } from "vue";

const error = ref(null);
const isPending = ref(false);

const logout = async () => {
    error.value = null;
    isPending.value = true;
    try {
        await signOut(projectAuth);
        error.value = null;
        isPending.value = false;
    } catch (err) {
        error.value = err.message;
        console.log(err.message);
        isPending.value = false;
    }

}

const useLogout = () => {
    return { error, logout, isPending }
}

export default useLogout;