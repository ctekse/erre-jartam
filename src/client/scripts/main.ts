import { RouteModel } from '../../common/types';
import { ClientScriptHelpers } from './helpers';
import { Feature } from 'geojson';

class ErreJartam {
    private map: google.maps.Map = null;
    private infoWindow: google.maps.InfoWindow = null;

    initMap() {
        this.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 7,
            center: { lat: 46.545556, lng: 24.5625 }
        });
        this.infoWindow = new google.maps.InfoWindow();
    }

    contentLoaded() {
        let routeId = location.pathname.replace('/', '');
        this.getRouteData(routeId, false);

        let routeSubmitBtn = document.getElementById('RouteSubmit');
        routeSubmitBtn.addEventListener('click', () => {
            let routeId = (<HTMLInputElement>document.getElementById('RouteId')).value;
            this.getRouteData(routeId, true);
        });
    }

    getRouteData(routeId: string, changeUrl: boolean) {
        if (!routeId.length)
            return;

        let mainApp = this;

        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                let routeData = JSON.parse(this.responseText);
                mainApp.addDataToMap(<RouteModel>routeData);
                document.getElementById('searchBox').style.display = 'none';

                if(changeUrl) {
                    window.history.pushState({ "routeId": routeId }, "", routeId);
                }
            }
        };

        xhttp.open("POST", routeId, true);
        xhttp.send();
    }

    addDataToMap(routeData: RouteModel) {
        let mainApp = this;
        let latLngBounds = new google.maps.LatLngBounds();

        routeData.routes.forEach(element => {
            let mapObj = ClientScriptHelpers.createMapObj(element, this.map, routeData.styles);

            if (mapObj instanceof google.maps.Marker) {
                latLngBounds.extend(mapObj.getPosition());
            } else {
                mapObj.getPath().forEach((latLng) => {
                    latLngBounds.extend(latLng);
                });
            }

            mapObj.addListener('click', function (event: google.maps.MouseEvent) {
                mainApp.showInfoWindow(event.latLng, element);
            });
            mapObj.addListener('mouseover', function () {
                let style = ClientScriptHelpers.getStyle(element, true, routeData.styles);
                mapObj.setOptions(style);
            });
            mapObj.addListener('mouseout', function () {
                let style = ClientScriptHelpers.getStyle(element, false, routeData.styles);
                mapObj.setOptions(style);
            });
        });

        this.map.fitBounds(latLngBounds, 10);
    }

    showInfoWindow(latLng: google.maps.LatLng, feature: Feature) {
        let content = feature.properties.name;
        if (feature.properties.distance) {
            content += ': ' + feature.properties.distance + 'km';
        }
        this.infoWindow.setContent(content);
        this.infoWindow.setPosition(latLng);
        this.infoWindow.open(this.map);
    }

}

let mainApp = new ErreJartam();
(<any>window).initMap = mainApp.initMap.bind(mainApp);
(<any>window).mdc.autoInit();
(<any>window).addEventListener('DOMContentLoaded', mainApp.contentLoaded.bind(mainApp));
