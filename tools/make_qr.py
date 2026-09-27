# Symbol QR (SVG <symbol id="qrSym">): bezpośredni link do strony na GitHub Pages, styl jak dotychczas
import qrcode, io, cairosvg, cv2, numpy as np
URL = 'https://piotrspychalski.github.io/surgitome/?ref=qr'
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
det = cv2.QRCodeDetector()
print('wersja QR:', qr.version, '| moduły:', n, '| promień logo:', round(LR, 2))
for px in (600, 200, 140, 110):
    png = cairosvg.svg2png(bytestring=svg.encode(), output_width=px, output_height=px)
    img = cv2.imdecode(np.frombuffer(png, np.uint8), cv2.IMREAD_COLOR)
    img = cv2.copyMakeBorder(img, 20, 20, 20, 20, cv2.BORDER_CONSTANT, value=(255, 255, 255))
    val, pts, _ = det.detectAndDecode(img)
    print(px, 'px →', val or 'NIE ODCZYTANO', '✓' if val == URL else '✗')
    if px == 200: open('qr_200px.png', 'wb').write(png)
