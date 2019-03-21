//tslint:disable
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { take, map, tap, delay, switchMap } from "rxjs/operators";
import { Place } from "./place.model";
import { AuthService } from "./../auth/auth.service";
import { HttpClient } from "@angular/common/http";

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
}

@Injectable({
  providedIn: "root"
})
export class PlacesService {
  // set up the mock data for the list of the places
  private _places = new BehaviorSubject<Place[]>([]);
  constructor(
    private authService: AuthService,
    private httpClient: HttpClient
  ) {}
  // Utility method to fetch the list of all the mock places

  fetchPlaces() {
    return this._places.asObservable();
  }

  getOfferedPlaces() {
    return this.httpClient
      .get<{ [key: string]: PlaceData }>(
        "https://awesome-places-562a3.firebaseio.com/offered-places.json"
      )
      .pipe(
        map(resData => {
          // console.log(resData);
          const places = [];
          Object.keys(resData).forEach(key => {
            let k = key;
            places.push(
              new Place(
                key,
                resData[k].title,
                resData[k].description,
                resData[k].imageUrl,
                resData[k].price,
                new Date(resData[k].availableFrom),
                new Date(resData[k].availableTo),
                resData[k].userId
              )
            );
          });
          return places;
        }),
        tap(places => {
          this._places.next(places);
        })
      );
  }

  // Utility method to fetch a specific place
  fetchPlace(id: string) {
    return this.fetchPlaces().pipe(
      take(1),
      map(places => {
        const place = places.find(p => p.id === id);
        return Object.assign({}, place);
      })
    );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    // Create a new place
    let genId: string;
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvUa3rPdQbwSfdVJ0G3fIOeHnA3vmghZheOTJwhSU_EO8cWeWUFg",
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );

    // Create a new place onto the backend server
    return this.httpClient
      .post<{ name: string }>(
        "https://awesome-places-562a3.firebaseio.com/offered-places.json",
        {
          ...newPlace,
          id: null
        }
      )
      .pipe(
        switchMap(resData => {
          genId = resData.name;
          return this.fetchPlaces();
        }),
        take(1),
        delay(1000),
        tap(places => {
          newPlace.id = genId;
          this._places.next(places.concat(newPlace));
        })
      );

    // Add the new place to the list of the places
    // Emit the new subject
    // return this.fetchPlaces().pipe(
    //   take(1),
    //   delay(1000),
    //   tap(places => {
    //     this._places.next(places.concat(newPlace));
    //   })
    // );
  }

  onUpdatePlace(
    placeId: string,
    title: string,
    description: string,
    price: number
  ) {
    //  Get the latest snapshot of the data using take
    return this.fetchPlaces().pipe(
      take(1),
      delay(1000),
      tap(places => {
        const updatedPlaceIndex = places.findIndex(p => p.id === placeId);
        const updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          // oldPlace.price,
          price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId
        );
        // Commit the latest changes
        this._places.next(updatedPlaces);
      })
    );
  }
}
