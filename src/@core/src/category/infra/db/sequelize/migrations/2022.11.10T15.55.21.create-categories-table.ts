import { MigrationFn } from 'umzug';
import { Sequelize, DataTypes } from 'sequelize';
import { migrator, setupSequelize } from '#shared/infra';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().createTable('categories', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE(3), // fractional seconds
            allowNull: false,
        },
    });
};
export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().dropTable('categories');
};

/* describe('', () => {
    const sequelize = setupSequelize();

    it('up', async () => {
        await migrator(sequelize.sequelize).up({ to: '2022.11.10T15.55.21.create-categories-table' });

        //CategoryModel.create({});
    });

    it('down', async () => {
        const umzug = migrator(sequelize.sequelize);

        await umzug.up({ to: '2022.11.10T15.55.21.create-categories-table' });
        await umzug.down({ to: 0 });

        await umzug.executed();
    });
});
 */
