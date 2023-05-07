import { randomBytes } from 'node:crypto';
import { LRUCollection } from '../src';
import { Collection } from '@discordjs/collection';

describe('performance', () => {
    it('should not be that slow', () => {
        const map = new Collection<string, string>();
        const lru = new LRUCollection<string, string>();

        const lruStart = Date.now();
        lru.max = 10_000;
        for (let index = 0; index < 50_000; index++) {
            const key = randomBytes(8).toString('hex');
            const value = randomBytes(8).toString('hex');
            lru.set(key, value);
        }
        const lruEnd = Date.now();

        const collStart = Date.now();
        for (let index = 0; index < 50_000; index++) {
            const key = randomBytes(8).toString('hex');
            const value = randomBytes(8).toString('hex');
            map.set(key, value);
        }
        const collEnd = Date.now();

        const collTime = collEnd - collStart;
        const lruTime = lruEnd - lruStart;
        const ratio = lruTime / collTime;
        console.log({
            collTime: `${collTime}ms`,
            lruTime: `${lruTime}ms`,
            ratio: `${ratio.toFixed(2)}x slower`,
        });

        expect(lru.size).toBe(10_000);
        expect(ratio).toBeLessThan(2);
    });
});
