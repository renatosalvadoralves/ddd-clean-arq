import { CategoryFakeBuilder } from '../category-fake-builder';
import { Chance } from 'chance';
import { UniqueEntityId } from '#shared/domain';

describe('CategoryFakeBuilder Unit Tests', () => {
    describe('unique_entity_id prop', () => {
        const faker = CategoryFakeBuilder.aCategory();

        it('should throw error when any with methods has called', () => {
            expect(() => faker['getValue']('unique_entity_id')).toThrow(
                new Error("Property unique_entity_id not have a factory, use 'with' methods"),
            );
        });

        it('should be undefined', () => {
            expect(faker['_unique_entity_id']).toBeUndefined();
        });

        test('withUniqueEntityId', () => {
            const uniqueEntityId = new UniqueEntityId();
            const $this = faker.withUniqueEntityId(uniqueEntityId);
            expect($this).toBeInstanceOf(CategoryFakeBuilder);
            expect(faker['_unique_entity_id']).toBe(uniqueEntityId);

            faker.withUniqueEntityId(() => uniqueEntityId);
            expect(faker['_unique_entity_id']()).toBe(uniqueEntityId);
            console.log(faker);
            expect(faker.unique_entity_id).toBe(uniqueEntityId);
        });

        it('should pass index to unique_entity_id factory', () => {
            let mockFactory = jest.fn().mockReturnValue(new UniqueEntityId());
            faker.withUniqueEntityId(mockFactory);
            faker.build();
            expect(mockFactory).toHaveBeenCalledWith(0);

            mockFactory = jest.fn().mockReturnValue(new UniqueEntityId());
            const fakerMany = CategoryFakeBuilder.theCategories(2);
            fakerMany.withUniqueEntityId(mockFactory);
            fakerMany.build();

            expect(mockFactory).toHaveBeenCalledWith(0);
            expect(mockFactory).toHaveBeenCalledWith(1);
        });
    });

    describe('created_at prop', () => {
        const faker = CategoryFakeBuilder.aCategory();

        it('should be undefined', () => {
            expect(faker['_created_at']).toBeUndefined();
        });

        test('withCreatedAt', () => {
            const date = new Date();
            const $this = faker.withCreatedAt(date);
            expect($this).toBeInstanceOf(CategoryFakeBuilder);
            expect(faker['_created_at']).toBe(date);

            faker.withCreatedAt(() => date);
            expect(faker['_created_at']()).toBe(date);
        });

        it('should pass index to created_at factory', () => {
            const date = new Date();
            faker.withCreatedAt((index) => new Date(date.getTime() + index + 2));
            const category = faker.build();
            expect(category.created_at.getTime()).toBe(date.getTime() + 2);

            const fakerMany = CategoryFakeBuilder.theCategories(2);
            fakerMany.withCreatedAt((index) => new Date(date.getTime() + index + 2));
            const categories = fakerMany.build();

            expect(categories[0].created_at.getTime()).toBe(date.getTime() + 0 + 2);
            expect(categories[1].created_at.getTime()).toBe(date.getTime() + 1 + 2);
        });
    });
    describe('name prop', () => {
        const faker = CategoryFakeBuilder.aCategory();

        it('should be a function', () => {
            expect(typeof faker['_name'] === 'function').toBeTruthy();
        });

        it('should call the word method', () => {
            const chance = Chance();
            const spyWordMethod = jest.spyOn(chance, 'word');
            faker['chance'] = chance;
            faker.build();
            expect(spyWordMethod).toHaveBeenCalled();
        });

        it('withName', () => {
            const $this = faker.withName('test name');
            expect($this).toBeInstanceOf(CategoryFakeBuilder);
            expect(faker['_name']).toBe('test name');

            faker.withName(() => 'test name');
            //@ts-expect-error
            expect(faker['_name']()).toBe('test name');
            expect(faker.name).toBe('test name');
        });

        it('should pass index to name factory', () => {
            faker.withName((index) => `test name ${index}`);
            const category = faker.build();
            expect(category.name).toBe(`test name 0`);

            const fakerMany = CategoryFakeBuilder.theCategories(2);
            fakerMany.withName((index) => `test name ${index}`);
            const categories = fakerMany.build();

            expect(categories[0].name).toBe(`test name 0`);
            expect(categories[1].name).toBe(`test name 1`);
        });

        test('invalid empty case', () => {
            const $this = faker.withInvalidNameEmpty(undefined);
            expect($this).toBeInstanceOf(CategoryFakeBuilder);
            expect(faker['_name']).toBeUndefined();

            faker.withInvalidNameEmpty(null);
            expect(faker['_name']).toBeNull();

            faker.withInvalidNameEmpty('');
            expect(faker['_name']).toBe('');
        });

        test('invalid too long case', () => {
            const $this = faker.withInvalidNameTooLong();
            expect($this).toBeInstanceOf(CategoryFakeBuilder);
            expect(faker['_name'].length).toBe(256);

            const tooLong = 'a'.repeat(256);
            faker.withInvalidNameTooLong(tooLong);
            expect(faker['_name'].length).toBe(256);
            expect(faker['_name']).toBe(tooLong);
        });
    });

    describe('description prop', () => {
        const faker = CategoryFakeBuilder.aCategory();

        it('should be a function', () => {
            expect(typeof faker['_name'] === 'function').toBeTruthy();
        });

        it('should call the word method', () => {
            const chance = Chance();
            const spyWordMethod = jest.spyOn(chance, 'paragraph');
            faker['chance'] = chance;
            faker.build();
            expect(spyWordMethod).toHaveBeenCalled();
        });

        it('withDescription', () => {
            const $this = faker.withDescription('test description');
            expect($this).toBeInstanceOf(CategoryFakeBuilder);
            expect(faker['_description']).toBe('test description');

            faker.withDescription(() => 'test description');
            //@ts-expect-error
            expect(faker['_description']()).toBe('test description');
        });

        it('should pass index to description factory', () => {
            faker.withDescription((index) => `test description ${index}`);
            const category = faker.build();
            expect(category.description).toBe(`test description 0`);

            const fakerMany = CategoryFakeBuilder.theCategories(2);
            fakerMany.withDescription((index) => `test description ${index}`);
            const categories = fakerMany.build();

            expect(categories[0].description).toBe(`test description 0`);
            expect(categories[1].description).toBe(`test description 1`);
        });
    });
});
