import { Table, Column, PrimaryKey, Model, DataType } from 'sequelize-typescript';
import { SequelizeModelFactory } from './sequelize-model-factory';
import _chance from 'chance';
import { validate as uuidValidate } from 'uuid';
import { setupSequelize } from '../testing';

const chance = _chance();

@Table({})
class StubModel extends Model {
    @PrimaryKey
    @Column({ type: DataType.UUID })
    declare id;

    @Column({
        allowNull: false,
        type: DataType.STRING(255),
    })
    declare name;

    static mockFactory = jest.fn(() => ({
        id: chance.guid({ version: 4 }),
        name: chance.word(),
    }));

    static factory() {
        return new SequelizeModelFactory<StubModel, { id: string; name: string }>(StubModel, StubModel.mockFactory);
    }
}

describe('SequelizeModelFactory Unit Tests', () => {
    setupSequelize({ models: [StubModel] });

    test('create method', async () => {
        let model = await StubModel.factory().create();
        expect(uuidValidate(model.id)).toBeTruthy();
        expect(model.name).not.toBeNull();
        expect(StubModel.mockFactory).toHaveBeenCalled();
        let modelFound = await StubModel.findByPk(model.id);
        expect(model.id).toBe(modelFound.id);

        model = await StubModel.factory().create({
            id: 'a99e642f-1ef4-415d-97bd-82b98002b457',
            name: 'some name',
        });
        expect(model.id).not.toBeNull();
        expect(model.id).toBe('a99e642f-1ef4-415d-97bd-82b98002b457');
        expect(model.name).toBe('some name');

        expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);
        modelFound = await StubModel.findByPk(model.id);
        expect(model.id).toBe(modelFound.id);
    });

    test('make method', () => {
        let model = StubModel.factory().make();
        expect(uuidValidate(model.id)).toBeTruthy();
        expect(model.name).not.toBeNull();
        expect(StubModel.mockFactory).toHaveBeenCalled();

        model = StubModel.factory().make({
            id: 'a99e642f-1ef4-415d-97bd-82b98002b457',
            name: 'some name',
        });

        expect(model.id).toBe('a99e642f-1ef4-415d-97bd-82b98002b457');
        expect(model.name).toBe('some name');
        expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);
    });

    test('bulkCreate method using count = 1', async () => {
        let models = await StubModel.factory().bulkCreate();

        expect(models).toHaveLength(1);
        expect(models[0].id).not.toBeNull();
        expect(models[0].name).not.toBeNull();
        expect(models[0].id).not.toBe(models[0].name);
        expect(StubModel.mockFactory).toHaveBeenCalled();

        let modelFound = await StubModel.findByPk(models[0].id);
        expect(models[0].id).toBe(modelFound.id);
        expect(models[0].name).toBe(modelFound.name);

        models = await StubModel.factory().bulkCreate(() => ({
            id: 'a99e642f-1ef4-415d-97bd-82b98002b457',
            name: 'some name',
        }));
        expect(models[0].id).not.toBeNull();
        expect(models[0].id).toBe('a99e642f-1ef4-415d-97bd-82b98002b457');
        expect(models[0].name).toBe('some name');

        expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);
        modelFound = await StubModel.findByPk(models[0].id);
        expect(models[0].id).toBe(modelFound.id);
    });

    test('bulkCreate method using count > 1', async () => {
        let models = await StubModel.factory().count(2).bulkCreate();

        expect(models).toHaveLength(2);
        expect(models[0].id).not.toBeNull();
        expect(models[0].name).not.toBeNull();
        expect(models[1].id).not.toBeNull();
        expect(models[1].name).not.toBeNull();
        expect(models[0].id).not.toBe(models[1].name);
        expect(StubModel.mockFactory).toHaveBeenCalledTimes(2);

        const modelFound1 = await StubModel.findByPk(models[0].id);
        expect(models[0].id).toBe(modelFound1.id);
        expect(models[0].name).toBe(modelFound1.name);

        const modelFound2 = await StubModel.findByPk(models[1].id);
        expect(models[1].id).toBe(modelFound2.id);
        expect(models[1].name).toBe(modelFound2.name);

        models = await StubModel.factory()
            .count(2)
            .bulkCreate(() => ({
                id: chance.guid({ version: 4 }),
                name: 'some name',
            }));
        expect(models).toHaveLength(2);
        expect(models[0].id).not.toBe(models[1].id);
        expect(models[0].name).toBe('some name');
        expect(models[1].name).toBe('some name');
        expect(StubModel.mockFactory).toHaveBeenCalledTimes(2);
    });

    test('bulkMake method using count = 1', () => {
        let models = StubModel.factory().bulkMake();

        expect(models).toHaveLength(1);
        expect(models[0].id).not.toBeNull();
        expect(models[0].name).not.toBeNull();
        expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);

        models = StubModel.factory().bulkMake(() => ({
            id: 'a99e642f-1ef4-415d-97bd-82b98002b457',
            name: 'some name',
        }));
        expect(models).toHaveLength(1);
        expect(models[0].id).toBe('a99e642f-1ef4-415d-97bd-82b98002b457');
        expect(models[0].name).toBe('some name');

        expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);
    });

    test('bulkMake method using count > 1', () => {
        let models = StubModel.factory().count(2).bulkMake();

        expect(models).toHaveLength(2);
        expect(StubModel.mockFactory).toHaveBeenCalledTimes(2);
        expect(models[0].id).not.toBeNull();
        expect(models[0].name).not.toBeNull();
        expect(models[1].id).not.toBeNull();
        expect(models[1].name).not.toBeNull();

        models = StubModel.factory()
            .count(2)
            .bulkMake(() => ({
                id: chance.guid({ version: 4 }),
                name: 'some name',
            }));

        expect(models).toHaveLength(2);
        expect(models[0].id).not.toBe(models[1].id);
        expect(models[0].name).toBe('some name');
        expect(models[1].name).toBe('some name');
        expect(StubModel.mockFactory).toHaveBeenCalledTimes(2);
    });
});
