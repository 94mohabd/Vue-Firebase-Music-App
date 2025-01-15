import { ref } from "vue";
import getUser from "@/composables/getUser"
import CryptoJS from "crypto-js";

const { user } = getUser();

const useCloudinary = () => {
    const error = ref(null);
    const uploadedUrl = ref(null);
    const filePath = ref(null);

    const uploadImage = async (file) => {
        error.value = null; // Reset error before upload
        uploadedUrl.value = null; // Reset uploaded URL
        filePath.value = `covers/${user.value.uid}`;

        if (!file) {
            error.value = "No file selected.";
            return;
        }

        // Prepare form data
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
            "upload_preset",
            process.env.VUE_APP_CLOUDINARY_UPLOAD_PRESET // Unsigned preset
        );
        formData.append("folder", filePath.value);
        try {
            // Upload to Cloudinary
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.VUE_APP_CLOUDINARY_CLOUD_NAME}/image/upload/`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();
            filePath.value = data.public_id;
            if (data.secure_url) {
                uploadedUrl.value = data.secure_url;
            } else {
                throw new Error("Failed to upload image.");
            }
        } catch (err) {
            error.value = err.message;
        }
    };

    const deleteImage = async (publicId) => {
        error.value = null; // Reset error before delete

        if (!publicId) {
            error.value = "No public ID provided for deletion.";
            return;
        }

        // Cloudinary configuration
        const cloudName = process.env.VUE_APP_CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.VUE_APP_CLOUDINARY_API_KEY;
        const apiSecret = process.env.VUE_APP_CLOUDINARY_API_SECRET;

        const timestamp = Math.floor(Date.now() / 1000);
        const signature = CryptoJS.SHA1(
            `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`
        ).toString();

        try {
            // Make API call to delete image
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        public_id: publicId,
                        timestamp,
                        signature,
                        api_key: apiKey,
                    }),
                }
            );

            const data = await response.json();

            if (data.result !== "ok") {
                throw new Error(data.error?.message || "Failed to delete image.");
            }
        } catch (err) {
            error.value = err.message;
            console.log(err.message);
        }
    };

    return { uploadImage, deleteImage, filePath, uploadedUrl, error };
};

export default useCloudinary;
