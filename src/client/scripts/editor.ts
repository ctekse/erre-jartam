import { Feature, Geometry, Position, FeatureCollection, GeoJsonProperties } from 'geojson';
import * as $ from "jquery";
import { FeatureEx } from './types';
import { RouteModel, StylePairModel, StyleModel } from '../../common/types';

class ErreJartamEditor {
    private map: google.maps.Map;
    private routeData: Map<string, FeatureEx> = new Map<string, FeatureEx>();
    private defaultStyle: StyleModel | StylePairModel;

    constructor() {
        (<any>window).initMap = this.initMap.bind(this);
        (<any>window).mdc.autoInit();
    }

    initMap() {
        this.map = new google.maps.Map($('#map').get(0), {
            zoom: 7,
            center: { lat: 46.545556, lng: 24.5625 }
        });
    }

    documentReady() {
        let editor = this;

        $.getJSON('data').done(this.processRouteData.bind(this));

        $('.mdc-list-item').hover(function () {
            let feature = editor.routeData.get(this.id.replace('list_', ''));
            editor.highlightMapObject(feature);
        }, function () {
            let feature = editor.routeData.get(this.id.replace('list_', ''));
                editor.unHighlightMapObject(feature);
        });

        $('.mdc-list-item').on('click', function (event) {
            event.preventDefault();
        });

        $('.material-icons')
            .on('click', function (event) {
                if ($(this).text() === 'edit') {
                    let id = $(this).parents('a').get(0).id.replace('list_', '');
                    editor.editRoute(id);
                } else if ($(this).text() === 'delete_outline') {
                    let id = $(this).parents('a').get(0).id.replace('list_', '');
                    editor.deleteRoute(id);
                } else if ($(this).text() === 'add_location') {
                } else if ($(this).text() === 'timeline') {
                } else if ($(this).text() === 'directions') {
                } else if ($(this).text() === 'map') {
                }
            });
    }

    processRouteData(data: RouteModel) {
        this.defaultStyle = data.defaultStyle;

        data.routes.forEach((element: Feature) => {
            this.routeData.set(element.id.toString(), <FeatureEx>element);
        });

        let latLngBounds = new google.maps.LatLngBounds();
        this.routeData.forEach(routeData => {
            routeData.mapObject = this.createMapObj(routeData, latLngBounds);
            routeData.mapEventListeners = [];
            routeData.mapEventListeners.push(
                routeData.mapObject.addListener('click', function () {
                }),
                routeData.mapObject.addListener('mouseover', () => {
                    $('#list_' + routeData.id).addClass('list-item-hovered');
                    this.highlightMapObject(routeData);
                }),
                routeData.mapObject.addListener('mouseout', () => {
                    $('#list_' + routeData.id).removeClass('list-item-hovered');
                    this.unHighlightMapObject(routeData);
                })
            );
        });

        this.map.fitBounds(latLngBounds, 10);
    }

    createMapObj(feature: Feature, latLngBounds: google.maps.LatLngBounds): google.maps.Marker | google.maps.Polyline {
        let style = this.getStyle(feature, false);
        if(feature.geometry.type === "LineString") {
            return new google.maps.Polyline({
                path: feature.geometry.coordinates.map(value => {
                    let latLng = new google.maps.LatLng(value[1], value[0]);
                    latLngBounds.extend(latLng);
                    return latLng;
                }),
                geodesic: true,
                map: this.map,
                strokeColor: style.strokeColor,
                strokeOpacity: style.strokeOpacity,
                strokeWeight: style.strokeWeight
            });
        } else if(feature.geometry.type === "Point") {
            return new google.maps.Marker({
                map: this.map,
                position: new google.maps.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0])
            });
        } else {
        }
    }

    getStyle(feature: Feature, hover: boolean): StyleModel {
        let style = this.defaultStyle;
        if (feature.geometry.type === "LineString") {
        } else if (feature.geometry.type === "Point" ) {
        }

        if ('hover' in style) {
            return hover ? style.hover : style.normal;
        } else {
            return style;
        }
    }


    highlightMapObject(feature: FeatureEx) {
        let style = this.getStyle(feature, true);
        feature.mapObject.setOptions(style);
    }

    unHighlightMapObject(feature: FeatureEx) {
        let style = this.getStyle(feature, false);
        feature.mapObject.setOptions(style);
    }

    editRoute(id: string) {
        this.routeData.forEach(value => {
            if (value.id === id) {
                // value.mapObject.setEditable(true);
                $('.edit-route').show();
            } else {
                value.mapObject.setMap(null);
            }
        });
    }

    deleteRoute(id: string) {
        if (confirm('Are you sure you want to delete this route: ' + this.routeData.get(id).properties.name + ' ?')) {

            $.ajax({
                url: '',
                method: 'DELETE'
            }).done(() => {
                this.routeData.get(id).mapObject.setMap(null);
                this.routeData.get(id).mapEventListeners.forEach(listener => {
                     listener.remove();
                });
                $('#list_' + id).remove();
                this.routeData.delete(id);
            });

        }
    }
}

let mainApp = new ErreJartamEditor();
$(document).ready(mainApp.documentReady.bind(mainApp));
(<any>window).initMap = mainApp.initMap.bind(mainApp);
