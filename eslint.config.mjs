import globals from 'globals';
import js from '@eslint/js';
import jsdoc from 'eslint-plugin-jsdoc';

export default [
    js.configs.recommended,
    jsdoc.configs['flat/recommended'],
    {
        files: [
          '**/*.js'
        ],
        ignores: [
            '**/*.min.js'
        ],
        languageOptions: {
            globals: {
              ...globals.node
            },
            parserOptions: {
                ecmaVersion: 2018
            }
        },
        rules: {
            'no-await-in-loop': 'warn',
            'no-extra-parens': [
                'warn',
                'all',
                {
                    nestedBinaryExpressions: false
                }
            ],
            'no-template-curly-in-string': 'error',
            'no-unsafe-negation': 'error',

            'jsdoc/no-defaults': 'off',
            'jsdoc/no-undefined-types': 'off',
            'jsdoc/require-returns-description': 'off',
            'jsdoc/require-returns': 'off',

            'accessor-pairs': 'warn',
            'array-callback-return': 'error',
            complexity: 'warn',
            'consistent-return': 'error',
            curly: [
                'error',
                'multi-line',
                'consistent'
            ],
            'dot-location': [
                'error',
                'property'
            ],
            'dot-notation': 'error',
            eqeqeq: [
                'error',
                'smart'
            ],
            'no-console': 'error',
            'no-empty-function': 'error',
            'no-floating-decimal': 'error',
            'no-implied-eval': 'error',
            'no-invalid-this': 'error',
            'no-lone-blocks': 'error',
            'no-multi-spaces': 'error',
            'no-new-func': 'error',
            'no-new-wrappers': 'error',
            'no-new': 'error',
            'no-octal-escape': 'error',
            'no-return-assign': 'error',
            'no-return-await': 'error',
            'no-self-compare': 'error',
            'no-sequences': 'error',
            'no-throw-literal': 'error',
            'no-unmodified-loop-condition': 'error',
            'no-unused-expressions': 'error',
            'no-useless-call': 'error',
            'no-useless-concat': 'error',
            'no-useless-escape': 'error',
            'no-useless-return': 'error',
            'no-void': 'error',
            'no-warning-comments': 'warn',
            'require-await': 'warn',
            'wrap-iife': 'error',
            'yoda': 'error',

            'no-label-var': 'error',
            'no-shadow': 'error',
            'no-undef-init': 'error',

            'callback-return': 'error',
            'handle-callback-err': 'error',
            'no-mixed-requires': 'error',
            'no-new-require': 'error',
            'no-path-concat': 'error',

            'array-bracket-spacing': 'error',
            'block-spacing': 'error',
            'brace-style': [
                'error',
                '1tbs',
                {
                    allowSingleLine: true
                }
            ],
            'comma-dangle': [
                'error',
                'never'
            ],
            'comma-spacing': 'error',
            'comma-style': 'error',
            'computed-property-spacing': 'error',
            'consistent-this': [
                'error',
                '$this'
            ],
            'eol-last': 'error',
            'func-names': 'error',
            'func-name-matching': 'error',
            'func-style': [
                'error',
                'declaration',
                {
                    allowArrowFunctions: true
                }
            ],
            indent: [
                'error', 4
            ],
            'key-spacing': 'error',
            'keyword-spacing': 'error',
            'max-depth': 'error',
            'max-nested-callbacks': [
                'error',
                {
                    max: 4
                }
            ],
            'max-statements-per-line': [
                'error',
                {
                    max: 2
                }
            ],
            'new-cap': 'error',
            'no-array-constructor': 'error',
            'no-inline-comments': 'error',
            'no-lonely-if': 'error',
            'no-mixed-operators': 'error',
            'no-multiple-empty-lines': [
                'error',
                {
                    max: 2,
                    maxEOF: 1,
                    maxBOF: 0
                }
            ],
            'no-new-object': 'error',
            'no-spaced-func': 'error',
            'no-trailing-spaces': 'error',
            'no-unneeded-ternary': 'error',
            'no-whitespace-before-property': 'error',
            'object-curly-spacing': [
                'error',
                'always'
            ],
            'operator-assignment': 'error',
            'operator-linebreak': [
                'error',
                'before'
            ],
            'padded-blocks': [
                'error',
                'never'
            ],
            'quote-props': [
                'error',
                'as-needed'
            ],
            'quotes': [
                'error',
                'single'
            ],
            'semi-spacing': 'error',
            'semi': 'error',
            'space-before-blocks': 'error',
            'space-before-function-paren': [
                'error',
                'never'
            ],
            'space-in-parens': 'error',
            'space-infix-ops': 'error',
            'space-unary-ops': 'error',
            'spaced-comment': 'error',
            'unicode-bom': 'error',

            'arrow-parens': [
                'error',
                'as-needed'
            ],
            'arrow-spacing': 'error',
            'no-duplicate-imports': 'error',
            'no-useless-computed-key': 'error',
            'no-useless-constructor': 'error',
            'prefer-const': 'error',
            'prefer-arrow-callback': 'error',
            'prefer-numeric-literals': 'error',
            'prefer-rest-params': 'error',
            'prefer-spread': 'error',
            'prefer-template': 'error',
            'rest-spread-spacing': 'error',
            'template-curly-spacing': 'error',
            'yield-star-spacing': 'error'
        }
    }
];
