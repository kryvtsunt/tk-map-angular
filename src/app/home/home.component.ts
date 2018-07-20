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
  marker: google.maps.Marker;
  markers: google.maps.Marker[];

  city: string;
  lng: number;
  lat: number;
  location: Object;
  apiData: Object;
  visible: boolean;

  constructor(private apiService: APIServiceClient) {
  }

  getLocation() {
    this.apiService.getLocation(this.city)
      .then(res => {
        this.lat = res.results[0].geometry.location.lat;
        this.lng = res.results[0].geometry.location.lng;
        this.city = res.results[0].formatted_address;
        this.setCenter();
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

  deleteMarkers(){
    for (const marker of this.markers) {
      marker.setMap(null);
    }
    this.markers = [];
  }

  changeVisibility() {
    this.visible = !this.visible;
    for (const marker of this.markers) {
      marker.setVisible(this.visible);
    }
  }

  ngOnInit() {
    this.city = '';
    this.markers = [];
    this.visible = false;
    const mapProp = {
      center: new google.maps.LatLng(50.4501, 30.5234),
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      draggableCursor: 'default'
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    this.infoWindow = new google.maps.InfoWindow;
    this.setCurrentLocation();

    google.maps.event.addListener(this.map, 'click', (event) => {
      const marker = new google.maps.Marker;
      marker.setPosition(event.latLng);
      marker.setMap(this.map);
      marker.setVisible(this.visible);
      this.markers.push(marker);
      console.log(this.markers);
    });
  }



}
