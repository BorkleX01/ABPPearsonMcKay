var assert = require('assert');
var mocha = require('mocha');
var chai = require('chai');
var should = chai.should(); //executable
var equal = chai.equal; //reference
/*
The should interface extends Object.prototype to provide a single getter as the starting point for your language assertions. It works on node.js and in all modern browsers except Internet Explorer.
*/

describe('Test the testing suite: ', function() {
    describe('Arbitrary node-side tests: ', function() {

	it('assert.equal', function() {
	    assert.equal(-1, [1,2,3].indexOf(4));
	});


	it('assert.equal again', function() {
	    assert.equal(1, [1,2,3,4,6].indexOf(2));
	});

	it('should.equal', function() {
	    var return1 = 1;
	    return1.should.equal(1);
	    
	});
	
    });
});

