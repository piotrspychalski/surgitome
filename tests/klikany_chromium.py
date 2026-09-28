# Test „klikany” w prawdziwym Chromium (Playwright): python3 tests/klikany_chromium.py tour "hartmann:hartmann,frey:frey" | mobile
# Zrzuty trafiają do zrzuty/. Wymaga: pip install playwright && playwright install chromium (albo zmienna CHROME ze ścieżką).
# Test „klikany”: prawdziwy Chromium (WebGL przez SwiftShader), kliknięcia i klawiatura jak u użytkownika
import sys, time, json
from playwright.sync_api import sync_playwright
import os
HERE = os.path.dirname(os.path.abspath(__file__))
HTML = 'file://' + os.path.join(HERE, '..', 'dist', 'surgitome.html')
LIB = {'three.min.js': os.path.join(HERE, '..', 'node_modules', 'three', 'build', 'three.min.js'), 'OrbitControls.js': os.path.join(HERE, '..', 'node_modules', 'three', 'examples', 'js', 'controls', 'OrbitControls.js')}
log = []
def route(r):
    u = r.request.url
    for k, p in LIB.items():
        if u.endswith(k): return r.fulfill(path=p, content_type='application/javascript')
    if 'fonts.g' in u: return r.abort()
    return r.continue_()
def page_for(b, mobile, size=None, preview=False):
    vp = size or ({'width': 390, 'height': 844} if mobile else {'width': 1440, 'height': 900})
    ctx = b.new_context(viewport=vp, device_scale_factor=2 if mobile else 1, is_mobile=mobile, has_touch=mobile)
    ctx.add_init_script("try { localStorage.setItem('surgitome-intro', '1'); } catch (e) {}" + (" window.__SG_PREVIEW = true;" if preview else ''))
    p = ctx.new_page(); p.route('**/*', route)
    p.on('console', lambda m: log.append(('console.' + m.type, m.text)) if m.type in ('error', 'warning') else None)
    p.on('pageerror', lambda e: log.append(('pageerror', str(e))))
    p.goto(HTML); p.wait_for_timeout(2500); return p
def shot(p, name): p.screenshot(path=os.path.join(HERE, '..', 'zrzuty', '%s.png') % name)
def state(p): return p.evaluate("() => ({ title: document.getElementById('pTitle').textContent, frame: (document.querySelector('.step[aria-current=\"true\"], .step.on') || {}).textContent || '', cap: (document.getElementById('capTitle')||{}).textContent || '' })")

def settle(p, frac=None, maxs=40):
    for _ in range(maxs * 4):
        st = p.evaluate("() => { const S=__sgTest.state(); return { tw: !__sgTest.controls.enabled, m: S.m, playing: S.playing }; }")
        if not st['tw'] and (frac is None and not st['playing'] or frac is not None and st['m'] >= frac): return st
        p.wait_for_timeout(250)
    return st
def stepclick(p, i): p.evaluate("(i) => document.querySelectorAll('.srow1 .step')[i].click()", i)
def pick(p, q, mobile=False):
    if mobile: p.tap('#mMenuBtn'); p.wait_for_timeout(300); p.tap('#mq'); p.keyboard.type(q); p.wait_for_timeout(300); p.tap('#mqres .qitem')
    else: p.click('#q'); p.keyboard.type(q); p.wait_for_timeout(200); p.keyboard.press('Enter')
    p.wait_for_timeout(700)
scen = sys.argv[1]
with sync_playwright() as pw:
    b = pw.chromium.launch(**({'executable_path': os.environ['CHROME']} if os.environ.get('CHROME') else {}), args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
    if scen == 'tour':
        p = page_for(b, False)
        for q, name in [(x.split(':')[0], x.split(':')[1]) for x in sys.argv[2].split(',')]:
            pick(p, q); settle(p, 0); shot(p, 't_%s_0' % name)
            steps = p.evaluate("() => [...document.querySelectorAll('.srow1 .step')].map(b=>b.textContent)")
            iv = len(steps) - 3; stepclick(p, iv); settle(p); shot(p, 't_%s_post' % name)
            stepclick(p, len(steps) - 2); p.wait_for_timeout(1500)
            for k in range(60):
                if p.is_visible('#choice'): shot(p, 't_%s_choice' % name); p.keyboard.press('1'); p.wait_for_timeout(400)
                done = p.evaluate("() => document.getElementById('hudNote') ? document.getElementById('hudNote').textContent : ''")
                p.wait_for_timeout(1000)
                if k in (6, 59): shot(p, 't_%s_endo%d' % (name, k))
            log.append(('state', name + ' | ' + p.evaluate("() => document.getElementById('pTitle').textContent")))
    elif scen == 'mobile':
        p = page_for(b, True); shot(p, 'm00_start')
        p.tap('#mMenuBtn'); p.wait_for_timeout(500); shot(p, 'm01_menu')
        p.tap('#mq'); p.keyboard.type('zbiornik'); p.wait_for_timeout(400); shot(p, 'm02_search')
        p.tap('#mqres .qitem'); p.wait_for_timeout(700); shot(p, 'm03_ipaa_early'); settle(p, 0); p.wait_for_timeout(1500); shot(p, 'm03_ipaa')
        steps = p.evaluate("() => [...document.querySelectorAll('.srow1 .step')].length")
        stepclick(p, 4); settle(p); shot(p, 'm05_ipaa_var_end')
        pick(p, 'hartmann', True); settle(p, 0); shot(p, 'm06_hartmann'); stepclick(p, 3); settle(p); shot(p, 'm07_hartmann_post')
        pick(p, 'frey', True); stepclick(p, 4); p.wait_for_timeout(8000); shot(p, 'm08_frey_endo')
        log.append(('state', p.evaluate("() => document.getElementById('mProcName').textContent")))
    elif scen == 'trials':
        # widok podzielony badań: komputer, telefon pionowo i poziomo
        for dev, mob, size in [('d', False, None), ('mp', True, {'width': 390, 'height': 844}), ('ml', True, {'width': 844, 'height': 390})]:
            p = page_for(b, mob, size, preview=True)
            for q in (sys.argv[2].split(',') if len(sys.argv) > 2 else ['ethos', 'scar']):
                pick(p, q, mob); p.wait_for_timeout(1500); settle(p, 0); shot(p, 'tr_%s_%s_1start' % (q, dev))
                stepclick(p, 1)
                for frac in (0.3, 0.55, 0.8):
                    settle(p, frac); shot(p, 'tr_%s_%s_2int%02d' % (q, dev, int(frac * 100)))
                stepclick(p, 2); p.wait_for_timeout(2200); shot(p, 'tr_%s_%s_3post' % (q, dev))
                log.append(('state', dev + ' ' + q + ' | ' + p.evaluate("() => [...document.querySelectorAll('.sh b')].map(x=>x.textContent).join(' / ')")))
    print(json.dumps([l for l in log if 'fonts' not in l[1] and 'ERR_FAILED' not in l[1]], ensure_ascii=False, indent=0)[:3000])
    b.close()
