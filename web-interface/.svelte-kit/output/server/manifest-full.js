export const manifest = {
	appDir: "_app",
	appPath: "ton-stable-timer/_app",
	assets: new Set(["favicon.png","logo.png","robots.txt","tonconnect-manifest.json"]),
	mimeTypes: {".png":"image/png",".txt":"text/plain",".json":"application/json"},
	_: {
		client: {"start":"_app/immutable/entry/start.ee256b3b.js","app":"_app/immutable/entry/app.46892f2c.js","imports":["_app/immutable/entry/start.ee256b3b.js","_app/immutable/chunks/index.1cf8b3b8.js","_app/immutable/chunks/singletons.0fb17888.js","_app/immutable/chunks/paths.80b20a56.js","_app/immutable/entry/app.46892f2c.js","_app/immutable/chunks/index.1cf8b3b8.js"],"stylesheets":[],"fonts":[]},
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
