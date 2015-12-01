app.directive('chat', function(FirebaseFactory){
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/chat/chat.html',
        scope: {
            key: '=',
            me: '='
        },
        link: function(scope, elem, attrs){
            scope.chatBox = document.getElementById('chat-window');
            var chatRef = FirebaseFactory.getChat(scope.key);
            
            scope.addToChat = function(){
                
                chatRef.push({ 
                    user: scope.me, 
                    message: scope.message 
                });
              
                scope.message = '';
            }
 
            scope.chatHistory = [];
            
            chatRef.on('child_added', function(snapshot){
                var message = snapshot.val();
                scope.chatHistory.push(message);
            });
        }
    }
})