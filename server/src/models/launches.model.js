const launchesModal = require("./launches.mongo")
const planetsModal = require("./planets.mongo")

const axios = require("axios");

const DEFAULT_NUMBER = 100;

// const launchesA = new Map();
// const launchA = {
//   flightNumber: 100,//flight_number
//   launchDate: new Date("January 29,2024"), //date_local
//   mission: "Excelsior KSA 66", // name
//   rocket: "Explorer IS1", // rocket.name
//   target: "Kepler 987-b",
//   upcoming: true, // upcoming
//   customers: ["ZTM", "DELL"],
//   success: true, // success
// };

// launches.set(launch.flightNumber, launch);

async function getLaunches(skip,limit) {
  const lnchs = await launchesModal.find({},{"_id":0,"__v":0})
  .skip(skip)
  .limit(limit)
  .sort({flightNumber:1});
  return lnchs
}

async function getLatestFlightNumber(){
  const latestLaunch = await launchesModal.findOne().sort("-flightNumber");
  console.log(latestLaunch)
  if(!latestLaunch)
    return DEFAULT_NUMBER
  return ++latestLaunch.flightNumber
}

async function saveLaunch(launch){
  await launchesModal.updateOne({
    flightNumber:launch.flightNumber
  },launch,{
    upsert:true
  });
}

async function addNewLaunch(launch){
  const planet = await planetsModal.findOne({
    keplerName:launch.target
  })

  if(!planet)
    throw new Error("launch target not found in planets list");

  const latestNumber = await getLatestFlightNumber();

  const newLaunch = Object.assign(launch,{
    flightNumber:latestNumber,
    upcoming:true,
    success:true,
    customers:["NASA","ZTM"]
  })

  await saveLaunch(newLaunch);
  return newLaunch
}

async function existsLaunchWithId(id) {
  return await launchExists({flightNumber:+id});
}

async function abortLaunch(id) {
  const aborted = await launchesModal.updateOne({flightNumber:+id},{
    upcoming:false,
    success:false
  }) 
  console.log(aborted)
  return aborted.matchedCount === 1 && aborted.modifiedCount === 1
}

async function populateLaunches(){
  const response = await axios.post("https://api.spacexdata.com/v4/launches/query",{
    query:{},
    options:{
      pagination:false,
      populate:[
        {
          path:"rocket",
          select:{
            name:1
          }
        },
        {
          path:"payloads",
          select:{
            customers:1
          }
        }
      ]   
    }
  })

  if(response.status !== 200){
    console.log("Launch Data Downloading FAILED!");
    throw new Error("Launches data downloading FAILED!");
  }

  const launchDocs = response.data.docs;
  for(const launchDoc of launchDocs){
    const customers = launchDoc.payloads.flatMap((payload) => payload.customers);
    const launch = {
      flightNumber: launchDoc.flight_number,//flight_number
      launchDate: launchDoc.date_local, //date_local
      mission: launchDoc.name, // name
      rocket: launchDoc.rocket.name, // rocket.name
      target:"fkjdsalkfj",
      upcoming: launchDoc.upcoming, // upcoming
      customers: customers,
      success: launchDoc.success, // success
    };
    
    await saveLaunch(launch);   
    
  }
}

async function launchExists(filter){
  return await launchesModal.findOne(filter);
}

async function loadLaunchData(){
  const firstLaunch = await launchExists({
    flightNumber:1,
    mission:"FalconSat",
  })
  if(firstLaunch){
    console.log("Launches already populated")
  }else{
    await populateLaunches()
  }
}



module.exports = {
  getLaunches,
  addNewLaunch,
  existsLaunchWithId,
  abortLaunch,
  loadLaunchData
};
