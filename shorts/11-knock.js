// Short 11: KEEP KNOCKING. Others knock once on the door marked SUCCESS and leave; Kai keeps knocking until it opens.
const K = require('../engine/kit');
const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, spot, label, watermark, shade, lifestyle, camera, impact, blend, hop } = require('./lib');
const CUT = 10.8; const FY = 1450; const DX = 660; const OPEN = 8.6;
const visitors = [{ c: '#1c7ed6', a: 0.2 }, { c: '#e8590c', a: 1.4 }, { c: '#9c36b5', a: 2.6 }];
const knock = (t) => ({ lean: 0, tilt: 0, armL: [8, 4], armR: [80 + Math.max(0, Math.sin(t * 22)) * 10, -70 + Math.max(0, Math.sin(t * 22)) * 50], legL: [6, 0], legR: [6, 0] });
const person = (col) => ({ hair: { type: 'short', color: '#2b2b33' }, top: { type: 'tee', color: col }, pants: '#3b4252', shoes: '#e5e5e5' });

module.exports = {
  cut: CUT, duration: CUT + 3,
  draw: (t) => {
    if (t >= CUT) { lifestyle(t - CUT); shade('#000000', prog(t, CUT + 2.5, CUT + 3)); return; }
    dark(1000); const c = K.ctx(); const kaiOn = t > 3.6; const knocks = kaiOn ? Math.min(47, Math.floor(Math.max(0, t - 4.4) * 22 / (Math.PI * 2) * (1 + (t - 4.4) * 0.35))) : 0;
    const open = ease(prog(t, OPEN, OPEN + 0.8));
    camera({ x: 560, y: lerp(1000, 1080, prog(t, 3.6, OPEN)), z: lerp(1, 1.25, prog(t, 3.6, OPEN)) + open * 0.1, shake: kaiOn && t < OPEN ? 2 + prog(t, 4.4, OPEN) * 5 : impact(t, OPEN, 10), t }, () => {
      line([[0, FY], [W, FY]], 'rgba(255,255,255,0.15)', 4); card(DX - 40, FY - 640, 400, 640, '#2b2f3a', 10);   // wall around the door
      // light behind the door
      if (open > 0) { spot(DX + 160, FY - 300, 600 * open, `rgba(255,214,120,${0.7 * open})`); card(DX, FY - 600, 320, 600, `rgba(255,236,170,${open})`, 6); }
      at(DX, FY - 600, 1, () => { K.ctx().scale(1 - open * 0.85, 1); card(0, 0, 320, 600, '#6b4a2f', 8, INK, 6); card(30, 40, 260, 230, 'rgba(0,0,0,0.15)', 8); card(30, 320, 260, 230, 'rgba(0,0,0,0.15)', 8); circle(290, 330, 14, GOLD); card(60, 120, 200, 70, '#f2c14e', 10); label('SUCCESS', 160, 157, 36, INK, { spacing: 3 }); });
      // the others: walk up, knock once, give up, walk away
      visitors.forEach((v, i) => { const lt = t - v.a; if (lt < 0 || lt > 3.2) return; const x = lt < 0.9 ? lerp(-80, DX - 100, ease(lt / 0.9)) : (lt < 1.7 ? DX - 100 : lerp(DX - 100, -150, ease((lt - 1.7) / 1.4)));
        who(person(v.c), { x, y: FY, s: 0.95, flip: lt > 1.7, pose: lt < 0.9 || lt > 1.7 ? P.walk(t * 1.4) : (lt < 1.2 ? knock(t) : 'shrug'), expr: lt > 1.2 ? 'sad' : 'neutral' }); if (lt > 1.2 && lt < 2.2) label('*KNOCK*', DX - 30, FY - 470, 36, '#9aa3b5', { spacing: 2 }); });
      // Kai: walks up and keeps knocking, faster and faster
      if (kaiOn) { const x = lerp(-80, DX - 100, ease(prog(t, 3.6, 4.4))); const inside = prog(t, OPEN + 0.6, OPEN + 1.8);
        spot(x, FY - 230, 240, 'rgba(57,255,20,0.15)');
        alpha(1 - inside * 0.7, () => who('kai', { x: lerp(x, DX + 160, ease(inside)), y: FY - hop(t, OPEN + 0.1, 40), s: 0.95, pose: t < 4.4 ? P.walk(t * 1.4) : (t < OPEN ? knock(t * (1 + (t - 4.4) * 0.35)) : (inside > 0 ? P.walk(t * 1.4) : blend(knock(t), 'cheer', prog(t, OPEN, OPEN + 0.4)))), expr: t > OPEN ? 'happy' : 'determined' }));
        if (t > 4.4 && t < OPEN) floaters(t, 40, (i, life) => label('KNOCK', DX - 40 + (i % 3) * 30, FY - 420 - life * 120, 30, '#ffffff', { spacing: 2 }), { every: 0.22, from: 4.4, life: 0.6 }); }
    });
    if (kaiOn) at(W / 2, 1720, pop(t, 4.4), () => { card(-230, -60, 460, 120, '#0d1018', 30, t > OPEN ? GREEN : 'rgba(255,255,255,0.4)', 4); label(`KNOCKS: ${knocks || 1}`, 0, 4, 54, t > OPEN ? GREEN : '#ffffff', { spacing: 3 }); });
    label(t < OPEN ? 'MOST PEOPLE KNOCK ONCE.' : 'KEEP KNOCKING.', W / 2, 230, t < OPEN ? 62 : 90, t < OPEN ? '#ffffff' : GOLD, { spacing: 4, glow: t < OPEN ? undefined : GOLD });
    watermark(); shade('#000000', 1 - prog(t, 0, 0.3));
  },
};
