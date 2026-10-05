# SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
# Nowe pozycje piśmiennictwa: rekord PubMed (E-utilities efetch) → wiersz do ANAT.BIB.R w src/core/12-bibliografia.js (styl Vancouver, NLM)
# Użycie: python3 tools/pubmed_vancouver.py 20994128 1276657
# Potem: dopisać wiersz do R, klucz do P (id zabiegu lub wariantu, rola, uzasadnienie), node build.js && node tools/bibliografia_md.js
import json, re, sys, unicodedata, urllib.request
import xml.etree.ElementTree as ET

# błędy w rekordach PubMed sprawdzone ręcznie (autor zbiorowy zapisany jako osoba, literówka, brak DOI w PubMed — DOI z Crossref)
FIX = {'39560893': {'authors': ['Bhasker AG', 'Prasad A', 'Shah S', 'Parmar C'], 'collective': ['OAGB-MGB Consensus Contributors']},
       '25733126': {'collective': ['American Society for Gastrointestinal Endoscopy Standards of Practice Committee']},
       '703369': {'doi': '10.1016/S0022-5223(19)41012-X'}, '3702486': {'doi': '10.1016/S0022-5223(19)36003-9'}}
EPONYM = {'vater': 'Vater', 'whipple': 'Whipple', 'roux': 'Roux', 'billroth': 'Billroth', 'puestow': 'Puestow', 'hartmann': 'Hartmann', 'braun': 'Braun'}

def txt(el):
    return re.sub(r'\s+', ' ', ''.join(el.itertext())).strip() if el is not None else ''

def parse(art):
    mc = art.find('MedlineCitation'); a = mc.find('Article'); j = a.find('Journal'); ji = j.find('JournalIssue')
    auths, coll = [], []
    for au in a.findall('AuthorList/Author'):
        if au.find('CollectiveName') is not None: coll.append(txt(au.find('CollectiveName'))); continue
        ln, ini = au.findtext('LastName') or '', au.findtext('Initials') or ''
        if ln: auths.append(((ln.title() if ln.isupper() and len(ln) > 1 else ln) + ' ' + ini).strip())
    pd = ji.find('PubDate'); year = pd.findtext('Year') or (re.findall(r'\d{4}', pd.findtext('MedlineDate') or '') or [''])[0]
    doi = ''
    for e in a.findall('ELocationID') + art.findall('PubmedData/ArticleIdList/ArticleId'):
        if (e.get('EIdType') or e.get('IdType')) == 'doi' and e.text: doi = e.text.strip()
    return {'pmid': mc.findtext('PMID'), 'authors': auths, 'collective': coll, 'title': txt(a.find('ArticleTitle')) or txt(a.find('VernacularTitle')),
            'journal': mc.findtext('MedlineJournalInfo/MedlineTA') or j.findtext('ISOAbbreviation') or j.findtext('Title'),
            'year': year, 'volume': ji.findtext('Volume') or '', 'issue': ji.findtext('Issue') or '', 'pages': a.findtext('Pagination/MedlinePgn') or '', 'doi': doi}

def sentence_case(t):
    if sum(ch.isupper() for ch in t) < 0.8 * sum(ch.isalpha() for ch in t): return t
    t = re.sub(r'[a-z]+', lambda m: EPONYM.get(m.group(0), m.group(0)), t.lower())
    return t[:1].upper() + t[1:]

def nlm_pages(pg):
    m = re.fullmatch(r'(\d+)-(\d+)', pg)
    if not m or len(m.group(1)) != len(m.group(2)): return pg
    a, b = m.group(1), m.group(2); i = 0
    while i < len(a) - 1 and a[i] == b[i]: i += 1
    return a + '-' + b[i:]

def vancouver(r):
    au = r['authors']; s = ', '.join(au[:6]) + (', et al.' if len(au) > 6 else '')
    coll = [re.sub(r'\.?\s*Electronic address:\s*\S+$', '', c).strip() for c in r['collective']]
    if coll: s = (s + '; ' if s else '') + '; '.join(coll)
    t = sentence_case(r['title'].strip()); t += '' if re.search(r'[.?!]\]?$', t) else '.'
    src = re.sub(r' \(\d{4}\)$', '', r['journal']) + '. ' + r['year']
    if r['volume']: src += ';' + r['volume'] + ('(' + r['issue'] + ')' if r['issue'] else '')
    elif r['issue']: src += ';(' + r['issue'] + ')'
    pg = nlm_pages(r['pages'])
    if not pg and r['doi'].startswith('10.3791/'): pg = 'e' + r['doi'].split('/')[1]   # JoVE: numer artykułu
    if pg: src += ':' + pg
    return s.rstrip('.') + '. ' + t + ' ' + src + '.'

def key(r):
    fa = r['authors'][0].rsplit(' ', 1)[0] if r['authors'] else (r['collective'] or ['anon'])[0]
    fa = fa.translate(str.maketrans({'ø': 'o', 'Ø': 'O', 'æ': 'ae', 'ß': 'ss', 'ł': 'l', 'Ł': 'L'}))
    return re.sub(r'[^a-z]', '', unicodedata.normalize('NFKD', fa).encode('ascii', 'ignore').decode().lower())[:16] + r['year']

if __name__ == '__main__':
    ids = [p for p in sys.argv[1:] if p.isdigit()]
    if not ids: sys.exit(__doc__ or 'Podaj PMID, np. python3 tools/pubmed_vancouver.py 20994128')
    xml = urllib.request.urlopen('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=xml&id=' + ','.join(ids), timeout=60).read()
    for art in ET.fromstring(xml).findall('PubmedArticle'):
        r = parse(art); r.update(FIX.get(r['pmid'], {}))
        f = ['c: ' + json.dumps(vancouver(r), ensure_ascii=False), 'pmid: "%s"' % r['pmid']] + (['doi: ' + json.dumps(r['doi'])] if r['doi'] else []) + ['y: ' + (r['year'] or '0')]
        print('      %s: { %s },' % (json.dumps(key(r)), ', '.join(f)))
