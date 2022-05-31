import { UniqueEntityId, Entity } from '#shared/domain';
import { validate as uuidValidate } from 'uuid';

class StubEntity extends Entity<{ prop1: string; prop2: number }> {}

describe('Entity Unit Tests', () => {
    it('should set props and id', () => {
        const arrange = {
            prop1: 'prop1 value',
            prop2: 10,
        };

        const entity = new StubEntity(arrange);
        expect(entity.props).toStrictEqual(arrange);
        expect(entity.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
        expect(entity.id).not.toBeNull();
        expect(uuidValidate(entity.id)).toBeTruthy();
    });

    it('should accept a valid uuid', () => {
        const arrange = {
            prop1: 'prop1 value',
            prop2: 10,
        };
        const uniqueEntityId = new UniqueEntityId();

        const entity = new StubEntity(arrange, uniqueEntityId);
        expect(entity.props).toStrictEqual(arrange);
        expect(entity.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
        expect(entity.id).toBe(uniqueEntityId.value);
    });

    it('should convert a entity to a JavaScript Object', () => {
        const arrange = {
            prop1: 'prop1 value',
            prop2: 10,
        };
        const uniqueEntityId = new UniqueEntityId();

        const entity = new StubEntity(arrange, uniqueEntityId);
        expect(entity.toJSON()).toStrictEqual({
            id: entity.id,
            ...arrange,
        });
    });
});
