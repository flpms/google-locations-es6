'use strict';

const _ = require('underscore');
const helpers = require('../utils/helpers.js');
const request = require('../utils/request.js');

let GoogleLocations = function(key, options) {
    // Set default options
    if (!options) options = {};

    options = _.defaults(options, {
        format: 'json',
        headers: { "User-Agent": 'Google-Locations (https://www.npmjs.org/package/google-locations-es6)' },
        host: 'maps.googleapis.com',
        port: 443,
        path: '/maps/api/'
    });

    this.config = {
        key: key,
        format: options.format,
        headers: options.headers,
        host: options.host,
        port: options.port,
        path: options.path
    };

    return this;
};

//Google place search
GoogleLocations.prototype.search = function(options, cb) {
    options = _.defaults(options, {
        location: [37.42291810, -122.08542120],
        radius: 10,
        language: 'en',
        rankby: 'prominence',
        types: []
    });

    options.location = options.location.join(',');

    if (options.types.length > 0) {
        options.types = options.types.join('|');
    } else {
        delete options.types;
    }

    if (options.rankby == 'distance') options.radius = null;

    request.makeRequest(request.getURL(this, options, 'place', 'nearbysearch'), cb);
};

GoogleLocations.prototype.textsearch = function(options, cb) {
    options = _.defaults(options, {
        query: options.keyword
    });

    request.makeRequest(request.getURL(this, options, 'place', 'textsearch'), cb);
};

GoogleLocations.prototype.autocomplete = function(options, cb) {

    options = _.defaults(options, { language: "en" });

    request.makeRequest(request.getURL(this, options, 'place', 'autocomplete'), cb);
};

GoogleLocations.prototype.details = function(options, cb) {

    if (!options.placeid) return cb({ error: 'Placeid string is required by Google' });

    options = _.defaults(options, { language: 'en' });

    request.makeRequest(request.getURL(this, options, 'place', 'details'), cb);
};

GoogleLocations.prototype.geocodeAddress = function(options, cb) {

    if (!options.address) return cb({error: 'Address string required'});

    options = _.defaults(options, { language: 'en' });
    options.address = options.address.replace(/\s/g, '+');

    request.makeRequest(request.getURL(this, options, 'geocode', null), cb);
};

GoogleLocations.prototype.reverseGeocode = function(options, cb) {

    options = _.defaults(options, {
        latlng: [37.42291810, -122.08542120],
        language: 'en'
    });

    options.latlng = options.latlng.join(',');

    request.makeRequest(request.getURL(this, options, 'geocode', null), cb);
};

GoogleLocations.prototype.searchByAddress = function(config, cb) {

    if (!config.address) return cb({error: "Address string required"});

    let _self = this;

    let options = helpers.generateOptions(config);

    _self.geocodeAddress(options.geocode, (err, result) => {

        let location, query;

        if (err) return cb({
            message: "Error geocoding address",
            error: err
        });

        try {

            location = result.results[0].geometry.location;
            query = helpers.searchQuery(location, options.search);

            _self.search(query, (err, result) => {

                if (err) return cb({
                    message: "Error searching for places near geocoded location",
                    error: err
                });

                console.log('- -  - - 125', result);

                helpers.batchDetails(_self, result, options.search.maxResults, cb);
            });
        } catch (exp) {
            return cb({
                message: "Malformed results -- try a more specific address",
                error: exp
            });
        }
    });
};

GoogleLocations.prototype.searchByPhone = function(options, cb) {

    if (!options.phone) return cb({ error: "Missing required parameter 'phone'" });

    options.maxResults = options.maxResults || 1;

    let _self = this;

    _self.textsearch({query: 'phone number ' + options.phone}, (err, result) => {

        if (err) return cb({message: "Error from textsearch", error: err});
        helpers.batchDetails(_self, result, options.maxResults, cb);
    });
};

module.exports = GoogleLocations;
