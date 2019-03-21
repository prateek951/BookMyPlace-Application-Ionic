import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { take, map, tap, delay } from "rxjs/operators";
import { Place } from "./place.model";
import { AuthService } from "./../auth/auth.service";

@Injectable({
  providedIn: "root"
})
export class PlacesService {
  // set up the mock data for the list of the places
  private _places = new BehaviorSubject<Place[]>([
    new Place(
      "p1",
      "Manhattan Mansion",
      "In the heart of the New York City",
      "https://imgs.6sqft.com/wp-content/uploads/2014/06/21042537/harkness_mansion_gagosian.jpg",
      149.9,
      new Date("2019-01-01"),
      new Date("2019-12-31"),
      "dummy"
    ),
    new Place(
      "p2",
      "Taj Mahal",
      "An immense mausoleum of white marble, built in Agra between 1631 and 1648 by order of the Mughal emperor Shah Jahan in memory of his favourite wife, the Taj Mahal is the jewel of Muslim art in India and one of the universally admired masterpieces of the world heritage.",
      "https://media.gettyimages.com/photos/diana-princess-of-wales-sits-in-front-of-the-taj-mahal-during-a-visit-picture-id79730657?s=612x612",
      2099,
      new Date("2019-01-01"),
      new Date("2019-12-31"),
      "dummy"
    ),
    new Place(
      "p3",
      "The Foggy Palace",
      "Not your average city trip",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvUa3rPdQbwSfdVJ0G3fIOeHnA3vmghZheOTJwhSU_EO8cWeWUFg",
      99.99,
      new Date("2019-01-01"),
      new Date("2019-12-31"),
      "dummy"
    )
  ]);
  constructor(private authService: AuthService) {}
  // Utility method to fetch the list of all the mock places

  fetchPlaces() {
    return this._places.asObservable();
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

    // Add the new place to the list of the places
    // Emit the new subject
    return this.fetchPlaces().pipe(
      take(1),
      delay(1000),
      tap(places => {
        this._places.next(places.concat(newPlace));
      })
    );
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
