import { registerDecorator, ValidationOptions } from 'class-validator';

export function Is21YearsOld(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'Is21YearsOld',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          const expectedDate = new Date(value);
          expectedDate.setFullYear(new Date().getFullYear() - 21);

          return Number(new Date(value)) <= Number(expectedDate);
        },
      },
    });
  };
}
