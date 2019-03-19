import { Component, OnInit, Input } from '@angular/core';
import { Place } from './../../places/place.model';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place;
  @Input() selectedMode: 'select' | 'random';
  startDate: string;
  endDate: string;
  constructor(private modalController: ModalController) { }

  ngOnInit() {
    // availableFrom date if the mode is select
    const availableFrom = new Date(this.selectedPlace.availableFrom);
    // availableTo date if the mode is select
    const availableTo = new Date(this.selectedPlace.availableTo);
    // if the selectedMode is random, generate random start date and the end date
    if (this.selectedMode === 'random') { 
      this.startDate = new Date(
       availableFrom.getTime() * Math.random() * (availableTo.getTime() - 7 * 24 * 60 * 60 * 1000 - availableFrom.getTime()))
      .toISOString();
      this.endDate = new Date(new Date(this.startDate).getTime() + Math.random() *
      (new Date(this.startDate).getTime() + 6 * 24 * 60 * 60 * 100 -
      new Date(this.startDate).getTime())).toISOString();
    }
  }
  onCloseModal() { 
    this.modalController.dismiss(null, 'cancel');
  }
  createBooking() { 
    console.log('gonna create a booking');
    this.modalController.dismiss({message: 'This is a dummy message!'}, 'confirm');
  }
}
