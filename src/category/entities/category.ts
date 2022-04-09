import UniqueEntityId from '../shared/domain/value-objects/unique-entity-id.vo'

export type CategoryProperties = {
    name: string,
    is_active?: boolean,
    description?: string,
    created_at?: Date
}

export class Category {
    public readonly id: UniqueEntityId;

    constructor(public readonly props: CategoryProperties, id?: UniqueEntityId) {
        this.id = id || new UniqueEntityId();
        this.description = this.props.description;
        this.props.is_active = this.props.is_active ?? true;
        this.props.created_at = this.props.created_at ?? new Date();
    }

    get name() {
        return this.props.name;
    }

    get description() {
        return this.props.description;
    }

    private set description(value) {
        this.props.description = value ?? null;
    }

    get is_active() {
        return this.props.is_active;
    }

    private set is_active(value) {
        this.props.is_active = value ?? null;
    }

    get created_at() {
        return this.props.created_at;
    }
}

