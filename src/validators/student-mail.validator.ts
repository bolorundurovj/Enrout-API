import {registerDecorator, ValidationOptions} from 'class-validator';


export function IsValidStudentEmail(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidStudentEmail',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string) {
          const emailRegex = /^[a-zA-Z]{1,}[a-zA-Z]{3}\d{6}@futa\.edu\.ng$/;
          return emailRegex.test(value);
        },
      },
    });
  };
}
