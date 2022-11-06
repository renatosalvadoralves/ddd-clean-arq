import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { applyGlobalConfig } from '../../global-config';
import { AppModule } from '../../app.module';
import { getConnectionToken } from '@nestjs/sequelize';

export function startApp({
  beforeInit,
}: { beforeInit?: (app: INestApplication) => void } = {}) {
  let _app: INestApplication;

  beforeEach(async () => {
    const moduleBuilder: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const sequelize = moduleBuilder.get(getConnectionToken());
    await sequelize.sync({ force: true });

    _app = moduleBuilder.createNestApplication();
    applyGlobalConfig(_app);
    beforeInit && beforeInit(_app);
    await _app.init();
  });

  afterEach(async () => {
    if (!_app) return;

    await _app.close();
  });

  return {
    get app() {
      return _app;
    },
  };
}
