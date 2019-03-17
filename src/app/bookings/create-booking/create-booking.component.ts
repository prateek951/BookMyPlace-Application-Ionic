import { Component, OnInit, Input } from '@angular/core';
import { Place } from './../../places/place.model';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace:Place;
  constructor(private modalController: ModalController) { }

  ngOnInit() {}
  onCloseModal() { 
    this.modalController.dismiss(null, 'cancel');
  }
  createBooking() { 
    console.log('gonna create a booking');
    this.modalController.dismiss({message: 'This is a dummy message!'}, 'confirm');
  }
}
