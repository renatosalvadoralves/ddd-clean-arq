import { Controller, Get, Post, Body, Param, Delete, Inject, Put, HttpCode, Query } from '@nestjs/common';
import {
    CreateCategoryUseCase,
    ListCategoryUseCase,
    DeleteCategoryUseCase,
    GetCategoryUseCase,
    UpdateCategoryUseCase,
} from 'mycore/category/application';
import { CreateCategoryDto } from './dto/create-category.dto';
import { SearchCategoryDto } from './dto/search-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
    @Inject(CreateCategoryUseCase.UseCase)
    private createUseCase: CreateCategoryUseCase.UseCase;

    @Inject(ListCategoryUseCase.UseCase)
    private listUseCase: ListCategoryUseCase.UseCase;

    @Inject(DeleteCategoryUseCase.UseCase)
    private deleteUseCase: DeleteCategoryUseCase.UseCase;

    @Inject(GetCategoryUseCase.UseCase)
    private getUseCase: GetCategoryUseCase.UseCase;

    @Inject(UpdateCategoryUseCase.UseCase)
    private updateUseCase: UpdateCategoryUseCase.UseCase;

    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.createUseCase.execute(createCategoryDto);
    }

    @Get()
    search(@Query() searchParams: SearchCategoryDto) {
        return this.listUseCase.execute(searchParams);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.getUseCase.execute({ id });
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.updateUseCase.execute({
            id,
            ...updateCategoryDto,
        });
    }

    @HttpCode(204)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.deleteUseCase.execute({ id });
    }
}
