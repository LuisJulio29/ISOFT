export var gsUrlApi = "";
export var gsUrlApiS3 = "";
var sAmbiente = "dev";
export var gsUpFiles = "https://api-interfazarchivos.tiserium.com"

switch (sAmbiente) {
    case "PRODUCCION":
        gsUrlApi = 'http://localhost:3001';
        break;
    default:
        gsUrlApi = 'http://localhost:3001';
        break;
}

