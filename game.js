// global Phaser

import { createAnimations } from "./animations.js";

const config = { //configuracion del juego
    type: Phaser.AUTO, //tipo de renderizado (WebGL, CANVAS, AUTO)
    width: 256, //ancho del canvas
    height: 244, //alto del canvas
    backgroundColor: '#049cd8', //color de fondo del canvas
    parent: 'game', //id del elemento html
    physics: { //configuracion del motor de fisicas
        default: 'arcade', //tipo de motor de fisicas
        arcade: { //configuracion del motor de fisicas arcade
            gravity: { y: 300 }, //gravedad en el eje y
            debug: false //muestra los cuerpos de colision
        }
    },
    scene: {
        preload, //se ejecuta para precargar recursos
        create, // se ejecuta para crear los elementos del juego
        update // se ejecuta para actualizar el juego
    }
};

new Phaser.Game(config); //crea el juego con la configuracion config

function preload() { //se ejecuta para precargar recursos
    //this es el game , osea el juego que estamos contruyendo con phaser
    
    //load.image precarga una imagen
    this.load.image('cloud1', 'assets/scenery/overworld/cloud1.png'); 
    this.load.image('floorbricks', 'assets/scenery/overworld/floorbricks.png')
    
    //load.spritesheet precarga una hoja de sprites
    this.load.spritesheet('mario', 'assets/entities/mario.png', 
        { frameWidth: 18, frameHeight: 16 } //ancho y alto de cada frame de la hoja de sprites
    )

    //load.audio precarga un archivo de audio
    this.load.audio('gameover', 'assets/sound/music/gameover.mp3'); 
    
    
    console.log('preload');
}

function create() { //se ejecuta para crear los elementos del juego

    //image(x, y, key) x e y son las coordenadas
    //key es el nombre del recurso que queremos cargar
    //setScale es para escalar la imagen
    //setOrigin es para cambiar el origen de la imagen
    this.add.image(100, 50, 'cloud1')
    .setOrigin(0,0)
    .setScale(0.15);

    //sprite(x, y, key, frame) x e y son las coordenadas
    //key es el nombre del recurso que queremos cargar
    //frame es el frame que queremos mostrar
    //setOrigin es para cambiar el origen de la imagen
    //setCollideWorldBounds es para que el sprite no salga del mundo
    //setGravityY es para agregar gravedad en el eje y
    this.mario = this.physics.add.sprite(50,100, 'mario', 0)
    .setOrigin(0,1)
    .setCollideWorldBounds(true)
    .setGravityY(300);

    //staticGroup crea un grupo de objetos estaticos
    this.floor = this.physics.add.staticGroup();

    //refreshBody es para actualizar el cuerpo de colision
    this.floor
    .create(0, config.height - 16, 'floorbricks')
    .setOrigin(0, 0.5)
    .refreshBody();

    this.floor
    .create(150, config.height - 16, 'floorbricks')
    .setOrigin(0, 0.5)
    .refreshBody();

    //world.setBounds crea los limites del mundo
    this.physics.world.setBounds(0, 0, 2000, config.height);
    //add.collider agrega una colision entre dos objetos
    this.physics.add.collider(this.mario, this.floor);

    //camera.setBounds crea los limites de la camara
    this.cameras.main.setBounds(0, 0, 2000, config.height);
    //camera.startFollow hace que la camara siga a un objeto
    this.cameras.main.startFollow(this.mario);

    //createAnimations crea las animaciones importadas de animations.js
    createAnimations(this);


    //keyboard.createCursorKeys() crea un objeto con las teclas de direccion
    this.keys = this.input.keyboard.createCursorKeys();
    
    console.log('create');
    
}

function update() { //se ejecuta para actualizar el juego
    if (this.mario.isDead) return; //si mario esta muerto no se ejecuta el update

    if (this.keys.left.isDown) { //si se presiona la tecla de izquierda
        this.mario.anims.play('mario-walk', true); //se ejecuta la animacion de caminar
        this.mario.x -= 2; //se mueve a la izquierda
        this.mario.setFlipX = true; //se invierte la imagen
    } else if (this.keys.right.isDown) { //si se presiona la tecla de derecha
        this.mario.anims.play('mario-walk', true); //se ejecuta la animacion de caminar
        this.mario.x += 2; //se mueve a la derecha
        this.mario.setFlipX = true; //se invierte la imagen
    } else { //si no se presiona ninguna tecla
        this.mario.anims.play('mario-idle', true); //se ejecuta la animacion de estar quieto
    }

    if (this.keys.up.isDown && this.mario.body.touching.down) { //si se presiona la tecla de arriba y mario esta tocando el suelo
        this.mario.setVelocityY(-300); //mario salta
        this.mario.anims.play('mario-jump', true); //se ejecuta la animacion de saltar
    }

    if (this.mario.y >= config.height) { //si mario cae del mundo
        this.mario.isDead = true; //mario esta muerto
        this.mario.anims.play('mario-dead'); //se ejecuta la animacion de morir
        this.mario.setCollideWorldBounds(false); //mario ya no colisiona con el mundo
        this.sound.add('gameover', { volume: 0.2}).play() //se reproduce el sonido de gameover

        setTimeout(() => { //setTimeout crea un temporizador que se ejecuta una sola vez despues de un tiempo
            this.mario.setVelocityY(-300); //mario salta
        }, 100)

        //time.addEvent crea un evento que se ejecuta una sola vez despues de un tiempo
        this.time.addEvent({
            delay: 2000, //tiempo de espera
            callback: () => { //funcion que se ejecuta despues del tiempo de espera
                this.scene.restart(); //reinicia la escena
            }
        })
    }

    console.log('update');
}