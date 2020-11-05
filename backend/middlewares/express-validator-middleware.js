// https://dev.to/nedsoft/a-clean-approach-to-using-express-validator-8go
const { body, validationResult } = require("express-validator");

const topicPostValidationRules = () => {
  return [
    body("title").not().isEmpty().trim().escape().isLength(2, 75).isString(),
    body("description").trim().escape().isLength(2, 255).isString(),
    body("user").trim().isMongoId().optional(),
    body("links").isArray().optional(),
    body("links.*.description").trim().escape().isLength(1, 255).isString(),
    body("links.*.url")
      .trim()
      .isLength(10, 255)
      .isURL({ protocols: ["http", "https"], require_protocol: true }),
  ];
};
const topicPatchValidationRules = () => {
  return [
    body("title")
      .not()
      .isEmpty()
      .trim()
      .escape()
      .isLength(2, 75)
      .isString()
      .optional(),
    body("description").trim().escape().isLength(2, 255).isString().optional(),
    body("user").trim().isMongoId().optional(),
    body("links").isArray().optional(),
    body("links.*.description").trim().escape().isLength(1, 255).isString(),
    body("links.*.url")
      .trim()
      .isLength(10, 255)
      .isURL({ protocols: ["http", "https"], require_protocol: true }),
  ];
};
//  rules for POST request, all fields are required
const linkPostValidationRules = () => {
  return [
    body("topic").trim().isMongoId(),
    body("description").trim().escape().isLength(1, 255).isString(),
    body("url")
      .trim()
      .isLength(10, 255)
      .isURL({ protocols: ["http", "https"], require_protocol: true }),
  ];
};
// for PATCH request all fields are optional so user is not required to update every field
const linkPatchValidationRules = () => {
  return [
    body("topic").trim().isMongoId().optional(),
    body("description").trim().escape().isLength(1, 255).isString().optional(),
    body("url")
      .trim()
      .isLength(10, 255)
      .isURL({ protocols: ["http", "https"], require_protocol: true })
      .optional(),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(422).send(errors);
};

module.exports = {
  topicPostValidationRules,
  topicPatchValidationRules,
  linkPatchValidationRules,
  linkPostValidationRules,
  validate,
};
