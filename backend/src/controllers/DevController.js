const axios = require('axios')
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/ParseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

// index, show, store, destroy
module.exports = {
  async index(req,res) {
    const devs = await Dev.find();

    return res.json(devs);
  },
 
  async store(req, res) {
    const { github_username, techs, longitude, latitude } = req.body;
    
    let dev = await Dev.findOne({ github_username });

    if(!dev){
      
      const apiresponse = await axios.get(`https://api.github.com/users/${github_username}`);
      
      const { name = login, avatar_url, bio } = apiresponse.data;
    
      const techsArray = parseStringAsArray(techs);
    
      const location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      }
    
      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location,
      });
      // Filtrar as conexões que estão a no maximo 10km de distancia
      // e que dev tenha uma das techs filtradas.
      const sendSocketMessageTo = findConnections(
        { latitude, longitude },
        techsArray,
      );

      sendMessage(sendSocketMessageTo, 'new-dev', dev);
    }

    return res.json(dev);
  },
};