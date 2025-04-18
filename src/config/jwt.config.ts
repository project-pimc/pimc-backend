import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'pimc_stronger_secret_key_that_is_at_least_256_bits_long_for_better_security_12345678',
  accessTokenExpiration: process.env.JWT_ACCESS_EXPIRATION || '7d',
  refreshTokenExpiration: process.env.JWT_REFRESH_EXPIRATION || '14d',
})); 