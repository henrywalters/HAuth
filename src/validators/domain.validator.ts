import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

function IsValidDomain(domain: string): boolean { 
    var re = new RegExp(/^((?:(?:(?:\w[\.\-\+]?)*)\w)+)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,6})$/); 
    return domain.match(re) !== null;
} 

export function IsDomain(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        console.log(propertyName)
        console.log(object);
        registerDecorator({
            name: "isDomain",
            target: object.constructor,
            propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return IsValidDomain(value);
                }
            }
        })
    }
}