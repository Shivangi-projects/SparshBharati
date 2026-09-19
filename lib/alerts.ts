export type AlertId = 'doorbell' | 'fire' | 'calling' | 'horn'
export type AlertPattern = { label:string; description:string; pattern:number[] }
export const ALERTS: Record<AlertId, AlertPattern> = {
  doorbell:{label:'Doorbell',description:'Two short pulses',pattern:[180,120,180,300]},
  fire:{label:'Fire alarm',description:'Rapid alternating warning',pattern:[420,100,160,100,420,100,160,100]},
  calling:{label:'Someone calling',description:'Three slow pulses',pattern:[300,260,300,260,300,400]},
  horn:{label:'Vehicle horn',description:'One long pulse',pattern:[700,400]},
}
export function pulseCount(pattern:number[]){return pattern.filter((_,index)=>index%2===0).length}
export function patternDuration(pattern:number[]){return pattern.reduce((sum,value)=>sum+value,0)}
export function pulseWidths(pattern:number[]){return pattern.map(duration=>({duration,ratio:duration/patternDuration(pattern)}))}
