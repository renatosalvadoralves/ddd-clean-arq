import { DeleteCategoryUseCase } from '#category/application';
import { CategorySequelize } from '#category/infra';
import { NotFoundError } from '#shared/domain';
import { setupSequelize } from '#shared/infra';

const { CategorySequelizeRepository, CategoryModel } = CategorySequelize;
describe('DeleteCategoryUseCase Integration Tests', () => {
    let useCase: DeleteCategoryUseCase.UseCase;
    let repository: CategorySequelize.CategorySequelizeRepository;

    setupSequelize({ models: [CategoryModel] });

    beforeEach(() => {
        repository = new CategorySequelizeRepository(CategoryModel);
        useCase = new DeleteCategoryUseCase.UseCase(repository);
    });

    it('should throw error when entity not found', async () => {
        await expect(() => useCase.execute({ id: 'fake id' } as any)).rejects.toThrowError(
            new NotFoundError(`Entity not found using ID: fake id`),
        );
    });

    it('should delete category', async () => {
        const model = await CategoryModel.factory().create();

        await useCase.execute({
            id: model.id,
        });
        const noHasModel = await CategoryModel.findByPk(model.id);
        expect(noHasModel).toBeNull();
    });
});
