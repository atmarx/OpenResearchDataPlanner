/* ===================================================================
   useSkin.js — ODP skin engine, ported from Root Cellar's ns-look.

   A "skin" is a design.md token block ({colors, typography, rounded}).
   deriveSkin() maps it onto the SKINNABLE semantic tokens declared in
   main.css (@theme + :root.dark) — and NEVER onto the tier colours,
   which the platform owns. The deployment ships an institutional
   default; any user can drag-and-drop their own token block onto the
   page to re-skin live, persisted to their browser.

   Theme (light/dark) is owned by preferencesStore (.dark on <html>);
   this engine owns only the skin (data-skin on <html>). They compose:
     :root[data-skin="drexel"]        -> light skin tokens
     :root[data-skin="drexel"].dark   -> dark skin tokens
   =================================================================== */
import { ref } from 'vue'

const LS_SKIN = 'odp-skin'
const LS_CUSTOM = 'odp-skin-custom'
const DEFAULT_BASE = 'default'

/* ---- tiny hex colour kit (verbatim from ns-look) ---- */
function _hx(h) {
  h = h.replace('#', '')
  if (h.length === 3) h = h.split('').map(c => c + c).join('')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}
function _rgb(a) {
  return '#' + a.map(n => {
    n = Math.max(0, Math.min(255, Math.round(n)))
    const s = n.toString(16)
    return s.length < 2 ? '0' + s : s
  }).join('')
}
function _mix(a, b, t) {
  const A = _hx(a), B = _hx(b)
  return _rgb([0, 1, 2].map(i => A[i] + (B[i] - A[i]) * t))
}
function _rgba(h, al) { const a = _hx(h); return `rgba(${a[0]},${a[1]},${a[2]},${al})` }
function _lum(h) {
  const a = _hx(h).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4) })
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]
}
function _cr(a, b) { const l1 = _lum(a), l2 = _lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05) }
/* darken an accent until its text colour clears WCAG 4.5:1 */
function _btnFill(accent, ink) {
  let f = accent, t = 0
  while (_cr(ink, f) < 4.5 && t < 0.6) { t += 0.04; f = _mix(accent, '#000000', t) }
  return f
}

/* ---- map a design.md token block -> ODP semantic vars (light + dark) ---- */
function deriveSkin(tok) {
  const c = tok.colors || {}, ty = tok.typography || {}, rd = tok.rounded || {}
  const ink = c.primary || '#111827'        // text / heading colour
  const secondary = c.secondary || '#6b7280'
  const accent = c.tertiary || '#2563eb'    // the single interaction accent
  const canvas = c.neutral || '#f9fafb'     // page background
  const surface = c.surface || '#ffffff'    // card / panel
  const onAcc = c['on-primary'] || '#ffffff'
  const sans = (ty.body && ty.body.fontFamily) || (ty.h1 && ty.h1.fontFamily) || 'Inter'

  const light = {
    '--color-primary': accent,
    '--color-on-primary': onAcc,
    '--color-canvas': canvas,
    '--color-surface': surface,
    '--color-surface-alt': _mix(canvas, ink, 0.05),
    '--color-text': ink,
    '--color-text-secondary': _mix(ink, surface, 0.25),
    '--color-text-muted': secondary,
    '--color-border': _mix(secondary, surface, 0.55),
    '--color-border-strong': _mix(secondary, surface, 0.35),
    // radius + font ride in the base (light) block so they apply in both themes
    '--radius-sm': (rd.sm != null ? rd.sm : 2) + 'px',
    '--radius-md': (rd.md != null ? rd.md : 4) + 'px',
    '--radius-lg': (rd.lg != null ? rd.lg : 6) + 'px',
    '--radius-xl': (rd.xl != null ? rd.xl : (rd.lg != null ? rd.lg + 2 : 8)) + 'px',
    '--font-sans': `'${sans}', system-ui, -apple-system, sans-serif`
  }
  const dPanel = _mix(ink, '#ffffff', 0.06)
  const dark = {
    '--color-primary': _mix(accent, '#ffffff', 0.15),
    '--color-on-primary': onAcc,
    '--color-canvas': _mix(ink, '#000000', 0.25),
    '--color-surface': dPanel,
    '--color-surface-alt': _mix(ink, '#ffffff', 0.11),
    '--color-text': _mix(surface, '#ffffff', 0.20),
    '--color-text-secondary': _mix(secondary, surface, 0.20),
    '--color-text-muted': secondary,
    '--color-border': _mix(ink, '#ffffff', 0.17),
    '--color-border-strong': _mix(ink, '#ffffff', 0.24)
  }
  return { light, dark, fonts: [sans], _btnFill: _btnFill(accent, onAcc) }
}

/* ---- registry: the built-in skins are themselves design.md token blocks ----
   default = base ODP look (no data-skin; uses @theme + :root.dark as written).
   northwinds = the demo sandbox (cool academic slate-blue).
   drexel = the production environment (Drexel navy + gold — Go Dragons).
   highcontrast = WCAG AAA. */
const SKINS = {
  default: { label: 'ODP (default)', base: true },
  northwinds: {
    label: 'Northwinds U · demo sandbox',
    tokens: {
      colors: { primary: '#1e293b', secondary: '#64748b', tertiary: '#2563eb', neutral: '#f1f5f9', surface: '#ffffff', 'on-primary': '#ffffff' },
      typography: { body: { fontFamily: 'Inter' } },
      rounded: { sm: 2, md: 4, lg: 6, xl: 8 }
    }
  },
  drexel: {
    label: 'Drexel · Go Dragons',
    tokens: {
      colors: { primary: '#07294D', secondary: '#5b6b7f', tertiary: '#07294D', neutral: '#f7f8fa', surface: '#ffffff', 'on-primary': '#FFC600' },
      typography: { body: { fontFamily: 'Inter' } },
      rounded: { sm: 2, md: 3, lg: 4, xl: 6 }
    },
    /* gold is Drexel's signal colour: active nav + focus ring wear it,
       while text/buttons stay navy for contrast. */
    extraCss:
      ':root[data-skin="drexel"]{--color-accent-gold:#FFC600}\n' +
      ':root[data-skin="drexel"] *:focus-visible{outline-color:#FFC600}'
  },
  highcontrast: {
    label: 'High Contrast · WCAG AAA',
    tokens: {
      colors: { primary: '#000000', secondary: '#1a1a1a', tertiary: '#0b3d91', neutral: '#ffffff', surface: '#ffffff', 'on-primary': '#ffffff' },
      typography: { body: { fontFamily: 'system-ui' } },
      rounded: { sm: 0, md: 2, lg: 2, xl: 2 }
    },
    extraCss:
      ':root[data-skin="highcontrast"]{--color-border:#000;--color-border-strong:#000;--color-text-secondary:#000;--color-text-muted:#1a1a1a}\n' +
      ':root[data-skin="highcontrast"].dark{--color-canvas:#000;--color-surface:#000;--color-surface-alt:#000;--color-border:#fff;--color-border-strong:#fff;--color-text:#fff;--color-text-secondary:#fff;--color-text-muted:#eaeaea;--color-primary:#ffae42}\n' +
      ':root[data-skin="highcontrast"] a{text-decoration:underline}\n' +
      ':root[data-skin="highcontrast"] *:focus-visible{outline-width:3px}'
  }
}

/* ---- emission ---- */
function _emit(vars) { return Object.keys(vars).map(k => `${k}:${vars[k]}`).join(';') }
function _skinCss(name, skin) {
  const d = deriveSkin(skin.tokens)
  const sel = `:root[data-skin="${name}"]`
  let css =
    `${sel}{${_emit(d.light)}}\n` +
    `${sel}.dark{${_emit(d.dark)}}`
  if (skin.extraCss) css += '\n' + skin.extraCss
  return { css, fonts: d.fonts }
}
function _loadFonts(fams) {
  fams.forEach(f => {
    if (!f || /system-ui|ui-monospace|serif|sans-serif|monospace/i.test(f)) return
    const id = 'odpfont-' + f.replace(/\W+/g, '-')
    if (document.getElementById(id)) return
    const l = document.createElement('link')
    l.id = id; l.rel = 'stylesheet'
    l.href = 'https://fonts.googleapis.com/css2?family=' + encodeURIComponent(f).replace(/%20/g, '+') + ':wght@400;500;600;700&display=swap'
    document.head.appendChild(l)
  })
}
function _ensureSkinCss(name) {
  const sid = 'odp-skincss-' + name
  if (document.getElementById(sid)) return
  const skin = SKINS[name]
  if (!skin || skin.base || !skin.tokens) return
  const out = _skinCss(name, skin)
  const st = document.createElement('style')
  st.id = sid; st.textContent = out.css
  document.head.appendChild(st)
  _loadFonts(out.fonts)
}

/* ---- reactive state for the picker ---- */
const currentSkin = ref(DEFAULT_BASE)
const skinList = ref(_buildList())
function _buildList() {
  return Object.keys(SKINS).map(k => ({ value: k, label: SKINS[k].label }))
}

/* ---- apply ---- */
function applySkin(name) {
  if (!SKINS[name]) name = DEFAULT_BASE
  if (SKINS[name].base) {
    document.documentElement.removeAttribute('data-skin')
  } else {
    _ensureSkinCss(name)
    document.documentElement.setAttribute('data-skin', name)
  }
  currentSkin.value = name
  try { localStorage.setItem(LS_SKIN, name) } catch (e) { /* private mode */ }
}

/* ---- "bring your own" drag-drop path ---- */
function applyTokens(tok, label) {
  if (!tok || typeof tok !== 'object' || !tok.colors) {
    _toast('That doesn’t look like a design.md token block (no colors).', 'bad')
    return false
  }
  SKINS.custom = { label: label || 'Custom (yours)', tokens: tok, _custom: true }
  document.getElementById('odp-skincss-custom')?.remove()  // rebuild on every drop
  const out = _skinCss('custom', SKINS.custom)
  const st = document.createElement('style')
  st.id = 'odp-skincss-custom'; st.textContent = out.css
  document.head.appendChild(st)
  _loadFonts(out.fonts)
  document.documentElement.setAttribute('data-skin', 'custom')
  currentSkin.value = 'custom'
  skinList.value = _buildList()
  try {
    localStorage.setItem(LS_SKIN, 'custom')
    localStorage.setItem(LS_CUSTOM, JSON.stringify(tok))
  } catch (e) { /* private mode */ }
  _toast('Re-skinned to ' + SKINS.custom.label + ' — saved to this browser.', 'good')
  return true
}
function _parseTokens(text) {
  try { return JSON.parse(text) } catch (e) { /* not raw json */ }
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/)   // fenced block in a .md
  if (fence) { try { return JSON.parse(fence[1]) } catch (e) { /* */ } }
  const brace = text.match(/\{[\s\S]*\}/)                     // first object literal
  if (brace) { try { return JSON.parse(brace[0]) } catch (e) { /* */ } }
  return null
}

/* ---- minimal self-contained toast ---- */
let _toastT = null
function _toast(msg, kind) {
  const t = document.createElement('div')
  t.className = 'odp-toast' + (kind ? ' ' + kind : '')
  t.textContent = msg
  Object.assign(t.style, {
    position: 'fixed', bottom: '22px', left: '50%', transform: 'translateX(-50%)',
    zIndex: '9999', padding: '11px 18px', borderRadius: 'var(--radius-lg, 8px)',
    background: 'var(--color-surface,#fff)', color: 'var(--color-text,#111)',
    border: '1px solid var(--color-border,#e5e7eb)', font: '13px var(--font-sans, system-ui)',
    boxShadow: '0 12px 34px rgba(0,0,0,.25)', maxWidth: '80vw'
  })
  if (kind === 'bad') { t.style.borderColor = '#ef4444'; t.style.color = '#b23a22' }
  if (kind === 'good') { t.style.borderColor = '#22c55e' }
  document.body.appendChild(t)
  clearTimeout(_toastT)
  _toastT = setTimeout(() => t.remove(), 4600)
}

/* ---- global drag-and-drop: a token block dropped anywhere re-skins ---- */
let _dropWired = false
function _hasFiles(e) { return e.dataTransfer && Array.prototype.indexOf.call(e.dataTransfer.types || [], 'Files') > -1 }
function _wireDrop() {
  if (_dropWired) return
  _dropWired = true
  let depth = 0
  const armed = document.createElement('div')
  armed.id = 'odp-drop-armed'
  Object.assign(armed.style, {
    position: 'fixed', inset: '0', zIndex: '9998', display: 'none',
    alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
    background: 'rgba(15,20,32,.55)', border: '3px dashed var(--color-primary,#2563eb)',
    color: '#fff', font: '600 18px var(--font-sans, system-ui)'
  })
  armed.textContent = '⊞  drop a design.md token block to re-skin'
  window.addEventListener('dragenter', e => { if (!_hasFiles(e)) return; depth++; armed.style.display = 'flex'; if (!armed.parentNode) document.body.appendChild(armed) })
  window.addEventListener('dragover', e => { if (_hasFiles(e)) e.preventDefault() })
  window.addEventListener('dragleave', e => { if (!_hasFiles(e)) return; depth = Math.max(0, depth - 1); if (depth === 0) armed.style.display = 'none' })
  window.addEventListener('drop', e => {
    if (!_hasFiles(e)) return
    e.preventDefault(); depth = 0; armed.style.display = 'none'
    const f = e.dataTransfer.files[0]; if (!f) return
    const rd = new FileReader()
    rd.onload = () => {
      const tok = _parseTokens(String(rd.result || ''))
      if (tok) applyTokens(tok, 'Custom · ' + f.name.replace(/\.[^.]+$/, ''))
      else _toast('Couldn’t read a token block out of ' + f.name + '.', 'bad')
    }
    rd.readAsText(f)
  })
}

/* ---- boot: call once after config loads, passing the fork's default ---- */
export function initSkin(institutionalDefault) {
  let saved = null, savedCustom = null
  try { saved = localStorage.getItem(LS_SKIN); savedCustom = localStorage.getItem(LS_CUSTOM) } catch (e) { /* */ }
  if (saved === 'custom' && savedCustom) {
    try { applyTokens(JSON.parse(savedCustom), 'Custom (yours)') }
    catch (e) { applySkin(institutionalDefault || DEFAULT_BASE) }
  } else {
    applySkin(saved || institutionalDefault || DEFAULT_BASE)
  }
  _wireDrop()
}

/* ---- composable for components (the picker) ---- */
export function useSkin() {
  return { currentSkin, skinList, applySkin, applyTokens }
}
