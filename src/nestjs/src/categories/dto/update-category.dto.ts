//export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

import { UpdateCategoryUseCase } from 'mycore/category/application';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto
  extends CreateCategoryDto
  implements Omit<UpdateCategoryUseCase.Input, 'id'> {}
