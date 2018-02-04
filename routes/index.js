const express = require('express');
const router = express.Router();

const fetch = require('node-fetch');
/* GET home page. */
router.get('/', function(req, res) {
	const baseUrl = req ? `${req.protocol}://${req.get('Host')}` : '';
	fetch(baseUrl + '/apiv1/ads/',{
		method: 'GET'
	})
		.then(result => result.json())
		.then(data => res.render('index', { title: 'Nodepop', ads: data.result }));
  
});

module.exports = router;