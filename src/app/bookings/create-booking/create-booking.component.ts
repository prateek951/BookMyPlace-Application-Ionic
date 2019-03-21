//tslint:disable
import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { Place } from "./../../places/place.model";
import { ModalController, NavController } from "@ionic/angular";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-create-booking",
  templateUrl: "./create-booking.component.html",
  styleUrls: ["./create-booking.component.scss"]
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place;
  @Input() selectedMode: "select" | "random";
  // select the form
  @ViewChild("f") form: NgForm;

  startDate: string;
  endDate: string;
  constructor(private modalController: ModalController) {}

  ngOnInit() {
    // availableFrom date if the mode is select
    const availableFrom = new Date(this.selectedPlace.availableFrom);
    // availableTo date if the mode is select
    const availableTo = new Date(this.selectedPlace.availableTo);
    // if the selectedMode is random, generate random start date and the end date
    if (this.selectedMode === "random") {
      this.startDate = new Date(
        availableFrom.getTime() *
          Math.random() *
          (availableTo.getTime() -
            7 * 24 * 60 * 60 * 1000 -
            availableFrom.getTime())
      ).toISOString();
      this.endDate = new Date(
        new Date(this.startDate).getTime() +
          Math.random() *
            (new Date(this.startDate).getTime() +
              6 * 24 * 60 * 60 * 100 -
              new Date(this.startDate).getTime())
      ).toISOString();
    }
  }
  onCloseModal() {
    this.modalController.dismiss(null, "cancel");
  }
  createBooking() {
    // If the form is invalid or the dates are mismatched return
    if (this.form.invalid || !this.datesValid()) {
      return;
    }
    // Tap the form values
    console.log("gonna create a booking");
    this.modalController.dismiss(
      {
        bookingData: {
          firstName: this.form.value["first-name"],
          lastName: this.form.value["last-name"],
          guestNumber: +this.form.value["guest-number"],
          startDate: new Date(this.form.value["date-from"]),
          endDate: new Date(this.form.value["date-to"])
        }
      },
      "confirm"
    );
  }
  datesValid() {
    const startDate = new Date(this.form.value["date-from"]);
    const endDate = new Date(this.form.value["date-to"]);
    return endDate > startDate;
  }
}
