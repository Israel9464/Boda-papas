// ================================================================
// GOOGLE APPS SCRIPT — Recibir fotos y guardarlas en Google Drive
// ================================================================
// Copia y pega este código completo en script.google.com
// ================================================================

// ⚙️ CONFIGURA ESTO:
const FOLDER_ID = 'TU_ID_DE_CARPETA_AQUI';
// Para obtener el ID: abre la carpeta en Google Drive,
// copia el ID que aparece en la URL después de /folders/
// Ejemplo: https://drive.google.com/drive/folders/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs
//          ID = 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs

function doPost(e) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    const body = JSON.parse(e.postData.contents);
    const { fileName, mimeType, data } = body;

    if (!fileName || !mimeType || !data) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'Datos incompletos' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const folder = DriveApp.getFolderById(FOLDER_ID);
    const blob = Utilities.newBlob(
      Utilities.base64Decode(data),
      mimeType,
      fileName
    );

    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        fileId: file.getId(),
        fileName: file.getName()
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Necesario para manejar preflight CORS
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Álbum de Bodas de Plata activo 🎉' }))
    .setMimeType(ContentService.MimeType.JSON);
}
