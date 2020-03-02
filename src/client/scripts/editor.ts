import { Feature } from 'geojson';
import * as $ from "jquery";
import { FeatureEx, RouteTypeEditor } from './types';
import { RouteModel, StyleModel, StyleMap } from '../../common/types';
import * as template from 'client_templates/routeListTemplate.hbs';
import { ClientScriptHelpers } from './helpers';
import { LineEditor } from './lineEditor';

class ErreJartamEditor {
    private map: google.maps.Map;
    private routeData: Map<string, FeatureEx> = new Map<string, FeatureEx>();
    private defaultStyle: StyleMap = {};

    initMap() {
        this.map = new google.maps.Map($('#map').get(0), {
            zoom: 7,
            center: { lat: 46.545556, lng: 24.5625 }
        });
    }

    documentReady() {
        let editor = this;

        $.getJSON('data').done(this.processRouteData.bind(this));

        $('#route-list')
            .on('mouseenter', '.mdc-list-item', function () {
                let feature = editor.routeData.get(this.id.replace('list_', ''));
                editor.highlightMapObject(feature);
            })
            .on('mouseleave', '.mdc-list-item', function () {
                let feature = editor.routeData.get(this.id.replace('list_', ''));
                editor.unHighlightMapObject(feature);
            })
            .on('click', '.mdc-list-item', function (event) {
               event.preventDefault();
               event.stopPropagation();
            })
            .on('click', '.material-icons', function (event) {
                if ($(this).text() === 'edit') {
                    let id = $(this).parents('a').get(0).id.replace('list_', '');
                    setTimeout(() => {
                        editor.toggleRoutes(false, id);
                        editor.editRoute(id);
                    }, 150);
                } else if ($(this).text() === 'delete_outline') {
                    let id = $(this).parents('a').get(0).id.replace('list_', '');
                    editor.deleteRoute(id);
                } else if ($(this).text() === 'add_location') {
                } else if ($(this).text() === 'timeline') {
                } else if ($(this).text() === 'directions') {
                } else if ($(this).text() === 'map') {
                }
                event.preventDefault();
                event.stopPropagation();
            });

        $('.search-container').on('click', '.mdc-text-field__icon', function() {
            if($(this).val() === 'close') {
                $('#route-search').val('').trigger('keydown');
            }
        });

        $('#route-search').on('keyup', function() {
            let term = editor.accentFold($(this).val().toString().toLowerCase());
            $('.search-container .mdc-text-field__icon').text(term.length ? 'close' : 'search');
            $('#route-list .mdc-list-item__text').each(function() {
                if(term.length === 0 || $(this).text().toString().toLowerCase().indexOf(term) > -1) {
                    $(this).parent('.mdc-list-item').show();
                } else {
                    $(this).parent('.mdc-list-item').hide();
                }
            });
        });
    }

    processRouteData(data: RouteModel) {
        this.defaultStyle = data.styles;
        let latLngBounds = new google.maps.LatLngBounds();
        let routeListHTML = '';

        data.routes.forEach((element: Feature) => {
            let routeData = <FeatureEx>element;
            this.routeData.set(element.id.toString(), routeData);

            routeListHTML += template(routeData);

            routeData.mapObject = ClientScriptHelpers.createMapObj(routeData, this.map, this.defaultStyle);

            if(routeData.mapObject instanceof google.maps.Marker) {
                latLngBounds.extend(routeData.mapObject.getPosition());
            } else {
                routeData.mapObject.getPath().forEach((latLng) => {
                    latLngBounds.extend(latLng);
                });
            }
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

        $('#route-list').append(routeListHTML);

        this.map.fitBounds(latLngBounds, 10);
    }

    highlightMapObject(feature: FeatureEx) {
        let style = ClientScriptHelpers.getStyle(feature, true, this.defaultStyle);
        feature.mapObject.setOptions(style);
    }

    unHighlightMapObject(feature: FeatureEx) {
        let style = ClientScriptHelpers.getStyle(feature, false, this.defaultStyle);
        feature.mapObject.setOptions(style);
    }

    toggleRoutes(show: boolean, id?: string) {
        this.routeData.forEach(value => {
            // if (value.id !== id) {
                value.mapObject.setMap(show ? this.map : null);
            // }
        });
    }

    editRoute(id: string) {
        let routeData = this.routeData.get(id);

        let routeEditor: RouteTypeEditor = null;

        switch (routeData.properties.routeType) {
            case 'Line':
                routeEditor = new LineEditor(this.map, this.defaultStyle, $('.edit-route'));
                break;
            case 'Point': break;
            case 'Direction': break;
        }

        routeEditor.editRoute(routeData, this.routeEditorFinished.bind(this));
    }

    routeEditorFinished(newRouteData?: Feature) {
        if (newRouteData) {
            let routeData = this.routeData.get(newRouteData.id.toString());
            routeData.properties = newRouteData.properties;
            routeData.geometry = newRouteData.geometry;

            if (newRouteData.geometry.type === "LineString") {
                (<google.maps.Polyline>routeData.mapObject).setPath(ClientScriptHelpers.positionToLatLngArray(newRouteData.geometry.coordinates));
            } else if (newRouteData.geometry.type === "Point") {
                (<google.maps.Marker>routeData.mapObject).setPosition(ClientScriptHelpers.positionToLatLng(newRouteData.geometry.coordinates));
            }
        }
        this.toggleRoutes(true);
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

    accentFold(inStr: string): string {
        return inStr.replace(
            /([àáâãäå])|([ç])|([èéêë])|([ìíîï])|([ñ])|([òóôõöøő])|([ß])|([ùúûüű])|([ÿ])|([æ])/g,
            (str: string, a, c, e, i, n, o, s, u, y, ae) => {
                if (a) return 'a';
                else if (c) return 'c';
                else if (e) return 'e';
                else if (i) return 'i';
                else if (n) return 'n';
                else if (o) return 'o';
                else if (s) return 's';
                else if (u) return 'u';
                else if (y) return 'y';
                else if (ae) return 'ae';
                else return str;
            }
        );
    }

}

let mainApp = new ErreJartamEditor();
$(document).ready(mainApp.documentReady.bind(mainApp));
(<any>window).initMap = mainApp.initMap.bind(mainApp);
(<any>window).mdc.autoInit();
