const schedule = require('node-schedule');
// const axios = require('axios');
const controller = require("./controllers/dailyDataController");

const job = schedule.scheduleJob('30 9 * * *', async () => {
    console.log("Getting today's 5 day moving average.");
    await controller.movingAverage();
    await controller.addDaysData();
});