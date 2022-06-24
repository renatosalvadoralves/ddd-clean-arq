import { Entity, NotFoundError, InMemoryRepository } from "#shared/domain";

type StubEntityProps = {
    name: string;
    price: number;
}

class StubEntity extends Entity<StubEntityProps> { }
class StubInMemoryRepository extends InMemoryRepository<StubEntity> { }

describe('InMemoryRepository Unit Tests', () => {
    let repository: StubInMemoryRepository;

    beforeEach(() =>
        repository = new StubInMemoryRepository()
    )
    it('should inserts a new entity', async () => {
        const entity = new StubEntity({ name: "test", price: 5 });
        await repository.insert(entity);

        expect(entity.toJSON()).toStrictEqual(repository.items[0].toJSON());
    });

    it('should throws error when entity not found', async () => {
        await expect(repository.findById("fake uid")).rejects.toThrow(
            new NotFoundError("Entity not found using ID: fake uid")
        );

        await expect(repository.findById("829137b2-bce5-4651-aa75-20da6548b8f3")).rejects.toThrow(
            new NotFoundError("Entity not found using ID: 829137b2-bce5-4651-aa75-20da6548b8f3")
        );
    });

    it('should should find entity by id', async () => {
        const entity = new StubEntity({ name: "test", price: 5 });

        await repository.insert(entity);
        let entityFound = await repository.findById(entity.id);

        expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());

        entityFound = await repository.findById(entityFound.id);
        expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
    });

    it('should find all entities', async () => {
        const entity = new StubEntity({ name: "test", price: 5 });

        await repository.insert(entity);
        const entities = await repository.findAll();

        expect(entities).toStrictEqual([entity]);
    });

    it('should throws error when update not exist', async () => {
        const entity = new StubEntity({ name: "test", price: 5 });
        await expect(repository.update(entity)).rejects.toThrow(
            new NotFoundError(`Entity not found using ID: ${entity.id}`)
        );
    });

    it('should updates as entity', async () => {
        const entity = new StubEntity({ name: "test", price: 5 });
        await repository.insert(entity);
        const entityUpdated = new StubEntity({ name: "test2", price: 5 }, entity.uniqueEntityId);
        await repository.update(entityUpdated);
        expect(entityUpdated.toJSON()).toStrictEqual(repository.items[0].toJSON());
    });

    it('should throws error in delete when entity not found', async () => {
        await expect(repository.delete("fake uid")).rejects.toThrow(
            new NotFoundError("Entity not found using ID: fake uid")
        );

        await expect(repository.delete("829137b2-bce5-4651-aa75-20da6548b8f3")).rejects.toThrow(
            new NotFoundError("Entity not found using ID: 829137b2-bce5-4651-aa75-20da6548b8f3")
        );
    });

    it('should deletes an entity', async () => {
        const entity = new StubEntity({ name: "test", price: 5 });

        await repository.insert(entity);
        await repository.delete(entity.id);
        expect(repository.items).toHaveLength(0);

        await repository.insert(entity);
        await repository.delete(entity.uniqueEntityId);
        expect(repository.items).toHaveLength(0);
    });
});