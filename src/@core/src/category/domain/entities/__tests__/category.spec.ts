import { Category, CategoryProperties } from '../category';
import { omit } from 'lodash';
import { UniqueEntityId } from '#shared/domain';

describe('Category Tests', () => {
    beforeEach(() => {
        //faz com que isole os testes unitarios dos de integracao, subscreve a funcao a vazia
        Category.validate = jest.fn();
    });
    test('constructor of category', () => {
        let category = new Category({ name: 'Movie' });
        const props = omit(category.props, ['created_at']);
        expect(Category.validate).toHaveBeenCalled();
        expect(props).toStrictEqual({
            name: 'Movie',
            description: null,
            is_active: true,
        });
        expect(category.props.created_at).toBeInstanceOf(Date);

        let created_at = new Date();
        category = new Category({
            name: 'Movie',
            description: 'some description',
            is_active: false,
            created_at,
        });
        expect(category.props).toStrictEqual({
            name: 'Movie',
            description: 'some description',
            is_active: false,
            created_at,
        });

        category = new Category({
            name: 'Movie',
            description: 'other description',
        });
        expect(category.props).toMatchObject({
            name: 'Movie',
            description: 'other description',
        });

        category = new Category({
            name: 'Movie',
            is_active: true,
        });
        expect(category.props).toMatchObject({
            name: 'Movie',
            is_active: true,
        });

        created_at = new Date();
        category = new Category({
            name: 'Movie',
            created_at,
        });
        expect(category.props).toMatchObject({
            name: 'Movie',
            created_at,
        });
    });

    test('getter and setter of name prop', () => {
        const category = new Category({
            name: 'Movie',
        });
        expect(category.name).toBe('Movie');

        category['name'] = 'other name';
        expect(category.name).toBe('other name');
    });

    test('getter and setter of description prop', () => {
        let category = new Category({
            name: 'Movie',
        });
        expect(category.description).toBeNull();

        category = new Category({
            name: 'Movie',
            description: 'some description',
        });
        expect(category.description).toBe('some description');

        category = new Category({
            name: 'Movie',
        });

        category['description'] = 'other description';
        expect(category.description).toBe('other description');

        category['description'] = undefined;
        expect(category.description).toBeNull();

        category['description'] = null;
        expect(category.description).toBeNull();
    });

    test('getter and setter of is_active prop', () => {
        let category = new Category({
            name: 'Movie',
        });
        expect(category.is_active).toBeTruthy();

        category = new Category({
            name: 'Movie',
            is_active: true,
        });
        expect(category.is_active).toBeTruthy();

        category = new Category({
            name: 'Movie',
            is_active: false,
        });
        expect(category.is_active).toBeFalsy();
    });

    test('getter of created_at', () => {
        let category = new Category({
            name: 'Movie',
        });
        expect(category.created_at).toBeInstanceOf(Date);

        const created_at = new Date();
        category = new Category({
            name: 'Movie',
            created_at,
        });
        expect(category.created_at).toBe(created_at);
    });

    describe('id field', () => {
        type CategoryData = { props: CategoryProperties; id?: UniqueEntityId };
        const arrange: CategoryData[] = [
            { props: { name: 'Movie' } },
            {
                props: {
                    name: 'Movie',
                },
                id: null,
            },
            {
                props: {
                    name: 'Movie',
                },
                id: undefined,
            },
            {
                props: {
                    name: 'Movie',
                },
                id: new UniqueEntityId(),
            },
        ];

        test.each(arrange)('when props is %j', (item) => {
            const category = new Category(item.props, item.id);
            expect(category.id).not.toBeNull();
            expect(category.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
        });
    });
    test('update method', () => {
        const category = new Category({
            name: 'Movie',
            description: 'some description',
        });
        category.update('other movie', 'other description');
        expect(Category.validate).toHaveBeenCalledTimes(2);
        expect(category.name).toBe('other movie');
        expect(category.description).toBe('other description');
    });
});
