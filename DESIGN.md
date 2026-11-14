---
version: alpha
name: Launch Nest Studio
description: "Dark interface measured from launchnest.com.au: titleFont type with Bricolage Grotesque, vivid indigo accents, tonal surfaces and 10px corners."
colors:
  background: "#07121A"
  surface: "#07121A"
  on-surface: "#FFFFFF"
  on-background: "#FFFFFF"
  on-surface-variant: "#CDD0D1"
  surface-container-low: "#0F0F0F"
  surface-container: "#060E14"
  surface-container-high: "#0A0A0A"
  surface-container-highest: "#0A1A24"
  overlay: "#FFFFFF1A"
  outline: "#0000001A"
  outline-variant: "#454545"
  primary: "#0003E8"
  on-primary: "#FFFFFF"
  secondary: "#0B32E0"
typography:
  headline-display:
    fontFamily: titleFont
    fontSize: 83.5px
    fontWeight: 340
    lineHeight: 1.1
  headline-lg:
    fontFamily: Bricolage Grotesque
    fontSize: 50px
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: -0.02em
  headline-md:
    fontFamily: titleFont
    fontSize: 49px
    fontWeight: 340
    lineHeight: 1.1
  headline-sm:
    fontFamily: Bricolage Grotesque
    fontSize: 44px
    fontWeight: 500
    lineHeight: 1.11
    letterSpacing: -0.02em
  title-lg:
    fontFamily: Bricolage Grotesque
    fontSize: 40px
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: -0.02em
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.56
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.64
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.75
    letterSpacing: -0.01em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.43
  headline-display-mobile:
    fontFamily: titleFont
    fontSize: 44px
    fontWeight: 340
    lineHeight: 1.1
rounded:
  sm: 8px
  md: 10px
  lg: 12px
  xl: 20px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 24px
  xl: 50px
  gutter: 12px
  section: 80px
components:
  button-outline:
    backgroundColor: "{colors.surface-container-highest}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: 8px 8px 8px 24px
    height: 52px
  button-ghost:
    textColor: "{colors.primary}"
    rounded: 0px
    padding: 15px 16px
  link:
    textColor: "{colors.on-surface}"
---

# Launch Nest Studio Design System

## Overview

Launch Nest Studio describes itself as: “Launch Nest Studio is an Adelaide-based digital agency offering web design, SEO, branding and graphic design: end-to-end solutions to grow your business.” The interface is dark, built on **Deep Blue (#07121A)** with **White (#FFFFFF)** text, and **Vivid Indigo (#0003E8)** as the main accent.

Type is set in **titleFont** and **Bricolage Grotesque**. Headlines run large; body text is 18px. Depth comes from soft drop shadows. Corners are mostly 10px.

Measured from [launchnest.com.au](https://launchnest.com.au/) on November 14, 2026 at 1440×900 and 390×844 from 399 rendered elements. Values are computed styles from the live page, not the original source files.

## Colors

The palette has 13 roles.

- **Deep Blue (#07121A):** Page background, seen 2 times. Token `background`.
- **White (#FFFFFF):** Primary text and headings, seen 30 times. Token `on-surface`, CSS `--hdr-fg`.
- **Silver (#CDD0D1):** Secondary text, seen 4 times. Token `on-surface-variant`.
- **Charcoal (#0F0F0F):** Raised areas one step from the page, seen 4 times. Token `surface-container-low`.
- **Cool Charcoal (#060E14):** Cards and panels, seen 6 times. Token `surface-container`.
- **Near Black (#0A0A0A):** Hover and pressed fills, seen 7 times. Token `surface-container-high`.
- **Deep Blue (#0A1A24):** Highest raised elements, seen 1 time. Token `surface-container-highest`.
- **White 10% (#FFFFFF1A):** Translucent fill for cards and controls, seen 6 times. Token `overlay`.
- **Near Black 10% (#0000001A):** Borders and dividers, seen 4 times. Token `outline`.
- **Graphite (#454545):** Secondary dividers, seen 4 times. Token `outline-variant`.
- **Vivid Indigo (#0003E8):** Brand accent (CSS variable), seen 18 times. Token `primary`, CSS `--color-primary`.
- **White (#FFFFFF):** Text and icons on primary. Token `on-primary`.
- **Vivid Indigo (#0B32E0):** Accent (CSS variable). Token `secondary`.

## Typography

**titleFont**, **Bricolage Grotesque** and **Hanken Grotesk** share the interface. Fallback stack: `titleFont, Georgia, serif`. Other loaded fonts: Fraunces.

- **headline-display:** titleFont 83.5px at weight 340, line height 1.1 (44px on mobile). Page title (h1).
- **headline-lg:** Bricolage Grotesque 50px at weight 600, line height 1.05, tracking -0.02em. Section headings (h2).
- **headline-md:** titleFont 49px at weight 340, line height 1.1. Sub-section headings.
- **headline-sm:** Bricolage Grotesque 44px at weight 500, line height 1.11, tracking -0.02em. Card and feature titles.
- **title-lg:** Bricolage Grotesque 40px at weight 600, line height 1.05, tracking -0.02em. Small titles.
- **body-md:** Hanken Grotesk 18px at weight 400, line height 1.56. Body text.
- **body-sm:** Hanken Grotesk 14px at weight 400, line height 1.64. Secondary and small text.
- **label-md:** Hanken Grotesk 16px at weight 500, line height 1.75, tracking -0.01em. Buttons, navigation and labels.
- **label-sm:** Hanken Grotesk 14px at weight 500, line height 1.43. Small labels and badges.

## Layout

Spacing does not follow a strict grid: 56% of measured values are multiples of 4px, so match the measured steps rather than rounding to a grid.

- **Scale:** xs 4px, sm 8px, md 12px, lg 24px, xl 50px.
- **Sections:** 80px vertical padding between major sections.
- **Gaps:** 12px is the most common gap in flex and grid layouts.
- **Breakpoints:** 360px, 480px, 576px, 640px, 768px, 900px, 992px, 1200px, 1400px, 1600px, 1800px.

## Elevation & Depth

Raised elements use soft drop shadows. The most used recipes:

- `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.15) 0px 1px 3px 0px`
- `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.13) 0px 1px 18px 0px`

Hairline rings and inset highlights also appear: `rgba(255, 255, 255, 0.1) 0px 0px 0px 1px`.

## Shapes

Most elements use 10px corners. Measured radii, most used first:

- **md (10px):** 112 elements.
- **sm (8px):** 52 elements.
- **lg (12px):** 52 elements.
- **xl (20px):** 36 elements.
- **full (9999px):** 4 elements.

## Components

Measured from the rendered page. Token values reference the tokens above.

- **button-outline (“Start a project”):** #0A1A24 fill, #FFFFFF text, 16px/500, 999px radius, padding 8px 8px 8px 24px.
- **button-ghost (“Ask”):** transparent fill, #0003E8 text, 20px/400, padding 15px 16px.
- **link:** transparent fill, #FFFFFF text, padding 0px.

## Do's and Don'ts

- Do use #07121A for the page and lift surfaces in small steps: #0F0F0F, #060E14, #0A0A0A, #0A1A24.
- Do keep text in 2 levels: #FFFFFF, #CDD0D1.
- Do use #0003E8 as the brand accent: header, logo and key highlights.
- Do reuse the measured spacing steps (8px, 12px, 24px).
- Do use 10px corners on most elements; larger surfaces also use 8px, 12px and 20px.
- Don't introduce new font families beyond titleFont, Bricolage Grotesque and Hanken Grotesk.
- Don't use #0003E8 for large backgrounds or body text.
- Don't make interface transitions slower than 0.5s.

## Motion

Interface transitions are quick: 0.3s, 0.5s, 0.2s, 0.4s. Longer ambient animations run 0.9s, 2.6s.

- **Easing:** `cubic-bezier(0.23, 1, 0.32, 1)`, `cubic-bezier(0.4, 0, 0.2, 1)`, `cubic-bezier(0.2, 0.9, 0.24, 1.14)`.
- **Reduced motion:** the page responds to `prefers-reduced-motion`.

Generated by [Sitepeel](https://sitepeel.dev/design-md/launchnest.com.au/), the free DESIGN.md generator (engine 2026.10.29+f0c146f7cdfd).
