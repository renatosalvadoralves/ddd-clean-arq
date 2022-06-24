import { UniqueEntityId } from '#shared/domain';

export abstract class Entity<T = any> {
    public readonly uniqueEntityId: UniqueEntityId;

    constructor(public readonly props: T, id?: UniqueEntityId) {
        this.uniqueEntityId = id || new UniqueEntityId();
    }

    get id() {
        return this.uniqueEntityId.value;
    }

    toJSON() {
        return {
            id: this.id,
            ...this.props,
        } as Required<{ id: string } & T>;
    }
}

export default Entity;
