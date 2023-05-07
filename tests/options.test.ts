import { LRUCollection } from '../dist';

describe('options', () => {
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
});
