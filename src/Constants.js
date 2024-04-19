import {
    DEFAULT_BADSAMPLEFEED_BODY
} from "./BadSampleFeed";
import {
    DEFAULT_SAMPLEFEED_BODY
} from "./SampleFeed";

export const MISSING_API_KEY_MSG = "An API Key wasn't provided. Follow the instructions in the README to configure the project before proceeding.";

export const VALID_OUTGOING_VERSIONS = ["2.0", "3.0", "3.1", "4.0", "4.1", "4.2"];

const DEFAULT_EXECUTEQUERYASYNC_BODY =
    `{    "dialogID": "156",
    "startDate": "2017-01-01T00:00:00.000Z",
    "startDateOperator": "GTE",
    "endDate": "QQQ",
    "endDateOperator": "LTE",
    "nwLat": "41.979552",
    "nwLon": "-111.065979",
    "seLat": "41.004686",
    "seLon": "-104.029755",
    "orderByField": "createdAt",
    "orderByOrder": "-1",
    "skip": "0",
    "limit": "10" }`;

const DEFAULT_GETDATABYRECORDID_POST_BODY =
    `{    "RecordId": "-840350048",
"type": 1}`;

// this is the road from Sheridan, WY to Cheyenne, WY so it should have a lot of messages
const DEFAULT_GETMESSAGESBETWEENPLACES_QUERYARGUMENTS =
    `?
StartLat=44.919423
&
StartLng=-107.113545
&
EndLat=41.085281
&
EndLng=-104.819149`;

const DEFAULT_GETMESSAGESINTERSECTINGGEOMETRY_BODY =
    `{   "type": "Polygon",
   "coordinates": [
      [
         [
            -105.251255,
            41
         ],
         [
            -105.251255,
            39.6355
         ],
         [
            -104,
            39.6355
         ],
         [
            -104,
            41
         ],
         [
            -105.251255,
            41
         ]
      ]
   ]}`;

const DEFAULT_DECODE_BODY = `
{"messageType": "AdvisorySituationData",
  "encodeType": "hex",
  "encodedMsg": "C440000000000000000711413AB8271E820616385BEB89C470CC45942BD4A00000000203282003F027AC0032C4FDE7F8EC962A1F8330C0056138DAB978B1E251AFFFFC46589FE805080FC271B572F163C4A3580325FFFE215E2A28885001CD78D638D0BD1F27E189112834053703D02F9A3EE0EA8178A0CDAA4B62B86590256C9C362EDA992A1BAD81766B0D3A76B52286189D50C0C321F030D1A1A7E3902B711DEE6E7E3680688283CCAC3594C998A41B4584AB820E4CA4492306F7812575022E9865C01C910082650DAD303FFC87086122B043648505DB81D480C858512218A4769D08741CD11CA048857A1D34601ED37078C912244FA7B9B789228213D587848AA641E6A241E52C4E1AB12335907FB23091314B3F3E9048DCA51E64A22480854F7487122FD467F689891AB623D5170492662A03D0E1486163BE0FDCAE851B87B937460CC3DF321D21A1454152980FEC94805C85C5BD42182C628BC4600190744C6258221000"}`;

const DEFAULT_GETALLITISCODES_QUERYARGUMENTS = ``;

const DEFAULT_WZDX_POSTALABBREVIATION_QUERYARGUMENTS =
    `?
postalabbreviation=MA`;

const DEFAULT_WZDX_SPECIFICLOCATION_QUERYARGUMENTS =
    `?
lat=37.594049901
&
lon=-122.490431
&
dist=5`;

export const REQUESTOBJECTS = [
    {
        displayText: "GetData",
        request: "GetData",
        requestType: "POST",
        defaultQueryOrBody: DEFAULT_EXECUTEQUERYASYNC_BODY,
        notes: "Alternatives to GetData are GetBundles and GetDistributions."
    },
    {
        displayText: "GetDecodedMessages",
        request: "GetDecodedMessages",
        requestType: "POST",
        defaultQueryOrBody: DEFAULT_EXECUTEQUERYASYNC_BODY,
        notes: "Returns advisory messages in a human-readable format."
    },
    {
        displayText: "GetGeoJsonData",
        request: "GetGeoJsonData",
        requestType: "POST",
        defaultQueryOrBody: DEFAULT_EXECUTEQUERYASYNC_BODY,
        notes: "Returns advisory messages as a GeoJSON FeatureCollection with ITIS codes."
    },
    {
        displayText: "GetDataByRecordId",
        request: "GetDataByRecordId",
        requestType: "POST",
        defaultQueryOrBody: DEFAULT_GETDATABYRECORDID_POST_BODY,
        notes: "Type is 0 for hex and 1 for decimal."
    },
    {
        displayText: "GetMessagesBetweenPlaces",
        request: "GetMessagesBetweenPlaces",
        requestType: "GET",
        defaultQueryOrBody: DEFAULT_GETMESSAGESBETWEENPLACES_QUERYARGUMENTS,
        notes: "The default road is Sheridan, WY to Cheyenne, WY and should have some messages."
    },
    {
        displayText: "GetMessagesIntersectingGeometry",
        request: "GetMessagesIntersectingGeometry",
        requestType: "POST",
        defaultQueryOrBody: DEFAULT_GETMESSAGESINTERSECTINGGEOMETRY_BODY,
        notes: "The default covers an area from Denver northward and should have some messages."
    },
    {
        displayText: "GetAllITISCodes",
        request: "GetAllITISCodes",
        requestType: "GET",
        defaultQueryOrBody: DEFAULT_GETALLITISCODES_QUERYARGUMENTS,
        notes: ""
    },
    {
        displayText: "Decode",
        request: "Decode",
        requestType: "POST",
        defaultQueryOrBody: DEFAULT_DECODE_BODY,
        notes: "Decodes advisory situation data."
    },
    {
        displayText: "Wzdx  (for all results in a state)",
        request: "Wzdx",
        requestType: "GET",
        defaultQueryOrBody: DEFAULT_WZDX_POSTALABBREVIATION_QUERYARGUMENTS,
        notes: "Searches WZDx by postal abbreviation."
    },
    {
        displayText: "Wzdx   (for all results near a given point)",
        request: "Wzdx",
        requestType: "GET",
        defaultQueryOrBody: DEFAULT_WZDX_SPECIFICLOCATION_QUERYARGUMENTS,
        notes: "Searches WZDx by radius from specified location.  Radius (in miles) must be from an enumerated list."
    },
    {
        displayText: "Wzdx/SwitchSpecVersion",
        request: "Wzdx/switch-spec-version",
        requestType: "POST",
        defaultQueryOrBody: DEFAULT_SAMPLEFEED_BODY,
        notes: "Allows switching a WZDx feed to a different version. Some data will be lost if the target version does not support the data.",
        outgoingVersion: "3.1"
    },
    {
        displayText: "Wzdx/CheckJsonFeed",
        request: "Wzdx/check-json-feed",
        requestType: "POST",
        defaultQueryOrBody: DEFAULT_BADSAMPLEFEED_BODY,
        notes: "Returns a list of errors in the WZDx feed."
    }
];


