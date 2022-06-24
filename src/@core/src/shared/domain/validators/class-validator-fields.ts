import { validateSync } from "class-validator";
import ValidatorFieldsInterface, { FieldsErrors } from "./validator-fields-interface";

export abstract class ClassValidatorFields<T> implements ValidatorFieldsInterface<T> {
    validatedData: T = null;
    errors: FieldsErrors = null;
    validate(data: any): boolean {
        const errors = validateSync(data)
        if (errors.length) {
            this.errors = {};
            for (const error of errors) {
                const field = error.property;
                this.errors[field] = Object.values(error.constraints);
            }
        } else {
            this.validatedData = data;
        }
        return !errors.length;
    }
}

export default ClassValidatorFields;