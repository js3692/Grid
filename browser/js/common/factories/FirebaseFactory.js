app.factory('FirebaseFactory', function($firebaseObject){
    var baseUrl = "https://amber-torch-6713.firebaseio.com/",
        baseConnection = $firebaseObject(new Firebase(baseUrl)),
        localConnection;
    
    return {
        getBase: function(){
            return baseConnection;  
        },
        setConnection: function(key){
            localConnection = $firebaseObject(new Firebase(baseUrl + key));
            return localConnection;
        },
        getConnection: function(key){
            if(key) return this.setConnection(key);
            return localConnection;
        },
        getLiveJoinableGames: function(scope){
            if(!scope.games) return joinableGames;
            // The firebase object is not an array of games -- and it also contains keys that aren't games.
            var joinableGames = [];
            for(let gameKey in scope.games){
                var gameObject = scope.games[gameKey]
                if(gameObject && gameObject.key === gameKey && !gameObject.game) joinableGames.push(gameObject);  
            }
            return joinableGames;
        },
        getChat: function(key){
            return new Firebase(baseUrl + key + '/chat');
        }
    };
}); 