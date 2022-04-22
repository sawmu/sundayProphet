// Canvas
"use strict";
var _extends =
  Object.assign ||
  function (event) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var a in n)
        Object.prototype.hasOwnProperty.call(n, a) && (e[a] = n[a]);
    }
    return event;
  };
function _toConsumableArray(event) {
  if (Array.isArray(event)) {
    for (var t = 0, n = Array(event.length); t < event.length; t++) n[t] = event[t];
    return n;
  }
  return Array.from(event);
}
var SAVEFILE = { mainId: "", images: [] },
  ANNOTATION_PHASE = 0,
  ANNOTATION_POINT_ONE = { x: 0, y: 0, w: 0, h: 0 },
  ANNOTATION_POINT_TWO = { x: 0, y: 0, w: 0, h: 0 },
  LOCAL_STORAGE_KEY = "S_LAB_STORAGE",
  COLOR_CYCLE = [
    "#cfb870",
  
  ],
  imageSchema = { id: "", path: "", annotations: [] },
  annotationSchema = { x1: 0, y1: 0, x2: 0, y2: 0, comment: "", color: "" },
  initializePage = function () {
    var e = localStorage.getItem(LOCAL_STORAGE_KEY);
    e && (SAVEFILE = _extends({}, JSON.parse(e))), renderSaveFile(!0);
    var t = document.querySelector("#canvas-text");
    t.addEventListener("mousedown", function (e) {
      var t = e.offsetX,
        n = e.offsetY,
        a = e.target.offsetWidth,
        o = e.target.offsetHeight;
      if (0 === ANNOTATION_PHASE) {
        (document.querySelector("#annotation-list").style.opacity = 0.2),
          (ANNOTATION_POINT_ONE = { x: t, y: n, w: a, h: o }),
          (ANNOTATION_PHASE = 1);
        for (
          var r = document.querySelectorAll(".annotation-box"), i = 0;
          i < r.length;
          i++
        ) {
          r[i].style.pointerEvents = "none";
        }
      } else 1 === ANNOTATION_PHASE && ((ANNOTATION_POINT_TWO = { x: t, y: n, w: a, h: o }), openAnnotationTextBox());
    }),
      t.addEventListener("touchstart", function (e) {
        var t = e.target.getBoundingClientRect(),
          n = e.touches[0].pageX - t.left,
          a = e.touches[0].pageY - t.top - window.scrollY,
          o = e.target.offsetWidth,
          r = e.target.offsetHeight;
        if (0 === ANNOTATION_PHASE) {
          (document.querySelector("#annotation-list").style.opacity = 0.2),
            (ANNOTATION_POINT_ONE = { x: n, y: a, w: o, h: r }),
            (ANNOTATION_PHASE = 1);
          for (
            var i = document.querySelectorAll(".annotation-box"), N = 0;
            N < i.length;
            N++
          ) {
            i[N].style.pointerEvents = "none";
          }
        } else 1 === ANNOTATION_PHASE && ((ANNOTATION_POINT_TWO = { x: n, y: a, w: o, h: r }), openAnnotationTextBox());
      }),
      t.addEventListener("mousemove", function (e) {
        if (1 === ANNOTATION_PHASE) {
          var t = e.offsetX,
            n = e.offsetY,
            a = e.target.offsetWidth,
            o = e.target.offsetHeight;
          (ANNOTATION_POINT_TWO = { x: t, y: n, w: a, h: o }),
            renderDrawPoints();
        }
      }),
      t.addEventListener("touchmove", function (e) {
        if (1 === ANNOTATION_PHASE) {
          var t = e.target.getBoundingClientRect(),
            n = e.touches[0].pageX - t.left,
            a = e.touches[0].pageY - t.top - window.scrollY,
            o = e.target.offsetWidth,
            r = e.target.offsetHeight;
          (ANNOTATION_POINT_TWO = { x: n, y: a, w: o, h: r }),
            renderDrawPoints();
        }
      }),
      t.addEventListener("mouseup", function (e) {
        if (1 === ANNOTATION_PHASE) {
          var t = e.offsetX,
            n = e.offsetY,
            a = e.target.offsetWidth,
            o = e.target.offsetHeight;
          (ANNOTATION_POINT_TWO = { x: t, y: n, w: a, h: o }),
            openAnnotationTextBox();
        }
      }),
      t.addEventListener("touchend", function (e) {
        if (1 === ANNOTATION_PHASE) {
          var t = e.target.getBoundingClientRect(),
            n = e.changedTouches[0].pageX - t.left,
            a = e.changedTouches[0].pageY - t.top - window.scrollY,
            o = e.target.offsetWidth,
            r = e.target.offsetHeight;
          (ANNOTATION_POINT_TWO = { x: n, y: a, w: o, h: r }),
            openAnnotationTextBox();
        }
      });
    var n = document.querySelector("#input-annotation");
    n.addEventListener("keyup", function (e) {
      13 === e.keyCode && (e.preventDefault(), saveAnnotation());
    }),
      n.addEventListener("blur", function (e) {
        saveAnnotation();
      });
  },
  generateRandomId = function () {
    return String(
      Math.round(9999 * Math.random()) *
        Math.round(9999 * Math.random()) *
        Math.round(9999 * Math.random()) *
        Math.round(9999 * Math.random())
    );
  },
  getCurrentImageIndex = function () {
    var e = null;
    return (
      SAVEFILE.images.forEach(function (t, n) {
        t.id === SAVEFILE.mainId && (e = n);
      }),
      e
    );
  },
  uploadFile = function () {
    var e = document.querySelector("#input-file").files[0],
      t = new FileReader();
    (t.onloadend = function () {
      var e = _extends({}, imageSchema);
      (e.id = generateRandomId()), (e.path = t.result), (e.annotations = []);
      var n = getCurrentImageIndex();
      SAVEFILE.images.splice(n + 1, 0, e),
        (SAVEFILE.mainId = e.id),
        document.querySelector("#input-form").reset(),
        renderSaveFile();
    }),
      e && t.readAsDataURL(e);
  },
  deleteImage = function () {
    var e = getCurrentImageIndex(),
      t = [].concat(_toConsumableArray(SAVEFILE.images));
    t.splice(e, 1),
      (SAVEFILE.images = t),
      SAVEFILE.images[e]
        ? (SAVEFILE.mainId = SAVEFILE.images[e].id)
        : SAVEFILE.images[e - 1]
        ? (SAVEFILE.mainId = SAVEFILE.images[e - 1].id)
        : (SAVEFILE.mainId = ""),
      renderSaveFile();
  },
  switchImage = function (e, t) {
    var n = getCurrentImageIndex(),
      a = t ? SAVEFILE.images[e] : SAVEFILE.images[n + e];
    a && ((SAVEFILE.mainId = a.id), renderSaveFile());
  },
  openAnnotationTextBox = function () {
    if (
      Math.abs(ANNOTATION_POINT_ONE.x - ANNOTATION_POINT_TWO.x) > 10 &&
      Math.abs(ANNOTATION_POINT_ONE.y - ANNOTATION_POINT_TWO.y) > 10
    ) {
      ANNOTATION_PHASE = 2;
      var e = Math.min(ANNOTATION_POINT_ONE.x, ANNOTATION_POINT_TWO.x),
        t = Math.min(ANNOTATION_POINT_ONE.y, ANNOTATION_POINT_TWO.y),
        n = Math.max(ANNOTATION_POINT_ONE.x, ANNOTATION_POINT_TWO.x),
        a = Math.max(ANNOTATION_POINT_ONE.y, ANNOTATION_POINT_TWO.y);
      ((o = document.querySelector("#input-annotation")).style.display =
        "block"),
        (o.style.left = e + 2 + "px"),
        (o.style.top = t + 2 + "px"),
        (o.style.width = n - e - 4 + "px"),
        (o.style.height = a - t - 4 + "px"),
        (o.value = ""),
        o.focus();
    } else {
      var o;
      (ANNOTATION_PHASE = 0),
        ((o = document.querySelector("#input-annotation")).style.display =
          "none"),
        (document.querySelector("#annotation-list").style.opacity = 1);
      for (
        var r = document.querySelectorAll(".annotation-box"), i = 0;
        i < r.length;
        i++
      ) {
        r[i].style.pointerEvents = "all";
      }
      renderSaveFile();
    }
  },
  deleteAnnotationTextBox = function (e) {
    var t = getCurrentImageIndex(),
      n = [].concat(_toConsumableArray(SAVEFILE.images[t].annotations));
    n.splice(e, 1),
      (SAVEFILE.images[t].annotations = [].concat(_toConsumableArray(n))),
      renderSaveFile();
  },

//   Save the text on Canvas
  saveAnnotation = function () {
    if (2 === ANNOTATION_PHASE) {
      ANNOTATION_PHASE = 0;
      var e = ANNOTATION_POINT_ONE.x / ANNOTATION_POINT_ONE.w,
        t = ANNOTATION_POINT_ONE.y / ANNOTATION_POINT_ONE.h,
        n = ANNOTATION_POINT_TWO.x / ANNOTATION_POINT_TWO.w,
        a = ANNOTATION_POINT_TWO.y / ANNOTATION_POINT_TWO.h,
        o = document.querySelector("#input-annotation");
      (o.style.display = "none"),
        (document.querySelector("#annotation-list").style.opacity = 1);
      for (
        var r = document.querySelectorAll(".annotation-box"), i = 0;
        i < r.length;
        i++
      ) {
        r[i].style.pointerEvents = "all";
      }
      var N = _extends({}, annotationSchema);
      (N.x1 = Math.min(e, n)),
        (N.x2 = Math.max(e, n)),
        (N.y1 = Math.min(t, a)),
        (N.y2 = Math.max(t, a)),
        (N.comment = o.value),
        (N.color = COLOR_CYCLE[Math.floor(Math.random() * COLOR_CYCLE.length)]);
      var O = getCurrentImageIndex();
      SAVEFILE.images[O].annotations.push(N), renderSaveFile();
    }
  },

//   Draw Line in Canvas
  renderDrawPoints = function () {
    var e = document.querySelector("#canvas-text"),
      t = e.getContext("2d");
    t.clearRect(0, 0, e.width, e.height),
      t.beginPath(),
      (t.strokeStyle = "#cfb870"),
      (t.lineWidth = 2),
      (t.shadowColor = "#000"),
      (t.shadowBlur = 5);
    var n = (ANNOTATION_POINT_ONE.x / ANNOTATION_POINT_ONE.w) * e.width,
      a = (ANNOTATION_POINT_ONE.y / ANNOTATION_POINT_ONE.h) * e.height,
      o =
        ((ANNOTATION_POINT_TWO.x - ANNOTATION_POINT_ONE.x) /
          ANNOTATION_POINT_ONE.w) *
        e.width,
      r =
        ((ANNOTATION_POINT_TWO.y - ANNOTATION_POINT_ONE.y) /
          ANNOTATION_POINT_ONE.h) *
        e.height;
    t.rect(n, a, o, r), t.stroke();
  },
  
//   Upload Image & Save
  renderSaveFile = function (e) {
    if (!e) {
      var t = JSON.stringify(SAVEFILE);
      localStorage.setItem(LOCAL_STORAGE_KEY, t);
    }
    var n = document.querySelector("#canvas-upload"),
      a = n.getContext("2d"),
      o = SAVEFILE.images.filter(function (e) {
        return e.id === SAVEFILE.mainId;
      })[0];
    if (((document.querySelector("#annotation-list").innerHTML = ""), o))
      !(function () {
        var e = document.createElement("img");
        (e.src = o.path),
          e.addEventListener("load", function (t) {
            for (
              var n = document.querySelectorAll("canvas"), o = 0;
              o < n.length;
              o++
            ) {
              var r = n[o];
              (r.width = t.target.naturalWidth),
                (r.height = t.target.naturalHeight);
            }
            a.drawImage(e, 0, 0);
          });
        var t = document.querySelector("#annotation-list");
        o.annotations.forEach(function (e, n) {
          var a = document.createElement("div");
          (a.className = "annotation-box"),
            (a.style.left = 100 * e.x1 + "%"),
            (a.style.top = 100 * e.y1 + "%"),
            (a.style.width = 100 * (e.x2 - e.x1) + "%"),
            (a.style.height = 100 * (e.y2 - e.y1) + "%"),
            (a.style.border = "2px solid " + e.color),
            (a.innerHTML =
              '<div class="annotation-box-inner" style="background-color:' +
              e.color +
              '"></div><div class="annotation-box-comment"><span style="background-color:#fff">' +
              e.comment +
              '</span></div><div class="annotation-box-delete" onclick="deleteAnnotationTextBox(' +
              n +
              ')">X</div>'),
            t.appendChild(a);
        });
      })();
    else {
      for (
        var r = document.querySelectorAll("canvas"), i = 0;
        i < r.length;
        i++
      ) {
        var N = r[i];
        (N.width = "300"), (N.height = "150");
      }
      a.clearRect(0, 0, n.width, n.height);
    }
   
  };


// Gallery 

var imagesObject = [];

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

      // Only process image files.
      if (!f.type.match('image.*')) {
        continue;
      }

      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = function(e) {
          displayImgData(e.target.result)
          addImage(e.target.result);
      };

      reader.readAsDataURL(f);
    }
}

function loadFromLocalStorage(){
  var images = JSON.parse(localStorage.getItem("images"))

  if(images && images.length > 0){
    imagesObject = images;
    
    displayNumberOfImgs();
    images.forEach(displayImgData);
  }
}

function addImage(imgData){
  imagesObject.push(imgData);
  displayNumberOfImgs();
  localStorage.setItem("images", JSON.stringify(imagesObject));
}

function displayImgData(imgData){
  var span = document.createElement('span');
  span.innerHTML = '<img class="thumb" src="' + imgData + '"/>';
  document.getElementById('list').insertBefore(span, null);
}

function displayNumberOfImgs(){
  if(imagesObject.length > 0){

    document.getElementById("state").innerHTML = imagesObject.length + " image" + ((imagesObject.length > 1) ? "s" : "") + " stored in your browser";
    
    document.getElementById("deleteImgs").style.display = "inline";
    
  } else {
    document.getElementById("state").innerHTML = "No images stored in your browser.";
    document.getElementById("deleteImgs").style.display = "none";
  }
  
  
}

function deleteImages(){
  imagesObject = [];
  localStorage.removeItem("images");
  displayNumberOfImgs()
  document.getElementById('list').innerHTML = "";
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);
document.getElementById('deleteImgs').addEventListener("click", deleteImages);
loadFromLocalStorage();

  