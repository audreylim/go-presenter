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

		window.addEventListener("input", inputHandler, false);

		function inputHandler(e) {
			var sel = document.getSelection();
			var an = sel.anchorNode.parentNode;
  //    an.textContent = sel.anchorNode.data;
 //      console.log("an classname", sel.anchorNode.parentNode.attributes.getNamedItem('num').value);
  //    console.log("an", an);
  //    console.log("an text", an.textContent);
  //    console.log("an data", sel.anchorNode.data);
  //
			localStorage.setItem("index", 0);
			console.log("INDEX", 0);
			localStorage.setItem("newText", an.innerHTML);
			localStorage.setItem("spanNum", an.attributes.getNamedItem('num').value);
  //     var spans = document.getElementsByTagName("span");
  //     consTole.log("span", spans[10]);
  //     console.log("e", e.target.getElementsByTagName("span"));
  //     console.log("oe", e.originalTarget);
    }
  //
  //  window.addEventListener("DOMCharacterDataModified", inputWHandler, false);
  //
  //  function inputWHandler(e) {
  //  var elem = e.target.parentNode;
  //  alert("Element: " + elem.tagName + "  class name: " + elem.className + elem);
  //  }
  //

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

		var runNum = 0;

		function onRun2(e) {
			onkill();
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
			onkill();
			output.style.display = "none";
			run1.style.display = "inline-block";
			if (presenterEnabled) {
				localStorage.setItem("play", "close");
			}
		}

		onRuns.push(onRun);
		onRun2s.push(onRun2);
		onCloses.push(onClose);
		onKills.push(onKill);

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
//		window.addEventListener("input", inputHandler, false);

//		function inputHandler(e) {
//			localStorage.setItem("innerText", play[2].innerText);
//    }

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
			var newText = localStorage.getItem("newText");
			var spanNum = localStorage.getItem("spanNum");
			if (newText) {
			var cp = play[i];
			console.log("cp", cp);
			//      var cp = "div", document.getElementsByClassName('code')[0].lastChild.childNodes;
			var numAttr = "[num=\"" + spanNum + "\"]";
			console.log("numattr", numAttr);
			//console.log(cp.querySelectorAll(numAttr));
			var el = cp.querySelector(numAttr);
			console.log("el", el.innerHTML);
			//     console.log("elhtml", el[0].innerHTML);
			//    console.log("el newtext", newText);
			el.innerHTML = newText;
//      while(el.firstChild) {
//        el[0].removeChild(el[0].firstChild);
//      }
//      el[0].appendChild(document.createTextNode("some new content"));

        //var an = anchorNode.parentNode;
//        anchorNode.textContent = anchorNode.data;
      }

  //    var innertxt = localStorage.getItem("innerText"); 
   //   if (innertxt) {
    //    $(play[2]).text(innertxt);
     // }
			
			var width = localStorage.getItem("width");
			var height = localStorage.getItem("height");
			var top = localStorage.getItem("top");
			var left = localStorage.getItem("left");
			var right = localStorage.getItem("right");
			var bottom = localStorage.getItem("bottom");

			var output = document.querySelectorAll('.output');
			$(output[i]).css('width', width);
			$(output[i]).css('height', height);
			$(output[i]).css('top', top);
			$(output[i]).css('left', left);
			$(output[i]).css('right', right);
			$(output[i]).css('bottom', bottom);
			$(output[i]).css('max-height', '608px');
		}
	}
}

