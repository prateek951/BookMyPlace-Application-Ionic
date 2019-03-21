//tslint:disable
import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { PlacesService } from "./../../places.service";
import { Place } from "../../place.model";
import {
  NavController,
  ModalController,
  ActionSheetController
} from "@ionic/angular";
import { CreateBookingComponent } from "./../../../bookings/create-booking/create-booking.component";
import { Subscription } from "rxjs";

@Component({
  selector: "app-place-detail",
  templateUrl: "./place-detail.page.html",
  styleUrls: ["./place-detail.page.scss"]
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  loadedPlace: Place;

  // Setup the subscription
  private placeSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private placesService: PlacesService,
    private navController: NavController,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController
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

      this.placeSubscription = this.placesService
        .fetchPlace(placeId)
        .subscribe(place => {
          this.loadedPlace = place;
        });
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
        }
      });
  }

  // Clear the subscription to avoid memory leaks
  ngOnDestroy() {
    this.placeSubscription.unsubscribe();
  }
}
