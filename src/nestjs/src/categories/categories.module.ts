import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CATEGORY_PROVIDERS } from './category.providers';
@Module({
    controllers: [CategoriesController],
    providers: [
        CategoriesService,
        ...Object.values(CATEGORY_PROVIDERS.REPOSITORIES),
        ...Object.values(CATEGORY_PROVIDERS.USE_CASES),
    ],
})
export class CategoriesModule {}
