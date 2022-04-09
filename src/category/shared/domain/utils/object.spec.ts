import { deepFreeze } from "./object";

describe("object unit tests", () => {

    it("should not freeze a scalar value", () => {
        const str = deepFreeze('a');
        expect(typeof str).toBe('string');

        let boolean = deepFreeze(true);
        expect(typeof boolean).toBe('boolean');

        boolean = deepFreeze(false);
        expect(typeof boolean).toBe('boolean');
    });

    it("should must a immutable obj , and return a new object", () => {
        const obj = deepFreeze({
            prop1: "value1",
            deep: {
                prop2: "value2",
                prop3: new Date()
            }
        });
        expect(() => {
            (obj as any).prop1 = "mudou";
        }).toThrow(
            "Cannot assign to read only property 'prop1' of object '#<Object>'"
        );

        expect(() => {
            (obj as any).deep.prop2 = "mudou";
        }).toThrow(
            "Cannot assign to read only property 'prop2' of object '#<Object>'"
        );

        expect(obj.deep.prop3).toBeInstanceOf(Date);
    });

});