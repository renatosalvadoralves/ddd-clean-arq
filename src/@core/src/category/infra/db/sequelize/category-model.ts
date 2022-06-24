import { SequelizeModelFactory } from '#shared/infra';
import { Column, DataType, PrimaryKey, Table, Model } from 'sequelize-typescript';
import _chance from 'chance';

const chance = _chance();
type CategoryModelProperties = {
    id: string;
    name: string;
    description: string | null;
    is_active: boolean;
    created_at: Date;
};

@Table({ tableName: 'categories', timestamps: false })
export class CategoryModel extends Model<CategoryModelProperties> {
    @PrimaryKey
    @Column({ type: DataType.UUID })
    declare id: string;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    declare name: string;

    @Column({ allowNull: true, type: DataType.TEXT })
    declare description: string | null;

    @Column({ allowNull: false, type: DataType.BOOLEAN })
    declare is_active: boolean;

    @Column({ allowNull: false, type: DataType.DATE })
    declare created_at: Date;

    static factory() {
        return new SequelizeModelFactory(CategoryModel, () => ({
            id: chance.guid({ version: 4 }),
            name: chance.word(),
            description: chance.paragraph(),
            is_active: true,
            created_at: chance.date(),
        }));
    }
}
