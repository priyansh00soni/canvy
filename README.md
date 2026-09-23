# 🎨 CANVY

### A quieter way to design.

**Live Links:**
- Frontend: [https://canvyy.vercel.app/](https://canvyy.vercel.app/)
- Backend API: [https://canvy.onrender.com](https://canvy.onrender.com)
- Backend Health Check: [https://canvy.onrender.com/health](https://canvy.onrender.com/health)

A small browser-based design editor for creating simple canvases with rectangles, circles, and text.

Edit as a guest without an account. Sign in with Google only when you want to save your work.

---

## What is Canvy?

Canvy is a lightweight canvas editor built around a simple idea: designing should not require a complicated workflow.

The editor runs directly in the browser and supports the core operations needed to create a simple composition:

- Add rectangles, circles, and text
- Select and move elements
- Resize and rotate elements
- Edit element properties
- Delete elements
- Save canvases when signed in
- Open saved canvases through direct links

Guest editing is intentionally available without authentication. Authentication is only introduced when persistence is required.

---

## Core Flow

```text
                    ┌─────────────────┐
                    │   Landing Page  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   Open Editor   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Edit as Guest  │
                    │                 │
                    │  • Shapes       │
                    │  • Text         │
                    │  • Selection    │
                    │  • Transform    │
                    └────────┬────────┘
                             │
                         Save canvas
                             │
                             ▼
                    ┌─────────────────┐
                    │ Google Sign-In  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Saved Canvas    │
                    │                 │
                    │ • Open          │
                    │ • List          │
                    │ • Delete        │
                    │ • Direct link   │
                    └─────────────────┘
```

---

## Project Structure

```text
canvy/
├── client/                         Next.js frontend
│   ├── app/                        App Router pages
│   ├── components/                 UI and editor components
│   ├── hooks/                      Editor and authentication state
│   ├── lib/                        API clients and token handling
│   └── types/                      Shared TypeScript types
│
└── server/                         Express backend
    ├── controllers/
    ├── routes/
    ├── models/
    ├── middleware/
    └── ...
```

The frontend is responsible for the editor experience and canvas rendering. The backend handles authentication and canvas persistence.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Canvas | Konva, react-konva |
| Backend | Node.js, Express |
| Database | MongoDB |
| Authentication | Google OAuth |
| Styling | CSS Modules |
| API | REST |

---

## Key Engineering Decisions

### 1. Guest editing before authentication

Creating a canvas does not require an account.

This keeps the first interaction focused on the editor rather than authentication. Google sign-in is requested only when the user needs to persist a canvas.

### 2. Canvas rendering with Konva

The editor uses Konva through `react-konva` for interactive canvas rendering.

This provides the primitives needed for:

- Shapes
- Text
- Selection
- Dragging
- Resizing
- Rotation
- Transform handling

The editor state remains separate from the rendering layer, making changes to the canvas model easier to manage.

### 3. Transform values are normalized before saving

Konva's transformer represents resizing through scale values.

Before an element is persisted, the scale is converted into its stored dimensions. This keeps the saved canvas model predictable instead of storing a mixture of dimensions and temporary transform state.

### 4. Persistence is separate from editing

The editor can operate without making API requests.

Canvas persistence is handled separately through the frontend API layer, allowing the editing experience to remain usable even before authentication or saving is involved.

### 5. Direct canvas links

Saved canvases can be opened directly through:

```text
/editor/:id
```

The route loads the corresponding canvas and places it into the editor rather than requiring the user to navigate through a separate dashboard first.

---

## Core Behavior

- Create rectangles, circles, and text
- Select and manipulate elements
- Move, resize, and rotate elements
- Edit element properties
- Delete elements
- Maintain editor state and history
- Save canvases through the backend
- List saved canvases
- Open saved canvases
- Delete saved canvases
- Load canvases from direct links
- Warn before leaving with unsaved changes
- Edit as a guest without requiring API access

---

## Backend Contract

The frontend communicates with the backend through the `/api/v1` API.

Successful responses use the existing response envelope:

```json
{
  "success": true,
  "data": {}
}
```

Errors expose the backend message and may include field-level error information.

The frontend API layer keeps request handling separate from UI components so authentication and canvas operations do not have to be implemented directly inside the editor.

---

## Google OAuth

Canvy uses a Google OAuth web client for authentication.

For local development, the frontend origin should be configured as an authorized JavaScript origin:

```text
http://localhost:3000
```

The Google client ID is used by both the frontend and backend.

Authentication is only required for operations that need a persisted user-owned canvas.

---

## Local Development

### Server

```bash
cd server
npm install
cp .env.example .env
```

Configure the required environment variables:

```text
MONGODB_URI
JWT_SECRET
GOOGLE_CLIENT_ID
```

Then start the server:

```bash
npm run dev
```

The API is available at:

```text
http://localhost:5000/api/v1
```

### Client

```bash
cd client
npm install
cp .env.example .env.local
```

Configure:

```text
NEXT_PUBLIC_GOOGLE_CLIENT_ID
```

Then start the frontend:

```bash
npm run dev
```

The frontend is available at:

```text
http://localhost:3000
```

---

## Routes

| Route | Purpose |
|---|---|
| `/` | Landing page |
| `/editor` | New guest editor |
| `/editor/:id` | Open a saved canvas directly |

---

## Canvas Model

A canvas is composed of editable elements.

The current editor supports:

```text
Rectangle
Circle
Text
```

Each element maintains the properties required to render and edit it, including its position, dimensions, rotation, and relevant visual properties.

The editor state manages these elements while the API layer handles persistence.

---

## Deployment

The project is structured for a separate frontend and backend deployment.

A typical deployment setup is:

```text
Next.js frontend
       │
       ▼
Express API
       │
       ▼
MongoDB
```

For production, configure the backend CORS origin to the exact deployed frontend URL.

The frontend also needs the production Google OAuth origin configured in the Google Cloud project.

---

## Known Limitations

Canvy intentionally keeps its scope small.

The current editor focuses on basic canvas composition rather than trying to become a full design suite.

It does not currently aim to provide:

- Complex vector editing
- Collaboration
- Real-time multiplayer editing
- Advanced typography controls
- Image editing
- Complex layer management
- Full design-system tooling

The goal is a focused editing experience rather than a large collection of loosely connected features.

---

## Author

**Priyansh Soni**

[GitHub](https://github.com/priyansh00soni) · [LinkedIn](https://www.linkedin.com/in/priyansh00soni/)

Drop a 🌟 if you found this useful.