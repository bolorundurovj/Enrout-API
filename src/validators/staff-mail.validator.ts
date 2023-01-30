import {registerDecorator, ValidationOptions} from 'class-validator';


export function IsValidStaffEmail(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidStaffEmail',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string) {
          const emailRegex = /^[a-zA-Z]+@futa\.edu\.ng$/;
          return emailRegex.test(value);
        },
      },
    });
  };
}
