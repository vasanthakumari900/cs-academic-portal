// src/context/AuthContext.jsx
// Student & Faculty login
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

// Faculty credentials — name → unique password mapping
// Name must be entered in capital letters as listed here
const FACULTY_CREDENTIALS = {
  "R LALITHA": "DGVC@0001",
  "P J RAJAM": "DGVC@0002",
  "K DURGADEVI": "DGVC@0003",
  "DHARANI": "DGVC@0004",
  "P REVATHI": "DGVC@0005",
  "S KARTHIKA": "DGVC@0006",
  "R SARANYA": "DGVC@0007",
  "M P SUDHA": "DGVC@0008",
  "V PONNILA": "DGVC@0009",
  "R POOJITHA SHREE": "DGVC@0010",
  "S TAMILARASI": "DGVC@0011",
  "G SRILAKSHMI": "DGVC@0012",
  "M SANGEETHA": "DGVC@0013",
  "A KAVITHA": "DGVC@0014",
  "P SUGANYA": "DGVC@0015",
};

// Derived list of faculty names (for backward compatibility)
const FACULTY_LIST = Object.keys(FACULTY_CREDENTIALS);

// 3rd Year A & B Section student records
const STUDENTS = {
  "24E3036": { name: "G BHUVANESHWARI", rollNumber: "24E3036", dob: "23/09/2006", year: 3, semester: 5, section: "B", type: "student" },
  "24E3014": { name: "DEEPIKA T", rollNumber: "24E3014", dob: "30/05/2007", year: 3, semester: 5, section: "B", type: "student" },
  "24E3013": { name: "MYTHILI B", rollNumber: "24E3013", dob: "10/12/2006", year: 3, semester: 5, section: "B", type: "student" },
  "24E3055": { name: "PRADHIKSHA B", rollNumber: "24E3055", dob: "27/10/2006", year: 3, semester: 5, section: "B", type: "student" },
  "24E3034": { name: "RAMYA S", rollNumber: "24E3034", dob: "12/01/2007", year: 3, semester: 5, section: "B", type: "student" },
  "24E3010": { name: "ROSHITHA N", rollNumber: "24E3010", dob: "26/06/2007", year: 3, semester: 5, section: "B", type: "student" },
  "24E3002": { name: "SANTHOSHINI R", rollNumber: "24E3002", dob: "13/05/2007", year: 3, semester: 5, section: "B", type: "student" },
  "24E3029": { name: "SHARMELA", rollNumber: "24E3029", dob: "10/08/2007", year: 3, semester: 5, section: "B", type: "student" },
  "24E3046": { name: "SREE PRIYA", rollNumber: "24E3046", dob: "19/03/2007", year: 3, semester: 5, section: "B", type: "student" },
  "24E3004": { name: "SRISAKTHI S", rollNumber: "24E3004", dob: "19/06/2006", year: 3, semester: 5, section: "B", type: "student" },
  "24E3047": { name: "V SUREKHA", rollNumber: "24E3047", dob: "11/09/2006", year: 3, semester: 5, section: "B", type: "student" },
  "24E3031": { name: "A S VARSHINEE", rollNumber: "24E3031", dob: "02/02/2007", year: 3, semester: 5, section: "B", type: "student" },
  "24E3039": { name: "AHMED AADHIL", rollNumber: "24E3039", dob: "26/03/2007", year: 3, semester: 5, section: "B", type: "student" },
  "24E3012": { name: "S BARATH", rollNumber: "24E3012", dob: "19/07/2007", year: 3, semester: 5, section: "B", type: "student" },
  "24E3022": { name: "BHARATH A", rollNumber: "24E3022", dob: "13/03/2007", year: 3, semester: 5, section: "B", type: "student" },
  "24E3026": { name: "S BHUVANESH", rollNumber: "24E3026", dob: "29/10/2006", year: 3, semester: 5, section: "B", type: "student" },
  "24E3003": { name: "CHANDRU", rollNumber: "24E3003", dob: "28/11/2006", year: 3, semester: 5, section: "B", type: "student" },
  "24E3041": { name: "DARSHAN N", rollNumber: "24E3041", dob: "03/05/2007", year: 3, semester: 5, section: "B", type: "student" },
  "24E3019": { name: "DEEPAKRAJA A", rollNumber: "24E3019", dob: "22/01/2007", year: 3, semester: 5, section: "B", type: "student" },
  "24E3018": { name: "DINESH RAJ S", rollNumber: "24E3018", dob: "19/06/2007", year: 3, semester: 5, section: "B", type: "student" },
  "24E3005": { name: "GIRITHARAN", rollNumber: "24E3005", dob: "29/01/2007", year: 3, semester: 5, section: "B", type: "student" },
  "24E3035": { name: "KARAN RAJ .V", rollNumber: "24E3035", dob: "22/08/2002", year: 3, semester: 5, section: "B", type: "student" },
  "24E3033": { name: "KARTHIKEYAN P", rollNumber: "24E3033", dob: "17/11/2005", year: 3, semester: 5, section: "B", type: "student" },
  "24E3040": { name: "KARTHIKEYAN", rollNumber: "24E3040", dob: "02/02/2004", year: 3, semester: 5, section: "B", type: "student" },
  "24E3024": { name: "KEERTHIVASAN", rollNumber: "24E3024", dob: "06/12/2006", year: 3, semester: 5, section: "B", type: "student" },
  "24E3051": { name: "KIRUBAKARAN", rollNumber: "24E3051", dob: "09/11/2006", year: 3, semester: 5, section: "B", type: "student" },
  "24E3057": { name: "KISHOREKUMAR I", rollNumber: "24E3057", dob: "09/08/2006", year: 3, semester: 5, section: "B", type: "student" },
  "24E3011": { name: "KRISHNAKUMAR", rollNumber: "24E3011", dob: "06/12/2006", year: 3, semester: 5, section: "B", type: "student" },
  "24E3050": { name: "LOKESH", rollNumber: "24E3050", dob: "09/07/2007", year: 3, semester: 5, section: "B", type: "student" },
  "24E3015": { name: "MUKESH V", rollNumber: "24E3015", dob: "30/03/2007", year: 3, semester: 5, section: "B", type: "student" },
  "24E3030": { name: "NAVEEN K", rollNumber: "24E3030", dob: "01/09/2006", year: 3, semester: 5, section: "B", type: "student" },
  "24E3042": { name: "NAVEEN", rollNumber: "24E3042", dob: "01/02/2007", year: 3, semester: 5, section: "B", type: "student" },
  "24E3044": { name: "PRADEEP M", rollNumber: "24E3044", dob: "05/03/2007", year: 3, semester: 5, section: "B", type: "student" },
  "24E3056": { name: "PRAKASH K J", rollNumber: "24E3056", dob: "26/08/2006", year: 3, semester: 5, section: "B", type: "student" },
  "24E3021": { name: "PREMNATH G", rollNumber: "24E3021", dob: "20/04/2007", year: 3, semester: 5, section: "B", type: "student" },
  "24E3020": { name: "RAJPRIYAN D", rollNumber: "24E3020", dob: "10/08/2007", year: 3, semester: 5, section: "B", type: "student" },
  "24E3028": { name: "ROHITHRAMANA MOORTHI", rollNumber: "24E3028", dob: "05/07/2006", year: 3, semester: 5, section: "B", type: "student" },
  "24E3001": { name: "RUBESH R", rollNumber: "24E3001", dob: "26/09/2006", year: 3, semester: 5, section: "B", type: "student" },
  "24E3023": { name: "R R SAISURIYA", rollNumber: "24E3023", dob: "13/12/2006", year: 3, semester: 5, section: "B", type: "student" },
  "24E3025": { name: "SANJAY N", rollNumber: "24E3025", dob: "28/12/2006", year: 3, semester: 5, section: "B", type: "student" },
  "24E3048": { name: "M.B. SHARAN KUMAR", rollNumber: "24E3048", dob: "10/01/2007", year: 3, semester: 5, section: "B", type: "student" },
  "24E3007": { name: "M SHARATHI", rollNumber: "24E3007", dob: "03/07/2006", year: 3, semester: 5, section: "B", type: "student" },
  "24E3043": { name: "SHYAM V", rollNumber: "24E3043", dob: "20/07/2007", year: 3, semester: 5, section: "B", type: "student" },
  "24E3008": { name: "SOWNDER R", rollNumber: "24E3008", dob: "02/12/2006", year: 3, semester: 5, section: "B", type: "student" },
  "24E3027": { name: "SRI SANJAY R M", rollNumber: "24E3027", dob: "29/05/2006", year: 3, semester: 5, section: "B", type: "student" },
  "24E3045": { name: "SUDHAN M", rollNumber: "24E3045", dob: "25/06/2006", year: 3, semester: 5, section: "B", type: "student" },
  "24E3053": { name: "TAMILARASAN R", rollNumber: "24E3053", dob: "12/01/2007", year: 3, semester: 5, section: "B", type: "student" },
  "24E3006": { name: "THARUN B S", rollNumber: "24E3006", dob: "11/08/2006", year: 3, semester: 5, section: "B", type: "student" },
  "24E3017": { name: "YUVANRAJKUMAR P", rollNumber: "24E3017", dob: "05/05/2007", year: 3, semester: 5, section: "B", type: "student" },
  "24E3032": { name: "V GANESH KUMAR", rollNumber: "24E3032", dob: "16/01/2007", year: 3, semester: 5, section: "B", type: "student" },
  "24E3038": { name: "ASJ POTHI VIGNESWAR", rollNumber: "24E3038", dob: "30/10/2006", year: 3, semester: 5, section: "B", type: "student" },
  "24E3049": { name: "YASHIKA V", rollNumber: "24E3049", dob: "13/02/2007", year: 3, semester: 5, section: "B", type: "student" },

  // ──── 3rd Year A Section ────
  "24E2901": { name: "SANTHOSH KUMAR S", rollNumber: "24E2901", dob: "04/05/2006", year: 3, semester: 5, section: "A", type: "student" },
  "24E2902": { name: "SUJITH G", rollNumber: "24E2902", dob: "11/09/2006", year: 3, semester: 5, section: "A", type: "student" },
  "24E2903": { name: "MONISHA S", rollNumber: "24E2903", dob: "08/01/2007", year: 3, semester: 5, section: "A", type: "student" },
  "24E2904": { name: "YUVAN SHANKAR A", rollNumber: "24E2904", dob: "02/06/2007", year: 3, semester: 5, section: "A", type: "student" },
  "24E2905": { name: "KISHORE S", rollNumber: "24E2905", dob: "26/11/2006", year: 3, semester: 5, section: "A", type: "student" },
  "24E2906": { name: "MOHAMAD SUHAIB N", rollNumber: "24E2906", dob: "15/01/2006", year: 3, semester: 5, section: "A", type: "student" },
  "24E2907": { name: "ABIRAMI K", rollNumber: "24E2907", dob: "19/09/2006", year: 3, semester: 5, section: "A", type: "student" },
  "24E2908": { name: "OVIYA V", rollNumber: "24E2908", dob: "14/06/2007", year: 3, semester: 5, section: "A", type: "student" },
  "24E2909": { name: "PREM KUMAR C", rollNumber: "24E2909", dob: "06/03/2007", year: 3, semester: 5, section: "A", type: "student" },
  "24E2910": { name: "THIRU RAGAVAN S P", rollNumber: "24E2910", dob: "02/11/2006", year: 3, semester: 5, section: "A", type: "student" },
  "24E2912": { name: "RAMYA S", rollNumber: "24E2912", dob: "17/11/2006", year: 3, semester: 5, section: "A", type: "student" },
  "24E2913": { name: "BALAJI M", rollNumber: "24E2913", dob: "03/02/2007", year: 3, semester: 5, section: "A", type: "student" },
  "24E2914": { name: "MOHAMMED SHAIK DHAWOOD.N.A", rollNumber: "24E2914", dob: "18/10/2006", year: 3, semester: 5, section: "A", type: "student" },
  "24E2915": { name: "YOGAS D", rollNumber: "24E2915", dob: "06/08/2006", year: 3, semester: 5, section: "A", type: "student" },
  "24E2916": { name: "HARISH RAAGAV G", rollNumber: "24E2916", dob: "20/08/2006", year: 3, semester: 5, section: "A", type: "student" },
  "24E2918": { name: "DHIVESH P", rollNumber: "24E2918", dob: "12/04/2007", year: 3, semester: 5, section: "A", type: "student" },
  "24E2919": { name: "HARSHIYA BEGAM S", rollNumber: "24E2919", dob: "01/03/2006", year: 3, semester: 5, section: "A", type: "student" },
  "24E2921": { name: "NITHYA SELVAM P M", rollNumber: "24E2921", dob: "31/08/2005", year: 3, semester: 5, section: "A", type: "student" },
  "24E2922": { name: "SAI CHARHAN S", rollNumber: "24E2922", dob: "10/12/2005", year: 3, semester: 5, section: "A", type: "student" },
  "24E2923": { name: "ROKITH K", rollNumber: "24E2923", dob: "26/09/2006", year: 3, semester: 5, section: "A", type: "student" },
  "24E2924": { name: "GOKUL D", rollNumber: "24E2924", dob: "03/05/2006", year: 3, semester: 5, section: "A", type: "student" },
  "24E2925": { name: "DINESH PANDIYAN K", rollNumber: "24E2925", dob: "19/03/2007", year: 3, semester: 5, section: "A", type: "student" },
  "24E2926": { name: "PRIYADHARSHAN T", rollNumber: "24E2926", dob: "15/04/2006", year: 3, semester: 5, section: "A", type: "student" },
  "24E2927": { name: "KIRAN C", rollNumber: "24E2927", dob: "06/12/2006", year: 3, semester: 5, section: "A", type: "student" },
  "24E2928": { name: "RAKSHIKA R", rollNumber: "24E2928", dob: "15/12/2006", year: 3, semester: 5, section: "A", type: "student" },
  "24E2929": { name: "HEMKUMAR B U", rollNumber: "24E2929", dob: "11/11/2006", year: 3, semester: 5, section: "A", type: "student" },
  "24E2930": { name: "ANU M", rollNumber: "24E2930", dob: "30/10/2006", year: 3, semester: 5, section: "A", type: "student" },
  "24E2931": { name: "KANISH M", rollNumber: "24E2931", dob: "26/11/2006", year: 3, semester: 5, section: "A", type: "student" },
  "24E2932": { name: "MONISH G", rollNumber: "24E2932", dob: "21/09/2006", year: 3, semester: 5, section: "A", type: "student" },
  "24E2933": { name: "NETHRAA D", rollNumber: "24E2933", dob: "11/02/2007", year: 3, semester: 5, section: "A", type: "student" },
  "24E2934": { name: "ANEESH ASWANTH J", rollNumber: "24E2934", dob: "22/06/2006", year: 3, semester: 5, section: "A", type: "student" },
  "24E2935": { name: "KRISHNA V", rollNumber: "24E2935", dob: "03/04/2006", year: 3, semester: 5, section: "A", type: "student" },
  "24E2936": { name: "RANJITH D", rollNumber: "24E2936", dob: "28/05/2007", year: 3, semester: 5, section: "A", type: "student" },
  "24E2937": { name: "SITHESHWARAN.M", rollNumber: "24E2937", dob: "24/01/2007", year: 3, semester: 5, section: "A", type: "student" },
  "24E2938": { name: "GOKULAKRISHNAN M", rollNumber: "24E2938", dob: "07/09/2006", year: 3, semester: 5, section: "A", type: "student" },
  "24E2939": { name: "MALAVIKKA S", rollNumber: "24E2939", dob: "24/08/2006", year: 3, semester: 5, section: "A", type: "student" },
  "24E2940": { name: "ALEXANDER KELVIN S", rollNumber: "24E2940", dob: "17/08/2006", year: 3, semester: 5, section: "A", type: "student" },
  "24E2941": { name: "JOHN PAUL J", rollNumber: "24E2941", dob: "01/09/2006", year: 3, semester: 5, section: "A", type: "student" },
  "24E2942": { name: "MANISH S", rollNumber: "24E2942", dob: "11/12/2006", year: 3, semester: 5, section: "A", type: "student" },
  "24E2943": { name: "KARTHIKEYAN G", rollNumber: "24E2943", dob: "10/05/2007", year: 3, semester: 5, section: "A", type: "student" },
  "24E2944": { name: "SHASHANK V C", rollNumber: "24E2944", dob: "09/06/2007", year: 3, semester: 5, section: "A", type: "student" },
  "24E2945": { name: "MYTHRISH B", rollNumber: "24E2945", dob: "12/11/2006", year: 3, semester: 5, section: "A", type: "student" },
  "24E2946": { name: "AMBRISH S", rollNumber: "24E2946", dob: "08/09/2006", year: 3, semester: 5, section: "A", type: "student" },
  "24E2947": { name: "ROHITH R", rollNumber: "24E2947", dob: "13/01/2007", year: 3, semester: 5, section: "A", type: "student" },
  "24E2948": { name: "PRAVIJITH A V", rollNumber: "24E2948", dob: "02/05/2007", year: 3, semester: 5, section: "A", type: "student" },
  "24E2949": { name: "GERSHOM ABRAHAM M P", rollNumber: "24E2949", dob: "01/01/2007", year: 3, semester: 5, section: "A", type: "student" },
  "24E2950": { name: "KARUNYA M", rollNumber: "24E2950", dob: "29/05/2007", year: 3, semester: 5, section: "A", type: "student" },
  "24E2951": { name: "REETHISH DANIEL D", rollNumber: "24E2951", dob: "14/08/2006", year: 3, semester: 5, section: "A", type: "student" },
  "24E2952": { name: "GODWIN D", rollNumber: "24E2952", dob: "04/12/2006", year: 3, semester: 5, section: "A", type: "student" },
  "24E2953": { name: "GUNAL B", rollNumber: "24E2953", dob: "06/05/2006", year: 3, semester: 5, section: "A", type: "student" },
  "24E2954": { name: "CHELLADURAI P", rollNumber: "24E2954", dob: "16/10/2005", year: 3, semester: 5, section: "A", type: "student" },
  "24E2955": { name: "JASHVA E", rollNumber: "24E2955", dob: "31/03/2007", year: 3, semester: 5, section: "A", type: "student" },
  "24E2956": { name: "SHYAM R", rollNumber: "24E2956", dob: "13/10/2006", year: 3, semester: 5, section: "A", type: "student" },
  "24E2957": { name: "HARSHAK R", rollNumber: "24E2957", dob: "28/02/2007", year: 3, semester: 5, section: "A", type: "student" },
  "24E2958": { name: "YUVAN YUGANDAR A", rollNumber: "24E2958", dob: "05/08/2006", year: 3, semester: 5, section: "A", type: "student" },

  // ──── 2nd Year B Section ────
  "25E3001": { name: "NANDHINI G", rollNumber: "25E3001", dob: "05/01/2008", year: 2, semester: 3, section: "B", type: "student" },
  "25E3002": { name: "HEMANTH KUMAR G", rollNumber: "25E3002", dob: "15/07/2007", year: 2, semester: 3, section: "B", type: "student" },
  "25E3003": { name: "N. K MOHAMMED HASSAN", rollNumber: "25E3003", dob: "29/08/2007", year: 2, semester: 3, section: "B", type: "student" },
  "25E3004": { name: "ARULARASI L", rollNumber: "25E3004", dob: "30/09/2008", year: 2, semester: 3, section: "B", type: "student" },
  "25E3005": { name: "MANIKANDAN.K", rollNumber: "25E3005", dob: "15/04/2008", year: 2, semester: 3, section: "B", type: "student" },
  "25E3006": { name: "MOHAMMED THAMEEM K", rollNumber: "25E3006", dob: "24/10/2007", year: 2, semester: 3, section: "B", type: "student" },
  "25E3007": { name: "LOKESH J", rollNumber: "25E3007", dob: "22/03/2007", year: 2, semester: 3, section: "B", type: "student" },
  "25E3008": { name: "LOGASHREE M", rollNumber: "25E3008", dob: "05/05/2008", year: 2, semester: 3, section: "B", type: "student" },
  "25E3009": { name: "SHIKA G", rollNumber: "25E3009", dob: "24/04/2006", year: 2, semester: 3, section: "B", type: "student" },
  "25E3010": { name: "G BALAJI", rollNumber: "25E3010", dob: "19/09/2007", year: 2, semester: 3, section: "B", type: "student" },
  "25E3011": { name: "S JAGAT KISHOR", rollNumber: "25E3011", dob: "15/11/2007", year: 2, semester: 3, section: "B", type: "student" },
  "25E3012": { name: "VINEETH V K", rollNumber: "25E3012", dob: "28/03/2008", year: 2, semester: 3, section: "B", type: "student" },
  "25E3013": { name: "K VISHNU PRIYA", rollNumber: "25E3013", dob: "28/07/2008", year: 2, semester: 3, section: "B", type: "student" },
  "25E3014": { name: "YESHWANTH", rollNumber: "25E3014", dob: "16/01/2007", year: 2, semester: 3, section: "B", type: "student" },
  "25E3015": { name: "PRASANTH.J.U", rollNumber: "25E3015", dob: "03/12/2007", year: 2, semester: 3, section: "B", type: "student" },
  "25E3016": { name: "MAHALAKSHMI M", rollNumber: "25E3016", dob: "19/03/2008", year: 2, semester: 3, section: "B", type: "student" },
  "25E3017": { name: "SHARAN KUMAR D", rollNumber: "25E3017", dob: "06/11/2007", year: 2, semester: 3, section: "B", type: "student" },
  "25E3018": { name: "PRAVEEN. S", rollNumber: "25E3018", dob: "19/06/2008", year: 2, semester: 3, section: "B", type: "student" },
  "25E3019": { name: "KANISHA SRI P", rollNumber: "25E3019", dob: "04/11/2007", year: 2, semester: 3, section: "B", type: "student" },
  "25E3020": { name: "NANDIKAA B R", rollNumber: "25E3020", dob: "15/10/2007", year: 2, semester: 3, section: "B", type: "student" },
  "25E3021": { name: "ELAVARASAN AS", rollNumber: "25E3021", dob: "03/09/2007", year: 2, semester: 3, section: "B", type: "student" },
  "25E3022": { name: "ABUTHAHIR.S", rollNumber: "25E3022", dob: "05/07/2007", year: 2, semester: 3, section: "B", type: "student" },
  "25E3023": { name: "DHIVYA DHARSHINI S", rollNumber: "25E3023", dob: "23/10/2007", year: 2, semester: 3, section: "B", type: "student" },
  "25E3024": { name: "GURU KRITHICK M", rollNumber: "25E3024", dob: "07/06/2007", year: 2, semester: 3, section: "B", type: "student" },
  "25E3025": { name: "SELVARASIKA G", rollNumber: "25E3025", dob: "08/06/2008", year: 2, semester: 3, section: "B", type: "student" },
  "25E3026": { name: "PAVITHRA.S", rollNumber: "25E3026", dob: "27/05/2007", year: 2, semester: 3, section: "B", type: "student" },
  "25E3027": { name: "PRIYADHARSHINI V", rollNumber: "25E3027", dob: "03/12/2005", year: 2, semester: 3, section: "B", type: "student" },
  "25E3028": { name: "SADHANA P", rollNumber: "25E3028", dob: "19/04/2008", year: 2, semester: 3, section: "B", type: "student" },
  "25E3029": { name: "SAI SHYAM M", rollNumber: "25E3029", dob: "12/06/2008", year: 2, semester: 3, section: "B", type: "student" },
  "25E3030": { name: "BHARATH KUMAR V", rollNumber: "25E3030", dob: "06/11/2007", year: 2, semester: 3, section: "B", type: "student" },
  "25E3031": { name: "MANISH KUMAR . P", rollNumber: "25E3031", dob: "01/12/2007", year: 2, semester: 3, section: "B", type: "student" },
  "25E3032": { name: "DHARSHIKA A", rollNumber: "25E3032", dob: "06/02/2005", year: 2, semester: 3, section: "B", type: "student" },
  "25E3033": { name: "MUTHULAKSHMI G", rollNumber: "25E3033", dob: "03/08/2007", year: 2, semester: 3, section: "B", type: "student" },
  "25E3034": { name: "RIJUTH S", rollNumber: "25E3034", dob: "20/11/2007", year: 2, semester: 3, section: "B", type: "student" },
  "25E3035": { name: "DHASTHAGIR M", rollNumber: "25E3035", dob: "21/04/2007", year: 2, semester: 3, section: "B", type: "student" },
  "25E3036": { name: "SANJAY SANJAY", rollNumber: "25E3036", dob: "31/08/2007", year: 2, semester: 3, section: "B", type: "student" },
  "25E3037": { name: "POONGAVANAM E", rollNumber: "25E3037", dob: "24/06/2007", year: 2, semester: 3, section: "B", type: "student" },
  "25E3038": { name: "PRATHEESH S", rollNumber: "25E3038", dob: "07/01/2008", year: 2, semester: 3, section: "B", type: "student" },
  "25E3039": { name: "N ARYA", rollNumber: "25E3039", dob: "19/07/2007", year: 2, semester: 3, section: "B", type: "student" },
  "25E3040": { name: "NITIN N", rollNumber: "25E3040", dob: "27/09/2006", year: 2, semester: 3, section: "B", type: "student" },
  "25E3041": { name: "DEEPIKA.R", rollNumber: "25E3041", dob: "07/11/2007", year: 2, semester: 3, section: "B", type: "student" },
  "25E3042": { name: "YUVASRI", rollNumber: "25E3042", dob: "18/06/2008", year: 2, semester: 3, section: "B", type: "student" },
  "25E3043": { name: "B ROHITH", rollNumber: "25E3043", dob: "02/01/2008", year: 2, semester: 3, section: "B", type: "student" },
  "25E3044": { name: "SRI KANDESHVARAN P", rollNumber: "25E3044", dob: "06/10/2007", year: 2, semester: 3, section: "B", type: "student" },
  "25E3045": { name: "P SADHNA", rollNumber: "25E3045", dob: "12/01/2008", year: 2, semester: 3, section: "B", type: "student" },
  "25E3046": { name: "KIRUTHIKA", rollNumber: "25E3046", dob: "20/01/2007", year: 2, semester: 3, section: "B", type: "student" },
  "25E3047": { name: "DHIVYA S", rollNumber: "25E3047", dob: "20/02/2008", year: 2, semester: 3, section: "B", type: "student" },
  "25E3048": { name: "PENCHAL VISHAL B S", rollNumber: "25E3048", dob: "05/07/2005", year: 2, semester: 3, section: "B", type: "student" },
  "25E3049": { name: "DEEPA KUMARI A", rollNumber: "25E3049", dob: "18/03/2007", year: 2, semester: 3, section: "B", type: "student" },
  "25E3050": { name: "SHISHIR ADHIKARY", rollNumber: "25E3050", dob: "11/02/2007", year: 2, semester: 3, section: "B", type: "student" },
  "25E3051": { name: "RESHMA.A", rollNumber: "25E3051", dob: "25/03/2008", year: 2, semester: 3, section: "B", type: "student" },
  "25E3052": { name: "PREM CHANDAR V", rollNumber: "25E3052", dob: "24/06/2007", year: 2, semester: 3, section: "B", type: "student" },
  "25E3053": { name: "PRAVESH KUMAR. M", rollNumber: "25E3053", dob: "16/08/2007", year: 2, semester: 3, section: "B", type: "student" },
  "25E3054": { name: "MARI SELVI D", rollNumber: "25E3054", dob: "17/05/2008", year: 2, semester: 3, section: "B", type: "student" },
  "25E3055": { name: "YUVRAJ SINGH CHAUHAN", rollNumber: "25E3055", dob: "02/09/2006", year: 2, semester: 3, section: "B", type: "student" },

  // ──── 2nd Year A Section ────
  "25E2901": { name: "LOKESHWARAN", rollNumber: "25E2901", dob: "16/05/2007", year: 2, semester: 3, section: "A", type: "student" },
  "25E2902": { name: "SANDHIYA V", rollNumber: "25E2902", dob: "06/03/2008", year: 2, semester: 3, section: "A", type: "student" },
  "25E2903": { name: "LATHISH S", rollNumber: "25E2903", dob: "08/04/2008", year: 2, semester: 3, section: "A", type: "student" },
  "25E2904": { name: "NETHRA. M", rollNumber: "25E2904", dob: "23/08/2007", year: 2, semester: 3, section: "A", type: "student" },
  "25E2905": { name: "KEERTHA PRIYA.J", rollNumber: "25E2905", dob: "17/11/2007", year: 2, semester: 3, section: "A", type: "student" },
  "25E2906": { name: "DINESH T", rollNumber: "25E2906", dob: "30/08/2007", year: 2, semester: 3, section: "A", type: "student" },
  "25E2907": { name: "SAI KARTHIKEYAN.R", rollNumber: "25E2907", dob: "07/02/2008", year: 2, semester: 3, section: "A", type: "student" },
  "25E2908": { name: "RAKESH C", rollNumber: "25E2908", dob: "17/08/2007", year: 2, semester: 3, section: "A", type: "student" },
  "25E2909": { name: "VIJAYARAGHAVA SIMHAN G", rollNumber: "25E2909", dob: "19/07/2007", year: 2, semester: 3, section: "A", type: "student" },
  "25E2910": { name: "GOWTHAM V", rollNumber: "25E2910", dob: "23/10/2007", year: 2, semester: 3, section: "A", type: "student" },
  "25E2911": { name: "RITHISHA S", rollNumber: "25E2911", dob: "17/06/2008", year: 2, semester: 3, section: "A", type: "student" },
  "25E2912": { name: "MENAKA DEVI P M", rollNumber: "25E2912", dob: "20/03/2008", year: 2, semester: 3, section: "A", type: "student" },
  "25E2913": { name: "LOGA PRIYA S", rollNumber: "25E2913", dob: "30/12/2006", year: 2, semester: 3, section: "A", type: "student" },
  "25E2914": { name: "DUVAARAKA M V", rollNumber: "25E2914", dob: "01/06/2008", year: 2, semester: 3, section: "A", type: "student" },
  "25E2915": { name: "SANJAY. R", rollNumber: "25E2915", dob: "21/11/2007", year: 2, semester: 3, section: "A", type: "student" },
  "25E2916": { name: "RAMYA M", rollNumber: "25E2916", dob: "24/09/2006", year: 2, semester: 3, section: "A", type: "student" },
  "25E2917": { name: "MITHRA N", rollNumber: "25E2917", dob: "16/04/2008", year: 2, semester: 3, section: "A", type: "student" },
  "25E2918": { name: "JOTHISH P", rollNumber: "25E2918", dob: "14/08/2008", year: 2, semester: 3, section: "A", type: "student" },
  "25E2919": { name: "SATHYA PRIYA S", rollNumber: "25E2919", dob: "17/12/2007", year: 2, semester: 3, section: "A", type: "student" },
  "25E2920": { name: "SANJANA", rollNumber: "25E2920", dob: "26/10/2007", year: 2, semester: 3, section: "A", type: "student" },
  "25E2921": { name: "HARSHIKA P", rollNumber: "25E2921", dob: "11/08/2007", year: 2, semester: 3, section: "A", type: "student" },
  "25E2922": { name: "KOWSIYA K", rollNumber: "25E2922", dob: "10/05/2008", year: 2, semester: 3, section: "A", type: "student" },
  "25E2923": { name: "MATHEW A", rollNumber: "25E2923", dob: "05/08/2007", year: 2, semester: 3, section: "A", type: "student" },
  "25E2925": { name: "MONIKA.P", rollNumber: "25E2925", dob: "18/07/2007", year: 2, semester: 3, section: "A", type: "student" },
  "25E2926": { name: "THARUN M", rollNumber: "25E2926", dob: "18/10/2007", year: 2, semester: 3, section: "A", type: "student" },
  "25E2927": { name: "BENAZER FATHIMA A", rollNumber: "25E2927", dob: "09/01/2008", year: 2, semester: 3, section: "A", type: "student" },
  "25E2928": { name: "RAKSHVAN S", rollNumber: "25E2928", dob: "23/03/2007", year: 2, semester: 3, section: "A", type: "student" },
  "25E2929": { name: "KEERTHIVASAN.N.M.S", rollNumber: "25E2929", dob: "28/04/2008", year: 2, semester: 3, section: "A", type: "student" },
  "25E2930": { name: "SUSHANTH T", rollNumber: "25E2930", dob: "25/03/2008", year: 2, semester: 3, section: "A", type: "student" },
  "25E2931": { name: "AVINASH R", rollNumber: "25E2931", dob: "30/09/2007", year: 2, semester: 3, section: "A", type: "student" },
  "25E2932": { name: "KOILPILLAI CHURCHILL", rollNumber: "25E2932", dob: "17/09/2007", year: 2, semester: 3, section: "A", type: "student" },
  "25E2933": { name: "MONISH KUMAR S", rollNumber: "25E2933", dob: "08/10/2007", year: 2, semester: 3, section: "A", type: "student" },
  "25E2934": { name: "SHANMUGAM S", rollNumber: "25E2934", dob: "14/02/2007", year: 2, semester: 3, section: "A", type: "student" },
  "25E2935": { name: "NAMAN R", rollNumber: "25E2935", dob: "05/09/2007", year: 2, semester: 3, section: "A", type: "student" },
  "25E2936": { name: "BHAVATHARINI U", rollNumber: "25E2936", dob: "07/01/2008", year: 2, semester: 3, section: "A", type: "student" },
  "25E2937": { name: "NISHANTH RAJ.N", rollNumber: "25E2937", dob: "24/05/2005", year: 2, semester: 3, section: "A", type: "student" },
  "25E2938": { name: "TAMILMANI.K", rollNumber: "25E2938", dob: "09/11/2007", year: 2, semester: 3, section: "A", type: "student" },
  "25E2939": { name: "DENSING GNANA DURAI D", rollNumber: "25E2939", dob: "31/07/2007", year: 2, semester: 3, section: "A", type: "student" },
  "25E2940": { name: "SABARISH AYYAPPAN V", rollNumber: "25E2940", dob: "25/11/2007", year: 2, semester: 3, section: "A", type: "student" },
  "25E2941": { name: "CHANDRA KUMAR", rollNumber: "25E2941", dob: "28/09/2007", year: 2, semester: 3, section: "A", type: "student" },
  "25E2942": { name: "DHIKSHITHA M", rollNumber: "25E2942", dob: "27/12/2007", year: 2, semester: 3, section: "A", type: "student" },
  "25E2943": { name: "NAVIN E", rollNumber: "25E2943", dob: "23/06/2007", year: 2, semester: 3, section: "A", type: "student" },
  "25E2944": { name: "POOJA S", rollNumber: "25E2944", dob: "24/05/2008", year: 2, semester: 3, section: "A", type: "student" },
  "25E2945": { name: "ADARSH BHANDARI", rollNumber: "25E2945", dob: "22/12/2007", year: 2, semester: 3, section: "A", type: "student" },
  "25E2946": { name: "RESHMA S", rollNumber: "25E2946", dob: "20/04/2008", year: 2, semester: 3, section: "A", type: "student" },
  "25E2947": { name: "MANJU D", rollNumber: "25E2947", dob: "03/11/2007", year: 2, semester: 3, section: "A", type: "student" },
  "25E2948": { name: "PUVI EZHILAN A", rollNumber: "25E2948", dob: "18/04/2008", year: 2, semester: 3, section: "A", type: "student" },
  "25E2949": { name: "VIJAY B", rollNumber: "25E2949", dob: "22/02/2008", year: 2, semester: 3, section: "A", type: "student" },
  "25E2950": { name: "RAVINATH S", rollNumber: "25E2950", dob: "08/11/2007", year: 2, semester: 3, section: "A", type: "student" },
  "25E2951": { name: "CLEMENT SMITH", rollNumber: "25E2951", dob: "10/08/2007", year: 2, semester: 3, section: "A", type: "student" },
  "25E2952": { name: "DEEPIKA S A", rollNumber: "25E2952", dob: "07/12/2007", year: 2, semester: 3, section: "A", type: "student" },
  "25E2953": { name: "DIWAKAR B", rollNumber: "25E2953", dob: "06/07/2007", year: 2, semester: 3, section: "A", type: "student" },
  "25E2954": { name: "DEEPIKA S", rollNumber: "25E2954", dob: "16/07/2007", year: 2, semester: 3, section: "A", type: "student" },
  "25E2955": { name: "VARSHITH V", rollNumber: "25E2955", dob: "21/04/2008", year: 2, semester: 3, section: "A", type: "student" },
  "25E2956": { name: "GOKUL M", rollNumber: "25E2956", dob: "23/04/2007", year: 2, semester: 3, section: "A", type: "student" },

  // ──── 1st Year B Section ────
  "26E3101": { name: "THARUN A", rollNumber: "26E3101", dob: "15/09/2008", year: 1, semester: 1, section: "B", type: "student" },
  "26E3102": { name: "HARINI K", rollNumber: "26E3102", dob: "02/07/2009", year: 1, semester: 1, section: "B", type: "student" },
  "26E3103": { name: "MADHAVAN V", rollNumber: "26E3103", dob: "25/07/2009", year: 1, semester: 1, section: "B", type: "student" },
  "26E3104": { name: "GOWTHAM V", rollNumber: "26E3104", dob: "17-12-2008", year: 1, semester: 1, section: "B", type: "student" },
  "26E3105": { name: "ABINAYA N", rollNumber: "26E3105", dob: "22-07-2009", year: 1, semester: 1, section: "B", type: "student" },
  "26E3106": { name: "SUNDARAM E", rollNumber: "26E3106", dob: "28-06-2008", year: 1, semester: 1, section: "B", type: "student" },
  "26E3107": { name: "BHARANI SELVAN V", rollNumber: "26E3107", dob: "2009/3/2", year: 1, semester: 1, section: "B", type: "student" },
  "26E3108": { name: "SHARIKA D", rollNumber: "26E3108", dob: "10-04-2008", year: 1, semester: 1, section: "B", type: "student" },
  "26E3109": { name: "HEMA VARSHINI K", rollNumber: "26E3109", dob: "16-12-2008", year: 1, semester: 1, section: "B", type: "student" },
  "26E3110": { name: "SWETHA SRI S", rollNumber: "26E3110", dob: "02-02-2009", year: 1, semester: 1, section: "B", type: "student" },
  "26E3111": { name: "SRINETHI S", rollNumber: "26E3111", dob: "27-02-2009", year: 1, semester: 1, section: "B", type: "student" },
  "26E3112": { name: "SRINIVAS J", rollNumber: "26E3112", dob: "30-05-2008", year: 1, semester: 1, section: "B", type: "student" },
  "26E3114": { name: "KEERTHIVASAN M", rollNumber: "26E3114", dob: "29-07-2008", year: 1, semester: 1, section: "B", type: "student" },
  "26E3115": { name: "VENKATESHAN HARISH V", rollNumber: "26E3115", dob: "17-11-2008", year: 1, semester: 1, section: "B", type: "student" },
  "26E3117": { name: "PRABHAKARAN R", rollNumber: "26E3117", dob: "26-10-2008", year: 1, semester: 1, section: "B", type: "student" },
  "26E3118": { name: "S P ASHWANTH", rollNumber: "26E3118", dob: "21-04-2008", year: 1, semester: 1, section: "B", type: "student" },
  "26E3119": { name: "HARI KRISHNAN S", rollNumber: "26E3119", dob: "10-10-2008", year: 1, semester: 1, section: "B", type: "student" },
  "26E3120": { name: "KARTHIKEYAN V", rollNumber: "26E3120", dob: "31-12-2008", year: 1, semester: 1, section: "B", type: "student" },
  "26E3121": { name: "GAGAN BHARDWAJ", rollNumber: "26E3121", dob: "31- 12- 2008", year: 1, semester: 1, section: "B", type: "student" },
  "26E3122": { name: "MANJULA V", rollNumber: "26E3122", dob: "25-07-2008", year: 1, semester: 1, section: "B", type: "student" },
  "26E3123": { name: "THIRU PRASANNA BALAJI M", rollNumber: "26E3123", dob: "23-12-2008", year: 1, semester: 1, section: "B", type: "student" },
  "26E3124": { name: "SAMYUTHRA S", rollNumber: "26E3124", dob: "28-02-2009", year: 1, semester: 1, section: "B", type: "student" },
  "26E3125": { name: "VARSHA C", rollNumber: "26E3125", dob: "18-10-2008", year: 1, semester: 1, section: "B", type: "student" },
  "26E3126": { name: "KISHORE C", rollNumber: "26E3126", dob: "12-09-2008", year: 1, semester: 1, section: "B", type: "student" },
  "26E3127": { name: "HARISH KUMAR K", rollNumber: "26E3127", dob: "04-04-2009", year: 1, semester: 1, section: "B", type: "student" },
  "26E3128": { name: "DHARSHINI J", rollNumber: "26E3128", dob: "24-05-2008", year: 1, semester: 1, section: "B", type: "student" },
  "26E3129": { name: "MITHRA MARAN", rollNumber: "26E3129", dob: "10-01-2008", year: 1, semester: 1, section: "B", type: "student" },
  "26E3130": { name: "ABILASH KUMAR K", rollNumber: "26E3130", dob: "11-10-2008", year: 1, semester: 1, section: "B", type: "student" },
  "26E3131": { name: "DEEPAK V", rollNumber: "26E3131", dob: "29-01-2009", year: 1, semester: 1, section: "B", type: "student" },
  "26E3132": { name: "SURYA K", rollNumber: "26E3132", dob: "20-04-2009", year: 1, semester: 1, section: "B", type: "student" },
  "26E3133": { name: "SATHIYANATHAN I", rollNumber: "26E3133", dob: "27.09.2007", year: 1, semester: 1, section: "B", type: "student" },
  "26E3134": { name: "SANJU DHARSAN R", rollNumber: "26E3134", dob: "02/07/2009", year: 1, semester: 1, section: "B", type: "student" },
  "26E3136": { name: "NEELAVATHI N", rollNumber: "26E3136", dob: "31-10-2008", year: 1, semester: 1, section: "B", type: "student" },
  "26E3137": { name: "OVIYA G", rollNumber: "26E3137", dob: "19-10-2008", year: 1, semester: 1, section: "B", type: "student" },
  "26E3138": { name: "PRITHIVI RAJ P", rollNumber: "26E3138", dob: "2009/6/1", year: 1, semester: 1, section: "B", type: "student" },
  "26E3139": { name: "GOPINATH K", rollNumber: "26E3139", dob: "30-12-2008", year: 1, semester: 1, section: "B", type: "student" },
  "26E3140": { name: "C SAAIKARAN", rollNumber: "26E3140", dob: "2008/7/21", year: 1, semester: 1, section: "B", type: "student" },
  "26E3141": { name: "DINESH B", rollNumber: "26E3141", dob: "26-02-2009", year: 1, semester: 1, section: "B", type: "student" },
  "26E3142": { name: "ATHITHI S", rollNumber: "26E3142", dob: "08-07-2008", year: 1, semester: 1, section: "B", type: "student" },
  "26E3143": { name: "KEDAR R K", rollNumber: "26E3143", dob: "24-02-2009", year: 1, semester: 1, section: "B", type: "student" },
  "26E3144": { name: "VAISHNAVI S", rollNumber: "26E3144", dob: "06-11-2007", year: 1, semester: 1, section: "B", type: "student" },
  "26E3145": { name: "LATHISH G", rollNumber: "26E3145", dob: "22-05-2009", year: 1, semester: 1, section: "B", type: "student" },
  "26E3147": { name: "YOGI DASS H", rollNumber: "26E3147", dob: "05-07-2009", year: 1, semester: 1, section: "B", type: "student" },
  "26E3148": { name: "AKASH ALLEN M", rollNumber: "26E3148", dob: "11-08-2008", year: 1, semester: 1, section: "B", type: "student" },
  "26E3149": { name: "ARUN TN", rollNumber: "26E3149", dob: "2007/12/20", year: 1, semester: 1, section: "B", type: "student" },
  "26E3150": { name: "JUDSON ABRAHAM Y", rollNumber: "26E3150", dob: "10-06-2009", year: 1, semester: 1, section: "B", type: "student" },
  "26E3151": { name: "G . BRINDHA", rollNumber: "26E3151", dob: "19-12-2008", year: 1, semester: 1, section: "B", type: "student" },
  "26E3152": { name: "SHYAM PRAKASH R", rollNumber: "26E3152", dob: "06-08-2008", year: 1, semester: 1, section: "B", type: "student" },
  "26E3153": { name: "KAMESWARAN P", rollNumber: "26E3153", dob: "13-09-2008", year: 1, semester: 1, section: "B", type: "student" },
};

// Helper to normalize varying Date of Birth separators and padding
function normalizeDate(str) {
  if (!str) return "";
  let clean = str.replace(/\s+/g, "");
  clean = clean.replace(/[-.]/g, "/");
  let parts = clean.split("/");
  if (parts.length === 3) {
    let day, month, year;
    if (parts[0].length === 4) {
      year = parts[0];
      month = parts[1];
      day = parts[2];
    } else {
      day = parts[0];
      month = parts[1];
      year = parts[2];
    }
    const paddedDay = day.padStart(2, "0");
    const paddedMonth = month.padStart(2, "0");
    return `${paddedDay}/${paddedMonth}/${year}`;
  }
  return clean;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { name, rollNumber, type, ... }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ddgdvc_user");
      if (saved) setUser(JSON.parse(saved));
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  function login(rollNumber, dob) {
    const normalizedRoll = rollNumber.trim().toUpperCase();
    const record = STUDENTS[normalizedRoll];

    if (!record) {
      throw new Error("Invalid roll number. Please try again.");
    }

    // Validate DOB (standardized format match)
    if (normalizeDate(record.dob) !== normalizeDate(dob)) {
      throw new Error("Date of birth does not match our records.");
    }

    const { dob: _, ...userData } = record;
    setUser(userData);
    localStorage.setItem("ddgdvc_user", JSON.stringify(userData));
    return userData;
  }

  function facultyLogin(name, password) {
    const trimmedName = name.trim().toUpperCase();

    const expectedPassword = FACULTY_CREDENTIALS[trimmedName];

    if (!expectedPassword) {
      throw new Error("Faculty name not found. Please check the spelling and try again.");
    }

    if (password !== expectedPassword) {
      throw new Error("Incorrect password. Please try again.");
    }

    const userData = {
      name: trimmedName,
      type: "faculty",
      role: "faculty",
    };
    setUser(userData);
    localStorage.setItem("ddgdvc_user", JSON.stringify(userData));
    return userData;
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("ddgdvc_user");
  }

  const value = { user, loading, login, facultyLogin, logout, FACULTY_LIST, FACULTY_CREDENTIALS };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
