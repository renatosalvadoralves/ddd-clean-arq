import { default as DefaultUseCase } from "#shared/application/use-case";
import { CategoryRepository } from "#category/domain";
import { CategoryOutput, CategoryOutputMapper } from "#category/application";

export namespace GetCategoryUseCase {
    export class UseCase implements DefaultUseCase<Input, Output> {
        constructor(private categoryRepo: CategoryRepository.Repository) { }

        async execute(input: Input): Promise<Output> {
            const entity = await this.categoryRepo.findById(input.id);
            return CategoryOutputMapper.toOutput(entity);
        }
    }

    export type Input = {
        id: string;
    }

    export type Output = CategoryOutput;
}

