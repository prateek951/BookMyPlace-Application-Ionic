//tslint:disable
import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { MapModalComponent } from "./../../map-modal/map-modal.component";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: "app-location-picker",
  templateUrl: "./location-picker.component.html",
  styleUrls: ["./location-picker.component.scss"]
})
export class LocationPickerComponent implements OnInit {
  constructor(private modalCtrl: ModalController, private httpClient: HttpClient) {}

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
        });
        modalEl.present();
      });
  }
  private getAddressFromCoords(lat: number, lng: number) { 
    // Get the address for the lat and lng 
    this.httpClient.get()
  }





}
