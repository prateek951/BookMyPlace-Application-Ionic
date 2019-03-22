//tslint:disable

import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Renderer2
} from "@angular/core";
import { ModalController } from "@ionic/angular";
import { AlertController } from "@ionic/angular";

@Component({
  selector: "app-map-modal",
  templateUrl: "./map-modal.component.html",
  styleUrls: ["./map-modal.component.scss"]
})
export class MapModalComponent implements OnInit, AfterViewInit {
  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private renderer: Renderer2
  ) {}
  // Setting up the local ref
  @ViewChild("map") mapElRef: ElementRef;

  ngOnInit() {}
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.renderGoogleMapUtils()
      .then(gmSDK => {
        //Render the google map
        const mapEl = this.mapElRef.nativeElement;
        const map = new gmSDK.Map(mapEl, {
          center: {
            lat: -34.347,
            lng: 150.644
          },
          zoom: 16
        });
        gmSDK.event.addListenerOnce(map, "idle", () => {
          this.renderer.addClass(mapEl, "visible");
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  private renderGoogleMapUtils(): Promise<any> {
    const wind = window as any;
    const googleModule = wind.google;
    //if the sdk has already been loaded
    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCjlzqDXkstsSNRZcQzmRYRYl-clXG01QM`;
      // load the script in async way
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGModule = wind.google;
        //Check again whether the google module has been loaded now
        if (loadedGModule && loadedGModule.maps) {
          resolve(loadedGModule.maps);
        } else {
          reject("Google maps SDK not available");
        }
      };
    });
  }
  onCancel() {
    this.modalCtrl.dismiss();
  }
}
