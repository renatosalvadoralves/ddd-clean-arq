import UseCase from "../../../shared/application/use-case";
import { CategoryRepository } from "../../domain/repository/category.repository";
import { CategoryOutput } from "../dto/category-output.dto";

export default class GetCategoryUseCase implements UseCase<Input, Output> {
    constructor(private categoryRepo: CategoryRepository.Repository) { }

    async execute(input: Input): Promise<Output> {
        const entity = await this.categoryRepo.findById(input.id);
        return {
            id: entity.id,
            name: entity.name,
            description: entity.description,
            is_active: entity.is_active,
            created_at: entity.created_at,
        }
    }
}

//DTO - Data Transfer Object
export type Input = {
    id: string;
}


export type Output = CategoryOutput;