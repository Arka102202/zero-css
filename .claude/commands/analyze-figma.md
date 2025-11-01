---
argument-hint: "<figma-url> [design-name]"
description: "Analyze Figma design file and generate comprehensive implementation specifications for development"
---

You are an AI assistant tasked with analyzing a Figma design file and creating comprehensive technical specifications for implementation. Your goal is to extract all design details and create actionable documentation that enables developers to build pixel-perfect, production-ready code.

## Input Parameters

You will receive a Figma URL and optionally a design name:

<figma_url>
$argument
</figma_url>

**Expected Format**:

- Full Figma file URL: `https://www.figma.com/file/[file-id]/[file-name]`
- Figma prototype URL: `https://www.figma.com/proto/[file-id]/[file-name]`
- Figma frame URL: `https://www.figma.com/file/[file-id]/[file-name]?node-id=[node-id]`

**Design Name**: If not provided in the second argument, extract from URL or Figma file title.

## Analysis Process

Follow these steps to perform a comprehensive Figma analysis:

### Step 1: Validate and Access Design

1. Validate the Figma URL format
2. Extract file ID, node IDs, and metadata
3. Access the design file (navigate to URL)
4. Identify the scope: entire file, specific pages, or frames
5. Note the Figma file version/branch if available

### Step 2: Design System Extraction

Systematically extract the design system foundation:

1. **Colors**:
   - Extract all unique colors
   - Categorize by purpose (primary, secondary, accent, neutral, semantic)
   - Map to Tailwind CSS classes
   - Generate CSS custom properties

2. **Typography**:
   - Document font families, weights, sizes
   - Identify typography hierarchy (H1-H6, body, caption)
   - Extract line heights, letter spacing
   - Map to Tailwind typography utilities

3. **Spacing**:
   - Identify spacing scale (4px, 8px, 16px, etc.)
   - Document grid systems and breakpoints
   - Extract container widths
   - Map to Tailwind spacing utilities

4. **Other Design Tokens**:
   - Shadows, border radius, opacity
   - Animations and transitions
   - Z-index layering
   - Generate `design-tokens.json` file

### Step 3: Component Analysis

For EVERY component in the design:

1. **Identify Components**:
   - Create complete component inventory
   - Categorize using Atomic Design (atoms, molecules, organisms)
   - Note variants and states
   - Check for existing components using Grep in `packages/ui-lib/`

2. **Specify Each Component**:
   - Component name and description
   - All variants (size, color, style)
   - All states (default, hover, active, disabled, loading, error)
   - Props and TypeScript interfaces
   - Styling (Tailwind classes)
   - Responsive behavior
   - Accessibility requirements (ARIA, keyboard nav)
   - Dependencies on other components
   - Implementation notes

3. **Create Component Specifications**:
   - Write detailed markdown spec for each component
   - Include TypeScript type definitions
   - Provide Tailwind class examples
   - Add usage examples

### Step 4: Page and Layout Analysis

For EVERY page/view in the design:

1. Analyze page structure and sections
2. Document layout patterns (grid, flexbox)
3. List components used on each page
4. Identify data requirements and API needs
5. Map responsive behavior across breakpoints
6. Note navigation patterns
7. Create page specification documents

### Step 5: Interactions and Animations

1. Document all interactive elements
2. Extract hover, focus, and active states
3. Identify animations and transitions
4. Note micro-interactions
5. Specify loading and error states
6. Document form validation behaviors

### Step 6: Asset Documentation

1. **Icons**: List all icons, suggest icon library (Lucide React)
2. **Images**: Document dimensions, formats, responsive requirements
3. **Other Assets**: Fonts, videos, custom graphics
4. Note asset optimization strategies

### Step 7: Accessibility Audit

1. **WCAG Compliance**: Check color contrast, font sizes, touch targets
2. **Keyboard Navigation**: Map tab order and keyboard shortcuts
3. **Screen Readers**: Specify ARIA labels, landmarks, live regions
4. **Semantic HTML**: Suggest appropriate HTML5 elements
5. Create accessibility compliance document

### Step 8: Technical Specification

Map the design to the project's tech stack:

- React 19 + TypeScript
- Vite 6
- Tailwind CSS
- shadcn/ui + ui-lib components
- TanStack Query for state
- React Hook Form + Zod
- Lucide React for icons

Specify:

- Component implementation priority (Phase 1, 2, 3)
- State management requirements
- API integration points
- Performance considerations
- Code splitting opportunities

### Step 9: Generate CompoundFrame Documentation

Create a comprehensive documentation structure:

```
CompoundFrame/figma-<design-name>/
├── README.md                          # Executive summary
├── design-system/
│   ├── colors.md                      # Color palette
│   ├── typography.md                  # Typography system
│   ├── spacing.md                     # Spacing and layout
│   ├── design-tokens.json             # Exportable tokens
│   └── tailwind.config.additions.ts   # Tailwind updates
├── components/
│   ├── component-inventory.md         # All components
│   ├── atoms/                         # Atomic components
│   ├── molecules/                     # Composite components
│   └── organisms/                     # Complex components
├── pages/
│   └── [PageName].spec.md             # Page specifications
├── assets/
│   ├── icons.md                       # Icon inventory
│   ├── images.md                      # Image specs
│   └── asset-requirements.md          # All assets
├── accessibility/
│   ├── wcag-compliance.md             # Accessibility audit
│   ├── keyboard-navigation.md         # Keyboard map
│   └── screen-reader-requirements.md  # ARIA specs
├── implementation/
│   ├── implementation-plan.md         # Phased plan
│   ├── component-priority.md          # Build order
│   ├── api-requirements.md            # API specs
│   ├── state-management.md            # State strategy
│   └── performance-strategy.md        # Performance plan
└── gh-worker-handoff/
    ├── IMPLEMENTATION_READY.md        # Ready-to-code specs
    └── component-tasks.md             # Specific tasks
```

### Step 10: Create gh-worker Handoff

Create `IMPLEMENTATION_READY.md` with:

- Task list for gh-worker agent
- Component implementation order
- Exact file paths and structure
- Tailwind config updates needed
- API requirements
- State management setup
- Definition of done checklist

The handoff should be so complete that gh-worker can start coding immediately without asking questions.

### Step 11: Validation

1. Cross-reference with existing codebase (use Grep)
2. Check for similar components in `packages/ui-lib/`
3. Validate design system consistency
4. Assess technical feasibility
5. Flag any implementation challenges

## Output Format

Provide a comprehensive report structured as follows:

### 1. Analysis Summary

```markdown
## Figma Analysis Complete

**Design**: [Design Name]
**Figma URL**: [Provided URL]
**Analysis Date**: [Current date and time]
**File Version**: [Figma version if available]

### Design Scope

- **Pages**: [X pages analyzed]
- **Components**: [X total components]
- **Design System**: [Documented: Yes/No]
```

### 2. Design System Overview

```markdown
### Design System Extracted

**Colors**: [X colors] → `design-system/colors.md`
**Typography**: [X styles] → `design-system/typography.md`
**Spacing**: [Scale defined] → `design-system/spacing.md`
**Design Tokens**: ✅ Exported → `design-system/design-tokens.json`
**Tailwind Updates**: ✅ Prepared → `design-system/tailwind.config.additions.ts`
```

### 3. Component Breakdown

```markdown
### Component Analysis

**Total Components**: [X]

- **Atoms**: [X] (Buttons, Inputs, Icons, etc.)
- **Molecules**: [X] (Form Fields, Cards, Search Bars, etc.)
- **Organisms**: [X] (Headers, Tables, Modals, etc.)

**Reusable (ui-lib)**: [X components]
**Page-Specific**: [X components]
**Existing Matches**: [X similar components found in codebase]

All specifications: `components/`
```

### 4. Page Structure

```markdown
### Pages Analyzed

1. **[Page Name]** → `pages/[PageName].spec.md`
   - Components: [X]
   - API Endpoints: [X]
   - Complexity: [Low/Medium/High]

[Repeat for each page]

**Layout Patterns**: [X patterns identified]
**Breakpoints**: [X responsive breakpoints]
```

### 5. Implementation Plan

```markdown
### Implementation Roadmap

**Phase 1 - Core** (Priority: High, Effort: [X hours])

- [List core components and features]

**Phase 2 - Enhancement** (Priority: Medium, Effort: [X hours])

- [List enhancement components and features]

**Phase 3 - Polish** (Priority: Low, Effort: [X hours])

- [List polish components and features]

**Total Estimated Effort**: [X hours / X days / X sprints]

Full plan: `implementation/implementation-plan.md`
```

### 6. Technical Specifications

```markdown
### Technology Alignment

✅ **React 19** + TypeScript
✅ **Vite 6** build tool
✅ **Tailwind CSS** styling
✅ **shadcn/ui** + ui-lib components
✅ **TanStack Query** for state
✅ **React Hook Form** + Zod validation
✅ **Lucide React** for icons

**New Dependencies**: [List if any]
**Tailwind Config**: [Updates required: Yes/No]
**API Endpoints**: [X endpoints needed]
**State Management**: [Global state: X, Form state: X]
```

### 7. Accessibility Assessment

```markdown
### Accessibility (WCAG Compliance)

**Target Level**: [AA/AAA]
**Color Contrast**: [X issues found and documented]
**Keyboard Navigation**: ✅ Fully mapped
**Screen Reader**: ✅ ARIA requirements specified
**Touch Targets**: ✅ 44x44px minimum ensured

Full audit: `accessibility/wcag-compliance.md`
```

### 8. Generated Documentation

```markdown
### CompoundFrame Documentation Created

📁 **Location**: `CompoundFrame/figma-<design-name>/`

**Key Files**:

- 📄 `README.md` - Start here
- 🛠️ `gh-worker-handoff/IMPLEMENTATION_READY.md` - For developers
- 🎨 `design-system/` - Design tokens and system
- 📦 `components/` - All component specs
- 📄 `pages/` - Page layouts
- ♿ `accessibility/` - A11y requirements
- 📋 `implementation/` - Implementation plan

**Total Files Generated**: [X files]
```

### 9. Critical Findings

```markdown
### Notable Findings

**✅ Strengths**:

- [List design strengths]

**⚠️ Considerations**:

- [List technical challenges or performance concerns]

**❓ Clarifications Needed**:

- [List any ambiguities requiring designer input]

**🔄 Existing Component Opportunities**:

- [List components that can reuse existing ui-lib components]
```

### 10. Next Steps

```markdown
### Ready for Development

**Status**: ✅ Analysis Complete - Ready for Implementation

**Immediate Actions**:

1. ✅ Review generated documentation
2. ⏭️ Address any clarification questions with designer
3. ⏭️ Update `tailwind.config.ts` (use `design-system/tailwind.config.additions.ts`)
4. ⏭️ Invoke **gh-worker agent** to begin implementation

**Invoke gh-worker**:
\`\`\`
Use the implementation plan in CompoundFrame/figma-<design-name>/gh-worker-handoff/IMPLEMENTATION_READY.md
to build the components for <design-name>. Start with Phase 1 core components.
\`\`\`

**Quick Links**:

- 🎯 **Start**: `CompoundFrame/figma-<design-name>/README.md`
- 🛠️ **Build**: `CompoundFrame/figma-<design-name>/gh-worker-handoff/IMPLEMENTATION_READY.md`
- 🎨 **Design System**: `CompoundFrame/figma-<design-name>/design-system/`
```

## Best Practices

### Be Comprehensive

- Extract EVERY component, color, and spacing value
- Don't skip details - developers need exact specifications
- Include edge cases and error states
- Document responsive behavior completely

### Be Specific

- Use exact pixel values and hex codes
- Provide complete TypeScript type definitions
- Give ready-to-use Tailwind class strings
- Include code examples

### Be Practical

- Consider existing codebase patterns
- Reuse existing components where possible
- Think about performance and bundle size
- Validate technical feasibility

### Be Clear

- Write for developers, not designers
- Use consistent naming conventions
- Organize documentation logically
- Make everything searchable and navigable

### Be Thorough

- Check WCAG accessibility compliance
- Map all interactive states
- Document all animations
- Specify all API requirements

## Validation Checklist

Before completing, verify:

- [ ] Figma URL accessed and analyzed
- [ ] Design system fully extracted
- [ ] All components inventoried and specified
- [ ] All pages analyzed
- [ ] Responsive behavior documented
- [ ] Accessibility requirements specified
- [ ] Implementation plan created
- [ ] gh-worker handoff document complete
- [ ] Existing codebase cross-referenced
- [ ] All documentation generated in CompoundFrame
- [ ] README.md created with executive summary
- [ ] No ambiguities or missing information

## Error Handling

If you encounter issues:

1. **Cannot access Figma URL**:
   - Verify URL format
   - Check if file is publicly accessible or requires permissions
   - Ask user to share with view access

2. **Incomplete design information**:
   - Document what's available
   - Flag missing information clearly
   - Suggest questions for designer

3. **Complex or unusual patterns**:
   - Document the pattern
   - Note implementation complexity
   - Suggest alternatives if needed

4. **No existing design system**:
   - Create design system from analysis
   - Extract tokens from actual usage
   - Document inconsistencies found

## Final Output

End your response with a clear summary and next steps:

```markdown
---

## 🎉 Figma Analysis Complete

**Design**: [Design Name]
**Components**: [X total]
**Estimated Effort**: [X hours]
**Documentation**: CompoundFrame/figma-<design-name>/

### ✅ What's Ready
- Complete design system documentation
- [X] component specifications
- [X] page layout specs
- Implementation plan with priorities
- gh-worker handoff document

### ⏭️ Next Steps
1. Review documentation: `CompoundFrame/figma-<design-name>/README.md`
2. Update Tailwind config
3. Invoke gh-worker to begin development

**Start Implementation**: 
Use `CompoundFrame/figma-<design-name>/gh-worker-handoff/IMPLEMENTATION_READY.md`

---
```

Now begin your analysis with the provided Figma URL. Be thorough, specific, and create documentation that enables immediate development without guesswork.
