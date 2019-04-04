if (!window.getI18NString){getI18NString=function(s){ return s}}
// 头部改变线条粗细的值；
$(".removetype").parent().append("<i class='xljt'></i>");
var shanchu = '<ul class="removebox"><ul class="removexl">\
                <li class="scdx jzsy">删除选项</li>\
                <li class="scall">删除全部</li>\
                <li class="scgx">删除关系</li>\
            </ul></ul>'

$(".removetype").parent().append(shanchu)

$(".toolbar-cx").parent().append("<i class='xljt'></i>");
var xiancuxi = '<ul class="cxbox"><ul class="cxlx">\
    <li><p></p></li>\
    <li><p></p></li>\
    <li><p></p></li>\
    <li><p></p></li>\
    <li><p></p></li>\
</ul></ul>';
$(".toolbar-cx").parent().append(xiancuxi);
$(".btn-group:eq(5)").find(".btn-sm:eq(0)").click(function () {
    if($(".cxlx").css("display")==="none"){
        $(".cxlx").fadeIn();
        $(".removexl").fadeOut();
        $(".bjlx").fadeOut();
    }else{
        $(".cxlx").fadeOut();
    }
})
// $(".cxlx").find("li").click(function () {
//     var xcxz = $(this).index();
//     aa.forEach(function (s) {
//         if (s instanceof Q.Edge && s.getStyle(Q.Styles.LABEL_COLOR) == "#2ebcff") {
//             s.newWidth = xcxz + 1
//             s.setStyle(Q.Styles.EDGE_WIDTH, xcxz + 1);
//         }
//     });
// })
// 颜色调整颜色拾取器
var ystz = '<div id="customWidget">\
    <div id="colorSelector2"><div style="background-color: #ccc"></div></div>\
    <div id="colorpickerHolder2">\
    </div>\
</div>';
$(".toolbar-ys").parent().append(ystz);
var widt = false;
var yssqq = document.getElementsByClassName("btn-group")[5].getElementsByClassName("btn-default")[2];
$('#colorpickerHolder2').ColorPicker({
    flat: true,
    color: '#00ff00',
    onSubmit: function (hsb, hex, rgb) {
        $('#colorSelector2 div').css('backgroundColor', '#' + hex);
        aa.forEach(function (s) {
            if (s instanceof Q.Node && s.getStyle(Q.Styles.LABEL_COLOR) == "#2ebcff") {
                s.setStyle(Q.Styles.IMAGE_BORDER_STYLE, "#" + hex);
                s.setStyle(Q.Styles.LABEL_COLOR, "#" + hex);
                s.bindingUIs.datas[0].ui.strokeStyle = "#" + hex;
                s.colornew = "#" + hex;
            }
            if (s instanceof Q.Edge && s.getStyle(Q.Styles.LABEL_COLOR) == "#2ebcff") {
                s.setStyle(Q.Styles.EDGE_COLOR, "#" + hex);
                s.setStyle(Q.Styles.LABEL_COLOR, "#" + hex); //文字的颜色
                s.colornew = "#" + hex;
                if (s instanceof Q.Edge && s.getStyle(Q.Styles.ARROW_TO) && s.colornew) {
                    s.setStyle(Q.Styles.ARROW_TO, false);
                    s.setStyle(Q.Styles.ARROW_TO, true);
                    s.setStyle(Q.Styles.ARROW_TO_FILL_COLOR, s.colornew);
                    s.setStyle(Q.Styles.ARROW_TO_OUTLINE, null);
                }
            }
        });

    }
});
$('#colorpickerHolder2>div').css('position', 'absolute');
$('#colorpickerField1, #colorpickerField2, #colorpickerField3').ColorPicker({
    onSubmit: function (hsb, hex, rgb, el) {
        $(el).val(hex);
        $(el).ColorPickerHide();
    },
    onBeforeShow: function () {
        $(this).ColorPickerSetColor(this.value);
    }
})

    .bind('keyup', function () {
        $(this).ColorPickerSetColor(this.value);
    });

// 给选中的添加箭头
var addjt = document.getElementsByClassName("btn-group")[5].getElementsByClassName("btn-default")[1];
addjt.onclick = function () {
    aa.forEach(function (s) {
        if (s instanceof Q.Edge && s.getStyle(Q.Styles.LABEL_COLOR) == "#2ebcff") {
            if (s.getStyle(Q.Styles.ARROW_TO)) {
                s.setStyle(Q.Styles.ARROW_TO, false);
            } else {
                s.setStyle(Q.Styles.ARROW_TO, true);
                s.setStyle(Q.Styles.ARROW_TO_OUTLINE, null);
                s.setStyle(Q.Styles.ARROW_TO_FILL_COLOR, "#2ebcff");
            }
        }
    });
}
//几种布局的方法
var bjlx = '<ul class="bjbox"><ul class="bjlx">\
    <li><i></i>环形</li>\
    <li><i></i>树形</li>\
    <li><i></i>弹性</li>\
    <li><i></i>两端</li>\
    <li><i></i>横向</li>\
    <li><i></i>纵向</li>\
</ul></ul>'
$(".bjtype").parent().append("<i class='xljt'></i>");
$(".bjtype").parent().append(bjlx);
var LAYOUT_TYPE_BALLOON = "环形";
var LAYOUT_TYPE_TREE = "树形";
var LAYOUT_TYPE_TREE2 = "两端";
var LAYOUT_TYPE_TREE3 = "横向";
var LAYOUT_TYPE_TREE4 = "弹性";
var LAYOUT_TYPE_TREE5 = "纵向";
function AutoLayouter(graph) {
    this.graph = graph;
    this._layouters = {};
}
AutoLayouter.prototype = {
    _layouters: null,
    _getLayouter: function (layoutType) {
        if (layoutType == LAYOUT_TYPE_BALLOON) {
            return new Q.BalloonLayouter(this.graph);
        }
        if (layoutType == LAYOUT_TYPE_TREE4) {
            var layouter = new Q.SpringLayouter(this.graph);
            layouter.repulsion = 200;
            layouter.attractive = 5;
            layouter.elastic = 0.5;
            return layouter
        }
        if (layoutType == LAYOUT_TYPE_TREE2) {
            var layouter = new Q.TreeLayouter(this.graph);
            layouter.layoutType = Q.Consts.LAYOUT_TYPE_TWO_SIDE;
            return layouter
        }
        if (layoutType == LAYOUT_TYPE_TREE3) {
            var layouter = new Q.TreeLayouter(this.graph);
            layouter.parentChildrenDirection = Q.Consts.DIRECTION_LEFT;
            layouter.layoutType = Q.Consts.LAYOUT_TYPE_EVEN_HORIZONTAL;
            return layouter
        }
        if (layoutType == LAYOUT_TYPE_TREE5) {
            var layouter = new Q.TreeLayouter(this.graph);
            layouter.parentChildrenDirection = Q.Consts.DIRECTION_TOP;
            layouter.layoutType = Q.Consts.LAYOUT_TYPE_EVEN_VERTICAL;
            return layouter
        }
        if (layoutType == LAYOUT_TYPE_TREE) {
            var layouter = new Q.TreeLayouter(this.graph);
            layouter.getLayoutResult = function (params) {
                var bounds = params.bounds = new Q.Rect();
                var locations = Q.TreeLayouter.prototype.getLayoutResult.call(this, params);
                var offsetX = -bounds.width / 2;
                var offsetY = -bounds.height / 2;
                for (var id in locations) {
                    var p = locations[id];
                    p.x += offsetX;
                    p.y += offsetY;
                }
                return locations;
            };
            return layouter;
        }
        return new Q.BalloonLayouter(this.graph);
    },
    doLayout: function (params) {
        var layoutType = params.layoutType;
        var layouter = this._layouters[layoutType];
        if (!layouter) {
            layouter = this._layouters[layoutType] = this._getLayouter(layoutType);
        }
        layouter.radius = 150;
        layouter.doLayout(params);
    }
};


// 初始画布
var graph = new Q.Graph("canvas");
var aa = graph._l1Model._k2;
var layouter = new AutoLayouter(graph);
// var ctrlandclick=false;
//布局下拉并执行选中的布局方式
$(".btn-group:eq(4)").find(".btn-sm:eq(0)").click(function () {
    if ($(".bjlx").css("display") === "none") {
        $(".bjlx").fadeIn();
        $(".removexl").fadeOut();
        $(".cxlx").fadeOut();
    } else {
        $(".bjlx").fadeOut();
    }
})
$(".bjlx,.bjxl").find("li").click(function () {
    doLayout($(this).text())
})
function doLayout(layoutType) {
    layouter.doLayout({
        layoutType: layoutType,
        byAnimate: true,
        callback: function () {
            graph.zoomToOverview(true);
        }
    });
}


$(".btn-group:eq(4)").find(".btn-sm:eq(2)").click(function () {
    if ($(".removexl").css("display") === "none") {
        $(".removexl").fadeIn();
        $(".bjlx").fadeOut();
        $(".cxlx").fadeOut();
    } else {
        $(".removexl").fadeOut();
    }
})





// createRandomTreeDatas();//执行初始节点创建的方法
layouter.doLayout({//初始的布局效果
    byAnimate: true,
    callback: function () {
        graph.zoomToOverview(true, 2);
    }
});
// 初始创建节点
// function createRandomTreeDatas(root, level, sumLevel) {
//     if (!root) {
//         var root = createNode("18110299206", 80, 20);
//         root._refId="1";
//         root.setStyle(Q.Styles.SHAPE_FILL_COLOR, "#ee6411");
//         root.setStyle(Q.Styles.SHAPE_STROKE_STYLE, "#f7c966");
//         sumLevel = 1;
//         return createRandomTreeDatas(root, sumLevel, sumLevel);
//     }
//     level--;
//     var count =1;
//     var i = 0;
//     while (i++ < count) {
//         var node = createNode("15605811015", 60, 14);
//         node._refId = "2";
//         createEdge(root, node);
//         if (level) {
//             createRandomTreeDatas(node, level, sumLevel);
//         }
//     }
//     return root;
// }

// 创建的公用方法--------------------------------------------------------------------------------------
// 创建node节点
function createEdge(from, to) {
    var edge = graph.createEdge(from, to);
    edge.setStyle(Q.Styles.ARROW_TO, false);
    edge.setStyle(Q.Styles.EDGE_WIDTH, 1);
    edge.setStyle(Q.Styles.EDGE_LINE_DASH, [8, 4, 1, 4]);
    edge.setStyle(Q.Styles.EDGE_COLOR, "#ccc");
    edge.setStyle(Q.Styles.LABEL_FONT_SIZE, 12);
    edge.setStyle(Q.Styles.LABEL_COLOR, "gray"); //文字的颜色
    edge.name = "转账 交易";
    edge.type = "zfb";
    return edge;
}
// 创建连线
function createNode(name, size, fontSize) {
    var node = graph.createNode(name);
    var circle = Q.Shapes.getShape(Q.Consts.SHAPE_CIRCLE, 0, 0, 40, 40);
    var shape = new Q.ImageUI(circle);
    shape.lineWidth = 1;
    shape.strokeStyle = "#ccc";
    shape.fillColor = "#ccc";
    shape.zIndex = -1;
    node.addUI(shape);
    node.image = "./src/static/page/images/06.png";
    node.size = { width: 25, height: 29 };
    node.setStyle(Q.Styles.LABEL_FONT_SIZE, 12);
    node.setStyle(Q.Styles.LABEL_COLOR, "gray");
    node.zIndex = 10;
    node.setStyle(Q.Styles.IMAGE_PADDING, 10)
    return node;
}

//选中的样式
var setSelectionStyle = function (element) {
    if (!(element instanceof Q.Node || Q.Edge)) {
        return;
    }
    if (element.styles.alpha === 0.1) {
        return
    }
    var selected = graph.isSelected(element);
    if (selected) {
        element.setStyle(Q.Styles.SELECTION_COLOR, 'transparent');
        element.setStyle(Q.Styles.IMAGE_BORDER_STYLE, "#2ebcff");
        element.setStyle(Q.Styles.EDGE_COLOR, "#2ebcff");
        element.setStyle(Q.Styles.LABEL_COLOR, "#2ebcff"); //文字的颜色
        if (element instanceof Q.Node) {
            element.bindingUIs.datas[0].ui.strokeStyle = "#2ebcff";
        }
        if (element instanceof Q.Edge && element.getStyle(Q.Styles.ARROW_TO)) {
            element.setStyle(Q.Styles.ARROW_TO, false);
            element.setStyle(Q.Styles.ARROW_TO, true);
            element.setStyle(Q.Styles.ARROW_TO_FILL_COLOR, "#2ebcff");
            element.setStyle(Q.Styles.ARROW_TO_OUTLINE, null);
        }
    }
    if (!selected && element.getStyle(Q.Styles.LABEL_COLOR) == "#2ebcff") {
        element.setStyle(Q.Styles.SELECTION_COLOR, 'transparent');
        element.setStyle(Q.Styles.IMAGE_BORDER_STYLE, "#ccc");
        element.setStyle(Q.Styles.EDGE_COLOR, "#ccc");
        element.setStyle(Q.Styles.LABEL_COLOR, "gray"); //文字的颜色
        element.setStyle(Q.Styles.ARROW_TO_FILL_COLOR, "#ccc");
        element.setStyle(Q.Styles.ARROW_TO_OUTLINE, null);
        if (element instanceof Q.Node) {
            element.bindingUIs.datas[0].ui.strokeStyle = "#ccc";
        }
        //判断拾取器改变了颜色箭头的样式颜色
        if (element instanceof Q.Edge && element.getStyle(Q.Styles.ARROW_TO) && element.colornew) {
            element.setStyle(Q.Styles.ARROW_TO, false);
            element.setStyle(Q.Styles.ARROW_TO, true);
            element.setStyle(Q.Styles.ARROW_TO_FILL_COLOR, element.colornew);
            element.setStyle(Q.Styles.ARROW_TO_OUTLINE, null);;
        }
        //节点或者线没有颜色变化的情况下
        if (element instanceof Q.Edge && element.getStyle(Q.Styles.ARROW_TO) && !element.colornew) {
            element.setStyle(Q.Styles.ARROW_TO, false);
            element.setStyle(Q.Styles.ARROW_TO, true);
            element.setStyle(Q.Styles.ARROW_TO_FILL_COLOR, "#ccc");
            element.setStyle(Q.Styles.ARROW_TO_OUTLINE, null);;
        }
        //判断节点或者线的拾取器的颜色
        if (element.colornew) {
            element.setStyle(Q.Styles.IMAGE_BORDER_STYLE, element.colornew);
            element.setStyle(Q.Styles.EDGE_COLOR, element.colornew);
            element.setStyle(Q.Styles.LABEL_COLOR, element.colornew);
            element.setStyle(Q.Styles.ARROW_TO_FILL_COLOR, element.colornew);
            element.setStyle(Q.Styles.ARROW_TO_OUTLINE, null);
            if (element instanceof Q.Node) {
                element.bindingUIs.datas[0].ui.strokeStyle = element.colornew;
            }
        }
    }
};
graph.selectionChangeDispatcher.addListener(function (evt) {
    var data = evt.data;
    if (!data) {
        return;
    }
    if (Q.isArray(data)) {
        for (var i = 0, l = data.length; i < l; i++) {
            setSelectionStyle(data[i]);
        }
    } else {
        setSelectionStyle(data);
    }
});

// 单击节点突显关联节点
graph.highlight = function (elements) {
    if (!Array.isArray(elements)) {
        elements = [elements];
    }
    this.currentHighlightElements = elements;
    aa.forEach(function (s) {
        if (s instanceof Q.Node) {
            s.setStyle(Q.Styles.ALPHA, 0.1);
        }
        else {
            s.setStyle(Q.Styles.ALPHA, 0.1);
        }
    });
    elements.forEach(function (e) {
        var oldStyles = {};
        if (e instanceof Q.Node) {
            e.setStyle(Q.Styles.ALPHA, 1);
        } else {
            e.setStyle(Q.Styles.ALPHA, 1);

        }
    })
};

//双击节点线条高亮效果
graph.highlight2 = function (elements) {
    this.unhighlight2();
    if (!Array.isArray(elements)) {
        elements = [elements];
    }
    this.currentHighlightElements = elements;
    elements.forEach(function (e) {
        if (e instanceof Q.Edge) {
            e.setStyle(Q.Styles.EDGE_OUTLINE, 1);
            e.setStyle(Q.Styles.EDGE_OUTLINE_STYLE, '#2ebcff');
        }
    })
};
graph.unhighlight2 = function () {
    aa.forEach(function (s) {
        if (s instanceof Q.Edge) {
            s.setStyle(Q.Styles.EDGE_OUTLINE, null);
            s.setStyle(Q.Styles.EDGE_OUTLINE_STYLE, null);
        }
    });

};
// 全局键盘监听
document.addEventListener("keydown", function (evt) {
    var code = evt.keyCode;
    if (code == 27) {
        graph.unSelectAll();
        Q.eventPreventDefault(evt);
        return;
    }
    // if (code == 17) {
    //     ctrlandclick=true;
    //     return;
    // }
    if (code == 46) {
        graph.removeSelectionByInteraction(evt);
        Q.eventPreventDefault(evt);
        return;
    }

}, false)
// document.addEventListener("keyup", function (evt) {
//     var code = evt.keyCode;
//     if (code == 17) {
//         ctrlandclick = false;
//         return;
//     }
// },false)
// 面板的导航条
graph.navigationType = Q.Consts.NAVIGATION_NONE;

// 判断节点是否可移动
graph.isMovable = function (item) {
    return !item.suo
}