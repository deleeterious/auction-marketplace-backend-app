import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBidDTO {
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  lotId: number;
}
