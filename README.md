# Tutor360

Tutor360 is a responsive home page and browser-based product demo for **Tutor360, an initiative by Knowledge360**. It includes separate parent and tutor registration, role-based dashboard views, attendance, homework sharing, parent concerns, and a homepage announcement that the team manager and super admin can control.

## Run it locally

1. Download or clone this project.
2. Open `index.html` in a modern browser. No build step or package installation is required.
3. Choose **Sign in** and select a demo role, or use the demo accounts below.

## Demo accounts

All demo accounts use the password `tutor360`.

| Role | Email |
| --- | --- |
| Parent | `parent@tutor360.in` |
| Tutor | `tutor@tutor360.in` |
| Team Manager | `manager@tutor360.in` |
| Super Admin | `admin@tutor360.in` |

The tutor demo shares homework with the student name **Riya Sharma**, which is also the parent demo’s child name. Use that name to see the homework appear in the parent dashboard.

## Publish with GitHub Pages

1. Create a new GitHub repository and upload the contents of this `tutor360` folder to its root.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the `main` branch and `/ (root)`, then save.
5. After GitHub Pages finishes publishing, open the URL shown in the Pages settings.

## Project structure

```text
tutor360/
├── index.html          # Landing page, pop-up dialog, and app shell
├── assets/
│   └── tutor360-mark.svg
├── css/
│   └── styles.css      # Responsive design and dashboard styles
├── js/
│   └── app.js          # Demo registration, dashboard, and data flows
└── README.md
```

## What works in this demo

- Parents and tutors have separate registration forms.
- Tutors can record attendance and share homework.
- Parents can view matching homework, review attendance, and submit a concern.
- Team managers and super admins can publish or hide the homepage popup and review concerns.
- Demo records persist in the browser using `localStorage`.

## Production notes

This project is a front-end demo suitable for GitHub Pages. GitHub Pages cannot securely provide shared accounts, permissions, or records across families and tutors. The demo stores its data in the visitor’s browser, and its demo passwords and role checks are not security controls. Before using it with real families, connect it to a backend with secure authentication, server-enforced role permissions, a shared database, password hashing, and appropriate privacy protections. The site displays the contact number **8004702020** and attributes the initiative to **Knowledge360**.
