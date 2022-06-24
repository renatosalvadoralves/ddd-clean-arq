import { objectContaining } from 'expect';
import { EntityValidationError, FieldsErrors, ClassValidatorFields } from '#shared/domain';

type Expected = { validator: ClassValidatorFields<any>; data: any } | (() => any);

expect.extend({
    containsErrorMessages(expected: Expected, received: FieldsErrors) {
        if (typeof expected === 'function') {
            try {
                expected();
                return isValid();
            } catch (error) {
                const e = error as EntityValidationError;

                return assertContainsErrorsMessages(e.error, received);
            }
        } else {
            const { validator, data } = expected;
            const validated = validator.validate(data);

            if (validated) {
                return isValid();
            }
            return assertContainsErrorsMessages(validator.errors, received);
        }
    },
});

function isValid() {
    return { pass: true, message: () => '' };
}

function assertContainsErrorsMessages(expected: FieldsErrors, received: FieldsErrors) {
    const isMatch = objectContaining(received).asymmetricMatch(expected);

    return isMatch
        ? isValid()
        : {
              pass: false,
              message: () =>
                  `The validation errors not contains ${JSON.stringify(received)}.Current: ${JSON.stringify(expected)}`,
          };
}
