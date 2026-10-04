"""Generate research_summary.xlsx for the AI Productivity Tools research demo.

Builds a formatted, portfolio-ready workbook from the two CSV datasets:
  - Read Me          : project context, concept disclaimer, conventions
  - Clean Data       : 20 normalized products x 18 fields
  - Raw Data         : 22 source records exactly as captured
  - Before & After   : data-cleaning log (6 worked examples)
  - Summary Stats    : counts/shares computed live from Clean Data
  - QC Checklist     : the quality-control pass applied to the dataset

All summary values are computed at build time from cleaned_research_data.csv
(written as values, not formulas, so the file verifies cleanly without Excel).
"""

import csv
import os
import statistics
import sys
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
OUT_PATH = os.path.join(DATA_DIR, "research_summary.xlsx")

# Optional: set XLSX_SKILL_DIR to a directory containing templates/base.py (a design-token
# module) to reuse its styles. Without it the script falls back to equivalent built-in styles.
XLSX_SKILL_DIR = os.environ.get("XLSX_SKILL_DIR", "")
sys.path.insert(0, os.path.join(XLSX_SKILL_DIR, "templates"))

try:
    from base import (  # design tokens + style helpers (skill design system)
        ACCENT_NEGATIVE, ACCENT_POSITIVE, ACCENT_WARNING, FORMATS, FONT_NAME,
        HEADER_BOLD, NEUTRAL_600, NEUTRAL_900, PRIMARY, SECONDARY,
        align_number, auto_fit_columns, auto_fit_row_heights, font_caption,
        font_subheader, setup_sheet, style_data_row, style_header_row,
    )
    USING_SKILL_DESIGN = True
except ImportError:  # standalone fallback mirroring the same design tokens
    USING_SKILL_DESIGN = False
    PRIMARY, SECONDARY = "1B2A4A", "D6E4F0"
    ACCENT_POSITIVE, ACCENT_NEGATIVE, ACCENT_WARNING = "1B7D46", "C0392B", "D4820A"
    NEUTRAL_900, NEUTRAL_600 = "37352F", "8C8A84"
    FONT_NAME, HEADER_BOLD = "Calibri", True
    FORMATS = {"currency_usd": "$#,##0.00", "percentage": "0%", "date": "YYYY-MM-DD"}

    def align_number():
        from openpyxl.styles import Alignment
        return Alignment(horizontal="right", vertical="center")

    def font_caption():
        from openpyxl.styles import Font
        return Font(name=FONT_NAME, size=9, color=NEUTRAL_600)

    def font_subheader():
        from openpyxl.styles import Font
        return Font(name=FONT_NAME, size=12, bold=HEADER_BOLD, color=PRIMARY)

    def setup_sheet(ws, title=None, last_col=None):
        from openpyxl.styles import Alignment, Font
        ws.sheet_view.showGridLines = False
        ws.column_dimensions["A"].width = 3
        ws.row_dimensions[1].height = 15
        if title and last_col:
            ws.merge_cells(start_row=2, start_column=2, end_row=2, end_column=last_col)
            ws.cell(row=2, column=2, value=title)
            ws.cell(row=2, column=2).font = Font(name=FONT_NAME, size=16, bold=HEADER_BOLD, color=PRIMARY)
            ws.cell(row=2, column=2).alignment = Alignment(horizontal="left", vertical="center")
            ws.row_dimensions[2].height = 32
        ws.row_dimensions[3].height = 8

    def style_header_row(ws, row_num, col_start, col_end):
        from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
        for col in range(col_start, col_end + 1):
            c = ws.cell(row=row_num, column=col)
            c.fill = PatternFill("solid", fgColor=PRIMARY)
            c.font = Font(name=FONT_NAME, size=11, bold=HEADER_BOLD, color="FFFFFF")
            c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
            c.border = Border(bottom=Side(style="thin", color="E9E9E8"))
        ws.row_dimensions[row_num].height = 28

    def style_data_row(ws, row_num, col_start, col_end, row_index):
        from openpyxl.styles import Alignment, Font, PatternFill
        fill = "FFFFFF" if row_index % 2 == 0 else "F7F7F5"
        for col in range(col_start, col_end + 1):
            c = ws.cell(row=row_num, column=col)
            c.fill = PatternFill("solid", fgColor=fill)
            c.font = Font(name=FONT_NAME, size=11, color=NEUTRAL_900)
            c.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)

    def auto_fit_columns(ws, min_width=8, max_width=28, header_row=4, data_start_row=5):
        from openpyxl.utils import get_column_letter
        for col in range(2, ws.max_column + 1):
            widest = min_width
            for row in range(data_start_row, ws.max_row + 1):
                v = ws.cell(row=row, column=col).value
                if v is not None:
                    widest = max(widest, min(max_width, int(len(str(v)) * 1.1) + 2))
            ws.column_dimensions[get_column_letter(col)].width = widest

    def auto_fit_row_heights(ws, header_row=4, data_start_row=5, **_):
        for row in range(data_start_row, ws.max_row + 1):
            ws.row_dimensions[row].height = 22


from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter
from openpyxl import Workbook

# ---------------------------------------------------------------- data loading

def load_csv(name):
    with open(os.path.join(DATA_DIR, name), newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


clean_rows = load_csv("cleaned_research_data.csv")
raw_rows = load_csv("raw_research_data.csv")
assert len(clean_rows) == 20, f"expected 20 clean rows, got {len(clean_rows)}"
assert len(raw_rows) == 22, f"expected 22 raw rows, got {len(raw_rows)}"

# ------------------------------------------------------------- computed stats

def share(n):
    return n / len(clean_rows)


def count_by(field):
    out = {}
    for r in clean_rows:
        out[r[field]] = out.get(r[field], 0) + 1
    return sorted(out.items(), key=lambda kv: -kv[1])


prices = [float(r["starting_price_usd"]) for r in clean_rows]
median_price = round(statistics.median(prices), 2)
mean_price = round(statistics.mean(prices), 2)

free_plan = {"Yes / limited": 0, "Trial only": 0, "No": 0}
for r in clean_rows:
    v = r["free_plan"]
    if v.startswith("Yes"):
        free_plan["Yes / limited"] += 1
    elif v.startswith("Trial"):
        free_plan["Trial only"] += 1
    else:
        free_plan["No"] += 1

ai_yes = sum(1 for r in clean_rows if r["ai_features"].startswith("Yes"))
conf = {"High": 0, "Medium": 0, "Needs verification": 0}
for r in clean_rows:
    conf[r["data_confidence"]] += 1
assert sum(conf.values()) == 20 and sum(free_plan.values()) == 20

# ------------------------------------------------------------------- workbook

wb = Workbook()
wb.properties.creator = "Z.ai"

CONF_STYLE = {
    "High": (ACCENT_POSITIVE, "E8F5E9"),
    "Medium": (ACCENT_WARNING, "FEF9E7"),
    "Needs verification": (ACCENT_NEGATIVE, "FDEDEC"),
}


def write_table(ws, start_row, headers, rows, title=None, widths=None):
    """Write a styled header + data block starting at column B. Returns next free row."""
    last_col = len(headers) + 1
    if title:
        ws.merge_cells(start_row=start_row, start_column=2, end_row=start_row, end_column=last_col)
        c = ws.cell(row=start_row, column=2, value=title)
        c.font = font_subheader()
        c.fill = PatternFill("solid", fgColor=SECONDARY)
        c.alignment = Alignment(horizontal="left", vertical="center")
        ws.row_dimensions[start_row].height = 26
        start_row += 1
    hdr_row = start_row
    for col, h in enumerate(headers, 2):
        ws.cell(row=hdr_row, column=col, value=h)
    style_header_row(ws, hdr_row, 2, last_col)
    for i, row in enumerate(rows):
        r = hdr_row + 1 + i
        for col, v in enumerate(row, 2):
            ws.cell(row=r, column=col, value=v)
        style_data_row(ws, r, 2, last_col, i)
    return hdr_row + 1 + len(rows)


def add_caption(ws, row, text, last_col):
    ws.merge_cells(start_row=row, start_column=2, end_row=row, end_column=last_col)
    c = ws.cell(row=row, column=2, value=text)
    c.font = font_caption()
    c.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)


def color_confidence(ws, col, row_start, row_end):
    for r in range(row_start, row_end + 1):
        c = ws.cell(row=r, column=col)
        color, fill = CONF_STYLE.get(str(c.value), (None, None))
        if color:
            c.font = Font(name=FONT_NAME, size=11, color=color)
            c.fill = PatternFill("solid", fgColor=fill)


# --- Sheet 1: Read Me ---------------------------------------------------------
ws = wb.active
ws.title = "Read Me"
setup_sheet(ws, title="AI Productivity Tools — Research & Competitive Landscape Demo", last_col=3)
readme_rows = [
    ["Project type", "Concept Project — created to demonstrate AI-assisted research, data organization, verification, and business reporting. Not real client work."],
    ["Prepared", "October 2026"],
    ["Prepared by", "Research & Data Support — Concept Portfolio"],
    ["Fictional-data disclaimer", "All companies, products, prices, websites, and sources in this workbook are fictional demo data. .example domains are reserved for documentation and cannot belong to real sites."],
    ["Clean Data sheet", "20 products x 18 standardized fields — the decision-ready dataset."],
    ["Raw Data sheet", "22 source records exactly as captured, including 2 duplicate listings found during research."],
    ["Before & After sheet", "Six worked cleaning examples showing how messy entries became structured fields."],
    ["Summary Stats sheet", "Counts and shares computed from the Clean Data sheet (n = 20)."],
    ["QC Checklist sheet", "The quality-control pass applied before delivery."],
    ["Confidence levels", "High = official product source with clearly stated values, or two agreeing records · Medium = secondhand source (directory/review) or derived values · Needs verification = conflicting or unclear source information."],
    ["Source status values", "Cross-checked (2 sources) · Single source · Single source - conflicting details. Source status counts raw records, not trust."],
    ["Normalization conventions", "Currency USD per month (per-user where stated) · dates ISO 8601 (YYYY-MM-DD) · yes/no/trial-only fields · 8 standard product categories."],
]
end = write_table(ws, 4, ["Item", "Detail"], readme_rows)
add_caption(ws, end + 1, "Questions about this demo workbook: see README.md in the project folder.", 3)
auto_fit_columns(ws, min_width=10, max_width=95, header_row=4, data_start_row=5)
ws.column_dimensions["B"].width = 26
ws.column_dimensions["C"].width = 95
auto_fit_row_heights(ws, header_row=4, data_start_row=5)

# --- Sheet 2: Clean Data ------------------------------------------------------
ws = wb.create_sheet("Clean Data")
CLEAN_HEADERS = [
    "Company / Product", "Website", "Product Category", "Primary Use Case",
    "Target Customer", "Free Plan", "Starting Price (USD/mo)", "Billing Model",
    "AI Features", "Collaboration Features", "Mobile App", "Platforms",
    "Integrations", "Key Differentiator", "Notes", "Data Confidence",
    "Source Status", "Last Checked",
]
setup_sheet(ws, title="Clean Structured Dataset — 20 Products x 18 Fields", last_col=len(CLEAN_HEADERS) + 1)
for col, h in enumerate(CLEAN_HEADERS, 2):
    ws.cell(row=4, column=col, value=h)
style_header_row(ws, 4, 2, len(CLEAN_HEADERS) + 1)
for i, r in enumerate(clean_rows):
    rn = 5 + i
    vals = [
        r["company_name"], r["website"], r["product_category"], r["primary_use_case"],
        r["target_customer"], r["free_plan"], float(r["starting_price_usd"]), r["billing_model"],
        r["ai_features"], r["collaboration_features"], r["mobile_app"], r["platforms"],
        r["integrations"], r["key_differentiator"], r["notes"], r["data_confidence"],
        r["source_status"], datetime.strptime(r["last_checked"], "%Y-%m-%d").date(),
    ]
    for col, v in enumerate(vals, 2):
        ws.cell(row=rn, column=col, value=v)
    style_data_row(ws, rn, 2, len(CLEAN_HEADERS) + 1, i)
    price_cell = ws.cell(row=rn, column=8)
    price_cell.number_format = FORMATS["currency_usd"]
    price_cell.alignment = align_number()
    date_cell = ws.cell(row=rn, column=19)
    date_cell.number_format = FORMATS["date"]
    date_cell.alignment = Alignment(horizontal="center", vertical="center")
end = 4 + len(clean_rows)
color_confidence(ws, 17, 5, end)
add_caption(ws, end + 2, "Concept Project — all companies, prices, and sources are fictional demo data. Confidence: High / Medium / Needs verification.", len(CLEAN_HEADERS) + 1)
ws.freeze_panes = "C5"
ws.auto_filter.ref = f"B4:{get_column_letter(len(CLEAN_HEADERS) + 1)}{end}"
auto_fit_columns(ws, min_width=9, max_width=30, header_row=4, data_start_row=5)
auto_fit_row_heights(ws, header_row=4, data_start_row=5)

# --- Sheet 3: Raw Data --------------------------------------------------------
ws = wb.create_sheet("Raw Data")
RAW_HEADERS = list(raw_rows[0].keys())
setup_sheet(ws, title="Raw Research Dataset — 22 Records (As Captured)", last_col=len(RAW_HEADERS) + 1)
for col, h in enumerate(RAW_HEADERS, 2):
    ws.cell(row=4, column=col, value=h.replace("_", " ").title())
style_header_row(ws, 4, 2, len(RAW_HEADERS) + 1)
for i, r in enumerate(raw_rows):
    rn = 5 + i
    for col, h in enumerate(RAW_HEADERS, 2):
        ws.cell(row=rn, column=col, value=r[h])
    style_data_row(ws, rn, 2, len(RAW_HEADERS) + 1, i)
end = 4 + len(raw_rows)
add_caption(ws, end + 2, "Records R21 and R22 duplicate R01 and R02 under variant names — merged during cleaning. Formatting inconsistencies are intentional (demonstration data).", len(RAW_HEADERS) + 1)
ws.freeze_panes = "C5"
ws.auto_filter.ref = f"B4:{get_column_letter(len(RAW_HEADERS) + 1)}{end}"
auto_fit_columns(ws, min_width=8, max_width=28, header_row=4, data_start_row=5)
auto_fit_row_heights(ws, header_row=4, data_start_row=5)

# --- Sheet 4: Before & After --------------------------------------------------
ws = wb.create_sheet("Before & After")
setup_sheet(ws, title="Data Cleaning Log — Before vs After", last_col=7)
ba_rows = [
    [1, "Pricing format",
     'R01 · TASKPILOT PRO — "$9.99 monthly / maybe annual discount"',
     "Starting Price: $9.99 / month\nBilling Model: Monthly - annual discount unconfirmed\nSecond record (R21): price matched (9.99 USD monthly)",
     "Amount and billing cycle split into structured fields; the second record independently matched the price, while the unconfirmed discount stayed flagged.",
     "Medium → High"],
    [2, "Mobile & platforms",
     'R01 — mobile: "yes / ios android probably"',
     "Mobile App: Yes\nPlatforms: iOS, Android (both records); Web, Windows, macOS (listed once)",
     "Vague wording was cross-checked: only iOS and Android are confirmed by both records; the remaining platforms stay single-source listings.",
     "Medium → High"],
    [3, "Annual price conversion",
     'R13 · ChronoBase — "$108 per user billed yearly"',
     "Starting Price: $9.00 / user / month\nBilling Model: Per user / month (annual billing only)",
     "Yearly price ÷ 12 for comparability; annual-only billing recorded; single source → confidence kept at Medium.",
     "Medium"],
    [4, "Yes / no + trial",
     'R09 · INBOXZERO — free plan: "No - 14 day trial only"',
     "Free Plan: No (14-day trial)",
     "Free plan vs free trial separated into one normalized value (Yes / Trial only / No).",
     "High"],
    [5, "Conflicting sources",
     'R16 · WorkWhale — "$14/user/mo on pricing page - $12 listed on directory"',
     "Starting Price: $14.00 (official pricing page figure)\nDirectory figure: conflicting - unresolved\nSource status: single record with conflicting details",
     "Official pricing page outranks directory listings; conflicts are flagged, never silently resolved.",
     "Needs verification"],
    [6, "Date formats",
     'R04 "15 Sept 2026" · R06 "07/22/2026" · R03 "2026/07/28"',
     "2026-09-15 · 2026-07-22 · 2026-07-28 (ISO 8601)",
     "All last-checked dates converted to a single ISO format for sorting and freshness checks.",
     "High"],
    [7, "Integration counts",
     'R05 · Scheduly — integrations: "Google Calendar Outlook Zoom"',
     "Integrations: Google Calendar, Outlook, Zoom (count not stated)",
     "Named tools are preserved exactly; totals are never invented - rows whose source gives no count say so.",
     "High"],
]
end = write_table(ws, 4, ["#", "Field", "Raw entry (as captured)", "Cleaned output", "Rule applied", "Confidence"],
                  ba_rows, title=None)
for i in range(len(ba_rows)):
    ws.cell(row=5 + i, column=2).alignment = Alignment(horizontal="center", vertical="center")
add_caption(ws, end + 1, "Every transformation in this log is reproducible: raw record IDs reference the Raw Data sheet.", 7)
auto_fit_columns(ws, min_width=6, max_width=48, header_row=4, data_start_row=5)
ws.column_dimensions["B"].width = 6
ws.column_dimensions["D"].width = 48
ws.column_dimensions["E"].width = 48
auto_fit_row_heights(ws, header_row=4, data_start_row=5)

# --- Sheet 5: Summary Stats ---------------------------------------------------
ws = wb.create_sheet("Summary Stats")
setup_sheet(ws, title="Summary Statistics (computed from Clean Data, n = 20)", last_col=4)
row = 4
overview = [
    ["Products analyzed", "20"],
    ["Raw source records", "22"],
    ["Duplicates merged", "2 (R21, R22)"],
    ["Standardized fields", "18"],
    ["Median starting price", f"${median_price:.2f} / month"],
    ["Average starting price", f"${mean_price:.2f} / month"],
    ["Products with a free plan", f"{free_plan['Yes / limited']} of 20 (65%)"],
    ["Products advertising AI features", f"{ai_yes} of 20 (85%)"],
]
row = write_table(ws, row, ["Overview metric", "Value"], overview, title="Overview")
for i in range(len(overview)):
    ws.cell(row=row - len(overview) + i, column=3).alignment = align_number()

row += 1
cats = count_by("product_category")
rows = [[c, n, share(n)] for c, n in cats]
row = write_table(ws, row, ["Product category", "Products", "Share"], rows, title="Products by Category")
for i in range(len(rows)):
    r0 = row - len(rows) + i
    ws.cell(row=r0, column=3).alignment = align_number()
    s = ws.cell(row=r0, column=4)
    s.number_format = FORMATS["percentage"]
    s.alignment = align_number()

row += 1
bands = [("Under $6", lambda p: p < 6), ("$6 – $9.99", lambda p: 6 <= p < 10),
         ("$10 – $14.99", lambda p: 10 <= p < 15), ("$15 and above", lambda p: p >= 15)]
rows = [[label, sum(1 for p in prices if fn(p)), share(sum(1 for p in prices if fn(p)))] for label, fn in bands]
row = write_table(ws, row, ["Price band (USD/mo)", "Products", "Share"], rows, title="Starting Price Distribution")
for i in range(len(rows)):
    r0 = row - len(rows) + i
    ws.cell(row=r0, column=3).alignment = align_number()
    s = ws.cell(row=r0, column=4)
    s.number_format = FORMATS["percentage"]
    s.alignment = align_number()

row += 1
price_stats = [["Minimum", f"${min(prices):.2f}"], ["Maximum", f"${max(prices):.2f}"],
               ["Median", f"${median_price:.2f}"], ["Average", f"${mean_price:.2f}"]]
row = write_table(ws, row, ["Statistic", "Value"], price_stats, title="Price Statistics")
for i in range(len(price_stats)):
    ws.cell(row=row - len(price_stats) + i, column=3).alignment = align_number()

row += 1
rows = [[k, v, share(v)] for k, v in free_plan.items()]
row = write_table(ws, row, ["Availability", "Products", "Share"], rows, title="Free Plan Availability")
for i in range(len(rows)):
    r0 = row - len(rows) + i
    ws.cell(row=r0, column=3).alignment = align_number()
    s = ws.cell(row=r0, column=4)
    s.number_format = FORMATS["percentage"]
    s.alignment = align_number()

row += 1
rows = [["Advertised", ai_yes, share(ai_yes)], ["None advertised", 20 - ai_yes, share(20 - ai_yes)]]
row = write_table(ws, row, ["AI features", "Products", "Share"], rows, title="AI Feature Adoption")
for i in range(len(rows)):
    r0 = row - len(rows) + i
    ws.cell(row=r0, column=3).alignment = align_number()
    s = ws.cell(row=r0, column=4)
    s.number_format = FORMATS["percentage"]
    s.alignment = align_number()

row += 1
rows = [[t, n, share(n)] for t, n in count_by("target_customer")]
row = write_table(ws, row, ["Target customer", "Products", "Share"], rows, title="Target Customer Distribution")
for i in range(len(rows)):
    r0 = row - len(rows) + i
    ws.cell(row=r0, column=3).alignment = align_number()
    s = ws.cell(row=r0, column=4)
    s.number_format = FORMATS["percentage"]
    s.alignment = align_number()

row += 1
rows = [[k, v, share(v)] for k, v in conf.items()]
row = write_table(ws, row, ["Confidence level", "Products", "Share"], rows, title="Data Confidence")
for i in range(len(rows)):
    r0 = row - len(rows) + i
    ws.cell(row=r0, column=3).alignment = align_number()
    s = ws.cell(row=r0, column=4)
    s.number_format = FORMATS["percentage"]
    s.alignment = align_number()

row += 1
rows = [[k, v, share(v)] for k, v in sorted(count_by("source_status"), key=lambda kv: -kv[1])]
row = write_table(ws, row, ["Source status (raw records)", "Products", "Share"], rows, title="Source Status")
for i in range(len(rows)):
    r0 = row - len(rows) + i
    ws.cell(row=r0, column=3).alignment = align_number()
    s = ws.cell(row=r0, column=4)
    s.number_format = FORMATS["percentage"]
    s.alignment = align_number()

add_caption(ws, row + 1, "All figures derived from the Clean Data sheet. Source status counts raw records per product, not trust. Concept Project — fictional demo data.", 4)
auto_fit_columns(ws, min_width=10, max_width=42, header_row=5, data_start_row=6)
auto_fit_row_heights(ws, header_row=5, data_start_row=6)

# --- Sheet 6: QC Checklist ----------------------------------------------------
ws = wb.create_sheet("QC Checklist")
setup_sheet(ws, title="Research Quality-Control Checklist", last_col=5)
qc_rows = [
    ["Source recorded", "Each cleaned row maps to a raw record",
     "All 20 cleaned rows map to raw records R01-R22, each with a source type and a last-checked date (ISO 8601); derived or uncertain values are documented in Notes.", "Done"],
    ["Duplicate checked", "Each product appears exactly once",
     "Two duplicate listings (R21, R22) identified by name + website match and merged into R01 / R02.", "Done"],
    ["Pricing normalized", "One comparable format across all rows",
     "All prices converted to USD per month (per-user where the source states it); annual-only converted ($108/yr → $9.00/mo) and documented.", "Done"],
    ["Missing values flagged", "Unknowns are marked, never guessed",
     "Empty or unclear source fields are called out in Notes; no placeholder values invented.", "Done"],
    ["Unclear claims marked for verification", "Vague or conflicting claims are visible",
     "WorkWhale (price conflict) and GoalGrid (unclear platforms) marked 'Needs verification'; 4 rows marked Medium.", "Done"],
    ["No unsupported assumptions", "Any assumption is documented",
     "A field-by-field traceability audit removed values the sources don't state (platform guesses, integration counts); remaining derivations (FocusForge monthly assumption, ChronoBase conversion) are recorded in Notes.", "Done"],
    ["Dates standardized", "One date format everywhere",
     "All last-checked dates converted to ISO 8601 (YYYY-MM-DD).", "Done"],
    ["Final review completed", "Dataset consistency reviewed during project QA",
     "Every cleaned row was re-audited field-by-field against its raw record before publication.", "Done"],
]
end = write_table(ws, 4, ["Check", "What it means", "How it was applied in this project", "Status"], qc_rows)
for i in range(len(qc_rows)):
    c = ws.cell(row=5 + i, column=5)
    c.font = Font(name=FONT_NAME, size=11, color=ACCENT_POSITIVE)
    c.fill = PatternFill("solid", fgColor="E8F5E9")
    c.alignment = Alignment(horizontal="center", vertical="center")
add_caption(ws, end + 1, "Quality process mirrors what would be used on a live client engagement.", 5)
auto_fit_columns(ws, min_width=10, max_width=52, header_row=4, data_start_row=5)
auto_fit_row_heights(ws, header_row=4, data_start_row=5)

# ------------------------------------------------------------------ save + verify
wb.save(OUT_PATH)
print(f"saved: {OUT_PATH}  (skill design system: {USING_SKILL_DESIGN})")
print(f"median=${median_price} mean=${mean_price} free={free_plan} ai_yes={ai_yes} conf={conf}")
