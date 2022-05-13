import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CategoryInMemoryRepository } from 'mycore/category/infra';
import {
  CreateCategoryUseCase,
  ListCategoryUseCase,
} from 'mycore/category/application';
import { CategoryRepository } from 'mycore/category/domain';

@Module({
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    {
      provide: 'CategoryRepository',
      useClass: CategoryInMemoryRepository,
    },
    {
      provide: CreateCategoryUseCase.UseCase,
      useFactory: (categoryRepo: CategoryRepository.Repository) => {
        return new CreateCategoryUseCase.UseCase(categoryRepo);
      },
      inject: ['CategoryRepository'],
    },
    {
      provide: ListCategoryUseCase.UseCase,
      useFactory: (categoryRepo: CategoryRepository.Repository) => {
        return new ListCategoryUseCase.UseCase(categoryRepo);
      },
      inject: ['CategoryRepository'],
    },
  ],
})
export class CategoriesModule {}
