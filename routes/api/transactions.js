var express = require('express');
var router = express.Router();

/*
 * GET transaction-list.
 */
router.get('/list', function(req, res) {
    var db = req.db;
    db.collection('transactionList').find().toArray(function (err, items) {
        res.json(items);
    });
});

/*
 * POST to transaction-add.
 */
router.post('/add', function (req, res) {
    var db = req.db;
    db.collection('transactionList').insert(req.body, function (err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to transaction-delete.
 */
router.delete('/delete/:id', function(req, res) {
    var db = req.db;
    var transactionToDelete = req.params.id;
    db.collection('transactionList').removeById(transactionToDelete, function (err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
