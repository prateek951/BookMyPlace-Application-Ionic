//tslint:disable
import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import {
  ModalController,
  ActionSheetController,
  AlertController
} from "@ionic/angular";
import { MapModalComponent } from "./../../map-modal/map-modal.component";
import { HttpClient } from "@angular/common/http";
import { environment } from "./../../../../environments/environment";
import { map } from "rxjs/operators";
import { switchMap } from "rxjs/operators";
import { PlaceLocation, Coordinates } from "../../../places/location.model";
import { of } from "rxjs";
// Capacitor Plugins
import { Plugins, Capacitor, Geolocation } from "@capacitor/core";

@Component({
  selector: "app-location-picker",
  templateUrl: "./location-picker.component.html",
  styleUrls: ["./location-picker.component.scss"]
})
export class LocationPickerComponent implements OnInit {
  selectedLocationImage: string;
  isLoading = false;

  //setup the event emitter

  @Output() locationPicked = new EventEmitter<PlaceLocation>();

  constructor(
    private modalCtrl: ModalController,
    private httpClient: HttpClient,
    private actionSheetController: ActionSheetController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}
  onPickLocation() {
    this.actionSheetController
      .create({
        header: "Please choose",
        buttons: [
          {
            text: "Auto-locate",
            handler: () => {
              //  this will use the geolocation plugin
              this.geolocateUser();
            }
          },
          {
            text: "Pick on Map",
            handler: () => {
              //here we will pick on the map which is the mapmodal
              this.openMapModal();
            }
          },
          {
            text: "Cancel",
            // handler: () => {}
            role: "cancel"
          }
        ]
      })
      .then(actionSheetEl => {
        actionSheetEl.present();
      });
  }

  // Method to provide the geolocation of the location and accordingly
  // select a place based on that
  private geolocateUser() {
    // Ensure that the permissions for the geolocation api are already set
    // Check whether the plugin is available or not (fallback)
    if (!Capacitor.isPluginAvailable("Geolocation")) {
      this.showErrorAlert();
      return;
    }
    //set loading to true
    this.isLoading = true;
    Plugins.Geolocation.getCurrentPosition()
      .then(geoPosition => {
        const coordinates: Coordinates = {
          lat: geoPosition.coords.latitude,
          lng: geoPosition.coords.longitude
        };
        this.createPickedPlace(coordinates.lat, coordinates.lng);
        //set loading to false
        this.isLoading = false;
      })
      .catch(err => {
        this.isLoading = false;
        this.showErrorAlert();
      });
  }

  private showErrorAlert() {
    this.alertCtrl
      .create({
        header: "Could not fetch the location",
        message: "Please use the map to pick a new location",
        buttons: ["Okay"]
      })
      .then(alertEl => {
        alertEl.present();
      });
  }

  // User preference to open the map modal instead of using the geolocation
  private openMapModal() {
    this.modalCtrl
      .create({
        component: MapModalComponent
      })
      .then(modalEl => {
        modalEl.onDidDismiss().then(modData => {
          // console.log(modData.data); this has the lat and long for which
          // we need the address
          if (!modData.data) {
            return;
          }
          const coordinates: Coordinates = {
            lat: modData.data.lat,
            lng: modData.data.lng
          };
          this.createPickedPlace(coordinates.lat, coordinates.lng);
        });
        modalEl.present();
      });
  }
  private createPickedPlace(lat: number, lng: number) {
    // Create the picked location object
    const pickedLocation: PlaceLocation = {
      lat,
      lng,
      address: null,
      staticImageUrl: null
    };
    //set the loading to true
    this.isLoading = true;
    this.getAddressFromCoords(lat, lng)
      .pipe(
        switchMap(address => {
          // Set the address that we fetched
          pickedLocation.address = address;
          return of(
            this.fetchStaticImage(pickedLocation.lat, pickedLocation.lng, 14)
          );
        })
      )
      .subscribe(staticImageUrl => {
        pickedLocation.staticImageUrl = staticImageUrl;
        this.selectedLocationImage = staticImageUrl;
        this.isLoading = false;
        this.locationPicked.emit(pickedLocation);
      });
  }

  private fetchStaticImage(lat: number, lng: number, zoom: number) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap
    &markers=color:blue%7Clabel:Place%7C${lat},${lng}
  &key=${environment.GOOGLE_MAPS_API_KEY}`;
  }

  private getAddressFromCoords(lat: number, lng: number) {
    // Tap the Google Maps API key
    const { GOOGLE_MAPS_API_KEY } = environment;

    // Get the address for the lat and lng

    return this.httpClient
      .get<any>(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
      )
      .pipe(
        map(geoData => {
          if (!geoData || !geoData.results || geoData.results.length === 0) {
            return null;
          }
          // Return the first address only
          return geoData.results[0].formatted_address;
        })
      );
  }
}
