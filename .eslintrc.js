module.exports = {
    env: {
        'es2021': true,
        'node': true,
    },
    extends: ['plugin:@typescript-eslint/recommended'],
    overrides: [
        {
            'env': {
                'node': true,
            },
            'files': [
                '.eslintrc.{js,cjs}',
            ],
            'parserOptions': {
                'sourceType': 'script',
            },
        },
    ],
    parserOptions: {
        'ecmaVersion': 'latest',
        project: './tsconfig.json',
    },
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    rules: {
        quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
        'comma-dangle': ['error', 'always-multiline'],
        'no-console': 'warn',
        indent: ['error', 4],
        semi: ['error', 'always'],
        '@typescript-eslint/dot-notation': 'error',
    },
};
