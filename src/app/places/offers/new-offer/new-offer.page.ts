import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  // Set up the form group
  form: FormGroup;

  constructor() { }

  onCreateOffer() {
    console.log('inside the onCreateOffer component..');
  }


  ngOnInit() {
    this.form = new FormGroup({
      // Set up the form controls
      title : new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      description : new FormControl(null, {
        updateOn : 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      price : new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(499)]
      }),
      dateFrom : new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      dateTo: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });
  }

}
