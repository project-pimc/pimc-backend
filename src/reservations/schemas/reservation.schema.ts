import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Transform } from 'class-transformer';
import { User } from '../../users/schemas/user.schema';

export enum PlotSize {
  FIVE_MARLA = '5 Marla',
  SEVEN_MARLA = '7 Marla',
  TEN_MARLA = '10 Marla',
  FOURTEEN_MARLA = '14 Marla',
  ONE_KANAL = '1 Kanal',
  TWO_KANAL = '2 Kanal',
}

export enum ReservationStatus {
  PENDING = 'Pending',
  UNDER_REVIEW = 'Under Review',
  ACCEPTED = 'Accepted',
  REJECTED = 'Rejected',
}

export type ReservationDocument = Reservation & Document;

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
export class Reservation {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop({ 
    type: String, 
    enum: PlotSize, 
    required: true,
    index: true
  })
  plotSize: PlotSize;

  @Prop({ 
    type: String, 
    enum: ReservationStatus, 
    default: ReservationStatus.PENDING,
    index: true
  })
  status: ReservationStatus;

  @Prop()
  challanNumber: string;

  @Prop()
  paymentAmount: string;

  @Prop()
  bankDraftDate: string;

  @Prop()
  bankName: string;

  @Prop()
  nomineeName: string;

  @Prop()
  nomineeCnic: string;

  @Prop()
  nomineeRelationship: string;

  @Prop()
  nomineeAddress: string;

  @Prop({ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    index: true
  })
  user: User;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);

// Create virtual property for id that returns _id as string
ReservationSchema.virtual('id').get(function() {
  return this._id.toString();
}); 