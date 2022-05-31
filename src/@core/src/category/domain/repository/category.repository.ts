import {
    SearchableRepositoryInterface,
    SearchParams as DefaultSearchParams,
    SearchResult as DefaultSearchResult,
} from '#shared/domain';
import { Category } from '#category/domain';

export namespace CategoryRepository {
    export type Filter = string;
    export class SearchParams extends DefaultSearchParams<Filter> {}
    export class SearchResult extends DefaultSearchResult<Category, Filter> {}
    export type Repository = SearchableRepositoryInterface<Category, Filter, SearchParams, SearchResult>;
}

export default CategoryRepository;
