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
	var onRun2s = [];
	var onCloses = [];
	var onKills = [];

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
				localStorage.setItem("width", output.style.width);
				localStorage.setItem("height", output.style.height);
				localStorage.setItem("right", output.style.right);
				localStorage.setItem("bottom", output.style.bottom);
				localStorage.setItem("top", output.style.top);
				localStorage.setItem("left", output.style.left);
			}
		})

		function onKill() {
			if (running) running.Kill();
			if (presenterEnabled) {
				localStorage.setItem("play", "kill");
			}
		}

		function onRun(e) {
			if (running) running.Kill();
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

		var runNum = 0;

		function onRun2(e) {
			if (running) running.Kill();
			output.style.display = "block";
			outpre.innerHTML = "";
			run1.style.display = "none";
			var options = {Race: e.shiftKey};
			running = transport.Run(text(code), PlaygroundOutput(outpre), options);
			if (presenterEnabled) {
				runNum += 1;
				localStorage.setItem("play", "run2" + runNum);
				localStorage.setItem("index", index);
			}
		}

		function onClose() {
			if (running) running.Kill();
			output.style.display = "none";
			run1.style.display = "inline-block";
			if (presenterEnabled) {
				localStorage.setItem("play", "close");
				localStorage.setItem("index", index);
			}
		}

		onRuns.push(onRun);
		onRun2s.push(onRun2);
		onCloses.push(onClose);
		onKills.push(onKill);

		code.addEventListener("input", inputHandler, false);

		function inputHandler(e) {
			localStorage.setItem("et", e.target.innerHTML);
			localStorage.setItem("index", index);
		}

		var et = localStorage.getItem("et");
		if (et) {
			var cp = code;
			cp.innerHTML = et;
		}

		var run1 = document.createElement('button');
		run1.innerHTML = 'Run';
		run1.className = 'run';
		run1.addEventListener("click", onRun, false);
		var run2 = document.createElement('button');
		run2.className = 'run';
		run2.innerHTML = 'Run';
		run2.addEventListener("click", onRun2, false);
		var kill = document.createElement('button');
		kill.className = 'kill';
		kill.innerHTML = 'Kill';
		kill.addEventListener("click", onKill, false);
		var close = document.createElement('button');
		close.className = 'close';
		close.innerHTML = 'Close';
		close.addEventListener("click", onClose, false);

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

	if (presenterEnabled) {
		window.addEventListener("storage", storageEvtHandler, false);

		function storageEvtHandler(e) {
			var play1 = localStorage.getItem("play");
			var i  = localStorage.getItem("index");
			switch (play1) {
				case "run":
					onRuns[i](e);
					break;
				case "close":
					onCloses[i](e);
					break;
				case "kill":
					onKills[i](e);
					break;
				
			}
			if (play1 && play1.includes("run2")) {
				onRun2s[i](e);
			}
			var et = localStorage.getItem("et");
			if (et) {
				var cp = play[i];
				cp.innerHTML = et;
			}

			var outputs = document.querySelectorAll('.output');
      outputs[i].style.width = localStorage.getItem('width');
      outputs[i].style.height = localStorage.getItem('height');
      outputs[i].style.top = localStorage.getItem('top');
      outputs[i].style.left = localStorage.getItem('left');
      outputs[i].style.right = localStorage.getItem('right');
      outputs[i].style.bottom = localStorage.getItem('bottom');
      outputs[i].style.maxHeight = '608px'; 
		}

	}
}
