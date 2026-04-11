export default {
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".js"],
  transform: {},

  // prevents breaking import.meta files
  testEnvironmentOptions: {
    customExportConditions: ["node", "node-addons"],
  },
};