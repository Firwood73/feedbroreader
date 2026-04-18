/* MV3 background service worker bootstrap for Feedbro. */

self.window = self;
self.global = self;

// Minimal jQuery-compatible helpers used by Feedbro background logic.
self.jQuery = self.$ = {
  each(collection, callback) {
    if (!collection) {
      return;
    }
    for (let i = 0; i < collection.length; i += 1) {
      callback(i, collection[i]);
    }
  },
  ajax(options) {
    const method = options?.type || "GET";
    const timeout = options?.timeout || 30000;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    fetch(options.url, {
      method,
      body: options.data,
      headers: options.contentType
        ? { "Content-Type": options.contentType }
        : undefined,
      signal: controller.signal,
      credentials: "include",
      cache: options.cache === false ? "no-store" : "default",
    })
      .then((response) => {
        clearTimeout(timer);
        if (!response.ok && options.error) {
          options.error(response, "error", response.statusText);
        }
      })
      .catch((error) => {
        clearTimeout(timer);
        if (options.error) {
          options.error(error, error.name || "error", error.message || "Request failed");
        }
      });
  },
};

importScripts(
  "date.format.js",
  "unibabel.js",
  "feedbro.min.js",
  "locale-en_US.js",
  "locale-fi_FI.js",
  "init-background.js"
);
