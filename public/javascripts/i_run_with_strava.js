$(document).ready(function() {
    $.ajax({
        url: '/strava_activities',
        type: 'GET'
    })
    .success(function(data, textStatus, jqXHR) {
        show_activities(data);
    });
});

function format_data(date_string) {
    d = new Date(date_string);
    return d.getUTCHours()+":"+d.getUTCMinutes();
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
    +'<div class="table-cell">'+format_data(activity.start_date_local)+'</div>'
    +'<div class="table-cell">'+activity.location_city+', '+activity.location_state+'</div>'
    +'<div class="table-cell">'+activity.distance+'</div>'
    +'</div>';
    $('#strava-activities').append(activity_row);
}
