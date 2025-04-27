import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PlotSize } from '../schemas/reservation.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty({ 
    description: 'Plot size',
    enum: PlotSize,
    example: PlotSize.FIVE_MARLA
  })
  @IsNotEmpty()
  @IsEnum(PlotSize)
  plotSize: PlotSize;

  @ApiProperty({ description: 'Challan number', required: false, example: 'CH-12345' })
  @IsOptional()
  @IsString()
  challanNumber?: string;

  @ApiProperty({ description: 'Payment amount', required: false, example: '500000' })
  @IsOptional()
  @IsString()
  paymentAmount?: string;

  @ApiProperty({ description: 'Bank draft date', required: false, example: '2023-08-15' })
  @IsOptional()
  @IsString()
  bankDraftDate?: string;

  @ApiProperty({ description: 'Bank name', required: false, example: 'HBL' })
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiProperty({ description: 'Nominee name', required: false, example: 'Jane Doe' })
  @IsOptional()
  @IsString()
  nomineeName?: string;

  @ApiProperty({ description: 'Nominee CNIC', required: false, example: '12345-1234567-2' })
  @IsOptional()
  @IsString()
  nomineeCnic?: string;

  @ApiProperty({ description: 'Nominee relationship', required: false, example: 'Spouse' })
  @IsOptional()
  @IsString()
  nomineeRelationship?: string;

  @ApiProperty({ description: 'Nominee address', required: false, example: '123 Maple St, City' })
  @IsOptional()
  @IsString()
  nomineeAddress?: string;
} 