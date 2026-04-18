var feedbrooptions;

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

function bootOptions(attempt) {
	if (getFeedbroBackground()) {
		feedbrooptions = new feedbro.Options();
		feedbrooptions.initOptions();
		return;
	}
	if (attempt >= 100) {
		console.error("Feedbro background is unavailable. Options initialization aborted.");
		return;
	}
	setTimeout(function() {
		bootOptions(attempt + 1);
	}, 100);
}

document.addEventListener('DOMContentLoaded', function () {
	bootOptions(0);
});
