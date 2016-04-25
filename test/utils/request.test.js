'use strict';

const chai = require('chai');
const assert = require('assert');

const request = require('../../utils/request.js');

const expect = chai.expect;

describe('Request test', function() {
    it('Expected request be a object', function(){
        expect(request).to.be.a('object');
    });

    it('Expected request have a makeRequest', function(){
        expect(request).to.have.property('makeRequest');
    });

    it('Expected request have a getURL', function(){
        expect(request).to.have.property('getURL');
    });
});
