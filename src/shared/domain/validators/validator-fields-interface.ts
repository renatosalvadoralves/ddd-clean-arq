export type FieldsErrors = {
    [field: string]: string[];
}

export default interface ValidatorFieldsInterface<T> {
    validatedData: T;
    errors: FieldsErrors;
    validate(data: any): boolean;
}