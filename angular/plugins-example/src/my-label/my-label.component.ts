import { Component, OnInit, NgModule } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Extension } from 'plugins-core';

@Extension('my-label', [])
@Component({
    selector: 'my-label',
    template: `<h1>My Label</h1>`,
    providers: [ FormBuilder ]
})
export class MyLabelComponent implements OnInit {

    form: FormGroup;

    constructor(private fb: FormBuilder) {
        this.form = fb.group({
            name: fb.group({
              first: ['Nancy', Validators.minLength(2)],
              last: 'Drew',
            }),
            email: '',
        });
    }

    ngOnInit() {
        console.log('My Label Init');
        console.log('FB:', this.fb);
        console.log('FORM:', this.form);
    }

}