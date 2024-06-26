import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrderDTO {
  @IsNotEmpty()
  @IsString()
  arrivalLocation: string;

  @IsNotEmpty()
  @IsString()
  arrivalType: string;

  @IsNotEmpty()
  @IsNumber()
  lotId: number;
}
