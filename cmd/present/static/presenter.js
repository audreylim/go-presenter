// There will only be one 'w' (Presenter) object at any time
var w = null;

// Apply to main browser window only
if (window.parent == window) {
  document.addEventListener('keydown', handleKeyDownPresenter, false);

  window.onbeforeunload = function() {
    localStorage.removeItem("destSlide");
    if (w) {
      w.close();
    }

    return null;
  }
};

function handleKeyDownPresenter(event) {
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
  var titleHTML = "<head><title>" + title + "</head></title>";

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
  if (curSlide != 1) {
    var s = sections[curSlide - 1];
    if (s) {
      notes = formatNotes(s.Notes);
    }
  }
  var notesHTML = "<div id='notes'"
                + "style='margin-top:-210px;"
                  + "font-family:arial'>"
                  + notes
                + "</div>";
  
  w.document.write(titleHTML);
  w.document.write(slidesIframeHTML);
  // Enable navigation from presenter window immediately
  w.document.getElementById('p-iframe').focus();
  w.document.write(notesHTML);

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

// Add storage event listener here solely to update notes on presenter
function storageEventHandler(evt) {
  destSlide = parseInt(localStorage.getItem("destSlide"));
  s = sections[destSlide - 1];
  var el = w.document.getElementById('notes');

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
