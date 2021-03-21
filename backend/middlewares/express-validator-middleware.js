// https://dev.to/nedsoft/a-clean-approach-to-using-express-validator-8go
const { body, validationResult } = require("express-validator");

const topicPostValidationRules = () => {
  return [
    // can set id for testing purposes
    body("_id").isMongoId().optional(),
    body("title").not().isEmpty().trim().escape().isLength(2, 75).isString(),
    body("description").trim().escape().isLength(2, 255).isString(),
    body("user").trim().isMongoId().optional(),
    body("links").isArray().optional(),
    body("links.*.description").trim().escape().isLength(1, 255).isString(),
    body("links.*.url")
      .trim()
      .isLength(10, 255)
      .isURL({ protocols: ["http", "https"], require_protocol: false }),
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
//  rules for Links for POST request, all fields are required
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
// for Links PATCH request all fields are optional so user is not required to update every field
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

// for Users PATCH request all fields are optional so user is not required to update every field
const userPatchValidationRules = () => {
  return [
    body("username").trim().escape().isLength(2, 50).isString().optional(),
    body("password").escape().isLength(5, 1024).isString().optional(),
    body("confirmPassword").escape().isLength(5, 1024).isString().optional(),
    body("email").trim().isLength(5, 255).isEmail().optional(),
  ];
};
//  rules for Users POST request, all fields are required
const userPostValidationRules = () => {
  return [
    body("username").trim().escape().isLength(2, 50).isString(),
    body("password").escape().isLength(5, 1024).isString(),
    body("confirmPassword").escape().isLength(5, 1024).isString(),
    body("email").trim().isLength(5, 255).isEmail(),
  ];
};
const userLoginValidationRules = () => {
  return [
    body("username").trim().escape().isLength(2, 50).isString(),
    body("password").escape().isLength(5, 1024).isString(),
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
  userPatchValidationRules,
  userPostValidationRules,
  userLoginValidationRules,
  validate,
};
