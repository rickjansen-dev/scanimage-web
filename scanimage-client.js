angular.module('ui.scanimage.web', ['ngAnimate', 'ui.bootstrap', 'btford.socket-io']);
angular.module('ui.scanimage.web').controller('ScanImageCtrl', function ($scope, socket) {
  $scope.inProgress = false;
  $scope.scanFinished = false;
  
  $scope.colorMode = 'Color';
  $scope.resolution = '300';
  
  $scope.currentProgress = 0.0;
  
  socket.forward('progressEvent', $scope);
  socket.forward('scanDoneEvent', $scope);
  $scope.$on('socket:progressEvent', function (ev, data) {	  
  
	  // todo: improve parsing stuff, as data gets send multiple times at once sometimes
	  //console.log('got data: ' + data);
	  
	  var progress = data.slice(10,-1);
	  //console.log(progress);
	  $scope.currentProgress = parseFloat(progress);
  });
  
  $scope.$on('socket:scanDoneEvent', function (ev, data) {	  	  
	  $scope.scanFinished = true;
	  $scope.inProgress = false;
	  $scope.currentProgress = 0.0;
  });
  
  $scope.startScanning = function() {
	  
      theData = { 'resolution': $scope.resolution,
    		  	  'fileName': $scope.fileName,
    		  	  'colorMode': $scope.colorMode };
      socket.emit('parameterEvent', theData);
      
      $scope.inProgress = true;
      $scope.scanFinished = false;
      
    };
    
    $scope.stopScanning = function() {
  	  
    	socket.emit('stopScanEvent','1');
        $scope.inProgress = false;
        $scope.scanFinished = false;
        
    };

}).
factory('socket', function (socketFactory) {
	return socketFactory();
});
