import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { PlacesService } from "./../../places.service";
import { Router } from "@angular/router";
import { LoadingController } from "@ionic/angular";
import { PlaceLocation } from "../../../places/location.model";

@Component({
  selector: "app-new-offer",
  templateUrl: "./new-offer.page.html",
  styleUrls: ["./new-offer.page.scss"]
})
export class NewOfferPage implements OnInit {
  // Set up the form group
  form: FormGroup;
  // Set up the isLoading state
  // isLoading: boolean = false;
  constructor(
    private placesService: PlacesService,
    private router: Router,
    private loaderController: LoadingController
  ) {}

  onCreateOffer() {
    // console.log("inside the onCreateOffer component..");
    if (this.form.invalid) {
      return;
    }
    // If the form is valid
    // Add the new offer to the list of the places that is managed by the places service
    // Tap the new offer fields
    const {
      title,
      description,
      price,
      dateFrom,
      dateTo,
      location
    } = this.form.value;
    // console.log(title);
    // Create a new offer
    this.loaderController
      .create({
        message: `Creating ${title}..`
      })
      .then(loadingEl => {
        loadingEl.present();
        this.placesService
          .addPlace(
            title,
            description,
            parseFloat(price),
            new Date(dateFrom),
            new Date(dateTo),
            location
          )
          .subscribe(() => {
            // Dismiss the overlay
            loadingEl.dismiss();
            // Set isLoading to false

            // Reset the form and navigate
            this.form.reset();
            this.router.navigateByUrl("/places/tabs/offers");
          });
      });
  }

  onReceiveLocation(location: PlaceLocation) {
    // console.log(location); got the location
    this.form.patchValue({ location: location });
  }
  onReceiveImage(imageData: string) {
    console.log(imageData);
  }

  ngOnInit() {
    this.form = new FormGroup({
      // Set up the form controls
      title: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required]
      }),
      description: new FormControl(null, {
        updateOn: "blur",
        validators: [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(180)
        ]
      }),
      price: new FormControl(null, {
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
      }),
      location: new FormControl(null, {
        validators: [Validators.required]
      })
    });
  }
}
