/**
 * Sincronización del tablero NeoSer.
 * El token se guarda en Script Properties; nunca en celdas ni en este archivo.
 */
const NOMBRES_HOJAS = {
  pagos: 'Pagos',
  trafico: 'Tráfico',
  control: 'Control',
};

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('NeoSer · Reportes')
    .addItem('Actualizar todo', 'actualizarTodo')
    .addItem('Actualizar pagos', 'actualizarPagos')
    .addItem('Actualizar tráfico GA4', 'actualizarTrafico')
    .addSeparator()
    .addItem('Crear actualización diaria', 'crearActualizacionDiaria')
    .addToUi();
}

function leerConfiguracion() {
  const propiedades = PropertiesService.getScriptProperties();
  const config = {
    reportUrl: propiedades.getProperty('NEOSER_REPORT_URL'),
    reportToken: propiedades.getProperty('NEOSER_REPORT_TOKEN'),
    ga4PropertyId: propiedades.getProperty('GA4_PROPERTY_ID') || '393610749',
  };
  if (!config.reportUrl || !config.reportToken) {
    throw new Error(
      'Faltan NEOSER_REPORT_URL o NEOSER_REPORT_TOKEN en Script Properties.',
    );
  }
  return config;
}

function actualizarTodo() {
  actualizarPagos();
  actualizarTrafico();
  SpreadsheetApp.flush();
}

function actualizarPagos() {
  const config = leerConfiguracion();
  let cursor = '';
  let paginas = 0;
  const items = [];

  do {
    const separador = config.reportUrl.includes('?') ? '&' : '?';
    const url =
      config.reportUrl + separador + 'limit=500' +
      (cursor ? '&cursor=' + encodeURIComponent(cursor) : '');
    const respuesta = UrlFetchApp.fetch(url, {
      method: 'get',
      headers: { Authorization: 'Bearer ' + config.reportToken },
      muteHttpExceptions: true,
    });
    if (respuesta.getResponseCode() !== 200) {
      throw new Error(
        'El reporte de pagos respondió HTTP ' + respuesta.getResponseCode(),
      );
    }
    const cuerpo = JSON.parse(respuesta.getContentText());
    items.push.apply(items, cuerpo.items || []);
    cursor = cuerpo.nextCursor || '';
    paginas += 1;
  } while (cursor && paginas < 100);

  const encabezados = [
    'Fecha de pago', 'Fecha de registro', 'Referencia', 'Proveedor', 'Estado',
    'Importe', 'Moneda', 'Curso', 'ID curso', 'UTM source', 'UTM medium',
    'UTM campaign', 'UTM content', 'Landing',
  ];
  const filas = items.map(function (item) {
    return [
      item.paidAt ? new Date(item.paidAt) : '',
      item.createdAt ? new Date(item.createdAt) : '',
      item.reference || '', item.provider || '', item.status || '',
      Number(item.amount || 0), item.currency || '', item.courseTitle || '',
      item.courseId || '', item.utmSource || '', item.utmMedium || '',
      item.utmCampaign || '', item.utmContent || '', item.landingPath || '',
    ];
  });

  escribirTabla(NOMBRES_HOJAS.pagos, encabezados, filas);
  const hoja = obtenerHoja(NOMBRES_HOJAS.pagos);
  if (filas.length) {
    hoja.getRange(2, 1, filas.length, 2).setNumberFormat('yyyy-mm-dd hh:mm');
    hoja.getRange(2, 6, filas.length, 1).setNumberFormat('#,##0.00');
  }
  registrarControl('Pagos', 'OK', filas.length, 'Sin PII; QA excluido');
}

function actualizarTrafico() {
  const config = leerConfiguracion();
  const url =
    'https://analyticsdata.googleapis.com/v1beta/properties/' +
    encodeURIComponent(config.ga4PropertyId) + ':runReport';
  const desde = Utilities.formatDate(
    new Date(Date.now() - 395 * 24 * 60 * 60 * 1000),
    'America/Lima',
    'yyyy-MM-dd',
  );
  const payload = {
    dateRanges: [{ startDate: desde, endDate: 'today' }],
    dimensions: [
      { name: 'date' }, { name: 'sessionSource' }, { name: 'sessionMedium' },
      { name: 'sessionCampaignName' }, { name: 'hostName' },
    ],
    metrics: [
      { name: 'sessions' }, { name: 'totalUsers' },
      { name: 'screenPageViews' }, { name: 'eventCount' }, { name: 'keyEvents' },
    ],
    dimensionFilter: {
      filter: {
        fieldName: 'hostName',
        stringFilter: { matchType: 'EXACT', value: 'neoser.pe', caseSensitive: false },
      },
    },
    limit: '100000',
  };
  const respuesta = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  });
  if (respuesta.getResponseCode() !== 200) {
    throw new Error(
      'GA4 respondió HTTP ' + respuesta.getResponseCode() + ': ' +
      respuesta.getContentText().slice(0, 300),
    );
  }

  const datos = JSON.parse(respuesta.getContentText());
  const encabezados = [
    'Fecha', 'Fuente', 'Medio', 'Campaña', 'Hostname', 'Sesiones',
    'Usuarios', 'Vistas', 'Eventos', 'Eventos clave',
  ];
  const filas = (datos.rows || []).map(function (row) {
    const d = row.dimensionValues.map(function (v) { return v.value; });
    const m = row.metricValues.map(function (v) { return Number(v.value || 0); });
    const fecha = new Date(
      Number(d[0].slice(0, 4)), Number(d[0].slice(4, 6)) - 1, Number(d[0].slice(6, 8)),
    );
    return [fecha, d[1], d[2], d[3], d[4], m[0], m[1], m[2], m[3], m[4]];
  });

  escribirTabla(NOMBRES_HOJAS.trafico, encabezados, filas);
  if (filas.length) {
    obtenerHoja(NOMBRES_HOJAS.trafico)
      .getRange(2, 1, filas.length, 1)
      .setNumberFormat('yyyy-mm-dd');
  }
  registrarControl('GA4', 'OK', filas.length, 'Solo hostname neoser.pe');
}

function escribirTabla(nombre, encabezados, filas) {
  const hoja = obtenerHoja(nombre);
  hoja.clearContents();
  hoja.getRange(1, 1, 1, encabezados.length).setValues([encabezados]);
  if (filas.length) hoja.getRange(2, 1, filas.length, encabezados.length).setValues(filas);
  hoja.setFrozenRows(1);
  hoja.getRange(1, 1, 1, encabezados.length)
    .setBackground('#1B3A6B').setFontColor('#FFFFFF').setFontWeight('bold');
  hoja.autoResizeColumns(1, encabezados.length);
}

function obtenerHoja(nombre) {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  return libro.getSheetByName(nombre) || libro.insertSheet(nombre);
}

function registrarControl(origen, estado, filas, nota) {
  const hoja = obtenerHoja(NOMBRES_HOJAS.control);
  if (hoja.getLastRow() === 0) {
    hoja.appendRow(['Fecha', 'Origen', 'Estado', 'Filas', 'Nota']);
  }
  hoja.appendRow([new Date(), origen, estado, filas, nota || '']);
}

function crearActualizacionDiaria() {
  ScriptApp.getProjectTriggers()
    .filter(function (trigger) { return trigger.getHandlerFunction() === 'actualizarTodo'; })
    .forEach(function (trigger) { ScriptApp.deleteTrigger(trigger); });
  ScriptApp.newTrigger('actualizarTodo').timeBased().everyDays(1).atHour(7).create();
  SpreadsheetApp.getUi().alert('Actualización diaria creada para las 7 a. m. (Lima).');
}
