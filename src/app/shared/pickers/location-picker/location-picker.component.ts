//tslint:disable
import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { MapModalComponent } from "./../../map-modal/map-modal.component";
import { HttpClient } from "@angular/common/http";
import { environment } from "./../../../../environments/environment";
import { map } from "rxjs/operators";
@Component({
  selector: "app-location-picker",
  templateUrl: "./location-picker.component.html",
  styleUrls: ["./location-picker.component.scss"]
})
export class LocationPickerComponent implements OnInit {
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
          const { lat, lng } = modData.data;
          if (!modData.data) {
            return;
          }
          this.getAddressFromCoords(lat, lng).subscribe(address => {
            console.log(address);
          });
        });
        modalEl.present();
      });
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
