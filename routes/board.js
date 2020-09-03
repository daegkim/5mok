var express = require('express');
var router = express.Router();
//const algo = require('../utils/algorithm')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('board', { title: 'Board' });
});

router.get('/putStoneOnBoard', function(req, res, next) {
    console.log(req.query)
    let x = parseInt(req.query.x)
    let y = parseInt(req.query.y)
    let player = parseInt(req.query.player)

    if(algo.putStoneOnMap(x,y,player)){
        algo.initMap()
        res.send({isCheckmate:'checkmate'})
    }
    else{
        res.send({isCheckmate: ''})
    }
});

module.exports = router;
