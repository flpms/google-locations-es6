'use strict';

const helpers = require('../../utils/helpers.js');

const chai = require('chai');
const assert = require('assert');

const expect = chai.expect;

describe('helpers test', function() {
    it('Expected helper be a object', function(){
        expect(helpers).to.be.a('object');
    });

    it('Expected helper have a searchQuery', function(){
        expect(helpers).to.have.property('searchQuery');
    });

    it('Expected helper have a generateOptions', function(){
        expect(helpers).to.have.property('generateOptions');
    });

    it('Expected helper have a batchDetails', function(){
        expect(helpers).to.have.property('batchDetails');
    });
});
