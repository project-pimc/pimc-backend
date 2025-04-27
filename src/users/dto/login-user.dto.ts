import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ 
    description: 'User identifier - can be email, CNIC, or passport number',
    example: 'john.doe@example.com'
  })
  @IsNotEmpty()
  @IsString()
  identifier: string; // Can be email, CNIC, or passport number

  @ApiProperty({ 
    description: 'User password',
    example: 'password123'
  })
  @IsNotEmpty()
  @IsString()
  password: string;
} 