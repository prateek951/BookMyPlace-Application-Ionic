//tslint:disable
import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { MapModalComponent } from "./../../map-modal/map-modal.component";
import { HttpClient } from "@angular/common/http";
import { environment } from "./../../../../environments/environment";
import { map } from "rxjs/operators";
import { switchMap } from "rxjs/operators";
import { PlaceLocation } from "../../../places/location.model";
import { of } from "rxjs";
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
    private httpClient: HttpClient
  ) {}

  ngOnInit() {}
  onPickLocation() {
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
          // If have the modal data
          const { lat, lng } = modData.data;
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
                  this.fetchStaticImage(
                    pickedLocation.lat,
                    pickedLocation.lng,
                    14
                  )
                );
              })
            )
            .subscribe(staticImageUrl => {
              pickedLocation.staticImageUrl = staticImageUrl;
              this.selectedLocationImage = staticImageUrl;
              this.isLoading = false;
              this.locationPicked.emit(pickedLocation);
            });
        });
        modalEl.present();
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
