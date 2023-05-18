
/**CREACION DEL ESCENARIO */
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(WIDTH, HEIGHT);
renderer.setClearColor(0xDDDDDD, 1);
document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 1, 1000);
camera.position.z = 4.5;
camera.position.x = -5.2;
camera.position.y = 2;

camera.rotation.set(0, -0.5, 0);
scene.add(camera);

var controls = new THREE.OrbitControls(camera, renderer.domElement);

// **LUZ DE ESCENARIO**
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(-1, 2, 4);
scene.add(light);

const size = 150;
const divisions = 160;
const axesHelper = new THREE.AxesHelper(1000);
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(size, divisions);
scene.add(gridHelper);


// ** FUNCIÓN FIGURA **

function poligono(nlados, dim) {
  const vertices = [];
  const ang = (2 * Math.PI) / nlados;
  const radio = dim / (2 * Math.sin(ang / 2));
  for (let i = 0; i <= nlados; i++) {
    const x = radio * Math.cos(i * ang);
    const y = radio * Math.sin(i * ang);
    vertices.push([x, y]);
  }
  return vertices;
}

function troncoPiramide(altura, nlados, apotemaBase, porcentajeApotemaSuperior) {
  const apotemaSuperior = apotemaBase * (porcentajeApotemaSuperior / 100);
  
  const baseInferior = poligono(nlados, apotemaBase * 2);
  const baseSuperior = poligono(nlados, apotemaSuperior * 2);
  
  const vertices = [];
  
  for (let i = 0; i < nlados; i++) {
    const v1 = baseInferior[i];
    const v2 = baseInferior[i + 1];
    const v3 = baseSuperior[i + 1];
    const v4 = baseSuperior[i];
    
    // Agregar caras laterales
    vertices.push(v1, v2, v3);
    vertices.push(v3, v4, v1);
    
    // Agregar caras superiores e inferiores
    vertices.push(v1, v3, [0, 0]);
    vertices.push(v4, v2, [0, 0]);
  }
  
  const alturaBase = apotemaBase * Math.tan(Math.PI / nlados);
  const alturaSuperior = apotemaSuperior * Math.tan(Math.PI / nlados);
  
  // Agregar caras superiores e inferiores
  for (let i = 0; i < nlados - 1; i++) {
    vertices.push(baseInferior[i], baseInferior[i + 1], [0, 0]);
    vertices.push(baseSuperior[i + 1], baseSuperior[i], [0, 0]);
  }
  
  vertices.push(baseInferior[nlados - 1], baseInferior[0], [0, 0]);
  vertices.push(baseSuperior[0], baseSuperior[nlados - 1], [0, 0]);
  
  // Trasladar el tronco de la pirámide para que la base inferior esté en el origen
  const translation = [0, 0, -(alturaBase / 2)];
  for (let i = 0; i < vertices.length; i++) {
    vertices[i].push(translation[0], translation[1], translation[2]);
  }
  
  return vertices;
}

// Ejemplo de uso
const altura = 5;
const nlados = 6;
const apotemaBase = 2;
const porcentajeApotemaSuperior = 80;

const vertices = troncoPiramide(altura, nlados, apotemaBase, porcentajeApotemaSuperior);
console.log(vertices);





//** FUNCION RENDER */
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}



render();




