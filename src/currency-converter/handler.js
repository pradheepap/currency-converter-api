const util = require('./utils/utilities');


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

  console.log(`from : ${from}`);
  console.log(`to : ${to}`);

  console.log(`units : ${units}`);



// //   const from = 'USD';
//   const to = 'INR';
//   const units = 20;

  const convertCurrencyRatesReponse = await util.getConvertRates();

 // console.log(`${JSON.stringify(convertCurrencyRatesReponse)}`);

  const rate = convertCurrencyRatesReponse.rates[to];
  const convertedUnits = rate * units;

 // console.log(`rate, convertedRate : ${rate} / ${convertedUnits}`);


  // const rate = currencyConvertResponse[to];
  // setOutput(input * rate);
  let response= {
    from,
    to,
    amount: units,
    output: convertedUnits,
  };

  return response;
};
