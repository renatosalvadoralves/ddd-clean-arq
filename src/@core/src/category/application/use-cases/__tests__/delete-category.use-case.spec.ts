import { NotFoundError } from "#shared/domain";
import { Category } from "#category/domain";
import { CategoryInMemoryRepository } from "#category/infra";
import { DeleteCategoryUseCase } from "#category/application";

describe("DeleteCategoryUseCase Unit Tests", () => {
    let useCase: DeleteCategoryUseCase.UseCase;
    let repository: CategoryInMemoryRepository;

    beforeEach(() => {
        repository = new CategoryInMemoryRepository;
        useCase = new DeleteCategoryUseCase.UseCase(repository);
    })
    it("should throw error when entity not found", async () => {
        expect(() => useCase.execute({ id: 'fake id' } as any)).rejects.toThrowError(new NotFoundError(`Entity not found using ID: fake id`));
    })

    it("should return category", async () => {
        const items = [
            new Category({ name: "Movie" })
        ];
        const spyFindById = jest.spyOn(repository, 'findById');

        repository.items = items;

        await useCase.execute({ id: items[0].id });

        expect(spyFindById).toHaveBeenCalledTimes(1);
        expect(repository.items).toHaveLength(0);
    })
});