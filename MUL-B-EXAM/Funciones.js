// ** CREACION DEL ESCENARIO **
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(WIDTH, HEIGHT);
renderer.setClearColor(0xDDDDDD, 1);
document.body.appendChild(renderer.domElement);
var scene = new THREE.Scene();

// ** CREACION CAMARA **
var camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 1, 1000);
camera.position.z = 50;
camera.position.x = 50;
camera.position.y = 25;
camera.rotation.set(0, 0, 0);
scene.add(camera);
var controls = new THREE.OrbitControls(camera, renderer.domElement);

// ** LUZ DE ESCENARIO **
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(-1, 2, 4);
scene.add(light);

// ** CUADRICULA **
const size = 80;
const divisions = 80;
const color1 = new THREE.Color(0x737373);
const color2 = new THREE.Color(0x333333);
const axesHelper = new THREE.AxesHelper(1000);
scene.add(axesHelper);
const gridHelper = new THREE.GridHelper(size, divisions);
scene.add(gridHelper);

// ** EJES**
const arrowSize = size / 2;
const origin = new THREE.Vector3(0, 0, 0);
const x = new THREE.Vector3(1, 0, 0);
const y = new THREE.Vector3(0, 1, 0);
const z = new THREE.Vector3(0, 0, 1);
const colorR = new THREE.Color(0xAA0000);
const colorG = new THREE.Color(0x00AA00);
const colorB = new THREE.Color(0x0000AA);
const arrowX = new THREE.ArrowHelper(x, origin, arrowSize, colorR, 2, 1);
const arrowY = new THREE.ArrowHelper(y, origin, arrowSize, colorG, 2, 1);
const arrowZ = new THREE.ArrowHelper(z, origin, arrowSize, colorB, 2, 1);
scene.add(arrowX);
scene.add(arrowY);
scene.add(arrowZ);

// ** FUNCION POLIGONO **
/* Función para crear un polígono regular con n lados y una dimensión dada
    * nlados: Número de lados
    * dim   : Dimensión (apotema)
*/
function poligono(nlados, dim) {
    const vertices = [];
    const ang = 2 * Math.PI / nlados;
    radio = dim / 2 / Math.sin(ang / 2);
    for (i = 0; i <= nlados; i++) {
        const x = radio * Math.cos(i * ang);
        const y = radio * Math.sin(i * ang);
        vertices.push([x, y]);
    }
    return vertices;
}

// ** FUNCION PIRAMIDES **
/* Función para generar las pirámides con forma de polígono
    nlados  : Número de lados
    lbaseInf: Lado base inferior
    lbaseSup: Lado base superior
    altura  : Altura
    pos     : Posición pirámides: plano XZ ó plano XY
*/
function genPiramides(nlados, lbaseInf, lbaseSup, altura, pos) {
    const arrayPira = [];
    const separacion = lbaseInf > lbaseSup ? 2 * lbaseInf : 3 * lbaseSup; // Definir separación entre piramides
    for (let i = 0; i < 8; i++) {
        const piramide = posPiramide(nlados, lbaseInf, lbaseSup, altura, separacion, i, pos);
        arrayPira.push(piramide);
        scene.add(arrayPira[i]);
    }
}

// ** FUNCION POSICIONAR **
/* Función para posicionar las pirámides en la escena
    nlados  : Número de lados
    lbaseInf: Lado base inferior
    lbaseSup: Lado base superior
    altura  : Altura
    pos     : Posición pirámides: plano XZ ó plano XY
*/
function posPiramide(nlados, lbaseInf, lbaseSup, altura, separacion, i, pos) {
    const piramide = estPiramide(nlados, lbaseInf, lbaseSup, altura);
    switch (pos) {
        case 1: // Posicionamiento plano XZ
            piramide.position.x = (i % 4) * separacion;
            piramide.position.z = i >= 4 ? -2 * altura : 0;
            break;
        case 2: // Posicionamiento plano XY
            piramide.position.x = (i % 4) * separacion;
            piramide.position.y = i >= 4 ? -altura : 0;
            break;
    }
    return piramide;
}

// ** FUNCION ESTILIZAR **
/* Función para crear una pirámide estilizada con polígonos de lados n
    nlados  : Número de lados
    lbaseInf: Lado base inferior
    lbaseSup: Lado base superior
    altura  : Altura
*/
function estPiramide(nlados, lbaseInf, lbaseSup, altura) {
    // Obtener los vértices de un polígono regular con lados n
    const vertices = poligono(nlados, lbaseInf);
    const apotemaInf = lbaseInf / (2 * Math.tan(Math.PI / nlados));
    const apotemaSup = lbaseSup;
    const radioInf = apotemaInf / Math.tan(Math.PI / nlados);
    const radioSup = apotemaSup / Math.tan(Math.PI / nlados);
    const alturaPiramide = altura - apotemaSup;
    const InferiorGeometry = new THREE.BufferGeometry().setFromPoints(vertices);
    const SuperiorGeometry = new THREE.BufferGeometry().setFromPoints(vertices);
    const Geometry = new THREE.CylinderGeometry(radioInf, radioSup, alturaPiramide, nlados);
    const terminadoVertices = Matrasla(Geometry, SuperiorGeometry, InferiorGeometry, alturaPiramide, altura, apotemaSup);
    const consCuerpo = new THREE.Group();
    consCuerpo.add(terminadoVertices.cuerpo);
    consCuerpo.add(terminadoVertices.meshVertices);
    return consCuerpo;
}

// ** FUNCION MATERIALES Y MOVIMIENTOS **
/* En esta funcion creamos los materiales y algunos movimientos de las piramides(rotacion,cambio de posicion)
    geomCuerpo : Geometría para las caras laterales
    geomSup    : Geometría para la cara superior
    geomInf    : Geometría para la cara inferior
    altPiramide: Altura total piramide
    altura     : Altura piramide
    apotSup    : Apotema superior
    */
function Matrasla(geomCuerpo, geomSup, geomInf, altPiramide, altura, apotSup) {
    // Seleccionar materiales
    const color = new THREE.Color(Math.random(255), Math.random(255), Math.random(255));
    const material = new THREE.MeshLambertMaterial({ color: color, flatShading: true });
    const baseSuperior = new THREE.Mesh(geomSup, material);
    const baseInferior = new THREE.Mesh(geomInf, material);
    const estructura = new THREE.Mesh(geomCuerpo, material);
    // Realizar movimientos
    baseInferior.position.y = - altPiramide / 2;
    baseSuperior.position.y = altura - apotSup / 2;
    estructura.position.y = (altura - apotSup) / 2;
    estructura.position.y = (altura - apotSup) / 2;
    estructura.rotation.z = Math.PI;
    estructura.rotation.z = Math.PI;
    return { cuerpo: estructura };
}

// ** CREAR PRIRAMIDES **
const numlados = 5; // Número de lados
const dimbaseInf = 5; // Valor lado base inferior
const dimbaseSup = 1; // Valor lado base superior
const altura = 5; // Valor altura
const posicion = 1; // Posición pirámides: 1 plano XZ / 2 plano XY
const piramides = genPiramides(numlados, dimbaseInf, dimbaseSup, altura, posicion);
render();

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

