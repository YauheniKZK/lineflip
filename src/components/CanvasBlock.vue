<template>
  <div style="margin-bottom:8px">
    Высота земли:
    <input
      type="number"
      v-model.number="GROUND_H"
      style="width:60px"
    />px
  </div>

  <canvas
    ref="canvas"
    @mousedown="onPointerDown"
    @touchstart.prevent="onPointerDown"
    :width="WIDTH"
    :height="HEIGHT"
    style="border:1px solid #ccc; touch-action:none; display:block;"
  />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'

const LINE_COLOR  = ref('#DED3C4')  // цвет линии
const GROUND_COLOR = ref('#555879') // цвет земли


// 1) Параметры канваса и земли
const WIDTH   = 400
const HEIGHT  = 600
const GROUND_H = ref(450)

// 2) Параметры линии
const THICKNESS   = 10
const MOVING_LEN  = 40
const H_SPEED     = 3
const V_SPEED     = 5

// 3) Конфиг «дыр» в земле
interface HoleConfig {
  type: 'down' | 'left' | 'right'
  startX: number
  startY: number
  width: number
  length: number
}
// пример массива дырок — можно подставить любой
const holesConfig = ref<HoleConfig[]>([
  { type: 'down',  startX: 50, startY: 0,  width: 15, length: 80 },
  { type: 'left',  startX: 430, startY: 80, width: 60, length: 500 },
  { type: 'down',  startX: 150, startY: 130,  width: 15, length: 100 },
  { type: 'left',  startX: 250, startY: 200, width: 80, length: 500 },
  { type: 'down',  startX: 50, startY: 280,  width: 15, length: 40 },
  { type: 'left',  startX: 350, startY: 320, width: 80, length: 300 },
  { type: 'down',  startX: 320, startY: 400,  width: 15, length: 60 },
]);


// 4) Последовательность кликов
interface ClickAction {
  flipTo?: 'horizontal' | 'vertical'
  direction?: 'left' | 'right'
  autoBounce?: boolean
}
const clickActions = ref<ClickAction[]>([
  { flipTo:'horizontal', autoBounce:true },  // 1. качаемся с отскоком
  { flipTo:'vertical' },                     // 2. падаем
  { flipTo:'vertical', direction:'right' },  // 3. встаём вертикально и дрейф вправо
  { flipTo:'vertical' },                      // 4. падаем
  { flipTo:'vertical', direction:'left' },
  { flipTo:'vertical' },  
])

// 5) Состояние игры
type Phase = 'idle'|'horizontal'|'verticalFall'|'verticalDrift'|'ended'
const state = reactive({
  x: 0,
  y: 0,
  phase: 'idle' as Phase,
  hDir: 1 as 1|-1,
  autoBounce: false,
  verticalDriftOnly: false,
  win: false
})
const actionIndex = ref(0)

// 6) Сброс
function reset() {
  state.x               = 0
  state.y               = 0
  state.phase           = 'idle'
  state.hDir            = 1
  state.autoBounce      = false
  state.verticalDriftOnly = false
  state.win             = false
  actionIndex.value     = 0
}

// 7) Обработка клика
function onPointerDown() {
  if (state.phase === 'ended') {
    reset()
    return
  }
  const act = clickActions.value[actionIndex.value]
  if (!act) return

  // Направление, если есть
  if (act.direction === 'left')  state.hDir = -1
  if (act.direction === 'right') state.hDir =  1

  // Флип в horizontal
  if (act.flipTo === 'horizontal') {
    state.phase      = 'horizontal'
    state.autoBounce = !!act.autoBounce
  }
  // Флип в vertical + direction = дрейф без падения
  else if (act.flipTo === 'vertical' && act.direction) {
    state.phase           = 'verticalDrift'
    state.verticalDriftOnly = true
  }
  // Флип в vertical без direction = падение
  else if (act.flipTo === 'vertical') {
    state.phase = 'verticalFall'
  }
  // Нет flipTo, но есть direction = простая horizontal
  else if (act.direction) {
    state.phase      = 'horizontal'
    state.autoBounce = false
  }

  actionIndex.value++
}

// 8) Игровой цикл
function tick() {
  update()
  draw()
  requestAnimationFrame(tick)
}

function update() {
  const limitH    = WIDTH  - MOVING_LEN   // X-предел для горизонтальной линии
  const limitV    = WIDTH  - THICKNESS    // X-предел для вертикальной линии
  const groundTop = HEIGHT - GROUND_H.value

  // проверяем, что весь прямоугольник линии лежит в пустотах
  function rectIsAllInHoles(x0: number, y0: number, w: number, h: number) {
    const startY = Math.max(y0, groundTop)
    for (let px = Math.floor(x0); px < x0 + w; px++) {
      for (let py = Math.floor(startY); py < y0 + h; py++) {
        let inHole = false
        for (const hole of holesConfig.value) {
          let hx0: number, hy0: number, hw: number, hh: number
          if (hole.type === 'down') {
            hx0 = hole.startX
            hy0 = groundTop + hole.startY
            hw  = hole.width
            hh  = hole.length
          } else if (hole.type === 'left') {
            hx0 = hole.startX - hole.length
            hy0 = groundTop + hole.startY
            hw  = hole.length
            hh  = hole.width
          } else { // 'right'
            hx0 = hole.startX
            hy0 = groundTop + hole.startY
            hw  = hole.length
            hh  = hole.width
          }
          if (px >= hx0 && px < hx0 + hw && py >= hy0 && py < hy0 + hh) {
            inHole = true
            break
          }
        }
        if (!inHole) return false
      }
    }
    return true
  }

  // 1) Горизонтальное движение
  if (state.phase === 'horizontal') {
    state.x += H_SPEED * state.hDir
    if (state.autoBounce) {
      if (state.x <= 0)       { state.x = 0;        state.hDir = 1 }
      else if (state.x >= limitH) { state.x = limitH;   state.hDir = -1 }
    } else {
      state.x = Math.max(0, Math.min(limitH, state.x))
    }

    const y0 = state.y
    const h  = THICKNESS
    if (y0 + h > groundTop) {
      if (!rectIsAllInHoles(state.x, y0, MOVING_LEN, h)) {
        state.phase = 'ended'; state.win = false
      }
    }
    return
  }

  // 2) Вертикальный дрейф
  if (state.phase === 'verticalDrift') {
    state.x = Math.max(0, Math.min(limitV, state.x + H_SPEED * state.hDir))

    const y0 = state.y
    const h  = MOVING_LEN
    if (y0 + h > groundTop) {
      if (!rectIsAllInHoles(state.x, y0, THICKNESS, h)) {
        state.phase = 'ended'; state.win = false
        return
      }
    }
    if (state.x === 0 || state.x === limitV) {
      state.phase = 'ended'; state.win = true
    }
    return
  }

  // 3) Вертикальное падение
  if (state.phase === 'verticalFall') {
    // до падения — проверим, нет ли сквозного down- hole до низа
    const x0 = state.x, x1 = x0 + THICKNESS
    const throughFull = holesConfig.value.some(h => {
      if (h.type !== 'down') return false
      const left  = h.startX
      const right = h.startX + h.width
      const holeTop    = groundTop + h.startY
      const holeBottom = holeTop + h.length
      // holeBottom ≥ HEIGHT означает, что эта дыра ведёт прямо в пустоту за канвас
      return x0 >= left && x1 <= right && holeTop <= groundTop && holeBottom >= HEIGHT
    })
    if (throughFull) {
      state.phase = 'ended'; state.win = true
      return
    }

    // собственно падение
    state.y += V_SPEED
    if (state.y > HEIGHT) {
      state.phase = 'ended'; state.win = true
      return
    }

    const y0 = state.y
    const h  = MOVING_LEN
    if (y0 + h > groundTop) {
      if (!rectIsAllInHoles(state.x, y0, THICKNESS, h)) {
        state.phase = 'ended'; state.win = false
      }
    }
  }
}


/**
 * Проверяет, попадает ли нижний край линии
 * в любую сквозную down-дыру по глубине.
 */
function insideAnyDownHole(x0: number, x1: number, depth: number): boolean {
  return holesConfig.value.some(h => {
    if (h.type !== 'down') return false
    if (x0 < h.startX || x1 > h.startX + h.width) return false
    return depth <= h.length
  })
}



// Проверка при горизонтальном движении в зоне земли
function checkHorizontalCollision(groundY: number, lineBot: number) {
  const x0 = state.x
  const x1 = x0 + MOVING_LEN

  const inHole = holesConfig.value.some(h => {
    // вертикальный диапазон дырки
    const holeTop    = groundY + h.startY
    const holeBottom = holeTop + (h.type === 'down' ? h.length : h.width)
    if (lineBot < holeTop || state.y > holeBottom) return false

    // горизонтальный диапазон дырки
    let left: number, right: number
    if (h.type === 'down') {
      left  = h.startX; right = h.startX + h.width
    } else if (h.type === 'left') {
      left  = h.startX - h.length; right = h.startX
    } else {
      left  = h.startX; right = h.startX + h.length
    }
    return x0 >= left && x1 <= right
  })

  if (!inHole) {
    state.phase = 'ended'
    state.win   = false
  }
}

// Проверка при падении
function checkFallCollision(groundY: number, lineBot: number) {
  const x0 = state.x
  const x1 = x0 + THICKNESS

  const inHole = holesConfig.value.some(h => {
    const holeTop    = groundY + h.startY
    const holeBottom = holeTop + (h.type === 'down' ? h.length : h.width)
    if (lineBot < holeTop || lineBot > holeBottom) return false

    let left: number, right: number
    if (h.type === 'down') {
      left  = h.startX; right = h.startX + h.width
    } else if (h.type === 'left') {
      left  = h.startX - h.length; right = h.startX
    } else {
      left  = h.startX; right = h.startX + h.length
    }
    return x0 > left && x1 < right
  })

  if (!inHole) {
    state.phase = 'ended'
    state.win   = false
  }
}

// 10) Отрисовка
function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT)

  // Земля
  ctx.fillStyle = GROUND_COLOR.value
  ctx.fillRect(0, HEIGHT - GROUND_H.value, WIDTH, GROUND_H.value)

  // Вырезаем дырки
  ctx.save()
  ctx.globalCompositeOperation = 'destination-out'
  holesConfig.value.forEach(h => {
    const sy = HEIGHT - GROUND_H.value + h.startY
    if (h.type === 'down') {
      ctx.clearRect(h.startX, sy, h.width, h.length)
    } else if (h.type === 'left') {
      ctx.clearRect(h.startX - h.length, sy, h.length, h.width)
    }
  })
  ctx.restore()

  // Линия
  ctx.save()
  ctx.translate(state.x, state.y)
  ctx.fillStyle = LINE_COLOR.value
  if (state.phase === 'horizontal' || state.phase === 'idle') {
    ctx.fillRect(0, 0, MOVING_LEN, THICKNESS)
  } else {
    ctx.fillRect(0, 0, THICKNESS, MOVING_LEN)
  }
  ctx.restore()

  // Результат
  if (state.phase === 'ended') {
    ctx.fillStyle = state.win ? 'green' : 'red'
    ctx.font      = '24px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(
      state.win ? 'You Win!' : 'Game Over',
      WIDTH / 2,
      HEIGHT / 2
    )
  }
}

// 11) Инициализация
let ctx: CanvasRenderingContext2D
const canvas = ref<HTMLCanvasElement>()
onMounted(() => {
  ctx = canvas.value!.getContext('2d')!
  reset()
  tick()
})

// Перезапуск при изменении настроек
watch([GROUND_H, holesConfig, clickActions], reset, { deep: true })
</script>
