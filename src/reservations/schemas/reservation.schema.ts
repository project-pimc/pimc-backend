import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import * as mongoose from 'mongoose';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  
  @ApiProperty({ description: 'Unique identifier' })
  id: string;

  @ApiProperty({ description: 'Plot size', enum: PlotSize })
  @Prop({ 
    type: String, 
    enum: PlotSize, 
    required: true,
    index: true
  })
  plotSize: PlotSize;

  @ApiProperty({ description: 'Reservation status', enum: ReservationStatus })
  @Prop({ 
    type: String, 
    enum: ReservationStatus, 
    default: ReservationStatus.PENDING,
    index: true
  })
  status: ReservationStatus;

  @ApiPropertyOptional({ description: 'Challan number' })
  @Prop()
  challanNumber: string;

  @ApiPropertyOptional({ description: 'Payment amount' })
  @Prop()
  paymentAmount: string;

  @ApiPropertyOptional({ description: 'Bank draft date' })
  @Prop()
  bankDraftDate: string;

  @ApiPropertyOptional({ description: 'Bank name' })
  @Prop()
  bankName: string;

  @ApiPropertyOptional({ description: 'Nominee name' })
  @Prop()
  nomineeName: string;

  @ApiPropertyOptional({ description: 'Nominee CNIC' })
  @Prop()
  nomineeCnic: string;

  @ApiPropertyOptional({ description: 'Nominee relationship' })
  @Prop()
  nomineeRelationship: string;

  @ApiPropertyOptional({ description: 'Nominee address' })
  @Prop()
  nomineeAddress: string;

  @ApiProperty({ description: 'User who made the reservation', type: 'string', format: 'objectId' })
  @Prop({ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    index: true
  })
  user: User;
  
  @ApiProperty({ description: 'Creation date', type: Date })
  createdAt: Date;
  
  @ApiProperty({ description: 'Last update date', type: Date })
  updatedAt: Date;

  @Prop([{
    status: { type: String, enum: Object.values(ReservationStatus), required: true },
    eventDateTime: { type: Date, default: Date.now },
    remarks: { type: String }
  }])
  statusEventHistory: Array<{
    status: ReservationStatus;
    eventDateTime: Date;
    remarks?: string;
  }>;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);

// Create virtual property for id that returns _id as string
ReservationSchema.virtual('id').get(function() {
  return this._id.toString();
}); 