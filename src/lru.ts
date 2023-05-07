import { Collection } from '@discordjs/collection';

/**
 * A LRUCache with additional utility methods. Inspired and built with Collection, the data structure from discord.js.
 * @typeParam K - The key type the cache holds
 * @typeParam V - The value type the cache holds
 */
export class LRUCollection<
    K extends NonNullable<unknown>,
    V extends NonNullable<unknown>
> extends Collection<K, V> {
    private maxEntries: number = Number.POSITIVE_INFINITY;

    /**
     * @param max - The maximum number of entries the lru cache should hold
     */
    set max(max: number) {
        this.maxEntries = max;
        while (super.size > this.maxEntries) {
            super.delete(super.firstKey()!);
        }
    }

    /**
     * @param max - The maximum number of entries the lru cache should hold
     */
    get max(): number {
        return this.maxEntries;
    }

    override get(key: K): V | undefined {
        const item = super.get(key);
        if (!item) return undefined;

        super.delete(key);
        super.set(key, item);
        return item;
    }

    override set(key: K, value: V): this {
        if (super.has(key)) super.delete(key);
        else if (super.size === this.maxEntries) {
            super.delete(super.firstKey()!);
        }
        super.set(key, value);
        return this;
    }
}
