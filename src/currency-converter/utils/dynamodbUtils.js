const AWS = require('aws-sdk');

AWS.config.apiVersions = {
  dynamodb: '2012-08-10',
};

const CURRENCY_TRANSACTIONS_TABLE = process.env.CURRENCY_TRANSACTIONS;
const docClient = new AWS.DynamoDB.DocumentClient();

const persistToDB = async (params) => {
  try {
    return docClient
      .put(params)
      .promise()
      .then((res) => {
        console.log(`persistToDB  - res :${JSON.stringify(res)}`);
        return res;
      })
      .catch((error) => {
        console.log(`persistToDB  - Error :${JSON.stringify(error)}`);
        throw error;
      });
  } catch (error) {
    console.log(error.stack);
    console.log('Error ..');
    return console.log(
      `persistToDB  - Error persisting to DB : ${JSON.stringify(error)}`,
    );
  }
};


const updateDB = async (params) => {
  try {
    return docClient
      .update(params)
      .promise()
      .then((res) => {
        console.log(`updateDB  - res :${JSON.stringify(res)}`);
        return res;
      })
      .catch((error) => {
        console.log(`updateDB  - Error :${JSON.stringify(error)}`);
        throw error;
      });
  } catch (error) {
    return console.log(
      `updateDB  - Error updating DB : ${JSON.stringify(error)}`,
    );
  }
};

const queryItem = async (params) => {
  try {
    return docClient
      .query(params)
      .promise()
      .then((res) => {
        console.log(
          `queryItem - result from query operation  - ${JSON.stringify(res)}`,
        );
        return res;
      })
      .catch((err) => err);
  } catch (err) {
    console.log(`queryItem - Error querying item in db : ${err}`);
    return err;
  }
};

module.exports.createItem = async (item) => {
  const now = new Date().toISOString();

  const createItem = {
    ...item,
    createdAt: now,
  };

  const params = {
    TableName: CURRENCY_TRANSACTIONS_TABLE,
    Item: createItem,
  };
  console.log(`createItem params : ${JSON.stringify(params)}`);
  return persistToDB(params);
};

module.exports.queryCurrencyTxAnalytics = async (pk, sk) => {
  // const params = {
  //   KeyConditionExpression: "PK = :pk, SK = :sk",
  //   ExpressionAttributeValues: {
  //     PK: pk,
  //     SK: sk,
  //   },
  //   TableName: CURRENCY_TRANSACTIONS_TABLE,
  //   ConsistentRead: true,
  // };
  const params = {
    KeyConditionExpression: '#PK = :pk and #SK = :sk',
    ExpressionAttributeNames: {
      '#PK': 'PK',
      '#SK': 'SK',
    },
    ExpressionAttributeValues: {
      ':pk': pk,
      ':sk': sk,
    },
    TableName: CURRENCY_TRANSACTIONS_TABLE,
    ConsistentRead: true,
  };
  console.log(`queryCurrencyTxAnalytics - params  - ${JSON.stringify(params)}`);
  const response = await queryItem(params);
  console.log(`queryCurrencyTxAnalytics - response  - ${JSON.stringify(response)}`);
  const item = response.Items ? response.Items[0] : null;
  return item;
};


module.exports.UpdateCurrencyAnalytics = async (pk, sk, count) => {
  const params = {
    ExpressionAttributeValues: {
      ':count': count,
    },
    ExpressionAttributeNames: {
      '#value': 'VALUE',
    },
    Key: {
      PK: pk,
      SK: sk,
    },
    UpdateExpression: 'set #value = :count',
    TableName: CURRENCY_TRANSACTIONS_TABLE,
    ConsistentRead: true,
  };

  console.log(
    `UpdateCurrencyAnalytics params : ${JSON.stringify(params)}`,
  );
  const response = await updateDB(params);
  console.log(`UpdateCurrencyAnalytics - response  - ${JSON.stringify(response)}`);
  return response;
};
