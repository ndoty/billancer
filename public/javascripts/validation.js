window.validate = function (el) {
    var validationType = el.data('validation');

    switch (validationType) {
        case 'undefined':
            return true;
        case 'money':
            return false;
        case 'date':
            return false;
        case 'last4':
            return false;
        default:
            return false;
    }
}