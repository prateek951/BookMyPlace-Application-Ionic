import { Component, OnInit } from '@angular/core';
import { PlacesService } from './../places.service';
import { Place } from './../place.model';
import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {
  loadedPlaces : Place[];
  // places that are not featured 
  nonFeaturedPlaces: Place[];

  constructor(private _placesService : PlacesService, private menuController: MenuController) { }

  ngOnInit() {
    // reach out to the service to get the list of the places
    this.loadedPlaces = this._placesService.fetchPlaces();
    this.nonFeaturedPlaces = this.loadedPlaces.filter(place => place.id !== this.loadedPlaces[1].id);
    console.log(this.loadedPlaces);
  }
  // onOpenMenu() { 
  //   this.menuController.toggle();
  // }
  onFilterPlaces(e: CustomEvent<SegmentChangeEventDetail>) {
    console.log(e.detail);
  }
}
