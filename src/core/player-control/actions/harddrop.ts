import { eventDataIF } from '../../../interfaces'
import { makeCopy } from '../../utils/utils'

export default function actionHarddrop(eventData: eventDataIF) {

  const { strokeType } = eventData

  if (strokeType === 'keydown' && this.localState.playerAction.harddrop) {
    return
  }
  const newState = makeCopy(this.localState)

  if (strokeType === 'keyup') {
    newState.playerAction.harddrop = false
    this.setAppState(newState)
    return
  }

  let { playfield, currentTetrimino } = newState

  //Remove the ghost tetrimino
  if (this.localState.ghostTetriminoOn) {
    playfield = this.tetriminoMovementHandler.removeTetriminoFromPlayfield(this.localState.ghostCoords, playfield)
  }

  const harddroppedTetrimino = this.tetriminoMovementHandler.getProjectedLandedTetrimino(playfield, currentTetrimino)

  const harddroppedTetriminoCoords = this.tetriminoMovementHandler.getPlayfieldCoords(harddroppedTetrimino)
  const currentTetriminoCoords = this.tetriminoMovementHandler.getPlayfieldCoords(currentTetrimino)
  
  const linesDropped = harddroppedTetriminoCoords[0] - currentTetriminoCoords[0]

  const scoringData = {
    currentScore: this.localState.totalScore,
    linesDropped
  }

  newState.scoringItemsForCompletion = this.localState.scoringItemsForCompletion
  newState.scoringItemsForCompletion.push({
    scoringMethodName: 'harddrop',
    scoringData
  })

  newState.scoringHistoryPerCycle = this.localState.scoringHistoryPerCycle
  newState.scoringHistoryPerCycle.harddrop = scoringData
  newState.playerAction.harddrop = true
  newState.currentGamePhase = 'pattern'
  newState.playfield = this.tetriminoMovementHandler.moveTetriminoOnPlayfield(currentTetriminoCoords, harddroppedTetriminoCoords, playfield, currentTetrimino.minoGraphic)
  newState.currentTetrimino = harddroppedTetrimino

  this.setAppState(newState)
}