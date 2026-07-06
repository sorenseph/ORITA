<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useWindowSize, usePreferredReducedMotion } from '@vueuse/core'
import { useThemeStore } from '../../stores/theme'
import { getAtmosphere } from '../../data/atmosphere'
import { hexToGlsl, lerpColor } from '../../utils/color'
import { useMouseDepth } from '../../composables/useMouseDepth'
import gsap from 'gsap'

const canvasRef = ref(null)
const theme = useThemeStore()
const { activeFlavor } = storeToRefs(theme)
const { width, height } = useWindowSize()
const { mx, my } = useMouseDepth()
const reduced = usePreferredReducedMotion()

let gl = null
let program = null
let animationId = null
let startTime = performance.now()
let currentColors = getAtmosphere(activeFlavor.value.id).gradient.slice()
let targetColors = currentColors.slice()

const VERT = `
  attribute vec2 a_pos;
  void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

const FRAG = `
  precision mediump float;
  uniform float u_time;
  uniform vec2 u_res;
  uniform vec2 u_mouse;
  uniform vec3 u_c0;
  uniform vec3 u_c1;
  uniform vec3 u_c2;
  uniform vec3 u_c3;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.1;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_res;
    vec2 p = uv * 2.0 - 1.0;
    p.x *= u_res.x / u_res.y;

    float t = u_time * 0.06;
    float n = fbm(p * 1.4 + vec2(t, t * 0.7) + u_mouse * 0.08);
    float n2 = fbm(p * 2.2 - vec2(t * 0.5, t * 0.3));
    float wave = sin(p.x * 2.5 + t * 2.0 + n * 3.0) * 0.04;

    float blend = uv.y + n * 0.22 + n2 * 0.12 + wave + sin(t + uv.x) * 0.03;
    vec3 col = mix(u_c0, u_c1, smoothstep(0.0, 0.45, blend));
    col = mix(col, u_c2, smoothstep(0.35, 0.72, blend));
    col = mix(col, u_c3, smoothstep(0.65, 1.0, blend));

    float vignette = 1.0 - dot(uv - 0.5, uv - 0.5) * 0.6;
    gl_FragColor = vec4(col * vignette, 1.0);
  }
`

function compile(type, src) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  return shader
}

function initGl() {
  const canvas = canvasRef.value
  if (!canvas) return

  gl = canvas.getContext('webgl', { alpha: false, antialias: false })
  if (!gl) return

  const vs = compile(gl.VERTEX_SHADER, VERT)
  const fs = compile(gl.FRAGMENT_SHADER, FRAG)
  program = gl.createProgram()
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)

  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)

  const loc = gl.getAttribLocation(program, 'a_pos')
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

  resize()
  animate()
}

function resize() {
  const canvas = canvasRef.value
  if (!canvas || !gl) return
  const dpr = Math.min(devicePixelRatio, reduced.value ? 1 : 1.5)
  canvas.width = canvas.offsetWidth * dpr
  canvas.height = canvas.offsetHeight * dpr
  gl.viewport(0, 0, canvas.width, canvas.height)
}

function setUniforms(t) {
  const g = currentColors.map(hexToGlsl)
  gl.uniform1f(gl.getUniformLocation(program, 'u_time'), t)
  gl.uniform2f(gl.getUniformLocation(program, 'u_res'), canvasRef.value.width, canvasRef.value.height)
  gl.uniform2f(gl.getUniformLocation(program, 'u_mouse'), mx.value * 0.5, -my.value * 0.5)
  gl.uniform3fv(gl.getUniformLocation(program, 'u_c0'), g[0])
  gl.uniform3fv(gl.getUniformLocation(program, 'u_c1'), g[1])
  gl.uniform3fv(gl.getUniformLocation(program, 'u_c2'), g[2])
  gl.uniform3fv(gl.getUniformLocation(program, 'u_c3'), g[3])
}

function animate() {
  if (!gl || !program) return
  animationId = requestAnimationFrame(animate)

  const t = (performance.now() - startTime) * 0.001
  gl.useProgram(program)
  setUniforms(t)
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}

function transitionColors(nextGradient) {
  targetColors = nextGradient.slice()
  const from = currentColors.slice()
  const proxy = { p: 0 }
  gsap.to(proxy, {
    p: 1,
    duration: 2.2,
    ease: 'power2.inOut',
    onUpdate: () => {
      currentColors = from.map((c, i) => lerpColor(c, targetColors[i], proxy.p))
    },
    onComplete: () => { currentColors = targetColors.slice() },
  })
}

watch(activeFlavor, (f) => {
  transitionColors(getAtmosphere(f.id).gradient)
})

watch([width, height], resize)

onMounted(initGl)
onUnmounted(() => {
  cancelAnimationFrame(animationId)
  gl = null
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="atmosphere-bg pointer-events-none absolute inset-0 h-full w-full"
    aria-hidden="true"
  />
</template>
