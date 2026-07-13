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

  // Migrate from flat authorAlias to structured author object.
  // - non-empty authorAlias → author.name with visible: true
  // - empty/missing authorAlias → default author (name: "", visible: false)
  // The authorAlias field is then unset since it is no longer used.
  const result = await projects.updateMany(
    { author: { $exists: false } },
    [
      {
        $set: {
          author: {
            name: "$authorAlias",
            email: "",
            visible: { $cond: [{ $ne: ["$authorAlias", ""] }, true, false] },
          },
        },
      },
      { $unset: "authorAlias" },
    ],
  );

  console.log(
    `Migrated ${result.modifiedCount} project(s) from authorAlias → author.`,
  );

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
