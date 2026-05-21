# MusterDeck Foundation Visual Identity Design

Date: 2026-05-21

## Purpose

Define the first visual identity pass for the shared MusterDeck foundation screens.

This pass applies a modern industrial direction to the public and shared app surfaces while leaving room for future custom graphics, icon plates, generated textures, and module-specific visual systems.

## Approved Direction

Use a graphite-first operational interface with mustard caution accents and restrained olive support.

The interface should feel like a modern space-industrial operations tool with a hint of physical command hardware. It should not feel like a full military field console. Olive drab, stencil type, distressed paint, scratches, and caution striping are allowed as accents, not as the dominant surface language.

The approved blend is:

- Base: modern industrial caution system.
- Secondary restraint: clean graphite-first UI for dense, account, admin, and form-heavy screens.
- Reserved emphasis: heavier stencil or distressed treatment only for major status stamps, caution markers, brand moments, and later module-specific graphics.

## Scope

This first pass covers the shared foundation screens:

- Public landing page.
- Shared header and navigation.
- Shared status strip.
- Shared footer.
- Operations Hub.
- Authentication screens.
- Account settings.
- Admin portal.
- Notification center.

Fleet Command, Rally Point workflow details, S.P.O.I.L.S. ledgers, Proving Ground, and older dense fleet-manager surfaces are out of scope for this pass. They should be brought into the identity after the foundation tokens and component treatments are stable.

## Non-Goals

This pass does not create or source custom graphics.

This pass does not finalize the icon system.

This pass does not add generated texture files.

This pass does not restyle the legacy Fleet Command workspace.

This pass does not bake text into images or make functional UI depend on raster graphics.

## Visual Principles

### Graphite First

Primary surfaces should use near-black, graphite, and dark warm-neutral colors. These surfaces carry the product's modern, clean foundation and keep data-heavy pages readable.

### Mustard As Identity And Signal

Mustard yellow remains the main brand and caution color. Use it for primary actions, active navigation, brand plates, warning/caution details, progress indicators, selected states, and important small markers.

Mustard should look like practical caution paint, not bright neon UI yellow.

### Olive As Support

Olive should appear in small amounts as a secondary industrial color: secondary buttons, low-priority status surfaces, subtle panel depth, and occasional system strips.

Avoid large olive-dominant screens in the foundation pass.

### Physical, Not Heavy

The UI can borrow from physical control panels through edge highlights, compact command bars, status strips, squared controls, thin divider lines, and mild surface wear.

Avoid dense rivets, full-page grunge, aggressive stencil typography, and large simulated metal panels in routine screens.

### Graphics Later

CSS-only treatments should provide named slots where later assets can be layered without restructuring components.

Future asset slots include:

- Brand mark plate.
- Module icon plate.
- Panel texture overlay.
- Caution stripe accent.
- Status stamp layer.
- Card edge wear overlay.
- Navigation plate texture.
- Empty-state graphic.

## Component Direction

### App Shell

The shared shell should feel like an operational command surface:

- Sticky graphite header.
- Compact brand plate.
- Clear navigation with mustard active state.
- Icon-only utility actions for notifications, account, login, and menu.
- Low-profile status strip with version and data labels.
- Footer kept quiet and readable.

The header should leave a clear future slot for a custom MusterDeck mark or generated plate texture.

### Landing Page

The landing page should remain functional and product-forward, not a marketing splash page.

Use a strong text hierarchy, restrained background depth, and module cards that introduce the four product pillars. Module cards should have clear icon plate areas so custom iconography can be added later.

### Operations Hub

The hub should use compact panels and direct action paths. It should be readable first and thematic second.

Panels may use mustard markers, thin top bars, or small status chips to add identity without making the hub noisy.

### Auth And Account

Authentication and account screens should be among the cleanest screens.

Use graphite form panels, readable input states, calm borders, and minimal distress. These screens should communicate trust and stability more than command flavor.

### Admin Portal

Admin screens should prioritize density and scanning.

Use quiet table surfaces, clear row separation, restrained mustard header labels, and caution styling only for risk-bearing states or administrative warnings.

### Notifications

Notifications should support state scanning:

- Unread state should have a mustard or caution edge.
- Read state should recede without losing legibility.
- Category/status labels should use compact chips.

## CSS Token Direction

Introduce or consolidate foundation-level tokens for:

- Background base.
- Surface base.
- Surface raised.
- Surface muted.
- Border subtle.
- Border caution.
- Text primary.
- Text secondary.
- Text muted.
- Mustard.
- Mustard deep.
- Olive.
- Olive muted.
- Caution orange.
- Success green.
- Focus ring.
- Panel shadow.
- Inset highlight.
- Texture overlay opacity.

The goal is to make later visual changes a token adjustment instead of a screen-by-screen rewrite.

## Implementation Constraints

Keep functional text as real text.

Keep icons vector-first.

Use CSS pseudo-elements for temporary texture, stripe, and edge treatments.

Use component class hooks for future assets, but do not add image dependencies in this pass.

Keep forms and tables readable on mobile.

Avoid nested card-heavy layouts.

Avoid one-note olive, brown, or beige palettes.

Do not use negative letter spacing.

Do not scale font size with viewport width.

## Acceptance Criteria

The first identity pass is complete when:

- The scoped foundation screens share a coherent modern industrial visual system.
- Graphite is the dominant surface color.
- Mustard is clearly retained as the product's caution and identity accent.
- Olive appears only as a support color.
- Distress and stencil treatment are present only as subtle accents.
- Future graphic/icon slots are present in the structure or CSS class naming.
- The app builds successfully.
- The scoped screens remain readable and responsive.
- Text does not overlap controls or adjacent content on common mobile and desktop widths.

## Follow-Up Work

After this pass, bring the identity into the larger product modules in this order:

1. Fleet Command dense workspace.
2. Rally Point listing and workflow screens.
3. S.P.O.I.L.S. ledger and settlement surfaces.
4. Proving Ground tournament surfaces.
5. Custom icon plates and vector icon pass.
6. Generated or sourced texture assets for approved reusable surfaces.
