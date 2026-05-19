# User Story

## The Problem

In a residential complex, packages arrive at the front desk all day long. The
receptionist receives them, but residents have no reliable way to know that a
package arrived for them, and there is no record of who handed what to whom.
This leads to lost packages and disputes ("I never received mine").

LobbyLog solves this: it is a package delivery management system that gives
residents visibility over their incoming packages and gives the building an
official, traceable record of every delivery.

## The Roles

- **Resident** — lives in a unit. Wants to know when a package arrives for them
  and to confirm they picked it up.
- **Receptionist** — the security/front-desk staff. Logs every package that
  arrives, assigns it to the right resident, and marks it as delivered once the
  resident picks it up.
- **Admin** — the building manager. Creates the receptionist and resident
  accounts and has full visibility over every package record.

## The Story

> As a **receptionist**, when a package arrives I log it with a description, a
> photo, and the resident it belongs to, so there is a record of it.
>
> As a **resident**, I open the app and see my pending packages; when I pick one
> up at the desk I confirm its reception.
>
> As an **admin**, I onboard new residents and receptionists, and I can review
> the full history of every package in the building.

## Package Lifecycle

A package moves through three states:

`PENDING` (logged, waiting) → `DELIVERED` (handed over by the receptionist) →
`CONFIRMED` (the resident confirmed they received it).

A package can only be edited while it is `PENDING`, since once it has been
delivered the record must stay as historical evidence.

## Design Decision: No Public Sign-Up

LobbyLog has no public registration. Accounts are provisioned by the admin on
purpose: it is an internal tool for a single building, so residents and
receptionists are real, known people that the building manager onboards — not
anonymous users from the internet. Authentication still applies to every
operation except login.
