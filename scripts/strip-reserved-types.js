// HotChocolate 16 prints its schema-search types (__SearchResult, __SchemaDefinition)
// into the SDL. Names starting with "__" are reserved for introspection, so Houdini
// rejects the file. Drop those top-level definitions after every `houdini pull-schema`.
import { readFileSync, writeFileSync } from 'node:fs';

const file = process.argv[2] ?? 'schema.graphql';
const lines = readFileSync(file, 'utf8').split(/\r?\n/);
const definition = /^(?:extend\s+)?(?:type|union|input|enum|interface|scalar|directive)\s+@?(\w+)/;

const out = [];
let removed = [];
let i = 0;
while (i < lines.length) {
	// A description block directly above a definition belongs to it
	const doc = [];
	if (lines[i].startsWith('"""')) {
		const singleLine = lines[i].length > 3 && lines[i].trimEnd().endsWith('"""');
		doc.push(lines[i++]);
		if (!singleLine) {
			while (i < lines.length && !lines[i].startsWith('"""')) doc.push(lines[i++]);
			if (i < lines.length) doc.push(lines[i++]);
		}
	}

	const match = lines[i]?.match(definition);
	if (!match) {
		out.push(...doc);
		if (i < lines.length) out.push(lines[i]);
		i++;
		continue;
	}

	const body = [lines[i++]];
	if (body[0].includes('{') && !body[0].includes('}')) {
		while (i < lines.length && lines[i] !== '}') body.push(lines[i++]);
		if (i < lines.length) body.push(lines[i++]);
	}

	if (match[1].startsWith('__')) {
		removed.push(match[1]);
		if (lines[i] === '') i++;
	} else {
		out.push(...doc, ...body);
	}
}

if (removed.length) {
	writeFileSync(file, out.join('\n'));
	console.log(`Removed reserved types from ${file}: ${removed.join(', ')}`);
}
