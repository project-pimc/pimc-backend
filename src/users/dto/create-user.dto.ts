import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserCategory } from '../entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  fatherOrHusbandName?: string;

  @IsNotEmpty()
  @IsString()
  cnic: string;

  @IsOptional()
  @IsString()
  passportNumber?: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  occupation?: string;

  @IsOptional()
  @IsEnum(UserCategory)
  category?: UserCategory;

  @IsOptional()
  @IsString()
  presentAddress?: string;

  @IsOptional()
  @IsString()
  permanentAddress?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
} 