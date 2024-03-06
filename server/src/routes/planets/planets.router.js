const express = require("express");
const { getPlanets } = require("./planets.controller")
const router = express.Router()

router.get("/",getPlanets);

module.exports = router