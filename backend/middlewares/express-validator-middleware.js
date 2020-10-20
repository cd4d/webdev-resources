// https://dev.to/nedsoft/a-clean-approach-to-using-express-validator-8go
const { body, validationResult } = require("express-validator");

const topicValidationRules = () => {
  return [
    body("title").not().isEmpty().trim().escape().isLength(2, 75).isString(),
    body("description").trim().escape().isLength(2, 255).isString().optional(),
    body("links").isArray().optional(),
    body("links.*.description").trim().escape().isLength(1, 255).isString(),
    body("links.*.url").trim().isLength(10, 255).isURL({ protocols: ["http","https"],require_protocol: true}),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(422).send(errors);
};

module.exports = { topicValidationRules, validate };
