app.controller('SettingsCtrl', function ($scope, $state, $uibModalInstance, BeforeGameFactory) {

  $scope.gameSettings = {};
  $scope.gameSettings.map = 'United States';
  $scope.gameSettings.numPlayers = 4;
  $scope.gameSettings.checkedRegions = [];

  $scope.countries = [
    { name: 'United States', code: 'us' },
    { name: 'Germany', code: 'de' },
    { name: 'China', code: 'cn' },
    { name: 'South Korea', code: 'kr'}
  ];
  $scope.numPlayersChoices = [2, 3, 4, 5, 6];
  $scope.regions = ['1', '2', '3', '4', '5', '6'];
  $scope.checked = {
    '1': false,
    '2': false,
    '3': false,
    '4': false,
    '5': false,
    '6': false
  };

  $scope.flag = function (country) {
    var spanClass;
    $scope.countries.forEach(function (elem) {
      if (elem.name == country) spanClass = "flag-icon flag-icon-" + elem.code;
    });
    return spanClass;
  };

  $scope.selectMap = function (country) {
    $scope.gameSettings.map = country;
  };

  $scope.selectNumPlayers = function (number) {
    $scope.gameSettings.numPlayers = number;
  };


  $scope.$watchCollection('checked', function () {
    $scope.gameSettings.checkedRegions = [];
    angular.forEach($scope.checked, function (value, key) {
      if (value) {
        $scope.gameSettings.checkedRegions.push(key);
      }
    });
  });

  $scope.ok = function (gameSettings) {
    gameSettings.name = $scope.gameName;
    BeforeGameFactory.newGame(gameSettings)
      .then(function (grid) {
        console.log('the grid', grid);
        $uibModalInstance.close();
        $state.go('grid', { id: grid._id, key: grid.key });
      });
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});