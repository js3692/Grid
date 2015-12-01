app.factory('SliderFactory', function(){
    return {
        slideOut: function(side){
            var sliders = [].slice.call(document.getElementsByClassName(side + '-slider'));
            sliders.forEach(slider => angular.element(slider).toggleClass(side + '-slider-pull'));
        }
    };
}); 