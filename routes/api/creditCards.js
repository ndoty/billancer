var express = require('express'),
    router = express.Router();

/*
 * GET creditCard/list.
 */
router.get('/list', function(req, res) {
    var db = req.db;
    db.collection('creditCardList').find().toArray(function (err, items) {
        res.json(items);
    });
});

/*
 * POST to creditCard/add.
 */
router.post('/add', function (req, res) {
    var db = req.db;
    db.collection('creditCardList').insert(req.body, function (err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to creditCard/delete.
 */
router.delete('/delete/:id', function(req, res) {
    var db = req.db,
        creditCardToDelete = req.params.id;
    db.collection('creditCardList').removeById(creditCardToDelete, function (err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
