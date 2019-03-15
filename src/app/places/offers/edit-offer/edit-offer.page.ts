import { Component, OnInit } from '@angular/core';
import { Place } from './../../place.model';
import { PlacesService } from './../../places.service';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit {
  placeToBeEdited:Place;
  constructor(private route: ActivatedRoute, private placesService:PlacesService,private navController: NavController) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => { 
      //Check for the dynamic segment placeId 
      //If it is not found simply redirect back to the /offers/:placeId 
      if(!paramMap.has('placeId')) { 
       //redirect
        this.navController.navigateBack('/places/tabs/offers');
        return; 
      }
      //If we have the placeId then get that place from the url params 
      this.placeToBeEdited = this.placesService.fetchPlace(paramMap.get('placeId'));
      console.log(this.placeToBeEdited);
    })
  }

}
