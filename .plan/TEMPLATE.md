# Plan Template

Use this template for all project plans. Each plan must be self-contained — a
fresh session must be able to read `.plan/PLAN.md` and execute without any prior
conversation context.

---

## Plan: [Title]

### Context
- **Repository**: `[repo name]` at `[root path]`
- **Branch**: `[branch name]`
- **Relevant files** (absolute paths + line ranges):
  - `[path/to/file.tsx]:L1-L100` — what it does, why it matters
- **Key architecture facts**: provider tree, data flow, state ownership
- **How to reproduce the bug**: step-by-step

### Goal
A single clear sentence describing the desired end state.

### Problem & Fix Table

| # | Problem | Root Cause | Fix | File:Line |
|---|---------|-----------|-----|-----------|
| 1 | ... | ... | ... | `path:line` |
| 2 | ... | ... | ... | `path:line` |

### Phases

Each phase must be independently testable.

#### Phase N: [Name]

**Files to modify**: `[path]`, `[path]`

**Changes**:
1. `[file]:line` — `[old code summary]` → `[new code summary]`
2. `[file]:line` — `[old code summary]` → `[new code summary]`

**Verification**: `[command or manual check]`

### Checklist

- [ ] Phase 1: ...
- [ ] Phase 2: ...
- [ ] Phase 3: ...

### What NOT To Do

- Don't [specific anti-pattern to avoid]
- Don't [another anti-pattern]
