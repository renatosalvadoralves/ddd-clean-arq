import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { applyGlobalConfig } from '../../global-config';
import { AppModule } from '../../app.module';

export function startApp({
  beforeInit,
}: { beforeInit?: (app: INestApplication) => void } = {}) {
  let _app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    _app = moduleFixture.createNestApplication();
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
