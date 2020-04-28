import Phaser from 'phaser'

export default class StarSpawn {
  constructor(scene, starKey = 'star') {
    this.scene = scene
    this.key = starKey

    this._group = this.scene.physics.add.group()
  }

  get group() {
    return this._group
  }

  spawn(params, bounceMin = 0.4, bounceMax = 0.8) {
    this.group.createMultiple(params)
    console.log(this.group);

    this.group.children.iterate(child => {
      child.setBounceY(Phaser.Math.FloatBetween(bounceMin, bounceMax))
      child.setCollideWorldBounds(true)
    })
  }
}
