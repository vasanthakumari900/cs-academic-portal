# CS Academic Portal — Real Website Tour Video Documentation

This directory contains the real browser screen recording automation system for the **CS Academic Portal** web application built using **Playwright** and **Chromium**.

## Directory Structure

```
website-tour/
├── demo.config.js          # Demo credentials and recording configuration
├── record-tour.js          # Playwright real browser automation recorder
├── README.md               # Documentation & usage instructions
└── output/                 # Recorded browser video outputs (.webm / .mp4)
    └── website-tour-final.mp4
```

## How It Works

1. The script launches an actual Chromium browser instance using Playwright.
2. It opens the running website (`http://localhost:5173`).
3. It performs a complete, continuous screen-recorded demonstration across all key portal sections:
   - **Landing Page & Hero Features**
   - **Student Authentication** (Demo Roll No `24E3006`, DOB `15/08/2004`)
   - **Student Dashboard**
   - **E-Content & DGVC Video Lectures** (Plays actual videos)
   - **Lecture Notes PDF Repository**
   - **End-Semester Question Papers**
   - **CIA Question Papers** (3rd Year → Semester 5 → CIA 1 → Subject Paper)
   - **Placement Details & Campus Recruitment Drives**
   - **Global Search (`Ctrl + K`)**
   - **Faculty Portal Workflow & Content Upload Suite**
   - **Logout & Conclusion**
4. Playwright records the browser screen directly into `output/website-tour-final.mp4`.

## Running the Recording Automation

1. Ensure the development server is running:
   ```bash
   npm run dev
   ```
2. Run the Playwright tour recorder:
   ```bash
   node website-tour/record-tour.js
   ```
3. The recorded video file will be generated in `website-tour/output/website-tour-final.mp4`.
