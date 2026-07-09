Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   FINANCIAL AI - Sprint FA-001" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en la carpeta correcta
if (!(Test-Path ".\web")) {
    Write-Host "ERROR: No se encontró la carpeta WEB." -ForegroundColor Red
    Write-Host "Ejecuta este script desde la raíz del proyecto Financial-AI."
    exit
}

$base = ".\web\src"

Write-Host "Creando estructura..." -ForegroundColor Yellow

# ==========================
# COMPONENTES
# ==========================

$folders = @(
"$base\components",
"$base\components\layout",
"$base\components\dashboard",
"$base\components\ui",
"$base\components\forms",
"$base\components\charts"
)

foreach($folder in $folders){
    New-Item -ItemType Directory -Force -Path $folder | Out-Null
}

# ==========================
# ARCHIVOS DASHBOARD
# ==========================

$dashboardFiles = @(
"Header.tsx",
"Sidebar.tsx",
"DashboardCards.tsx",
"NetWorthCard.tsx",
"CashFlowCard.tsx",
"AssetsCard.tsx",
"DebtsCard.tsx",
"FreedomProgress.tsx",
"AIAdvisor.tsx"
)

foreach($file in $dashboardFiles){
    New-Item -ItemType File -Force -Path "$base\components\dashboard\$file" | Out-Null
}

# ==========================
# PÁGINAS
# ==========================

$pages = @(
"Dashboard.tsx",
"Income.tsx",
"Expenses.tsx",
"Assets.tsx",
"Debts.tsx",
"Goals.tsx",
"Reports.tsx",
"Diagnosis.tsx",
"Settings.tsx"
)

foreach($page in $pages){
    New-Item -ItemType File -Force -Path "$base\pages\$page" | Out-Null
}

# ==========================
# ROUTES
# ==========================

New-Item -ItemType Directory -Force -Path "$base\routes" | Out-Null
New-Item -ItemType File -Force -Path "$base\routes\AppRouter.tsx" | Out-Null

# ==========================
# LAYOUT
# ==========================

New-Item -ItemType Directory -Force -Path "$base\layouts" | Out-Null
New-Item -ItemType File -Force -Path "$base\layouts\MainLayout.tsx" | Out-Null

# ==========================
# HOOKS
# ==========================

New-Item -ItemType Directory -Force -Path "$base\hooks" | Out-Null

# ==========================
# CONTEXT
# ==========================

New-Item -ItemType Directory -Force -Path "$base\context" | Out-Null

# ==========================
# SERVICES
# ==========================

New-Item -ItemType Directory -Force -Path "$base\services" | Out-Null

# ==========================
# TYPES
# ==========================

New-Item -ItemType Directory -Force -Path "$base\types" | Out-Null

# ==========================
# STYLES
# ==========================

New-Item -ItemType Directory -Force -Path "$base\styles" | Out-Null

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "Sprint FA-001 creado correctamente." -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

tree .\web\src /F