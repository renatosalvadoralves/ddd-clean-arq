import { CategoryFakeBuilder } from '#category/domain';
import { CategoryInMemoryRepository } from '#category/infra';

describe('CategoryInMemoryRepository', () => {
    let repository: CategoryInMemoryRepository;
    let faker: CategoryFakeBuilder;

    beforeEach(() => {
        repository = new CategoryInMemoryRepository();
        faker = CategoryFakeBuilder.aCategory();
    });
    it('should no filter items when filter object is null', async () => {
        const items = [faker.build()];
        const filterSpy = jest.spyOn(items, 'filter' as any);

        const itemsFiltered = await repository['applyFilter'](items, null);
        expect(filterSpy).not.toHaveBeenCalled();
        expect(itemsFiltered).toStrictEqual(itemsFiltered);
    });

    it('should filter items using filter parameter', async () => {
        const items = [faker.withName('test').build(), faker.withName('TEST').build(), faker.withName('fake').build()];

        const filterSpy = jest.spyOn(items, 'filter' as any);

        const itemsFiltered = await repository['applyFilter'](items, 'TEST');
        expect(filterSpy).toHaveBeenCalledTimes(1);
        expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
    });

    it('should soft by created_at when sort param is null', async () => {
        const created_at = new Date();
        const items = [
            faker.withCreatedAt(created_at).build(),
            faker.withCreatedAt(new Date(created_at.getTime() + 100)).build(),
            faker.withCreatedAt(new Date(created_at.getTime() + 200)).build(),
        ];
        const itemsSorted = await repository['applySort'](items, null, null);
        expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);
    });

    it('should sort by name', async () => {
        const items = [faker.withName('c').build(), faker.withName('b').build(), faker.withName('a').build()];

        let itemsSorted = await repository['applySort'](items, 'name', 'asc');
        expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);

        itemsSorted = await repository['applySort'](items, 'name', 'desc');
        expect(itemsSorted).toStrictEqual([items[0], items[1], items[2]]);
    });
});
