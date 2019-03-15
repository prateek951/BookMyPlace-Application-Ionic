import { Component, OnInit } from '@angular/core';
import { PlacesService } from './../places.service';
import { Place } from './../place.model';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {
  loadedPlaces : Place[];
  //places that are not featured 
  nonfeaturedPlaces: Place[];

  constructor(private _placesService : PlacesService) { }

  ngOnInit() {
    //reach out to the service to get the list of the places
    this.loadedPlaces = this._placesService.fetchPlaces();
    this.nonfeaturedPlaces = this.loadedPlaces.filter(place => place.id !== this.loadedPlaces[1].id);
    console.log(this.loadedPlaces);
  }


}
