import { PaginationOutputDto, PaginationOutputMapper } from "../../../shared/application/dto/pagination-output";
import { SearchInputDto } from "../../../shared/application/dto/search-input.dto";
import UseCase from "../../../shared/application/use-case";
import { CategoryRepository } from "../../domain/repository/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "../dto/category-output";

export default class ListCategoryUseCase implements UseCase<Input, Output> {
    constructor(private categoryRepo: CategoryRepository.Repository) { }

    async execute(input: Input): Promise<Output> {
        const params = new CategoryRepository.SearchParams(input);
        const searchResult = await this.categoryRepo.search(params);

        return this.toOutput(searchResult);
    }

    private toOutput(searchResult: CategoryRepository.SearchResult): Output {
        const items = searchResult.items.map(item =>
            CategoryOutputMapper.toOutput(item)
        );

        const pagination = PaginationOutputMapper.toOutput(searchResult);
        return {
            items,
            ...pagination
        }

    }
}

//DTO - Data Transfer Object
export type Input = SearchInputDto;
export type Output = PaginationOutputDto<CategoryOutput>;