import { Cloudinary } from "@cloudinary/url-gen";

const cloudinaryInstance = new Cloudinary({
    cloud: {
        cloudName: process.env.VUE_APP_CLOUDINARY_CLOUD_NAME,
    },
});

console.log(cloudinaryInstance);
export { cloudinaryInstance };