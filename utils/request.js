'use strict';
const https = require('https');
const url = require('url');
const _ = require('underscore');

let request = {
    makeRequest(requestQuery, cb) {
        https.get(requestQuery, (res) => {
            let data = [];

            res.on('data', chunk => data.push(chunk)).on('end', () => {

                let result;
                let dataBuff = data.join('').trim();

                try {
                    result = JSON.parse(dataBuff);
                } catch (exp) {
                    result = {'status_code': 503, 'status_text': 'JSON Parse Failed'};
                }

                cb(null, result);
            });

        }).on('error', e => cb(e));
    },
    getURL(context, query, type, method) {

        _.compact(query);

        query.key = context.config.key;

        var requestQuery = url.parse(url.format({
            protocol: 'https',
            hostname: context.config.host,
            pathname: context.config.path + type + '/' + (method ? method + '/' : '') + context.config.format,
            query: query
        }));

        requestQuery.headers = context.config.headers;

        return requestQuery;
    }
}

module.exports = request;
