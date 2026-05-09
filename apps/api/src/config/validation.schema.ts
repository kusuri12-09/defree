import * as Joi from 'joi'

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3000),
  CORS_ORIGIN: Joi.string().default('http://localhost:5173'),

  DATABASE_URL: Joi.string().required(),
  REDIS_URL: Joi.string().required(),

  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),

  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),

  KAKAO_CLIENT_ID: Joi.string().required(),
  KAKAO_CLIENT_SECRET: Joi.string().required(),

  WEBHOOK_ENCRYPTION_KEY: Joi.string().length(32).required(),

  // 선택적 키
  CLOVA_OCR_API_KEY: Joi.string().optional(),
  CLOVA_OCR_INVOKE_URL: Joi.string().optional(),
  OPENAI_API_KEY: Joi.string().optional(),
  MANGAE_RECIPE_API_KEY: Joi.string().optional(),
  YOUTUBE_API_KEY: Joi.string().optional(),
  FCM_SERVICE_ACCOUNT_KEY: Joi.string().optional(),
  AWS_S3_BUCKET: Joi.string().optional(),
  AWS_REGION: Joi.string().default('ap-northeast-2'),
  AWS_ACCESS_KEY_ID: Joi.string().optional(),
  AWS_SECRET_ACCESS_KEY: Joi.string().optional(),
})
