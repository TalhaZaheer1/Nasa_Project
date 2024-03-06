const {getAllPlanets} = require("../../models/planets.model")

async function getPlanets(req,res) {
    return res.json(await getAllPlanets())
}

module.exports = {
    getPlanets
}