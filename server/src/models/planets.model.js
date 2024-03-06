const fs = require("fs");
const { parse } = require("csv-parse");
const { resolve } = require("path");

const planets = require("./planets.mongo")

const habitablePlanets = [];

const isHabitable = (planet) => {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
};

const isPlanetAvailable = new Promise((resolve, reject) => {
  fs.createReadStream("data/planets.csv") //returns an event emitter
    .pipe(
      parse({
        comment: "#",
        columns: true,
      })
    )
    .on("data", async (data) => {
      if (isHabitable(data)) {
        await savePlanet(data);
      }
    })
    .on("error", (err) => {
      console.log(err);
      reject();
    })
    .on("end", () => {
      resolve();
    });
});


async function getAllPlanets(){
    return await planets.find({}) 
};

async function savePlanet(planet){
    try{
        // insert + update = upsert
        await planets.updateOne({
            keplerName: planet.kepler_name
        },{
            keplerName: planet.kepler_name
        },{
            upsert:true
        })
    }catch(err){
        console.error(err)
    }
};

module.exports = {
  isPlanetAvailable,
  getAllPlanets
};
