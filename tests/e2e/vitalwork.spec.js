import { test, expect } from "@playwright/test";

test.describe("VitalWork E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page before each test
    await page.goto("/");
  });

  test.describe("Landing Page", () => {
    test("should display landing page correctly", async ({ page }) => {
      // Check if main elements are visible
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator("header").locator("text=VitalWork")).toBeVisible();

      // Check navigation links
      await expect(page.locator('header a[href*="jobs"]').first()).toBeVisible();
      await expect(page.locator('header a[href*="login"]').first()).toBeVisible();
      await expect(page.locator('header a[href*="register"]').first()).toBeVisible();
    });

    test("should navigate to job listings", async ({ page }) => {
      await page.click('header a[href*="jobs"]');
      await expect(page).toHaveURL(/.*jobs/);
      await expect(page.locator("text=Find Your Dream Job")).toBeVisible();
    });
  });

  test.describe("Authentication Flow", () => {
    test("should complete employer registration flow", async ({ page }) => {
      // Navigate directly to employer registration
      await page.goto("/register?role=employer");

      // Fill registration form
      const uniqueId = Date.now();
      await page.fill('input[name="name"]', "Dr. Test Employer");
      await page.fill('input[name="lastName"]', "Smith");
      await page.fill('input[name="email"]', `employer_${uniqueId}@vitalwork.dz`);
      await page.fill('input[name="password"]', "password123");
      await page.fill('input[name="confirmPassword"]', "password123");
      await page.fill('input[name="location"]', "Algiers");

      // Submit form
      await page.click('button[type="submit"]');

      // Wait for redirect to confirm-account page
      await page.waitForURL(/.*confirm-account.*/, { timeout: 15000 });
      const url = page.url();
      const otpMatch = url.match(/[?&]otp=(\d{6})/);
      if (otpMatch) {
        const otp = otpMatch[1];
        const inputs = page.locator('input[type="text"]');
        for (let i = 0; i < 6; i++) {
          await inputs.nth(i).fill(otp[i]);
        }
        await page.click('button[type="submit"]');
      }

      // Check redirect to dashboard
      await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });
    });

    test("should complete employer login flow", async ({ page }) => {
      // Navigate directly to employer login
      await page.goto("/login");

      // Fill login form using pre-seeded recruiter credentials
      await page.fill('input[name="email"]', "employer2@vitalwork.dz");
      await page.fill('input[name="password"]', "password123");

      // Submit form
      await page.click('button[type="submit"]');

      // Check for successful login (redirect to dashboard)
      await expect(page).toHaveURL(/.*dashboard/);
    });

    test("should complete Healthcare Professional registration flow", async ({ page }) => {
      // Navigate directly to Healthcare Professional registration
      await page.goto("/job-seekers/register");

      // Fill registration form
      const uniqueId = Date.now();
      await page.fill('input[name="name"]', "Dr. Test JobSeeker");
      await page.fill('input[name="lastName"]', "Johnson");
      await page.fill('input[name="email"]', `seeker_${uniqueId}@vitalwork.dz`);
      await page.fill('input[name="password"]', "password123");
      await page.selectOption('select[name="location"]', "Oran");
      await page.fill('input[name="phoneNumber"]', "555555555");

      // Submit form
      await page.click('button[type="submit"]');

      // Wait for redirect to confirm-account page
      await page.waitForURL(/.*confirm-account.*/, { timeout: 15000 });
      const url = page.url();
      const otpMatch = url.match(/[?&]otp=(\d{6})/);
      if (otpMatch) {
        const otp = otpMatch[1];
        const inputs = page.locator('input[type="text"]');
        for (let i = 0; i < 6; i++) {
          await inputs.nth(i).fill(otp[i]);
        }
        await page.click('button[type="submit"]');
      }

      // Dev OTP auto-verification should redirect to /job-seekers/login
      await expect(page).toHaveURL(/.*job-seekers\/login/, { timeout: 15000 });
    });
  });

  test.describe("Job Management", () => {
    test.beforeEach(async ({ page }) => {
      // Login as employer before each job management test
      await page.goto("/login");
      await page.fill('input[name="email"]', "employer2@vitalwork.dz");
      await page.fill('input[name="password"]', "password123");
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*dashboard/);
    });

    test("should create a new job posting", async ({ page }) => {
      // Navigate to add job page
      await page.click('a:has-text("add job")');
      await expect(page).toHaveURL(/\/dashboard$/);

      // Fill job form
      await page.fill('input[name="position"]', "Senior Cardiologist");
      await page.fill('input[name="company"]', "Heart Hospital");
      await page.selectOption('select[name="jobLocation"]', "Algiers");
      await page.selectOption('select[name="jobType"]', "full-time");
      await page.selectOption('select[name="specialization"]', "Cardiologist");
      await page.fill('input[name="notes"]', "Looking for an experienced cardiologist...");

      // Submit form
      await page.click('button[type="submit"]');

      // Check for success message
      await expect(page.locator("text=Job added successfully")).toBeVisible();
    });

    test("should edit an existing job", async ({ page }) => {
      // Navigate to my-jobs list
      await page.goto("/dashboard/my-jobs");

      // Click edit button on first job
      await page.click('a:has-text("Edit")');
      await expect(page).toHaveURL(/.*edit-job/);

      // Update job details
      await page.fill(
        'input[name="position"]',
        "Senior Cardiologist - Updated"
      );
      await page.fill('input[name="notes"]', "Updated notes");

      // Submit form
      await page.click('button[type="submit"]');

      // Check for success message
      await expect(page.locator("text=Job updated successfully")).toBeVisible();
    });

    test("should delete a job", async ({ page }) => {
      // Navigate to my-jobs list
      await page.goto("/dashboard/my-jobs");

      // Click delete button on first job
      await page.click('button:has-text("Delete")');

      // Check for success message
      await expect(page.locator("text=Job Deleted")).toBeVisible();
    });
  });

  test.describe("Job Search and Application", () => {
    test("should search for jobs", async ({ page }) => {
      // Navigate to jobs page
      await page.goto("/jobs");

      // Use search functionality by typing in keywords
      await page.fill('input[placeholder*="Search jobs by position"]', "cardiologist");

      // Check if results are filtered (look for a glass-card)
      await expect(page.locator(".glass-card").first()).toBeVisible();
    });

    test("should apply for a job as Healthcare Professional", async ({ page }) => {
      // Login as Healthcare Professional using a stable seeded account
      await page.goto("/job-seekers/login");
      await page.fill('input[name="email"]', "seeker2@vitalwork.dz");
      await page.fill('input[name="password"]', "password123");
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*job-seekers.*dashboard/);

      // Navigate to jobs
      await page.goto("/job-seekers/jobs");

      // Click apply button on first job
      await page.click('button:has-text("Apply Now")');

      // Check for success or already applied toast message
      await expect(
        page.locator("text=Application sent successfully!").or(page.locator("text=You have already applied to this job offer"))
      ).toBeVisible();
    });
  });

  test.describe("Responsive Design", () => {
    test("should work on mobile devices", async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Check if mobile navigation works
      await page.click('button[aria-label="Toggle navigation menu"]');
      // The login link inside the mobile menu should become visible
      await expect(page.locator("nav a[href*=\"login\"]").last()).toBeVisible();

      // Check if main content is visible
      await expect(page.locator("h1")).toBeVisible();
    });

    test("should work on tablet devices", async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });

      // Check if layout adapts properly
      await expect(page.locator("header")).toBeVisible();
      await expect(page.locator("h1")).toBeVisible();
    });
  });

  test.describe("Error Handling", () => {
    test("should handle invalid login credentials", async ({ page }) => {
      await page.goto("/login");
      await page.fill('input[name="email"]', "invalid@example.com");
      await page.fill('input[name="password"]', "wrongpassword");
      await page.click('button[type="submit"]');

      // Check for error message
      await expect(page.locator("text=Invalid credentials")).toBeVisible();
    });

    test("should handle network errors gracefully", async ({ page }) => {
      // Simulate network failure
      await page.route("**/api/**", (route) => route.abort());

      await page.goto("/jobs");

      // Check if error message is displayed
      await expect(page.locator("text=Failed to load jobs").first()).toBeVisible();
    });
  });
});

