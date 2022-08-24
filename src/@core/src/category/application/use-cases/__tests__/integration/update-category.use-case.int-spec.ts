import { NotFoundError } from '#shared/domain';
import { CategorySequelize } from '#category/infra';
import { UpdateCategoryUseCase } from '#category/application';
import { setupSequelize } from '#shared/infra';

const { CategorySequelizeRepository, CategoryModel } = CategorySequelize;
describe('UpdateCategoryUseCase Integration Tests', () => {
    let useCase: UpdateCategoryUseCase.UseCase;
    let repository: CategorySequelize.CategorySequelizeRepository;

    setupSequelize({ models: [CategoryModel] });

    beforeEach(() => {
        repository = new CategorySequelizeRepository(CategoryModel);
        useCase = new UpdateCategoryUseCase.UseCase(repository);
    });

    it('should throw error when entity not found', async () => {
        await expect(() => useCase.execute({ id: 'fake id' } as any)).rejects.toThrowError(
            new NotFoundError(`Entity not found using ID: fake id`),
        );
    });

    it('should update a category', async () => {
        const model = await CategoryModel.factory().create();

        let output = await useCase.execute({
            id: model.id,
            name: 'test updated',
        });
        expect(output).toStrictEqual({
            id: model.id,
            name: 'test updated',
            description: null,
            is_active: true,
            created_at: model.created_at,
        });
        type Arrange = {
            input: {
                id: string;
                name: string;
                description?: null | string;
                is_active?: boolean;
            };
            expected: {
                id: string;
                name: string;
                description: null | string;
                is_active: boolean;
                created_at: Date;
            };
        };
        const arrange: Arrange[] = [
            {
                input: {
                    id: model.id,
                    name: 'test updated',
                    description: 'description updated',
                },
                expected: {
                    id: model.id,
                    name: 'test updated',
                    description: 'description updated',
                    is_active: true,
                    created_at: model.created_at,
                },
            },
            {
                input: {
                    id: model.id,
                    name: 'test updated',
                    is_active: false,
                },
                expected: {
                    id: model.id,
                    name: 'test updated',
                    description: null,
                    is_active: false,
                    created_at: model.created_at,
                },
            },
            {
                input: {
                    id: model.id,
                    name: 'test updated',
                },
                expected: {
                    id: model.id,
                    name: 'test updated',
                    description: null,
                    is_active: true,
                    created_at: model.created_at,
                },
            },
            {
                input: {
                    id: model.id,
                    name: 'test updated',
                    is_active: true,
                },
                expected: {
                    id: model.id,
                    name: 'test updated',
                    description: null,
                    is_active: true,
                    created_at: model.created_at,
                },
            },
        ];

        for (const i of arrange) {
            output = await useCase.execute(i.input);
            expect(output).toStrictEqual(i.expected);
        }
    });
});
