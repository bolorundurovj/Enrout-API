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
          let emailRegex;
          if (role in [RoleType.ADMIN, RoleType.STAFF]) {
            emailRegex = /^[a-zA-Z]+@futa\.edu\.ng$/;
          } else if (RoleType.STUDENT) {
            emailRegex = /^[a-zA-Z]{1,}[a-zA-Z]{3}\d{6}@futa\.edu\.ng$/;
          } else {
            emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
          }
          return emailRegex.test(value);
        },
        defaultMessage() {
          return '$property is not a valid staff mail';
        },
      },
    });
  };
}
