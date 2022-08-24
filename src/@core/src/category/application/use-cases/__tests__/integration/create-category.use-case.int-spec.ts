import { CategorySequelize } from '#category/infra';
import { CreateCategoryUseCase } from '#category/application';
import { setupSequelize } from '#shared/infra';

const { CategorySequelizeRepository, CategoryModel } = CategorySequelize;
describe('CreateCategoryUseCase Integration Tests', () => {
    let useCase: CreateCategoryUseCase.UseCase;
    let repository: CategorySequelize.CategorySequelizeRepository;

    setupSequelize({ models: [CategoryModel] });

    beforeEach(() => {
        repository = new CategorySequelizeRepository(CategoryModel);
        useCase = new CreateCategoryUseCase.UseCase(repository);
    });

    describe('test with test.each', () => {
        const arrange = [
            {
                inputProps: {
                    name: 'test',
                },
                outputProps: {
                    name: 'test',
                    description: null,
                    is_active: true,
                },
            },
            {
                inputProps: {
                    name: 'test',
                    description: 'some description',
                    is_active: false,
                },
                outputProps: {
                    name: 'test',
                    description: 'some description',
                    is_active: false,
                },
            },
        ];

        test.each(arrange)('input $input , output $output', async ({ inputProps, outputProps }) => {
            const output = await useCase.execute(inputProps);
            const entity = await repository.findById(output.id);
            expect(output.id).toBe(entity.id);
            expect(output.created_at).toStrictEqual(entity.created_at);
            expect(output).toMatchObject(outputProps);
        });
    });

    /* it('should create a category', async () => {
        let output = await useCase.execute({ name: 'test' });
        let entity = await repository.findById(output.id);

        expect(output).toStrictEqual({
            id: entity.id,
            name: 'test',
            description: null,
            is_active: true,
            created_at: entity.created_at,
        });

        output = await useCase.execute({
            name: 'test',
            description: 'some description',
            is_active: false,
        });

        entity = await repository.findById(output.id);
        expect(output).toStrictEqual({
            id: entity.id,
            name: 'test',
            description: 'some description',
            is_active: false,
            created_at: entity.created_at,
        });
    }); */
});
