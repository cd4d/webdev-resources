// https://dev.to/nedsoft/a-clean-approach-to-using-express-validator-8go
const { body, validationResult } = require("express-validator");

const topicPostValidationRules = () => {
  return [
    // can set id for testing purposes
    body("_id").isMongoId().optional(),
    body("title").not().escape().isEmpty().trim().isLength(2, 75).isString(),
    body("description").trim().isLength(2, 255).isString(),
    body("user").trim().isMongoId().optional(),
    body("links").isArray().optional(),
    body("links.*.summary").trim().isLength(1, 255).isString(),
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
    body("description").trim().isLength(2, 255).isString().optional(),
    body("user").trim().isMongoId().optional(),
    body("links").isArray().optional(),
    body("links.*.summary").trim().isLength(1, 255).isString(),
    body("links.*.url")
      .trim()
      .isLength(10, 255)
      .isURL({ protocols: ["http", "https"], require_protocol: true }),
  ];
};
//  rules for Links for POST request, user fields are required
const linkPostValidationRules = () => {
  return [
    body("topic").trim().isMongoId(),
    body("summary").trim().isLength(1, 255).isString(),
    body("url")
      .trim()
      .isLength(10, 255)
      .isURL({ protocols: ["http", "https"], require_protocol: true }),
    // body("openGraphTitle").optional(),
    // body("openGraphDescription").optional(),
    // body("openGraphSiteName").optional(),
    // body("openGraphDomainName").optional(),
    // body("openGraphImage").optional(),
    // body("title").optional(),
    // body("description").optional(),
    // body("domain").optional(),
    // body("img").optional(),
  ];
};
// for Links PATCH request all fields are optional so user is not required to update every field
const linkPatchValidationRules = () => {
  return [
    body("topic").trim().isMongoId().optional(),
    body("summary").trim().isLength(1, 255).isString().optional(),
    body("url")
      .trim()
      .isLength(10, 255)
      .isURL({ protocols: ["http", "https"], require_protocol: true })
      .optional(),
    body("openGraphTitle").optional(),
    body("openGraphDescription").optional(),
    body("openGraphSiteName").optional(),
    body("openGraphDomainName").optional(),
    body("openGraphImage").optional(),
    // body("title").optional(),
    // body("description").optional(),
    // body("domain").optional(),
    // body("img").optional(),
  ];
};

// for Users PATCH request all fields are optional so user is not required to update every field
const userPatchValidationRules = () => {
  return [
    body("username")
      .trim()
      .escape()
      .isLength(2, 50)
      .isString()
      .optional()
      .isAlpha(),
    body("password").escape().isLength(5, 1024).isString().optional(),
    body("confirmPassword").escape().isLength(5, 1024).isString().optional(),
    body("email").trim().isLength(5, 255).isEmail().optional(),
  ];
};
//  rules for Users POST request, all fields are required
const userPostValidationRules = () => {
  return [
    body("username").trim().escape().isLength(2, 50).isString().isAlpha(),
    body("password").escape().isLength(5, 1024).isString(),
    body("confirmPassword").escape().isLength(5, 1024).isString(),
    body("email").trim().isLength(5, 255).isEmail(),
  ];
};
const userLoginValidationRules = () => {
  return [
    body("username").trim().escape().isLength(2, 50).isString().isAlpha(),
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
