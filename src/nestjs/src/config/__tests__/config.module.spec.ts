import { ConfigModule, CONFIG_DB_SCHEMA } from '../config.module';
import Joi from 'joi';
import { Test } from '@nestjs/testing';
import { join } from 'path';

function expectValidate(schema: Joi.Schema, value: any) {
  return expect(schema.validate(value, { abortEarly: false }).error.message);
}

describe('Schema Unit Tests', () => {
  describe('DB Schema', () => {
    let schema = Joi.object({
      ...CONFIG_DB_SCHEMA,
    });

    describe('DB_VENDOR', () => {
      test('invalid cases', () => {
        expectValidate(schema, {}).toContain('"DB_VENDOR" is required');
        expectValidate(schema, { DB_VENDOR: 5 }).toContain(
          '"DB_VENDOR" must be one of [mysql, sqlite]',
        );
      });

      test('valid cases', () => {
        const arrange = ['mysql', 'sqlite'];

        arrange.forEach((value) => {
          expectValidate(schema, { DB_VENDOR: value }).not.toContain(
            '"DB_VENDOR"',
          );
        });
      });
    });

    describe('DB_HOST', () => {
      test('invalid cases', () => {
        expectValidate(schema, {}).toContain('"DB_HOST" is required');
        expectValidate(schema, { DB_HOST: 1 }).toContain(
          '"DB_HOST" must be a string',
        );
      });

      test('valid cases', () => {
        const arrange = ['some value'];

        arrange.forEach((value) => {
          expectValidate(schema, { DB_HOST: value }).not.toContain('"DB_HOST"');
        });
      });
    });

    describe('DB_DATABASE', () => {
      test('invalid cases', () => {
        expectValidate(schema, { DB_VENDOR: 'mysql' }).toContain(
          '"DB_DATABASE" is required',
        );
        expectValidate(schema, { DB_VENDOR: 'sqlite' }).not.toContain(
          '"DB_DATABASE" is required',
        );

        expectValidate(schema, { DB_DATABASE: 1 }).toContain(
          '"DB_DATABASE" must be a string',
        );
      });

      test('valid cases', () => {
        const arrange = [
          { DB_VENDOR: ' sqlite' },
          { DB_VENDOR: 'sqlite', DB_DATABASE: 'some value' },
          { DB_VENDOR: 'mysql', DB_DATABASE: 'some value' },
        ];

        arrange.forEach((value) => {
          expectValidate(schema, value).not.toContain('"DB_DATABASE"');
        });
      });
    });
  });
});

describe('ConfigModule Unit Tests', () => {
  it('should throw an error when env vars are invalid', () => {
    try {
      Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            envFilePath: join(__dirname, '.env.fake'),
          }),
        ],
      });
      fail('ConfigModule should throw an error when env vars are invalid');
    } catch (error) {
      expect(error.message).toContain(
        '"DB_VENDOR" must be one of [mysql, sqlite]',
      );
    }
  });

  it('should be valid', () => {
    const module = Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
    });

    expect(module).toBeDefined();
  });
});
