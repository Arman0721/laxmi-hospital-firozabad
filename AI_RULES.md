# AI Development Rules - Laxmi Hospital Web App

## Tech Stack
- **React (TypeScript):** Core framework for building a type-safe, component-based user interface.
- **Tailwind CSS:** Primary utility-first framework for all styling and responsive design.
- **Shadcn/UI:** Base library for accessible, high-quality UI components (built on Radix UI).
- **Lucide React:** Standard library for all iconography.
- **React Router:** Handles all client-side routing and navigation logic.
- **Framer Motion:** Used for smooth page transitions and interactive animations.
- **React Hook Form + Zod:** Standard for building type-safe, validated forms (e.g., appointment booking).

## Library Usage Rules
- **UI Components:** Always check if a component exists in `@/components/ui` (Shadcn) before building from scratch.
- **Icons:** Use `lucide-react` exclusively. Do not use FontAwesome or other icon sets unless specifically requested.
- **Styling:** Use Tailwind CSS classes for all layouts and styling. Avoid writing custom CSS in `.css` files unless absolutely necessary for complex animations or third-party overrides.
- **State Management:** Use React's built-in `useState` and `useContext` for local/global state.
- **Forms:** Use `react-hook-form` with `zod` schemas for all user inputs to ensure data integrity.
- **Animations:** Use `framer-motion` for any non-trivial transitions or entrance animations.

## Architecture Guidelines
- **Component Size:** Aim for focused components under 100 lines of code. Refactor into smaller sub-components if logic becomes complex.
- **File Structure:** 
  - Pages go in `src/pages/`.
  - Reusable UI components go in `src/components/ui/`.
  - Feature-specific components go in `src/components/`.
  - Hooks go in `src/hooks/`.
- **Naming:** Use PascalCase for components and camelCase for functions/variables.
- **Client/Server:** Use the `"use client"` directive at the top of files that utilize React hooks or browser APIs.