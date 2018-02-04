'use strict';

//Create router
const express = require('express');
const router = express.Router();
const jwtAuth= require('../../lib/jwtAuth');
const Ad= require('../../models/Ad');



router.use(jwtAuth());

/** GET/ads
 * List the ads
 * Filters:
 * empty: show all ads
 * ?tag=tagname => show adds when the required tagname is within its tags
 * ?forSale=true => show adds with products for sale
 * ?forSale=false => show adds with products wanted
 * ?name=name =>show adds whose name matches or starts with that name
 * 
 * Options 
 * ?includeTotal=true => show the number of elements that match the search params
 * ?skip=someNumber => skips a number of elements
 * ?limit=someNumber => show someNumber of ads tops.
 * ?sort=FIELD => order results by field
 * ?fields=field1 field2 field2 => we only get objects with those fields
 */

/****START get/ads */

router.get('/', async(req, res, next)=>{

  try{
    //Get query params
    const name= req.query.name;
    const price= req.query.price;
    const forSale= req.query.forSale;
    const includeTotal= req.query.includeTotal;
    const tag= req.query.tag;
    const limit= parseInt(req.query.limit);
    const start= parseInt(req.query.start);
    const sort= req.query.sort;
    const fields= req.query.fields;

    //Create empty filter
    const filter = {};
    //Add filter by name if present in query
		if(name) filter.name= new RegExp('^'+name,'i');
		//Add filter by price if present in query
		if (price){ 
			const range = price.split('-');
			if (range.length === 1 ){	//price=X  
				filter.price = Number(range[0]);
			}
			else{
				if (range[0] === ''){ 	// price=-X  price<x
					filter.precio = {'$lte': rango[1]};
				}
				else if(!range[1]){		//price=X- -> precios <x
					filter.price = {'$gte': range[0]};
				}
				else{					// price=X-Y -> price between X and Y
					filter.price = {'$gte' : range[0], '$lte': range[1]};
				}
			}     
		}
		// forSale=true -> add for sale 
		if (forSale) filter.forSale = forSale;

		// Filter by tag
		if (tag) filter.tags = { $in: tag.split(' ')};

		// Se ejecuta la busqueda
		const ads = await Ad.list(filter, limit, start, sort,fields);

		// Si se encuentra en la query includeTotal=true entonces se añade el número total de elementos
		// en la busqueda, independientemente del limit y el skip, util para paginado
		if (includeTotal === 'true'){
			const numRows = await Anuncio.find(filter).exec();
			res.json({ success: 'true', result: ads, total: numRows.length });
		}
		else{
			res.json({ success: 'true', result: ads  });
		}

  }catch(err){
    next(err)
  }
});

/**APIV1 ROUTES  */


/**
 * GET /tags
 * Lista las etiquetas existentes
 */
router.get('/tags', async (req, res, next) =>{
	try{
		const query = Ad.find().distinct('tags');
		const tags = await query.exec();
		res.json({ success: 'true', result: tags });
	}
	catch(err){
		next(err);
	}
});

/**
 * GET /anuncios:id
 * Lista el anuncio con identificado id
 */
router.get('/:id', async (req, res) =>{
	const _id = req.params.id;
	const ad = await Ad.findOne({_id}).exec();
	res.json({ success: 'true', result: ad });
});

/**
 * POST /anuncios
 * Crea un anuncio
 */
router.post('/new', (req, res, next)=>{
	const ad = new Ad(req.body);
	ad.save((err, adSaved)=>{
		if (err) return next(err);
		res.json({ success: 'true', result: adSaved });
	});
});


module.exports = router;