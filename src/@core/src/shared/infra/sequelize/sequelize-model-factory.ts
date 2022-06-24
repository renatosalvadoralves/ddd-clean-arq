export class SequelizeModelFactory {
    private _count = 1;

    constructor(private model, private defaultFactoryProps: () => any) {}

    count(count: number) {
        this._count = count;
        return this;
    }

    async create(data?) {
        return this.model.create(data ? data : this.defaultFactoryProps());
    }

    make(data?) {
        return this.model.build(data ? data : this.defaultFactoryProps());
    }

    async bulkCreate(factoryProps?: (index: number) => any) {
        const data = new Array(this._count)
            .fill(factoryProps ? factoryProps : this.defaultFactoryProps)
            .map(({ factory, index }) => factory(index));
        this.model.bulkCreate(data);
    }

    bulkMake() {}
}
