import { LRUCollection } from '../dist/index';

describe('LRUCollection', () => {
    it('should throw when not providing right options', () => {
        // @ts-expect-error testing invalid options
        expect(() => new LRUCollection({})).toThrow();
        expect(() => new LRUCollection({ maxSize: 10, maxAge: 0 })).toThrow();
        expect(() => new LRUCollection({ maxSize: 0, maxAge: 1 })).toThrow();
    });

    it('should not throw when providing right options', () => {
        expect(() => new LRUCollection({ maxSize: 10 })).not.toThrow();
        expect(() => new LRUCollection({ maxSize: 10, maxAge: 1000 })).not.toThrow();
    });

    test('.get() / .set()', () => {
        const lru = new LRUCollection({ maxSize: 100 });
        lru.set('foo', 1);
        lru.set('bar', 2);
        expect(lru.get('foo')).toBe(1);
        expect(lru.size).toBe(2);
    });

    test('.get() - limit', () => {
        const lru = new LRUCollection({ maxSize: 2 });
        lru.set('1', 1);
        lru.set('2', 2);
        expect(lru.get('1')).toBe(1);
        expect(lru.get('3')).toBe(undefined);
        lru.set('3', 3);
        lru.get('1');
        lru.set('4', 4);
        lru.get('1');
        lru.set('5', 5);
        expect(lru.has('1'));
    });

    test('.set() - limit', () => {
        const lru = new LRUCollection({ maxSize: 2 });
        lru.set('foo', 1);
        lru.set('bar', 2);
        expect(lru.get('foo')).toBe(1);
        expect(lru.get('bar')).toBe(2);
        lru.set('baz', 3);
        lru.set('faz', 4);
        expect(lru.has('foo')).toBe(false);
        expect(lru.has('bar')).toBe(false);
        expect(lru.has('baz')).toBe(true);
        expect(lru.has('faz')).toBe(true);
        expect(lru.size).toBe(2);
    });

    test('.set() - update item', () => {
        const lru = new LRUCollection({ maxSize: 100 });
        lru.set('foo', 1);
        expect(lru.get('foo')).toBe(1);
        lru.set('foo', 2);
        expect(lru.get('foo')).toBe(2);
        expect(lru.size).toBe(1);
    });
});
