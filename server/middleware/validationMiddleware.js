const Joi = require('joi');

// Validation schemas
const schemas = {
  userRegister: Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),

  userLogin: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  movie: Joi.object({
    title: Joi.string().required(),
    genre: Joi.array().items(Joi.string()).required(),
    releaseYear: Joi.number().integer().min(1888).max(new Date().getFullYear()).required(),
    director: Joi.string().required(),
    cast: Joi.array().items(Joi.string()),
    synopsis: Joi.string().required(),
    posterUrl: Joi.string().uri(),
    trailerUrl: Joi.string().uri()
  }),

  review: Joi.object({
    rating: Joi.number().integer().min(1).max(5).required(),
    reviewText: Joi.string().max(1000).required()
  })
};

const validate = (schemaName) => {
  return (req, res, next) => {
    const { error } = schemas[schemaName].validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };
};

module.exports = { validate };