import {AjaxService} from '../ajax.service';
import * as go from 'gojs';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient, HttpHeaders, HttpRequest, HttpResponse} from '@angular/common/http';
import {NzMessageService, UploadFile} from 'ng-zorro-antd';
import {UUID} from 'angular2-uuid';
import {filter} from 'rxjs/operators';
import * as echarts from 'node_modules/echarts/echarts.simple';

declare var $: any; //jQuery
declare var BMap: any;

@Component({
  selector: 'app-rule',
  templateUrl: './rule.html',
  styleUrls: ['./rule.scss']
})
export class RuleComponent implements OnInit {

  @Input() currWork;
  @Output() result: EventEmitter<any> = new EventEmitter();
  @Output() deleteOne: EventEmitter<any> = new EventEmitter();

  cusMenu = [
    {
      divid: 'cus0',
      dispaly: false,
      name: '自定义分组1',
      svg: []
    }, {
      divid: 'cus1',
      dispaly: false,
      name: '自定义分组2',
      svg: []
    }, {
      divid: 'cus2',
      dispaly: false,
      name: '自定义分组3',
      svg: []
    }, {
      divid: 'cus3',
      dispaly: false,
      name: '自定义分组4',
      svg: []
    }, {
      divid: 'cus4',
      dispaly: false,
      name: '自定义分组5',
      svg: []
    }, {
      divid: 'cus5',
      dispaly: false,
      name: '自定义分组6',
      svg: []
    }, {
      divid: 'cus6',
      dispaly: false,
      name: '自定义分组7',
      svg: []
    }, {
      divid: 'cus7',
      dispaly: false,
      name: '自定义分组8',
      svg: []
    }, {
      divid: 'cus8',
      dispaly: false,
      name: '自定义分组9',
      svg: []
    }, {
      divid: 'cus9',
      dispaly: false,
      name: '自定义分组10',
      svg: []
    },
  ]; //自定义分录默认名称
  cusUpload = {
    divid: 'cus0',
    display: true,
    name: '新建分组1',
    svg: []
  };
  cusAva = [];

  diagram;
  flag = 1000;
  DataArray = [
    {svg: '卡车', deviceid: '', status: ''},
    {svg: '粉碎机', deviceid: '', status: ''},
    {svg: '机组', deviceid: '', status: '0'},
    {svg: '加工厂', deviceid: '', status: '0'},
    {svg: '冷却塔', deviceid: '', status: '0'},
    {svg: '提炼塔', deviceid: '', status: '1'},
    {svg: '烘干塔', deviceid: '', status: '1'},
    {svg: '钻探工厂', deviceid: '', status: '1'}
  ];
  cusData;
  builtIn = [
    {svg: 'Rectangle', category: 'shape'},
    {svg: 'RoundedRectangle', category: 'shape'},
    {svg: 'Ellipse', category: 'shape'},
    {svg: 'TriangleUp', category: 'shape'},
    {svg: 'Diamond', category: 'shape'},
    {svg: 'LineH', category: 'shape'},
    {svg: 'LineV', category: 'shape'},
    {svg: 'PlusLine', category: 'shape'},
  ];
  optMap = false;
  timeOutId = 0;

  opacity = 1;
  down = true;

  mapIcon = 'icon-setting';

  private defaultDevice = {
    'created': 0,
    'modified': 0,
    'origin': 0,
    'description': null,
    'id': null,
    'name': null,
    'adminState': 'UNLOCKED',
    'operatingState': 'ENABLED',
    'addressable': {
      'created': 0,
      'modified': 0,
      'origin': 0,
      'id': null,
      'name': null,
      'protocol': 'OTHER',
      'method': null,
      'address': null,
      'port': 0,
      'path': null,
      'publisher': null,
      'user': null,
      'password': null,
      'topic': null,
      'baseURL': null,
      'url': null
    },
    'lastConnected': 0,
    'lastReported': 0,
    'labels': [],
    'location': null,
    'service': {
      'created': 0,
      'modified': 0,
      'origin': 0,
      'description': null,
      'id': null,
      'name': null,
      'lastConnected': 0,
      'lastReported': 0,
      'operatingState': 'ENABLED',
      'labels': [],
      'addressable': {
        'created': 0,
        'modified': 0,
        'origin': 0,
        'id': null,
        'name': null,
        'protocol': 'HTTP',
        'method': 'POST',
        'address': null,
        'port': 0,
        'path': null,
        'publisher': null,
        'user': null,
        'password': null,
        'topic': null,
        'baseURL': null,
        'url': null
      },
      'adminState': 'UNLOCKED'
    },
    'profile': {
      'created': 0,
      'modified': 0,
      'origin': 0,
      'description': null,
      'id': null,
      'name': null,
      'manufacturer': null,
      'model': null,
      'labels': [],
      'objects': null,
      'deviceResources': [],
      'resources': [],
      'commands': []
    }
  };//默认的空设备，防止html绑定不到字段报错

  dataDevice = {};//存放选中图标的deviceid对应的device
  currDevice = {};//选中图标的nodedata

  tempDeviceId = '';
  devices;
  zoom = 0;

  constructor(
    private ajax: AjaxService,
    private http: HttpClient,
    private message: NzMessageService,
  ) {
  }

  visible = false;//主布局右键菜单显示
  addSvgShow = false;//新增图源对话框
  modiShow = false;//修改图源对话框
  saveWork = false;//保存布局对话框显示

  workName = '';
  newGroup;

  imgUrl = this.ajax.imgUrl;
  workUrl = this.ajax.workUrl;
  uploadUrl = this.ajax.uploadUrl;
  cusUrl = this.ajax.cusUrl;
  updateCus = this.ajax.updateCus;
  findNameUrl = this.ajax.findName;

  uploading = false;
  fileList: UploadFile[] = [];

  initDiagram() {
    var self = this;
    var $ = go.GraphObject.make;
    var DataArray = self.DataArray;  //new一个防止双向绑定更改DataArray后图源列表改变
    var imgUrl = this.imgUrl + '/';

    function showLinkLabel(e) {
      var label = e.subject.findObject('LABEL');
      if (label !== null) {
        label.visible = (e.subject.fromNode.data.category === 'Conditional');
      }
    }

    self.diagram = $(go.Diagram, 'myDiagramDiv',  // must name or refer to the DIV HTML element
      {
        'LinkDrawn': showLinkLabel,  // this DiagramEvent listener is defined below
        'LinkRelinked': showLinkLabel,
        'undoManager.isEnabled': true  // enable undo & redo
      });
    var myPalette = $(go.Palette, 'myPaletteDiv',
      {
        'undoManager.isEnabled': true,
        layout: $(go.GridLayout),
      });
    var myPalette1 = $(go.Palette, 'myPaletteDiv1',
      {
        'undoManager.isEnabled': true,
        layout: $(go.GridLayout),
      });
    var myPalette2 = $(go.Palette, 'myPaletteDiv2',
      {
        'undoManager.isEnabled': true,
        layout: $(go.GridLayout)
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
    var myContextMenu = $(go.HTMLInfo, {
      show: showContextMenu,
      mainElement: cxElement
    });

    self.diagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
    self.diagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;

    function showToolTip(obj, diagram, tool) {
      var toolTipDIV = document.getElementById('toolTipDIV');
      var pt = diagram.lastInput.viewPoint;
      var topHeight = document.getElementById('topbar').offsetHeight;//顶部的bar高度缩放变化，去px绝对数值
      self.currDevice = obj.data;
      self.matchDevice();
      console.log(self.currDevice);
      var fromLeft = document.getElementById('leftbar').offsetWidth;
      var left = pt.x + fromLeft + 10;//左侧菜单宽度  左侧图源栏款 10点向右偏移，在鼠标点击位置右侧
      var top = pt.y + 10 + topHeight;
      var r = self.getPos(pt.x, pt.y);
      switch (r) {
        case 1:
          break;
        case 2:
          left -= 240;
          break;
        case 3:
          left -= 240;
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
      toolTipDIV.style.display = 'block';
    }

    function hideToolTip(diagram, tool) {
      var toolTipDIV = document.getElementById('toolTipDIV');
      toolTipDIV.style.display = 'none';
    }

    function showContextMenu(obj, diagram, tool) {
      console.log(obj, diagram, tool);
      // Show only the relevant buttons given the current state.
      var cmd = diagram.commandHandler;
      // Now show the whole context menu element
      cxElement.style.display = 'block';
      // we don't bother overriding positionContextMenu, we just do it here:
      self.currDevice = obj.data;
      self.matchDevice();
      console.log(self.currDevice);
      var pt = diagram.lastInput.viewPoint;
      var topHeight = document.getElementById('topbar').offsetHeight;//顶部的bar高度缩放变化，去px绝对数值
      var fromLeft = document.getElementById('leftbar').offsetWidth;
      console.log(topHeight);
      var left = pt.x + fromLeft + 10; //左侧菜单宽度  左侧图源栏款 10点向右偏移，在鼠标点击位置右侧
      var top = pt.y + 10 + topHeight;
      var r = self.getPos(pt.x, pt.y);//计算四角中最接近的，以此调整位置
      console.log(r);
      switch (r) {
        case 1:
          break;
        case 2:
          left -= 100;
          break;
        case 3:
          left -= 100;
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

    function nodeStyle() {
      return [
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        {
          locationSpot: go.Spot.Center
        }
      ];
    }

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
              port.fill = 'rgba(255,0,255,0.5)';
            }
          },
          mouseLeave: function (e, port) {
            port.fill = 'transparent';
          }
        });
    }

    //工具栏图形
    myPalette.nodeTemplateMap.add('shape',  // the default category
      $(go.Node, 'Table',
        nodeStyle(),
        {
          locationSpot: go.Spot.Center,  // the location is the center of the Shape
          locationObjectName: 'SHAPE',
          selectionAdorned: false,  // no selection handle when selected
          resizable: true, resizeObjectName: 'SHAPE',  // user can resize the Shape
          rotatable: true, rotateObjectName: 'SHAPE',  // rotate the Shape without rotating the label
          // don't re-layout when node changes size
          layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
        },
        $(go.Shape,
          {
            name: 'SHAPE',
            strokeWidth: 1,
            stroke: 'black',
            fill: 'transparent',
            width: 20,
            height: 20
          },
          new go.Binding('figure', 'svg')),
      ));

    myPalette1.nodeTemplateMap.add('',  // the default category
      $(go.Node, 'Table',
        $(go.Panel, 'Vertical',
          $(go.Picture, {width: 53, height: 53, imageStretch: go.GraphObject.Uniform},
            new go.Binding('source', 'svg', function (svg) {
              return imgUrl + svg + '.svg';
            }),
          ),
          $(go.TextBlock,
            {margin: 2},
            new go.Binding('text', 'svg')
          )),
        // four named ports, one on each side:
      ));

    myPalette2.nodeTemplateMap = myPalette1.nodeTemplateMap;
    myPalette3.nodeTemplateMap = myPalette1.nodeTemplateMap;
    myPalette4.nodeTemplateMap = myPalette1.nodeTemplateMap;


    self.diagram.nodeTemplateMap.add('picture',  // the default category
      $(go.Node, 'Auto',
        nodeStyle(),
        {
          locationSpot: go.Spot.Center,  // the location is the center of the Shape
          locationObjectName: 'PIC',
          selectionAdorned: false,  // no selection handle when selected
          resizable: true, resizeObjectName: 'PIC',  // user can resize the Shape
          rotatable: true, rotateObjectName: 'PIC',  // rotate the Shape without rotating the label
          layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
        },
        $(go.Picture,
          {name: 'PIC', width: 80, height: 80, imageStretch: go.GraphObject.UniformToFill},
          new go.Binding('source', 'src'),
        ),
        // Shape.fill is bound to Node.data.color
        // four named ports, one on each side:
        makePort('top', go.Spot.Top, go.Spot.Top, true, true),
        makePort('left', go.Spot.Left, go.Spot.Left, true, true),
        makePort('right', go.Spot.Right, go.Spot.Right, true, true),
        makePort('bottom', go.Spot.Bottom, go.Spot.Bottom, true, true),
        {toolTip: myToolTip},
        {contextMenu: myContextMenu}
      ));

    self.diagram.nodeTemplateMap.add('Comment',
      $(go.Node, 'Auto', nodeStyle(),
        $(go.Shape, 'Rectangle',
          {fill: '#DEE0A3', strokeWidth: 0}),
        $(go.TextBlock,
          {
            margin: 5,
            maxSize: new go.Size(200, NaN),
            wrap: go.TextBlock.WrapFit,
            textAlign: 'center',
            editable: true,
            font: 'bold 12pt Helvetica, Arial, sans-serif',
            stroke: '#454545'
          },
          new go.Binding('text').makeTwoWay()),
      ));

    self.diagram.nodeTemplateMap.add('shape',  // the default category
      $(go.Node, 'Auto',
        nodeStyle(),
        {
          locationSpot: go.Spot.Center,  // the location is the center of the Shape
          locationObjectName: 'SHAPE',
          selectionAdorned: false,  // no selection handle when selected
          resizable: true, resizeObjectName: 'SHAPE',  // user can resize the Shape
          rotatable: true, rotateObjectName: 'SHAPE',  // rotate the Shape without rotating the label
          // don't re-layout when node changes size
          layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
        },
        $(go.Shape,
          {
            name: 'SHAPE',
            strokeWidth: 2,
            stroke: 'black',
            fill: 'transparent',
            width: 80,
            height: 80
          },
          new go.Binding('figure', 'svg')),
        // Shape.fill is bound to Node.data.color
        // four named ports, one on each side:
        makePort('T', go.Spot.Top, go.Spot.TopSide, true, true),
        makePort('L', go.Spot.Left, go.Spot.LeftSide, true, true),
        makePort('R', go.Spot.Right, go.Spot.RightSide, true, true),
        makePort('B', go.Spot.Bottom, go.Spot.BottomSide, true, true),
        {toolTip: myToolTip},
        {contextMenu: myContextMenu}
      ));

    self.diagram.nodeTemplateMap.add('',
      $(go.Node, 'Auto',
        nodeStyle(),
        {
          locationSpot: go.Spot.Center,  // the location is the center of the Shape
          locationObjectName: 'PICTURE',
          selectionAdorned: false,  // no selection handle when selected
          resizable: true, resizeObjectName: 'PICTURE',  // user can resize the Shape
          rotatable: true, rotateObjectName: 'PICTURE',  // rotate the Shape without rotating the label
          // don't re-layout when node changes size
          layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
        },
        $(go.Picture,
          {
            name: 'PICTURE',  // named so that the above properties can refer to this GraphObject
            width: 80, height: 80, imageStretch: go.GraphObject.Uniform
          },
          new go.Binding('source', 'svg', function (svg) {
            return imgUrl + svg + '.svg';
          }).makeTwoWay(),
        ),
        $(go.Shape, 'Circle',
          {
            alignment: go.Spot.TopRight, alignmentFocus: go.Spot.TopRight,
            width: 20, height: 20, strokeWidth: 0
          },
          new go.Binding('fill', 'status', function (s) {
            var color = '#9d9d9d';
            if (s == '1') {
              color = '#00cc00';
            } else if (s == '0') {
              color = '#ee0000';
            }
            return color;
          })
        ),
        makePort('T', go.Spot.Top, go.Spot.TopSide, true, true),
        makePort('L', go.Spot.Left, go.Spot.LeftSide, true, true),
        makePort('R', go.Spot.Right, go.Spot.RightSide, true, true),
        makePort('B', go.Spot.Bottom, go.Spot.BottomSide, true, true),
        {toolTip: myToolTip},
        {contextMenu: myContextMenu}
      )
    );

    // self.diagram.nodeTemplateMap.add("",  // the default category
    //   $(go.Node, "Table", nodeStyle(),
    //     // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
    //     $(go.Panel, "Auto",
    //       $(go.Shape, "Rectangle",
    //         { fill: "#00A9C9", strokeWidth: 0 },
    //         ),
    //       $(go.TextBlock,
    //         {
    //           margin: 8,
    //           maxSize: new go.Size(160, NaN),
    //           wrap: go.TextBlock.WrapFit,
    //           editable: true
    //         },
    //         new go.Binding("svg").makeTwoWay())
    //     ),
    //     // four named ports, one on each side:
    //
    //   ));

    self.diagram.toolManager.hoverDelay = 300;  // 300 milliseconds

    function spotConverter(dir) {
      if (dir === 'L') {
        return go.Spot.LeftSide;
      }
      if (dir === 'R') {
        return go.Spot.RightSide;
      }
      if (dir === 'T') {
        return go.Spot.TopSide;
      }
      if (dir === 'B') {
        return go.Spot.BottomSide;
      }
    }

    // self.diagram.linkTemplate =
    //   $(go.Link,  // the whole link panel
    //     {
    //       routing: go.Link.AvoidsNodes,
    //       curve: go.Link.JumpOver,
    //       corner: 5, toShortLength: 4,
    //       relinkableFrom: true,
    //       relinkableTo: true,
    //       reshapable: true,
    //       resegmentable: true,
    //       // mouse-overs subtly highlight links:
    //       mouseEnter: function (e, link) {
    //         link.findObject('HIGHLIGHT').stroke = 'rgba(30,144,255,0.2)';
    //       },
    //       mouseLeave: function (e, link) {
    //         link.findObject('HIGHLIGHT').stroke = 'transparent';
    //       },
    //       selectionAdorned: false
    //     },
    //     new go.Binding('points').makeTwoWay(),
    //     $(go.Shape,  // the highlight shape, normally transparent
    //       {isPanelMain: true, strokeWidth: 8, stroke: 'transparent', name: 'HIGHLIGHT'}),
    //     $(go.Shape,  // the link path shape
    //       {isPanelMain: true, stroke: 'gray', strokeWidth: 2},
    //       new go.Binding('stroke', 'isSelected', function (sel) {
    //         return sel ? 'dodgerblue' : 'gray';
    //       }).ofObject()),
    //     $(go.Shape,  // the arrowhead
    //       {toArrow: 'standard', strokeWidth: 0, fill: 'gray'}),
    //     $(go.Panel, 'Auto',  // the link label, normally not visible
    //       {visible: false, name: 'LABEL', segmentIndex: 2, segmentFraction: 0.5},
    //       new go.Binding('visible', 'visible').makeTwoWay(),
    //       $(go.Shape, 'RoundedRectangle',  // the label shape
    //         {fill: '#F8F8F8', strokeWidth: 0}),
    //       $(go.TextBlock, 'Yes',  // the label
    //         {
    //           textAlign: 'center',
    //           font: '10pt helvetica, arial, sans-serif',
    //           stroke: '#333333',
    //           editable: true
    //         },
    //         new go.Binding('text').makeTwoWay())
    //     )
    //   );

    self.diagram.linkTemplate =
      $(go.Link, {
          toShortLength: -2,
          fromShortLength: -2,
          layerName: 'Background',
          routing: go.Link.Orthogonal, //直角
          corner: 15,
        },
        // make sure links come in from the proper direction and go out appropriately
        new go.Binding('fromSpot', 'fromSpot', function (d) {
          return spotConverter(d);
        }).makeTwoWay(),
        new go.Binding('toSpot', 'toSpot', function (d) {
          return spotConverter(d);
        }).makeTwoWay(),
        // new go.Binding("points").makeTwoWay(),
        // mark each Shape to get the link geometry with isPanelMain: true
        $(go.Shape, {isPanelMain: true, stroke: '#41BFEC'/* blue*/, strokeWidth: 10},
          new go.Binding('stroke', 'color')),
        $(go.Shape, {isPanelMain: true, stroke: 'white', strokeWidth: 3, name: 'PIPE', strokeDashArray: [20, 40]})
      );

    // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
    self.diagram.model.linkFromPortIdProperty = 'fromPort';
    self.diagram.model.linkToPortIdProperty = 'toPort';


    self.diagram.model.linkFromPortIdProperty = 'fromPort';
    self.diagram.model.linkToPortIdProperty = 'toPort';
    self.diagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
    self.diagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;

    myPalette.model = new go.GraphLinksModel(self.builtIn);
    myPalette1.model = new go.GraphLinksModel(DataArray);
    myPalette2.model = new go.GraphLinksModel(DataArray);
    myPalette3.model = new go.GraphLinksModel(DataArray);
    myPalette4.model = new go.GraphLinksModel(DataArray);
  }

  click(val) {
    switch (val) {
      case 'addDevice':
        this.visible = true;
        console.log(this.currDevice);
        break;
      case 'deviceInfo':
        alert(JSON.stringify(this.dataDevice));
        break;
      case 'copy':
        this.diagram.commandHandler.copySelection();
        this.diagram.commandHandler.pasteSelection(this.diagram.lastInput.documentPoint);
        break;
      case 'delete':
        this.diagram.commandHandler.deleteSelection();
        break;
    }
    this.diagram.currentTool.stopTool();
  }

  addSvg() {
    this.addSvgShow = true;
  }

  modiSvg() {
    this.modiShow = true;
  }

  showValue() {
    console.log(this.diagram.model.toJson());
  }

  //保存前，若非新增 直接保存
  beforeSave() {
    if (this.currWork.name) {
      this.save();
    } else {
      this.saveWork = true;
    }
  }

  //保存对话框的确定事件 检查名称是否有重复
  modalSave() {
    this.http.post(this.findNameUrl, JSON.stringify(this.workName)).subscribe(res => {
      console.log(res);
      if (res['Status'] == '0') {
        this.message.info('布局名称已存在');
      } else if (res['Status'] == '1') {
        this.save();
        this.saveWork = false;
      }
    });
  }

  save() {
    let dataarray = this.diagram.model.toJson();
    let datajson = JSON.parse(dataarray);
    let data = {
      'name': this.currWork.name ? this.currWork.name : this.workName,//布局名称
      'key': this.currWork.key ? this.currWork.key : UUID.UUID(),
      'class': this.currWork.class ? this.currWork.class : datajson.class,
      'linkDataArray': datajson.linkDataArray,
      'nodeDataArray': datajson.nodeDataArray
    };
    console.log(JSON.stringify(data));
    let post = {
      'Opt': 'save',
      'Workspace': data
    };
    this.currWork.name = this.workName;
    this.currWork.key = data.key;
    //删除
    this.http.post(this.workUrl, {opt: 'delete', workspace: {key: this.currWork.key}}).subscribe(res => {
      }
    );
    //新增
    this.http.post(this.workUrl, post).subscribe(res => {
      if (res) {
        this.message.success('保存成功');
      }
    }, error1 => {
      console.log(error1);
      this.message.info('保存失败:%s', error1);
    });
    this.saveWork = false;
  }

  //计算最接近的四角，弹出菜单时避免超边界
  getPos(w, h) {
    var backH = $('#myDiagramDiv').height();//去px绝对数值
    var backW = $('#myDiagramDiv').width();//去px绝对数值
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

  load() {
    this.diagram.model = go.Model.fromJson(this.currWork);
  }

  //获取后台设备列表
  getDevice() {
    let url = '/core-metadata/api/v1/device';
    var head = new HttpHeaders({
      'X-Session-Token': '21232f297a57a5a743894a0e4a801fc3',
      'X-Requested-With': 'XMLHttpRequest'
    });
    this.http.get(url, {headers: head}).subscribe(response => {
        console.log('deviceresponse:' + response);
        this.devices = response;
        this.devices.forEach(function (e) {  // 处理标签数组 时间戳
          if (e.labels instanceof Array) {
            e.labels = e.labels.join(',');
          }
        });
      },
      error1 => {
        this.message.warning(error1);
        console.log(error1);
      });
  }

  //匹配当前选中的设备
  matchDevice() {
    try {
      this.dataDevice = this.currDevice['deviceid'] ? this.devices.filter(d => d.id === this.currDevice['deviceid'])[0] : this.defaultDevice;
    } catch (e) {

    }
  }

  //对话框取消
  handleCancel() {
    this.visible = false;
    this.addSvgShow = false;
    this.modiShow = false;
  }

  //对话框确认
  handleOk() {
    this.visible = false;
    this.currDevice['deviceid'] = this.tempDeviceId; //确认改变currdevice
    this.tempDeviceId = '';
    console.log(this.currDevice);
    this.message.success('成功绑定设备');
  }

  //打开对话框
  handleOpen() {
    this.tempDeviceId = this.currDevice['deviceid'];//赋值给下拉框绑定数据，避免双向绑定改变currdevice
  }

  //关闭对话框，等同取消
  handleClose() {
    this.handleCancel();
  }

  //缩放
  zoomOut(n) {
    this.diagram.commandHandler.increaseZoom(n);
  }

  //添加标签
  addComm() {
    this.showValue();
    this.diagram.model.nodeDataArray = [...this.diagram.model.nodeDataArray, {category: 'Comment', text: '添加评论'}];
    console.log(this.diagram.model.nodeDataArray);
    console.log(typeof (this.diagram.model.nodeDataArray));
  }

  //切换工作区或者地图优先
  mapUp() {
    if (!this.optMap) {
      this.makeMap();
      $('#myDiagramDiv').css('pointer-events', 'none');
      $('#myDiagramDiv  canvas').css('pointer-events', 'none');
      $('#myDiagramDiv  div').css('pointer-events', 'none');
      this.mapIcon = 'icon-image';
    } else if (this.optMap) {
      $('#myDiagramDiv').css('pointer-events', 'auto');
      $('#myDiagramDiv  canvas').css('pointer-events', 'auto');
      $('#myDiagramDiv  div').css('pointer-events', 'auto');
      this.mapIcon = 'icon-setting';
    }
    this.optMap = !this.optMap;
  }

  // 关闭
  close() {
    this.currWork = null;
    this.result.emit(true);
  }

  //显示工具栏
  toggleTop() {
    this.diagram.currentTool.stopTool();
    var display = $('#topbar').css('display');
    if (display === 'none') {
      $('#topbar').css('display', 'flex');
      $('#droptop  i').toggleClass('icon-down');
      $('#droptop  i').toggleClass('icon-up');
      $('#toolcontent').css('top', '90px');
    } else {
      $('#topbar').css('display', 'none');
      $('#droptop  i').toggleClass('icon-up');
      $('#droptop  i').toggleClass('icon-down');
      $('#droptop').css('top', '0');
      $('#toolcontent').css('top', '0');
    }
    this.load();
  }

  //显示左侧图标栏
  toggleleft() {
    this.diagram.currentTool.stopTool();
    var display = $('#leftbar').css('display');
    if (display === 'none') {
      $('#leftbar').css('display', 'block');
      $('#leftbtn').toggleClass('icon-left');
      $('#leftbtn').toggleClass('icon-right');
      $('#dropleft').css('left', '320px');
      $('#myDiagramDiv').css('left', '320px');
      $('#map').css('left', '320px');
    } else {
      $('#leftbar').css('display', 'none');
      $('#leftbtn').toggleClass('icon-left');
      $('#leftbtn').toggleClass('icon-right');
      $('#dropleft').css('left', '0');
      $('#myDiagramDiv').css('left', '0');
      $('#map').css('left', '0');
    }
    this.load();
  }

  //初始化地图
  makeMap() {
    var map = new BMap.Map('map');
    var point = new BMap.Point(116.404, 39.915);
    map.centerAndZoom(point, 15);
    window.setTimeout(function () {
      map.panTo(new BMap.Point(116.409, 39.918));
    }, 2000);
  }

  //初始
  init() {
    console.log(this.currWork);
    this.getDevice();
    this.initDiagram();
    this.getCus();
    $('.ant-collapse-content-box').css('padding', '0');//去折叠面板padding，默认16px
  }

  //动画循环
  loop() {
    this.stopLoop();
    var self = this;
    var diagram = self.diagram;
    self.timeOutId = setTimeout(function () {
      var oldskips = diagram.skipsUndoManager;
      diagram.skipsUndoManager = true;
      diagram.links.each(function (link) {
        var shape = link.findObject('PIPE');
        var off = shape.strokeDashOffset - 3;
        // animate (move) the stroke dash
        shape.strokeDashOffset = (off <= 0) ? 60 : off;
        // animte (strobe) the opacity:
        if (self.down) {
          self.opacity = self.opacity - 0.01;
        } else {
          self.opacity = self.opacity + 0.003;
        }
        if (self.opacity <= 0) {
          self.down = !self.down;
          self.opacity = 0;
        }
        if (self.opacity > 1) {
          self.down = !self.down;
          self.opacity = 1;
        }
        shape.opacity = self.opacity;
      });
      diagram.skipsUndoManager = oldskips;
      self.loop();
    }, 60);
  }

  //停止动画循环
  stopLoop() {
    clearTimeout(this.timeOutId);
  }

  //上传自定义图标前
  beforeUpload = (file: UploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

  //上传自定义图标
  handleUpload() {
    if (this.fileList.length < 1) {
      this.message.info('请选择上传图源');
      return;
    }
    const formData = new FormData();
    // tslint:disable-next-line:no-any
    this.cusUpload = this.cusAva.filter(d => d.divid === this.cusUpload.divid)[0];
    this.fileList.forEach((file: any) => {
      formData.append('file', file);
      console.log(file);
      this.cusUpload.svg = [...this.cusUpload.svg, {svg: file.name, deviceid: '', status: ''}];
    });
    this.cusUpload.display = true;
    formData.append('cusMenu', JSON.stringify(this.cusUpload));//发送本次修改的自定义分组及其内容 后台更新
    this.uploading = true;
    // You can use any AJAX library you like
    const req = new HttpRequest('POST', this.uploadUrl, formData, {
      // reportProgress: true
    });
    this.http
      .request(req)
      .pipe(filter(e => e instanceof HttpResponse))
      .subscribe(
        () => {
          this.uploading = false;
          this.fileList = [];
        },
        () => {
          this.uploading = false;
          this.message.error('upload failed.');
          return;
        }
      );
    this.http.post(this.updateCus, this.cusUpload).subscribe(res => {
      this.message.success('upload successfully.');
    });
  }

  handleNew() {
    let index = this.cusAva.length;
    if (index >= 10) {
      this.message.warning('最多可添加十个自定义分组');
      return;
    }
    let divid = 'cus' + index;
    this.cusAva = [...this.cusAva, {
      divid: divid,
      dispaly: true,
      name: this.newGroup,
      svg: []
    }];
    this.cusUpload.divid = divid;
    // this.getCus();
    this.handleUpload();
  }

  getCus() {
    this.http.get(this.cusUrl).subscribe(res => {
      this.cusData = res;
      this.cusAva = this.cusData.filter(d => d.display === true);//已自定义的信息
      var self = this;
      console.log('ava' + JSON.stringify(this.cusAva));
      this.cusAva.forEach(e => {
          this.cusMenu[e.divid[e.divid.length - 1]] = e;
          document.getElementById(e.divid).style.display = 'block';//显示上传过的分组
          var $ = go.GraphObject.make;

          var cusPalette = $(go.Palette, e.divid + 'div',
            {
              layout: $(go.GridLayout),
            });

          //删除自定义图标，实际是更新
          function remove(e, obj) {
            cusPalette.commit(function (d) {
              var contextmenu = obj.part;
              var nodedata = contextmenu.data;
              var d = obj.console.log(contextmenu);
              console.log(nodedata);
              // self.http.post(self.updateCus, nodedata.divid).subscribe(res => {
              //   self.message.success('已删除');
              // }, error1 => {
              //   self.message.info('删除失败:', error1);
              // });
            });
          }

          cusPalette.nodeTemplateMap.add('',  // the default category
            $(go.Node, 'Table',
              $(go.Panel, 'Vertical',
                $(go.Picture, {width: 53, height: 53, imageStretch: go.GraphObject.Uniform},
                  new go.Binding('source', 'svg', function (svg) {
                    return self.uploadUrl + '/' + svg + '.svg';
                  }),
                ),
                $(go.TextBlock,
                  {margin: 2},
                  new go.Binding('text', 'svg')
                )),
              {
                contextMenu:     // define a context menu for each node
                  $('ContextMenu',  // that has one button
                    $('ContextMenuButton',
                      $(go.TextBlock, '删除图标', {click: remove}),
                    )
                  )
              }
            ));
          cusPalette.model = new go.GraphLinksModel(e.svg);
        }
      );
      console.log(this.cusMenu);
    });
  }

  ngOnInit() {
    this.init();
    this.load();
    // this.makeMap();
    this.loop();
  }
}
