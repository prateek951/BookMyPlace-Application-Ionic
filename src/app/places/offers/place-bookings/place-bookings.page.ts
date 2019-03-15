import { Component, OnInit } from '@angular/core';
import { PlacesService } from './../../places.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Place } from '../../place.model';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-place-bookings',
  templateUrl: './place-bookings.page.html',
  styleUrls: ['./place-bookings.page.scss'],
})
export class PlaceBookingsPage implements OnInit {
  loadedPlace:Place;
  constructor(private activatedRoute: ActivatedRoute,private router:Router,private placesService: PlacesService,private navController: NavController) { }
  
  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => { 
      if(!paramMap.has('placeId')) { 
        //redirect 
        // this.router.navigateByUrl('/places/tabs/offers');
        this.navController.navigateBack('/places/tabs/offers');
        return;
      }
      const placeId = paramMap.get('placeId');
      this.loadedPlace = this.placesService.fetchPlace(placeId);
    })
  }

}
