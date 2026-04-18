/* MV3 background service worker bootstrap for Feedbro. */

self.window = self;
self.global = self;

// Feedbro's core bundle still references Manifest V2 browserAction APIs.
// In MV3 service workers, these methods live under chrome.action.
if (typeof chrome !== "undefined" && !chrome.browserAction && chrome.action) {
  chrome.browserAction = {
    setBadgeBackgroundColor(details, callback) {
      return chrome.action.setBadgeBackgroundColor(details, callback);
    },
    setBadgeText(details, callback) {
      return chrome.action.setBadgeText(details, callback);
    },
    setPopup(details, callback) {
      return chrome.action.setPopup(details, callback);
    },
    onClicked: chrome.action.onClicked,
  };
}

// MV3 only allows blocking webRequest listeners for force-installed enterprise
// extensions. Feedbro's bundled legacy code still attempts to register
// "blocking" listeners, which throws runtime errors in normal installs.
// Strip the blocking flag so listeners can still be attached in observation mode.
if (typeof chrome !== "undefined" && chrome.webRequest) {
  const patchWebRequestEvent = (eventName) => {
    const webRequestEvent = chrome.webRequest[eventName];
    if (!webRequestEvent || typeof webRequestEvent.addListener !== "function") {
      return;
    }

    const nativeAddListener = webRequestEvent.addListener.bind(webRequestEvent);
    webRequestEvent.addListener = (callback, filter, extraInfoSpec) => {
      let normalizedExtraInfoSpec = extraInfoSpec;
      if (Array.isArray(extraInfoSpec) && extraInfoSpec.includes("blocking")) {
        normalizedExtraInfoSpec = extraInfoSpec.filter((entry) => entry !== "blocking");
      }
      return nativeAddListener(callback, filter, normalizedExtraInfoSpec);
    };
  };

  patchWebRequestEvent("onBeforeSendHeaders");
  patchWebRequestEvent("onHeadersReceived");
}

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
