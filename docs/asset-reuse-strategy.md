# Asset Reuse Strategy

## Goal

Reduce the final asset count by favoring reusable UI building blocks over one-off PNGs for each screen action.

This document translates `docs/pixel-art-assets.md` into a lighter production strategy for mobile.

## Core Principles

- Prefer `9-slice` panels over separate small, medium, and large window files.
- Prefer generic button families plus text/icon overlays over a bespoke button per action.
- Prefer icon-only files plus shared button/tab frames over icon-baked navigation buttons.
- Prefer overlays, badges, and border variants over fully separate card backgrounds.
- Prefer one reusable tile or trim system for screen backgrounds instead of six unique full-screen illustrations.
- Ignore `hover` states for mobile.

## Reuse Recommendations

### Buttons

Instead of creating a file for every action, use a small reusable family:

- `button_primary`
  - reuse for: confirm, buy, start task, open chest, Google login
- `button_secondary`
  - reuse for: cancel, back to neutral actions, language choices, sign out
- `button_accent`
  - reuse for: complete, equip, highlighted rewards, important progression actions
- `button_danger`
  - reuse for: risky cancel, destructive actions, reset-style actions

Shared state files are enough for most of the app:

- `normal`
- `pressed`
- `disabled`
- `selected`

This means the app does **not** need separate art files such as:

- `button_buy`
- `button_equip`
- `button_start_task`
- `button_complete_task`
- `button_complete_now`
- `button_swap_mission`
- `button_open_chest`
- `button_language`

Those should map to the reusable base buttons above with localized text rendered by the app.

### Navigation

The current folder contains icon-baked tab buttons:

- `button_home`
- `button_tasks`
- `button_missions`
- `button_shop`
- `button_avatar`

These work, but they are heavier and less flexible than the recommended long-term structure:

- `button_tab_inactive`
- `button_tab_active`
- `button_missions_tab_active`
- separate `icon_home`, `icon_tasks`, `icon_missions`, `icon_shop`, `icon_avatar`

Recommended direction:

- keep the current icon-baked tab buttons as valid fallback assets
- prefer moving future implementation to shared tab frames + separate icons

### Panels, Windows, and Cards

Do not create separate files for every panel size when `9-slice` can solve the scaling:

- `window_panel_light_9slice`
- `window_panel_dark_9slice`
- `window_modal_9slice`
- `window_tooltip_9slice`

Cards should also be modular:

- `card_base_9slice`
- `card_selected_overlay`
- `card_locked_overlay`
- `card_reward_overlay`
- `frame_gold_highlight`

This avoids separate full assets for:

- simple card
- selected card
- locked card
- reward card

### Progress Bars and HUD

Bars should be split into reusable parts:

- `bar_frame`
- `bar_track`
- `bar_fill_primary`
- `bar_fill_gold`
- `bar_fill_rare`

These can be reused for:

- XP bar
- level bar
- login reward progress bar

Also prefer one reusable:

- `stat_capsule`
- `badge_number`

instead of multiple decorative stat containers.

### Icons

Icons should be treated as a reusable set, ideally packed later into one atlas.

Best candidates for reuse:

- arrows: one left arrow can be mirrored for right
- one up arrow can be rotated for down if the renderer keeps pixels crisp
- one lock base can derive locked/unlocked variants
- one task-state badge base can support selected, in-progress, and ready through icon overlays
- one chest glow can be reused across rarities with color/intensity changes

### Shop and Rarity

Avoid fully different chest constructions when possible.

Recommended approach:

- one chest silhouette base
- one premium chest variant if needed
- rarity differentiation by trim, badge, glow, and color accents

This can reduce:

- common chest
- uncommon chest
- rare chest
- epic chest
- legendary chest

from five unrelated files to two or three structural bases plus overlays.

### Inventory

Use one base slot and layer state/rarity accents:

- `slot_base`
- `slot_locked_overlay`
- `slot_equipped_overlay`
- `slot_rarity_rare_border`
- `slot_rarity_epic_border`
- `slot_rarity_legendary_border`
- `slot_selection_outline`

### Backgrounds

Do not paint six unrelated full-screen backgrounds unless they are truly necessary.

Prefer:

- `bg_tile_subtle`
- `bg_top_trim`
- `bg_bottom_trim`
- optional small screen crest per section

Then combine them per screen with layout and tinting.

This is much lighter than separate full assets for:

- home
- tasks
- missions
- shop
- avatar
- settings

### Character System

The character list is already well suited to layering and should stay modular:

- base male idle
- base female idle
- outfit layers
- hat layers
- pants layers
- shoe layers
- pet layers
- background layers
- aura layers

This is better than rendering each final combination as its own sprite.

## Review of Current Approved Assets

Current folder:

- [generated_assets/phase1_ui_buttons](C:\Users\Matheus\Documents\New%20project\generated_assets\phase1_ui_buttons)

### Keep As Reusable

- `button_primary`
- `button_primary_pressed`
- `button_primary_disabled`
- `button_secondary`
- `button_secondary_pressed`
- `button_secondary_disabled`
- `button_accent`
- `button_accent_pressed`
- `button_accent_selected`
- `button_danger`
- `button_danger_pressed`
- `button_icon_square`
- `button_settings`
- `button_back`
- `button_close`
- `button_tab_inactive`
- `button_tab_active`
- `button_missions_tab_active`

### Keep As Transitional

- `button_home`
- `button_tasks`
- `button_missions`
- `button_shop`
- `button_avatar`

These are fine to keep, but they duplicate work if the app later adopts shared tab frames with separate icons.

## Recommended Production Order

### Next Priority

- reusable `9-slice` panels
- reusable cards and overlays
- reusable HUD bars
- reusable stat capsule
- reusable icon set

### After That

- chest system
- inventory slot system
- screen background tile and trims
- task room icon family

### Later

- effects
- splash
- loading
- premium variants
- character expansion

## Practical Outcome

If this strategy is followed, the app can cover most of the current UI list with a much smaller production set:

- around 4 main button families plus states
- 3 tab/frame assets plus icons
- 3 to 5 panel/card bases with overlays
- 5 bar/HUD pieces
- 1 background tile kit
- 1 icon atlas
- modular inventory/chest systems

That is significantly lighter than creating a separate PNG for every named UI action in the original checklist.
