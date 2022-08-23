import { CategorySequelize } from '#category/infra';
import { LoadEntityError, UniqueEntityId } from '#shared/domain';
import { Category } from '#category/domain';
import { setupSequelize } from '#shared/infra';

const { CategoryModel, CategoryModelMapper } = CategorySequelize;
describe('CategoryModelMapper Unit Tests', () => {
    setupSequelize({ models: [CategoryModel] });
    it('should throws error when category is invalid', () => {
        const model = CategoryModel.build({
            id: 'ba9aa86c-06db-4e4e-a598-ed8b1da22307',
        });

        try {
            CategoryModelMapper.toEntity(model);
            fail('The category is valid, but it needs throws a LoadEntityError');
        } catch (error) {
            expect(error).toBeInstanceOf(LoadEntityError);
            expect(error.error).toMatchObject({
                name: [
                    'name should not be empty',
                    'name must be a string',
                    'name must be shorter than or equal to 255 characters',
                ],
            });
        }
    });

    it('should throws a generic error', () => {
        const error = new Error('GenericError');
        const spyValidate = jest.spyOn(Category, 'validate').mockImplementation(() => {
            throw error;
        });
        const model = CategoryModel.build({
            id: 'ba9aa86c-06db-4e4e-a598-ed8b1da22307',
        });
        expect(() => CategoryModelMapper.toEntity(model)).toThrow(error);
        expect(spyValidate).toHaveBeenCalled();
        spyValidate.mockRestore();
    });

    it('should convert a category model to a category entity', () => {
        const created_at = new Date();
        const model = CategoryModel.build({
            id: 'ba9aa86c-06db-4e4e-a598-ed8b1da22307',
            name: 'some value',
            description: 'some description',
            is_active: true,
            created_at,
        });

        const entity = CategoryModelMapper.toEntity(model);
        expect(entity.toJSON()).toStrictEqual(
            new Category(
                {
                    name: 'some value',
                    description: 'some description',
                    is_active: true,
                    created_at,
                },
                new UniqueEntityId('ba9aa86c-06db-4e4e-a598-ed8b1da22307'),
            ).toJSON(),
        );
    });
});
