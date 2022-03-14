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
- getCurrencyConverter
- getCurrenciesList

### Exchange Currency
https://openexchangerates.org/
- No convert api directly available.
- Using basic plan to convert only USD as base currency units to other currencies. 

### 


### TO DO
- Configure DynamoDB DS to update data
- Configure Elastic Search to get Analytics