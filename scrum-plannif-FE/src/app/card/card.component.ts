import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() value: Number;
  @Output() choosenEvent = new EventEmitter<Boolean>();
  private isSelected: Boolean = false;

  constructor() { }

  ngOnInit() {
  }

  click() {
    this.isSelected = !this.isSelected;
    this.choosenEvent.emit(this.isSelected);
    console.log("click")
  }

  public unselectedIfNot(choosenValue : Number) {
    if (this.value != choosenValue) {
      this.isSelected = false;
    }
  }
}
