var express = require('express'),
    router = express.Router();

/*
 * GET debitCard/list.
 */
router.get('/list', function(req, res) {
    var db = req.db;
    db.collection('debitCardList').find().toArray(function (err, items) {
        res.json(items);
    });
});

/*
 * POST to debitCard/add.
 */
router.post('/add', function (req, res) {
    var db = req.db;
    db.collection('debitCardList').insert(req.body, function (err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to debitCard/delete.
 */
router.delete('/delete/:id', function(req, res) {
    var db = req.db,
        debitCardToDelete = req.params.id;
    db.collection('debitCardList').removeById(debitCardToDelete, function (err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
