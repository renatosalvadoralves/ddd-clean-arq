import { Category } from "#category/domain";
import { CategoryOutputMapper } from "./category-output";

describe("CategoryOutputMapper Unit Tests", () => {
    it("should convert a category in output", () => {
        const created_at = new Date();
        const entity = new Category(
            {
                name: "Movie",
                description: "A movie category",
                is_active: true,
                created_at
            }
        );
        const spyToJSON = jest.spyOn(entity, "toJSON");
        const output = CategoryOutputMapper.toOutput(entity);

        expect(spyToJSON).toHaveBeenCalled();
        expect(output).toStrictEqual({
            id: entity.id,
            name: "Movie",
            description: "A movie category",
            is_active: true,
            created_at
        });
    })
});