if (window.parent == window) {
  window.onload = function() {
    var w = window.open('', '', 'width=600,height=640,scrollbars=yes');

    w.document.write('<head><title>' + title + '</title></head>');

    w.document.write("<iframe style='display:block;margin-top:-242px;transform:scale(0.4, 0.4);margin-left:-460px;' scrolling='no' width=1500 height=768 src='" + iframeUrl + "'></iframe>");

    var curSlide = location.hash.substr(1);
    var notes = '';
    if (curSlide != 1) {
      var s = sections[curSlide - 2];
      notes = formatNotes(s.Notes);
    }

    w.document.write("<div id='notes' style='margin-top:-210px;font-family:arial'>" + notes + "</div>");

    w.addEventListener('storage', storageEventHandler, false);
    w.obj = w;

    w.document.close();
    return false;
  }
};

function formatNotes(notes) {
  var formattedNotes = '';
  if (notes) {
    for (var i = 0; i < notes.length; i++) {
      formattedNotes = formattedNotes + "<p>" + notes[i] + "</p>";
    }
  }
  return formattedNotes;
}

function storageEventHandler(evt) {
  var w = evt.target.obj;

  destSlide = parseInt(localStorage.getItem("destSlide"));
  s = sections[destSlide - 1];

  if (s.Notes) {
    var el = w.document.getElementById('notes');
    if (el) {
      var notes = formatNotes(s.Notes);
      el.innerHTML = notes;
    } 
  } else {
    var el = w.document.getElementById('notes');
    if (el) {
      el.innerHTML = '';
    }
  }
}
