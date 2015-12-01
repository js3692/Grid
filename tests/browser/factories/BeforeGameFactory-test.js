describe('BeforeGameFactory', function(){
    beforeEach(module('Grid'));
    
    var $httpBackend, BeforeGameFactory;
    beforeEach('Get before game factory',  inject(function(_$httpBackend_, _BeforeGameFactory_){
        $httpBackend = _$httpBackend_;
        BeforeGameFactory = _BeforeGameFactory_;
    })); 
    
    it('should be an object', function(){
        expect(BeforeGameFactory).to.be.an('object');
    })
});