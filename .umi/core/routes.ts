import { ApplyPluginsType } from '/Users/guojufeng/Documents/GitHub/xingorg1Blog/node_modules/@umijs/runtime';
import { plugin } from './plugin';

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

export { routes };
