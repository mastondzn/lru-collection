# LRU Collection

A tiny and simple LRU (least recently used) implementation with more utility methods! It extends a Collection, the data structure that is used throughout [Discord.js](https://github.com/discordjs/discord.js/blob/main/packages/collection/README.md)

## Installation

```sh
npm install lru-collection
or 
yarn add lru-collection
or
pnpm add lru-collection
```

## Usage

```ts
import { LRUCollection } from 'lru-collection';

const lru = new LRUCollection<string, string>();

// set the maximum amount of entries we want
lru.max = 2;

lru.set('foo', 'bar');
lru.set('bar', 'baz');
lru.set('baz', 'qux');
console.log(lru.size):
// => 2
lru.has('foo');
// => false
```

The library also re-exports the Collection class from discord.js, so you can use it without installing it, if you want to.

```ts
import { DCollection as Collection } from 'lru-collection';
```
