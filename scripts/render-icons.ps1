# Reason: Generate PNG icons from the white calendar-with-check SVG on black
param(
  [string]$SvgPath = "public/icons/app-icon.svg"
)

$ErrorActionPreference = 'Stop'

$pngs = @(
  @{ Path = "public/icons/app-icon-32.png"; Size = 32 },
  @{ Path = "public/icons/app-icon-192.png"; Size = 192 },
  @{ Path = "public/icons/app-icon-512.png"; Size = 512 }
)

# Requires rsvg-convert (librsvg) or inkscape in PATH.
# Try rsvg-convert first, then inkscape fallback.

foreach ($p in $pngs) {
  if (Get-Command rsvg-convert -ErrorAction SilentlyContinue) {
    rsvg-convert -w $($p.Size) -h $($p.Size) -o $($p.Path) $SvgPath
  } elseif (Get-Command inkscape -ErrorAction SilentlyContinue) {
    inkscape $SvgPath --export-type=png --export-filename=$($p.Path) -w $($p.Size) -h $($p.Size)
  } else {
    Write-Error "Please install rsvg-convert or inkscape to render icons."
  }
}

