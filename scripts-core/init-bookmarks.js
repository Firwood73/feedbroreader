function getFeedbroBackground() {
	if (window.feedbrobg) {
		return window.feedbrobg;
	}
	if (typeof chrome === "undefined" || !chrome.extension || !chrome.extension.getBackgroundPage) {
		return null;
	}
	var backgroundPage = chrome.extension.getBackgroundPage();
	return backgroundPage && backgroundPage.feedbrobg ? backgroundPage.feedbrobg : null;
}

function bootBookmarks(attempt) {
	if (getFeedbroBackground()) {
		var bookmarks = new feedbro.Bookmarks();
		bookmarks.init();
		return;
	}
	if (attempt >= 100) {
		console.error("Feedbro background is unavailable. Bookmarks initialization aborted.");
		return;
	}
	setTimeout(function() {
		bootBookmarks(attempt + 1);
	}, 100);
}

$(document).ready(function() {
	bootBookmarks(0);
});
