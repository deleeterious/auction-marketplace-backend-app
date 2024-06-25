import { ValidationOptions, registerDecorator } from 'class-validator';

export function IsHigherThen(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object, propertyName: string) {
    registerDecorator({
      name: 'IsHigherThen',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: string | number, args) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];

          if (typeof relatedValue === 'string' && typeof value === 'string') {
            return Number(new Date(value)) > Number(new Date(relatedValue));
          }

          if (typeof value === 'number' && typeof relatedValue === 'number') {
            return value > relatedValue;
          }
        },
      },
    });
  };
}
