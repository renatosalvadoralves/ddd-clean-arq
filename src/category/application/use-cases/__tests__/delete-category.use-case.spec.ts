import NotFoundError from "../../../../shared/domain/errors/not-found.error";
import { Category } from "../../../domain/entities/category";
import CategoryInMemoryRepository from "../../../infra/repository/category-in-memory.repository";
import DeleteCategoryUseCase from "../delete-category.use-case";

describe("DeleteCategoryUseCase Unit Tests", () => {
    let useCase: DeleteCategoryUseCase;
    let repository: CategoryInMemoryRepository;

    beforeEach(() => {
        repository = new CategoryInMemoryRepository;
        useCase = new DeleteCategoryUseCase(repository);
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