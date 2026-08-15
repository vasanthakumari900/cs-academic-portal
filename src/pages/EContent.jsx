import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlayCircle, FiBookOpen, FiArrowLeft, FiMonitor,
  FiYoutube, FiX, FiFilm, FiChevronRight, FiBook, FiLayers,
  FiStar, FiAward, FiVideo, FiUploadCloud, FiFileText, FiExternalLink,
} from "react-icons/fi";
import { useFirestoreList } from "../hooks/useFirestoreList";
import { videoService } from "../services/videoService";
import { useAuth } from "../context/AuthContext";
import { STORAGE_PATHS } from "../utils/constants";
import { uploadFile } from "../services/storageService";
import toast from "react-hot-toast";
import { NOTES_DATA, SEMESTER_UNITS, NAME_ONLY_MAP } from "./Notes";
import { CURRICULUM, CURRICULUM_PG } from "../utils/curriculum";
import PdfFileCard from "../components/common/PdfFileCard";
import { getSubjectIcon } from "../utils/subjectIcons";
import watchVideoBtnImg from "../assets/watch-video-btn.png";


const SUBJECT_PLAYLISTS = {
  // 1st Year Semester 1
  "MATHEMATICS PAPER I": "https://youtube.com/playlist?list=PLql0qQWQbo6nYjo2aqgiKh_kwm8YoyhEP&si=2rFWZ6ydB1onWVXD",
  "1-1-MATHEMATICS PAPER I": "https://youtube.com/playlist?list=PLql0qQWQbo6nYjo2aqgiKh_kwm8YoyhEP&si=2rFWZ6ydB1onWVXD",
  "MATHEMATICS PAPER - I": "https://youtube.com/playlist?list=PLql0qQWQbo6nYjo2aqgiKh_kwm8YoyhEP&si=2rFWZ6ydB1onWVXD",
  "1-1-MATHEMATICS PAPER - I": "https://youtube.com/playlist?list=PLql0qQWQbo6nYjo2aqgiKh_kwm8YoyhEP&si=2rFWZ6ydB1onWVXD",
  "PYTHON PROGRAMMING ESSENTIALS": "https://youtube.com/playlist?list=PLGjplNEQ1it8-0CmoljS5yeV-GlKSUEt0&si=pS1fVKWHLId-CxK1",
  "1-1-PYTHON PROGRAMMING ESSENTIALS": "https://youtube.com/playlist?list=PLGjplNEQ1it8-0CmoljS5yeV-GlKSUEt0&si=pS1fVKWHLId-CxK1",
  "DATA STRUCTURES": "https://youtube.com/playlist?list=PLGjplNEQ1it8-0CmoljS5yeV-GlKSUEt0&si=pS1fVKWHLId-CxK1",
  "1-1-DATA STRUCTURES": "https://youtube.com/playlist?list=PLGjplNEQ1it8-0CmoljS5yeV-GlKSUEt0&si=pS1fVKWHLId-CxK1",
  "1-1-TAMIL": "https://youtube.com/playlist?list=PLO9LKEvBiQTI&si=PSkqHz4hWIQpmDVE",

  // 1st Year Semester 2
  "OBJECT ORIENTED PROGRAMMING USING C++": "https://youtu.be/DwUuYC1tadI?si=o9ZMfZxzsxhVgfX5",
  "1-2-OBJECT ORIENTED PROGRAMMING USING C++": "https://youtu.be/DwUuYC1tadI?si=o9ZMfZxzsxhVgfX5",
  "WEB TECHNOLOGY": "https://youtube.com/playlist?list=PLJsQjWpPQDp2AZE8s9JJfdRo-F0WtLv9N&si=BBFQ_OhKe5NS-Jnk",
  "1-2-WEB TECHNOLOGY": "https://youtube.com/playlist?list=PLJsQjWpPQDp2AZE8s9JJfdRo-F0WtLv9N&si=BBFQ_OhKe5NS-Jnk",
  "1-2-TAMIL": "https://youtube.com/playlist?list=PLCOH2oZQZM4M&si=zWVF8Bo0BWaxNqwU",

  // 2nd Year Semester 1
  "OBJECT ORIENTED PROGRAMMING CONCEPTS USING JAVA": "https://youtube.com/playlist?list=PLdo5W4Nhv31a7A5Az4Mxp_PcNPXItprPp&si=Jed8HASq8aGiLqfk",
  "2-1-TAMIL": "https://youtube.com/playlist?list=PLK9f8qqkv3BY&si=LxxvKGKIrD9PEfhh",
  "PRINCIPLES OF OPERATING SYSTEMS": "https://youtu.be/bZyszKmgz2c?si=CTVtcUAmeLId1WT",
  "2-1-PRINCIPLES OF OPERATING SYSTEMS": "https://youtu.be/bZyszKmgz2c?si=CTVtcUAmeLId1WT",
  "WEB APPLICATION DEVELOPMENT USING REACTJS AND NODE.JS": "https://youtu.be/QFaFIcGhPoM?si=2vb0SO2C1m20dx9z",
  "2-1-WEB APPLICATION DEVELOPMENT USING REACTJS AND NODE.JS": "https://youtu.be/QFaFIcGhPoM?si=2vb0SO2C1m20dx9z",
  "WEB APPLICATION DEVELOPMENT USING ANGULARJS AND NODE.JS": "https://youtu.be/LAUi8pPlcUM?si=m9qeCclDyW57aIKp",
  "2-1-WEB APPLICATION DEVELOPMENT USING ANGULARJS AND NODE.JS": "https://youtu.be/LAUi8pPlcUM?si=m9qeCclDyW57aIKp",
  "STATISTICAL METHODS FOR COMPUTER SCIENCE – I": "https://youtu.be/qNGDD_Rh8ps?si=x_gj4qcz9j_TpQIK",
  "STATISTICAL METHODS FOR COMPUTER SCIENCE - I": "https://youtu.be/qNGDD_Rh8ps?si=x_gj4qcz9j_TpQIK",
  "2-1-STATISTICAL METHODS FOR COMPUTER SCIENCE – I": "https://youtu.be/qNGDD_Rh8ps?si=x_gj4qcz9j_TpQIK",
  "2-1-STATISTICAL METHODS FOR COMPUTER SCIENCE - I": "https://youtu.be/qNGDD_Rh8ps?si=x_gj4qcz9j_TpQIK",

  // 2nd Year Semester 2
  "ANDROID APP DEVELOPMENT": "https://youtube.com/playlist?list=PLUhfM8afLE_MOoV5jIAj4UTJ3o43LEmoc&si=obochsrhgBHkONiz",
  "SOFTWARE ENGINEERING": "https://youtube.com/playlist?list=PLxCzCOWd7aiEed7SKZBnC6ypFDWYLRvB2&si=IE-4o7eX5Yq1rvpt",
  "ARTIFICIAL INTELLIGENCE AND EXPERT SYSTEM": "https://youtube.com/playlist?list=PLzkMouYverAJ1hQLXScQB7FSM0XOwBHLg&si=lzGPIJn2VNBlcWXM",
  "2-2-TAMIL": "https://youtube.com/playlist?list=PLDe0NG4ovv44&si=DInjH62wkyG3pczn",

  // 3rd Year Semester 1
  "OPERATING SYSTEM": "https://youtube.com/playlist?list=PLdo5W4Nhv31a5ucW_S1K3-x6ztBRD-PNa&si=sayP_LqlXGWAgRi5",
  "DATABASE MANAGEMENT SYSTEM": "https://youtube.com/playlist?list=PLdo5W4Nhv31b33kF46f9aFjoJPOkdlsRc&si=B_RSaXrHa_xt0m1w",
  "DATA MINING TECHNIQUES": "https://youtube.com/playlist?list=PLmAmHQ-_5ySxFoIGmY1MJao-XYvYGxxgj&si=XBCZHPLgI2dK39uO",
  "DATA MINING": "https://youtube.com/playlist?list=PLmAmHQ-_5ySxFoIGmY1MJao-XYvYGxxgj&si=XBCZHPLgI2dK39uO",
  "ASP.NET": "https://youtube.com/playlist?list=PLKPQ0KVcoIqw&si=aXUyKLvcrrd9tzp1",

  // 3rd Year Semester 2
  "PROGRAMMING IN PHP": "https://youtube.com/playlist?list=PL0eyrZgxdwhwwQQZA79OzYwl5ewA7HQih&si=GZFGAYV8OJ9qXsqi",
  "CLOUD COMPUTING": "https://youtube.com/playlist?list=PLxCzCOWd7aiHRHVUtR-O52MsrdUSrzuy4&si=0P8FXxrHHYRhhCi1",
  "COMPUTER NETWORKS": "https://youtube.com/playlist?list=PLxCzCOWd7aiGFBD2-2joCpWOLUrDLvVV_&si=Ucz63yGPuz-b5896",
  "INTRODUCTION TO DATA SCIENCE": "https://youtu.be/N6BghzuFLIg?si=L_TCwxN5H8IYhjgR",
  "DIGITAL IMAGE PROCESSING": "https://youtube.com/playlist?list=PL3rE2jS8zxAykFjinlf6EsucLv5EA03_m&si=ta5Kk3KVB12u0mu3",
  "UNIFIED MODELING LANGUAGE": "https://youtube.com/playlist?list=PLA_LG2oFbzOnY9M8mjCByYvnSjoleNTrJ&si=cJ3VG3_wFAEuWez0",

  // PG 1st Year Semester 1
  "ADVANCED DESIGN AND ANALYSIS OF ALGORITHMS": "https://youtube.com/playlist?list=PLBlnK6fEyqRhoF3cPp0mgOZPuXeu84nAd&si=4SUJ3zsiAmv2Id0a",
  "Advanced Design and Analysis of Algorithms": "https://youtube.com/playlist?list=PLBlnK6fEyqRhoF3cPp0mgOZPuXeu84nAd&si=4SUJ3zsiAmv2Id0a",
  "1-1-ADVANCED DESIGN AND ANALYSIS OF ALGORITHMS": "https://youtube.com/playlist?list=PLBlnK6fEyqRhoF3cPp0mgOZPuXeu84nAd&si=4SUJ3zsiAmv2Id0a",

  "ADVANCED SOFTWARE ENGINEERING": "https://youtube.com/playlist?list=PLxCzCOWd7aiEed7SKZBnC6ypFDWYLRvB2&si=XzIouE_nwXYoTbiw",
  "Advanced Software Engineering": "https://youtube.com/playlist?list=PLxCzCOWd7aiEed7SKZBnC6ypFDWYLRvB2&si=XzIouE_nwXYoTbiw",
  "1-1-ADVANCED SOFTWARE ENGINEERING": "https://youtube.com/playlist?list=PLxCzCOWd7aiEed7SKZBnC6ypFDWYLRvB2&si=XzIouE_nwXYoTbiw",

  "CONTEMPORARY WEB TECHNOLOGIES": "https://youtube.com/playlist?list=PLVlQHNRLflP_hIZuBNjr6rZzqa2HZFkny&si=oCNlyq96zP7GBgNt",
  "Contemporary Web Technologies": "https://youtube.com/playlist?list=PLVlQHNRLflP_hIZuBNjr6rZzqa2HZFkny&si=oCNlyq96zP7GBgNt",
  "1-1-CONTEMPORARY WEB TECHNOLOGIES": "https://youtube.com/playlist?list=PLVlQHNRLflP_hIZuBNjr6rZzqa2HZFkny&si=oCNlyq96zP7GBgNt",

  "DATA COMMUNICATION AND NETWORKING": "https://youtube.com/playlist?list=PLiBvgS5MGf05_0mitNoB3fi_RYH0s_0B9&si=9jDe0pzSVtfYlHyK",
  "Data Communication and Networking": "https://youtube.com/playlist?list=PLiBvgS5MGf05_0mitNoB3fi_RYH0s_0B9&si=9jDe0pzSVtfYlHyK",
  "1-1-DATA COMMUNICATION AND NETWORKING": "https://youtube.com/playlist?list=PLiBvgS5MGf05_0mitNoB3fi_RYH0s_0B9&si=9jDe0pzSVtfYlHyK",

  "PYTHON FOR DATA SCIENCE": "https://youtu.be/LHBE6Q9XlzI?si=guzLzmOfOv9MJi8f",
  "Python for Data Science": "https://youtu.be/LHBE6Q9XlzI?si=guzLzmOfOv9MJi8f",
  "1-1-PYTHON FOR DATA SCIENCE": "https://youtu.be/LHBE6Q9XlzI?si=guzLzmOfOv9MJi8f",

  "MOBILE NETWORK SYSTEM": "https://youtube.com/playlist?list=PLm_MSClsnwm9u9UCi58RsSx9VnbvHh6OQ&si=2-DxSyvTfIx77y62",
  "Mobile Network System": "https://youtube.com/playlist?list=PLm_MSClsnwm9u9UCi58RsSx9VnbvHh6OQ&si=2-DxSyvTfIx77y62",
  "1-1-MOBILE NETWORK SYSTEM": "https://youtube.com/playlist?list=PLm_MSClsnwm9u9UCi58RsSx9VnbvHh6OQ&si=2-DxSyvTfIx77y62",

  "ARTIFICIAL NEURAL NETWORK": "https://youtube.com/playlist?list=PLuhqtP7jdD8CftMk831qdE8BlIteSaNzD&si=ZK6mUQ16c2A0V_ru",
  "Artificial Neural Network": "https://youtube.com/playlist?list=PLuhqtP7jdD8CftMk831qdE8BlIteSaNzD&si=ZK6mUQ16c2A0V_ru",
  "1-1-ARTIFICIAL NEURAL NETWORK": "https://youtube.com/playlist?list=PLuhqtP7jdD8CftMk831qdE8BlIteSaNzD&si=ZK6mUQ16c2A0V_ru",
};

const MATH1_VIDEOS = [
  {
    id: "math1-v1",
    title: "Mathematics Paper I - Lecture 1",
    youtubeId: "WFH_7n7hpHo",
    url: "https://youtu.be/WFH_7n7hpHo?si=PkhvvaIBSRSMwPeQ",
    description: "Core Concepts & Problem Solving for Mathematics Paper I",
    facultyName: "Mr.P.KARNAN, Mr.S.SATHISHKUMAR / Mr.R.SHANKAR"
  },
  {
    id: "math1-v2",
    title: "Mathematics Paper I - Lecture 2",
    youtubeId: "DFRBL2FsTC4",
    url: "https://youtu.be/DFRBL2FsTC4?si=lb1c5rZeCewX97Sc",
    description: "Worked Examples & Solutions for Mathematics Paper I",
    facultyName: "Mr.P.KARNAN, Mr.S.SATHISHKUMAR / Mr.R.SHANKAR"
  },
  {
    id: "math1-v3",
    title: "Mathematics Paper I - Lecture 3",
    youtubeId: "iGnGYzatZdA",
    url: "https://youtu.be/iGnGYzatZdA?si=JEG2xGhaeT-yQdNk",
    description: "Advanced Topics & Important Practice Questions",
    facultyName: "Mr.P.KARNAN, Mr.S.SATHISHKUMAR / Mr.R.SHANKAR"
  }
];

const SUBJECT_VIDEOS_MAP = {
  "MATHEMATICS PAPER I": MATH1_VIDEOS,
  "1-1-MATHEMATICS PAPER I": MATH1_VIDEOS,
  "MATHEMATICS PAPER - I": MATH1_VIDEOS,
  "1-1-MATHEMATICS PAPER - I": MATH1_VIDEOS,
  "STATISTICAL METHODS FOR COMPUTER SCIENCE - II": [
    {
      id: "stats2-v1",
      title: "Statistical Methods II - Part 1: Testing of Hypothesis",
      youtubeId: "arHKUMbsh9k",
      url: "https://youtu.be/arHKUMbsh9k?si=QEUMfTVAbcFYuKTf",
      description: "Basic Concepts, Null and Alternative Hypothesis, Type I & Type II Errors",
      facultyName: "DR.N S.INDHUMATHY"
    },
    {
      id: "stats2-v2",
      title: "Statistical Methods II - Part 2: Large & Small Sample Tests",
      youtubeId: "xmzwdO259w0",
      url: "https://youtu.be/xmzwdO259w0?si=9BCGMSVEtrnDxsfq",
      description: "Student's t-test, F-test, Paired t-test, Single & Difference of Means",
      facultyName: "DR.N S.INDHUMATHY"
    },
    {
      id: "stats2-v3",
      title: "Statistical Methods II - Part 3: Chi-Square Test & Goodness of Fit",
      youtubeId: "Qyd5Wz_Zst4",
      url: "https://youtu.be/Qyd5Wz_Zst4?si=e1F-hXTle8mnHEg0",
      description: "Chi-square distribution, Test for Independence & Goodness of Fit",
      facultyName: "DR.N S.INDHUMATHY"
    },
    {
      id: "stats2-v4",
      title: "Statistical Methods II - Part 4: Design of Experiments & ANOVA",
      youtubeId: "wj3udcllWKI",
      url: "https://youtu.be/wj3udcllWKI?si=-VSkaL9ELMBp2NX3",
      description: "CRD, RBD, Latin Square Design (LSD) and ANOVA Table",
      facultyName: "DR.N S.INDHUMATHY"
    }
  ],
  "STATISTICAL METHODS FOR COMPUTER SCIENCE – II": [
    {
      id: "stats2-v1",
      title: "Statistical Methods II - Part 1: Testing of Hypothesis",
      youtubeId: "arHKUMbsh9k",
      url: "https://youtu.be/arHKUMbsh9k?si=QEUMfTVAbcFYuKTf",
      description: "Basic Concepts, Null and Alternative Hypothesis, Type I & Type II Errors",
      facultyName: "DR.N S.INDHUMATHY"
    },
    {
      id: "stats2-v2",
      title: "Statistical Methods II - Part 2: Large & Small Sample Tests",
      youtubeId: "xmzwdO259w0",
      url: "https://youtu.be/xmzwdO259w0?si=9BCGMSVEtrnDxsfq",
      description: "Student's t-test, F-test, Paired t-test, Single & Difference of Means",
      facultyName: "DR.N S.INDHUMATHY"
    },
    {
      id: "stats2-v3",
      title: "Statistical Methods II - Part 3: Chi-Square Test & Goodness of Fit",
      youtubeId: "Qyd5Wz_Zst4",
      url: "https://youtu.be/Qyd5Wz_Zst4?si=e1F-hXTle8mnHEg0",
      description: "Chi-square distribution, Test for Independence & Goodness of Fit",
      facultyName: "DR.N S.INDHUMATHY"
    },
    {
      id: "stats2-v4",
      title: "Statistical Methods II - Part 4: Design of Experiments & ANOVA",
      youtubeId: "wj3udcllWKI",
      url: "https://youtu.be/wj3udcllWKI?si=-VSkaL9ELMBp2NX3",
      description: "CRD, RBD, Latin Square Design (LSD) and ANOVA Table",
      facultyName: "DR.N S.INDHUMATHY"
    }
  ]
};

const getSubjectVideos = (subject, year, sem) => {
  if (!subject) return [];
  const upper = subject.toUpperCase();
  const key = `${year}-${sem}-${upper}`;
  const normUpper = upper.replace(/–/g, "-");
  const normKey = key.replace(/–/g, "-");

  return SUBJECT_VIDEOS_MAP[key] ||
         SUBJECT_VIDEOS_MAP[normKey] ||
         SUBJECT_VIDEOS_MAP[upper] ||
         SUBJECT_VIDEOS_MAP[normUpper] ||
         SUBJECT_VIDEOS_MAP[subject] ||
         [];
};

export const DGVC_OFFICIAL_VIDEOS = [
  {
    id: "dgvc-v1",
    title: "DGVC Computer Science Video Lecture 1",
    youtubeId: "JgvQmR6HKlY",
    url: "https://youtu.be/JgvQmR6HKlY?si=rKDQECUVYdvWAswD",
    description: "Official DGVC Computer Science Department Lecture & E-Content Series",
    facultyName: "DGVC Computer Science Faculty",
    badge: "DGVC Official"
  },
  {
    id: "dgvc-v2",
    title: "DGVC Computer Science Video Lecture 2",
    youtubeId: "_ryqzpu1HX8",
    url: "https://youtu.be/_ryqzpu1HX8",
    description: "Official DGVC Computer Science Department Lecture & E-Content Series",
    facultyName: "DGVC Computer Science Faculty",
    badge: "DGVC Official"
  },
  {
    id: "dgvc-v3",
    title: "DGVC Computer Science Video Lecture 3",
    youtubeId: "DjFVF86o49M",
    url: "https://youtu.be/DjFVF86o49M",
    description: "Official DGVC Computer Science Department Lecture & E-Content Series",
    facultyName: "DGVC Computer Science Faculty",
    badge: "DGVC Official"
  },
  {
    id: "dgvc-v4",
    title: "DGVC Computer Science Video Lecture 4",
    youtubeId: "cWxmS-nPww0",
    url: "https://youtu.be/cWxmS-nPww0",
    description: "Official DGVC Computer Science Department Lecture & E-Content Series",
    facultyName: "DGVC Computer Science Faculty",
    badge: "DGVC Official"
  },
  {
    id: "dgvc-v5",
    title: "DGVC Computer Science Video Lecture 5",
    youtubeId: "P7NfEobYxng",
    url: "https://youtu.be/P7NfEobYxng",
    description: "Official DGVC Computer Science Department Lecture & E-Content Series",
    facultyName: "DGVC Computer Science Faculty",
    badge: "DGVC Official"
  },
  {
    id: "dgvc-v6",
    title: "DGVC Computer Science Video Lecture 6",
    youtubeId: "26DWC_QhY4w",
    url: "https://youtu.be/26DWC_QhY4w",
    description: "Official DGVC Computer Science Department Lecture & E-Content Series",
    facultyName: "DGVC Computer Science Faculty",
    badge: "DGVC Official"
  },
  {
    id: "dgvc-v7",
    title: "DGVC Computer Science Video Lecture 7",
    youtubeId: "O84M0xilgkE",
    url: "https://youtu.be/O84M0xilgkE",
    description: "Official DGVC Computer Science Department Lecture & E-Content Series",
    facultyName: "DGVC Computer Science Faculty",
    badge: "DGVC Official"
  },
  {
    id: "dgvc-v8",
    title: "DGVC Computer Science Video Lecture 8",
    youtubeId: "Pcdu--f2MTg",
    url: "https://youtu.be/Pcdu--f2MTg",
    description: "Official DGVC Computer Science Department Lecture & E-Content Series",
    facultyName: "DGVC Computer Science Faculty",
    badge: "DGVC Official"
  },
  {
    id: "dgvc-v9",
    title: "DGVC Computer Science Video Lecture 9",
    youtubeId: "i1d9Wpjed-M",
    url: "https://youtu.be/i1d9Wpjed-M",
    description: "Official DGVC Computer Science Department Lecture & E-Content Series",
    facultyName: "DGVC Computer Science Faculty",
    badge: "DGVC Official"
  },
  {
    id: "dgvc-v10",
    title: "DGVC Computer Science Video Lecture 10",
    youtubeId: "wSnW1WeXQT0",
    url: "https://youtu.be/wSnW1WeXQT0",
    description: "Official DGVC Computer Science Department Lecture & E-Content Series",
    facultyName: "DGVC Computer Science Faculty",
    badge: "DGVC Official"
  },
  {
    id: "dgvc-v11",
    title: "DGVC Computer Science Video Lecture 11",
    youtubeId: "gpNN79H0pRE",
    url: "https://youtu.be/gpNN79H0pRE",
    description: "Official DGVC Computer Science Department Lecture & E-Content Series",
    facultyName: "DGVC Computer Science Faculty",
    badge: "DGVC Official"
  },
  {
    id: "dgvc-v12",
    title: "DGVC Computer Science Video Lecture 12",
    youtubeId: "duT750w95rE",
    url: "https://youtu.be/duT750w95rE",
    description: "Official DGVC Computer Science Department Lecture & E-Content Series",
    facultyName: "DGVC Computer Science Faculty",
    badge: "DGVC Official"
  },
  {
    id: "dgvc-v13",
    title: "DGVC Computer Science Video Lecture 13",
    youtubeId: "bZR98Z0Rk_0",
    url: "https://youtu.be/bZR98Z0Rk_0",
    description: "Official DGVC Computer Science Department Lecture & E-Content Series",
    facultyName: "DGVC Computer Science Faculty",
    badge: "DGVC Official"
  },
  {
    id: "dgvc-v14",
    title: "DGVC Computer Science Video Lecture 14",
    youtubeId: "jOaRcKs8upA",
    url: "https://youtu.be/jOaRcKs8upA",
    description: "Official DGVC Computer Science Department Lecture & E-Content Series",
    facultyName: "DGVC Computer Science Faculty",
    badge: "DGVC Official"
  }
];

const getPlaylistUrl = (subject, year, sem) => {
  if (!subject) return null;
  const upper = subject.toUpperCase();
  const key = `${year}-${sem}-${upper}`;
  return SUBJECT_PLAYLISTS[key] || SUBJECT_PLAYLISTS[upper] || SUBJECT_PLAYLISTS[subject] || null;
};

const FACULTY_MAP = {
  "OPERATING SYSTEM": "Ms. Dr. DHARANI",
  "DATA MINING TECHNIQUES": "Ms. V. PONNILA",
  "ASP.NET": "Ms. R. SARANYA",
  "DATABASE MANAGEMENT SYSTEM": "Ms. M.P. SUDHA",
};

const FIRST_YEAR_SEM1_FACULTY = {
  "TAMIL": "Dr. K. VADIVELMURUGAN / Dr. C. Karthik, Dr. J. SIVAKUMAR",
  "FOUNDATION ENGLISH - I": "Ms. S. RITZY WONDERBELL / Ms. C. VIDHYA",
  "MATHEMATICS PAPER I": "Mr. P. KARNAN, Mr. S. SATHISHKUMAR / Mr. R. SHANKAR",
  "PYTHON PROGRAMMING ESSENTIALS": "Ms. V. PONNILA / Ms. R. POOJITHA SHREE",
  "DATA STRUCTURES": "Ms. R. Lalitha / Ms. P.J. RAJAM",
};

const SECOND_YEAR_SEM1_FACULTY = {
  "Foundation English - III": "Ms. C. MALINI / Ms. C. VIDHYA",
  "TAMIL": "Dr. J. SIVAKUMAR / Dr. K. VADIVELMURUGAN",
  "Statistical Methods for Computer Science – I": "Ms. Dr. N.S. INDHUMATHY",
  "Web Application Development using ReactJS and Node.js": "Ms. K. DURGADEVI / Ms. Dr. N.M. Sangeetha",
  "Principles of operating Systems": "Ms. Dr. A. KAVITHA / Ms. K. DURGADEVI",
  "Object Oriented Programming Concepts using JAVA": "Ms. Dr. A. KAVITHA, Ms. S. Tamilarasi / Ms. Dr. G. SRILAKSHMI",
  "Web Application Development using AngularJS and Node.js": "Ms. Dr. N.M. Sangeetha",
};

// CURRICULUM imported from Notes.jsx

const yearStyles = {
  1: { bg: "bg-[#0F4C81] text-white border-[#0A3356]", text: "text-[#0F4C81]" },
  2: { bg: "bg-[#0F4C81] text-white border-[#0A3356]", text: "text-[#0F4C81]" },
  3: { bg: "bg-[#0F4C81] text-white border-[#0A3356]", text: "text-[#0F4C81]" },
};

const subjectColors = [
  { from: "bg-white", to: "bg-white", badge: "bg-[#F0F4F8] text-[#0F4C81] border border-[#D9E2EC]" },
  { from: "bg-white", to: "bg-white", badge: "bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]" },
  { from: "bg-white", to: "bg-white", badge: "bg-[#FFF3E0] text-amber-800 border border-[#FFE0B2]" },
  { from: "bg-white", to: "bg-white", badge: "bg-[#FFEBEE] text-red-800 border border-[#FFCDD2]" },
  { from: "bg-white", to: "bg-white", badge: "bg-[#E8EAF6] text-[#303F9F] border border-[#C5CAE9]" },
];

// SYLLABUS parsed dynamically from NOTES_DATA

export default function EContent() {
  const { user } = useAuth();
  const isFaculty = user?.type === "faculty";
  const [courseType, setCourseType] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showVideos, setShowVideos] = useState(false);
  const [playing, setPlaying] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [videoType, setVideoType] = useState("lecture");
  const [uploadMethod, setUploadMethod] = useState("youtube");
  const [youtubeId, setYoutubeId] = useState("");
  const [uploadFileObj, setUploadFileObj] = useState(null);

  async function handleUpload(e) {
    e.preventDefault();
    if (!uploadTitle.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (uploadMethod === "youtube" && !youtubeId.trim()) {
      toast.error("Please enter a YouTube video ID or link");
      return;
    }
    if (uploadMethod === "file" && !uploadFileObj) {
      toast.error("Please choose a video file to upload");
      return;
    }

    setUploading(true);
    try {
      let fileUrl = "";
      let finalYoutubeId = "";

      if (uploadMethod === "file") {
        fileUrl = await uploadFile(STORAGE_PATHS.VIDEOS, uploadFileObj, setProgress);
      } else {
        const match = youtubeId.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([^?&"'>]+)/);
        finalYoutubeId = match ? match[1] : youtubeId.trim();
      }

      await videoService.create({
        title: uploadTitle.trim(),
        description: uploadDescription.trim(),
        videoType,
        subject: selectedSubject,
        semester: Number(selectedSemester),
        year: Number(selectedYear),
        youtubeId: finalYoutubeId || null,
        fileUrl: fileUrl || null,
        facultyName: user.name || "Faculty",
        facultyId: user.uid || "faculty-id",
      });

      toast.success("Video uploaded successfully!");
      setUploadTitle("");
      setUploadDescription("");
      setYoutubeId("");
      setUploadFileObj(null);
      setShowUploadForm(false);
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to upload video");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }

  const activeCurriculum = courseType === "pg" ? CURRICULUM_PG : CURRICULUM;
  const yearData = selectedYear && activeCurriculum[selectedYear] ? activeCurriculum[selectedYear] : null;
  const semesterData = selectedSemester && yearData ? yearData.semesters[selectedSemester] : null;
  const ys = selectedYear ? yearStyles[selectedYear] : yearStyles[1];
  const { items: firestoreVideos, refetch } = useFirestoreList(videoService);
  const isPlaceholder = selectedSubject && (
    NAME_ONLY_MAP[`${selectedYear}-${selectedSemester}`]?.has(selectedSubject)
  );

  const firestoreSubjectVideos = selectedSubject && selectedYear && !isPlaceholder
    ? firestoreVideos.filter((v) => {
        const matchesSubject = v.subject?.toUpperCase() === selectedSubject.toUpperCase();
        const matchesYear = v.year === selectedYear;
        const matchesSemester = !selectedSemester || v.semester === selectedSemester;
        return matchesSubject && matchesYear && matchesSemester;
      })
    : [];

  const presetVideos = useMemo(() => {
    return getSubjectVideos(selectedSubject, selectedYear, selectedSemester);
  }, [selectedSubject, selectedYear, selectedSemester]);

  const subjectVideos = useMemo(() => {
    return [...presetVideos, ...firestoreSubjectVideos];
  }, [presetVideos, firestoreSubjectVideos]);
  const syllabusData = useMemo(() => {
    if (!selectedSubject || isPlaceholder) return null;
    if (selectedSubject === "ENGLISH" && selectedYear === 2 && selectedSemester === 2) return null;
    if (selectedSubject === "Foundation English - III") return null;
    // Hide syllabus for Operating System in 2nd Year Sem 1 (E-Content only)
    if (selectedSubject === "OPERATING SYSTEM" && selectedYear === 2 && selectedSemester === 1) return null;
    const subjectData = NOTES_DATA[selectedSubject];
    if (!subjectData || !subjectData.units) return null;
    const filter = SEMESTER_UNITS[`${selectedYear}-${selectedSemester}`]?.[selectedSubject];
    return Object.entries(subjectData.units)
      .filter(([key]) => !filter || filter.has(Number(key)))
      .map(([key, unit], idx) => ({
        sl: idx + 1,
        module: `${unit.title}${unit.subtitle ? ` - ${unit.subtitle}` : ""}: ${unit.syllabus || "Syllabus content to be updated."}`,
        hrs: unit.hrs || 15,
        co: unit.co || `CO${key}`,
      }));
  }, [selectedSubject, selectedYear, selectedSemester, isPlaceholder]);

  const isStats2 = selectedSubject && selectedSubject.toUpperCase().includes("STATISTICAL METHODS FOR COMPUTER SCIENCE") && (selectedSubject.toUpperCase().includes("II") || selectedSubject.toUpperCase().includes("2"));
  const subjectNotesData = selectedSubject && !isPlaceholder && !isStats2 ? NOTES_DATA[selectedSubject] : null;
  const semesterUnitFilter = selectedSubject && !isPlaceholder ? SEMESTER_UNITS[`${selectedYear}-${selectedSemester}`]?.[selectedSubject] : null;

  if (!courseType && selectedYear !== "dgvc") {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 min-h-screen bg-[#FAF0F2] text-[#2D060E]">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center flex flex-col items-center justify-center">
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#011337] via-[#021C4F] to-[#7F011F] p-1.5 shadow-xl shadow-rose-950/20 ring-4 ring-amber-400/40 transition-transform hover:scale-105 duration-300">
            <div className="flex h-full w-full items-center justify-center rounded-[20px] bg-[#021C4F] text-amber-300">
              <FiPlayCircle size={48} className="text-amber-400 drop-shadow-md" />
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 shadow-md">
            <FiVideo size={14} /> Video Lectures &amp; E-Content
          </span>
          <h1 className="font-sans text-4xl font-extrabold text-[#021C4F]">Video Lectures &amp; E-Content</h1>
          <p className="mt-2 text-sm text-[#6B7280]">Select your degree program or browse official DGVC Computer Science video lectures</p>
        </motion.div>

        {/* 3 Main Course Cards: B.Sc. CS (UG), M.Sc. CS (PG), & DGVC VIDEOS */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 max-w-4xl mx-auto">
          {/* B.Sc. CS (UG) Card */}
          <motion.button
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 90 }}
            whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}
            onClick={() => { setCourseType("ug"); setSelectedYear(null); }}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#C50337] via-[#A0022B] to-[#7F011F] border-2 border-amber-400 text-white shadow-lg transition-all duration-300 hover:shadow-xl text-center flex flex-col justify-between"
          >
            <div className="relative p-6 text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md text-2xl font-black text-amber-300 transition-all duration-300 group-hover:scale-110 shadow-md">
                UG
              </div>
              <span className="inline-block bg-amber-400 text-slate-900 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-2 shadow-xs">
                3 Years · 6 Semesters
              </span>
              <h2 className="text-lg font-black text-white leading-snug">B.Sc. Computer Science</h2>
              <p className="mt-1 text-[11px] text-rose-100 font-medium">Undergraduate E-Content</p>
              <div className="mt-4 inline-flex items-center gap-1 text-[11px] font-black text-amber-300 uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                Explore UG <FiChevronRight size={12} />
              </div>
            </div>
          </motion.button>

          {/* M.Sc. CS (PG) Card */}
          <motion.button
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 90 }}
            whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}
            onClick={() => { setCourseType("pg"); setSelectedYear(null); }}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#C50337] via-[#A0022B] to-[#7F011F] border-2 border-amber-400 text-white shadow-lg transition-all duration-300 hover:shadow-xl text-center flex flex-col justify-between"
          >
            <div className="relative p-6 text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md text-2xl font-black text-amber-300 transition-all duration-300 group-hover:scale-110 shadow-md">
                PG
              </div>
              <span className="inline-block bg-amber-400 text-slate-900 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-2 shadow-xs">
                2 Years · 4 Semesters
              </span>
              <h2 className="text-lg font-black text-white leading-snug">M.Sc. Computer Science</h2>
              <p className="mt-1 text-[11px] text-rose-100 font-medium">Postgraduate E-Content</p>
              <div className="mt-4 inline-flex items-center gap-1 text-[11px] font-black text-amber-300 uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                Explore PG <FiChevronRight size={12} />
              </div>
            </div>
          </motion.button>

          {/* DGVC VIDEOS Card */}
          <motion.button
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 90 }}
            whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedYear("dgvc")}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#C50337] via-[#A0022B] to-[#7F011F] border-2 border-amber-400 text-white shadow-lg transition-all duration-300 hover:shadow-xl text-center flex flex-col justify-between"
          >
            <div className="relative p-6 text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md transition-all duration-300 group-hover:scale-110 shadow-md">
                <FiYoutube size={32} className="text-amber-300" />
              </div>
              <span className="inline-block bg-amber-400 text-slate-900 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-2 shadow-xs">
                Official YouTube Series
              </span>
              <h2 className="text-lg font-black text-white leading-snug">DGVC VIDEOS</h2>
              <p className="mt-1 text-[11px] text-rose-100 font-medium">14 Official CS Videos</p>
              <div className="mt-4 inline-flex items-center gap-1 text-[11px] font-black text-amber-300 uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                Watch Videos <FiChevronRight size={12} />
              </div>
            </div>
          </motion.button>
        </div>
      </div>
    );
  }

  if (!selectedYear) {
    const yearsList = courseType === "pg" ? [1, 2] : [1, 2, 3];
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 min-h-screen bg-[#FAF0F2] text-[#2D060E]">
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={() => { setCourseType(null); setSelectedYear(null); setSelectedSubject(null); }}
          className="mb-8 inline-flex items-center gap-2 rounded-xl border-2 border-[#D1D5DB] bg-white px-5 py-2.5 text-sm sm:text-base font-extrabold text-[#374151] shadow-md hover:bg-[#F3F4F6] hover:scale-105 transition-all"
        ><FiArrowLeft size={20} /> Back to Course</motion.button>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center flex flex-col items-center justify-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#011337] via-[#021C4F] to-[#7F011F] p-1 shadow-xl ring-4 ring-amber-400/30 transition-transform hover:scale-105 duration-300">
            <div className="flex h-full w-full items-center justify-center rounded-[20px] bg-[#021C4F] text-amber-300">
              <FiPlayCircle size={38} className="text-amber-400" />
            </div>
          </div>
          <h1 className="font-sans text-3xl sm:text-4xl font-extrabold text-[#021C4F]">{courseType.toUpperCase()} — Select Academic Year</h1>
          <p className="mt-2 text-sm text-[#6B7280]">Select your year to browse subject-wise E-Content &amp; video lectures</p>
        </motion.div>

        {/* Year Cards Grid */}
        <div className={`grid grid-cols-1 gap-6 ${courseType === "pg" ? "sm:grid-cols-2 max-w-2xl mx-auto" : "sm:grid-cols-3"}`}>
          {yearsList.map((year, i) => {
            return (
              <motion.button key={year}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1, type: "spring", stiffness: 80 }}
                whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedYear(year)}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#C50337] via-[#A0022B] to-[#7F011F] border-2 border-amber-400 text-white shadow-xl transition-all duration-300 hover:shadow-2xl text-center flex flex-col justify-between"
              >
                <div className="relative p-8 text-center">
                  <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-3xl font-bold transition-all duration-300 group-hover:scale-110 shadow-md">
                    {activeCurriculum[year].icon}
                  </div>
                  <span className="inline-block bg-amber-400 text-slate-900 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-2 shadow-sm">
                    {Object.keys(activeCurriculum[year].semesters).length} Semesters
                  </span>
                  <h2 className="text-xl font-black text-white">{activeCurriculum[year].label}</h2>
                  <p className="mt-1.5 text-xs text-rose-100 font-medium">Subject-wise Video Lectures &amp; Syllabus</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-[11px] font-black text-amber-300 uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                    Browse Lectures <FiChevronRight size={12} />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  {/* 🎬 DGVC VIDEOS GALLERY VIEW */}
  if (selectedYear === "dgvc") {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => { setSelectedYear(null); setSelectedSemester(null); setSelectedSubject(null); }}
          className="mb-8 inline-flex items-center gap-2 rounded-xl border-2 border-[#D1D5DB] bg-white px-5 py-2.5 text-sm sm:text-base font-extrabold text-[#374151] shadow-md hover:bg-[#F3F4F6] hover:scale-105 transition-all"
        >
          <FiArrowLeft size={20} /> Back to Course
        </motion.button>

        {/* Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-3xl bg-gradient-to-r from-[#011337] via-[#021C4F] to-[#7F011F] p-6 sm:p-8 text-white shadow-xl border border-amber-400/30 text-left"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 text-slate-900 px-3.5 py-1 text-[10px] font-black uppercase tracking-widest mb-2 shadow-sm">
                <FiYoutube size={14} /> Official DGVC Channel Content
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-serif">
                DGVC Computer Science Video Lectures
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 mt-2 max-w-2xl leading-relaxed">
                Collection of 14 official YouTube video lectures curated by the Department of Computer Science, Dwaraka Doss Goverdhan Doss Vaishnav College.
              </p>
            </div>
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md text-amber-300 border border-white/20 shadow-md">
              <FiYoutube size={42} />
            </div>
          </div>
        </motion.div>

        {/* 14 Videos Responsive Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DGVC_OFFICIAL_VIDEOS.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="group overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between"
            >
              <div>
                <div
                  onClick={() => setPlaying(video)}
                  className="relative aspect-video w-full bg-slate-900 cursor-pointer overflow-hidden group-hover:opacity-95"
                >
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                    alt={video.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#C50337] text-white shadow-xl group-hover:scale-110 transition-transform">
                      <FiPlayCircle size={28} className="ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute top-3 left-3 bg-[#021C4F] text-amber-300 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md shadow-md border border-white/20">
                    Lecture #{i + 1}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-extrabold text-sm text-[#021C4F] group-hover:text-[#C50337] transition-colors leading-snug">
                    {video.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {video.description}
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="inline-block bg-rose-50 text-[#C50337] text-[10px] font-extrabold px-2 py-0.5 rounded border border-rose-200">
                      {video.badge}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">{video.facultyName}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center justify-between gap-2">
                <button
                  onClick={() => setPlaying(video)}
                  className="cursor-pointer focus:outline-none hover:scale-105 active:scale-95 transition-transform"
                  title="Watch Video"
                >
                  <img src={watchVideoBtnImg} alt="Watch Video" className="h-10 sm:h-11 w-auto object-contain drop-shadow-sm" />
                </button>
                <a
                  href={video.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-all"
                  title="Open on YouTube"
                >
                  <FiExternalLink size={14} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Video Player Modal */}
        <AnimatePresence>
          {playing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4"
              onClick={() => setPlaying(null)}
            >
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-4xl my-auto overflow-hidden rounded-3xl bg-white border-2 border-amber-400 shadow-2xl"
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] bg-gradient-to-r from-[#011337] via-[#021C4F] to-[#7F011F] text-white">
                  <div className="min-w-0 flex-1">
                    <span className="inline-block bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-1">
                      🎬 DGVC Video Lecture
                    </span>
                    <h3 className="truncate text-base font-extrabold text-white">{playing.title || "Lecture"}</h3>
                    <p className="text-xs text-amber-200/90 font-medium">{playing.facultyName} · {playing.badge}</p>
                  </div>
                  <button onClick={() => setPlaying(null)} className="rounded-full bg-white/10 p-2.5 text-white/80 hover:bg-white/20 hover:text-white transition-all cursor-pointer"><FiX size={20} /></button>
                </div>
                <div className="aspect-video w-full bg-black">
                  {playing.youtubeId ? (
                    <iframe src={`https://www.youtube.com/embed/${playing.youtubeId}?autoplay=1&rel=0`}
                      title={playing.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen className="h-full w-full border-0" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-white/50 text-xs">Video URL not available</div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (!selectedSemester) {
    const sems = Object.entries(yearData.semesters);
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={() => { setSelectedYear(null); setSelectedSemester(null); setSelectedSubject(null); }}
          className="mb-8 inline-flex items-center gap-2 rounded-xl border-2 border-[#D1D5DB] bg-white px-5 py-2.5 text-sm sm:text-base font-extrabold text-[#374151] shadow-md hover:bg-[#F3F4F6] hover:scale-105 transition-all"
        ><FiArrowLeft size={20} /> Back to Years</motion.button>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center flex flex-col items-center justify-center">
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#011337] via-[#021C4F] to-[#7F011F] p-1.5 shadow-xl shadow-rose-950/20 ring-4 ring-amber-400/40 transition-transform hover:scale-105 duration-300">
            <div className="flex h-full w-full items-center justify-center rounded-[20px] bg-[#021C4F] text-amber-300">
              <FiPlayCircle size={48} className="text-amber-400 drop-shadow-md" />
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 shadow-md">
            <FiVideo size={14} /> E-CONTENT SEMESTER SELECTION
          </span>
          <h1 className="font-sans text-3xl sm:text-4xl font-extrabold text-[#021C4F] tracking-tight">{yearData.label}</h1>
          <p className="mt-2 text-sm text-[#6B7280] font-medium">Choose a semester to explore video lectures &amp; syllabus</p>
        </motion.div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {sems.map(([semKey, semData], i) => (
            <motion.button key={semKey}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}
              whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedSemester(Number(semKey))}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#C50337] via-[#A0022B] to-[#7F011F] border-2 border-amber-400 text-white shadow-xl transition-all duration-300 hover:shadow-2xl text-center flex flex-col justify-between"
            >
              <div className="relative p-8 text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-2xl font-black text-amber-300 shadow-md">
                  {Number(semKey) === 1 ? "SEM I" : "SEM II"}
                </div>
                <h2 className="text-xl font-black text-white">{semData.label}</h2>
                <p className="mt-1.5 text-xs text-rose-100 font-medium">{semData.subjects.length} Subjects</p>
                <div className="mt-4 inline-flex items-center gap-1 text-[11px] font-black text-amber-300 uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                  Explore Subjects <FiChevronRight size={12} />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  if (!selectedSubject) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={() => setSelectedSemester(null)}
          className="mb-8 inline-flex items-center gap-2 rounded-xl border-2 border-[#D1D5DB] bg-white px-5 py-2.5 text-sm sm:text-base font-extrabold text-[#374151] shadow-md hover:bg-[#F3F4F6] hover:scale-105 transition-all"
        ><FiArrowLeft size={20} /> Back to Semesters</motion.button>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-3">
            <span className={ys.text}>{yearData.label}</span><FiChevronRight size={12} /><span className={ys.text}>{semesterData.label}</span>
          </div>
          <h1 className="font-sans text-2xl font-bold text-[#0F4C81]">Select Subject</h1>
          <p className="mt-1 text-sm text-[#6B7280]">Choose a subject to view its syllabus &amp; video lectures</p>
        </motion.div>
        {semesterData.subjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#E5E7EB] bg-white py-20 shadow-sm">
            <FiBookOpen size={48} className="mb-3 text-slate-300" />
            <p className="text-sm font-medium text-[#4B5563]">Subjects will be added soon</p>
            <p className="mt-1 text-xs text-[#6B7280]">This semester's curriculum is being updated</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {semesterData.subjects.map((subject, i) => {
              const sc = subjectColors[i % subjectColors.length];
              return (
                <motion.button key={subject}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}
                  onClick={() => { setSelectedSubject(subject); setShowVideos(false); }}
                  className="group relative overflow-hidden rounded-xl bg-white border border-[#E5E7EB] shadow-sm transition-all duration-300 hover:shadow-sm hover:border-[#1E88E5]/40"
                >
                  <div className="relative flex items-start gap-4 p-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#FAF7F2] border border-[#E6DAB8] shadow-sm transition-all duration-300 group-hover:scale-105">
                      {getSubjectIcon(subject, 26)}
                    </div>
                    <div className="min-w-0 flex-1 pt-1 text-left">
                      <h3 className="font-sans font-bold text-sm text-[#0F4C81] leading-snug">{subject}</h3>
                      <div className="mt-3 flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 rounded-full ${sc.badge} px-2.5 py-0.5 text-[10px] font-semibold`}><FiBookOpen size={10} /> VIEW SYLLABUS</span>
                        <FiChevronRight size={14} className="text-slate-400 group-hover:text-[#1E88E5] transition-colors ml-auto" />
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  if (!showVideos) {
    const sc = subjectColors[semesterData.subjects.indexOf(selectedSubject) % subjectColors.length];
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={() => { setSelectedSubject(null); }}
          className="mb-8 inline-flex items-center gap-2 rounded-xl border-2 border-[#D1D5DB] bg-white px-5 py-2.5 text-sm sm:text-base font-extrabold text-[#374151] shadow-md hover:bg-[#F3F4F6] hover:scale-105 transition-all"
        ><FiArrowLeft size={20} /> Back to Subjects</motion.button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 flex items-center gap-2 text-xs text-[#6B7280]">
          <span className={ys.text}>{yearData.label}</span><FiChevronRight size={10} />
          <span className={ys.text}>{semesterData.label}</span><FiChevronRight size={10} />
          <span className="text-[#0F4C81] font-semibold">{selectedSubject}</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#FAF7F2] border border-[#E6DAB8] shadow-sm p-1">
              {getSubjectIcon(selectedSubject, 32)}
            </div>
            <div>
              <h1 className="font-sans text-2xl font-bold text-[#0F4C81]">{selectedSubject}</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-[#6B7280]">{yearData.label} · {semesterData.label}</span>
                <span className="badge-primary">{syllabusData?.length || 0} modules</span>
              </div>
            </div>
          </div>
        </motion.div>

        {syllabusData ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="mb-8 overflow-hidden rounded-xl bg-white border border-[#E5E7EB] shadow-sm"
          >
            <div className="bg-[#0F4C81] px-5 py-3.5 flex items-center gap-2 text-white">
              <FiBookOpen size={15} />
              <span className="text-xs font-bold uppercase tracking-wider">Syllabus</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#F8FAFC] text-[#0F4C81]">
                    <th className="px-5 py-3 font-bold uppercase tracking-wider w-14">Sl No</th>
                    <th className="px-5 py-3 font-bold uppercase tracking-wider">Contents of Module</th>
                    <th className="px-5 py-3 font-bold uppercase tracking-wider text-center w-20">Hrs</th>
                    <th className="px-5 py-3 font-bold uppercase tracking-wider text-center w-20">COs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {syllabusData.map((row) => (
                    <tr key={row.sl} className="hover:bg-[#F0F4F8] transition-colors">
                      <td className="px-5 py-3.5 font-bold text-[#0F4C81] align-top">{row.sl}</td>
                      <td className="px-5 py-3.5 text-[#4B5563] leading-relaxed font-medium">{row.module}</td>
                      <td className="px-5 py-3.5 text-center font-semibold text-[#0F4C81] align-top">{row.hrs}</td>
                      <td className="px-5 py-3.5 text-center font-bold text-[#0F4C81] align-top">{row.co}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <div className="mb-8 rounded-xl border border-dashed border-[#E5E7EB] bg-white py-16 text-center shadow-sm">
            <FiBookOpen size={40} className="mx-auto mb-3 text-slate-300" />
            <p className="text-sm text-[#6B7280]">Syllabus not yet available for this subject</p>
          </div>
        )}

        {/* ─── Faculty Upload Section ─── */}
        {isFaculty && selectedSubject && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            {!showUploadForm ? (
              <button
                onClick={() => setShowUploadForm(true)}
                className="group inline-flex items-center gap-2 rounded-lg bg-[#0F4C81] px-5 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#1E88E5] active:scale-[0.97]"
              >
                <FiUploadCloud size={18} />
                Upload Videos
              </button>
            ) : (
              <form onSubmit={handleUpload} className="space-y-4 rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3 mb-4">
                  <h3 className="font-sans text-base font-bold text-[#0F4C81] flex items-center gap-2">
                    <FiUploadCloud size={18} className="text-[#0F4C81]" />
                    Upload Videos — {selectedSubject}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowUploadForm(false)}
                    className="rounded-lg px-3 py-1.5 text-xs font-semibold text-[#6B7280] hover:bg-[#F8FAFC] transition-all"
                  >
                    Cancel
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">Title</label>
                    <input
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      required
                      placeholder="e.g. Binary Search Trees - Unit 1"
                      className="w-full rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0F4C81] placeholder:text-[#6B7280]/60 outline-none focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81]/15 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">Description</label>
                    <textarea
                      value={uploadDescription}
                      onChange={(e) => setUploadDescription(e.target.value)}
                      placeholder="Brief description of the lecture video"
                      rows={2}
                      className="w-full rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0F4C81] placeholder:text-[#6B7280]/60 outline-none focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81]/15 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">Video Type</label>
                      <select
                        value={videoType}
                        onChange={(e) => setVideoType(e.target.value)}
                        className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0F4C81] outline-none focus:border-[#0F4C81] transition-all"
                      >
                        <option value="lecture">Lecture</option>
                        <option value="class_recording">Class Recording</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">Upload Method</label>
                      <select
                        value={uploadMethod}
                        onChange={(e) => setUploadMethod(e.target.value)}
                        className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0F4C81] outline-none focus:border-[#0F4C81] transition-all"
                      >
                        <option value="youtube">YouTube Link / ID</option>
                        <option value="file">Direct Video File Upload</option>
                      </select>
                    </div>
                  </div>

                  {uploadMethod === "youtube" ? (
                    <div>
                      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">YouTube Link or Video ID</label>
                      <input
                        value={youtubeId}
                        onChange={(e) => setYoutubeId(e.target.value)}
                        required
                        placeholder="e.g. dQw4w9WgXcQ or https://youtu.be/..."
                        className="w-full rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0F4C81] placeholder:text-[#6B7280]/60 outline-none focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81]/15 focus:bg-white transition-all"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">Select Video File</label>
                      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-[#E5E7EB] bg-[#F8FAFC] px-4 py-6 text-center transition-all hover:border-[#1E88E5]/50 hover:bg-slate-100">
                        <FiUploadCloud size={24} className="text-[#0F4C81]" />
                        <span className="text-xs text-[#6B7280]">
                          {uploadFileObj ? uploadFileObj.name : "Choose a video file (.mp4, .webm)..."}
                        </span>
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => setUploadFileObj(e.target.files?.[0] ?? null)}
                          required={!uploading}
                        />
                      </label>
                    </div>
                  )}

                  {uploading && progress > 0 && progress < 100 && (
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-150">
                      <div className="h-full bg-[#0F4C81] transition-all" style={{ width: `${progress}%` }} />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={uploading}
                    className="w-full rounded-lg bg-[#0F4C81] py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#1E88E5] disabled:opacity-50"
                  >
                    {uploading ? `Uploading (${progress}%)...` : "Upload video"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}

        {(() => {
          const playlistUrl = getPlaylistUrl(selectedSubject, selectedYear, selectedSemester);
          const isThirdYear = selectedYear === 3;
          const hasPresetVideos = presetVideos.length > 0;
          const isActive = isThirdYear || Boolean(playlistUrl) || subjectVideos.length > 0;

          return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center mt-6">
              <button
                onClick={() => {
                  if (hasPresetVideos || subjectVideos.length > 0) {
                    setShowVideos(true);
                  } else if (playlistUrl) {
                    window.open(playlistUrl, "_blank", "noopener,noreferrer");
                    const isPlaylist = playlistUrl.includes("playlist");
                    toast.success(`Redirecting to ${selectedSubject} YouTube ${isPlaylist ? "Playlist" : "Video"}...`);
                  } else if (isThirdYear) {
                    toast.error(`YouTube playlist link for ${selectedSubject} will be updated soon!`);
                  } else {
                    toast.error("Videos are not yet available for this subject");
                  }
                }}
                className={`group cursor-pointer focus:outline-none transition-transform hover:scale-105 active:scale-95 ${
                  isActive ? "opacity-100" : "opacity-60"
                }`}
                title={`Watch Videos for ${selectedSubject}`}
              >
                <img
                  src={watchVideoBtnImg}
                  alt="Watch Video"
                  className="h-14 sm:h-16 w-auto object-contain drop-shadow-md"
                />
              </button>
            </motion.div>
          );
        })()}
      </div>
    );
  }

  const sc = subjectColors[semesterData.subjects.indexOf(selectedSubject) % subjectColors.length];
  const playlistUrl = getPlaylistUrl(selectedSubject, selectedYear, selectedSemester);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        onClick={() => setShowVideos(false)}
        className="mb-8 inline-flex items-center gap-2 rounded-xl border-2 border-[#D1D5DB] bg-white px-5 py-2.5 text-sm sm:text-base font-extrabold text-[#374151] shadow-md hover:bg-[#F3F4F6] hover:scale-105 transition-all"
      ><FiArrowLeft size={20} /> Back to Syllabus</motion.button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[#0F4C81] text-white shadow-sm"><FiMonitor size={28} /></div>
          <div>
            <h1 className="font-sans text-2xl font-bold text-[#0F4C81]">{selectedSubject}</h1>
            <p className="text-xs text-[#6B7280]">{yearData.label} · {semesterData.label}</p>
          </div>
        </div>
      </motion.div>

      {playlistUrl && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 p-5 text-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
              <FiYoutube size={28} className="text-white" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-base">
                Official YouTube {playlistUrl.includes("playlist") ? "Playlist" : "Video"}
              </h3>
              <p className="text-xs text-red-100">
                Watch {playlistUrl.includes("playlist") ? "full lecture series" : "lecture video"} for {selectedSubject} on YouTube
              </p>
            </div>
          </div>
          <a
            href={playlistUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-xs font-bold text-red-700 shadow hover:bg-red-50 transition-all active:scale-95"
          >
            <FiExternalLink size={15} />
            Open {playlistUrl.includes("playlist") ? "Playlist" : "Video"} on YouTube
          </a>
        </motion.div>
      )}

      {subjectVideos.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#E5E7EB] bg-white py-24 shadow-sm">
          <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-[#0F4C81]/10">
            <FiYoutube size={44} className="text-[#0F4C81]" />
          </div>
          <h3 className="text-lg font-bold text-[#0F4C81]">No Videos Added Yet</h3>
          <p className="mt-1 max-w-md text-center text-sm text-[#6B7280]">Video lectures for {selectedSubject} will be uploaded soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {subjectVideos.map((video, i) => (
            <motion.div key={video.id || i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <button onClick={() => setPlaying(video)}
                className="group w-full overflow-hidden rounded-lg bg-white border border-[#E5E7EB] shadow-sm transition-all duration-300 hover:shadow-sm hover:-translate-y-0.5 text-left"
              >
                <div className="relative aspect-video w-full bg-slate-100">
                  {video.youtubeId ? (
                    <img src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`} alt={video.title}
                      className="absolute inset-0 h-full w-full object-cover"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#F0F4F8] text-[#0F4C81]">
                      <FiVideo size={36} className="opacity-45" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 shadow-sm">
                      <FiPlayCircle size={24} className="text-[#0F4C81] ml-0.5" />
                    </div>
                  </div>
                  {video.duration && (
                    <span className="absolute bottom-3 right-3 rounded bg-black/75 px-2.5 py-1 text-[10px] font-mono text-white">{video.duration}</span>
                  )}
                </div>
                <div className="p-4 bg-white">
                  <h3 className="line-clamp-1 font-sans text-sm font-bold text-[#0F4C81] group-hover:text-[#1E88E5] transition-colors">{video.title || "Lecture Video"}</h3>
                  {video.description && <p className="mt-0.5 text-xs text-[#6B7280] line-clamp-1">{video.description}</p>}
                  <div className="mt-2 flex items-center gap-2">
                    <span className="badge-primary">Lecture</span>
                    {video.facultyName && <span className="text-[10px] text-[#6B7280]">{video.facultyName}</span>}
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Related Lecture Notes */}
      {subjectNotesData && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-12">
          <h2 className="font-sans text-lg font-bold text-[#0F4C81] mb-4 flex items-center gap-2 border-b border-[#E5E7EB] pb-2">
            <FiFileText className="text-[#2E7D32]" />
            Syllabus &amp; Study Notes
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(subjectNotesData.units)
              .filter(([unitKey]) => !semesterUnitFilter || semesterUnitFilter.has(Number(unitKey)))
              .map(([unitKey, unit]) => {
                if (unit.files.length === 0) return null;
                return (
                  <div key={unitKey} className="rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-sm">
                    <h3 className="font-sans text-sm font-bold text-[#0F4C81] mb-3">{unit.title} - {unit.subtitle}</h3>
                    <div className="space-y-3">
                      {unit.files.map((file) => (
                        <PdfFileCard
                          key={file.id}
                          file={{
                            ...file,
                            subject: selectedSubject,
                            year: Number(selectedYear),
                            semester: Number(selectedSemester),
                            unit: unit.title,
                            driveUrl: `https://drive.google.com/file/d/${file.fileId}/view`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {playing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setPlaying(null)}
          >
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl overflow-hidden rounded-xl bg-white border border-[#E5E7EB] shadow-2xl"
            >
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E5E7EB] bg-[#0F4C81] text-white">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold text-white">{playing.title || "Lecture"}</h3>
                  <p className="text-[11px] text-white/80">{selectedSubject}</p>
                </div>
                <button onClick={() => setPlaying(null)} className="rounded-full bg-white/10 p-2 text-white/70 hover:bg-white/20 hover:text-white transition-all"><FiX size={16} /></button>
              </div>
              <div className="aspect-video w-full bg-black">
                {playing.youtubeId ? (
                  <iframe src={`https://www.youtube.com/embed/${playing.youtubeId}?autoplay=1&rel=0`}
                    title={playing.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen className="h-full w-full" />
                ) : playing.fileUrl ? (
                  <video src={playing.fileUrl} controls autoPlay className="h-full w-full" />
                ) : (
                  <div className="flex h-full items-center justify-center text-white/50 text-sm">Video URL not available</div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
