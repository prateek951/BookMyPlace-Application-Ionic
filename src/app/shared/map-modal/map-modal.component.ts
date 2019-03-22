//tslint:disable

import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Renderer2,
  OnDestroy,
  Input
} from "@angular/core";
import { ModalController, AlertController } from "@ionic/angular";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-map-modal",
  templateUrl: "./map-modal.component.html",
  styleUrls: ["./map-modal.component.scss"]
})
export class MapModalComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private renderer: Renderer2
  ) {}
  // Setting up the local ref
  @ViewChild("map") mapElRef: ElementRef;
  googleMaps: any;
  clickListener: any;
  @Input() center = {
    lat: -34.347,
    lng: 150.644
  };
  @Input() selectable = true;
  @Input() closeButtonText = "Cancel";
  @Input() title = 'Pick a location'


  ngOnInit() {}
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.renderGoogleMapUtils()
      .then(gmSDK => {
        this.googleMaps = gmSDK;

        //Render the google map
        const mapEl = this.mapElRef.nativeElement;
        const map = new gmSDK.Map(mapEl, {
          center: this.center,
          zoom: 16
        });
        gmSDK.event.addListenerOnce(map, "idle", () => {
          this.renderer.addClass(mapEl, "visible");
        });
        if(this.selectable) { 
          // Picking locations via  a click on the map
          this.clickListener = map.addListener("click", event => {
            // on the click we select the coordinates
            const coords = {
              lat: event.latLng.lat(),
              lng: event.latLng.lng()
            };
            // pass the coords
            this.modalCtrl.dismiss(coords);
          });
        }else { 
          const marker = new this.googleMaps.Marker({
            position: this.center,
            map : map,
            title : 'Picked Location'
          });
          marker.setMap(map);
        }
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
      const { GOOGLE_MAPS_API_KEY } = environment;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
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
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.clickListener) { 
      this.googleMaps.event.removeListener(this.clickListener);
    }
  }
}
