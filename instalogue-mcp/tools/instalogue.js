const BASE_URL = "https://instalogue-server.vercel.app/api";

function getPassword() {
  return process.env.INSTALOGUE_PASSWORD || "itsmeaddy";
}

/**
 * Verify that the Instalogue API is reachable and the password is correct.
 */
export async function instalogueAuth() {
  const response = await fetch(`${BASE_URL}/authenticate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: getPassword() }),
  });

  const data = await response.json();

  return {
    content: [
      {
        type: "text",
        text: response.ok
          ? `✅ Instalogue API connected — ${data.message}`
          : `❌ Auth failed — ${data.error}`,
      },
    ],
    isError: !response.ok,
  };
}

/**
 * Submit a new store to Instalogue.
 * keywords should be a comma-separated string: "candy,sweets,dessert"
 */
export async function instalogueAddStore({
  storeName,
  category,
  subCategory,
  thumbnailURL,
  postURL,
  keywords = "",
}) {
  const body = {
    storeName,
    category,
    subCategory,
    thumbnailURL,
    postURL,
    keywords,
    password: getPassword(),
  };

  const response = await fetch(`${BASE_URL}/addStore`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      content: [
        {
          type: "text",
          text: `❌ Failed to add store: ${data.error || data.message}`,
        },
      ],
      isError: true,
    };
  }

  return {
    content: [
      {
        type: "text",
        text: [
          `✅ Store added to Instalogue!`,
          ``,
          `  Name:        ${storeName}`,
          `  Category:    ${category} > ${subCategory}`,
          `  Thumbnail:   ${thumbnailURL}`,
          `  Post URL:    ${postURL || "(not set — update once posted)"}`,
          `  Keywords:    ${keywords || "(none)"}`,
        ].join("\n"),
      },
    ],
  };
}

/**
 * List recent stores to verify the latest submission.
 */
export async function instalogueListStores({ limit = 9, category } = {}) {
  const body = { limit };
  if (category) body.selectedCategory = category;

  const response = await fetch(`${BASE_URL}/getStores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Failed to list stores: ${data.error}`);
  }

  const rows = data.data.map(
    (s) =>
      `• ${s.storeName.padEnd(30)} ${s.category.padEnd(12)} > ${(s.subCategory || "").padEnd(20)} ${
        s.thumbnailURL ? "🖼" : "  "
      } ${s.postURL ? "🔗" : "  "}`
  );

  return {
    content: [
      {
        type: "text",
        text: `Recent stores (${data.data.length}):\n\n${rows.join("\n")}`,
      },
    ],
  };
}
