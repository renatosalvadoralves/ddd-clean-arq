import { Inject, Injectable } from '@nestjs/common';
import { CreateCategoryUseCase, ListCategoryUseCase } from 'mycore/category/application';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    @Inject(CreateCategoryUseCase.UseCase)
    private createUseCase: CreateCategoryUseCase.UseCase;

    @Inject(ListCategoryUseCase.UseCase)
    private listUseCase: ListCategoryUseCase.UseCase;

    create(createCategoryDto: CreateCategoryUseCase.Input) {
        return this.createUseCase.execute(createCategoryDto);
    }

    search(input: ListCategoryUseCase.Input) {
        return this.listUseCase.execute(input);
    }

    findOne(id: number) {
        return `This action returns a #${id} category`;
    }

    update(id: number, updateCategoryDto: UpdateCategoryDto) {
        return `This action updates a #${id} category`;
    }

    remove(id: number) {
        return `This action removes a #${id} category`;
    }
}
