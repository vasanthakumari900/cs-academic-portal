// src/components/notes/AudioPodcastPlayerModal.jsx
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlay,
  FiPause,
  FiX,
  FiZap,
  FiRotateCcw,
  FiRotateCw,
  FiBookOpen,
  FiAward,
  FiCheckCircle,
  FiSliders,
  FiHelpCircle,
  FiTarget,
  FiVolume2,
  FiBook,
} from "react-icons/fi";
import toast from "react-hot-toast";

/**
 * Normalizes Roman numerals and abbreviations for natural Speech Synthesis.
 * e.g., "Unit V" -> "Unit 5", "Unit IV" -> "Unit 4", "Sem I" -> "Semester 1"
 */
export function cleanTextForSpeech(text) {
  if (!text) return "";
  return String(text)
    .replace(/\bUnit\s+V\b/gi, "Unit 5")
    .replace(/\bUnit\s+IV\b/gi, "Unit 4")
    .replace(/\bUnit\s+III\b/gi, "Unit 3")
    .replace(/\bUnit\s+II\b/gi, "Unit 2")
    .replace(/\bUnit\s+I\b/gi, "Unit 1")
    .replace(/\bSem\s+I\b/gi, "Semester 1")
    .replace(/\bSem\s+II\b/gi, "Semester 2")
    .replace(/\bSem\s+III\b/gi, "Semester 3")
    .replace(/\bSem\s+IV\b/gi, "Semester 4")
    .replace(/\bSem\s+V\b/gi, "Semester 5")
    .replace(/\bSem\s+VI\b/gi, "Semester 6");
}

/**
 * Analyzes syllabus text dynamically to generate Topic-by-Topic Theoretical Lessons,
 * Tamil Tutor Scripts, and 2-Mark, 5-Mark, & 10-Mark exam questions.
 */
export function analyzeSyllabusForUnit(unitTitle, unitSubtitle, syllabusText, subjectName) {
  const cleanTitle = cleanTextForSpeech(unitTitle || "Unit 1");
  const cleanSub = unitSubtitle || "Core Concepts";

  const isEnglishSubject = /english/i.test(subjectName || "") || /english/i.test(unitTitle || "");

  // If it's an English subject, ensure syllabus comes from English Course Book if not specified
  let effectiveSyllabus = syllabusText;
  if (isEnglishSubject && (!syllabusText || syllabusText.length < 15 || /core computer science/i.test(syllabusText))) {
    effectiveSyllabus = "Poem: A Bird, came down the Walk - Emily Dickinson | Speech: Nobel Acceptance Speech - Wangari Mathai | Film: Elephant Whisperers - Kartiki Gonsalves | Grammar in use & Vocabulary";
  }

  // Check if real syllabus is available
  const hasRealSyllabus = Boolean(
    effectiveSyllabus &&
    effectiveSyllabus.trim().length > 10 &&
    !/no syllabus|syllabus pending|to be added|coming soon/i.test(effectiveSyllabus)
  );

  // -------------------------------------------------------------------------
  // RULE 1: SUBJECT WITHOUT SYLLABUS -> Student CS Projects & Lab Showcase Mode!
  // -------------------------------------------------------------------------
  if (!hasRealSyllabus) {
    const proj1 = "CS Academic Portal Frontend Architecture (React 19 + Tailwind CSS)";
    const proj2 = "Portal Features: Notes, Videos, Q-Papers, CIA Papers & 12-Month Calendar";
    const proj3 = "AI Audio Podcast & Speech Synthesis Engine (English & Tamil)";
    const proj4 = "Placements Hub & Student-Faculty Authentication";

    const detailedTopicTheoryList = [
      {
        id: 1,
        title: "Frontend Technologies Used",
        theory: `Project Showcase: CS Academic Portal Frontend Architecture. 1) Core Framework: Built with React 19 and Vite for fast component rendering. 2) Styling & Design: Tailwind CSS with Neumorphism, Glassmorphism backdrop blur, and custom dark mode themes. 3) Animation System: Framer Motion for staggered page entrances, 3D card tilt perspective, and modal physics. 4) Icons & UI: React Icons (FiIcons) and Lucide.`,
        examImportance: `Viva Focus: Be ready to explain React functional components, Hooks (useState, useEffect, useRef), and Tailwind CSS utility styling.`,
        speechEn: cleanTextForSpeech(`Topic 1: Frontend Technologies Used. The CS Academic Portal frontend is engineered with React 19, Vite, Tailwind CSS, and Framer Motion for smooth 3D animations.`),
        speechTa: cleanTextForSpeech(`தலைப்பு 1: முகப்புத் தொழில்நுட்பங்கள். இந்த கம்ப்யூட்டர் சயின்ஸ் அகாடமிக் போர்டல் ரியாக்ட் 19, வைட், டைல்விண்ட் சிஎஸ்எஸ் மற்றும் பிரேமர் மோஷன் கொண்டு வடிவமைக்கப்பட்டுள்ளது.`),
      },
      {
        id: 2,
        title: "Academic & Portal Options Available",
        theory: `Project Showcase: Portal Options & Features. 1) Lecture Notes Option: Unit-wise lecture notes with direct PDF download links. 2) E-Content Option: Subject-wise video tutorials & playlists. 3) University Question Papers & CIA Papers: Semester question bank with drive downloads. 4) College Calendar Option: Official 12-month calendar (June 2026 to May 2027) showing Day Orders (I to VI), Working Days (1 to 95), and PDF Download.`,
        examImportance: `Viva Focus: Explain client-side routing with React Router DOM v6 and state management.`,
        speechEn: cleanTextForSpeech(`Topic 2: Portal Options Available. Includes Lecture Notes, E-Content Videos, Question Papers, CIA Papers, and the Official 12-Month College Calendar with Day Orders and PDF Download.`),
        speechTa: cleanTextForSpeech(`தலைப்பு 2: போர்டல் அமைப்புகள். இதில் பாடக் குறிப்புகள், வீடியோக்கள், முந்தைய தேர்வுத் தாள்கள் மற்றும் 12 மாத காலண்டர் அமைப்புகள் உள்ளன.`),
      },
      {
        id: 3,
        title: "AI Audio Podcast & Speech Engine",
        theory: `Project Showcase: AI Voice Assistant. Integrates browser Web Speech API (SpeechSynthesisUtterance) to dynamically analyze unit syllabi, generate 2-mark, 5-mark, and 10-mark exam questions, and teach theory in English and Tamil with rate controls.`,
        examImportance: `Viva Focus: Explain SpeechSynthesisUtterance, voice selection (ta-IN vs en-US), regex speech cleaning, and playback rate tuning.`,
        speechEn: cleanTextForSpeech(`Topic 3: AI Audio Podcast Engine. Converts syllabus text and project theory into natural speech in Tamil and English with speed controls.`),
        speechTa: cleanTextForSpeech(`தலைப்பு 3: AI குரல் செயலி. பாடத்திட்ட கருத்துகளை தமிழ் மற்றும் ஆங்கிலத்தில் அழகாகப் பேசி கற்பிக்கிறது.`),
      },
      {
        id: 4,
        title: "Placements & Cloud Authentication",
        theory: `Project Showcase: Career Hub & Backend. Integrates Firebase for student-faculty login, role-based route guards, and Placement Drives with interview experience reviews.`,
        examImportance: `Viva Focus: Explain Firebase Authentication methods and Firestore database queries.`,
        speechEn: cleanTextForSpeech(`Topic 4: Placements and Cloud Backend. Manages user authentication, placement drives, and alumni interview experiences.`),
        speechTa: cleanTextForSpeech(`தலைப்பு 4: வேலைவாய்ப்பு மற்றும் ஃபயர்பேஸ் மேலாண்மை. பயனர் அங்கீகாரம் மற்றும் வேலைவாய்ப்பு தகவல்களை வழங்குகிறது.`),
      }
    ];

    const short2Mark = [
      `1. What frontend technologies are used in your CS Academic Portal project?`,
      `2. What key academic options are available in the CS Academic Portal?`,
      `3. How does the College Calendar display Day Orders and Working Days?`,
      `4. How does the AI Speech Engine convert text to speech in English and Tamil?`,
    ];

    const medium5Mark = [
      `1. Explain the frontend architecture, styling system, and animation pipeline of your project.`,
      `2. Detail all the core academic options (Notes, Videos, Q-Papers, CIA Papers, Calendar, Placements).`,
      `3. Describe state management and routing implementation using React Router and AuthContext.`,
    ];

    const long10Mark = [
      `1. Comprehensive Project Viva Question: Explain the complete end-to-end architecture, frontend technology stack (React 19, Tailwind, Framer Motion), portal options, Web Speech API integration, and deployment process of your CS Academic Portal project.`,
    ];

    const whatToLearn = [
      `• Module 1: React 19, Vite & Tailwind CSS Frontend Stack`,
      `• Module 2: Portal Options - Notes, E-Content, Q-Papers & 12-Month Calendar`,
      `• Module 3: AI Audio Podcast & Web Speech API Engine (English & Tamil)`,
      `• Module 4: Placements Hub & Firebase Authentication System`,
    ];

    const englishLessonScript = [
      cleanTextForSpeech(`Welcome to your CS Academic Portal Project Showcase Mode for ${subjectName}. Today, I will teach you what frontend technologies were used in this project and what options are available in this portal.`),
      cleanTextForSpeech(`Frontend Technologies: Engineered with React 19, Vite, Tailwind CSS for Neumorphism styling, and Framer Motion for smooth 3D animations.`),
      cleanTextForSpeech(`Portal Options: Includes Lecture Notes, E-Content Videos, Question Papers, CIA Papers, Placements Hub, and the Official 12-Month College Calendar with Day Orders and PDF Download.`),
      cleanTextForSpeech(`AI Features: Includes AI Audio Podcast Tutor in English and Tamil, Notes AI Assistant, and automatic syllabus analysis.`),
      cleanTextForSpeech(`Viva Summary: Master your component structure, React hooks, and portal features for 100% viva marks!`),
    ];

    const tamilLessonScript = [
      cleanTextForSpeech(`வணக்கம்! ${subjectName} பாடத்திற்கான கம்ப்யூட்டர் சயின்ஸ் அகாடமிக் போர்டல் பிராஜெக்ட் விளக்கத்திற்கு வரவேற்கிறேன்.`),
      cleanTextForSpeech(`முகப்புத் தொழில்நுட்பங்கள்: இந்த போர்டல் ரியாக்ட் 19, வைட், டைல்விண்ட் சிஎஸ்எஸ் மற்றும் பிரேமர் மோஷன் அனிமேஷன்கள் கொண்டு உருவாக்கப்பட்டுள்ளது.`),
      cleanTextForSpeech(`போர்டல் அமைப்புகள்: இதில் பாடக் குறிப்புகள், வீடியோக்கள், தேர்வுத் தாள்கள், 12 மாத கல்லூரி காலண்டர் மற்றும் வேலைவாய்ப்பு தகவல்கள் உள்ளன.`),
      cleanTextForSpeech(`AI வசதிகள்: தமிழ் மற்றும் ஆங்கிலத்தில் பாடம் நடத்தும் AI குரல் செயலி மற்றும் குறிப்புகள் உதவி செயலி உள்ளது.`),
      cleanTextForSpeech(`வைவா சுருக்கம்: வைவா தேர்வுக்கு உங்கள் பிராஜெக்ட் அமைப்புகளை தெளிவாக விளக்கி முழு மதிப்பெண்களைப் பெறுங்கள்!`),
    ];

    return {
      isProjectMode: true,
      modeTitle: "🚀 CS Academic Portal Project Mode",
      t1: proj1, t2: proj2, t3: proj3, t4: proj4, t5: "React + Tailwind Architecture",
      detailedTopicTheoryList,
      short2Mark, medium5Mark, long10Mark, whatToLearn,
      englishLessonScript, tamilLessonScript,
    };
  }

  // -------------------------------------------------------------------------
  // RULE 2: ENGLISH SUBJECT (Syllabus directly from English Course Book)
  // -------------------------------------------------------------------------
  if (isEnglishSubject) {
    const rawTerms = effectiveSyllabus.split(/[:;\-,|.\n]+/).map((t) => t.trim()).filter((t) => t.length > 3);
    const t1 = rawTerms[0] || "Poem: A Bird, came down the Walk - Emily Dickinson";
    const t2 = rawTerms[1] || "Speech: Nobel Acceptance Speech - Wangari Mathai";
    const t3 = rawTerms[2] || "Film: Elephant Whisperers - Kartiki Gonsalves";
    const t4 = rawTerms[3] || "Writing, Reading and Grammar Skills";

    const detailedTopicTheoryList = [
      {
        id: 1,
        title: "Poem: A Bird, came down the Walk - Emily Dickinson",
        theory: `Literary Breakdown: Emily Dickinson's poem depicts nature's beauty and raw instincts. A bird eats a worm, drinks dew, and flies away gracefully when observed. Key literary devices: Personification, imagery, and rhyme. Themes: Nature's dual aspects of instinct and beauty.`,
        examImportance: `University Exam Focus: 5-mark stanza explanation and 10-mark critical essay.`,
        speechEn: cleanTextForSpeech(`Topic 1: Poem A Bird came down the Walk by Emily Dickinson. Explores nature's beauty and raw instincts with vivid imagery.`),
        speechTa: cleanTextForSpeech(`தலைப்பு 1: எமிலி டிக்கின்சனின் A Bird came down the Walk கவிதை. இயற்கையின் அழகு மற்றும் விலங்குகளின் இயல்பான நடத்தையை விவரிக்கிறது.`),
      },
      {
        id: 2,
        title: "Speech: Nobel Acceptance Speech - Wangari Maathai",
        theory: `Speech Analysis: Wangari Maathai, founder of Green Belt Movement and Nobel Peace laureate. Her speech connects tree planting with environmental protection, democracy, women empowerment, and peace.`,
        examImportance: `University Exam Focus: 2-mark Green Belt Movement definitions and 10-mark speech analysis.`,
        speechEn: cleanTextForSpeech(`Topic 2: Nobel Acceptance Speech by Wangari Maathai. Highlights environmental conservation, tree planting, and peace.`),
        speechTa: cleanTextForSpeech(`தலைப்பு 2: வங்காரி மாத்தாயின் நோபல் பரிசு உரை. சுற்றுச்சூழல் பாதுகாப்பு, மரம் நடுதல் மற்றும் அமைதியை வலியுறுத்துகிறது.`),
      },
      {
        id: 3,
        title: "Film: Elephant Whisperers - Kartiki Gonsalves",
        theory: `Documentary Analysis: Oscar-winning documentary depicting Bomman and Bellie's bond with Raghu the elephant in Mudumalai Tiger Reserve. Themes: Human-animal coexistence and indigenous conservation.`,
        examImportance: `University Exam Focus: 5-mark film review essay and theme analysis.`,
        speechEn: cleanTextForSpeech(`Topic 3: Documentary Elephant Whisperers by Kartiki Gonsalves. Shows the bond between Bomman, Bellie, and Raghu the elephant.`),
        speechTa: cleanTextForSpeech(`தலைப்பு 3: எலிபெண்ட் விஸ்பரர்ஸ் ஆவணப்படம். முதுமலை காடுகளில் பொம்மன், பெள்ளி மற்றும் ரகு யானையின் அன்பை விளக்குகிறது.`),
      },
      {
        id: 4,
        title: "Grammar, Vocabulary & Writing Skills",
        theory: `Language Practice: Sentence construction, error correction, formal letter writing, factual comprehension reading, and vocabulary building.`,
        examImportance: `University Exam Focus: 2-mark grammar items and 5-mark picture/letter writing.`,
        speechEn: cleanTextForSpeech(`Topic 4: Grammar, Vocabulary and Writing Skills. Focus on sentence structure, error correction, and formal writing.`),
        speechTa: cleanTextForSpeech(`தலைப்பு 4: இலக்கணம் மற்றும் எழுத்துப் பயிற்சி. வாக்கிய அமைப்பு, பிழை திருத்தம் மற்றும் கடிதம் எழுதும் முறைகள்.`),
      }
    ];

    const short2Mark = [
      `1. What does the bird do with the worm in Emily Dickinson's poem?`,
      `2. What is the Green Belt Movement founded by Wangari Maathai?`,
      `3. Who are the main protagonists in the documentary 'Elephant Whisperers'?`,
      `4. Correct the error: "Neither the teacher nor the students was present."`,
    ];

    const medium5Mark = [
      `1. Discuss the imagery and themes in Emily Dickinson's poem 'A Bird, came down the Walk'.`,
      `2. Summarize Wangari Maathai's Nobel acceptance speech on environment and democracy.`,
      `3. Write a short film review of 'The Elephant Whisperers' highlighting human-wildlife bond.`,
    ];

    const long10Mark = [
      `1. Write a detailed essay on how Wangari Maathai links environmental conservation with peace in her Nobel speech.`,
      `2. Discuss the themes of nature, humanity, and compassion across the prescribed Foundation English texts.`,
    ];

    const whatToLearn = [
      `• English Lesson 1: Dickinson's Poem - Imagery & Stanza Analysis`,
      `• English Lesson 2: Wangari Maathai's Nobel Speech - Environmental Peace`,
      `• English Lesson 3: The Elephant Whisperers - Wildlife Bond`,
      `• English Lesson 4: Grammar, Error Correction & Formal Writing`,
    ];

    const englishLessonScript = [
      cleanTextForSpeech(`Welcome to your Foundation English Course Book AI Tutor for ${cleanTitle}: ${cleanSub}.`),
      cleanTextForSpeech(`Topic 1: Poem A Bird came down the Walk by Emily Dickinson. Observe how the bird interacts with nature before flying away.`),
      cleanTextForSpeech(`Topic 2: Nobel Speech by Wangari Maathai. Learn how tree planting empowers communities and protects the planet.`),
      cleanTextForSpeech(`Topic 3: Oscar winning documentary The Elephant Whisperers by Kartiki Gonsalves. Understand Bomman and Bellie's love for Raghu the elephant.`),
      cleanTextForSpeech(`Topic 4: Master grammar rules, sentence construction, and error correction for top university marks!`),
    ];

    const tamilLessonScript = [
      cleanTextForSpeech(`வணக்கம்! ஃபவுண்டேஷன் ஆங்கில பாடப்புத்தகத்தின் ${cleanTitle}: ${cleanSub} பாடத்திற்கு உங்களை வரவேற்கிறேன்.`),
      cleanTextForSpeech(`தலைப்பு 1: எமிலி டிக்கின்சனின் கவிதை A Bird came down the Walk. பறவையின் அழகிய நடத்தையை விவரிக்கிறது.`),
      cleanTextForSpeech(`தலைப்பு 2: நோபல் பரிசு பெற்ற வங்காரி மாத்தாயின் சுற்றுச்சூழல் மற்றும் அமைதிக்கான உரை.`),
      cleanTextForSpeech(`தலைப்பு 3: ஆஸ்கார் விருது பெற்ற தி எலிபெண்ட் விஸ்பரர்ஸ் ஆவணப்படம். பொம்மன், பெள்ளி மற்றும் ரகு யானையின் அன்பு.`),
      cleanTextForSpeech(`தலைப்பு 4: ஆங்கில இலக்கணம், வாக்கிய பிழை திருத்தம் மற்றும் கடிதம் எழுதும் பயிற்சிகளை நன்கு படியுங்கள். வாழ்த்துகள்!`),
    ];

    return {
      isProjectMode: false,
      isEnglishMode: true,
      modeTitle: "📖 English Course Book Syllabus Mode",
      t1, t2, t3, t4, t5: "Grammar & Vocabulary",
      detailedTopicTheoryList,
      short2Mark, medium5Mark, long10Mark, whatToLearn,
      englishLessonScript, tamilLessonScript,
    };
  }

  // -------------------------------------------------------------------------
  // RULE 3: STANDARD CS SUBJECT WITH SYLLABUS AVAILABLE
  // -------------------------------------------------------------------------
  const rawTerms = effectiveSyllabus
    .split(/[:;\-,|.\n]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 3 && !/^(unit|sl|no|hrs|co\d*|module|chapter)$/i.test(t));

  const t1 = rawTerms[0] || `${subjectName} Fundamentals`;
  const t2 = rawTerms[1] || `${cleanSub} Core Principles`;
  const t3 = rawTerms[2] || `${cleanTitle} Execution & Syntax`;
  const t4 = rawTerms[3] || `${cleanSub} Methods & Algorithms`;
  const t5 = rawTerms[4] || `Real-World Application & Optimization`;

  const detailedTopicTheoryList = rawTerms.map((topicName, idx) => {
    return {
      id: idx + 1,
      title: topicName,
      theory: `Theoretical Explanation: "${topicName}" is a core syllabus topic under ${cleanTitle} of ${subjectName}. It defines the structural principles, memory layout, and operational rules in computer science. When preparing this topic, focus on: 1) Definition & core features. 2) System architecture & diagrams. 3) Code syntax and step-by-step algorithms.`,
      examImportance: `Exam Focus: High probability of 2-mark definitions and 5/10-mark diagram/code questions in ${subjectName}.`,
      speechEn: cleanTextForSpeech(`Topic ${idx + 1}: ${topicName}. In ${subjectName}, ${topicName} provides core principles and memory rules. Master its definition, diagram, and code syntax.`),
      speechTa: cleanTextForSpeech(`தலைப்பு ${idx + 1}: ${topicName}. ${subjectName}-ல் ${topicName} என்பது மிக முக்கிய பாடத் தலைப்பாகும். இதன் வரையறை, வரைபடங்களை தெளிவாகப் படியுங்கள்.`),
    };
  });

  const short2Mark = [
    `1. Define ${t1} and state its primary role in ${subjectName}.`,
    `2. What are the key features and characteristics of ${t2}?`,
    `3. Differentiate clearly between ${t1} and ${t3}.`,
    `4. State two main advantages and limitations of using ${t4}.`,
  ];

  const medium5Mark = [
    `1. Explain ${t1} and ${t2} in detail with neat diagrams and code examples.`,
    `2. Discuss the step-by-step algorithm and workflow execution for ${t3}.`,
    `3. Write a concise note on ${t4} including syntax, parameters, and return values.`,
  ];

  const long10Mark = [
    `1. Explain ${t1} and ${t4} in detail. Draw neat block diagrams and provide complete program code with line-by-line explanations.`,
    `2. Comprehensive Question: Analyze the system architecture, operational steps, and performance trade-offs of ${t2} and ${t3} in ${subjectName}.`,
  ];

  const whatToLearn = [
    `• Lesson 1: Core Definition & Theoretical Purpose of ${t1}`,
    `• Lesson 2: Execution Rules & Working Principles of ${t2}`,
    `• Lesson 3: Algorithms, Block Diagrams & Code Syntax for ${t3}`,
    `• Lesson 4: Performance Comparisons & Optimization for ${t4}`,
  ];

  const englishLessonScript = [
    cleanTextForSpeech(`Welcome to your AI Tutor for ${subjectName}, ${cleanTitle}: ${cleanSub}. Today, I will teach you the complete theoretical breakdown of every topic under this syllabus.`),
    cleanTextForSpeech(`Topic 1: ${t1}. In theoretical terms, ${t1} forms the core foundation. You must understand its definition, variable rules, and memory allocation.`),
    cleanTextForSpeech(`Topic 2: ${t2}. This topic explains execution flow, algorithm steps, and operational principles.`),
    cleanTextForSpeech(`Topic 3: ${t3} and ${t4}. These topics require learning code syntax, block diagrams, and comparison tables for 5-mark and 10-mark exam answers.`),
    cleanTextForSpeech(`Summary: Review each syllabus topic's definition, practice drawing clean diagrams, and memorize syntax rules for top marks.`),
  ];

  const tamilLessonScript = [
    cleanTextForSpeech(`வணக்கம்! ${subjectName} பாடத்தின் ${cleanTitle}: ${cleanSub} பாடத்திட்டத்தில் உள்ள அனைத்து தலைப்புகளையும் தியரி விளக்கத்துடன் கற்றுத்தரப் போகிறேன்.`),
    cleanTextForSpeech(`தலைப்பு 1: முதலில் ${t1} பற்றிப் பார்ப்போம். தியரி ரீதியாக ${t1} என்பது மிக முக்கிய அடித்தளமாகும். இதன் வரையறை, விதிகள் மற்றும் நினைவக அமைப்பு பற்றி தெளிவாகப் புரிந்து கொள்ள வேண்டும்.`),
    cleanTextForSpeech(`தலைப்பு 2: அடுத்து ${t2}. இதில் நிரல் கட்டுப்பாடு, செயல்படும் வழிமுறைகள் மற்றும் தரவு செயலாக்கம் எவ்வாறு இயங்குகிறது என்பதை விரிவாகப் படிக்க வேண்டும்.`),
    cleanTextForSpeech(`தலைப்பு 3: ${t3} மற்றும் ${t4} தலைப்புகளில் உள்ள கோட்பாடுகள், வரைபடங்கள் மற்றும் ஒப்பீட்டு அட்டவணைகளைப் பயிற்சி செய்யுங்கள். இவை தேர்வுக்கு மிகவும் முக்கியம்.`),
    cleanTextForSpeech(`சுருக்கம்: ${cleanTitle}-ல் அதிக மதிப்பெண்கள் பெற அனைத்து தலைப்புகளின் தியரி கருத்துகளையும் வரைபடங்களையும் நன்கு பயிற்சி செய்யுங்கள். தேர்வுக்கு வாழ்த்துகள்!`),
  ];

  return {
    isProjectMode: false,
    isEnglishMode: false,
    modeTitle: "📚 Syllabus Revision Mode",
    t1, t2, t3, t4, t5,
    detailedTopicTheoryList,
    short2Mark, medium5Mark, long10Mark, whatToLearn,
    englishLessonScript, tamilLessonScript,
  };
}

// Animated Waveform Equalizer
function AudioEqualizer({ isPlaying }) {
  return (
    <div className="flex items-center justify-center gap-1.5 h-10 px-4 py-2 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-teal-500/30">
      {[0.4, 0.9, 0.6, 1.0, 0.5, 0.8, 0.3, 0.7, 0.9, 0.4].map((heightScale, i) => (
        <motion.div
          key={i}
          animate={{
            height: isPlaying ? [`${heightScale * 8}px`, `${heightScale * 28}px`, `${heightScale * 10}px`] : "6px",
          }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 0.4 + (i % 4) * 0.15,
            ease: "easeInOut",
          }}
          className="w-1.5 rounded-full bg-gradient-to-t from-teal-400 via-amber-300 to-rose-400"
        />
      ))}
    </div>
  );
}

export default function AudioPodcastPlayerModal({ unitData, subjectName, onClose }) {
  if (!unitData) return null;

  const rawUnitTitle = unitData.title || "Unit Overview";
  const spokenUnitTitle = cleanTextForSpeech(rawUnitTitle);
  const unitSubtitle = unitData.subtitle || "Quick Revision Podcast";
  const syllabusText = unitData.syllabus || "Core Computer Science concepts, key definitions, and exam takeaways.";

  // Analyze Syllabus for Dynamic Questions & Learning Topics
  const analysis = analyzeSyllabusForUnit(rawUnitTitle, unitSubtitle, syllabusText, subjectName);

  const [activeTab, setActiveTab] = useState("theory"); // "theory" | "audio" | "questions" | "learn"
  const [language, setLanguage] = useState("ta"); // Default "ta" (Tamil Tutor) or "en" (English Tutor)

  // Select Active Script based on Language Selection
  const currentScript = language === "ta" ? analysis.tamilLessonScript : analysis.englishLessonScript;

  // Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(0.9); // 0.9 rate for maximum speech clarity
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  const synthRef = useRef(window.speechSynthesis || null);

  // Load Speech Voices (Automatically Finds Tamil ta-IN & Clear English Voices)
  useEffect(() => {
    if (!synthRef.current) return;

    const updateVoices = () => {
      const available = synthRef.current.getVoices();
      setVoices(available);

      if (language === "ta") {
        // Find Tamil Voice (ta-IN, ta-LK, Google தமிழ், Microsoft Valluvar)
        const tamilVoice =
          available.find((v) => v.lang.startsWith("ta") || v.name.includes("Tamil") || v.name.includes("தமிழ்")) ||
          available.find((v) => v.lang.includes("IN") && (v.name.includes("Google") || v.name.includes("Natural"))) ||
          available.find((v) => v.lang.startsWith("en"));
        setSelectedVoice(tamilVoice);
      } else {
        // Find High-Clarity English Voice
        const englishVoices = available.filter((v) => v.lang.startsWith("en"));
        const preferred =
          englishVoices.find((v) => v.name.includes("Google") || v.name.includes("Natural")) ||
          englishVoices.find((v) => v.name.includes("Zira") || v.name.includes("Jenny") || v.name.includes("Aria") || v.name.includes("David") || v.name.includes("Samantha")) ||
          englishVoices[0] ||
          available[0];
        setSelectedVoice(preferred);
      }
    };

    updateVoices();
    if (synthRef.current.onvoiceschanged !== undefined) {
      synthRef.current.onvoiceschanged = updateVoices;
    }
  }, [language]);

  // Handle Play/Pause
  const handlePlayPause = () => {
    if (!synthRef.current) {
      toast.error("Speech Synthesis is not supported in this browser");
      return;
    }

    if (isPlaying) {
      synthRef.current.pause();
      setIsPlaying(false);
    } else {
      if (synthRef.current.paused) {
        synthRef.current.resume();
        setIsPlaying(true);
      } else {
        startSpeech(currentParagraph);
      }
    }
  };

  const startSpeech = (paraIndex, customTextArr = null) => {
    if (!synthRef.current) return;

    synthRef.current.cancel();

    const scriptToUse = customTextArr || currentScript;
    const textToSpeak = scriptToUse.slice(paraIndex).join(" ");
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang || (language === "ta" ? "ta-IN" : "en-US");
    } else {
      utterance.lang = language === "ta" ? "ta-IN" : "en-US";
    }

    utterance.rate = playbackRate; // Articulate speed for clear understanding
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      setIsPlaying(true);
      setCurrentParagraph(paraIndex);
    };

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = (e) => {
      console.warn("Utterance error:", e);
      setIsPlaying(false);
    };

    synthRef.current.speak(utterance);
  };

  // Speed Toggle
  const toggleSpeed = () => {
    const rates = [0.9, 1.0, 1.25, 1.5];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    const newRate = rates[nextIdx];
    setPlaybackRate(newRate);
    toast.success(`Speech speed set to ${newRate}x`);

    if (isPlaying) {
      startSpeech(currentParagraph);
    }
  };

  // Close & Clean Up Speech
  const handleClose = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsPlaying(false);
    onClose();
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[999999] flex items-start justify-center bg-slate-950/90 backdrop-blur-xl pt-24 sm:pt-28 pb-8 px-3 sm:px-6 text-left overflow-y-auto"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.92, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.92, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="flex w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-slate-900 border-2 border-teal-500/40 shadow-2xl text-white my-auto max-h-[calc(100vh-8rem)]"
        >
          {/* Header Bar with Language Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gradient-to-r from-[#0D9488] via-[#0F766E] to-[#115E59] px-5 sm:px-6 py-4 border-b border-teal-500/30 shrink-0 gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-slate-950 font-black text-xl shadow-lg">
                🎙️
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase font-mono shadow-sm ${
                    analysis.isProjectMode ? "bg-amber-400 text-slate-950" : analysis.isEnglishMode ? "bg-cyan-300 text-slate-950" : "bg-teal-400 text-slate-950"
                  }`}>
                    {analysis.modeTitle}
                  </span>
                  <span className="text-xs text-teal-200 font-bold truncate">{subjectName}</span>
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-white truncate mt-0.5 font-mono">
                  {spokenUnitTitle}: {unitSubtitle}
                </h3>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-teal-400/20">
              <div className="flex items-center bg-slate-950/90 rounded-xl p-1 border border-amber-400/50 font-mono text-xs shadow-md">
                <button
                  onClick={() => {
                    setLanguage("ta");
                    toast.success("தமிழ் / Tanglish Theory Tutor Enabled");
                    if (isPlaying) synthRef.current?.cancel();
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    language === "ta"
                      ? "bg-amber-400 text-slate-950 shadow-md scale-105"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  🇮🇳 தமிழ்
                </button>
                <button
                  onClick={() => {
                    setLanguage("en");
                    toast.success("English Theory Tutor Enabled");
                    if (isPlaying) synthRef.current?.cancel();
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    language === "en"
                      ? "bg-teal-500 text-white shadow-md scale-105"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  🌐 English
                </button>
              </div>

              <button
                onClick={handleClose}
                className="rounded-full bg-slate-950/60 p-2 text-white/80 hover:bg-rose-600 hover:text-white transition-all shrink-0 cursor-pointer border border-white/20"
                title="Close AI Podcast"
              >
                <FiX size={18} />
              </button>
            </div>
          </div>

          {/* Equalizer Waveform & Visual Player Card */}
          <div className="p-4 sm:p-5 bg-gradient-to-b from-slate-900 via-teal-950/30 to-slate-900 flex flex-col shrink-0 gap-3 border-b border-teal-500/20">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-slate-800/80 border border-teal-500/30 p-3.5 shadow-inner">
              <div className="space-y-1 text-center sm:text-left">
                <p className="text-xs font-bold text-teal-300 font-mono flex items-center gap-1.5 justify-center sm:justify-start">
                  <FiZap className="text-amber-400" size={14} /> Syllabus Theory Tutor ({spokenUnitTitle})
                </p>
                <p className="text-xs text-slate-300 leading-relaxed max-w-md">
                  {language === "ta"
                    ? `அலகு பாடத்திட்டத்தில் உள்ள அனைத்து தலைப்புகளையும் தியரி விளக்கத்துடன் கற்றுத் தருகிறது.`
                    : `Comprehensive theory explanation for every topic under ${spokenUnitTitle} syllabus.`}
                </p>
                {voices.length > 0 && (
                  <div className="flex items-center gap-2 pt-1 justify-center sm:justify-start">
                    <FiVolume2 size={13} className="text-amber-400" />
                    <select
                      value={selectedVoice?.name || ""}
                      onChange={(e) => {
                        const chosen = voices.find((v) => v.name === e.target.value);
                        if (chosen) {
                          setSelectedVoice(chosen);
                          toast.success(`Voice set to ${chosen.name.split(" ")[0]}`);
                          if (isPlaying) startSpeech(currentParagraph);
                        }
                      }}
                      className="bg-slate-950 text-amber-300 text-[11px] font-mono font-bold px-2 py-1 rounded-lg border border-teal-500/40 outline-none focus:border-amber-400 max-w-[150px] truncate cursor-pointer"
                    >
                      {voices.map((v) => (
                        <option key={v.name} value={v.name}>
                          {v.name.replace(/Microsoft|Google|English|Desktop/g, "").trim()} ({v.lang})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <AudioEqualizer isPlaying={isPlaying} />
            </div>

            {/* Interactive Tabs Header (3 Clear Tabs) */}
            <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1">
              <button
                onClick={() => setActiveTab("theory")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black font-mono transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "theory"
                    ? "bg-amber-400 text-slate-950 shadow-md border border-amber-300 scale-105"
                    : "bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white"
                }`}
              >
                <FiBook size={14} /> {language === "ta" ? "பாடத்திட்ட தியரி" : "Syllabus Theory"}
              </button>

              <button
                onClick={() => setActiveTab("audio")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black font-mono transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "audio"
                    ? "bg-teal-500 text-white shadow-md border border-teal-400 scale-105"
                    : "bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white"
                }`}
              >
                <FiBookOpen size={14} /> {language === "ta" ? "ஒலிப் பாடம்" : "Full Voice Lesson"}
              </button>

              <button
                onClick={() => setActiveTab("questions")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black font-mono transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "questions"
                    ? "bg-rose-500 text-white shadow-md border border-rose-400 scale-105"
                    : "bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white"
                }`}
              >
                <FiHelpCircle size={14} /> {language === "ta" ? "முக்கிய வினாக்கள்" : "Exam Questions"}
              </button>
            </div>
          </div>

          {/* Scrollable Tab Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 text-xs font-mono space-y-4">
            {/* Tab 1: Topic-by-Topic Theory */}
            {activeTab === "theory" && (
              <div className="space-y-3">
                {analysis.detailedTopicTheoryList.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-slate-800/90 border border-teal-500/30 p-4 space-y-2 hover:border-amber-400/40 transition-all shadow-md"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap border-b border-slate-700/60 pb-2">
                      <h4 className="text-xs font-black text-amber-300 flex items-center gap-2">
                        <span className="bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-md font-extrabold text-[10px]">
                          Topic {item.id}
                        </span>
                        <span className="text-white font-bold">{item.title}</span>
                      </h4>
                      <button
                        onClick={() => {
                          const speechText = language === "ta" ? item.speechTa : item.speechEn;
                          if (synthRef.current) {
                            synthRef.current.cancel();
                            const u = new SpeechSynthesisUtterance(speechText);
                            if (selectedVoice) u.voice = selectedVoice;
                            u.lang = selectedVoice?.lang || (language === "ta" ? "ta-IN" : "en-US");
                            u.rate = playbackRate;
                            synthRef.current.speak(u);
                            setIsPlaying(true);
                            toast.success(`Playing Topic ${item.id} theory`);
                          }
                        }}
                        className="flex items-center gap-1 bg-teal-500/30 hover:bg-teal-500 text-teal-100 hover:text-slate-950 px-3 py-1 rounded-lg text-[10px] font-bold border border-teal-400/50 transition-all cursor-pointer"
                      >
                        <FiVolume2 size={12} /> Listen Topic
                      </button>
                    </div>

                    <p className="text-white text-xs leading-relaxed font-medium pt-1">
                      {item.theory}
                    </p>

                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-amber-400/30 text-[11px] text-amber-200 font-bold flex items-center gap-2">
                      <FiAward className="text-amber-400 shrink-0" size={14} />
                      <span>{item.examImportance}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 2: Full Voice Lesson (High-Contrast White Text) */}
            {activeTab === "audio" && (
              <div className="space-y-3">
                <p className="text-xs text-amber-300 font-extrabold flex items-center gap-1.5 font-mono">
                  <FiZap className="text-amber-400" size={14} />
                  {language === "ta"
                    ? `தமிழ் அனிமேஷன் பாடம் — எந்த பத்தியையும் அழுத்தவும்:`
                    : `Full Theoretical Voice Lesson — High-Contrast Pure White Text:`}
                </p>
                {currentScript.map((para, idx) => (
                  <div
                    key={idx}
                    onClick={() => startSpeech(idx)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      currentParagraph === idx && isPlaying
                        ? "bg-slate-900 border-2 border-amber-400 ring-2 ring-amber-400/60 text-white font-black shadow-xl scale-[1.01]"
                        : "bg-slate-800/90 border-slate-700 text-white hover:bg-slate-800 hover:border-amber-400/40"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`text-[11px] font-black px-2.5 py-1 rounded-md shrink-0 font-mono shadow-md ${
                        currentParagraph === idx && isPlaying
                          ? "bg-amber-400 text-slate-950"
                          : "bg-teal-400 text-slate-950"
                      }`}>
                        Step {idx + 1}
                      </span>
                      <p className="text-sm font-extrabold leading-relaxed text-white tracking-wide">
                        {para}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 3: Exam Questions (NO Audio Option, Pure White Text) */}
            {activeTab === "questions" && (
              <div className="space-y-4 font-mono text-xs">
                <div className="bg-slate-950 p-4 rounded-2xl border-2 border-teal-400/60 text-white shadow-md">
                  <span className="font-black text-amber-300 uppercase text-xs tracking-wider block">
                    {analysis.isProjectMode ? "🎯 Project Viva & Lab Exam Question Bank" : `🎯 University Exam Question Bank (${spokenUnitTitle})`}
                  </span>
                  <p className="text-xs text-white font-bold mt-1">
                    {analysis.isProjectMode
                      ? "Curated viva questions covering React 19, Tailwind CSS, Framer Motion & Portal Options."
                      : `Targeted 2-Mark, 5-Mark, and 10-Mark university exam questions derived from syllabus.`}
                  </p>
                </div>

                {/* 2-Mark Questions */}
                <div className="rounded-2xl bg-slate-800/90 p-4 border border-teal-400/40 space-y-3 shadow-md">
                  <div className="flex items-center justify-between border-b border-teal-400/30 pb-2">
                    <span className="bg-teal-400 text-slate-950 font-black text-xs px-3 py-1 rounded-md uppercase tracking-wider">
                      2-Mark Short Answer Questions
                    </span>
                    <span className="text-xs text-teal-300 font-extrabold">
                      Short Definitions
                    </span>
                  </div>
                  <ul className="space-y-2.5 pt-1">
                    {analysis.short2Mark.map((q, idx) => (
                      <li key={idx} className="leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-700 flex items-start justify-between gap-3 hover:border-teal-400 transition-all font-bold text-xs text-white">
                        <span className="text-white font-bold">{q}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(q);
                            toast.success("Question copied to clipboard!");
                          }}
                          className="text-xs bg-amber-400 hover:bg-amber-300 text-slate-950 px-3 py-1 rounded-lg font-black transition-all cursor-pointer shrink-0 shadow-md"
                          title="Copy Question"
                        >
                          Copy
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 5-Mark Questions */}
                <div className="rounded-2xl bg-slate-800/90 p-4 border border-amber-400/40 space-y-3 shadow-md">
                  <div className="flex items-center justify-between border-b border-amber-400/30 pb-2">
                    <span className="bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-md uppercase tracking-wider">
                      5-Mark Medium / Diagram Questions
                    </span>
                    <span className="text-xs text-amber-300 font-extrabold">
                      Code &amp; Diagrams
                    </span>
                  </div>
                  <ul className="space-y-2.5 pt-1">
                    {analysis.medium5Mark.map((q, idx) => (
                      <li key={idx} className="leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-700 flex items-start justify-between gap-3 hover:border-amber-400 transition-all font-bold text-xs text-white">
                        <span className="text-white font-bold">{q}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(q);
                            toast.success("Question copied to clipboard!");
                          }}
                          className="text-xs bg-amber-400 hover:bg-amber-300 text-slate-950 px-3 py-1 rounded-lg font-black transition-all cursor-pointer shrink-0 shadow-md"
                          title="Copy Question"
                        >
                          Copy
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 10-Mark Questions */}
                <div className="rounded-2xl bg-slate-800/90 p-4 border border-rose-400/40 space-y-3 shadow-md">
                  <div className="flex items-center justify-between border-b border-rose-400/30 pb-2">
                    <span className="bg-rose-500 text-white font-black text-xs px-3 py-1 rounded-md uppercase tracking-wider">
                      10-Mark Long Essay Questions
                    </span>
                    <span className="text-xs text-rose-300 font-extrabold">
                      Full System Workflow
                    </span>
                  </div>
                  <ul className="space-y-2.5 pt-1">
                    {analysis.long10Mark.map((q, idx) => (
                      <li key={idx} className="leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-700 flex items-start justify-between gap-3 hover:border-rose-400 transition-all font-bold text-xs text-white">
                        <span className="text-white font-bold">{q}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(q);
                            toast.success("Question copied to clipboard!");
                          }}
                          className="text-xs bg-amber-400 hover:bg-amber-300 text-slate-950 px-3 py-1 rounded-lg font-black transition-all cursor-pointer shrink-0 shadow-md"
                          title="Copy Question"
                        >
                          Copy
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Bottom Main Audio Control Bar (High-Contrast White Controls) */}
          <div className="sticky bottom-0 bg-slate-950 px-5 sm:px-6 py-4 border-t-2 border-amber-400/40 shrink-0 z-30 flex items-center justify-between gap-3 shadow-2xl">
            <button
              onClick={toggleSpeed}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono font-black text-xs border border-white/40 cursor-pointer transition-all active:scale-95 shrink-0 shadow-md"
              title="Change Playback Speed"
            >
              <FiSliders size={14} className="text-amber-400" />
              <span className="text-white font-black">{playbackRate}x Speed</span>
            </button>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => startSpeech(Math.max(0, currentParagraph - 1))}
                className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white cursor-pointer transition-all shrink-0 border border-white/30"
                title="Rewind Previous Lesson Section"
              >
                <FiRotateCcw size={18} />
              </button>

              <button
                onClick={handlePlayPause}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 via-amber-300 to-teal-400 text-slate-950 font-black shadow-2xl hover:scale-105 transition-all cursor-pointer active:scale-95 shrink-0 border-2 border-white"
                title={isPlaying ? "Pause Lesson" : "Play Lesson"}
              >
                {isPlaying ? <FiPause size={24} /> : <FiPlay size={24} className="ml-1" />}
              </button>

              <button
                onClick={() => startSpeech(Math.min(currentScript.length - 1, currentParagraph + 1))}
                className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white cursor-pointer transition-all shrink-0 border border-white/30"
                title="Skip Next Lesson Section"
              >
                <FiRotateCw size={18} />
              </button>
            </div>

            <div className="text-right shrink-0">
              <span className={`text-xs font-mono font-black px-3.5 py-2 rounded-xl border-2 shadow-lg flex items-center gap-2 ${
                isPlaying
                  ? "bg-emerald-600 text-white border-white ring-2 ring-emerald-400"
                  : "bg-amber-400 text-slate-950 border-amber-300"
              }`}>
                <span className={`h-2.5 w-2.5 rounded-full ${isPlaying ? "bg-white animate-ping" : "bg-slate-950"}`} />
                <span className="font-black">
                  {language === "ta" ? "🇮🇳 தமிழ் Tutor" : "🌐 English Tutor"} {isPlaying ? "(Speaking)" : "(Ready)"}
                </span>
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
