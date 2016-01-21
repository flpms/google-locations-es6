'use strict';

let helper = {
    batchDetails(context, result, maxResults, cb) {
        if (result.results.length === 0) return cb(null, {details: [], errors: []});

        let details = [], errors = [];

        var j = (maxResults > result.results.length) ? result.results.length : maxResults;

        for (var i = 0; i < j; i++) {
            try {

                let placeid = result.results[i].place_id;

                context.details({placeid: placeid}, function(err, result){

                    if (err) {
                        errors.push({ 
                            message: "Error requesting details for placeid " + placeid,
                            error: err
                        });
                    } else {
                        details.push(result);
                    }

                    if (details.length + errors.length == j) return cb(null, {details: details, errors: errors});
                });
            } catch (exp) {
                errors.push({message: "No place_id found", error: exp});
                if (details.length + errors.length == j) return cb(null, {details: details, errors: errors});
            }
        }
    }
}

function _

function _generateOptions(geocodeOptions) {
  var options = {geocode: geocodeOptions, search: {maxResults: 1, rankby: "distance"}};
  var keys = ['name', 'maxResults', 'rankby', 'radius'];
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (options.geocode[key]) {
      options.search[key] = options.geocode[key];
      delete options.geocode[key];
    }
  }
  // Ensure 'prominence' searches have a radius
  if (options.search.rankby === "prominence" && !options.search.radius) {
    options.search.radius = 250;
  }
  return options;
}

function _searchQuery(location, searchOptions) {
  var query = {location: [location.lat, location.lng], rankby: searchOptions.rankby};
  if (searchOptions.name) query.name = searchOptions.name;
  if (searchOptions.radius) query.radius = searchOptions.radius;
  return query;
}