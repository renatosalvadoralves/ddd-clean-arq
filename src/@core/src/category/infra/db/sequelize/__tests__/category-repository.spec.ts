import { CategoryModel } from '#category/infra';
import { Category } from '#category/domain';
import { CategorySequelizeRepository } from '../category-repository';
import { NotFoundError, UniqueEntityId } from '#shared/domain';
import { setupSequelize } from '#shared/infra';

describe('CategorySequelizeRepository Integration Tests', () => {
    setupSequelize({ models: [CategoryModel] });

    let repository: CategorySequelizeRepository;

    beforeEach(async () => {
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
});
