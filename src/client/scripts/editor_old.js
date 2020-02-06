(function (window, $) {
    window.mdc.autoInit();

    var map = null;
    var routeDataMap = null;
    var defaultStyle = {
        strokeColor: '#ff0000',
        strokeOpacity: 0.5,
        strokeWeight: 2
    };

    var defaultOverStyle = {
        strokeOpacity: 1,
        strokeWeight: 3
    };

    window.initMap = function () {
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 4,
            center: { lat: 46.545556, lng: 24.5625 },
            mapTypeControlOptions: {
                position: google.maps.ControlPosition.TOP_RIGHT
            },
            fullscreenControl: false
        });

        var customControls = document.getElementById('map-buttons');
        customControls.style.display = 'block';
        customControls.parentNode.removeChild(customControls);

        map.controls[google.maps.ControlPosition.TOP_LEFT].push(customControls);

        setupMapObjects();
    }

    window.initRoutes = function(routeData){
        routeDataMap = {};
        routeData.forEach(element => {
            routeDataMap[element.id] = element;
        });

        setupMapObjects();
    }

    function setupMapObjects(){
        if(!map || !routeDataMap){
            return;
        }

        var latLngBounds = new google.maps.LatLngBounds();
        for (const key in routeDataMap) {
            var routeData = routeDataMap[key];

            routeData.mapObj = createMapObj(routeData);
            routeData.mapListeners = [];
            routeData.mapListeners.push(
                routeData.mapObj.addListener('click', function (event) {
                }),
                routeData.mapObj.addListener('mouseover', function (event) {
                    $('#list_' + key).addClass('list-item-hovered');
                    highlightMapObject(key);
                }),
                routeData.mapObj.addListener('mouseout', function (event) {
                    $('#list_' + key).removeClass('list-item-hovered');
                    unHighlightMapObject(key);
                })
            );
        }

        map.fitBounds(latLngBounds, 10);
    }

    $(document).ready(function () {
        $('.mdc-list-item').hover(function () {
            highlightMapObject(this.id.replace('list_', ''));
        }, function () {
            unHighlightMapObject(this.id.replace('list_', ''));
        });

        $('.mdc-list-item').on('click', function(event){
            event.preventDefault();
        });

        $('.material-icons')
            .on('click', function (event) {
                if($(this).text() === 'edit'){
                    var id = $(this).parents('a').get(0).id.replace('list_', '');
                    editRoute(id);
                } else if ($(this).text() === 'delete_outline'){
                    var id = $(this).parents('a').get(0).id.replace('list_', '');
                    deleteRoute(id);
                } else if ($(this).text() === 'add_location') {
                } else if ($(this).text() === 'timeline') {
                } else if ($(this).text() === 'directions') {
                } else if ($(this).text() === 'map') {
                }
            });
    });

    function createMapObj(routeData){
        //if(routeData.geometry
        return new google.maps.Polyline({
            path: routeData.geometry.coordinates.map(value => {
                var latLng = new google.maps.LatLng(value[1], value[0]);
                //latLngBounds.extend(latLng);
                return latLng;
            }),
            geodesic: true,
            map: map,
            strokeColor: defaultStyle.strokeColor,
            strokeOpacity: defaultStyle.strokeOpacity,
            strokeWeight: defaultStyle.strokeWeight
        });

    }

    function highlightMapObject(id){
        routeDataMap[id].mapObj.setOptions(defaultOverStyle);
    }

    function unHighlightMapObject(id) {
        routeDataMap[id].mapObj.setOptions({
            strokeOpacity: defaultStyle.strokeOpacity,
            strokeWeight: defaultStyle.strokeWeight
        });
    }

    function editRoute(id){
        for (const key in routeDataMap) {
            if(key !== id) {
                routeDataMap[key].mapObj.setMap(null);
            } else {
                routeDataMap[key].mapObj.setEditable(true);

                $('.edit-route').show();
            }
        }
    }

    function deleteRoute(id) {
        if(confirm('Are you sure you want to delete this route: ' + routeDataMap[id].properties.name + ' ?')){
            $.ajax({
                url: '',
                method: method
            }).done(function(){
                routeDataMap[id].mapObj.setMap(null);
                routeDataMap[id].mapListeners.forEach(listener => {
                    listener.remove();
                });
                $('#list_' + id).remove();
                delete routeDataMap[id];
            }); 
            
        }
    }

})(window, jQuery);