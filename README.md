# Canvy

**A quieter way to design.**

| | Link |
|---|---|
| Frontend | [canvyy.vercel.app](https://canvyy.vercel.app/) |
| Backend API | [canvy.onrender.com](https://canvy.onrender.com) |
| Health Check | [canvy.onrender.com/health](https://canvy.onrender.com/health) |

---

## Overview

Canvy is a browser-based canvas editor for composing shapes, text, and freehand drawings. The editor is fully functional without an account. Authentication is deferred until the user needs to persist their work.

The project is split into two independently deployable units: a Next.js frontend and an Express REST API backed by MongoDB.

---

## Features

### Element Library

Seven element types are supported, each with type-specific properties and dedicated controls in the properties panel:

| Type | Properties | Keyboard Shortcut |
|---|---|---|
| Rectangle | Position, width, height, rotation, fill color | `R` |
| Circle | Position, radius, rotation, fill color | `C` |
| Ellipse | Position, radiusX, radiusY, rotation, fill color | `E` |
| Triangle | Position, radius, rotation, fill color | `Y` |
| Star | Position, inner/outer radius, point count (3–20), rotation, fill color | `S` |
| Text | Position, content, font size (presets S/M/L/XL + custom px), width, rotation, fill color | `T` |
| Pen (freehand) | Multi-point stroke path, stroke color, stroke width (presets S/M/L/XL + custom px) | `P` |

All shape elements support fill colors via an 11-color preset grid and an unrestricted color picker. Pen strokes support independent stroke color and stroke width controls. Color values are stored as hex strings with full RGBA support (8-character hex codes).

### Selection and Transformation

- Bounding-box selection via Konva Transformer, with visual handles for resize and rotate.
- Free-form dragging with canvas boundary clamping (drag bounds are computed from the element's client rect to prevent shapes from being dragged off-canvas).
- Per-element-type transform normalization: scale values from the Konva Transformer are converted into stored dimensions (width/height, radius, radiusX/radiusY, inner/outer radius, or point coordinates) before being written to state. The node's scale is reset to 1 after every transform, keeping the persisted data model clean and predictable.
- Rotation stored in degrees, editable both via direct manipulation and the properties panel numeric input.
- Live size indicator overlay showing the computed dimensions of the currently selected element.

### Freehand Drawing

- Dedicated pen tool mode (`P` to activate, `V` to return to select).
- Continuous point capture on pointer move, stored as a flat `[x, y, x, y, …]` coordinate array.
- Bézier-smoothed rendering using Konva's `tension: 0.5` with round line caps and joins.
- Configurable stroke color and width, adjustable both before drawing (via pen settings panel) and after (via per-element stroke controls).
- Drawn strokes are draggable, selectable, and transformable like any other element.

### Undo / Redo

- Snapshot-based history: every mutation (add, move, transform, property change, delete) pushes the previous element array onto a `past` stack.
- Redo stack is cleared on any new mutation, maintaining a linear history.
- Keyboard shortcuts: `Ctrl+Z` / `Cmd+Z` for undo, `Ctrl+Shift+Z` / `Cmd+Shift+Z` for redo.
- Toolbar buttons with disabled states reflecting `canUndo` / `canRedo`.
- Pen drawing records the pre-draw snapshot on stroke start; intermediate point additions during active drawing do not create individual history entries.

### Layer Ordering

Elements are rendered in array order. The rendering stack is deterministic: later elements in the array appear on top. Layer reordering is managed through the element array.

### Canvas Persistence

- Save triggers an authenticated `POST /api/v1/canvases` (create) or `PUT /api/v1/canvases/:id` (update) depending on whether a canvas ID exists in local state.
- Real-time save status indicator in the top bar: `idle`, `Unsaved changes`, `Saving…`, `Saved` (with checkmark), or `Failed to save`.
- Unsaved change tracking covers both element mutations and canvas name changes. The `hasUnsavedChanges` flag is set on any mutation and cleared on successful save.
- Browser `beforeunload` warning is activated whenever unsaved changes exist, preventing accidental navigation away.
- The saved canvas list refreshes on each successful save (via an incrementing refresh token) so the "My canvases" panel always reflects the latest state.

### Canvas Management

- **My Canvases panel**: slide-out panel listing all user-owned canvases, sorted by `updatedAt` descending. Each entry shows the canvas name, dimensions, and last update date.
- **Open**: loads a saved canvas into the editor, replacing the current state and resetting the undo/redo history.
- **New**: resets the editor to a blank canvas with the default name "Untitled canvas", clearing the canvas ID and all history.
- **Delete**: removes a canvas from the backend with optimistic UI removal from the list. Delete failures leave the row in place so the user can retry.
- **Inline rename**: the canvas name is an editable text input in the top bar, tracked separately from saved state for dirty detection.

### Deep Linking

Saved canvases are addressable at `/editor/:id`. The route loads the canvas from the API on mount and places it directly into the editor. This allows canvases to be bookmarked or shared via URL.

### Export

- PNG export via Konva's `toDataURL` with `pixelRatio: 2` for high-DPI output.
- Before capture, the current selection is cleared so the Transformer handles are not rendered into the exported image. Selection is restored after capture.
- The downloaded file is named after the current canvas name.

### Authentication

- Google OAuth via `@react-oauth/google` on the frontend; the Google ID token is sent to the backend for server-side verification.
- Backend verifies the token using Google's `OAuth2Client`, extracts the profile, and performs an upsert on the `User` collection (find by `googleId`, create if not found).
- On successful login, the backend issues a JWT (`jsonwebtoken`) with a configurable expiry. The token is stored in the browser via a `token` utility module (localStorage).
- Session restoration on page load: if a token exists, `GET /api/v1/auth/me` is called to validate it. On 401, the token is automatically cleared.
- The login modal is triggered on save attempts by unauthenticated users. After successful authentication, the pending save continues automatically via a `useRef` flag.
- The modal is dismissible via the close button, backdrop click, or `Escape` key, without affecting the editor state.

### Properties Panel

Context-sensitive right panel that adapts to the current tool and selection:

- **No selection**: shows an instructional empty state.
- **Pen tool active** (no element selected): shows global pen settings (stroke color, stroke width) that apply to new strokes.
- **Element selected**: shows type-specific controls:
  - Position (X, Y) for all types.
  - Width/Height for rectangles and text.
  - Radius for circles and triangles.
  - RadiusX/RadiusY for ellipses.
  - Inner radius, outer radius, and point count for stars.
  - Rotation (degrees) for all types.
  - Text content and font size (with S/M/L/XL presets and slider) for text elements.
  - Fill color (preset grid + picker) for non-pen elements.
  - Stroke color and stroke width (preset grid + picker + slider) for pen elements.

### Toolbar (Dock)

Framer Motion-powered dock with magnification effect on hover (items scale from 40px to 60px based on pointer proximity). Organized into three sections separated by visual dividers:

1. **Tool modes**: Select (`V`), Pen (`P`).
2. **Shape creation**: Rectangle (`R`), Circle (`C`), Text (`T`), Ellipse (`E`), Triangle (`Y`), Star (`S`). Each switches to select mode and spawns the element at canvas center.
3. **Actions**: Delete (disabled when no selection).

Shortcut badges are displayed on each dock item.

### Landing Page

A multi-section marketing page with:

- **Nav**: minimal top bar with the Canvy brand and anchor links.
- **Hero**: headline, subheadline, CTA button, and an interactive Konva demo canvas with pre-placed shapes.
- **PrinciplesStrip**: value proposition highlights.
- **ProductShowcase**: feature walkthrough.
- **InteractionStory**: narrative interaction section.
- **Footer**: links and attribution.

### Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `V` | Switch to Select tool |
| `P` | Switch to Pen tool |
| `R` | Add rectangle |
| `C` | Add circle |
| `T` | Add text |
| `E` | Add ellipse |
| `Y` | Add triangle |
| `S` | Add star |
| `Delete` / `Backspace` | Delete selected element |
| `Ctrl+Z` | Undo |
| `Ctrl+Shift+Z` | Redo |

All keyboard shortcuts are suppressed when focus is in a text input or textarea.

---

## Architecture

```text
canvy/
├── client/                         Next.js 15 (App Router)
│   ├── app/                        Pages and layout
│   │   ├── page.tsx                Landing page
│   │   ├── editor/page.tsx         Editor (new canvas)
│   │   └── editor/[id]/page.tsx    Editor (load saved canvas)
│   ├── components/
│   │   ├── auth/                   LoginModal
│   │   ├── canvases/               MyCanvasesPanel
│   │   ├── core/                   Dock (Framer Motion magnification)
│   │   ├── editor/                 Editor, CanvasStage, ShapeNode,
│   │   │                           PropertiesPanel, EditorDock,
│   │   │                           SaveStatusLabel
│   │   └── landing/                Hero, Nav, Footer, ProductShowcase,
│   │                               PrinciplesStrip, InteractionStory,
│   │                               DemoCanvasStage
│   ├── hooks/
│   │   ├── useAuth.tsx             Auth context provider + hook
│   │   ├── useEditorState.ts       Element CRUD, undo/redo, drawing
│   │   └── useUnsavedChangesWarning.ts
│   ├── lib/
│   │   ├── api.ts                  Generic fetch wrapper with envelope parsing
│   │   ├── authApi.ts              Auth-specific API calls
│   │   ├── canvasApi.ts            Canvas CRUD API calls
│   │   └── token.ts                localStorage token management
│   └── types/
│       ├── auth.ts                 User type
│       └── canvas.ts               CanvasElement, Canvas, SaveStatus
│
└── server/                         Express 5 (ESM)
    └── src/
        ├── app.js                  Express app, CORS, routes, error handling
        ├── server.js               HTTP listener + MongoDB connection
        ├── auth/
        │   ├── auth.routes.js      POST /google, GET /me
        │   ├── auth.controller.js
        │   ├── auth.service.js     Google token verification, JWT issuance, user upsert
        │   ├── auth.validation.js  Zod schema for login
        │   └── user.model.js       Mongoose User schema
        ├── canvas/
        │   ├── canvas.routes.js    CRUD routes for /canvases
        │   ├── canvas.controller.js
        │   ├── canvas.service.js   Business logic + ownership enforcement
        │   ├── canvas.model.js     Mongoose Canvas + Element schemas
        │   └── canvas.validationSchema.js  Zod discriminated union for all 7 element types
        ├── middleware/
        │   ├── authenticate.js     JWT verification + user hydration
        │   ├── validateBody.js     Zod schema validation middleware
        │   ├── errorHandler.js     Centralized error formatting
        │   └── notFound.js         404 catch-all
        ├── config/
        │   └── db.js               MongoDB connection
        └── utils/
            └── ApiError.js         Custom error class
```

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend framework | Next.js (App Router) | 15 |
| UI library | React | 19 |
| Canvas rendering | Konva + react-konva | 10 / 19 |
| Animations | Framer Motion | 13 |
| Language | TypeScript | 5.7 |
| Styling | CSS Modules | — |
| Backend framework | Express | 5 |
| Database | MongoDB via Mongoose | 9 |
| Validation | Zod | 4 |
| Authentication | Google OAuth + JWT | — |
| Analytics | Vercel Analytics | 2 |
| Deployment | Vercel (frontend) + Render (backend) | — |

---

## API Reference

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/google` | No | Exchange a Google ID token for a JWT |
| `GET` | `/api/v1/auth/me` | Bearer | Return the authenticated user profile |

### Canvases

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/v1/canvases` | Bearer | Create a new canvas |
| `GET` | `/api/v1/canvases` | Bearer | List all canvases for the authenticated user (without elements) |
| `GET` | `/api/v1/canvases/:id` | Bearer | Fetch a single canvas with all elements |
| `PUT` | `/api/v1/canvases/:id` | Bearer | Update a canvas (partial updates supported) |
| `DELETE` | `/api/v1/canvases/:id` | Bearer | Delete a canvas |

All responses follow a consistent envelope:

```json
{
  "success": true | false,
  "data": { ... } | null,
  "message": "...",
  "errors": []
}
```

Request validation is performed via Zod schemas in the `validateBody` middleware. The canvas create/update schemas enforce a discriminated union across all 7 element types, with type-specific field requirements (e.g., `radius` is required for circles, `points` is required for pen strokes with a minimum length of 4).

---

## Engineering Decisions

### Guest editing before authentication

The editor loads without any API calls. All editor state is managed client-side in React state. This keeps the first interaction focused on the canvas itself. Authentication is only surfaced when the user clicks "Save", and the pending save continues automatically after login completes.

### Transform normalization

Konva's Transformer operates on `scaleX` / `scaleY`, not on stored dimensions. If the scale values were persisted directly, the data model would be a mix of base dimensions and scaling factors, making the saved state unpredictable. Instead, every `onTransformEnd` handler converts the scale back into the element's native properties (width, height, radius, etc.) and resets the node's scale to 1.

### Separation of editing and persistence

The `useEditorState` hook contains zero API logic. It manages elements, selection, undo/redo, and drawing as a pure state machine. Persistence is handled in the `Editor` component by calling API functions from `canvasApi.ts`. This means the editor works identically whether the user is a guest or authenticated.

### Canvas ownership enforcement

Every canvas query in the service layer filters by both `_id` and `owner`. A user cannot read, update, or delete another user's canvas, even if they know the canvas ID.

### Centralized error handling

The backend uses a single `errorHandler` middleware that normalizes all errors (Mongoose `ValidationError`, `CastError`, `JsonWebTokenError`, `TokenExpiredError`, Zod failures, and custom `ApiError` instances) into a consistent JSON envelope. The frontend's `sendRequest` function consumes this envelope uniformly.

### Input validation at both layers

Request bodies are validated by Zod schemas in Express middleware before reaching the controller. The frontend API client also types its responses generically, and 401 errors trigger automatic token cleanup.

---

## Local Development

### Server

```bash
cd server
npm install
cp .env.example .env
```

Required environment variables:

```text
MONGODB_URI
JWT_SECRET
GOOGLE_CLIENT_ID
CORS_ORIGIN
JWT_EXPIRES_IN
```

```bash
npm run dev
# API available at http://localhost:5000/api/v1
```

### Client

```bash
cd client
npm install
cp .env.example .env.local
```

Required environment variables:

```text
NEXT_PUBLIC_API_URL
NEXT_PUBLIC_GOOGLE_CLIENT_ID
```

`NEXT_PUBLIC_` prefix is required because these values are consumed in client-side code and must be bundled by Next.js.

```bash
npm run dev
# Frontend available at http://localhost:3000
```

---

## Routes

| Route | Page |
|---|---|
| `/` | Landing page |
| `/editor` | New guest editor (blank canvas) |
| `/editor/:id` | Load a saved canvas by ID |

---

## Deployment

The frontend and backend are deployed independently:

- **Frontend**: Vercel (automatic deployments from the `client/` directory).
- **Backend**: Render (Node.js service from the `server/` directory).

For production, ensure:

1. The backend `CORS_ORIGIN` is set to the exact Vercel deployment URL.
2. The Google Cloud Console has the production URL listed as an authorized JavaScript origin.
3. The frontend `NEXT_PUBLIC_API_URL` points to the Render deployment URL.

---

## Author

**Priyansh Soni**

[GitHub](https://github.com/priyansh00soni) · [LinkedIn](https://www.linkedin.com/in/priyansh00soni/)