export const DEFAULT_BADSAMPLEFEED_BODY = `{
    "feed_info": {
        "update_date": "2020-06-18T15:00:00Z",
            "publisher": "TestDOT",
                "contact_name": "Frederick Francis Feedmanager",
                    "contact_email": "fred.feedmanager@testdot.gov",
                        "update_frequency": 60,
                            "version": "4.2",
                                "license": "https://creativecommons.org/publicdomain/zero/1.0/",
                                    "data_sources": [
                                        {
                                            "data_source_id": "1",
                                            "organization_name": "Test City 1",
                                            "contact_name": "Solomn Soliel Sourcefeed",
                                            "contact_email": "solomon.sourcefeed@testcity1.gov",
                                            "update_frequency": 300,
                                            "update_date": "2020-06-18T14:37:31Z"
                                        }
                                    ]
    },
    "type": "FeatureCollection",
        "features": [
            {
                "id": "8fed746d-8f4f-4e0c-8d9b-fa4db7c3c2d8",
                "type": "Feature",
                "properties": {
                    "core_details": {
                        "data_source_id": "1",
                        "event_type": "work-zone",
                        "direction": "westbound",
                        "description": "Multi-lane closure example",
                        "creation_date": "2010-12-30T22:42:53Z",
                        "update_date": "2010-01-03T01:51:43Z"
                    },
                    "beginning_milepost": 139.9,
                    "ending_milepost": 138.5,
                    "is_start_position_verified": true,
                    "is_end_position_verified": false,
                    "start_date": "2010-01-02T08:00:00Z",
                    "end_date": "2010-03-31T23:00:00Z",
                    "location_method": "channel-device-method",
                    "is_start_date_verified": false,
                    "is_end_date_verified": false,
                    "vehicle_impact": "some-lanes-closed",
                    "worker_presence": {
                        "are_workers_present": true,
                        "method": "camera-monitoring",
                        "definition": [
                            "workers-in-work-zone-working"
                        ],
                        "worker_presence_last_confirmed_date": "2010-01-03T01:51:43Z",
                        "confidence": "low"
                    },
                    "reduced_speed_limit_kph": 88.5,
                    "restrictions": [
                        {
                            "type": "reduced-width",
                            "value": 16,
                            "unit": "feet"
                        },
                        {
                            "type": "reduced-weight",
                            "value": 156000
                        }
                    ],
                    "types_of_work": [
                        {
                            "type_name": "surface-work",
                            "is_architectural_change": false
                        }
                    ],
                    "lanes": [
                        {
                            "order": 1,
                            "status": "closed",
                            "type": "shoulder"
                        },
                        {
                            "order": 2,
                            "status": "closed",
                            "type": "general"
                        },
                        {
                            "order": 3,
                            "status": "closed",
                            "type": "general"
                        },
                        {
                            "order": 4,
                            "status": "open",
                            "type": "general"
                        },
                        {
                            "order": 5,
                            "status": "open",
                            "type": "shoulder"
                        }
                    ]
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [
                            -93.53729725067586,
                            41.65790432034191
                        ],
                        [
                            -93.54482889364739,
                            41.65678209854977
                        ],
                        [
                            -93.5544848462825,
                            41.65535524547257
                        ],
                        [
                            -93.5594844836903,
                            41.654633790830985
                        ],
                        [
                            -93.56351852612453,
                            41.65410471898907
                        ]
                    ]
                }
            }
        ]
}`;