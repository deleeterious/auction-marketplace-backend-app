import { IsDateString, IsEmail, IsNotEmpty } from 'class-validator';
import { Is21YearsOld } from '../../../common/Decorators/birth-date-validation.decorator';

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
  @Is21YearsOld({ message: 'Incorrect date' })
  birthDate: string;
}
