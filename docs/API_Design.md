# Make My Marriage – API Design Document (ADD)

**Version:** 1.0  
**Status:** Final Draft – Freeze Candidate  
**Prepared:** 4 November 2026  
**Product:** Make My Marriage  
**Document Type:** API Design Document  
**Baseline:** PRD v1.1, System Design Architecture v1.4, and the approved Database Design Document  
**Backend Architecture:** Modular Monolith  
**API Style:** REST  
**API Technology:** Next.js Route Handlers, Node.js, TypeScript  
**Database:** MongoDB Atlas with Mongoose  

---

# 1. Document Purpose

## 1.1 Purpose

This document defines the API contract for the Make My Marriage (MMM) application.

It describes how the frontend communicates with the backend to perform application operations, including:

- User authentication and account management.
- Wedding creation and organiser management.
- Event and task management.
- Guest household management and RSVP.
- Expense and payment management.
- Vendor management and discovery.
- Wedding website configuration and publication.
- Photo albums, guest uploads, and moderation.
- Wedding gallery and upload QR links.
- YouTube livestream configuration.
- Email notifications.
- Audit logging.

The document establishes the expected API routes, HTTP methods, permissions, request structures, response structures, validation rules, and business logic.

It serves as the implementation contract for frontend and backend development.

## 1.2 Document Authority

The following documents are the source of truth:

| Document | Authority |
|---|---|
| PRD v1.1 | Product scope, features, and business rules |
| System Design Architecture v1.4 | Technology stack, application architecture, and infrastructure |
| Database Design Document v1.0 | Collections, field definitions, relationships, and database constraints |
| API Design Document v1.0 | HTTP API contract and endpoint behaviour |

If an API requirement conflicts with a higher-level product or architecture requirement, the higher-level document takes precedence.

## 1.3 Scope

This document covers the application-facing API and the backend integrations required to support the MVP.

It does not define:

- Frontend component design.
- UI layouts or visual styling.
- Complete Mongoose implementation code.
- Cloud infrastructure deployment scripts.
- Third-party provider API contracts in full.
- Future features outside the approved MVP.

---

# 2. Technology and API Architecture

## 2.1 Approved Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js |
| Backend | Next.js Route Handlers / Node.js |
| Programming language | TypeScript |
| API architecture | REST |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Authentication | Auth.js |
| Authentication providers | Google OAuth and email/password |
| Email service | Resend |
| Image storage | Cloudflare R2 |
| Vendor discovery | Google Places API (New) |
| Deployment | Vercel |
| Repository | Single repository |
| Architecture | Modular monolith |

No change to the approved technology stack is proposed by this document.

## 2.2 API Base URL

The production API base URL is:

`https://<application-domain>/api/v1`

Development example:

`http://localhost:3000/api/v1`

All application REST endpoints must be placed under `/api/v1`.

Auth.js authentication endpoints are an integration exception and use the Auth.js-configured authentication route.

## 2.3 API Versioning

The API uses URL-based versioning.

Example:

`/api/v1/weddings`

Rules:

1. All application endpoints must include the version prefix.
2. Backward-incompatible changes require a new API version.
3. Backward-compatible optional fields may be added within the current version.
4. Existing field meanings must not silently change.
5. Removed or renamed fields require an explicit versioning and migration decision.

## 2.4 Modular Backend Structure

The backend follows a modular monolith architecture.

Each business module owns its routes, validation, service logic, and data-access responsibilities.

Suggested module structure:

```text
src/
├── app/
│   └── api/
│       └── v1/
│           ├── users/
│           ├── weddings/
│           ├── organisers/
│           ├── invitations/
│           ├── events/
│           ├── tasks/
│           ├── guests/
│           ├── rsvps/
│           ├── expenses/
│           ├── payments/
│           ├── vendors/
│           ├── website/
│           ├── albums/
│           ├── photos/
│           ├── qr-links/
│           ├── livestreams/
│           ├── emails/
│           └── audit-logs/
│
├── modules/
│   ├── auth/
│   ├── weddings/
│   ├── organisers/
│   ├── events/
│   ├── tasks/
│   ├── guests/
│   ├── rsvps/
│   ├── expenses/
│   ├── payments/
│   ├── vendors/
│   ├── website/
│   ├── gallery/
│   ├── livestreams/
│   ├── notifications/
│   └── audit/
│
├── lib/
│   ├── auth/
│   ├── database/
│   ├── validation/
│   ├── permissions/
│   ├── errors/
│   └── integrations/
│
└── models/
```

The directory layout is a recommended implementation organisation, not a requirement to create a separate deployment or service for each module.

---

# 3. API Conventions

## 3.1 HTTP Methods

| Method | Purpose |
|---|---|
| GET | Retrieve a resource |
| POST | Create a resource or perform a defined action |
| PATCH | Partially update a resource |
| PUT | Replace a resource where full replacement is explicitly required |
| DELETE | Delete an eligible resource where the product permits it |

Financial payment history is an explicit exception to ordinary resource deletion: payment records must never be physically deleted.

## 3.2 Standard Request Headers

Authenticated application requests should use:

```http
Content-Type: application/json
Accept: application/json
```

Authentication is handled through the configured Auth.js session mechanism, normally using secure cookies for the browser application.

The client must not be trusted to provide its own authoritative user ID, membership role, or wedding ownership.

## 3.3 Standard Success Response

Single-resource response:

```json
{
  "success": true,
  "data": {
    "id": "resource_id",
    "name": "Example"
  }
}
```

Collection response:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

Action response:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "id": "resource_id"
  }
}
```

The `data` object must contain only fields the requesting user is authorised to access.

## 3.4 Standard Error Response

All application errors should follow a consistent structure.

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The supplied information is invalid.",
    "details": [
      {
        "field": "name",
        "message": "Name is required."
      }
    ]
  }
}
```

Sensitive information must never be included in error responses.

Examples of information that must not be exposed:

- Password hashes.
- Raw invitation tokens.
- QR access tokens.
- Password reset tokens.
- Internal database credentials.
- Private storage credentials.
- Stack traces in production.

## 3.5 HTTP Status Codes

| Status | Meaning |
|---|---|
| 200 | Successful request |
| 201 | Resource created |
| 202 | Request accepted for asynchronous processing |
| 204 | Successful operation with no response body |
| 400 | Invalid request |
| 401 | Authentication required |
| 403 | Authenticated but not authorised |
| 404 | Resource not found or not accessible |
| 409 | Business rule conflict |
| 410 | Revoked or no longer valid public link |
| 413 | Upload too large |
| 415 | Unsupported media type |
| 422 | Valid request structure but invalid business data |
| 429 | Rate limit exceeded |
| 500 | Unexpected server error |
| 502 | Upstream provider failure |
| 503 | Temporarily unavailable |

The application should avoid revealing whether an inaccessible private resource exists. Depending on the security context, it may return `404` instead of `403`.

## 3.6 Object Identifiers

MongoDB ObjectIds are used internally for database references.

API responses should expose IDs as strings.

Example:

```json
{
  "id": "672a12345678901234567890"
}
```

The backend must validate ObjectId formats before querying MongoDB.

## 3.7 Date and Time Format

API date-time values must use ISO 8601.

Example:

```json
{
  "startAt": "2027-02-15T12:30:00.000Z",
  "timezone": "Asia/Kolkata"
}
```

Rules:

- Store date-time instants in UTC.
- Preserve the relevant IANA timezone.
- Interpret wedding and event dates using the wedding timezone.
- Use `YYYY-MM-DD` for date-only values.
- Default timezone is `Asia/Kolkata`.
- Do not rely on the browser's timezone to determine wedding event dates.

## 3.8 Currency and Monetary Values

The MVP supports INR only.

All monetary values must be whole Indian rupees.

Example:

```json
{
  "totalAmountRupees": 75000,
  "currency": "INR"
}
```

Rules:

1. Amounts must be positive integers where a positive amount is required.
2. Decimal and fractional rupee amounts are not accepted.
3. Paise are not supported.
4. Use safe integer validation.
5. Never use floating-point arithmetic for financial calculations.
6. Do not accept a client-supplied paid-to-date or outstanding amount as authoritative.

---

# 4. Authentication and Authorisation

## 4.1 Authentication Model

Authentication uses Auth.js.

Supported methods:

1. Google OAuth.
2. Email and password.

The application must verify email addresses for both authentication flows before granting organiser access.

The backend must use the authenticated server-side session to determine the current user.

## 4.2 Authentication Endpoints

Auth.js manages its own authentication routes.

Typical route:

`/api/auth/[...nextauth]`

The exact provider and callback configuration belongs to the Auth.js configuration.

Additional application endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/auth/me` | Retrieve current authenticated user |
| POST | `/api/v1/auth/register` | Register using email/password |
| POST | `/api/v1/auth/verify-email/resend` | Request another verification email |
| POST | `/api/v1/auth/verify-email/confirm` | Verify email using token |
| POST | `/api/v1/auth/password/forgot` | Request password reset |
| POST | `/api/v1/auth/password/reset` | Set a new password |
| POST | `/api/v1/auth/password/change` | Change password while authenticated |

Logout and Google sign-in should use the Auth.js-supported client/server flow rather than introducing a competing custom session system.

### Registration Request

`POST /api/v1/auth/register`

```json
{
  "name": "Aarav Sharma",
  "email": "aarav@example.com",
  "password": "StrongPasswordExample"
}
```

Backend responsibilities:

1. Validate name, email, and password.
2. Normalize the email.
3. Check email uniqueness.
4. Hash the password using the approved password-hashing algorithm.
5. Create the user and password credential.
6. Create an email-verification token.
7. Queue the verification email.
8. Do not grant organiser access until email verification succeeds.

Response:

```json
{
  "success": true,
  "message": "Registration successful. Please verify your email."
}
```

Do not return password hashes or verification tokens.

### Verify Email Request

`POST /api/v1/auth/verify-email/confirm`

```json
{
  "token": "verification_token"
}
```

Backend responsibilities:

- Hash the supplied token for lookup.
- Verify that it exists and has not expired or been consumed.
- Mark the token as consumed.
- Set the user's email verification timestamp.
- Make the verified account eligible for organiser access.

### Forgot Password Request

`POST /api/v1/auth/password/forgot`

```json
{
  "email": "aarav@example.com"
}
```

The response should not reveal whether an email address is registered.

### Reset Password Request

`POST /api/v1/auth/password/reset`

```json
{
  "token": "password_reset_token",
  "newPassword": "NewStrongPasswordExample"
}
```

The backend must validate the token, update the password hash, consume the token, and invalidate relevant existing authentication sessions where supported by the configured Auth.js session strategy.

## 4.3 Authorisation Model

Every protected application request must verify:

1. The user is authenticated.
2. The user's email is verified.
3. The user has an active membership in the requested wedding.
4. The membership role permits the requested operation.
5. The resource belongs to the same wedding.

The backend must never rely solely on a frontend-hidden button to enforce permissions.

## 4.4 Organiser Roles

The MVP has two organiser roles:

- `ADMIN`
- `MANAGER`

Primary Admin is a protected membership classification, not a third role.

Both the Primary Bride and Primary Groom have:

```json
{
  "role": "ADMIN",
  "membershipType": "PRIMARY_ADMIN"
}
```

Additional organisers have:

```json
{
  "role": "ADMIN",
  "membershipType": "ADDITIONAL"
}
```

or:

```json
{
  "role": "MANAGER",
  "membershipType": "ADDITIONAL"
}
```

## 4.5 Permission Matrix

| Operation | Primary Admin | Additional Admin | Manager |
|---|---:|---:|---:|
| View wedding dashboard | Yes | Yes | Yes |
| Update wedding details | Yes | Yes | Yes |
| Manage additional organisers | Yes | Yes | No |
| Change Primary Admin roles | No | No | No |
| Manage events | Yes | Yes | Yes |
| Manage tasks | Yes | Yes | Yes |
| Manage guests | Yes | Yes | Yes |
| Manage RSVP settings | Yes | Yes | Yes |
| Manage expenses | Yes | Yes | Yes |
| Create/edit payments | Yes | Yes | Yes |
| Void payment | Yes | Yes | No |
| Manage vendors | Yes | Yes | Yes |
| Manage website | Yes | Yes | Yes |
| Manage albums | Yes | Yes | Yes |
| Approve/reject photos | Yes | Yes | Yes |
| Permanently delete eligible ordinary records | Yes | Yes | No |
| Manage QR links | Yes | Yes | Yes |
| Manage livestream settings | Yes | Yes | Yes |
| View audit logs | Yes | Yes | No |

Primary Admin protection applies regardless of the role shown in the UI.

Managers cannot promote themselves, change their role, manage organisers, or modify protected Primary Admin membership.

---

# 5. Wedding Workspace APIs

## 5.1 Create Wedding

`POST /api/v1/weddings`

**Permission:** Authenticated, verified user without an active wedding membership.

Only a Bride or Groom may create a wedding.

Request:

```json
{
  "weddingTitle": "Aarav and Meera's Wedding",
  "creatorPosition": "BRIDE",
  "primaryPartner": {
    "name": "Aarav Sharma",
    "email": "aarav@example.com"
  },
  "timezone": "Asia/Kolkata"
}
```

`creatorPosition` accepts:

- `BRIDE`
- `GROOM`

Backend responsibilities:

1. Confirm the current user is eligible to create a wedding.
2. Confirm the user has no active wedding membership.
3. Create the wedding in `SETUP` status.
4. Create the creator's protected Primary Admin membership.
5. Set the creator's primary position.
6. Create a dedicated Primary Admin invitation for the partner.
7. Queue the partner invitation email.
8. Record the operation in the audit log.

The creator must not be blocked from managing the wedding while the partner invitation is pending.

Response:

```json
{
  "success": true,
  "data": {
    "weddingId": "wedding_id",
    "setupStatus": "SETUP",
    "membership": {
      "role": "ADMIN",
      "membershipType": "PRIMARY_ADMIN"
    },
    "partnerInvitationStatus": "PENDING"
  }
}
```

## 5.2 Retrieve Current Wedding

`GET /api/v1/weddings/current`

Returns the wedding associated with the current user's active membership.

Response should include:

- Wedding ID.
- Wedding title.
- Couple details.
- Setup status.
- Timezone.
- Currency.
- Current membership role.
- Membership type.
- Primary Admin status.

The endpoint must not return unrelated weddings.

## 5.3 Retrieve Wedding Details

`GET /api/v1/weddings/{weddingId}`

**Permission:** Active wedding member.

## 5.4 Update Wedding Details

`PATCH /api/v1/weddings/{weddingId}`

**Permission:** Active Admin or Manager, subject to field-level restrictions.

Request:

```json
{
  "weddingTitle": "Aarav and Meera's Wedding Celebration",
  "timezone": "Asia/Kolkata"
}
```

Protected fields must not be directly editable through this endpoint:

- Primary Bride user ID.
- Primary Groom user ID.
- Creator user ID.
- Primary membership classification.
- Membership ownership.

Changing protected ownership or membership data through a normal wedding update is prohibited.

## 5.5 Wedding Setup Status

The wedding has two setup states:

- `SETUP`
- `ACTIVE`

The backend must transition the wedding to `ACTIVE` only when both protected Primary Admin memberships are active.

The frontend must not be allowed to set this status directly.

Endpoint:

`GET /api/v1/weddings/{weddingId}/setup-status`

The status should be derived or updated by trusted backend logic following membership activation.

---

# 6. Organiser Management APIs

## 6.1 List Organisers

`GET /api/v1/weddings/{weddingId}/organisers`

**Permission:** Active wedding member.

Returns active and relevant pending organiser information, with sensitive invitation data excluded.

## 6.2 Invite Additional Organiser

`POST /api/v1/weddings/{weddingId}/organisers/invitations`

**Permission:** Admin only.

Request:

```json
{
  "name": "Riya Sharma",
  "email": "riya@example.com",
  "role": "MANAGER"
}
```

Allowed roles:

- `ADMIN`
- `MANAGER`

The API must reject attempts to invite someone as `PRIMARY_ADMIN`.

Backend responsibilities:

- Verify the inviter's Admin role.
- Normalize the invitee email.
- Check active membership constraints.
- Create an organiser invitation.
- Generate a cryptographically secure invitation token.
- Store only the token hash.
- Queue the invitation email.
- Record an audit event.

## 6.3 Accept Additional Organiser Invitation

`POST /api/v1/organisers/invitations/accept`

Request:

```json
{
  "token": "organiser_invitation_token"
}
```

The accepting user must be authenticated and have a verified email matching the invitation recipient.

The backend must:

1. Validate the invitation.
2. Check that it has not been accepted or revoked.
3. Check that the accepting user does not have another active wedding membership.
4. Create the additional membership.
5. Mark the invitation as accepted.
6. Record the acceptance in the audit log.

## 6.4 Update Additional Organiser Role

`PATCH /api/v1/weddings/{weddingId}/organisers/{membershipId}`

**Permission:** Admin only.

Request:

```json
{
  "role": "MANAGER"
}
```

Only additional organiser roles may be changed.

The API must reject changes to:

- Primary Admin roles.
- Primary membership classification.
- Primary Bride/Groom position.

## 6.5 Remove Additional Organiser

`DELETE /api/v1/weddings/{weddingId}/organisers/{membershipId}`

**Permission:** Admin only.

This endpoint applies only to additional organiser memberships.

The backend must reject any attempt to remove or demote either Primary Admin.

After removal:

- The organiser's active access is revoked.
- The membership is marked as removed according to the database design.
- Historical records and audit attribution remain intact.
- The user account is not deleted.
- The user may become eligible for another wedding membership.

## 6.6 Primary Admin Invitation

`GET /api/v1/primary-admin-invitations/{token}`

Returns safe invitation details for the invited partner.

`POST /api/v1/primary-admin-invitations/accept`

Request:

```json
{
  "token": "primary_admin_invitation_token"
}
```

Acceptance must activate the invited partner as the other protected Primary Admin.

The backend must enforce:

- Exactly one Primary Bride position.
- Exactly one Primary Groom position.
- Both Primary Admins have the `ADMIN` role.
- No existing active membership conflicts.
- The invitation recipient matches the verified account email.

Primary Admin invitations must remain separate from additional organiser invitations.

---

# 7. Event Management APIs

## 7.1 List Events

`GET /api/v1/weddings/{weddingId}/events`

Supported query parameters:

| Parameter | Purpose |
|---|---|
| `page` | Page number |
| `limit` | Results per page |
| `sortBy` | Sorting field |
| `order` | `asc` or `desc` |
| `status` | Event status |
| `fromDate` | Starting date filter |
| `toDate` | Ending date filter |

## 7.2 Create Event

`POST /api/v1/weddings/{weddingId}/events`

Request:

```json
{
  "name": "Wedding Ceremony",
  "description": "Main wedding ceremony",
  "eventDate": "2027-02-15",
  "startAt": "2027-02-15T12:30:00.000Z",
  "endAt": "2027-02-15T17:30:00.000Z",
  "timezone": "Asia/Kolkata",
  "location": {
    "name": "Wedding Venue",
    "address": "Mumbai, Maharashtra",
    "latitude": 19.076,
    "longitude": 72.8777
  }
}
```

Backend validation:

- Event name is required.
- Event date must be valid.
- End time must be after start time when both are supplied.
- Timezone must be a valid IANA timezone.
- Coordinates must be within valid geographical ranges.
- The event must belong to the specified wedding.

## 7.3 Retrieve Event

`GET /api/v1/weddings/{weddingId}/events/{eventId}`

## 7.4 Update Event

`PATCH /api/v1/weddings/{weddingId}/events/{eventId}`

Only explicitly supplied editable fields should change.

## 7.5 Cancel Event

`POST /api/v1/weddings/{weddingId}/events/{eventId}/cancel`

The backend should update the event's status and record the change.

Cancellation must not silently erase invitations, RSVPs, or historical information.

## 7.6 Event Invitation and RSVP Summary

`GET /api/v1/weddings/{weddingId}/events/{eventId}/invitation-summary`

Returns aggregate information such as:

- Total invited households.
- Pending responses.
- Responded households.
- Primary invitees attending.
- Additional attendees.
- Total expected attendees.

The summary must be calculated from authorised wedding data.

---

# 8. Task Management APIs

## 8.1 List Tasks

`GET /api/v1/weddings/{weddingId}/tasks`

Supported filters:

- `status`
- `priority`
- `assignedTo`
- `eventId`
- `dueBefore`
- `dueAfter`
- `page`
- `limit`

## 8.2 Create Task

`POST /api/v1/weddings/{weddingId}/tasks`

Request:

```json
{
  "title": "Confirm wedding photographer",
  "description": "Finalise photography arrangements",
  "eventId": "event_id",
  "assignedToMembershipIds": [
    "membership_id"
  ],
  "priority": "HIGH",
  "status": "TODO",
  "dueDate": "2027-01-20"
}
```

Backend validation:

- The title is required.
- The event, if supplied, must belong to the same wedding.
- Assigned membership IDs must refer to active memberships in the same wedding.
- A user cannot assign tasks to an arbitrary external user ID.
- Priority and status must match approved enums.

## 8.3 Retrieve Task

`GET /api/v1/weddings/{weddingId}/tasks/{taskId}`

## 8.4 Update Task

`PATCH /api/v1/weddings/{weddingId}/tasks/{taskId}`

## 8.5 Update Task Status

`PATCH /api/v1/weddings/{weddingId}/tasks/{taskId}/status`

Request:

```json
{
  "status": "COMPLETED"
}
```

## 8.6 Delete Task

`DELETE /api/v1/weddings/{weddingId}/tasks/{taskId}`

**Permission:** Admin only.

Managers must receive `403` if they attempt this operation.

---

# 9. Guest and Household Management APIs

## 9.1 Guest Data Model

A guest record represents a household, not an individual attendee.

The MVP does not create separate guest accounts or individual attendee profiles.

A household may be invited to multiple events.

## 9.2 List Guest Households

`GET /api/v1/weddings/{weddingId}/guests`

Supported filters:

- `search`
- `eventId`
- `page`
- `limit`

## 9.3 Create Household

`POST /api/v1/weddings/{weddingId}/guests`

Request:

```json
{
  "householdLabel": "Sharma Family",
  "primaryContactName": "Rahul Sharma",
  "primaryContactEmail": "rahul@example.com",
  "phone": "+919876543210",
  "notes": "Family friends"
}
```

The backend must normalise contact information and validate the wedding relationship.

## 9.4 Retrieve Household

`GET /api/v1/weddings/{weddingId}/guests/{guestId}`

## 9.5 Update Household

`PATCH /api/v1/weddings/{weddingId}/guests/{guestId}`

## 9.6 Delete Household

`DELETE /api/v1/weddings/{weddingId}/guests/{guestId}`

**Permission:** Admin only.

The backend must preserve relevant financial, invitation, RSVP, and audit integrity. It must not leave invalid references.

## 9.7 Assign Household to Event

`POST /api/v1/weddings/{weddingId}/guests/{guestId}/event-invitations`

Request:

```json
{
  "eventId": "event_id",
  "maxPartySize": 4,
  "rsvpCutoffAt": "2027-02-01T18:29:59.000Z"
}
```

`rsvpCutoffAt` is optional.

The backend must verify that the event and household belong to the same wedding.

One household must have at most one event invitation for a particular event.

## 9.8 List Household Event Invitations

`GET /api/v1/weddings/{weddingId}/guests/{guestId}/event-invitations`

## 9.9 Update Household Event Invitation

`PATCH /api/v1/weddings/{weddingId}/guests/{guestId}/event-invitations/{invitationId}`

Request:

```json
{
  "maxPartySize": 5,
  "rsvpCutoffAt": "2027-02-03T18:29:59.000Z"
}
```

The backend must ensure that updated limits do not invalidate an existing RSVP response. If the new limit is lower than the current attendee count, reject the update and require the organiser to resolve the conflict first.

---

# 10. Household Invitation Link APIs

## 10.1 Invitation Link Behaviour

Each household receives one invitation link.

That link provides access to the RSVP pages for all events assigned to that household.

There is no separate invitation token for each event.

The link:

- Is associated with one household and one wedding.
- Is stored as a hash in the database.
- Can be revoked.
- Can be regenerated.
- Does not create a guest account.
- Does not require guest OTP verification.
- Does not create a guest session.
- Has no expiry unless a future approved product requirement introduces one.

## 10.2 Generate Household Invitation Link

`POST /api/v1/weddings/{weddingId}/guests/{guestId}/invitation-link`

**Permission:** Admin or Manager.

The backend generates a cryptographically secure random token, stores its hash, and returns the plaintext link only in the creation response.

Example response:

```json
{
  "success": true,
  "data": {
    "invitationUrl": "https://example.com/invitation/secure-token",
    "status": "ACTIVE"
  }
}
```

The plaintext token must not be stored in MongoDB or audit logs.

## 10.3 Revoke Household Invitation Link

`POST /api/v1/weddings/{weddingId}/guests/{guestId}/invitation-link/revoke`

**Permission:** Admin or Manager.

The current token must become unusable immediately.

## 10.4 Regenerate Household Invitation Link

`POST /api/v1/weddings/{weddingId}/guests/{guestId}/invitation-link/regenerate`

The backend must invalidate the previous token and issue a new one.

The old link must no longer provide access.

## 10.5 Retrieve Public Household Invitation

`GET /api/v1/public/invitations/{token}`

This endpoint is unauthenticated.

It must:

1. Hash and validate the token.
2. Confirm that it is active.
3. Resolve the household.
4. Return only that household's assigned events.
5. Return invitation limits and RSVP information.
6. Exclude organiser-only information.

It must not return the full guest list or other households' invitations.

---

# 11. RSVP APIs

## 11.1 RSVP Business Rules

RSVP is recorded per household per event.

The primary invitee and additional attendees are independent.

The primary invitee may decline while additional household members still attend.

The RSVP data must not be represented as individual guest accounts.

The attendee calculation is:

`totalAttendees = (primaryAttending ? 1 : 0) + additionalAttendees`

The maximum party size includes the primary invitee as a possible attendee.

Therefore:

- If the primary invitee attends, additional attendees cannot exceed `maxPartySize - 1`.
- If the primary invitee declines, additional attendees cannot exceed `maxPartySize`.

## 11.2 Submit RSVP

`POST /api/v1/public/invitations/{token}/events/{eventId}/rsvp`

Request:

```json
{
  "primaryAttending": false,
  "additionalAttendees": 2
}
```

The backend must:

1. Validate the household invitation token.
2. Verify that the event is assigned to the household.
3. Verify the RSVP cutoff, if configured.
4. Validate the maximum party size.
5. Calculate total attendees.
6. Save the response for the household-event pair.
7. Record the response timestamp.

The request must reject:

- Negative attendee counts.
- Fractional attendee counts.
- Counts exceeding the invitation limit.
- Events not assigned to the household.
- Responses after an enforced RSVP cutoff.

Response:

```json
{
  "success": true,
  "data": {
    "responseStatus": "RESPONDED",
    "primaryAttending": false,
    "additionalAttendees": 2,
    "totalAttendees": 2
  }
}
```

## 11.3 Retrieve Household RSVP Status

`GET /api/v1/public/invitations/{token}/rsvps`

Returns RSVP details only for events assigned to the household.

## 11.4 Retrieve Organiser RSVP Summary

`GET /api/v1/weddings/{weddingId}/rsvps/summary`

**Permission:** Active wedding member.

Returns aggregate RSVP statistics for the wedding.

## 11.5 Retrieve Event RSVP List

`GET /api/v1/weddings/{weddingId}/events/{eventId}/rsvps`

**Permission:** Active wedding member.

The response should contain household-level information, response status, and attendee counts.

---

# 12. Expense Management APIs

## 12.1 Expense Business Rules

Expenses and payments are separate resources.

An expense represents the amount owed for a wedding-related purchase or service.

A payment represents an actual payment made against that expense.

One expense may have zero or multiple payment records.

The following calculations apply:

`paidAmount = sum of ACTIVE payment amounts`

`outstandingAmount = expenseTotal - paidAmount`

Only valid active payments contribute to the paid amount.

The API must calculate financial values on the server.

## 12.2 List Expenses

`GET /api/v1/weddings/{weddingId}/expenses`

Supported filters:

- `category`
- `vendorId`
- `status`
- `eventId`
- `fromDate`
- `toDate`
- `page`
- `limit`

## 12.3 Create Expense

`POST /api/v1/weddings/{weddingId}/expenses`

Request:

```json
{
  "title": "Wedding Photography",
  "category": "PHOTOGRAPHY",
  "totalAmountRupees": 75000,
  "vendorId": "vendor_id",
  "eventId": "event_id",
  "notes": "Photography package"
}
```

Validation:

- `totalAmountRupees` must be a positive safe integer.
- Currency is always INR.
- A vendor reference must belong to the same wedding.
- An event reference, if supplied, must belong to the same wedding.
- Client-supplied paid and outstanding totals must be ignored.

## 12.4 Retrieve Expense

`GET /api/v1/weddings/{weddingId}/expenses/{expenseId}`

The response should include:

- Expense details.
- Total amount.
- Paid-to-date.
- Outstanding amount.
- Payment count.
- Relevant vendor information.

## 12.5 Update Expense

`PATCH /api/v1/weddings/{weddingId}/expenses/{expenseId}`

Example:

```json
{
  "title": "Wedding Photography Package",
  "totalAmountRupees": 80000
}
```

The backend must reject a total amount below the sum of active payments.

For example:

- Expense total: ₹75,000.
- Active payments: ₹50,000.
- Proposed new total: ₹40,000.

The update must fail because the new expense total is below the amount already paid.

Financial updates must be audited.

## 12.6 Expense Financial Summary

`GET /api/v1/weddings/{weddingId}/expenses/summary`

Returns:

```json
{
  "success": true,
  "data": {
    "totalExpenseAmountRupees": 250000,
    "totalPaidAmountRupees": 125000,
    "totalOutstandingAmountRupees": 125000,
    "currency": "INR"
  }
}
```

All amounts must be whole rupees.

The calculation must use active payments only.

---

# 13. Expense Payment APIs

## 13.1 Payment Business Rules

Payment records are permanent financial history.

**Payment records must never be physically deleted.**

An incorrect payment is handled through a controlled void operation, not physical deletion.

Payment status:

- `ACTIVE`
- `VOIDED`

A voided payment remains in the database and is excluded from paid-to-date and outstanding calculations.

Only an Admin may void a payment.

Managers may create and edit payment records but may not void them.

Every payment creation, update, and void operation must be recorded in the audit log.

## 13.2 List Expense Payments

`GET /api/v1/weddings/{weddingId}/expenses/{expenseId}/payments`

The response includes active and voided payment history.

## 13.3 Add Payment

`POST /api/v1/weddings/{weddingId}/expenses/{expenseId}/payments`

Request:

```json
{
  "amountRupees": 25000,
  "paymentDate": "2027-01-15",
  "paymentMethod": "UPI",
  "reference": "UPI-REFERENCE-123",
  "notes": "Advance payment"
}
```

Allowed payment methods:

- `CASH`
- `UPI`
- `BANK_TRANSFER`
- `CARD`
- `OTHER`

Validation:

- Amount must be a positive integer.
- Payment date is required.
- Payment method is required.
- The expense must belong to the same wedding.
- The new payment must not cause active payments to exceed the expense total.

The backend must perform the overpayment check and insert within an appropriate MongoDB transaction or equivalent atomic integrity mechanism.

## 13.4 Update Payment

`PATCH /api/v1/weddings/{weddingId}/expenses/{expenseId}/payments/{paymentId}`

Example:

```json
{
  "amountRupees": 20000,
  "paymentMethod": "BANK_TRANSFER",
  "reference": "BANK-REFERENCE-456"
}
```

Rules:

- Only an active payment may be edited.
- Updated values must pass the same payment validation.
- The resulting active payment total must not exceed the expense total.
- Original and revised values must be auditable.
- A voided payment cannot be reactivated or edited through this endpoint.

## 13.5 Void Payment

`POST /api/v1/weddings/{weddingId}/expenses/{expenseId}/payments/{paymentId}/void`

**Permission:** Admin only.

Request:

```json
{
  "reason": "Payment was entered against the wrong expense."
}
```

Backend responsibilities:

1. Confirm the payment is active.
2. Require a non-empty correction reason.
3. Change status to `VOIDED`.
4. Record the voiding Admin.
5. Record the void timestamp.
6. Preserve the original amount and payment details.
7. Exclude the payment from paid-to-date.
8. Recalculate outstanding amount.
9. Create an audit record.

The payment document must remain available as historical financial evidence.

A void operation must never be implemented as a physical database delete.

## 13.6 Retrieve Payment Details

`GET /api/v1/weddings/{weddingId}/expenses/{expenseId}/payments/{paymentId}`

Returns the payment's current status and relevant history fields.

## 13.7 Payment Integrity

The backend must enforce the following invariant:

`sum(ACTIVE payments) <= expense.totalAmountRupees`

This check must remain correct under concurrent requests.

Do not rely on a frontend calculation or a non-atomic read followed by an unrestricted insert.

---

# 14. Vendor Management APIs

## 14.1 List Vendors

`GET /api/v1/weddings/{weddingId}/vendors`

Supported filters:

- `category`
- `search`
- `page`
- `limit`

## 14.2 Create Vendor

`POST /api/v1/weddings/{weddingId}/vendors`

Request:

```json
{
  "name": "Royal Wedding Photography",
  "category": "PHOTOGRAPHER",
  "phone": "+919876543210",
  "email": "contact@example.com",
  "website": "https://example.com",
  "address": "Mumbai, Maharashtra",
  "notes": "Shortlisted vendor"
}
```

Supported categories:

- `PHOTOGRAPHER`
- `VIDEOGRAPHER`
- `VENUE`
- `CATERER`
- `DECORATOR`
- `DJ`
- `MAKEUP_ARTIST`
- `MEHENDI_ARTIST`
- `PANDIT`
- `CHOREOGRAPHER`
- `WEDDING_PLANNER`
- `FLORIST`
- `OTHERS`

## 14.3 Retrieve Vendor

`GET /api/v1/weddings/{weddingId}/vendors/{vendorId}`

## 14.4 Update Vendor

`PATCH /api/v1/weddings/{weddingId}/vendors/{vendorId}`

## 14.5 Delete Vendor

`DELETE /api/v1/weddings/{weddingId}/vendors/{vendorId}`

**Permission:** Admin only.

If expenses reference the vendor, the backend must preserve financial referential integrity. Vendor removal must not erase expense or payment history.

## 14.6 Search External Vendors

`GET /api/v1/weddings/{weddingId}/vendors/discover`

Query parameters:

| Parameter | Purpose |
|---|---|
| `query` | Search phrase |
| `category` | Vendor category |
| `location` | Search location |
| `pageToken` | Provider pagination token, where supported |

Example:

`/api/v1/weddings/{weddingId}/vendors/discover?query=photographers&location=Mumbai`

The backend calls Google Places API (New).

The API should return only the provider fields required for discovery, such as:

- Place ID.
- Name.
- Address.
- Location.
- Rating, if available.
- Website, if available.
- Phone, if available.
- Provider attribution where required.

Google API keys must remain server-side.

Discovery results are informational. They do not represent a verification, endorsement, booking, negotiation, or payment service.

## 14.7 Save Discovered Vendor

`POST /api/v1/weddings/{weddingId}/vendors/save-discovered`

Request:

```json
{
  "externalPlaceId": "google_place_id",
  "category": "PHOTOGRAPHER"
}
```

The backend should retrieve or validate the relevant provider details and save a wedding-specific vendor record.

---

# 15. Wedding Website APIs

## 15.1 Website Business Rules

Each wedding has one configurable wedding website.

Supported themes:

- `CLASSIC_INDIAN`
- `MINIMAL_ELEGANT`
- `MODERN_CELEBRATION`

Supported guest-facing languages:

- English (`en`)
- Hindi (`hi`)

The organiser dashboard remains English.

Translation is not automatically generated.

The website is unlisted, not access-controlled. Anyone with the URL may open it, and the URL may be forwarded.

Only configured public content may be exposed.

## 15.2 Retrieve Website Settings

`GET /api/v1/weddings/{weddingId}/website`

**Permission:** Active wedding member.

## 15.3 Update Website Settings

`PATCH /api/v1/weddings/{weddingId}/website`

Request:

```json
{
  "slug": "aarav-meera-wedding",
  "theme": "CLASSIC_INDIAN",
  "defaultLanguage": "en",
  "enabledLanguages": [
    "en",
    "hi"
  ],
  "status": "DRAFT"
}
```

The backend must validate slug uniqueness and supported values.

## 15.4 Update Website Content

`PATCH /api/v1/weddings/{weddingId}/website/content`

Request:

```json
{
  "en": {
    "welcomeTitle": "Welcome to our wedding",
    "welcomeMessage": "We look forward to celebrating with you."
  },
  "hi": {
    "welcomeTitle": "हमारी शादी में आपका स्वागत है",
    "welcomeMessage": "हम आपके साथ इस खास दिन का जश्न मनाने के लिए उत्सुक हैं।"
  }
}
```

The actual content schema must follow the approved website content model.

The backend must reject fields that are not part of the public website content contract.

## 15.5 Publish Website

`POST /api/v1/weddings/{weddingId}/website/publish`

**Permission:** Admin or Manager.

## 15.6 Unpublish Website

`POST /api/v1/weddings/{weddingId}/website/unpublish`

The public endpoint must no longer expose the unpublished content.

## 15.7 Preview Website

`GET /api/v1/weddings/{weddingId}/website/preview`

**Permission:** Active wedding member.

Preview access must be authenticated.

## 15.8 Public Website Retrieval

`GET /api/v1/public/websites/{slug}`

Unauthenticated.

Returns only published website content.

The response must not expose:

- Organiser contact details unless explicitly configured as public.
- Private guest information.
- Expense information.
- Internal notes.
- Audit logs.
- Private photo moderation data.
- Organiser membership information.

---

# 16. Album and Photo Management APIs

## 16.1 Album Business Rules

Albums are associated with wedding events.

Only approved and published photos may appear in the public gallery.

Guest uploads remain pending until moderated.

The MVP has one wedding-wide gallery-view QR and one separate wedding-wide guest-upload QR.

There are no event-specific QR codes in the MVP.

## 16.2 List Albums

`GET /api/v1/weddings/{weddingId}/albums`

## 16.3 Create Album

`POST /api/v1/weddings/{weddingId}/albums`

Request:

```json
{
  "name": "Wedding Ceremony",
  "eventId": "event_id",
  "publicationStatus": "DRAFT"
}
```

## 16.4 Retrieve Album

`GET /api/v1/weddings/{weddingId}/albums/{albumId}`

## 16.5 Update Album

`PATCH /api/v1/weddings/{weddingId}/albums/{albumId}`

## 16.6 Publish Album

`POST /api/v1/weddings/{weddingId}/albums/{albumId}/publish`

## 16.7 Unpublish Album

`POST /api/v1/weddings/{weddingId}/albums/{albumId}/unpublish`

## 16.8 Request Guest Upload Access

`GET /api/v1/public/uploads/{token}`

The upload token authorises access to the wedding-wide guest photo submission flow.

It does not create a guest account or guest session.

The endpoint should return only the information required to submit photos.

## 16.9 Upload Photo

`POST /api/v1/public/uploads/{token}/photos`

Recommended upload process:

1. Validate the upload token.
2. Validate file type, size, and upload limits.
3. Obtain an authorised upload destination or use the approved server-mediated upload flow.
4. Upload the file to Cloudflare R2.
5. Create the photo metadata record.
6. Mark the photo as `PENDING`.
7. Associate it with the selected/default album or event according to the upload flow.
8. Return the submission status.

The MongoDB database stores metadata and storage references, not the raw image binary.

Example metadata response:

```json
{
  "success": true,
  "data": {
    "photoId": "photo_id",
    "moderationStatus": "PENDING",
    "message": "Your photo has been submitted for approval."
  }
}
```

The backend must validate the actual uploaded content, not trust the filename or client-supplied MIME type alone.

## 16.10 List Photos

`GET /api/v1/weddings/{weddingId}/albums/{albumId}/photos`

Supported filters:

- `moderationStatus`
- `publicationStatus`
- `uploaderSource`
- `page`
- `limit`

Organiser access may include pending and rejected submissions, subject to permissions.

## 16.11 Approve Photo

`POST /api/v1/weddings/{weddingId}/photos/{photoId}/approve`

**Permission:** Admin or Manager.

Backend responsibilities:

- Confirm photo belongs to the wedding.
- Confirm the photo is eligible for approval.
- Record reviewer and timestamp.
- Update moderation status to `APPROVED`.
- Ensure publication rules are respected.

## 16.12 Reject Photo

`POST /api/v1/weddings/{weddingId}/photos/{photoId}/reject`

**Permission:** Admin or Manager.

Request:

```json
{
  "reason": "Photo is unrelated to the wedding."
}
```

The backend must preserve moderation history and record the reviewer.

## 16.13 Delete Photo

`DELETE /api/v1/weddings/{weddingId}/photos/{photoId}`

**Permission:** Admin only.

The backend must follow the approved photo storage and cleanup approach so MongoDB metadata and Cloudflare R2 objects do not become inconsistent.

## 16.14 Public Gallery Retrieval

`GET /api/v1/public/gallery/{token}`

The gallery token authorises public-by-link access.

The endpoint must:

- Validate the gallery token.
- Confirm it is active.
- Return published albums.
- Return approved and published photos only.
- Exclude pending and rejected photos.
- Exclude internal moderation metadata.
- Exclude private organiser data.

## 16.15 Public Photo Access

`GET /api/v1/public/gallery/{token}/photos/{photoId}`

The backend must verify that the photo belongs to the wedding associated with the gallery token and is eligible for public viewing.

Use short-lived signed Cloudflare R2 URLs for viewing or downloading where appropriate.

The gallery link is forwardable and is not proof of guest identity.

---

# 17. QR Link Management APIs

## 17.1 QR Link Types

Exactly two wedding-wide QR link types are supported:

- `GALLERY_VIEW`
- `GUEST_UPLOAD`

They are separate access mechanisms with separate tokens.

## 17.2 List QR Links

`GET /api/v1/weddings/{weddingId}/qr-links`

**Permission:** Active wedding member.

Return the link type, status, creation date, and safe management metadata.

Never return stored token hashes.

## 17.3 Generate QR Link

`POST /api/v1/weddings/{weddingId}/qr-links`

Request:

```json
{
  "type": "GALLERY_VIEW"
}
```

The backend must:

1. Verify membership and permission.
2. Generate a cryptographically secure random token.
3. Store only the token hash.
4. Enforce one active link per type per wedding.
5. Return the plaintext URL once in the response.

Use a token with at least 256 bits of cryptographic randomness.

## 17.4 Revoke QR Link

`POST /api/v1/weddings/{weddingId}/qr-links/{qrLinkId}/revoke`

The backend must immediately invalidate the link.

## 17.5 Regenerate QR Link

`POST /api/v1/weddings/{weddingId}/qr-links/{qrLinkId}/regenerate`

The old link must stop working and the new link must become the only active link for that type.

## 17.6 QR Security Rules

- Store only token hashes.
- Never log raw tokens.
- Do not expose QR tokens in audit metadata.
- Do not allow a gallery token to submit photos.
- Do not allow an upload token to access the gallery.
- Do not create event-specific QR tokens in the MVP.
- Do not introduce an unapproved token-expiry policy.

---

# 18. Livestream APIs

## 18.1 Livestream Business Rules

The MVP supports YouTube livestream embedding only.

The application does not provide its own livestream infrastructure.

Livestream visibility is public.

Availability and privacy are controlled by YouTube.

## 18.2 Retrieve Livestream Configuration

`GET /api/v1/weddings/{weddingId}/livestreams`

## 18.3 Configure Livestream

`POST /api/v1/weddings/{weddingId}/livestreams`

Request:

```json
{
  "eventId": "event_id",
  "youtubeUrl": "https://www.youtube.com/watch?v=VIDEO_ID",
  "status": "DRAFT"
}
```

Backend validation:

- Accept supported YouTube URL formats.
- Extract and validate the video ID.
- Reject unsupported providers.
- Associate the livestream with an event in the same wedding.
- Store the canonical URL and validated video ID.

## 18.4 Update Livestream

`PATCH /api/v1/weddings/{weddingId}/livestreams/{livestreamId}`

## 18.5 Publish Livestream

`POST /api/v1/weddings/{weddingId}/livestreams/{livestreamId}/publish`

## 18.6 Unpublish Livestream

`POST /api/v1/weddings/{weddingId}/livestreams/{livestreamId}/unpublish`

## 18.7 Public Livestream Retrieval

`GET /api/v1/public/websites/{slug}/livestreams`

Return only published livestream information intended for public display.

The backend must not claim that an embedded YouTube video is private merely because it is displayed on the wedding website.

---

# 19. Dashboard APIs

Dashboard endpoints should provide aggregated data for the current wedding.

## 19.1 Dashboard Summary

`GET /api/v1/weddings/{weddingId}/dashboard`

Suggested response:

```json
{
  "success": true,
  "data": {
    "wedding": {
      "setupStatus": "ACTIVE"
    },
    "events": {
      "total": 5,
      "upcoming": 3
    },
    "tasks": {
      "total": 20,
      "pending": 8,
      "completed": 12
    },
    "guests": {
      "totalHouseholds": 100,
      "expectedAttendees": 250
    },
    "expenses": {
      "totalAmountRupees": 500000,
      "paidAmountRupees": 200000,
      "outstandingAmountRupees": 300000,
      "currency": "INR"
    }
  }
}
```

All counts and financial summaries must be calculated from authorised wedding data.

The dashboard must not expose information from another wedding.

## 19.2 Upcoming Events

`GET /api/v1/weddings/{weddingId}/dashboard/upcoming-events`

## 19.3 Pending Tasks

`GET /api/v1/weddings/{weddingId}/dashboard/pending-tasks`

## 19.4 Financial Summary

`GET /api/v1/weddings/{weddingId}/dashboard/financial-summary`

This endpoint may reuse the expense summary service.

---

# 20. Email and Notification APIs

## 20.1 Email Architecture

Resend is the approved email provider.

The application should use an email outbox pattern.

Business operations create an outbox record. A background processing mechanism sends the email through Resend and updates the outbox status.

Do not make the success of a core database transaction depend on an immediate external email API call.

## 20.2 Email Events

The following email events are supported:

- Account verification.
- Password recovery.
- Primary Admin invitation.
- Additional organiser invitation.
- Household invitation link.
- Relevant wedding-related notification emails.

## 20.3 Retry and Delivery Behaviour

The backend must:

- Record the email type.
- Record the recipient.
- Track attempt count.
- Track delivery status.
- Store the provider message ID where available.
- Use an idempotency key.
- Retry transient failures using controlled backoff.
- Avoid duplicate sends when the same outbox operation is retried.

## 20.4 Email Status

Suggested statuses:

- `PENDING`
- `SENDING`
- `SENT`
- `FAILED`

The email processing mechanism is internal. It does not require a public API for clients to directly trigger arbitrary email sends.

---

# 21. Audit Log APIs

## 21.1 Audit Requirements

Audit records are required for important operations, including:

- Wedding creation.
- Primary Admin invitation and acceptance.
- Additional organiser invitations.
- Organiser role changes.
- Organiser removal.
- Event and task changes.
- Guest and invitation changes.
- RSVP changes.
- Expense creation and updates.
- Payment creation and updates.
- Payment voiding.
- Vendor changes.
- Website publication changes.
- Photo moderation.
- QR link generation, regeneration, and revocation.
- Livestream publication changes.

## 21.2 Retrieve Audit Logs

`GET /api/v1/weddings/{weddingId}/audit-logs`

**Permission:** Admin only.

Query parameters:

- `actorUserId`
- `action`
- `entityType`
- `fromDate`
- `toDate`
- `page`
- `limit`

Audit records must not expose passwords, raw tokens, authentication secrets, or unnecessary personal information.

Audit records are append-only from the application perspective. Ordinary application users must not edit or remove audit history.

---

# 22. Complete Endpoint Inventory

This table consolidates the principal application endpoints defined in this document.

| Module | Method | Endpoint |
|---|---|---|
| Auth | GET | `/auth/me` |
| Auth | POST | `/auth/register` |
| Auth | POST | `/auth/verify-email/resend` |
| Auth | POST | `/auth/verify-email/confirm` |
| Auth | POST | `/auth/password/forgot` |
| Auth | POST | `/auth/password/reset` |
| Auth | POST | `/auth/password/change` |
| Wedding | POST | `/weddings` |
| Wedding | GET | `/weddings/current` |
| Wedding | GET | `/weddings/{weddingId}` |
| Wedding | PATCH | `/weddings/{weddingId}` |
| Wedding | GET | `/weddings/{weddingId}/setup-status` |
| Organisers | GET | `/weddings/{weddingId}/organisers` |
| Organisers | POST | `/weddings/{weddingId}/organisers/invitations` |
| Organisers | POST | `/organisers/invitations/accept` |
| Organisers | PATCH | `/weddings/{weddingId}/organisers/{membershipId}` |
| Organisers | DELETE | `/weddings/{weddingId}/organisers/{membershipId}` |
| Primary Admin | GET | `/primary-admin-invitations/{token}` |
| Primary Admin | POST | `/primary-admin-invitations/accept` |
| Events | GET | `/weddings/{weddingId}/events` |
| Events | POST | `/weddings/{weddingId}/events` |
| Events | GET | `/weddings/{weddingId}/events/{eventId}` |
| Events | PATCH | `/weddings/{weddingId}/events/{eventId}` |
| Events | POST | `/weddings/{weddingId}/events/{eventId}/cancel` |
| Tasks | GET | `/weddings/{weddingId}/tasks` |
| Tasks | POST | `/weddings/{weddingId}/tasks` |
| Tasks | GET | `/weddings/{weddingId}/tasks/{taskId}` |
| Tasks | PATCH | `/weddings/{weddingId}/tasks/{taskId}` |
| Tasks | PATCH | `/weddings/{weddingId}/tasks/{taskId}/status` |
| Tasks | DELETE | `/weddings/{weddingId}/tasks/{taskId}` |
| Guests | GET | `/weddings/{weddingId}/guests` |
| Guests | POST | `/weddings/{weddingId}/guests` |
| Guests | GET | `/weddings/{weddingId}/guests/{guestId}` |
| Guests | PATCH | `/weddings/{weddingId}/guests/{guestId}` |
| Guests | DELETE | `/weddings/{weddingId}/guests/{guestId}` |
| Guest Invitations | POST | `/weddings/{weddingId}/guests/{guestId}/event-invitations` |
| Guest Invitations | GET | `/weddings/{weddingId}/guests/{guestId}/event-invitations` |
| Guest Invitations | PATCH | `/weddings/{weddingId}/guests/{guestId}/event-invitations/{invitationId}` |
| Household Link | POST | `/weddings/{weddingId}/guests/{guestId}/invitation-link` |
| Household Link | POST | `/weddings/{weddingId}/guests/{guestId}/invitation-link/revoke` |
| Household Link | POST | `/weddings/{weddingId}/guests/{guestId}/invitation-link/regenerate` |
| Public Invitation | GET | `/public/invitations/{token}` |
| RSVP | POST | `/public/invitations/{token}/events/{eventId}/rsvp` |
| RSVP | GET | `/public/invitations/{token}/rsvps` |
| RSVP | GET | `/weddings/{weddingId}/rsvps/summary` |
| RSVP | GET | `/weddings/{weddingId}/events/{eventId}/rsvps` |
| Expenses | GET | `/weddings/{weddingId}/expenses` |
| Expenses | POST | `/weddings/{weddingId}/expenses` |
| Expenses | GET | `/weddings/{weddingId}/expenses/{expenseId}` |
| Expenses | PATCH | `/weddings/{weddingId}/expenses/{expenseId}` |
| Expenses | GET | `/weddings/{weddingId}/expenses/summary` |
| Payments | GET | `/weddings/{weddingId}/expenses/{expenseId}/payments` |
| Payments | POST | `/weddings/{weddingId}/expenses/{expenseId}/payments` |
| Payments | PATCH | `/weddings/{weddingId}/expenses/{expenseId}/payments/{paymentId}` |
| Payments | POST | `/weddings/{weddingId}/expenses/{expenseId}/payments/{paymentId}/void` |
| Payments | GET | `/weddings/{weddingId}/expenses/{expenseId}/payments/{paymentId}` |
| Vendors | GET | `/weddings/{weddingId}/vendors` |
| Vendors | POST | `/weddings/{weddingId}/vendors` |
| Vendors | GET | `/weddings/{weddingId}/vendors/{vendorId}` |
| Vendors | PATCH | `/weddings/{weddingId}/vendors/{vendorId}` |
| Vendors | DELETE | `/weddings/{weddingId}/vendors/{vendorId}` |
| Vendors | GET | `/weddings/{weddingId}/vendors/discover` |
| Vendors | POST | `/weddings/{weddingId}/vendors/save-discovered` |
| Website | GET | `/weddings/{weddingId}/website` |
| Website | PATCH | `/weddings/{weddingId}/website` |
| Website | PATCH | `/weddings/{weddingId}/website/content` |
| Website | POST | `/weddings/{weddingId}/website/publish` |
| Website | POST | `/weddings/{weddingId}/website/unpublish` |
| Website | GET | `/weddings/{weddingId}/website/preview` |
| Public Website | GET | `/public/websites/{slug}` |
| Albums | GET | `/weddings/{weddingId}/albums` |
| Albums | POST | `/weddings/{weddingId}/albums` |
| Albums | GET | `/weddings/{weddingId}/albums/{albumId}` |
| Albums | PATCH | `/weddings/{weddingId}/albums/{albumId}` |
| Albums | POST | `/weddings/{weddingId}/albums/{albumId}/publish` |
| Albums | POST | `/weddings/{weddingId}/albums/{albumId}/unpublish` |
| Upload | GET | `/public/uploads/{token}` |
| Upload | POST | `/public/uploads/{token}/photos` |
| Photos | GET | `/weddings/{weddingId}/albums/{albumId}/photos` |
| Photos | POST | `/weddings/{weddingId}/photos/{photoId}/approve` |
| Photos | POST | `/weddings/{weddingId}/photos/{photoId}/reject` |
| Photos | DELETE | `/weddings/{weddingId}/photos/{photoId}` |
| Public Gallery | GET | `/public/gallery/{token}` |
| Public Gallery | GET | `/public/gallery/{token}/photos/{photoId}` |
| QR Links | GET | `/weddings/{weddingId}/qr-links` |
| QR Links | POST | `/weddings/{weddingId}/qr-links` |
| QR Links | POST | `/weddings/{weddingId}/qr-links/{qrLinkId}/revoke` |
| QR Links | POST | `/weddings/{weddingId}/qr-links/{qrLinkId}/regenerate` |
| Livestream | GET | `/weddings/{weddingId}/livestreams` |
| Livestream | POST | `/weddings/{weddingId}/livestreams` |
| Livestream | PATCH | `/weddings/{weddingId}/livestreams/{livestreamId}` |
| Livestream | POST | `/weddings/{weddingId}/livestreams/{livestreamId}/publish` |
| Livestream | POST | `/weddings/{weddingId}/livestreams/{livestreamId}/unpublish` |
| Public Livestream | GET | `/public/websites/{slug}/livestreams` |
| Dashboard | GET | `/weddings/{weddingId}/dashboard` |
| Dashboard | GET | `/weddings/{weddingId}/dashboard/upcoming-events` |
| Dashboard | GET | `/weddings/{weddingId}/dashboard/pending-tasks` |
| Dashboard | GET | `/weddings/{weddingId}/dashboard/financial-summary` |
| Audit | GET | `/weddings/{weddingId}/audit-logs` |

This inventory is the principal MVP route baseline. Additional internal provider callbacks and background-processing routes may be implemented where required by the approved architecture, but must not introduce unapproved product functionality.

---

# 23. Validation and Business Rule Enforcement

Validation must occur on the backend, regardless of frontend validation.

## 23.1 General Validation

- Required fields must be checked.
- Strings must be trimmed and length-limited.
- Email addresses must be normalised.
- ObjectIds must be validated.
- Enums must match approved values.
- Date and time values must be valid.
- Numeric values must be within safe ranges.
- Unknown or protected fields must be rejected or ignored according to the endpoint contract.

## 23.2 Wedding Isolation

Every wedding-scoped endpoint must validate that all referenced records belong to the same wedding.

For example, an expense must not reference a vendor from another wedding.

The backend must derive the current user's permissions from the active membership record.

## 23.3 Primary Admin Integrity

- Only a Bride or Groom may create a wedding.
- The creator receives the corresponding protected Primary Admin position.
- The invited partner receives the other position after acceptance.
- There are exactly two protected Primary Admin positions.
- Primary Admins cannot be demoted or removed through normal organiser APIs.
- Additional Admins cannot promote themselves or replace Primary Admins.
- Recovery of both Primary Admin positions is a support-assisted process.

## 23.4 Household and RSVP Integrity

- One household invitation per household-event pair.
- One RSVP response per household-event pair.
- One household invitation link spans all assigned events.
- No guest accounts.
- No guest OTP.
- No guest session collection.
- RSVP attendee counts must respect the household's event-specific limit.
- Additional attendees may attend even if the primary invitee declines.

## 23.5 Financial Integrity

- INR only.
- Whole rupees only.
- No fractional rupee values.
- Active payments cannot exceed the expense total.
- Expense totals cannot be reduced below active payments.
- Voided payments remain in history.
- Only Admins can void payments.
- Voided payments are excluded from financial summaries.
- Financial changes must be audited.

## 23.6 Public Access Integrity

Public routes must validate their access token on every request.

A public token must never grant access outside its intended scope.

| Token | Permitted access |
|---|---|
| Household invitation | RSVP for assigned household events |
| Gallery-view QR | Published gallery content |
| Guest-upload QR | Submit photos to the wedding |

These tokens are independent and cannot be substituted for one another.

---

# 24. Transactions and Concurrency

MongoDB Atlas transactions should be used where a business operation modifies multiple related documents and partial completion would violate an invariant.

## 24.1 Wedding Creation

The following should be treated as one logical operation:

- Create wedding.
- Create creator membership.
- Set Primary Bride or Groom.
- Create partner invitation.
- Create associated audit event.
- Queue invitation email through the outbox pattern.

## 24.2 Invitation Acceptance

The following operations should be transactionally coordinated:

- Validate invitation state.
- Verify membership eligibility.
- Create membership.
- Update invitation status.
- Update wedding setup status when the second Primary Admin becomes active.
- Record audit history.

Unique database indexes remain the final defence against duplicate active membership and primary-position conflicts.

## 24.3 Payment Creation

Payment creation must prevent concurrent overpayment.

Recommended transaction:

1. Read the expense.
2. Calculate the sum of active payments.
3. Validate the proposed payment.
4. Insert the payment.
5. Recalculate or update any approved financial cache.
6. Record the audit event.
7. Commit the transaction.

If concurrent requests could cause an overpayment, the implementation must use an atomic concurrency-control mechanism, such as a conditional expense update or optimistic version check, rather than relying on a simple read-before-write sequence.

## 24.4 Payment Void

The void operation should:

1. Confirm the payment is active.
2. Update its status to `VOIDED`.
3. Record void metadata.
4. Recalculate financial totals.
5. Record the audit event.
6. Commit all changes together.

## 24.5 QR Token Rotation

Token regeneration must ensure that the old token is invalidated and the new token is active without leaving two active tokens of the same type for one wedding.

## 24.6 Optimistic Concurrency

For editable records where simultaneous updates may overwrite each other, use Mongoose versioning or an explicit version field.

The API may return:

`409 CONFLICT`

when a request attempts to update a record using a stale version.

---

# 25. Security Requirements

## 25.1 Authentication Security

- Use Auth.js for authentication.
- Use secure, HTTP-only cookies where applicable.
- Enforce email verification before organiser access.
- Hash passwords using the approved password-hashing approach.
- Never store raw passwords.
- Store password reset and verification tokens as hashes.
- Apply rate limiting to authentication-related endpoints.

## 25.2 Authorisation Security

- Check membership on every wedding-scoped request.
- Enforce role-based access on the backend.
- Validate wedding ownership for every referenced resource.
- Protect Primary Admin membership.
- Prevent horizontal privilege escalation.
- Never trust client-supplied role or membership data.

## 25.3 Public Token Security

- Use cryptographically secure random tokens.
- Store token hashes only.
- Compare tokens using a secure verification process.
- Never expose tokens in application logs.
- Support revocation and regeneration where specified.
- Rate-limit public token endpoints.

## 25.4 Upload Security

- Validate file type and size.
- Inspect actual file content.
- Restrict upload formats to approved image formats.
- Use private Cloudflare R2 storage.
- Use short-lived signed URLs for authorised image access.
- Apply upload quotas and rate limits.
- Prevent unauthorised access to pending and rejected photos.

## 25.5 API Security

- Validate and sanitise input.
- Protect against NoSQL injection.
- Configure appropriate CORS policies.
- Apply CSRF protection appropriate to the cookie-based authentication setup.
- Use HTTPS.
- Avoid returning internal database objects directly.
- Avoid mass assignment of protected fields.
- Keep provider credentials server-side.
- Apply request size limits.
- Avoid leaking internal error details.

## 25.6 Privacy

Public APIs must return only data intended for public access.

Household contact information, organiser information, financial data, audit logs, and pending photo moderation information must remain protected.

---

# 26. Rate Limiting

Rate limits should be applied by route category.

| API category | Rate-limit approach |
|---|---|
| Registration | Strict |
| Login and authentication | Strict |
| Password recovery | Strict |
| Email verification | Strict |
| Public household invitation | Moderate |
| RSVP submission | Moderate |
| Public photo upload | Strict, with upload quotas |
| Gallery access | Moderate |
| Vendor discovery | Provider-aware |
| Organiser CRUD | Normal |
| Dashboard reads | Normal |

The exact numerical thresholds should be established during implementation and security testing.

Rate limits must not be used as a substitute for authentication, authorisation, or token validation.

---

# 27. Pagination, Filtering and Sorting

Collection endpoints should use consistent pagination.

Default:

- `page = 1`
- `limit = 20`

Maximum:

- `limit = 100`

Example:

`GET /api/v1/weddings/{weddingId}/events?page=1&limit=20&sortBy=eventDate&order=asc`

Rules:

1. Validate pagination values.
2. Restrict sorting to approved fields.
3. Restrict filters to supported query parameters.
4. Apply wedding isolation before returning results.
5. Avoid unrestricted MongoDB query objects from clients.
6. Use indexes for frequently queried filters.
7. Use cursor pagination for high-volume collections where offset pagination becomes inefficient.

---

# 28. Third-Party Integration Boundaries

## 28.1 Auth.js

Responsible for:

- Session management.
- Google OAuth.
- Authentication callbacks.
- Adapter integration.

The application owns wedding membership and application-level authorisation.

## 28.2 Resend

Responsible for sending application emails.

The backend owns:

- Email event creation.
- Template selection.
- Recipient validation.
- Outbox tracking.
- Retry behaviour.

## 28.3 Cloudflare R2

Responsible for image object storage.

The backend owns:

- Upload authorisation.
- File validation.
- Storage metadata.
- Signed URL generation.
- Photo publication access checks.

## 28.4 Google Places API (New)

Responsible for external vendor discovery.

The backend must:

- Keep credentials private.
- Validate and limit search requests.
- Handle provider errors.
- Return only approved response fields.
- Save selected vendors into the wedding's own vendor collection.

## 28.5 YouTube

Responsible for livestream hosting and playback availability.

The application stores validated YouTube references and provides the public embed experience.

It does not host or manage livestream video infrastructure.

---

# 29. API Testing Requirements

The API must be tested at unit, integration, and end-to-end levels.

## 29.1 Authentication Tests

- Registration with valid information.
- Duplicate email rejection.
- Email verification.
- Expired verification token rejection.
- Password recovery.
- Expired password reset token rejection.
- Google authentication.
- Unverified account access rejection.

## 29.2 Authorisation Tests

- Unauthenticated access rejection.
- Non-member access rejection.
- Cross-wedding access rejection.
- Manager access restrictions.
- Additional Admin permissions.
- Primary Admin protection.
- Attempts to self-promote rejected.
- Attempts to modify another wedding's records rejected.

## 29.3 Wedding and Organiser Tests

- Only Bride/Groom can create a wedding.
- Creator receives protected Primary Admin membership.
- Partner invitation acceptance.
- Exactly two Primary Admin positions.
- Duplicate active membership rejection.
- One active wedding membership per user.
- Removed organiser access is revoked.
- Both Primary Admins cannot be removed through normal APIs.

## 29.4 RSVP Tests

- RSVP for assigned event succeeds.
- RSVP for unassigned event fails.
- Primary invitee attending with valid additional count.
- Primary invitee declining with additional attendees.
- Maximum party size enforcement.
- Duplicate household-event response handling.
- RSVP cutoff enforcement.
- Household token revocation.

## 29.5 Financial Tests

- Integer rupee validation.
- Fractional amount rejection.
- Payment creation.
- Multiple payments for one expense.
- Overpayment prevention.
- Expense total reduction below paid amount rejected.
- Payment update.
- Payment void by Admin.
- Payment void by Manager rejected.
- Voided payment remains available in history.
- Voided payment excluded from paid totals.
- Concurrent payment attempts cannot exceed expense total.
- Audit history created for financial changes.

## 29.6 Gallery Tests

- Upload token authorises upload only.
- Gallery token authorises gallery viewing only.
- Revoked tokens are rejected.
- Pending photos are not publicly visible.
- Rejected photos are not publicly visible.
- Approved photos appear only when publication requirements are satisfied.
- Cross-wedding photo access is rejected.
- Upload quotas and file validation work.

## 29.7 Website and Livestream Tests

- Unpublished website is not publicly accessible.
- Published website returns configured public content only.
- Hindi and English content are returned correctly.
- Invalid theme is rejected.
- Duplicate website slug is rejected.
- Invalid YouTube URL is rejected.
- Unpublished livestream is not exposed publicly.

---

# 30. Implementation Priorities

The API should be implemented in dependency order.

| Phase | Modules | Implementation objective |
|---|---|---|
| 1 | Database connection, common API utilities | Establish API foundation |
| 2 | Authentication | Registration, verification, Google and password login |
| 3 | Wedding and memberships | Workspace creation and Primary Admin lifecycle |
| 4 | Organiser invitations | Additional Admin and Manager access |
| 5 | Events and tasks | Core wedding planning |
| 6 | Guests, invitations and RSVP | Household and event RSVP workflows |
| 7 | Expenses and payments | Financial tracking and integrity |
| 8 | Vendors | Vendor management and discovery |
| 9 | Website | Configuration, preview and publication |
| 10 | Albums and photos | Upload, moderation and gallery |
| 11 | QR links | Gallery and guest upload access |
| 12 | Livestream | YouTube configuration and publication |
| 13 | Dashboard and audit | Aggregates and operational visibility |
| 14 | Security and integration testing | Production-readiness validation |

Dependencies must be respected. For example, RSVP APIs depend on wedding, event, household, and invitation functionality.

---

# 31. API Design Decisions Register

The following decisions are fixed for this MVP API baseline.

| No. | Decision | Status |
|---|---|---|
| 1 | REST API architecture | Approved |
| 2 | `/api/v1` version prefix | Approved |
| 3 | Next.js Route Handlers and Node.js | Approved |
| 4 | TypeScript | Approved |
| 5 | Auth.js authentication | Approved |
| 6 | Google OAuth and email/password | Approved |
| 7 | Verified email required for organiser access | Approved |
| 8 | Two organiser roles: Admin and Manager | Approved |
| 9 | Primary Admin is a protected membership classification | Approved |
| 10 | Only Bride or Groom can create a wedding | Approved |
| 11 | One active wedding membership per user | Approved |
| 12 | Household-based guest invitation and RSVP | Approved |
| 13 | No guest accounts, OTP, or guest sessions | Approved |
| 14 | One household invitation link across assigned events | Approved |
| 15 | Per-event RSVP | Approved |
| 16 | Independent primary invitee and additional attendee counts | Approved |
| 17 | INR whole rupees only | Approved |
| 18 | Payment history must never be physically deleted | Approved |
| 19 | Admin-only payment voiding | Approved |
| 20 | Voided payments excluded from financial calculations | Approved |
| 21 | Resend email integration | Approved |
| 22 | Cloudflare R2 photo storage | Approved |
| 23 | Google Places API (New) vendor discovery | Approved |
| 24 | One wedding-wide gallery-view QR | Approved |
| 25 | One separate wedding-wide guest-upload QR | Approved |
| 26 | Gallery and upload tokens stored as hashes | Approved |
| 27 | Pending guest uploads require moderation | Approved |
| 28 | Three approved website themes | Approved |
| 29 | English and Hindi guest-facing content | Approved |
| 30 | Public YouTube livestream embed | Approved |
| 31 | No online payment gateway | Approved |
| 32 | No professional planner multi-wedding management | Approved |

---

# 32. Final API Freeze Checklist

Before treating this document as frozen, verify:

- [ ] All endpoints align with the PRD MVP scope.
- [ ] All endpoint resource relationships align with the Database Design Document.
- [ ] No endpoint bypasses wedding membership authorisation.
- [ ] Primary Admin protection is enforced server-side.
- [ ] Managers cannot perform Admin-only actions.
- [ ] Household RSVP limits are enforced server-side.
- [ ] No guest account, OTP, or guest-session workflow has been introduced.
- [ ] Financial amounts use whole INR rupees only.
- [ ] Payment history cannot be physically deleted.
- [ ] Payment voiding preserves the original payment record.
- [ ] Overpayment is prevented under concurrent requests.
- [ ] Public gallery and upload tokens have separate permissions.
- [ ] Exactly one active gallery-view and one active guest-upload link are permitted per wedding.
- [ ] Only approved and published photos are publicly accessible.
- [ ] Website endpoints expose only configured public content.
- [ ] Livestream endpoints use validated YouTube references.
- [ ] Email delivery uses the outbox approach.
- [ ] Audit records are generated for important operations.
- [ ] All sensitive tokens and credentials are protected.
- [ ] API integration and authorisation tests pass.

---

# 33. Freeze Statement

This API Design Document v1.0 defines the proposed REST API contract for the Make My Marriage MVP.

It is aligned with:

- Make My Marriage PRD v1.1.
- Make My Marriage System Design Architecture Document v1.4.
- Make My Marriage Database Design Document v1.0.

Once approved and frozen, this document becomes the implementation reference for frontend-backend API integration.

Any future change affecting endpoint behaviour, permissions, payload structures, business rules, or resource relationships must be reviewed against the PRD, System Design Architecture Document, and Database Design Document.

Changes outside the approved MVP scope must not be introduced through implementation convenience alone.

**Document status: Final Draft – Ready for Review and Freeze.**