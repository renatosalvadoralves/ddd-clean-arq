import { v4 as uuid } from 'uuid';
import { validate as uuidValidate } from 'uuid';
import InvalidUuidError from '../errors/invalid-uuid.error';
import ValueObject from './value-object';

export class UniqueEntityId extends ValueObject<string> {
    constructor(readonly id?: string) {
        super(id || uuid());
        this.validate();
    }

    private validate() {
        const isValid = uuidValidate(this.value);

        if (!isValid) {
            throw new InvalidUuidError(this.id);
        }
    }
}

export default UniqueEntityId;
