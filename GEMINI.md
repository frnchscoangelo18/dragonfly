<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Avoid runtime error
- avoid using `any` type in TypeScript, as it can lead to runtime errors and make debugging difficult.
- Use specific types or interfaces instead.

# Error handling
- dont cut the error message short
- show the real error to help with debugging

# backend creation
- when creating an api route, decouple it to lib/[module]/server.ts that contins the business logic
- lib/[module]/client.ts that contains the client logic that calls the api.
- The api route should only call the server.ts file and return the result to the client.
