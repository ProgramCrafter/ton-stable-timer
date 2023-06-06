
import root from '../root.svelte';
import { set_building } from '__sveltekit/environment';
import { set_assets } from '__sveltekit/paths';
import { set_private_env, set_public_env } from '../../../node_modules/@sveltejs/kit/src/runtime/shared-server.js';

export const options = {
	app_template_contains_nonce: false,
	csp: {"mode":"auto","directives":{"upgrade-insecure-requests":false,"block-all-mixed-content":false},"reportOnly":{"upgrade-insecure-requests":false,"block-all-mixed-content":false}},
	csrf_check_origin: true,
	track_server_fetches: false,
	embedded: false,
	env_public_prefix: 'PUBLIC_',
	hooks: null, // added lazily, via `get_hooks`
	preload_strategy: "modulepreload",
	root,
	service_worker: false,
	templates: {
		app: ({ head, body, assets, nonce, env }) => "<!DOCTYPE html>\n<html lang=\"en\">\n\t<head>\n\t\t<meta charset=\"utf-8\" />\n\t\t<link rel=\"icon\" href=\"" + assets + "/logo.png\" />\n\t\t<meta name=\"viewport\" content=\"width=device-width\" />\n\t\t<title>TON Timer</title>\n\t\t<style>\n\t\t\thtml, body {\n\t\t\t\tposition: relative;\n\t\t\t\twidth: 100%;\n\t\t\t\theight: 100%;\n\t\t\t}\n\t\t\t\n\t\t\tbody {\n\t\t\t\tcolor: #333;\n\t\t\t\tmargin: 0;\n\t\t\t\tpadding: 8px;\n\t\t\t\tbox-sizing: border-box;\n\t\t\t\tfont-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Oxygen-Sans, Ubuntu, Cantarell, \"Helvetica Neue\", sans-serif;\n\t\t\t}\n\t\t\t\n\t\t\ta {\n\t\t\t\tcolor: rgb(0,100,200);\n\t\t\t\ttext-decoration: none;\n\t\t\t}\n\t\t\t\n\t\t\ta:hover {\n\t\t\t\ttext-decoration: underline;\n\t\t\t}\n\t\t\t\n\t\t\ta:visited {\n\t\t\t\tcolor: rgb(0,80,160);\n\t\t\t}\n\t\t\t\n\t\t\tlabel {\n\t\t\t\tdisplay: block;\n\t\t\t}\n\t\t\t\n\t\t\tinput, button, select, textarea {\n\t\t\t\tfont-family: inherit;\n\t\t\t\tfont-size: inherit;\n\t\t\t\t-webkit-padding: 0.4em 0;\n\t\t\t\tpadding: 0.4em;\n\t\t\t\tmargin: 0 0 0.5em 0;\n\t\t\t\tbox-sizing: border-box;\n\t\t\t\tborder: 1px solid #ccc;\n\t\t\t\tborder-radius: 2px;\n\t\t\t}\n\t\t\t\n\t\t\tinput:disabled {\n\t\t\t\tcolor: #ccc;\n\t\t\t}\n\t\t\t\n\t\t\tbutton {\n\t\t\t\tcolor: #333;\n\t\t\t\tbackground-color: #f4f4f4;\n\t\t\t\toutline: none;\n\t\t\t}\n\t\t\t\n\t\t\tbutton:disabled {\n\t\t\t\tcolor: #999;\n\t\t\t}\n\t\t\t\n\t\t\tbutton:not(:disabled):active {\n\t\t\t\tbackground-color: #ddd;\n\t\t\t}\n\t\t\t\n\t\t\tbutton:focus {\n\t\t\t\tborder-color: #666;\n\t\t\t}\n\t\t</style>\t\t\n\t\t" + head + "\n\t</head>\n\t<body data-sveltekit-preload-data=\"hover\">\n\t\t<div style=\"display: contents\">" + body + "</div>\n\t</body>\n</html>\n",
		error: ({ status, message }) => "<!DOCTYPE html>\n<html lang=\"en\">\n\t<head>\n\t\t<meta charset=\"utf-8\" />\n\t\t<title>" + message + "</title>\n\n\t\t<style>\n\t\t\tbody {\n\t\t\t\t--bg: white;\n\t\t\t\t--fg: #222;\n\t\t\t\t--divider: #ccc;\n\t\t\t\tbackground: var(--bg);\n\t\t\t\tcolor: var(--fg);\n\t\t\t\tfont-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,\n\t\t\t\t\tUbuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t\tjustify-content: center;\n\t\t\t\theight: 100vh;\n\t\t\t}\n\n\t\t\t.error {\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t\tmax-width: 32rem;\n\t\t\t\tmargin: 0 1rem;\n\t\t\t}\n\n\t\t\t.status {\n\t\t\t\tfont-weight: 200;\n\t\t\t\tfont-size: 3rem;\n\t\t\t\tline-height: 1;\n\t\t\t\tposition: relative;\n\t\t\t\ttop: -0.05rem;\n\t\t\t}\n\n\t\t\t.message {\n\t\t\t\tborder-left: 1px solid var(--divider);\n\t\t\t\tpadding: 0 0 0 1rem;\n\t\t\t\tmargin: 0 0 0 1rem;\n\t\t\t\tmin-height: 2.5rem;\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t}\n\n\t\t\t.message h1 {\n\t\t\t\tfont-weight: 400;\n\t\t\t\tfont-size: 1em;\n\t\t\t\tmargin: 0;\n\t\t\t}\n\n\t\t\t@media (prefers-color-scheme: dark) {\n\t\t\t\tbody {\n\t\t\t\t\t--bg: #222;\n\t\t\t\t\t--fg: #ddd;\n\t\t\t\t\t--divider: #666;\n\t\t\t\t}\n\t\t\t}\n\t\t</style>\n\t</head>\n\t<body>\n\t\t<div class=\"error\">\n\t\t\t<span class=\"status\">" + status + "</span>\n\t\t\t<div class=\"message\">\n\t\t\t\t<h1>" + message + "</h1>\n\t\t\t</div>\n\t\t</div>\n\t</body>\n</html>\n"
	},
	version_hash: "1aypr5p"
};

export function get_hooks() {
	return {};
}

export { set_assets, set_building, set_private_env, set_public_env };
