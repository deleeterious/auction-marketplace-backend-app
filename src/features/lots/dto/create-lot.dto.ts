import {
  IsBase64,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateLotDTO {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsBase64()
  image?: string;

  @IsOptional()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  currentPrice: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  estimatedPrice: number;

  @IsNotEmpty()
  @IsDateString()
  startTime: Date;

  @IsNotEmpty()
  @IsDateString()
  endTime: Date;
}
