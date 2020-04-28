import Phaser from "phaser"

export default class Player {
  constructor(scene, key, cursors) {
    this._player = undefined
    this.scene = scene
    this.key = key

    this.cursors = cursors
  }

  preload() {
    this.scene.load.spritesheet(this.key,
      'assets/dude.png',
      { frameWidth: 32, frameHeight: 48 }
    )
  }

  create() {
    this._player = this.scene.physics.add.sprite(100, 450, this.key)
    this._createAnimation()
  }

  update(cursors) {
    this.move(cursors)
  }

  get player() {
    return this._player
  }

  move(cursors) {
    if (cursors.left.isDown) {
      this.player.setVelocityX(-160)

      this.player.anims.play('left', true)
    } else if (cursors.right.isDown) {
      this.player.setVelocityX(160)
      this.player.anims.play('right', true)
    } else {
      this.player.setVelocityX(0)
      this.player.anims.play('turn')
    }

    if (cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330)
    }
  }

  _createAnimation() {
    this.player.setBounce(0.2)
    this.player.setCollideWorldBounds(true)

    this.scene.anims.create({
      key: 'left',
      frames: this.scene.anims.generateFrameNumbers(this.key, { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    })

    this.scene.anims.create({
      key: 'turn',
      frames: [{ key: this.key, frame: 4 }],
      frameRate: 20
    })

    this.scene.anims.create({
      key: 'right',
      frames: this.scene.anims.generateFrameNumbers(this.key, { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    })
  }

}