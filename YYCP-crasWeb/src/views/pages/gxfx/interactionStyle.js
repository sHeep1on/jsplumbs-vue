export default class interStyle {
    constructor (graph, that) {
        (this.graph = graph), (this.VNode = that), (this.isAnalysis = true);
    }
    selectionChangeListener (callback) {
        this.graph.selectionChangeDispatcher.addListener(evt => {
            var data = evt.data;
            if (!data) {
                return;
            }
            callback && callback(data);
            if (Q.isArray(data)) {
                for (var i = 0, l = data.length; i < l; i++) {
                    this.setSelectionStyle(data[i]);
                }
            } else {
                this.setSelectionStyle(data);
            }
        });
    }
    setIsAnalysis (bool) {
        this.isAnalysis = bool;
    }
    setSelectionStyle (element) {
        if (!(element instanceof Q.Node || Q.Edge)) {
            return;
        }
        if (element.styles.alpha === 0.1 || element.styles.alpha == 0) {
            var selectionModel = this.graph.graphModel.selectionModel;
            selectionModel.unselect(element);
            return;
        }
        var selected = graph.isSelected(element);

        if (selected) {
            this.selectCommonStyle(element);
            // if (element instanceof Q.Node) {
            //   element.forEachEdge((edge) => {
            //     if (!graph.isSelected(edge)) {
            //       this.selectCommonStyle(edge,'rgba(73,194,255,0.3)')
            //       var to = edge.otherNode(element)
            //       if (!graph.isSelected(to)) {
            //         this.selectCommonStyle(to,'rgba(73,194,255,0.3)')
            //       }
            //     }
            //   })
            // }
            // if (element instanceof Q.Edge) {
            //   !graph.isSelected(element.to) && this.selectCommonStyle(element.to,'rgba(73,194,255,0.3)')
            //   !graph.isSelected(element.from) && this.selectCommonStyle(element.from,'rgba(73,194,255,0.3)')
            // }
        }
        if (!selected) {
            this.unselectCommonStyle(element);
            if (element.colornew) {
                this.unselectCommonStyle(element, element.colornew);
            }
            // if (element instanceof Q.Node) {
            //   element.forEachEdge((edge) => {
            //     if (!graph.isSelected(edge)) {
            //       this.unselectCommonStyle(edge)
            //       if (edge.colornew) {
            //         this.unselectCommonStyle(edge, edge.colornew)
            //       }
            //       var to = edge.otherNode(element)
            //       if (!graph.isSelected(to)) {
            //         this.unselectCommonStyle(to)
            //         if (to.colornew) {
            //           this.unselectCommonStyle(to, to.colornew)
            //         }
            //       }
            //     }
            //   })
            // }
            // if (element instanceof Q.Edge) {
            //   if (!graph.isSelected(element.to)) {
            //     this.unselectCommonStyle(element)
            //     if (element.colornew) {
            //       this.unselectCommonStyle(element, element.colornew)
            //     }
            //   }
            //   if (!graph.isSelected(element.from)) {
            //     this.unselectCommonStyle(element)
            //     if (element.colornew) {
            //       this.unselectCommonStyle(element, element.colornew)
            //     }
            //   }
            // }
        }
    }
    selectCommonStyle (element, linkColor) {
        element.setStyle(Q.Styles.SELECTION_COLOR, 'transparent');
        if (!this.isAnalysis) {
            return;
        }
        element.setStyle(Q.Styles.IMAGE_BORDER_STYLE, linkColor || '#51A4FC');
        element.setStyle(Q.Styles.EDGE_COLOR, linkColor || '#51A4FC');
        element.setStyle(Q.Styles.LABEL_COLOR, linkColor || '#51A4FC'); // 文字的颜色
        if (element instanceof Q.Node) {
            element.zIndex = 16;
            // element.setStyle(Q.Styles.LABEL_COLOR, 'rgba(224,224,224,0)');
            element.bindingUIs.datas[0].ui.strokeStyle = linkColor || '#51A4FC';
            element.bindingUIs.datas[0].ui.$lineWidth = linkColor ? 2 : 5;
            // if (element.layerNum) {
            //   element.size = { width: 70, height: 70 };
            //   this.VNode.reSetImg2(element.oldImage, 140,(linkColor||"#51A4FC")).then(res => {
            //     element.image = res
            //   })
            //   element.bindingUIs.datas[0].ui.strokeStyle = linkColor||"#51A4FC"
            // }
        }
        if (element instanceof Q.Edge && element.getStyle(Q.Styles.ARROW_TO)) {
            element.setStyle(
                Q.Styles.ARROW_TO_FILL_COLOR,
                linkColor || '#51A4FC'
            );
            element.setStyle(Q.Styles.ARROW_TO_OUTLINE, 0);
        }
        if (element instanceof Q.Edge) {
            element.setStyle(Q.Styles.EDGE_WIDTH, linkColor ? 2 : 1); // 文
        }
        if (element instanceof Q.Edge && element.newWidth) {
            element.setStyle(Q.Styles.EDGE_WIDTH, element.newWidth); // 文
        }
    }
    unselectCommonStyle (element, newColor) {
        element.setStyle(Q.Styles.SELECTION_COLOR, newColor || 'transparent');
        if (!this.isAnalysis) {
            return;
        }
        element.setStyle(Q.Styles.IMAGE_BORDER_STYLE, newColor || '#ccc');
        element.setStyle(Q.Styles.EDGE_COLOR, newColor || '#ccc');
        element.setStyle(Q.Styles.LABEL_COLOR, newColor || 'gray'); // 文字的颜色
        element.setStyle(Q.Styles.ARROW_TO_FILL_COLOR, newColor || '#ccc');
        element.setStyle(Q.Styles.EDGE_WIDTH, 1);
        if (element instanceof Q.Node) {
            element.zIndex = 16;
            // element.setStyle(Q.Styles.LABEL_COLOR, 'rgba(224,224,224,0)')
            element.bindingUIs.datas[0].ui.strokeStyle = newColor || '#ccc';
            element.bindingUIs.datas[0].ui.$lineWidth = 1;
            // if (element.layerNum) {
            //   element.size = { width: 40, height: 40 };
            //   this.VNode.reSetImg2(element.oldImage).then(res => {
            //     element.image = res
            //   })
            // }
        }
        if (element instanceof Q.Edge && element.newWidth) {
            element.setStyle(Q.Styles.EDGE_WIDTH, element.newWidth);
        }
        if (element instanceof Q.Edge && element.getStyle(Q.Styles.ARROW_TO)) {
            this.unselectArrow(element, newColor);
        }
    }
    unselectArrow (element, newColor) {
        element.setStyle(Q.Styles.ARROW_TO, false);
        element.setStyle(Q.Styles.ARROW_TO, true);
        element.setStyle(Q.Styles.ARROW_TO_FILL_COLOR, newColor || '#ccc');
        element.setStyle(Q.Styles.ARROW_TO_OUTLINE, null);
    }
}
