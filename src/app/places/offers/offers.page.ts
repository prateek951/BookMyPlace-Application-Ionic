import { Component, OnInit } from '@angular/core';
import { PlacesService } from './../places.service';
import { Place } from '../place.model';
@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
  loadedOffers:Place[];
  constructor(private _placesService : PlacesService) { }

  ngOnInit() {
    // retrieve the list of all the offers that are there on oofers 
    // for places 
    this.loadedOffers = this._placesService.fetchPlaces();
  }
}
