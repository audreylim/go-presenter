// Copyright 2012 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

function initPlayground(transport) {
	"use strict";

	function text(node) {
		var s = "";
		for (var i = 0; i < node.childNodes.length; i++) {
			var n = node.childNodes[i];
			if (n.nodeType === 1) {
				if (n.tagName === "BUTTON") continue
				if (n.tagName === "SPAN" && n.className === "number") continue;
				if (n.tagName === "DIV" || n.tagName == "BR") {
					s += "\n";
				}
				s += text(n);
				continue;
			}
			if (n.nodeType === 3) {
				s += n.nodeValue;
			}
		}
		return s.replace("\xA0", " "); // replace non-breaking spaces
	}

	var onRuns = [];

	function init(code, index) {
		var output = document.createElement('div');
		var outpre = document.createElement('pre');
		var running;

		if ($ && $(output).resizable) {
			$(output).resizable({
				handles: "n,w,nw",
				minHeight:	27,
				minWidth:	135,
				maxHeight: 608,
				maxWidth:	990
			});
		}

		$(output).bind('resize', function(event) {
			if ($(event.target).hasClass('ui-resizable')) {
				var width = $(output).css('width');
				var height = $(output).css('height');
				var right = $(output).css('right');
				var bottom = $(output).css('bottom');
				var top = $(output).css('top');
				var left = $(output).css('left');
				localStorage.setItem("width", width);
				localStorage.setItem("height", height);
				localStorage.setItem("right", right);
				localStorage.setItem("bottom", bottom);
				localStorage.setItem("top", top);
				localStorage.setItem("left", left);
			}
		})

		function onKill() {
			if (running) running.Kill();
			if (presenterEnabled) {
				localStorage.setItem("play", "kill");
			}
		}

		function onkill() {
			if (running) running.Kill();
		}

		function onRun(e) {
			onkill();
			output.style.display = "block";
			outpre.innerHTML = "";
			run1.style.display = "none";
			var options = {Race: e.shiftKey};
			running = transport.Run(text(code), PlaygroundOutput(outpre), options);
			if (presenterEnabled) {
				localStorage.setItem("play", "run");
				localStorage.setItem("index", index);
			}
		}

		onRuns.push(onRun);

		function onClose() {
			onkill();
			output.style.display = "none";
			run1.style.display = "inline-block";
			if (presenterEnabled) {
				localStorage.setItem("play", "close");
			}
		}

		if (presenterEnabled) {
			console.log("the code is ", code)
			window.addEventListener("storage", storageEvtHandler, false);

			function storageEvtHandler(e) {
				var play = localStorage.getItem("play");
				switch (play) {
					case "run":
						var index  = localStorage.getItem("index");
						onRuns[index](e);
						break;
					case "close":
						onClose();
						break;
					case "kill":
						onKill();
						break;
				}
				var width = localStorage.getItem("width");
				var height = localStorage.getItem("height");
				var top = localStorage.getItem("top");
				var left = localStorage.getItem("left");
				var right = localStorage.getItem("right");
				var bottom = localStorage.getItem("bottom");
				$(output).css('width', width);
				$(output).css('height', height);
				$(output).css('top', top);
				$(output).css('left', left);
				$(output).css('right', right);
				$(output).css('bottom', bottom);
				$(output).css('max-height', '608px');

			}
		}

		var run1 = document.createElement('button');
		run1.innerHTML = 'Run';
		run1.className = 'run';
		run1.addEventListener("click", onRun, false);
		var run2 = document.createElement('button');
		run2.className = 'run';
		run2.innerHTML = 'Run';
		run2.addEventListener("click", onRun, false);
		var kill = document.createElement('button');
		kill.className = 'kill';
		kill.innerHTML = 'Kill';
		kill.addEventListener("click", onKill, false);
		var close = document.createElement('button');
		close.className = 'close';
		close.innerHTML = 'Close';
		close.addEventListener("click", onClose, false);

		//sourceCodeDiv.addEventListener("input", ...);

		var button = document.createElement('div');
		button.classList.add('buttons');
		button.appendChild(run1);
		// Hack to simulate insertAfter
		code.parentNode.insertBefore(button, code.nextSibling);

		var buttons = document.createElement('div');
		buttons.classList.add('buttons');
		buttons.appendChild(run2);
		buttons.appendChild(kill);
		buttons.appendChild(close);

		output.classList.add('output');
		output.appendChild(buttons);
		output.appendChild(outpre);
		output.style.display = "none";
		code.parentNode.insertBefore(output, button.nextSibling);
	}

	var play = document.querySelectorAll('div.playground');
	for (var i = 0; i < play.length; i++) {
		init(play[i], i);
	}
	console.log("onRuns: ", onRuns);
}

