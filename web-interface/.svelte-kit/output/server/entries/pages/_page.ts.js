import { Buffer } from "buffer";
const prerender = true;
const ssr = false;
if (globalThis) {
  globalThis.Buffer = Buffer;
}
export {
  prerender,
  ssr
};
