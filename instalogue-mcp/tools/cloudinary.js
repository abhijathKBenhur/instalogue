import crypto from "crypto";

const CLOUD_NAME = "ideatribe";
const UPLOAD_FOLDER = "Instalogue/V2 posts";

/**
 * Upload an image to Cloudinary via its public URL.
 * Returns the secure_url of the uploaded image.
 */
export async function cloudinaryUpload({ image_url, public_id }) {
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error(
      "Missing CLOUDINARY_API_KEY or CLOUDINARY_API_SECRET — check your .env file"
    );
  }

  const timestamp = Math.round(Date.now() / 1000);

  // Build the params object used for signature generation (alphabetical order)
  const sigParams = { folder: UPLOAD_FOLDER, timestamp };
  if (public_id) sigParams.public_id = public_id;

  const paramString = Object.keys(sigParams)
    .sort()
    .map((k) => `${k}=${sigParams[k]}`)
    .join("&");

  const signature = crypto
    .createHash("sha1")
    .update(paramString + apiSecret)
    .digest("hex");

  // Build multipart form data
  const formData = new FormData();
  formData.append("file", image_url);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", UPLOAD_FOLDER);
  if (public_id) formData.append("public_id", public_id);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `Cloudinary upload failed: ${data.error?.message || JSON.stringify(data)}`
    );
  }

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            success: true,
            secure_url: data.secure_url,
            public_id: data.public_id,
            width: data.width,
            height: data.height,
            format: data.format,
          },
          null,
          2
        ),
      },
    ],
  };
}
