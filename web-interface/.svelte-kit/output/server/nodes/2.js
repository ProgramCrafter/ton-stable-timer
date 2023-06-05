import * as universal from '../entries/pages/_page.ts.js';

export const index = 2;
export const component = async () => (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.ts";
export const imports = ["_app/immutable/nodes/2.50f79dd2.js","_app/immutable/chunks/index.1cf8b3b8.js","_app/immutable/chunks/paths.1e00ed41.js"];
export const stylesheets = ["_app/immutable/assets/2.e7076282.css"];
export const fonts = [];
