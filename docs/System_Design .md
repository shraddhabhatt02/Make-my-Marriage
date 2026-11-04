# MAKE MY MARRIAGE
# SYSTEM ARCHITECTURE DOCUMENT

**Document Version:** 1.3  
**Document Status:** Final Architecture Baseline — Ready for Freeze  
**Supersedes:** System Design Architecture Document v1.2  
**Product:** Make My Marriage (MMM)  
**Platform:** Responsive Web Application  
**Primary Market:** India  
**Default Currency:** INR (₹)  
**Default Timezone:** Asia/Kolkata  
**Guest-Facing Languages:** English and Hindi  
**Organiser Dashboard Language:** English  
**Architecture Style:** Single-Repository Modular Monolith  
**Requirements Authority:** Make My Marriage MVP Product Requirements Document v1.1

---

# Document Control

## 1. Purpose

This document defines the technical architecture for implementing Make My Marriage (MMM).

It translates the approved product requirements into an implementation-oriented architecture covering:

- System architecture and technology stack.
- Application layers and module boundaries.
- Organiser authentication and authorisation.
- Wedding membership and role management.
- Event and task management.
- Household invitations and RSVP workflows.
- Expense and payment processing.
- Vendor management and discovery.
- Wedding website and multilingual content.
- Gallery, photo moderation and QR workflows.
- Public YouTube livestream integration.
- Data integrity and lifecycle rules.
- External integrations.
- Security and privacy.
- Deployment and infrastructure.
- Background processing and failure recovery.
- Monitoring, testing and release readiness.

This document is intended to guide implementation and technical decisions.

## 2. Document Authority

The following authority hierarchy applies:

1. **PRD v1.1:** Authoritative source for product scope, business rules, user behaviour, permissions and MVP requirements.
2. **System Architecture Document v1.3:** Defines how those requirements are implemented technically.
3. **Database Design Document:** Will define detailed collections, field types, indexes, validators and database-level implementation.
4. **API Design Document:** Will define endpoint contracts, request/response structures and error codes.
5. **Implementation:** Must follow the approved documents.

If an implementation detail conflicts with a product requirement, the PRD takes precedence.

A developer must not independently change a product rule through code.

## 3. Confirmed Architecture Decisions

The following decisions are incorporated into this version.

| Area | Final decision |
|---|---|
| Product requirements | PRD v1.1 is the source of truth |
| Architecture | Modular monolith |
| Repository | Single repository |
| Frontend and backend | Next.js with TypeScript and Node.js server-side execution |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Hosting | Vercel |
| Authentication | Auth.js |
| Authentication methods | Email/password and Google |
| Email | Resend |
| Image storage | Cloudflare R2 |
| Vendor discovery | Google Places API (New) |
| Livestream | YouTube embed |
| Primary Admins | Bride and Groom, both protected Admins |
| Additional organiser roles | Admin and Manager |
| Active membership | One active wedding membership per user |
| Guest accounts | Not required |
| Guest OTP | Not required |
| Household invitation | One household link covering all assigned events |
| RSVP | Separate primary invitee attendance and additional attendee count |
| Currency | Whole Indian rupees, stored as integer rupees |
| Gallery-view QR | One wedding-wide QR |
| Guest-upload QR | One wedding-wide QR |
| Guest upload destination | Central pending-submission inbox |
| Photo assignment | Admin or Manager assigns approved photos to event albums |
| Gallery access | Anyone with the gallery link or QR can view published photographs |
| Photo publication | Organiser approval required |
| Livestream visibility | Public on the wedding website |
| Event deletion | Explicit confirmation, with historical and financial records preserved |
| Wedding archive | Not part of MVP |
| Automatic post-event expiry | Not part of MVP |

## 4. Decisions and Terminology

This document distinguishes three types of statements:

- **Product rule:** Behaviour explicitly established in PRD v1.1 or subsequently confirmed by the user.
- **Architecture rule:** Technical behaviour required to implement the product safely.
- **Implementation default:** A concrete technical choice used where the product requirements do not prescribe a value.

Implementation defaults may be adjusted during technical implementation if necessary, but changes must be documented and must not contradict the PRD.

---

# 1. Product and System Overview

## 1.1 Product Overview

Make My Marriage is a couple-focused wedding-planning web application.

It provides one central workspace for managing:

- Wedding details.
- Organisers and permissions.
- Multiple wedding events.
- Tasks and assignments.
- Household guest records.
- Event-specific invitations.
- Event-specific RSVPs.
- Expenses and multiple payments.
- Vendor records and discovery.
- Wedding website content.
- Event-based photo albums.
- Guest photo submissions.
- Public gallery access.
- YouTube livestream information.

The product is intended for couples managing their own wedding with help from family members and other organisers.

It is not a professional wedding-planner platform for managing multiple client weddings.

## 1.2 System Objectives

The system must:

1. Provide a reliable wedding workspace.
2. Protect both partners as permanent Primary Admins through normal organiser operations.
3. Support additional Admin and Manager organisers.
4. Enforce wedding-level data isolation.
5. Support household-based guest invitations.
6. Calculate event attendance correctly.
7. Maintain accurate expense and payment totals.
8. Publish only explicitly configured website content.
9. Provide controlled guest photo submission and moderation.
10. Allow public access to published gallery photographs through the gallery link.
11. Provide a public YouTube livestream section when configured.
12. Preserve financial and historical records when events are deleted.
13. Handle email and media failures without corrupting application data.
14. Remain maintainable as the product grows.

## 1.3 System Users

### Organisers

Authenticated users who manage a wedding workspace.

They include:

- Primary Bride.
- Primary Groom.
- Additional Admins.
- Managers.

### Guests

Unauthenticated visitors who use guest-facing links.

Guests may:

- View the wedding website.
- Open household invitation links.
- Submit event-specific RSVPs.
- View published gallery photographs.
- Submit photographs through the wedding-wide upload QR.
- Watch a publicly configured YouTube livestream.

Guests do not need application accounts or guest OTP verification.

---

# 2. Technology Stack

## 2.1 Approved Technology Stack

| Layer | Technology | Responsibility |
|---|---|---|
| Frontend framework | Next.js App Router | Organiser and guest-facing interfaces |
| Language | TypeScript | Application language |
| Runtime | Node.js | Server-side application execution |
| Styling | Tailwind CSS | Responsive styling |
| UI components | shadcn/ui | Reusable accessible components |
| Backend | Next.js server-side code | Business logic and application services |
| Authentication | Auth.js | Organiser authentication and sessions |
| Database | MongoDB Atlas | Persistent application data |
| ODM | Mongoose | Schemas, validation and database access |
| Hosting | Vercel | Application deployment |
| Email | Resend | Transactional email |
| Object storage | Cloudflare R2 | Photographs and image files |
| Vendor discovery | Google Places API (New) | External vendor discovery |
| Livestream | YouTube | Video hosting and playback |
| Source control | GitHub | Source code and version history |

The stack is approved and should not be replaced without an explicit architecture revision.

## 2.2 Dependency Management

- Use compatible versions of Next.js, Auth.js, Mongoose and related packages.
- Commit the dependency lockfile.
- Use strict TypeScript configuration.
- Avoid unnecessary packages that duplicate existing functionality.
- Review package security advisories.
- Test dependency upgrades before merging them into the main branch.

---

# 3. High-Level System Architecture

## 3.1 Architecture Style

MMM will use a **single-repository modular monolith**.

The frontend, backend application services, domain logic and integrations will reside in one repository and deploy as one application.

Microservices are not required for the MVP.

The modular monolith provides:

- Clear separation of business responsibilities.
- Shared TypeScript types.
- Simpler deployment.
- Easier debugging.
- Lower operational complexity.
- Centralised authentication and authorisation.
- Transactional operations within MongoDB.

Modules must communicate through defined application-service interfaces rather than directly manipulating another module's internal database implementation.

## 3.2 Logical Architecture

```text
                         USERS
                           |
             +-------------+-------------+
             |                           |
         Organisers                    Guests
             |                           |
             +-------------+-------------+
                           |
                      VERCEL
                           |
                    NEXT.JS APPLICATION
                           |
          +----------------+----------------+
          |                |                |
      Organiser UI      Guest UI         Public UI
          |                |                |
          +----------------+----------------+
                           |
                  ROUTE HANDLERS / ACTIONS
                           |
                AUTHENTICATION & GUARDS
                           |
                  APPLICATION SERVICES
                           |
        +------------------+------------------+
        |                  |                  |
    Domain Modules     Integration Layer   Background Jobs
        |                  |                  |
        +------------------+------------------+
                           |
        +------------------+------------------+
        |                  |                  |
   MongoDB Atlas       Cloudflare R2       External Providers
        |                  |                  |
        |                  |          +-------+--------+
        |                  |          |       |        |
        |                  |        Resend  Google   YouTube
        |                  |                Places
        |
    Application Data
```

## 3.3 Application Layers

### A. Presentation Layer

Responsible for:

- Organiser dashboard.
- Wedding setup screens.
- Event and task screens.
- Guest management.
- Expense and payment interfaces.
- Vendor screens.
- Website editor.
- Gallery management.
- Guest-facing pages.
- Responsive layouts.

The presentation layer must not be the only place where business rules are enforced.

### B. Route and API Layer

Responsible for:

- Receiving requests.
- Parsing parameters.
- Validating request payloads.
- Authenticating requests.
- Calling application services.
- Mapping application errors to HTTP responses.
- Returning safe response data.

Route handlers must not duplicate domain calculations.

### C. Application Service Layer

Responsible for orchestrating complete use cases.

Examples:

- CreateWeddingService.
- AcceptPrimaryInvitationService.
- InviteOrganiserService.
- DeleteEventService.
- SubmitRSVPService.
- RecordPaymentService.
- DeletePaymentService.
- PublishWebsiteService.
- SubmitGuestPhotoService.
- ApproveGuestPhotoService.
- DeleteWeddingService.

Application services coordinate transactions, permissions and side effects.

### D. Domain Layer

Contains the actual business rules.

Examples:

- Membership constraints.
- Primary Admin protection.
- Role permissions.
- RSVP capacity calculations.
- Expense and payment calculations.
- Event deletion dependency rules.
- Photo moderation transitions.
- QR token authorisation.
- Website publication rules.

### E. Data Access Layer

Responsible for:

- Mongoose models.
- Repository methods.
- Database queries.
- Transaction handling.
- Indexes.
- Data validation.
- Wedding-level query scoping.

### F. Integration Layer

Responsible for communicating with:

- Auth.js.
- Resend.
- Cloudflare R2.
- Google Places API (New).
- YouTube.

Provider-specific logic must be isolated behind adapters.

### G. Background Processing Layer

Responsible for:

- Email delivery and retries.
- Media cleanup.
- Upload reconciliation.
- Failed deletion retries.
- Scheduled housekeeping.
- Other asynchronous operations.

Security decisions must not depend on a background job executing on time.

---

# 4. Repository Structure

The following structure is recommended:

```text
make-my-marriage/
│
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (organiser)/
│   │   ├── (guest)/
│   │   ├── (public)/
│   │   └── api/
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── forms/
│   │   └── shared/
│   │
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── weddings/
│   │   ├── memberships/
│   │   ├── organisers/
│   │   ├── events/
│   │   ├── tasks/
│   │   ├── households/
│   │   ├── invitations/
│   │   ├── rsvp/
│   │   ├── expenses/
│   │   ├── payments/
│   │   ├── vendors/
│   │   ├── website/
│   │   ├── gallery/
│   │   ├── uploads/
│   │   ├── livestream/
│   │   ├── notifications/
│   │   └── audit/
│   │
│   ├── lib/
│   │   ├── auth/
│   │   ├── db/
│   │   ├── permissions/
│   │   ├── validation/
│   │   ├── errors/
│   │   ├── logging/
│   │   ├── security/
│   │   └── config/
│   │
│   ├── jobs/
│   ├── types/
│   └── middleware.ts
│
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── security/
│   └── e2e/
│
├── public/
├── scripts/
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

Each module should expose:

- Validated input types.
- Application-service functions.
- Domain rules.
- Repository interfaces or methods.
- Module-specific error types.
- Tests.

Avoid allowing route handlers to directly manipulate unrelated Mongoose models.

---

# 5. Core Domain and Ownership Model

## 5.1 Wedding as the Security Boundary

A Wedding is the primary ownership and security boundary.

Every wedding-owned record must contain a wedding reference or be reachable through a parent record whose wedding ownership is validated.

Examples:

- WeddingEvent.
- Task.
- Household.
- HouseholdInvitation.
- HouseholdEventInvitation.
- Expense.
- ExpensePayment.
- Vendor.
- WebsiteSettings.
- GalleryAlbum.
- GalleryPhoto.
- QRLink.
- LivestreamSettings.
- AuditLog.

Every service must validate that related records belong to the same wedding.

A client-supplied wedding ID must never be trusted without checking the authenticated user's active membership.

## 5.2 Core Entities

The architecture recognises the following logical entities:

| Entity | Responsibility |
|---|---|
| User | Organiser account |
| Account / Credential | Authentication identity |
| Wedding | Wedding workspace |
| WeddingMembership | Organiser access and role |
| OrganiserInvitation | Invitation to join workspace |
| WeddingEvent | Wedding event |
| Task | Planning task |
| Household | Guest invitation unit |
| HouseholdInvitationToken | Household-wide invitation link |
| HouseholdEventInvitation | Event-specific invitation and RSVP |
| Expense | Financial obligation |
| ExpensePayment | Individual payment |
| Vendor | Saved vendor information |
| WebsiteSettings | Public wedding website configuration |
| GalleryAlbum | Event-based photo album |
| GalleryPhoto | Photograph and moderation state |
| GalleryViewLink | Public gallery access |
| PhotoUploadLink | Guest upload authorisation |
| LivestreamSettings | YouTube configuration |
| EmailOutbox | Durable email processing |
| AuditLog | Important activity history |
| UploadIntent | Upload lifecycle and reconciliation |

Detailed fields, collection schemas, indexes and database validators belong in the separate Database Design Document.

## 5.3 Relationship Overview

```text
User
 |
 +---- WeddingMembership ---- Wedding
                                |
          +---------------------+----------------------+
          |          |          |          |            |
        Events     Tasks    Households   Expenses     Vendors
          |                    |           |
          |                    |        Payments
          |                    |
          |              Event Invitations
          |                    |
          |                   RSVP
          |
       Albums
          |
        Photos
          |
    Moderation / Publication

Wedding
 |
 +---- Website Settings
 |
 +---- Gallery View Link
 |
 +---- Photo Upload Link
 |
 +---- Livestream Settings
 |
 +---- Email Outbox
 |
 +---- Audit Logs
```

---

# 6. Authentication and Organiser Membership

## 6.1 Authentication Provider

Auth.js will manage organiser authentication.

Supported methods:

1. Email and password.
2. Google sign-in.

The system must support:

- Account registration.
- Email verification.
- Sign-in.
- Secure sign-out.
- Password recovery.
- Session validation.
- Protected organiser routes.

Email verification is required for both the email/password flow and the Google identity flow according to the application's account verification policy.

Password reset tokens and verification tokens must be random, single-use, time-limited and stored securely.

Passwords must never be stored in plaintext.

## 6.2 Account Identity

Use a canonical user account identity.

Email addresses must be normalised consistently before uniqueness checks.

The system must prevent duplicate verified email identities.

Authentication provider identities must be associated with the correct user account. Account linking must not allow an unverified email claim to take over an existing account.

## 6.3 Primary Admin Model

There are exactly two protected Primary Admin positions:

- PRIMARY_BRIDE.
- PRIMARY_GROOM.

Both have:

```text
role = ADMIN
membershipType = PRIMARY_BRIDE or PRIMARY_GROOM
status = ACTIVE
```

Primary Admin is a protected membership classification, not a third organiser role.

The system must ensure:

- One active Bride Primary Admin per wedding.
- One active Groom Primary Admin per wedding.
- Both primary positions are protected.
- Neither can be removed through normal organiser management.
- Neither can be demoted through normal organiser management.
- Additional Admins cannot replace a Primary Admin.
- Managers cannot manage organiser membership.

## 6.4 Wedding Creation Workflow

Only a Bride or Groom may create a wedding.

Workflow:

1. User signs in.
2. User selects Bride or Groom.
3. User enters wedding details.
4. User enters the other partner's name and email.
5. System validates the creator's eligibility.
6. System creates the Wedding.
7. System creates the creator's protected Primary Admin membership.
8. System creates a pending Primary Admin invitation for the other partner.
9. System creates initial settings.
10. System queues the partner invitation email.
11. Creator enters the wedding workspace.

The creator is not a separate organiser role.

The creator's membership is the corresponding protected Primary Admin membership.

## 6.5 Partner Invitation Acceptance

1. Partner receives an invitation email.
2. Partner signs in or registers.
3. Partner verifies the invited email identity.
4. Partner opens the invitation.
5. Server validates the invitation token and status.
6. Server verifies the Primary Groom/Bride position is still available.
7. Server checks the global active-membership constraint.
8. Partner accepts.
9. System creates the second protected Primary Admin membership.
10. System records acceptance in the audit log.

The creator may continue using the workspace while the partner invitation is pending.

The wedding setup status must not be confused with guest access or public website publication.

## 6.6 Additional Organiser Management

Additional organisers may be:

- Admin.
- Manager.

Additional Admins can manage additional organiser invitations and memberships.

Managers cannot:

- Invite organisers.
- Remove organisers.
- Promote or demote organisers.
- Change Primary Admin positions.

A removed organiser loses workspace access immediately.

Historical activity remains available to authorised workspace users.

Rejoining requires a new invitation and a new membership cycle.

## 6.7 One Active Wedding Membership

One organiser account may have only one active wedding membership globally.

Pending invitations do not count as active memberships.

The rule must be enforced:

- In the application service.
- Within the database transaction.
- Through a database-level unique partial index.

A user removed from a wedding may join another wedding through a new invitation.

An account is not deleted when a membership is removed.

## 6.8 Manual Primary Admin Recovery

If both Primary Admins lose access:

- Additional Admins cannot automatically take ownership.
- The user contacts support.
- Support performs manual ownership verification.
- Recovery requires an authorised operational process.
- Recovery actions are audited.
- Sensitive verification material must not appear in general logs.

Automated ownership transfer is outside the MVP.

---

# 7. Authorisation and Permission Architecture

## 7.1 Centralised Permission Service

All permissions must be enforced server-side.

Create a central permission service that receives:

- Authenticated user.
- Wedding membership.
- Requested action.
- Resource type.
- Resource ownership context.

It returns whether the action is permitted.

Do not implement separate inconsistent role checks across individual route handlers.

## 7.2 Permission Matrix

| Action | Primary Admin | Additional Admin | Manager |
|---|---:|---:|---:|
| View dashboard | Yes | Yes | Yes |
| Manage wedding details | Yes | Yes | Yes, within allowed fields |
| Create/edit events | Yes | Yes | Yes |
| Delete events | Yes | Yes | No |
| Create/edit tasks | Yes | Yes | Yes |
| Delete tasks | Yes | Yes | No |
| Manage households | Yes | Yes | Yes |
| Manage invitations | Yes | Yes | Yes |
| Manage RSVPs | Yes | Yes | Yes |
| Create/edit expenses | Yes | Yes | Yes |
| Create/edit payments | Yes | Yes | Yes |
| Delete expenses | Yes | Yes | No |
| Delete payments | Yes | Yes | No |
| Manage vendors | Yes | Yes | Yes |
| Delete vendors | Yes | Yes | No |
| Edit website | Yes | Yes | Yes |
| Manage albums | Yes | Yes | Yes |
| Approve/reject photo submissions | Yes | Yes | Yes |
| Permanently delete photos | Yes | Yes | No |
| Manage additional organisers | Yes | Yes | No |
| Delete wedding | Yes | Yes | No |
| Remove/demote Primary Admin | No | No | No |

A Primary Admin has Admin permissions plus protected membership constraints.

## 7.3 Permission Categories

Use explicit action permissions, for example:

```text
wedding.view
wedding.update
wedding.delete

event.create
event.update
event.delete

task.create
task.update
task.delete

household.create
household.update
invitation.manage
rsvp.manage

expense.create
expense.update
expense.delete

payment.create
payment.update
payment.delete

vendor.create
vendor.update
vendor.delete

website.update
website.publish

photo.upload
photo.approve
photo.reject
photo.delete

organiser.invite
organiser.update
organiser.remove
```

The permission service must also check protected membership classifications.

## 7.4 Authorisation Order

For every organiser request:

1. Validate authentication.
2. Resolve the active membership.
3. Resolve the wedding scope.
4. Confirm membership status is ACTIVE.
5. Confirm the resource belongs to that wedding.
6. Validate the requested action.
7. Validate role and membership restrictions.
8. Execute the application service.
9. Record an audit entry where required.

Never trust user ID, role, membership ID or wedding ID supplied in the request body.

---

# 8. Events and Tasks Architecture

## 8.1 Event Model

A wedding may contain multiple events.

Each event belongs to exactly one wedding.

Event information may include:

- Name.
- Description.
- Event date.
- Start and end time.
- Venue.
- Location.
- Website visibility.
- RSVP cutoff configuration.
- Status.

Store instants in UTC and preserve the wedding timezone for local display and event-date interpretation.

The default timezone is Asia/Kolkata.

## 8.2 Task Model

Tasks belong to a wedding and may optionally be associated with an event.

Tasks may include:

- Title.
- Description.
- Due date.
- Priority.
- Status.
- Assignee.
- Event reference.
- Creator and updater.

Task assignments must reference active organiser memberships.

A removed organiser must not retain active task access through an old assignment.

## 8.3 Event Deletion — Confirmed Behaviour

Event deletion requires:

- Admin permission.
- Explicit confirmation.
- Server-side dependency checks.
- An auditable deletion operation.

A Manager cannot delete an event.

### 8.3.1 Deletion Strategy

Use **logical deletion with a retained event record**, rather than immediate cascading deletion.

This is the architecture rule for preserving historical and financial records.

The event receives a deleted/tombstoned state and is removed from ordinary active event listings.

The record remains available internally for historical references and audit purposes.

### 8.3.2 Dependent Record Handling

| Dependent record | Behaviour after event deletion |
|---|---|
| Tasks | Retain task history; mark event association as deleted-event context. Do not silently erase completed work. |
| Household event invitations | Close the event invitation and prevent new RSVP submissions. Preserve invitation and response history. |
| RSVPs | Preserve submitted responses for historical reporting. Exclude deleted event from active attendance summaries. |
| Expenses | Preserve expense records and all payments. Retain the historical event reference or its tombstone reference. |
| Vendors | Preserve vendor records. No vendor record is deleted because an event is deleted. |
| Albums | Unpublish event albums and remove them from guest-facing event navigation. Preserve album records. |
| Photos | Preserve stored photo objects and moderation history. Do not automatically delete photographs. |
| Livestream | Disable the event livestream entry point on the website. Preserve configuration history. |
| Website content | Remove the deleted event from public event listings. |

### 8.3.3 Reassignment

If the product later supports reassignment of historical tasks, albums or expenses, reassignment must be an explicit organiser action.

The MVP must not automatically attach historical records to a different event.

### 8.3.4 Deletion Confirmation

Before deletion, the UI should explain:

- The event will no longer appear as an active event.
- New RSVP submissions for it will stop.
- Its invitation and RSVP history will be retained.
- Related expenses and payments will remain.
- Related albums will be unpublished.
- Stored photographs will not be automatically erased.

The server must recheck the event state and permission at confirmation time.

### 8.3.5 Audit

Record:

- Event ID.
- Wedding ID.
- Actor.
- Deletion timestamp.
- Reason, if provided.
- Dependency counts or safe summary.
- Result of the deletion operation.

The deletion operation must be idempotent.

---

# 9. Household, Invitation and RSVP Architecture

## 9.1 Household as the Guest Unit

A Household represents the invitation and RSVP unit.

It may contain:

- Household name.
- Primary invitee name.
- Contact email.
- Contact phone.
- Notes.
- Wedding reference.

Guests do not have application accounts.

Household access is not equivalent to a person-level authenticated account.

## 9.2 Household Invitation Link

One household invitation link covers all events assigned to that household.

The link must:

- Use a high-entropy random token.
- Store only a secure token hash.
- Be scoped to one wedding and one household.
- Be revocable.
- Be regenerable.
- Not expose another household's records.
- Never include personal information in the raw token.

No guest OTP or guest account is required.

There is no fixed guest session-duration requirement.

The system must not introduce the previous architecture's 12-hour guest session or 30-day household token expiry as product requirements.

## 9.3 Event-Specific Invitations

A household may be invited to multiple events.

Each household-event invitation independently stores:

- Event reference.
- Maximum party size.
- Invitation status.
- RSVP response status.
- Primary invitee attendance.
- Additional attendee count.
- RSVP cutoff, if configured.
- Response timestamp.

The household invitation link reveals only the events assigned to that household.

## 9.4 RSVP Data Model

RSVP response status:

```text
PENDING
RESPONDED
```

The response stores:

```text
primary_attending: boolean
additional_attendees: integer
```

Additional attendees are counts, not separate Guest records.

### Attendance Calculation

```text
Total Attendance =
(primary_attending ? 1 : 0)
+ additional_attendees
```

Capacity validation:

If the primary invitee attends:

```text
additional_attendees <= max_party_size - 1
```

If the primary invitee does not attend:

```text
additional_attendees <= max_party_size
```

Additional attendees may attend even when the primary invitee declines.

The server must validate all RSVP calculations.

## 9.5 RSVP Submission Workflow

1. Guest opens household invitation link.
2. Server validates the token.
3. Server resolves the household and assigned events.
4. Guest selects an assigned event.
5. Guest submits primary attendance and additional attendee count.
6. Server checks invitation status.
7. Server checks RSVP cutoff.
8. Server validates party-size constraints.
9. Server saves the response.
10. Server records the response timestamp.
11. Organiser dashboard summaries update.

Submitting an RSVP for one event must not change another event's response.

## 9.6 RSVP Integrity

The system must reject:

- Negative additional attendee counts.
- Non-integer attendee counts.
- Attendance above maximum party size.
- Requests for unassigned events.
- Requests for another household's invitation.
- RSVP updates after the applicable cutoff.

RSVP summaries must be calculated from the event invitation records.

---

# 10. Expense and Payment Architecture

## 10.1 Expense Model

An Expense represents one wedding-related financial obligation.

It may optionally reference:

- An event.
- A vendor.

It stores:

- Title.
- Category.
- Total amount.
- Expense date.
- Currency.
- Notes.
- Creator and updater.

An expense may exist without any payment records.

## 10.2 Currency Representation

The MVP uses INR.

All amounts must be represented as **whole Indian rupees**.

Store amounts as integer rupees, not floating-point values and not paise.

Examples:

| Display amount | Stored value |
|---|---:|
| ₹500 | 500 |
| ₹1,250 | 1250 |
| ₹25,000 | 25000 |

Reject:

- Zero or negative expense amounts where a positive amount is required.
- Decimal/fractional rupee amounts.
- Non-integer payment amounts.
- Values outside the configured safe numeric range.

The application must format displayed values consistently as INR.

## 10.3 Payment Model

One Expense may have zero or multiple ExpensePayment records.

Each payment contains:

- Expense reference.
- Amount in whole rupees.
- Payment date.
- Payment method.
- Optional reference.
- Optional notes.
- Recorder.
- Timestamps.

Supported payment methods:

```text
CASH
UPI
BANK_TRANSFER
CARD
OTHER
```

## 10.4 Financial Calculations

```text
Paid To Date =
Sum of valid payment records
```

```text
Outstanding =
Expense Total - Paid To Date
```

These values must not be independently editable.

They must be calculated on the server from valid payment records.

## 10.5 Financial Integrity Rules

1. Payment amount must be greater than zero.
2. Payment must belong to an existing expense.
3. Expense and payment must belong to the same wedding.
4. Cumulative payments cannot exceed the expense total.
5. Expense total cannot be reduced below paid-to-date.
6. Payment changes must recalculate financial totals.
7. All financial changes must be audited.
8. Managers may create and edit payment records.
9. Managers cannot delete payment records.
10. Admins may delete payment records according to the PRD.

## 10.6 Concurrency Handling

Payment creation and expense updates must use MongoDB transactions where supported.

A payment operation must:

1. Read the current expense.
2. Read valid payment totals.
3. Calculate current outstanding balance.
4. Validate the requested amount.
5. Write the payment.
6. Update any concurrency guard/version field.
7. Commit the transaction.

If a concurrent transaction changes the balance, the operation must retry or return a conflict after revalidation.

The UI balance is informational. The server's transaction is authoritative.

## 10.7 Payment Deletion and Corrections

Payment deletion is an Admin-only action under the PRD permission model.

Before deletion:

- Confirm the target payment belongs to the expense and wedding.
- Recalculate the financial totals.
- Record the actor and reason where supplied.
- Preserve an audit record of the deleted payment's relevant financial values.

A deletion must not leave the expense summary inconsistent.

## 10.8 Financial Dashboard

Dashboard totals:

```text
Total Expenses =
Sum of active expense totals
```

```text
Total Paid =
Sum of valid payment records
```

```text
Total Outstanding =
Total Expenses - Total Paid
```

If financial summaries are cached, invalidation must occur whenever an expense or payment changes.

---

# 11. Vendor Management and Discovery

## 11.1 Saved Vendors

Vendor records belong to one wedding.

Categories:

- Photographer.
- Videographer.
- Venue.
- Caterer.
- Decorator.
- DJ.
- Makeup Artist.
- Mehandi Artist.
- Pandit.
- Choreographer.
- Wedding Planner.
- Florist.
- Others.

Vendor records may include:

- Name.
- Category.
- Phone.
- Email.
- Location.
- Website.
- Notes.
- External provider reference.

Vendors are separate from expenses.

An expense may optionally reference a vendor.

## 11.2 Google Places API (New)

Google Places API (New) is used for vendor discovery.

The integration is informational.

It does not provide:

- Vendor verification.
- Vendor endorsement.
- Booking.
- Contract execution.
- Payment.
- Negotiation.
- Automated quotation comparison.

Manual vendor entry must remain available if Google Places is unavailable.

The application must comply with the current Google Maps Platform terms, pricing, attribution and data storage restrictions.

## 11.3 Integration Isolation

Create a vendor-discovery adapter.

The application must not make its core vendor management dependent on successful Google Places requests.

---

# 12. Wedding Website Architecture

## 12.1 Website Purpose

The wedding website is a shareable, unlisted guest-facing page.

It may display only content explicitly configured and published by organisers.

The website URL is not a security boundary and may be forwarded.

## 12.2 Themes

The MVP provides three themes:

1. Classic Indian.
2. Minimal Elegant.
3. Modern Celebration.

The theme controls the visual presentation of supported website content.

A custom theme builder is outside the MVP.

## 12.3 Language Support

Guest-facing website content supports:

- English.
- Hindi.

The organiser dashboard remains English-only.

English and Hindi content are maintained independently.

Do not assume automatic translation.

## 12.4 Publishing Lifecycle

Website states:

```text
UNPUBLISHED
PUBLISHED
```

Organisers can:

- Configure content.
- Select a theme.
- Preview the website.
- Publish it.
- Unpublish it.

Unpublishing must immediately prevent public retrieval of the website content through the application's normal public routes.

## 12.5 Public Data Boundary

Public website payloads may contain:

- Published wedding title and details.
- Approved event information.
- Configured public venue/location details.
- Published website content.
- Published gallery entry point.
- Public livestream section.

Public payloads must never contain:

- Organiser contact details unless explicitly configured as public.
- Full household records.
- Guest email addresses or phone numbers.
- RSVP responses.
- Expense or payment data.
- Internal notes.
- Pending photo submissions.
- Private organiser activity.

## 12.6 Public URL

Use a unique wedding slug.

The slug must be unique and validated.

A difficult-to-guess slug is not equivalent to access control.

Public content must be safe to expose to anyone who obtains the URL.

---

# 13. Gallery, Photo Upload and QR Architecture

## 13.1 Gallery Overview

The gallery is organised into event-based albums.

Organisers can manage albums and photographs.

Guests can:

- View published photographs.
- Download published photographs.
- Submit photographs through the upload QR.

Guests do not need an account or OTP.

## 13.2 Two Independent QR Purposes

The application maintains two separate QR purposes:

1. Gallery-view QR.
2. Guest photo-upload QR.

These QR codes must never share authorisation privileges.

### Gallery-view QR

- Exactly one wedding-wide gallery-view QR.
- Opens the public gallery landing page.
- Anyone with the link or QR may view and download published photographs.
- Does not require OTP.
- Does not grant upload permission.

### Guest photo-upload QR

- Exactly one wedding-wide guest-upload QR.
- Opens the central photo-submission page.
- Valid upload token authorises photo submission.
- Does not grant organiser access.
- Does not grant moderation permissions.
- Does not grant access to unpublished photographs.

Both tokens must be unguessable, revocable and regenerable.

Store token hashes rather than raw tokens.

## 13.3 Guest Upload Workflow — Confirmed

The upload workflow uses a **central submission inbox**.

Guests do not select an event or album.

Workflow:

1. Guest scans the wedding-wide upload QR.
2. Guest opens the upload page.
3. Server validates the upload token.
4. Guest selects photographs.
5. Server validates the files and upload limits.
6. System creates upload intents.
7. Files are uploaded to private Cloudflare R2 storage.
8. Server verifies upload completion.
9. Photo metadata is saved with pending moderation status.
10. Submission appears in the central organiser review inbox.
11. Admin or Manager reviews the submission.
12. Admin or Manager approves or rejects it.
13. Approved photographs are assigned to an appropriate event album by the organiser.
14. Approved and assigned photographs become eligible for publication according to album visibility and publication settings.

The guest does not decide the event album destination.

## 13.4 Central Submission Inbox

The central inbox must display:

- Submission thumbnail.
- Submission timestamp.
- Original filename where safe.
- Upload status.
- Moderation status.
- Available moderation actions.

It must support filtering by:

- Pending.
- Approved.
- Rejected.

The inbox is an organiser-only interface.

## 13.5 Photo Moderation

Moderation states:

```text
PENDING
APPROVED
REJECTED
```

Rules:

- Guest submissions start as PENDING.
- Admins and Managers may approve.
- Admins and Managers may reject.
- Managers cannot permanently delete photographs.
- Admins may permanently delete photographs.
- Rejected photographs remain unpublished.
- Only approved photographs assigned to an eligible published album may be displayed publicly.

Approval and album assignment are separate business actions.

An approved but unassigned photograph must not appear in a public album.

## 13.6 Album Architecture

Albums belong to a wedding and are associated with an event.

Album fields may include:

- Title.
- Description.
- Event reference.
- Visibility.
- Publication status.
- Created/updated metadata.

The system must respect album publication and visibility settings.

Deleting an event does not automatically delete its albums or photos. Its albums are unpublished and retained for organiser handling.

## 13.7 Public Gallery Access

Anyone with the valid gallery-view link or QR may view and download published photographs.

No guest account, OTP or household invitation is required for gallery viewing.

The application must communicate that:

- Gallery links may be forwarded.
- Anyone obtaining the link may access published gallery content.
- The link does not verify a visitor's identity.

Gallery access does not imply upload access.

## 13.8 Cloudflare R2 Storage

Store image objects in private R2 storage.

MongoDB stores metadata and object keys.

Do not expose permanent private object URLs for pending or rejected photographs.

Use short-lived authorised delivery URLs or an application-controlled delivery route.

## 13.9 Upload Validation

Validate:

- File signature.
- Actual content type.
- File size.
- Image dimensions.
- Upload token.
- Rate limits.
- Per-wedding quotas.

Do not rely only on the browser-supplied MIME type or filename extension.

Recommended MVP image allowlist:

- JPEG.
- PNG.
- WebP.

HEIC may be enabled only when image processing and preview support are implemented.

Reject SVG uploads in the MVP.

## 13.10 Upload Failure and Reconciliation

Create an UploadIntent before the object upload.

If upload succeeds but metadata persistence fails:

- Keep enough intent information for reconciliation.
- Identify the unreferenced object.
- Delete temporary orphan objects after a configured grace period.

If metadata exists but the object is missing:

- Mark the photo unavailable.
- Log the failure.
- Provide a safe organiser-facing error state.

Deletion of R2 objects must be retryable.

---

# 14. Public YouTube Livestream Architecture

## 14.1 Confirmed Visibility

The MVP livestream is **public**.

Anyone visiting the published wedding website can view the embedded livestream section when the organiser has enabled it.

No guest authentication or household invitation is required for livestream viewing.

## 14.2 YouTube Responsibility

YouTube provides:

- Video hosting.
- Stream availability.
- Playback.
- Player functionality.
- Its own privacy and visibility behaviour.

MMM does not host video or provide livestream infrastructure.

## 14.3 Configuration

Livestream settings may include:

- Event reference.
- YouTube video/live identifier.
- Enabled status.
- Website visibility.
- Display title or description.

## 14.4 URL Validation

Accept supported YouTube URL formats only.

The server must:

1. Validate the URL.
2. Extract the video identifier.
3. Generate a controlled embed URL.
4. Avoid rendering arbitrary organiser-supplied iframe HTML.

Provide a direct YouTube fallback link.

## 14.5 Public Sharing Limitation

The application cannot prevent visitors from copying or sharing a publicly accessible YouTube stream link.

YouTube's own stream settings and availability rules remain applicable.

If a stream is unavailable, disabled, removed or not embeddable, show a graceful unavailable state without breaking the wedding website.

---

# 15. Wedding and Data Lifecycle

## 15.1 Wedding Setup Status

Maintain a setup status separately from website publication and guest-facing availability.

Suggested values:

```text
SETUP
ACTIVE
```

The workspace can be used during setup.

The workspace must not require partner acceptance before the creator can continue ordinary setup activities.

The transition to ACTIVE follows the product's Primary Admin setup condition.

## 15.2 Guest Access Lifecycle

The application must not introduce an automatic post-event guest-access expiry.

Guest-facing access is governed by:

- Website publication.
- Gallery publication and visibility.
- Household invitation validity and revocation.
- Gallery-view token validity and revocation.
- Upload token validity and revocation.
- Photo moderation status.
- Relevant resource publication state.

There is no 15-day post-event expiry.

## 15.3 Wedding Archive

Wedding archive and unarchive functionality are outside the MVP.

Do not implement:

- Automatic archive after the final event.
- Guest-access closure triggered by archive.
- Archive restoration workflows.
- Post-event guest expiry calculations.

## 15.4 Wedding Deletion

Wedding deletion is an Admin-only destructive operation.

It requires:

- Explicit confirmation.
- Server-side permission validation.
- A deletion workflow.
- Audit logging.
- Data and object-storage cleanup.

The deletion process must account for both MongoDB records and Cloudflare R2 objects.

Recommended workflow:

1. Admin initiates deletion.
2. UI explains the destructive impact.
3. Admin confirms.
4. Server revalidates the Admin membership.
5. System records the deletion request.
6. Public website and public links are disabled.
7. Active invitation and QR tokens are revoked.
8. A deletion job processes dependent records and stored media.
9. Failed R2 deletions are retried.
10. Completion or failure is recorded.

The deletion workflow must be idempotent and recoverable.

Do not assume that removing MongoDB records automatically removes stored R2 objects.

Data retention and legal deletion requirements must be reviewed before production release.

---

# 16. Notification and Email Architecture

## 16.1 Email Provider

Resend is the approved transactional email provider.

Email may be used for:

- Account verification.
- Password reset.
- Primary partner invitation.
- Additional organiser invitation.
- Household invitation.
- Relevant invitation notifications.
- RSVP reminders where implemented.

Guest OTP is not required.

## 16.2 Email Outbox Pattern

Important emails must not depend exclusively on a synchronous send inside a user-facing request.

Use a durable EmailOutbox record.

A business transaction that requires an email should:

1. Save the business change.
2. Save an outbox event in the same transaction.
3. Commit.
4. Allow a worker to process the email.

## 16.3 Outbox Status

Suggested statuses:

```text
QUEUED
SENDING
SENT
RETRY
FAILED
CANCELLED
```

Store:

- Recipient.
- Email type.
- Safe template data.
- Idempotency key.
- Attempt count.
- Next attempt time.
- Provider message ID.
- Last safe error.
- Timestamps.

## 16.4 Retry Policy

Implementation default:

- Retry transient provider failures.
- Use exponential backoff with jitter.
- Limit repeated attempts.
- Mark permanent failures as FAILED.
- Respect provider rate limits.
- Prevent duplicate delivery through idempotency controls.

A scheduled worker must be safe to run more than once.

## 16.5 Email Delivery Meaning

SENT means the provider accepted the message.

It does not mean the recipient read the email.

Provider webhooks must be signature-verified and processed idempotently.

---

# 17. API and Application Service Architecture

## 17.1 API Design Principles

All APIs must:

- Validate input.
- Authenticate the caller where required.
- Enforce permissions server-side.
- Enforce wedding ownership.
- Return predictable response structures.
- Use consistent error codes.
- Avoid exposing internal database objects directly.
- Avoid exposing secrets and raw tokens.

## 17.2 Suggested Module Service Boundaries

| Module | Application services |
|---|---|
| Auth | Register, sign in, verify email, reset password |
| Weddings | Create, update, delete wedding |
| Memberships | Resolve membership, enforce uniqueness |
| Organisers | Invite, accept, update role, remove |
| Events | Create, update, delete |
| Tasks | Create, update, assign, complete |
| Households | Create, update, manage |
| Invitations | Generate, revoke, regenerate |
| RSVP | Submit response, update response, calculate totals |
| Expenses | Create, update, delete |
| Payments | Create, update, delete, calculate totals |
| Vendors | Save, update, delete, discover |
| Website | Configure, preview, publish, unpublish |
| Gallery | Manage albums and photographs |
| Uploads | Create intent, upload, confirm, reconcile |
| Moderation | Approve, reject, assign album, delete |
| QR | Generate, rotate, revoke |
| Livestream | Configure and validate YouTube settings |
| Notifications | Queue, send, retry, process webhook |
| Audit | Record and query activity |

## 17.3 Transaction Boundaries

Use MongoDB transactions for operations involving multiple related writes where consistency is essential.

Examples:

- Wedding creation and creator membership.
- Partner invitation acceptance and membership creation.
- Additional organiser invitation acceptance.
- Payment creation and financial balance validation.
- Event deletion and dependent record state transitions.
- Wedding deletion initiation.
- Photo approval and publication metadata.
- QR token regeneration and previous token revocation.

External provider calls must not be treated as part of a MongoDB transaction.

Use an outbox or retryable workflow for external side effects.

## 17.4 API Error Categories

Use stable application error codes.

Examples:

```text
UNAUTHENTICATED
FORBIDDEN
RESOURCE_NOT_FOUND
CROSS_WEDDING_ACCESS
INVALID_INPUT
MEMBERSHIP_ALREADY_ACTIVE
PRIMARY_ADMIN_PROTECTED
INVITATION_INVALID
INVITATION_REVOKED
RSVP_CAPACITY_EXCEEDED
RSVP_CUTOFF_PASSED
PAYMENT_EXCEEDS_OUTSTANDING
EXPENSE_BELOW_PAID_AMOUNT
EVENT_HAS_DEPENDENCIES
UPLOAD_TOKEN_INVALID
UPLOAD_LIMIT_EXCEEDED
PHOTO_NOT_PUBLISHABLE
EXTERNAL_PROVIDER_UNAVAILABLE
CONCURRENT_MODIFICATION
```

The API Design Document will define exact HTTP status codes and response payloads.

---

# 18. Database Architecture Principles

This section describes architectural data rules. It is not the separate Database Design Document.

## 18.1 Database

MongoDB Atlas with Mongoose.

## 18.2 General Rules

- Every wedding-owned record must be wedding-scoped.
- Use consistent ObjectId references.
- Use UTC timestamps for instants.
- Use explicit finite-state enums.
- Validate data at schema and application layers.
- Avoid unbounded arrays for payments, photos, guests and audit history.
- Use explicit lifecycle fields for records that must be retained.
- Avoid hard deletion of historical financial records.
- Keep token hashes rather than raw tokens.
- Validate all cross-document references.
- Use versioned migrations for schema/index changes.

## 18.3 Logical Collection Groups

### Identity and Authentication

- Users.
- Accounts.
- Password credentials, where applicable.
- Verification tokens.
- Password reset tokens.

### Wedding and Organisers

- Weddings.
- Wedding memberships.
- Organiser invitations.
- Primary Admin invitations, if represented separately.

### Planning

- Events.
- Tasks.
- Task assignments.

### Guests and RSVP

- Households.
- Household invitation tokens.
- Household-event invitations.

### Finance

- Expenses.
- Expense payments.

### Vendors

- Vendors.

### Website and Media

- Website settings.
- Albums.
- Photos.
- Upload intents.
- Gallery-view links.
- Photo-upload links.
- Livestream settings.

### Operations

- Email outbox.
- Audit logs.

## 18.4 Important Integrity Constraints

1. Unique normalised user email.
2. One active wedding membership per user.
3. One active Bride Primary Admin per wedding.
4. One active Groom Primary Admin per wedding.
5. Primary memberships must have Admin role.
6. Unique wedding slug.
7. One active household invitation token per current invitation cycle.
8. One active household-event invitation per household and event.
9. RSVP counts must respect party size.
10. Payments must belong to the same wedding as their expense.
11. Payment totals must not exceed expense totals.
12. Expense totals cannot be reduced below paid-to-date.
13. One active wedding-wide gallery-view QR.
14. One active wedding-wide upload QR.
15. Gallery and upload token purposes must remain separate.
16. Public photos must be approved and assigned to a published album.
17. Every album event reference must belong to the same wedding.
18. All public website payloads must exclude private organiser and guest information.

Detailed indexes and field definitions belong in the Database Design Document.

---

# 19. Security Architecture

## 19.1 Authentication Security

- Use secure authentication flows.
- Hash passwords with a modern password-hashing algorithm.
- Use single-use verification and reset tokens.
- Store token hashes.
- Protect session cookies.
- Use secure production cookie settings.
- Do not expose authentication secrets to client code.

## 19.2 Authorisation Security

- Enforce permissions server-side.
- Check active membership on every protected organiser operation.
- Verify wedding ownership for every resource.
- Prevent cross-wedding access.
- Prevent Managers from deleting ordinary records.
- Protect Primary Admin membership from ordinary modification.
- Do not trust hidden UI controls as a security mechanism.

## 19.3 QR and Token Security

- Use cryptographically random high-entropy tokens.
- Store hashes rather than raw tokens.
- Keep gallery and upload purposes distinct.
- Revoke old tokens when regenerated.
- Apply rate limits.
- Avoid logging tokens.
- Avoid including personal information in token values.

## 19.4 Media Security

- Keep R2 storage private.
- Validate file content.
- Reject unsupported content.
- Apply upload size and quota limits.
- Prevent public access to pending and rejected photos.
- Use short-lived authorised delivery URLs or server-side delivery.
- Do not trust browser-supplied file metadata.

## 19.5 Web Security

Protect against:

- Cross-site scripting.
- Cross-site request forgery where applicable.
- Injection.
- Insecure direct object references.
- Session misuse.
- Token guessing.
- Brute-force requests.
- Malicious uploads.
- Webhook spoofing.
- Cross-wedding data access.

## 19.6 Rate Limiting

Apply rate limits to:

- Authentication attempts.
- Password reset requests.
- Invitation token validation.
- RSVP submissions.
- QR token access.
- Photo uploads.
- Public gallery requests where abuse protection is needed.
- Vendor discovery requests.

Exact thresholds should be configured and tested before production.

## 19.7 Audit Logging

Audit important actions:

- Wedding creation and deletion.
- Primary Admin invitation and acceptance.
- Additional organiser invitations.
- Role changes and membership removal.
- Event deletion.
- Expense changes.
- Payment creation, editing and deletion.
- Photo approval and rejection.
- Photo deletion.
- QR generation and revocation.
- Website publication.
- Livestream configuration changes.
- Manual recovery actions.

Never log:

- Passwords.
- Raw tokens.
- Authentication secrets.
- API keys.
- Sensitive ownership verification documents.
- Unnecessary payment or personal information.

---

# 20. Privacy and Public Data Boundaries

## 20.1 Organiser Data

Organiser data is available only to authorised active members of the relevant wedding.

## 20.2 Household Data

Household invitation links must expose only the relevant household's assigned events and RSVP functionality.

Guest contact information must never be included in public website payloads.

## 20.3 Gallery Data

Published gallery photographs are intentionally accessible through the gallery link or QR.

The system must not claim that gallery access verifies visitor identity.

Pending and rejected submissions remain private.

## 20.4 Website Data

Only explicitly published content may be returned publicly.

Unpublished website content must not be exposed through public API routes or cached responses.

## 20.5 Data Minimisation

Collect only the information needed for the product.

Apply appropriate retention, deletion and privacy-notice policies before public launch.

---

# 21. Background Jobs and Asynchronous Processing

## 21.1 Required Jobs

The application requires reliable processing for:

- Email outbox delivery.
- Email retry handling.
- Provider webhook processing.
- Upload intent expiry.
- R2 orphan-object reconciliation.
- Missing media reconciliation.
- Failed object deletion retry.
- Wedding deletion cleanup.
- Other scheduled housekeeping.

No guest OTP, guest session expiry or post-event expiry job is required.

## 21.2 Job Requirements

Jobs must:

- Be idempotent.
- Claim work safely.
- Tolerate duplicate invocation.
- Record failures.
- Use bounded retries.
- Avoid unbounded execution.
- Avoid exposing secrets in logs.

## 21.3 Vercel Execution Considerations

Do not assume that a user-facing request can remain active indefinitely to complete background work.

Use scheduled invocations or a suitable worker mechanism.

Persist job state in MongoDB.

The worker must be safe to run again after interruption.

---

# 22. External Integrations

## 22.1 Resend

Purpose:

- Transactional email delivery.

Failure behaviour:

- Queue the email.
- Retry transient failures.
- Expose permanent failures to operational monitoring.
- Do not treat provider acceptance as proof of reading.

## 22.2 Cloudflare R2

Purpose:

- Store photographs and image assets.

Failure behaviour:

- Keep upload pending.
- Allow safe retry.
- Reconcile incomplete uploads.
- Retry failed deletion.
- Never publish missing or unverified objects.

## 22.3 Google Places API (New)

Purpose:

- Informational vendor discovery.

Failure behaviour:

- Display a graceful provider-unavailable state.
- Preserve manual vendor management.

## 22.4 YouTube

Purpose:

- Public livestream playback.

Failure behaviour:

- Display an unavailable state.
- Provide a direct YouTube fallback where possible.
- Do not break other wedding website sections.

## 22.5 MongoDB Atlas

Purpose:

- Primary application database.

Failure behaviour:

- Fail closed for protected operations.
- Do not grant access using stale membership data.
- Return a controlled service error.
- Preserve retryability for safe operations.

---

# 23. Deployment Architecture

## 23.1 Hosting

Vercel is the approved hosting platform for the Next.js application.

MongoDB Atlas provides the database.

Cloudflare R2 provides image storage.

Resend provides transactional email.

## 23.2 Environments

Maintain separate configurations for:

### Development

- Local application.
- Development database.
- Development storage.
- Test email configuration.

### Preview

- Isolated preview deployment.
- Non-production secrets.
- Test data and provider configuration.

### Production

- Production database.
- Production storage.
- Production email sender.
- Restricted API credentials.
- Monitoring and backups.

Never use production secrets in preview environments by default.

## 23.3 Environment Variables

Examples of configuration categories:

```text
AUTH_SECRET
AUTH_URL

MONGODB_URI

GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET

RESEND_API_KEY
RESEND_FROM_EMAIL

R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET_NAME

GOOGLE_PLACES_API_KEY

APP_BASE_URL
```

Actual values must be stored in the relevant secret-management configuration.

Do not commit `.env` files containing secrets.

## 23.4 CI/CD Pipeline

On every pull request:

1. Install dependencies from lockfile.
2. Run formatting checks.
3. Run lint checks.
4. Run TypeScript type checks.
5. Run unit tests.
6. Run integration tests.
7. Run security/dependency checks.
8. Build the Next.js application.
9. Create a preview deployment.
10. Review before production merge.

## 23.5 Database Migrations

Mongoose schema changes do not replace a migration strategy.

Use versioned scripts for:

- Index creation.
- Data backfills.
- Field transformations.
- Enum changes.
- Data cleanup.
- Destructive schema changes.

Test migrations against production-like data.

Document rollback or forward-fix procedures.

---

# 24. Observability and Monitoring

## 24.1 Operational Logs

Monitor:

- Application errors.
- Authentication failures.
- Permission denials.
- Database errors.
- Slow queries.
- Email delivery failures.
- Outbox backlog.
- R2 upload failures.
- Media deletion failures.
- QR token abuse.
- Upload validation failures.
- Payment conflicts.
- Background job failures.
- External provider outages.

## 24.2 Metrics

Recommended metrics:

| Area | Metric |
|---|---|
| Application | Request volume and error rate |
| Performance | API latency |
| Database | Connection errors and slow queries |
| Authentication | Login failures and reset requests |
| Organisers | Invitation acceptance and removal |
| Guests | Invitation and RSVP activity |
| Finance | Payment conflicts and failed updates |
| Email | Outbox backlog and delivery failures |
| Media | Upload success and failure rate |
| Gallery | Published media count and access errors |
| QR | Invalid and revoked token requests |
| Jobs | Retry count and job age |

## 24.3 Alerts

Configure alerts for:

- Sustained application error rates.
- Database unavailability.
- Large email backlog.
- Repeated R2 failures.
- Failed deletion jobs.
- Unusual upload activity.
- Unexpected permission-denial spikes.
- Repeated payment conflicts.

Do not rely only on manually inspecting logs.

---

# 25. Backup and Disaster Recovery

## 25.1 MongoDB Backup

Enable MongoDB Atlas backups appropriate to the production plan.

Define recovery point objective and recovery time objective before launch.

Test restoration into an isolated environment.

## 25.2 R2 Media Recovery

MongoDB backups do not restore R2 objects.

Define a storage recovery approach that accounts for:

- Object availability.
- Object keys.
- Metadata consistency.
- Deleted objects.
- Backup and retention requirements.

Test restoration of a wedding's metadata and corresponding media together.

## 25.3 Recovery Procedure

1. Identify the incident.
2. Stop affected destructive jobs if necessary.
3. Restore MongoDB to an isolated environment.
4. Verify or restore relevant R2 objects.
5. Reconcile photo metadata and object keys.
6. Validate organiser memberships.
7. Validate payment records and totals.
8. Validate public-link and token states.
9. Obtain approval before restoring production traffic.
10. Record recovery actions.

---

# 26. Testing Strategy

Testing must cover business rules, integration behaviour, security, concurrency and end-to-end workflows.

## 26.1 Unit Tests

Test:

- Wedding creation eligibility.
- Creator Primary Admin membership.
- Primary partner invitation.
- Primary Admin protection.
- Admin/Manager permissions.
- One active membership globally.
- Membership removal and rejoining.
- Event deletion state transitions.
- Dependent-record handling.
- RSVP capacity calculations.
- Primary invitee decline with additional attendees.
- Integer INR calculations.
- Payment balance calculations.
- Payment overrun prevention.
- Website publication rules.
- Gallery publication rules.
- Upload token permissions.
- Photo moderation transitions.
- YouTube URL validation.

## 26.2 Integration Tests

Test:

- Auth.js email/password flow.
- Google sign-in.
- Email verification.
- Password recovery.
- MongoDB transactions.
- Unique indexes.
- Resend outbox and webhooks.
- R2 signed upload/download flow.
- R2 cleanup and reconciliation.
- Google Places failure handling.
- YouTube embed configuration.

## 26.3 Permission Tests

Test:

- Manager cannot delete events.
- Manager cannot delete expenses.
- Manager cannot delete payments.
- Manager cannot delete albums or photos.
- Manager can approve and reject photo submissions.
- Additional Admin cannot remove a Primary Admin.
- Primary Admin cannot remove the other Primary Admin.
- Manager cannot manage organisers.
- Removed organiser loses access immediately.
- Cross-wedding references are rejected.

## 26.4 Event Deletion Tests

Test:

- Admin can delete an event after confirmation.
- Manager cannot delete an event.
- Event is logically deleted rather than physically removed.
- RSVP submission stops.
- Invitation history remains.
- RSVP history remains.
- Expense records remain.
- Payment records remain.
- Album becomes unpublished.
- Photos remain stored.
- Livestream entry point is disabled.
- Event deletion is audited.
- Repeated deletion requests are safe.

## 26.5 RSVP Tests

Test:

- One household invited to multiple events.
- One household link exposes only assigned events.
- RSVP submitted for one event does not change another.
- Primary invitee attending.
- Primary invitee not attending.
- Additional attendees attending when primary invitee declines.
- Maximum party size validation.
- RSVP cutoff enforcement.
- Invalid and revoked household tokens.

## 26.6 Finance Tests

Test:

- Expense without payment.
- Multiple partial payments.
- Full payment.
- Correct paid-to-date.
- Correct outstanding.
- Whole-rupee validation.
- Zero and negative payment rejection.
- Decimal amount rejection.
- Overpayment rejection.
- Expense reduction below paid amount rejection.
- Admin payment deletion.
- Manager payment deletion rejection.
- Financial audit history.
- Concurrent payment attempts.

## 26.7 Gallery and Upload Tests

Test:

- One wedding-wide gallery QR.
- One wedding-wide upload QR.
- Gallery QR does not authorise uploads.
- Upload QR does not grant gallery-management access.
- Gallery access does not require OTP.
- Upload access does not require OTP.
- Guest cannot select an event or album in the upload workflow.
- Guest submissions enter central inbox.
- Pending submissions are not public.
- Admin can approve and assign a photo.
- Manager can approve and assign a photo.
- Manager can reject a photo.
- Manager cannot permanently delete a photo.
- Admin can permanently delete a photo.
- Approved but unassigned photo is not public.
- Rejected photo is not public.
- Revoked upload token is rejected.
- Invalid files are rejected.
- R2 failures are handled safely.

## 26.8 Livestream Tests

Test:

- Supported YouTube URL accepted.
- Unsupported URL rejected.
- Public website displays enabled livestream.
- Public visitors can view the livestream section without guest authentication.
- Unavailable stream shows fallback state.
- Unpublished website does not expose the livestream section.

## 26.9 Security Tests

Test:

- Cross-wedding access.
- Unauthorised organiser actions.
- Primary Admin modification attempts.
- Token guessing and replay.
- Invalid and revoked tokens.
- Unsafe file uploads.
- Public access to pending photographs.
- Webhook signature verification.
- XSS.
- CSRF where applicable.
- IDOR.
- Rate-limit bypass.
- Sensitive log exposure.

## 26.10 End-to-End Tests

A complete test journey should include:

1. Bride creates a wedding.
2. Groom receives an invitation.
3. Groom accepts and becomes the second Primary Admin.
4. Additional Admin is invited.
5. Manager is invited.
6. Manager attempts organiser management and is denied.
7. Events and tasks are created.
8. Household is created and assigned to multiple events.
9. Guest opens one household invitation link.
10. Guest submits different RSVPs for assigned events.
11. Expenses and multiple payments are created.
12. Website is configured in English and Hindi.
13. Website is published.
14. Public gallery QR is opened.
15. Public upload QR is opened.
16. Guest submits photographs.
17. Submissions appear in central inbox.
18. Admin/Manager reviews submissions.
19. Approved photos are assigned to albums.
20. Published photographs appear in the public gallery.
21. Public YouTube livestream is displayed.
22. Admin deletes an event after confirmation.
23. Historical and financial records remain intact.
24. Admin deletes the wedding through the confirmed deletion workflow.

---

# 27. Non-Functional Requirements

## 27.1 Performance

- Paginate large household, expense, vendor, task and photo lists.
- Use indexes for common wedding-scoped queries.
- Avoid unbounded document arrays.
- Lazy-load gallery images.
- Generate suitable image sizes and thumbnails.
- Avoid loading all photographs at once.
- Cache only safe public published content.
- Never share private cached data across users or households.

## 27.2 Reliability

- Important emails use a durable outbox.
- Media operations are retryable.
- Payment operations preserve financial consistency.
- Membership constraints are database-enforced.
- Token revocation takes effect on subsequent validation.
- Public content is not served when unpublished.
- Failed external providers do not bypass access controls.

## 27.3 Responsiveness

Support:

- Desktop.
- Laptop.
- Tablet.
- Mobile browsers.

The organiser dashboard and guest-facing upload pages must remain usable on mobile.

## 27.4 Accessibility

- Label all form controls.
- Provide visible focus states.
- Support keyboard navigation.
- Use accessible error messages.
- Do not rely only on colour to communicate state.
- Maintain readable typography and contrast.
- Provide meaningful image alternatives where appropriate.

## 27.5 Maintainability

- Use strict TypeScript.
- Keep domain rules out of UI components.
- Centralise permission checks.
- Use reusable validation schemas.
- Keep module boundaries explicit.
- Add tests for business-critical rules.
- Document database migrations.
- Use consistent error handling.

---

# 28. Implementation Sequence

The implementation sequence is dependency-driven.

## Phase 1 — Foundation and Authentication

Scope:

- Next.js and TypeScript setup.
- Tailwind and shadcn/ui.
- MongoDB connection.
- Mongoose.
- Environment configuration.
- Error handling.
- Logging.
- Validation.
- Auth.js.
- Email/password.
- Google sign-in.
- Email verification.
- Password reset.

Exit criteria:

- Organiser registration and sign-in work.
- Protected routes reject unauthenticated users.
- Database and environment configuration work.

## Phase 2 — Wedding and Membership

Scope:

- Wedding creation.
- Bride/Groom creator identification.
- Creator Primary Admin membership.
- Partner invitation.
- Partner acceptance.
- Additional Admin/Manager memberships.
- Membership uniqueness.
- Central permissions.
- Audit logging.

Exit criteria:

- Both protected Primary Admin positions work correctly.
- Additional organisers can be invited.
- One active membership is enforced.
- Server-side permissions pass tests.

## Phase 3 — Events and Tasks

Scope:

- Event management.
- Task management.
- Task assignment.
- Dashboard summaries.
- Event logical deletion.
- Dependent-record handling.

Exit criteria:

- Event and task workflows work.
- Event deletion preserves historical and financial data.
- Managers cannot delete events.

## Phase 4 — Guests and RSVP

Scope:

- Household management.
- Household invitation link.
- Event-specific invitations.
- RSVP page.
- Primary invitee attendance.
- Additional attendee count.
- RSVP summaries.
- Token revocation and regeneration.

Exit criteria:

- One household link covers all assigned events.
- RSVP capacity is correct.
- No OTP or guest account is required.

## Phase 5 — Expenses and Payments

Scope:

- Expense management.
- Payment management.
- Whole-rupee validation.
- Paid-to-date.
- Outstanding calculations.
- Payment concurrency handling.
- Financial audit history.

Exit criteria:

- Financial totals remain correct.
- Overpayment is prevented.
- Manager deletion restrictions are enforced.

## Phase 6 — Vendors and Website

Scope:

- Vendor records.
- Google Places discovery.
- Website settings.
- Three themes.
- English and Hindi content.
- Preview.
- Publish and unpublish.

Exit criteria:

- Vendor records work independently of Google Places.
- Public website exposes only published content.

## Phase 7 — Gallery and Photo Upload

Scope:

- Event albums.
- Organiser uploads.
- Guest upload QR.
- Central submission inbox.
- R2 integration.
- Moderation.
- Album assignment.
- Public gallery.
- Gallery-view QR.
- Download flow.

Exit criteria:

- One wedding-wide upload QR.
- One wedding-wide gallery QR.
- Guests cannot select albums during submission.
- Moderation and publication work correctly.

## Phase 8 — Livestream

Scope:

- YouTube URL validation.
- Livestream configuration.
- Public website display.
- Fallback behaviour.

Exit criteria:

- Enabled livestream appears publicly on the published wedding website.
- Unavailable streams do not break the page.

## Phase 9 — Production Hardening

Scope:

- Security tests.
- Permission tests.
- Concurrency tests.
- Responsive tests.
- Accessibility checks.
- Monitoring.
- Backup and restore.
- Provider failure tests.
- Production configuration.

Exit criteria:

- All critical MVP workflows pass.
- No unresolved critical security or data-integrity issue remains.
- Recovery procedures are tested.

---

# 29. Risks and Mitigation

| Risk | Impact | Mitigation |
|---|---|---|
| Partner invitation not accepted | Only one Primary Admin is active | Allow creator to continue setup; display pending status |
| Both Primary Admins lose access | Workspace recovery becomes difficult | Manual support ownership verification |
| Incorrect permission checks | Unauthorised data changes | Central permission service and automated tests |
| Duplicate active memberships | User gains access to multiple weddings | Unique partial database index |
| Incorrect RSVP calculation | Incorrect attendance totals | Server-side capacity validation |
| Duplicate payments | Incorrect financial totals | Transactions and concurrency checks |
| Event deletion removes financial history | Loss of financial records | Logical deletion and preserved dependencies |
| Household link forwarding | Unintended household access | High-entropy tokens, narrow scope and revocation |
| Gallery link forwarding | Published photos can be shared | Clearly communicate link-based public access |
| Upload QR forwarding | Unwanted submissions | Rate limits, quotas and moderation |
| Inappropriate submissions | Unwanted public content | Pending moderation and Admin deletion |
| Large uploads | Storage and performance costs | File size and quota limits |
| R2 failure | Incomplete media | Upload intents and reconciliation |
| Resend failure | Invitations delayed | Durable outbox and retry handling |
| Google Places outage | Discovery unavailable | Manual vendor entry |
| YouTube outage | Livestream unavailable | Graceful fallback state |
| Public website sharing | Wedding information may be forwarded | Explicit public-content controls |

---

# 30. Architecture Decision Register

| ID | Decision | Resolution |
|---|---|---|
| ADR-01 | Architecture style | Single-repository modular monolith |
| ADR-02 | Frontend/backend | Next.js with TypeScript and Node.js |
| ADR-03 | Database | MongoDB Atlas with Mongoose |
| ADR-04 | Hosting | Vercel |
| ADR-05 | Authentication | Auth.js |
| ADR-06 | Authentication methods | Email/password and Google |
| ADR-07 | Email provider | Resend |
| ADR-08 | Image storage | Cloudflare R2 |
| ADR-09 | Vendor discovery | Google Places API (New) |
| ADR-10 | Livestream | YouTube embed |
| ADR-11 | Primary identities | Protected Bride and Groom Admin memberships |
| ADR-12 | Additional organisers | Admin and Manager |
| ADR-13 | Active membership | One active wedding membership per user |
| ADR-14 | Guest identity | Household-based; no guest accounts |
| ADR-15 | Guest OTP | Not required |
| ADR-16 | Household invitation | One link for all assigned events |
| ADR-17 | RSVP | Per household and event |
| ADR-18 | Attendance | Primary invitee and additional attendee count stored separately |
| ADR-19 | Currency | Whole INR stored as integer rupees |
| ADR-20 | Payments | Multiple payment records per expense |
| ADR-21 | Payment integrity | Prevent overpayment and expense reduction below paid total |
| ADR-22 | Event deletion | Confirmed logical deletion with historical dependency preservation |
| ADR-23 | Gallery-view QR | One wedding-wide public gallery QR |
| ADR-24 | Photo-upload QR | One wedding-wide upload QR |
| ADR-25 | Guest upload destination | Central submission inbox |
| ADR-26 | Photo assignment | Organiser assigns approved photographs to event albums |
| ADR-27 | Gallery access | Anyone with the gallery link/QR can view published photos |
| ADR-28 | Photo moderation | Approval required before publication |
| ADR-29 | Livestream visibility | Public on published wedding website |
| ADR-30 | Website languages | English and Hindi guest-facing content |
| ADR-31 | Website themes | Three predefined themes |
| ADR-32 | Wedding archive | Excluded from MVP |
| ADR-33 | Guest access expiry | No automatic post-event expiry |
| ADR-34 | Email processing | Durable outbox and retry mechanism |
| ADR-35 | Media processing | Private R2 storage, upload intents and reconciliation |
| ADR-36 | Database design | Separate Database Design Document |

---

# 31. Scope Boundaries

The architecture must not introduce the following into the MVP:

- Professional planner multi-wedding management.
- Multiple active wedding memberships per organiser.
- Accommodation management.
- Transportation management.
- Seating arrangements.
- Catering quantity management.
- Guest check-in.
- Online payment processing.
- Vendor payment processing.
- Advanced accounting.
- Vendor booking and contracts.
- Guest accounts.
- Guest OTP.
- Guest session expiry requirements.
- Automatic post-event guest expiry.
- Wedding archive and unarchive.
- Built-in livestream infrastructure.
- Native Android or iOS applications.
- Real-time collaborative editing.
- Event-specific or album-specific guest-upload QR codes.
- Guest-selected event/album upload destination.
- Custom website theme builder.
- Automatic content translation.

Any addition must be treated as an explicit product scope change.

---

# 32. Open Technical Configuration Items

The product behaviour and architecture decisions in this document are established. The following values are operational configuration details rather than unresolved product questions.

| Item | Required implementation action |
|---|---|
| Maximum photo size | Configure and document a safe upload limit |
| Allowed image dimensions | Define processing and validation limits |
| Per-wedding storage quota | Configure and monitor |
| Upload rate limits | Configure per token, IP and wedding |
| Token entropy | Use cryptographically secure random generation |
| Token rotation | Revoke old token when a replacement is activated |
| Public URL patterns | Finalise route naming |
| Email templates | Implement and test all required templates |
| Email retry threshold | Configure bounded retry policy |
| R2 cleanup grace period | Configure and test orphan cleanup |
| Database indexes | Specify in the separate Database Design Document |
| API contracts | Specify in the API Design Document |
| Privacy notice | Review before public launch |
| Data retention | Establish operational and legal policy before production |
| Backup recovery targets | Define and test before production |

These configuration items do not reopen the confirmed product decisions.

---

# 33. Final Architecture Freeze Checklist

Before declaring implementation aligned with this architecture, verify:

## Foundation

- [ ] Next.js and TypeScript application is configured.
- [ ] MongoDB Atlas and Mongoose are connected.
- [ ] Vercel deployment environments are separated.
- [ ] Secrets are not committed to source control.
- [ ] CI pipeline is operational.

## Authentication and Membership

- [ ] Email/password authentication works.
- [ ] Google sign-in works.
- [ ] Email verification works.
- [ ] Password recovery works.
- [ ] Bride/Groom creation restrictions work.
- [ ] Both Primary Admin positions are protected.
- [ ] Additional Admin and Manager roles work.
- [ ] One active wedding membership is enforced.
- [ ] Manager organiser restrictions work.

## Events and Tasks

- [ ] Events are wedding-scoped.
- [ ] Tasks are wedding-scoped.
- [ ] Task assignment validates active memberships.
- [ ] Event deletion requires confirmation.
- [ ] Event deletion preserves RSVP history.
- [ ] Event deletion preserves expenses and payments.
- [ ] Event albums are unpublished, not automatically erased.
- [ ] Event deletion is audited.

## Guests and RSVP

- [ ] Household invitation link covers assigned events.
- [ ] Guest accounts are not required.
- [ ] Guest OTP is not required.
- [ ] RSVP is event-specific.
- [ ] Primary invitee attendance is separate.
- [ ] Additional attendee count is separate.
- [ ] Capacity rules work correctly.
- [ ] Token revocation and regeneration work.

## Expenses and Payments

- [ ] All monetary values are whole INR.
- [ ] Amounts are stored as integer rupees.
- [ ] Expenses support multiple payments.
- [ ] Paid-to-date is calculated correctly.
- [ ] Outstanding is calculated correctly.
- [ ] Overpayment is prevented.
- [ ] Expense reduction below paid amount is prevented.
- [ ] Managers cannot delete payment records.
- [ ] Financial changes are audited.

## Website and Livestream

- [ ] Three website themes are available.
- [ ] English and Hindi content can be maintained separately.
- [ ] Website preview works.
- [ ] Website publication works.
- [ ] Unpublishing disables public content.
- [ ] Private organiser and guest data is excluded.
- [ ] Public YouTube livestream is displayed when enabled.
- [ ] Livestream failure has a graceful fallback.

## Gallery and Uploads

- [ ] One wedding-wide gallery-view QR exists.
- [ ] One wedding-wide upload QR exists.
- [ ] Gallery and upload permissions are separate.
- [ ] Gallery viewing does not require OTP.
- [ ] Guest uploads do not require OTP.
- [ ] Guest uploads enter a central submission inbox.
- [ ] Guests cannot select event albums during upload.
- [ ] Admins and Managers can approve or reject submissions.
- [ ] Admins and Managers can assign approved photos to albums.
- [ ] Managers cannot permanently delete photos.
- [ ] Admins can permanently delete photos.
- [ ] Pending and rejected photos are not public.
- [ ] Approved but unassigned photos are not public.
- [ ] R2 storage is private.
- [ ] Upload validation and quotas work.
- [ ] Token revocation works.

## Production Readiness

- [ ] Cross-wedding access tests pass.
- [ ] Permission tests pass.
- [ ] Payment concurrency tests pass.
- [ ] RSVP edge-case tests pass.
- [ ] Event deletion dependency tests pass.
- [ ] Media reconciliation tests pass.
- [ ] Backup and restore are tested.
- [ ] Monitoring and alerts are configured.
- [ ] Privacy and retention policies are reviewed.

---

# FINAL ARCHITECTURE BASELINE DECLARATION

**Make My Marriage System Architecture Document v1.3 is the revised technical architecture baseline for the MVP.**

It supersedes System Design Architecture Document v1.2.

It is based on Make My Marriage PRD v1.1 and incorporates the user's confirmed architecture decisions.

The most important architectural commitments are:

1. The application uses a Next.js and TypeScript modular monolith.
2. MongoDB Atlas with Mongoose is the primary database.
3. Auth.js handles organiser authentication through email/password and Google.
4. Resend handles transactional email.
5. Cloudflare R2 stores photographs and image assets.
6. Google Places API (New) supports informational vendor discovery.
7. YouTube provides public livestream playback.
8. Bride and Groom are the two protected Primary Admins.
9. Admin and Manager are the only organiser roles.
10. Each organiser account may have only one active wedding membership.
11. Guest access is household-based, without guest accounts or OTP.
12. One household invitation link covers all assigned events.
13. RSVP is tracked independently for each household-event invitation.
14. Financial amounts are whole Indian rupees stored as integer rupees.
15. One wedding-wide gallery-view QR and one wedding-wide upload QR are maintained.
16. Guest photo submissions enter a central review inbox and are assigned to event albums by organisers.
17. Published gallery photographs are accessible to anyone with the gallery link or QR.
18. Livestream playback is public on the published wedding website.
19. Event deletion requires confirmation and preserves historical and financial records.
20. Wedding archive and automatic post-event guest-access expiry are excluded from the MVP.

The PRD remains the authority for product behaviour. This architecture document defines the technical implementation approach.

The separate Database Design Document will define detailed database schemas, field types, indexes, validators and collection-level constraints. The API Design Document may define endpoint contracts without changing the product requirements.

Any future change to these approved architecture decisions must be documented as a deliberate revision rather than introduced informally during implementation.

**Document Status: FINAL ARCHITECTURE BASELINE — READY TO FREEZE**

**End of Make My Marriage System Architecture Document v1.3**