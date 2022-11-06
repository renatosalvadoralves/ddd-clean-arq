import request from 'supertest';
import { Category, CategoryRepository } from 'mycore/category/domain';
import { CATEGORY_PROVIDERS } from '../../src/categories/category.providers';
import {
  CategoryFixture,
  ListCategoriesFixture,
} from '../../src/categories/fixture';
import { CategoriesController } from '../../src/categories/categories.controller';
import { instanceToPlain } from 'class-transformer';
import { startApp } from '../../src/@share/testing';
import { NotFoundError } from 'rxjs';

describe('CategoriesController (e2e)', () => {
  describe('/delete/:id (DELETE)', () => {
    const nestApp = startApp();

    describe('should a response error when id is invalid or not found', () => {
      const arrange = [
        {
          id: 'a99e642f-1ef4-415d-97bd-82b98002b452',
          expected: {
            message:
              'Entity not found using ID: a99e642f-1ef4-415d-97bd-82b98002b452',
            statusCode: 404,
            error: 'Not Found',
          },
        },
        {
          id: 'fake id',
          expected: {
            statusCode: 422,
            message: 'Validation failed (uuid  is expected)',
            error: 'Unprocessable Entity',
          },
        },
      ];

      test.each(arrange)('when id is $id', async ({ id, expected }) => {
        return request(nestApp.app.getHttpServer())
          .get(`/categories/${id}`)
          .expect(expected.statusCode)
          .expect(expected);
      });
    });

    it('should delete a category response with status 204', async () => {
      const categoryRepo = nestApp.app.get<CategoryRepository.Repository>(
        CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
      );

      const category = Category.fake().aCategory().build();
      await categoryRepo.insert(category);

      await request(nestApp.app.getHttpServer())
        .delete(`/categories/${category.id}`)
        .expect(204);

      await expect(categoryRepo.findById(category.id)).rejects.toThrow(
        new NotFoundError(`Entity not found using ID: ${category.id}`),
      );
    });
  });
});
