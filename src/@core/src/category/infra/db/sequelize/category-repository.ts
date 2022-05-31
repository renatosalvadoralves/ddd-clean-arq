import { Category, CategoryRepository } from '#category/domain';
import { UniqueEntityId } from '#shared/domain';

class CategorySequelizeRepository implements CategoryRepository.Repository {
    search(props: CategoryRepository.SearchParams): Promise<CategoryRepository.SearchResult> {
        throw new Error('Method not implemented.');
    }
    insert(entity: Category): Promise<void> {
        throw new Error('Method not implemented.');
    }
    findById(id: string | UniqueEntityId): Promise<Category> {
        throw new Error('Method not implemented.');
    }
    findAll(): Promise<Category[]> {
        throw new Error('Method not implemented.');
    }
    update(entity: Category): Promise<void> {
        throw new Error('Method not implemented.');
    }
    delete(id: string | UniqueEntityId): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
