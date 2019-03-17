import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlacesService } from './../../places.service';
import { Place } from '../../place.model';
import { NavController, ModalController } from '@ionic/angular';
import { CreateBookingComponent } from './../../../bookings/create-booking/create-booking.component';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  loadedPlace: Place;
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private placesService: PlacesService,
    private navController: NavController,
    private modalController: ModalController) {

  }
   ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if(!paramMap.has('placeId')) { 
        // redirect back to the places 
        this.router.navigateByUrl('/places/tabs/discover');
        return;
      }
      const placeId = paramMap.get('placeId');
      // Fetch the place 
      this.loadedPlace = this.placesService.fetchPlace(placeId);
      // console.log(this.loadedPlace);
    })
    
  }

  onBookPlace() {
    // here we want to open the modal 
    this.modalController.create({
      component: CreateBookingComponent
    }).then(modal => modal.present());
  }
}
