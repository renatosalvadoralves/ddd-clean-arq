export type FieldsErrors = {
    [field: string]: string[];
}

export interface ValidatorFieldsInterface<T> {
    validatedData: T;
    errors: FieldsErrors;
    validate(data: any): boolean;
}

export default ValidatorFieldsInterface;