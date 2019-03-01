import {AjaxService} from '../ajax.service';
// import * as joint from 'jointjs';
import * as go from 'gojs';
import {Component, OnInit} from '@angular/core';
import * as joint from 'jointjs';
import {conditionallyCreateMapObjectLiteral} from '@angular/compiler/src/render3/view/util';

declare var $: any;

@Component({
  selector: 'app-rule',
  templateUrl: './rule.html',
  styleUrls: ['./rule.scss']
})
export class RuleComponent implements OnInit {
  // imgList = [
  //   'icon-sync', 'icon-bulb', 'icon-desktop', 'icon-close-circle', 'icon-save', 'icon-sync',
  //   'icon-bulb', 'icon-desktop',
  // ];
  imgList = [];
  displayMtx = [];
  rowCount = 3;
  paperColor = 'rgba(100,200,20,0.5)';
  myDiagram;
  myPalette;
  num = '300px';

  value = {
    'class': 'go.GraphLinksModel',
    'linkFromPortIdProperty': 'fromPort',
    'linkToPortIdProperty': 'toPort',
    'nodeDataArray': [
      {'category': 'Comment', 'loc': '360 -10', 'text': 'Kookie Brittle', 'key': -13},
      {'key': -1, 'category': 'Start', 'loc': '175 0', 'text': 'Start'},
      {'key': 0, 'loc': '-5 75', 'text': 'Preheat oven to 375 F'},
      {'key': 1, 'loc': '175 100', 'text': 'In a bowl, blend: 1 cup margarine, 1.5 teaspoon vanilla, 1 teaspoon salt'},
      {'key': 2, 'loc': '175 200', 'text': 'Gradually beat in 1 cup sugar and 2 cups sifted flour'},
      {'key': 3, 'loc': '175 290', 'text': 'Mix in 6 oz (1 cup) Nestle\'s Semi-Sweet Chocolate Morsels'},
      {'key': 4, 'loc': '175 380', 'text': 'Press evenly into ungreased 15x10x1 pan'},
      {'key': 5, 'loc': '355 85', 'text': 'Finely chop 1/2 cup of your choice of nuts'},
      {'key': 6, 'loc': '175 450', 'text': 'Sprinkle nuts on top'},
      {'key': 7, 'loc': '175 515', 'text': 'Bake for 25 minutes and let cool'},
      {'key': 8, 'loc': '175 585', 'text': 'Cut into rectangular grid'},
      {'key': -2, 'category': 'End', 'loc': '175 660', 'text': 'Enjoy!'}
    ],
    'linkDataArray': [
      {'from': 1, 'to': 2, 'fromPort': 'B', 'toPort': 'T'},
      {'from': 2, 'to': 3, 'fromPort': 'B', 'toPort': 'T'},
      {'from': 3, 'to': 4, 'fromPort': 'B', 'toPort': 'T'},
      {'from': 4, 'to': 6, 'fromPort': 'B', 'toPort': 'T'},
      {'from': 6, 'to': 7, 'fromPort': 'B', 'toPort': 'T'},
      {'from': 7, 'to': 8, 'fromPort': 'B', 'toPort': 'T'},
      {'from': 8, 'to': -2, 'fromPort': 'B', 'toPort': 'T'},
      {'from': -1, 'to': 0, 'fromPort': 'B', 'toPort': 'T'},
      {'from': -1, 'to': 1, 'fromPort': 'B', 'toPort': 'T'},
      {'from': -1, 'to': 5, 'fromPort': 'B', 'toPort': 'T'},
      {'from': 5, 'to': 4, 'fromPort': 'B', 'toPort': 'T'},
      {'from': 0, 'to': 4, 'fromPort': 'B', 'toPort': 'T'}
    ]
  };
  opacity = 1;
  down = true;

  constructor(
    private ajax: AjaxService,
  ) {
  }

  natgas =
    'F M244.414,133.231 L180.857,133.231 178.509,156.191 250.527,192.94z\
    M179.027,276.244 262.328,308.179 253.451,221.477z\
    M267.717,360.866 264.845,332.807 220.179,360.866z\
    M167.184,266.775 247.705,207.524 176.95,171.421z\
    M157.551,360.866 192.975,360.866 256.447,320.996 165.218,286.021z\
    M141.262,374.366 141.262,397.935 161.396,397.935 161.396,425.268 179.197,425.268 179.197,397.935\
    246.07,397.935 246.07,425.268 263.872,425.268 263.872,397.935 284.006,397.935 284.006,374.366z';
  oil =
    'F M190.761,109.999c-3.576-9.132-8.076-22.535,7.609-37.755c0.646,13.375,14.067,13.99,11.351,36.794\
    c6.231-2.137,6.231-2.137,9.188-3.781c17.285-9.612,20.39-25.205,7.64-42.896c-7.316-10.153-11.945-20.58-10.927-33.23\
    c-4.207,4.269-5.394,9.444-6.744,17.129c-5.116-3.688,3.067-41.28-22.595-46.26c5.362,13.836,7.564,25.758-2.607,40.076\
    c-0.667-5.422-3.255-12.263-8.834-17.183c-0.945,16.386,0.97,23.368-9.507,44.682c-2.945,8.902-5.02,17.635,0.533,26.418\
    C171.354,102.673,180.555,108.205,190.761,109.999z\
    M330.738,371.614h-15.835v-61.829l-74.409-78.541v-21.516c0-6.073-4.477-11.087-10.309-11.957v-82.156h-63.632v82.156\
    c-5.831,0.869-10.308,5.883-10.308,11.957v21.516l-74.409,78.541v61.829H66l-25.124,25.123h314.984L330.738,371.614z\
    M166.554,371.614h-61.717v-29.782h61.717V371.614z M166.554,319.956h-61.717v-1.007l51.471-54.329\
    c0.555,5.513,4.813,9.919,10.246,10.729V319.956L166.554,319.956z M291.903,371.614h-61.718v-29.782h61.718V371.614z\
    M291.903,319.956h-61.718V275.35c5.435-0.811,9.691-5.217,10.246-10.729l51.472,54.329V319.956z';
  pyrolysis =
    'F M226.46,198.625v-75.5h-87.936v-19.391h-14.304V92.319h-5.079l-3.724-82.777H91.766l-3.724,82.777h-6.18v11.415H68.535\
    V92.319h-5.079L59.731,9.542H36.08l-3.724,82.777h-6.18v11.415H11.872v94.891H0v35.167h243.333v-35.167H226.46z M61.355,191.792h-28\
    v-69.333h28V191.792z M117.041,191.792h-28v-69.333h28V191.792z M168.46,198.625h-29.936v-17.5h29.936V198.625z M206.46,198.625h-18\
    v-37.5h-49.936v-18h67.936V198.625z';
  fractionation =
    'F M224.609,218.045l-5.24-173.376h9.172V18.297h-9.969L218.019,0h-32.956l-0.553,18.297h-9.969v26.372h9.171l-2.475,81.878\
    h-39.196l-1.833-52.987h8.998V47.188h-9.91l-0.633-18.297h-32.913l-0.633,18.297h-9.911V73.56h8.999l-1.833,52.987H62.081\
    l-0.974-24.097h8.767V76.079h-9.833l-0.74-18.298H26.446l-0.739,18.298h-9.832v26.371h8.766L19.97,218.045H3.041v26.371h238.333\
    v-26.371z  M144.536,198.667h34.522l-0.586,19.378h-33.267L144.536,198.667z M143.624,172.296l-0.67-19.378h37.487\
    l-0.586,19.378H143.624z M100.792,172.296H63.93l-0.783-19.378h38.315L100.792,172.296z M99.88,198.667l-0.67,19.378h-33.43\
    l-0.783-19.378H99.88z';
  gasprocessing =
    'F M242.179,212.635V58.634h-80.936v40.877h-13.465l-1.351-33.828h5.284V45.247h-6.1l-0.415-10.382h6.515V14.431h-46.927\
    v20.435h6.515l-0.415,10.382h-6.1v20.436h5.284l-2.8,70.125H96.186V95.007H10.642v117.628H0v25.755h252.82v-25.755H242.179z\
    M73.501,135.808H51.714v76.827H33.327v-94.942h40.174V135.808z M137.797,213.516h-19.099v-88h19.099V213.516z M219.494,212.635\
    h-18.316v-51.411h18.316V212.635z M219.494,138.539h-18.316V99.511h-17.25V81.319h35.566V138.539z';
  polymerization =
    'F M399.748,237.029 L363.965,174.401 345.094,174.401 343.113,155.463 326.566,155.463 322.797,29.385 290.486,29.385\
    286.715,155.463 270.17,155.463 261.634,237.029 242.029,237.029 242.029,190.314 192.029,190.314 192.029,230.587 109.84,187.329\
    109.84,230.486 27.84,187.329 27.84,237.029 0,237.029 0,394.674 424.059,394.674 424.059,237.029z';
  finishedgas =
    'F M422.504,346.229v-68.306h-16.678v-24.856c0-21.863-16.199-39.935-37.254-42.882v-0.798\
    c0-26.702-21.723-48.426-48.426-48.426h-1.609c-26.699,0-48.426,21.724-48.426,48.426v87.633h-23.641v-93.169\
    c0-6.083-3.248-11.394-8.096-14.333c5.662-1.667,9.799-6.896,9.799-13.098c0-7.544-6.117-13.661-13.662-13.661h-10.981v-12.727h-17\
    v12.727h-10.984c-7.545,0-13.66,6.116-13.66,13.661c0,6.202,4.137,11.431,9.799,13.098c-4.848,2.94-8.098,8.25-8.098,14.333v93.169\
    h-23v-85.596c0-4.458-3.613-8.071-8.07-8.071h-16.412v-87.591c0-16.03-13.041-29.071-29.07-29.071v-1.267\
    c0-23.608-19.139-42.748-42.748-42.748S21.54,61.817,21.54,85.425v260.805H0v55.139h444.045v-55.139H422.504z M286.256,209.387\
    c0-17.801,14.48-32.284,32.281-32.284h1.609c17.803,0,32.285,14.483,32.285,32.284v1.559\
    c-19.059,4.545-33.232,21.673-33.232,42.124v24.855h-16.676v19.098h-16.27v-87.635H286.256z M302.525,313.162v33.067h-16.27\
    v-33.067H302.525z M270.113,313.162v33.067h-23.641v-33.067H270.113z M144.447,219.496v85.596c0,4.458,3.613,8.071,8.07,8.071\
    h31.07v33.068h-47.482V219.496H144.447z M107.035,102.834c7.129,0,12.93,5.8,12.93,12.929v87.591h-12.93V102.834z M107.035,219.496\
    h12.93v126.733h-12.93V219.496z';

  icons = {
    'natgas': this.natgas,
    'oil': this.oil,
    'pyrolysis': this.pyrolysis,
    'fractionation': this.fractionation,
    'gasprocessing': this.gasprocessing,
    'polymerization': this.polymerization,
    'finishedgas': this.finishedgas
  };

  imgUrl = this.ajax.imgUrl;
  saveUrl = this.ajax.saveUrl;
  backUrl = this.ajax.backUrl;

  uploadChg(event) {
    console.log(event.file);
    console.log(event.fileList);
    console.log(event.event);
  }

  devide() {
    // if (this.imgList.length <= this.rowCount) {
    //   this.displayMtx = this.imgList;
    // }
    this.displayMtx = [];
    let imgCount = this.imgList.length;
    let index = 0;
    while (imgCount > 0) {
      let temp = [];
      for (let i = index; i < index + this.rowCount; i++) {
        if (this.imgList[i]) {
          temp = [...temp, this.imgList[i]];
        }
      }
      this.displayMtx = [...this.displayMtx, temp];
      imgCount -= this.rowCount;
      index += this.rowCount;
    }
    console.log(this.displayMtx);
  }

  addDevice() {
    this.imgList = this.imgList.concat('icon-desktop');
    console.log(this.imgList);
    // this.devide();
  }

  jointjs() {
// shared graph model
    var graph = new joint.dia.Graph;

    // main paper view
    var paper = new joint.dia.Paper({
      el: $('#paper-multiple-papers'),
      model: graph,
      width: 800,
      height: 600,
      gridSize: 1,
      background: {
        color: this.paperColor
      }
    });

    paper.on('element:pointerdown', function () {

    });


    // minimap paper view
    var paperSmall = new joint.dia.Paper({
      el: $('#paper-multiple-papers-small'),
      model: graph,
      width: 200,
      height: 150,
      gridSize: 1,
      interactive: false
    });
    paperSmall.scale(0.25);

    // graph contents
    var rect = new joint.shapes.standard.Rectangle();
    rect.position(100, 30);
    rect.resize(100, 40);
    rect.attr({
      body: {
        fill: 'blue'
      },
      label: {
        text: 'Hello',
        fill: 'white'
      }
    });
    rect.addTo(graph);

    var rect2 = rect.clone();
    rect2.translate(300, 0);
    rect2.attr('label/text', 'World!');
    rect2.addTo(graph);

    var link = new joint.shapes.standard.Link();
    link.source(rect);
    link.target(rect2);
    link.addTo(graph);
  }

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
  //         var off = shape.strokeDashOffset - 3;
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

  print() {
    var $ = go.GraphObject.make;  // for conciseness in defining templates
    this.myDiagram =
      $(go.Diagram, 'myDiagramDiv',  // must name or refer to the DIV HTML element
        {
          'LinkDrawn': showLinkLabel,  // this DiagramEvent listener is defined below
          'LinkRelinked': showLinkLabel,
          'undoManager.isEnabled': true  // enable undo & redo
        });

    function geoFunc(geoname) {
      var geo = this.icons[geoname];
      if (typeof geo === 'string') {
        geo = this.icons[geoname] = go.Geometry.parse(geo, true);
      }
      return geo;
    }

    // helper definitions for node templates
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

    // Define a function for creating a "port" that is normally transparent.
    // The "name" is used as the GraphObject.portId,
    // the "align" is used to determine where to position the port relative to the body of the node,
    // the "spot" is used to control how links connect with the port and whether the port
    // stretches along the side of the node,
    // and the boolean "output" and "input" arguments control whether the user can draw links from or to the port.
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

    function textStyle() {
      return {
        font: 'bold 11pt Helvetica, Arial, sans-serif',
        stroke: 'whitesmoke'
      };
    }

    // define the Node templates for regular nodes
    this.myDiagram.nodeTemplateMap.add('',  // the default category
      $(go.Node, 'Table', nodeStyle(),
        // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
        // $(go.Panel, 'Auto',
        //   $(go.Shape, {
        //       name: 'main',
        //       width: 40, height: 40,
        //       margin: new go.Margin(-1, 0, 0, 0),
        //       portId: '',
        //       stroke: null, strokeWidth: 0,
        //       fill: '#41BFEC'/* blue*/
        //     },
        //     new go.Binding('fill', 'color'),
        //     new go.Binding('width', 'portWidth'),
        //     new go.Binding('height', 'portHeight'))
        // ),
        $(go.Panel, 'Auto',
          $(go.Shape, 'Rectangle',
            {fill: '#00A9C9', strokeWidth: 0},
            new go.Binding('figure', 'figure')),
          $(go.TextBlock, textStyle(),
            {
              margin: 8,
              maxSize: new go.Size(160, NaN),
              wrap: go.TextBlock.WrapFit,
              editable: true
            },
            new go.Binding('text').makeTwoWay())
        ),
        // four named ports, one on each side:
        makePort('T', go.Spot.Top, go.Spot.TopSide, false, true),
        makePort('L', go.Spot.Left, go.Spot.LeftSide, true, true),
        makePort('R', go.Spot.Right, go.Spot.RightSide, true, true),
        makePort('B', go.Spot.Bottom, go.Spot.BottomSide, true, false)
      ));
    this.myDiagram.nodeTemplateMap.add('svg',
      $(go.Node, 'Table', nodeStyle(),
        $(go.Panel, 'Auto',
          $(go.Shape, 'Circle',
            {fill: 'lightcoral', strokeWidth: 4, stroke: '#e89324', width: 60, height: 60},
            new go.Binding('fill', 'color')),
          $(go.Shape,
            {margin: 3, fill: '#237810', strokeWidth: 0},
            new go.Binding('geometry', 'geo', geoFunc)),
        ),
        makePort('T', go.Spot.Top, go.Spot.Top, false, true),
        makePort('L', go.Spot.Left, go.Spot.Left, true, true),
        makePort('R', go.Spot.Right, go.Spot.Right, true, true),
        makePort('B', go.Spot.Bottom, go.Spot.Bottom, true, false)
      )
    );

    this.myDiagram.nodeTemplateMap.add('Conditional',
      $(go.Node, 'Table', nodeStyle(),
        // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
        $(go.Panel, 'Auto',
          $(go.Shape, 'Diamond',
            {fill: '#00A9C9', strokeWidth: 0},
            new go.Binding('figure', 'figure')),
          $(go.TextBlock, textStyle(),
            {
              margin: 8,
              maxSize: new go.Size(160, NaN),
              wrap: go.TextBlock.WrapFit,
              editable: true
            },
            new go.Binding('text').makeTwoWay())
        ),
        // four named ports, one on each side:
        makePort('T', go.Spot.Top, go.Spot.Top, false, true),
        makePort('L', go.Spot.Left, go.Spot.Left, true, true),
        makePort('R', go.Spot.Right, go.Spot.Right, true, true),
        makePort('B', go.Spot.Bottom, go.Spot.Bottom, true, false)
      ));
    this.myDiagram.nodeTemplateMap.add('Start',
      $(go.Node, 'Table', nodeStyle(),
        $(go.Panel, 'Auto',
          $(go.Shape, 'Circle',
            {minSize: new go.Size(40, 40), fill: '#79C900', strokeWidth: 0}),
          $(go.TextBlock, 'Start', textStyle(),
            new go.Binding('text'))
        ),
        // three named ports, one on each side except the top, all output only:
        makePort('L', go.Spot.Left, go.Spot.Left, true, false),
        makePort('R', go.Spot.Right, go.Spot.Right, true, false),
        makePort('B', go.Spot.Bottom, go.Spot.Bottom, true, false)
      ));
    this.myDiagram.nodeTemplateMap.add('End',
      $(go.Node, 'Table', nodeStyle(),
        $(go.Panel, 'Auto',
          $(go.Shape, 'Circle',
            {minSize: new go.Size(40, 40), fill: '#DC3C00', strokeWidth: 0}),
          $(go.TextBlock, 'End', textStyle(),
            new go.Binding('text'))
        ),
        // three named ports, one on each side except the bottom, all input only:
        makePort('T', go.Spot.Top, go.Spot.Top, false, true),
        makePort('L', go.Spot.Left, go.Spot.Left, false, true),
        makePort('R', go.Spot.Right, go.Spot.Right, false, true)
      ));
    this.myDiagram.nodeTemplateMap.add('puls',
      $(go.Node, 'Table', nodeStyle(),
        $(go.Panel, 'Auto',
          $(go.Shape, 'Circle',
            {minSize: new go.Size(60, 60), fill: '#D75490', strokeWidth: 0}),
          $(go.TextBlock, 'puls', textStyle(),
            new go.Binding('text'))
        ),
        // three named ports, one on each side except the bottom, all input only:
        makePort('T', go.Spot.Top, go.Spot.Top, false, true),
        makePort('L', go.Spot.Left, go.Spot.Left, false, true),
        makePort('R', go.Spot.Right, go.Spot.Right, false, true)
      ));

    this.myDiagram.nodeTemplateMap.add('Comment',
      $(go.Node, 'Auto', nodeStyle(),
        $(go.Shape, 'File',
          {fill: '#DEE0A3', strokeWidth: 0}),
        $(go.TextBlock, textStyle(),
          {
            margin: 5,
            maxSize: new go.Size(200, NaN),
            wrap: go.TextBlock.WrapFit,
            textAlign: 'center',
            editable: true,
            font: 'bold 12pt Helvetica, Arial, sans-serif',
            stroke: '#454545'
          },
          new go.Binding('text').makeTwoWay())
        // no ports, because no links are allowed to connect with a comment
      ));
    // replace the default Link template in the linkTemplateMap
    this.myDiagram.linkTemplate =
      $(go.Link,  // the whole link panel
        {
          routing: go.Link.AvoidsNodes,
          curve: go.Link.JumpOver,
          corner: 5, toShortLength: 4,
          relinkableFrom: true,
          relinkableTo: true,
          reshapable: true,
          resegmentable: true,
          // mouse-overs subtly highlight links:
          mouseEnter: function (e, link) {
            link.findObject('HIGHLIGHT').stroke = 'rgba(30,144,255,0.2)';
          },
          mouseLeave: function (e, link) {
            link.findObject('HIGHLIGHT').stroke = 'transparent';
          },
          selectionAdorned: false
        },
        new go.Binding('points').makeTwoWay(),
        $(go.Shape,  // the highlight shape, normally transparent
          {isPanelMain: true, strokeWidth: 8, stroke: 'transparent', name: 'HIGHLIGHT'}),
        $(go.Shape,  // the link path shape
          {isPanelMain: true, stroke: 'gray', strokeWidth: 2},
          new go.Binding('stroke', 'isSelected', function (sel) {
            return sel ? 'dodgerblue' : 'gray';
          }).ofObject()),
        $(go.Shape,  // the arrowhead
          {toArrow: 'standard', strokeWidth: 0, fill: 'gray'}),
        $(go.Panel, 'Auto',  // the link label, normally not visible
          {visible: false, name: 'LABEL', segmentIndex: 2, segmentFraction: 0.5},
          new go.Binding('visible', 'visible').makeTwoWay(),
          $(go.Shape, 'RoundedRectangle',  // the label shape
            {fill: '#F8F8F8', strokeWidth: 0}),
          $(go.TextBlock, 'Yes',  // the label
            {
              textAlign: 'center',
              font: '10pt helvetica, arial, sans-serif',
              stroke: '#333333',
              editable: true
            },
            new go.Binding('text').makeTwoWay())
        )
      );
    // Make link labels visible if coming out of a "conditional" node.
    // This listener is called by the "LinkDrawn" and "LinkRelinked" DiagramEvents.
    function showLinkLabel(e) {
      var label = e.subject.findObject('LABEL');
      if (label !== null) {
        label.visible = (e.subject.fromNode.data.category === 'Conditional');
      }
    }

    // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
    this.myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
    this.myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;
    this.load();
    // initialize the Palette that is on the left side of the page
    this.myPalette =
      $(go.Palette, 'myPaletteDiv',  // must name or refer to the DIV HTML element
        {
          nodeTemplateMap: this.myDiagram.nodeTemplateMap,  // share the templates used by myDiagram
          model: new go.GraphLinksModel([  // specify the contents of the Palette
            {category: 'Start', text: 'Start'},
            {text: 'Step'},
            {category: 'Conditional', text: '???'},
            {category: 'End', text: 'End'},
            {category: 'puls', text: 'puls'},
            // {category: 'Comment', text: 'Comment'}
          ])
        });
    // end init
    // Show the diagram's model in JSON format that the user may edit
  }

  showValue() {
    let v = this.myDiagram.model.toJson();
    console.log(typeof (v));
    console.log(v);
    console.log(this.myDiagram.nodeTemplateMap);
  }

  load() {
    this.myDiagram.model = go.Model.fromJson(JSON.stringify(this.value));  // load an initial diagram from some JSON text
  }

  // print the diagram by opening a new window holding SVG images of the diagram contents for each page
  // printDiagram() {
  //   var svgWindow = window.open();
  //   if (!svgWindow) {
  //     return;
  //   }  // failure to open a new Window
  //   var printSize = new go.Size(700, 960);
  //   var bnds = this.myDiagram.documentBounds;
  //   var x = bnds.x;
  //   var y = bnds.y;
  //   while (y < bnds.bottom) {
  //     while (x < bnds.right) {
  //       var svg = this.myDiagram.makeSVG({scale: 1.0, position: new go.Point(x, y), size: printSize});
  //       svgWindow.document.body.appendChild(svg);
  //       x += printSize.width;
  //     }
  //     x = bnds.x;
  //     y += printSize.height;
  //   }
  //   setTimeout(function () {
  //     svgWindow.print();
  //   }, 1);
  // }


  svg() {
    var $ = go.GraphObject.make;
    var diagram = new go.Diagram('myDiagramDiv');
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

    myPalette.nodeTemplate =
      $(go.Node, 'Vertical',
        $(go.Picture, {width: 80, height: 80, imageStretch: go.GraphObject.Uniform},
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
    diagram.nodeTemplate =
      $(go.Node, 'Auto',
        // $(go.Shape, "RoundedRectangle", // use this kind of figure for the Shape
        //     // bind Shape.fill to Node.data.color
        // ),
        $(go.Picture, {width: 80, height: 80, imageStretch: go.GraphObject.Uniform},
          new go.Binding('source', 'svg', function (svg) {
            return imgUrl + svg + '.svg';
          }),
          {
            contextMenu:     // define a context menu for each node
              $('ContextMenu',  // that has one button
                $('ContextMenuButton',
                  $(go.TextBlock, 'item1'),
                ),
                $('ContextMenuButton',
                  $(go.TextBlock, 'item2'),
                ),
                $('ContextMenuButton',
                  $(go.TextBlock, 'item3'),
                )
                , $('ContextMenuButton',
                  $(go.TextBlock, 'item4'),
                )
                // more ContextMenuButtons would go here
              )  // end Adornment
          }
        ),
        makePort('T', go.Spot.Top, go.Spot.Top, true, true),
        makePort('L', go.Spot.Left, go.Spot.Left, true, true),
        makePort('R', go.Spot.Right, go.Spot.Right, true, true),
        makePort('B', go.Spot.Bottom, go.Spot.Bottom, true, true)
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
        $(go.Shape, {isPanelMain: true, stroke: '#41BFEC'/* blue*/, strokeWidth: 10},
          new go.Binding('stroke', 'color')),
        $(go.Shape, {isPanelMain: true, stroke: 'white', strokeWidth: 3, name: 'PIPE', strokeDashArray: [20, 40]})
      );

    // this.loop(diagram);  // animate some flow through the pipes

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

    var DataArray = [
      {key: 1, svg: '卡车'},
      {key: 2, svg: '粉碎机'},
      {key: 3, svg: '机组'},
      {key: 4, svg: '加工厂'},
      {key: 5, svg: '冷却塔',},
      {key: 6, svg: '提炼塔'},
      {key: 7, svg: '烘干塔'},
      {key: 8, svg: '钻探工厂'},
    ];

    myPalette.model = new go.GraphLinksModel(DataArray, []);
    myPalette2.model = new go.GraphLinksModel(DataArray, []);
    myPalette3.model = new go.GraphLinksModel(DataArray, []);
  }

  loop(diagram) {
    setTimeout(function () {
      var oldskips = diagram.skipsUndoManager;
      diagram.skipsUndoManager = true;
      diagram.links.each(function (link) {
        var shape = link.findObject('PIPE');
        var off = shape.strokeDashOffset - 3;
        // animate (move) the stroke dash
        shape.strokeDashOffset = (off <= 0) ? 60 : off;
        // animte (strobe) the opacity:
        if (this.down) {
          this.opacity = this.opacity - 0.01;
        } else {
          this.opacity = this.opacity + 0.003;
        }
        if (this.opacity <= 0) {
          this.down = !this.down;
          this.opacity = 0;
        }
        if (this.opacity > 1) {
          this.down = !this.down;
          this.opacity = 1;
        }
        shape.opacity = this.opacity;
      });
      diagram.skipsUndoManager = oldskips;
      this.loop(diagram);
    }, 60);
  }

  ngOnInit() {
    this.svg();
    // $('.resizable').resizable();
  }
}
