import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateCategoryUseCase } from '@mycore/micro-videos/src/category/application';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    console.log(CreateCategoryUseCase.UseCase);
    return this.appService.getHello();
  }
}
