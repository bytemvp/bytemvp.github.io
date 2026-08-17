## ADDED Requirements

### Requirement: Chinese Ink Visual Language
The system SHALL present the primary site routes with a coherent Chinese ink visual language built from paper-like surfaces, ink-inspired neutrals, restrained accent colors, and quiet visual depth.

#### Scenario: Content pages use the ink visual language
- **WHEN** a user views the home page, blog index, blog post, or about page
- **THEN** the page SHALL use the shared paper, ink, border, surface, and accent treatment
- **AND** no page SHALL fall back to the previous candy-color visual language as its primary presentation

#### Scenario: Tool page uses the ink visual language
- **WHEN** a user views the online tools page
- **THEN** tool cards, controls, results, and status messages SHALL use the same ink-inspired visual hierarchy as the rest of the site
- **AND** functional states SHALL remain distinguishable without relying on decorative color alone

#### Scenario: Accent colors remain restrained
- **WHEN** an accent color is used for a button, link, label, badge, or status
- **THEN** it SHALL serve as a focused visual accent rather than the dominant page background
- **AND** text and controls SHALL remain readable in both themes

## MODIFIED Requirements

### Requirement: Dark Theme Color Palette
The system SHALL define a complete dark Chinese-ink color palette that maintains visual hierarchy, readability, and the atmosphere of an ink wash painting.

#### Scenario: Dark theme colors are applied
- **WHEN** dark theme is active
- **THEN** the page SHALL use deep ink-inspired backgrounds, muted paper or ash surfaces, and restrained accent colors
- **AND** text SHALL use light ink or paper tones with sufficient contrast

#### Scenario: Color contrast meets accessibility standards
- **WHEN** dark theme is active
- **THEN** all text SHALL have minimum 4.5:1 contrast ratio with its background
- **AND** interactive elements SHALL have minimum 3:1 contrast ratio

### Requirement: Component Theme Adaptation
The system SHALL ensure all shared and content components render correctly in both light and dark Chinese-ink themes.

#### Scenario: Header in dark theme
- **WHEN** dark theme is active
- **THEN** the header and navigation links SHALL use visible ink-inspired surfaces, borders, and text colors
- **AND** the active navigation state SHALL remain distinguishable

#### Scenario: Footer in dark theme
- **WHEN** dark theme is active
- **THEN** the footer SHALL use the dark ink surface treatment
- **AND** its text and external link control SHALL remain readable and identifiable

#### Scenario: Blog post content in dark theme
- **WHEN** viewing a blog post in dark theme
- **THEN** post titles, metadata, prose, links, code blocks, and images SHALL remain readable
- **AND** code blocks SHALL retain a deliberate dark presentation without reducing text contrast

#### Scenario: Blog list page in dark theme
- **WHEN** viewing the blog index in dark theme
- **THEN** post titles, excerpts, dates, metadata, cards, and links SHALL use the dark ink hierarchy
- **AND** featured and non-featured posts SHALL remain visually distinguishable

### Requirement: Theme-Specific Visual Elements
The system SHALL use theme-appropriate ink-wash surfaces, borders, shadows, and background treatments instead of glossy or overly saturated effects.

#### Scenario: Shadows and borders in dark theme
- **WHEN** dark theme is active
- **THEN** box shadows SHALL remain subtle against the dark background
- **AND** borders SHALL use low-contrast but visible ink or paper tones

#### Scenario: Background washes in both themes
- **WHEN** either light or dark theme is active
- **THEN** background washes and surface variation SHALL use theme-appropriate paper or ink values
- **AND** the visual texture SHALL remain quiet enough that body text and controls are the primary focus
