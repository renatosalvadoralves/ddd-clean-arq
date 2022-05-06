import { SortDirection } from "#shared/domain";

export type Filter = string;

export type SearchInputDto<Filter = string> = {
    page?: number;
    per_page?: number;
    sort?: string | null;
    sort_dir?: SortDirection | null;
    filter?: Filter | null;
}