var innerhtml = "if (!window.getI18NString){getI18NString=function(s){ return s}}\n" +
  "// 头部改变线条粗细的值；\n" +
  "$(\".removetype\").parent().append(\"<i class='xljt'></i>\");\n" +
  "var shanchu = '<ul class=\"removebox\"><ul class=\"removexl\">\\\n" +
  "                <li class=\"scdx jzsy\">删除选项</li>\\\n" +
  "                <li class=\"scall\">删除全部</li>\\\n" +
  "            </ul></ul>'\n" +
  "\n" +
  "$(\".removetype\").parent().append(shanchu)\n" +
  "\n" +
  "$(\".toolbar-cx\").parent().append(\"<i class='xljt'></i>\");\n" +
  "var xiancuxi = '<ul class=\"cxbox\"><ul class=\"cxlx\">\\\n" +
  "    <li><p></p></li>\\\n" +
  "    <li><p></p></li>\\\n" +
  "    <li><p></p></li>\\\n" +
  "    <li><p></p></li>\\\n" +
  "    <li><p></p></li>\\\n" +
  "</ul></ul>';\n" +
  "$(\".toolbar-cx\").parent().append(xiancuxi);\n" +
  "// 颜色调整颜色拾取器\n" +
  "var ystz = '<div id=\"customWidget\">\\\n" +
  "    <div id=\"colorSelector2\"><div style=\"background-color: #ccc\"></div></div>\\\n" +
  "</div>';\n" +
  "$(\".toolbar-ys\").parent().append(ystz);\n" +
  "//几种布局的方法\n" +
  "var bjlx = '<ul class=\"bjbox\"><ul class=\"bjlx\">\\\n" +
  // "    <li><i></i>环形</li>\\\n" +
  // "    <li><i></i>树形</li>\\\n" +
  "    <li><i></i>弹性</li>\\\n" +
  "    <li><i></i>星云</li>\\\n" +
  "    <li><i></i>散点</li>\\\n" +
  "    <li><i></i>人物</li>\\\n" +
  "    <li><i></i>圆盘</li>\\\n" +
  // "    <li><i></i>两端</li>\\\n" +
  // "    <li><i></i>横向</li>\\\n" +
  // "    <li><i></i>纵向</li>\\\n" +
  "</ul></ul>'\n" +
  "$(\".bjtype\").parent().append(\"<i class='xljt'></i>\");\n" +
  "$(\".bjtype\").parent().append(bjlx);\n" +

  "// 初始画布\n" +
  "var graph = new Q.Graph(\"canvas\");\n" +
  "var aa = graph._l1Model._k2;\n" +
  // "var layouter = new AutoLayouter(graph);\n" +
  // "// var ctrlandclick=false;\n" +
  // "$(\".bjlx,.bjxl\").find(\"li\").click(function () {\n" +
  // "    doLayout($(this).text())\n" +
  // "    $('.tooltip').fadeOut('slow')\n"+
  // "})\n" +
  // "function doLayout(layoutType) {\n" +
  // "    layouter.doLayout({\n" +
  // "        layoutType: layoutType,\n" +
  // "        byAnimate: true,\n" +
  // "        callback: function () {\n" +
  // "            graph.zoomToOverview(true);\n" +
  // "        }\n" +
  // "    });\n" +
  // "}\n" +
  "\n" +
  "\n" +
  "// createRandomTreeDatas();//执行初始节点创建的方法\n" +
  // "layouter.doLayout({//初始的布局效果\n" +
  // "    byAnimate: true,\n" +
  // "    callback: function () {\n" +
  // "        graph.zoomToOverview(true, 2);\n" +
  // "    }\n" +
  // "});\n" +
  "// 初始创建节点\n" +
  "// function createRandomTreeDatas(root, level, sumLevel) {\n" +
  "//     if (!root) {\n" +
  "//         var root = createNode(\"18110299206\", 80, 20);\n" +
  "//         root._refId=\"1\";\n" +
  "//         root.setStyle(Q.Styles.SHAPE_FILL_COLOR, \"#ee6411\");\n" +
  "//         root.setStyle(Q.Styles.SHAPE_STROKE_STYLE, \"#f7c966\");\n" +
  "//         sumLevel = 1;\n" +
  "//         return createRandomTreeDatas(root, sumLevel, sumLevel);\n" +
  "//     }\n" +
  "//     level--;\n" +
  "//     var count =1;\n" +
  "//     var i = 0;\n" +
  "//     while (i++ < count) {\n" +
  "//         var node = createNode(\"15605811015\", 60, 14);\n" +
  "//         node._refId = \"2\";\n" +
  "//         createEdge(root, node);\n" +
  "//         if (level) {\n" +
  "//             createRandomTreeDatas(node, level, sumLevel);\n" +
  "//         }\n" +
  "//     }\n" +
  "//     return root;\n" +
  "// }\n" +
  "\n" +
  "// 创建的公用方法--------------------------------------------------------------------------------------\n" +
  "// 创建node节点\n" +
  "function createEdge(from, to) {\n" +
  "    var edge = graph.createEdge(from, to);\n" +
  "    edge.setStyle(Q.Styles.ARROW_TO, false);\n" +
  "    edge.setStyle(Q.Styles.EDGE_WIDTH, 1);\n" +
  "    edge.setStyle(Q.Styles.EDGE_LINE_DASH, [8, 4, 1, 4]);\n" +
  "    edge.setStyle(Q.Styles.EDGE_COLOR, \"#ccc\");\n" +
  "    edge.setStyle(Q.Styles.LABEL_FONT_SIZE, 12);\n" +
  "    edge.setStyle(Q.Styles.LABEL_COLOR, \"gray\"); //文字的颜色\n" +
  "    edge.name = \"转账 交易\";\n" +
  "    edge.type = \"zfb\";\n" +
  "    return edge;\n" +
  "}\n" +
  "// 创建连线\n" +
  "function createNode(name, size, fontSize) {\n" +
  "    var node = graph.createNode(name);\n" +
  "    var circle = Q.Shapes.getShape(Q.Consts.SHAPE_CIRCLE, 0, 0, 40, 40);\n" +
  "    var shape = new Q.ImageUI(circle);\n" +
  "    shape.lineWidth = 1;\n" +
  "    shape.strokeStyle = \"#ccc\";\n" +
  "    shape.fillColor = \"#fff\";\n" +
  "    shape.zIndex = -1;\n" +
  "    node.addUI(shape);\n" +
  "    node.image = \"./src/static/page/images/06.png\";\n" +
  "    node.size = { width: 26, height: 26 };\n" +
  "    node.setStyle(Q.Styles.LABEL_FONT_SIZE, 12);\n" +
  "    node.setStyle(Q.Styles.LABEL_COLOR, \"gray\");\n" +
  "    node.zIndex = 10;\n" +
  "    node.setStyle(Q.Styles.IMAGE_PADDING, 10)\n" +
  "    return node;\n" +
  "}\n" +
  "// 单击节点突显关联节点\n" +
  "graph.highlight = function (elements) {\n" +
  "    if (!Array.isArray(elements)) {\n" +
  "        elements = [elements];\n" +
  "    }\n" +
  "    this.currentHighlightElements = elements;\n" +
  "    aa.forEach(function (s) {\n" +
  "        if (s instanceof Q.Node) {\n" +
  "            s.setStyle(Q.Styles.ALPHA, 0.1);\n" +
  "        }\n" +
  "        else {\n" +
  "            s.setStyle(Q.Styles.ALPHA, 0.1);\n" +
  "        }\n" +
  "    });\n" +
  "    elements.forEach(function (e) {\n" +
  "        var oldStyles = {};\n" +
  "        if (e instanceof Q.Node) {\n" +
  "            e.setStyle(Q.Styles.ALPHA, 1);\n" +
  "        } else {\n" +
  "            e.setStyle(Q.Styles.ALPHA, 1);\n" +
  "\n" +
  "        }\n" +
  "    })\n" +
  "};\n" +
  "//双击节点线条高亮效果\n" +
  "graph.highlight2 = function (elements) {\n" +
  "    this.unhighlight2();\n" +
  "    if (!Array.isArray(elements)) {\n" +
  "        elements = [elements];\n" +
  "    }\n" +
  "    this.currentHighlightElements = elements;\n" +
  "    elements.forEach(function (e) {\n" +
  "        if (e instanceof Q.Edge) {\n" +
  "            e.setStyle(Q.Styles.EDGE_OUTLINE, 1);\n" +
  "            e.setStyle(Q.Styles.EDGE_OUTLINE_STYLE, '#2ebcff');\n" +
  "        }\n" +
  "    })\n" +
  "};\n" +
  "graph.unhighlight2 = function () {\n" +
  "    aa.forEach(function (s) {\n" +
  "        if (s instanceof Q.Edge) {\n" +
  "            s.setStyle(Q.Styles.EDGE_OUTLINE, null);\n" +
  "            s.setStyle(Q.Styles.EDGE_OUTLINE_STYLE, null);\n" +
  "        }\n" +
  "    });\n" +
  "\n" +
  "};\n" +
  "// 全局键盘监听\n" +
  "document.addEventListener(\"keydown\", function (evt) {\n" +
  "    var code = evt.keyCode;\n" +
  "    if (code == 27) {\n" +
  "        graph.unSelectAll();\n" +
  "        Q.eventPreventDefault(evt);\n" +
  "        return;\n" +
  "    }\n" +
  "    // if (code == 17) {\n" +
  "    //     ctrlandclick=true;\n" +
  "    //     return;\n" +
  "    // }\n" +
  "    if (code == 46) {\n" +
  "        graph.removeSelectionByInteraction(evt);\n" +
  "        Q.eventPreventDefault(evt);\n" +
  "        return;\n" +
  "    }\n" +
  "\n" +
  "}, false)\n" +
  "// document.addEventListener(\"keyup\", function (evt) {\n" +
  "//     var code = evt.keyCode;\n" +
  "//     if (code == 17) {\n" +
  "//         ctrlandclick = false;\n" +
  "//         return;\n" +
  "//     }\n" +
  "// },false)\n" +
  "// 面板的导航条\n" +
  "graph.navigationType = Q.Consts.NAVIGATION_NONE;\n" +
  "\n" +
  "// 判断节点是否可移动\n" +
  "graph.isMovable = function (item) {\n" +
  "    return !item.suo\n" +
  "}"

if (!window.getI18NString) { getI18NString = function (s) { return s; } }
// 初始画布
$(function () {
  var Colors = {
    blue: "#2898E0",
    yellow: "#fcfb9b",
    red: "#E21667",
    dark: "#1D4876",
    gray: "#888"
  }
  var Styles = Q.Styles;
  var Defaults = Q.Defaults;
  Defaults.FONT_FAMILY = "Verdana, sans-serif";
  Defaults.FONT_STYLE = "lighter";
  Defaults.ANIMATION_MAXTIME = 1500;
  Defaults.SELECTION_TOLERANCE = 1;
  var version = Q.version;
  Q.DefaultStyles[Q.Styles.SHAPE_FILL_COLOR] = null;
  Q.DefaultStyles[Q.Styles.SHAPE_FILL_COLOR] = Q.toColor(0xCCCCCCCC);

  Q.addCSSRule(".maximize", "position: fixed;top: 0px;bottom: 0px;right: 0px;left: 0px;z-index: 1030;height: auto !important;");
  //utils
  function byId (id) {
    return document.getElementById(id);
  }

  function getHash () {
    return "BalloonLayouter Demo";
  }

  //demos
  var demos = {
    "Layouter Demos": [
      {
        name: "BalloonLayouter Demo",
        jsfile: "./src/static/page/js/balloonLayouter-demo.js"
      }
    ],
  }
  var currentDemo;
  var lastHash;
  var ajdusting = false;
  var demo_title = byId("demo_title");
  var canvas = byId("canvas");
  var code_panel = byId("code_panel");

  var demoTree = new Q.DemoTree(demos, byId("demo_list"));
  var demoMap = demoTree.itemMap;

  Object.defineProperties(window, {
    currentDemo: {
      get: function () {
        return currentDemo;
      }
    },
    graph: {
      get: function () {
        return currentDemo && currentDemo.demoInstance
          && currentDemo.demoInstance.graph;
      }
    }
  });

  var toolbar = Q.createToolbar(window.graph, byId("toolbar"));

  window.addEventListener("hashchange", function () {
    if (window.location.hash !== lastHash) {
      showDemo(getHash());
    }
  }, false);

  showDemo(getHash());

  ///actions
  $('#btnRunCode').click(function () {
    var code_panel = byId("code_panel");
    var code = code_panel.getValue();
    clearGraph(currentDemo);
    runCode(code);
  })
  $('#about').click(function () {
    showDialog(Q.name, "Version - " + Q.version +
      "<br />Publish Date - " + Q.publishDate +
      "<br />" + Q.about +
      "<br />" + Q.copyright);
  });




  // 将更新的json数据重新渲染
  var json_code_panel = document.getElementById("json_code_panel");
  //
  function showJSONPanel (show) {

    var isShowing = $("#Q-JSON-Panel")[0].clientHeight > 10;
    if (show === undefined) {

      return showJSONPanel(!isShowing);
    }
    if (isShowing === show) {
      return;
    }
    $("#Q-JSON-Panel").animate({ height: isShowing ? "0" : "100%" });
    if (!isShowing) {
      // var newjson= graph.exportJSON(true);

      json_code_panel.value = graph.exportJSON(true);
      // var newjson2 = JSON.stringify(newjson);
      // json_code_panel.value = newjson2
    }
  }

  // showJSONPanel();

  // 点击将更新的json数据重新渲染
  $('#btnJSONShow').click(function () {
    showJSONPanel();
  });


  // 缩略图效果
  var overview = new Q.Overview(byId('overview'));
  overview.visible = true
  overview.setVisible(true);
  overview.setGraph(true ? window.graph : null);
  // $('#btnOverview').click(function(){
  //     var visible = !overview.visible;
  //     overview.setVisible(visible);
  //     overview.setGraph(visible ? window.graph : null);
  // })
  $('#btnJSONSubmit').click(function () {
    try {
      graph.clear();
      graph.parseJSON(json_code_panel.value);
      showJSONPanel(false);
    } catch (error) {
      Q.alert(getI18NString('Import Error'), error);
    }
  });
  $('#btnJSONClose').click(function () {
    showJSONPanel(false);
  });

  //load demo
  // var menu = new Q.PopupMenu();
  // console.log(menu);

  function runCode (code) {
    if (!currentDemo) {
      return;
    }
    // code指的是balloonLayouter-demo.js的内容
    try {
      currentDemo.demoInstance = eval("new function(canvas, Q){\n"
        + code
        + "\ntry{if(graph){this.graph = graph; this.graph.name=currentDemo.name;}\nif(destroy){this.destroy=destroy;}\n}catch(error){}\n"
        + "}(canvas, Q || Qunee);");

      var graph = window.graph;
      if (graph) {
        graph.onkeydown = function (evt) {
          if (Q.isMetaKey(evt) && evt.keyCode == 70) {
            Q.stopEvent(evt);
            focusSearchInput();
          }
        };
        // graph.popupmenu = menu;//右击的功能
        // console.log(menu);

        toolbar.setGraph(graph);//第二个canvas头部功能区域
      }
      overview.setGraph(overview.visible ? graph : null);//缩略图的功能
    } catch (error) {
      showError(error);
    }
  }

  function focusSearchInput () {
    $("#search_input").focus();
  }

  function clearGraph (demo) {
    if (!demo.demoInstance) {
      return;
    }
    Q.log("unloadDemo - " + demo.name);
    if (demo.demoInstance.destroy instanceof Function) {
      try {
        demo.demoInstance.destroy();
      } catch (error) {
        delete demo.demoInstance;
        showError(error);
      }
    }
    if (demo.demoInstance.graph) {
      try {
        demo.demoInstance.graph.destroy();
      } catch (error) {
        delete demo.demoInstance.graph;
        delete demo.demoInstance;
        showError(error);
      }
      delete demo.demoInstance.graph;
    }
    delete demo.demoInstance;
  }
  function loadDemo (callBack) {

    if (Q.isArray(currentDemo)) {
    }
    // if (!currentDemo.jsfile) {
    //     callBack();
    //     return;
    // }
    if (currentDemo.code) {
      Q.log("loadDemo - " + currentDemo.name);

      runCode(currentDemo.code);
      callBack();
      return;
    }
    var demo = currentDemo;

    demo.code = innerhtml;
    loadDemo(callBack);

    // if (demo.jsfile) {
    //     Q.loadURL(demo.jsfile, function (req) {
    //         var code = req.responseText;
    //         if (!code) {
    //             return;
    //         }
    //         demo.code = code;
    //         if (demo != currentDemo) {
    //             return;
    //         }
    //         loadDemo(callBack);
    //     }, showError, null, false);
    //     return;
    // }
  }

  function unloadDemo (demo) {
    canvas.innerHTML = "";
    code_panel.textContent = "";
    hideDialog();
    if (!demo.demoInstance) {
      return;
    }
    if (demo.demoInstance.graph) {
      var graph = demo.demoInstance.graph;
      var viewport = graph.viewportBounds;
      var scale = graph.scale / 1.6;
      var clip = new Q.Rect(viewport.cx, viewport.cy);
      clip.grow(150 / scale, 200 / scale);
      var imageInfo = graph.exportImage(graph.scale, clip);
      demo.image = imageInfo.data;

    }

    clearGraph(demo);
  }

  // function showDemoMask(show) {
  //     //show mask
  //     var className = show === false ? "mask" : "mask active";
  //     var mask_panel = byId("mask_panel");
  //     mask_panel.className = className;
  //     if (Q.isIE || document.body.style["pointer-events"] === undefined) {
  //         var display = show === false ? "none" : "block";
  //         mask_panel.style.display = display;
  //     }
  // }
  // demode 的名字
  function showDemo (name, callback) {
    var demo = demoMap[name];

    if (!demo) {
      name = "";
      demo = demoMap[name];
    }
    if (ajdusting || demo == currentDemo) {
      if (callback) {
        callback();
      }
      return false;
    }
    ajdusting = true;

    var oldDemo = currentDemo;
    currentDemo = demo;

    // showDemoMask();
    if (oldDemo) {
      unloadDemo(oldDemo);
    }
    var parent = currentDemo.parent;
    for (var n in demoMap) {
      $(demoMap[n].dom).removeClass("active");
    }
    if (currentDemo) {
      $(currentDemo.dom).addClass("active");
      if (parent && parent.dom) {
        $(parent.dom).addClass("active");
      }
    }
    if (name) {
      // lastHash = window.location.hash = "#";
    }
    var innerHTML = "";
    if (parent) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.setAttribute("href", "#" + parent.name);
      li.appendChild(a);
      innerHTML += "<li><a href=\"#" + parent.name + "\">" + parent.name + "</a></li>";
    }
    innerHTML += "<li class=\"active\">" + name + "</li>";
    demo_title.innerHTML = innerHTML;
    if (!currentDemo) {
      ajdusting = false;
      // showDemoMask(false);
      return false;
    }
    setTimeout(function () {
      var afterLoad = function () {
        // showDemoMask(false);
        if (callback) {
          callback();
        }
      }
      loadDemo(function () {
        ajdusting = false;
        if (window.graph) {
          window.graph.callLater(afterLoad, this, 100);
        } else {
          afterLoad();
        }
      });
    }, 100);
  }

  //dialog
  function showError (error) {
    if (Q.isString(error)) {
      showDialog("Error", error);
      return;
    }
    if (error.stack) {
      showDialog(error.message, error.stack);
    }
  }

  function showDialog (title, content) {
    if (content === undefined) {
      content = title;
      title = null;
    }
    $("#q-message .modal-title").html(title || getI18NString('Message'));
    $("#q-message .modal-body").html(content);
    $('#q-message').modal("show");
  }

  function hideDialog () {
    $('#q-message').modal("hide");
  }

  var list = $("#demo_list").find('li');
  var searchInput = Q.createButton({
    id: 'demo_search_input',
    placeholder: 'Search Demo', iconClass: 'q-icon toolbar-search', type: 'search',
    oninput: function (evt) {
      var value = evt.target.value;
      if (value) {
        var reg = new RegExp(value, 'i');
      }
      Q.forEach(list, function (li) {
        var name = li.data.name;
        if (!value) {
          li.style.display = '';
          $(li).removeClass('disabled');
          return;
        }
        var match = reg.test(name);
        if (match) {
          $(li).removeClass('disabled');
        } else {
          $(li).addClass('disabled');
        }
        if (match || Q.isArray(li.data)) {
          li.style.display = '';
        } else {
          li.style.display = 'none';
        }
      })
    },
    search: function (value, info) {
      if (!value) {
        return;
      }
      var result = [];
      var reg = new RegExp(value, 'i');
      Q.forEach(list, function (li) {
        var name = li.data.name;

        if (reg.test(name)) {
          result.push(li);
        }
      })
      return result;
    }, select: function (li) {

      showDemo(li.data.name);
    }
  });
  searchInput.style.width = '100%';
  // document.getElementById('demo_search').appendChild(searchInput);
  var maximize = byId('maximize');
  maximize.onclick = function () {
    if ($('#graph_panel').hasClass('q-max')) {
      $('#graph_panel').removeClass('q-max');
      $(maximize).removeClass('active');
      $("#page").removeClass("q-max")
    } else {
      $('#graph_panel').addClass('q-max');
      $(maximize).addClass('active');
      $("#page").addClass("q-max");

    }
    if (window.graph) {
      window.graph.updateViewport();
    }
  }
});

$(function () {
  var scrollAtTop;

  function checkScroll () {
    var atTop = $(window).scrollTop() < 20;
    if (scrollAtTop === atTop) {
      return;
    }
    scrollAtTop = atTop;
    if (scrollAtTop) {
      $('header').removeClass('scroll');
    } else {
      $('header').addClass('scroll');
    }
  }

  $(window).scroll(function (evt) {
    checkScroll();
  });
  checkScroll();
})


if (window.navigator.userAgent.indexOf('Chrome/49.0.2623.87')) {
  window.addEventListener('focus', function () {
    if (!window.graph) {
      return;
    }
    var canvasPanel = graph.canvasPanel;
    canvasPanel.style.width = '99%';
    graph.updateViewport();
    setTimeout(function () {
      canvasPanel.style.width = null;
      graph.updateViewport();
    }, 1000)
  }, false);
}



