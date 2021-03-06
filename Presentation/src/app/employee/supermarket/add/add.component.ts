import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { StoreService } from './../../../services/store/store.service';

declare const google: any;

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  public userinfo = {};
  public searched = false;
  public location = {
    latitude: 9.867769,
    longitude: -83.904424
  };
  public supermarket = {
    localName: 'Walmart',
    description: 'Walmart Inc. is an American multinational retail corporation that operates a chain of hypermarkets, ' +
      'discount department stores, and grocery stores, headquartered in Bentonville, Arkansas. The company was founded ' +
      'by Sam Walton in 1962 and incorporated on October 31, 1969.',
    address: 'De la Basílica de los Ángeles 800m camino a Paraíso frente a la Bomba Los Ángeles, 10, Provincia de Cartago',
    phone: '1-800-925-6278',
    schedule: '9:00am-10:00pm',
    website: 'https://www.walmart.com/',
    rating: 0
  };
  public map;

  constructor(private router: Router,
    private storeService: StoreService) { }

  ngOnInit() {
    this.updateMap(this.location.latitude, this.location.longitude);
  }

  public save(isValid, info) {
    if (isValid && this.searched) {
      const store = {
        id_store: info.localName,
        name: info.localName,
        description: info.description,
        address: info.address,
        lat: info.latitude,
        long: info.longitude,
        img: 'no image',
        phone: info.phone,
        rating: '0',
        schedule: info.schedule,
        website: info.website,
        products: []
      };

      const response = this.storeService.createStore(store);
      response.subscribe((data) => {
        if (data.jsonResponse) {
          this.showMsg('Success!', 'Store was added', 'success');
          this.router.navigateByUrl('/employee/view-supermarkets');
        } else {
          this.showMsg('Error!', 'Unknown error.', 'error');
        }
      }, (error) => {
        this.showMsg('Connection Error!', 'Try it later!', 'error');
      });
    }
  }

  public search() {
    this.searched = true;
  }

  private showMsg(msgTitle, msg, type) {
    Swal.fire(msgTitle, msg, type);
  }

  private updateMap(lat, lng) {
    this.location = {
      latitude: lat,
      longitude: lng
    };

    this.map = document.getElementById('map-canvas');

    const myLatlng = new google.maps.LatLng(this.location.latitude, this.location.longitude);
    const mapOptions = {
      zoom: 12,
      scrollwheel: false,
      center: myLatlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: [
        { 'featureType': 'administrative', 'elementType': 'labels.text.fill', 'stylers': [{ 'color': '#444444' }] },
        { 'featureType': 'landscape', 'elementType': 'all', 'stylers': [{ 'color': '#f2f2f2' }] },
        { 'featureType': 'poi', 'elementType': 'all', 'stylers': [{ 'visibility': 'on' }] },
        { 'featureType': 'road', 'elementType': 'all', 'stylers': [{ 'saturation': -100 }, { 'lightness': 45 }] },
        { 'featureType': 'road.highway', 'elementType': 'all', 'stylers': [{ 'visibility': 'simplified' }] },
        { 'featureType': 'road.arterial', 'elementType': 'labels.icon', 'stylers': [{ 'visibility': 'off' }] },
        { 'featureType': 'transit', 'elementType': 'all', 'stylers': [{ 'visibility': 'off' }] },
        { 'featureType': 'water', 'elementType': 'all', 'stylers': [{ 'color': '#5e72e4' }, { 'visibility': 'on' }] }]
    };

    this.map = new google.maps.Map(this.map, mapOptions);

    const marker = new google.maps.Marker({
      position: myLatlng,
      map: this.map,
      animation: google.maps.Animation.DROP,
      title: 'Marker!'
    });

    google.maps.event.addListener(marker, 'click', function () {
    });
  }

}
