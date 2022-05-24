import { Category, CategoryRepository } from "#category/domain"
import { CategoryModel } from "#category/infra";
import { NotFoundError, UniqueEntityId } from "#shared/domain";
import { CategoryModelMapper } from "./category-mapper";

export class CategorySequelizeRepository implements CategoryRepository.Repository {
    sortableFields: string[] = ["name", "created_at"];

    constructor(private categoryModel: typeof CategoryModel) { }

    search(props: CategoryRepository.SearchParams): Promise<CategoryRepository.SearchResult> {
        throw new Error("Method not implemented.");
    }

    async insert(entity: Category): Promise<void> {
        await this.categoryModel.create(entity.toJSON())
    }
    
    async findById(id: string | UniqueEntityId): Promise<Category> {
        const _id = `${id}`;
        const model = await this._get(_id);
        return CategoryModelMapper.toEntity(model)
    }
    
    findAll(): Promise<Category[]> {
        throw new Error("Method not implemented.");
    }
    update(entity: Category): Promise<void> {
        throw new Error("Method not implemented.");
    }
    delete(id: string | UniqueEntityId): Promise<void> {
        throw new Error("Method not implemented.");
    }

    private async _get(id: string): Promise<CategoryModel> {
        return this.categoryModel.findByPk(id, {
            rejectOnEmpty: new NotFoundError(`Entity not found using ID: ${id}`)
        });
    }
}            
