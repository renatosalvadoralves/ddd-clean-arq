import { NotFoundError } from '#shared/domain';
import { CategorySequelize } from '#category/infra';
import { GetCategoryUseCase } from '#category/application';
import { setupSequelize } from '#shared/infra';

const { CategorySequelizeRepository, CategoryModel } = CategorySequelize;
describe('GetCategoryUseCase Integration Tests', () => {
    let useCase: GetCategoryUseCase.UseCase;
    let repository: CategorySequelize.CategorySequelizeRepository;

    setupSequelize({ models: [CategoryModel] });

    beforeEach(() => {
        repository = new CategorySequelizeRepository(CategoryModel);
        useCase = new GetCategoryUseCase.UseCase(repository);
    });
    it('should throw error when entity not found', async () => {
        await expect(() => useCase.execute({ id: 'fake id' } as any)).rejects.toThrowError(
            new NotFoundError(`Entity not found using ID: fake id`),
        );
    });

    it('should return category', async () => {
        const model = await CategoryModel.factory().create();

        const output = await useCase.execute({ id: model.id });

        expect(output).toStrictEqual({
            id: model.id,
            name: model.name,
            description: model.description,
            is_active: model.is_active,
            created_at: model.created_at,
        });
    });
});
