import {
  IsBase64,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { IsDateGreaterThenNow } from 'src/common/Decorators/date-greater-then-now';
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
  @IsDateGreaterThenNow({
    message: 'Start time should be higher then now',
  })
  startTime: Date;

  @IsNotEmpty()
  @IsDateString()
  @IsHigherThen('startTime', {
    message: 'endTime should be higher then startTime',
  })
  endTime: Date;
}
