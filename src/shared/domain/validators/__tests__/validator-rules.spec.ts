import { ValidationError } from "../../errors/validation-error";
import ValidatorRules from "../validator-rules";

type Values = {
    value: any;
    property: string;
}

type ExceptedRule = {
    value: any;
    property: string;
    rule: keyof ValidatorRules;
    error: ValidationError;
    params?: any[];
}

const applyRules = ({
    value,
    property,
    rule,
    params = []
}: Omit<ExceptedRule, 'error'>) => {
    const validator = ValidatorRules.values(value, property);
    const method = validator[rule];
    method.apply(validator, params)
}

function assertIsInvalid({ error, ...rest }: ExceptedRule) {
    expect(() => applyRules(rest)
    ).toThrow(error);
}

function assertIsValid({ error, ...rest }: ExceptedRule) {
    expect(() => applyRules(rest)
    ).not.toThrow(error);
}
describe("ValidatorRules Unit Tests", () => {
    test("values method", () => {
        const validator = ValidatorRules.values("some property", "field");
        expect(validator).toBeInstanceOf(ValidatorRules);
        expect(validator['value']).toBe('some property');
        expect(validator['property']).toBe('field');
    });
    test("required validation rule", () => {
        let arrange: Values[] = [
            { value: null, property: 'field' },
            { value: undefined, property: 'field' },
            { value: "", property: 'field' },
        ];

        arrange.forEach(v => {
            assertIsInvalid({
                value: v.value,
                property: v.property,
                rule: 'required',
                error: new ValidationError("field is required")
            });
        })

        arrange = [
            { value: "test", property: 'field' },
            { value: 5, property: 'field' },
            { value: 0, property: 'field' },
            { value: false, property: 'field' },
        ];

        arrange.forEach(v => {
            assertIsValid({
                value: v.value,
                property: v.property,
                rule: 'required',
                error: new ValidationError("field is required")

            });
        })
    });

    test("string validation rule", () => {
        let arrange: Values[] = [
            { value: 42, property: 'field' },
            { value: {}, property: 'field' },
            { value: false, property: 'field' },
        ];

        arrange.forEach(v => {
            assertIsInvalid({
                value: v.value,
                property: v.property,
                rule: 'string',
                error: new ValidationError("field must be a string")
            });
        })

        arrange = [
            { value: "test", property: 'field' },
            { value: null, property: 'field' },
            { value: undefined, property: 'field' },
        ];

        arrange.forEach(v => {
            assertIsValid({
                value: v.value,
                property: v.property,
                rule: 'string',
                error: new ValidationError("field must be a string")

            });
        })
    });

    test("maxLength validation rule", () => {
        let arrange: Values[] = [
            { value: "aaaaaaaaaaa", property: 'field' },
        ];

        arrange.forEach(v => {
            assertIsInvalid({
                value: v.value,
                property: v.property,
                rule: 'maxLength',
                error: new ValidationError("field must be less than 5 characters"),
                params: [5]
            });
        })

        arrange = [
            { value: "aaa", property: 'field' },
            { value: null, property: 'field' },
            { value: undefined, property: 'field' },
        ];

        arrange.forEach(v => {
            assertIsValid({
                value: v.value,
                property: v.property,
                rule: 'maxLength',
                error: new ValidationError("field must be less than 4 characters"),
                params: [2]

            });
        })
    });

    test("boolean validation rule", () => {
        let arrange: Values[] = [
            { value: "aaaaaaaaaaa", property: 'field' },
            { value: "true", property: 'field' },
            { value: 4, property: 'field' },
            { value: {}, property: 'field' },
            { value: [], property: 'field' },
        ];

        arrange.forEach(v => {
            assertIsInvalid({
                value: v.value,
                property: v.property,
                rule: 'boolean',
                error: new ValidationError("field must be a boolean"),
            });
        })

        arrange = [
            { value: true, property: 'field' },
            { value: false, property: 'field' },
        ];

        arrange.forEach(v => {
            assertIsValid({
                value: v.value,
                property: v.property,
                rule: 'boolean',
                error: new ValidationError("field must be a boolean"),
            });
        })
    });

    it('should combine two or more validation rules and throw validation error', () => {
        let validator = ValidatorRules.values(null, "field");
        expect(() =>
            validator.required().string()).toThrow(
                new ValidationError("field is required")
            )

        validator = ValidatorRules.values(5, "field");
        expect(() =>
            validator.required().string().maxLength(5)).toThrow(
                new ValidationError("field must be a string")
            )

        validator = ValidatorRules.values("aaaaaaa", "field");
        expect(() =>
            validator.required().string().maxLength(5)).toThrow(
                new ValidationError("field must be less than 5 characters")
            )

        validator = ValidatorRules.values(null, "field");
        expect(() =>
            validator.required().boolean()).toThrow(
                new ValidationError("field is required")
            )

        validator = ValidatorRules.values(5, "field");
        expect(() =>
            validator.required().boolean()).toThrow(
                new ValidationError("field must be a boolean")
            )
    });

    it("should valid when combine two or more validation rules", () => {
        expect.assertions(0);
        ValidatorRules.values("aa", "field").required().string();
        ValidatorRules.values("test", "field").required().string().maxLength(5);
        ValidatorRules.values(true, "field").required().boolean();
        ValidatorRules.values(false, "field").required().boolean();
    });
});