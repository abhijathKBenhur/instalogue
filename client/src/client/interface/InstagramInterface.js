import AxiosInstance from "../wrapper/apiWrapper";
import CloudinaryInterface from "./cloudinaryInterface";

export const postImage = (payload) => {
  return AxiosInstance.post("/postImage", payload);
};

// Upload image to Cloudinary, then post to Instagram. Each step must succeed
// before the next runs; errors propagate to the caller.
export const uploadImage = async ({ image, handle }) => {
  const uploadRes = await CloudinaryInterface.uploadImage({ image });
  const thumbnailURL = uploadRes.data?.thumbnailURL;
  if (!thumbnailURL) {
    throw new Error("Cloudinary upload failed — no URL returned");
  }

  const storeName = handle || "";
  const postRes = await postImage({
    imageUrl: thumbnailURL,
    caption: `Click here to open the store page -> @${storeName}`,
  });

  return {
    data: {
      success: true,
      thumbnailURL,
      postURL: postRes.data?.postURL || "",
    },
  };
};

export const getProfileStats = () => {
  return AxiosInstance.get(
    "https://graph.instagram.com/me?fields=id,media_count&access_token=IGQVJYM3Nmc242THc3NTVyT21ENVF6N1dYVVdUTHEtNGR0aVgzNUZACSkdTWV80a2VPSHpiLUpyVHNQa0NjSXU2MF9pTEd3SXhhX3c0TkF1N2hGSEwxMlRkMFlDTDVpX3kwRE5fak9IQXNQT1VzSEVuYgZDZD"
  );
};

const InstagramInterface = {
  postImage,
  uploadImage,
  getProfileStats,
};

export default InstagramInterface;
