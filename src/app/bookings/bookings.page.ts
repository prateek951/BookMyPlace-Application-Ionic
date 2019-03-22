// tslint:disable
import { Component, OnInit, OnDestroy } from "@angular/core";
import { BookingService } from "./booking.service";
import { Booking } from "./booking.model";
import { IonItemSliding } from "@ionic/angular";
import { Subscription } from "rxjs";
import { LoadingController } from "@ionic/angular";

@Component({
  selector: "app-bookings",
  templateUrl: "./bookings.page.html",
  styleUrls: ["./bookings.page.scss"]
})
export class BookingsPage implements OnInit, OnDestroy {
  loadedBookings: Booking[];
  isLoading: boolean = false;
  // Create a books subscription
  private booksSubscription: Subscription;

  constructor(
    private bookingService: BookingService,
    private loaderCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.booksSubscription = this.bookingService.bookings.subscribe(
      bookings => {
        this.loadedBookings = bookings;
      }
    );
  }

  ionViewWillEnter() { 
    ///set the isLoading property 
    this.isLoading = true;
    this.bookingService.fetchBookings()
      .subscribe(() => { 
        // dismiss the spinner 
        this.isLoading = false;
          
      })
  }


  onCancelBooking(id: string, slideAndDelete: IonItemSliding) {
    // close
    slideAndDelete.close();
    // cancel booking pertaining to the id

    this.loaderCtrl
      .create({
        message: `Booking ${id} is now gonna be removed`
      })
      .then(loaderEl => {
        loaderEl.present();

        this.bookingService.cancelBooking(id).subscribe(() => {
          console.log("the booking is now removed");
          loaderEl.dismiss();
        });
      });
  }
  ngOnDestroy() {
    if (this.booksSubscription) {

      // clear the books subscription
      this.booksSubscription.unsubscribe();
    }
  }
}
