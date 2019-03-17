import { Component, OnInit } from '@angular/core';
import { PlacesService } from './../places.service';
import { Place } from '../place.model';
import { IonItemSliding } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
  loadedOffers:Place[];
  constructor(private _placesService : PlacesService, private router: Router) { }

  ngOnInit() {
    // retrieve the list of all the offers that are there on oofers 
    // for places 
    this.loadedOffers = this._placesService.fetchPlaces();
  }

  onEdit(id: string, slidingNavigate: IonItemSliding) { 
    slidingNavigate.close();
    this.router.navigate(['/','places','tabs','offers','edit',id]);
    console.log('Editing item', id);
  }

}
