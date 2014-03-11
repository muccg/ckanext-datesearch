this.ckan.module('daterangepicker-module', function ($, _) {
    return {
        initialize: function () {

            // Define a new jQuery function to parse parameters from URL
            $.urlParam = function(name) {
                var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
                if (results == null) { return null; } else { return decodeURIComponent(results[1]) || 0; }
            };

            // Pick out relevant parameters
            param_start = $.urlParam('ext_startdate');
            param_end = $.urlParam('ext_enddate');

            // Populate the datepicker and hidden fields
            if (param_start) {
                $('input[name="start"]').val(moment.utc(param_start).years());
                $('#ext_startdate').val(param_start);
            }
            if (param_end) {
                $('input[name="end"]').val(moment.utc(param_end).years());
                $('#ext_enddate').val(param_end);
            }

            // Add hidden <input> tags #ext_startdate and #ext_enddate, if they don't already exist.
            var form = $("#dataset-search");
            // CKAN 2.1
            if (!form.length) {
                form = $(".search-form");
            }
            if ($("#ext_startdate").length === 0) {
                $('<input type="hidden" id="ext_startdate" name="ext_startdate" />').appendTo(form);
            }
            if ($("#ext_enddate").length === 0) {
                $('<input type="hidden" id="ext_enddate" name="ext_enddate" />').appendTo(form);
            }

            // Add a date-range picker widget to the <input> with id #daterange
            $('#datepicker.input-daterange').datepicker({
                format: "yyyy",
                startView: 3,
                minViewMode: 2,
                keyboardNavigation: false,
                autoclose: true
            }).on('hide', function (ev) {
                    // Bootstrap-daterangepicker calls this function after the user picks a start and end date.

                    // Format the start and end dates into strings in a date format that Solr understands.
                    var v = moment(ev.date);
                    var fs = 'YYYY-MM-DDTHH:mm:ss'

                    switch (ev.target.name) {
                        case 'start':
                            // Set the value of the hidden <input id="ext_startdate"> to the chosen start date.
                            $('#ext_startdate').val(v.format(fs) + 'Z');
                            break;
                        case 'end':
                            // Set the value of the hidden <input id="ext_enddate"> to the chosen end date.
                            $('#ext_enddate').val(v.add('y', 1).subtract('s', 1).format(fs) + 'Z');
                            break;
                    }

                    // Submit the <form id="dataset-search">.
                    //$("#dataset-search").submit();
                });
        }
    }
});
