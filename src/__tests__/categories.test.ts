import { defaultCategories } from '../categories';

describe('defaultCategories', () => {
  it('includes a Housing category with correct id', () => {
    expect(defaultCategories.Housing).toMatchObject({ id: 'housing', name: 'Housing' });
  });

  it('has matching keys and names', () => {
    Object.entries(defaultCategories).forEach(([key, cat]) => {
      expect(cat.name).toBe(key);
      expect(typeof cat.id).toBe('string');
    });
  });
});
