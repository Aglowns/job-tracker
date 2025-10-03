import { config } from 'dotenv';
import { EnvSchema, EnvConfig } from '@job-tracker/shared';

config();

let envConfig: EnvConfig;

try {
  envConfig = EnvSchema.parse(process.env);
} catch (error) {
  console.error('❌ Invalid environment variables:', error);
  process.exit(1);
}

export const env = envConfig;

