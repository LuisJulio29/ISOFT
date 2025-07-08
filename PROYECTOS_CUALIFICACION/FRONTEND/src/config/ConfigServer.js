export var gsUrlApi = "";
export var gsUrlApiS3 = "";
var sAmbiente = "PRODUCCION";
export var gsUpFiles = ""

switch (sAmbiente) {
    case "PRODUCCION":
        gsUrlApi = 'https://isoft.onrender.com';//<----Cambiar por ruta real
        break;
    case "dev":
        gsUrlApi = 'https://isoft.onrender.com';
        break;
    default:
        gsUrlApi = 'https://isoft.onrender.com';
        break;
}

