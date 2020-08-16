import { Component, OnInit, ViewChild } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss']
})
export class VoteComponent {
  @ViewChild('card1', { static: true }) card1: CardComponent;
  @ViewChild('card2', { static: true }) card2: CardComponent;
  @ViewChild('card3', { static: true }) card3: CardComponent;
  @ViewChild('card4', { static: true }) card4: CardComponent;
  @ViewChild('card5', { static: true }) card5: CardComponent;

  private choosenValue : Number;

  changeValue(value: Number, active: Boolean) {
    if (value == this.choosenValue && active == false) {
      this.choosenValue = null;
    } else if (value != this.choosenValue && active == false) {
      // do nothing
    } else if (value != this.choosenValue && active == true) {

      this.card1.unselectedIfNot(value);
      this.card2.unselectedIfNot(value);
      this.card3.unselectedIfNot(value);
      this.card4.unselectedIfNot(value);
      this.card5.unselectedIfNot(value);

      this.choosenValue = value;
    }
  }

}