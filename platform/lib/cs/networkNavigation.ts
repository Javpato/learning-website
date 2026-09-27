export const COURSE_DOCUMENTS = { Intro:18, IP:30, Routage:48, TCP:40 } as const;
export type CourseDocument=keyof typeof COURSE_DOCUMENTS;
export const CHAPTER_IDS=['accueil','introduction','td1','ip','td-ip','routage','annales','cours'] as const;
export function parseWorkshopHash(hash:string){
  const [part,section,page]=hash.replace(/^#/,'').split('/');
  const chapter=CHAPTER_IDS.includes(part as typeof CHAPTER_IDS[number])?part:'accueil';
  if(chapter==='cours'){
    const doc=Object.prototype.hasOwnProperty.call(COURSE_DOCUMENTS,section||'')?section as CourseDocument:'IP';
    return {chapter,section:undefined,doc,page:Math.max(1,Math.min(COURSE_DOCUMENTS[doc],Math.floor(Number(page))||1))};
  }
  return {chapter,section:section&&/^[a-z0-9-]+$/.test(section)?section:undefined,doc:undefined,page:undefined};
}
