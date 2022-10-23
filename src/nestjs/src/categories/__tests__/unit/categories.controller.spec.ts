import {
  CreateCategoryUseCase,
  GetCategoryUseCase,
  ListCategoryUseCase,
} from 'mycore/category/application';
import { SortDirection } from 'mycore/shared/domain';
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from '../../presenter/category.presenter';
import { CategoriesController } from '../../categories.controller';
import { CreateCategoryDto } from '../../dto/create-category.dto';
import { UpdateCategoryDto } from '../../dto/update-category.dto';

describe('CategoriesController Unit Tests', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    controller = new CategoriesController();
  });

  it('should creates a category', async () => {
    const input: CreateCategoryDto = {
      name: 'John',
      description: 'some description',
      is_active: true,
    };

    const output: CreateCategoryUseCase.Output = {
      id: 'ba9aa86c-06db-4e4e-a598-ed8b1da22307',
      name: 'John',
      description: 'some description',
      is_active: true,
    };

    //@ts-expect-error
    const mockCreateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    //@ts-expect-error
    controller['createUseCase'] = mockCreateUseCase;

    const presenter = await controller.create(input);
    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
    expect(presenter).toBeInstanceOf(CategoryPresenter);
    expect(presenter).toStrictEqual(new CategoryPresenter(output));
  });

  it('should update a category', async () => {
    const id = 'ba9aa86c-06db-4e4e-a598-ed8b1da22307';
    const input: UpdateCategoryDto = {
      name: 'John',
      description: 'some description',
      is_active: true,
    };

    const output: CreateCategoryUseCase.Output = {
      id,
      name: 'John',
      description: 'some description',
      is_active: true,
      created_at: new Date(),
    };

    const mockUpdateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error
    controller['updateUseCase'] = mockUpdateUseCase;

    const presenter = await controller.update(id, input);
    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({ id, ...input });
    expect(presenter).toBeInstanceOf(CategoryPresenter);
    expect(presenter).toStrictEqual(new CategoryPresenter(output));
  });

  it('should delete a category', async () => {
    const id = 'ba9aa86c-06db-4e4e-a598-ed8b1da22307';

    const expectedOutput = undefined;
    const mockDeleteUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };
    //@ts-expect-error
    controller['deleteUseCase'] = mockDeleteUseCase;
    expect(controller.remove(id)).toBeInstanceOf(Promise);
    const output = await controller.remove(id);
    expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({ id });
    expect(expectedOutput).toStrictEqual(output);
  });

  it('should gets a category', async () => {
    const id = 'ba9aa86c-06db-4e4e-a598-ed8b1da22307';

    const output: GetCategoryUseCase.Output = {
      id,
      name: 'Movie',
      description: 'some description',
      is_active: true,
      create_at: new Date(),
    };

    const mockGetUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error
    controller['getUseCase'] = mockGetUseCase;
    const presenter = await controller.findOne(id);
    expect(mockGetUseCase.execute).toHaveBeenCalledWith({ id });
    expect(presenter).toBeInstanceOf(CategoryPresenter);
    expect(presenter).toStrictEqual(new CategoryPresenter(output));
  });

  it('should list categories', async () => {
    const output: ListCategoryUseCase.Output = {
      items: [
        {
          id: 'ba9aa86c-06db-4e4e-a598-ed8b1da22307',
          name: 'Movie',
          description: 'some description',
          is_active: true,
          create_at: new Date(),
        },
      ],
      current_page: 1,
      last_page: 1,
      per_page: 1,
      total: 1,
    };
    const searchParams = {
      page: 1,
      per_page: 1,
      sort: 'name',
      sort_dir: 'desc' as SortDirection,
      filter: 'test',
    };

    const mockListUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error
    controller['listUseCase'] = mockListUseCase;
    const presenter = await controller.search(searchParams);
    expect(mockListUseCase.execute).toHaveBeenCalledWith(searchParams);
    expect(presenter).toBeInstanceOf(CategoryCollectionPresenter);
    expect(presenter).toStrictEqual(new CategoryCollectionPresenter(output));
  });
});
