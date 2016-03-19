var PERMANENT_URL_PREFIX = '/static/';

// There will only be one 'w' object at any time
var w = null;

// If parent window closes, clear storage and close child window
if (window.parent == window) {
  window.onbeforeunload = function() {
    localStorage.clear();
    if (w) {
      w.close();
    }

    return null;
  }
};

function handleKeyDownN(event) {
  // 'N' keydown event should only apply to parent window
  if (window.parent == window) {
    if (w) {
      w.close();
      w = null;
      return;
    }

    w = window.open('', '', 'width=1000,height=676,scrollbars=no,resizable=1');
    initialize();
  }
};

function initialize() {
  var slidesUrl = window.location.href;

  var curSlide = parseInt(localStorage.getItem("destSlide"));
  var formattedNotes = '';
  var s = sections[curSlide - 1];
  if (s) {
    formattedNotes = formatNotes(s.Notes);
  }

  // Hack to apply css styling
  w.document.write("<div style='display:none;'></div>");

  w.document.title = title;

  var slides = w.document.createElement('iframe');
  slides.id = 'presenter-slides';
  slides.scrolling = 'no';
  slides.width = '146%';
  slides.height = '750px';
  slides.src = slidesUrl;
  w.document.body.appendChild(slides);
  slides.focus();

  var notes = w.document.createElement('div');
  notes.id = 'presenter-notes';
  notes.innerHTML = formattedNotes;
  w.document.body.appendChild(notes);

  addPresenterNotesStyle();
};

function addPresenterNotesStyle() {
  var el = w.document.createElement('link');
  el.rel = 'stylesheet';
  el.type = 'text/css';
  el.href = PERMANENT_URL_PREFIX + 'notes.css';
  w.document.body.appendChild(el);
  w.document.querySelector('head').appendChild(el);
}

function formatNotes(notes) {
  var formattedNotes = '';
  if (notes) {
    for (var i = 0; i < notes.length; i++) {
      formattedNotes = formattedNotes + '<p>' + notes[i] + '</p>';
    }
  }
  return formattedNotes;
};

function updateNotes() {
  destSlide = parseInt(localStorage.getItem("destSlide"));
  s = sections[destSlide - 1];
  var el = w.document.getElementById('presenter-notes');

  if (s.Notes) {
    if (el) {
      var notes = formatNotes(s.Notes);
      el.innerHTML = notes;
    }
  } else {
    if (el) {
      el.innerHTML = '';
    }
  }
};
