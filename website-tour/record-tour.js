// website-tour/record-tour.js
// Automated real browser screen recorder using Playwright
import { chromium } from "playwright";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import DEMO_CONFIG from "./demo.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function recordTour() {
  console.log("🚀 Starting CS Academic Portal Real Browser Tour Recorder...");

  const outputDir = path.resolve(__dirname, "./output");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Launch Playwright Chromium browser
  const browser = await chromium.launch({
    headless: true, // Run headless for clean background recording
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: outputDir,
      size: { width: 1920, height: 1080 },
    },
  });

  const page = await context.newPage();
  const baseUrl = DEMO_CONFIG.baseUrl;

  // Helper for smooth mouse movements and clicking
  async function smoothClick(selector, label = "") {
    try {
      console.log(`  👉 Clicking: ${label || selector}`);
      const element = page.locator(selector).first();
      await element.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      const box = await element.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 10 });
      }
      await element.click();
      await page.waitForTimeout(DEMO_CONFIG.timings.clickPause);
    } catch (err) {
      console.warn(`    ⚠️ Warning clicking ${selector}: ${err.message}`);
    }
  }

  async function smoothScroll(distance = 500) {
    await page.evaluate((d) => window.scrollBy({ top: d, behavior: "smooth" }), distance);
    await page.waitForTimeout(1000);
  }

  try {
    // ----------------------------------------------------
    // STEP 1: INTRO / LANDING PAGE
    // ----------------------------------------------------
    console.log("\n🎬 STEP 1: Opening Real CS Academic Portal Landing Page...");
    await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
    await page.waitForTimeout(DEMO_CONFIG.timings.pagePause);

    // Scroll through Hero & Features
    await smoothScroll(400);
    await smoothScroll(500);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
    await page.waitForTimeout(1500);

    // ----------------------------------------------------
    // STEP 2: STUDENT LOGIN FLOW
    // ----------------------------------------------------
    console.log("\n🔑 STEP 2: Navigating to Login Page & Logging in as Demo Student...");
    await page.goto(`${baseUrl}/login`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);

    // Fill Student Roll Number & DOB
    const rollInput = page.locator('input[placeholder*="24E2901"]').first();
    await rollInput.fill(DEMO_CONFIG.DEMO_STUDENT_ROLLNO);
    await page.waitForTimeout(500);

    const dobInput = page.locator('input[placeholder*="DD/MM/YYYY"]').first();
    await dobInput.fill(DEMO_CONFIG.DEMO_STUDENT_DOB);
    await page.waitForTimeout(500);

    // Extract real captcha code from page state/element if present
    const captchaBox = page.getByTestId('captcha-box');
    if (await captchaBox.isVisible()) {
      const captchaVal = (await captchaBox.textContent()).replace(/[^0-9]/g, "").trim();
      console.log(`    Extracted live Captcha code: ${captchaVal}`);
      const captchaInput = page.locator('input[placeholder*="5-digit"], input[placeholder*="code"]').first();
      await captchaInput.fill(captchaVal);
    }

    await page.waitForTimeout(1000);
    await smoothClick('button:has-text("Access Student Portal")', "Submit Student Login");
    await page.waitForTimeout(3000);

    // ----------------------------------------------------
    // STEP 3: STUDENT DASHBOARD
    // ----------------------------------------------------
    console.log("\n📊 STEP 3: Demonstrating Real Student Dashboard...");
    await page.goto(`${baseUrl}/student/dashboard`, { waitUntil: "networkidle" });
    await page.waitForTimeout(DEMO_CONFIG.timings.pagePause);
    await smoothScroll(400);
    await smoothScroll(400);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
    await page.waitForTimeout(1500);

    // ----------------------------------------------------
    // STEP 4: E-CONTENT / VIDEO SECTION
    // ----------------------------------------------------
    console.log("\n🎬 STEP 4: Demonstrating E-Content & Video Lectures Page...");
    await page.goto(`${baseUrl}/e-content`, { waitUntil: "networkidle" });
    await page.waitForTimeout(DEMO_CONFIG.timings.pagePause);

    // Click "DGVC VIDEOS" or "UG"
    const dgvcCard = page.locator('h2:has-text("DGVC VIDEOS")').first();
    if (await dgvcCard.isVisible()) {
      await dgvcCard.click();
      await page.waitForTimeout(2500);
      await smoothScroll(500);
      
      // Click first video card play button
      const playBtn = page.locator('.aspect-video').first();
      if (await playBtn.isVisible()) {
        await playBtn.click();
        await page.waitForTimeout(4000); // Watch real video play for 4s
        
        // Close modal if open
        const closeBtn = page.locator('button:has(.lucide-x), button:has-text("Close"), .fixed button').first();
        if (await closeBtn.isVisible()) {
          await closeBtn.click();
        }
      }
    }

    // ----------------------------------------------------
    // STEP 5: LECTURE NOTES (PDF HUB)
    // ----------------------------------------------------
    console.log("\n📄 STEP 5: Demonstrating Lecture Notes & PDF Document Viewer...");
    await page.goto(`${baseUrl}/notes`, { waitUntil: "networkidle" });
    await page.waitForTimeout(DEMO_CONFIG.timings.pagePause);
    await smoothScroll(400);
    await smoothScroll(400);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
    await page.waitForTimeout(1500);

    // ----------------------------------------------------
    // STEP 6: END-SEM QUESTION PAPERS
    // ----------------------------------------------------
    console.log("\n📝 STEP 6: Demonstrating End-Semester Question Papers...");
    await page.goto(`${baseUrl}/question-papers`, { waitUntil: "networkidle" });
    await page.waitForTimeout(DEMO_CONFIG.timings.pagePause);
    await smoothScroll(400);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
    await page.waitForTimeout(1500);

    // ----------------------------------------------------
    // STEP 7: CIA QUESTION PAPERS
    // ----------------------------------------------------
    console.log("\n📝 STEP 7: Demonstrating CIA Question Papers Hierarchy...");
    await page.goto(`${baseUrl}/cia-question-papers`, { waitUntil: "networkidle" });
    await page.waitForTimeout(DEMO_CONFIG.timings.pagePause);
    await smoothScroll(400);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
    await page.waitForTimeout(1500);

    // ----------------------------------------------------
    // STEP 8: PLACEMENT DETAILS & DRIVES
    // ----------------------------------------------------
    console.log("\n💼 STEP 8: Demonstrating Placement Hub & Campus Drives...");
    await page.goto(`${baseUrl}/placements`, { waitUntil: "networkidle" });
    await page.waitForTimeout(DEMO_CONFIG.timings.pagePause);
    await smoothScroll(500);
    await smoothScroll(500);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
    await page.waitForTimeout(1500);

    // ----------------------------------------------------
    // STEP 9: GLOBAL SEARCH
    // ----------------------------------------------------
    console.log("\n🔍 STEP 9: Demonstrating Global Search...");
    await page.goto(`${baseUrl}/search`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill("Operating System");
      await page.waitForTimeout(2000);
      await smoothScroll(300);
    }

    // ----------------------------------------------------
    // STEP 10: FACULTY DEMONSTRATION WORKFLOW
    // ----------------------------------------------------
    console.log("\n👩‍🏫 STEP 10: Demonstrating Faculty Portal Workflow...");
    await page.goto(`${baseUrl}/login`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);

    // Switch to Faculty Tab
    const facultyTab = page.locator('button:has-text("Faculty Login")').first();
    if (await facultyTab.isVisible()) {
      await facultyTab.click();
      await page.waitForTimeout(1000);

      const nameInput = page.locator('input[placeholder*="Faculty"]').first();
      await nameInput.fill(DEMO_CONFIG.DEMO_FACULTY_NAME);
      await page.waitForTimeout(500);

      const passInput = page.locator('input[type="password"]').first();
      await passInput.fill(DEMO_CONFIG.DEMO_FACULTY_PASSWORD);
      await page.waitForTimeout(500);

      const captchaBox = page.getByTestId('captcha-box');
      if (await captchaBox.isVisible()) {
        const captchaVal = (await captchaBox.textContent()).replace(/[^0-9]/g, "").trim();
        const captchaInput = page.locator('input[placeholder*="5-digit"], input[placeholder*="code"]').first();
        await captchaInput.fill(captchaVal);
      }

      await page.waitForTimeout(1000);
      await smoothClick('button:has-text("Access Faculty Portal")', "Submit Faculty Login");
      await page.waitForTimeout(3000);

      // Demonstrate Faculty Upload Pages
      await page.goto(`${baseUrl}/faculty/notes`, { waitUntil: "networkidle" });
      await page.waitForTimeout(2000);
      await page.goto(`${baseUrl}/faculty/videos`, { waitUntil: "networkidle" });
      await page.waitForTimeout(2000);
    }

    // ----------------------------------------------------
    // STEP 11: CONCLUSION / LOGOUT
    // ----------------------------------------------------
    console.log("\n🏁 STEP 11: Finishing Tour & Returning to Login Page...");
    await page.goto(`${baseUrl}/login`, { waitUntil: "networkidle" });
    await page.waitForTimeout(3000);

    console.log("\n✅ Real Browser Tour Recording Successfully Completed!");
  } catch (error) {
    console.error("\n❌ Recording Error:", error);
  } finally {
    const videoPath = await page.video()?.path();
    await page.close();
    await context.close();
    await browser.close();

    if (videoPath && fs.existsSync(videoPath)) {
      const finalMp4Path = path.resolve(outputDir, "website-tour-final.mp4");
      fs.copyFileSync(videoPath, finalMp4Path);
      console.log(`\n🎉 Recorded Real Website Tour Video saved to:\n   ${finalMp4Path}`);
    }
  }
}

recordTour();
