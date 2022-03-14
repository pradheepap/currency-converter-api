/* eslint no-restricted-globals:0 */

const uuid = require('uuid');
const util = require('./utils/utilities');
const dynamoDbService = require('./utils/dynamodbUtils');

const Constants = {
  CURRENCY_VALUE_USD_PK: 'CURRENCY_VALUE_IN_USD',
  ANALYTICS_SK: 'ANALYTICS',
  TOTAL_ITEMS_PK: 'TOTAL_ITEMS'
};


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
    PK: id,
    SK: `${from}-${to}`,
    SOURCE: from,
    DESTINATION: to,
  };

  await dynamoDbService.createItem(CurrencyItem);

  /** Get & Update Analytics Information */
  const countResponse = await dynamoDbService.queryCurrencyTxAnalyticsCount(Constants.TOTAL_ITEMS_PK);
  console.log(`countInt : ${JSON.stringify(countResponse)}`);
  let countInt;

  if (countResponse) {
    // Update Existing Item
    countInt = (countResponse.VALUE, 10);
    countInt += 1;
    await dynamoDbService.UpdateCurrencyAnalytics(Constants.TOTAL_ITEMS_PK, Constants.ANALYTICS_SK, countInt);

  }else{
    // Create new item
    const CurrencyAnalyticsItem = {
      PK: Constants.TOTAL_ITEMS_PK,
      SK: Constants.ANALYTICS_SK,
      VALUE: 1,
    };
    await dynamoDbService.createItem(CurrencyAnalyticsItem);

  }

  // const CURRENCY_VALUE_USD_PK = Constants.CURRENCY_VALUE_USD_PK;
  const currencyValueInUSDResponse =  await dynamoDbService.queryCurrencyTxAnalyticsCount(Constants.CURRENCY_VALUE_USD_PK);
  console.log(`currencyValueInUSDResponse : ${JSON.stringify(currencyValueInUSDResponse)}`);
  let currencyValueInUSD;
  if (currencyValueInUSDResponse) {
    // Update TotalCurrencyValueinUSD
    currencyValueInUSD = currencyValueInUSDResponse.VALUE;
    currencyValueInUSD += units; // Source is always USD for now
    console.log('currencyValueInUSD is', currencyValueInUSD)
    await dynamoDbService.UpdateCurrencyAnalytics(Constants.CURRENCY_VALUE_USD_PK, Constants.ANALYTICS_SK, currencyValueInUSD);
  }else{
    // Create new  USD item
    const CurrencyAnalyticsItem = {
      PK: Constants.CURRENCY_VALUE_USD_PK,
      SK: Constants.ANALYTICS_SK,
      VALUE: units,
    };
    await dynamoDbService.createItem(CurrencyAnalyticsItem);

  }

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
