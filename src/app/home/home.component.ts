import {Component, OnInit, ViewChild} from '@angular/core';
import {APIServiceClient} from '../services/APIServiceClient';
import {UserServiceClient} from '../services/user.service.client';
import {User} from '../models/user.model.client';
import {} from '@types/googlemaps';
import {Router} from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  infoWindow: google.maps.InfoWindow;
  marker_type: string;
  marker_title: string;
  markers: google.maps.Marker[];
  city: string;
  lng: number;
  lat: number;
  visible: boolean;
  loggedIn: boolean;
  user: User;

  constructor(private apiService: APIServiceClient, private userService: UserServiceClient, private router: Router) {
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

  getPlaces(type: string) {
    const request = {
      location: this.map.getCenter(),
      radius: 1000,
      type: type
    }
    const service = new google.maps.places.PlacesService(this.map);
    service.nearbySearch(request, results => {
      if (results.length > 0) {
        for (let i = 0; i < results.length; i++) {
          const place = results[i];
        }
        const bounds = new google.maps.LatLngBounds();
        for (let i = 0; i < results.length; i++) {
          const place = results[i];
          this.createMarker(place.geometry.location, place.name, place.icon)
          bounds.extend(place.geometry.location);
        }
        this.map.fitBounds(bounds);
      } else {
        alert('Nothing is found');
      }
    });
  }


  setCenter() {
    this.map.setCenter(new google.maps.LatLng(this.lat, this.lng));
  }

  save() {
    if (this.loggedIn) {
      this.user.markers = this.markers.map(m => (
        {
          lat: m.getPosition().lat(),
          lng: m.getPosition().lng(),
          title: m.title,
          type: m.icon.url
        }));
      this.userService.updateUser(this.user);
    } else {
      alert('You need to Sign In first');
      this.router.navigate(['login']);
    }
  }

  createMarker(latLng, title, type) {
    const image = {
      url: type,
      size: new google.maps.Size(25, 25),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(12, 12),
      scaledSize: new google.maps.Size(25, 25)
    };
    const marker = new google.maps.Marker({
      map: this.map,
      icon: image,
      title: title,
      position: latLng,
      visible: this.visible
    });
    this.markers.push(marker);
  }

  deleteMarkers() {
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

  setCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.infoWindow.setPosition(new google.maps.LatLng(this.lat, this.lng));
        this.infoWindow.setContent('You are here');
        this.infoWindow.open(this.map);
        this.setCenter();
      }, function () {
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
    this.markers = [];
    this.loggedIn = false;
    this.visible = true;
    this.city = '';
    this.marker_title = '';

    const mapProp = {
      center: new google.maps.LatLng(50.4501, 30.5234),
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      draggableCursor: 'default'
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    this.infoWindow = new google.maps.InfoWindow;
    this.setCurrentLocation();

    google.maps.event.addListener(this.map, 'click', (event) => {
      let url;
      let title;
      if (this.marker_title === '') {
        title = 'New marker';
      } else {
        title = this.marker_title;
      }
      this.marker_title = '';
      switch (this.marker_type) {
        case 'restaurant':
          url = 'https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png';
          break;
        case 'pharmacy':
          url = 'https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png';
          break;
        case 'school':
          url = 'https://maps.gstatic.com/mapfiles/place_api/icons/school-71.png';
          break;
        case 'gas':
          url = 'https://maps.gstatic.com/mapfiles/place_api/icons/gas_station-71.png';
          break;
        default:
          url = 'https://maps.gstatic.com/mapfiles/place_api/icons/generic_business-71.png';
          break;
      }
      this.createMarker(event.latLng, title, url);
    });

    this.userService.checkStatus()
      .then((res) => {
        if (res) {
          this.loggedIn = true;
          return this.userService.profile()
        } else {
          this.loggedIn = false;
          return null;
        }
      })
      .then(res => {
        this.user = res;
        if (res){
          for (const m of this.user.markers) {
            this.createMarker(new google.maps.LatLng(m.lat, m.lng), m.title, m.type);
          }
        }
      });
  }

}
