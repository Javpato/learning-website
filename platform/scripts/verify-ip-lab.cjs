const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const build = process.env.RESEAUX_BUILD;
const {COURSE_ROUTES,TD_ROUTES,matchingRoutes,deliveryEvents,safeFragments,probeResult,sameSubnet}=require(path.join(build,'ipLab.js'));
const {fragmentChain,parseIp,subnetInfo,formatIp}=require(path.join(build,'ipv4.js'));
const {parseWorkshopHash}=require(path.join(build,'networkNavigation.js'));
const {IP_EXAMS}=require(path.join(build,'ipExamContent.js'));
assert.deepEqual(matchingRoutes('193.52.71.8',COURSE_ROUTES),[1,3]);
assert.deepEqual(matchingRoutes('193.52.72.7',COURSE_ROUTES),[0,3]);
assert.deepEqual(matchingRoutes('8.8.8.8',COURSE_ROUTES),[3]);
assert.deepEqual(matchingRoutes('40.0.0.1',TD_ROUTES),[3]);
assert.deepEqual(matchingRoutes('50.0.0.1',TD_ROUTES),[]);
assert.deepEqual(matchingRoutes('999.0.0.1',COURSE_ROUTES),[]);
assert.deepEqual(matchingRoutes('193.52.71.8',[...COURSE_ROUTES,{network:'193.52.71.8',prefix:32,via:null,iface:'test'}]),[4,1,3]);
assert(sameSubnet('137.10.45.1','137.10.45.126',25));
assert(!sameSubnet('137.10.45.126','137.10.45.200',25));
assert.equal(deliveryEvents(false,false).length,3);
assert.equal(deliveryEvents(false,true).length,1);
assert.equal(deliveryEvents(true,true)[0].to,'Passerelle R');
assert.equal(deliveryEvents(true,false).at(-1).to,'B');
assert.equal(probeResult(3).type,11);
assert.equal(probeResult(4).type,0);
assert.equal(probeResult(2,3,2).reply,false);
assert.equal(probeResult(0),null);
assert.equal(safeFragments(200,[20]),null);
assert.equal(safeFragments(200,[27]),null);
assert.equal(safeFragments(200.5,[1500]),null);
assert.throws(()=>fragmentChain(200,[20]),RangeError);
assert.deepEqual(safeFragments(1400,[620])[1].map(f=>[f.totalLength,f.mf,f.offsetUnits]),[[620,1,0],[620,1,75],[220,0,150]]);
// Final exam includes frame headers in MTU: convert to IP MTU before calculation.
const final=fragmentChain(2048,[2148-12,1024-14,512-8]).at(-1);
assert.deepEqual(final.map(f=>[f.totalLength,f.mf,f.offsetUnits]),[[500,1,0],[500,1,60],[44,1,120],[500,1,123],[500,1,183],[44,1,243],[100,0,246]]);
assert.equal(final.reduce((n,f)=>n+f.dataLength,0),2048);
for(const [ip,prefix,network,broadcast] of [['166.113.166.132',25,'166.113.166.128','166.113.166.255'],['132.214.55.46',27,'132.214.55.32','132.214.55.63'],['152.214.14.149',28,'152.214.14.144','152.214.14.159']]){
 const n=subnetInfo(parseIp(ip),prefix);assert.equal(formatIp(n.network),network);assert.equal(formatIp(n.broadcast),broadcast);
}
assert.deepEqual(parseWorkshopHash('#cours/IP/999'),{chapter:'cours',section:undefined,doc:'IP',page:30});
assert.equal(parseWorkshopHash('#cours/Unknown/0').doc,'IP');
assert.equal(parseWorkshopHash('#td-ip/ip-td-12').section,'ip-td-12');
assert.equal(parseWorkshopHash('#bad/%zz').chapter,'accueil');
assert.equal(parseWorkshopHash('#ip/ip-subnet').section,'ip-subnet');
const root=path.join(__dirname,'..','public','reseaux','annales');
assert.equal(IP_EXAMS.length,8);
for(const ex of IP_EXAMS){
 assert(ex.statement.length>50&&ex.solution.length>=3);
 for(const page of ex.pages)assert(fs.existsSync(path.join(root,ex.asset,`${page}.webp`)),`${ex.id} page ${page}`);
 if(ex.pdf)assert(fs.existsSync(path.join(root,ex.pdf)));
 if(ex.correction)for(const page of ex.correction.pages)assert(fs.existsSync(path.join(root,ex.correction.asset,`${page}.webp`)));
}
console.log('IP lab: forwarding, ARP, TTL, fragmentation, annales and navigation passed.');
