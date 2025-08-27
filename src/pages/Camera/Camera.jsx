import React, { useState, useRef, useEffect } from 'react';
import { RiCloseLine, RiCameraLine, RiCameraOffLine, RiCheckLine, RiRefreshLine } from 'react-icons/ri';
import { Utilities } from '../../utilities/utilities';
const CameraPage = ({ onClose, onAddItem }) => {
  const [showModal, setShowModal] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [facingMode, setFacingMode] = useState('environment');
  const [cameraError, setCameraError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const utilities = new Utilities();
  useEffect(() => {
    setShowModal(true);
    initializeCamera();
    
    return () => {
      stopCamera();
    };
  }, []);

  localStorage.setItem('data', 
    JSON.stringify(
      {
  "25-7-2025": [
    {
      "name": "أجرة تاكسي",
      "price": "59",
      "time": "7:45:27 م",
      "timestamp": 1753472727000
    },
    {
      "name": "مشوار تاكسي",
      "price": "311",
      "time": "7:14:37 ص",
      "timestamp": 1753427677000
    },
    {
      "name": "سهرة كافيه",
      "price": "148",
      "time": "7:08:20 ص",
      "timestamp": 1753427300000
    },
    {
      "name": "فاتورة كهرباء",
      "price": "175",
      "time": "1:37:19 م",
      "timestamp": 1753450639000
    },
    {
      "name": "أجرة تاكسي",
      "price": "73",
      "time": "6:10:35 م",
      "timestamp": 1753467035000
    }
  ],
  "26-7-2025": [
    {
      "name": "مصروف يومي",
      "price": "35",
      "time": "6:57:01 ص",
      "timestamp": 1753513021000
    },
    {
      "name": "توصيل طلبات",
      "price": "335",
      "time": "4:24:39 م",
      "timestamp": 1753547079000
    },
    {
      "name": "أجرة تاكسي",
      "price": "68",
      "time": "10:37:04 م",
      "timestamp": 1753569424000
    },
    {
      "name": "كوباية قهوة",
      "price": "412",
      "time": "4:23:28 م",
      "timestamp": 1753547008000
    },
    {
      "name": "زيارة طبيب",
      "price": "320",
      "time": "10:21:18 م",
      "timestamp": 1753568478000
    }
  ],
  "27-7-2025": [
    {
      "name": "أشتراك نت",
      "price": "349",
      "time": "1:55:27 م",
      "timestamp": 1753624527000
    },
    {
      "name": "توصيل طلبات",
      "price": "73",
      "time": "9:41:55 ص",
      "timestamp": 1753609315000
    },
    {
      "name": "توصيل طلبات",
      "price": "311",
      "time": "11:31:51 ص",
      "timestamp": 1753615911000
    },
    {
      "name": "سهرة كافيه",
      "price": "197",
      "time": "11:33:15 م",
      "timestamp": 1753659195000
    }
  ],
  "28-7-2025": [
    {
      "name": "قهوة زيادة",
      "price": "50",
      "time": "6:54:52 ص",
      "timestamp": 1753685692000
    },
    {
      "name": "خضار وفاكهة",
      "price": "277",
      "time": "11:52:55 ص",
      "timestamp": 1753703575000
    },
    {
      "name": "زيارة طبيب",
      "price": "297",
      "time": "9:32:44 ص",
      "timestamp": 1753695164000
    },
    {
      "name": "قهوة وكيك",
      "price": "345",
      "time": "9:08:59 م",
      "timestamp": 1753736939000
    }
  ],
  "29-7-2025": [
    {
      "name": "مشوار تاكسي",
      "price": "157",
      "time": "10:21:27 م",
      "timestamp": 1753827687000
    },
    {
      "name": "هدوم",
      "price": "178",
      "time": "11:38:43 ص",
      "timestamp": 1753789123000
    },
    {
      "name": "اشتراك الجيم",
      "price": "265",
      "time": "10:21:11 ص",
      "timestamp": 1753784471000
    }
  ],
  "30-7-2025": [
    {
      "name": "كوباية قهوة",
      "price": "84",
      "time": "7:11:09 ص",
      "timestamp": 1753859469000
    },
    {
      "name": "سهرة كافيه",
      "price": "231",
      "time": "9:59:10 م",
      "timestamp": 1753912750000
    },
    {
      "name": "هدايا بسيطة",
      "price": "409",
      "time": "11:32:52 ص",
      "timestamp": 1753875172000
    },
    {
      "name": "بنزين",
      "price": "356",
      "time": "9:26:06 ص",
      "timestamp": 1753867566000
    },
    {
      "name": "هدايا بسيطة",
      "price": "33",
      "time": "7:09:54 م",
      "timestamp": 1753902594000
    },
    {
      "name": "قهوة وكيك",
      "price": "181",
      "time": "9:21:58 ص",
      "timestamp": 1753867318000
    }
  ],
  "31-7-2025": [
    {
      "name": "هدوم",
      "price": "483",
      "time": "10:02:11 ص",
      "timestamp": 1753956131000
    },
    {
      "name": "قهوة زيادة",
      "price": "23",
      "time": "2:22:56 م",
      "timestamp": 1753971776000
    },
    {
      "name": "مشتريات من الصيدلية",
      "price": "448",
      "time": "6:07:50 ص",
      "timestamp": 1753942070000
    },
    {
      "name": "طلب من المطعم",
      "price": "60",
      "time": "5:16:29 م",
      "timestamp": 1753982189000
    },
    {
      "name": "سوبرماركت",
      "price": "228",
      "time": "8:29:39 م",
      "timestamp": 1753993779000
    },
    {
      "name": "مشتريات من الصيدلية",
      "price": "436",
      "time": "9:30:06 ص",
      "timestamp": 1753954206000
    },
    {
      "name": "خروجة سينما",
      "price": "398",
      "time": "1:09:44 م",
      "timestamp": 1753967384000
    }
  ],
  "1-8-2025": [
    {
      "name": "قهوة وكيك",
      "price": "44",
      "time": "6:01:52 م",
      "timestamp": 1754071312000
    },
    {
      "name": "تجهيز عزومة",
      "price": "449",
      "time": "10:56:06 ص",
      "timestamp": 1754045766000
    },
    {
      "name": "هدايا بسيطة",
      "price": "26",
      "time": "10:11:12 م",
      "timestamp": 1754086272000
    },
    {
      "name": "هدوم",
      "price": "135",
      "time": "7:13:23 ص",
      "timestamp": 1754032403000
    },
    {
      "name": "مشروب بارد",
      "price": "176",
      "time": "4:54:04 م",
      "timestamp": 1754067244000
    }
  ],
  "2-8-2025": [
    {
      "name": "كوباية قهوة",
      "price": "224",
      "time": "5:49:55 م",
      "timestamp": 1754156995000
    },
    {
      "name": "اشتراك الجيم",
      "price": "322",
      "time": "10:53:42 ص",
      "timestamp": 1754132022000
    },
    {
      "name": "خضار وفاكهة",
      "price": "70",
      "time": "10:25:23 ص",
      "timestamp": 1754130323000
    },
    {
      "name": "بنزين",
      "price": "482",
      "time": "9:20:32 م",
      "timestamp": 1754169632000
    }
  ],
  "3-8-2025": [
    {
      "name": "توصيل طلبات",
      "price": "157",
      "time": "7:33:44 ص",
      "timestamp": 1754206424000
    },
    {
      "name": "اشتراك تطبيق",
      "price": "121",
      "time": "12:40:48 م",
      "timestamp": 1754224848000
    },
    {
      "name": "أجرة تاكسي",
      "price": "328",
      "time": "10:57:58 م",
      "timestamp": 1754261878000
    },
    {
      "name": "تموينات من البقالة",
      "price": "439",
      "time": "3:30:36 م",
      "timestamp": 1754235036000
    },
    {
      "name": "أجرة تاكسي",
      "price": "120",
      "time": "2:26:28 م",
      "timestamp": 1754231188000
    },
    {
      "name": "هدوم",
      "price": "378",
      "time": "4:04:37 م",
      "timestamp": 1754237077000
    },
    {
      "name": "هدايا بسيطة",
      "price": "246",
      "time": "3:34:19 م",
      "timestamp": 1754235259000
    }
  ],
  "4-8-2025": [
    {
      "name": "أشتراك نت",
      "price": "288",
      "time": "10:57:52 م",
      "timestamp": 1754348272000
    },
    {
      "name": "أشتراك نت",
      "price": "419",
      "time": "10:07:04 م",
      "timestamp": 1754345224000
    },
    {
      "name": "عشاء في مطعم",
      "price": "116",
      "time": "5:50:30 م",
      "timestamp": 1754329830000
    },
    {
      "name": "تجهيز عزومة",
      "price": "484",
      "time": "11:06:52 ص",
      "timestamp": 1754305612000
    },
    {
      "name": "كوافير",
      "price": "319",
      "time": "7:10:15 ص",
      "timestamp": 1754291415000
    },
    {
      "name": "سوبرماركت",
      "price": "378",
      "time": "5:58:55 م",
      "timestamp": 1754330335000
    }
  ],
  "5-8-2025": [
    {
      "name": "قهوة زيادة",
      "price": "383",
      "time": "2:49:42 م",
      "timestamp": 1754405382000
    },
    {
      "name": "سهرة كافيه",
      "price": "176",
      "time": "8:34:50 ص",
      "timestamp": 1754382890000
    },
    {
      "name": "أجرة تاكسي",
      "price": "17",
      "time": "1:13:45 م",
      "timestamp": 1754399625000
    },
    {
      "name": "مشوار تاكسي",
      "price": "485",
      "time": "1:17:49 م",
      "timestamp": 1754399869000
    }
  ],
  "6-8-2025": [
    {
      "name": "كوافير",
      "price": "270",
      "time": "4:48:58 م",
      "timestamp": 1754498938000
    },
    {
      "name": "تموينات من البقالة",
      "price": "437",
      "time": "5:39:02 م",
      "timestamp": 1754501942000
    },
    {
      "name": "كتب",
      "price": "101",
      "time": "3:59:27 م",
      "timestamp": 1754495967000
    },
    {
      "name": "خروجة سينما",
      "price": "45",
      "time": "8:30:03 م",
      "timestamp": 1754512203000
    },
    {
      "name": "اشتراك الجيم",
      "price": "298",
      "time": "7:56:22 م",
      "timestamp": 1754510182000
    },
    {
      "name": "فاتورة كهرباء",
      "price": "300",
      "time": "3:42:26 م",
      "timestamp": 1754494946000
    }
  ],
  "7-8-2025": [
    {
      "name": "أجرة تاكسي",
      "price": "236",
      "time": "8:00:54 م",
      "timestamp": 1754596854000
    },
    {
      "name": "قهوة زيادة",
      "price": "374",
      "time": "11:19:09 ص",
      "timestamp": 1754565549000
    },
    {
      "name": "اشتراك الجيم",
      "price": "310",
      "time": "10:36:06 م",
      "timestamp": 1754606166000
    }
  ],
  "8-8-2025": [
    {
      "name": "فاتورة كهرباء",
      "price": "344",
      "time": "8:04:50 م",
      "timestamp": 1754683490000
    },
    {
      "name": "فاتورة كهرباء",
      "price": "395",
      "time": "12:47:34 م",
      "timestamp": 1754657254000
    },
    {
      "name": "مشروب بارد",
      "price": "235",
      "time": "1:35:10 م",
      "timestamp": 1754660110000
    },
    {
      "name": "سوبرماركت",
      "price": "155",
      "time": "10:59:39 م",
      "timestamp": 1754693979000
    },
    {
      "name": "فاتورة كهرباء",
      "price": "286",
      "time": "8:24:16 ص",
      "timestamp": 1754641456000
    },
    {
      "name": "مشتريات من الصيدلية",
      "price": "86",
      "time": "10:11:50 ص",
      "timestamp": 1754647910000
    }
  ],
  "9-8-2025": [
    {
      "name": "هدايا بسيطة",
      "price": "141",
      "time": "2:32:06 م",
      "timestamp": 1754749926000
    },
    {
      "name": "مشتريات من الصيدلية",
      "price": "474",
      "time": "7:07:51 ص",
      "timestamp": 1754723271000
    },
    {
      "name": "مشروب بارد",
      "price": "99",
      "time": "6:13:11 ص",
      "timestamp": 1754719991000
    },
    {
      "name": "مصروف يومي",
      "price": "264",
      "time": "11:53:22 م",
      "timestamp": 1754783602000
    },
    {
      "name": "فطار من المخبز",
      "price": "132",
      "time": "10:32:18 ص",
      "timestamp": 1754735538000
    },
    {
      "name": "تجهيز عزومة",
      "price": "479",
      "time": "3:45:14 م",
      "timestamp": 1754754314000
    }
  ],
  "10-8-2025": [
    {
      "name": "اشتراك تطبيق",
      "price": "421",
      "time": "9:54:36 ص",
      "timestamp": 1754819676000
    },
    {
      "name": "مشوار تاكسي",
      "price": "119",
      "time": "5:37:09 م",
      "timestamp": 1754847429000
    },
    {
      "name": "مصروف يومي",
      "price": "478",
      "time": "10:04:55 ص",
      "timestamp": 1754820295000
    },
    {
      "name": "اشتراك الجيم",
      "price": "210",
      "time": "8:52:44 م",
      "timestamp": 1754859164000
    }
  ],
  "11-8-2025": [
    {
      "name": "قهوة زيادة",
      "price": "279",
      "time": "8:10:05 م",
      "timestamp": 1754943005000
    },
    {
      "name": "بنزين",
      "price": "189",
      "time": "5:31:37 م",
      "timestamp": 1754933497000
    },
    {
      "name": "هدايا بسيطة",
      "price": "155",
      "time": "1:04:38 م",
      "timestamp": 1754917478000
    },
    {
      "name": "تجهيز عزومة",
      "price": "417",
      "time": "11:35:23 ص",
      "timestamp": 1754912123000
    },
    {
      "name": "خضار وفاكهة",
      "price": "81",
      "time": "1:47:22 م",
      "timestamp": 1754920042000
    },
    {
      "name": "زيارة طبيب",
      "price": "133",
      "time": "4:30:48 م",
      "timestamp": 1754929848000
    },
    {
      "name": "اشتراك تطبيق",
      "price": "59",
      "time": "7:46:35 م",
      "timestamp": 1754941595000
    },
    {
      "name": "توصيل طلبات",
      "price": "163",
      "time": "8:55:34 م",
      "timestamp": 1754945734000
    }
  ],
  "12-8-2025": [
    {
      "name": "فاتورة كهرباء",
      "price": "60",
      "time": "6:19:49 ص",
      "timestamp": 1754979589000
    },
    {
      "name": "سوبرماركت",
      "price": "106",
      "time": "9:17:37 ص",
      "timestamp": 1754990257000
    },
    {
      "name": "اشتراك الجيم",
      "price": "486",
      "time": "10:36:33 م",
      "timestamp": 1755038193000
    }
  ],
  "13-8-2025": [
    {
      "name": "خروجة سينما",
      "price": "341",
      "time": "7:10:31 م",
      "timestamp": 1755112231000
    },
    {
      "name": "مشوار تاكسي",
      "price": "230",
      "time": "4:18:46 م",
      "timestamp": 1755101926000
    },
    {
      "name": "كوافير",
      "price": "491",
      "time": "6:17:00 ص",
      "timestamp": 1755065820000
    },
    {
      "name": "مشتريات من الصيدلية",
      "price": "158",
      "time": "3:21:59 م",
      "timestamp": 1755098519000
    },
    {
      "name": "كوباية قهوة",
      "price": "233",
      "time": "9:14:39 ص",
      "timestamp": 1755076479000
    },
    {
      "name": "فطار من المخبز",
      "price": "316",
      "time": "11:52:40 م",
      "timestamp": 1755129160000
    },
    {
      "name": "توصيل طلبات",
      "price": "292",
      "time": "3:25:20 م",
      "timestamp": 1755098720000
    }
  ],
  "14-8-2025": [
    {
      "name": "اشتراك تطبيق",
      "price": "166",
      "time": "8:08:30 م",
      "timestamp": 1755202110000
    },
    {
      "name": "اشتراك تطبيق",
      "price": "405",
      "time": "8:37:23 ص",
      "timestamp": 1755160643000
    },
    {
      "name": "فطار من المخبز",
      "price": "118",
      "time": "6:25:32 ص",
      "timestamp": 1755152732000
    },
    {
      "name": "كوباية قهوة",
      "price": "256",
      "time": "9:37:44 م",
      "timestamp": 1755207464000
    },
    {
      "name": "هدايا بسيطة",
      "price": "325",
      "time": "5:28:17 م",
      "timestamp": 1755192497000
    },
    {
      "name": "كتب",
      "price": "297",
      "time": "6:49:00 م",
      "timestamp": 1755197340000
    },
    {
      "name": "هدايا بسيطة",
      "price": "32",
      "time": "10:12:42 م",
      "timestamp": 1755209562000
    },
    {
      "name": "طلب من المطعم",
      "price": "440",
      "time": "3:34:22 م",
      "timestamp": 1755185662000
    }
  ],
  "15-8-2025": [
    {
      "name": "مصروف يومي",
      "price": "475",
      "time": "8:45:37 ص",
      "timestamp": 1755247537000
    },
    {
      "name": "عشاء في مطعم",
      "price": "64",
      "time": "7:35:20 ص",
      "timestamp": 1755243320000
    },
    {
      "name": "كوباية قهوة",
      "price": "75",
      "time": "5:04:13 م",
      "timestamp": 1755277453000
    },
    {
      "name": "خضار وفاكهة",
      "price": "477",
      "time": "8:38:19 ص",
      "timestamp": 1755247099000
    },
    {
      "name": "مشروب بارد",
      "price": "530",
      "time": "9:25:04 ص",
      "timestamp": 1755249904000
    }
  ],
  "16-8-2025": [
    {
      "name": "قهوة وكيك",
      "price": "408",
      "time": "2:20:42 م",
      "timestamp": 1755354042000
    },
    {
      "name": "توصيل طلبات",
      "price": "166",
      "time": "9:24:56 م",
      "timestamp": 1755379496000
    },
    {
      "name": "كوافير",
      "price": "405",
      "time": "4:33:44 م",
      "timestamp": 1755362024000
    },
    {
      "name": "قهوة وكيك",
      "price": "532",
      "time": "9:15:28 ص",
      "timestamp": 1755335728000
    }
  ],
  "17-8-2025": [
    {
      "name": "كتب",
      "price": "80",
      "time": "8:58:03 ص",
      "timestamp": 1755421083000
    },
    {
      "name": "كوافير",
      "price": "180",
      "time": "6:34:57 ص",
      "timestamp": 1755412497000
    },
    {
      "name": "فاتورة كهرباء",
      "price": "476",
      "time": "9:58:15 ص",
      "timestamp": 1755424695000
    },
    {
      "name": "بنزين",
      "price": "233",
      "time": "11:31:24 ص",
      "timestamp": 1755430284000
    },
    {
      "name": "مصروف يومي",
      "price": "404",
      "time": "7:17:52 م",
      "timestamp": 1755458272000
    },
    {
      "name": "فطار من المخبز",
      "price": "556",
      "time": "5:27:43 م",
      "timestamp": 1755451663000
    },
    {
      "name": "تموينات من البقالة",
      "price": "335",
      "time": "11:16:39 م",
      "timestamp": 1755472599000
    },
    {
      "name": "تموينات من البقالة",
      "price": "40",
      "time": "10:26:13 ص",
      "timestamp": 1755426373000
    }
  ],
  "18-8-2025": [
    {
      "name": "بنزين",
      "price": "202",
      "time": "8:31:39 ص",
      "timestamp": 1755505899000
    },
    {
      "name": "اشتراك الجيم",
      "price": "157",
      "time": "4:05:20 م",
      "timestamp": 1755533120000
    },
    {
      "name": "هدايا بسيطة",
      "price": "268",
      "time": "8:28:08 ص",
      "timestamp": 1755505688000
    }
  ],
  "19-8-2025": [
    {
      "name": "أجرة تاكسي",
      "price": "303",
      "time": "10:31:55 ص",
      "timestamp": 1755599515000
    },
    {
      "name": "عشاء في مطعم",
      "price": "388",
      "time": "6:57:47 م",
      "timestamp": 1755629867000
    },
    {
      "name": "تجهيز عزومة",
      "price": "264",
      "time": "8:47:27 ص",
      "timestamp": 1755593247000
    },
    {
      "name": "خروجة سينما",
      "price": "81",
      "time": "7:17:50 م",
      "timestamp": 1755631070000
    },
    {
      "name": "سهرة كافيه",
      "price": "351",
      "time": "8:06:25 ص",
      "timestamp": 1755590785000
    }
  ],
  "20-8-2025": [
    {
      "name": "سوبرماركت",
      "price": "303",
      "time": "7:34:23 م",
      "timestamp": 1755718463000
    },
    {
      "name": "كتب",
      "price": "249",
      "time": "7:42:32 م",
      "timestamp": 1755718952000
    },
    {
      "name": "خروجة سينما",
      "price": "131",
      "time": "2:27:07 م",
      "timestamp": 1755700027000
    },
    {
      "name": "اشتراك تطبيق",
      "price": "155",
      "time": "12:02:09 م",
      "timestamp": 1755691329000
    },
    {
      "name": "تجهيز عزومة",
      "price": "460",
      "time": "10:49:29 ص",
      "timestamp": 1755686969000
    },
    {
      "name": "كتب",
      "price": "590",
      "time": "6:39:56 م",
      "timestamp": 1755715196000
    }
  ],
  "21-8-2025": [
    {
      "name": "خروجة سينما",
      "price": "35",
      "time": "8:56:03 ص",
      "timestamp": 1755766563000
    },
    {
      "name": "قهوة زيادة",
      "price": "423",
      "time": "5:09:34 م",
      "timestamp": 1755796174000
    },
    {
      "name": "مشتريات من الصيدلية",
      "price": "70",
      "time": "6:56:47 م",
      "timestamp": 1755802607000
    },
    {
      "name": "فطار من المخبز",
      "price": "22",
      "time": "8:13:17 ص",
      "timestamp": 1755763997000
    },
    {
      "name": "سهرة كافيه",
      "price": "286",
      "time": "4:04:26 م",
      "timestamp": 1755792266000
    },
    {
      "name": "خضار وفاكهة",
      "price": "36",
      "time": "9:30:15 ص",
      "timestamp": 1755768615000
    },
    {
      "name": "مصروف يومي",
      "price": "379",
      "time": "3:14:11 م",
      "timestamp": 1755789251000
    }
  ],
  "22-8-2025": [
    {
      "name": "توصيل طلبات",
      "price": "475",
      "time": "3:27:41 م",
      "timestamp": 1755876461000
    },
    {
      "name": "مشروب بارد",
      "price": "152",
      "time": "8:06:45 م",
      "timestamp": 1755893205000
    },
    {
      "name": "سوبرماركت",
      "price": "47",
      "time": "6:39:39 م",
      "timestamp": 1755887979000
    },
    {
      "name": "كوباية قهوة",
      "price": "92",
      "time": "1:05:04 م",
      "timestamp": 1755867904000
    },
    {
      "name": "أجرة تاكسي",
      "price": "47",
      "time": "9:07:21 م",
      "timestamp": 1755896841000
    }
  ],
  "23-8-2025": [
    {
      "name": "كوباية قهوة",
      "price": "334",
      "time": "12:24:34 م",
      "timestamp": 1755951874000
    },
    {
      "name": "خضار وفاكهة",
      "price": "462",
      "time": "7:19:26 م",
      "timestamp": 1755976766000
    },
    {
      "name": "طلب من المطعم",
      "price": "216",
      "time": "2:09:20 م",
      "timestamp": 1755958160000
    },
    {
      "name": "تجهيز عزومة",
      "price": "220",
      "time": "2:31:21 م",
      "timestamp": 1755959481000
    },
    {
      "name": "كتب",
      "price": "153",
      "time": "6:45:32 م",
      "timestamp": 1755974732000
    },
    {
      "name": "أجرة تاكسي",
      "price": "589",
      "time": "7:49:58 ص",
      "timestamp": 1755935398000
    },
    {
      "name": "فطار من المخبز",
      "price": "38",
      "time": "10:46:41 ص",
      "timestamp": 1755946001000
    },
    {
      "name": "عشاء في مطعم",
      "price": "241",
      "time": "7:21:54 م",
      "timestamp": 1755976914000
    }
  ]
}
    )
  )
  useEffect(() => {
    // Restart camera when facing mode changes
    if (showModal) {
      stopCamera();
      setTimeout(initializeCamera, 300);
    }
  }, [facingMode]);

  const initializeCamera = async () => {
    try {
      setIsLoading(true);
      setCameraError(null);
      
      // Check if browser supports mediaDevices
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support camera access');
      }

      const constraints = {
        video: { 
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to load
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().then(() => {
            setIsCameraActive(true);
            setIsLoading(false);
          }).catch(err => {
            console.error('Error playing video:', err);
            setCameraError('Failed to start camera');
            setIsLoading(false);
          });
        };
        
        videoRef.current.onerror = () => {
          setCameraError('Failed to load camera');
          setIsLoading(false);
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraError(`Camera error: ${error.message}`);
      setIsLoading(false);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      setIsCameraActive(false);
    }
  };

  const toggleCamera = () => {
    setFacingMode(prevMode => prevMode === 'environment' ? 'user' : 'environment');
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && isCameraActive) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame to the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to base64 for storage
      const imageData = canvas.toDataURL('image/jpeg', 1);
      setCapturedImage(imageData);
      
      // Stop camera after capture
      stopCamera();
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    initializeCamera();
  };

  const handleSubmit = (e) => {
    utilities.sound();
    e.preventDefault();
    
    if (!itemPrice || parseFloat(itemPrice) <= 0) {
      alert('الرجاء إدخال سعر صحيح');
      return;
    }

    if (!capturedImage) {
      alert('الرجاء التقاط صورة أولاً');
      return;
    }

    // Pass the captured item data to the parent component
utilities.storeItem(itemName,itemPrice,capturedImage);
window.location.href ='/'
    closeModal();
  };

  const closeModal = () => {
    stopCamera();
    setShowModal(false);
    setTimeout(() => {
      onClose?.();
window.location.href ='/'

    }, 300);
  };

  return (
    <div 
      className={`fixed inset-0 bg-indigo-100/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
        showModal ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div 
        className={`bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200 transition-all duration-300 transform ${
          showModal ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">إضافة عنصر بالكاميرا</h2>
          <button 
            onClick={closeModal}
            className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <RiCloseLine className="text-gray-500 text-xl" />
          </button>
        </div>

        <div className="p-5">
          {/* Camera Preview */}
          <div className="mb-6 relative">
            {cameraError ? (
              <div className="bg-red-100 border border-red-200 text-red-700 p-4 rounded-lg text-center">
                <RiCameraOffLine className="text-2xl mx-auto mb-2" />
                <p>{cameraError}</p>
                <button 
                  onClick={initializeCamera}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center mx-auto"
                >
                  <RiRefreshLine className="ml-1" />
                  حاول مرة أخرى
                </button>
              </div>
            ) : !capturedImage ? (
              <div className="relative">
                <div 
                  className={`bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center h-64 ${
                    isCameraActive ? '' : 'border-2 border-dashed border-gray-400'
                  }`}
                >
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    style={{ display: isCameraActive ? 'block' : 'none' }}
                  />
                  
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white p-6">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mx-auto mb-3"></div>
                        <p>جارٍ تشغيل الكاميرا...</p>
                      </div>
                    </div>
                  )}
                  
                  {!isLoading && !isCameraActive && (
                    <div className="text-center text-white p-6">
                      <RiCameraOffLine className="text-2xl mx-auto mb-2" />
                      <p>تعذر تشغيل الكاميرا</p>
                    </div>
                  )}
                </div>
                
                {/* Camera controls */}
                {isCameraActive && (
                  <div className="flex justify-center mt-4 space-x-4">
                    <button
                      onClick={toggleCamera}
                      className="p-3 bg-indigo-100 rounded-full text-indigo-700 hover:bg-indigo-200 transition-colors"
                      title="تبديل الكاميرا"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h4m-4 4h4m-4 4h4m4-8v8m0 0v8m0-8h4m-4 4h4m-4 4h4" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={capturePhoto}
                      className="p-5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                    >
                      <RiCameraLine className="text-2xl" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <div className="bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center h-64">
                  <img 
                    src={capturedImage} 
                    alt="الصورة الملتقطة" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex justify-center mt-4 space-x-3">
                  <button
                    onClick={retakePhoto}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    إعادة الالتقاط
                  </button>
                </div>
              </div>
            )}
            
            {/* Hidden canvas for capturing images */}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Item details form */}
          <form onSubmit={handleSubmit}>
            {/* Item Name (Optional) */}
            <div className="mb-4">
              <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-2">
                اسم العنصر (اختياري)
              </label>
              <input
                id="itemName"
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-colors"
                placeholder="أدخل اسم العنصر (اختياري)"
              />
            </div>

            {/* Price */}
            <div className="mb-6">
              <label htmlFor="itemPrice" className="block text-sm font-medium text-gray-700 mb-2">
                السعر *
              </label>
              <input
                id="itemPrice"
                type="number"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-colors"
                placeholder="0.00"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!itemPrice || parseFloat(itemPrice) <= 0 || !capturedImage}
              className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-colors ${
                itemPrice && parseFloat(itemPrice) > 0 && capturedImage
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-md'
                  : 'bg-indigo-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <RiCheckLine size={24} />
              إضافة العنصر
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CameraPage;