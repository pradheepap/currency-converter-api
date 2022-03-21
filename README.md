### Serverless Create Project from Template

sls create --template aws-nodejs --path currency-converter-api

### Serverless Print

sls print --stage prod --region ap-southeast-1

### Environment Variables

Environment variables are maintained in .env

### Serverless Debug 

SLS_DEBUG=*

### Serverless Local Invocation
sls invoke local -f convertCurrency --data '{\"event\": {\"source\":\"USD\",\"destination\":\"INR\",\"units\":20}}'

### Serverless Invoke Function
sls invoke  -f convertCurrency --data '{\"event\": {\"source\":\"USD\",\"destination\":\"INR\",\"units\":20}}'

### Serverless Versions
Any upgrade has to be catered based on this version
Framework Core: 3.7.1
Plugin: 6.1.5
SDK: 4.3.2

### Features
- getTransactionsCount
- getValueInUSD
- listCurrencies
- convertCurrency

### Limitations Exchange Currency
https://openexchangerates.org/
- No convert api directly available.
- Using basic plan to convert only USD as base currency units to other currencies. 
- Since base currency is always USD, the conversion is always from USD to other currencies.

## AppSync Endpoint
https://4im56e5pnjgpbmuqrzcxtgv2lm.appsync-api.ap-southeast-1.amazonaws.com/graphql

### GraphQL Sample Query
query MyQuery {
  convertCurrency(from: "USD", to: "SGD", units: 30, user: "test-1234") {
    amount
    from
    output
    rate
    to
  }
  getTransactionsCount
  getValueInUSD
  listCurrencies
}

### Features To Be Implemented
- Get Popular Currencies.
- Get Transaction History of the user based on username.


### Features Enhancement
- Configure Elastic Search to get Analytics