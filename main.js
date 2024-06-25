const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')

    const $sprite = document.querySelector('#sprite')
    const $bricks = document.querySelector('#bricks')

    canvas.width = 448
    canvas.height = 400

    // VARIABLES DE LA PELOTA

    const ballRadius = 4;
    // posicion de la pelota
    let x = canvas.width / 2
    let y = canvas.height -30

    // velocidad de la pelota
    let dx = 3;
    let dy = -3;

    /* VARIABLES DE LA PALEA*/

    const paddleHeight = 10 ;
    const paddleWidth = 50;

    let paddLeX = (canvas.width - paddleWidth) / 2 
    let paddleY = canvas.height - paddleHeight - 10

    let rightPressed = false
    let leftPressed = false

    // VARIABLES DE LOS LADRILLOS

    const brickRowCount = 6;
    const brickColumnCount = 13;
    const brickWidth = 32;
    const brickHeight = 16;
    const brickPadding = 0;
    const brickOffsetTop = 80;
    const brickOffsetLeft = 16;
    const bricks = [];

    const BRICK_STATUS = {
      ACTIVE: 1,
      DESTROYED: 0
    }

    for (let c = 0; c < brickColumnCount; c++) {
      bricks[c] = [] // inicializamos con un array vacio
      for(let r = 0; r < brickRowCount; r++) {
        // calculamos la posicion del ladrillo en la pantalla
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop
        //Asignar un color aleatorio a cada ladrillo
        const random = Math.floor(Math.random() * 8)
        // Guardomos la información de cada ladrillo
        bricks[c][r] = {
          x: brickX, 
          y: brickY, 
          status: BRICK_STATUS.ACTIVE, 
          color: random
        }
      } 
    }

    const PADDLE_SENSITIVITY = 8 ;


    function drawBall() {
      ctx.beginPath()
      ctx.arc(x, y, ballRadius, 0, Math.PI * 2)
      ctx.fillStyle = '#fff'
      ctx.fill()
      ctx.closePath()
    }

    function drawPaddle() {
      // ctx.fillStyle = 'red'
      // ctx.fillRect (
      //   paddLeX,
      //   paddleY,
      //   paddleWidth,
      //   paddleHeight
      // )
      ctx.drawImage(
        $sprite, // image
        29, // clipX: coordinadas de recorte
        174, // clipY = coordinadas de recorte
        paddleWidth, // El tamaño del recorte
        paddleHeight, // El tamaño del recorte
        paddLeX, // posición x del dibujo
        paddleY, // posición y del dibujo
        paddleWidth, // ancho del dibujo
        paddleHeight // alto del dibujo
      )
    }

    function drawBricks() {
      for (let c = 0; c < brickColumnCount; c++) {
        for(let r = 0; r < brickRowCount; r++) {
          const currentBrick = bricks[c][r]
          if( currentBrick.status === BRICK_STATUS.DESTROYED) 
          continue;

          // ctx.fillStyle = 'yellow'
          // ctx.rect(
          //   currentBrick.x,
          //   currentBrick.y,
          //   brickWidth,
          //   brickHeight
          // )
          // ctx.strokeStyle = '#000'
          // ctx.stroke()
          // ctx.fill()

          const clipX = currentBrick.color * 32

          ctx.drawImage (
            $bricks,
            clipX,
            0,
            brickWidth,
            brickHeight,
            currentBrick.x,
            currentBrick.y,
            brickWidth,
            brickHeight
          )
       } 
     }
    }

    function collisionDetection() {
      for (let c = 0; c < brickColumnCount; c++) {
        for(let r = 0; r < brickRowCount; r++) {
          const currentBrick = bricks[c][r]
          if( currentBrick.status === BRICK_STATUS.DESTROYED) 
          continue;

          const isBallSameXAsBrick = 
            x > currentBrick.x &&
            x < currentBrick.x + brickWidth

          const isBallSameYAsBrick = 
            y > currentBrick.y &&
            y < currentBrick.y + brickHeight

          if(isBallSameXAsBrick && isBallSameYAsBrick) {
            dy = -dy
            currentBrick.status = BRICK_STATUS.DESTROYED
          }
        } 
      }
    }

    function ballMovement () {
      if ( 
        x + dx > canvas.width - ballRadius || // la pared derecha
        x + dx < ballRadius // la pared izquierda
    ) {
        dx = -dx
      }
      if( y + dy < ballRadius) {
        dy = -dy
      }
      // LA PELOTA TOCA LA PALA
      const isBallSameXAsPaddle = 
      x > paddLeX &&
      x < paddLeX + paddleWidth

      const isBallTouchingPaddle = 
      y + dy > paddleY
      if (isBallSameXAsPaddle && isBallTouchingPaddle) {
        dy = -dy
      }
       //LA PELOTA TOCA EL SUELO
      else if (
         y + dy > canvas.height - ballRadius
         ) {
        console.log('Game over')
        document.location.reload()
      }
      x += dx;
      y += dy;
    }
    function paddleMovement () {
      if(rightPressed && paddLeX < canvas.width - paddleWidth) {
        paddLeX += PADDLE_SENSITIVITY;
      } else if ( leftPressed && paddLeX > 0 ) {
        paddLeX -= PADDLE_SENSITIVITY
      }
    }

    function cleanCanvas () {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    function initEvents () {
      document.addEventListener('keydown', keyDownHandler)
      document.addEventListener('keyup', keyUpHandler)


      function keyDownHandler (event) {
        const { key } = event
        if(key === 'Right' || key === 'ArrowRight') {
          rightPressed = true
        } else if (key === 'Left' || key === 'ArrowLeft') {
          leftPressed = true
        }
      }

      function keyUpHandler (event ) {
        const { key } = event
        if(key === 'Right' || key === 'ArrowRight') {
          rightPressed = false
        } else if (key === 'Left' || key === 'ArrowLeft') {
          leftPressed = false
        }
      }
    }

    function draw () {
      
      //aqui harás tus dibujos y checks de colisiones
      cleanCanvas()

      // 1 hay que dibujar los elementos
      drawBall()
      drawPaddle()
      drawBricks()
      // 2 drawScore
      // 3 colisiones y moviminetos
      collisionDetection()
      ballMovement()
      paddleMovement()
      window.requestAnimationFrame(draw)
    }

    draw()
    initEvents()