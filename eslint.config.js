import prettier from 'eslint-config-prettier';
import path from 'node:path';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';

const gitignorePath = path.resolve(import.meta.dirname, '.gitignore');

export default defineConfig(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	ts.configs.recommended,
	svelte.configs.recommended,
	prettier,
	svelte.configs.prettier,
	{
		languageOptions: { globals: { ...globals.browser, ...globals.node } },
		rules: {
			'no-undef': 'off'
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig
			}
		}
	},
	{
		rules: {
			// Navigation
			'svelte/no-navigation-without-resolve': 'off',

			// Each block keys — warn instead of error so it doesn't block
			'svelte/require-each-key': 'warn',

			// Allow arbitrary expressions in class attributes
			'svelte/no-unused-class-name': 'off',

			// Allow inline event handlers
			'svelte/valid-compile': 'warn',

			// TypeScript — these strict rules are relaxed intentionally.
			// 'no-explicit-any' and 'no-unused-vars' are set to warn (not error)
			// so they remind us without blocking development.
			// 'no-non-null-assertion' is off because we use the ! operator
			// in places where we are certain a value exists (e.g. after auth checks).
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_'
				}
			],
			'@typescript-eslint/no-non-null-assertion': 'off',

			// General
			'no-console': 'warn',

			// Off — Svelte 5 $props() requires let not const
			'prefer-const': 'off'
		}
	}
);
