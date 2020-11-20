const { Topic } = require("../models/topics-model");
// Build a list of ancestor topics, returns an array
const buildAncestors = (parentTopic) => {
  console.log("building ancestors");
  try {
    const { _id, title, slug } = parentTopic;
    const ancestors = [...parentTopic.ancestors];
    ancestors.unshift({ _id, title, slug });
    return ancestors;
  } catch (err) {
    console.log("buildAncestors error");
    return err;
  }
};

exports.buildAncestors = buildAncestors;
