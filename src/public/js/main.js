(function (window) {
    window.mdc.autoInit(document.getElementById('searchBox'));

    window.initMap = function() {
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 4,
            center: { lat: 46.545556, lng: 24.5625 }
        });
    }

    window.onpopstate = function (e) {
        if (e.state) {
            getRouteData(e.state.routeId, false);
        }
    };

    document.addEventListener("DOMContentLoaded", function () {
        var routeId = location.pathname.replace(window.ej.settings.routesUrl, '').replace('/', '');
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
                    // TODO: process the routes:
                    //document.getElementById('searchBox').style.display = 'none';

                    if(changeUrl){
                        window.history.pushState({ "routeId": routeId }, "", window.ej.settings.routesUrl + routeId);
                    }
                }
            };

            xhttp.open("POST", window.ej.settings.routesUrl + routeId, true);
            xhttp.send();
        }
    }

})(window);