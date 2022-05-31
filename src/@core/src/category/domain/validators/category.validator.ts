import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ClassValidatorFields } from '#shared/domain';
import { CategoryProperties } from '#category/domain';

export class CategoryRules {
    @MaxLength(255)
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsBoolean()
    @IsOptional()
    is_active: string;

    @IsDate()
    @IsOptional()
    created_at: Date;

    constructor(data: CategoryProperties) {
        Object.assign(this, data);
    }
}

export class CategoryValidator extends ClassValidatorFields<CategoryRules> {
    validate(data: CategoryProperties): boolean {
        return super.validate(new CategoryRules(data));
    }
}

export class CategoryValidatorFactory {
    static create() {
        return new CategoryValidator();
    }
}

export default CategoryValidatorFactory;
