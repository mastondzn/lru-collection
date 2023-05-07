import { Collection } from '@discordjs/collection';

/**
 * A LRUCache with additional utility methods.
 *
 * @typeParam K - The key type the cache holds
 * @typeParam V - The value type the cache holds
 */
export class LRUCollection<
    K extends NonNullable<unknown>,
    V extends NonNullable<unknown>
> extends Collection<K, V> {
    #max: number = Number.POSITIVE_INFINITY;

    set max(max: number) {
        this.#max = max;
        while (this.size > this.#max) {
            const isDeleted = super.delete(super.firstKey()!);
            if (!isDeleted) throw new Error('could not delete item');
        }
    }

    get max(): number {
        return this.#max;
    }

    override get(key: K): V | undefined {
        const item = super.get(key);
        if (!item) {
            return undefined;
        }
        super.delete(key);
        super.set(key, item);
        return item;
    }

    override set(key: K, value: V): this {
        if (this.has(key)) super.delete(key);
        else if (this.size === this.#max) {
            super.delete(super.firstKey()!);
        }
        super.set(key, value);
        return this;
    }
}
