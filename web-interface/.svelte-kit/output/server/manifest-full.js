export const manifest = {
	appDir: "_app",
	appPath: "ton-stable-timer/_app",
	assets: new Set(["favicon.png","logo.png","robots.txt","tonconnect-manifest.json"]),
	mimeTypes: {".png":"image/png",".txt":"text/plain",".json":"application/json"},
	_: {
		client: {"start":"_app/immutable/entry/start.548aa51c.js","app":"_app/immutable/entry/app.e755001e.js","imports":["_app/immutable/entry/start.548aa51c.js","_app/immutable/chunks/index.1cf8b3b8.js","_app/immutable/chunks/singletons.124717ca.js","_app/immutable/chunks/paths.e5551063.js","_app/immutable/entry/app.e755001e.js","_app/immutable/chunks/index.1cf8b3b8.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			() => import('./nodes/0.js'),
			() => import('./nodes/1.js'),
			() => import('./nodes/2.js')
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
		}
	}
};
