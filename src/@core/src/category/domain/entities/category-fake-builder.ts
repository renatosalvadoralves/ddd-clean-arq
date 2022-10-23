import { UniqueEntityId } from '#shared/domain';
import { Chance } from 'chance';
import { Category } from './category';

type PropOrFactory<T> = T | ((index: number) => T);

export class CategoryFakeBuilder<TBuild = any> {
    private chance: Chance.Chance;
    private countObjs = 1;

    private _unique_entity_id = undefined;
    private _name: PropOrFactory<string> = (_index) => this.chance.word();
    private _description: PropOrFactory<string | null> = (_index) => this.chance.paragraph();
    private _is_active: PropOrFactory<boolean> = (_index) => true;
    private _created_at = undefined;

    static aCategory() {
        return new CategoryFakeBuilder<Category>();
    }

    static theCategories(countObjs: number) {
        return new CategoryFakeBuilder<Category[]>(countObjs);
    }

    // CategoryFakeBuilder nao pode ser instanciada so atraves de aCategory/theCategories
    private constructor(countObjs = 1) {
        this.countObjs = countObjs;
        this.chance = Chance();
    }

    withUniqueEntityId(valueOrFactory: PropOrFactory<UniqueEntityId>) {
        this._unique_entity_id = valueOrFactory;
        return this;
    }

    withName(valueOrFactory: PropOrFactory<string>) {
        this._name = valueOrFactory;
        return this;
    }

    withInvalidNameEmpty(value: '' | null | undefined) {
        this._name = value;
        return this;
    }

    withInvalidNameNotAsString(value?: any) {
        this._name = value ?? 5;
        return this;
    }

    withInvalidNameTooLong(value?: string) {
        this._name = value ?? this.chance.word({ length: 256 });
        return this;
    }

    withDescription(valueOrFactory: PropOrFactory<string | null>) {
        this._description = valueOrFactory;
        return this;
    }

    withInvalidDescriptionNotAsString(value?: any) {
        this._description = value ?? 5;
        return this;
    }

    activate() {
        this._is_active = true;
        return this;
    }

    deactivate() {
        this._is_active = false;
        return this;
    }

    withInvalidIsActiveEmpty(value?: '' | null | undefined) {
        this._is_active = value as any;
        return this;
    }

    withInvalidIsActiveNotABoolean(value?: any) {
        this._is_active = (value | ('fake boolean' as any)) as any;
        return this;
    }

    withCreatedAt(valueOrFactory: PropOrFactory<Date>) {
        this._created_at = valueOrFactory;
        return this;
    }

    build(): TBuild {
        const categories = new Array(this.countObjs).fill(undefined).map(
            (_, i) =>
                new Category(
                    {
                        ...(this._created_at && { created_at: this.callFactory(this._created_at, i) }),
                        name: this.callFactory(this._name, i),
                        description: this.callFactory(this._description, i),
                        is_active: this.callFactory(this._is_active, i),
                    },
                    !this._unique_entity_id ? undefined : this.callFactory(this._unique_entity_id, i),
                ),
        );

        return this.countObjs === 1 ? (categories[0] as any) : categories;
    }

    get unique_entity_id() {
        return this.getValue('unique_entity_id');
    }

    get name() {
        return this.getValue('name');
    }

    get description() {
        return this.getValue('description');
    }

    get is_active() {
        return this.getValue('is_active');
    }
    get created_at() {
        return this.getValue('created_at');
    }

    private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
        return typeof factoryOrValue === 'function' ? factoryOrValue(index) : factoryOrValue;
    }

    private getValue(prop) {
        const optional = ['unique_entity_id', 'created_at'];
        const privateProp = `_${prop}`;

        if (!this[privateProp] && optional.includes(prop)) {
            throw new Error(`Property ${prop} not have a factory, use 'with' methods`);
        }

        return this.callFactory(this[privateProp], 0);
    }
}
