// tslint:disable
import { Injectable } from "@angular/core";
import { Booking } from "./booking.model";
import { BehaviorSubject } from "rxjs";
import { AuthService } from "./../auth/auth.service";
import { tap, take, delay } from "rxjs/operators";
@Injectable({
  providedIn: "root"
})
export class BookingService {
  // dummy bookings for now
  // Set up the behavior subject for the bookings
  private _bookings = new BehaviorSubject<Booking[]>([]);

  constructor(private authService: AuthService) {}

  // getter for the bookings
  get bookings() {
    return this._bookings.asObservable();
  }
  // Utility method to add a new booking for a place pertaining to a user
  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    // console.log("inside the add Booking");
    // create a new booking
    const newBooking = new Booking(
      Math.random().toString(),
      placeId,
      this.authService.userId,
      placeTitle,
      placeImage,
      firstName,
      lastName,
      guestNumber,
      dateFrom,
      dateTo
    );

    // Get the latest changes
    return this.bookings.pipe(
      take(1),
      //add a delay here
      delay(1000),
      tap(bookings => {
        //   Emit our old bookings along with the new one
        this._bookings.next(bookings.concat(newBooking));
      })
    );
  }
  // Utility method to cancel a booking pertaining to a bookingId
  cancelBooking(bookingId: string) {
    console.log("inside the cancelBooking method");
  }
}
