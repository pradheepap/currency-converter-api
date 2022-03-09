const util = require('./utils/utilities');


module.exports.handleListCurrencies = async (event) => {
  console.log(`${JSON.stringify(event)}`);
  const currencyListReponse = await util.getCurrencyList();
  console.log(`${JSON.stringify(currencyListReponse)}`);
  return currencyListReponse;
};


module.exports.handleConvertCurrency = async (event) => {
  console.log(`${JSON.stringify(event)}`);

  const from = 'USD';
  const to = 'INR';
  const value = 20;

  const convertCurrencyReponse = await util.convertCurrency(value, from, to);

  console.log(`${JSON.stringify(convertCurrencyReponse)}`);

  const rate = convertCurrencyReponse.rates[to];
  const convertedUnits = rate * value;

  console.log(`rate, convertedRate : ${rate} / ${convertedUnits}`);


  // const rate = currencyConvertResponse[to];
  // setOutput(input * rate);
  return {
    from,
    to,
    amount: value,
    output: convertedUnits,
  };
};
