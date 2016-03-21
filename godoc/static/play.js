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
				localStorage.setItem('width', output.style.width);
				localStorage.setItem('height', output.style.height);
				localStorage.setItem('top', output.style.top);
				localStorage.setItem('bottom', output.style.bottom);
				localStorage.setItem('left', output.style.left);
				localStorage.setItem('right', output.style.right);
			}
		})

		function onKill() {
			if (running) running.Kill();
			if (notesEnabled) {
				localStorage.setItem('index', index);
				localStorage.setItem('play', 'kill');
			}
		}

		function onRun(e) {
			var sk = e.shiftKey || localStorage.getItem('shiftKey') === 'true';
			if (running) running.Kill();
			output.style.display = "block";
			outpre.innerHTML = "";
			run1.style.display = "none";
			var options = {Race: sk};
			running = transport.Run(text(code), PlaygroundOutput(outpre), options);
			if (notesEnabled) updateRunStorage(index, e);
		}

		function updateRunStorage(index, e) {
			localStorage.setItem('index', index);

			if (localStorage.getItem('play') === 'run') {
				localStorage.removeItem('play');
			} else {
				localStorage.setItem('play', 'run');
			}

			if (e.shiftKey) {
				localStorage.setItem('shiftKey', e.shiftKey);
			} else if (localStorage.getItem('shiftKey') === 'true') {
				localStorage.removeItem('shiftKey');
			}
		}

		function onClose() {
			if (running) running.Kill();
			output.style.display = "none";
			run1.style.display = "inline-block";
			if (notesEnabled) {
				localStorage.setItem('index', index);
				localStorage.setItem('play', 'close');
			}
		}

		if (notesEnabled) {
			onRunHandlers.push(onRun);
			onCloseHandlers.push(onClose);
			onKillHandlers.push(onKill);

			code.addEventListener("input", inputHandler, false);
			function inputHandler(e) {
				localStorage.setItem("code", e.target.innerHTML);
				localStorage.setItem("index", index);
			}
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

var onRunHandlers = [];
var onCloseHandlers = [];
var onKillHandlers = [];

var outputs = document.querySelectorAll('.output');
var plays = document.querySelectorAll('div.playground');

function updatePlay(e) {
	var play = localStorage.getItem("play");
	var i = localStorage.getItem("index");

	var runCalled = (play === 'run' && e.key === 'play');
	var anotherRunCalled = (e.key === 'index' && e.oldValue);

	switch (play) {
		case 'run':
		if (runCalled || anotherRunCalled) {
			onRunHandlers[i](e);
			break;
		}
		case 'close':
		if (play === 'close') {
			onCloseHandlers[i](e);
			break;
		}
		case 'kill':
		if (play === 'kill') {
			onKillHandlers[i](e);
			break;
		}
		return;
	}

	switch (e.key) {
		case 'code':
			plays[i].innerHTML = localStorage.getItem('code');
			break;
		case 'width':
			outputs[i].style.width = localStorage.getItem('width');
			break;
		case 'height':
			outputs[i].style.height = localStorage.getItem('height');
			break;
		case 'top':
			outputs[i].style.top = localStorage.getItem('top');
			break;
		case 'bottom':
			outputs[i].style.bottom = localStorage.getItem('bottom');
			break;
		case 'left':
			outputs[i].style.left = localStorage.getItem('left');
			break;
		case 'right':
			outputs[i].style.right = localStorage.getItem('right');
			break;
	}
}
