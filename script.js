import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as dat from 'dat.gui';

//creation scene 
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(1,1,3.8);



const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas-container'), alpha: true });

renderer.setSize(window.innerWidth/1.2, window.innerHeight/1.2);


const loader = new GLTFLoader();
let model;
loader.load("scene.gltf", (gltf) => {
    model = gltf.scene;
    model.rotation.x = 1.6;
    model.rotation.y = 4.5;
    model.rotation.z = 1.8;
    scene.add(model);
    animate();
});

// Initialisation de dat.GUI
const gui = new dat.GUI();




const directionalLight = new THREE.DirectionalLight(0x396555, 1); // Couleur, Intensité (0 à 1)
directionalLight.position.set(-0.8, 3.6, 5.4); // Position de la lumière directionnelle
directionalLight.intensity = 10;
scene.add(directionalLight);



const bottomLight = new THREE.DirectionalLight(0xffffff, 0.5); // Couleur blanche avec une intensité de 0.5
bottomLight.position.set(0, -1, 0);
bottomLight.intensity = 100; // Position en dessous de la scène
scene.add(bottomLight);




//#################################################################################################################################################################



// Ajouter les contrôles à dat.GUI

const cameraFolder = gui.addFolder('Camera Position');
const cameraControls = {
    positionX: 0,
    positionY: 0,
    positionZ: 5
};

const lightControls = {
    lightColor: 0xffffff, // Couleur blanche par défaut
    lightIntensity: 3.8
};

const lightFolder = gui.addFolder('Light Settings');
const lightPositionControls = {
    positionX: 1,
    positionY: 1,
    positionZ: 1
};


const rotationFolder = gui.addFolder('model Rotation');
const rotationControl = {
    rotationX: -4.8,
    rotationY : -2,
    rotationZ : 9.8
}



lightFolder.add(lightPositionControls, 'positionX', -10, 10).name('Light X').onChange((x) => {
    directionalLight.position.x = x;
});
lightFolder.add(lightPositionControls, 'positionY', -10, 10).name('Light Y').onChange((y) => {
    directionalLight.position.y = y;
});
lightFolder.add(lightPositionControls, 'positionZ', -10, 10).name('Light Z').onChange((z) => {
    directionalLight.position.z = z;
});
lightFolder.addColor(lightControls, 'lightColor').name('Light Color').onChange((color) => {
    directionalLight.color.set(color);
});
lightFolder.add(lightControls, 'lightIntensity', 0, 10).name('Light Intensity').onChange((intensity) => {
    directionalLight.intensity = intensity;
});


const updateCameraPosition = () => {
    camera.position.x = cameraControls.positionX;
    camera.position.y = cameraControls.positionY;
    camera.position.z = cameraControls.positionZ;
    camera.lookAt(scene.position); // Fait en sorte que la caméra regarde le centre de la scène
};


cameraFolder.add(cameraControls, 'positionX', -10, 10).name('cam X').onChange((x) => {
    camera.position.x = x;
});
cameraFolder.add(cameraControls, 'positionY', -10, 10).name('cam Y').onChange((y) => {
    camera.position.y = y;
});
cameraFolder.add(cameraControls, 'positionZ', -10, 10).name('cam Z').onChange((z) => {
    camera.position.z = z;
});



rotationFolder.add(rotationControl, 'rotationX', -10, 10).name('X').onChange((x)=>{
    model.rotation.x = x;
});
rotationFolder.add(rotationControl, 'rotationY', -10, 10).name('Y').onChange((y)=>{
    model.rotation.y = y;
});
rotationFolder.add(rotationControl, 'rotationZ', -10, 10).name('Z').onChange((z)=>{
    model.rotation.z = z;
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25; 
controls.minDistance = 3; // Distance minimale de zoom
controls.maxDistance = 5; // Distance maximale de zoom

// Animation de la scène
const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
};



// ######################################### LOGIQUE GENERATION MOT DE PASSE ######################################################

// DOM ELEMENTS

const resultElement = document.getElementById('result');
const lenghtElement = document.getElementById('lenght');
const upperCaseElement = document.getElementById('uppercase');
const lowerCaseElement = document.getElementById('lowercase');
const numbersElement = document.getElementById('numbers');
const specialsElement = document.getElementById('specials');
const generateElement = document.getElementById('form__button');
const copyElement = document.getElementById('copy');

// creation objet contenant les fonctions 
const allFunctions = {
    upper : getUpper,
    lower: getLower,
    number: getNumber,
    special: getSpecial
}

// CREER MON EVENT LSTENER
generateElement.addEventListener('click', () =>{
   const pswdLenght = +lenghtElement.value;
   const isUpper = upperCaseElement.checked;
   const isLower = lowerCaseElement.checked;
   const isNumber = numbersElement.checked;
   const isSpecial = specialsElement.checked;

   


    resultElement.innerText = generatePswd(isLower, isUpper, isNumber, isSpecial, pswdLenght);
});

// creer fonction qui genere le mdp
function generatePswd(lower, upper, number, special, lenght){
    let pswd = "";
    const countOptions = lower + upper + number + special
    //console.log("countsOptionq:" + countOptions);
    const optionsArray = [{lower}, {upper}, {number}, {special}].filter(item => Object.values(item)[0]);
    //console.log(optionsArray);

    if (countOptions === 0){
        return 'selectionner des options pour generer un mot de passe valide';
    }

    for (let i = 0; i < lenght; i += countOptions){
        optionsArray.forEach(type =>{
            const functName = Object.keys(type)[0];
            //console.log("functName: ", functName);
            pswd += allFunctions[functName]();
        });
    }

    const finalpswd = pswd.slice(0, lenght);
    return finalpswd
}



// generation des fonctions

function getLower(){
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}

function getUpper(){
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}

function getNumber(){
    return String.fromCharCode(Math.floor(Math.random() * 10) + 48);
}

function getSpecial(){
    const specials = "!#$%&'()*+,-./:;<=>?@[\]^_`{|}~";
    return specials[Math.floor(Math.random()* specials.length)];
}



 







