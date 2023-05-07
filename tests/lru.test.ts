import { Collection } from '@discordjs/collection';
import { LRUCollection } from '../src';

const createLRU = <K, V>() =>
    new LRUCollection<
        K extends NonNullable<unknown> ? K : string,
        V extends NonNullable<unknown> ? V : string
    >();

describe('max', () => {
    it('should delete items when the size is greater than the max', () => {
        const lru = createLRU();
        lru.set('a', 'a');
        lru.set('b', 'b');
        lru.set('c', 'c');
        lru.max = 2;

        expect(lru.size).toBe(2);
    });

    it('should not delete items when the size is less than the max', () => {
        const lru = createLRU();
        lru.set('a', 'a');
        lru.set('b', 'b');
        lru.set('c', 'c');
        lru.max = 4;

        expect(lru.size).toBe(3);
    });

    it('should not delete items when the size is equal to the max', () => {
        const lru = createLRU();
        lru.set('a', 'a');
        lru.set('b', 'b');
        lru.set('c', 'c');
        lru.max = 3;

        expect(lru.size).toBe(3);
    });

    it('should be reusable', () => {
        const lru = createLRU();
        lru.set('a', 'a');
        lru.set('b', 'b');
        lru.set('c', 'c');
        lru.max = 2;
        lru.max = 3;
        lru.set('d', 'd');
        lru.set('a', 'a');

        expect(lru.size).toBe(3);
        expect([...lru.keys()].join('')).toMatch(/^[acd]{3}$/);
    });
});

describe('utility', () => {
    it('should accept a collection in the constructor', () => {
        const lru = new LRUCollection<string, string>(
            new Collection<string, string>([
                ['a', 'a'],
                ['b', 'b'],
                ['c', 'c'],
            ])
        );

        expect(lru.size).toBe(3);
        lru.max = 2;
        expect(lru.size).toBe(2);
        expect([...lru.keys()].join('')).toMatch(/^[bc]{2}$/);
    });

    it('should work with .ensure()', () => {
        const lru = createLRU();
        lru.max = 3;
        lru.set('a', 'a');
        lru.set('b', 'b');
        lru.set('c', 'c');
        lru.ensure('d', () => 'd');
        lru.ensure('a', () => 'b');

        expect(lru.get('a')).toBe('b');
        expect(lru.get('d')).toBe('d');
        expect(lru.size).toBe(3);
        expect([...lru.keys()].join('')).toMatch(/^[acd]{3}$/);
    });

    it('should work with .hasAll()', () => {
        const lru = createLRU();
        lru.max = 3;

        expect(lru.hasAll('a', 'b', 'c')).toBe(false);
        lru.set('a', 'a');
        lru.set('b', 'b');
        lru.set('c', 'c');
        expect(lru.hasAll('a', 'b', 'c')).toBe(true);
    });

    it('should work with .hasAny()', () => {
        const lru = createLRU();
        lru.max = 3;

        expect(lru.hasAny('a', 'b')).toBe(false);
        lru.set('a', 'a');
        expect(lru.hasAny('a', 'b')).toBe(true);
    });

    it('should work with .first()', () => {
        const lru = createLRU();
        lru.max = 3;
        lru.set('a', 'aa');
        lru.set('b', 'bb');
        lru.set('c', 'cc');

        expect(lru.first()).toBe('aa');
        expect(lru.first(2)).toEqual(['aa', 'bb']);
    });

    it('should work with .firstKey()', () => {
        const lru = createLRU();
        lru.max = 3;

        expect(lru.firstKey()).toBeUndefined();
        expect(lru.firstKey(2)).toEqual([]);
        lru.set('a', 'aa');
        expect(lru.firstKey()).toBe('a');
        expect(lru.firstKey(2)).toEqual(['a']);
    });

    it('should work with .last()', () => {
        const lru = createLRU();
        lru.max = 3;
        lru.set('a', 'aa');
        lru.set('b', 'bb');
        lru.set('c', 'cc');

        expect(lru.last()).toBe('cc');
        expect(lru.last(2)).toEqual(['bb', 'cc']);
    });

    it('should work with .lastKey()', () => {
        const lru = createLRU();
        lru.max = 3;

        expect(lru.lastKey()).toBeUndefined();
        expect(lru.lastKey(2)).toEqual([]);
        lru.set('a', 'aa');
        expect(lru.lastKey()).toBe('a');
        expect(lru.lastKey(2)).toEqual(['a']);
    });

    it('should work with .at()', () => {
        const lru = createLRU();
        lru.max = 3;
        lru.set('a', 'aa');
        lru.set('b', 'bb');
        lru.set('c', 'cc');
        lru.set('d', 'dd');

        expect(lru.at(0)).toBe('bb');
        expect(lru.at(1)).toBe('cc');
    });

    it('should work with .keyAt()', () => {
        const lru = createLRU();
        lru.max = 3;
        lru.set('a', 'aa');
        lru.set('b', 'bb');
        lru.set('c', 'cc');
        lru.set('d', 'dd');

        expect(lru.keyAt(0)).toBe('b');
        expect(lru.keyAt(1)).toBe('c');
    });

    it('should work with .random()', () => {
        const lru = createLRU();
        lru.max = 3;
        lru.set('a', 'aa');
        lru.set('b', 'bb');
        lru.set('c', 'cc');
        lru.set('d', 'dd');

        expect(lru.random()).toMatch(/^(bb|cc|dd)$/);
        expect(lru.random(2)).toHaveLength(2);
    });

    it('should work with .randomKey()', () => {
        const lru = createLRU();
        lru.max = 3;
        lru.set('a', 'aa');
        lru.set('b', 'bb');
        lru.set('c', 'cc');
        lru.set('d', 'dd');

        expect(lru.randomKey()).toMatch(/^[b-d]$/);
        expect(lru.randomKey(2)).toHaveLength(2);
    });

    it('should work with .reverse()', () => {
        const lru = createLRU();
        lru.max = 3;
        lru.set('a', 'aa');
        lru.set('b', 'bb');
        lru.set('c', 'cc');
        lru.set('d', 'dd');

        expect([...lru.reverse().keys()]).toEqual(['d', 'c', 'b']);

        lru.set('e', 'ee');
        expect([...lru.reverse().keys()]).toEqual(['e', 'b', 'c']);
    });

    it('should work with .find()', () => {
        const lru = createLRU();
        lru.max = 3;
        lru.set('a', 'aa');
        lru.set('b', 'bb');
        lru.set('c', 'cc');

        expect(lru.find((v) => v === 'bb')).toBe('bb');
        expect(lru.find((v) => v === 'dd')).toBeUndefined();
    });

    it('should work with .findKey()', () => {
        const lru = createLRU();
        lru.max = 3;
        lru.set('a', 'aa');
        lru.set('b', 'bb');
        lru.set('c', 'cc');

        expect(lru.findKey((v) => v === 'bb')).toBe('b');
        expect(lru.findKey((_v, k) => k === 'a')).toBe('a');
        expect(lru.findKey((v) => v === 'dd')).toBeUndefined();
    });

    it('should work with .sweep()', () => {
        const lru = createLRU();
        lru.max = 3;

        lru.set('a', 'aa');
        lru.set('b', 'bb');
        lru.set('c', 'cc');
        lru.set('d', 'dd');

        expect(lru.sweep((v) => v === 'bb')).toBe(1);
        expect(lru.sweep((v) => v === 'dd' || v === 'cc')).toBe(2);
        expect(lru.sweep((v) => v === 'dd' || v === 'cc')).toBe(0);
        expect(lru.sweep((_v, k) => k === 'a')).toBe(0);
    });

    it('should work with .filter()', () => {
        const lru = createLRU();
        lru.max = 3;

        lru.set('a', 'aa');
        lru.set('b', 'bb');
        lru.set('c', 'cc');
        lru.set('d', 'dd');

        const collection = lru.filter((v) => v === 'bb');
        expect(collection).toBeInstanceOf(Collection);
        expect([...collection.entries()]).toEqual([['b', 'bb']]);
    });

    it('should work with .partition()', () => {
        const lru = createLRU();
        lru.max = 4;

        lru.set('a', 'aa');
        lru.set('b', 'bb');
        lru.set('c', 'cc');
        lru.set('d', 'dd');
        lru.set('e', 'ee');

        const [collection1, collection2] = lru.partition((v) => v === 'bb' || v === 'dd');
        expect(collection1).toBeInstanceOf(Collection);
        expect(collection2).toBeInstanceOf(Collection);
        expect([...collection1.entries()]).toEqual([
            ['b', 'bb'],
            ['d', 'dd'],
        ]);
        expect([...collection2.entries()]).toEqual([
            ['c', 'cc'],
            ['e', 'ee'],
        ]);
    });

    it('should work with .flatMap()', () => {
        const lru = createLRU();
        lru.max = 4;

        lru.set('a', 'aa');
        lru.set('b', 'bb');
        lru.set('c', 'cc');
        lru.set('d', 'dd');
        lru.set('e', 'ee');

        const collection = lru.flatMap((v, k) => {
            return new Collection<string, number>([
                [k, v.length],
                [k, v.length],
            ]);
        });
        expect(collection).toBeInstanceOf(Collection);

        expect([...collection.entries()]).toEqual([
            ['b', 2],
            ['c', 2],
            ['d', 2],
            ['e', 2],
        ]);
    });

    it('should work with .map()', () => {
        const lru = createLRU();
        lru.max = 4;

        lru.set('a', 'aa');
        lru.set('b', 'bbb');
        lru.set('c', 'cccc');
        lru.set('d', 'ddddd');
        lru.set('e', 'eeeeee');

        const array = lru.map((v, k) => {
            return [k, v.length];
        });
        expect(array).toBeInstanceOf(Array);
        expect(array).toEqual([
            ['b', 3],
            ['c', 4],
            ['d', 5],
            ['e', 6],
        ]);
    });
});
