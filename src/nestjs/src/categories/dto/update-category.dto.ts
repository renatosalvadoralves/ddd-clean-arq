//export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

import { UpdateCategoryUseCase } from 'mycore/category/application';

export class UpdateCategoryDto implements Omit<UpdateCategoryUseCase.Input, 'id'> {
    name: string;
    description?: string;
    is_active?: boolean;
}
