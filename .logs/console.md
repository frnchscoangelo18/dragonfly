# Homepage Mount Console Logs

Here are the extracted details from **image_2be00e.png** showing the console output during the initial homepage mount, including the URL context.

## 🌐 General Information
*   **Environment:** Local development
*   **URL:** `http://localhost:3000`
*   **Active Tab:** Console (Firefox Developer Tools)
*   **Tech Stack Context:** Next.js (indicated by the image LCP warning and `_next/static` asset paths) and React.

---

## 📝 Application Console Logs

The application is outputting standard development and authentication lifecycle events from `forward-logs-shared.ts`:

| Event Module | Message Details |
| :--- | :--- |
| **[HMR]** | `connected` (Hot Module Replacement is active) |
| **[bom]** | `sessionVersion effect: prev=0 curr=0 willClear=false` |
| **[auth]** | `event=INITIAL_SESSION userId=d9972bff-5d81-49e2-80cb-ba5edd4fb5c0` |
| **[auth]** | `event=SIGNED_IN userId=d9972bff-5d81-49e2-80cb-ba5edd4fb5c0` |
| **[bom]** | `sessionVersion effect: prev=0 curr=1 willClear=false` |

---

## ⚠️ Warnings & Errors

There are three main categories of warnings appearing during the mount:

*   **Source Map Errors (x3):** 
    *   The browser is failing to load source maps for React DevTools.
    *   Specifically, `installHook.js.map` is returning a 404 (Not Found) error, and `react_devtools_backend_compact.js.map` is throwing an error stating "map is undefined". These are safe to ignore as they only affect debugging tools, not the app itself.
*   **Largest Contentful Paint (LCP) Warning:**
    *   **Message:** `Image with src "/logo.jpg" was detected as the Largest Contentful Paint (LCP). Please add the loading="eager" property if this image is above the fold.`
    *   **Context:** This is a Next.js performance recommendation. If the logo is immediately visible when the page loads, it shouldn't be lazy-loaded. 
*   **Font Preload Warnings (x2):**
    *   **Message:** `The resource at "http://localhost:3000/_next/static/media/...woff2" preloaded with link preload was not used within a few seconds.`
    *   **Context:** Two `.woff2` font files are being preloaded in the `<head>`, but the CSS isn't applying them to the page quickly enough (or at all). Ensure the font-family names match what is actually being used in your stylesheets.



# Tab Switch / Window Refocus Console Logs

Here are the extracted details from **image_2be372.png** showing the console output when changing tabs and returning to the homepage, including the requested URL context.

## 🌐 General Information
*   **Environment:** Local development
*   **URL:** `http://localhost:3000`
*   **Active Tab:** Console (Firefox Developer Tools)

---

## 🔄 Lifecycle Event Loop

When the browser tab regains focus, the application triggers a repeating cycle of authentication and session state updates. All logs originate from `forward-logs-shared.ts:95:22`.

### Cycle 1
*   **[auth]** `event=SIGNED_IN userId=d9972bff-5d81-49e2-80cb-ba5edd4fb5c0`
*   **[bom]** `sessionVersion effect: prev=1 curr=2 willClear=true`
*   **[bom]** `clearProject react_stack_bottom_frame@http://localhost:3000/_next/static/chunks/node_modules_next_dist_compiled_react-dom_096_9a-..js:15087:22 -> runWithFiberInDEV@http://localhost:3000/_next/static/chunks/node_modules_next_dist_compiled_react-dom_096_9a-..js:965:131`

### Cycle 2
*   **[auth]** `event=SIGNED_IN userId=d9972bff-5d81-49e2-80cb-ba5edd4fb5c0`
*   **[bom]** `sessionVersion effect: prev=2 curr=3 willClear=true`
*   **[bom]** `clearProject react_stack_bottom_frame@http://localhost:3000/_next/static/chunks/...` *(same React DOM Fiber stack trace as above)*

### Cycle 3
*   **[auth]** `event=SIGNED_IN userId=d9972bff-5d81-49e2-80cb-ba5edd4fb5c0`
*   **[bom]** `sessionVersion effect: prev=3 curr=4 willClear=true`
*   **[bom]** `clearProject react_stack_bottom_frame@http://localhost:3000/_next/static/chunks/...` *(same React DOM Fiber stack trace as above)*

---

## 🔍 Key Observations

*   **Window Focus Re-authentication:** The `SIGNED_IN` auth event is firing every time the tab becomes active again.
*   **Session Versioning:** The `sessionVersion` increments by 1 with each refocus event (`prev=1 curr=2`, `prev=2 curr=3`, `prev=3 curr=4`).
*   **State Clearing:** Unlike the initial mount where `willClear=false`, returning to the tab sets `willClear=true`. This immediately triggers a `clearProject` action.
*   **React Fiber Trace:** The `clearProject` log exposes a Next.js development stack trace, showing it is being invoked through React's Fiber architecture (`runWithFiberInDEV`).



# BOM Page Mount Console Logs

Here are the extracted details from **image_2beef6.png** showing the console output when navigating to the `/bom` page.

## 🌐 General Information
*   **Environment:** Local development
*   **URL:** `http://localhost:3000/bom`
*   **Active Tab:** Console (Firefox Developer Tools)

---

## 📝 Application Console Logs

The console shows Next.js Fast Refresh events, indicating that modules were compiled or updated upon navigating to this route. All logs are being forwarded through `forward-logs-shared.ts:95:22`.

| Event Module | Message Details |
| :--- | :--- |
| **[Fast Refresh]** | `rebuilding` |
| **[Fast Refresh]** | `done in 112ms` |
| **[Fast Refresh]** | `rebuilding` |
| **[Fast Refresh]** | `done in 101ms` |

---

## 🔍 Key Observations

*   **Double Fast Refresh:** The Next.js Fast Refresh mechanism triggered twice consecutively upon navigating to the `/bom` route (taking 112ms and 101ms, respectively). This is standard behavior in React strict mode or development mode when loading a new page chunk, or when multiple client/server boundary components are being resolved.
*   **Clean Console:** Unlike the homepage mount and refocus events, there are no authentication loop triggers, session version updates, LCP warnings, or source map errors visible during this specific navigation event.



# BOM Page Tab Switch / Window Refocus Console Logs

Here are the extracted details from **image_2bf1e0.png** showing the console output when changing tabs and returning to the `/bom` page.

## 🌐 General Information
*   **Environment:** Local development
*   **URL:** `http://localhost:3000/bom`
*   **Active Tab:** Console (Firefox Developer Tools)

---

## 📝 Application Console Logs

Below the initial Fast Refresh logs (from when the page was first mounted), re-focusing the window triggers a new lifecycle event. All logs originate from `forward-logs-shared.ts:95:22`.

### Refocus Event Cycle
*   **[auth]** `event=SIGNED_IN userId=d9972bff-5d81-49e2-80cb-ba5edd4fb5c0`
*   **[bom]** `sessionVersion effect: prev=12 curr=13 willClear=true`
*   **[bom]** `clearProject react_stack_bottom_frame@http://localhost:3000/_next/static/chunks/node_modules_next_dist_compiled_react-dom_096_9a-..js:15087:22 -> runWithFiberInDEV@http://localhost:3000/_next/static/chunks/node_modules_next_dist_compiled_react-dom_096_9a-..js:965:131`

---

## 🔍 Key Observations

*   **Consistent Refocus Behavior:** Just like on the homepage, switching back to the `/bom` tab triggers an immediate `SIGNED_IN` authentication event.
*   **Session Progression:** The `sessionVersion` has progressed significantly (from the 0-4 range seen in previous screenshots up to `prev=12 curr=13`). This indicates that multiple state changes, tab switches, or hot reloads have likely occurred in the background.
*   **State Clearing Triggered:** The refocus event sets `willClear=true`, which again invokes the `clearProject` function through React's Fiber architecture, mirroring the exact behavior observed on the homepage.



# BOM Project Page Mount Console Logs

Here are the extracted details from **screenshot-20260714-002105.png**, **screenshot-20260714-002123.png**, and **screenshot-20260714-002131.png** showing the console output when mounting the dynamic project page.

## 🌐 General Information
*   **Environment:** Local development
*   **URL:** `http://localhost:3000/bom/proj-gen-1783949876049`
*   **Active Tab:** Console (Firefox Developer Tools)

---

## 📝 Application Console Logs

The logs show a complex component lifecycle originating from `forward-logs-shared.ts:95:22`. The execution can be broken down into three distinct phases:

### Phase 1: Strict Mode & Initial Fetch
The component mounts, unmounts, and remounts immediately, initiating the data fetch sequence.
*   **[page]** `mount`
*   **[page]** `loadEffect: needsFetch=true id=proj-gen-1783949876049 -> FETCHING`
*   **[page]** `recoveryEffect: needsFetch=true hasProjectInfo=false id=proj-gen-1783949876049 -> noop`
*   **[page]** `unmount`
*   **[page]** `mount`
*   *(Repeats initial fetch logs due to remount)*

### Phase 2: State Resolution & Hot Reload
The project data arrives, updating the local state, and a Fast Refresh is triggered.
*   **[page]** `recoveryEffect: needsFetch=true hasProjectInfo=true id=proj-gen-1783949876049 -> noop` *(State updated: hasProjectInfo is now true)*
*   **[page]** `loadEffect: complete -> setNeedsFetch(false)`
*   **[page]** `loadEffect: needsFetch=false id=proj-gen-1783949876049 -> SKIP`
*   **[page]** `recoveryEffect: needsFetch=false hasProjectInfo=true id=proj-gen-1783949876049 -> noop`
*   **[Fast Refresh]** `rebuilding`
*   **[Fast Refresh]** `done in 218ms`

### Phase 3: Effect Loop Runaway
Following the state resolution, the component enters a continuous, repeating loop.
*   **[page]** `loadEffect: complete -> setNeedsFetch(false)`
*   **[page]** `loadEffect: needsFetch=false id=proj-gen-1783949876049 -> SKIP`
*   **[page]** `loadEffect: needsFetch=false id=proj-gen-1783949876049 -> SKIP`
*   *(This sequence repeats endlessly through the rest of the screenshots)*

---

## 🔍 Key Observations

*   **React Strict Mode:** The immediate `mount` -> `unmount` -> `mount` pattern in the first screenshot confirms React Strict Mode is active, which intentionally double-invokes effects to help find bugs.
*   **Dynamic Routing:** The component is successfully parsing the dynamic route parameter, accurately capturing `proj-gen-1783949876049` as the ID for its fetch requests.
*   **Infinite Loop Warning:** There is a severe infinite re-render or effect loop happening. Even though `needsFetch` resolves to `false` (causing the actual data fetch to `SKIP`), the `loadEffect` is still being triggered constantly. This strongly indicates an issue with a `useEffect` dependency array—likely a non-memoized object, array, or function is being passed as a dependency, causing it to evaluate as "changed" on every render.


# BOM Project Page Tab Switch / Window Refocus Console Logs

Here are the extracted details from the console output when changing tabs and returning to the dynamic project page.

## 🌐 General Information
*   **Environment:** Local development.
*   **URL:** `http://localhost:3000/bom/proj-gen-1783949876049`.
*   **Active Tab:** Console (Firefox Developer Tools).

---

## 📝 Application Console Logs

The logs indicate a chain reaction caused by the window refocus event, which wipes the local state and forces a data refetch before falling back into the infinite loop seen previously. 

### Phase 1: Refocus & Global State Clear
Returning to the tab triggers the standard authentication and session increment cycle.
*   **[auth]** `event=SIGNED_IN userId=d9972bff-5d81-49e2-80cb-ba5edd4fb5c0`.
*   **[bom]** `sessionVersion effect: prev=18 curr=19 willClear=true`.
*   **[bom]** `clearProject` is executed via React Fiber, clearing the global/parent project state.

### Phase 2: Page-Level Reset & Refetch
Because the parent state was cleared, the page component recognizes it is missing project data.
*   **[page]** `recoveryEffect: needsFetch=false hasProjectInfo=false id=proj-gen-1783949876049 -> RESET`.
*   The `RESET` action forces `needsFetch` back to `true`, kicking off the fetching sequence.
*   **[page]** `loadEffect: needsFetch=true id=proj-gen-1783949876049 -> FETCHING`.
*   This is followed by several `recoveryEffect` logs tracking the transition of `hasProjectInfo` from `false` to `true`.

### Phase 3: Loop Resumption
Once the data is re-fetched and the state is restored, the component immediately falls back into the endless `loadEffect` cycle.
*   **[page]** `loadEffect: complete -> setNeedsFetch(false)`.
*   **[page]** `loadEffect: needsFetch=false id=proj-gen-1783949876049 -> SKIP`.
*   *(The `complete` and `SKIP` logs repeat continuously down the console)*.

---

## 🔍 Key Observations

*   **Cascading Updates:** The tab refocus doesn't just re-authenticate the user; it actively clears the active project state (`willClear=true`), which intentionally forces the dynamic route to completely reload its data from scratch (the `RESET` log).
*   **Persistent Loop:** The state reset temporarily breaks the effect loop to perform a real fetch, but as soon as `hasProjectInfo` resolves to `true`, the un-memoized dependency loop observed during the initial mount resumes immediately.
