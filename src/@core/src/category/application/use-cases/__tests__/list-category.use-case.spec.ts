import { Category } from '#category/domain';
import { CategoryRepository } from '#category/domain';
import { CategoryInMemoryRepository } from '#category/infra';
import { ListCategoryUseCase } from '#category/application';

describe('ListCategoryUseCase Unit Tests', () => {
    let useCase: ListCategoryUseCase.UseCase;
    let repository: CategoryInMemoryRepository;

    beforeEach(() => {
        repository = new CategoryInMemoryRepository();
        useCase = new ListCategoryUseCase.UseCase(repository);
    });
    test('toOutput method', async () => {
        let result = new CategoryRepository.SearchResult({
            items: [],
            total: 1,
            current_page: 1,
            per_page: 2,
            sort: null,
            sort_dir: null,
            filter: null,
        });

        let output = useCase['toOutput'](result);
        expect(output).toStrictEqual({
            items: [],
            total: 1,
            current_page: 1,
            per_page: 2,
            last_page: 1,
        });

        const entity = new Category({ name: 'Movie' });
        result = new CategoryRepository.SearchResult({
            items: [entity],
            total: 1,
            current_page: 1,
            per_page: 2,
            sort: null,
            sort_dir: null,
            filter: null,
        });
        output = useCase['toOutput'](result);
        expect(output).toStrictEqual({
            items: [entity.toJSON()],
            total: 1,
            current_page: 1,
            per_page: 2,
            last_page: 1,
        });
    });

    it('should returns output using empty input with categories ordered by created_at', async () => {
        const items = [
            new Category({ name: 'test 1' }),
            new Category({
                name: 'test 2',
                created_at: new Date(new Date().getTime() + 100),
            }),
        ];

        repository.items = items;

        const output = await useCase.execute({});

        expect(output).toStrictEqual({
            items: [...items].reverse().map((i) => i.toJSON()),
            total: 2,
            current_page: 1,
            per_page: 15,
            last_page: 1,
        });
    });

    it('should returns output using pagination, sort and filter', async () => {
        const items = [
            new Category({ name: 'a' }),
            new Category({ name: 'AAAA' }),
            new Category({ name: 'AaA' }),
            new Category({ name: 'b' }),
            new Category({ name: 'c' }),
        ];

        repository.items = items;

        let output = await useCase.execute({ page: 1, per_page: 2, sort: 'name', sort_dir: 'asc', filter: 'a' });

        expect(output).toStrictEqual({
            items: [items[1].toJSON(), items[2].toJSON()],
            total: 3,
            current_page: 1,
            per_page: 2,
            last_page: 2,
        });

        output = await useCase.execute({ page: 2, per_page: 2, sort: 'name', sort_dir: 'asc', filter: 'a' });

        expect(output).toStrictEqual({
            items: [items[0].toJSON()],
            total: 3,
            current_page: 2,
            per_page: 2,
            last_page: 2,
        });

        output = await useCase.execute({ page: 2, per_page: 2, sort: 'name', sort_dir: 'desc', filter: 'a' });

        expect(output).toStrictEqual({
            items: [items[1].toJSON()],
            total: 3,
            current_page: 2,
            per_page: 2,
            last_page: 2,
        });
    });
});
