angular.module('billancer', ['ngRoute'])
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl : 'index',
                controller  : 'MainCtrl'
            })
            .when('/bills', {
                templateUrl : '/bills',
                controller  : 'BillsCtrl'
            })
            .when('/transactions', {
                templateUrl : '/transactions',
                controller  : 'TransactionsCtrl'
            })
            .when('/cards', {
                templateUrl : '/cards',
                controller  : 'CardsCtrl'
            })
            .when('/cards/debit', {
                templateUrl : '/cards/debit',
                controller  : 'CardsCtrl'
            })
            .when('/cards/credit', {
                templateUrl : '/cards/credit',
                controller  : 'CardsCtrl'
            })
    })
    .controller('MainCtrl', function ($scope, $filter, $http, $location ) {
        $scope.$on('$routeChangeSuccess', function () {
            focusNavItem($location.url());
            createTableHeaders($location.url());
            colorNumbers();
        });

        $scope.getBalance = function () {
            $http({
                method: 'GET',
                url: '/api/bank/list'
            }).success(function (data, status, headers, config) {
              $scope.bank = data;
              $scope.calculate();
            }).error(function (data, status, headers, config) {
                alert("Cannot get Bank List. Error: " + status);
            });
        }

        $scope.getTransactions = function () {
            $http({
                method: 'GET',
                url: '/api/transactions/list'
            }).success(function (data, status, headers, config) {
              $scope.transactions = data;
              $scope.getBalance();
            }).error(function (data, status, headers, config) {
                alert("Cannot get Transaction List. Error: " + status);
            });
        }

        $scope.getTransactions();

        $scope.calculate = function () {
            $scope.calculations = 0;
            $scope.leftInBank = 0;

            for (key in $scope.transactions) {
                if ($scope.transactions[key].deposit) {
                    $scope.calculations += parseFloat(formatMoneyNumber($scope.transactions[key].amount));
                } else {
                    $scope.calculations -= parseFloat(formatMoneyNumber($scope.transactions[key].amount));
                }
            }

            $scope.leftInBank += $scope.calculations;

            // $scope.balance = formatMoneyString($scope.balance);
        }

        $scope.today = getToday('mdy');
    })
    .controller('TransactionsCtrl', function ($scope, $filter, $http) {
        $scope.today = getToday('mdy');

        $scope.showAddFields = function ($event, selector) {
            toggleAdd($event, selector);
        }

        $scope.updateTransactions = function () {
            $http({
                method: 'GET',
                url: '/api/transactions/list'
            }).success(function (data, status, headers, config) {
              $scope.transactions = data;
            }).error(function (data, status, headers, config) {
                alert("Cannot get Transaction List. Error: " + status);
            });
        };

        $scope.updateTransactions();

        $scope.addTransaction = function () {
            var data = {};

            $('.transactionData').each(function (index) {
                data[$(this).attr('ng-model')] = getData($(this));
            });

            $http({
                method: 'POST',
                data: data,
                url: '/api/transactions/add'
            }).success(function () {
                resetFields('.transactionData');
                $scope.transactions.push(data);
            }).error(function(data, status) {
                alert("Cannot add Transaction. Error: " + status);
            });
        };

        $scope.removeTransaction = function (transaction) {
            // Pop up a confirmation dialog
            var confirmation = confirm('Are you sure you want to delete the transaction ' + transaction.description + '?');

            // Check and make sure the transaction confirmed
            if (confirmation === true) {
                $http({
                    method: 'DELETE',
                    url: '/api/transactions/delete/' + transaction._id
                }).success(function () {
                    $scope.transactions.splice($scope.transactions.indexOf(transaction), 1);
                }).error(function(data, status) {
                    alert("Cannot delete Transaction. Error: " + status);
                });;
            } else {
                return false;
            }
        }
    })
    .controller('BillsCtrl', function ($scope, $filter, $http) {
        $scope.showAddFields = function ($event, selector) {
            toggleAdd($event, selector);
        }

        $scope.updateBills = function () {
            $http({
                method: 'GET',
                url: '/api/bills/list'
            }).success(function (data, status, headers, config) {
              $scope.bills = data;
            }).error(function (data, status, headers, config) {
                alert("Cannot get Bill List. Error: " + status);
            });
        }

        $scope.updateBills();

        $scope.addBill = function () {
            var data = {};

            $('.billData').each(function (index) {
                data[$(this).attr('ng-model')] = getData($(this));
            });

            $http({
                method: 'POST',
                data: data,
                url: '/api/bills/add'
            }).success(function () {
                resetFields('.billData');
                $scope.bills.push(data);
            }).error(function(data, status) {
                alert("Cannot add Bill. Error: " + status);
            });
        };

        $scope.removeBill = function (bill) {
            // Pop up a confirmation dialog
            var confirmation = confirm('Are you sure you want to delete the bill ' + bill.description + '?');

            // Check and make sure the bill confirmed
            if (confirmation === true) {
                $http({
                    method: 'DELETE',
                    url: '/api/bills/delete/' + bill._id
                }).success(function () {
                    $scope.bills.splice($scope.bills.indexOf(bill), 1);
                }).error(function(data, status) {
                    alert("Cannot delete Bill. Error: " + status);
                });;
            } else {
                return false;
            }
        }
    })
    .controller('CardsCtrl', function ($scope, $filter, $http) {
        $scope.showAddFields = function ($event, selector) {
            toggleAdd($event, selector);
        }

        // Debit Card Funtions
        $scope.updateDebitCards = function () {
            $http({
                method: 'GET',
                url: '/api/debitCards/list'
            }).success(function (data, status, headers, config) {
              $scope.debitCards = data;
            }).error(function (data, status, headers, config) {
                alert("Cannot get Card List. Error: " + status);
            });
        }

        $scope.updateDebitCards();

        $scope.addDebitCard = function () {
            var data = {};

            $('input.debitCardData.add').each(function (index) {
                data[$(this).attr('ng-model')] = getData($(this));
            }).promise().done(function () {
                $http({
                    method: 'POST',
                    data: data,
                    url: '/api/debitCards/add'
                }).success(function () {
                    resetFields('.debitCardData');
                    $scope.debitCards.push(data);
                }).error(function(data, status) {
                    alert("Cannot add Card. Error: " + status);
                });
            });
        }

        $scope.updateDebitCard = function ($event, card) {
            var data = {};

            $('tr.active td .input-group input.debitCardData').each(function (index) {
                data[$(this).attr('ng-model')] = getData($(this));
            }).promise().done(function () {
                $http({
                    method: 'POST',
                    data: data,
                    url: '/api/debitCards/add'
                }).success(function () {
                    $scope.debitCards.push(data);
                    toggleEditFields($event, true);
                    $scope.removeDebitCard(card, true);
                }).error(function(data, status) {
                    alert("Cannot add Card. Error: " + status);
                });
            });
        }

        $scope.editDebitCard = function ($event, card) {
            var button = $event.target,
                $parent = $(button).parent().parent();

            for (var k in card) {
                if (card.hasOwnProperty(k)) {
                    populateField($parent.find('.input-group.edit input.debitCardData[ng-model="' + k + '"]'), card[k]);
                }
            }
            toggleEditFields($event);
        }

        $scope.cancelEditDebitCard = function ($event) {
            toggleEditFields($event, true);
        }

        $scope.removeDebitCard = function (card, skipConfirm) {
            if (!skipConfirm) {
                // Pop up a confirmation dialog
                var confirmation = confirm('Are you sure you want to delete the card ' + card.description + ' ending in ' + card.last4 + '?');
            }

            // Check and make sure the card confirmed
            if (confirmation === true || skipConfirm) {
                $http({
                    method: 'DELETE',
                    url: '/api/debitCards/delete/' + card._id
                }).success(function () {
                    $scope.debitCards.splice($scope.debitCards.indexOf(card), 1);
                }).error(function(data, status) {
                    alert("Cannot delete card. Error: " + status);
                });;
            } else {
                return false;
            }
        }

        // Credit Card Functions
        $scope.updateCreditCards = function () {
            $http({
                method: 'GET',
                url: '/api/creditCards/list'
            }).success(function (data, status, headers, config) {
              $scope.creditCards = data;
            }).error(function (data, status, headers, config) {
                alert("Cannot get Card List. Error: " + status);
            });
        }

        $scope.updateCreditCards();

         $scope.addCreditCard = function () {
            var data = {};

            $('input.creditCardData.add').each(function (index) {
                data[$(this).attr('ng-model')] = getData($(this));
            }).promise().done(function () {
                $http({
                    method: 'POST',
                    data: data,
                    url: '/api/creditCards/add'
                }).success(function () {
                    resetFields('.creditCardData');
                    $scope.creditCards.push(data);
                }).error(function(data, status) {
                    alert("Cannot add Card. Error: " + status);
                });
            });
        }

        $scope.updateCreditCard = function ($event, card) {
            var data = {};

            $('tr.active td .input-group input.creditCardData').each(function (index) {
                data[$(this).attr('ng-model')] = getData($(this));
            }).promise().done(function () {
                $http({
                    method: 'POST',
                    data: data,
                    url: '/api/creditCards/add'
                }).success(function () {
                    $scope.creditCards.push(data);
                    toggleEditFields($event, true);
                    $scope.removeCreditCard(card, true);
                }).error(function(data, status) {
                    alert("Cannot add Card. Error: " + status);
                });
            });
        }

        $scope.editCreditCard = function ($event, card) {
            var button = $event.target,
                $parent = $(button).parent().parent();

            for (var k in card) {
                if (card.hasOwnProperty(k)) {
                    populateField($parent.find('.input-group.edit input.creditCardData[ng-model="' + k + '"]'), card[k]);
                }
            }
            toggleEditFields($event);
        }

        $scope.cancelEditCreditCard = function ($event) {
            toggleEditFields($event, true);
        }

        $scope.removeCreditCard = function (card, skipConfirm) {
            if (!skipConfirm) {
                // Pop up a confirmation dialog
                var confirmation = confirm('Are you sure you want to delete the card ' + card.description + ' ending in ' + card.last4 + '?');
            }

            // Check and make sure the card confirmed
            if (confirmation === true || skipConfirm) {
                $http({
                    method: 'DELETE',
                    url: '/api/creditCards/delete/' + card._id
                }).success(function () {
                    $scope.creditCards.splice($scope.creditCards.indexOf(card), 1);
                }).error(function(data, status) {
                    alert("Cannot delete card. Error: " + status);
                });;
            } else {
                return false;
            }
        }
    })