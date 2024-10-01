

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.B-_xrMyF.js","_app/immutable/chunks/scheduler.BvLojk_z.js","_app/immutable/chunks/index.0f6qcMIG.js","_app/immutable/chunks/entry.DAxiQS7Y.js"];
export const stylesheets = [];
export const fonts = [];
