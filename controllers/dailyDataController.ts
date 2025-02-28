const knex = require('knex')(require('../knexfile'));
const axios = require('axios');

const API_BASE_1 = 'https://api.marketdata.app/v1';
const API_BASE_2 = 'https://finnhub.io/api/v1'
const TOKEN = 'ctq1qjpr01qmn6h39l3gctq1qjpr01qmn6h39l40'
const DAYS = 5;
const SYMBOL = 'AAPL';


async function movingAverage() {

    // get last 5 days data

    let fiveDays;

    try {
        fiveDays = (await axios.get(`${API_BASE_1}/stocks/candles/D/${SYMBOL}?countback=${DAYS}&to=today`)).data

        console.log(fiveDays);


    } catch(error) {
        console.log(error);
    }

    // calculate average

    const avg = fiveDays.c.reduce((a: number, b: number) => a + b, 0) / 5

    // get data at 9:30 am

    let todayMorning;

    try {
        todayMorning = (await axios.get(`${API_BASE_2}/quote?symbol=${SYMBOL}&token=${TOKEN}`)).data

        console.log(todayMorning);
    } catch(error) {
        console.log(error);
    }

    // record data

    try {
        let response = await knex.raw(`
            INSERT INTO daily_data (symbol, moving_avg, 930price)
                VALUES ( ?, ?, ? );
        `, [SYMBOL, avg, todayMorning.c] );

        console.log(response);

    } catch(error) {
        console.log(error);
    }


}


async function addDaysData() {

    let data;

    try {
        data = (await axios.get(`${API_BASE_1}/stocks/candles/D/${SYMBOL}?countback=1&to=today`)).data

        console.log(data);


    } catch(error) {
        console.log(error);
    }

    try {

        let yesterdaysDate = new Date(data.t[0] * 1000);
        let stringDate = `${yesterdaysDate.getFullYear()}-${yesterdaysDate.getMonth() + 1}-${yesterdaysDate.getDate()}`;

        let response = await knex.raw(`
            UPDATE daily_data
                SET open = ?, close = ?, high = ?, low = ?, volume = ?
                WHERE data_date = ?
        `, [data.o[0], data.c[0], data.h[0], data.l[0], data.v[0], stringDate]);
        
        console.log(response);

    } catch(error) {
        console.log(error);
    }
}


module.exports = {
    movingAverage,
    addDaysData
}