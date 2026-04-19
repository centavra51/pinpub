# Pin Publisher Lite

A simple, manual Pinterest publishing tool for original content. Connect your Pinterest account, select a board, upload your image, and publish your Pin — all through a clean, user-initiated workflow.

> **Note:** This app is designed for legitimate, manual publication of original content to your own Pinterest boards. No automation, no scraping, no bulk posting.

---

## Features

- **Pinterest OAuth Integration** — Secure account connection via Pinterest's OAuth 2.0 flow
- **Board Selection** — Browse and select from your own Pinterest boards
- **Manual Pin Publishing** — Create and publish Pins one at a time with explicit confirmation
- **Image Upload** — Drag-and-drop or click-to-upload with preview
- **Content Rights Confirmation** — Required checkbox before every publish action
- **Clean, Compliant UI** — Professional design suitable for platform review

---

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **API:** Pinterest API v5
- **Auth:** Pinterest OAuth 2.0 with cookie-based session management

---

## Setup

### 1. Prerequisites

- Node.js 18+ installed
- A Pinterest Developer account and app credentials

### 2. Clone & Install

```bash
cd pin-publisher-lite
npm install
```

### 3. Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
PINTEREST_CLIENT_ID=your_pinterest_app_id
PINTEREST_CLIENT_SECRET=your_pinterest_app_secret
PINTEREST_REDIRECT_URI=http://localhost:3000/api/auth/callback
SESSION_SECRET=generate-a-random-secret-string-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Pinterest App Configuration

1. Go to [Pinterest Developer Portal](https://developers.pinterest.com/apps/)
2. Create a new app or select your existing app
3. Under **OAuth Settings**, add the redirect URI:
   ```
   http://localhost:3000/api/auth/callback
   ```
4. Note your **App ID** and **App Secret**
5. Request the following scopes: `boards:read`, `pins:read`, `pins:write`, `user_accounts:read`

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── connect/route.ts     # OAuth start (redirects to Pinterest)
│   │   │   ├── callback/route.ts    # OAuth callback (token exchange)
│   │   │   ├── disconnect/route.ts  # Logout / disconnect account
│   │   │   └── session/route.ts     # Session status check
│   │   ├── boards/route.ts          # Fetch user's boards
│   │   └── pins/route.ts            # Create a Pin
│   ├── dashboard/page.tsx           # Dashboard with boards and connection status
│   ├── create/page.tsx              # Create Pin form and success state
│   ├── layout.tsx                   # Root layout with Header, Footer, SessionProvider
│   ├── page.tsx                     # Landing / Home page
│   └── globals.css                  # Global styles
├── components/
│   ├── BoardSelector.tsx            # Board dropdown with loading/error states
│   ├── Footer.tsx                   # App footer with compliance notice
│   ├── Header.tsx                   # App header with navigation
│   ├── ImageUpload.tsx              # Drag-and-drop image uploader
│   └── SessionProvider.tsx          # React context for session management
└── lib/
    ├── pinterest.ts                 # Pinterest API service layer
    └── session.ts                   # Cookie-based session management
```

---

## Where to Insert Real Pinterest API Details

All Pinterest API interactions are centralized in **`src/lib/pinterest.ts`**:

| Function               | Endpoint                    | Purpose                              |
| ---------------------- | --------------------------- | ------------------------------------ |
| `getAuthorizationUrl`  | Pinterest OAuth URL builder | Constructs the OAuth consent URL     |
| `exchangeCodeForToken` | `POST /v5/oauth/token`      | Exchanges auth code for access token |
| `refreshAccessToken`   | `POST /v5/oauth/token`      | Refreshes expired tokens             |
| `getUserAccount`       | `GET /v5/user_account`      | Fetches connected user profile       |
| `getBoards`            | `GET /v5/boards`            | Lists user's boards with pagination  |
| `createPin`            | `POST /v5/pins`             | Creates a new Pin with base64 image  |

The code uses the **Pinterest API v5** endpoints. If Pinterest updates their API, modify only this file.

---

## OAuth Flow

1. User clicks **Connect Pinterest** → `GET /api/auth/connect`
2. Server redirects to Pinterest OAuth consent screen
3. User authorizes the app on Pinterest
4. Pinterest redirects to `/api/auth/callback?code=...`
5. Server exchanges the code for an access token via Pinterest API
6. Server stores the token in a secure HTTP-only cookie
7. User is redirected to `/dashboard?connected=true`

---

## Suggested Demo Flow for Pinterest Review

Use this script when recording a demo video for Pinterest platform review:

### Step 1 — Show the Homepage
- Open the app at `http://localhost:3000`
- Show the clean landing page with the app name, subtitle, and "How it works" steps
- Point out the compliance trust banner at the bottom

### Step 2 — Connect Pinterest
- Click the **Connect Pinterest** button
- Show that the app initiates a standard Pinterest OAuth flow

### Step 3 — OAuth Authorization
- Complete the OAuth consent on Pinterest's page
- Show that you are authorizing **your own account**

### Step 4 — Connected Dashboard
- After redirect, show the Dashboard page
- Point out: connection status indicator (green dot + username)
- Point out: the compliance notice card
- Show the list of your Pinterest boards

### Step 5 — Board Selection
- Click on one of your boards (or use the dropdown on the create page)
- Show that boards are fetched directly from your Pinterest account

### Step 6 — Create Pin Form
- Navigate to the **Create New Pin** page
- Upload an original image (drag-and-drop or click)
- Show the image preview
- Fill in: Pin title, description, destination URL
- Select a board from the dropdown

### Step 7 — Manual Publish
- Check the content rights confirmation checkbox
- Point out the notice: *"Each Pin is published only after explicit user confirmation."*
- Click **Publish Pin**
- Show the loading state

### Step 8 — Success Result
- Show the success screen with:
  - "Pin published successfully" message
  - Publication details (title, board, timestamp, Pin ID)
  - **View on Pinterest** link
  - API response in the collapsible panel

### Key Points to Emphasize in Demo
- Every action is manually initiated by the user
- No bulk posting or automation features
- Content rights confirmation is required
- The app only connects to the user's own account
- Clean, professional, minimal interface

---

## License

Private — built for Pinterest Developer Platform integration review.
