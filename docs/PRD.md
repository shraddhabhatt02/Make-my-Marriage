

# Make My Marriage
# MVP Product Requirements Document (PRD)

**Version:** 1.1  
**Document status:** Final MVP Requirements Baseline  
**Prepared:** 3 November 2026  
**Product:** Make My Marriage (MMM)  
**Platform:** Responsive Web Application  
**Primary market:** India  
**Default currency:** INR (₹)  
**Default timezone:** Asia/Kolkata  
**Languages:** English and Hindi for guest-facing pages; English for the organiser dashboard

---

# 1. Executive Summary

## 1.1 Product Overview

Make My Marriage (MMM) is a couple-focused wedding-planning web application designed to help couples organise and manage their wedding through one central workspace.

Indian weddings commonly involve multiple events, large guest households, invitations, RSVP coordination, expenses, vendors, schedules, and photographs. These activities are often managed across spreadsheets, messaging applications, paper lists, and disconnected services.

Make My Marriage aims to bring the essential planning activities into one organised platform.

The application will allow a couple to:

- Create a wedding workspace.
- Invite the other partner as a Primary Admin.
- Invite additional organisers with controlled permissions.
- Create and manage multiple wedding events.
- Plan tasks and monitor progress.
- Maintain guest households and event-specific invitations.
- Collect RSVPs for individual events.
- Track expenses, multiple payments, paid amounts, and outstanding balances.
- Maintain vendor information and discover vendors.
- Publish a shareable wedding website.
- Create event-based photo albums.
- Allow guests to submit photographs for approval.
- Share published photographs through a gallery link and QR code.
- Display a YouTube livestream through the wedding website.

The product will use a single wedding workspace for each organiser account at a time. It is designed primarily for couples managing their own wedding, not professional wedding planners managing multiple client weddings.

## 1.2 Product Objective

Deliver a usable, secure, and responsive wedding-planning MVP that centralises the most important wedding-management activities without introducing unnecessary complexity.

## 1.3 MVP Principle

The MVP should prioritise:

1. Reliable wedding workspace creation and access.
2. Correct organiser roles and permissions.
3. Event and task management.
4. Household-based guest management and event-specific RSVP.
5. Accurate expense and payment tracking.
6. Shareable guest-facing wedding pages.
7. Controlled guest photo submissions and gallery publication.
8. Simple integrations that avoid building unnecessary infrastructure.

Advanced accounting, professional planner workflows, accommodation management, and automated wedding closure are outside the MVP.

---

# 2. Product Vision, Problem Statement and Goals

## 2.1 Problem Statement

Wedding planning involves several connected activities, but information is commonly scattered across different tools.

This creates problems such as:

- Difficulty maintaining a single source of truth.
- Repeatedly updating guest lists and invitation information.
- Confusion about which guests are invited to which events.
- Difficulty tracking RSVP responses by household.
- Inaccurate expense and payment tracking.
- Poor visibility into pending tasks.
- Difficulty sharing wedding information with guests.
- Photographs being scattered across multiple messaging groups.
- Unclear responsibilities among family members and organisers.

Make My Marriage addresses these problems through a central wedding workspace.

## 2.2 Product Vision

To provide couples with one accessible platform where they can plan, coordinate, share, and manage their wedding activities.

## 2.3 Product Goals

| ID | Goal | Expected outcome |
|---|---|---|
| G-01 | Centralised planning | Events, tasks, guests, expenses and vendors are managed in one workspace. |
| G-02 | Couple ownership | Both partners have protected Primary Admin access. |
| G-03 | Controlled collaboration | Additional organisers can work with clearly defined permissions. |
| G-04 | Guest coordination | Household invitations and event-specific RSVPs are manageable. |
| G-05 | Financial visibility | Organisers can see expense totals, payments made and outstanding balances. |
| G-06 | Guest communication | Guests can access wedding information through shareable pages. |
| G-07 | Photo collection | Guests can submit photos, and organisers can approve publication. |
| G-08 | Usability | The application works across desktop, tablet and mobile devices. |

## 2.4 Non-Goals

The MVP will not provide:

- Professional wedding planner accounts managing multiple client weddings.
- Multiple active wedding memberships for one organiser account.
- Accommodation or room allocation.
- Guest transportation or vehicle management.
- Seating arrangements.
- Catering quantity or meal management.
- Guest check-in or attendance scanning.
- Advanced accounting or bookkeeping.
- Online payment collection.
- Vendor payment processing.
- Automated vendor quotation comparison.
- Individual accounts for wedding guests.
- Native Android or iOS applications.
- Built-in livestream infrastructure.
- Real-time collaborative editing.
- Automated wedding archive and closure.
- Automated post-wedding guest-access expiry.
- Wedding ownership transfer or succession workflows.

---

# 3. Confirmed Product Decisions

The following decisions are approved and form the baseline for the MVP.

| No. | Area | Confirmed decision |
|---|---|---|
| 1 | Wedding creation | Only the Bride or Groom can create a wedding workspace. |
| 2 | Partner invitation | The creator enters partner details during setup. The system sends a Primary Admin invitation automatically. |
| 3 | Primary Admins | Both partners become protected Primary Admins once the partner accepts the invitation. |
| 4 | Organiser roles | Exactly two organiser roles: Admin and Manager. |
| 5 | Primary Admin protection | Neither Primary Admin can be removed, demoted or replaced through normal organiser management. |
| 6 | Expenses | An expense can contain multiple payment records. |
| 7 | Payment details | Payments record amount, date, method, optional reference number and notes. |
| 8 | Financial calculations | Paid-to-date and outstanding amounts are calculated automatically. |
| 9 | Guest verification | No guest email OTP in the MVP. |
| 10 | Guest sessions | No guest session-duration or session-expiry requirement in the MVP. |
| 11 | Household invitation | One household invitation link covers all events assigned to that household. |
| 12 | Gallery access | Anyone with the gallery link or QR can view and download published photos. |
| 13 | Guest uploads | The upload QR token itself authorises photo submission. No OTP or guest account is required. |
| 14 | Gallery QR | One wedding-wide gallery QR opens the gallery landing page. |
| 15 | Guest expiry | No automatic 15-day post-event guest-access expiry. |
| 16 | Wedding archive | Wedding-level archive and guest-access closure are deferred. |
| 17 | Household RSVP | Primary invitee attendance and additional attendee counts are tracked separately. Additional attendees may attend even if the primary invitee declines. |
| 18 | Permissions | Managers can create and edit ordinary records but cannot delete them. Admins can delete ordinary records and manage organisers. |
| 19 | Recovery | If both Primary Admins lose access, recovery uses a verified manual support and ownership-verification process. |

These decisions must be reflected consistently in implementation, database design, permission checks, and testing.

---

# 4. Users, Roles and Permissions

## 4.1 User Types

The application has two broad user categories.

### A. Organisers

Organisers are authenticated users who access the wedding dashboard.

They include:

- Bride
- Groom
- Additional Admins
- Managers

### B. Guests

Guests access public or token-protected wedding pages.

Guests:

- Do not need an account.
- Do not need to register.
- Do not need guest email OTP verification.
- Access information through wedding links, household invitation links, gallery links or upload QR tokens.
- Can submit RSVPs or photographs where permitted.

## 4.2 Organiser Roles

There are exactly two organiser roles:

1. Admin
2. Manager

Primary Admin is a protected membership classification, not a third role.

Both Bride and Groom have:

- `role = Admin`
- `membership_type = PRIMARY_ADMIN`

Additional organisers have:

- `role = Admin` or `Manager`
- `membership_type = ADDITIONAL_ORGANISER`

## 4.3 Primary Admin Responsibilities

Both partners are the permanent Primary Admins of their wedding workspace.

They can:

- Access the complete wedding workspace.
- Manage all planning modules.
- Invite additional organisers.
- Remove additional organisers.
- Promote or demote additional organisers.
- Delete ordinary planning records.
- Delete the wedding workspace.
- Manage wedding settings.

Neither Primary Admin can:

- Remove the other Primary Admin.
- Demote the other Primary Admin.
- Replace the other Primary Admin.
- Change the other Primary Admin's protected membership classification through normal organiser management.

The protected membership applies even when one Primary Admin performs organiser-management actions.

## 4.4 Additional Admin Responsibilities

Additional Admins can:

- Manage wedding events.
- Manage tasks.
- Manage guest households and invitations.
- Manage RSVPs.
- Manage expenses and payments.
- Manage vendors.
- Manage website content.
- Manage albums and photographs.
- Moderate guest photo submissions.
- Delete ordinary records.
- Invite and manage additional organisers.

Additional Admins cannot change or remove either protected Primary Admin.

## 4.5 Manager Responsibilities

Managers can:

- View workspace information.
- Create ordinary planning records.
- Edit ordinary planning records.
- Manage events and tasks.
- Manage guests and invitations.
- Manage RSVP-related records.
- Create and edit expenses and payments.
- Manage vendor records.
- Edit wedding website content.
- Manage albums and photographs.
- Approve or reject guest photo submissions.

Managers cannot:

- Delete ordinary records.
- Permanently delete photographs or albums.
- Delete expenses or payment records.
- Delete vendors.
- Delete events.
- Delete tasks or guest records.
- Delete the wedding workspace.
- Invite, remove, promote or demote organisers.
- Change Primary Admin membership.

A Manager may reject a guest photo submission as a moderation action. Rejection is not equivalent to permanent deletion.

## 4.6 Permission Matrix

| Action | Primary Admin | Additional Admin | Manager |
|---|---:|---:|---:|
| View dashboard | Yes | Yes | Yes |
| Create events | Yes | Yes | Yes |
| Edit events | Yes | Yes | Yes |
| Delete events | Yes | Yes | No |
| Create tasks | Yes | Yes | Yes |
| Edit tasks | Yes | Yes | Yes |
| Delete tasks | Yes | Yes | No |
| Manage guest households | Yes | Yes | Yes |
| Manage invitations | Yes | Yes | Yes |
| Manage RSVPs | Yes | Yes | Yes |
| Create expenses | Yes | Yes | Yes |
| Edit expenses | Yes | Yes | Yes |
| Delete expenses | Yes | Yes | No |
| Create payment records | Yes | Yes | Yes |
| Edit payment records | Yes | Yes | Yes |
| Delete payment records | Yes | Yes | No |
| Manage vendors | Yes | Yes | Yes |
| Delete vendors | Yes | Yes | No |
| Edit website | Yes | Yes | Yes |
| Manage albums | Yes | Yes | Yes |
| Delete albums/photos | Yes | Yes | No |
| Approve/reject photo submissions | Yes | Yes | Yes |
| Manage additional organisers | Yes | Yes | No |
| Remove another Primary Admin | No | No | No |
| Delete wedding workspace | Yes | Yes | No |

**Important:** The table's Primary Admin permissions are also the permissions of an Admin role. The protected membership classification adds restrictions that apply to both Primary Admins and cannot be overridden by another Admin.

All permissions must be validated on the server. Hiding buttons in the user interface is not sufficient.

## 4.7 Organiser Membership Rules

- One user can have only one active wedding membership at a time.
- A user with an active membership cannot join another wedding as an organiser.
- When an additional organiser is removed, their access is revoked immediately.
- A removed organiser may later join another wedding if they no longer have an active membership.
- Removal does not delete the user's account.
- Both Primary Admin memberships remain protected.
- Organiser invitations must be accepted before membership becomes active.
- Pending invitations do not count as active memberships.

## 4.8 Primary Admin Invitation

During wedding creation:

1. The creator selects Bride or Groom.
2. The creator enters the other partner's name and email.
3. The creator becomes a Primary Admin.
4. The system creates a pending Primary Admin invitation for the partner.
5. The partner receives an email invitation.
6. The partner signs in or creates an account.
7. The partner accepts the invitation.
8. The partner becomes the second protected Primary Admin.

The creator may continue setting up the workspace while the partner invitation is pending.

The relationship and identities are self-declared. The application does not independently verify the relationship beyond acceptance through the invited email.

## 4.9 Organiser Recovery

If both Primary Admins lose access:

- An additional Admin cannot automatically take over ownership.
- The user must contact support.
- Support performs manual ownership verification.
- Recovery must be documented and audited.
- Verification documents or sensitive evidence must not be exposed in general application logs.
- The recovery procedure is an operational support process, not an automated MVP feature.

Formal ownership transfer and succession are deferred.

---

# 5. MVP Scope and Later-Phase Scope

## 5.1 MVP Features

| Module | MVP inclusion |
|---|---|
| Authentication | Email/password and Google sign-in |
| Wedding workspace | Create and configure one wedding |
| Primary Admins | Creator and accepted partner |
| Organisers | Admin and Manager roles |
| Dashboard | Planning overview and key metrics |
| Events | Multiple wedding events |
| Tasks | Task creation, assignment and tracking |
| Guests | Household-based guest management |
| Invitations | One household invitation link |
| RSVP | Separate primary invitee and additional attendee tracking |
| Expenses | Expense records and multiple payment records |
| Financial summary | Total expense, paid-to-date and outstanding |
| Vendors | Vendor records and external discovery |
| Wedding website | Shareable wedding website |
| Themes | Three predefined themes |
| Gallery | Event-based albums and published photos |
| Photo uploads | Guest photo submissions with organiser approval |
| Gallery QR | One wedding-wide gallery QR |
| Upload QR | Token-based guest upload access |
| Livestream | YouTube embed |
| Settings | Wedding and module settings |

## 5.2 Later-Phase Features

The following are intentionally excluded from MVP:

- Multiple wedding workspaces per organiser account.
- Professional planner accounts.
- Accommodation management.
- Transportation management.
- Seating arrangements.
- Catering management.
- Guest check-in.
- Online payments.
- Advanced accounting.
- Budget forecasting.
- Vendor quotation comparison.
- Automated vendor payment reconciliation.
- Receipt scanning and OCR.
- Advanced financial reports and exports.
- Native mobile applications.
- Automated reminders through SMS or WhatsApp.
- Guest accounts and guest profiles.
- Automated wedding archive and unarchive.
- Automatic guest-access expiry after the wedding.
- Formal wedding ownership transfer.
- Advanced analytics.
- Real-time collaborative editing.
- Customisable website themes beyond the three MVP themes.

---

# 6. Information Architecture and Screen Inventory

## 6.1 Organiser Application

The authenticated organiser application will contain:

1. Authentication
2. Wedding setup
3. Dashboard
4. Events
5. Tasks
6. Guests
7. Invitations and RSVP
8. Expenses
9. Vendors
10. Wedding website
11. Gallery
12. Photo moderation
13. Livestream
14. Organisers
15. Wedding settings

## 6.2 Screen Inventory

| Screen | Main purpose | Key content |
|---|---|---|
| Sign up | Create organiser account | Name, email, password |
| Login | Authenticate organiser | Email/password, Google sign-in |
| Forgot password | Recover account | Email and reset flow |
| Wedding setup | Create workspace | Wedding title, partner details, date, location |
| Dashboard | Overview | Upcoming events, tasks, guests, expenses |
| Events list | View events | Event name, date, location, status |
| Event details | Manage event | Description, schedule, location, invitations |
| Task list | Manage planning work | Task title, due date, assignee, status |
| Guest list | Manage households | Household details, contact, event invitations |
| Guest details | View household | Members/count, invited events, RSVP summary |
| RSVP management | Monitor responses | Primary invitee response and additional attendees |
| Expenses list | Track spending | Expense amount, paid amount, outstanding amount |
| Expense details | Manage expense | Expense information and payment history |
| Payment form | Record payment | Amount, date, method, reference, notes |
| Vendors | Manage vendors | Vendor details and category |
| Website editor | Configure public website | Content, theme, language, visibility |
| Gallery | Manage albums | Event albums and published photos |
| Photo moderation | Review submissions | Pending, approved, rejected |
| QR management | Generate/manage QR links | Gallery-view QR and upload QR |
| Livestream | Configure livestream | YouTube URL and visibility |
| Organisers | Manage access | Admins, Managers, invitations |
| Settings | Configure wedding | Date, timezone, currency, location |

## 6.3 Guest-Facing Screens

- Wedding website landing page
- Event details
- Household invitation page
- Event-specific RSVP page
- Gallery landing page
- Album page
- Guest photo upload page
- Livestream page or section

Guest-facing content must support English and Hindi.

## 6.4 Website Themes

The MVP will provide three predefined themes:

1. Classic Indian
2. Minimal Elegant
3. Modern Celebration

The organiser can select one theme and configure supported content and visual settings.

Custom theme development is not part of the MVP.

---

# 7. Functional Requirements

Priority definitions:

- **P0:** Required for MVP release.
- **P1:** Important but may be delivered after core functionality if necessary.
- **P2:** Future enhancement.

## 7.1 Authentication and Account Management

| ID | Requirement | Priority |
|---|---|---|
| AUTH-01 | Users must be able to register using email and password. | P0 |
| AUTH-02 | Users must be able to sign in using email and password. | P0 |
| AUTH-03 | Users must be able to sign in using Google authentication. | P0 |
| AUTH-04 | Users must be able to reset forgotten passwords through email. | P0 |
| AUTH-05 | The system must prevent duplicate accounts for the same verified email identity. | P0 |
| AUTH-06 | The system must support secure sign-out. | P0 |
| AUTH-07 | Protected organiser routes must require authentication. | P0 |
| AUTH-08 | The system must enforce one active wedding membership per organiser account. | P0 |

## 7.2 Wedding Workspace Creation

| ID | Requirement | Priority |
|---|---|---|
| WED-01 | Only a Bride or Groom may create a wedding workspace. | P0 |
| WED-02 | The creator must identify their role as Bride or Groom. | P0 |
| WED-03 | The creator must enter the partner's name and email during setup. | P0 |
| WED-04 | The system must create the wedding workspace and the creator's protected Primary Admin membership. | P0 |
| WED-05 | The system must automatically send a dedicated Primary Admin invitation to the partner. | P0 |
| WED-06 | The partner must accept the invitation after signing in or creating an account before their Primary Admin membership becomes active. | P0 |
| WED-07 | The creator must be able to continue workspace setup while partner acceptance is pending. | P0 |
| WED-08 | The system must store wedding title, couple details, date and location. | P0 |
| WED-09 | The system must support a default timezone of Asia/Kolkata. | P0 |
| WED-10 | The system must support INR as the default currency. | P0 |
| WED-11 | The system must allow the organiser to edit wedding information. | P0 |
| WED-12 | The system must not allow a user to create or join another active wedding membership while already having one. | P0 |

## 7.3 Organiser Management

| ID | Requirement | Priority |
|---|---|---|
| ORG-01 | The system must support Admin and Manager roles. | P0 |
| ORG-02 | The system must distinguish Primary Admin membership from additional organiser membership. | P0 |
| ORG-03 | Both partners must have protected Primary Admin memberships after invitation acceptance. | P0 |
| ORG-04 | Neither Primary Admin may be removed or demoted through normal organiser management. | P0 |
| ORG-05 | Admins must be able to invite additional organisers by email. | P0 |
| ORG-06 | Admins must be able to assign Admin or Manager to additional organisers. | P0 |
| ORG-07 | Admins must be able to promote or demote additional organisers. | P0 |
| ORG-08 | Admins must be able to remove additional organisers. | P0 |
| ORG-09 | Managers must not access organiser-management actions. | P0 |
| ORG-10 | Removed organisers must lose workspace access immediately. | P0 |
| ORG-11 | The system must prevent an organiser from holding more than one active wedding membership. | P0 |
| ORG-12 | The system must prevent the removal of protected Primary Admin memberships. | P0 |
| ORG-13 | The system must enforce a last-Admin safeguard for additional organiser management. | P0 |
| ORG-14 | Organiser invitation acceptance must be required before membership activation. | P0 |
| ORG-15 | All organiser-management operations must be audited. | P0 |

## 7.4 Dashboard

| ID | Requirement | Priority |
|---|---|---|
| DASH-01 | The dashboard must display wedding title and key wedding details. | P0 |
| DASH-02 | The dashboard must display upcoming events. | P0 |
| DASH-03 | The dashboard must display pending and completed task counts. | P0 |
| DASH-04 | The dashboard must display guest and RSVP summaries. | P0 |
| DASH-05 | The dashboard must display total recorded expenses. | P0 |
| DASH-06 | The dashboard must display total paid-to-date. | P0 |
| DASH-07 | The dashboard must display outstanding expense balances. | P0 |
| DASH-08 | Financial labels must clearly distinguish total expense, paid amount and outstanding amount. | P0 |
| DASH-09 | The dashboard must provide navigation to all main modules. | P0 |

Dashboard metrics must be calculated from the underlying records and must not present total expense as amount paid or outstanding balance as budget remaining.

## 7.5 Event Management

| ID | Requirement | Priority |
|---|---|---|
| EVT-01 | Organisers must be able to create multiple wedding events. | P0 |
| EVT-02 | Each event must support name, description, date, start time and end time. | P0 |
| EVT-03 | Each event must support a location. | P0 |
| EVT-04 | Each event must support optional cover imagery. | P1 |
| EVT-05 | Organisers must be able to edit event details. | P0 |
| EVT-06 | Admins must be able to delete events. | P0 |
| EVT-07 | Managers must not be able to delete events. | P0 |
| EVT-08 | Events must support a lifecycle status appropriate to planning and publication. | P0 |
| EVT-09 | Events must be associated with the wedding workspace. | P0 |
| EVT-10 | The system must preserve event-to-invitation relationships when events are edited. | P0 |

Event deletion must follow the defined data-integrity and dependent-record handling rules. Event deletion is separate from any wedding-level archive process.

## 7.6 Task Management

| ID | Requirement | Priority |
|---|---|---|
| TASK-01 | Organisers must be able to create tasks. | P0 |
| TASK-02 | Tasks must support title and description. | P0 |
| TASK-03 | Tasks must support due dates. | P0 |
| TASK-04 | Tasks must support assignment to an active organiser. | P0 |
| TASK-05 | Tasks must support status tracking. | P0 |
| TASK-06 | Organisers must be able to edit tasks. | P0 |
| TASK-07 | Admins must be able to delete tasks. | P0 |
| TASK-08 | Managers must not be able to delete tasks. | P0 |
| TASK-09 | The dashboard must display relevant task summaries. | P0 |

## 7.7 Guest Household Management

| ID | Requirement | Priority |
|---|---|---|
| GST-01 | Organisers must be able to create guest household records. | P0 |
| GST-02 | Each household must have a primary invitee. | P0 |
| GST-03 | Each household must support contact information where available. | P0 |
| GST-04 | Each household must support a household size or attendee context where relevant. | P0 |
| GST-05 | Organisers must be able to edit household details. | P0 |
| GST-06 | Admins must be able to delete household records. | P0 |
| GST-07 | Managers must not be able to delete household records. | P0 |
| GST-08 | The same household may be invited to multiple wedding events. | P0 |
| GST-09 | Each household must have one invitation link covering its assigned events. | P0 |
| GST-10 | The invitation link must only expose the events assigned to that household. | P0 |
| GST-11 | The household invitation token must be revocable and regenerable. | P0 |

A household is the main invitation and RSVP unit. Additional attendees are represented as counts and do not need individual Guest records.

## 7.8 Household Invitations and RSVP

| ID | Requirement | Priority |
|---|---|---|
| RSVP-01 | Organisers must be able to assign a household to one or more events. | P0 |
| RSVP-02 | Each household-event invitation must have its own maximum party size. | P0 |
| RSVP-03 | Each event invitation must support an RSVP cutoff where configured. | P0 |
| RSVP-04 | One household invitation link must provide access to all events assigned to that household. | P0 |
| RSVP-05 | The guest must be able to view only the events assigned to their household. | P0 |
| RSVP-06 | The guest must be able to respond separately for each event. | P0 |
| RSVP-07 | The primary invitee's attendance must be recorded separately from additional attendees. | P0 |
| RSVP-08 | The guest must be able to indicate whether the primary invitee is Coming or Not Coming. | P0 |
| RSVP-09 | The guest must be able to enter the number of additional attendees. | P0 |
| RSVP-10 | Additional attendees must be permitted even when the primary invitee declines. | P0 |
| RSVP-11 | The system must validate attendee counts against the event invitation's maximum party size. | P0 |
| RSVP-12 | The system must track whether an RSVP has been submitted. | P0 |
| RSVP-13 | The system must allow an organiser to view pending and responded invitations. | P0 |
| RSVP-14 | The system must calculate total attending people accurately. | P0 |
| RSVP-15 | The system must display primary invitees attending and additional attendees separately. | P0 |
| RSVP-16 | No guest email OTP or guest account registration is required. | P0 |
| RSVP-17 | No guest session-duration or automatic session-expiry requirement applies in the MVP. | P0 |
| RSVP-18 | Revoked or regenerated household invitation links must no longer authorise access using the previous token. | P0 |

### RSVP Response Model

Each event invitation must track:

- `response_status`: Pending or Responded
- `primary_attending`: true or false, when responded
- `additional_attendees`: non-negative integer
- `responded_at`: timestamp of submission

`Pending` means no RSVP has been submitted.

`Responded` means an RSVP has been submitted. The primary invitee may be Coming or Not Coming.

The application must not use a single aggregate Attending/Declined status as the only representation of a household RSVP.

### RSVP Calculation

For each household-event invitation:

`Total attending = (primary_attending ? 1 : 0) + additional_attendees`

Maximum party size includes the primary invitee as a possible attendee.

If the primary invitee is Coming:

`Maximum additional attendees = max_party_size - 1`

If the primary invitee is Not Coming:

`Maximum additional attendees = max_party_size`

Example:

A household has a maximum party size of 4.

- Primary invitee Coming + 3 additional attendees = 4 total.
- Primary invitee Not Coming + 4 additional attendees = 4 total.
- Primary invitee Not Coming + 2 additional attendees = 2 total.

The system must not reject the third or fourth additional attendee merely because the primary invitee is not attending.

## 7.9 Expense and Payment Management

| ID | Requirement | Priority |
|---|---|---|
| EXP-01 | Organisers must be able to create expense records. | P0 |
| EXP-02 | Each expense must have a title and total expense amount. | P0 |
| EXP-03 | Each expense may be associated with a category. | P0 |
| EXP-04 | Each expense may be associated with a vendor. | P0 |
| EXP-05 | Expenses must support notes and expense dates where relevant. | P0 |
| EXP-06 | One expense must support multiple payment records. | P0 |
| EXP-07 | An expense may have zero payment records when it is unpaid. | P0 |
| EXP-08 | Each payment must record amount and payment date. | P0 |
| EXP-09 | Each payment must record a payment method. | P0 |
| EXP-10 | Supported payment methods must include Cash, UPI, Bank Transfer, Card and Other. | P0 |
| EXP-11 | Payment reference number must be optional. | P0 |
| EXP-12 | Payment notes must be optional. | P0 |
| EXP-13 | The system must calculate paid-to-date automatically. | P0 |
| EXP-14 | The system must calculate outstanding amount automatically. | P0 |
| EXP-15 | The system must prevent cumulative payment records from exceeding the expense amount. | P0 |
| EXP-16 | The system must prevent an expense amount from being reduced below the total already paid. | P0 |
| EXP-17 | Managers must be able to create and edit expenses and payment records. | P0 |
| EXP-18 | Admins must be able to delete expenses and payment records. | P0 |
| EXP-19 | Managers must not be able to delete expenses or payment records. | P0 |
| EXP-20 | Financial changes must be audited. | P0 |
| EXP-21 | The expense list and dashboard must display total expense, paid-to-date and outstanding amounts separately. | P0 |

### Expense Financial Calculations

For each expense:

`Paid to date = Sum of all valid payment records`

`Outstanding amount = Total expense amount - Paid to date`

Example:

| Field | Amount |
|---|---:|
| Total expense | ₹50,000 |
| Advance payment | ₹10,000 |
| Partial payment | ₹15,000 |
| Final payment | ₹10,000 |
| Paid to date | ₹35,000 |
| Outstanding | ₹15,000 |

### Payment Validation

- Payment amount must be greater than zero.
- Payment date is required.
- Payment method is required.
- Reference number and notes are optional.
- The sum of payments must not exceed the expense amount.
- If an expense amount is edited below the existing paid-to-date amount, the system must block the change until payment records are adjusted.
- Deleted or adjusted payment records must trigger recalculation.
- Financial calculations must be performed using reliable decimal or integer minor-unit handling, not imprecise floating-point arithmetic.

The MVP does not include online payment processing, advanced accounting, budget forecasting, quotation schedules, receipts, exports, or vendor payment reconciliation.

## 7.10 Vendor Management

| ID | Requirement | Priority |
|---|---|---|
| VEN-01 | Organisers must be able to create vendor records. | P0 |
| VEN-02 | Vendor records must support name and category. | P0 |
| VEN-03 | Vendor records must support contact details where available. | P0 |
| VEN-04 | Vendor records must support address and notes where available. | P0 |
| VEN-05 | Organisers must be able to edit vendor records. | P0 |
| VEN-06 | Admins must be able to delete vendor records. | P0 |
| VEN-07 | Managers must not be able to delete vendor records. | P0 |
| VEN-08 | The application must provide vendor discovery through an external provider where configured. | P1 |
| VEN-09 | The application must not imply that discovered vendors are verified or endorsed by MMM. | P0 |

Vendor discovery is informational. Contacting, negotiating with, booking or paying a vendor happens outside the MVP.

## 7.11 Wedding Website

| ID | Requirement | Priority |
|---|---|---|
| WEB-01 | Organisers must be able to create a shareable wedding website. | P0 |
| WEB-02 | The website must support the three predefined themes. | P0 |
| WEB-03 | The website must display couple and wedding information. | P0 |
| WEB-04 | The website must display published wedding events. | P0 |
| WEB-05 | The website must support English and Hindi content. | P0 |
| WEB-06 | English and Hindi content must be maintained separately. | P0 |
| WEB-07 | The system must not automatically translate organiser content. | P0 |
| WEB-08 | Organisers must be able to preview the website before publishing. | P0 |
| WEB-09 | Organisers must be able to publish and unpublish the website. | P0 |
| WEB-10 | Organisers must be able to configure supported public content and visibility. | P0 |
| WEB-11 | The website must not expose organiser-only information. | P0 |
| WEB-12 | The website must support access to configured RSVP and gallery pages. | P0 |

The wedding website is a shareable, unlisted web page. Its URL is not a security boundary. Anyone who receives the URL may forward it.

## 7.12 Gallery and Photo Albums

| ID | Requirement | Priority |
|---|---|---|
| GAL-01 | Organisers must be able to create photo albums. | P0 |
| GAL-02 | Albums may be associated with wedding events. | P0 |
| GAL-03 | Organisers must be able to upload photographs. | P0 |
| GAL-04 | Organisers must be able to edit album information. | P0 |
| GAL-05 | Admins must be able to delete albums and photos. | P0 |
| GAL-06 | Managers must not be able to permanently delete albums or photos. | P0 |
| GAL-07 | Published photos must be accessible through the gallery link or QR. | P0 |
| GAL-08 | Anyone with the gallery link or QR must be able to view published photos. | P0 |
| GAL-09 | Anyone with the gallery link or QR must be able to download published photos. | P0 |
| GAL-10 | The system must provide one wedding-wide gallery-view QR code. | P0 |
| GAL-11 | The gallery QR must open the gallery landing page. | P0 |
| GAL-12 | Gallery links and QR tokens must be revocable or regenerable. | P0 |
| GAL-13 | The system must distinguish gallery-view tokens from upload tokens. | P0 |

Gallery access is link-based, not restricted to invited households. Gallery links and QR codes can be forwarded. They do not establish the identity of the person viewing the photographs.

Album visibility settings must be respected. An album that is not published or is otherwise hidden must not become publicly accessible merely because a user knows its internal identifier.

## 7.13 Guest Photo Uploads and Moderation

| ID | Requirement | Priority |
|---|---|---|
| UP-01 | The system must support guest photo submissions through an upload page. | P0 |
| UP-02 | Guest uploads must be authorised by an upload QR token or its associated upload link. | P0 |
| UP-03 | Guest uploads must not require OTP or a guest account. | P0 |
| UP-04 | Guest uploads must enter Pending Approval status. | P0 |
| UP-05 | Organisers must be able to approve submissions. | P0 |
| UP-06 | Organisers must be able to reject submissions. | P0 |
| UP-07 | Approved submissions must become eligible for gallery publication. | P0 |
| UP-08 | Rejected submissions must not appear in the published gallery. | P0 |
| UP-09 | Managers may approve or reject submissions but may not permanently delete them. | P0 |
| UP-10 | Admins may permanently delete submissions. | P0 |
| UP-11 | Uploads must enforce file type, file size and quota restrictions. | P0 |
| UP-12 | Upload tokens must be revocable and regenerable. | P0 |
| UP-13 | Upload attempts must be rate-limited. | P0 |

Upload QR tokens are access credentials. Anyone who obtains a valid upload token may be able to submit photographs within its configured scope. The application must clearly communicate this limitation to organisers.

## 7.14 QR Code Management

The MVP supports two distinct QR purposes.

### A. Gallery-view QR

- One QR per wedding.
- Opens the wedding-wide gallery landing page.
- Allows viewing and downloading published photographs.
- Does not grant photo-upload permission.

### B. Guest upload QR

- Authorises photo submission.
- May be scoped to an event or album where applicable.
- Does not grant organiser access.
- Does not grant access to private organiser data.
- Must be independently revocable and regenerable.

QR tokens must be unguessable and stored securely. The system must store token hashes rather than raw token values wherever feasible.

## 7.15 YouTube Livestream

| ID | Requirement | Priority |
|---|---|---|
| LIVE-01 | Organisers must be able to configure a YouTube livestream URL. | P0 |
| LIVE-02 | The application must display the configured livestream through an embedded YouTube player where embedding is permitted. | P0 |
| LIVE-03 | The application must support organiser control over livestream visibility. | P0 |
| LIVE-04 | The application must validate the supplied URL against supported YouTube formats. | P0 |
| LIVE-05 | The application must not build its own livestream infrastructure. | P0 |

YouTube controls the livestream's availability and privacy. Unlisted livestream links may be forwarded outside the intended audience.

## 7.16 Wedding Settings and Deletion

| ID | Requirement | Priority |
|---|---|---|
| SET-01 | Organisers must be able to update wedding information. | P0 |
| SET-02 | Organisers must be able to configure supported website and gallery visibility. | P0 |
| SET-03 | Admins must be able to delete the wedding workspace. | P0 |
| SET-04 | Managers must not be able to delete the wedding workspace. | P0 |
| SET-05 | Wedding deletion must require an explicit confirmation step. | P0 |
| SET-06 | Wedding deletion must follow a defined data-deletion and storage-cleanup process. | P0 |
| SET-07 | Wedding-level archive and unarchive workflows are not required in the MVP. | P0 |
| SET-08 | The system must not automatically close guest-facing access after the final event. | P0 |

Wedding deletion is a destructive administrative action. It must not be confused with event deletion or a wedding archive feature.

---

# 8. User Journeys

## 8.1 New Wedding Creation

1. User creates an account or signs in.
2. User selects Create Wedding.
3. User identifies themselves as Bride or Groom.
4. User enters the partner's name and email.
5. User enters wedding title, date and location.
6. System creates the wedding workspace.
7. Creator receives protected Primary Admin membership.
8. System sends the partner a Primary Admin invitation.
9. Creator continues setting up the wedding.
10. Partner opens the invitation.
11. Partner signs in or creates an account.
12. Partner accepts the invitation.
13. Partner becomes the second protected Primary Admin.

## 8.2 Additional Organiser Invitation

1. Admin opens Organisers.
2. Admin enters an organiser's email.
3. Admin selects Admin or Manager.
4. System sends an invitation.
5. Invitee signs in or creates an account.
6. Invitee accepts.
7. System checks that the invitee has no other active wedding membership.
8. Membership becomes active.
9. The organiser receives access according to their role.

## 8.3 Event Creation

1. Organiser opens Events.
2. Organiser creates an event.
3. Organiser enters name, date, time and location.
4. Organiser saves the event.
5. Event appears in the event list and dashboard.
6. Organiser can assign guest households to the event.

## 8.4 Household Invitation and RSVP

1. Organiser creates a household record.
2. Organiser identifies the primary invitee.
3. Organiser assigns the household to one or more events.
4. Organiser defines the maximum party size for each event.
5. System generates one household invitation link.
6. Organiser shares the link with the household.
7. Guest opens the link without OTP.
8. Guest sees only their assigned events.
9. Guest selects an event.
10. Guest responds whether the primary invitee is Coming or Not Coming.
11. Guest enters the number of additional attendees.
12. System validates the response against that event's maximum party size.
13. Guest submits the RSVP.
14. Organiser sees the response in the dashboard.

## 8.5 Household RSVP Edge Case

Example: A household is invited to a wedding event with a maximum party size of four.

1. The primary invitee selects Not Coming.
2. The guest enters two additional attendees.
3. The system calculates total attendance as two.
4. The response is stored as Responded.
5. The organiser sees zero primary invitees attending and two additional attendees.

## 8.6 Expense and Payment Tracking

1. Organiser creates an expense.
2. Organiser enters the total expense amount.
3. Organiser optionally associates a vendor and category.
4. Organiser records an advance payment.
5. System updates paid-to-date and outstanding amounts.
6. Organiser records a second payment.
7. System recalculates the totals.
8. Organiser can view the payment history under the expense.
9. Admin can delete an incorrect payment record.
10. System recalculates financial totals and audits the change.

## 8.7 Guest Photo Upload

1. Organiser generates an upload QR token.
2. Organiser shares the QR with guests.
3. Guest scans the QR.
4. Upload page opens.
5. Guest selects photographs.
6. System validates the files and upload limits.
7. Guest submits the photographs.
8. System stores the submissions as Pending Approval.
9. Organiser reviews the submissions.
10. Organiser approves or rejects them.
11. Approved photographs become eligible for publication.

## 8.8 Gallery Viewing

1. Organiser publishes photographs.
2. System provides the wedding-wide gallery QR and link.
3. Guest scans the QR or opens the link.
4. Gallery landing page opens without OTP.
5. Guest views published albums and photographs.
6. Guest can download published photographs.

## 8.9 Livestream Viewing

1. Organiser enters the YouTube livestream URL.
2. Organiser configures its visibility.
3. Website displays the embedded player where available.
4. Guest opens the livestream section.
5. Guest watches through YouTube.

## 8.10 Primary Admin Recovery

1. Both Primary Admins lose access.
2. A claimant contacts support.
3. Support requests ownership evidence.
4. Support performs manual verification.
5. Support records the verification outcome.
6. Support restores or updates access through the authorised operational process.
7. The recovery action is audited.

No automatic ownership takeover by an additional Admin is provided.

---

# 9. Business Rules

## 9.1 Wedding Workspace Rules

1. Only a Bride or Groom may create a wedding.
2. One wedding workspace is associated with one couple.
3. The creator becomes a protected Primary Admin.
4. The other partner becomes a protected Primary Admin only after accepting the invitation.
5. A pending partner invitation does not prevent the creator from continuing setup.
6. An organiser account may have only one active wedding membership.
7. A wedding workspace is not a professional planner multi-client workspace.

## 9.2 Organiser Rules

1. Organiser roles are Admin and Manager.
2. Primary Admin is a protected membership classification.
3. Both Primary Admins have the Admin role.
4. Neither Primary Admin can be removed or demoted through normal organiser management.
5. Admins manage additional organisers.
6. Managers cannot manage organisers.
7. Managers cannot delete ordinary records.
8. Admins can delete ordinary records.
9. Managers may reject photo submissions as a moderation action.
10. All permission checks must be enforced server-side.
11. Removing an additional organiser immediately revokes workspace access.

## 9.3 Event Rules

1. A wedding may contain multiple events.
2. Events belong to one wedding workspace.
3. Event invitations are separate from the household's overall invitation link.
4. Event deletion must follow data-integrity rules.
5. Wedding-level archive and closure are not MVP requirements.

## 9.4 Guest and Invitation Rules

1. Guests do not require accounts.
2. Guest email OTP is not required.
3. One household invitation link covers all events assigned to that household.
4. Each household-event invitation stores its own party-size limit and RSVP.
5. A household invitation token must not expose another household's data.
6. Invitation tokens must be revocable and regenerable.
7. No fixed guest session duration is required.
8. No automatic post-event guest-access expiry is required.

## 9.5 RSVP Rules

1. The primary invitee is tracked separately from additional attendees.
2. The primary invitee may be Coming or Not Coming.
3. Additional attendees may attend even if the primary invitee declines.
4. Additional attendees are stored as a count, not separate Guest records.
5. Maximum party size is defined per event invitation.
6. Maximum party size includes the primary invitee as a possible attendee.
7. If the primary invitee attends, the additional attendee limit is `max_party_size - 1`.
8. If the primary invitee does not attend, the additional attendee limit is `max_party_size`.
9. A response is Pending until submitted.
10. A submitted response is Responded.
11. Total attendance is calculated from the primary invitee and additional attendees.

## 9.6 Expense and Payment Rules

1. One expense may have zero or multiple payment records.
2. Each payment belongs to exactly one expense.
3. Payment amounts must be greater than zero.
4. Payment totals cannot exceed the expense amount.
5. Expense amount cannot be reduced below paid-to-date.
6. Paid-to-date is the sum of valid payment records.
7. Outstanding amount is expense amount minus paid-to-date.
8. Financial calculations must update whenever an expense or payment changes.
9. Managers can create and edit payment records.
10. Admins can delete payment records.
11. All financial changes must be audited.

## 9.7 Gallery and Upload Rules

1. Published gallery photos are accessible to anyone with the gallery link or QR.
2. Gallery access does not require OTP.
3. Gallery-view permission does not grant upload permission.
4. Upload permission is granted by a valid upload token.
5. Uploads require organiser approval before publication.
6. Upload tokens must be revocable and regenerable.
7. Gallery-view and upload QR tokens must be distinct in purpose.
8. Album visibility controls must be respected.
9. Gallery links may be forwarded and are not identity verification.

## 9.8 Guest Access and Wedding Lifecycle

1. Guest-facing pages remain available according to their publication, visibility and token settings.
2. Links remain usable until revoked, regenerated, unpublished or otherwise disabled.
3. There is no automatic 15-day expiry after the final event.
4. There is no wedding archive-triggered guest-access closure.
5. Wedding archive and unarchive functionality are deferred.

## 9.9 Recovery Rules

1. Additional Admins cannot automatically take over ownership if both Primary Admins lose access.
2. Support performs manual ownership verification.
3. Recovery actions are audited.
4. Sensitive verification documents must not be exposed in general logs.

---

# 10. Conceptual Data Model

This section defines the product-level entities and relationships. Detailed field types, indexes, validation schemas, collection design and implementation-specific constraints will be specified in the Database Design Document.

## 10.1 Core Entities

### 1. User

Represents an authenticated organiser account.

Suggested attributes:

- `id`
- `name`
- `email`
- `email_verified_at`
- `password_hash` where applicable
- `auth_provider`
- `created_at`
- `updated_at`

A user may have only one active wedding membership.

### 2. Wedding

Represents one wedding workspace.

Suggested attributes:

- `id`
- `title`
- `bride_name`
- `groom_name`
- `bride_user_id`
- `groom_user_id`
- `wedding_date`
- `location`
- `timezone`
- `currency`
- `created_by`
- `created_at`
- `updated_at`

The creator and partner references must be consistent with the two Primary Admin memberships.

The wedding entity does not require an MVP wedding archive or post-event guest-expiry status.

### 3. WeddingMembership

Represents an active or historical organiser membership.

Suggested attributes:

- `id`
- `wedding_id`
- `user_id`
- `role`: `ADMIN` or `MANAGER`
- `membership_type`: `PRIMARY_ADMIN` or `ADDITIONAL_ORGANISER`
- `status`
- `joined_at`
- `removed_at`
- `created_at`
- `updated_at`

Rules:

- Both accepted partners have `role = ADMIN`.
- Both accepted partners have `membership_type = PRIMARY_ADMIN`.
- Additional organisers have `membership_type = ADDITIONAL_ORGANISER`.
- A user cannot have more than one active wedding membership.
- Primary Admin membership cannot be removed or demoted through ordinary organiser-management operations.

### 4. OrganiserInvitation

Represents an invitation to join a wedding workspace.

Suggested attributes:

- `id`
- `wedding_id`
- `email`
- `name`
- `invitation_type`: `PRIMARY_PARTNER` or `ADDITIONAL_ORGANISER`
- `assigned_role`
- `invitation_token_hash`
- `status`
- `invited_by`
- `expires_at` where an invitation expiry policy is configured
- `accepted_at`
- `revoked_at`
- `created_at`
- `updated_at`

Rules:

- A `PRIMARY_PARTNER` invitation has a fixed Admin role.
- Accepting a valid Primary Partner invitation creates a protected Primary Admin membership.
- Additional organiser invitations may assign Admin or Manager.
- Primary Admin invitations cannot be converted into ordinary Manager invitations.
- Invitation acceptance must validate account membership constraints.

### 5. WeddingEvent

Represents an individual wedding event.

Suggested attributes:

- `id`
- `wedding_id`
- `name`
- `description`
- `event_date`
- `start_time`
- `end_time`
- `location`
- `status`
- `created_by`
- `updated_by`
- `created_at`
- `updated_at`
- `deleted_at` where soft deletion is implemented

### 6. Task

Represents a planning task.

Suggested attributes:

- `id`
- `wedding_id`
- `event_id` where applicable
- `title`
- `description`
- `due_date`
- `assigned_to`
- `status`
- `created_by`
- `updated_by`
- `created_at`
- `updated_at`
- `deleted_at` where applicable

### 7. Guest

Represents a household and its primary invitee.

Suggested attributes:

- `id`
- `wedding_id`
- `household_name`
- `primary_invitee_name`
- `contact_email`
- `contact_phone`
- `invitation_token_hash`
- `invitation_status`
- `token_revoked_at`
- `token_generated_at`
- `created_by`
- `updated_by`
- `created_at`
- `updated_at`

Rules:

- The household invitation token is stored at household level.
- The token covers all event invitations belonging to the household.
- The token must not be stored separately on each event invitation.
- Raw tokens must not be stored in plaintext where avoidable.
- Revoked or regenerated tokens must no longer authorise access.

### 8. GuestEventInvitation

Represents the invitation of a household to one specific event.

Suggested attributes:

- `id`
- `wedding_id`
- `guest_id`
- `event_id`
- `max_party_size`
- `response_status`: `PENDING` or `RESPONDED`
- `primary_attending`
- `additional_attendees`
- `cutoff_at`
- `responded_at`
- `created_at`
- `updated_at`

Rules:

- Each record represents one household-event invitation.
- There is no separate household invitation token on this entity.
- `primary_attending` is required once the RSVP has been submitted.
- `additional_attendees` is a non-negative integer.
- A Pending response has not yet been submitted.
- A Responded record contains the primary invitee response and additional attendee count.
- Total attendance is derived rather than independently maintained as an editable field.

### 9. Expense

Represents one expense obligation.

Suggested attributes:

- `id`
- `wedding_id`
- `event_id` where applicable
- `vendor_id` where applicable
- `title`
- `category`
- `description`
- `total_amount`
- `expense_date`
- `notes`
- `created_by`
- `updated_by`
- `created_at`
- `updated_at`
- `deleted_at` where applicable

Paid-to-date and outstanding amounts must be derived from valid Payment records or maintained through a safely consistent calculated mechanism.

They must not become independently editable financial values.

### 10. Payment

Represents an individual payment against an expense.

Suggested attributes:

- `id`
- `expense_id`
- `amount`
- `payment_date`
- `payment_method`
- `reference_number`
- `notes`
- `created_by`
- `updated_by`
- `created_at`
- `updated_at`
- `deleted_at` where applicable

Supported payment methods:

- `CASH`
- `UPI`
- `BANK_TRANSFER`
- `CARD`
- `OTHER`

Rules:

- Each payment belongs to one expense.
- Payment amount must be greater than zero.
- Cumulative payments cannot exceed the expense total.
- Deleting or changing a payment requires recalculation and audit logging.

### 11. Vendor

Represents a vendor record.

Suggested attributes:

- `id`
- `wedding_id`
- `name`
- `category`
- `phone`
- `email`
- `address`
- `notes`
- `external_reference` where applicable
- `created_by`
- `updated_by`
- `created_at`
- `updated_at`
- `deleted_at` where applicable

### 12. WeddingWebsite

Represents the public wedding website configuration.

Suggested attributes:

- `id`
- `wedding_id`
- `slug`
- `theme`
- `is_published`
- `visibility_settings`
- `content_en`
- `content_hi`
- `created_at`
- `updated_at`

English and Hindi content must be independently maintained.

### 13. PhotoAlbum

Represents an event or wedding photo album.

Suggested attributes:

- `id`
- `wedding_id`
- `event_id` where applicable
- `title`
- `description`
- `visibility`
- `status`
- `created_by`
- `updated_by`
- `created_at`
- `updated_at`
- `deleted_at` where applicable

### 14. Photo

Represents an uploaded or organiser-added photograph.

Suggested attributes:

- `id`
- `wedding_id`
- `album_id`
- `storage_key`
- `original_filename`
- `mime_type`
- `file_size`
- `upload_source`
- `moderation_status`
- `uploaded_by` where applicable
- `approved_by` where applicable
- `approved_at`
- `created_at`
- `updated_at`
- `deleted_at` where applicable

Moderation statuses:

- `PENDING`
- `APPROVED`
- `REJECTED`

### 15. QrLink

Represents a QR-accessible link.

Suggested attributes:

- `id`
- `wedding_id`
- `purpose`: `GALLERY_VIEW` or `PHOTO_UPLOAD`
- `event_id` where applicable
- `album_id` where applicable
- `token_hash`
- `status`
- `created_by`
- `created_at`
- `revoked_at`
- `updated_at`

Rules:

- Gallery-view QR is wedding-wide.
- The gallery-view QR opens the gallery landing page.
- Upload QR may be scoped to an event or album.
- Gallery-view and upload tokens have separate permissions.
- QR tokens must be unguessable, stored securely and revocable.
- Only one active wedding-wide gallery-view QR should exist at a time. Regenerating it revokes the previous active token.

### 16. Livestream

Represents livestream configuration.

Suggested attributes:

- `id`
- `wedding_id`
- `event_id` where applicable
- `youtube_url`
- `is_enabled`
- `visibility`
- `created_by`
- `updated_by`
- `created_at`
- `updated_at`

### 17. AuditLog

Represents important actions performed within the workspace.

Suggested attributes:

- `id`
- `wedding_id`
- `actor_user_id` where applicable
- `action`
- `entity_type`
- `entity_id`
- `metadata`
- `created_at`

Audit coverage must include:

- Organiser invitations and membership changes.
- Primary Admin invitation acceptance.
- Expense changes.
- Payment creation, editing and deletion.
- Wedding deletion.
- Photo moderation and deletion.
- QR token generation and revocation.
- Manual recovery actions.

Audit metadata must not contain passwords, raw access tokens or sensitive ownership-verification documents.

## 10.2 Key Entity Relationships

- One Wedding has two intended Primary Admin memberships once both partners accept.
- One Wedding has multiple additional organiser memberships.
- One Wedding has multiple events.
- One Wedding has multiple tasks.
- One Wedding has multiple Guest households.
- One Guest household has multiple GuestEventInvitation records.
- Each GuestEventInvitation belongs to one Guest household and one WeddingEvent.
- One Wedding has multiple expenses.
- One Expense has zero or multiple Payment records.
- One Wedding has multiple vendors.
- One Wedding has one website configuration.
- One Wedding has multiple photo albums.
- One PhotoAlbum has multiple photographs.
- One Wedding has a wedding-wide gallery-view QR and may have multiple upload QR links.
- One Wedding may have livestream configuration for one or more events.

## 10.3 Important Data Integrity Constraints

The implementation must enforce:

1. A user's active wedding membership is unique.
2. A household cannot have duplicate active invitations for the same event unless an explicit replacement workflow is used.
3. A guest household invitation token is unique and revocable.
4. RSVP attendee counts cannot exceed the event invitation's maximum party size.
5. An expense's cumulative payment amount cannot exceed its total amount.
6. An expense cannot be reduced below its paid-to-date amount.
7. Payment records must belong to an existing expense in the same wedding.
8. Wedding, event, guest, album, photo and QR records must be scoped to the correct wedding.
9. Gallery-view tokens cannot authorise uploads.
10. Upload tokens cannot grant organiser or private gallery-management access.
11. Primary Admin protection must be enforced independently of the role field.
12. Permission and ownership checks must be applied on the server.

---

# 11. Integrations

## 11.1 Authentication

Supported authentication methods:

- Email and password.
- Google sign-in.

Authentication must be handled by a secure authentication provider or framework integration.

## 11.2 Email Delivery

Email delivery is required for:

- Account-related emails.
- Password reset.
- Primary Admin partner invitation.
- Additional organiser invitations.
- Relevant invitation notifications.

The final email provider is an implementation decision.

Guest OTP email delivery is not required.

## 11.3 Vendor Discovery

Google Places API (New) is the proposed vendor-discovery integration.

The implementation must verify:

- Current API availability.
- Pricing and usage limits.
- Applicable terms of service.
- Attribution requirements.
- Data storage and display restrictions.

Vendor discovery must not be represented as vendor verification or endorsement.

## 11.4 Image and File Storage

The application requires storage for:

- Wedding cover images.
- Website imagery.
- Event photographs.
- Guest photo submissions.

The storage solution must support secure upload, retrieval, deletion and access control.

Storage credentials and private storage locations must never be exposed to unauthorised users.

## 11.5 YouTube

YouTube provides livestream hosting.

MMM only stores and embeds the organiser-supplied supported YouTube URL.

MMM does not build or operate video infrastructure.

---

# 12. Non-Functional Requirements

## 12.1 Security

- All organiser routes must require authentication.
- All workspace data must be scoped to the correct wedding.
- Role and membership permissions must be enforced server-side.
- Primary Admin protection must be enforced server-side.
- Access tokens must be unguessable.
- Token hashes should be stored instead of raw tokens.
- Tokens must be revocable and regenerable.
- Sensitive data must not appear in application logs.
- Passwords must be securely hashed.
- Input must be validated and sanitised.
- Uploads must be validated for allowed file types and sizes.
- Rate limits must protect sensitive endpoints.
- Destructive actions must require suitable confirmation.
- Security-sensitive operations must be audited.

## 12.2 Privacy

- Organiser data must not be publicly exposed.
- Guest-facing pages must expose only intended published information.
- Household invitation links must expose only that household's assigned events.
- Gallery links intentionally provide link-based access to published photographs.
- Anyone with a valid gallery link or QR may view and download published photographs.
- Gallery links and upload QR tokens may be forwarded.
- The application must not imply that these links verify guest identity.
- Guest uploads must remain unpublished until approved.
- No guest OTP or guest account is required.
- No automatic post-event access expiry is required.
- Wedding-level archive and guest-access closure are deferred.

## 12.3 Performance

The application should:

- Load dashboard and common management screens efficiently.
- Avoid unnecessary repeated database requests.
- Optimise large image delivery.
- Paginate large guest, expense and photo lists where appropriate.
- Avoid loading every wedding photograph at once.
- Use appropriate image sizes and formats.
- Provide loading and error states for data-dependent screens.

## 12.4 Responsiveness

The application must support:

- Desktop.
- Laptop.
- Tablet.
- Mobile browser.

The organiser dashboard must remain usable on smaller screens.

## 12.5 Reliability and Data Integrity

- Payment totals must remain accurate.
- RSVP calculations must remain accurate.
- Organiser access must be revoked immediately after removal.
- Failed email delivery must not silently activate an invitation.
- Token regeneration must invalidate the previous token.
- Upload failures must not create incomplete published photographs.
- Related records must be handled consistently when a parent record is deleted.
- Important operations must provide clear success or failure feedback.

## 12.6 Accessibility and Usability

- Forms must have clear labels.
- Validation errors must be understandable.
- Interactive controls must be keyboard accessible.
- Colour must not be the only way to communicate status.
- Text must remain readable on mobile devices.
- Destructive actions must be clearly identified.
- Financial figures must have clear labels and currency formatting.

## 12.7 Maintainability

The product should be organised into clearly separated functional modules.

Core business rules must not depend solely on user-interface logic.

Validation, permissions, financial calculations and RSVP calculations must be reusable and testable.

---

# 13. Product Metrics

The MVP should track operational metrics that help evaluate product usage and reliability.

| Area | Metric |
|---|---|
| Activation | Number of wedding workspaces created |
| Partner onboarding | Percentage of partner invitations accepted |
| Organiser collaboration | Number of additional organisers invited and accepted |
| Planning | Number of events created |
| Task management | Number of tasks completed |
| Guest management | Number of households added |
| Invitations | Number of household invitations generated |
| RSVP | Percentage of event invitations responded to |
| Attendance | Total primary invitees attending |
| Attendance | Total additional attendees |
| Expenses | Total recorded expense amount |
| Payments | Total amount paid across expenses |
| Outstanding | Total outstanding expense amount |
| Vendors | Number of vendor records created |
| Website | Number of published wedding websites |
| Gallery | Number of published photographs |
| Uploads | Number of guest photo submissions |
| Moderation | Approval and rejection counts |
| Reliability | Failed uploads, invitation failures and application errors |

Metrics must not expose unnecessary personal information.

Financial metrics must be derived from the actual expense and payment records.

RSVP metrics must distinguish primary invitees from additional attendees.

---

# 14. MVP Acceptance Criteria and Release Gate

The MVP is ready for release only when all P0 requirements have been implemented and verified.

## 14.1 Authentication and Workspace

- [ ] Users can register and sign in.
- [ ] Google sign-in works.
- [ ] Password recovery works.
- [ ] Only Bride or Groom can create a wedding.
- [ ] Creator becomes a protected Primary Admin.
- [ ] Partner invitation is sent automatically.
- [ ] Partner can accept the invitation and become the second protected Primary Admin.
- [ ] Creator can continue setup while partner acceptance is pending.
- [ ] One active wedding membership per organiser account is enforced.

## 14.2 Organiser Management

- [ ] Admin and Manager roles work correctly.
- [ ] Primary Admin membership is distinct from the role.
- [ ] Neither Primary Admin can be removed or demoted by the other.
- [ ] Admins can manage additional organisers.
- [ ] Managers cannot manage organisers.
- [ ] Removed organisers immediately lose access.
- [ ] Server-side permission checks prevent unauthorised operations.
- [ ] Additional Admin last-Admin safeguards work.

## 14.3 Events and Tasks

- [ ] Multiple events can be created.
- [ ] Event details can be edited.
- [ ] Admins can delete events.
- [ ] Managers cannot delete events.
- [ ] Tasks can be created, assigned, edited and completed.
- [ ] Managers cannot delete tasks.

## 14.4 Guests and RSVP

- [ ] Household records can be created and edited.
- [ ] A household can be assigned to multiple events.
- [ ] One household invitation link covers all assigned events.
- [ ] The link exposes only the household's assigned events.
- [ ] No guest OTP is required.
- [ ] Primary invitee attendance is stored separately.
- [ ] Additional attendees are stored as a count.
- [ ] Additional attendees can attend when the primary invitee declines.
- [ ] Maximum party size validation works for both primary-attending states.
- [ ] Pending and Responded states work correctly.
- [ ] Event totals show primary invitees and additional attendees separately.
- [ ] Token revocation and regeneration invalidate old links.

## 14.5 Expenses and Payments

- [ ] An expense can exist without payment records.
- [ ] An expense can have multiple payment records.
- [ ] Each payment records amount, date and method.
- [ ] Optional reference and notes can be stored.
- [ ] Supported payment methods work.
- [ ] Paid-to-date is calculated correctly.
- [ ] Outstanding amount is calculated correctly.
- [ ] Cumulative payment cannot exceed the expense amount.
- [ ] Expense amount cannot be reduced below paid-to-date.
- [ ] Payment changes recalculate financial totals.
- [ ] Managers can create and edit payment records.
- [ ] Managers cannot delete payment records.
- [ ] Admins can delete payment records.
- [ ] Financial changes are audited.
- [ ] Dashboard and expense list display correct financial labels.

## 14.6 Website and Gallery

- [ ] Wedding website can be configured and published.
- [ ] All three themes are available.
- [ ] English and Hindi content can be maintained separately.
- [ ] Organiser-only data is not exposed publicly.
- [ ] Gallery link and QR open published gallery content.
- [ ] Gallery access does not require OTP.
- [ ] Published photos can be downloaded.
- [ ] One wedding-wide gallery QR opens the gallery landing page.
- [ ] Gallery-view QR does not authorise uploads.
- [ ] Upload QR authorises photo submission without OTP.
- [ ] Guest submissions remain Pending Approval.
- [ ] Organisers can approve or reject submissions.
- [ ] Managers cannot permanently delete photos or albums.
- [ ] Admins can delete photos and albums.
- [ ] Gallery and upload tokens can be revoked and regenerated.
- [ ] Upload validation and rate limits work.

## 14.7 Livestream and Settings

- [ ] Supported YouTube URLs can be configured.
- [ ] Livestream visibility can be controlled.
- [ ] Supported livestreams display through the embedded player.
- [ ] Admins can delete the wedding workspace.
- [ ] Managers cannot delete the wedding workspace.
- [ ] Wedding deletion requires explicit confirmation.
- [ ] The application does not automatically expire guest access after the final event.
- [ ] The application does not automatically close guest access through a wedding archive process.

## 14.8 Security and Quality

- [ ] Cross-wedding access attempts are rejected.
- [ ] Unauthorised role actions are rejected server-side.
- [ ] Invalid or revoked tokens are rejected.
- [ ] Upload file validation works.
- [ ] Rate limits work on sensitive endpoints.
- [ ] Sensitive credentials and tokens are not exposed in logs.
- [ ] Critical calculations have automated tests.
- [ ] Main organiser and guest journeys pass end-to-end testing.
- [ ] Mobile and desktop layouts are usable.
- [ ] Error and empty states are handled.

---

# 15. Test Strategy

Testing must cover unit, integration, permission, security and end-to-end behaviour.

## 15.1 Authentication Tests

- Register using valid details.
- Reject invalid registration data.
- Reject duplicate email registration.
- Sign in successfully.
- Reject invalid credentials.
- Reset password.
- Sign in with Google.
- Reject unauthenticated access to protected routes.

## 15.2 Wedding and Primary Admin Tests

- Create a wedding as Bride.
- Create a wedding as Groom.
- Reject creation when the creator does not select Bride or Groom.
- Verify creator becomes a protected Primary Admin.
- Verify partner invitation is generated.
- Verify partner acceptance activates the second Primary Admin.
- Verify partner invitation pending does not block creator setup.
- Verify an invalid or revoked partner invitation cannot be accepted.
- Verify the two Primary Admins cannot remove or demote one another.
- Verify Primary Admin membership cannot be changed through normal organiser-management endpoints.

## 15.3 Organiser Permission Tests

- Admin invites an additional Admin.
- Admin invites a Manager.
- Manager cannot invite organisers.
- Manager cannot remove organisers.
- Manager cannot promote or demote organisers.
- Admin can remove an additional organiser.
- Removed organiser cannot access the wedding.
- Removed organiser may join another wedding if no active membership remains.
- User cannot hold two active wedding memberships.
- An additional Admin cannot remove either Primary Admin.
- Last-Admin safeguards prevent invalid membership changes.

## 15.4 Event and Task Tests

- Create multiple events.
- Edit event details.
- Delete event as Admin.
- Reject event deletion as Manager.
- Create and edit tasks.
- Assign tasks to active organisers.
- Complete tasks.
- Reject task deletion as Manager.
- Confirm task and event data remain scoped to the correct wedding.

## 15.5 Guest and RSVP Tests

- Create a household.
- Invite a household to three events.
- Generate one household invitation link.
- Open the link and verify that all three assigned events are visible.
- Verify unassigned events are not visible.
- Submit an RSVP for only one event.
- Verify the other event invitations remain Pending.
- Submit primary invitee Coming with additional attendees.
- Submit primary invitee Not Coming with additional attendees.
- Verify primary invitee decline does not force additional attendee count to zero.
- Reject an attendee count exceeding the maximum.
- Verify the maximum calculation changes based on primary invitee attendance.
- Verify Pending means no submitted response.
- Verify Responded means an RSVP has been submitted.
- Verify total attendance calculations.
- Revoke the household invitation token.
- Verify the previous link no longer works.
- Regenerate the token and verify the new link works.
- Verify no OTP is requested.
- Verify guest access does not depend on a fixed session-duration rule.

## 15.6 Expense and Payment Tests

- Create an unpaid expense.
- Verify paid-to-date is zero.
- Verify outstanding equals total expense.
- Add an advance payment.
- Add a partial payment.
- Add a final payment.
- Verify paid-to-date equals the sum of payments.
- Verify outstanding equals expense minus paid-to-date.
- Reject zero or negative payment amounts.
- Reject a cumulative payment greater than the expense amount.
- Reject an expense reduction below paid-to-date.
- Edit a payment and verify recalculation.
- Delete a payment as Admin and verify recalculation.
- Reject payment deletion as Manager.
- Verify audit records for financial changes.
- Verify dashboard totals match the expense records.

## 15.7 Website and Gallery Tests

- Publish and unpublish the website.
- Verify supported themes.
- Verify English and Hindi content independently.
- Verify unpublished content is not publicly accessible.
- Open a published gallery using its link.
- Open a published gallery using its QR.
- Verify gallery access does not request OTP.
- Verify published photos can be downloaded.
- Verify unpublished albums are not exposed.
- Verify gallery-view tokens cannot authorise uploads.
- Verify a revoked gallery token no longer works.
- Verify regenerated gallery QR invalidates the previous active QR.

## 15.8 Upload Tests

- Open upload page using a valid upload QR.
- Verify upload works without OTP.
- Reject invalid upload tokens.
- Reject unsupported file types.
- Reject files above the configured size limit.
- Enforce upload quotas and rate limits.
- Verify uploads enter Pending Approval.
- Approve a submission and verify publication eligibility.
- Reject a submission and verify it remains unpublished.
- Verify Managers cannot permanently delete submissions.
- Verify Admins can delete submissions.
- Verify upload tokens cannot access organiser-only data.

## 15.9 Livestream Tests

- Accept a supported YouTube URL.
- Reject unsupported or malformed URLs.
- Verify visibility settings.
- Verify the embedded player behaves correctly when YouTube permits embedding.
- Verify the application handles unavailable or disabled streams gracefully.

## 15.10 Security Tests

- Attempt cross-wedding data access.
- Attempt unauthorised organiser operations.
- Attempt to change Primary Admin membership.
- Attempt to reuse revoked tokens.
- Attempt to access unpublished photographs.
- Attempt upload using a gallery-view token.
- Attempt gallery access using an upload-only token.
- Attempt to exceed rate limits.
- Verify sensitive information is not exposed in logs.

---

# 16. Risks and Mitigation

| Risk | Impact | Mitigation |
|---|---|---|
| Primary Admin invitation is not accepted | Only one protected partner account is active | Allow creator to continue setup and show pending invitation status. |
| Primary Admin loses access | Ownership and management may become difficult | Use a documented manual support recovery process. |
| Incorrect role checks | Unauthorised changes or deletion | Centralise and test server-side permission enforcement. |
| Household RSVP confusion | Incorrect event attendance | Track primary invitee and additional attendees separately. |
| Invalid party-size calculations | Overbooking or incorrect headcount | Validate calculations using the primary attendance state. |
| Incorrect payment calculations | Financial misunderstanding | Derive paid and outstanding amounts from payment records and validate every change. |
| Duplicate payments | Inflated paid-to-date | Validate payment totals and audit changes. |
| Invitation link forwarding | Unintended access to household invitation details | Use unguessable tokens, narrow household scope, revocation and rate limits. |
| Gallery link forwarding | Photographs can be viewed by unintended people | Clearly communicate link-based access and provide revocation controls. |
| Upload QR forwarding | Unintended photo submissions | Use scoped tokens, quotas, file validation, rate limits and moderation. |
| Inappropriate uploaded content | Unwanted public photographs | Keep uploads unpublished until organiser approval. |
| Large photo uploads | Storage and performance costs | Enforce file size, format and quota restrictions. |
| Vendor API cost changes | Unexpected integration costs | Check pricing and usage limits before release. |
| Email delivery failure | Invitation delays | Track delivery failures and allow invitation resending. |
| YouTube availability changes | Livestream may not work | Use YouTube embedding and provide a graceful unavailable state. |
| Public website URL sharing | Wedding information may be forwarded | Make visibility clear and avoid exposing organiser-only data. |
| Unclear deletion behaviour | Orphaned records or inaccessible files | Define parent-child deletion behaviour and storage cleanup. |

---

# 17. Assumptions and Constraints

## 17.1 Assumptions

1. The product is designed primarily for couples managing their own wedding.
2. A wedding has one Bride and one Groom as its two intended Primary Admins.
3. The creator self-identifies as Bride or Groom.
4. Partner identity and relationship are self-declared.
5. Partner acceptance is required to activate the partner's Primary Admin membership.
6. Guests do not require accounts.
7. Guests can access invitation, RSVP and gallery pages through links.
8. One household may be invited to multiple events.
9. One household invitation link covers all assigned events.
10. RSVP is recorded separately for each event.
11. Additional attendees are tracked as counts.
12. Financial amounts use INR by default.
13. The wedding timezone defaults to Asia/Kolkata.
14. Email is the primary transactional notification channel.
15. Guest photo submissions require organiser approval.
16. Gallery viewing is link-based and may be shared.
17. Upload QR tokens grant upload permission within their defined scope.
18. YouTube handles livestream hosting.
19. The organiser dashboard is English-only.
20. Public-facing website and RSVP content support English and Hindi.

## 17.2 Constraints

- MVP is web-only.
- One active wedding membership per organiser account.
- No professional multi-wedding planner workflow.
- No guest OTP.
- No guest session-duration requirement.
- No automatic post-event guest-access expiry.
- No wedding-level archive or unarchive workflow.
- No online payment processing.
- No advanced accounting.
- No native mobile application.
- No custom theme builder.

---

# 18. Open Implementation Decisions

The product requirements are frozen for MVP. The following items are implementation or operational decisions that must be resolved during System Design, Database Design or release planning. They do not reopen the confirmed product decisions in this PRD.

| No. | Decision | Required resolution |
|---|---|---|
| 1 | Email provider | Select provider, configure sender domain and delivery monitoring. |
| 2 | Storage provider | Finalise storage configuration, access policy and lifecycle handling. |
| 3 | Upload limits | Define maximum image size, supported formats and per-wedding quotas. |
| 4 | Public URL format | Finalise wedding website, household invitation, gallery and upload URL patterns. |
| 5 | RSVP cutoff | Define default cutoff behaviour and whether organisers can configure it per event invitation. |
| 6 | Website event privacy | Define which event fields can be publicly displayed and how visibility settings work. |
| 7 | Photo retention | Define retention and permanent-deletion behaviour for rejected and deleted photographs. |
| 8 | Data export and account deletion | Define how organiser data is exported or deleted where required. |
| 9 | Duplicate household contacts | Define how the application handles the same email or phone number appearing in multiple household records. |
| 10 | Vendor discovery | Confirm Google Places API pricing, terms, attribution and usage limits. |
| 11 | Gallery and upload quotas | Finalise practical storage and request limits. |
| 12 | Legal and privacy review | Review privacy notice, terms, consent and data-handling requirements before public launch. |
| 13 | Operational support | Define support ownership-verification procedure and access-recovery authorisation. |
| 14 | Usage limits | Define rate limits and abuse thresholds for invitation, gallery and upload endpoints. |
| 15 | Deletion dependencies | Finalise the technical handling of dependent records and stored files when a parent record is deleted. |

These decisions should be documented in the relevant technical or operational documents. They must not be used to reintroduce guest OTP, automatic post-event expiry, wedding archive closure, or different Primary Admin rules without an explicit product-scope revision.

---

# 19. Delivery Sequence

The recommended implementation sequence is dependency-driven.

## Phase 1 — Foundation and Authentication

Scope:

- Project foundation.
- Authentication.
- Organiser accounts.
- Wedding workspace creation.
- Bride/Groom identification.
- Creator Primary Admin membership.
- Partner invitation and acceptance.
- Membership constraints.

**Exit criteria:** A couple can create a wedding workspace and activate both protected Primary Admin memberships.

## Phase 2 — Organisers and Permissions

Scope:

- Admin and Manager roles.
- Additional organiser invitations.
- Organiser acceptance.
- Promotion and demotion.
- Organiser removal.
- Protected Primary Admin rules.
- Server-side permission checks.
- Audit logging.

**Exit criteria:** Organiser access and permissions work correctly, including protected Primary Admin behaviour.

## Phase 3 — Events and Tasks

Scope:

- Event creation and editing.
- Event deletion.
- Task creation and assignment.
- Task status management.
- Dashboard event and task summaries.

**Exit criteria:** Organisers can manage the wedding's basic planning structure.

## Phase 4 — Guests and RSVP

Scope:

- Household management.
- Event-specific invitations.
- One household invitation token.
- Guest-facing invitation page.
- Primary invitee RSVP.
- Additional attendee counts.
- RSVP calculations and summaries.
- Token revocation and regeneration.

**Exit criteria:** Households can receive one invitation link and submit independent RSVPs for their assigned events.

## Phase 5 — Expenses and Payments

Scope:

- Expense records.
- Multiple payment records.
- Payment validation.
- Paid-to-date calculations.
- Outstanding balance calculations.
- Expense and payment history.
- Dashboard financial summaries.
- Financial audit records.

**Exit criteria:** Expense and payment figures remain accurate after creation, editing and deletion.

## Phase 6 — Vendors and Wedding Website

Scope:

- Vendor management.
- Vendor discovery integration.
- Website configuration.
- Three website themes.
- English and Hindi content.
- Website publishing and visibility.

**Exit criteria:** The couple can manage vendor records and publish a shareable wedding website.

## Phase 7 — Gallery, Uploads and QR

Scope:

- Albums.
- Organiser photo uploads.
- Guest photo upload page.
- Upload QR tokens.
- Pending approval workflow.
- Gallery publication.
- Wedding-wide gallery QR.
- Photo viewing and downloading.
- Token revocation.

**Exit criteria:** Guests can submit photographs and access published gallery content through the intended links and QR codes.

## Phase 8 — Livestream, Testing and Release

Scope:

- YouTube livestream integration.
- Full integration testing.
- Permission and security testing.
- RSVP and payment edge-case testing.
- Responsive testing.
- Performance checks.
- Error handling.
- Production configuration.

**Exit criteria:** All P0 acceptance criteria pass and the application is ready for MVP release.

---

# 20. References

The following external services and documentation are relevant to the product:

1. **Google Places API (New)** — Vendor discovery and place information.  
   https://developers.google.com/maps/documentation/places/web-service

2. **YouTube Embedded Players and Player Parameters** — Livestream embedding.  
   https://developers.google.com/youtube/player_parameters

3. **YouTube IFrame Player API** — Embedded player integration.  
   https://developers.google.com/youtube/iframe_api_reference

4. **Google Authentication** — Google account authentication documentation.  
   https://developers.google.com/identity

Provider pricing, terms, capabilities and technical requirements must be checked against the current documentation before implementation.

---

# Final Product Baseline Declaration

**Make My Marriage MVP Product Requirements Document v1.1 is the approved baseline for product implementation.**

The requirements in this document define the intended MVP behaviour, scope, user roles, permissions, business rules, functional requirements, data entities, acceptance criteria and testing expectations.

The following principles are particularly important and must not be weakened during implementation:

1. Both partners are protected Primary Admins once the partner invitation is accepted.
2. Admin and Manager remain the only organiser roles.
3. Managers cannot delete ordinary planning records.
4. One household invitation link covers all assigned events.
5. Primary invitee attendance and additional attendee counts are independent.
6. An expense supports multiple payment records and accurate paid/outstanding calculations.
7. Guest RSVP does not require OTP.
8. Gallery access is available to anyone with the gallery link or QR.
9. Upload QR tokens independently authorise photo submission.
10. Guest uploads require organiser approval before publication.
11. There is no automatic 15-day guest-access expiry.
12. Wedding-level archive and automatic guest-access closure are outside the MVP.
13. If both Primary Admins lose access, recovery requires manual support verification.
14. All sensitive permission and data-integrity rules must be enforced server-side.

**This document is the single source of truth for the MVP product requirements.** System Design, Database Design, API Design, UI implementation and testing should follow it. Any future change to the agreed product behaviour should be treated as a deliberate scope change rather than an informal implementation adjustment.

**End of Document — Make My Marriage PRD v1.1**

