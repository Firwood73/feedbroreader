var feedbromenu;

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

function bootMainmenu(attempt) {
	if (getFeedbroBackground()) {
		feedbromenu = new feedbro.Mainmenu();
		feedbromenu.customInit(); // gotcha: Chrome automatically calls function init() if it exists
		return;
	}
	if (attempt >= 100) {
		console.error("Feedbro background is unavailable. Main menu initialization aborted.");
		return;
	}
	setTimeout(function() {
		bootMainmenu(attempt + 1);
	}, 100);
}

document.addEventListener('DOMContentLoaded', function () {
	bootMainmenu(0);
});
