if (window.parent == window) {
  window.onload = function() {
    var w = window.open('', '', 'width=600,height=640,scrollbars=yes');

    var curSlide = location.hash.substr(1) || parseInt(localStorage.getItem("slideNum"));
    var s = sections[curSlide - 2]; 
    var notes = formatNotes(s.Notes);

    w.document.write("<iframe style='display:block;margin-top:-242px; transform: scale(0.4, 0.4);margin-left:-460px;' scrolling='no' width=1500 height=768 src='" + iframeUrl + "'></iframe>");
    w.document.write("<div id='notes' style='margin-top:-210px'>" + notes + "</div>");

    w.addEventListener('storage', storageEventHandler, false);
    w.obj = w;

    w.document.close(); // needed for chrome and safari
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

  curSlide = parseInt(localStorage.getItem("slideNum")) + 1;
  s = sections[curSlide - 2]; 

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
