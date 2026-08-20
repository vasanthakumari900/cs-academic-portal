// website-tour/demo.config.js
// Configuration for automated real browser tour recording of CS Academic Portal

export const DEMO_CONFIG = {
  // Target website URL
  baseUrl: "http://localhost:5173",

  // Demo Student Credentials
  DEMO_STUDENT_ROLLNO: "24E3006",
  DEMO_STUDENT_DOB: "15/08/2004",

  // Demo Faculty Credentials
  DEMO_FACULTY_NAME: "Faculty User",
  DEMO_FACULTY_PASSWORD: "password123",

  // Recording Settings
  recording: {
    width: 1920,
    height: 1080,
    fps: 30,
    outputDir: "./website-tour/output",
    rawFilename: "website-tour-raw.webm",
    finalFilename: "website-tour-final.mp4",
  },

  // Timing pauses (in ms) for smooth demonstration cursor movements
  timings: {
    pagePause: 2500,
    clickPause: 1200,
    scrollStep: 400,
    typeDelay: 80,
  },
};

export default DEMO_CONFIG;
