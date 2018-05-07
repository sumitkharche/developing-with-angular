import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SimpleService {

  loaded = new Subject();
  changed = new Subject();
  somethingElse = new Subject();

}
