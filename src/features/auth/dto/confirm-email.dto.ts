import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmEmailDTO {
  @IsNotEmpty()
  @IsString()
  token: string;
}
