# Admin Frontend

This is the Angular frontend for the MedLoop Admin Microservice, based on the Sakai NG template with PrimeNG.

## Features

- Dashboard with system statistics (Doctors, Patients, Hospitals count)
- Manage Doctors (CRUD operations, assign to hospitals)
- Manage Patients (CRUD operations, assign to doctors)
- Manage Hospitals (CRUD operations)
- Responsive UI with PrimeNG components

## Prerequisites

- Node.js 18+
- Angular CLI 20+
- Backend API running on http://localhost:8080

## Installation

1. Copy the project to your workspace
2. Run `npm install`
3. Run `npm start`

## Usage

- **Dashboard**: View overall system statistics
- **Doctors**: Add, edit, delete doctors, assign to hospitals
- **Patients**: Add, edit, delete patients, assign to doctors
- **Hospitals**: Add, edit, delete hospitals

Navigate using the sidebar menu under "Admin Management".

## API Integration

The frontend connects to the backend REST API at `http://localhost:8080/api/*`

Ensure the Spring Boot backend is running before using the frontend.

## Development

- Development server: `npm start` (runs on http://localhost:4200)
- Build: `npm run build`
- Test: `npm test`

## Technologies

- Angular 20
- PrimeNG 20
- PrimeFlex/Tailwind CSS
- TypeScript

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
