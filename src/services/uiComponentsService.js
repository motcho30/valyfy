// UI Components Service - HextaUI Integration
// This service defines UI components from HextaUI that are linked to specific design types

export const UI_COMPONENTS_DATA = {
  'minimalistic': {
    designName: 'Modern Minimalistic',
    uiLibrary: 'HextaUI',
    components: [
      {
        name: 'Card',
        category: 'Layout',
        description: 'A flexible container component for displaying content in a card layout with header, content, and footer sections.',
        installation: {
          dependencies: 'npm install class-variance-authority',
          cli: 'npx hextaui@latest add card'
        },
        usage: `import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";`,
        variants: ['default', 'outline', 'ghost'],
        sizes: ['sm', 'default', 'lg', 'xl'],
        fullContent: `# Card Component - HextaUI

## Overview

A flexible container component for displaying content in a card layout with header, content, and footer sections.

## Installation

### Install Dependencies

First, install the required dependencies:

\`\`\`bash
npm install class-variance-authority
# or
pnpm add class-variance-authority
# or
yarn add class-variance-authority
# or
bun add class-variance-authority
\`\`\`

### Quick Install via CLI

You can also use the HextaUI CLI:

\`\`\`bash
npx hextaui@latest add card
# or
pnpm dlx hextaui@latest add card
# or
yarn dlx hextaui@latest add card
# or
bun x hextaui@latest add card
\`\`\`

## Usage

### Import

\`\`\`tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
\`\`\`

### Basic Usage

\`\`\`tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here.</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
\`\`\`

### Variants

The Card component supports different variants:

- **default**: Standard card with border
- **outline**: Card with thicker border and hover effects
- **ghost**: Transparent card with hover background

### Sizes

Available sizes for the Card component:

- **sm**: Small padding (p-4)
- **default**: Standard padding (p-6)
- **lg**: Large padding (p-8)
- **xl**: Extra large padding (p-10)

### Examples

#### Profile Card
\`\`\`tsx
<Card className="w-80">
  <CardHeader>
    <CardTitle>John Doe</CardTitle>
    <CardDescription>Software Developer</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Passionate about creating amazing user experiences.</p>
  </CardContent>
  <CardFooter>
    <Button variant="outline">View Profile</Button>
  </CardFooter>
</Card>
\`\`\`

#### Login Form Card
\`\`\`tsx
<Card className="w-96">
  <CardHeader>
    <CardTitle>Sign In</CardTitle>
    <CardDescription>Enter your credentials to continue</CardDescription>
  </CardHeader>
  <CardContent>
    <form className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="Enter your email" />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="Enter your password" />
      </div>
    </form>
  </CardContent>
  <CardFooter>
    <Button className="w-full">Sign In</Button>
  </CardFooter>
</Card>
\`\`\`

#### Information Card
\`\`\`tsx
<Card variant="outline">
  <CardHeader>
    <CardTitle>Project Statistics</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-2xl font-bold">1,234</p>
        <p className="text-sm text-muted-foreground">Total Users</p>
      </div>
      <div>
        <p className="text-2xl font-bold">567</p>
        <p className="text-sm text-muted-foreground">Active Projects</p>
      </div>
    </div>
  </CardContent>
</Card>
\`\`\`

#### Settings Card
\`\`\`tsx
<Card>
  <CardHeader>
    <CardTitle>Account Settings</CardTitle>
    <CardDescription>Manage your account preferences</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span>Email Notifications</span>
        <Switch />
      </div>
      <div className="flex items-center justify-between">
        <span>Two-Factor Authentication</span>
        <Switch />
      </div>
    </div>
  </CardContent>
  <CardFooter>
    <Button>Save Changes</Button>
  </CardFooter>
</Card>
\`\`\`

#### Blog Post Card
\`\`\`tsx
<Card className="overflow-hidden">
  <CardHeader>
    <CardTitle>Getting Started with HextaUI</CardTitle>
    <CardDescription>Learn how to build beautiful interfaces</CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-muted-foreground">
      HextaUI provides a collection of reusable components that you can use to build your next project...
    </p>
  </CardContent>
  <CardFooter className="flex justify-between">
    <span className="text-sm text-muted-foreground">5 min read</span>
    <Button variant="outline">Read More</Button>
  </CardFooter>
</Card>
\`\`\`

#### Pricing Card
\`\`\`tsx
<Card className="relative">
  <CardHeader>
    <CardTitle>Pro Plan</CardTitle>
    <CardDescription>Perfect for growing teams</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-bold">$29</div>
    <p className="text-sm text-muted-foreground">per month</p>
    <ul className="mt-4 space-y-2">
      <li className="flex items-center">
        <Check className="w-4 h-4 mr-2" />
        Unlimited projects
      </li>
      <li className="flex items-center">
        <Check className="w-4 h-4 mr-2" />
        Priority support
      </li>
    </ul>
  </CardContent>
  <CardFooter>
    <Button className="w-full">Get Started</Button>
  </CardFooter>
</Card>
\`\`\`

#### Dashboard Card
\`\`\`tsx
<Card>
  <CardHeader>
    <CardTitle>Recent Activity</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <div>
          <p className="text-sm font-medium">Project updated</p>
          <p className="text-xs text-muted-foreground">2 minutes ago</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        <div>
          <p className="text-sm font-medium">New user joined</p>
          <p className="text-xs text-muted-foreground">1 hour ago</p>
        </div>
      </div>
    </div>
  </CardContent>
</Card>
\`\`\`

#### Notification Card
\`\`\`tsx
<Card variant="outline" className="border-l-4 border-l-blue-500">
  <CardHeader>
    <CardTitle>New Message</CardTitle>
    <CardDescription>You have a new message from John</CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-sm text-muted-foreground">
      "Hey! I wanted to discuss the project timeline..."
    </p>
  </CardContent>
  <CardFooter>
    <Button size="sm">Reply</Button>
    <Button size="sm" variant="outline">Mark as Read</Button>
  </CardFooter>
</Card>
\`\`\`

## Accessibility

The Card component is built with accessibility in mind:

- Proper semantic HTML structure
- Keyboard navigation support
- Screen reader friendly
- Focus management

## Best Practices

- Use cards to group related content
- Keep card content focused and concise
- Use appropriate variants for different contexts
- Ensure sufficient contrast for text readability
- Consider mobile responsiveness when designing cards`,
        examples: [
          {
            name: 'Basic Card',
            code: `<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here.</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>`
          },
          {
            name: 'Profile Card',
            code: `<Card className="w-full max-w-sm space-y-6">
  <CardHeader className="text-center pb-2">
    <div className="w-20 h-20 rounded-full bg-accent mx-auto mb-4 flex items-center justify-center">
      <User className="h-10 w-10 text-accent-foreground" />
    </div>
    <CardTitle>John Doe</CardTitle>
    <CardDescription>Software Engineer at HextaUI</CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    <div className="flex items-center space-x-2">
      <Mail className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm">john@example.com</span>
    </div>
    <div className="flex items-center space-x-2">
      <Phone className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm">+1 (555) 123-4567</span>
    </div>
    <div className="flex items-center space-x-2">
      <Calendar className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm">Joined January 2024</span>
    </div>
  </CardContent>
  <CardFooter className="flex gap-2">
    <Button variant="outline" className="flex-1">
      Message
    </Button>
    <Button className="flex-1">Follow</Button>
  </CardFooter>
</Card>`
          }
        ]
      },
      {
        name: 'Button',
        category: 'Interactive',
        description: 'A versatile button component with multiple variants, sizes, and states for various use cases.',
        installation: {
          dependencies: 'npm install class-variance-authority',
          cli: 'npx hextaui@latest add button'
        },
        usage: `import { Button } from "@/components/ui/button";`,
        variants: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
        sizes: ['sm', 'default', 'lg', 'xl', 'icon'],
        features: ['loading', 'leftIcon', 'rightIcon', 'asChild'],
        fullContent: `# Button Component - HextaUI

## Overview

A versatile button component with multiple variants, sizes, and states for various use cases.

## Installation

### Install Dependencies

First, install the required dependencies:

\`\`\`bash
npm install class-variance-authority
# or
pnpm add class-variance-authority
# or
yarn add class-variance-authority
# or
bun add class-variance-authority
\`\`\`

### Quick Install via CLI

You can also use the HextaUI CLI:

\`\`\`bash
npx hextaui@latest add button
# or
pnpm dlx hextaui@latest add button
# or
yarn dlx hextaui@latest add button
# or
bun x hextaui@latest add button
\`\`\`

## Usage

### Import

\`\`\`tsx
import { Button } from "@/components/ui/button";
\`\`\`

### Basic Usage

\`\`\`tsx
<Button>Click me</Button>
\`\`\`

### Variants

The Button component supports different variants:

- **default**: Primary button with solid background
- **destructive**: Red button for dangerous actions
- **outline**: Button with border and transparent background
- **secondary**: Secondary button with muted background
- **ghost**: Transparent button with hover effects
- **link**: Button that looks like a link

### Sizes

Available sizes for the Button component:

- **sm**: Small button (h-8 px-3 text-sm)
- **default**: Standard button (h-10 px-4 py-2)
- **lg**: Large button (h-11 px-8)
- **xl**: Extra large button (h-12 px-10 text-lg)

### Examples

#### Basic Buttons
\`\`\`tsx
<div className="flex gap-2">
  <Button>Default</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="link">Link</Button>
</div>
\`\`\`

#### Button Sizes
\`\`\`tsx
<div className="flex items-center gap-2">
  <Button size="sm">Small</Button>
  <Button size="default">Default</Button>
  <Button size="lg">Large</Button>
  <Button size="xl">Extra Large</Button>
</div>
\`\`\`

#### Destructive Button
\`\`\`tsx
<Button variant="destructive">Delete Account</Button>
\`\`\`

#### Button with Icon
\`\`\`tsx
<Button>
  <Mail className="mr-2 h-4 w-4" />
  Send Email
</Button>
\`\`\`

#### Loading State
\`\`\`tsx
<Button loading>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Please wait
</Button>
\`\`\`

#### Button Group
\`\`\`tsx
<div className="flex">
  <Button variant="outline" className="rounded-r-none">
    Previous
  </Button>
  <Button variant="outline" className="rounded-none border-l-0">
    Current
  </Button>
  <Button variant="outline" className="rounded-l-none border-l-0">
    Next
  </Button>
</div>
\`\`\`

#### Form Buttons
\`\`\`tsx
<div className="flex gap-2">
  <Button type="submit">Save Changes</Button>
  <Button type="button" variant="outline">Cancel</Button>
</div>
\`\`\`

#### Action Buttons
\`\`\`tsx
<div className="flex gap-2">
  <Button>
    <Plus className="mr-2 h-4 w-4" />
    Add Item
  </Button>
  <Button variant="outline">
    <Edit className="mr-2 h-4 w-4" />
    Edit
  </Button>
  <Button variant="destructive">
    <Trash className="mr-2 h-4 w-4" />
    Delete
  </Button>
</div>
\`\`\`

#### Navigation Buttons
\`\`\`tsx
<div className="flex gap-2">
  <Button variant="outline" size="sm">
    <ChevronLeft className="mr-2 h-4 w-4" />
    Back
  </Button>
  <Button size="sm">
    Next
    <ChevronRight className="ml-2 h-4 w-4" />
  </Button>
</div>
\`\`\`

#### Social Login Buttons
\`\`\`tsx
<div className="space-y-2">
  <Button variant="outline" className="w-full">
    <Chrome className="mr-2 h-4 w-4" />
    Continue with Google
  </Button>
  <Button variant="outline" className="w-full">
    <Github className="mr-2 h-4 w-4" />
    Continue with GitHub
  </Button>
</div>
\`\`\`

#### Toggle Buttons
\`\`\`tsx
<div className="flex">
  <Button variant="outline" className="rounded-r-none">
    Grid
  </Button>
  <Button variant="outline" className="rounded-none border-l-0">
    List
  </Button>
</div>
\`\`\`

#### Call-to-Action Button
\`\`\`tsx
<Button size="lg" className="w-full">
  Get Started Now
  <ArrowRight className="ml-2 h-4 w-4" />
</Button>
\`\`\`

## Accessibility

The Button component is built with accessibility in mind:

- Proper ARIA attributes
- Keyboard navigation support
- Focus management
- Screen reader friendly
- Disabled state handling

## Best Practices

- Use appropriate variants for different contexts
- Provide clear, descriptive button text
- Use icons to enhance visual clarity
- Consider button hierarchy in your design
- Ensure sufficient contrast for all variants
- Use loading states for async actions`,
        examples: [
          {
            name: 'Button Variants',
            code: `<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="destructive">Destructive</Button>`
          },
          {
            name: 'Buttons with Icons',
            code: `<Button leftIcon={<Download />}>Download</Button>
<Button rightIcon={<ArrowRight />}>Continue</Button>
<Button variant="outline" leftIcon={<Heart />}>Like</Button>`
          },
          {
            name: 'Loading State',
            code: `<Button loading>Loading</Button>
<Button variant="outline" loading>Please wait</Button>`
          }
        ]
      }
    ],
    theme: {
      name: 'HextaUI Light Theme',
      colors: {
        background: 'hsl(0, 0%, 100%)',
        foreground: 'hsl(0, 0%, 14%)',
        card: 'hsl(0, 0%, 99%)',
        'card-foreground': 'hsl(0, 0%, 14%)',
        primary: 'hsl(235, 100%, 60%)',
        'primary-foreground': 'hsl(0, 0%, 98%)',
        secondary: 'hsl(0, 0%, 97%)',
        'secondary-foreground': 'hsl(0, 0%, 20%)',
        muted: 'hsl(0, 0%, 97%)',
        'muted-foreground': 'hsl(0, 0%, 56%)',
        accent: 'hsl(0, 0%, 96%)',
        'accent-foreground': 'hsl(0, 0%, 20%)',
        destructive: 'hsl(9, 96%, 47%)',
        'destructive-foreground': 'hsl(0, 0%, 98%)',
        border: 'hsl(0, 0%, 92%)',
        input: 'hsl(0, 0%, 100%)',
        ring: 'hsl(0, 0%, 71%)'
      },
      radius: {
        ele: '0.8rem',
        card: '1rem'
      }
    },
    themingContent: `# Theming - HextaUI

## Overview

Comprehensive theming system for customizing colors, typography, spacing, and other design tokens across your application.

## Installation

### Install Dependencies

First, install the required dependencies:

\`\`\`bash
npm install tailwindcss @tailwindcss/typography
# or
pnpm add tailwindcss @tailwindcss/typography
# or
yarn add tailwindcss @tailwindcss/typography
# or
bun add tailwindcss @tailwindcss/typography
\`\`\`

### Quick Install via CLI

You can also use the HextaUI CLI:

\`\`\`bash
npx hextaui@latest add theming
# or
pnpm dlx hextaui@latest add theming
# or
yarn dlx hextaui@latest add theming
# or
bun x hextaui@latest add theming
\`\`\`

## Usage

### Basic Setup

Create a CSS file (e.g., \`globals.css\`) with the following content:

\`\`\`css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
\`\`\`

### Tailwind Configuration

Update your \`tailwind.config.js\`:

\`\`\`js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
\`\`\`

### Color Schemes

#### Light Theme (Default)
\`\`\`css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 84% 4.9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}
\`\`\`

#### Dark Theme
\`\`\`css
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
}
\`\`\`

### Custom Color Schemes

#### Blue Theme
\`\`\`css
:root {
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
}
\`\`\`

#### Green Theme
\`\`\`css
:root {
  --primary: 142.1 76.2% 36.3%;
  --primary-foreground: 355.7 100% 97.3%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
}
\`\`\`

#### Purple Theme
\`\`\`css
:root {
  --primary: 262.1 83.3% 57.8%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
}
\`\`\`

### Typography

#### Font Configuration
\`\`\`js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
      },
    },
  },
}
\`\`\`

#### Font Usage
\`\`\`tsx
<h1 className="text-4xl font-bold">Large Heading</h1>
<p className="text-base text-muted-foreground">Body text</p>
<code className="font-mono text-sm">Code snippet</code>
\`\`\`

### Spacing and Layout

#### Container Sizes
\`\`\`js
// tailwind.config.js
module.exports = {
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
  },
}
\`\`\`

#### Spacing Scale
\`\`\`tsx
<div className="p-4">Small padding</div>
<div className="p-6">Default padding</div>
<div className="p-8">Large padding</div>
<div className="p-10">Extra large padding</div>
\`\`\`

### Border Radius

#### Radius Scale
\`\`\`css
:root {
  --radius: 0.5rem;
}
\`\`\`

\`\`\`js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
}
\`\`\`

#### Usage
\`\`\`tsx
<div className="rounded-sm">Small radius</div>
<div className="rounded-md">Medium radius</div>
<div className="rounded-lg">Large radius</div>
\`\`\`

### Shadows

#### Shadow Configuration
\`\`\`js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
      },
    },
  },
}
\`\`\`

#### Usage
\`\`\`tsx
<div className="shadow-sm">Small shadow</div>
<div className="shadow-md">Medium shadow</div>
<div className="shadow-lg">Large shadow</div>
<div className="shadow-xl">Extra large shadow</div>
\`\`\`

### Animations

#### Animation Configuration
\`\`\`js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade-in": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        "slide-in": {
          from: { transform: "translateY(10px)", opacity: 0 },
          to: { transform: "translateY(0)", opacity: 1 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
      },
    },
  },
}
\`\`\`

#### Usage
\`\`\`tsx
<div className="animate-fade-in">Fade in animation</div>
<div className="animate-slide-in">Slide in animation</div>
\`\`\`

### Theme Switching

#### Dark Mode Toggle
\`\`\`tsx
import { useState, useEffect } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="p-2 rounded-md bg-secondary text-secondary-foreground"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
\`\`\`

#### System Theme Detection
\`\`\`tsx
import { useState, useEffect } from 'react';

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('system');

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.remove('light', 'dark');
      root.classList.add(systemTheme);
    } else {
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
    }
  }, [theme]);

  return (
    <div>
      {children}
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </div>
  );
}
\`\`\`

### Best Practices

#### Color Usage
- Use semantic color names (primary, secondary, etc.)
- Maintain proper contrast ratios
- Test colors in both light and dark modes
- Use HSL values for better color manipulation

#### Typography
- Establish a clear hierarchy with font sizes
- Use consistent line heights
- Choose readable fonts for body text
- Use monospace fonts for code

#### Spacing
- Use consistent spacing scale
- Maintain visual rhythm
- Consider mobile responsiveness
- Use container queries for adaptive layouts

#### Accessibility
- Ensure sufficient color contrast
- Provide focus indicators
- Support reduced motion preferences
- Test with screen readers

#### Performance
- Minimize CSS bundle size
- Use CSS custom properties efficiently
- Optimize animations for performance
- Consider critical CSS loading`,
    setupInstructions: `# Setup HextaUI for Modern Minimalistic Design

## 1. Install Dependencies
\`\`\`bash
npm install @radix-ui/react-slot class-variance-authority
\`\`\`

## 2. Install Components
\`\`\`bash
npx hextaui@latest add card button
\`\`\`

## 3. Configure Theme (CSS Variables)
Add to your global CSS file:

\`\`\`css
@theme {
  --radius-ele: 0.8rem;
  --radius-card: 1rem;
  --color-background: hsl(0, 0%, 100%);
  --color-foreground: hsl(0, 0%, 14%);
  --color-card: hsl(0, 0%, 99%);
  --color-card-foreground: hsl(0, 0%, 14%);
  --color-primary: hsl(235, 100%, 60%);
  --color-primary-foreground: hsl(0, 0%, 98%);
  --color-secondary: hsl(0, 0%, 97%);
  --color-secondary-foreground: hsl(0, 0%, 20%);
  --color-muted: hsl(0, 0%, 97%);
  --color-muted-foreground: hsl(0, 0%, 56%);
  --color-accent: hsl(0, 0%, 96%);
  --color-accent-foreground: hsl(0, 0%, 20%);
  --color-destructive: hsl(9, 96%, 47%);
  --color-destructive-foreground: hsl(0, 0%, 98%);
  --color-border: hsl(0, 0%, 92%);
  --color-input: hsl(0, 0%, 100%);
  --color-ring: hsl(0, 0%, 71%);
}
\`\`\`

## 4. Usage in Components
Components are designed to work seamlessly with the minimalistic design philosophy:
- Clean layouts with generous spacing
- Subtle shadows and borders
- Consistent typography hierarchy
- Accessible color contrasts
`
  }
  // We can add more design types here in the future
};

// Helper function to get UI components for a specific design type
export const getUIComponentsForDesign = (designId) => {
  return UI_COMPONENTS_DATA[designId] || null;
};

// Helper function to get all available design types with UI components
export const getAvailableDesignTypes = () => {
  return Object.keys(UI_COMPONENTS_DATA);
};

// Helper function to generate component installation instructions
export const generateInstallationInstructions = (designId) => {
  const designData = UI_COMPONENTS_DATA[designId];
  if (!designData) return '';

  const components = designData.components;
  const dependencies = [...new Set(components.map(c => c.installation.dependencies))];
  const cliCommands = components.map(c => c.installation.cli);

  return `# Installation Instructions for ${designData.designName}

## Install Dependencies
\`\`\`bash
${dependencies.join('\n')}
\`\`\`

## Install UI Components
\`\`\`bash
${cliCommands.join('\n')}
\`\`\`

${designData.setupInstructions}
`;
};

// Helper function to generate component usage examples
export const generateComponentExamples = (designId) => {
  const designData = UI_COMPONENTS_DATA[designId];
  if (!designData) return '';

  let examples = `# ${designData.designName} - Component Examples\n\n`;
  
  designData.components.forEach(component => {
    examples += `## ${component.name} Component\n\n`;
    examples += `${component.description}\n\n`;
    examples += `### Import\n\`\`\`tsx\n${component.usage}\n\`\`\`\n\n`;
    
    if (component.variants) {
      examples += `### Variants\n${component.variants.map(v => `- ${v}`).join('\n')}\n\n`;
    }
    
    if (component.sizes) {
      examples += `### Sizes\n${component.sizes.map(s => `- ${s}`).join('\n')}\n\n`;
    }
    
    examples += `### Examples\n\n`;
    component.examples.forEach(example => {
      examples += `#### ${example.name}\n\`\`\`tsx\n${example.code}\n\`\`\`\n\n`;
    });
    
    examples += `---\n\n`;
  });
  
  return examples;
};

// Helper function to generate complete component content for cursor rules
export const generateCompleteComponentContent = (designId) => {
  const designData = UI_COMPONENTS_DATA[designId];
  if (!designData) return '';

  let content = `# ${designData.designName} - UI Components\n\n`;
  content += `UI Library: ${designData.uiLibrary} (https://www.hextaui.com/)\n\n`;
  content += `---\n\n`;
  
  // Add each component's full content
  designData.components.forEach(component => {
    if (component.fullContent) {
      content += `${component.fullContent}\n\n---\n\n`;
    }
  });
  
  // Add theming content
  if (designData.themingContent) {
    content += `${designData.themingContent}\n\n`;
  }
  
  return content;
}; 