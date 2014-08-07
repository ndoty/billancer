window.formatMoneyString = function (n) {
    n = formatMoneyNumber(n);
    n = parseFloat(n);
    return "$" + n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
}

window.formatMoneyNumber = function (n) {
    return Number(n.replace(/[^0-9\.]+/g,""));
}

window.getData = function (obj) {
    switch (obj.attr('type')) {
        case 'checkbox':
            return $(obj).prop('checked');
        default:
            if (obj.data('validation') === 'money') {
                return formatMoneyString(obj.val());
            } else {
                return obj.val();
            }
    }
}

window.populateField = function (field, val) {
    switch (field.attr('type')) {
        case 'checkbox':
            field.prop('checked', val);
            field.trigger('change');
        default:
    }       field.val(val);
}

window.getToday = function (format) {
    var date = new Date(),
        day = date.getDate(),
        month = date.getMonth(),
        year = date.getFullYear();

    switch (format) {
        case 'mdy':
            return month + "/" + day + "/" + year;
        case 'myd':
            return month + "/" + year + "/" + day;
        case 'dmy':
            return day + "/" + month + "/" + year;
        case 'dym':
            return day + "/" + year + "/" + month;
        case 'ydm':
            return year + "/" + day + "/" + month;
        case 'ymd':
            return year + "/" + month + "/" + day;
    }
}

window.resetFields = function (fields) {
    $(fields).each(function (index) {
        if ($(this).attr('type') === 'checkbox') {
            $(this).prop('checked', false);
            $(this).trigger('change');
        } else {
            $(this).val('');
        }
    });
}

window.createTableHeaders = function (route) {
    var create = true,
        previousRoute = '',
        selector2 = false;

    if (previousRoute !== route) {
        switch (route) {
            case '/bills':
                selector = '.bills';
                break;
            case '/transactions':
                selector = '.transactions';
                break;
            case '/cards':
                selector = '.debitCards';
                selector2 = '.creditCards';
                break;
            default:
                create = false;
                break;
        }

        if (create) {
            window.setTimeout(function () {
                var dom = "<tr>";
                $('fieldset' + selector + ' input[ng-model]').each(function () {
                    dom += '<td>' + $(this).data('label') + '</td>'
                });
                dom += "</tr>";

                $('table' + selector).prepend(dom);
                previousRoute = route;

                if (selector2) {
                    var dom = "<tr>";
                    $('fieldset' + selector2 + ' input[ng-model]').each(function () {
                        dom += '<td>' + $(this).data('label') + '</td>'
                    });
                    dom += "</tr>";

                    $('table' + selector2).prepend(dom);
                }
            }, 0)
        }
    }
}

window.cleanRoute = function (route) {
    route = route.split('/');
    return route;
}

window.focusNavItem = function (route) {
    route = cleanRoute(route);
    $('.nav.navbar-nav li.active').removeClass('active');
    $('.nav.navbar-nav li a[href="' + '#/' + route[1] + '"]').parent('li').addClass('active');
}

window.toggleAdd = function ($event, selector) {
    var state = $('.panel .panel' + selector).data('state');
    if (state === 'closed') {
        $('.panel .panel' + selector).slideDown().data('state', 'open');
        var content = $('.showAddFields' + selector).html();
        content = 'Hide ' + content;
        $('.showAddFields' + selector).html(content);
    } else {
        $('.panel .panel' + selector).slideUp().data('state', 'closed');
        var content = $('.showAddFields' + selector).html();
        content = content.replace('Hide ', '');
        $('.showAddFields' + selector).html(content);
    }
}

window.colorNumbers = function () {
    window.setTimeout(function () {
        $(".number").css('color', 'green');
        $(".number:contains('-')").css('color', 'red');

    },100);
}

window.toggleEditFields = function ($event, cancel) {
    var button = $event.target,
        $parent = $(button).parent().parent();

    if (!cancel) {
        $('tr.active td .input-group.edit').toggleClass('hide').prev('span').toggleClass('hide')
        $('tr.active td .btn.edit').toggleClass('hide');
        $('tr.active td .btn.update').toggleClass('hide');
        $('tr.active td .btn.remove').toggleClass('hide');
        $('tr.active td .btn.cancel').toggleClass('hide');
        $('tr.active').toggleClass('active');
    }

    $parent.toggleClass('active');
    $parent.find('td .input-group.edit').toggleClass('hide').prev('span').toggleClass('hide')
    $parent.find('td .btn.edit').toggleClass('hide');
    $parent.find('td .btn.update').toggleClass('hide');
    $parent.find('td .btn.remove').toggleClass('hide');
    $parent.find('td .btn.cancel').toggleClass('hide');

}