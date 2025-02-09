import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsExactLengthNumber(
  length: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isExactLengthNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'number') {
            return false;
          }
          const valueAsString = value.toString();
          return valueAsString.length === length;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a number with exactly ${length} characters`;
        },
      },
    });
  };
}
