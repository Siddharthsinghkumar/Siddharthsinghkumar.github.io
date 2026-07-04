"You are given a task to integrate an existing React component in the codebase

The codebase should support:
- shadcn project structure  
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles. 
If default path for components is not /components/ui, provide instructions on why it's important to create this folder
Copy-paste this component to /components/ui folder:
```tsx
freelancer-profile-card.tsx
import * as React from "react";
import { motion } from "framer-motion";
import { Star, Bookmark } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

/**
 * Props for the FreelancerProfileCard component.
 */
interface FreelancerProfileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The user's full name. */
  name: string;
  /** The user's job title or role. */
  title: string;
  /** URL for the user's avatar image. */
  avatarSrc: string;
  /** URL for the card's banner image. */
  bannerSrc: string;
  /** The user's rating (e.g., 4.0). */
  rating: number;
  /** A string describing the project duration (e.g., "8 Days"). */
  duration: string;
  /** A string for the user's rate (e.g., "$40/hr"). */
  rate: string;
  /** A React node (e.g., array of icons) for the tools section. */
  tools: React.ReactNode;
  /** Optional click handler for the "Get in touch" button. */
  onGetInTouch?: () => void;
  /** Optional click handler for the bookmark icon. */
  onBookmark?: () => void;
  /** Optional additional class names. */
  className?: string;
}

// Animation variants for Framer Motion
const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  hover: {
    scale: 1.03,
    transition: { duration: 0.3 },
  },
};

const contentVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3, // Start staggering after card loads
    },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

/**
 * A reusable, animated profile card component.
 */
export const FreelancerProfileCard = React.forwardRef<
  HTMLDivElement,
  FreelancerProfileCardProps
>(
  (
    {
      className,
      name,
      title,
      avatarSrc,
      bannerSrc,
      rating,
      duration,
      rate,
      tools,
      onGetInTouch,
      onBookmark,
      ...props
    },
    ref
  ) => {
    const avatarName = name
      .split(" ")
      .map((n) => n[0])
      .join("");

    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative w-full max-w-sm overflow-hidden rounded-2xl bg-card shadow-lg",
          className
        )}
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        {...props}
      >
        {/* Banner Image */}
        <div className="h-32 w-full">
          <img
            src={bannerSrc}
            alt={`${name}'s banner`}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Bookmark Button */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute right-4 top-4 h-9 w-9 rounded-lg bg-background/50 backdrop-blur-sm text-card-foreground/80 hover:bg-background/70"
          onClick={onBookmark}
          aria-label="Bookmark profile"
        >
          <Bookmark className="h-4 w-4" />
        </Button>

        {/* Avatar (overlaps banner) */}
        <div className="absolute left-1/2 top-32 -translate-x-1/2 -translate-y-1/2">
          <Avatar className="h-20 w-20 border-4 border-card">
            <AvatarImage src={avatarSrc} alt={name} />
            <AvatarFallback>{avatarName}</AvatarFallback>
          </Avatar>
        </div>

        {/* Content Area */}
        <motion.div
          className="px-6 pb-6 pt-12" // pt-12 to clear avatar
          variants={contentVariants}
        >
          {/* Name, Title, and Tools */}
          <motion.div
            className="mb-4 flex items-start justify-between"
            variants={itemVariants}
          >
            <div>
              <h2 className="text-xl font-semibold text-card-foreground">
                {name}
              </h2>
              <p className="text-sm text-muted-foreground">{title}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <div className="flex gap-1.5">{tools}</div>
              <span className="text-xs text-muted-foreground">Tools</span>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="my-6 flex items-center justify-around rounded-lg border border-border bg-background/30 p-4"
            variants={itemVariants}
          >
            <StatItem icon={Star} value={rating.toFixed(1)} label="rating" />
            <Divider />
            <StatItem value={duration} label="duration" />
            <Divider />
            <StatItem value={rate} label="rate" />
          </motion.div>

          {/* Action Button */}
          <motion.div variants={itemVariants}>
            <Button className="w-full" size="lg" onClick={onGetInTouch}>
              Get in touch
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }
);
FreelancerProfileCard.displayName = "FreelancerProfileCard";

// Internal StatItem component
const StatItem = ({
  icon: Icon,
  value,
  label,
}: {
  icon?: React.ElementType;
  value: string | number;
  label: string;
}) => (
  <div className="flex flex-1 flex-col items-center justify-center px-2 text-center">
    <div className="flex items-center gap-1">
      {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      <span className="text-base font-semibold text-card-foreground">
        {value}
      </span>
    </div>
    <span className="text-xs capitalize text-muted-foreground">{label}</span>
  </div>
);

// Internal Divider component
const Divider = () => <div className="h-10 w-px bg-border" />;

demo.tsx
import * as React from "react";
import { FreelancerProfileCard } from "@/components/ui/freelancer-profile-card";
import { LayoutTemplate, Palette } from "lucide-react"; // Using lucide icons as placeholders for tools

// Helper component for tool icons in the demo
const ToolIcon = ({ icon: Icon }: { icon: React.ElementType }) => (
  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
    <Icon className="h-4 w-4" />
  </div>
);

/**
 * Default demo for the FreelancerProfileCard.
 */
export default function FreelancerProfileCardDemo() {
  const tools = [
    <ToolIcon key="tool-1" icon={LayoutTemplate} />,
    <ToolIcon key="tool-2" icon={Palette} />,
  ];

  return (
    <div className="flex h-full w-full items-center justify-center bg-background p-10">
      <FreelancerProfileCard
        name="Henrie Ekemezie"
        title="Web & UI/UX Designer"
        avatarSrc="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&q=80"
        bannerSrc="https://images.unsplash.com/photo-1750682053165-ed96153fb0b2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fHdhbGxwYWVyfGVufDB8MHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=900"
        rating={4.0}
        duration="8 Days"
        rate="$40/hr"
        tools={tools}
        onGetInTouch={() => console.log("Get in touch clicked!")}
        onBookmark={() => console.log("Bookmark clicked!")}
      />
    </div>
  );
}
```

Copy-paste these files for dependencies:
```tsx
shadcn/button
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }

```
```tsx
shadcn/avatar
"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className,
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className,
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }

```

Install NPM dependencies:
```bash
lucide-react, framer-motion, @radix-ui/react-slot, class-variance-authority, @radix-ui/react-avatar
```

Implementation Guidelines
 1. Analyze the component structure and identify all required dependencies
 2. Review the component's argumens and state
 3. Identify any required context providers or hooks and install them
 4. Questions to Ask
 - What data/props will be passed to this component?
 - Are there any specific state management requirements?
 - Are there any required assets (images, icons, etc.)?
 - What is the expected responsive behavior?
 - What is the best place to use this component in the app?

Steps to integrate
 0. Copy paste all the code above in the correct directories
 1. Install external dependencies
 2. Fill image assets with Unsplash stock images you know exist
 3. Use lucide-react icons for svgs or logos if component requires them
"