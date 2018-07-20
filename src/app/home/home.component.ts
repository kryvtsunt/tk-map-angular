import {Component, OnInit, ViewChild} from '@angular/core';
import {APIServiceClient} from '../services/APIServiceClient';
import {} from '@types/googlemaps';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  infoWindow: google.maps.InfoWindow;

  city: string;
  lng: number;
  lat: number;
  location: Object;
  apiData: Object;

  constructor(private apiService: APIServiceClient) {
  }

  getLocation() {
    this.apiService.getLocation(this.city)
      .then(res => {
        this.lat = res.results[0].geometry.location.lat;
        this.lng = res.results[0].geometry.location.lng;
        this.city = res.results[0].formatted_address;
        this.setCenter();
        this.getData();
      });
  }


  getData() {
    this.apiService.getAPIData(this.lat, this.lng)
      .then(result => {
        this.apiData = result;
      });
  }

  setCenter() {
    this.map.setCenter(new google.maps.LatLng(this.lat, this.lng));
  }

  setCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat =  position.coords.latitude;
        this.lng = position.coords.longitude;
        this.infoWindow.setPosition(new google.maps.LatLng(this.lat, this.lng));
        this.infoWindow.setContent('You are here');
        this.infoWindow.open(this.map);
        this.setCenter();
        this.getData();
      }, function() {
        this.handleLocationError(true, this.infoWindow, this.map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      this.handleLocationError(false, this.infoWindow, this.map.getCenter());
    }
  }

  handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(this.map);
  }

  ngOnInit() {
    this.city = '';
    const mapProp = {
      center: new google.maps.LatLng(50.4501, 30.5234),
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    this.infoWindow = new google.maps.InfoWindow;
    this.setCurrentLocation();
  }


}
