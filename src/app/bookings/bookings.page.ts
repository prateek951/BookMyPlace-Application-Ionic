// tslint:disable
import { Component, OnInit, OnDestroy } from "@angular/core";
import { BookingService } from "./booking.service";
import { Booking } from "./booking.model";
import { IonItemSliding } from "@ionic/angular";
import { Subscription } from "rxjs";

@Component({
  selector: "app-bookings",
  templateUrl: "./bookings.page.html",
  styleUrls: ["./bookings.page.scss"]
})
export class BookingsPage implements OnInit, OnDestroy {
  loadedBookings: Booking[];

  // Create a books subscription
  private booksSubscription: Subscription;

  constructor(private bookingService: BookingService) {}

  ngOnInit() {
    this.booksSubscription = this.bookingService.bookings.subscribe(
      bookings => {
        this.loadedBookings = bookings;
      }
    );
  }
  onCancelBooking(id: string, slideAndDelete: IonItemSliding) {
    // close
    slideAndDelete.close();
    // cancel booking pertaining to the id
  }
  ngOnDestroy() {
    if (this.booksSubscription) {
      // clear the books subscription
      this.booksSubscription.unsubscribe();
    }
  }
}
