import { ListCategoryUseCase } from 'mycore/category/application';
import { SortDirection } from 'mycore/shared/domain';

export class SearchCategoryDto implements ListCategoryUseCase.Input {
    page?: number;
    per_page?: number;
    sort?: string;
    sort_dir?: SortDirection;
    filter?: string;
}
