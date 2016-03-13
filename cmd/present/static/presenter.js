// There will only be one 'w' (Presenter) object at any time
var w = null;

// Apply to main browser window only
if (window.parent == window) {
  // Duplicate event listener on parent window in this file listens specifically
  // for open Presenter command
  document.addEventListener('keydown', handleKeyDownForPresenter, false);

  window.onbeforeunload = function() {
    localStorage.removeItem("destSlide");
    localStorage.removeItem("play");
    localStorage.removeItem("width");
    localStorage.removeItem("height");
    localStorage.removeItem("right");
    localStorage.removeItem("bottom");
    localStorage.removeItem("top");
    localStorage.removeItem("left");
    localStorage.removeItem("index");
    if (w) {
      w.close();
    }

    return null;
  }
};

function handleKeyDownForPresenter(event) {
  // 'P' opens presenter window
  if (event.keyCode == 80) {
    if (w) {
      w.close();
      w = null;
      return;
    }

    w = window.open('', '', 'width=600,height=640,scrollbars=yes');
    renderLayout();
  }
};

function renderLayout() {
  var titleHTML = "<head><title>" + title + "</title></head>";

  var slidesUrl = window.location.href;
  var slidesIframeHTML = "<iframe id='p-iframe'"
                       + " style='display:block;"
                         + "margin-top:-242px;"
                         + "transform:scale(0.4, 0.4);"
                         + "margin-left:-460px;'"
                       + " scrolling='no'"
                       + " width=1500 height=768"
                       + " src='" + slidesUrl + "'>"
                       + "</iframe>";

  curSlide = parseInt(localStorage.getItem("destSlide"));
  var notes = '';
  var s = sections[curSlide - 1];
  if (s) {
    notes = formatNotes(s.Notes);
  }
  var notesHTML = "<div id='p-notes'"
                + "style='margin-top:-210px;"
                  + "font-family:arial'>"
                + notes
                + "</div>";

  w.document.write(titleHTML);
  w.document.write(slidesIframeHTML);
  // Enable navigation from presenter window immediately
  w.document.getElementById('p-iframe').focus();
  w.document.write(notesHTML);

  // Storage event listener is added here solely to update notes on presenter
  w.addEventListener('storage', storageEventHandler, false);

  w.document.close();
};

function formatNotes(notes) {
  var formattedNotes = '';
  if (notes) {
    for (var i = 0; i < notes.length; i++) {
      formattedNotes = formattedNotes + "<p>" + notes[i] + "</p>";
    }
  }
  return formattedNotes;
};

function storageEventHandler(evt) {
  destSlide = parseInt(localStorage.getItem("destSlide"));
  s = sections[destSlide - 1];
  var el = w.document.getElementById('p-notes');

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
