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

  constructor(private placesService : PlacesService) { }

  ngOnInit() {
    //reach out to the service to get the list of the places
    this.loadedPlaces = this.placesService.fetchPlaces();
    console.log(this.loadedPlaces);
  }


}
