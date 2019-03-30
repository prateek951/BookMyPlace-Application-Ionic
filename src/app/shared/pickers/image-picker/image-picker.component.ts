//tslint:disable
import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import {
  Plugins,
  Capacitor,
  CameraSource,
  CameraResultType
} from "@capacitor/core";
import { AlertController } from "@ionic/angular";

@Component({
  selector: "app-image-picker",
  templateUrl: "./image-picker.component.html",
  styleUrls: ["./image-picker.component.scss"]
})
export class ImagePickerComponent implements OnInit {
  selectedImage: string;
  @Output() imagePicked = new EventEmitter<string>();
  constructor(private alertCtrl: AlertController) {}
  onPickImage() {
    // Check whether the camera plugin is available or not
    //fallback check
    if (!Capacitor.isPluginAvailable("Camera")) {
      this.alertCtrl
        .create({
          header: "Could not enable the camera. You are using a legacy device",
          message: "Camera feature not supported for your device"
        })
        .then(alertEl => {
          alertEl.present();
        });
      return;
    }
    // If the camera feature is available make use of that and select a location
    Plugins.Camera.getPhoto({
      quality: 50,
      source: CameraSource.Prompt,
      correctOrientation: true,
      // height: 320,
      width: 600,
      resultType: CameraResultType.Base64
    })
      .then(image => {
        this.selectedImage = image.base64Data;
        this.imagePicked.emit(image.base64Data);
      })
      .catch(err => {
        console.log(err);
        return false;
      });
  }
  ngOnInit() {}
}
