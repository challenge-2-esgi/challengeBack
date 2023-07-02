import * as Joi from 'joi';

const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('prod', 'dev', 'test').default('dev'),
  PORT: Joi.number().default(3000),
  MICROSERVICE_HOST: Joi.string().required(),
  MICROSERVICE_PORT: Joi.number().required(),
  AUTH_SERVICE_HOST: Joi.string().required(),
  AUTH_SERVICE_PORT: Joi.number().required(),
  CANDIDATE_SERVICE_HOST: Joi.string().required(),
  CANDIDATE_SERVICE_PORT: Joi.number().required(),
  DATABASE_URL: Joi.string().required(),
  AZURE_STORAGE_CONNECTION_STRING: Joi.string().required(),
  AZURE_BLOB_PUBLIC_CONTAINER: Joi.string().required(),
  AZURE_BLOB_PRIVATE_CONTAINER: Joi.string().required(),
});

export default validationSchema;
