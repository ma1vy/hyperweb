# Mobile hamburger + staggered menu for NavBar

Date: 2026-08-12

## Problem

On mobile, the hyperweb header (`src/components/NavBar.tsx`) shows inline
About / Features / Plugins pills plus a theme toggle. These overflow small
screens. We want a compact mobile header that replaces the inline buttons with a
hamburger icon (three horizontal lines) which opens a staggered menu containing
the same options.

## Goals

- Mobile (`< md`): header shows only the logo + hamburger button; inline buttons
  are hidden.
- Clicking the hamburger opens a full-screen menu with the same options (About,
  Features, Plugins links + theme toggle) that animates in with a stagger.
- Desktop (`md+`): unchanged — inline pills + theme toggle stay.
- No new dependencies (`motion` and `lucide-react` already installed).

## Non-goals

- No change to routing or page content.
- No change to theme logic (`useTheme`).
- No change to the unrelated pre-existing working-tree edits in
  `BackgroundSwitcher.tsx`, `BgGallery.tsx`, `Plugins.tsx`.

## Design

Single file change: `src/components/NavBar.tsx`.

- Desktop container: current pills + toggle, hidden below `md`
  (`hidden md:flex`).
- Mobile container: logo (shared) + hamburger button, `md:hidden`.
- Hamburger uses lucide `Menu` icon; toggles an `open` state.
- Staggered menu: full-screen overlay when `open`, rendered with `motion`:
  - Container uses `variants` with `staggerChildren`; items are
    `motion` elements animating `opacity` + `y` from hidden to visible.
  - Items: About, Features, Plugins (`Link`s) + a theme toggle row.
  - Close via an X button (lucide `X`) and/or clicking the overlay; navigating a
    link also closes the menu.

## Success criteria

- On a narrow viewport the header shows logo + hamburger only.
- Clicking hamburger opens the staggered menu with About, Features, Plugins, and
  the theme toggle.
- Menu items stagger in; menu closes on X / overlay click / navigation.
- On desktop the inline pills and toggle render exactly as before.
