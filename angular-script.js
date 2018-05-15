// Application module
angular.module('crudApp', ['crudApp.controllers', 'datatables']);
angular.module('crudApp.controllers', []).controller('userController', function ($scope, $http, DTOptionsBuilder, DTColumnBuilder) {
    // USER LIST VIEW CALL HERE 
    getUserDetails();
    function getUserDetails() {
        var data = $.param({
            'data': '',
            'type': 'getUserData'
        });
        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };
        $http.post('action.php', data, config).success(function (response) {
            $scope.users = response.result;
        });
        $scope.vm = {};
        $scope.vm.dtOptions = DTOptionsBuilder.newOptions().withOption('order', [0, 'asc']).withOption('lengthMenu', [2, 5, 10, 50]);
    }
    // INSERT USER FUNCTION CALL HERE
    $scope.tempUserData = {};
    $scope.submitUserData = function () {
        var data = $.param({
            'data': $scope.tempUserData,
            'type': 'insertUserData'
        });
        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };
        $http.post('action.php', data, config).success(function (response) {
            if (response.status == 1) {
                getUserDetails();
                $scope.messageSuccess(response.message);
                setTimeout(function () {
                    $('#userInsert')[0].reset();
                }, 2000);
            } else {
                $scope.messageError(response.message);
            }
        });
    };

    // EDIT USER CALL HERE 
    $scope.currentUserData = {};
    $scope.editUser = function (user) {
        $scope.currentUserData = user;
        $("#editFormModal").trigger("click");
    }

    // EDIT USER DATA CALL HERE 
    $scope.editUserData = function () {
        var data = $.param({
            'data': $scope.currentUserData,
            'type': 'editUserData',
            'user_id': $scope.currentUserData.u_id
        });
        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };
        $http.post('action.php', data, config).success(function (response) {
            if (response.status == 1) {
                getUserDetails();
                $scope.messageSuccess(response.message);
            } else {
                $scope.messageError(response.message);
            }
        });
    };

    // DELETE USER CALL HERE 
    $scope.deleteUser = function (user_id) {
        var data = $.param({
            'data': user_id,
            'type': 'deleteUser'
        });
        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };
        swal({
            title: "Are you sure?",
            text: "You want to Delete this User Details..!",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: 'btn-danger',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: "No, cancel plx!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
                function (isConfirm) {
                    if (isConfirm) {
                        $http.post('action.php', data, config).success(function (response) {
                            getUserDetails();
                            swal("Deleted!", "User deleted Successfully!", "success");
                        });
                    } else {
                        swal("Cancelled", "Your User record is safe :)", "error");
                    }
                });
    }

    $scope.messageSuccess = function (msg) {
        $('.alert-success > p').html(msg);
        $('.alert-success').show();
        $('.alert-success').delay(3000).slideUp(function () {
            $('.alert-success > p').html('');
        });
    };
    $scope.messageError = function (msg) {
        $('.alert-danger > p').html(msg);
        $('.alert-danger').show();
        $('.alert-danger').delay(3000).slideUp(function () {
            $('.alert-danger > p').html('');
        });
    };
});
