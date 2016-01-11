"use strict";

$(document).ready(function() {
    $.ajax({
        url: '/strava_activities',
        type: 'GET'
    })
    .success(function(data, textStatus, jqXHR) {
        show_activities(data);
    });
});

function format_date(date_string) {
    var d = new Date(date_string);
    return getMonth(d.getMonth()) + ' ' +d.getDay() + ', ' +d.getFullYear(); 
}

function show_activities(activities) {
    var activities_length = activities.length;
    for (var i=0; i < activities_length; i++) {
        build_activity(activities[i]);
    }
}

function build_activity(activity) {
    var activity_row = '<div class="row">'
    +'<div class="table-cell">'+activity.name+'</div>'
    +'<div class="table-cell">'+format_date(activity.start_date_local)+'</div>'
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
