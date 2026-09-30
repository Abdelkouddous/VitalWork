# VitalWork & CarePulse Production Screen Gallery

This directory contains high-fidelity 1440×900 desktop screen captures across all user roles, workflows, and administrative consoles for **VitalWork Connect** (HealthTech Recruitment SaaS) and **CarePulse** (Clinical Appointment Management Platform).

---

## 🏥 VitalWork Connect — Core Platform Suite

| # | Screen / View | Role / Scope | Primary Artifact | Architectural & Functional Description |
|---|---|---|---|---|
| **01** | **Landing Hero & Wilaya Search** | Public / Guest | [`01_Landing_Hero_Search.png`](./01_Landing_Hero_Search.png) | High-conversion medical recruitment landing interface featuring real-time Wilaya (Algerian provinces) and clinical specialization filtering with zero-layout-shift glassmorphic inputs. |
| **02** | **Algerian Clinical Ecosystem** | Public / Guest | [`02_Landing_Medical_Network.png`](./02_Landing_Medical_Network.png) | Public platform metrics, active hospital network statistics, and value propositions for private clinics and public hospital departments. |
| **03** | **Auth Wizard & 1-Click Seeds** | Public / Auth | [`03_Auth_Wizard_and_Demo_Access.png`](./03_Auth_Wizard_and_Demo_Access.png) | 3-Role authentication gateway (`doctor`, `recruiter`, `admin`) with automated one-click test seed injection bypassing manual form friction for evaluators. |
| **04** | **Doctor / Seeker Command Center** | Doctor / Candidate | [`04_Doctor_JobSeeker_Dashboard.png`](./04_Doctor_JobSeeker_Dashboard.png) | Telemetry hub showing real-time profile completion, application velocity, and automated compatibility scoring (e.g. 27% match telemetry). |
| **05** | **Job Discovery & LinkedIn Modal** | Doctor / Candidate | [`05_Job_Search_and_LinkedIn_Modal.png`](./05_Job_Search_and_LinkedIn_Modal.png) | Dual-pane exploration board with LinkedIn-style detailed job drawer rendering salary in integer DZD, requirements, and immediate submission hooks. |
| **06** | **Hospital Recruiter Dashboard** | Hospital / HR | [`06_Hospital_Recruiter_Dashboard.png`](./06_Hospital_Recruiter_Dashboard.png) | Clinical hiring workspace tracking active vacancies, applicant velocity, pending interviews, and candidate response SLAs. |
| **07** | **Medical Vacancy Wizard** | Hospital / HR | [`07_Post_Medical_Job_Wizard.png`](./07_Post_Medical_Job_Wizard.png) | Multi-step vacancy builder enforcing integer cents/centimes salary bands, shift classifications (on-call/garde vs regular), and credential validation. |
| **08** | **Applicant Kanban Pipeline** | Hospital / HR | [`08_Applicant_Management_Kanban.png`](./08_Applicant_Management_Kanban.png) | Candidate stage-gate workflow (Screening, Interviewing, Shortlisted, Hired) with algorithmic doctor qualification scoring. |
| **09** | **CEO & Admin Command Center** | SuperAdmin / CEO | [`09_CEO_Admin_Command_Center.png`](./09_CEO_Admin_Command_Center.png) | Executive platform oversight featuring "Today's Platform Pulse", aggregate MRR/ARR, clinical user registrations, and platform health telemetry. |
| **10** | **Regional Placement Telemetry** | SuperAdmin / CEO | [`10_Platform_Analytics_and_Telemetry.png`](./10_Platform_Analytics_and_Telemetry.png) | Geographic distribution charts mapping medical staffing deficits across Algerian wilayas and recruitment conversion rates. |
| **11** | **Monetization & Tier Engine** | SuperAdmin / CEO | [`11_Subscription_Monetization_Engine.png`](./11_Subscription_Monetization_Engine.png) | SaaS tier management (Free, Pro, Enterprise) displaying DZD pricing, feature entitlement flags, and hospital billing cycles. |
| **12** | **Hospital Moderation & Registry** | SuperAdmin / CEO | [`12_Hospital_Recruiter_Management.png`](./12_Hospital_Recruiter_Management.png) | Institutional compliance console for verifying clinic licenses, approving recruitment credentials, and auditing recruiter activity. |

---

## 🩺 CarePulse — Clinical Appointments Portal

The screenshots in [`carepulse/`](./carepulse/) capture the patient journey and appointment scheduling flow on port 3000:

| # | Screen / View | Role / Scope | Primary Artifact | Architectural & Functional Description |
|---|---|---|---|---|
| **01** | **CarePulse Landing** | Patient / Public | [`carepulse/01_CarePulse_Home_Landing.png`](./carepulse/01_CarePulse_Home_Landing.png) | Direct appointment booking interface with doctor directory and specialty filters. |
| **02** | **Network & Services** | Patient / Public | [`carepulse/02_CarePulse_About_Network.png`](./carepulse/02_CarePulse_About_Network.png) | Clinical service breakdown, accreditation details, and provider listings. |
| **03** | **Patient SMS Authentication** | Patient / Auth | [`carepulse/03_CarePulse_Patient_SignIn.png`](./carepulse/03_CarePulse_Patient_SignIn.png) | Two-factor passwordless authentication gateway with phone number verification and demo profiles. |
| **04** | **OTP Verification Modal** | Patient / Auth | [`carepulse/04_CarePulse_OTP_Verification.png`](./carepulse/04_CarePulse_OTP_Verification.png) | Secure 6-digit one-time passcode confirmation modal for session cryptographic token acquisition. |
| **05** | **Patient Appointments Hub** | Patient / Auth | [`carepulse/05_CarePulse_Patient_Dashboard.png`](./carepulse/05_CarePulse_Patient_Dashboard.png) | Real-time consultation history, upcoming appointment confirmations, and prescription access. |

---

## 🎨 Asset Standards
- **Viewport Resolution**: 1440 × 900 px (Desktop 16:10 standard)
- **Format**: Lossless Portable Network Graphics (`.png`)
- **Theme**: Dark Mode & Accessible Clinical Palette (WCAG AAA contrast compliant)
