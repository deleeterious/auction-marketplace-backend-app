import { IsDateString, IsEmail, IsNotEmpty } from 'class-validator';

export class SingUpDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsDateString()
  birthDate: string;
}
