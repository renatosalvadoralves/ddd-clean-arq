import { ValidationError } from '#shared/domain';
// we can create constants with error messages
export class ValidatorRules {
    private constructor(private value: any, private property: string) {}

    static values(value: any, property: string) {
        return new ValidatorRules(value, property);
    }

    required(): this {
        if (this.value === null || this.value === undefined || this.value === '') {
            throw new ValidationError(`${this.property} is required`);
        }
        return this;
    }

    string(): this {
        if (!isEmpty(this.value) && typeof this.value !== 'string') {
            throw new ValidationError(`${this.property} must be a string`);
        }
        return this;
    }

    maxLength(max: number): this {
        if (!isEmpty(this.value) && this.value.length > max) {
            throw new ValidationError(`${this.property} must be less than ${max} characters`);
        }
        return this;
    }

    boolean(): this {
        if (!isEmpty(this.value) && typeof this.value !== 'boolean') {
            throw new ValidationError(`${this.property} must be a boolean`);
        }
        return this;
    }
}

export function isEmpty(value: any): boolean {
    return value === undefined || value === null;
}

export default ValidatorRules;
