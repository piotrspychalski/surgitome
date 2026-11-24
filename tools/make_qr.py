# Symbol QR (SVG <symbol id="qrSym">): bezpośredni link do strony (domena piotrspychalski.pl), styl jak dotychczas.
# Użycie: python3 tools/make_qr.py [--wpisz]
#   bez opcji — zapisuje qrsym.txt i sprawdza odczyt; --wpisz — dodatkowo podmienia symbol i viewBox w src/shell.html.
# Sprawdzenie odczytu (OpenCV): obraz z cairosvg, a bez biblioteki cairo — zrzut z Google Chrome przez Playwright.
# Zależności: qrcode, opencv-python-headless, numpy; oraz cairosvg albo playwright (+ Google Chrome).
import os, re, sys, tempfile, qrcode, cv2, numpy as np
URL = 'https://piotrspychalski.pl/surgitome/?ref=qr'
SHELL = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'src', 'shell.html')
qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_Q, border=4, box_size=1)
qr.add_data(URL); qr.make(fit=True)
M = qr.get_matrix(); N = len(M); n = N - 8; B = 4
TEAL, DARK, FR = '#0e7a7e', '#0a5558', 0.3
def in_finder(r, c):
    for fr, fc in [(B, B), (B, B + n - 7), (B + n - 7, B)]:
        if fr <= r < fr + 7 and fc <= c < fc + 7: return True
    return False
cx = cy = N / 2; LR = 3.2 * (N / 37) ** 0.5
parts = ['<symbol id="qrSym" viewBox="0 0 %d %d"><rect width="%d" height="%d" rx="1.4" fill="#fff"/>' % (N, N, N, N)]
for r in range(N):
    for c in range(N):
        if M[r][c] and not in_finder(r, c):
            if (c + 0.5 - cx) ** 2 + (r + 0.5 - cy) ** 2 < (LR + 0.2) ** 2: continue
            parts.append('<rect x="%.2f" y="%.2f" width=".88" height=".88" rx=".32" fill="%s"/>' % (c + 0.06, r + 0.06, TEAL))
def ring(x, y):
    o = 'M%g %gh6.4a%g %g 0 0 1 %g %gv6.4a%g %g 0 0 1 -%g %gh-6.4a%g %g 0 0 1 -%g -%gv-6.4a%g %g 0 0 1 %g -%gz' % (x + FR, y, FR, FR, FR, FR, FR, FR, FR, FR, FR, FR, FR, FR, FR, FR, FR, FR)
    return '<path fill-rule="evenodd" fill="%s" d="%sM%g %gv5h5v-5z"/><rect x="%g" y="%g" width="3" height="3" rx="0.135" fill="%s"/>' % (DARK, o, x + 1, y + 1, x + 2, y + 2, TEAL)
for fr, fc in [(B, B), (B, B + n - 7), (B + n - 7, B)]: parts.append(ring(fc, fr))
k = LR / 3.2
parts.append('<circle cx="%g" cy="%g" r="%.3f" fill="#fff"/><circle cx="%g" cy="%g" r="%.3f" fill="none" stroke="%s" stroke-width="%.3f"/><circle cx="%g" cy="%g" r="%.3f" fill="none" stroke="%s" stroke-width="%.3f" opacity=".55"/><circle cx="%g" cy="%g" r="%.3f" fill="%s"/>'
             % (cx, cy, LR, cx, cy, 2.24 * k, TEAL, 0.512 * k, cx, cy, 1.152 * k, TEAL, 0.384 * k, cx, cy, 0.448 * k, TEAL))
parts.append('</symbol>')
SYM = ''.join(parts)
open('qrsym.txt', 'w').write(SYM)
svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 %d %d"><defs>%s</defs><use href="#qrSym" xlink:href="#qrSym"/></svg>' % (N, N, SYM)
print('wersja QR:', qr.version, '| moduły:', n, '| promień logo:', round(LR, 2))

if '--wpisz' in sys.argv:
    html = open(SHELL, encoding='utf-8').read()
    html, ns = re.subn(r'<symbol id="qrSym".*?</symbol>', lambda m: SYM, html, flags=re.S)
    # każde <svg viewBox="0 0 X X"> z <use href="#qrSym"/> (przycisk, nakładka) dostaje rozmiar symbolu
    html, nv = re.subn(r'(<svg viewBox=")0 0 \d+ \d+("[^>]*><use href="#qrSym"/>)', lambda m: '%s0 0 %d %d%s' % (m.group(1), N, N, m.group(2)), html)
    open(SHELL, 'w', encoding='utf-8').write(html)
    print('src/shell.html: symbol ×%d, viewBox ×%d' % (ns, nv))

def renders():
    try:
        import cairosvg
        for px in (600, 200, 140, 110):
            yield px, cairosvg.svg2png(bytestring=svg.encode(), output_width=px, output_height=px)
        return
    except (ImportError, OSError):
        pass
    from playwright.sync_api import sync_playwright
    chrome = os.environ.get('CHROME', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=chrome)
        pg = b.new_page(device_scale_factor=1)
        for px in (600, 200, 140, 110):
            pg.set_viewport_size({'width': px, 'height': px})
            pg.set_content('<html><body style="margin:0;background:#fff">%s</body></html>' % svg.replace('<svg ', '<svg width="%d" height="%d" ' % (px, px), 1))
            yield px, pg.screenshot()
        b.close()

det = cv2.QRCodeDetector(); ok = True
for px, png in renders():
    img = cv2.imdecode(np.frombuffer(png, np.uint8), cv2.IMREAD_COLOR)
    img = cv2.copyMakeBorder(img, 20, 20, 20, 20, cv2.BORDER_CONSTANT, value=(255, 255, 255))
    val, pts, _ = det.detectAndDecode(img)
    ok = ok and val == URL
    print(px, 'px →', val or 'NIE ODCZYTANO', '✓' if val == URL else '✗')
    if px == 200: open('qr_200px.png', 'wb').write(png)
sys.exit(0 if ok else 1)
