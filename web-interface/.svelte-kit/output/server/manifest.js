export const manifest = {
	appDir: "_app",
	appPath: "ton-stable-timer/_app",
	assets: new Set(["favicon.png","logo.png","robots.txt","tonconnect-manifest.json"]),
	mimeTypes: {".png":"image/png",".txt":"text/plain",".json":"application/json"},
	_: {
		client: {"start":"_app/immutable/entry/start.a221d972.js","app":"_app/immutable/entry/app.6b4b85c5.js","imports":["_app/immutable/entry/start.a221d972.js","_app/immutable/chunks/index.1cf8b3b8.js","_app/immutable/chunks/singletons.0286c5a2.js","_app/immutable/chunks/paths.1e00ed41.js","_app/immutable/entry/app.6b4b85c5.js","_app/immutable/chunks/index.1cf8b3b8.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			() => import('./nodes/0.js'),
			() => import('./nodes/1.js')
		],
		routes: [
			
		],
		matchers: async () => {
			
			return {  };
		}
	}
};
