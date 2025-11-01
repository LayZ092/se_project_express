import { Joi, celebrate } from "celebrate";
import validator from "validator";

const validateClothingItemBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    imageUrl: Joi.string().required().custom(validateURL),
  }),
});

const validateUserRegistrationBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().custom(validateURL),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
});

const validateUserLoginBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required().messages({
      "string.hex": "Invalid ID format",
      "string.length": "ID must be exactly 24 characters long",
      "string.empty": "ID is required",
    }),
  }),
});

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

export {
  validateClothingItemBody,
  validateUserRegistrationBody,
  validateUserLoginBody,
  validateId,
  validateURL,
};
