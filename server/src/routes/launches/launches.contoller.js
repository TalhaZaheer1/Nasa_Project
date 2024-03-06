const {
    getLaunches,
    addNewLaunch,
    abortLaunch,
    existsLaunchWithId
} = require("../../models/launches.model")
const { getPagination } = require("../query")
async function httpGetAllLaunches(req,res) {
    const { skip,limit } = getPagination(req.query);
    return res.json(await getLaunches(skip,limit));
}

async function httpAddNewLaunch(req,res){
    const launch = req.body;
    if(!launch.launchDate || !launch.mission || !launch.target || !launch.rocket){
        return res.status(400).json({
            error:"Missing launch property"
        })
    }
    launch.launchDate = new Date(launch.launchDate);
    //isNaN automatically checks if date.valueOf() is NaN 
    if(isNaN(launch.launchDate)){
        return res.status(400).json({
            error:"Invalid date format"
        })
    }
    await addNewLaunch(launch)
    return res.status(201).json(launch)
}

async function httpAbortLaunch(req,res){
    const { id } = req.params
    const exists = await existsLaunchWithId(id);
    if(!exists){
    return   res.status(404).json({
        error:"mission not found"
    })
}
    const aborted = await abortLaunch(id)
    if(!aborted)
        return res.status(400).json({
        error:"Mission not aborted"
    })
    return res.status(200).json({
        ok:true
    })
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}