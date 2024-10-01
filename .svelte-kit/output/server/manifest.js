export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".DS_Store","favicon.png","heatmap_9.json","heatmap_JSD_10_42.json","heatmap_JSD_9_43.json","topic_9.json"]),
	mimeTypes: {".png":"image/png",".json":"application/json"},
	_: {
		client: {"start":"_app/immutable/entry/start.B3y0vepv.js","app":"_app/immutable/entry/app.CwrBgj74.js","imports":["_app/immutable/entry/start.B3y0vepv.js","_app/immutable/chunks/entry.DAxiQS7Y.js","_app/immutable/chunks/scheduler.BvLojk_z.js","_app/immutable/entry/app.CwrBgj74.js","_app/immutable/chunks/scheduler.BvLojk_z.js","_app/immutable/chunks/index.0f6qcMIG.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
