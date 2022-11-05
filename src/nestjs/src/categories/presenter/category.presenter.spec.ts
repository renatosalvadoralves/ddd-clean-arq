import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from './category.presenter';
import { instanceToPlain } from 'class-transformer';
import { PaginationPresenter } from '../../@share/presenters/pagination.presenter';

describe('CategoryPresenter Unit Tests', () => {
  describe('constructor', () => {
    it('should set values', () => {
      const created_at = new Date();
      const presenter = new CategoryPresenter({
        id: '71fb7797-3ad4-4eef-810c-559f3765df64',
        name: 'movie',
        description: 'some description',
        is_active: true,
        created_at,
      });

      expect(presenter.id).toBe('71fb7797-3ad4-4eef-810c-559f3765df64');
      expect(presenter.name).toBe('movie');
      expect(presenter.description).toBe('some description');
      expect(presenter.is_active).toBe(true);
      expect(presenter.created_at).toBe(created_at);
    });

    it('should presenter data', () => {
      const created_at = new Date();
      const presenter = new CategoryPresenter({
        id: '71fb7797-3ad4-4eef-810c-559f3765df64',
        name: 'movie',
        description: 'some description',
        is_active: true,
        created_at,
      });

      const data = instanceToPlain(presenter);
      expect(data).toStrictEqual({
        id: '71fb7797-3ad4-4eef-810c-559f3765df64',
        name: 'movie',
        description: 'some description',
        is_active: true,
        created_at: created_at.toISOString().slice(0, 19) + '.000Z',
      });
    });
  });
});

describe('CategoryCollectionPresenter Unit Tests', () => {
  describe('constructor', () => {
    it('should set values', () => {
      const created_at = new Date();
      const presenter = new CategoryCollectionPresenter({
        items: [
          {
            id: '27cc7bd6-f34e-405d-8802-167486c503f8',
            name: 'Movie',
            description: 'A movie category',
            is_active: true,
            created_at,
          },
        ],
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      });

      expect(presenter.meta).toBeInstanceOf(PaginationPresenter);
      expect(presenter.meta).toEqual(
        new PaginationPresenter({
          current_page: 1,
          per_page: 2,
          last_page: 3,
          total: 4,
        }),
      );
      expect(presenter.data).toStrictEqual([
        new CategoryPresenter({
          id: '27cc7bd6-f34e-405d-8802-167486c503f8',
          name: 'Movie',
          description: 'A movie category',
          is_active: true,
          created_at,
        }),
      ]);
    });
  });

  it('should presenter data', () => {
    const created_at = new Date();
    let presenter = new CategoryCollectionPresenter({
      current_page: 1,
      per_page: 2,
      last_page: 3,
      total: 4,
      items: [
        {
          id: '27cc7bd6-f34e-405d-8802-167486c503f8',
          name: 'Movie',
          description: 'A movie category',
          is_active: true,
          created_at,
        },
      ],
    });

    expect(instanceToPlain(presenter)).toStrictEqual({
      data: [
        {
          id: '27cc7bd6-f34e-405d-8802-167486c503f8',
          name: 'Movie',
          description: 'A movie category',
          is_active: true,
          created_at: created_at.toISOString().slice(0, 19) + '.000Z',
        },
      ],
      meta: {
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      },
    });

    presenter = new CategoryCollectionPresenter({
      current_page: '1' as any,
      per_page: '2' as any,
      last_page: '3' as any,
      total: '4' as any,
      items: [
        {
          id: '27cc7bd6-f34e-405d-8802-167486c503f8',
          name: 'Movie',
          description: 'A movie category',
          is_active: true,
          created_at: created_at,
        },
      ],
    });

    expect(instanceToPlain(presenter)).toStrictEqual({
      data: [
        {
          id: '27cc7bd6-f34e-405d-8802-167486c503f8',
          name: 'Movie',
          description: 'A movie category',
          is_active: true,
          created_at: created_at.toISOString().slice(0, 19) + '.000Z',
        },
      ],
      meta: {
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      },
    });
  });
});
