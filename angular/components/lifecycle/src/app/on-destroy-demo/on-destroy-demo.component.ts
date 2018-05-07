import { Component, OnInit, OnDestroy } from '@angular/core';
import { SimpleService } from './simple.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-on-destroy-demo',
  templateUrl: './on-destroy-demo.component.html',
  styleUrls: ['./on-destroy-demo.component.css']
})
export class OnDestroyDemoComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];

  constructor(private service: SimpleService) {
  }

  ngOnInit() {
    console.log('OnInit');

    this.subscriptions.push(
      this.service.loaded.subscribe(() => {
        // handle event
      }),
      this.service.changed.subscribe(() => {
        // handle event
      }),
      this.service.somethingElse.subscribe(() => {
        // handle event
      })
    );
  }

  ngOnDestroy() {
    console.log('OnDestroy');

    this.subscriptions.forEach(s => s.unsubscribe());
    this.subscriptions = [];
  }

}
