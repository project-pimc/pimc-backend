import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Exclude, Transform } from 'class-transformer';

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
  
  id: string;

  @Prop({ required: true })
  fullName: string;

  @Prop()
  fatherOrHusbandName: string;

  @Prop({ required: true, unique: true, index: true })
  cnic: string;

  @Prop({ index: true })
  passportNumber: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  occupation: string;

  @Prop({ 
    type: String, 
    enum: UserCategory, 
    default: UserCategory.MEDICAL_OFFICER 
  })
  category: UserCategory;

  @Prop()
  presentAddress: string;

  @Prop()
  permanentAddress: string;

  @Prop({ required: true })
  @Exclude()
  password: string;

  @Prop()
  @Exclude()
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Create virtual property for id that returns _id as string
UserSchema.virtual('id').get(function() {
  return this._id.toString();
}); 