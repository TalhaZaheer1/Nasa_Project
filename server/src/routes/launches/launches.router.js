const express = require("express")
const { 
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
 } = require("./launches.contoller")

const router = express.Router()


router.get("/",httpGetAllLaunches)
router.post("/add",httpAddNewLaunch)
router.delete("/del/:id",httpAbortLaunch)

module.exports = router