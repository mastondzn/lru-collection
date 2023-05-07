import { defineConfig } from 'tsup';

export default defineConfig({
    entryPoints: ['src/index.ts'],
    noExternal: ['quick-lru'],
    format: ['cjs', 'esm'],
    sourcemap: true,
    dts: true,
    clean: true,
});
