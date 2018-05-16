// Application module
angular.module('crudApp', ['crudApp.controllers', 'datatables']);
angular.module('crudApp.controllers', []).controller('userController', function ($scope, $http, DTOptionsBuilder, DTColumnBuilder, $compile) {
    // USER LIST VIEW CALL HERE 
    getUserList();
    function getUserList() {
        var data1 = $.param({
            'data': '',
            'type': 'getUserData'
        });
        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };
        $scope.dtOptionsUser = DTOptionsBuilder.newOptions().withOption('ajax', function (data, callback) {
            $http.post('action.php', data1, config).success(function (response) {
                if (response) {
                    callback({
                        data: response.result
                    });
                } else {

                }
            });
        })
        .withDataProp('data')
        .withOption('stateSave', true)
        .withOption('responsive', true)
        .withOption('order', [0, 'asc'])
        .withOption('createdRow', createdRow)
        .withOption('scrollX', '100%')
        .withOption('lengthMenu', [3, 5, 10, 50]);
        
        $scope.dtColumnsUser = [
            DTColumnBuilder.newColumn('u_fname').withTitle('First Name'),
            DTColumnBuilder.newColumn('u_lname').withTitle('Last Name'),
            DTColumnBuilder.newColumn('u_email').withTitle('Email'),
            DTColumnBuilder.newColumn('u_phone').withTitle("Phone"),
            DTColumnBuilder.newColumn('u_address').withTitle("Address"),
            DTColumnBuilder.newColumn(null).withTitle("Action").withOption('u_fname', 'u_id').notSortable().renderWith(function (data, type, full, meta) {
                return '<button class="btn btn-warning" ng-click="editUser(\'' + data.u_id + '\')" title="Edit">' +
                        '   <i class="fa fa-edit"></i>' +
                        '</button>&nbsp;' +
                        '<button class="btn btn-danger" ng-click="deleteUser(\'' + data.u_id + '\')" title="Delete">' +
                        '   <i class="fa fa-trash-o"></i>' +
                        '</button>';
            })
        ];
    }
    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
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
                $scope.messageSuccess(response.message);
                setTimeout(function () {
                    $('#userInsert')[0].reset();
                    $(".close").trigger("click");
                }, 2000);
                $scope.dtInstance._renderer.rerender();
            } else {
                $scope.messageError(response.message);
            }
        });
    };

    // EDIT USER CALL HERE 
    $scope.currentUserData = {};
    $scope.editUser = function (user_id) {
        var data = $.param({
            'data': '',
            'type': 'getUserDataById',
            'user_id': user_id
        });
        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };
        $http.post('action.php', data, config).success(function (response) {
            if (response.status == 1) {
                $scope.currentUserData = response.result;
                $("#editFormModal").trigger("click");
            }
        });

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
                $scope.messageSuccess(response.message);
                setTimeout(function () {
                    getUserList();
                    $(".close").trigger("click");
                }, 2000);
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
                            getUserList();
                            $scope.dtInstance._renderer.rerender();
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

//        $scope.dtOptionsUser = DTOptionsBuilder.fromSource("http://localhost:898/rajesh/angular/list.php")
//                .withOption('stateSave', true)
//                // Active Responsive plugin
//                .withOption('responsive', true)
//                .withOption('order', [0, 'asc'])
//                .withOption('createdRow', createdRow) // Here, I recompile the table's rows
//                .withOption('scrollX', '100%')
//                .withOption('lengthMenu', [3, 5, 10, 50]);