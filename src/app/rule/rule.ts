import {AjaxService} from '../ajax.service';
import * as go from 'gojs';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NzMessageService} from 'ng-zorro-antd';
import {UUID} from 'angular2-uuid';

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
  builtIn = [
    {svg: 'Rectangle', category: 'shape'},
    // {svg: 'Square', category: 'shape'},
    {svg: 'RoundedRectangle', category: 'shape'},
    // {svg: 'Border',  category: 'shape'},
    {svg: 'Ellipse', category: 'shape'},
    // {svg: 'Circle', category: 'shape'},
    // {svg: 'TriangleRight', category: 'shape'},
    // {svg: 'TriangleDown', category: 'shape'},
    // {svg: 'TriangleLeft', category: 'shape'},
    {svg: 'TriangleUp', category: 'shape'},
    {svg: 'Diamond', category: 'shape'},
    {svg: 'LineH', category: 'shape'},
    {svg: 'LineV', category: 'shape'},
    // {svg: 'MinusLine', category: 'shape'},
    {svg: 'PlusLine', category: 'shape'},
    // {svg: 'XLine', category: 'shape'}
  ];

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

  visible = false;
  imgUrl = this.ajax.imgUrl;
  saveUrl = this.ajax.saveUrl;
  backUrl = this.ajax.backUrl;
  workUrl = this.ajax.workUrl;

  initDiagram() {
    var self = this;
    var $ = go.GraphObject.make;
    var DataArray = self.DataArray;  //new一个防止双向绑定更改DataArray后图源列表改变
    var imgUrl = this.imgUrl + '/';

    self.diagram = $(go.Diagram, 'myDiagramDiv',  // must name or refer to the DIV HTML element
      {
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
      self.currDevice = obj.data;
      self.matchDevice();
      console.log(self.currDevice);
      var fromLeft = document.getElementById('leftbar').offsetWidth;
      var left = pt.x + 208 + fromLeft + 10;//左侧菜单宽度  左侧图源栏款 10点向右偏移，在鼠标点击位置右侧
      var top = pt.y + 10 + topHeight;
      var r = getPos(pt.x, pt.y);
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
      var left = pt.x + 208 + fromLeft + 10; //左侧菜单宽度  左侧图源栏款 10点向右偏移，在鼠标点击位置右侧
      var top = pt.y + 10 + topHeight;
      var r = getPos(pt.x, pt.y);//计算四角中最接近的，以此调整位置
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
        // The Node.location comes from the "loc" property of the node data,
        // converted by the Point.parse static method.
        // If the Node.location is changed, it updates the "loc" property of the node data,
        // converting back using the Point.stringify static method.
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        {
          // the Node.location is at the center of each node
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
              port.fill = 'rgba(0,255,0,0.5)';
            }
          },
          mouseLeave: function (e, port) {
            port.fill = 'transparent';
          }
        });
    };

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
        // Shape.fill is bound to Node.data.color
        // four named ports, one on each side:
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
    myPalette3.nodeTemplateMap = myPalette2.nodeTemplateMap;
    myPalette4.nodeTemplateMap = myPalette3.nodeTemplateMap;

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
        makePort('T', go.Spot.Top, go.Spot.TopSide, true, true),
        makePort('L', go.Spot.Left, go.Spot.LeftSide, true, true),
        makePort('R', go.Spot.Right, go.Spot.RightSide, true, true),
        makePort('B', go.Spot.Bottom, go.Spot.BottomSide, true, true),
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
          // contextMenu: myContextMenu,
          // toolTip: myToolTip
        },
        // {contextMenu: myContextMenu},
        // {toolTip: myToolTip},
        $(go.Picture,
          {
            name: 'PICTURE',  // named so that the above properties can refer to this GraphObject
            width: 80, height: 80, imageStretch: go.GraphObject.Uniform
          },
          new go.Binding('source', 'svg', function (svg) {
            return imgUrl + svg + '.svg';
          }),
        ),
        $(go.Shape, 'Circle',    //指示灯
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
        makePort('T', go.Spot.Top, go.Spot.Top, true, true),
        makePort('L', go.Spot.Left, go.Spot.Left, true, true),
        makePort('R', go.Spot.Right, go.Spot.Right, true, true),
        makePort('B', go.Spot.Bottom, go.Spot.Bottom, true, true),
        // { // this tooltip shows the name and picture of the kitten
        //   toolTip:
        //     $("ToolTip",
        //       $(go.Panel, "Vertical",
        //         $(go.TextBlock, { margin: 3 },
        //           new go.Binding("text", "svg",function(s){
        //               return "设备信息:"+s+"\n"+"运行状态:运行中";
        //           }))))
        // }
        {toolTip: myToolTip},
        {contextMenu: myContextMenu}
      )
    );

    self.diagram.toolManager.hoverDelay = 300;  // 300 milliseconds

    self.diagram.linkTemplate =
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

  showValue() {
    console.log(this.diagram.model.toJson());
  }

  save() {
    let dataarray = this.diagram.model.toJson();
    let datajson = JSON.parse(dataarray);
    let data = {
      'key': UUID.UUID(),
      'class': datajson.class,
      'linkDataArray': datajson.linkDataArray,
      'nodeDataArray': datajson.nodeDataArray
    };
    console.log(JSON.stringify(data));
    let post = {
      'Opt': 'save',
      'Workspace': data
    };
    console.log(post);
    this.http.post(this.workUrl, post).subscribe(res => {
      if (res) {
        console.log(res);
        this.message.success('保存成功');
      }
    }, error1 => {
      console.log(error1);
      this.message.info('保存失败:%s', error1);
    });
  }

  load() {
    var top = $('#topbar').height();
    var width = $('#map-container').width();
    var height = $('#map-container').height();
    console.log(top, width, height);
    // var width = document.getElementById('map-container').offsetWidth;
    // var height = document.getElementById('map-container').offsetHeight;
    $('#myDiagramDiv').css('top', top + 'px');
    $('#myDiagramDiv').css('height', height + 'px');
    $('#myDiagramDiv').css('width', width + 'px');

    this.diagram.model = go.Model.fromJson(this.currWork);

  }

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

  matchDevice() {
    try {
      this.dataDevice = this.currDevice['deviceid'] ? this.devices.filter(d => d.id === this.currDevice['deviceid'])[0] : this.defaultDevice;
    } catch (e) {

    }
  }

  //对话框取消
  handleCancel() {
    this.visible = false;
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

  // 关闭
  close() {
    this.currWork = null;
    this.result.emit(true);
  }

  //隐藏工具栏
  topbarhid() {
    this.diagram.currentTool.stopTool();
    $('#topbar').css('display', 'none');
    $('#topbar').css('height', '0');
    $('#droptop').css('display', 'block');
    $('#toolcontent').css('height', '99%');
    this.load();
  }

  //显示工具栏
  topbarshow() {
    this.diagram.currentTool.stopTool();
    $('#topbar').css('display', 'flex');
    $('#topbar').css('height', '10%');
    $('#droptop').css('display', 'none');
    $('#toolcontent').css('height', '89%');
    this.load();
  }

  toggleleft() {
    this.diagram.currentTool.stopTool();
    var display = $('#leftbar').css('display');
    if (display === 'none') {
      $('#leftbar').css('display', 'block');
      $('#leftbtn').toggleClass('icon-left');
      $('#leftbtn').toggleClass('icon-right');
    } else {
      $('#leftbar').css('display', 'none');
      $('#leftbtn').toggleClass('icon-left');
      $('#leftbtn').toggleClass('icon-right');
    }
    var left = document.getElementById('leftbar').offsetWidth;
    $('#dropleft').css('margin-left', left);//左侧拉出按钮位置
    this.load();
  }

  makeMap() {
    var map = new BMap.Map('map');
    var point = new BMap.Point(116.404, 39.915);
    map.centerAndZoom(point, 15);
    window.setTimeout(function () {
      map.panTo(new BMap.Point(116.409, 39.918));
    }, 2000);
  }

  init() {
    console.log(this.currWork);
    this.getDevice();
    this.makeMap();
    this.initDiagram();

    $('.ant-collapse-content-box').css('padding', '0');//去折叠面板padding，默认16px
    var left = document.getElementById('leftbar').offsetWidth;
    $('#dropleft').css('margin-left', left);//左侧拉出按钮位置
    // var top = document.getElementById('topbar').offsetHeight;
    var top = $('#topbar').height();
    var width = $('#map-container').width();
    var height = $('#map-container').height();
    console.log(top, width, height);
    // var width = document.getElementById('map-container').offsetWidth;
    // var height = document.getElementById('map-container').offsetHeight;
    $('#myDiagramDiv').css('top', top + 'px');
    $('#myDiagramDiv').css('height', height + 'px');
    $('#myDiagramDiv').css('width', width + 'px');

    $('.topbtn').css('padding-top', (top - 50) / 2 + 'px');
    $('#upcontent').css('padding-top', (top - 50) / 2 + 'px');

    this.load();
  }

  ngOnInit() {
    this.init();
    this.load();
  }
}
