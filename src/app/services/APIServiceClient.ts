import {Injectable} from '@angular/core';

@Injectable()
export class APIServiceClient {


  // Google Geocoding API
  getLocation(city: string) {
    const url = 'https://maps.google.com/maps/api/geocode/json?key=AIzaSyCBLdVMhMOKW4BbtLLfSZoYz_pL61Uz4Qk&address=' + city;
    return fetch(url).then(response => response.json());
  }

}
