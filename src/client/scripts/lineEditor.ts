import { FeatureEx, RouteTypeEditor } from './types';
import * as template from 'client_templates/lineEditorTemplate.hbs';
import { ClientScriptHelpers } from './helpers';
import { StyleMap } from '../../common/types';
import { Feature, LineString } from 'geojson';

export class LineEditor implements RouteTypeEditor {
    private map: google.maps.Map;
    private routeData: Feature;
    private editorContainer: JQuery;
    private mapObject: google.maps.Polyline;
    private defaultStyle: StyleMap;
    private originalBounds: google.maps.LatLngBounds;

    constructor(map: google.maps.Map, defaultStyle: StyleMap, editorContainer: JQuery) {
        this.map = map;
        this.defaultStyle = defaultStyle;
        this.editorContainer = editorContainer;
    }

    editRoute(routeData: Feature, editDoneCallback: (n: Feature) => void): void {
        this.originalBounds = this.map.getBounds();

        this.routeData = routeData;
        this.editorContainer.html(template(routeData)).show();

        let bounds = new google.maps.LatLngBounds();
        this.mapObject = <google.maps.Polyline>ClientScriptHelpers.createMapObj(routeData, this.map, this.defaultStyle);
        this.mapObject.setEditable(true);
        this.mapObject.getPath().forEach((latLng) => {
            bounds.extend(latLng);
        });

        (<any>window).mdc.autoInit(this.editorContainer.get(0));

        let editor = this;
        this.editorContainer.on('click', '.material-icons', function (event) {
            if ($(this).text() === 'save') {
                editor.routeData.properties.name = $('#route-name').val();
                editor.routeData.properties.distance = Math.round(google.maps.geometry.spherical.computeLength(editor.mapObject.getPath()) / 1000);

                let mdcSelect = (<any>document.querySelector('.mdc-select')).MDCSelect;
                editor.routeData.properties.category = mdcSelect.value;

                (<LineString>editor.routeData.geometry).coordinates = ClientScriptHelpers.latLngToPositionArray(editor.mapObject.getPath());
                setTimeout(() => {
                    editDoneCallback(editor.routeData);
                }, 150);
            } else if ($(this).text() === 'arrow_back') {
                setTimeout(() => {
                    editDoneCallback(null);
                }, 150);
            }

            editor.mapObject.setMap(null);
            editor.editorContainer.hide().empty();
            editor.map.fitBounds(editor.originalBounds);

            event.preventDefault();
            event.stopPropagation();
        });

        this.map.fitBounds(bounds);
    }
}