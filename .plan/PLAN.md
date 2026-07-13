# Plan: Fix Infinite Loading on `/bom/[id]` After Tab Switch

## Context

- **Repository**: `dragonfly` at `/home/eger/Storage/projects/dragonfly`
- **Framework**: Next.js App Router (client components with `"use client"`)
- **State management**: React Context (`createContext` + `useContext`), no SWR/React Query

### Provider tree (root layout)

```
AuthProvider          <-- features/auth/store.tsx
  SettingsProvider
    BomProvider       <-- features/bom/store.tsx
      InspireProvider <-- features/inspire/store.tsx
        FlowProvider  <-- features/visual-flow/store.tsx
          CartProvider
            SheetProvider
              MobileShell
                {children}
```

### Key files

| File | Role |
|------|------|
| `app/bom/[id]/page.tsx` | **Buggy page**. Uses local `needsFetch` + context `projectInfo` to gate loading. |
| `features/bom/store.tsx` | **BomProvider context**. Contains `projectInfo`, `clearProject()`, `loadProjectById()`. Watches `sessionVersion` and clears state on identity change. |
| `features/auth/store.tsx` | **AuthProvider context**. Manages `sessionVersion`. `onAuthStateChange` bumps it on EVERY event (including `TOKEN_REFRESHED`). Also calls `router.refresh()` inside that handler. |
| `features/visual-flow/store.tsx` | **FlowProvider context**. Also watches `sessionVersion` but uses a `prevVersion` ref guard. |
| `features/inspire/store.tsx` | **InspireProvider context**. Watches `sessionVersion`, resets prompt/files. |

### Bug reproduction

1. Open `/bom/[id]` for any project (saved or dynamic)
2. Page loads normally — spinner appears, data renders
3. Switch to another browser tab and wait 5-10 seconds
4. Switch back to the Dragonfly tab
5. Infinite spinner — manual page reload required

### How other pages avoid this

| Page | Fetch mechanism | Why it recovers |
|------|----------------|----------------|
| `app/bom/page.tsx` | `useEffect` with `[requesterKey]` dep | Re-fetches `getAllProjects()` when auth state changes; doesn't use BOM context |
| `app/flow/page.tsx` | `useEffect` with `[requesterKey, ...]` + `[currentProject, ...]` | Re-fetches from server AND watches `currentProject` from context; auto-recovers when re-set |
| `app/bom/[id]/page.tsx` | `useEffect` with `[needsFetch, id, loadProjectById]` | **No `requesterKey`**. `needsFetch` is a one-shot flag set once at mount, never reset. **Only page affected.** |

---

## Goal

Make the BOM detail page resilient to `projectInfo` being cleared from context,
eliminating the infinite loading spinner when returning to the tab.

---

## Problem & Fix Table

| # | Problem | Root Cause | Fix | File:Line |
|---|---------|-----------|-----|-----------|
| 1 | `needsFetch` never resets after initial load | One-shot `useState` init: `() => !projectInfo \|\| projectInfo.id !== id`. After `.then(() => setNeedsFetch(false))`, it stays `false` forever. | Add a `useEffect` that watches `projectInfo` and resets `needsFetch = true` when `projectInfo` becomes null or mismatches the current `id`. | `app/bom/[id]/page.tsx:L78-L86` (after existing effect) |
| 2 | Auth store bumps `sessionVersion` on every Supabase event | `onAuthStateChange((_event, ...)` ignores the `_event` parameter. `TOKEN_REFRESHED` (fires on token refresh after tab inactivity) increments `sessionVersion`, which triggers `clearProject()` in BomProvider. | Filter events: only bump `sessionVersion` on `SIGNED_IN`, `SIGNED_OUT`, `USER_UPDATED`. Skip `INITIAL_SESSION`, `TOKEN_REFRESHED`. | `features/auth/store.tsx:L85-L101` |
| 3 | `router.refresh()` inside auth callback amplifies re-renders | `router.refresh()` is called on every auth event, causing RSC re-fetch and potential client component re-reconciliation. | Remove `router.refresh()` from the callback — it's unnecessary since the `sessionVersion` change already triggers downstream effects. | `features/auth/store.tsx:L100` |

---

## Phases

### Phase 1: Fix page component — recover from `projectInfo` being cleared

**Files to modify**: `app/bom/[id]/page.tsx`

**Changes**:
1. After the existing `useEffect` (current lines 78-86, which loads when `needsFetch` is true), add a new effect that watches `projectInfo`:
```tsx
// Watch for projectInfo being cleared externally and trigger re-fetch
useEffect(() => {
  if (!projectInfo && id && !needsFetch) {
    setNeedsFetch(true);
  }
}, [projectInfo, id, needsFetch]);
```

This covers:
- Context clearing (`clearProject()` called via `sessionVersion`)
- Navigation between BOMs where `id` changes but component stays mounted
- Any other edge case where `projectInfo` becomes null unexpectedly

**Verification**: Manual — reproduce the tab-switch bug and confirm no infinite spinner.

---

### Phase 2: Filter auth events to prevent unnecessary state clears

**Files to modify**: `features/auth/store.tsx`

**Changes**:
1. `L85`: Change `(_event, session)` to `(event, session)` (remove underscore prefix)
2. `L99`: Replace `setSessionVersion((v) => v + 1);` with:
```tsx
if (
  event === 'SIGNED_IN' ||
  event === 'SIGNED_OUT' ||
  event === 'USER_UPDATED'
) {
  setSessionVersion((v) => v + 1);
}
```
3. `L100`: Remove `router.refresh();` call entirely

This prevents `TOKEN_REFRESHED` and `INITIAL_SESSION` from bumping `sessionVersion`, which was the trigger that cleared the BOM store context.

**Verification**: Check that login/logout/switch-account still clears state properly. Check that tab-switching no longer causes state clears.

---

### Phase 3: Update BomProvider's sessionVersion guard (belt-and-suspenders)

**Files to modify**: `features/bom/store.tsx`

**Changes**:
1. `L185-L190`: Change the effect that watches `sessionVersion` to use a `prevVersion` ref guard (matching the Flow store pattern in `features/visual-flow/store.tsx:L64-L71`):
```tsx
const prevVersion = useRef(0);
useEffect(() => {
  if (prevVersion.current !== 0 && prevVersion.current !== sessionVersion) {
    clearProject();
  }
  prevVersion.current = sessionVersion;
}, [sessionVersion, clearProject]);
```

This prevents the first `sessionVersion` bump (0 → 1, which happens on `INITIAL_SESSION` before the page mounts) from calling `clearProject()` unnecessarily.

**Verification**: Same as Phase 2. The auth events should be the primary guard, but this ensures consistency with the Flow store's pattern.

---

## Checklist

- [ ] Phase 1: Add recovery `useEffect` to `app/bom/[id]/page.tsx`
- [ ] Phase 2: Filter auth events in `features/auth/store.tsx` (rename param, add event guard, remove `router.refresh()`)
- [ ] Phase 3: Add `prevVersion` ref guard to `features/bom/store.tsx` (align with Flow store pattern)
- [ ] Manual test: Tab switch no longer causes infinite spinner
- [ ] Manual test: Login/logout still clears identity-scoped state correctly
- [ ] Manual test: BOM list page unaffected
- [ ] Manual test: Flow page unaffected
- [ ] Manual test: Navigation between `/bom/X` and `/bom/Y` works (no stale data)
- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes

---

## What NOT To Do

- **Do NOT** add `requesterKey` or `useAuth` to the BOM detail page — the recovery effect (Phase 1) handles all scenarios without coupling the page to auth internals.
- **Do NOT** use `useEffect` cleanup or `AbortController` for the fetch in this fix — the issue is purely about state synchronization, not stale request handling.
- **Do NOT** refactor the store to use SWR/React Query — the user's goal is a targeted fix, not a re-architecture.
- **Do NOT** remove the existing `useEffect` that loads on `needsFetch` — the new effect works alongside it (sets `needsFetch = true`, the existing effect picks it up).
- **Do NOT** add any `visibilitychange` or `pageshow` event listeners — the fix should handle the symptom (desynced state), not chase browser behaviors.
- **Do NOT** introduce `any` types or `set-state-in-effect` eslint suppressions without a clear comment explaining why.
