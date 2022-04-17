// Canvas
jQuery(document).ready(function($) {
    
    var timer = "";
    var page = "";
    var back = "";
    var next = "";
    var pagination = "";
    var text_title = "";
    var file = [];
    var fileSize = "";
    let canvasX = "";
    let canvasY = "";


    $('#upload-canvas').on('change', function(event) {
        $(".canvas-list").remove();
        $(".images-list .image-name").each(function() {
            $(this).remove();
        });
        page = 1;
        current_file = event.target.files;
        file = Array.from(file).concat(Array.from(current_file));
        canvasPreview(file);
    });

    var canvasPreview = function(file) {
        var img = "";
        var src = "";
        var c = "0";
        if (file) {
            //for(let x in file){

            paginationList(file);

            for (i = 0; i < fileSize; i++) {

                if (file[i] === undefined) {
                    continue;
                }

                filename = file[i].name;
                $(".images-list").append('<div data-image-id="' + i + '" class="image-name">' + filename + ' <button id="delete-canvas"><i class="fa-solid fa-trash-can"></i></button></div>');

                var reader = new FileReader();

                reader.onload = function(event) {
                    $('.canvas-wrapper').removeClass("hidden");

                    img = new Image();
                    img.src = event.target.result;
                    src = event.target.result;

                    img.onload = function(event) {
                        var upload_img = event.currentTarget;

                        if (c == 0) {
                            $('#canvas-wrapper').append('<div class="canvas-list selected" id="image-' + c + '"><canvas id="gallery-canvas-' + c + '" class="gallery-canvas"></canvas></div>');
                        } else {
                            $('#canvas-wrapper').append('<div class="canvas-list" id="image-' + c + '"><canvas id="gallery-canvas-' + c + '" class="gallery-canvas"></canvas></div>');
                        }

                        var canvas = document.getElementById("gallery-canvas-" + c);
                        var ctx = canvas.getContext("2d");

                        canvas.width = 650;
                        canvas.height = 650;
                        var scale = Math.min(canvas.width / upload_img.width, canvas.height / upload_img.height);
                        var x = (canvas.width / 2) - (upload_img.width / 2) * scale;
                        var y = (canvas.height / 2) - (upload_img.height / 2) * scale;
                        ctx.drawImage(upload_img, x, y, upload_img.width * scale, upload_img.height * scale);
                        c++;


                    }



                }
                reader.readAsDataURL(file[i]);


            }
            //}
        }

    };

    function DynamicText(x, y) {
        var id = $(".canvas-list.selected").find('.gallery-canvas').attr('id');
        var canvas = document.getElementById(id);
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "white";
        ctx.font = "calc(18px + (26 - 18) * (100vw - 375px) / (1900 - 375)) 'Beau Rivage'";
        text_title = document.getElementById("name").value;
        ctx.fillText(text_title, x, y);
    }

    $('body').on('click', '#canvas-wrapper .canvas-list canvas', function(event) {
        $("#name").val("");
        // $(".canvas-list").removeClass("selected");
        $(this).parent('.canvas-list').addClass("selected");

        var offset = $(this).offset();
        canvasX = event.pageX - offset.left;
        canvasY = event.pageY - offset.top;

        $("#input-text-wrapper").removeClass("hidden");
        var x = event.pageX;
        var y = event.pageY;
        var element = $("#input-text-wrapper");
        element.css('position', 'absolute');
        element.css("left", x);
        element.css("top", y);

        $("#name").focus();
        $("#name").keyup(function() {
            clearTimeout(timer);
            timer = setTimeout(hideTextBox, 1000);
            DynamicText(canvasX, canvasY);
        });
    });

    function hideTextBox() {
        $("#input-text-wrapper").addClass("hidden");
    }



    function paginationList(file) {
        fileSize = file.length;

        $(".pagination-list").empty();

        next = '';
        back = '';
        if (fileSize > 1) {
            next = '<span id="next-btn"><i class="fa-solid fa-arrow-right"></i></span>';
        }

        pagination = back + '1 of ' + fileSize + next;
        $(".pagination-list").append(pagination);
        $(".canvas-list").removeClass("selected");
        $(".canvas-list:first-child").addClass("selected");
    }

    $('body').on('click', '.pagination-list #next-btn', function() {
        var upload_img = $(".canvas-list.selected").attr("id");
        $(".canvas-list").removeClass("selected");
        $(".canvas-list#" + upload_img).next().addClass("selected");
        page++;
        $(".pagination-list").empty();

        fileSize = file.length;
        if (fileSize > 1) {
            back = '<span id="back-btn"><i class="fa-solid fa-arrow-left"></i></span>';
        }
        next = '<span id="next-btn"><i class="fa-solid fa-arrow-right"></i></span>';
        if (page == (fileSize)) {
            next = '';
        }

        pagination = back + page + ' of ' + fileSize + next;
        $(".pagination-list").append(pagination);
    });

    $('body').on('click', '.pagination-list #back-btn', function() {
        var upload_img = $(".canvas-list.selected").attr("id");
        $(".canvas-list").removeClass("selected");
        $(".canvas-list#" + upload_img).prev().addClass("selected");
        page--;
        $(".pagination-list").empty();

        fileSize = file.length;
        if (fileSize > 1) {
            next = '<span id="next-btn"><i class="fa-solid fa-arrow-right"></i></span>';
        }
        back = '<span id="back-btn"><i class="fa-solid fa-arrow-left"></i></span>';
        if (page == 1) {
            back = '';
        }

        pagination = back + page + ' of ' + fileSize + next;
        $(".pagination-list").append(pagination);
    });


    $('body').on('click', '.image-name #delete-canvas', function() {
        var canvas_id = $(this).parent('.image-name').attr('data-image-id');
        $(this).parent('.image-name').remove();
        $(".canvas-list#image-" + canvas_id).remove();

        file.splice(canvas_id, 1);
        paginationList(file);
        if (file.length == 1) {
            $(".canvas-list").addClass("selected");
        }
        if (file.length == 0) {
            $(".pagination-list").empty();
        }

    });

    $(".delete-all").click(function() {
        resetCanvas();
        clearAlltag();
        $(".pagination-list").empty();
        file.splice(0);
    });



    function resetCanvas() {
        $(".canvas-list").each(function() {
            var canvas = document.getElementById($(this).find(".gallery-canvas").attr('id'));
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            $(this).remove();
        });
    }

    function clearAlltag() {
        $(".images-list .image-name").each(function() {
            $(this).remove();
        });
    }

    $(".clear-all-tag").click(function() {
        resetCanvas();
        clearAlltag();
        canvasPreview(file);
    });

   



});

// Gallery 
jQuery(document).ready(function($) {
    function previewImages() {

        var preview = document.querySelector('#preview');

        if (this.files) {
            [].forEach.call(this.files, readAndPreview);
        }

        function readAndPreview(file) {

            // Make sure `file.name` matches our extensions criteria
            if (!/\.(jpe?g|png|gif)$/i.test(file.name)) {
                return alert(file.name + " is not an image");
            } // else...

            var reader = new FileReader();

            reader.addEventListener("load", function() {
                var image = new Image();
                image.className = "thumb";
                image.title = file.name;
                image.src = this.result;
                preview.appendChild(image);
                i = 0;
                for (i = 0; i < file.length; i++) {
                    $('.thumb').append(' <div id="myModal' + i + '" class="modal"><span class="close">&times;</span><img class="modal-content" id="img01"><div id="caption"></div></div>');

                };

            });

            reader.readAsDataURL(file);

        }

    }

    document.querySelector('#file-input').addEventListener("change", previewImages);


});

//Update Canvas
jQuery(document).ready(function($) {
    "use strict";
var _extends =
  Object.assign ||
  function (e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var a in n)
        Object.prototype.hasOwnProperty.call(n, a) && (e[a] = n[a]);
    }
    return e;
  };
function _toConsumableArray(e) {
  if (Array.isArray(e)) {
    for (var t = 0, n = Array(e.length); t < e.length; t++) n[t] = e[t];
    return n;
  }
  return Array.from(e);
}
var SAVEFILE = { mainId: "", images: [] },
  ANNOTATION_PHASE = 0,
  ANNOTATION_POINT_ONE = { x: 0, y: 0, w: 0, h: 0 },
  ANNOTATION_POINT_TWO = { x: 0, y: 0, w: 0, h: 0 },
  LOCAL_STORAGE_KEY = "S_LAB_STORAGE",
  COLOR_CYCLE = [
    "#9784d5",
    "#6db27d",
    "#00c2e2",
    "#beca30",
    "#f8e9a5",
    "#f842ca",
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
      (t.strokeStyle = "#f00"),
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
    var O = document.querySelector("#gallery-container");
    (O.innerHTML = ""),
      SAVEFILE.images.forEach(function (e, t) {
        var n = document.createElement("div");
        (n.className =
          e.id === SAVEFILE.mainId ? "gallery-img active" : "gallery-img"),
          (n.style.backgroundImage = "url(" + e.path + ")"),
          n.addEventListener("click", function (e) {
            switchImage(t, !0);
          }),
          O.appendChild(n);
      });
    var l = getCurrentImageIndex();
    (document.querySelector("#btn-next").className = SAVEFILE.images[l + 1] ? "custom-file-upload" : "custom-file-upload disabled"),
      (document.querySelector("#btn-prev").className = SAVEFILE.images[l - 1] ? "custom-file-upload" : "custom-file-upload disabled");
  };

});


