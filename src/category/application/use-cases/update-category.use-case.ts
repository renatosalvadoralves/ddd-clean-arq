import UseCase from "../../../shared/application/use-case";
import { Category } from "../../domain/entities/category";
import { CategoryRepository } from "../../domain/repository/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "../dto/category-output";

export default class UpdateCategoryUseCase implements UseCase<Input, Output> {
    constructor(private categoryRepo: CategoryRepository.Repository) { }

    async execute(input: Input): Promise<Output> {
        const entity = await this.categoryRepo.findById(input.id);
        entity.update(input.name, input.description);

        if (!input.is_active === true) {
            entity.activate();
        }

        if (input.is_active === false) {
            entity.deactivate();
        }

        await this.categoryRepo.update(entity);
        return CategoryOutputMapper.toOutput(entity);
    }
}

//DTO - Data Transfer Object
export type Input = {
    id: string;
    name: string;
    description?: string;
    is_active?: boolean;
}

export type Output = CategoryOutput;