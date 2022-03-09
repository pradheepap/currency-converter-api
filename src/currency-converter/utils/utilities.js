const fetch = require('node-fetch');
const { ApiError } = require('./error');

const CURRENCY_EXCHANGE_API_HOME = process.env.API_HOME;
const { APP_ID } = process.env;

module.exports.getCurrencyList = async () => {
  const CURRENCIES_PATH = 'currencies.json';


  let currencyExchangeResponse = null;
  let currencyExchangeJsonResponse = null;

  const queryParameters = [
    `app_id=${APP_ID}`,
  ].join('&');
  const urlWithQueryParams = `${CURRENCY_EXCHANGE_API_HOME}/${CURRENCIES_PATH}/?${queryParameters}`;

  const request = {
    method: 'GET',
    url: urlWithQueryParams,
  };

  try {
    console.log(`makeCurrencyExchangeRequest - request : ${JSON.stringify(request)}`);
    currencyExchangeResponse = await fetch(request.url, { method: request.method, headers: request.headers });


    if (!currencyExchangeResponse || !currencyExchangeResponse.ok) {
      console.log(`makeCurrencyExchangeRequest - currencyExchangeResponse status : ${currencyExchangeResponse.status}`);
      console.log(`makeCurrencyExchangeRequest - currencyExchangeResponse : ${JSON.stringify(currencyExchangeResponse)}`);
      return new ApiError('Error retrieving data from CurrencyExchange');
    }

    currencyExchangeJsonResponse = await currencyExchangeResponse.json();
    console.log(`makeCurrencyExchangeRequest - currencyExchangeResponse ; ${JSON.stringify(currencyExchangeJsonResponse)}`);
  } catch (error) {
    console.log(`makeCurrencyExchangeRequest - error : ${error}`);
    return new ApiError(error);
  }

  if (currencyExchangeJsonResponse.httpCode && currencyExchangeJsonResponse.httpCode !== 200) {
    console.log(`makeCurrencyExchangeRequest - currencyExchangeJsonResponse : ${JSON.stringify(currencyExchangeJsonResponse)}`);
    return new ApiError(currencyExchangeJsonResponse.httpMessage);
  }
  currencyExchangeResponse = currencyExchangeJsonResponse;
  console.log(`${JSON.stringify(currencyExchangeJsonResponse)}`);


  return currencyExchangeResponse;
};

module.exports.getConvertRates = async () => {
  let currencyConvertResponse = null;
  let currencyConvertJsonResponse = null;
  const LATEST_PATH = 'latest.json';

  const queryParameters = [
    `app_id=${APP_ID}`,
  ].join('&');
  const urlWithQueryParams = `${CURRENCY_EXCHANGE_API_HOME}/${LATEST_PATH}?${queryParameters}`;

  const request = {
    method: 'GET',
    url: urlWithQueryParams,
  };

  try {
    console.log(`makeCurrencyConvertRequest - request : ${JSON.stringify(request)}`);
    currencyConvertResponse = await fetch(request.url, { method: request.method, headers: request.headers });


    if (!currencyConvertResponse || !currencyConvertResponse.ok) {
      console.log(`makecurrencyConvertRequest - currencyConvertResponse status : ${currencyConvertResponse.status}`);
      console.log(`makecurrencyConvertRequest - currencyConvertResponse : ${JSON.stringify(currencyConvertResponse)}`);
      return new ApiError('Error retrieving data from currencyConvert');
    }

    currencyConvertJsonResponse = await currencyConvertResponse.json();
    console.log(`makecurrencyConvertRequest - currencyConvertResponse ; ${JSON.stringify(currencyConvertJsonResponse)}`);
  } catch (error) {
    console.log(`makecurrencyConvertRequest - error : ${error}`);
    return new ApiError(error);
  }

  if (currencyConvertJsonResponse.httpCode && currencyConvertJsonResponse.httpCode !== 200) {
    console.log(`makecurrencyConvertRequest - currencyConvertJsonResponse : ${JSON.stringify(currencyConvertJsonResponse)}`);
    return new ApiError(currencyConvertJsonResponse.httpMessage);
  }
  currencyConvertResponse = currencyConvertJsonResponse;
  console.log(`${JSON.stringify(currencyConvertJsonResponse)}`);

  return currencyConvertResponse;
};
