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
  marker_type: string;
  marker_title: string;
  markers: google.maps.Marker[];

  city: string;
  lng: number;
  lat: number;
  location: Object;
  apiData: Object;
  visible: boolean;
  places: Object[];

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

  getPlaces(type: string) {
    const request = {
      location: this.map.getCenter(),
      radius: 2000,
      type: type
    };

    const service = new google.maps.places.PlacesService(this.map);
    service.nearbySearch(request, results => {
      console.log(results);
      if (results.length > 0) {
        for (let i = 0; i < results.length; i++) {
          const place = results[i];
        }
        const bounds = new google.maps.LatLngBounds();
        for (let i = 0; i < results.length; i++) {
          const place = results[i];
          const image = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };

          const marker = new google.maps.Marker({
            map: this.map,
            icon: image,
            title: place.name,
            position: place.geometry.location
          });

          const li = document.createElement('li');
          li.textContent = place.name;
          marker.setVisible(this.visible);
          this.markers.push(marker);
          // placesList.appendChild(li);

          bounds.extend(place.geometry.location);
        }
        this.map.fitBounds(bounds);
      }
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

  ngOnInit() {
    this.city = '';
    this.marker_title = '';
    this.markers = [];
    this.visible = true;
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
      let url;
      let title;
      if (this.marker_title === '') {
        title = 'New marker';
      } else {
        title = this.marker_title;
      }
      switch (this.marker_type) {
        case 'restaurant': url = 'https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png'; break;
        case 'pharmacy': url = 'https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png'; break;
        case 'school': url = 'https://maps.gstatic.com/mapfiles/place_api/icons/school-71.png'; break;
        case 'gas': url = 'https://maps.gstatic.com/mapfiles/place_api/icons/gas_station-71.png'; break;
        default: url = 'https://maps.gstatic.com/mapfiles/place_api/icons/generic_business-71.png'; break;
      }
      const image = {
        url: url,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(10, 10),
        scaledSize: new google.maps.Size(25, 25)
      };
      const marker = new google.maps.Marker({
        map: this.map,
        icon: image,
        title: title,
        position: event.latLng,
        visible: this.visible
      });
      this.markers.push(marker);
      this.marker_title = '';
    });
  }



}
