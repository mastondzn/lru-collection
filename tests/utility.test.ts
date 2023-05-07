import { LRUCollection } from '../dist';

describe('utility', () => {
    test('.ensure()', () => {
        const lru = new LRUCollection<string, number>({ maxSize: 2 });
        lru.set('foo', 1);
        lru.set('bar', 2);
        expect(lru.ensure('foo', () => 2)).toBe(1);
        expect(lru.ensure('baz', () => 3)).toBe(3);
        expect(lru.size).toBe(2);
        expect(lru.has('bar')).toBe(false);
        expect(lru.has('foo')).toBe(true);
    });

    test('.hasAll()', () => {
        const lru = new LRUCollection<string, string>({ maxSize: 2 });
        lru.set('key1', 'value1');
        lru.set('key2', 'value2');
        lru.set('key3', 'value3');
        console.log(lru.has('key1'));

        console.log([...lru.values()]);
    });
});
