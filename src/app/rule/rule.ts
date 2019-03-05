import {AjaxService} from '../ajax.service';
import * as go from 'gojs';
import {Component, OnInit} from '@angular/core';

declare var $: any; //jQuery
@Component({
  selector: 'app-rule',
  templateUrl: './rule.html',
  styleUrls: ['./rule.scss']
})
export class RuleComponent implements OnInit {

  myDiagram;
  flag = 1000;
  DataArray = [
    {key: 1, svg: '卡车'},
    {key: 2, svg: '粉碎机'},
    {key: 3, svg: '机组'},
    {key: 4, svg: '加工厂'},
    {key: 5, svg: '冷却塔',},
    {key: 6, svg: '提炼塔'},
    {key: 7, svg: '烘干塔'},
    {key: 8, svg: '钻探工厂'},
    {key: 1, svg: '卡车'},
    {key: 2, svg: '粉碎机'},
    {key: 3, svg: '机组'},
    {key: 4, svg: '加工厂'},
    {key: 5, svg: '冷却塔',},
    {key: 6, svg: '提炼塔'},
    {key: 7, svg: '烘干塔'},
    {key: 8, svg: '钻探工厂'},
    {key: 1, svg: '卡车'},
    {key: 2, svg: '粉碎机'},
    {key: 3, svg: '机组'},
    {key: 4, svg: '加工厂'},
    {key: 5, svg: '冷却塔',},
    {key: 6, svg: '提炼塔'},
    {key: 7, svg: '烘干塔'},
    {key: 8, svg: '钻探工厂'},
    {key: 1, svg: '卡车'},
    {key: 2, svg: '粉碎机'},
    {key: 3, svg: '机组'},
    {key: 4, svg: '加工厂'},
    {key: 5, svg: '冷却塔',},
    {key: 6, svg: '提炼塔'},
    {key: 7, svg: '烘干塔'},
    {key: 8, svg: '钻探工厂'},
    {key: 1, svg: '卡车'},
    {key: 2, svg: '粉碎机'},
    {key: 3, svg: '机组'},
    {key: 4, svg: '加工厂'},
    {key: 5, svg: '冷却塔',},
    {key: 6, svg: '提炼塔'},
    {key: 7, svg: '烘干塔'},
    {key: 8, svg: '钻探工厂'},
    {key: 1, svg: '卡车'},
    {key: 2, svg: '粉碎机'},
    {key: 3, svg: '机组'},
    {key: 4, svg: '加工厂'},
    {key: 5, svg: '冷却塔',},
    {key: 6, svg: '提炼塔'},
    {key: 7, svg: '烘干塔'},
    {key: 8, svg: '钻探工厂'},
    {key: 1, svg: '卡车'},
    {key: 2, svg: '粉碎机'},
    {key: 3, svg: '机组'},
    {key: 4, svg: '加工厂'},
    {key: 5, svg: '冷却塔',},
    {key: 6, svg: '提炼塔'},
    {key: 7, svg: '烘干塔'},
    {key: 8, svg: '钻探工厂'},

  ];

  constructor(
    private ajax: AjaxService,
  ) {
  }

  imgUrl = this.ajax.imgUrl;
  saveUrl = this.ajax.saveUrl;
  backUrl = this.ajax.backUrl;

  // gojs() {
  //
  //
  //   var icons = {
  //     'natgas': this.natgas,
  //     'oil': this.oil,
  //     'pyrolysis': this.pyrolysis,
  //     'fractionation': this.fractionation,
  //     'gasprocessing': this.gasprocessing,
  //     'polymerization': this.polymerization,
  //     'finishedgas': this.finishedgas
  //   };
  //
  //
  //   var $ = go.GraphObject.make;
  //   var myDiagram =
  //     $(go.Diagram, 'myDiagramDiv',
  //       {
  //         maxSelectionCount: 1, // users can select only one part at a time
  //         'toolManager.hoverDelay': 10,  // how quickly tooltips are shown
  //         initialAutoScale: go.Diagram.Uniform,  // scale to show all of the contents
  //         'ChangedSelection': onSelectionChanged
  //       });
  //
  //   function infoString(obj) {
  //     var part = obj.part;
  //     if (part instanceof go.Adornment) {
  //       part = part.adornedPart;
  //     }
  //     var msg = '';
  //     if (part instanceof go.Link) {
  //       msg = '';
  //     } else if (part instanceof go.Node) {
  //       msg = part.data.text + ':\n\n' + part.data.description;
  //     }
  //     return msg;
  //   }
  //
  //   function geoFunc(geoname) {
  //     var geo = icons[geoname];
  //     if (typeof geo === 'string') {
  //       geo = icons[geoname] = go.Geometry.parse(geo, true);
  //     }
  //     return geo;
  //   }
  //
  //   myDiagram.nodeTemplate =
  //     $(go.Node, 'Spot',
  //       {
  //         locationObjectName: 'main',
  //         locationSpot: go.Spot.Center,
  //         toolTip:
  //           $('ToolTip',
  //             $(go.TextBlock, {margin: 4, width: 140},
  //               new go.Binding('text', '', infoString).ofObject())
  //           )
  //       },
  //       new go.Binding('location', 'pos', go.Point.parse).makeTwoWay(go.Point.stringify),
  //       // The main element of the Spot panel is a vertical panel housing an optional icon,
  //       // plus a rectangle that acts as the port
  //       $(go.Panel, 'Vertical',
  //         $(go.Shape, {
  //             name: 'icon',
  //             width: 1, height: 1,
  //             stroke: null, strokeWidth: 0,
  //             fill: '#41BFEC'/* blue*/
  //           },
  //           new go.Binding('fill', 'color'),
  //           new go.Binding('width', 'iconWidth'),
  //           new go.Binding('height', 'iconHeight'),
  //           new go.Binding('geometry', 'icon', geoFunc)),
  //         $(go.Shape, {
  //             name: 'main',
  //             width: 40, height: 40,
  //             margin: new go.Margin(-1, 0, 0, 0),
  //             portId: '',
  //             stroke: null, strokeWidth: 0,
  //             fill: '#41BFEC'/* blue*/
  //           },
  //           new go.Binding('fill', 'color'),
  //           new go.Binding('width', 'portWidth'),
  //           new go.Binding('height', 'portHeight'))
  //       ),
  //       $(go.TextBlock, {
  //           font: '14px Lato, sans-serif',
  //           textAlign: 'center',
  //           margin: 3,
  //           maxSize: new go.Size(100, NaN),
  //           alignment: go.Spot.TopCenter,
  //           alignmentFocus: go.Spot.BottomCenter
  //         },
  //         new go.Binding('text'))
  //     );
  //
  //
  //   function spotConverter(dir) {
  //     if (dir === 'left') {
  //       return go.Spot.LeftSide;
  //     }
  //     if (dir === 'right') {
  //       return go.Spot.RightSide;
  //     }
  //     if (dir === 'top') {
  //       return go.Spot.TopSide;
  //     }
  //     if (dir === 'bottom') {
  //       return go.Spot.BottomSide;
  //     }
  //     if (dir === 'rightsingle') {
  //       return go.Spot.Right;
  //     }
  //   }
  //
  //   myDiagram.linkTemplate =
  //     $(go.Link, {
  //         toShortLength: -2,
  //         fromShortLength: -2,
  //         layerName: 'Background',
  //         routing: go.Link.Orthogonal,
  //         corner: 15,
  //         fromSpot: go.Spot.RightSide,
  //         toSpot: go.Spot.LeftSide
  //       },
  //       // make sure links come in from the proper direction and go out appropriately
  //       new go.Binding('fromSpot', 'fromSpot', function (d) {
  //         return spotConverter(d);
  //       }),
  //       new go.Binding('toSpot', 'toSpot', function (d) {
  //         return spotConverter(d);
  //       }),
  //       new go.Binding('points').makeTwoWay(),
  //       // mark each Shape to get the link geometry with isPanelMain: true
  //       $(go.Shape, {isPanelMain: true, stroke: '#41BFEC'/* blue*/, strokeWidth: 10},
  //         new go.Binding('stroke', 'color')),
  //       $(go.Shape, {isPanelMain: true, stroke: 'white', strokeWidth: 3, name: 'PIPE', strokeDashArray: [20, 40]})
  //     );
  //
  //   myDiagram.model = go.Model.fromJson(document.getElementById('mySavedModel').value);
  //   loop();  // animate some flow through the pipes
  //
  //   var opacity = 1;
  //   var down = true;
  //
  //   function loop() {
  //     var diagram = myDiagram;
  //     setTimeout(function () {
  //       var oldskips = diagram.skipsUndoManager;
  //       diagram.skipsUndoManager = true;
  //       diagram.links.each(function (link) {
  //         var shape = link.findObject('PIPE');
  //         var off = shape.strokeDashOffset - 3;u
  //         // animate (move) the stroke dash
  //         shape.strokeDashOffset = (off <= 0) ? 60 : off;
  //         // animte (strobe) the opacity:
  //         if (down) {
  //           opacity = opacity - 0.01;
  //         } else {
  //           opacity = opacity + 0.003;
  //         }
  //         if (opacity <= 0) {
  //           down = !down;
  //           opacity = 0;
  //         }
  //         if (opacity > 1) {
  //           down = !down;
  //           opacity = 1;
  //         }
  //         shape.opacity = opacity;
  //       });
  //       diagram.skipsUndoManager = oldskips;
  //       loop();
  //     }, 60);
  //   }
  //
  //   function onSelectionChanged(e) {
  //     var node = myDiagram.selection.first();
  //     if (!(node instanceof go.Node)) {
  //       return;
  //     }
  //     var data = node.data;
  //     var image = document.getElementById('Image');
  //     var title = document.getElementById('Title');
  //     var description = document.getElementById('Description');
  //     if (data.imgsrc) {
  //       image.src = data.imgsrc;
  //       image.alt = data.caption;
  //     } else {
  //       image.src = '';
  //       image.alt = '';
  //     }
  //     title.textContent = data.text;
  //     description.textContent = data.description;
  //   }
  //
  // }

  initDiagram() {
    var self = this;//传入angular this，self改变，this也改变
    var $ = go.GraphObject.make;
    var diagram = new go.Diagram('myDiagramDiv');
    self.myDiagram = diagram;
    var DataArray = self.DataArray;

    // the node template describes how each Node should be constructed
    var imgUrl = 'http://10.24.20.7/assets/img/';
    var backUrl = 'http://10.24.20.7/assets/im/back/';

    var myPalette = $(go.Palette, 'myPaletteDiv',
      {
        'undoManager.isEnabled': true,
        // layout: $(go.GridLayout)
      });
    var myPalette2 = $(go.Palette, 'myPaletteDiv2',
      {
        'undoManager.isEnabled': true,
        // layout: $(go.GridLayout)
      });
    var myPalette3 = $(go.Palette, 'myPaletteDiv3',
      {
        'undoManager.isEnabled': true,
        layout: $(go.GridLayout)
      });
    var myPalette4 = $(go.Palette, 'myPaletteDiv4',
      {
        'undoManager.isEnabled': true,
        layout: $(go.GridLayout)
      });

    myPalette.nodeTemplate =
      $(go.Node, 'Vertical',

        $(go.Picture, {width: 53, height: 53, imageStretch: go.GraphObject.Uniform},
          new go.Binding('source', 'svg', function (svg) {
            return imgUrl + svg + '.svg';
          }),
        ),
        $(go.TextBlock,
          {margin: 2},
          new go.Binding('text', 'svg')
        ),
      );

    myPalette2.nodeTemplate = myPalette.nodeTemplate;
    myPalette3.nodeTemplate = myPalette.nodeTemplate;
    myPalette4.nodeTemplate = myPalette.nodeTemplate;


    function makePort(name, align, spot, output, input) {
      var horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom);
      // the port is basically just a transparent rectangle that stretches along the side of the node,
      // and becomes colored when the mouse passes over it
      return $(go.Shape,
        {
          fill: 'transparent',  // changed to a color in the mouseEnter event handler
          strokeWidth: 0,  // no stroke
          width: horizontal ? NaN : 8,  // if not stretching horizontally, just 8 wide
          height: !horizontal ? NaN : 8,  // if not stretching vertically, just 8 tall
          alignment: align,  // align the port on the main Shape
          stretch: (horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical),
          portId: name,  // declare this object to be a "port"
          fromSpot: spot,  // declare where links may connect at this port
          fromLinkable: output,  // declare whether the user may draw links from here
          toSpot: spot,  // declare where links may connect at this port
          toLinkable: input,  // declare whether the user may draw links to here
          cursor: 'pointer',  // show a different cursor to indicate potential link point
          mouseEnter: function (e, port) {  // the PORT argument will be this Shape
            if (!e.diagram.isReadOnly) {
              port.fill = 'rgba(0,255,0,0.5)';
            }
          },
          mouseLeave: function (e, port) {
            port.fill = 'transparent';
          }
        });
    };

    diagram.groupTemplate = myPalette.groupTemplate;

    //计算最接近的四角，弹出菜单时避免超边界
    function getPos(w, h) {
      var backH = document.getElementById('myDiagramDiv').offsetHeight;//去px绝对数值
      var backW = document.getElementById('myDiagramDiv').offsetWidth;//去px绝对数值
      console.log(w, backW, h, backH);
      if (h < backH / 2) {
        if (w <= backW / 2) {
          return 1;//左上角
        } else if (w > backW / 2) {
          return 2;//右上角
        }
      }
      if (h > backH / 2) {
        if (w >= backW / 2) {
          return 3;//右下角
        } else if (w < backW / 2) {
          return 4;//左下角
        }
      }
    }

    function showToolTip(obj, diagram, tool) {
      var toolTipDIV = document.getElementById('toolTipDIV');
      var pt = diagram.lastInput.viewPoint;
      var topHeight = document.getElementById('topbar').offsetHeight;//顶部的bar高度缩放变化，去px绝对数值
      var left = pt.x + 540;
      var top = pt.y + 10 + topHeight;
      var r = getPos(pt.x, pt.y);
      switch (r) {
        case 1:
          break;
        case 2:
          left -= 300;
          break;
        case 3:
          left -= 300;
          top -= 300;
          break;
        case 4:
          top -= 300;
          break;
        default:
          break;
      }
      toolTipDIV.style.left = left + 'px'; //左边菜单和图源列表固定宽度大概530px，缩放不变
      toolTipDIV.style.top = top + 'px';

      document.getElementById('toolTipParagraph').textContent = 'Tooltip for: ' + r;
      toolTipDIV.style.display = 'block';
    }

    function hideToolTip(diagram, tool) {
      var toolTipDIV = document.getElementById('toolTipDIV');
      toolTipDIV.style.display = 'none';
    }

    var myToolTip = $(go.HTMLInfo, {
      show: showToolTip,
      hide: hideToolTip,
      // since hideToolTip is very simple,
      // we could have set mainElement instead of setting hide:
      // mainElement: document.getElementById('toolTipDIV')

    });

    var cxElement = document.getElementById('contextMenu');
    // Since we have only one main element, we don't have to declare a hide method,
    // we can set mainElement and GoJS will hide it automatically


    function showContextMenu(obj, diagram, tool) {
      // Show only the relevant buttons given the current state.
      var cmd = diagram.commandHandler;
      document.getElementById('cut').style.display = cmd.canCutSelection() ? 'block' : 'none';
      document.getElementById('copy').style.display = cmd.canCopySelection() ? 'block' : 'none';
      document.getElementById('paste').style.display = cmd.canPasteSelection() ? 'block' : 'none';
      document.getElementById('delete').style.display = cmd.canDeleteSelection() ? 'block' : 'none';
      document.getElementById('color').style.display = (obj !== null ? 'block' : 'none');
      // Now show the whole context menu element
      cxElement.style.display = 'block';
      // we don't bother overriding positionContextMenu, we just do it here:
      var pt = diagram.lastInput.viewPoint;
      var topHeight = document.getElementById('topbar').offsetHeight;//顶部的bar高度缩放变化，去px绝对数值
      var left = pt.x + 540;
      var top = pt.y + 10 + topHeight;
      var r = getPos(pt.x, pt.y);//计算四角中最接近的，以此调整位置
      switch (r) {
        case 1:
          break;
        case 2:
          left -= 150;
          break;
        case 3:
          left -= 150;
          top -= 150;
          break;
        case 4:
          top -= 150;
          break;
        default:
          break;
      }
      cxElement.style.left = left + 'px'; //左边菜单和图源列表固定宽度大概530px，缩放不变
      cxElement.style.top = top + 'px';

    }

    function cxcommand(event, val) {
      if (val === undefined) {
        val = event.currentTarget.id;
      }
      switch (val) {
        case 'cut':
          diagram.commandHandler.cutSelection();
          break;
        case 'copy':
          diagram.commandHandler.copySelection();
          break;
        case 'paste':
          diagram.commandHandler.pasteSelection(diagram.lastInput.documentPoint);
          break;
        case 'delete':
          diagram.commandHandler.deleteSelection();
          break;
        case 'color': {
        }
      }
      diagram.currentTool.stopTool();
    }

    function f(event) {
      diagram.add(
        $(go.Part,  // this Part is not bound to any model data
          {
            layerName: 'Background', position: new go.Point(0, 0),
            selectable: false, pickable: false
          },
          $(go.Picture, this.backsrc)  //ws中ts语法可能报转义错误，编译能过就可以，启用js下可无视报错
        ));
    }


    var myContextMenu = $(go.HTMLInfo, {
      show: showContextMenu,
      mainElement: cxElement
    });

    diagram.nodeTemplate =
      $(go.Node, 'Auto',
        {
          locationSpot: go.Spot.Center,  // the location is the center of the Shape
          locationObjectName: 'PICTURE',
          selectionAdorned: false,  // no selection handle when selected
          resizable: true, resizeObjectName: 'PICTURE',  // user can resize the Shape
          rotatable: true, rotateObjectName: 'PICTURE',  // rotate the Shape without rotating the label
          // don't re-layout when node changes size
          layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized
        },
        // $(go.Shape, "RoundedRectangle", // use this kind of figure for the Shape
        //     // bind Shape.fill to Node.data.color
        // ),
        {contextMenu: myContextMenu},
        $(go.Picture,
          {
            name: 'PICTURE',  // named so that the above properties can refer to this GraphObject
            width: 80, height: 80, imageStretch: go.GraphObject.Uniform
          },
          new go.Binding('source', 'svg', function (svg) {
            return imgUrl + svg + '.svg';
          }),
        ),
        makePort('T', go.Spot.Top, go.Spot.Top, true, true),
        makePort('L', go.Spot.Left, go.Spot.Left, true, true),
        makePort('R', go.Spot.Right, go.Spot.Right, true, true),
        makePort('B', go.Spot.Bottom, go.Spot.Bottom, true, true)
        ,
        {
          toolTip: myToolTip
        },
      );


    diagram.linkTemplate =
      $(go.Link, {
          toShortLength: -2,
          fromShortLength: -2,
          layerName: 'Background',
          routing: go.Link.Orthogonal,
          corner: 15,
          fromSpot: go.Spot.RightSide,
          toSpot: go.Spot.LeftSide
        },
        // make sure links come in from the proper direction and go out appropriately
        new go.Binding('fromSpot', 'fromSpot', function (d) {
          return spotConverter(d);
        }),
        new go.Binding('toSpot', 'toSpot', function (d) {
          return spotConverter(d);
        }),
        new go.Binding('points').makeTwoWay(),
        // mark each Shape to get the link geometry with isPanelMain: true
        $(go.Shape, {isPanelMain: true, stroke: '#41BFEC', strokeWidth: 10},
          new go.Binding('stroke', 'color')),
        $(go.Shape, {isPanelMain: true, stroke: 'white', strokeWidth: 3, name: 'PIPE', strokeDashArray: [20, 40]})
      );

    function spotConverter(dir) {
      if (dir === 'left') {
        return go.Spot.LeftSide;
      }
      if (dir === 'right') {
        return go.Spot.RightSide;
      }
      if (dir === 'top') {
        return go.Spot.TopSide;
      }
      if (dir === 'bottom') {
        return go.Spot.BottomSide;
      }
      if (dir === 'rightsingle') {
        return go.Spot.Right;
      }
    }


    myPalette.model = new go.GraphLinksModel(DataArray, []);
    myPalette2.model = new go.GraphLinksModel(DataArray, []);
    myPalette3.model = new go.GraphLinksModel(DataArray, []);
    myPalette4.model = new go.GraphLinksModel(DataArray, []);

    function connect() {
      diagram.model.nodeDataArray[0]['device'] = self.flag;
    }

  }

  click() {
    // console.log(this.flag);
    // console.log(this.myDiagram.model.nodeDataArray);
    // this.myDiagram.model.nodeDataArray[0]['device'] = 'deviceid';
    // // this.myDiagram.model=new go.GraphLinksModel(this.myDiagram.model.nodeDataArray,[]);
    // console.log(this.myDiagram.model.nodeDataArray);

  }

  showValue() {
    let v = this.myDiagram.model.toJson();
    console.log(typeof (v));
    console.log(v);
    console.log(this.myDiagram.nodeTemplateMap);
  }

  ngOnInit() {
    this.initDiagram();
    $('.ant-collapse-content-box').css('padding', '0');//去折叠面板padding，默认16px
  }
}
