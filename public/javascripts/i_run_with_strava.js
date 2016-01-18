"use strict";

$(document).ready(function() {
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
});

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
    var activity_row = '<div class="row">'
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
