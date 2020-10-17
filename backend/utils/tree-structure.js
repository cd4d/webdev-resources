const { Topic } = require("../models/topics-model");

const buildAncestors = async (id, parent_id) => {
  try {
    let parent_category = await Topic.findById(
      { _id: parent_id },
      "title slug ancestors"
    ).exec();
    if (parent_category) {
      const { _id, title, slug } = parent_category;
      const ancestor = [...parent_category.ancestors];
      ancestor.unshift({ _id, title, slug });
      // update topic by inserting ancestor
      const topic = await Topic.findByIdAndUpdate(id, {
        $set: { ancestors: ancestor },
      });
      
    } 
  } catch (err) {
    console.log(err.message);
  }
};

exports.buildAncestors = buildAncestors;
