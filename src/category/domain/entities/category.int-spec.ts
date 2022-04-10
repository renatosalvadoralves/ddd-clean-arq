import ValidationError from "../../shared/errors/validation-error";
import { Category } from "./category";

describe('Category integration Tests', () => {

    describe('create method', () => {

        it('should a invalid category using name property', () => {
            expect(() => new Category({ name: null })).toThrowError(new ValidationError("name is required"))

            expect(() => new Category({ name: "" })).toThrowError(new ValidationError("name is required"))

            expect(() => new Category({ name: 5 as any })).toThrowError(new ValidationError("name must be a string"))

            expect(() => new Category({ name: "t".repeat(256) })).toThrowError(new ValidationError("name must be less than 255 characters"))
        });

        it('should a invalid category using category property', () => {
            expect(() => new Category({
                name: "some name",
                description: 5 as any
            })).toThrowError(new ValidationError("description must be a string"))
        });

        it('should a invalid category using is_active property', () => {
            expect(() => new Category({
                name: "some name",
                is_active: "" as any
            })).toThrowError(new ValidationError("is_active must be a boolean"))
        });

        it('should a valid category', () => {
            expect.assertions(0);
            new Category({ name: "Movie" });
            new Category({ name: "Movie", description: "some description" });
            new Category({ name: "Movie", description: null });
            new Category({ name: "Movie", description: "some description", is_active: true });
            new Category({ name: "Movie", description: "some description", is_active: false });
        });
    });
    describe('update method', () => {

        it('should a invalid category using name property', () => {
            const category = new Category({ name: "some name" });
            expect(() => category.update(null, null)).toThrowError(new ValidationError("name is required"))

            expect(() => category.update("", null)).toThrowError(new ValidationError("name is required"))

            expect(() => category.update(5 as any, null)).toThrowError(new ValidationError("name must be a string"))

            expect(() => category.update('t'.repeat(256), null)).toThrowError(new ValidationError("name must be less than 255 characters"))
        });

        it('should a invalid category using category property', () => {
            const category = new Category({ name: "some name" });

            expect(() => category.update("Movie", 5 as any)).toThrowError(new ValidationError("description must be a string"))
        });

        it('should a valid category', () => {
            expect.assertions(0);
            new Category({ name: "Movie" });
            new Category({ name: "Movie", description: "some description" });
            new Category({ name: "Movie", description: null });
            new Category({ name: "Movie", description: "some description", is_active: true });
            new Category({ name: "Movie", description: "some description", is_active: false });
        });
    });
});