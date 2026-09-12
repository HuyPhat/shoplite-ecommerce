---
name: figma-to-nextjs-tailwind
description: Automatically compiles Figma nodes into modern React Server/Client Components optimized for Next.js App Router and Tailwind CSS.
---
# Instructions

## 1. Frame Analysis & Routing
- Before generating code, call `figma/get-nodes` or `figma/get-file` to analyze the targeted node layout, nested frames, and structure.
- Map the high-level Figma layout to the **Next.js App Router** structure (`app/` directory). Identify if the frame represents a root layout (`layout.tsx`), a distinct page route (`page.tsx`), or a modular UI child component.

## 2. React Component Architectural Paradigm
- **Server Components by Default:** Generate components as native, modern React Server Components (RSC) to handle static rendering. 
- **Client Component Leaf Nodes:** Isolate interactivity (e.g., clicks, state variations, forms) into atomic child components. Only inject the `'use client'` directive at the leaf nodes of the component tree when explicitly utilizing React hooks (`useState`, `useEffect`) or browser-level events.
- **Next.js Optimizations:** Map all image nodes directly to the optimized `next/image` component (with mandatory `width`, `height`, or `fill` props) and text navigation anchors directly to `next/link`.

## 3. Tailwind CSS & Auto Layout Compilation
- **Auto Layout to Flex/Grid:** Translate Figma Auto Layout vectors strictly into responsive, clean Tailwind utility classes. 
  - Direction: Horizontal -> `flex flex-row`, Vertical -> `flex flex-col`
  - Spacing & Padding: Map Figma item spacing and padding parameters directly to Tailwind spacing intervals (e.g., `gap-4`, `p-6`). Avoid hardcoded arbitrary spacing (`p-[17px]`) unless absolutely unique.
- **Design Token Strictness:** Map extracted Figma fills, text colors, and font styles directly to the workspace's semantic Tailwind configuration variables (e.g., `text-primary`, `bg-background`, `rounded-lg`). Do not embed raw, unconfigured hex color strings or absolute inline pixel dimensions.
- **Responsive Layout Execution:** Implement Tailwind media queries (`md:`, `lg:`) to gracefully handle fluid grid transitions if responsive desktop/mobile variants are supplied across Figma frames.
