export const createAnimations = (game) => { //creamos una funcion que recibe el juego como parametro para poder crear las animaciones

    //anims.create crea una animacion
    //key es el nombre de la animacion
    //frames son los frames que queremos mostrar
    //frameRate es la velocidad de la animacion
    //repeat es la cantidad de veces que se va a repetir la animacion

    game.anims.create({
      key: 'mario-walk',
      frames: game.anims.generateFrameNumbers(
        'mario',
        { start: 1, end: 3 }
      ),
      frameRate: 12,
      repeat: -1
    })
  
    game.anims.create({
      key: 'mario-idle',
      frames: [{ key: 'mario', frame: 0 }]
    })
  
    game.anims.create({
      key: 'mario-jump',
      frames: [{ key: 'mario', frame: 5 }]
    })
  
    game.anims.create({
      key: 'mario-dead',
      frames: [{ key: 'mario', frame: 4 }]
    })
  
    
  }