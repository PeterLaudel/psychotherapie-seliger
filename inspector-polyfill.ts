/**
 * vercel/pkg snapshots omit `node:inspector`. Next.js ≥16 loads it from
 * `console-dim.external.js` at startup; stub it before `import "next"`.
 *
 * Also resolves `@/` path aliases to `src/` since pkg doesn't process
 * TypeScript path mappings in compiled output.
 */
import module from "module";
import path from "path";

type ModuleConstructor = typeof module & {
  _load: (request: string, parent: NodeModule, isMain: boolean) => unknown;
};

const m = module as ModuleConstructor;
const origLoad = m._load;
m._load = function (request: string, parent: NodeModule, isMain: boolean) {
  if (request === "node:inspector" || request === "inspector") {
    return { url: () => undefined };
  }
  if (request.startsWith("@/")) {
    const resolved = path.join(__dirname, "src", request.slice(2));
    return origLoad.call(m, resolved, parent, isMain);
  }
  return origLoad.call(m, request, parent, isMain);
};
