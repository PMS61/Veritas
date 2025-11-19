# Project Overview

This project, named "Veritas", is a web application built with Next.js and TypeScript. It appears to be a platform for information verification and misinformation detection. The name "Veritas," Latin for "truth," and the tagline "Eye that discerns the truth" strongly suggest this purpose.

The application has two main parts: a public-facing website and a user dashboard.

*   **Public Website:** This section includes a homepage, an about page, a contact page, and pages for terms of service and privacy policy. The homepage showcases the platform's features, such as "Truth Analysis," "Misinformation Detection," and "Source Verification." It also displays recent verifications and statistics.
*   **User Dashboard:** After logging in, users are directed to a dashboard. This area provides tools for verifying information, viewing truth updates, accessing analytics, and tracking trending topics. The dashboard is designed to be a workspace for users to actively engage with the platform's verification capabilities.

The project uses a modern tech stack, including:

*   **Framework:** Next.js (with the App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS with a dark/light theme implementation.
*   **UI Components:** A combination of custom components and components from `@radix-ui` and `shadcn/ui`.
*   **Authentication:** The app has a built-in authentication system (`AuthProvider`).
*   **Data Visualization:** `recharts` is used for displaying charts and graphs in the dashboard.
*   **Linting/Formatting:** ESLint is configured for code quality.

# Building and Running

The following scripts are available in `package.json` to build, run, and lint the application:

*   **Development:** `npm run dev`
    *   Runs the application in development mode.
*   **Build:** `npm run build`
    *   Creates a production-ready build of the application.
*   **Start:** `npm run start`
    *   Starts the production server.
*   **Lint:** `npm run lint`
    *   Runs the ESLint code linter.

**To get started:**

1.  Install dependencies: `npm install`
2.  Run the development server: `npm run dev`
3.  Open [http://localhost:3000](http://localhost:3000) in your browser.

# Development Conventions

*   **Component-Based Architecture:** The application is built using a component-based architecture, with components located in the `components` directory.
*   **Styling:** Tailwind CSS is used for styling, with custom styles defined in `app/globals.css`.
*   **Theming:** The application supports both dark and light themes, managed by the `ThemeProvider` component.
*   **Authentication:** Authentication is handled by the `AuthProvider` component, and protected routes redirect unauthenticated users to the login page.
*   **Navigation:** Navigation is managed through the `lib/navigation.ts` file, which defines the navigation items for the public and dashboard layouts.
*   **State Management:** The application uses React's built-in state management features (`useState`, `useEffect`, `useContext`).
*   **Code Quality:** The project is set up with TypeScript and ESLint to enforce code quality and consistency.
The `next.config.mjs` is configured to ignore TypeScript and ESLint errors during the build process, which may be a temporary measure for development.
