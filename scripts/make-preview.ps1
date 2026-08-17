# Genera social-preview.png (1200x630) para compartir el sitio en redes sociales.
# Vuelve a ejecutarlo si cambias los textos:  powershell -File scripts/make-preview.ps1
Add-Type -AssemblyName System.Drawing

$w = 1200
$h = 630
$bmp = New-Object System.Drawing.Bitmap($w, $h)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

$ink    = [System.Drawing.Color]::FromArgb(33, 27, 22)      # #211B16
$paper  = [System.Drawing.Color]::FromArgb(246, 242, 234)   # #F6F2EA
$orange = [System.Drawing.Color]::FromArgb(244, 87, 15)     # #F4570F
$yellow = [System.Drawing.Color]::FromArgb(255, 197, 47)    # #FFC52F
$soft   = [System.Drawing.Color]::FromArgb(210, 200, 180)

$g.Clear($ink)

# Cinta de precaución arriba
$tapePen = New-Object System.Drawing.Pen($yellow, 16)
for ($x = -80; $x -lt $w + 80; $x += 28) {
    $g.DrawLine($tapePen, $x, 46, $x + 46, 0)
}

# Cinta de precaución abajo
for ($x = -80; $x -lt $w + 80; $x += 28) {
    $g.DrawLine($tapePen, $x, $h - 46, $x + 46, $h)
}

# Titular
$fontTitle = New-Object System.Drawing.Font("Arial Black", 128, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$brushOrange = New-Object System.Drawing.SolidBrush($orange)
$brushWhite = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$g.DrawString("RENTA", $fontTitle, $brushOrange, 84, 120)
$g.DrawString("FACIL", $fontTitle, $brushWhite, 84, 260)

# Línea pequeña bajo el titular
$fontSub = New-Object System.Drawing.Font("Consolas", 34, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$brushYellow = New-Object System.Drawing.SolidBrush($yellow)
$g.DrawString("RENTA DE HERRAMIENTAS POR DIA", $fontSub, $brushYellow, 88, 410)

# Lista de herramientas
$fontList = New-Object System.Drawing.Font("Consolas", 26, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$brushSoft = New-Object System.Drawing.SolidBrush($soft)
$g.DrawString("TALADROS  /  PODADORAS  /  ESCALERAS", $fontList, $brushSoft, 88, 468)
$g.DrawString("SOLDADORAS  /  DESBROZADORAS  /  MAS", $fontList, $brushSoft, 88, 512)

# Etiqueta amarilla de precio (esquina inferior derecha)
$tagPen = New-Object System.Drawing.Pen($paper, 4)
$tagBrush = New-Object System.Drawing.SolidBrush($yellow)
$g.FillRectangle($tagBrush, 950, 430, 170, 90)
$g.DrawRectangle($tagPen, 950, 430, 170, 90)
$fontTag = New-Object System.Drawing.Font("Consolas", 40, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$brushInk = New-Object System.Drawing.SolidBrush($ink)
$g.DrawString("$120", $fontTag, $brushInk, 968, 442)
$fontTag2 = New-Object System.Drawing.Font("Consolas", 22, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$g.DrawString("DIA", $fontTag2, $brushInk, 968, 488)

$out = Join-Path (Split-Path $PSScriptRoot -Parent) "social-preview.png"
$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)

$g.Dispose()
$bmp.Dispose()
Write-Output "Listo: $out"
