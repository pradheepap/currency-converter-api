const util = require('./utils/utilities');
const dynamoDbService = require('./utils/dynamodbUtils');
const uuid = require("uuid");
const Constants = {
  "ANALYTICS_SK" : "ANALYTICS" 
}


module.exports.handleListCurrencies = async (event, context) => {
  console.log(`Event : ${JSON.stringify(event)}`);
  console.log(`Context : ${JSON.stringify(context)}`);

  const currencyListReponse = await util.getCurrencyList();
  console.log(`${JSON.stringify(currencyListReponse)}`);
  return currencyListReponse;
};


module.exports.handleConvertCurrency = async (event, context) => {
  console.log(`Event : ${JSON.stringify(event)}`);
  console.log(`Context : ${JSON.stringify(context)}`);
  const { from, to, units } = event;

  const id = uuid.v1();

  console.log(`from : ${from}`);
  console.log(`to : ${to}`);
  console.log(`units : ${units}`);


  const convertCurrencyRatesReponse = await util.getConvertRates();

  // console.log(`${JSON.stringify(convertCurrencyRatesReponse)}`);

  const rate = convertCurrencyRatesReponse.rates[to];
  const convertedUnits = rate * units;


  const CurrencyItem = {
    "PK": id,
    "SK" : `${from}-${to}`,
    "SOURCE": from,
    "DESTINATION": to
  }

  await dynamoDbService.createItem(CurrencyItem);

  /** Get & Update Analytics Information */
  const CURRENCY_TX_COUNT_PK = "TOTAL_ITEMS"; 
  const countResponse =  await dynamoDbService.queryCurrencyTxAnalyticsCount(CURRENCY_TX_COUNT_PK);
  console.log(`countInt : ${JSON.stringify(countResponse)}`);
  let countInt;
  if(countResponse){
    countInt = parseInt(countResponse.VALUE);
  }

  console.log(`countInt : ${countInt}`);

  if(isNaN(countInt)) {
    countInt = 1;
    // Create new item
    const CurrencyAnalyticsItem = {
      "PK": CURRENCY_TX_COUNT_PK,
      "SK": Constants.ANALYTICS_SK,
      "VALUE" :  String(countInt++),
    }
    await dynamoDbService.createItem(CurrencyAnalyticsItem);
  }else{
    // const CurrencyAnalyticsItem = {
    //   "PK": CURRENCY_TX_COUNT_PK,
    //   "SK": "ANALYTICS",
    // }
    countInt++;
    const count = String(countInt);
    await dynamoDbService.UpdateCurrencyAnalytics(CURRENCY_TX_COUNT_PK, Constants.ANALYTICS_SK, count);
  }
  
  


  // const CURRENCY_VALUE_USD_PK = "TOTAL_VALUE_IN_USD"; 
  // const currencyValueInUSD =  dynamoDbService.queryCurrencyTxAnalyticsCount("CURRENCY_TX_COUNT_PK");
  // let CurrencyValueInUSDitem;
  // const CurrencyValueInUSD = {
  //   "PK" : CURRENCY_TX_COUNT_PK
  // }

  // if(!count) {
  //   count = 1;
  // }
  // CurrencyTxItem = {
  //   "PK" : CURRENCY_VALUE_USD_PK
  // }
  // /** Update Count */
  // await dynamoDbService.UpdateCurrencyAnalytics(CurrencyTxItem);


  console.log(`rate, convertedRate : ${rate} / ${convertedUnits}`);


  const response = {
    from,
    to,
    amount: units,
    output: convertedUnits,
  };

  return response;
};
