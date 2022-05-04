const axios = require('axios')

/* 
    Ticker
    The ticker endpoint provides a high level overview of the state of the market for a specified pair. 
    It shows the current best bid and ask, the last traded price, as well as information on the daily 
    volume and price movement over the last day.
*/
const baseUrl = "https://api-pub.bitfinex.com/v2/";
const pathParams = "ticker/"

// A market order generally will execute at or near the current bid (for a sell order) ->  HIGHEST PRICE
// or ask (for a buy order) price ->  LOWEST PRICE

// how I will approach this: calculate the spread between bid and asks highest and lowest respectively.
// in Binance, the spreads are measured in units of 0.01, 0.1, 1, 10, 50 and 100
// if there's no spread (meaning is = to 0.01, like bitcoin at the time I'm doing this challenge)
// make a condition if total (QxP) of bids (at the highest price) are higher than total of asks (at the lower price), 
// increment the last placed bid by 0.01
// and if total asks > total bids, decrease sell price by 0.01

// if the spread is > than 0.01 (0.1, 1, etc) the increments and decrements will be in those units

async function orderPrice(pairName, orderSize) {
    const ticker = await axios.get(`${baseUrl}/${pathParams}/${pairName}`)
        .then(response => response.data)
        .catch(err => console.log(err))

    const [
        BID, // Price of last highest bid
        BID_SIZE, // Sum of the 25 highest bid sizes
        ASK, // Price of last lowest ask
        ASK_SIZE, // Sum of the 25 lowest ask sizes
        DAILY_CHANGE, // Amount that the last price has changed since yesterday
        DAILY_CHANGE_RELATIVE, // Relative price change since yesterday (*100 for percentage change)
        LAST_PRICE, // Price of the last trade
        VOLUME, // Daily volume
        HIGH, // Daily high
        LOW // Daily low
    ] = ticker

    const spreads = [0.01, 0.1, 1, 10, 50, 100]
    const currentSpread = ASK - BID

    const bidsTotalHighestPrice = BID_SIZE * BID
    const asksTotalLowerPrice = ASK_SIZE * ASK

    let spreadMarker
    for (let i = 0; i < spreads.length; i++) {
        if (currentSpread >= spreads[i]) {
            spreadMarker = spreads[i]
        }
    }

    let order_price

    if (bidsTotalHighestPrice >= asksTotalLowerPrice) {
        order_price = (BID + spreadMarker) * orderSize
        return { ORDER_PRICE: order_price, LAST_PRICE, BID }
    }
    if (bidsTotalHighestPrice < asksTotalLowerPrice) {
        order_price = (ASK - spreadMarker) * orderSize
        return { ORDER_PRICE: order_price, LAST_PRICE, ASK }
    }

    // Comments: I suppose the point of the challenge is to retrieve a value similar to "LAST_PRICE",
    // that's why I return an object with both properties for comparison purposes
}

async function tips(pairName) {
    const ticker = await axios.get(`${baseUrl}/${pathParams}/${pairName}`)
        .then(response => response.data)
        .catch(err => console.log(err))

    const [
        BID,
        BID_SIZE,
        ASK,
        ASK_SIZE,
        DAILY_CHANGE,
        DAILY_CHANGE_RELATIVE,
        LAST_PRICE,
        VOLUME,
        HIGH,
        LOW,
    ] = ticker

    const bidsTotalHighestPrice = BID_SIZE * BID
    const asksTotalLowerPrice = ASK_SIZE * ASK

    return {
        BID_TIP: bidsTotalHighestPrice,
        ASK_TIP: asksTotalLowerPrice
    }

}

module.exports = {
    orderPrice,
    tips
}