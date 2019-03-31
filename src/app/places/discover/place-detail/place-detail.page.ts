//tslint:disable
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { PlacesService } from "./../../places.service";
import { BookingService } from "./../../../bookings/booking.service";
import { Place } from "../../place.model";
import {
  NavController,
  ModalController,
  ActionSheetController
} from "@ionic/angular";
import { CreateBookingComponent } from "./../../../bookings/create-booking/create-booking.component";
import { LoadingController } from "@ionic/angular";
import { AuthService } from "./../../../auth/auth.service";
import { AlertController } from "@ionic/angular";
import { MapModalComponent } from "./../../../shared/map-modal/map-modal.component";
import { switchMap } from "rxjs/operators";

@Component({
  selector: "app-place-detail",
  templateUrl: "./place-detail.page.html",
  styleUrls: ["./place-detail.page.scss"]
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  loadedPlace: Place;
  isBookable: boolean = false;
  isLoading: boolean = false;
  // Setup the subscription
  private placeSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private placesService: PlacesService,
    private bookingsService: BookingService,
    private navController: NavController,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController,
    private loaderCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}
  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has("placeId")) {
        // redirect back to the places
        this.router.navigateByUrl("/places/tabs/discover");
        return;
      }
      const placeId = paramMap.get("placeId");
      // Fetch the place

      // Store the subscription

      // Set the isLoading to true
      this.isLoading = true;
      let userId: string;
      this.authService.userId
        .pipe(
          switchMap(userId => {
            if (!userId) {
              throw new Error(" Found no user");
            }
            userId = userId;
            return this.placesService.fetchPlace(placeId);
          })
        )
        .subscribe(
          place => {
            this.loadedPlace = place;

            // Once we are done fetching set isLoading to false
            this.isLoading = false;
            if (this.loadedPlace.userId !== userId) {
              this.isBookable = true;
            }
          },
          error => {
            this.alertCtrl
              .create({
                header: "An error occurred",
                message:
                  "Failed to fetch the place details.Please try again later",
                buttons: [
                  {
                    text: "Ok",
                    handler: () => {
                      this.router.navigateByUrl("/places/tabs/discover");
                    }
                  }
                ]
              })
              .then(alertEl => {
                alertEl.present();
              });
          }
        );
      // console.log(this.loadedPlace);
    });
  }

  onBookPlace() {
    // here we want to open the modal
    this.actionSheetController
      .create({
        header: "Choose an Action",
        buttons: [
          {
            text: "Select Date",
            handler: () => this.openBookingModal("select")
          },
          {
            text: "Random Date",
            handler: () => this.openBookingModal("random")
          },
          {
            text: "Cancel",
            role: "cancel"
          }
        ]
      })
      .then(actionSheetEl => {
        actionSheetEl.present();
      });
  }
  openBookingModal(mode: "select" | "random") {
    // console.log(mode);
    // Create a modal
    this.modalController
      .create({
        component: CreateBookingComponent,
        componentProps: { selectedPlace: this.loadedPlace, selectedMode: mode }
      })
      .then(modal => {
        modal.present();
        return modal.onDidDismiss();
      })
      .then(result => {
        if (result.role === "cancel") {
          console.log(result.data, result.role);
        }
        if (result.role === "confirm") {
          console.log(result.data);
          // start the loading first
          this.loaderCtrl
            .create({
              message:
                "Booking your place.This can take some delay. Do not move back"
            })
            .then(loaderEl => {
              loaderEl.present();
              // add a new booking
              this.bookingsService
                .addBooking(
                  this.loadedPlace.id,
                  this.loadedPlace.title,
                  this.loadedPlace.imageUrl,
                  result.data.bookingData.firstName,
                  result.data.bookingData.lastName,
                  result.data.bookingData.guestNumber,
                  result.data.bookingData.startDate,
                  result.data.bookingData.endDate
                )
                .subscribe(() => {
                  // dismiss the loader
                  loaderEl.dismiss();
                  //
                });
            });
        }
      });
  }
  onOpenMapModal() {
    this.modalController
      .create({
        component: MapModalComponent,
        componentProps: {
          center: {
            lat: this.loadedPlace.location.lat,
            lng: this.loadedPlace.location.lng
          },
          selectable: false,
          closeButtonText: "Close",
          title: this.loadedPlace.location.address
        }
      })
      .then(modalEl => {
        modalEl.present();
      });
  }
  // Clear the subscription to avoid memory leaks
  ngOnDestroy() {
    if (this.placeSubscription) {
      this.placeSubscription.unsubscribe();
    }
  }
}
