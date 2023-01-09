import {registerDecorator, ValidationOptions} from 'class-validator';
import {RoleType} from "../constants";


export function IsValidEmail(role: RoleType, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidEmail',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string) {
          let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (role in [RoleType.ADMIN, RoleType.STAFF]) {
            emailRegex = /^[a-zA-Z]+@futa\.edu\.ng$/;
          } else if (role === RoleType.STUDENT) {
            emailRegex = /^[a-zA-Z]{1,}[a-zA-Z]{3}\d{6}@futa\.edu\.ng$/;
          }
          return emailRegex.test(value);
        },
      },
    });
  };
}
