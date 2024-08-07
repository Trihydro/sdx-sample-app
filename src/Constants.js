import {
    DEFAULT_BADSAMPLEFEED_BODY
} from "./BadSampleFeed";
import {
    DEFAULT_SAMPLEFEED_BODY
} from "./SampleFeed";

export const MISSING_API_KEY_MSG = "An API Key wasn't provided. Follow the instructions in the README to configure the project before proceeding.";

export const VALID_OUTGOING_VERSIONS = ["2.0", "3.0", "3.1", "4.0", "4.1", "4.2"];

const DEFAULT_EXECUTEQUERYASYNC_BODY =
    `{
    "dialogID": "156",
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
    "limit": "10"
}`;

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
`{
   "type": "Polygon",
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
   ]
}`;

const DEFAULT_DECODE_BODY = `
{
    "messageType": "AdvisorySituationData",
    "encodeType": "hex",
    "encodedMsg": "C440000000000000000711413AB8271E820616385BEB89C470CC45942BD4A00000000203282003F027AC0032C4FDE7F8EC962A1F8330C0056138DAB978B1E251AFFFFC46589FE805080FC271B572F163C4A3580325FFFE215E2A28885001CD78D638D0BD1F27E189112834053703D02F9A3EE0EA8178A0CDAA4B62B86590256C9C362EDA992A1BAD81766B0D3A76B52286189D50C0C321F030D1A1A7E3902B711DEE6E7E3680688283CCAC3594C998A41B4584AB820E4CA4492306F7812575022E9865C01C910082650DAD303FFC87086122B043648505DB81D480C858512218A4769D08741CD11CA048857A1D34601ED37078C912244FA7B9B789228213D587848AA641E6A241E52C4E1AB12335907FB23091314B3F3E9048DCA51E64A22480854F7487122FD467F689891AB623D5170492662A03D0E1486163BE0FDCAE851B87B937460CC3DF321D21A1454152980FEC94805C85C5BD42182C628BC4600190744C6258221000"
}`;

const DEFAULT_WZDX_POSTALABBREVIATION_QUERYARGUMENTS =
`?
postalAbbreviation=MA`;

const DEFAULT_WZDX_SPECIFICLOCATION_QUERYARGUMENTS =
`?
lat=37.594049901
&
lon=-122.490431
&
dist=5`;

const DEFAULT_DEPOSITMULTI_BODY = `
{
   "depositRequests": [
           {
            "encodeType": "hex",
		"encodedMsg": "C4400000000452182077E1EDB54A270FD59C150801D209C29F8F2544D1DDDA290C103A02000007FC000007FC2120701040208003F0200C023FCF17C34D8CCD73DDB9FF4104E1387CBC10A89B628FFFFC9FA07F9E3E805083FD2C9BF569A062E58DFA706A2D6F158C58909AB4BF4A1DFA54EAD362E58D3AB5212D67000000001387CBC10A89B628C9C4601FE109F11B163EA208F4D2578043419A41023CD0977011AB23F060C525067FA06457A4025847597F1F01B419ABE8F63C0D202C7EED06BF28393683443C178741AEC38EAE80CE1AC70150417307428352FB14B8818AF908C920CF46C4EAF0471D0DFF8335AF1F2B81A4760F22208D40201906B8E8443302382074481ADE28BFBE0D5164521A06D346250C03550810470132EA08BA0A28A042B04B9B0209036971165501134616660000000C0800"
		},
		{
		"encodeType": "hex",
        "encodedMsg": "C4400000000A2EEA462DB561787A27A333F216462A6489E8872625918B74DD1775231202000007FC000007FC0DC0700D6003ED0C023FCF3DF8E2E196A7354A3C2104E13D100610B231719FFFFC9FA07F9E7E805083FD249BF5ECA06AE6FD383516C484D5B316EE1BDFA55EFB568C58B34B0AAC68CC16B08000000009E8803085918B8CE4E230000884009FCE2DF708FFC7C445D30001103008C42800"
		},
		{
		"encodeType": "hex",
        "encodedMsg": "C44000000006FA912630BC895ACA283C0546150525140A0E5529A5425FB1FB7D48931A02000007FC000007FC2420701040238003F0230C021EBBBDCAF413B51BAF9E9A6104E141CB0100A828236FFFFC9FA03D777E805083FD249BF569A064C595FA706A2D610A1B872D60C3BF4A1DF873E25985160D267096B3800000000A0E58080541411B64E237E1688530B06828020595391E782CD587380161984C4E0A6592D4805921975F823B4066380C0C979E0B0E52708058B10EAE818FA338811B7A473A06834C1A074C903CAE02B8A458F01EE180CD6A0B3BA20C8059858E7002650CB07017A661A1C0B17B215E051DB163382B390AA9414CB25A2C0A9AB2947074A6A446503A4EA1F1281AF4D11B5805C18EBD05908923F02A8A0AFA814708780E098DF3B3F070E105BD503B03E2B2E814B5477140A79E2CB205D86972D82DF50D8AC1D1EB916440000080C08060C0"
		}
    ]
}
`;

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
    },
    {
        displayText: "DepositMulti",
        request: "deposit-multi",
        requestType: "POST",
        defaultQueryOrBody: DEFAULT_DEPOSITMULTI_BODY,
        notes: "This method requires permissions to use.  To enable DepositMulti, please contact Trihydro.  Allows deposit of multiple TIMs."
    }
];


