export type Language = 'en' | 'hi' | 'ta'
export type BrailleCellData = number[]
export type BrailleResult = { cells: BrailleCellData[]; skipped: string[] }
const EN: Record<string, number[]> = { a:[1],b:[1,2],c:[1,4],d:[1,4,5],e:[1,5],f:[1,2,4],g:[1,2,4,5],h:[1,2,5],i:[2,4],j:[2,4,5],k:[1,3],l:[1,2,3],m:[1,3,4],n:[1,3,4,5],o:[1,3,5],p:[1,2,3,4],q:[1,2,3,4,5],r:[1,2,3,5],s:[2,3,4],t:[2,3,4,5],u:[1,3,6],v:[1,2,3,6],w:[2,4,5,6],x:[1,3,4,6],y:[1,3,4,5,6],z:[1,3,5,6],',':[2],"'": [3],'.':[2,5,6],'?':[2,3,5,6],'!':[2,3,5],'-':[3,6],' ':[] }
const HI: Record<string, number[]> = { अ:[1],आ:[1,3],इ:[2,4],ई:[2,4,5],उ:[1,3,6],ऊ:[1,2,3,6],ए:[1,5],ऐ:[2,4,6],ओ:[1,3,5],औ:[1,2,3,5],क:[1,3],ङ:[1,2,4,5],च:[1,4],ञ:[2,4,5],ट:[2,3,4],ण:[1,2,4],त:[2,3,4,5],न:[1,3,4,5],प:[1,2,3,4],म:[1,3,4],य:[1,3,4,5,6],र:[1,2,3,5],ल:[1,2,3],व:[1,2,3,6],ज:[2,4,5],ष:[1,3,4,6],स:[2,3,4],ह:[1,2,5],' ':[] }
// TODO: verify Tamil-specific ழ, ள, ற, ன, எ, ஒ, matras, pulli, and conjuncts against the official Bharati chart.
const TA: Record<string, number[]> = { க:HI['क'],ங:HI['ङ'],ச:HI['च'],ஞ:HI['ञ'],ட:HI['ट'],ண:HI['ण'],த:HI['त'],ந:HI['न'],ப:HI['प'],ம:HI['म'],ய:HI['य'],ர:HI['र'],ல:HI['ल'],வ:HI['व'],ஜ:HI['ज'],ஷ:HI['ष'],ஸ:HI['स'],ஹ:HI['ह'],அ:HI['अ'],ஆ:HI['आ'],இ:HI['इ'],ஈ:HI['ई'],உ:HI['उ'],ஊ:HI['ऊ'],ஏ:HI['ए'],ஐ:HI['ऐ'],ஓ:HI['ओ'],ஔ:HI['औ'],' ':[] }
const tables = { en: EN, hi: HI, ta: TA }
export function dotsToUnicode(dots:number[]){return String.fromCodePoint(0x2800+dots.reduce((m,d)=>m|(1<<(d-1)),0))}
export function textToBraille(text:string,lang:Language):BrailleResult{const table=tables[lang],cells:number[][]=[],skipped:string[]=[];for(const char of text.normalize('NFC')){const dots=table[char]??table[char.toLowerCase()];if(dots!==undefined)cells.push([...dots]);else{cells.push([2,3,5,6]);skipped.push(char)}}return{cells,skipped}}
export function brailleToText(cells:number[][],lang:Language){const table=tables[lang];return cells.map(cell=>Object.entries(table).find(([,dots])=>dots.join(',')===[...cell].sort((a,b)=>a-b).join(','))?.[0]??'?').join('')}
export function getBrailleChar(char:string,lang:Language){return tables[lang][char]}
export function brailleToUnicode(cells:number[][]){return cells.map(dotsToUnicode).join('')}
export const englishMap=EN,hindiMap=HI,tamilMap=TA
export const brailleTables=tables
export const mappingForCell=(cell:number[],lang:Language)=>Object.entries(tables[lang]).find(([,dots])=>dots.join(',')===[...cell].sort((a,b)=>a-b).join(','))?.[0]
export const isKnownCell=(cell:number[],lang:Language)=>Boolean(mappingForCell(cell,lang))
export const tableForLanguage=(lang:Language)=>tables[lang]
export const textCells=(text:string,lang:Language)=>textToBraille(text,lang).cells
export const cellsText=(cells:number[][],lang:Language)=>brailleToText(cells,lang)
export const normalizeDots=(dots:Iterable<number>)=>[...new Set(dots)].sort((a,b)=>a-b)
export const emptyCell=()=>[]
export const unknownCell=()=>[2,3,5,6]
export const cellKey=(dots:number[])=>normalizeDots(dots).join(',')
export const supportedLanguages:Language[]=['hi','ta','en']
export const languageLabel=(lang:Language)=>({en:'English',hi:'Hindi',ta:'Tamil'}[lang])
export const textToUnicodeBraille=(text:string,lang:Language)=>brailleToUnicode(textToBraille(text,lang).cells)
export const cellToText=(cell:number[],lang:Language)=>mappingForCell(cell,lang)??'?'
export const cellsToText=(cells:number[][],lang:Language)=>cells.map(c=>cellToText(c,lang)).join('')
export const unicodeToDots=(char:string)=>{const code=char.codePointAt(0);if(code===undefined||code<0x2800||code>0x28ff)return[];const mask=code-0x2800;return[1,2,3,4,5,6].filter(d=>Boolean(mask&(1<<(d-1))))}
export const unicodeToText=(text:string,lang:Language)=>brailleToText([...text].map(unicodeToDots),lang)
export const version='bharati-anchors'
export default textToBraille
