<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Avoid runtime error
- avoid using `any` type in TypeScript, as it can lead to runtime errors and make debugging difficult. Use specific types or interfaces instead.
- only use `any` as a last resort when you cannot determine the type, and document why it is necessary.

