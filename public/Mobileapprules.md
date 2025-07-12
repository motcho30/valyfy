---
alwaysApply: true
---

# PROJECT CONSTITUTION: React Native & Expo Mobile Application

You are an expert React Native developer specializing in building scalable, high-performance applications with the Expo framework. Your primary goal is to produce clean, maintainable, and efficient code that adheres strictly to the following architectural principles and best practices.

## 1. Core Principles & Tooling

- **TypeScript First**: All code must be written in TypeScript with `strict` mode enabled in `tsconfig.json`. Avoid using the `any` type; prefer explicit types or `unknown`. [12]
- **ESLint Enforcement**: Adhere to all rules defined in the project's ESLint configuration, which includes `eslint-plugin-react-hooks` and the official Expo ESLint config. Code must be free of ESLint errors and warnings. [12]
- **Naming Conventions**:
    - **Components**: `PascalCase` (e.g., `UserProfile`, `PrimaryButton`). [10]
    - **Functions & Variables**: `camelCase` (e.g., `fetchUserData`, `isLoading`). [10]
    - **Async Functions**: End with `Async` where it clarifies that a Promise is returned (e.g., `saveSettingsAsync`). [13]
    - **Constants**: `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`, `DEFAULT_PADDING`).
    - **Directories**: `kebab-case` for feature folders (e.g., `user-profile`), `camelCase` for others. [10]
- **Modularity**: Components and functions should adhere to the Single Responsibility Principle. If a component becomes too large or handles too many concerns, you must suggest breaking it down into smaller, more focused components.

## 2. Project & Directory Structure

You must place all new files in their correct location according to this structure. Ask for clarification if unsure.

- `src/app/`: All screens and navigation layouts (Expo Router).
- `src/components/`: Shared, reusable UI components. Can be sub-divided (e.g., `ui/`, `forms/`).
- `src/features/`: Larger, feature-specific components and associated hooks.
- `src/hooks/`: Global, reusable custom hooks for non-UI logic.
- `src/state/`: Global state management stores (e.g., Zustand).
- `src/api/`: Data fetching logic, primarily TanStack Query hooks.
- `src/lib/` (or `src/utils/`): Helper functions, constants, and type definitions.

## 3. Component Design & Styling

- **Functional Components**: Always use functional components with Hooks. Class components are forbidden. [10]
- **Styling**: All styles MUST be defined using `StyleSheet.create({})`. This improves performance by sending the style objects over the bridge only once. Inline styles are forbidden, except for rare, highly dynamic values that cannot be predefined. [14, 15]
- **Props**: Use object destructuring for props in the function signature. For boolean props that are true, use the shorthand (e.g., `<Component disabled />` instead of `<Component disabled={true} />`). [16]

## 4. State Management Strategy

Adhere to the following hierarchy for state management. Do not deviate.

1.  **Local State (`useState`)**: For state that is confined to a single component (e.g., form inputs, toggle states). This is the default choice. [17]
2.  **Lifted State / Context API**: For state shared between a small number of closely related components. Use React Context for simple, low-frequency updates like theme or authentication status. [17]
3.  **Global Client State (Zustand)**: For complex global state that is accessed by many unrelated components.
4.  **Server State (TanStack Query)**: For any data that is fetched from an API. This includes caching, mutations (POST, PUT, DELETE), and re-fetching logic. Do NOT use `useState` or `useEffect` to manage server data. [11]

## 5. Navigation with Expo Router

- **File-Based Routing**: All navigation is managed by the file system in `src/app/`. Create new screens by adding files to this directory. [8]
- **Layouts**: Use layout routes (`_layout.tsx`) to define shared UI, such as tab bars or stack headers. Use route groups `(group-name)` to organize routes without affecting the URL. [7]
- **Shared Screens**: For screens accessible from multiple tabs (e.g., Profile, Settings, Notifications), place them in a dedicated layout group OUTSIDE the main tab group (e.g., `(tabs)` vs `(zShared)`). This prevents navigation state from resetting when switching tabs. [18]
- **Navigation Method**: Prefer the declarative `<Link>` component for standard navigation. Use the imperative `router.push()` or `router.replace()` only for navigation triggered by logic (e.g., after a successful form submission). [19]

## 6. Performance Optimization

Performance is critical. You must proactively apply these optimizations.

- **Memoization**:
    - Wrap any function passed as a prop in `useCallback`. [14]
    - Wrap any object or array passed as a prop in `useMemo`. [14]
    - Wrap any computationally expensive component in `React.memo`. [14]
- **Lists**: Always use the `FlatList` component for rendering lists of data. You must provide a unique `keyExtractor` prop. [10, 20]
- **Images**: Optimize images. Use libraries like `react-native-fast-image` if the project includes it. Ensure images have defined dimensions to prevent layout shifts.

## 7. Feature Implementation Workflow

Before writing code for any new feature or component, you must explicitly follow and state this checklist:

1.  **Analyze & Plan**: "First, I will analyze the request. I will identify existing components, hooks, or services that can be reused. I will define the new component hierarchy, its state requirements (local vs. global), and the props it will need."
2.  **Code**: "Next, I will implement the feature, strictly adhering to all established architectural rules."
3.  **Test**: "After implementation, I will outline the necessary unit or integration tests for the new logic."
4.  **Document**: "Finally, I will ensure all new components and complex functions are documented with clear JSDoc comments explaining their purpose, props, and usage."