const reLayoutAddGraph = function (graph) {
  this.graph = graph;
}
reLayoutAddGraph.prototype = {
  getLayoutResult: function (params) {
    if (!(params instanceof Object)) {
      if (Q.isNumber(params)) {
        params = { xGap: params, yGap: params }
      } else {
        params = {};
      }
    }
    var xGap = params.xGap || 100;
    var yGap = params.yGap || 100;
    var graph = this.graph;

    var locations = {};
    var sumNode = 0
    graph.graphModel.forEachByTopoBreadthFirstSearch(function (v, from, layer, index, sum) {
      sumNode++
      if (v._layer === undefined || layer > v._layer) {
        v._layer = layer;
        return;
      }
    });
    let layerNum = 0
    while (Math.pow(layerNum, 2) < sumNode) {
      layerNum++
    }
    var layers = {};
    graph.forEach(function (element) {
      if (element._layer !== undefined) {
        var nodes = layers[element._layer];
        if (!nodes) {
          nodes = layers[element._layer] = [];
        }
        nodes.push(element);
      }
    })

    var layer = 0;
    while (true) {
      var nodes = layers[layer];
      if (!nodes) {
        break;
      }
      var width = (nodes.length - 1) * xGap
      var x = -width / 2;
      var y = layer * yGap;
      nodes.forEach(function (node, i) {
        locations[node.id] = { node: node, x: x + i * xGap, y: y };
        delete node._layer;
      })
      layer++;
    }
    return locations;
  }
}

function loadMatrix (params) {
  const { itemCount, zoomToOverview } = params
  graph.graphModel.clear();
  var graphModel = new Q.GraphModel();
  var gap = 100;
  var rows = Math.ceil(Math.sqrt(itemCount / 4));
  var height = (rows - 1) * gap;
  createMatrix(graphModel, height, rows, itemCount, withEdges);
  graph.graphModel = graphModel;
  if (zoomToOverview) {
    graph.zoomToOverview();
  }
}
function createMatrix (model, height, rows, count, withEdge) {
  var x = 0, y = 0;
  var perX, perY;
  perX = perY = height / rows | 0;
  var startX = -height / 2, startY = -height / 2;
  var prevNode, prevNodes = [];
  while (model.length < count) {
    y = 0;
    prevNode = null;
    while (y < rows) {
      var node = createNode(startX + x * perX, startY + y * perY);
      model.add(node);
      y++;
      if (model.length >= count) {
        return;
      }
    }
    x++;
  }
}
const flowerLayout = function (graph) {
  this.graph = graph;

}
function forEachLinkedNode (node, call) {
  node.forEachEdge(function (edge) {
    var to = edge.otherNode(node);
    if (to !== node) {
      call(to);
    }
  })
}
flowerLayout.prototype = {
  getLayoutResult: function (params) {
    var locations = {};
    function doLayout (graph) {
      let model = graph.graphModel
      let nodeMap = new Map()
      let NodeArr = model.datas.filter(item => {
        return item instanceof Q.Node
      })
      let sortArr = NodeArr.sort((a, b) => {
        return b.edgeCount - a.edgeCount
      })
      NodeArr.forEach(item => {
        nodeMap.set(item.id, item)
      })
      let moreArr = sortArr.filter(item => item.edgeCount > 1)
      let moreNum = moreArr.length - 1
      let lessArr = sortArr.filter(item => item.edgeCount < 2)
      moreArr.forEach((item, index) => {
        if (index > 0) {
          let originR = moreArr[0].layerNum
          item.layerNum = 0
          let arr = []
          let layerArr = []
          while (Math.pow(item.layerNum, 2) * 10 < item.edgeCount) {
            item.layerNum++
          }
          locations[item.id] = { node: item, x: ((originR + item.layerNum) * 200 * Math.sin(2 * (index - 1) * 3.14 / moreNum)), y: ((originR + item.layerNum) * 200 * Math.cos(2 * (index - 1) * 3.14 / moreNum)) }
          nodeMap.delete(item.id)

          forEachLinkedNode(item, (otherNode) => {
            arr.push(otherNode)
          })
          for (let i = 0; i < item.layerNum; i++) {
            layerArr.push(arr.slice(Math.ceil(Math.pow(i, 2) * 10), Math.ceil(Math.pow((i + 1), 2) * 10)))
          }
          layerArr.forEach((itemArr, index) => {
            let itemNum = itemArr.length
            itemArr.forEach((node, loc) => {
              if (!node.layerNum) {

                locations[node.id] = {
                  node: node,
                  x: locations[item.id].x + (150 * (index + 1) * Math.sin(2 * loc * 3.14 / itemNum)),
                  y: locations[item.id].y + (150 * (index + 1) * Math.cos(2 * loc * 3.14 / itemNum))
                }
                nodeMap.delete(node.id)
              }
            })
          })
        } else {
          locations[item.id] = { node: item, x: 0, y: 0 }
          nodeMap.delete(item.id)
          item.layerNum = 0
          let arr = []
          let layerArr = []
          while (Math.pow(item.layerNum, 2) * 10 < item.edgeCount) {
            item.layerNum++
          }
          forEachLinkedNode(item, (otherNode) => {
            arr.push(otherNode)
          })
          for (let i = 0; i < item.layerNum; i++) {
            layerArr.push(arr.slice(Math.ceil(Math.pow(i, 2) * 10), Math.ceil(Math.pow((i + 1), 2) * 10)))
          }
          layerArr.forEach((item, index) => {
            let itemNum = item.length
            item.forEach((node, loc) => {
              if (!node.layerNum) {
                locations[node.id] = {
                  node: node,
                  x: (150 * (index + 1) * Math.sin(2 * loc * 3.14 / itemNum)),
                  y: (150 * (index + 1) * Math.cos(2 * loc * 3.14 / itemNum))
                }
                nodeMap.delete(node.id)
              }

            })
          })
        }
      })
      let resArr = [...nodeMap.values()]
      let resNum = resArr.length
      resArr.forEach((item, index) => {
        locations[item.id] = { node: item, x: 700 + (150 * Math.sin(2 * index * 3.14 / resNum)), y: (150 * Math.cos(2 * index * 3.14 / resNum)) }
      })
      return locations
    }
    return doLayout(graph)
  }
}
Q.extend(flowerLayout, Q.Layouter);
Q.flowerLayout = flowerLayout;


const transferLayout = function (graph) {
  this.graph = graph;
}
transferLayout.prototype = {
  getLayoutResult: function (params) {
    var locations = {};
    function doLayout (graph) {
      let model = graph.graphModel
      let nodeMap = new Map()
      let NodeArr = model.datas.filter(item => {
        return item instanceof Q.Node
      })
      let sortArr = NodeArr.sort((a, b) => {
        return b.edgeCount - a.edgeCount
      })
      let layerArr = []
      let layerNum = 0
      let centerNode = sortArr.shift()
      while (Math.pow(layerNum, 2) * 10 < sortArr.length) {
        layerNum++
      }
      for (let index = 0; index < layerNum; index++) {
        layerArr.push(sortArr.slice(Math.ceil(Math.pow(index, 2) * 10), Math.ceil(Math.pow((index + 1), 2) * 10)))
      }
      layerArr.forEach((item, index) => {
        let itemNum = item.length
        item.forEach((node, loc) => {

          locations[node.id] = {
            node: node,
            x: (200 * (index + 1) * Math.sin(2 * loc * 3.14 / itemNum)),
            y: (200 * (index + 1) * Math.cos(2 * loc * 3.14 / itemNum))
          }
        })
      })
      return locations
    }
    return doLayout(graph)
  }
}

Q.extend(transferLayout, Q.Layouter);
Q.transferLayout = transferLayout;

const galaxyLayout = function (graph) {
  this.graph = graph;
}
galaxyLayout.prototype = {
  getLayoutResult: function (params) {
    var locations = {};
    function doLayout (graph) {
      let model = graph.graphModel
      let nodeMap = new Map()

      let NodeArr = model.datas.filter(item => {
        item.layerNum && delete item.layerNum
        return item instanceof Q.Node
      })
      NodeArr.sort((a, b) => {
        return b.edgeCount - a.edgeCount
      })
      NodeArr.forEach(i => nodeMap.set(i.id, i))
      let moreArr = NodeArr.filter(n => n.edgeCount > 3)
      let lessArr = NodeArr.filter(n => n.edgeCount < 4)
      let nuqNode = new Map()
      moreArr.forEach((item, index) => {
        item.layerNum = 0
        let arr = []
        let layerArr = []
        nuqNode.set(item.id, item)
        while (Math.pow(item.layerNum, 3) * 10 < item.edgeCount) {
          item.layerNum++
        }
        forEachLinkedNode(item, (otherNode) => {
          if (!nuqNode.get(otherNode.id)) {
            arr.push(otherNode)
            nuqNode.set(otherNode.id, otherNode)
          }
        })
        for (let i = 0; i < item.layerNum; i++) {
          let begin = (i == 0) ? 0 : Math.ceil(Math.pow(i, 3) * 10) + 30
          let end = Math.ceil(Math.pow((i + 1), 3) * 10) + 30
          layerArr.push(arr.slice(begin, end))
        }
        let xr, yr
        if (index == 0) {
          locations[item.id] = {
            node: item,
            x: 0,
            y: 0
          }
          nodeMap.delete(item.id)
          xr = 0; yr = 0
        } else {
          if (index % 2 !== 0) {
            //奇数
            xr = locations[moreArr[index - 1].id].x
            yr = locations[moreArr[index - 1].id].y + (moreArr[index - 1].layerNum + item.layerNum + 1) * 150
          } else {
            //偶数
            xr = locations[moreArr[index - 2].id].x + (moreArr[index - 2].layerNum + item.layerNum + 1) * 150
            yr = locations[moreArr[index - 2].id].y
          }
          locations[item.id] = { node: item, x: xr, y: yr }
          nodeMap.delete(item.id)
        }
        layerArr.forEach((n, nodeIndex) => {
          let itemNum = n.length
          let r = nodeIndex == 0 ? 250 : ((nodeIndex + 1) * 100 + 150)
          n.forEach((node, loc) => {
            if (!node.layerNum) {
              locations[node.id] = {
                node: node,
                x: (xr + r * Math.sin(2 * loc * 3.14 / itemNum)),
                y: (yr + r * Math.cos(2 * loc * 3.14 / itemNum))
              }
              nodeMap.delete(node.id)
            }
          })
        })
      })
      let remainNode = [...nodeMap.values()]

      remainNode.forEach((item, index) => {
        locations[item.id] = {
          node: item,
          x: (-200 * Math.sin(2 * index * 3.14 / remainNode.length)),
          y: (-200 * Math.cos(2 * index * 3.14 / remainNode.length))
        }
      })
      return locations
    }
    return doLayout(graph)
  }
}

Q.extend(galaxyLayout, Q.Layouter);
Q.galaxyLayout = galaxyLayout;



const personLayout = function (graph, layout) {
  this.graph = graph;
  this.layout = layout
}
personLayout.prototype = {
  getLayoutResult: function (params) {
    var locations = {};
    function doLayout (graph) {
      let model = graph.graphModel
      let nodeMap = new Map()
      var VPNFlexEdgeUI = function (edge, graph) {
        Q.doSuperConstructor(this, VPNFlexEdgeUI, arguments);
      }
      VPNFlexEdgeUI.prototype = {
        drawEdge: function (path, fromUI, toUI, edgeType, fromBounds, toBounds) {
          var from = fromBounds.center;
          // var to = toBounds.center
          path.curveTo(from.x, from.y, 0, 0);
        }
      }
      Q.extend(VPNFlexEdgeUI, Q.EdgeUI);

      let NodeArr = model.datas.filter(item => {
        (item instanceof Q.Edge) && (item.uiClass = VPNFlexEdgeUI)
        item.layerNum && delete item.layerNum
        return item instanceof Q.Node
      })
      NodeArr.sort((a, b) => {
        return b.edgeCount - a.edgeCount
      })
      NodeArr.forEach(i => nodeMap.set(i.id, i))
      let moreArr = NodeArr.filter(n => n.edgeCount > 1)
      let lessArr = NodeArr.filter(n => n.edgeCount == 1)
      let nuqNode = new Map()
      let remainNode = [...nodeMap.values()]
      let r = moreArr.length * 43 / 2 / 3.14
      moreArr.forEach((item, index) => {
        locations[item.id] = {
          node: item,
          x: (r * Math.sin(2 * index * 3.14 / moreArr.length)),
          y: (r * Math.cos(2 * index * 3.14 / moreArr.length))
        }
      })
      let otherNodeMap = new Map()
      lessArr.forEach(node => {
        forEachLinkedNode(node, (otherNode) => {
          otherNodeMap.set(otherNode.id, otherNode)
          !otherNode.other && (otherNode.other = new Map())
          otherNode.other.set(node.id, node)
        })
      })
      let numOther = [...otherNodeMap.values()]
      var funName = function (edge, graph) {
        Q.doSuperConstructor(this, funName, arguments);
      }
      funName.prototype = {
        drawEdge: function (path, fromUI, toUI, edgeType, fromBounds, toBounds) {
          var from = fromBounds.center;
          var to = toBounds.center
          path.lineTo(from.x, from.y, to.x, to.y);
        }
      }
      Q.extend(funName, Q.EdgeUI);

      numOther.forEach(node => {
        let windNode = [...node.other.values()]
        let cL = windNode.length * 43 / 2 / 3.14
        let rx = locations[node.id].x * 1.5 + cL
        let ry = locations[node.id].y * 1.5 + cL
        windNode.forEach((item, index) => {

          item.forEachEdge((edge) => {
            // edge.edgeType = Q.Consts.EDGE_TYPE_DEFAULT;
            (edge.uiClass = funName)
          })
          locations[item.id] = {
            node: item,
            x: (rx + cL * Math.sin(2 * index * 3.14 / windNode.length)),
            y: (ry + cL * Math.cos(2 * index * 3.14 / windNode.length))
          }
        })

      })
      return locations
    }
    return doLayout(graph)
  }
}
Q.extend(personLayout, Q.Layouter);
Q.personLayout = personLayout;
var LAYOUT_TYPE_BALLOON = "环形";
var LAYOUT_TYPE_TREE = "树形";
var LAYOUT_TYPE_TREE2 = "两端";
var LAYOUT_TYPE_TREE3 = "横向";
var LAYOUT_TYPE_TREE4 = "弹性";
var LAYOUT_TYPE_TREE5 = "纵向";
var flower_Layout = "散点";
var galaxy_Layout = "星云";
var person_Layout = "人物";
var circle_layout = "圆盘"
function AutoLayouter (graph) {
  this.graph = graph;
  this._layouters = {};
}
AutoLayouter.prototype = {
  _layouters: null,
  _getLayouter: function (layoutType) {
    if (layoutType == LAYOUT_TYPE_BALLOON) {
      return new Q.BalloonLayouter(this.graph);
    }
    if (layoutType == flower_Layout) {
      return new Q.flowerLayout(this.graph);
    }
    if (layoutType == galaxy_Layout) {
      return new Q.galaxyLayout(this.graph);
    }
    if (layoutType == person_Layout) {
      return new Q.personLayout(this.graph);
    }
    if (layoutType == circle_layout) {
      return new Q.fakerTreeLayout(this.graph)
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
    var autoName = function (edge, graph) {
      Q.doSuperConstructor(this, autoName, arguments);
    }
    autoName.prototype = {
      drawEdge: function (path, fromUI, toUI, edgeType, fromBounds, toBounds) {
        var from = fromBounds.center;
        var to = toBounds.center
        path.lineTo(from.x, from.y, to.x, to.y);
      }
    }
    Q.extend(autoName, Q.EdgeUI);
    let model = graph.graphModel
    model.datas.forEach(item => {
      (item instanceof Q.Edge) && (item.uiClass = autoName)
      item.layerNum && delete item.layerNum
    })

    var layoutType = params.layoutType;
    var layouter = this._layouters[layoutType];
    if (!layouter) {
      layouter = this._layouters[layoutType] = this._getLayouter(layoutType);
    }
    layouter.radius = 150;
    layouter.doLayout(params);
  }
};
function doLayout (layoutType) {

  layouter.doLayout({
    layoutType: layoutType,
    byAnimate: true,
    callback: function () {
      graph.zoomToOverview(true);
    }
  });
}

const fakerTreeLayout = function (graph, layout) {
  this.graph = graph;
  this.layout = layout
}
fakerTreeLayout.prototype = {
  getLayoutResult: function (params) {
    var locations = {};
    function doLayout (graph) {
      let model = graph.graphModel
      let NodeArr = model.datas.filter(item => {
        item.layerNum && delete item.layerNum
        return item instanceof Q.Node
      })
      NodeArr.sort((a, b) => {
        return b.edgeCount - a.edgeCount
      })
      let root = NodeArr[0]
      let unQu = new Map()
      let arr = []
      var nodeInfo = {
        id: root.id,
        node: root,
        x: 0,
        y: 0
      }
      unQu.set(root.id, root)
      function toLayoutNode (node, nodeInfo) {
        forEachLinkedNode(node, function (otherNode) {
          if (!unQu.get(otherNode.id)) {
            if (!nodeInfo.children) {
              nodeInfo.children = [];
            }
            var otherNodeInfo = {
              id: otherNode.id,
              node: otherNode,
            }
            unQu.set(otherNode.id, otherNode)
            nodeInfo.children.push(otherNodeInfo);
          }

        })
        if (nodeInfo.children) {
          nodeInfo.children.forEach(item => {
            toLayoutNode(item.node, item)
          })
        }
      }
      toLayoutNode(root, nodeInfo)
      const fixAngle = (nodeInfo) => {
        let flip = nodeInfo.children.filter(i => i.children)
        let countAngle = Math.PI / 3
        flip.map((item, index) => {
          let cr = item.children.length * 50 / 2 / Math.PI
          cr = cr < 200 ? 200 : cr
          if ((item.origin.x > 0 && item.origin.y > 0) || item.origin.x == 0 || item.origin.y == 0) {
            item.x = item.origin.x + (item.r + cr * 2) * Math.sin(countAngle * index)
            item.y = item.origin.y + (item.r + cr * 2) * Math.cos(countAngle * index)
          }
          if (item.origin.x < 0 && item.origin.y < 0) {
            item.x = item.origin.x + (item.r + cr * 2) * Math.sin(Math.PI + countAngle * index)
            item.y = item.origin.y + (item.r + cr * 2) * Math.cos(Math.PI + countAngle * index)
          }
          if (item.origin.x < 0 && item.origin.y > 0) {
            item.x = item.origin.x + (item.r + cr * 2) * Math.sin(Math.PI * 3 / 2 + countAngle * index)
            item.y = item.origin.y + (item.r + cr * 2) * Math.cos(Math.PI * 3 / 2 + countAngle * index)
          }
          if (item.origin.x > 0 && item.origin.y < 0) {
            item.x = item.origin.x + (item.r + cr * 2) * Math.sin(Math.PI / 2 + countAngle * index)
            item.y = item.origin.y + (item.r + cr * 2) * Math.cos(Math.PI / 2 + countAngle * index)
          }
          countLayout(item)
        })
      }
      const countLayout = (nodeInfo) => {
        if (nodeInfo.id == root.id) {
          let r = nodeInfo.children.length * 50 / 2 / Math.PI
          let singleAngel = Math.PI * 2 / nodeInfo.children.length;
          r = r < 300 ? 300 : r
          let child = nodeInfo.children.filter((item) => item.children)
          let moreChild = nodeInfo.children.filter((item) => !item.children)

          child.forEach((item, index) => {
            moreChild.splice(Math.floor(moreChild.length * index / child.length), 0, item)
          })
          nodeInfo.children = moreChild
          nodeInfo.children.forEach((item, index) => {
            item.x = (r * Math.sin(singleAngel * index))
            item.y = (r * Math.cos(singleAngel * index))
            item.angle = singleAngel * index,
              item.r = r
            item.origin = {
              x: 0,
              y: 0,
            }
            if (item.children) {
              countLayout(item)
            }
          })
        } else {
          if (nodeInfo.children.length > 10) {
            let cr = nodeInfo.children.length * 50 / 2 / Math.PI
            let cSingleAngel = Math.PI * 2 / nodeInfo.children.length;
            cr = cr < 200 ? 200 : cr
            if (nodeInfo.origin.x == 0 && nodeInfo.origin.y == 0) {
              nodeInfo.x = nodeInfo.origin.x + (nodeInfo.r + cr + 150) * Math.sin(nodeInfo.angle)
              nodeInfo.y = nodeInfo.origin.y + (nodeInfo.r + cr + 150) * Math.cos(nodeInfo.angle)
            }
            nodeInfo.children.forEach((item, index) => {
              item.x = nodeInfo.x + (cr * Math.sin(cSingleAngel * index))
              item.y = nodeInfo.y + (cr * Math.cos(cSingleAngel * index))
              item.angle = cSingleAngel * index,
                item.r = cr
              item.origin = {
                x: nodeInfo.x,
                y: nodeInfo.y,
              }
            })
            fixAngle(nodeInfo)
            // if (item.children) {
            //     countLayout(item)
            // }
          } else {
            let lr = 200
            if (nodeInfo.origin.x == 0 && nodeInfo.origin.y == 0) {
              nodeInfo.x = nodeInfo.origin.x + (nodeInfo.r + 150) * Math.sin(nodeInfo.angle)
              nodeInfo.y = nodeInfo.origin.y + (nodeInfo.r + 150) * Math.cos(nodeInfo.angle)
            }
            // let lSingleAngel = Math.PI * 2 / nodeInfo.children.length;

            let arc = nodeInfo.children.length / 40
            let sAngel = 0.2;
            let startAngel = nodeInfo.angle - arc * 2
            // cr=cr<60?60:cr
            nodeInfo.children.forEach((item, index) => {
              item.x = nodeInfo.x + (lr * Math.sin(startAngel + sAngel * index))
              item.y = nodeInfo.y + (lr * Math.cos(startAngel + sAngel * index))
              item.angle = startAngel + sAngel * index,
                item.r = 200
              item.origin = {
                x: nodeInfo.x,
                y: nodeInfo.y,
              }
            })
            fixAngle(nodeInfo)
          }

        }
      }
      countLayout(nodeInfo)
      const layoutLocation = (arr) => {
        arr.forEach(item => {
          locations[item.id] = {
            node: item.node,
            x: item.x,
            y: item.y
          }
          if (item.children) {
            layoutLocation(item.children)
          }
        })

      }
      layoutLocation([nodeInfo])

      // graph.graphModel.forEachByTopoBreadthFirstSearch(function(node, from, level){
      //     // console.log(node, from, level);

      //     node.set('level', level);
      // })

      return locations
    }
    return doLayout(graph)
  }
}
Q.extend(fakerTreeLayout, Q.Layouter);
Q.fakerTreeLayout = fakerTreeLayout;






export { reLayoutAddGraph, loadMatrix, flowerLayout, transferLayout, galaxyLayout, personLayout, fakerTreeLayout, AutoLayouter }
