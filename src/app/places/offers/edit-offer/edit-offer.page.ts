//tslint:disable

import { Component, OnInit, OnDestroy } from "@angular/core";
import { Place } from "./../../place.model";
import { PlacesService } from "./../../places.service";
import { NavController } from "@ionic/angular";
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
  selector: "app-edit-offer",
  templateUrl: "./edit-offer.page.html",
  styleUrls: ["./edit-offer.page.scss"]
})
export class EditOfferPage implements OnInit, OnDestroy {
  // Set the form group
  editForm: FormGroup;
  placeToBeEdited: Place;

  // Create a place subscription
  private placeSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      // Check for the dynamic segment placeId
      // If it is not found simply redirect back to the /offers/:placeId
      if (!paramMap.has("placeId")) {
        // Redirect
        this.navController.navigateBack("/places/tabs/offers");
        return;
      }
      // If we have the placeId then get that place from the url params
      this.placeSubscription = this.placesService
        .fetchPlace(paramMap.get("placeId"))
        .subscribe(place => {
          this.placeToBeEdited = place;
          this.editForm = new FormGroup({
            // Set the form controls
            title: new FormControl(this.placeToBeEdited.title, {
              updateOn: "blur",
              validators: [Validators.required]
            }),
            description: new FormControl(this.placeToBeEdited.description, {
              updateOn: "blur",
              validators: [
                Validators.required,
                Validators.minLength(5),
                Validators.maxLength(180)
              ]
            }),
            price: new FormControl(this.placeToBeEdited.price, {
              updateOn: "blur",
              validators: [Validators.required, Validators.min(49.9)]
            }),
            dateFrom: new FormControl(null, {
              updateOn: "blur",
              validators: [Validators.required]
            }),
            dateTo: new FormControl(null, {
              updateOn: "blur",
              validators: [Validators.required]
            })
          });
        });
    });
  }
  onUpdateOffer() {
    console.log("Updating the offer...");
    // Check whether the form is valid, if invalid return
    if (!this.editForm.valid) {
      return;
    }
    // If the form is valid, tap the fields and make an update request
    console.log(this.editForm.controls["title"].value);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.placeSubscription) {
      this.placeSubscription.unsubscribe();
    }
  }
}
