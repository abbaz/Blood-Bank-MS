# Smart Blood Bank Management System

Four-page frontend prototype for the SEN-311L semester project, based on the proposal and UML diagrams. It presents expiry-aware allocation and blood-group compatibility matching; inventory and allocation workflows are not connected to a backend yet.

## Pages

- `index.html` — Home
- `register.html` — Sign up with role, institution, and password rules
- `login.html` — Sign in
- `contact.html` — Contact form

Open `index.html` in Chrome, Firefox, or Edge. A local server is optional.

Demo login: `staff@bloodbank.pk` / `Staff@123`

Accounts and contact tickets are stored in this browser (`localStorage`) for this prototype. The demo password digest is not production-grade authentication: there is no server, secure password hashing, database, authorization enforcement, or institution-level data isolation. Do not use real personal, donor, or patient information.

## Included

- Home page describing the project, roles, red-cell compatibility, and safety boundaries. The inventory figures are illustrative, not live data.
- Registration and sign-in forms with field-level validation and a demo staff account.
- Contact form with field-level validation and a local-only submission confirmation.
- Responsive burgundy, cream, and sage styling.
