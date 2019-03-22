// tslint:disable
import { Injectable } from "@angular/core";
import { Booking } from "./booking.model";
import { BehaviorSubject } from "rxjs";
import { AuthService } from "./../auth/auth.service";
import { tap, take, delay, switchMap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { switchMap } from "rxjs/operators";
@Injectable({
  providedIn: "root"
})
export class BookingService {
  // dummy bookings for now
  // Set up the behavior subject for the bookings
  private _bookings = new BehaviorSubject<Booking[]>([]);

  constructor(private authService: AuthService, private http: HttpClient) {}

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
    let genId: string;
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

    return this.http
      .post<{name:string}>("https://awesome-places-562a3.firebaseio.com/bookings.json", {
        ...newBooking,
        id: null
      })
      .pipe(
        switchMap(resData => {
          genId = resData.name;
          return this.bookings;
        }),
        take(1),
        tap(bookings => { 
          newBooking.id = genId;
          //   Emit our old bookings along with the new one
          this._bookings.next(bookings.concat(newBooking));
        })
      );
  }
  // Utility method to cancel a booking pertaining to a bookingId
  cancelBooking(bookingId: string) {
    // console.log("inside the cancelBooking method");
    return this.bookings.pipe(
      take(1),
      delay(1000),
      tap(bookings => {
        this._bookings.next(bookings.filter(b => b.id !== bookingId));
      })
    );
  }
}
