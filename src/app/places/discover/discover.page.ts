import { Component, OnInit, OnDestroy } from "@angular/core";
import { PlacesService } from "./../places.service";
import { Place } from "./../place.model";
import { MenuController } from "@ionic/angular";
import { SegmentChangeEventDetail } from "@ionic/core";
import { Subscription } from "rxjs";

@Component({
  selector: "app-discover",
  templateUrl: "./discover.page.html",
  styleUrls: ["./discover.page.scss"]
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Place[];

  // Create a subscription
  private placesSubscription: Subscription;

  constructor(
    private placesService: PlacesService,
    private menuController: MenuController
  ) {}

  ngOnInit() {
    // reach out to the service to get the list of the places
    // Store the subscription

    this.placesSubscription = this.placesService
      .fetchPlaces()
      .subscribe(places => {
        this.loadedPlaces = places;
      });
    // console.log(this.loadedPlaces);
  }
  // onOpenMenu() {
  //   this.menuController.toggle();
  // }
  onFilterPlaces(e: CustomEvent<SegmentChangeEventDetail>) {
    console.log(e.detail);
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.

    if (this.placesSubscription) {
      this.placesSubscription.unsubscribe();
    }
  }
}
