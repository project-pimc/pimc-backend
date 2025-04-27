import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserCategory } from '../schemas/user.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'User full name', example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({ description: 'Father or husband name', required: false, example: 'James Doe' })
  @IsOptional()
  @IsString()
  fatherOrHusbandName?: string;

  @ApiProperty({ description: 'CNIC number', example: '12345-1234567-1' })
  @IsNotEmpty()
  @IsString()
  cnic: string;

  @ApiProperty({ description: 'Passport number', required: false, example: 'AB1234567' })
  @IsOptional()
  @IsString()
  passportNumber?: string;
  
  @ApiProperty({ description: 'Registration number', required: false, example: 'REG-12345' })
  @IsOptional()
  @IsString()
  registrationNumber?: string;

  @ApiProperty({ description: 'Email address', example: 'john.doe@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Phone number', required: false, example: '+923001234567' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ description: 'Occupation', required: false, example: 'Doctor' })
  @IsOptional()
  @IsString()
  occupation?: string;

  @ApiProperty({ 
    description: 'User category', 
    required: false, 
    enum: UserCategory,
    example: UserCategory.MEDICAL_OFFICER 
  })
  @IsOptional()
  @IsEnum(UserCategory)
  category?: UserCategory;

  @ApiProperty({ description: 'Present address', required: false, example: '123 Main St, City' })
  @IsOptional()
  @IsString()
  presentAddress?: string;

  @ApiProperty({ description: 'Permanent address', required: false, example: '456 Oak St, City' })
  @IsOptional()
  @IsString()
  permanentAddress?: string;

  @ApiProperty({ description: 'Password (min. 8 characters)', minLength: 8 })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
} 