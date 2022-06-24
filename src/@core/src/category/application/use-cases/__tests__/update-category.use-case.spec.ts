import { NotFoundError } from '#shared/domain';
import { Category } from '#category/domain';
import { CategoryInMemoryRepository } from '#category/infra';
import { UpdateCategoryUseCase } from '#category/application';

describe('UpdateCategoryUseCase Unit Tests', () => {
    let useCase: UpdateCategoryUseCase.UseCase;
    let repository: CategoryInMemoryRepository;

    beforeEach(() => {
        repository = new CategoryInMemoryRepository();
        useCase = new UpdateCategoryUseCase.UseCase(repository);
    });

    it('should throw error when entity not found', async () => {
        expect(() => useCase.execute({ id: 'fake id' } as any)).rejects.toThrowError(
            new NotFoundError(`Entity not found using ID: fake id`),
        );
    });

    it('should update a category', async () => {
        const spyUpdate = jest.spyOn(repository, 'update');

        const entity = new Category({ name: 'test' });
        repository.items = [entity];

        let output = await useCase.execute({
            id: entity.id,
            name: 'test updated',
        });
        expect(output).toStrictEqual({
            id: entity.id,
            name: 'test updated',
            description: null,
            is_active: true,
            created_at: entity.created_at,
        });
        expect(spyUpdate).toHaveBeenCalledTimes(1);
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
                    id: entity.id,
                    name: 'test updated',
                    description: 'description updated',
                },
                expected: {
                    id: entity.id,
                    name: 'test updated',
                    description: 'description updated',
                    is_active: true,
                    created_at: entity.created_at,
                },
            },
            {
                input: {
                    id: entity.id,
                    name: 'test updated',
                    is_active: false,
                },
                expected: {
                    id: entity.id,
                    name: 'test updated',
                    description: null,
                    is_active: false,
                    created_at: entity.created_at,
                },
            },
            {
                input: {
                    id: entity.id,
                    name: 'test updated',
                },
                expected: {
                    id: entity.id,
                    name: 'test updated',
                    description: null,
                    is_active: true,
                    created_at: entity.created_at,
                },
            },
            {
                input: {
                    id: entity.id,
                    name: 'test updated',
                    is_active: true,
                },
                expected: {
                    id: entity.id,
                    name: 'test updated',
                    description: null,
                    is_active: true,
                    created_at: entity.created_at,
                },
            },
        ];

        for (const i of arrange) {
            output = await useCase.execute(i.input);
            expect(output).toStrictEqual(i.expected);
        }
    });
});
