const CATEGORY_EMOJI = {
  ACCESSORIES: "👜",
  CLOTHING: "👗",
  CULINARY: "🍽️",
  FOOTWEAR: "👟",
  HOMEDECOR: "🏡",
  JEWELLERY: "💎",
  KIDS: "🧸",
  PETS: "🐾",
  SELFCARE: "✨",
  UTILITY: "🔧",
};

/**
 * Generate an Instagram caption for Abhijath's redirector post.
 * Phase 1: returns formatted text for manual posting.
 * Phase 2: will call the Graph API directly.
 */
export async function prepareInstagramPost({
  handle,
  storeName,
  category,
  subCategory,
  keywords = [],
}) {
  const cleanHandle = handle.startsWith("@") ? handle : `@${handle}`;
  const displayName = storeName || handle.replace(/^@/, "");
  const emoji = CATEGORY_EMOJI[category?.toUpperCase()] || "🛍️";

  const subcatLabel = subCategory
    ? subCategory.charAt(0).toUpperCase() + subCategory.slice(1).toLowerCase()
    : category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

  const hashtags = [
    ...keywords.map((k) => `#${k.toLowerCase().replace(/\s+/g, "")}`),
    "#instalogue",
    "#instagramstore",
    "#shopsmall",
    `#${category.toLowerCase()}`,
  ].join(" ");

  const caption = `${emoji} ${displayName} — ${subcatLabel}

Found a lovely ${subcatLabel.toLowerCase()} store you'll love! Go follow ${cleanHandle} 👆

Tap the link in my bio to discover more hidden Instagram stores on Instalogue ✨

${hashtags}`;

  return {
    content: [
      {
        type: "text",
        text: [
          `📸 Caption ready for @${displayName}:`,
          ``,
          `---`,
          caption,
          `---`,
          ``,
          `Next steps:`,
          `1. Post the store's image to your Instagram account`,
          `2. Paste this caption`,
          `3. Once live, copy the post URL and run instalogue_add_store (or update the existing record) with the real postURL`,
        ].join("\n"),
      },
    ],
  };
}
