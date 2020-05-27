// umi.server.js
import '/Users/guojufeng/Documents/GitHub/xingorg1Blog/node_modules/regenerator-runtime/runtime.js';
import { format } from 'url';
import renderServer from '/Users/guojufeng/Documents/GitHub/xingorg1Blog/node_modules/@umijs/preset-built-in/lib/plugins/features/ssr/templates/renderServer/renderServer.js';
import { stripBasename, cheerio, handleHTML } from '/Users/guojufeng/Documents/GitHub/xingorg1Blog/node_modules/@umijs/preset-built-in/lib/plugins/features/ssr/templates/utils.js';

import { ApplyPluginsType, createMemoryHistory } from '/Users/guojufeng/Documents/GitHub/xingorg1Blog/node_modules/@umijs/runtime';
import { plugin } from './plugin';

// 主要为后面支持按需服务端渲染，单独用 routes 会全编译
const routes = [
  {
    "path": "/",
    "component": (props) => require('react').createElement(require('/Users/guojufeng/Documents/GitHub/xingorg1Blog/node_modules/@umijs/preset-dumi/lib/themes/default/layout.js').default, {
      ...{"menus":{"*":{"*":[{"path":"/","title":"xingorg1blog","meta":{}}]}},"locales":[],"navs":{},"title":"xingorg1","mode":"site","repoUrl":"https://github.com/xingorg1/xingorg1Blog"},
      ...props,
    }),
    "routes": [
      {
        "path": "/",
        "component": require('/Users/guojufeng/Documents/GitHub/xingorg1Blog/docs/index.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/index.md",
          "updatedTime": 1590592354351,
          "slugs": [
            {
              "depth": 1,
              "value": "xingorg1blog",
              "heading": "xingorg1blog"
            },
            {
              "depth": 2,
              "value": "first use dumi",
              "heading": "first-use-dumi"
            }
          ],
          "title": "xingorg1blog"
        },
        "title": "xingorg1blog"
      }
    ],
    "title": "xingorg1"
  }
];

// allow user to extend routes
plugin.applyPlugins({
  key: 'patchRoutes',
  type: ApplyPluginsType.event,
  args: { routes },
});


// origin require module
// https://github.com/webpack/webpack/issues/4175#issuecomment-342931035
const requireFunc = typeof __webpack_require__ === "function" ? __non_webpack_require__ : require;

export interface IParams {
  path: string;
  htmlTemplate?: string;
  mountElementId?: string;
  context?: object
}

export interface IRenderResult<T> {
  rootContainer: T;
  html?: T;
  error?: Error;
}

export interface IRender<T = string> {
  (params: IParams): Promise<IRenderResult<T>>;
}

/**
 * server render function
 * @param params
 */
const render: IRender = async (params) => {
  let error;
  const {
    path,
    htmlTemplate = '',
    mountElementId = 'root',
    context = {},
    mode = 'string',
    basename = '/',
    staticMarkup = false,
    forceInitial = false,
    getInitialPropsCtx,
  } = params;
  let manifest = params.manifest;
  const env = 'development';

  let html = htmlTemplate || "<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset=\"utf-8\" />\n    <meta\n      name=\"viewport\"\n      content=\"width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no\"\n    />\n    <link\n      rel=\"shortcut icon\"\n      type=\"image/x-icon\"\n      href=\"https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg\"\n    />\n    <link rel=\"stylesheet\" href=\"/umi.css\" />\n    <script>\n      window.routerBase = \"/\";\n    </script>\n    <script src=\"/@@/devScripts.js\"></script>\n    <script>\n      //! umi version: 3.2.2\n    </script>\n    <title>xingorg1</title>\n  </head>\n  <body>\n    <div id=\"root\"></div>\n\n    <script src=\"/umi.js\"></script>\n  </body>\n</html>\n";
  let rootContainer = '';
  try {
    // handle basename
    const location = stripBasename(basename, path);
    const { pathname } = location;
    // server history
    const history = createMemoryHistory({
      initialEntries: [format(location)],
    });
    // for renderServer
    const opts = {
      path,
      history,
      pathname,
      getInitialPropsCtx,
      basename,
      context,
      mode,
      plugin,
      staticMarkup,
      routes,
    }
    const dynamicImport =  false;
    if (dynamicImport && !manifest) {
      try {
        // prerender not work because the manifest generation behind of the prerender
        manifest = requireFunc(`./`);
      } catch (_) {}
    }

    // renderServer get rootContainer
    const { pageHTML, pageInitialProps, routesMatched } = await renderServer(opts);
    rootContainer = pageHTML;
    if (html) {
      // plugin for modify html template
      html = await plugin.applyPlugins({
        key: 'ssr.modifyServerHTML',
        type: ApplyPluginsType.modify,
        initialValue: html,
        args: {
          context,
          cheerio,
          routesMatched,
          dynamicImport,
          manifest
        },
        async: true,
      });
      html = await handleHTML({ html, rootContainer, pageInitialProps, mountElementId, mode, forceInitial, routesMatched, dynamicImport, manifest });
    }
  } catch (e) {
    // downgrade into csr
    error = e;
  }
  return {
    rootContainer,
    error,
    html,
  }
}

export default render;
