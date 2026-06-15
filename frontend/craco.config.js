// craco.config.js
const path = require("path");
require("dotenv").config();

// Check if we're in development/preview mode (not production build)
// Craco sets NODE_ENV=development for start, NODE_ENV=production for build
const isDevServer = process.env.NODE_ENV !== "production";

// Environment variable overrides
const config = {
  enableHealthCheck: process.env.ENABLE_HEALTH_CHECK === "true",
};

// Conditionally load health check modules only if enabled
let WebpackHealthPlugin;
let setupHealthEndpoints;
let healthPluginInstance;

if (config.enableHealthCheck) {
  WebpackHealthPlugin = require("./plugins/health-check/webpack-health-plugin");
  setupHealthEndpoints = require("./plugins/health-check/health-endpoints");
  healthPluginInstance = new WebpackHealthPlugin();
}

let webpackConfig = {
  eslint: {
    configure: {
      extends: ["plugin:react-hooks/recommended"],
      rules: {
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
      },
    },
  },
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: (webpackConfig) => {

      // Add ignored patterns to reduce watched directories
        webpackConfig.watchOptions = {
          ...webpackConfig.watchOptions,
          ignored: [
            '**/node_modules/**',
            '**/.git/**',
            '**/build/**',
            '**/dist/**',
            '**/coverage/**',
            '**/public/**',
        ],
      };

      // Add health check plugin to webpack if enabled
      if (config.enableHealthCheck && healthPluginInstance) {
        webpackConfig.plugins.push(healthPluginInstance);
      }
      return webpackConfig;
    },
  },
};

webpackConfig.devServer = (devServerConfig) => {
  // ------------------------------------------------------------------
  // Modernise deprecated middleware hooks.
  //
  // react-scripts 5.x still ships its webpackDevServer.config.js using
  // `onBeforeSetupMiddleware` / `onAfterSetupMiddleware`, which were
  // removed in webpack-dev-server v4 in favour of `setupMiddlewares`.
  // We translate them here so the dev server boots without deprecation
  // warnings while preserving every existing piece of functionality:
  //   • evalSourceMapMiddleware (powers the error overlay)
  //   • user-supplied src/setupProxy.js
  //   • redirectServedPath (PUBLIC_URL routing)
  //   • noopServiceWorkerMiddleware
  //   • our own health-check endpoints (if enabled)
  //   • any setupMiddlewares chain already on the config (visual-edits etc.)
  // ------------------------------------------------------------------
  const beforeHook = devServerConfig.onBeforeSetupMiddleware;
  const afterHook = devServerConfig.onAfterSetupMiddleware;
  delete devServerConfig.onBeforeSetupMiddleware;
  delete devServerConfig.onAfterSetupMiddleware;

  const previousSetupMiddlewares = devServerConfig.setupMiddlewares;

  devServerConfig.setupMiddlewares = (middlewares, devServer) => {
    if (!devServer) {
      throw new Error("webpack-dev-server is not defined");
    }

    // 1. CRA's "before" hook — registers middlewares on devServer.app
    if (typeof beforeHook === "function") {
      beforeHook(devServer);
    }

    // 2. Any previously-registered setupMiddlewares (visual-edits, future plugins)
    let next = middlewares;
    if (typeof previousSetupMiddlewares === "function") {
      next = previousSetupMiddlewares(next, devServer) || next;
    }

    // 3. Our own health-check endpoints (preserves prior behaviour)
    if (config.enableHealthCheck && setupHealthEndpoints && healthPluginInstance) {
      setupHealthEndpoints(devServer, healthPluginInstance);
    }

    // 4. CRA's "after" hook — registers middlewares on devServer.app
    if (typeof afterHook === "function") {
      afterHook(devServer);
    }

    return next;
  };

  return devServerConfig;
};

// Wrap with visual edits (automatically adds babel plugin, dev server, and overlay in dev mode)
if (isDevServer) {
  try {
    const { withVisualEdits } = require("@emergentbase/visual-edits/craco");
    webpackConfig = withVisualEdits(webpackConfig);
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND' && err.message.includes('@emergentbase/visual-edits/craco')) {
      console.warn(
        "[visual-edits] @emergentbase/visual-edits not installed — visual editing disabled."
      );
    } else {
      throw err;
    }
  }
}

module.exports = webpackConfig;
