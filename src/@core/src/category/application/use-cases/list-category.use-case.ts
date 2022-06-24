import { PaginationOutputDto, PaginationOutputMapper, SearchInputDto } from '#shared/application';
import { default as DefaultUseCase } from '#shared/application/use-case';
import { CategoryRepository } from '#category/domain';
import { CategoryOutput, CategoryOutputMapper } from '#category/application';

export namespace ListCategoryUseCase {
    export class UseCase implements DefaultUseCase<Input, Output> {
        constructor(private categoryRepo: CategoryRepository.Repository) {}

        async execute(input: Input): Promise<Output> {
            const params = new CategoryRepository.SearchParams(input);
            const searchResult = await this.categoryRepo.search(params);

            return this.toOutput(searchResult);
        }

        private toOutput(searchResult: CategoryRepository.SearchResult): Output {
            const items = searchResult.items.map((item) => CategoryOutputMapper.toOutput(item));

            const pagination = PaginationOutputMapper.toOutput(searchResult);
            return {
                items,
                ...pagination,
            };
        }
    }

    export type Input = SearchInputDto;
    export type Output = PaginationOutputDto<CategoryOutput>;
}

//DTO - Data Transfer Object
