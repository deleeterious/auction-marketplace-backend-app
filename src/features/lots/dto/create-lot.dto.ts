import {
  IsBase64,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { IsHigherThen } from 'src/common/Decorators/is-higher-then';

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
  // @MinDate(() => new Date())
  startTime: Date;

  @IsNotEmpty()
  @IsDateString()
  @IsHigherThen('startTime', {
    message: 'endTime should be higher then startTime',
  })
  endTime: Date;
}
