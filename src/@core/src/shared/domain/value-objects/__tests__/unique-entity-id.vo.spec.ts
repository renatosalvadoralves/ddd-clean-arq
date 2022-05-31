import InvalidUuidError from '../../errors/invalid-uuid.error';
import UniqueEntityId from '../unique-entity-id.vo';
import { validate as uuidValidate } from 'uuid';

function spyValidateMethod() {
    return jest.spyOn(UniqueEntityId.prototype as any, 'validate');
}

describe('UniqueEntityId Unit Tests', () => {
    const validateSpy = jest.spyOn(UniqueEntityId.prototype as any, 'validate');

    beforeEach(() => validateSpy.mockClear());

    it('should throw error when uuid is invalid', () => {
        expect(() => new UniqueEntityId('fake id')).toThrow(new InvalidUuidError('fake id'));
        expect(validateSpy).toHaveBeenCalled();
    });

    it('should accept a uuid passed in constructor', () => {
        const id = 'a99e642f-1ef4-415d-97bd-82b98002b457';
        const vo = new UniqueEntityId(id);

        expect(vo.value).toBe(id);
        expect(validateSpy).toHaveBeenCalled();
    });

    it('should create uuid and be valid', () => {
        const vo = new UniqueEntityId();

        expect(uuidValidate(vo.value)).toBeTruthy();
        expect(validateSpy).toHaveBeenCalled();
    });
});
