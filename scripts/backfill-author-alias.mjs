import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error(
    "Missing MONGODB_URI. Run with: node --env-file=.env.local scripts/backfill-author-alias.mjs",
  );
  process.exit(1);
}

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB.");

  const projects = mongoose.connection.collection("projects");

  // Existing projects predating the authorAlias field have no such key.
  // Backfill them with an empty string so the data is consistent; the app
  // already defaults missing values to "" at read time, so this is non-breaking.
  const result = await projects.updateMany(
    { authorAlias: { $exists: false } },
    { $set: { authorAlias: "" } },
  );

  console.log(
    `Backfilled ${result.modifiedCount} existing project(s) with authorAlias: "".`,
  );

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
