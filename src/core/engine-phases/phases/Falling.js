import BasePhase from "./BasePhase.js";

export default class Falling extends BasePhase {

  constructor(sharedHandlers) {
    super(sharedHandlers)
  }

  execute() {
    // console.log('>>>> FALLING PHASE')
    
    if (this.localState.playerAction.softDrop === true) {
      if (this.localState.fallIntervalId) {
        return
      }
      // Kickoff softdrop fall interval
      this.setAppState({ fallIntervalId: this.setContinuousFallEvent() })
      return
    } 
    
    // Kickoff regular fall interval
    if (this.localState.fallIntervalId === null) {
      this.setAppState({ fallIntervalId: this.setContinuousFallEvent() })
    }
  }

  setContinuousFallEvent() {
    return setInterval(this.continuousFallEvent.bind(this), this.localState.fallSpeed)
  }

  continuousFallEvent() {
    
    const { playfield, currentTetrimino, fallIntervalId } = this.localState
    const newState = {}

    const { 
      newPlayfield, 
      newTetrimino, 
      successfulMove
    } = this.tetriminoMovementHandler.moveOne('down', playfield, currentTetrimino)
    
    if (successfulMove)  {

      if (this.localState.playerAction.softdrop) {
        const scoreData = { currentScore: this.localState.totalScore }
        const scoreItem = { 
          scoringMethodName: 'softdrop', 
          scoreData 
        }
        newState.scoringHistoryPerCycle = this.localState.scoringHistoryPerCycle
        
        if (!newState.scoringHistoryPerCycle.softdrop) {
          newState.scoringHistoryPerCycle.softdrop = []
        }
        newState.scoringHistoryPerCycle.softdrop.push(scoreData)
        newState.totalScore = this.scoringHandler.updateScore(this.localState.totalScore, scoreItem)
      }

      newState.currentTetrimino = newTetrimino
      newState.playfield = newPlayfield
      newState.performedTSpin = false 
      newState.performedTSpinMini = false
      console.log('did this run')
      this.setAppState(newState)
      return
    }

    clearInterval(fallIntervalId)
    newState.fallIntervalId = null
    newState.currentGamePhase = 'lock'
    this.setAppState(newState)
  }

  awardSoftDropScore() {

  }
  
}