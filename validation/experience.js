const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateExperienceInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : " ";
  data.comppany = !isEmpty(data.comppany) ? data.comppany : " ";
  data.from = !isEmpty(data.from) ? data.from : " ";

  if (Validator.isEmpty(data.title)) {
    errors.title = "title field is required";
  }

  if (Validator.isEmpty(data.comppany)) {
    errors.comppany = "comppany field is required";
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = "from field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
