export var gsUrlApi = "";
export var gsUrlApiS3 = "";
var sAmbiente = "dev";
export var gsUpFiles = ""

switch (sAmbiente) {
    case "PRODUCCION":
        gsUrlApi = 'http://localhost:3001';//<----Cambiar por ruta real
        break;
    default:
        gsUrlApi = 'http://localhost:3001';
        break;
}

