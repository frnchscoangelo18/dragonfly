import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI. Run with: node --env-file=.env.local scripts/seed-test-title.mjs");
  process.exit(1);
}

const projectSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    time: { type: String, required: true },
    tag: { type: String, required: true },
    userId: { type: String },
    isPublic: { type: Boolean, default: false },
    author: {
      name: { type: String, default: "" },
      email: { type: String, default: "" },
      visible: { type: Boolean, default: false },
    },
    components: { type: [Object], default: [] },
    nodes: { type: [Object], default: [] },
    edges: { type: [Object], default: [] },
    substitutes: { type: [Object], default: [] },
    specsReport: { type: Object, default: null },
    alerts: { type: [Object], default: [] },
  },
  { _id: false, versionKey: false },
);

const Project = mongoose.model("Project", projectSchema);

const longTitle =
  "test - A Very Long Project Title That Should Definitely Exceed Two Lines in the Dropdown and Trigger the Show More Collapsible Feature for Testing Purposes";

const projectId = "test-long-title-project";
const project = {
  _id: projectId,
  name: longTitle,
  time: new Date().toISOString(),
  tag: "Robotics",
  isPublic: true,
  author: { name: "Test User", email: "test@example.com", visible: true },
  components: [],
  nodes: [],
  edges: [],
  substitutes: [],
  specsReport: null,
  alerts: [],
};

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB.");

  await Project.findOneAndUpdate({ _id: projectId }, project, {
    upsert: true,
    returnDocument: "after",
  });
  console.log(`Created test project "${projectId}" with long title.`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});