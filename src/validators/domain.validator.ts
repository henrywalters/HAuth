import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

function IsValidDomain(domain: string | undefined): boolean { 
    var re = new RegExp(/^((?:(?:(?:\w[\.\-\+]?)*)\w)+)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,6})$/); 
    if (!domain) return false;
    return domain.match(re) !== null;
} 

export function IsDomain(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
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