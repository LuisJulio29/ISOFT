export var gsUrlApi = "";
export var gsUrlApiS3 = "";
var sAmbiente = "dev";
export var gsUpFiles = ""

switch (sAmbiente) {
    case "PRODUCCION":
        gsUrlApi = 'https://isoft.onrender.com';//<----Cambiar por ruta real
        break;
    default:
        gsUrlApi = 'https://isoft.onrender.com';
        break;
}

