var express = require('express');
var router = express.Router();

/*
 * GET bill-list.
 */
router.get('/list', function(req, res) {
    var db = req.db;
    db.collection('bank').find().toArray(function (err, items) {
        res.json(items);
    });
});

/*
 * POST to bill-add.
 */
router.post('/add', function (req, res) {
    var db = req.db;
    db.collection('bank').insert(req.body, function (err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to bill-delete.
 */
router.delete('/delete/:id', function(req, res) {
    var db = req.db;
    var bankBalanceToDelete = req.params.id;
    db.collection('bank').removeById(bankBalanceToDelete, function (err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
