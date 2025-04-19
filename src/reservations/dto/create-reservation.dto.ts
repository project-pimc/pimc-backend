import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PlotSize } from '../schemas/reservation.schema';

export class CreateReservationDto {
  @IsNotEmpty()
  @IsEnum(PlotSize)
  plotSize: PlotSize;

  @IsOptional()
  @IsString()
  challanNumber?: string;

  @IsOptional()
  @IsString()
  paymentAmount?: string;

  @IsOptional()
  @IsString()
  bankDraftDate?: string;

  @IsOptional()
  @IsString()
  bankName?: string;

  @IsOptional()
  @IsString()
  nomineeName?: string;

  @IsOptional()
  @IsString()
  nomineeCnic?: string;

  @IsOptional()
  @IsString()
  nomineeRelationship?: string;

  @IsOptional()
  @IsString()
  nomineeAddress?: string;
} 