var feedbroengine;

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

function bootReader(attempt) {
	if (getFeedbroBackground()) {
		feedbroengine = new feedbro.Engine();
		window.feedbroengine = feedbroengine;
		feedbroengine.engineInit();
		return;
	}
	if (attempt >= 100) {
		console.error("Feedbro background is unavailable. Reader initialization aborted.");
		return;
	}
	setTimeout(function() {
		bootReader(attempt + 1);
	}, 100);
}

document.addEventListener('DOMContentLoaded', function () {
	bootReader(0);
});

window.onunload = function() {
	$('#navigator').tree('destroy');
	$("#feed").empty();
	$("#titles").empty();
	$(".feedSubscribe").empty();
	
	window.feedbro = undefined;
	window.feedbroengine = undefined;
	window.SimpleWidget = undefined;
	window.Tree = undefined;
	window.JqTreeWidget = undefined;
	window["MathJax"] = undefined;
};
