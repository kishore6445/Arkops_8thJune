# Arkmedis OS Design System

## Typography Scale

### Headings
- **H1**: `text-3xl` (30px) - Page titles, main headers
  - Example: Department names, "War Dashboard"
- **H2**: `text-2xl` (24px) - Section titles
  - Example: "Victory Target Snapshot", "Department Scorecards"
- **H3**: `text-xl` (20px) - Card titles, subsection headers
  - Example: Victory Target names, modal titles
- **H4**: `text-lg` (18px) - Secondary card headers
  - Example: Power Move names in cards
- **H5**: `text-base` (16px) - Small headers, emphasized text
  - Example: Filter labels, form section headers

### Body Text
- **Large**: `text-base` (16px) - Primary body text, descriptions
- **Normal**: `text-sm` (14px) - Standard UI text, labels, buttons
- **Small**: `text-xs` (12px) - Meta information, timestamps, hints

### Font Weights
- **Normal**: `font-normal` (400) - Body text
- **Medium**: `font-medium` (500) - Labels, subtle emphasis
- **Semibold**: `font-semibold` (600) - Card titles, navigation items
- **Bold**: `font-bold` (700) - Important metrics, emphasis

### Line Heights
- Body text: `leading-relaxed` (1.625) for readability
- Headings: `leading-tight` (1.25) for compactness
- Use `text-balance` for headlines to prevent orphans

## Color System

### Semantic Colors (Do NOT change)
- **Primary**: Deep blue (`oklch(0.42 0.15 264)`) - Brand color, CTAs, active states
- **Success**: Green (`oklch(0.55 0.14 145)`) - On track, completed, positive
- **Destructive/At-Risk**: Red (`oklch(0.577 0.245 27.325)`) - Errors, at-risk, gaps
- **Warning**: Yellow (`oklch(0.7 0.13 85)`) - Cautions, pending items
- **Muted**: Gray (`oklch(0.53 0.01 264)`) - Secondary text, disabled states

### Usage Rules
- Use `text-foreground` for primary text
- Use `text-muted-foreground` for secondary text
- Use `bg-background` for page backgrounds
- Use `bg-card` for elevated surfaces
- Use `border` class for all borders (maintains consistency)

## Spacing System (4px base unit)

### Gap/Padding Scale
- `gap-1` / `p-1` = 4px - Minimal spacing
- `gap-2` / `p-2` = 8px - Tight spacing
- `gap-3` / `p-3` = 12px - Default spacing for form elements
- `gap-4` / `p-4` = 16px - Standard card padding
- `gap-6` / `p-6` = 24px - Card headers, sections
- `gap-8` / `p-8` = 32px - Page margins, large sections
- `gap-12` / `p-12` = 48px - Major page sections

### Margin Scale
- `mb-2` = 8px - Between form fields
- `mb-4` = 16px - Between components
- `mb-6` = 24px - Between card sections
- `mb-8` = 32px - Between major sections

### Consistent Patterns
- Card padding: `p-6` (header and content)
- Page padding: `px-6 md:px-8 lg:px-12`
- Stack items: Use `gap-4` or `gap-6`, never mix margin and gap

## Border Radius System

### Radius Scale
- **Buttons**: `rounded-md` (6px)
- **Cards**: `rounded-lg` (8px)
- **Modals**: `rounded-xl` (12px)
- **Avatars**: `rounded-full`
- **Badges**: `rounded-full`
- **Input fields**: `rounded-md` (6px)
- **Letter chips (sidebar)**: `rounded-md` (6px)

## Shadow System

### Elevation Levels
- **Flat**: No shadow - Default cards, sidebar
- **Subtle**: `shadow-sm` - Hover states on flat cards
- **Elevated**: `shadow-md` - Active cards, important elements
- **Modal**: `shadow-xl` - Dialogs, overlays
- **Focus**: `ring-2 ring-primary ring-offset-2` - Keyboard focus

## Component Patterns

### Cards
```tsx
<Card className="p-6 space-y-4 hover:shadow-md transition-shadow duration-200">
  <CardHeader className="pb-3">
    <CardTitle className="text-xl font-semibold">Title</CardTitle>
    <CardDescription className="text-sm text-muted-foreground">Description</CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* Content */}
  </CardContent>
</Card>
```

### Buttons
```tsx
{/* Primary action */}
<Button className="gap-2">
  <Icon className="h-4 w-4" />
  <span>Label</span>
</Button>

{/* Secondary action */}
<Button variant="outline" className="gap-2 bg-transparent">
  <Icon className="h-4 w-4" />
  <span>Label</span>
</Button>
```

### Badges
```tsx
{/* Status badges */}
<Badge variant={isGood ? "default" : "destructive"} className="text-xs">
  Status
</Badge>
```

### Progress Bars
```tsx
<AnimatedProgress value={percentage} className="h-2" />
```

## Transition Guidelines

### Duration
- **Fast**: `duration-150` - Hover colors, focus states
- **Normal**: `duration-200` - Card elevation, scales
- **Slow**: `duration-300` - Complex animations, page transitions

### Properties (GPU-accelerated)
- Use `transform` and `opacity` when possible
- Avoid animating `width`, `height`, `margin`, `padding`
- Use `transition-all` sparingly - specify properties: `transition-colors`, `transition-shadow`

## Accessibility Standards

### Color Contrast
- All text meets WCAG AA (4.5:1 for normal text, 3:1 for large text)
- Interactive elements have 3:1 contrast against backgrounds

### Touch Targets
- Minimum 44px height for mobile tap targets
- Use `min-h-[44px]` on buttons for mobile

### Focus States
- All interactive elements have visible focus rings
- Use `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`

### Screen Readers
- Use semantic HTML (`main`, `nav`, `section`, `article`)
- Add `aria-label` to icon-only buttons
- Use `sr-only` class for screen-reader-only text

## Consistency Checklist

Before shipping any component, verify:

- [ ] Uses spacing from the 4px scale (no arbitrary values)
- [ ] Typography uses defined scale (no random text sizes)
- [ ] Colors use semantic tokens (no hardcoded colors)
- [ ] Border radius matches component type
- [ ] Shadows match elevation level
- [ ] Transitions are smooth and consistent
- [ ] Focus states are visible
- [ ] Touch targets are 44px minimum on mobile
- [ ] Hover states provide feedback
- [ ] Active/pressed states scale down slightly
