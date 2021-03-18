import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthServiceMock } from '../auth.service/auth.mock.service';
import { AuthService } from '../auth.service/auth.service';
import { PlanifRoom } from '../planif.room/planif.room';
import { HandComponent } from '../hand/hand.component';
import { IoWebsocketMockService } from '../_rooms/io-websocket.mock.service';
import { IoWebsocketService } from '../_rooms/io-websocket.service';

import { PlanifAdminComponent } from './planif-admin.component';
import { ResultsListAdminComponent } from '../results-list-admin/results-list-admin.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardComponent } from '../card/card.component';

describe('PlanifAdminComponent', () => {
  let component: PlanifAdminComponent;
  let fixture: ComponentFixture<PlanifAdminComponent>;
  let planifRoom : PlanifRoom;
  let service;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [
        PlanifAdminComponent,
        HandComponent,
        ResultsListAdminComponent,
        CardComponent
      ],
      imports: [RouterTestingModule, HttpClientTestingModule, ReactiveFormsModule, FormsModule],
      providers: [
        FormBuilder,
        {provide: AuthService, useValue: new AuthServiceMock({ref: "ref2", name: "Admin"})}
      ]
    })
    // https://angular.io/guide/testing-components-scenarios#override-component-providers
    .overrideComponent(
      PlanifAdminComponent,
      {set: {providers: [
        {provide: IoWebsocketService, useClass: IoWebsocketMockService},
        PlanifRoom
      ]}}
    )
    .compileComponents();
  });

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(PlanifAdminComponent);
    component = fixture.componentInstance;

    planifRoom = (component as any).planifRoom;
    expect(planifRoom instanceof PlanifRoom).toBeTruthy('planifRoom is not mocked');
    service = ((component as any).planifRoom as any).ioWebsocketService;
    expect(service instanceof IoWebsocketMockService).toBeTruthy('ioWebsocketService is mocked');

    // Hand use setTimeout, we need to call tick after
    fixture.detectChanges();

    tick(250+1)
    fixture.detectChanges();
  }));

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

   it('should have admin result with cards', fakeAsync(() => {
    expect(fixture.debugElement.queryAll(By.css('app-hand')).length).toEqual(1, 'one app-hand');
    expect(fixture.debugElement.queryAll(By.css('app-results-list-admin')).length).toEqual(1, 'one app-results-list-admin');

    // Hand use setTimeout, we need to wait for "see" the result
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('app-card')).length).toEqual(14);
  }));

  it('should change the game', () => {
    let allExempleCards = fixture.debugElement.queryAll(By.css('.exampleCard'));

    let pr : any = (component as any).planifRoom;
    let mySpy = spyOn(pr, 'sendCardVisibility').and.callFake(function(cardIndex: number, choosenVisibility : boolean) {
      // this <=> PlanifRoom
      this.ioWebsocketService.subjects.get("card_visibility_changed").next({cardIndex : cardIndex, choosenVisibility : choosenVisibility});
    })

    expect(allExempleCards.length).toEqual(14, 'all example card');
    expect(fixture.debugElement.queryAll(By.css('app-card')).length).toEqual(14);


    allExempleCards[1].nativeElement.click();
    fixture.detectChanges();

    // <=> expect(pr.sendCardVisibility.calls.count()).toEqual(1);
    expect(mySpy).toHaveBeenCalledTimes(1);
    expect(pr.sendCardVisibility.calls.argsFor(0)).toEqual([1, false]);
    expect(fixture.debugElement.queryAll(By.css('.exampleCard.selected')).length).toEqual(13, 'one example card less');
    expect(fixture.debugElement.queryAll(By.css('app-card')).length).toEqual(13);

    allExempleCards[5].nativeElement.click();
    fixture.detectChanges();

    expect(mySpy).toHaveBeenCalledTimes(1+1);
    expect(pr.sendCardVisibility.calls.argsFor(1)).toEqual([5, false]);
    expect(fixture.debugElement.queryAll(By.css('.exampleCard.selected')).length).toEqual(12, 'two example cards less');
    expect(fixture.debugElement.queryAll(By.css('app-card')).length).toEqual(12);


    allExempleCards[1].nativeElement.click();
    fixture.detectChanges();

    expect(mySpy).toHaveBeenCalledTimes(2+1);
    expect(pr.sendCardVisibility.calls.argsFor(2)).toEqual([1, true]);
    expect(fixture.debugElement.queryAll(By.css('.exampleCard.selected')).length).toEqual(13, 'one card less - 2');
    expect(fixture.debugElement.queryAll(By.css('app-card')).length).toEqual(13, 'one app-card');
  });

});
