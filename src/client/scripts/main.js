(function (window) {
    window.mdc.autoInit(document.getElementById('searchBox'));

    var map = null;
    var infoWindow = null;
    var defaultStyle = {
        strokeColor: '#ff0000',
        strokeOpacity: 0.5,
        strokeWeight: 2
    };

    var defaultOverStyle = {
        strokeOpacity: 1,
        strokeWeight: 3
    };

    window.initMap = function() {
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 4,
            center: { lat: 46.545556, lng: 24.5625 }
        });

        infoWindow = new google.maps.InfoWindow();
    }

    window.onpopstate = function (e) {
        if (e.state) {
            getRouteData(e.state.routeId, false);
        }
    };

    document.addEventListener("DOMContentLoaded", function () {
        var routeId = location.pathname.replace('/', '');
        getRouteData(routeId, false);
    });

    var routeSubmitBtn = document.getElementById('RouteSubmit');
    routeSubmitBtn.addEventListener('click', function(event){
        var routeId = document.getElementById('RouteId').value;
        getRouteData(routeId, true);
    });

    function getRouteData(routeId, changeUrl){
        if (routeId.length > 0) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                    var routeData = JSON.parse(this.responseText);
                    addDataToMap(routeData);
                    document.getElementById('searchBox').style.display = 'none';

                    if(changeUrl){
                        window.history.pushState({ "routeId": routeId }, "", routeId);
                    }
                }
            };

            xhttp.open("POST", routeId, true);
            xhttp.send();
        }
    }

    function addDataToMap(routeData){
        //map.data.addGeoJson(routeData.routes);

        routeData.routes.features.forEach(element => {
            var line = new google.maps.Polyline({
                path: element.geometry.coordinates.map(value => {
                    return new google.maps.LatLng(value[1], value[0]);
                }),
                geodesic: true,
                map: map,
                strokeColor: defaultStyle.strokeColor,
                strokeOpacity: defaultStyle.strokeOpacity,
                strokeWeight: defaultStyle.strokeWeight
            });

            line.addListener('click', function (event) {
                showInfoWindow(event.latLng, element);
            });
            line.addListener('mouseover', function (event) {
                line.setOptions(defaultOverStyle);
            });
            line.addListener('mouseout', function (event) {
                line.setOptions({
                    strokeOpacity: defaultStyle.strokeOpacity,
                    strokeWeight: defaultStyle.strokeWeight
                });
            });
        });
    };

    function showInfoWindow(latLng, feature){
        var content = feature.properties.name;
        if (feature.properties.distance) {
            content += ': ' + feature.properties.distance + 'km';
        }
        infoWindow.setContent(content);
        infoWindow.setPosition(latLng);
        infoWindow.open(map);
    };


})(window);