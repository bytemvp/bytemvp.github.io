## REMOVED Requirements

### Requirement: Chinese Ink Visual Language

**Reason**: 站点视觉方向从小清新替换水墨风，原视觉语言要求整体废弃。

## ADDED Requirements

### Requirement: Fresh Minimal Visual Language
The system SHALL present the primary site routes with a coherent fresh-and-clean visual language built from airy light surfaces, soft mint/sky accents, generous whitespace, rounded shapes, and lightweight shadows.

#### Scenario: Content pages use the fresh visual language
- **WHEN** a user views the home page, blog index, blog post, or about page
- **THEN** the page SHALL use the shared light paper-white surface, soft neutral text tones, and mint/sky accent treatment
- **AND** no page SHALL retain the previous Chinese-ink or candy-color visual language as its primary presentation

#### Scenario: Tool page uses the fresh visual language
- **WHEN** a user views the online tools page
- **THEN** tool cards, controls, results, and status messages SHALL use the same fresh visual hierarchy as the rest of the site
- **AND** functional states SHALL remain distinguishable without relying on decorative color alone

#### Scenario: Accents stay soft and focused
- **WHEN** an accent color is used for a button, link, label, badge, or status
- **THEN** it SHALL be a low-saturation mint, sky, or leaf tone that reads as calm and fresh rather than loud
- **AND** text and controls SHALL remain readable in both themes

#### Scenario: Pages remain clean and uncluttered
- **WHEN** any primary route is viewed in either theme
- **THEN** spacing, borders, and shadows SHALL keep the layout visually tidy with content as the clear focus
- **AND** no decorative effect SHALL compete with body text or controls for attention

## MODIFIED Requirements

### Requirement: Dark Theme Color Palette
The system SHALL define a complete dark color palette that preserves the fresh, clean atmosphere in low light: deep cool-tinted backgrounds, muted soft-green or soft-blue accents, and calm surface separation.

#### Scenario: Dark theme colors are applied
- **WHEN** dark theme is active
- **THEN** the page SHALL use deep cool-neutral backgrounds, muted surfaces, and restrained fresh-toned accent colors
- **AND** text SHALL use light neutral tones with sufficient contrast

#### Scenario: Color contrast meets accessibility standards
- **WHEN** dark theme is active
- **THEN** all text SHALL have minimum 4.5:1 contrast ratio with its background
- **AND** interactive elements SHALL have minimum 3:1 contrast ratio

### Requirement: Component Theme Adaptation
The system SHALL ensure all shared and content components render correctly in both light and dark fresh-minimal themes.

#### Scenario: Header in dark theme
- **WHEN** dark theme is active
- **THEN** the header and navigation links SHALL use visible surfaces, borders, and text colors from the fresh palette
- **AND** the active navigation state SHALL remain distinguishable

#### Scenario: Footer in dark theme
- **WHEN** dark theme is active
- **THEN** the footer SHALL use the dark surface treatment from the fresh palette
- **AND** its text and external link control SHALL remain readable and identifiable

#### Scenario: Blog post content in dark theme
- **WHEN** viewing a blog post in dark theme
- **THEN** post titles, metadata, prose, links, code blocks, and images SHALL remain readable
- **AND** code blocks SHALL retain a deliberate dark presentation without reducing text contrast

#### Scenario: Blog list page in dark theme
- **WHEN** viewing the blog index in dark theme
- **THEN** post titles, excerpts, dates, metadata, cards, and links SHALL use the dark fresh-palette hierarchy
- **AND** featured and non-featured posts SHALL remain visually distinguishable

### Requirement: Theme-Specific Visual Elements
The system SHALL use lightweight, airy surfaces, borders, shadows, and background treatments—soft gradients, gentle translucency, and subtle depth—instead of heavy or saturated effects.

#### Scenario: Shadows and borders in dark theme
- **WHEN** dark theme is active
- **THEN** box shadows SHALL remain subtle against the dark background
- **AND** borders SHALL use low-contrast but visible neutral tones

#### Scenario: Background washes in both themes
- **WHEN** either light or dark theme is active
- **THEN** background washes and surface variation SHALL use theme-appropriate fresh values such as soft sky/mint tints in light mode and deep cool tints in dark mode
- **AND** the visual texture SHALL remain quiet enough that body text and controls are the primary focus
