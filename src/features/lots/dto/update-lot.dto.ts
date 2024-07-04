import {
  IsBase64,
  IsDateString,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { IsHigherThen } from 'src/common/Decorators/is-higher-then';

export class UpdateLotDTO {
  @IsOptional()
  @IsOptional()
  title: string;

  @IsOptional()
  @IsBase64()
  image?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  currentPrice: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedPrice: number;

  @IsOptional()
  @IsDateString()
  startTime: Date;

  @IsOptional()
  @IsDateString()
  @IsHigherThen('startTime', {
    message: 'endTime should be higher then startTime',
  })
  endTime: Date;
}
