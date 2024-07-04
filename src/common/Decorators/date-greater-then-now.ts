import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsDateGreaterThenNow(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsDateGreaterThenNow',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          const expectedDate = new Date();

          return Number(new Date(value)) > Number(expectedDate);
        },
      },
    });
  };
}
