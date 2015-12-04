app.directive('plantAction', function(PlayGameFactory){ 
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/plantAction/plantAction.html',
        scope: {
            plant: '='  
        },
        link: function(scope, elem, attrs){
            
            var update = {
                phase: 'plant',
                data: {}
            };

            scope.pass = function(){
                update.player = PlayGameFactory.getMe();
                update.data = 'pass';
                PlayGameFactory.continue(update);
            }
    
            scope.pickPlant = function(){
                update.player = PlayGameFactory.getMe();
                update.data.plant = PlayGameFactory.getPlantToBidOn();
                update.data.bid = scope.bid;
                PlayGameFactory.continue(update);
            };
            
            scope.pickAnotherPlant = function(){
                PlayGameFactory.setPlantToBidOn(null);
            };
            
            scope.getAuction = function(){
                scope.auction = PlayGameFactory.getAuction();
                scope.auctionPlant = scope.auction && scope.auction.plant;
                return scope.auction;
            }
            
            scope.bidFor = function(bid){
                update.player = PlayGameFactory.getMe();
                update.data.plant = scope.auction.plant;
                update.data.bid = bid;
                PlayGameFactory.continue(update);
            }
            
            scope.shouldSeeAuctionButtons = function(){
                return [
                    PlayGameFactory.iAmActiveAuctionPlayer(),
                    Boolean(PlayGameFactory.getAuction())
                ].every(valid => valid);
            }
            
        }
    }
});