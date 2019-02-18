import { Component, OnInit } from '@angular/core';
import {containsElement} from '@angular/animations/browser/src/render/shared';

declare let $: any;
@Component({
  selector: 'app-rule',
  templateUrl: './rule.html',
  styleUrls: ['./rule.scss']
})
export class RuleComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $( '#draggable' ).draggable();
    $( '#droppable' ).droppable({
      drop: function( event, ui ) {
        $( this )
          .addClass( 'ui-state-highlight' )
          .find( 'p' )
          .html( 'Dropped!' );
      }
    });
  }

}
