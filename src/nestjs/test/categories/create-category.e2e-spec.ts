import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { CategoryRepository } from 'mycore/category/domain';
import { CATEGORY_PROVIDERS } from '../../src/categories/category.providers';
import { CategoryFixture } from '../../src/categories/fixture';
import { CategoriesController } from '../../src/categories/categories.controller';
import { instanceToPlain } from 'class-transformer';

describe('CategoriesController (e2e)', () => {
  let app: INestApplication;
  let categoryRepo: CategoryRepository.Repository;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    categoryRepo = moduleFixture.get<CategoryRepository.Repository>(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
    );

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('POST /categories', () => {
    describe('should create a category', () => {
      const arrange = CategoryFixture.arrangeForSave();

      test.each(arrange)(
        'when body is $send_data',
        async ({ send_data, expected }) => {
          const res = await request(app.getHttpServer())
            .post('/categories')
            .send(send_data)
            .expect(201);

          const keysInResponse = CategoryFixture.keysInResponse();

          expect(Object.keys(res.body)).toStrictEqual(keysInResponse);
          const categoryCreated = await categoryRepo.findById(res.body.id);
          const presenter = CategoriesController.categoryToResponse(
            categoryCreated.toJSON(),
          );
          const serialized = instanceToPlain(presenter);
          expect(res.body).toStrictEqual(serialized);

          expect(res.body).toStrictEqual({
            id: serialized.id,
            created_at: serialized.created_at,
            ...send_data,
            ...expected,
          });
        },
      );
    });
  });
});
