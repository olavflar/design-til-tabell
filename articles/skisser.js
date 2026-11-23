// Skisser for mønsterartikkelen «Strukturerte data på små skjermer».
// Brukes både av artikkelen (i nettleseren) og av eksporter-skisser.mjs (Node), som lager PNG-filer.
(function (root) {
  const esc = t => String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;');
  const r = (x,y,w,h,c,rx=0) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" class="${c}"/>`;
  const t = (x,y,s,c='',size=8,anchor='start') => `<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" class="${c}">${esc(s)}</text>`;
  const ln = (x1,y1,x2,y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="wf-line"/>`;
  const svg = (w,h,inner,label) => `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}">${inner}</svg>`;
  const chevDown = (x,y) => `<polyline points="${x},${y} ${x+3},${y+3} ${x+6},${y}" class="wf-chev"/>`;

  // Stor skjerm: side med søk og tabell
  function desk({heads, rows, rowH=26, title='[Objekttype]', search=true, cell, rowClass, label}) {
    const W=340, x0=14, tw=W-28, cw=tw/heads.length;
    let y = 22, s = '';
    s += t(x0,y,title,'b',12); y += 10;
    if (search){ s += t(x0,y+6,'Søk','',6) + r(x0,y+9,110,16,'wf-field'); y += 32; }
    heads.forEach((h,c)=> s += t(x0+6+c*cw, y+8, h, 'b', 7));
    y += 13;
    s += r(x0,y,tw,rowH*rows,'wf-box');
    for (let i=0;i<rows;i++){
      const yy = y+i*rowH;
      if (rowClass && rowClass(i)) s += r(x0,yy,tw,rowH,rowClass(i));
      heads.forEach((h,c)=> s += cell(i,c,x0+6+c*cw,yy+rowH/2+3,cw));
      if (i) s += ln(x0,yy,x0+tw,yy);
    }
    const H = y+rowH*rows+14;
    return svg(W,H, r(1,1,W-2,H-2,'wf-bg') + s, label);
  }
  const genericCell = (i,c,x,y) => i===0
    ? t(x,y, c===0?'[Objektnavn]':['','Bittelitt meta','Mer meta','Enda mer meta','Og mer!'][c], c===0?'u':'', 7)
    : (c===0 ? t(x,y,'[Objektnavn]','u',7) : '');

  // Telefon
  function phone(inner, label, defs='') {
    const id = 'c'+Math.random().toString(36).slice(2,8);
    return svg(160,290,
      `<defs><clipPath id="${id}"><rect x="2" y="2" width="156" height="286"/></clipPath>${defs}</defs>`
      + r(1,1,158,288,'wf-bg') + `<g clip-path="url(#${id})">${inner}</g>`, label);
  }
  const pageHead = (title='[Objekttype]', search=true) => {
    let s = t(10,22,title,'b',11);
    if (search) s += t(10,36,'Søk','',6) + r(10,39,140,16,'wf-field');
    return s;
  };

  function stacked(n, tap=-1) {
    let s = pageHead();
    const y0 = 64;
    s += r(10,y0,140,n*38,'wf-box');
    for (let i=0;i<n;i++){
      const y = y0+i*38;
      if (i===tap) s += r(10,y,140,38,'wf-lock');
      s += t(16,y+15,'[Objektnavn]','u b',8.5) + t(144,y+15,'Meta 1','',7,'end');
      s += t(16,y+29,'Meta 2 · Meta 3','m',6.5);
      s += r(114,y+21,30,11,'wf-pill',5.5) + t(129,y+29,'Status','',6,'middle');
      if (i) s += ln(10,y,150,y);
      if (i===tap) s += `<circle cx="96" cy="${y+19}" r="9" fill="var(--anno)" opacity=".25"/><circle cx="96" cy="${y+19}" r="3.5" fill="var(--anno)"/>`;
    }
    return s;
  }

  const sketches = {
    'desk-cases': () => desk({heads:['Navn','Meta 1','Meta 2','Meta 3','Status'], rows:5, cell:(i,c,x,y)=> c===4 ? r(x,y-8,28,11,'wf-pill',5.5)+t(x+14,y,'Status','',6,'middle') : genericCell(i,c,x,y), label:'Oversiktsside med søk og tabell med fem kolonner'}),
    'phone-stacked': () => phone(stacked(5), 'Stablet liste på mobil: objektnavn og meta 1 øverst, meta 2 og 3 og status nederst'),
    'phone-stacked-tap': () => phone(stacked(5,1), 'Brukeren trykker på objektnavnet i listen'),
    'phone-detail': () => {
      let s = t(10,20,'← [Objekttype]','u',7) + t(10,44,'[Objektnavn]','b',15);
      s += r(10,56,64,12,'wf-pill',6) + t(42,64.5,'Status','',6.5,'middle');
      [[78,4],[166,3]].forEach(([y,n])=>{
        s += r(10,y,140,n*20,'wf-box',8);
        for (let i=0;i<n;i++){ const yy=y+i*20; s += t(18,yy+13,'Label','m',7.5) + t(142,yy+13,'Verdi','b',7.5,'end'); if(i) s += ln(10,yy,150,yy); }
      });
      s += r(10,238,66,18,'wf-btn-p',3) + t(43,250,'Endre','inv',7,'middle') + r(82,238,68,18,'wf-btn',3) + t(116,250,'Slett','',7,'middle');
      return phone(s,'Detaljside: objektnavn, status, etikett og verdi i grupper, knapper nederst');
    },
    'phone-keyvalue': () => {
      let s = pageHead('[Objekttype]', false);
      [34,138].forEach(y=>{
        s += r(10,y,140,96,'wf-box',8) + t(18,y+15,'[Objektnavn]','u b',8.5) + ln(10,y+22,150,y+22);
        ['Meta 1','Meta 2','Meta 3','Meta 4'].forEach((m,i)=>{ const yy=y+22+i*18.5; s += t(18,yy+12.5,m,'m',7.5) + t(142,yy+12.5,['Bittelitt meta','Mer meta','Enda mer meta','Og mer!'][i],'b',7.5,'end'); if(i) s += ln(10,yy,150,yy); });
      });
      return phone(s,'Kort med objektnavn øverst og fire rader med etikett og verdi');
    },
    'phone-keyvalue-compact': () => {
      let s = pageHead('[Objekttype]', false);
      [34,104,174].forEach(y=>{
        s += r(10,y,140,62,'wf-box',8) + t(18,y+15,'[Objektnavn]','u b',8.5) + ln(10,y+22,150,y+22);
        s += t(18,y+34,'Meta 1','m',6) + t(18,y+42,'Bittelitt meta','b',7) + t(84,y+34,'Meta 2','m',6) + t(84,y+42,'Mer meta','b',7);
        s += t(18,y+52,'Meta 3: Enda mer meta','',6.5);
      });
      return phone(s,'Mer kompakte kort der etikett og verdi står i to kolonner');
    },
    'desk-stats': () => desk({heads:['Fylke','2019','2020','2021','2022','2023','2024'], rows:6, rowH:20, title:'[Statistikk]', search:false,
      cell:(i,c,x,y)=> t(x,y, c===0?'[Rad '+(i+1)+']':String(1000+((i*37+c*91)%900)), c===0?'b':'', 7), label:'Statistikktabell med sju kolonner på stor skjerm'}),
    'phone-scroll': () => {
      const defs = `<linearGradient id="wffade" x1="0" x2="1"><stop offset="0" class="wf-fade-a"/><stop offset="1" class="wf-fade-b"/></linearGradient>`;
      let s = pageHead('[Statistikk]', false);
      const y0=34, rh=20, c0=46, cw=34, rows=9, H=20+rows*rh;
      s += r(10,y0,170,H,'wf-box') + r(10,y0,170,20,'wf-lock') + r(10,y0,c0,H,'wf-lock');
      s += t(16,y0+13,'Fylke','b',7);
      ['2019','2020','2021','2022'].forEach((h,c)=> s += t(10+c0+6+c*cw,y0+13,h,'b',7));
      for (let i=0;i<rows;i++){ const y=y0+20+i*rh;
        s += t(16,y+13,'[Rad '+(i+1)+']','b',6.5);
        for (let c=0;c<4;c++) s += t(10+c0+6+c*cw,y+13,String(1000+((i*37+c*91)%900)),'',7);
        s += ln(10,y,180,y);
      }
      s += `<line x1="${10+c0}" y1="${y0}" x2="${10+c0}" y2="${y0+H}" class="wf-line" style="stroke-width:2"/>`;
      s += `<rect x="118" y="${y0}" width="40" height="${H}" fill="url(#wffade)"/>`;
      s += `<path d="M120 ${y0+H+18} h28 m-6 -5 l6 5 l-6 5" class="wf-anno-stroke"/>` + t(116,y0+H+21,'ruller','anno',7,'end');
      return phone(s,'Tabell på mobil med fast første kolonne og overskriftsrad. Resten ruller sideveis', defs);
    },
    'desk-compare': () => desk({heads:['Alternativ','Egensk. 1','Egensk. 2','Egensk. 3','Egensk. 4','Egensk. 5'], rows:3, rowH:28, title:'[Sammenligning]', search:false,
      cell:(i,c,x,y)=> t(x,y, c===0?'[Alternativ '+'ABC'[i]+']':'Verdi', c===0?'b':'', 7), label:'Tre alternativer som rader og mange egenskaper som kolonner'}),
    'phone-transposed': () => {
      let s = pageHead('[Sammenligning]', false);
      const y0=34;
      [[62,'Alt. A'],[106,'Alt. B']].forEach(([x,l])=>{ s += r(x,y0,42,16,'wf-field',2) + t(x+4,y0+11,l,'b',7) + chevDown(x+33,y0+6); });
      s += r(10,y0+22,140,9*21,'wf-box');
      for (let i=0;i<9;i++){ const y=y0+22+i*21;
        s += t(16,y+14,'Egenskap '+(i+1),'m',6.5) + t(66,y+14,'Verdi','b',7) + t(110,y+14,'Verdi','b',7);
        if (i) s += ln(10,y,150,y);
      }
      s += `<line x1="58" y1="${y0+22}" x2="58" y2="${y0+22+9*21}" class="wf-line"/><line x1="104" y1="${y0+22}" x2="104" y2="${y0+22+9*21}" class="wf-line"/>`;
      return phone(s,'Snudd tabell: egenskaper nedover, to alternativer side om side med en velger øverst i hver kolonne');
    },
    'desk-costs': () => desk({heads:['Kostnad','Kategori','Beløp','',''], rows:4, title:'[Søknad, steg 2]', search:false,
      rowClass:i=> i===1 ? 'wf-err' : '',
      cell:(i,c,x,y)=> c===0 ? t(x,y,'[Kostnad '+(i+1)+']','b',7) : c===1 ? t(x,y,'Meta','',7) : c===2 ? t(x,y, i===1?'Mangler':'kr 0 000', i===1?'err':'',7) : c===3 ? r(x,y-9,38,13,'wf-btn',2)+t(x+19,y,'Endre','',6.5,'middle') : r(x-20,y-9,34,13,'wf-btn',2)+t(x-3,y,'Slett','',6.5,'middle'),
      label:'Tabell med kostnader og knapper for å endre og slette på hver rad. Én rad har feil'}),
    'phone-cards': () => {
      let s = pageHead('[Søknad, steg 2]', false);
      [[32,false],[100,true],[178,false]].forEach(([y,err],k)=>{
        const h = err ? 72 : 62;
        s += r(10,y,140,h, err?'wf-err':'wf-box',6);
        s += t(18,y+15,'[Kostnad '+(k+1)+']','b',8.5) + t(142,y+15, err?'':'kr 0 000','b',8,'end');
        s += t(18,y+27,'Meta','m',6.5);
        let yb = y+34;
        if (err){ s += t(18,y+40,'⚠ Fyll inn beløp','err',7); yb = y+44; }
        s += `<line x1="10" y1="${yb}" x2="150" y2="${yb}" class="wf-line"/>`;
        s += r(18,yb+6,56,16,'wf-btn',3) + t(46,yb+17,'Endre','',7,'middle') + r(80,yb+6,56,16,'wf-btn',3) + t(108,yb+17,'Slett','',7,'middle');
      });
      s += r(10,252,140,20,'wf-btn-p',3) + t(80,265,'Neste steg','inv',8,'middle');
      return phone(s,'Kort med Endre og Slett nederst i hvert kort. Ett kort er rødt og har en feiltekst');
    },
    'phone-shrunk': () => {
      let s = t(10,22,'[Objekttype]','b',11);
      const cols=8, rows=20, cw=140/cols;
      s += r(10,30,140,8+rows*9,'wf-box');
      for (let c=0;c<cols;c++) s += t(12+c*cw,36,'Kolonne','b',3);
      for (let i=0;i<rows;i++){ const y=38+i*9;
        for (let c=0;c<cols;c++) s += t(12+c*cw,y+6, c===0?'[Objektnavn]':'Verdi', '', 3);
        s += ln(10,y,150,y);
      }
      s += `<path d="M112 230 l22 22 M134 230 l-22 22" class="wf-x"/>`;
      return phone(s,'Feil: en tabell med åtte kolonner krympet til mobilbredde, med uleselig liten tekst');
    },
    'phone-trend': () => {
      let s = pageHead('[Statistikk]', false);
      [[32,'Nøkkeltall 1','12 480','▲ 4,2 %',[50,46,48,40,42,34,30,26]],[110,'Nøkkeltall 2','3 915','▼ 1,8 %',[30,34,32,38,36,42,44,48]],[188,'Nøkkeltall 3','78 %','▲ 0,6 %',[44,42,40,41,38,37,36,33]]].forEach(([y,l,v,d,pts])=>{
        s += r(10,y,140,70,'wf-box',6) + t(18,y+14,l,'m',7) + t(18,y+38,v,'b',16) + t(18,y+54,d,'b',7.5) + t(18,y+64,'siste 12 mnd.','m',5.5);
        const p = pts.map((py,i)=>`${88+i*7.5},${y+py-12}`).join(' ');
        s += `<polyline points="${p}" class="wf-chev"/>`;
        const last = pts.length-1; s += `<circle cx="${88+last*7.5}" cy="${y+pts[last]-12}" r="2.5" fill="var(--wf-text)"/>`;
      });
      return phone(s,'Kort med nøkkeltall, endring med pil og tekst, og en liten kurve som viser utviklingen');
    },
    'phone-bars': () => {
      let s = pageHead('[Statistikk]', false);
      s += t(10,40,'Antall per fylke, 2025','m',7);
      [118,96,84,70,61,48,40,31,22,14].forEach((w,i)=>{ const y=50+i*21;
        s += t(10,y+12,'[Fylke '+(i+1)+']','',6.5) + r(56,y+4,w*0.7,11,'wf-btn-p',1) + t(60+w*0.7,y+12.5,String(w*41),'b',6.5);
      });
      return phone(s,'Liggende stolpediagram der hvert fylke har en stolpe med tallet ved siden av');
    },
    'phone-deviation': () => {
      let s = pageHead('[Målinger]', false);
      s += r(10,32,140,30,'wf-err',6) + t(18,45,'⚠ 3 avvik siden i går','err',7.5) + t(18,56,'Vis bare avvik','u',7);
      const dev = {1:'+18 %',4:'−22 %',6:'+31 %'};
      s += r(10,70,140,9*21,'wf-box');
      for (let i=0;i<9;i++){ const y=70+i*21;
        if (dev[i]) s += r(10,y,140,21,'wf-err');
        s += t(16,y+14,'[Målepunkt '+(i+1)+']', dev[i]?'b':'',7) + t(144,y+14, dev[i] ? '⚠ '+dev[i] : '±0 %', dev[i]?'err':'m', 7,'end');
        if (i) s += ln(10,y,150,y);
      }
      return phone(s,'Liste over målepunkter der systemet har merket tre avvik med farge, symbol og differanse');
    },
    'desk-weather': () => desk({heads:['Tid','Vær','Temp.','Nedbør','Vind'], rows:6, rowH:20, title:'[Sted]', search:false,
      cell:(i,c,x,y)=> t(x,y,[['kl. '+(13+i)],['Lettskyet','Delvis skyet','Skyet','Regn','Regn','Skyet'][i],[(14-i)+'°'],[['0','0','0','0,4 mm','1,2 mm','0,2 mm'][i]],[(3+i%3)+' m/s']][c][0] ?? '', c===0?'b':'',7),
      label:'Værtabell med tid, vær, temperatur, nedbør og vind for hver time'}),
    'phone-weather': () => {
      let s = pageHead('[Sted]', false);
      const w = ['sun','sun','cloud','rain','rain','cloud','sun','sun','cloud','cloud'];
      for (let i=0;i<10;i++){ const y=32+i*23;
        s += t(10,y+14,'kl. '+(13+i),'b',7.5);
        const cx=58, cy=y+11;
        if (w[i]==='sun') s += `<circle cx="${cx}" cy="${cy}" r="6" fill="var(--warn)"/>`;
        else s += `<ellipse cx="${cx}" cy="${cy}" rx="9" ry="5.5" class="wf-box"/>` + (w[i]==='rain' ? `<path d="M${cx-4} ${cy+7} l-1.5 4 M${cx+1} ${cy+7} l-1.5 4 M${cx+6} ${cy+7} l-1.5 4" class="wf-chev"/>` : '');
        s += t(82,y+14,(14-i%6)+'°','b',8.5) + t(146,y+14, w[i]==='rain' ? '0,8 mm' : '', 'm',7,'end');
        s += ln(10,y+22,150,y+22);
      }
      return phone(s,'Værvarsel per time der været vises som symbol for sol, sky og regn i stedet for tekst');
    },
    'phone-raw': () => {
      let s = pageHead('[Datasett]', false);
      s += t(10,42,'Hva vil du se?','b',9);
      [['Utvikling i 2026','Linjediagram'],['Sammenlign fylkene','Stolpediagram'],['Siste måned','Nøkkeltall']].forEach(([a,b],i)=>{ const y=52+i*42;
        s += r(10,y,140,34,'wf-box',6) + t(18,y+15,a,'u b',8) + t(18,y+27,b,'m',6.5);
      });
      s += t(10,192,'Eller se alle dataene','m',7);
      s += r(10,200,140,20,'wf-btn-p',3) + t(80,213,'Vis rådata','inv',7.5,'middle');
      s += r(10,226,140,20,'wf-btn',3) + t(80,239,'Last ned (CSV)','',7.5,'middle');
      return phone(s,'Forslag til tre ferdige visninger av dataene, med knapper for å vise eller laste ned rådata');
    },
    'phone-filter': () => {
      let s = pageHead('[Datasett]', true);
      [['Fylke',10],['År',52],['Kolonner',86]].forEach(([l,x])=>{ const w=l.length*4.2+18; s += r(x,62,w,14,'wf-pill',7) + t(x+7,72,l,'',6.5) + chevDown(x+w-10,67); });
      s += t(10,90,'214 rader','m',6.5) + t(150,90,'Sortert: nyeste','m',6.5,'end');
      s += r(10,96,140,6*26,'wf-box');
      for (let i=0;i<6;i++){ const y=96+i*26; s += t(16,y+11,'[Rad '+(i+1)+']','b',7) + t(144,y+11,'Verdi','',7,'end') + t(16,y+21,'Meta · Meta','m',6); if(i) s += ln(10,y,150,y); }
      s += t(80,268,'Vis neste 20','u',7.5,'middle');
      return phone(s,'Rådata med søk, filtre for fylke, år og kolonner, antall rader og oppdeling i sider');
    },

    // ---- Nye skisser ----
    'desk-small': () => desk({heads:['Navn','Dato','Status'], rows:5, title:'[Objekttype]', search:false,
      cell:(i,c,x,y)=> c===0 ? t(x,y,'[Objektnavn]','u',7) : c===1 ? t(x,y,(3+i)+'. nov.','',7) : r(x,y-8,30,11,'wf-pill',5.5)+t(x+15,y,'Status','',6,'middle'),
      label:'Tabell med tre kolonner på stor skjerm'}),
    'phone-table-fit': () => {
      let s = pageHead('[Objekttype]', false);
      const y0=34, rh=24, rows=8;
      s += r(10,y0,140,18+rows*rh,'wf-box') + r(10,y0,140,18,'wf-lock');
      s += t(16,y0+12,'Navn','b',7) + t(82,y0+12,'Dato','b',7) + t(144,y0+12,'Status','b',7,'end');
      for (let i=0;i<rows;i++){ const y=y0+18+i*rh;
        s += t(16,y+15,'[Objektnavn]','u',7) + t(82,y+15,(3+i)+'. nov.','',7);
        s += r(114,y+7,30,11,'wf-pill',5.5) + t(129,y+15,'Status','',6,'middle');
        s += ln(10,y,150,y);
      }
      return phone(s,'Tabell med tre korte kolonner som får plass i full bredde på mobil');
    },
    'phone-expand': () => {
      let s = pageHead();
      let y = 64;
      const row = (open) => {
        const h = open ? 112 : 38;
        s += r(10,y,140,h, open ? 'wf-field' : 'wf-box');
        s += t(16,y+15,'[Objektnavn]','b',8.5) + t(16,y+29,'Meta 1 · Status','m',6.5);
        s += open ? `<polyline points="134,${y+20} 137,${y+17} 140,${y+20}" class="wf-chev"/>` : chevDown(134,y+17);
        if (open){
          ['Meta 2','Meta 3','Meta 4'].forEach((m,i)=>{ const yy=y+40+i*18; s += ln(16,yy,144,yy) + t(16,yy+12,m,'m',7) + t(144,yy+12,'Verdi','b',7,'end'); });
          s += t(16,y+104,'Gå til [objektnavn]','u',7);
        }
        y += h;
        s += ln(10,y,150,y);
      };
      row(false); row(true); row(false); row(false);
      return phone(s,'Liste der én oppføring er åpnet og viser flere opplysninger med etikett og verdi');
    },
    'phone-labels-dont': () => {
      let s = pageHead('[Saker]', false);
      [34,120].forEach((y,k)=>{
        s += r(10,y,140,74,'wf-box',8) + t(18,y+16,'[Objektnavn]','b',8.5);
        s += t(18,y+32,k?'2.10.2026':'12.10.2026','',7.5) + t(142,y+32,k?'28.10.2026':'3.11.2026','',7.5,'end');
        s += t(18,y+48,k?'24/1790':'24/1832','',7.5) + t(142,y+48,k?'4':'7','',7.5,'end');
        s += t(18,y+64,'Ola Nordmann','',7.5);
      });
      s += `<path d="M112 222 l22 22 M134 222 l-22 22" class="wf-x"/>`;
      return phone(s,'Kort uten etiketter: to datoer og to tall uten forklaring, så brukeren må gjette hva de betyr');
    },
    'phone-labels-do': () => {
      let s = pageHead('[Saker]', false);
      [34,138].forEach((y,k)=>{
        s += r(10,y,140,96,'wf-box',8) + t(18,y+15,'[Objektnavn]','u b',8.5) + ln(10,y+22,150,y+22);
        [['Mottatt',k?'2.10.2026':'12.10.2026'],['Frist',k?'28.10.2026':'3.11.2026'],['Saksnummer',k?'24/1790':'24/1832'],['Saksbehandler','Ola Nordmann']].forEach(([l,v],i)=>{
          const yy=y+22+i*18.5; s += t(18,yy+12.5,l,'m',7.5) + t(142,yy+12.5,v,'b',7.5,'end'); if(i) s += ln(10,yy,150,yy);
        });
      });
      return phone(s,'Kort der hver verdi har sin etikett: mottatt, frist, saksnummer og saksbehandler');
    },
    'phone-sparkline': () => {
      let s = pageHead('[Målinger]', false);
      s += t(10,40,'Siste 30 dager','m',6.5) + t(150,40,'I dag','m',6.5,'end');
      const series = [[8,7,9,8,10,12,11,13,14,16],[14,13,13,12,11,11,10,9,9,8],[10,11,9,10,10,11,10,9,10,10],[4,5,7,6,9,11,10,14,13,17],[12,10,13,11,12,9,10,8,11,9],[6,6,7,7,8,8,9,9,10,10],[15,14,12,13,11,10,8,7,6,4],[9,11,8,12,9,13,10,12,11,13]];
      series.forEach((pts,i)=>{ const y=46+i*28;
        s += t(10,y+17,'[Sted '+(i+1)+']','b',7.5);
        const p = pts.map((v,j)=>`${66+j*5.5},${y+22-v}`).join(' ');
        s += `<polyline points="${p}" class="wf-chev" style="stroke-width:1"/>`;
        const last=pts.length-1; s += `<circle cx="${66+last*5.5}" cy="${y+22-pts[last]}" r="2" fill="var(--wf-text)"/>`;
        s += t(150,y+17, String(pts[last]*3)+' µg','b',7.5,'end');
        if (i) s += ln(10,y,150,y);
      });
      return phone(s,'Liste over målesteder der hver rad har dagens verdi og en liten trendgraf for de siste 30 dagene');
    },
    'phone-symbols': () => {
      let s = pageHead('[Oversikt]', false);
      const tri = (x,y,cls) => `<path d="M${x} ${y-7} L${x+7} ${y+5} L${x-7} ${y+5} Z" class="${cls}"/>` + t(x,y+3.5,'!','b',7,'middle');
      const star = (cx,cy,on) => { const pts=[]; for(let k=0;k<10;k++){const a=Math.PI/5*k-Math.PI/2, rr=k%2?2:4.6; pts.push((cx+rr*Math.cos(a)).toFixed(1)+','+(cy+rr*Math.sin(a)).toFixed(1));} return `<polygon points="${pts.join(' ')}" class="${on?'wf-btn-p':'wf-pill'}"/>`; };
      const pin = (x,y) => `<path d="M${x} ${y+6} C ${x-6} ${y-1}, ${x-5} ${y-7}, ${x} ${y-7} C ${x+5} ${y-7}, ${x+6} ${y-1}, ${x} ${y+6} Z" class="wf-box"/><circle cx="${x}" cy="${y-2}" r="1.8" fill="var(--wf-text)"/>`;
      s += t(10,44,'Farevarsel','m',6.5);
      s += r(10,48,140,26,'wf-box',4) + `<g class="sym-warn">${tri(22,61,'wf-sym-warn')}</g>` + t(34,64,'Gult nivå · Kraftig vind','b',7);
      s += t(10,92,'Vurdering','m',6.5);
      [['[Objekt 1]',4],['[Objekt 2]',5],['[Objekt 3]',3]].forEach(([n,k],i)=>{ const y=96+i*22;
        s += r(10,y,140,22,'wf-box') + t(16,y+14,n,'b',7.5);
        for(let j=0;j<5;j++) s += star(98+j*11,y+11,j<k);
      });
      s += t(10,180,'Sted','m',6.5);
      [['[Objekt 1]','Bergen'],['[Objekt 2]','Tromsø']].forEach(([n,p],i)=>{ const y=184+i*24;
        s += r(10,y,140,24,'wf-box') + t(16,y+15,n,'b',7.5) + pin(104,y+12) + t(144,y+15,p,'',7,'end');
      });
      s += t(10,248,'Symbolene har alltid tekst ved siden av','anno',6.5);
      return phone(s,'Symboler brukt i en oversikt: farevarseltrekant med nivå i tekst, stjerner for vurdering og stedsikon foran stedsnavn');
    },
    'phone-multiples': () => {
      let s = pageHead('[Temperatur per by]', false);
      s += t(10,40,'Samme skala i alle: −10 til 25 °C','m',6.5);
      const data = [[2,4,8,13,17,20,19,15,10,5],[-3,-2,2,7,12,16,15,11,5,0],[4,5,7,10,13,15,15,13,9,6],[0,1,5,10,15,19,18,14,8,3],[6,7,10,14,18,22,22,18,13,8],[-4,-4,-1,3,8,12,12,8,3,-1]];
      data.forEach((pts,i)=>{
        const col=i%2, row=Math.floor(i/2), x=10+col*72, y=48+row*72, w=68, h=64;
        s += r(x,y,w,h,'wf-box',4) + t(x+5,y+11,'[By '+(i+1)+']','b',7);
        const gx=x+6, gy=y+18, gw=w-12, gh=40;
        s += `<line x1="${gx}" y1="${gy+gh}" x2="${gx+gw}" y2="${gy+gh}" class="wf-line" style="stroke-width:.6"/>`;
        const p = pts.map((v,j)=>`${(gx+j*gw/9).toFixed(1)},${(gy+gh-(v+10)/35*gh).toFixed(1)}`).join(' ');
        s += `<polyline points="${p}" class="wf-chev" style="stroke-width:1.1"/>`;
      });
      s += t(10,272,'jan.','m',5.5) + t(150,272,'okt.','m',5.5,'end');
      return phone(s,'Seks små linjediagrammer med samme skala, ett per by, ordnet i et rutenett så de kan sammenlignes');
    },
  };

  const CSS_LIGHT = `
    svg{--wf-bg:#f5f5f5;--wf-box:#e0e0e0;--wf-lock:#c9d6f5;--wf-stroke:#2b2b2b;--wf-text:#1a1a1a;--wf-muted:#5c5c5c;--anno:#2448e8;--danger:#b71c1c;--danger-tint:#fbe1e1;--warn:#7f5300;--warn-tint:#fbe9c4}
    .wf-bg{fill:var(--wf-bg);stroke:var(--wf-stroke);stroke-width:1.2}
    .wf-box{fill:var(--wf-box);stroke:var(--wf-stroke);stroke-width:1}
    .wf-field{fill:var(--wf-bg);stroke:var(--wf-stroke);stroke-width:1}
    .wf-lock{fill:var(--wf-lock);stroke:var(--wf-stroke);stroke-width:1}
    .wf-err{fill:var(--danger-tint);stroke:var(--danger);stroke-width:1.4}
    .wf-line{stroke:var(--wf-stroke);stroke-width:1}
    .wf-btn{fill:var(--wf-bg);stroke:var(--wf-stroke);stroke-width:1}
    .wf-btn-p{fill:var(--wf-stroke)}
    .wf-pill{fill:var(--wf-bg);stroke:var(--wf-stroke);stroke-width:.8}
    .wf-sym-warn{fill:var(--warn-tint);stroke:var(--warn);stroke-width:1.2;stroke-linejoin:round}
    .wf-chev{fill:none;stroke:var(--wf-text);stroke-width:1.2;stroke-linecap:round;stroke-linejoin:round}
    .wf-anno-stroke{fill:none;stroke:var(--anno);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
    .wf-x{fill:none;stroke:var(--danger);stroke-width:2.5;stroke-linecap:round}
    .wf-fade-a{stop-color:var(--wf-bg);stop-opacity:0}
    .wf-fade-b{stop-color:var(--wf-bg);stop-opacity:1}
    text{font-family:"IBM Plex Sans","Inter",-apple-system,"Helvetica Neue",Arial,sans-serif;fill:var(--wf-text)}
    text.m{fill:var(--wf-muted)} text.b{font-weight:600} text.u{text-decoration:underline}
    text.inv{fill:var(--wf-bg);font-weight:600} text.err{fill:var(--danger);font-weight:600} text.anno{fill:var(--anno);font-weight:600}`;

  // Frittstående SVG med lyse farger innebygd, til PNG-eksport.
  function standalone(name, scale = 1) {
    const f = sketches[name]; if (!f) return null;
    let out = f();
    const [, , w, h] = out.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
    out = out.replace('<svg ', `<svg xmlns="http://www.w3.org/2000/svg" width="${w*scale}" height="${h*scale}" `)
             .replace(/(<svg[^>]*>)/, `$1<style>${CSS_LIGHT}</style>`);
    return { svg: out, width: w*scale, height: h*scale };
  }

  const api = { sketches, standalone };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else {
    root.Skisser = api;
    const run = () => document.querySelectorAll('[data-sketch]').forEach(el => { const f = sketches[el.dataset.sketch]; if (f) el.innerHTML = f(); });
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  }
})(typeof window !== 'undefined' ? window : globalThis);
