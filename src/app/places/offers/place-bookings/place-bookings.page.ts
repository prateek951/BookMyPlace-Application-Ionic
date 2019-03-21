//tslint:disable
import { Component, OnInit, OnDestroy } from "@angular/core";
import { PlacesService } from "./../../places.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Place } from "../../place.model";
import { Subscription } from "rxjs";
import { NavController } from "@ionic/angular";

@Component({
  selector: "app-place-bookings",
  templateUrl: "./place-bookings.page.html",
  styleUrls: ["./place-bookings.page.scss"]
})
export class PlaceBookingsPage implements OnInit, OnDestroy {
  loadedPlace: Place;

  // Create the subscription
  private placeSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private placesService: PlacesService,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has("placeId")) {
        //redirect
        // this.router.navigateByUrl('/places/tabs/offers');
        this.navController.navigateBack("/places/tabs/offers");
        return;
      }
      const placeId = paramMap.get("placeId");
      this.placeSubscription = this.placesService
        .fetchPlace(placeId)
        .subscribe(place => {
          this.loadedPlace = place;
        });
    });
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    
    // Clear the subscription since we do not need it any more now 
    if (this.placeSubscription) {
      this.placeSubscription.unsubscribe();
    }
  }
}
