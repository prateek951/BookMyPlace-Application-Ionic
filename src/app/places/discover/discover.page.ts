//tslint:disable
import { Component, OnInit, OnDestroy } from "@angular/core";
import { PlacesService } from "./../places.service";
import { Place } from "./../place.model";
import { MenuController } from "@ionic/angular";
import { SegmentChangeEventDetail } from "@ionic/core";
import { Subscription } from "rxjs";
import { AuthService } from "./../../auth/auth.service";
import { take } from 'rxjs/operators';

@Component({
  selector: "app-discover",
  templateUrl: "./discover.page.html",
  styleUrls: ["./discover.page.scss"]
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Place[];
  relevantPlaces: Place[];
  isLoading: boolean = false;

  // Create a subscription
  private placesSubscription: Subscription;

  constructor(
    private placesService: PlacesService,
    private authService: AuthService,
    private menuController: MenuController
  ) {}

  ngOnInit() {
    // reach out to the service to get the list of the places
    // Store the subscription
    this.placesSubscription = this.placesService
      .fetchPlaces()
      .subscribe(places => {
        this.loadedPlaces = places;
        this.relevantPlaces = this.loadedPlaces;
      });
    // console.log(this.loadedPlaces);
  }
  // onOpenMenu() {
  //   this.menuController.toggle();
  // }
  ionViewWillEnter() {
    this.isLoading = true;
    this.placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
  }

  onFilterPlaces(e: CustomEvent<SegmentChangeEventDetail>) {
    this.authService.userId.pipe(take(1)).subscribe(userId => {
      // console.log(e.detail);
      if (e.detail.value === "all") {
        this.relevantPlaces = this.loadedPlaces;
      } else {
        // in case of bookable places
        //get the list of all those places that are not created by me
        //since only those are the ones that I can book

        this.relevantPlaces = this.loadedPlaces.filter(
          p => p.userId !== userId
        );
      }
    });
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.

    if (this.placesSubscription) {
      this.placesSubscription.unsubscribe();
    }
  }
}
