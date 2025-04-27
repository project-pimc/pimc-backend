import { ApiProperty } from '@nestjs/swagger';

export class TokenResponse {
  @ApiProperty({ description: 'JWT access token' })
  accessToken: string;
  
  @ApiProperty({ description: 'JWT refresh token' })
  refreshToken: string;
} 