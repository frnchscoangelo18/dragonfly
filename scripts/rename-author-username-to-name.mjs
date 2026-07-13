import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error(
    "Missing MONGODB_URI. Run with: node --env-file=.env.local scripts/rename-author-username-to-name.mjs",
  );
  process.exit(1);
}

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB.");

  const projects = mongoose.connection.collection("projects");

  const result = await projects.updateMany(
    { "author.username": { $exists: true } },
    [
      {
        $set: {
          "author.name": "$author.username",
        },
      },
      { $unset: "author.username" },
    ],
  );

  console.log(
    `Renamed ${result.modifiedCount} project(s) from author.username → author.name.`,
  );

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});