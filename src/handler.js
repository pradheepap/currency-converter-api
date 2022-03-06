
module.exports.convertCurrency = async (event, context) => {
  console.log(`convertCurrency Request - ${JSON.stringify(event)}`);
  console.log(`convertCurrency Context - ${JSON.stringify(context)}`);

  return {


    from: 'USD',
    to: 'EUR',
    amount: 1.5,
    output: 3.4566,

  };
};
