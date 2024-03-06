const request = require("supertest");
const app = require("../../app");
const { 
    connectToMongo,
    disconnectToMongo
 } = require("../../services/mongo");


describe("Tests with prerequisites",() => {
    // beforeAll() is a setup function for setting up the environment for tests
    beforeAll(async ()=> {
        await connectToMongo() // this mongo connection stays on after all tests are completed so jest is not exited and that gives an error
    })

    afterAll(async () => {
        await disconnectToMongo()
    })
    describe("Test GET /launches",() => { // a fixture containing a one or more test cases
        test("It should respond with 200",async () =>{
            //a test case
            await request(app)
            .get("/launches")
            .expect(200)
            .expect("Content-Type",/json/)
        })
    }); 
    
    
    describe("Test POST /launch",() => {
        const completeLaunchData = {
            mission:"CHDRTOKPLR",
            rocket:"CHDRU 420-9",
            target:"Kepler-1652 b",
            launchDate:"January 23,2028"
         } 
    
        const launchDataWithoutDate = {
            mission:"CHDRTOKPLR",
            rocket:"CHDRU 420-9",
            target:"Kepler-1652 b"
         } 
    
        test("It should respond with 201 created", async () => {
            const response = await request(app)
             .post("/launches/add")
             .send(completeLaunchData)
             .expect(201) 
             .expect("Content-Type",/json/);
    
            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
            
            expect(responseDate).toBe(requestDate);
            expect(response.body).toMatchObject(launchDataWithoutDate);
        });

        // test("it should throw an error for missing planets" ,async () => {
        //     const response = await request(app)
        //         .post("/launches/add")
        //         .send({target:"kepler 888-9",...completeLaunchData})
        //         .expect()
        // })
    
        test("It should catch missing required properties",async () => {
            const response = await request(app)
                .post("/launches/add")
                .send({
                mission:"sadjsa"
                })
                .expect(400)
                .expect("Content-Type",/json/)
    
            expect(response.body).toStrictEqual({
                error:"Missing launch property"
            })
        });
    
        test("It should catch invalid date format", async () => {
            const response = await request(app)
                .post("/launches/add")
                .send({
                ...completeLaunchData,
                launchDate:"feb 88 3333"
                })
                .expect(400)
                .expect("Content-Type",/json/)
    
            expect(response.body).toStrictEqual({
                error:"Invalid date format"
            }) 
        }); 
    })
})
