import type { BrailleCellData } from './braille'
export type HapticSpeed = 'slow' | 'normal' | 'fast'
export const SLOTS: Record<HapticSpeed, number> = { slow: 220, normal: 150, fast: 90 }
export const CELL_GAP = 180
export function buildPattern(cells: BrailleCellData[], speed: HapticSpeed = 'normal') {
  const slot = SLOTS[speed]
  const segments: { duration:number; vibrate:boolean }[] = []
  const push = (duration:number, vibrate:boolean) => { if (!duration) return; const last=segments.at(-1); if (last && last.vibrate===vibrate) last.duration += duration; else segments.push({duration,vibrate}) }
  cells.forEach((cell,index)=>{ for(let dot=1;dot<=6;dot++){ if(cell.includes(dot)){push(Math.round(slot*.7),true);push(Math.round(slot*.3),false)} else push(slot,false) } if(index<cells.length-1)push(CELL_GAP,false) })
  return segments.map(segment=>segment.duration)
}
export function patternDuration(pattern:number[]){return pattern.reduce((a,b)=>a+b,0)}
export function playPattern(pattern:number[]){if(typeof navigator!=='undefined'&&'vibrate' in navigator)navigator.vibrate(pattern)}
export function stopPattern(){if(typeof navigator!=='undefined'&&'vibrate' in navigator)navigator.vibrate(0)}
export const slotDuration=(speed:HapticSpeed)=>SLOTS[speed]
export function vibrationAvailable(){if(typeof navigator==='undefined')return false;return 'vibrate' in navigator&&(navigator.maxTouchPoints>0||Boolean((navigator as Navigator & {userAgentData?:{mobile?:boolean}}).userAgentData?.mobile))}
