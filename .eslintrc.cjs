const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
    root: true,
    ignorePatterns: ['node_modules/', 'dist/', '.eslintrc.cjs'],
    parserOptions: { project: true },
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'unicorn'],
    extends: [
        'eslint:recommended',
        'plugin:unicorn/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:@typescript-eslint/strict',
        'prettier',
    ],
    rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-declaration-merging': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',

        'unicorn/prevent-abbreviations': ['warn', { allowList: { ['fn']: true } }],
    },
});
