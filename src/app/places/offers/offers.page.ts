import { Component, OnInit, OnDestroy } from "@angular/core";
import { PlacesService } from "./../places.service";
import { Place } from "../place.model";
import { IonItemSliding } from "@ionic/angular";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
@Component({
  selector: "app-offers",
  templateUrl: "./offers.page.html",
  styleUrls: ["./offers.page.scss"]
})
export class OffersPage implements OnInit, OnDestroy {
  loadedOffers: Place[];
  // To avoid the memory leaks, clear the subscription
  private placesSubscription: Subscription;

  constructor(private placesService: PlacesService, private router: Router) {}

  ngOnInit() {
    // retrieve the list of all the offers that are there on oofers
    // for places
    // Store the subscription here
    this.placesSubscription = this.placesService
      .fetchPlaces()
      .subscribe(places => {
        this.loadedOffers = places;
      });
  }

  onEdit(id: string, slidingNavigate: IonItemSliding) {
    slidingNavigate.close();
    this.router.navigate(["/", "places", "tabs", "offers", "edit", id]);
    console.log("Editing item", id);
  }
  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    if (this.placesSubscription) {
      this.placesSubscription.unsubscribe();
    }
  }
}
