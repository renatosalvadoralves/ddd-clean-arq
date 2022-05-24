import { Sequelize } from "sequelize-typescript";
import { CategoryModel } from "#category/infra";
import { CategoryModelMapper } from "../category-mapper";
import { LoadEntityError } from "#shared/domain";

describe('CategoryModelMapper Unit Tests', () => {
    let sequelize: Sequelize;

    beforeAll(() => sequelize = new Sequelize({
        dialect: 'sqlite',
        host: ':memory',
        logging: false,
        models: [CategoryModel]
    }));

    beforeEach(async () => {
        await sequelize.sync({ force: true })
    });

    afterAll(async () => {
        await sequelize.close()
    });
    it('should throws error when category is invalid', () => {
        const model = CategoryModel.build({
            id: 'ba9aa86c-06db-4e4e-a598-ed8b1da22307'
        })

        try {
            CategoryModelMapper.toEntity(model);
            fail('The category is valid, but it needs throws a LoadEntityError')
        } catch (error) {
            expect(error).toBeInstanceOf(LoadEntityError)
            expect(error.error).toMatchObject({
                name: [
                    'name should not be empty',
                    'name must be a string',
                    'name must be shorter than or equal to 255 characters'
                ]
            })
        }
    });
})