import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Exclude, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum UserCategory {
  CONSULTANT = 'Consultant',
  MEDICAL_OFFICER = 'Medical Officer',
  PARAMEDICAL = 'Paramedical Staff',
  NURSE = 'Nurse',
  NON_MEDICAL = 'Non-Medical',
  OVERSEAS = 'Overseas',
}

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.__v;
      ret.id = ret._id;
      delete ret._id;
      return ret;
    },
  },
  toObject: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.__v;
      ret.id = ret._id;
      delete ret._id;
      return ret;
    },
  },
})
export class User {
  @Transform(({ value }) => value.toString())
  _id: string;
  
  @ApiProperty({ description: 'Unique identifier' })
  id: string;

  @ApiProperty({ description: 'Full name' })
  @Prop({ required: true })
  fullName: string;

  @ApiPropertyOptional({ description: 'Father or husband name' })
  @Prop()
  fatherOrHusbandName: string;

  @ApiProperty({ description: 'Computerized National Identity Card number' })
  @Prop({ required: true, unique: true, index: true })
  cnic: string;

  @ApiPropertyOptional({ description: 'Passport number' })
  @Prop({ index: true })
  passportNumber: string;
  
  @ApiPropertyOptional({ description: 'Registration number' })
  @Prop({ 
    required: false, 
    unique: true, 
    index: true,
    sparse: true 
  })
  registrationNumber: string;

  @ApiProperty({ description: 'Email address' })
  @Prop({ required: true, unique: true, index: true })
  email: string;

  @ApiPropertyOptional({ description: 'Phone number' })
  @Prop()
  phoneNumber: string;

  @ApiPropertyOptional({ description: 'Occupation' })
  @Prop()
  occupation: string;

  @ApiPropertyOptional({ description: 'User category', enum: UserCategory })
  @Prop({ 
    type: String, 
    enum: UserCategory, 
    default: UserCategory.MEDICAL_OFFICER 
  })
  category: UserCategory;

  @ApiPropertyOptional({ description: 'Present address' })
  @Prop()
  presentAddress: string;

  @ApiPropertyOptional({ description: 'Permanent address' })
  @Prop()
  permanentAddress: string;

  @Prop({ required: true })
  @Exclude()
  password: string;

  @Prop()
  @Exclude()
  refreshToken: string;

  @Prop({ default: 0 })
  @Exclude()
  tokenVersion: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Create virtual property for id that returns _id as string
UserSchema.virtual('id').get(function() {
  return this._id.toString();
}); 