var expect = chai.expect; //reference
var should = chai.should(); //executable
describe('Basics', function() {
    describe('Test the testing suite: ', function() {
	it('expect().to.equal()', function() {
	    var return1 = 1;
	    expect(return1).to.equal(1);
	});

        it('should support should statements');
        
    });
});

describe('ARIA', function(){
    it('should give me a way to test ARIA programatically');
    it('Does funny tabbing occue without React?');
        
});

describe('ReactJS', function(){
    it('should have loaded React by now');
    it('should have loaded jquery by now');
    it('Will show me correct display elements');
});
