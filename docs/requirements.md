# VitalWork - Requirements

## 1. Project Context

VitalWork is a recruitment platform created exclusively for healthcare professionals & medical/paramedical & pharmacy students. The application is designed to connect Healthcare Professionals with private healthcare employers and recruiters in hospitals, clinics, medical centers, and specialized care facilities.

The platform must remain strictly focused on healthcare recruitment, with no general job board features. All functionality should support the hiring lifecycle for doctors, nurses, allied health professionals, and other clinical staff.

## 2. Client and Stakeholder

- **Primary client:** Healthcare recruitment manager / clinic HR lead
- **Target users:** HCPs, Students seeking for internships or summer experience, healthcare employers, recruiters, and platform administrators
- **Client objective:** provide a secure, specialized hiring environment for healthcare staffing, with fast candidate matching and efficient employer workflows.

## 3. Business Requirements

### 3.1 Core client needs

- Recruit only students & healthcare professionals, including doctors, nurses, therapists, pharmacists, and clinical support staff.
- Provide a streamlined candidate experience for healthcare Healthcare Professionals.
- Enable employers to post roles with medical specializations, certifications, and shift requirements.
- Maintain a secure system for sensitive candidate and employer data.
- Support clear negotiation and validation of candidate applications.

### 3.2 Detailed requirements

- **Healthcare-only job board:** only medical professions, clinical roles, and allied health positions.
- **Role-based access:** separate tracks for Healthcare Professionals, recruiters, and healthcare employers.
- **Advanced jobs & internships search:** include job main target: Students (Internship), HCPs (doctors, pharmacists, nurses, biologists & paramedicals)
- **Advanced job posting:** Should look like gigs similiar to virtual recruitement platforms, include department, specialty, license requirements, shift type, and contract details.
- **Candidate profiles:** professional biography, medical credentials, experience, certifications, CV uploads, and availability.
- **Smart matching:** match candidates to roles based on specialization, experience, location, and schedule.
- **Application workflow:** allow candidates to apply, employers to review, comment, and decide within one system.
- **Notifications:** email alerts for new matches, application updates, interview invitations, and offer status.
- **Reporting:** provide employer metrics for applications received, time-to-fill, and candidate pipeline status.

## 4. Negotiations and Client Agreements

### 4.1 Prioritized scope

- **High priority:** job posting, candidate profiles, application management, employer review workflow.
- **Medium priority:** smart role matching, notification automation, application status tracking.
- **Lower priority:** multi-language support, third-party sourcing integrations, advanced analytics.

### 4.2 Client decisions

- The MVP must focus on healthcare recruitment workflows, not general staffing or clinic operations.
- Candidate messaging and interview scheduling can be limited in the first release, with richer features added later.
- SMS notifications are optional for a later phase; email notifications are sufficient for MVP.
- A mobile app will be created if the project makes success and a good amount of clients.

### 4.3 Agreed constraints

- The platform will target medical professions only, with strict taxonomy and job categories limited to healthcare roles.
- Candidate and employer data confidentiality is required, but document management may be handled through a secure external storage provider, and will be removed automatically 24 hours after review.
- Real-time chat is deferred; application status updates are handled through platform notifications and emails.

## 5. Functional Scope

- Clinic onboarding and role creation
- HCPs or Student registration and profile management
- Job search with healthcare specialization filters
- Application submission and progress tracking
- Clinic review, shortlisting, and hiring decisions
- Notification management for HCPs and clinics
- Dashboard views for application pipeline and job performance

## 6. Architecture Overview

- **Frontend:** React with Vite
- **Backend:** Laravel
- **Database:** PostgreSQL
- **Authentication:** JWT
- **File storage:** Cloudinary (for CVs and certifications)
- **Uploads: Not defined yet**

## 7. Development Roadmap

### Phase 1: Core recruitment MVP

- Job postings for healthcare roles
- HCPs or Student profiles and CV upload
- Application flow and clinic review
- Basic notifications and dashboard metrics

### Phase 2: Matching and workflow improvements

- Smart HCP-job matching
- Application status tracking and clinic notes
- Enhanced search filters and saved searches

### Phase 3: Growth and optimization

- Employer reporting and analytics
- Additional notification channels
- Security hardening and performance improvements

## 8. Annexes

This Markdown version is the primary recruitment requirements document.

## 9. Release v1.2.0 Architecture & UX Specifications

- **REQ-UX-01 (Domain Purity):** Zero tolerance for non-medical or generic software engineering copy on public landing, marketing, and registration pages. All copy must exclusively reflect clinical hospital domains across Algeria's 58 Wilayas.
- **REQ-AUTH-01 (Wizard Slider Progression):** Registration and Login must employ progressive disclosure wizard slider patterns rather than monolithic single-page forms.
  - Registration: 3-step slider (Identity -> Clinical Jurisdiction/Specialty -> Security Credentials & Review).
  - Login: Interactive role-switcher tabs (Clinic, Doctor, Admin) + 2-step slider.
- **REQ-AUTH-02 (Evaluation Sandbox):** Provide 1-click demo account template auto-fill for Admin, Clinic, and Healthcare Professional roles on both landing page and authentication wizard.
- **REQ-OTP-01 (Persistent OTP Display):** Verification codes in sandbox/development must be presented in a persistent, accessible label container with 1-click auto-fill instead of ephemeral snackbar toasts that auto-dismiss.
- **REQ-DASH-01 (Clinical KPI Metrics):** Primary `/dashboard` index route for employers must render an Executive Clinic Dashboard featuring 6 clinical KPIs (Active Roles, Applicants, Interviews, Time-to-Fill, Match Score, Roster Coverage), recruitment funnel, and candidate feed.
- **REQ-OPS-01 (Production Build Pipeline):** Root application must provide standard `npm run build` and `npm start` commands ensuring automated PaaS deployments (Render / AWS) compile client assets and serve SPA routes without blocking maintenance stubs.

