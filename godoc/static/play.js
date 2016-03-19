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
			if (notesEnabled) {
				localStorage.setItem("index", index);
				localStorage.setItem("playAction", "kill");
			}
		}

		function onRun(e) {
			var sk = e.shiftKey || localStorage.getItem("shiftKey") === "true";
			if (running) running.Kill();
			output.style.display = "block";
			outpre.innerHTML = "";
			run1.style.display = "none";
			var options = {Race: sk};
			running = transport.Run(text(code), PlaygroundOutput(outpre), options);
			if (notesEnabled) {
				localStorage.setItem("index", index);
				if (localStorage.getItem("playAction") === "run") {
				  localStorage.removeItem("playAction");
				} else {
				  localStorage.setItem("playAction", "run");
				}

				if (e.shiftKey) {
				  localStorage.setItem("shiftKey", e.shiftKey);
				} else if (localStorage.getItem("shiftKey") === "true") {
				  localStorage.removeItem("shiftKey");
				}
			}
		}

		function onClose() {
			if (running) running.Kill();
			output.style.display = "none";
			run1.style.display = "inline-block";
			if (notesEnabled) {
				localStorage.setItem("index", index);
				localStorage.setItem("playAction", "close");
			}
		}

		onRuns.push(onRun);
		onCloses.push(onClose);
		onKills.push(onKill);

		code.addEventListener("input", inputHandler, false);

		function inputHandler(e) {
			localStorage.setItem("playCode", e.target.innerHTML);
			localStorage.setItem("index", index);
		}

		var playCode = localStorage.getItem("playCode");
		if (playCode) {
			var c = code;
			c.innerHTML = playCode;
		}

		var run1 = document.createElement('button');
		run1.innerHTML = 'Run';
		run1.classList.add('run', index);
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
}

var onRuns = [];
var onCloses = [];
var onKills = [];

function syncPlay(e) {
	var playAction = localStorage.getItem("playAction");
	var i = localStorage.getItem("index");

	switch (playAction) {
		case 'run':
		if (playAction === 'run' && e.key === 'playAction') {
			onRuns[i](e);
			break;
		} else if (e.key === 'index' && e.oldValue) {
			onRuns[i](e);
			break;
		}
		case 'close':
		if (playAction === 'close') {
			onCloses[i](e);
		break;
		}
		case 'kill':
		if (playAction === 'kill') {
			onKills[i](e);
			break;
		}
	}

	if (e.key === 'playCode') {
	  var plays = document.querySelectorAll('div.playground');
	  var playCode = localStorage.getItem("playCode");
		var c = plays[i];
		c.innerHTML = playCode;
	}

  if (e.key === 'width') {
    var outputs = document.querySelectorAll('.output');
    outputs[i].style.width = localStorage.getItem('width');
    outputs[i].style.height = localStorage.getItem('height');
    outputs[i].style.top = localStorage.getItem('top');
    outputs[i].style.left = localStorage.getItem('left');
    outputs[i].style.right = localStorage.getItem('right');
    outputs[i].style.bottom = localStorage.getItem('bottom');
  }
}
