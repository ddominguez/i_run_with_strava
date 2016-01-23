"use strict";

$(document).ready(function() {
    // get strava activities
    $.ajax({
        url: '/strava_activities',
        type: 'GET'
    })
    .done(function(data, textStatus, jqXHR) {
        showActivities(data);
    })
    .fail(function(data, textStatus, jqXHR) {
        showError(data.responseText);
    });

    // show activity map
    $('#strava-activities').on('click', 'div.activity', showMap);

    $('#strava-activities').on('click','div.table-cell a', function(event) {
        event.stopPropagation();
    })

    // close activity map
    $('#map-container').on('click', closeMap)
});

function closeMap() {
    $(this).hide();
}

function formatDate(date_string) {
    var d = new Date(date_string);
    return getMonth(d.getMonth()) + ' ' +d.getDate() + ', ' +d.getFullYear();
}

function showActivities(activities) {
    var activities_length = activities.length;
    for (var i=0; i < activities_length; i++) {
        buildActivity(activities[i]);
    }
}

function buildActivity(activity) {
    var activity_row = '<div class="row activity"  data-id="'+activity.id+'" data-lat="'+activity.start_latitude+'" '
    +'data-lng="'+activity.start_longitude+'" data-polyline="'+activity.map.summary_polyline+'">'
    +'<div class="table-cell"><a href="//www.strava.com/activities/'+activity.id+'">'+activity.name+'</a></div>'
    +'<div class="table-cell">'+formatDate(activity.start_date_local)+'</div>'
    +'<div class="table-cell">'+activity.location_city+', '+activity.location_state+'</div>'
    +'<div class="table-cell">'+toMiles(activity.distance)+'</div>'
    +'</div>';
    $('#strava-activities').append(activity_row);
}

function toMiles(meters) {
    return parseFloat(meters * 0.000621371192237).toFixed(2) + ' mi';
}

function getMonth(i) {
    var months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
    return months[i];
}

function showError(message) {
    $('#strava-activities').html('An error has occurred.');
    console.error(message);
}

function showMap() {
    // If the map-container data-id is the same as the selected data-id, then it's hidden
    // Don't re-create the map if it's hidden
    if ($(this).data('id') === $('#map-container').data('id')) {
        $('#map-container').show();
        return;
    }
    $('#map-container').hide();
    createMap($(this).data('lat'), $(this).data('lng'), $(this).data('polyline'), $(this).data('id'));
}

function createMap(latitude, longitude, polyline, id) {
    var mapOptions = {
      center: new google.maps.LatLng(latitude, longitude),
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    var decodedPath = google.maps.geometry.encoding.decodePath(polyline);
    var decodedLevels = decodeLevels("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
    var poly = new google.maps.Polyline({
        path: decodedPath,
        levels: decodedLevels,
        strokeColor: '#ff0000',
        strokeOpacity: 1,
        strokeWeight: 2,
    });
    poly.setMap(map);
    zoomToObject(poly, map);
    $('#map-container').data('id', id).show();
}

function decodeLevels(encodedLevelsString) {
    var decodedLevels = [];

    for (var i = 0; i < encodedLevelsString.length; ++i) {
        var level = encodedLevelsString.charCodeAt(i) - 63;
        decodedLevels.push(level);
    }
    return decodedLevels;
}

function zoomToObject(obj, map){
    var bounds = new google.maps.LatLngBounds();
    var points = obj.getPath().getArray();
    for (var n = 0; n < points.length ; n++){
        bounds.extend(points[n]);
    }
    map.fitBounds(bounds);
    setTimeout(function() {
                google.maps.event.trigger(map,'resize');
                map.fitBounds(bounds);
                }, 200);
}
