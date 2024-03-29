import { DataType } from 'sequelize-typescript';
import { CategorySequelize } from '#category/infra';
import { setupSequelize } from '#shared/infra';

describe('CategoryModel Unit Tests', () => {
    setupSequelize({ models: [CategorySequelize.CategoryModel] });

    test('mapping props', () => {
        const attributesMap = CategorySequelize.CategoryModel.getAttributes();
        const attributes = Object.keys(CategorySequelize.CategoryModel.getAttributes());

        expect(attributes).toStrictEqual(['id', 'name', 'description', 'is_active', 'created_at']);

        const idAttr = attributesMap.id;
        expect(idAttr).toMatchObject({
            field: 'id',
            fieldName: 'id',
            primaryKey: true,
            type: DataType.UUID(),
        });

        const nameAttr = attributesMap.name;
        expect(nameAttr).toMatchObject({
            field: 'name',
            fieldName: 'name',
            type: DataType.STRING(255),
        });

        const descriptionAttr = attributesMap.description;
        expect(descriptionAttr).toMatchObject({
            field: 'description',
            fieldName: 'description',
            type: DataType.TEXT(),
        });

        const isActiveAttr = attributesMap.is_active;
        expect(isActiveAttr).toMatchObject({
            field: 'is_active',
            fieldName: 'is_active',
            type: DataType.BOOLEAN(),
        });

        const createdAtAttr = attributesMap.created_at;
        expect(createdAtAttr).toMatchObject({
            field: 'created_at',
            fieldName: 'created_at',
            type: DataType.DATE(),
        });
    });

    test('create', async () => {
        const arrange = {
            id: 'a99e642f-1ef4-415d-97bd-82b98002b457',
            name: 'test',
            is_active: true,
            created_at: new Date(),
        };

        const category = await CategorySequelize.CategoryModel.build(arrange).save();
        expect(category.toJSON()).toStrictEqual(arrange);
    });
});
