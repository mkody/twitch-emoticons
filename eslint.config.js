import tsParser from '@typescript-eslint/parser'
import jsdoc from 'eslint-plugin-jsdoc'
import neostandard, { resolveIgnoresFromGitignore } from 'neostandard'

export default [
  ...neostandard(),
  jsdoc.configs['flat/recommended'],
  {
    files: ['typings/**/*.d.ts'],
    languageOptions: {
      parser: tsParser,
    },
  },
  {
    ignores: [
      'docs/**',
      ...resolveIgnoresFromGitignore(),
    ],
  },
  {
    rules: {
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/comma-dangle': [
        'warn',
        {
          arrays: 'always-multiline',
          exports: 'always-multiline',
          functions: 'never',
          imports: 'always-multiline',
          objects: 'always-multiline',
        },
      ],
      '@stylistic/quote-props': ['error', 'consistent-as-needed'],
      '@stylistic/quotes': [
        'error',
        'single',
        {
          allowTemplateLiterals: true,
          avoidEscape: true,
        },
      ],
      '@stylistic/space-before-function-paren': ['error', 'always'],
      'jsdoc/no-defaults': 'off', // They show up in the generated docs
      'jsdoc/no-undefined-types': 'off',
      'jsdoc/require-returns-description': 'off',
    },
  },
]
