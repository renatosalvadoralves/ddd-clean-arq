import {default as DefaultUseCase} from "#shared/application/use-case";
import { CategoryRepository, Category } from "#category/domain";
import { CategoryOutput, CategoryOutputMapper } from "#category/application";

export namespace CreateCategoryUseCase {
    export class UseCase implements DefaultUseCase<Input, Output> {
        constructor(private categoryRepo: CategoryRepository.Repository) { }

        async execute(input: Input): Promise<Output> {
            const entity = new Category(input);
            await this.categoryRepo.insert(entity);
            return CategoryOutputMapper.toOutput(entity);
        }
    }

    //DTO - Data Transfer Object
    export type Input = {
        name: string;
        description?: string;
        is_active?: boolean;
    }

    export type Output = CategoryOutput;

}



