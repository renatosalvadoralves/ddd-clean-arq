import { NotFoundError } from '#shared/domain';
import { Category } from '#category/domain';
import { CategoryInMemoryRepository } from '#category/infra';
import { GetCategoryUseCase } from '#category/application';

describe('GetCategoryUseCase Unit Tests', () => {
    let useCase: GetCategoryUseCase.UseCase;
    let repository: CategoryInMemoryRepository;

    beforeEach(() => {
        repository = new CategoryInMemoryRepository();
        useCase = new GetCategoryUseCase.UseCase(repository);
    });
    it('should throw error when entity not found', async () => {
        await expect(() => useCase.execute({ id: 'fake id' } as any)).rejects.toThrowError(
            new NotFoundError(`Entity not found using ID: fake id`),
        );
    });

    it('should return category', async () => {
        const items = [new Category({ name: 'Movie' })];
        const spyFindById = jest.spyOn(repository, 'findById');

        repository.items = items;

        const output = await useCase.execute({ id: items[0].id });

        expect(spyFindById).toHaveBeenCalledTimes(1);
        expect(output).toStrictEqual({
            id: items[0].id,
            name: 'Movie',
            description: null,
            is_active: true,
            created_at: items[0].created_at,
        });
    });
});
