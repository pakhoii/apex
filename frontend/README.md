# Frontend Documentation

## Project Structure

```
frontend/
├── .gitignore               # Specifies intentionally untracked files to ignore.
├── components.json          # Configuration for components in the project.
├── eslint.config.js         # ESLint configuration for linting JavaScript/TypeScript code.
├── index.html               # Entry HTML file for the application.
├── package.json             # Contains project metadata and dependencies.
├── postcss.config.ts        # Configuration for PostCSS, used with Tailwind CSS.
├── README.md                # Documentation for the frontend project.
├── tailwind.config.ts       # Tailwind CSS configuration file.
├── tsconfig.app.json        # TypeScript configuration for the application.
├── tsconfig.json            # Base TypeScript configuration file.
├── tsconfig.node.json       # TypeScript configuration for Node.js.
├── vite.config.ts           # Vite configuration file for the development server and build.
├── public/                  # Static assets served directly by the server.
│   ├── fonts/               # Fonts used in the application.
│   ├── images/              # Image assets.
│   ├── logo/                # Logo assets.
│   └── video/               # Video assets.
├── src/                     # Source code for the application.
│   ├── App.css              # Global CSS for the application.
│   ├── App.tsx              # Root component of the application.
│   ├── index.css            # Base CSS file.
│   ├── main.tsx             # Entry point for the React application.
│   ├── assets/              # Additional assets used in the application.
│   ├── components/          # Reusable UI components.
│   │   ├── Auth/            # Components for authentication (login, register).
│   │   ├── CarDetail/       # Components for car details and comparison.
│   │   ├── Cart/            # Components for shopping cart functionality.
│   │   ├── Checkout/        # Components for the checkout process.
│   │   ├── Dashboard/       # Components for user/admin dashboards.
│   │   ├── Footer/          # Footer component.
│   │   ├── ModelsGallery/   # Components for displaying car models.
│   │   ├── Navbar/          # Navigation bar component.
│   │   ├── TestDriveForm/   # Components for test drive booking forms.
│   │   └── ui/              # Generic UI components (buttons, forms, etc.).
│   ├── hooks/               # Custom React hooks for shared logic.
│   ├── layouts/             # Layout components for structuring pages.
│   ├── lib/                 # Utility functions and libraries.
│   ├── pages/               # Page components for routing.
│   │   ├── About/           # About page.
│   │   ├── Auth/            # Authentication pages.
│   │   ├── Checkout/        # Checkout page.
│   │   ├── Compare/         # Car comparison page.
│   │   ├── Dashboard/       # Dashboard page.
│   │   ├── Landing/         # Landing page.
│   │   ├── Models/          # Car models page.
│   │   ├── MyCart/          # User's cart page.
│   │   └── TestDrive/       # Test drive booking page.
│   ├── routes/              # Route definitions and protected routes.
│   ├── services/            # API service files for backend communication.
│   └── types/               # TypeScript type definitions.
```

## How to run the frontend

Change directory to the frontend folder. Type these commands to run:

```
npm install
npm run dev
```
