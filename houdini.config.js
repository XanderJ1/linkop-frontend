/// <references types="houdini-svelte">

/** @type {import('houdini').ConfigFile} */
const config = {
	// Only fetch the schema on `pnpm pull-schema`, which also strips the reserved
	// __ types HotChocolate prints. Otherwise generate/dev re-download it and fail.
	// This file is also bundled for the browser, where `process` doesn't exist.
	watchSchema: globalThis.process?.argv?.includes('pull-schema')
		? { url: 'env:VITE_APP_SERVER_API_URL' }
		: undefined,
	schemaPath: './schema.graphql',
	runtimeDir: '.houdini',
	include: 'src/**/*.gql',
	plugins: {
		'houdini-svelte': {}
	},
	scalars: {
		UUID: {
			type: 'string'
		},
		DateTime: {
			type: 'string'
		}
	}
};

export default config;
