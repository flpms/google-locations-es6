'use strict';

let request = {
    makeRequest(request_query, cb) {
        https.get(request_query, (res) => {
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

    generateUrl(context, query, type, method) {

        query.filter(item => item ? item : '');

        query.key = context.config.key;

        var requestQuery = url.parse(url.format({
            protocol: 'https',
            hostname: context.config.host,
            pathname: context.config.path + type + '/' + (method ? method + '/' : '') + context.config.format,
            query: query
        }));

        requestQuery.headers = context.config.headers;

        return request_query;
    }
}

module.exports = request;