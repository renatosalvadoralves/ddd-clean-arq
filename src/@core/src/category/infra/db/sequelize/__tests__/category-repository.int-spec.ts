import { CategorySequelize } from '#category/infra';
import { Category, CategoryRepository } from '#category/domain';
import { NotFoundError, UniqueEntityId } from '#shared/domain';
import { setupSequelize } from '#shared/infra';
import _chance from 'chance';

const chance = _chance();
const { CategoryModel, CategorySequelizeRepository, CategoryModelMapper } = CategorySequelize;
describe('CategorySequelizeRepository Integration Tests', () => {
    setupSequelize({ models: [CategoryModel] });
    let repository: CategorySequelize.CategorySequelizeRepository;

    beforeEach(() => {
        repository = new CategorySequelizeRepository(CategoryModel);
    });

    it('should insert a new entity', async () => {
        const category = new Category({ name: 'Movie' });
        await repository.insert(category);
        const model = await CategoryModel.findByPk(category.id);

        expect(model.toJSON()).toStrictEqual(category.toJSON());
    });

    it('should throws error when entity not found', async () => {
        const arrange = ['fake id', '829137b2-bce5-4651-aa75-20da6548b8f3', new UniqueEntityId()];

        for (const value of arrange) {
            await expect(repository.findById(value)).rejects.toThrow(
                new NotFoundError(`Entity not found using ID: ${value}`),
            );
        }
    });

    it('should should find entity by id', async () => {
        const entity = new Category({ name: 'test' });

        await repository.insert(entity);
        let entityFound = await repository.findById(entity.id);

        expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());

        entityFound = await repository.findById(entityFound.id);
        expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
    });

    it('should return all categories', async () => {
        const entity = new Category({ name: 'test' });

        await repository.insert(entity);
        const entities = await repository.findAll();
        expect(entities).toHaveLength(1);
        expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]));
    });

    it('should throw error on update when a entity not found', async () => {
        const entity = new Category({ name: 'Movie' });
        await expect(repository.update(entity)).rejects.toThrow(
            new NotFoundError(`Entity not found using ID: ${entity.id}`),
        );
    });

    it('should update a entity', async () => {
        const entity = new Category({ name: 'Movie' });
        await repository.insert(entity);

        entity.update('Movie updated', entity.description);
        await repository.update(entity);

        const entityFound = await repository.findById(entity.id);
        expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
    });

    it('should throw error on delete when a entity not found', async () => {
        await expect(repository.delete('fake id')).rejects.toThrow(
            new NotFoundError(`Entity not found using ID: fake id`),
        );

        await expect(repository.delete(new UniqueEntityId('fe4b004d-07ef-4978-a554-9c4f2a5eb847'))).rejects.toThrow(
            new NotFoundError(`Entity not found using ID: fe4b004d-07ef-4978-a554-9c4f2a5eb847`),
        );
    });

    it('should delete a entity', async () => {
        const entity = new Category({ name: 'Movie' });
        await repository.insert(entity);

        await repository.delete(entity.id);
        const entityFound = await CategoryModel.findByPk(entity.id);

        expect(entityFound).toBeNull();
    });

    describe('search method tests', () => {
        it('should only apply paginate when other params are null', async () => {
            const created_at = new Date();
            await CategoryModel.factory()
                .count(16)
                .bulkCreate(() => ({
                    id: chance.guid({ version: 4 }),
                    name: 'Movie',
                    description: null,
                    is_active: true,
                    created_at,
                }));
            const spyToEntity = jest.spyOn(CategoryModelMapper, 'toEntity');
            const searchOutput = await repository.search(new CategoryRepository.SearchParams());

            expect(spyToEntity).toHaveBeenCalledTimes(15);
            expect(searchOutput).toBeInstanceOf(CategoryRepository.SearchResult);
            expect(searchOutput.toJSON()).toMatchObject({
                total: 16,
                current_page: 1,
                last_page: 2,
                per_page: 15,
                sort: null,
                sort_dir: null,
                filter: null,
            });

            searchOutput.items.forEach((item) => {
                expect(item).toBeInstanceOf(Category);
                expect(item.id).toBeDefined();
            });
            const items = searchOutput.items.map((item) => item.toJSON());
            expect(items).toMatchObject(
                new Array(15).fill({
                    name: 'Movie',
                    description: null,
                    is_active: true,
                    created_at,
                }),
            );
        });

        it('should order by created_at DESC when search params are null', async () => {
            const created_at = new Date();
            await CategoryModel.factory()
                .count(16)
                .bulkCreate((index) => ({
                    id: chance.guid({ version: 4 }),
                    name: `Movie${index}`,
                    description: null,
                    is_active: true,
                    created_at: new Date(created_at.getTime() + 100 + index),
                }));

            const searchOutput = await repository.search(new CategoryRepository.SearchParams());

            searchOutput.items.reverse().forEach((item, index) => {
                expect(item.name).toBe(searchOutput.items[index].name);
            });
        });

        it('should apply paginate and filter', async () => {
            const defaultProps = {
                description: null,
                is_active: true,
                created_at: new Date(),
            };

            const categoriesProp = [
                { id: chance.guid({ version: 4 }), name: 'test', ...defaultProps },
                { id: chance.guid({ version: 4 }), name: 'a', ...defaultProps },
                { id: chance.guid({ version: 4 }), name: 'TEST', ...defaultProps },
                { id: chance.guid({ version: 4 }), name: 'TeSt', ...defaultProps },
            ];

            const categories = await CategoryModel.bulkCreate(categoriesProp);

            let searchOutput = await repository.search(
                new CategoryRepository.SearchParams({ page: 1, per_page: 2, filter: 'TEST' }),
            );

            expect(searchOutput.toJSON(true)).toMatchObject(
                new CategoryRepository.SearchResult({
                    items: [CategoryModelMapper.toEntity(categories[0]), CategoryModelMapper.toEntity(categories[2])],
                    total: 3,
                    current_page: 1,
                    per_page: 2,
                    sort: null,
                    sort_dir: null,
                    filter: 'TEST',
                }).toJSON(true),
            );

            searchOutput = await repository.search(
                new CategoryRepository.SearchParams({ page: 2, per_page: 2, filter: 'TEST' }),
            );

            expect(searchOutput.toJSON(true)).toMatchObject(
                new CategoryRepository.SearchResult({
                    items: [CategoryModelMapper.toEntity(categories[3])],
                    total: 3,
                    current_page: 2,
                    per_page: 2,
                    sort: null,
                    sort_dir: null,
                    filter: 'TEST',
                }).toJSON(true),
            );
        });

        it('should apply paginate and sort', async () => {
            expect(repository.sortableFields).toStrictEqual(['name', 'created_at']);
            const defaultProps = {
                description: null,
                is_active: true,
                created_at: new Date(),
            };

            const categoriesProp = [
                { id: chance.guid({ version: 4 }), name: 'b', ...defaultProps },
                { id: chance.guid({ version: 4 }), name: 'a', ...defaultProps },
                { id: chance.guid({ version: 4 }), name: 'd', ...defaultProps },
                { id: chance.guid({ version: 4 }), name: 'e', ...defaultProps },
                { id: chance.guid({ version: 4 }), name: 'c', ...defaultProps },
            ];

            const categories = await CategoryModel.bulkCreate(categoriesProp);

            const arrange = [
                {
                    params: new CategoryRepository.SearchParams({ page: 1, per_page: 2, sort: 'name' }),
                    result: new CategoryRepository.SearchResult({
                        items: [
                            CategoryModelMapper.toEntity(categories[1]),
                            CategoryModelMapper.toEntity(categories[0]),
                        ],
                        total: 5,
                        current_page: 1,
                        per_page: 2,
                        sort: 'name',
                        sort_dir: 'asc',
                        filter: null,
                    }),
                },
                {
                    params: new CategoryRepository.SearchParams({ page: 2, per_page: 2, sort: 'name' }),
                    result: new CategoryRepository.SearchResult({
                        items: [
                            CategoryModelMapper.toEntity(categories[4]),
                            CategoryModelMapper.toEntity(categories[2]),
                        ],
                        total: 5,
                        current_page: 2,
                        per_page: 2,
                        sort: 'name',
                        sort_dir: 'asc',
                        filter: null,
                    }),
                },
                {
                    params: new CategoryRepository.SearchParams({
                        page: 1,
                        per_page: 2,
                        sort: 'name',
                        sort_dir: 'desc',
                    }),
                    result: new CategoryRepository.SearchResult({
                        items: [
                            CategoryModelMapper.toEntity(categories[3]),
                            CategoryModelMapper.toEntity(categories[2]),
                        ],
                        total: 5,
                        current_page: 1,
                        per_page: 2,
                        sort: 'name',
                        sort_dir: 'desc',
                        filter: null,
                    }),
                },
                {
                    params: new CategoryRepository.SearchParams({
                        page: 2,
                        per_page: 2,
                        sort: 'name',
                        sort_dir: 'desc',
                    }),
                    result: new CategoryRepository.SearchResult({
                        items: [
                            CategoryModelMapper.toEntity(categories[4]),
                            CategoryModelMapper.toEntity(categories[0]),
                        ],
                        total: 5,
                        current_page: 2,
                        per_page: 2,
                        sort: 'name',
                        sort_dir: 'desc',
                        filter: null,
                    }),
                },
            ];

            for (const i of arrange) {
                const result = await repository.search(i.params);
                expect(result.toJSON(true)).toMatchObject(i.result.toJSON(true));
            }
        });

        describe('should search using filter, sort and paginate', () => {
            const defaultProps = {
                description: null,
                is_active: true,
                created_at: new Date(),
            };

            const categoriesProps = [
                { id: chance.guid({ version: 4 }), name: 'test', ...defaultProps },
                { id: chance.guid({ version: 4 }), name: 'a', ...defaultProps },
                { id: chance.guid({ version: 4 }), name: 'TEST', ...defaultProps },
                { id: chance.guid({ version: 4 }), name: 'e', ...defaultProps },
                { id: chance.guid({ version: 4 }), name: 'TeSt', ...defaultProps },
            ];
            const arrange = [
                {
                    search_params: new CategoryRepository.SearchParams({
                        page: 1,
                        per_page: 2,
                        sort: 'name',
                        filter: 'TEST',
                    }),
                    search_result: new CategoryRepository.SearchResult({
                        items: [new Category(categoriesProps[2]), new Category(categoriesProps[4])],
                        total: 3,
                        current_page: 1,
                        per_page: 2,
                        sort: 'name',
                        sort_dir: 'asc',
                        filter: 'TEST',
                    }),
                },
                {
                    search_params: new CategoryRepository.SearchParams({
                        page: 2,
                        per_page: 2,
                        sort: 'name',
                        filter: 'TEST',
                    }),
                    search_result: new CategoryRepository.SearchResult({
                        items: [new Category(categoriesProps[0])],
                        total: 3,
                        current_page: 2,
                        per_page: 2,
                        sort: 'name',
                        sort_dir: 'asc',
                        filter: 'TEST',
                    }),
                },
            ];
            beforeEach(async () => {
                await CategoryModel.bulkCreate(categoriesProps);
            });

            test.each(arrange)('when value is %j', async ({ search_params, search_result }) => {
                const result = await repository.search(search_params);
                expect(result.toJSON(true)).toMatchObject(search_result.toJSON(true));
            });
        });
    });
});
