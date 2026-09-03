import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { cloudinaryUpload } from "./tools/cloudinary.js";
import {
  instalogueAuth,
  instalogueAddStore,
  instalogueListStores,
} from "./tools/instalogue.js";
import { prepareInstagramPost } from "./tools/instagram.js";
import "dotenv/config";

const server = new Server(
  { name: "instalogue-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// ─── Tool definitions ─────────────────────────────────────────────────────────

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "cloudinary_upload",
      description:
        "Upload an image to Cloudinary (cloud: ideatribe, folder: Instalogue/V2 posts). " +
        "Accepts a public image URL. Returns the secure_url to use as thumbnailURL.",
      inputSchema: {
        type: "object",
        properties: {
          image_url: {
            type: "string",
            description: "Public URL of the image to upload",
          },
          public_id: {
            type: "string",
            description:
              "Optional custom filename. Defaults to Cloudinary auto-generated ID.",
          },
        },
        required: ["image_url"],
      },
    },
    {
      name: "instalogue_auth",
      description:
        "Verify that the Instalogue API is reachable and credentials are correct. " +
        "Run this first before any store submission.",
      inputSchema: {
        type: "object",
        properties: {},
        required: [],
      },
    },
    {
      name: "instalogue_add_store",
      description:
        "Submit a new store to Instalogue. " +
        "All fields except postURL are required. " +
        "postURL can be set after the Instagram post is live.",
      inputSchema: {
        type: "object",
        properties: {
          storeName: {
            type: "string",
            description: "Instagram handle without @ (e.g. cottoncandystation)",
          },
          category: {
            type: "string",
            description:
              "Must be one of: ACCESSORIES, CLOTHING, CULINARY, FOOTWEAR, HOMEDECOR, JEWELLERY, KIDS, PETS, SELFCARE, UTILITY",
          },
          subCategory: {
            type: "string",
            description: "Sub-category within the category (e.g. SWEETS)",
          },
          thumbnailURL: {
            type: "string",
            description: "Cloudinary secure_url returned by cloudinary_upload",
          },
          postURL: {
            type: "string",
            description:
              "URL of Abhijath's Instagram post for this store. Use empty string if not yet posted.",
          },
          keywords: {
            type: "string",
            description:
              "Comma-separated keywords with no spaces (e.g. candy,sweets,dessert)",
          },
        },
        required: [
          "storeName",
          "category",
          "subCategory",
          "thumbnailURL",
          "postURL",
        ],
      },
    },
    {
      name: "instalogue_list_stores",
      description:
        "List recent stores in Instalogue. Use after a submission to confirm it was saved.",
      inputSchema: {
        type: "object",
        properties: {
          limit: {
            type: "number",
            description: "Number of stores to return (default 9, max 50)",
          },
          category: {
            type: "string",
            description: "Filter by category (optional)",
          },
        },
        required: [],
      },
    },
    {
      name: "prepare_instagram_post",
      description:
        "Generate a formatted caption for Abhijath's Instagram post that redirects followers to this store. " +
        "Returns the caption text and a reminder of next steps.",
      inputSchema: {
        type: "object",
        properties: {
          handle: {
            type: "string",
            description: "The store's Instagram handle (with or without @)",
          },
          storeName: {
            type: "string",
            description:
              "Display name (defaults to handle if omitted)",
          },
          category: {
            type: "string",
            description: "Store category",
          },
          subCategory: {
            type: "string",
            description: "Store sub-category",
          },
          keywords: {
            type: "array",
            items: { type: "string" },
            description: "Keywords as an array (e.g. [\"candy\", \"sweets\"])",
          },
        },
        required: ["handle", "category"],
      },
    },
  ],
}));

// ─── Tool dispatch ─────────────────────────────────────────────────────────────

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "cloudinary_upload":
        return await cloudinaryUpload(args);
      case "instalogue_auth":
        return await instalogueAuth();
      case "instalogue_add_store":
        return await instalogueAddStore(args);
      case "instalogue_list_stores":
        return await instalogueListStores(args);
      case "prepare_instagram_post":
        return await prepareInstagramPost(args);
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

// ─── Start ─────────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Instalogue MCP server running");
