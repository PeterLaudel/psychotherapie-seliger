/**
 * vercel/pkg snapshots omit `node:inspector`. Next.js ≥16 loads it from
 * `console-dim.external.js` at startup; stub it before `import "next"`.
 */
import module from "module";

type ModuleConstructor = typeof module & {
  _load: (request: string, parent: NodeModule, isMain: boolean) => unknown;
};

const m = module as ModuleConstructor;
const origLoad = m._load;
m._load = function (request: string, parent: NodeModule, isMain: boolean) {
  if (request === "node:inspector" || request === "inspector") {
    return { url: () => undefined };
  }
  return origLoad.call(m, request, parent, isMain);
};
