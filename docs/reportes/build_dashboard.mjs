import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputPath = path.resolve("docs/reportes/Tablero-reportes-NeoSer.xlsx");
const previewDir = path.join(os.tmpdir(), "neoser-reportes-previews");
const font = "Arial";
const navy = "#1B3A6B";
const pink = "#E8879B";
const cream = "#FFF8F3";
const blue = "#2F6F9F";
const gray = "#5E6875";
const paleBlue = "#EAF2F8";
const palePink = "#FCE9ED";
const green = "#2E8B6D";

const workbook = Workbook.create();
const resumen = workbook.worksheets.add("Resumen");
const pagos = workbook.worksheets.add("Pagos");
const campanas = workbook.worksheets.add("Campañas");
const trafico = workbook.worksheets.add("Tráfico");
const control = workbook.worksheets.add("Control");

function baseSheet(sheet, color) {
  sheet.showGridLines = false;
  sheet.tabColor = color;
}

function styleHeader(range) {
  range.format = {
    fill: navy,
    font: { name: font, size: 10, bold: true, color: "#FFFFFF" },
    verticalAlignment: "center",
    wrapText: true,
    borders: { preset: "all", style: "thin", color: "#CBD5E1" },
  };
  range.format.rowHeightPx = 34;
}

function styleTitle(sheet, title, subtitle, endColumn = "N") {
  sheet.mergeCells(`A1:${endColumn}2`);
  sheet.getRange("A1").values = [[title]];
  sheet.getRange("A1").format = {
    fill: navy,
    font: { name: font, size: 22, bold: true, color: "#FFFFFF" },
    verticalAlignment: "center",
  };
  sheet.mergeCells(`A3:${endColumn}3`);
  sheet.getRange("A3").values = [[subtitle]];
  sheet.getRange("A3").format = {
    fill: cream,
    font: { name: font, size: 10, italic: true, color: gray },
    wrapText: true,
  };
  sheet.getRange("A1:A2").format.rowHeightPx = 30;
  sheet.getRange("A3").format.rowHeightPx = 28;
}

function styleKpi(labelRange, valueRange, fill) {
  labelRange.format = {
    fill,
    font: { name: font, size: 10, bold: true, color: navy },
    verticalAlignment: "center",
    wrapText: true,
    borders: { preset: "outside", style: "thin", color: "#D8DEE8" },
  };
  valueRange.format = {
    fill: "#FFFFFF",
    font: { name: font, size: 18, bold: true, color: navy },
    verticalAlignment: "center",
    borders: { preset: "outside", style: "thin", color: "#D8DEE8" },
  };
}

baseSheet(resumen, pink);
styleTitle(
  resumen,
  "NeoSer · tablero comercial",
  "Ventas, campañas y tráfico de neoser.pe. Los importes PEN y USD se muestran por separado.",
  "L",
);
resumen.getRange("A5:B5").values = [["VENTAS CONFIRMADAS", "PEN"]];
resumen.getRange("A6:B6").formulas = [[
  '=COUNTIFS(Pagos!$E$2:$E$5001,"approved",Pagos!$G$2:$G$5001,"PEN")',
  '=SUMIFS(Pagos!$F$2:$F$5001,Pagos!$E$2:$E$5001,"approved",Pagos!$G$2:$G$5001,"PEN")',
]];
resumen.getRange("D5:E5").values = [["VENTAS CONFIRMADAS", "USD"]];
resumen.getRange("D6:E6").formulas = [[
  '=COUNTIFS(Pagos!$E$2:$E$5001,"approved",Pagos!$G$2:$G$5001,"USD")',
  '=SUMIFS(Pagos!$F$2:$F$5001,Pagos!$E$2:$E$5001,"approved",Pagos!$G$2:$G$5001,"USD")',
]];
resumen.getRange("G5:H5").values = [["PAYPAL PENDIENTES", "DEVOLUCIONES"]];
resumen.getRange("G6:H6").formulas = [[
  '=COUNTIFS(Pagos!$D$2:$D$5001,"paypal",Pagos!$E$2:$E$5001,"pending")',
  '=COUNTIF(Pagos!$E$2:$E$5001,"refunded")',
]];
resumen.getRange("J5:K5").values = [["SESIONES GA4", "USUARIOS"]];
resumen.getRange("J6:K6").formulas = [[
  "=SUM('Tráfico'!$F$2:$F$5001)",
  "=SUM('Tráfico'!$G$2:$G$5001)",
]];
styleKpi(resumen.getRange("A5:B5"), resumen.getRange("A6:B6"), palePink);
styleKpi(resumen.getRange("D5:E5"), resumen.getRange("D6:E6"), paleBlue);
styleKpi(resumen.getRange("G5:H5"), resumen.getRange("G6:H6"), "#F8F0E2");
styleKpi(resumen.getRange("J5:K5"), resumen.getRange("J6:K6"), "#E7F3EF");
resumen.getRange("B6").format.numberFormat = '"S/ "#,##0.00';
resumen.getRange("E6").format.numberFormat = '"US$ "#,##0.00';

resumen.getRange("A9:B9").values = [["MENSAJES MANYCHAT", "LECTURA"]];
resumen.getRange("A10:B10").formulas = [[
  "=SUM('Campañas'!$E$2:$E$101)",
  "=IFERROR(SUM('Campañas'!$G$2:$G$101)/SUM('Campañas'!$F$2:$F$101),0)",
]];
resumen.getRange("D9:E9").values = [["CLICS MANYCHAT", "CTR"]];
resumen.getRange("D10:E10").formulas = [[
  "=SUM('Campañas'!$H$2:$H$101)",
  "=IFERROR(SUM('Campañas'!$H$2:$H$101)/SUM('Campañas'!$G$2:$G$101),0)",
]];
resumen.getRange("G9:H9").values = [["VISTAS WEB", "EVENTOS CLAVE"]];
resumen.getRange("G10:H10").formulas = [[
  "=SUM('Tráfico'!$H$2:$H$5001)",
  "=SUM('Tráfico'!$J$2:$J$5001)",
]];
resumen.mergeCells("J9:K9");
resumen.getRange("J9").values = [["ÚLTIMA SINCRONIZACIÓN"]];
resumen.mergeCells("J10:K10");
resumen.getRange("J10").formulas = [[
  '=IF(COUNTA(Control!$A$2:$A$101)=0,"Sin sincronizar",MAX(Control!$A$2:$A$101))',
]];
styleKpi(resumen.getRange("A9:B9"), resumen.getRange("A10:B10"), palePink);
styleKpi(resumen.getRange("D9:E9"), resumen.getRange("D10:E10"), paleBlue);
styleKpi(resumen.getRange("G9:H9"), resumen.getRange("G10:H10"), "#E7F3EF");
styleKpi(resumen.getRange("J9:K9"), resumen.getRange("J10:K10"), "#F2F4F7");
resumen.getRange("B10:E10").format.numberFormat = "0.0%";
resumen.getRange("J10").format.numberFormat = "yyyy-mm-dd hh:mm";

resumen.getRange("A13:C13").values = [["Mes", "Ventas PEN", "Ventas USD"]];
styleHeader(resumen.getRange("A13:C13"));
const months = [];
const monthDates = [];
for (let offset = 11; offset >= 0; offset -= 1) {
  const date = new Date(2026, 8 - offset, 1);
  months.push([date.toLocaleDateString("es-PE", { month: "short", year: "numeric" })]);
  monthDates.push([date]);
}
resumen.getRange("A14:A25").values = months;
resumen.getRange("M14:M25").values = monthDates;
for (let row = 14; row <= 25; row += 1) {
  resumen.getRange(`B${row}:C${row}`).formulas = [[
    `=SUMIFS(Pagos!$F$2:$F$5001,Pagos!$A$2:$A$5001,">="&M${row},Pagos!$A$2:$A$5001,"<"&EDATE(M${row},1),Pagos!$E$2:$E$5001,"approved",Pagos!$G$2:$G$5001,"PEN")`,
    `=SUMIFS(Pagos!$F$2:$F$5001,Pagos!$A$2:$A$5001,">="&M${row},Pagos!$A$2:$A$5001,"<"&EDATE(M${row},1),Pagos!$E$2:$E$5001,"approved",Pagos!$G$2:$G$5001,"USD")`,
  ]];
}
resumen.getRange("M14:M25").format.numberFormat = "yyyy-mm-dd";
resumen.getRange("M:M").format.columnWidthPx = 2;
resumen.getRange("B14:B25").format.numberFormat = '"S/ "#,##0.00';
resumen.getRange("C14:C25").format.numberFormat = '"US$ "#,##0.00';
resumen.getRange("A14:C25").format.borders = {
  preset: "all", style: "thin", color: "#E4E8EE",
};

resumen.getRange("E13:F13").values = [["Etapa", "Total"]];
styleHeader(resumen.getRange("E13:F13"));
resumen.getRange("E14:E17").values = [
  ["ManyChat enviados"], ["ManyChat leídos"], ["ManyChat clics"], ["Ventas aprobadas"],
];
resumen.getRange("F14:F17").formulas = [
  ["=SUM('Campañas'!$E$2:$E$101)"],
  ["=SUM('Campañas'!$G$2:$G$101)"],
  ["=SUM('Campañas'!$H$2:$H$101)"],
  ['=COUNTIF(Pagos!$E$2:$E$5001,"approved")'],
];
resumen.getRange("E14:F17").format.borders = {
  preset: "all", style: "thin", color: "#E4E8EE",
};

const salesChart = resumen.charts.add("line", resumen.getRange("A13:C25"));
salesChart.title = "Ventas confirmadas por mes";
salesChart.titleTextStyle.typeface = font;
salesChart.legend = { position: "top", textStyle: { typeface: font } };
salesChart.xAxis = { axisType: "textAxis", textStyle: { typeface: font, fontSize: 9 } };
salesChart.yAxis = { textStyle: { typeface: font }, numberFormatCode: "#,##0", numberFormatSourceLinked: false };
salesChart.setPosition("H13", "L25");
if (salesChart.series.items[0]) salesChart.series.items[0].fill = pink;
if (salesChart.series.items[1]) salesChart.series.items[1].fill = blue;

const funnelChart = resumen.charts.add("bar", resumen.getRange("E13:F17"));
funnelChart.title = "Embudo operativo";
funnelChart.titleTextStyle.typeface = font;
funnelChart.hasLegend = false;
funnelChart.xAxis = { axisType: "textAxis", textStyle: { typeface: font, fontSize: 9 } };
funnelChart.yAxis = { textStyle: { typeface: font }, numberFormatCode: "0", numberFormatSourceLinked: false };
funnelChart.setPosition("A28", "F43");
if (funnelChart.series.items[0]) funnelChart.series.items[0].fill = pink;

resumen.mergeCells("H28:L34");
resumen.getRange("H28").values = [[
  "Cómo leer este tablero\n\n• Culqi aprobado cuenta automáticamente.\n• PayPal cuenta solo después de validarlo como approved.\n• ManyChat se carga manualmente por campaña.\n• GA4 se filtra por neoser.pe.",
]];
resumen.getRange("H28:L34").format = {
  fill: cream,
  font: { name: font, size: 11, color: navy },
  wrapText: true,
  verticalAlignment: "center",
  borders: { preset: "outside", style: "thin", color: pink },
};
resumen.getRange("H28:H34").format.rowHeightPx = 24;
resumen.freezePanes.freezeRows(3);
resumen.getRange("A1:L45").format.columnWidthPx = 92;
resumen.getRange("A:A").format.columnWidthPx = 125;
resumen.getRange("B:B").format.columnWidthPx = 95;
resumen.getRange("D:D").format.columnWidthPx = 125;
resumen.getRange("E:E").format.columnWidthPx = 135;
resumen.getRange("G:G").format.columnWidthPx = 125;
resumen.getRange("J:J").format.columnWidthPx = 135;
resumen.getRange("K:K").format.columnWidthPx = 115;
resumen.getRange("H:I").format.columnWidthPx = 110;
resumen.getRange("L:L").format.columnWidthPx = 110;

baseSheet(pagos, navy);
pagos.getRange("A1:N1").values = [[
  "Fecha de pago", "Fecha de registro", "Referencia", "Proveedor", "Estado",
  "Importe", "Moneda", "Curso", "ID curso", "UTM source", "UTM medium",
  "UTM campaign", "UTM content", "Landing",
]];
styleHeader(pagos.getRange("A1:N1"));
pagos.getRange("A2:N40").format = {
  fill: "#FFFFFF",
  borders: { preset: "all", style: "thin", color: "#EDF0F4" },
};
pagos.getRange("A2:B200").format.numberFormat = "yyyy-mm-dd hh:mm";
pagos.getRange("F2:F200").format.numberFormat = "#,##0.00";
pagos.getRange("E2:E200").conditionalFormats.add("cellIs", {
  operator: "equal", formula: '"approved"', format: { fill: "#DDF4EA", font: { color: green } },
});
pagos.getRange("E2:E200").conditionalFormats.add("cellIs", {
  operator: "equal", formula: '"pending"', format: { fill: "#FFF3D6", font: { color: "#8A5A00" } },
});
pagos.freezePanes.freezeRows(1);
pagos.getRange("A:B").format.columnWidthPx = 135;
pagos.getRange("C:C").format.columnWidthPx = 185;
pagos.getRange("D:G").format.columnWidthPx = 95;
pagos.getRange("H:H").format.columnWidthPx = 230;
pagos.getRange("I:I").format.columnWidthPx = 210;
pagos.getRange("J:N").format.columnWidthPx = 145;

baseSheet(campanas, pink);
campanas.getRange("A1:L1").values = [[
  "Fecha", "Campaña", "Flujo / mensaje", "Canal", "Enviados", "Entregados",
  "Leídos", "Clics", "Inversión", "Notas", "Tasa lectura", "CTR",
]];
styleHeader(campanas.getRange("A1:L1"));
campanas.getRange("A2:J40").format = {
  fill: "#FFFFFF",
  borders: { preset: "all", style: "thin", color: "#EDF0F4" },
};
campanas.getRange("K2").formulas = [["=IFERROR(G2/F2,0)"]];
campanas.getRange("K2:K101").fillDown();
campanas.getRange("L2").formulas = [["=IFERROR(H2/G2,0)"]];
campanas.getRange("L2:L101").fillDown();
campanas.getRange("A2:A101").format.numberFormat = "yyyy-mm-dd";
campanas.getRange("E2:I101").format.numberFormat = "#,##0.00";
campanas.getRange("K2:L101").format.numberFormat = "0.0%";
campanas.getRange("D2:D101").dataValidation = {
  rule: { type: "list", values: ["ManyChat", "Meta Ads", "Email", "Otro"] },
};
campanas.freezePanes.freezeRows(1);
campanas.getRange("A:A").format.columnWidthPx = 100;
campanas.getRange("B:C").format.columnWidthPx = 210;
campanas.getRange("D:D").format.columnWidthPx = 105;
campanas.getRange("E:I").format.columnWidthPx = 90;
campanas.getRange("J:J").format.columnWidthPx = 260;
campanas.getRange("K:L").format.columnWidthPx = 105;

baseSheet(trafico, blue);
trafico.getRange("A1:J1").values = [[
  "Fecha", "Fuente", "Medio", "Campaña", "Hostname", "Sesiones", "Usuarios",
  "Vistas", "Eventos", "Eventos clave",
]];
styleHeader(trafico.getRange("A1:J1"));
trafico.getRange("A2:J40").format = {
  fill: "#FFFFFF",
  borders: { preset: "all", style: "thin", color: "#EDF0F4" },
};
trafico.getRange("A2:A200").format.numberFormat = "yyyy-mm-dd";
trafico.getRange("F2:J200").format.numberFormat = "#,##0";
trafico.freezePanes.freezeRows(1);
trafico.getRange("A:A").format.columnWidthPx = 100;
trafico.getRange("B:E").format.columnWidthPx = 170;
trafico.getRange("F:J").format.columnWidthPx = 95;

baseSheet(control, green);
control.getRange("A1:E1").values = [["Fecha", "Origen", "Estado", "Filas", "Nota"]];
styleHeader(control.getRange("A1:E1"));
control.getRange("A2:E25").format = {
  fill: "#FFFFFF",
  borders: { preset: "all", style: "thin", color: "#EDF0F4" },
};
control.getRange("A2:A101").format.numberFormat = "yyyy-mm-dd hh:mm";
control.getRange("A:A").format.columnWidthPx = 145;
control.getRange("B:D").format.columnWidthPx = 110;
control.getRange("E:E").format.columnWidthPx = 300;
control.freezePanes.freezeRows(1);

workbook.recalculate();
await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.mkdir(previewDir, { recursive: true });

const inspection = await workbook.inspect({
  kind: "workbook,sheet,drawing",
  maxChars: 5000,
  tableMaxRows: 8,
  tableMaxCols: 12,
  options: { maxResults: 50 },
});
console.log(inspection.ndjson);

for (const sheetName of ["Resumen", "Pagos", "Campañas", "Tráfico", "Control"]) {
  const preview = await workbook.render({
    sheetName,
    autoCrop: "all",
    scale: sheetName === "Resumen" ? 0.8 : 0.7,
    format: "png",
  });
  await fs.writeFile(
    path.join(previewDir, `${sheetName.normalize("NFD").replace(/[\u0300-\u036f]/g, "")}.png`),
    new Uint8Array(await preview.arrayBuffer()),
  );
}

const formulaErrors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  maxChars: 6000,
});
console.log("FORMULA_ERRORS");
console.log(formulaErrors.ndjson);

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(`OUTPUT=${outputPath}`);
console.log(`PREVIEWS=${previewDir}`);
