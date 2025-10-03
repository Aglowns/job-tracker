# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-01

### Added

#### Core Features
- **Email Auto-capture**: Automatically parse job application confirmation emails
  - Greenhouse support
  - Lever support
  - Workday support
  - Generic fallback parser for other systems
- **PWA Support**: Progressive Web App with Web Share Target
  - Install on mobile devices
  - Share job postings directly to the tracker
  - Offline capability with service worker
- **Bookmarklet**: One-click capture from any job posting page
- **Follow-up System**: Automatic reminders at +7d and +14d
- **Status Tracking**: Track application status from Applied to Offer/Rejected
- **Deduplication**: Intelligent duplicate detection

#### API Endpoints
- `POST /webhooks/gmail` - Process Gmail emails
- `POST /webhooks/outlook` - Process Outlook emails
- `POST /capture/shared` - Capture shared content
- `POST /applications` - Create application
- `GET /applications` - List applications
- `GET /applications/:id` - Get application details
- `PATCH /applications/:id` - Update application
- `POST /followups/sweep` - Trigger follow-up sweep

#### Web Pages
- `/` - Application list page
- `/applications/:id` - Application detail page
- `/capture` - Manual capture form
- `/bookmarklet` - Bookmarklet setup page

#### Database Schema
- `applications` table with full tracking
- `followups` table for reminders
- `users` table for multi-user support (stub)
- `audit_logs` table for observability

#### Email Connectors
- Gmail read-only integration
- Outlook/Microsoft Graph integration
- Polling-based message retrieval

#### Testing
- Unit tests for parsers
- API route tests with Supertest
- E2E tests with Playwright
- Test fixtures for common ATS systems

#### Documentation
- README.md with full feature list
- SETUP.md with detailed setup guide
- DEPLOYMENT.md with deployment options
- CONTRIBUTING.md with contribution guidelines
- QUICKSTART.md for fast setup

### Technical Details

#### Stack
- **Backend**: Node.js 18+, TypeScript, Express
- **Database**: PostgreSQL 14+, Prisma ORM
- **Frontend**: Next.js 14 App Router, React Server Components
- **Styling**: TailwindCSS
- **Testing**: Vitest, Supertest, Playwright
- **Scheduling**: node-cron

#### Parsers
- Dictionary-first approach for known ATS systems
- Confidence scoring (0-1 scale)
- Automatic marking for manual review when confidence < 0.6
- Regex-based extraction with fallback heuristics

#### Security
- Zod validation for all inputs
- Read-only email access
- No full email storage (only message IDs)
- Dedupe keys for data integrity

### Known Limitations

- Email integration requires OAuth setup
- Follow-ups logged to console only (no email/SMS in MVP)
- Single-user mode (multi-user support is stubbed)
- Polling-based email retrieval (can upgrade to push notifications)

### Future Roadmap

- [ ] Email/SMS notifications for follow-ups
- [ ] Multi-user authentication
- [ ] CSV export functionality
- [ ] Browser extension
- [ ] Mobile apps (React Native)
- [ ] Integration with more ATS systems
- [ ] Real-time push notifications from email providers
- [ ] Advanced analytics and insights
- [ ] Interview preparation features
- [ ] Salary tracking and negotiation tools

---

## Release Notes

This is the initial MVP release of the Job Application Tracker. The focus has been on:

1. **Reliability**: Robust parsing with fallback mechanisms
2. **Testability**: Comprehensive test coverage
3. **Clarity**: Clean code architecture and documentation

The system is production-ready for personal use or small teams. Email integration requires OAuth credentials from Google/Microsoft.

For setup instructions, see SETUP.md or QUICKSTART.md.
For deployment guide, see DEPLOYMENT.md.
For API documentation and examples, see README.md.

Thank you for using Job Tracker! 🚀

