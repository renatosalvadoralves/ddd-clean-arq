import CategoryValidatorFactory, { CategoryRules, CategoryValidator } from './category.validator';

describe('CategoryValidator Tests', () => {
    let validator: CategoryValidator;

    beforeEach(() => (validator = CategoryValidatorFactory.create()));
    test('invalidation cases for name field', () => {
        expect({ validator, data: null }).containsErrorMessages({
            name: [
                'name should not be empty',
                'name must be a string',
                'name must be shorter than or equal to 255 characters',
            ],
        });
        expect({ validator, data: { name: null } }).containsErrorMessages({
            name: [
                'name should not be empty',
                'name must be a string',
                'name must be shorter than or equal to 255 characters',
            ],
        });

        expect({ validator, data: { name: '' } }).containsErrorMessages({
            name: ['name should not be empty'],
        });
        expect({ validator, data: { name: 5 } }).containsErrorMessages({
            name: ['name must be a string', 'name must be shorter than or equal to 255 characters'],
        });
        expect({ validator, data: { name: 't'.repeat(256) } }).containsErrorMessages({
            name: ['name must be shorter than or equal to 255 characters'],
        });
    });

    test('invalidation cases for description field', () => {
        expect({ validator, data: { description: 5 } }).containsErrorMessages({
            description: ['description must be a string'],
        });
    });

    test('invalidation cases for is_active field', () => {
        expect({ validator, data: { is_active: 5 } }).containsErrorMessages({
            is_active: ['is_active must be a boolean value'],
        });
        expect({ validator, data: { is_active: 0 } }).containsErrorMessages({
            is_active: ['is_active must be a boolean value'],
        });
    });

    test('validation cases for fields', () => {
        const arrange = [
            { name: 'some value' },
            { name: 'some value', description: null as any },
            { name: 'some value', description: undefined as any },
            { name: 'some value', is_active: true },
            { name: 'some value', is_active: false },
        ];

        arrange.forEach((item) => {
            const isValid = validator.validate(item);
            expect(isValid).toBeTruthy();
            expect(validator.validatedData).toStrictEqual(new CategoryRules(item));
        });
    });
});
