import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateCategoryUseCase,
  ListCategoryUseCase,
} from 'mycore/category/application';
import { CategoryRepository } from 'mycore/category/domain';
import { CategoryInMemoryRepository } from 'mycore/category/infra';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        CategoriesService,
        {
          provide: 'CategoryInMemoryRepository',
          useClass: CategoryInMemoryRepository,
        },
        {
          provide: CreateCategoryUseCase.UseCase,
          useFactory: (categoryRepo: CategoryRepository.Repository) => {
            return new CreateCategoryUseCase.UseCase(categoryRepo);
          },
          inject: ['CategoryInMemoryRepository'],
        },
        {
          provide: ListCategoryUseCase.UseCase,
          useFactory: (categoryRepo: CategoryRepository.Repository) => {
            return new ListCategoryUseCase.UseCase(categoryRepo);
          },
          inject: ['CategoryInMemoryRepository'],
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
