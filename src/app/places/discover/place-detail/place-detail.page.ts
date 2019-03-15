import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlacesService } from './../../places.service';
import { Place } from '../../place.model';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  loadedPlace:Place;
  constructor(private activatedRoute: ActivatedRoute, private router: Router,private placesService : PlacesService,private navController: NavController) { 

  }
   ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if(!paramMap.has('placeId')) { 
        //redirect back to the places 
        this.router.navigate(['/']);
        return;
      }
      const placeId = paramMap.get('placeId');
      //Fetch the place 
      this.loadedPlace = this.placesService.fetchPlace(placeId);
      // console.log(this.loadedPlace);
    })
    
  }

  onBookPlace() { 
    this.navController.navigateBack('/places/tabs/discover');
  }
}
