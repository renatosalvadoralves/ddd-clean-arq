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
      {
        send_data: {
          name: faker.name,
          is_active: false,
        },
        expected: {
          description: null,
        },
      },
      {
        send_data: {
          name: faker.name,
          description: faker.description,
          is_active: true,
        },
        expected: {},
      },
    ];
  }

  static arrangeInvalidRequest() {
    const faker = Category.fake().aCategory().withName('Movie');

    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      EMPTY: {
        send_data: {},
        expected: {
          message: ['name should not be empty', 'name must be a string'],
          ...defaultExpected,
        },
      },
      NAME_UNDEFINED: {
        send_data: {
          name: faker.withInvalidNameEmpty(undefined).name,
        },
        expected: {
          message: ['name should not be empty', 'name must be a string'],
          ...defaultExpected,
        },
      },
      NAME_NULL: {
        send_data: {
          name: faker.withInvalidNameEmpty(null).name,
        },
        expected: {
          message: ['name should not be empty', 'name must be a string'],
          ...defaultExpected,
        },
      },
      NAME_EMPTY: {
        send_data: {
          name: faker.withInvalidNameEmpty('').name,
        },
        expected: {
          message: ['name should not be empty'],
          ...defaultExpected,
        },
      },
      DESCRIPTION_NOT_A_STRING: {
        send_data: {
          description: faker.withInvalidDescriptionNotAsString().description,
        },
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'description must be a string',
          ],
          ...defaultExpected,
        },
      },
      IS_ACTIVE_NOT_A_BOOLEAN: {
        send_data: {
          is_active: faker.withInvalidIsActiveNotABoolean().is_active,
        },
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'is_active must be a boolean value',
          ],
          ...defaultExpected,
        },
      },
    };
  }

  static arrangeForEntityValidationError() {
    const faker = Category.fake().aCategory().withName('Movie');

    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      EMPTY: {
        send_data: {},
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'name must be shorter than or equal to 255 characters',
          ],
          ...defaultExpected,
        },
      },
      NAME_UNDEFINED: {
        send_data: {
          name: faker.withInvalidNameEmpty(undefined).name,
        },
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'name must be shorter than or equal to 255 characters',
          ],
          ...defaultExpected,
        },
      },
      NAME_NULL: {
        send_data: {
          name: faker.withInvalidNameEmpty(null).name,
        },
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'name must be shorter than or equal to 255 characters',
          ],
          ...defaultExpected,
        },
      },
      NAME_EMPTY: {
        send_data: {
          name: faker.withInvalidNameEmpty('').name,
        },
        expected: {
          message: ['name should not be empty'],
          ...defaultExpected,
        },
      },
      DESCRIPTION_NOT_A_STRING: {
        send_data: {
          description: faker.withInvalidDescriptionNotAsString().description,
        },
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'name must be shorter than or equal to 255 characters',
            'description must be a string',
          ],
          ...defaultExpected,
        },
      },
      IS_ACTIVE_NOT_A_BOOLEAN: {
        send_data: {
          is_active: faker.withInvalidIsActiveNotABoolean().is_active,
        },
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'name must be shorter than or equal to 255 characters',
            'is_active must be a boolean value',
          ],
          ...defaultExpected,
        },
      },
    };
  }
}

export class CreateCategoryFixture {
  static keysInResponse() {
    return CategoryFixture.keysInResponse();
  }

  static arrangeForSave() {
    return CategoryFixture.arrangeForSave();
  }

  static arrangeInvalidRequest() {
    return CategoryFixture.arrangeInvalidRequest();
  }

  static arrangeForEntityValidationError() {
    return CategoryFixture.arrangeForEntityValidationError();
  }
}

export class UpdateCategoryFixture {
  static keysInResponse() {
    return CategoryFixture.keysInResponse();
  }

  static arrangeForSave() {
    return CategoryFixture.arrangeForSave();
  }

  static arrangeInvalidRequest() {
    return CategoryFixture.arrangeInvalidRequest();
  }

  static arrangeForEntityValidationError() {
    const { IS_ACTIVE_NOT_A_BOOLEAN, ...otherKeys } =
      CategoryFixture.arrangeForEntityValidationError();

    return otherKeys;
  }
}
