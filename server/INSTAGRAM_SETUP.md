# Instagram Graph API setup (for Quick Post)

The Quick Post admin section posts the uploaded image to Instagram via Meta's
Graph API. This needs a chain of Meta setup — there is no single "API key".
Without `IG_USER_ID` + `IG_ACCESS_TOKEN`, posting is **skipped** and the store is
saved with an empty `postURL` (everything else still works).

## What you need

| Requirement | Notes |
|---|---|
| Instagram **Business** or **Creator** account | Personal accounts cannot publish via API |
| A **Facebook Page** linked to that IG account | Permissions flow through the Page |
| A **Meta Developer App** | https://developers.facebook.com/ → add "Instagram Graph API" |
| Permissions `instagram_business_basic`, `instagram_business_content_publish` | The publish permission needs **App Review (~2–4 weeks)** for accounts beyond your own admin/test account |
| **Long-lived (60-day) access token** → `IG_ACCESS_TOKEN` | Must be refreshed before it expires |
| **IG Business Account ID** → `IG_USER_ID` | Fetched from the linked Page |

## Step-by-step

### 1. Account + Page
- In the Instagram app: Settings → Account type → switch to **Business** or **Creator**.
- In Facebook: create/choose a Page and link the Instagram account
  (Page Settings → Linked Accounts → Instagram).

### 2. Meta app
- Create an app at https://developers.facebook.com/apps/ (type: Business).
- Add the **Instagram Graph API** / **Instagram** product.
- Note the **App ID** and **App Secret**.

### 3. Get a User access token
- Use the Graph API Explorer (Tools → Graph API Explorer) or implement the
  Facebook Login OAuth flow. Request scopes:
  `instagram_business_basic,instagram_business_content_publish,pages_show_list`.
- Exchange the short-lived token (~1h) for a **long-lived** one (60 days):
  ```
  GET https://graph.facebook.com/v21.0/oauth/access_token
      ?grant_type=fb_exchange_token
      &client_id={app-id}
      &client_secret={app-secret}
      &fb_exchange_token={short-lived-token}
  ```
  The returned `access_token` → `IG_ACCESS_TOKEN`.

### 4. Get IG_USER_ID
- Find your Page ID:
  ```
  GET https://graph.facebook.com/v21.0/me/accounts?access_token={token}
  ```
- Then read the linked IG business account:
  ```
  GET https://graph.facebook.com/v21.0/{page-id}
      ?fields=instagram_business_account&access_token={token}
  ```
  `instagram_business_account.id` → `IG_USER_ID`.

### 5. Configure
- Put both values in `server/.env` (`IG_USER_ID`, `IG_ACCESS_TOKEN`).
- Restart the server. Quick Post will now publish and store the real `postURL`.

## How posting works in code
`server/routes/catalogueAPI.js` → `postToInstagram()`:
1. `POST /{ig-user-id}/media` with `image_url` (the Cloudinary URL) + `caption` → container id
2. `POST /{ig-user-id}/media_publish` with `creation_id` → media id
3. `GET /{media-id}?fields=permalink` → stored as `postURL`

Limits: max 50 published posts per 24h. Image must be a public URL (Cloudinary
provides this, which is why Cloudinary upload runs first).
