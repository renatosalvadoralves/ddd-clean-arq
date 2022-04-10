import Entity from '../../../shared/domain/entity/entity';
import UniqueEntityId from '../../../shared/domain/value-objects/unique-entity-id.vo'
import CategoryValidatorFactory from "../validators/category.validator";
import { EntityValidationError } from '../../../shared/domain/errors/validation-error';

export type CategoryProperties = {
    name: string,
    is_active?: boolean,
    description?: string,
    created_at?: Date
}

export class Category extends Entity<CategoryProperties> {
    constructor(public readonly props: CategoryProperties, id?: UniqueEntityId) {
        Category.validate(props);
        super(props, id)
        this.description = this.props.description;
        this.props.is_active = this.props.is_active ?? true;
        this.props.created_at = this.props.created_at ?? new Date();
    }

    update(name: string, description: string) {
        Category.validate({ name, description });
        this.description = description;
        this.name = name;
    }

    /* static validate(props: Omit<CategoryProperties, 'created_at'>) {
        ValidatorRules.values(props.name, "name").required().string().maxLength(255);
        ValidatorRules.values(props.description, "description").string();
        ValidatorRules.values(props.is_active, "is_active").boolean();
    } */

    static validate(props: CategoryProperties) {
        const validator = CategoryValidatorFactory.create();
        const isValid = validator.validate(props);

        if (!isValid) {
            throw new EntityValidationError(validator.errors)
        }
    }

    activate() {
        this.is_active = true;
    }

    deactivate() {
        this.is_active = false;
    }

    get name() {
        return this.props.name;
    }

    private set name(value) {
        this.props.name = value;
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

