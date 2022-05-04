const express = require('express')
const app = express()

const { orderPrice, tips } = require('./middlewares')

// Routes
// 1)
/* 
    An endpoint that is called with a pair name, and retrieves the tips of the
    orderbook (considering both amount and price for bid and ask).
*/

app.get('/tips', async (req, res) => {
    // this endpoint should be called like: "/tips?pairName=tBTCUSD"
    const { pairName } = req.query
    const orderbookTips = await tips(pairName)
    res.send(orderbookTips)
})

// 2)
/* 
    An endpoint that is called with the pair name, the operation type and the order
    size, and returns the price to execute the order considering its size (i.e.,
    evaluate Market Depth).
*/

app.get('/price', async (req, res) => {
    // this endpoint should be called like: "/price?pairName=tBTCUSD&orderSize=10"
    const { pairName, orderSize } = req.query
    const price = await orderPrice(pairName, orderSize)
    res.send(price)
})



// Start server
app.listen(3001, () => {
    console.log('server listening on port 3001');
})