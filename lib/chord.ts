export class ChordEngine {
  pressed = new Set<number>()
  chord = new Set<number>()
  down(id: number, dot: number) { if (this.pressed.has(id)) return null; this.pressed.add(id); this.chord.add(dot); return null }
  up(id: number) { this.pressed.delete(id); if (this.pressed.size === 0 && this.chord.size > 0) { const cell = [...this.chord].sort((a,b)=>a-b); this.chord.clear(); return cell } return null }
  cancel(id: number) { this.pressed.delete(id); this.chord.clear(); return null }
  reset() { this.pressed.clear(); this.chord.clear() }
}
export const KEY_DOTS: Record<string, number> = { KeyF:1, KeyD:2, KeyS:3, KeyJ:4, KeyK:5, KeyL:6 }
export const DOT_KEYS = [1,2,3,4,5,6]
export function cellFromDots(dots: Iterable<number>) { return [...new Set(dots)].sort((a,b)=>a-b) }
export function createChordEngine() { return new ChordEngine() }
