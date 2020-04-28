import Phaser from "phaser"

import ScoreLabel from '../ui/ScoreLabel'
import BombSpawner from '../entities/Bomb'
import StarSpawner from '../entities/Star'
import PlayerSpawner from '../entities/Player'

const GROUND_KEY = 'ground'
const DUDE_KEY = 'dude'
const STAR_KEY = 'star'
const BOMB_KEY = 'bomb'

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('game-scene')

    this.playerSpawner = new PlayerSpawner(this, DUDE_KEY)

    this.cursors = undefined
    this.scoreLabel = undefined
    this.stars = undefined
    this.bombSpawner = undefined
    this.platforms = undefined

    this.gameOver = false
  }

  preload() {
    this.load.image('sky', 'assets/sky.png')
    this.load.image(GROUND_KEY, 'assets/platform.png')
    this.load.image(STAR_KEY, 'assets/star.png')
    this.load.image(BOMB_KEY, 'assets/bomb.png')

    this.playerSpawner.preload()

    // this.load.spritesheet(DUDE_KEY,
    //   'assets/dude.png',
    //   { frameWidth: 32, frameHeight: 48 }
    // )
  }

  create() {
    console.log('opa')
    this.add.image(400, 300, 'sky')
    console.log('opa')
    this.platforms = this.createPlatforms()
    this.scoreLabel = this.createScoreLabel(16, 16, 0)
    this.playerSpawner.create()
    this.bombSpawner = new BombSpawner(this, BOMB_KEY)


    const starSpawnParams = {
      key: STAR_KEY,
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 }
    }
    this.starSpawner = new StarSpawner(this, STAR_KEY)
    this.starSpawner.spawn(starSpawnParams)

    this.createCollisions()
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  createCollisions() {
    const player = this.playerSpawner.player
    const stars = this.starSpawner.group
    const bombs = this.bombSpawner.group

    this.physics.add.collider(player, this.platforms)
    this.physics.add.collider(stars, this.platforms)
    this.physics.add.collider(bombs, this.platforms)
    this.physics.add.collider(player, bombs, this.hitBomb, null, this)

    this.physics.add.overlap(player, stars, this.collectStar, null, this)
  }

  update() {
    if (this.gameOver) {
      return
    }

    this.playerSpawner.move(this.cursors)
  }

  createPlatforms() {
    const platforms = this.physics.add.staticGroup()

    platforms.create(400, 568, GROUND_KEY).setScale(2).refreshBody()

    platforms.create(600, 400, GROUND_KEY)
    platforms.create(50, 250, GROUND_KEY)
    platforms.create(750, 220, GROUND_KEY)

    return platforms
  }

  createScoreLabel(x, y, score) {
    const style = { fontSize: '32px', fill: '#000' }
    const label = new ScoreLabel(this, x, y, score, style)

    this.add.existing(label)

    return label
  }

  collectStar(player, star) {
    star.disableBody(true, true)

    const starGroup = this.starSpawner.group
    this.scoreLabel.add(10)

    if (starGroup.countActive(true) === 0) {
      starGroup.children.iterate(child => {
        child.enableBody(true, child.x, 0, true, true)
      })
    }

    this.bombSpawner.spawn(player.x)
  }

  hitBomb(player, bomb) {
    this.physics.pause()

    player.setTint(0xff0000)
    player.anims.play('turn')

    this.gameOver = true
  }
}
