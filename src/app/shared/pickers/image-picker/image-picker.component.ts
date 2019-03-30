//tslint:disable
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef
} from "@angular/core";
import {
  Plugins,
  Capacitor,
  CameraSource,
  CameraResultType
} from "@capacitor/core";
import { AlertController } from "@ionic/angular";
import { Platform } from "@ionic/angular";

@Component({
  selector: "app-image-picker",
  templateUrl: "./image-picker.component.html",
  styleUrls: ["./image-picker.component.scss"]
})
export class ImagePickerComponent implements OnInit {
  //set the ref property
  @ViewChild("filePicker") filePicker: ElementRef<HTMLInputElement>;

  selectedImage: string;
  usePicker: boolean = false;
  //emit the event when the image gets picked up here

  @Output() imagePicked = new EventEmitter<string>();
  constructor(private alertCtrl: AlertController, private platform: Platform) {}

  onPickImage() {
    // Check whether the camera plugin is available or not
    //fallback check
    if (!Capacitor.isPluginAvailable("Camera") || this.usePicker) {
      // this.alertCtrl
      //   .create({
      //     header: "Could not enable the camera. You are using a legacy device",
      //     message: "Camera feature not supported for your device"
      //   })
      //   .then(alertEl => {
      //     alertEl.present();
      //   });
      this.filePicker.nativeElement.click();
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

  onFileChosen(event: Event) {
    const chosenFile = (event.target as HTMLInputElement).files[0];
    // if no chosen file
    if (!chosenFile) {
      return;
    }
    // start reading the file 
    const fr = new FileReader();
    // convert the file to base64
    fr.onload = () => { 
      const dataUrl = fr.result.toString();
      this.selectedImage = dataUrl;
    };
    fr.readAsDataURL(chosenFile);
  }

  ngOnInit() {
    console.log("Hybrid : ", this.platform.is("hybrid"));
    console.log("Mobile : ", this.platform.is("mobile"));
    console.log("IOS : ", this.platform.is("ios"));
    console.log("Android : ", this.platform.is("android"));
    console.log("Desktop : ", this.platform.is("desktop"));
    // If the platform is mobile then we can use the image picker
    // otherwise not
    if (
      (this.platform.is("mobile") && !this.platform.is("hybrid")) ||
      this.platform.is("desktop")
    ) {
      //console.log('wont be able to access the device camera pick a file')
      this.usePicker = true;
    }
  }
}
