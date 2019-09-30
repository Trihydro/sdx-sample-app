export const URL = "https://sdxbeta-service.trihydro.com";

export const MISSING_API_KEY_MSG = "An API Key wasn't provided. Follow the instructions in the README to configure the project before proceeding.";

export const DEFAULT_QUERY = `{
    "dialogID": "156",
    "startDate": "2017-01-01T00:00:00.000Z",
    "startDateOperator": "GTE",
    "endDate": "2020-01-01T00:00:00.000Z",
    "endDateOperator": "LTE",
    "nwLat": "41.979552",
    "nwLon": "-111.065979",
    "seLat": "41.004686",
    "seLon": "-104.029755",
    "orderByField": "createdAt",
    "orderByOrder": "-1",
    "skip": "0",
    "limit": "10"
  }`;

export const DEFAULT_QUERY_HEIGHT = DEFAULT_QUERY.split(/\n/).length;