const express = require("express");
const router = express.Router();

const IG_GRAPH_VERSION = "v21.0";

// Post an image (already hosted at a public URL) to Instagram via the Graph API.
// Returns the post permalink, or "" when IG credentials are not configured.
async function publishToInstagram(imageUrl, caption) {
  const igUserId = process.env.IG_USER_ID;
  const accessToken = process.env.IG_ACCESS_TOKEN;
  if (!igUserId || !accessToken) {
    return ""; // Instagram posting not configured — skip gracefully.
  }

  const isIgToken = accessToken.startsWith("IG");
  const host = isIgToken ? "https://graph.instagram.com" : "https://graph.facebook.com";
  const base = `${host}/${IG_GRAPH_VERSION}`;
  const targetUserId = isIgToken && (!igUserId || !/^\d+$/.test(igUserId)) ? "me" : igUserId;

  // 1. Create a media container.
  const createRes = await fetch(`${base}/${targetUserId}/media`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image_url: imageUrl, caption, access_token: accessToken }),
  });
  const createData = await createRes.json();
  if (!createRes.ok || !createData.id) {
    throw new Error(
      `Instagram container creation failed: ${JSON.stringify(createData)}`
    );
  }

  const creationId = createData.id;

  // 2. Poll container status until it's ready to publish.
  for (let i = 0; i < 10; i++) {
    const statusRes = await fetch(
      `${base}/${creationId}?fields=status_code,status&access_token=${accessToken}`
    );
    const statusData = await statusRes.json();
    const statusCode = statusData?.status_code;

    if (statusCode === "FINISHED") {
      break;
    } else if (statusCode === "ERROR") {
      throw new Error(
        `Instagram media container processing failed: ${JSON.stringify(statusData)}`
      );
    }
    // If IN_PROGRESS or pending, wait 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // 3. Publish the container (with retry loop for transient 'Media not ready' subcode 2207027).
  let publishData;
  let publishRes;
  for (let attempt = 0; attempt < 5; attempt++) {
    publishRes = await fetch(`${base}/${targetUserId}/media_publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creation_id: creationId, access_token: accessToken }),
    });
    publishData = await publishRes.json();

    if (publishRes.ok && publishData.id) {
      break;
    }

    // Subcode 2207027: Media is not ready to publish yet
    if (publishData?.error?.error_subcode === 2207027 && attempt < 4) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      continue;
    }

    throw new Error(`Instagram publish failed: ${JSON.stringify(publishData)}`);
  }

  // 4. Fetch the permalink for the published post.
  const permaRes = await fetch(
    `${base}/${publishData.id}?fields=permalink&access_token=${accessToken}`
  );
  const permaData = await permaRes.json();
  return permaData.permalink || "";
}

const postToInstagram = async (req, res) => {
  console.log("postToInstagram: ", req.body);
  const { imageUrl, caption } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ success: false, error: "imageUrl is required" });
  }

  try {
    const postURL = await publishToInstagram(imageUrl, caption || "");
    return res.status(200).json({ success: true, postURL });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error: error.message });
  }
};

router.post("/postImage", postToInstagram);

module.exports = router;
module.exports.publishToInstagram = publishToInstagram;
