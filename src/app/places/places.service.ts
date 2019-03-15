import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  //set up the mock data for the list of the places 
  private _places:Place[] = [
      new Place('p1','Manhattan Mansion',
      'In the heart of the New York City',
      'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042537/harkness_mansion_gagosian.jpg'
      ,149.9),
      new Place('p2',
      'Taj Mahal',
      'An immense mausoleum of white marble, built in Agra between 1631 and 1648 by order of the Mughal emperor Shah Jahan in memory of his favourite wife, the Taj Mahal is the jewel of Muslim art in India and one of the universally admired masterpieces of the world heritage.'
      ,'https://media.gettyimages.com/photos/diana-princess-of-wales-sits-in-front-of-the-taj-mahal-during-a-visit-picture-id79730657?s=612x612',
      2099),
      new Place('p3',
      'The Foggy Palace',
      'Not your average city trip'
      ,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvUa3rPdQbwSfdVJ0G3fIOeHnA3vmghZheOTJwhSU_EO8cWeWUFg',
      99.99)
  ];

  //Utility method to fetch the list of all the mock places
  
  fetchPlaces() { 
    return [...this._places];
  }

  //Utility method to fetch a specific place 
  fetchPlace(id: string) { 
    const place = this._places.find(p => p.id === id);
    return Object.assign({},place);
  }
  

  constructor() { }
}
