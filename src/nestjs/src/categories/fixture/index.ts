import { Category } from 'mycore/category/domain';

export class CategoryFixture {
  static keysInResponse() {
    return ['id', 'name', 'description', 'is_active', 'created_at'];
  }

  static arrangeForSave() {
    const faker = Category.fake().aCategory().withName('Movie');
    return [
      {
        send_data: {
          name: faker.name,
        },
        expected: {
          description: null,
          is_active: true,
        },
      },
      {
        send_data: {
          name: faker.name,
          description: null,
        },
        expected: {
          is_active: true,
        },
      },
      {
        send_data: {
          name: faker.name,
          is_active: true,
        },
        expected: {
          description: null,
        },
      },
    ];
  }
}
