import * as Joi from 'joi';

const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('prod', 'dev', 'test').default('dev'),
  PORT: Joi.number().default(3000),
  MICROSERVICE_HOST: Joi.string().required(),
  MICROSERVICE_PORT: Joi.number().required(),
  AUTH_SERVICE_HOST: Joi.string().required(),
  AUTH_SERVICE_PORT: Joi.number().required(),
  DATABASE_URL: Joi.string().required(),
});

export default validationSchema;
