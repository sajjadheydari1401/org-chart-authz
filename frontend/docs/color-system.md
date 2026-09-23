
## Usage

```tsx
<section className="border border-border bg-surface text-foreground">
  <p className="text-muted-foreground">Supporting text</p>
  <button className="bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:bg-muted disabled:text-muted-foreground">
    Save
  </button>
</section>
```

Use semantic names instead of literal colors in new components. All registered
colors work with background, text, border, ring, and outline utilities.

## Intended color pairs

| Foreground | Background | Purpose |
| --- | --- | --- |
| `foreground` | `background`, `surface`, `muted` | Main text |
| `muted-foreground` | `background`, `surface`, `muted` | Supporting and disabled text |
| `primary-foreground` | `primary`, `primary-hover`, `primary-active` | Primary actions |
| `accent-foreground` | `accent` | Selected items |
| `success` | `success-subtle` | Success feedback |
| `warning` | `warning-subtle` | Warnings |
| `destructive` | `destructive-subtle` | Errors |
| `info` | `info-subtle` | Informational feedback |

Use `border` only for decorative separators. Use `input` for meaningful field
boundaries on `surface`, and `primary` for focus outlines with an offset so the
outline is separated from the control. Always pair status colors with text.
