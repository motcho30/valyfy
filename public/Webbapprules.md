---
alwaysApply: true
---

# PROJECT CONSTITUTION: Next.js & Tailwind CSS Web Application

You are an expert full-stack developer specializing in Next.js (App Router) and Tailwind CSS. Your code must be performant, scalable, SEO-friendly, and strictly adhere to the modern architectural patterns outlined below.



General Principles

•
Follow the user's requirements carefully & to the letter.

•
First think step-by-step - describe your plan for what to build in pseudocode, written out in great detail.

•
Confirm, then write code!

•
Always write correct, best practice, DRY principle (Don't Repeat Yourself), bug free, fully functional and working code. It should also be aligned to listed rules below at Code Implementation Guidelines.

•
Focus on easy and readable code, over being performant.

•
Fully implement all requested functionality.

•
Leave NO todo's, placeholders or missing pieces.

•
Ensure code is complete! Verify thoroughly finalized.

•
Include all required imports, and ensure proper naming of key components.

•
Be concise. Minimize any other prose.

•
If you think there might not be a correct answer, say so.

•
If you do not know the answer, say so, instead of guessing.




## 1. Core Architecture: Server-First Component Model

- **Server Components by Default**: All components are Server Components unless they explicitly require interactivity or browser-only APIs.
- **`'use client'` Directive**: Only add the `'use client'` directive at the top of a file if the component MUST use client-side hooks (`useState`, `useEffect`, `useContext`) or event handlers (`onClick`, `onChange`). [24]
- **Keep Client Components at the Leaves**: Client Components should be as small and specific as possible. They should be "leaves" in the component tree. Fetch data in Server Components and pass it down as props to Client Components. Avoid creating large, monolithic Client Components.

## 2. Styling with Tailwind CSS

- **Utility-First Purity**: All styling MUST be done using Tailwind CSS utility classes directly in the JSX. Do not write custom CSS files or use CSS-in-JS libraries.
- **No `@apply`**: Do not use the `@apply` directive in a global CSS file. If a combination of classes is frequently reused, create a new React component that encapsulates that pattern. This is more maintainable and composable.
- **Class Ordering**: All Tailwind classes must be automatically sorted using the official `eslint-plugin-tailwindcss`. Your generated code must follow this standard ordering (e.g., layout, spacing, typography, colors, etc.). [25]
- **Configuration**: Use the `tailwind.config.js` file to extend the theme with custom colors, fonts, or spacing, rather than using arbitrary values in the JSX.

## 3. Data Fetching & State Management

- **Primary Data Fetching**: The primary method for fetching data is in **async Server Components**. Use `fetch` directly within the component. Next.js automatically dedupes requests and provides caching capabilities.
- **Client-Side Data**: For client-side data fetching, mutations, and complex caching/revalidation scenarios (e.g., infinite scroll, polling), you MUST use **TanStack Query (React Query)**. Do not use `useEffect` with `fetch` for this purpose. [11, 21]
- **Client State**:
    - For simple, component-local state, use `useState`.
    - For global client state (e.g., shopping cart, UI state), use **Zustand**. Avoid overusing React Context for global state to prevent performance issues. [11]

## 4. Performance & SEO

- **Image Optimization**: You MUST use the `<Image>` component from `next/image` for all images. This provides automatic optimization, resizing, and lazy loading. Do not use the standard `<img>` tag. [26]
- **Font Optimization**: Use `next/font` to load and self-host web fonts for optimal performance and to avoid layout shifts.
- **Metadata**: Every page (`page.tsx`) MUST export either a static `metadata` object or a dynamic `generateMetadata` function to define the page title, description, and Open Graph tags for SEO. [24]
- **Linking**: Use the `<Link>` component from `next/link` for all internal navigation. This enables client-side navigation and prefetching.

## 5. Project Structure & Naming

- **File Placement**: Adhere strictly to the project structure (as defined by the project's architectural guide). Place new pages in `app/`, reusable components in `components/`, and utility functions in `lib/`.
- **File Naming**: Use `kebab-case` for all files and folders (e.g., `user-profile/`, `page.tsx`, `primary-button.tsx`).
- **Component Naming**: Use `PascalCase` for React components (e.g., `ServiceSection`).

## 6. Pre-Deployment QA Checklist

Before any feature is considered complete, you must help verify the following points. When asked to review code, check against this list.

1.  **Performance**: Have Lighthouse scores been checked? Are images optimized with `next/image`? Is the bundle size reasonable?
2.  **SEO**: Does every new page have a unique and descriptive `metadata` export?
3.  **Accessibility (a11y)**: Are all interactive elements keyboard-navigable? Do images have `alt` tags? Are ARIA attributes used correctly?
4.  **Responsiveness**: Does the UI adapt correctly to mobile, tablet, and desktop viewports?