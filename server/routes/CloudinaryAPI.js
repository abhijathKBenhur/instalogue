const express = require("express");
const crypto = require("crypto");
const router = express.Router();

const CLOUDINARY_CLOUD_NAME = "ideatribe";
const CLOUDINARY_UPLOAD_FOLDER = "Instalogue/V2 posts";

// Upload a base64 data-URI image to Cloudinary using a signed upload.
// Mirrors the signing logic in instalogue-mcp/tools/cloudinary.js, but sends
// the image bytes (data-URI) instead of a remote URL string.
async function uploadToCloudinary(dataUri) {
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!apiKey || !apiSecret) {
    throw new Error(
      "Missing CLOUDINARY_API_KEY or CLOUDINARY_API_SECRET in server environment"
    );
  }

  const timestamp = Math.round(Date.now() / 1000);
  const sigParams = { folder: CLOUDINARY_UPLOAD_FOLDER, timestamp };
  const paramString = Object.keys(sigParams)
    .sort()
    .map((k) => `${k}=${sigParams[k]}`)
    .join("&");
  const signature = crypto
    .createHash("sha1")
    .update(paramString + apiSecret)
    .digest("hex");

  const formData = new FormData();
  formData.append("file", dataUri);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", CLOUDINARY_UPLOAD_FOLDER);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      `Cloudinary upload failed: ${data.error?.message || JSON.stringify(data)}`
    );
  }
  return data.secure_url;
}

// Image upload for the PostForm drag-and-drop field. Takes a base64 data-URI
// and uploads it to Cloudinary -> public secure_url (thumbnailURL).
// Instagram posting is handled separately via instagramAPI /postImage.
const uploadImage = async (req, res) => {
  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ success: false, error: "image is required" });
  }

  try {
    const thumbnailURL = await uploadToCloudinary(image);
    return res.status(200).json({ success: true, thumbnailURL });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error: error.message });
  }
};

router.post("/uploadImage", uploadImage);

module.exports = router;
