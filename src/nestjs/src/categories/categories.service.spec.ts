import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateCategoryUseCase,
  ListCategoryUseCase,
} from 'mycore/category/application';
import { CategoryRepository } from 'mycore/category/domain';
import { CategoryInMemoryRepository } from 'mycore/category/infra';
import { CategoriesService } from './categories.service';

describe('CategoriesService', () => {
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
