import { CategorySequelize } from '#category/infra';
import { ListCategoryUseCase } from '#category/application';
import { setupSequelize } from '#shared/infra';
import _chance from 'chance';
import { CategoryFakeBuilder } from '#category/domain';

const { CategorySequelizeRepository, CategoryModel } = CategorySequelize;

describe('ListCategoryUseCase Integration Tests', () => {
    let useCase: ListCategoryUseCase.UseCase;
    let repository: CategorySequelize.CategorySequelizeRepository;

    setupSequelize({ models: [CategoryModel] });

    beforeEach(() => {
        repository = new CategorySequelizeRepository(CategoryModel);
        useCase = new ListCategoryUseCase.UseCase(repository);
    });

    it('should return output using empty input with categories ordered by created_at', async () => {
        const faker = CategoryFakeBuilder.theCategories(2);
        const entites = faker
            .withName((index) => `category ${index}`)
            .withCreatedAt((index) => new Date(new Date().getTime() + index))
            .build();

        await repository.bulkInsert(entites);

        const output = await useCase.execute({});
        expect(output).toMatchObject({
            items: [...entites].reverse().map((i) => i.toJSON()),
            total: 2,
            current_page: 1,
            per_page: 15,
            last_page: 1,
        });
    });

    it('should returns output using pagination, sort and filter', async () => {
        const faker = CategoryFakeBuilder.aCategory();
        const entities = [
            faker.withName('a').build(),
            faker.withName('AAA').build(),
            faker.withName('AaA').build(),
            faker.withName('b').build(),
            faker.withName('c').build(),
        ];

        await repository.bulkInsert(entities);

        let output = await useCase.execute({ page: 1, per_page: 2, sort: 'name', sort_dir: 'asc', filter: 'a' });

        expect(output).toMatchObject({
            items: [entities[1], entities[2]].map((i) => i.toJSON()),
            total: 3,
            current_page: 1,
            per_page: 2,
            last_page: 2,
        });

        output = await useCase.execute({ page: 2, per_page: 2, sort: 'name', sort_dir: 'asc', filter: 'a' });

        expect(output).toMatchObject({
            items: [entities[0]].map((i) => i.toJSON()),
            total: 3,
            current_page: 2,
            per_page: 2,
            last_page: 2,
        });

        output = await useCase.execute({ page: 2, per_page: 2, sort: 'name', sort_dir: 'desc', filter: 'a' });

        expect(output).toMatchObject({
            items: [entities[1]].map((i) => i.toJSON()),
            total: 3,
            current_page: 2,
            per_page: 2,
            last_page: 2,
        });
    });
});
