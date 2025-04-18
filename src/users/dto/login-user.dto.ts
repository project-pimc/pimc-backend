import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsString()
  identifier: string; // Can be email, CNIC, or passport number

  @IsNotEmpty()
  @IsString()
  password: string;
} 