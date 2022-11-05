import request from 'supertest';
import { Category, CategoryRepository } from 'mycore/category/domain';
import { CATEGORY_PROVIDERS } from '../../src/categories/category.providers';
import { CategoryFixture } from '../../src/categories/fixture';
import { CategoriesController } from '../../src/categories/categories.controller';
import { instanceToPlain } from 'class-transformer';
import { startApp } from '../../src/@share/testing';

describe('CategoriesController (e2e)', () => {
  const nestApp = startApp();

  describe('/categories/:id (GET)', () => {
    describe('should a response error with id is invalid or not found', () => {
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

    it('should get a category', async () => {
      const categoryRepo = nestApp.app.get<CategoryRepository.Repository>(
        CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
      );
      const category = Category.fake().aCategory().build();
      categoryRepo.insert(category);

      const res = await request(nestApp.app.getHttpServer())
        .get(`/categories/${category.id}`)
        .expect(200);

      const keysInResponse = CategoryFixture.keysInResponse();

      expect(Object.keys(res.body)).toStrictEqual(['data']);
      expect(Object.keys(res.body.data)).toStrictEqual(keysInResponse);
      const presenter = CategoriesController.categoryToResponse(
        category.toJSON(),
      );
      const serialized = instanceToPlain(presenter);
      expect(res.body.data).toStrictEqual(serialized);
    });
  });
});
