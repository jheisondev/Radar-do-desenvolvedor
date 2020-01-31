const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/ParseStringAsArray');


module.exports = {
  async index(req, res) {
    // Buscar todos devs num raio de 10km
    // Filtros de tecnologia e distancia
    //  console.log(req.query);

    const { longitude, latitude, techs } = req.query;
    // console.log(techs);

    const techsArray = parseStringAsArray(techs);
    // console.log(techsArray);

    
    const devs = await Dev.find({
      techs: {
        $in: techsArray,
      },
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: 10000,
        }
      }
    });
    // console.log({devs});
    return res.json( {devs} );
  }
}