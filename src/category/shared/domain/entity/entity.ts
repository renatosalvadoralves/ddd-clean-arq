import UniqueEntityId from "../value-objects/unique-entity-id.vo";

export default abstract class Entity<T> {
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
            ...this.props
        } as Required<{ id: string } & T>
    }
}