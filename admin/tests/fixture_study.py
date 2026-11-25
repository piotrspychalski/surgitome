# SURGITOME — panel autora. Przykład do testu zgodności modułu STUDY (src/study.js) z tools/analiza_ankiety.py (repozytorium surgitome-study).
# Odtwarza uczestników z tests/test_analiza.py (dane WYMYŚLONE, kody testowe AAAAAA…), zapisuje je jak eksport Web3Forms (CSV) i pliki JSON,
# liczy wyniki analizą w Pythonie i zapisuje je do admin/tests/dane/oczekiwane.json. Uruchamiać tylko po zmianie analizy w STUDY:
#   python3 admin/tests/fixture_study.py [ścieżka do surgitome-study]
import hashlib, json, os, shutil, sys, tempfile

TU = os.path.dirname(os.path.abspath(__file__))
STUDY = sys.argv[1] if len(sys.argv) > 1 else os.environ.get('STUDY_REPO', os.path.join(TU, '..', '..', '..', 'surgitome-study'))
sys.path.insert(0, os.path.join(STUDY, 'tests'))
sys.path.insert(0, os.path.join(STUDY, 'tools'))
import analiza_ankiety as AN  # noqa: E402
import test_analiza as T      # noqa: E402

surg = lambda f: {'role': 'surgeon', 'field': f, 'yearsSinceSpec': '10-19', 'resectionsPerYear': '50-99'}
A_old = T.payload('AAAAAA', '2026-11-02T10:20:00.000Z', {'esoph': 1, 'dg': 4, 'tg': 1}, surg('colorectal'), [3] * 10)
A = T.payload('AAAAAA', '2026-11-02T11:00:00.000Z', {'esoph': 4, 'dg': 4, 'tg': 1}, surg('colorectal'), [5, 1] * 5, submission=2, comment='Stump: name the "IL side-to-side" variant / ok')
B = T.payload('BBBBBB', '2026-11-02T10:30:00.000Z', {'esoph': 3, 'dg': 4}, {'status': 'specialist', 'field': 'colorectal', 'yearsSinceSpec': '5-9'}, [3] * 10, schema=1)
C = T.payload('CCCCCC', '2026-11-03T10:40:00.000Z', {'esoph': 2, 'dg': 4}, {'role': 'resident', 'field': 'upper', 'residentYear': '4'}, [4, 2] * 5, sel=['esoph', 'dg'])
D = T.payload('DDDDDD', '2026-11-03T10:50:00.000Z', {'esoph': 'NA', 'dg': 'NA'}, surg('upper'), [1, 5] * 5, sel=['esoph', 'dg'])
E = T.payload('EEEEEE', '2026-11-04T10:52:00.000Z', {'esoph': 1}, {'role': 'patient'}, [3] * 10, sel=['esoph'], measure='comprehensibility', useset='patient',
              use={'understandOp': 5, 'prepare': 4, 'layIntelligible': 5, 'recommendPatients': 4})
F = T.payload('FFFFFF', '2026-11-04T10:53:00.000Z', {'esoph': 4}, {'role': 'physician', 'specialty': 'gastro'}, [None] * 10, sel=['esoph'], measure='accuracy', useset='physician',
              use={'myPatients': 4, 'imaging': 5, 'teaching': 4, 'recommend': 4})
G = T.payload('E-0123456789ab', '2026-11-04T10:54:00.000Z', {'esoph': 1}, surg('general'), [None] * 10, sel=['esoph'], measure='accuracy', useset='surgeon', use={'recommend': 1}, access='open')
H = T.payload('GGGGGG', '2026-11-05T09:00:00.000Z', {'esoph': 3}, {'role': 'resident', 'field': 'other', 'fieldOther': 'Każda'}, [4] * 10, sel=['esoph'])
X = T.payload('ZZZZZZ', '2026-11-02T10:55:00.000Z', {'esoph': 1, 'dg': 1}, surg('general'), [3] * 10)  # kod spoza listy

D_DIR = os.path.join(TU, 'dane')
os.makedirs(D_DIR, exist_ok=True)
with open(os.path.join(D_DIR, 'ankieta_A_stare.json'), 'w') as f:
    json.dump(A_old, f)
with open(os.path.join(D_DIR, 'ankieta_A.json'), 'w') as f:
    json.dump(A, f, indent=2)
with open(os.path.join(D_DIR, 'ankieta_web3forms.csv'), 'w', encoding='utf-8', newline='') as f:
    f.write(T.web3forms_csv([B, B, C, D, X, E, F, G, H]))  # B dwa razy = duplikat
salt, it = '00ff', 1000
cfg = {'salt': salt, 'iter': it, 'hashes': [hashlib.pbkdf2_hmac('sha256', c.encode(), salt.encode(), it).hex() for c in ('AAAAAA', 'BBBBBB', 'CCCCCC', 'DDDDDD', 'EEEEEE', 'FFFFFF', 'GGGGGG')]}
with open(os.path.join(D_DIR, 'kody_test.json'), 'w') as f:
    json.dump(cfg, f)

tmp = tempfile.mkdtemp(prefix='surgitome-admin-')
try:
    kody = os.path.join(tmp, 'kody.js')
    with open(kody, 'w') as f:
        f.write('  var STUDY_CODES = ' + json.dumps(cfg) + ';\n')
    src = os.path.join(tmp, 'odp')
    os.makedirs(src)
    for n in ('ankieta_A_stare.json', 'ankieta_A.json', 'ankieta_web3forms.csv'):
        shutil.copy(os.path.join(D_DIR, n), src)
    out = {}
    for name, extra in (('domyslnie', []), ('grupa_wszyscy', ['--grupa-cvi', 'wszyscy']), ('dostep_wszyscy', ['--cvi-dostep', 'wszyscy']),
                        ('pomin_C', ['--pomin', 'cccccc'])):
        res, meta = AN.main([src, '--out', os.path.join(tmp, 'w_' + name), '--kody', kody, '--codes', os.path.join(tmp, 'brak.csv')] + extra)
        out[name] = {
            'meta': {'loaded': meta['loaded'], 'invalid': sorted(meta['invalid']), 'skipped': sorted(meta['skipped']), 'superseded': meta['superseded'],
                     'duplicates': meta['duplicates'], 'recoded': meta['recoded']},
            'n_group': res['n_group'], 'n_open_surgeons': res['n_open_surgeons'], 'n_comprehension': res['n_comprehension'],
            'items': [{k: r[k] for k in ('id', 'oceniajacych_N', 'ocen_3_4', 'I_CVI', 'kappa', 'kappa_ocena', 'n1', 'n2', 'n3', 'n4', 'n_poza_dziedzina', 'n_niewybrane',
                                         'n_brak_oceny', 'srednia_ocena', 'komentarzy')} for r in res['items']],
            'scvi_all': res['scvi_all'], 'scvi_ops': res['scvi_ops'], 'scvi_n3': res['scvi_n3'], 'scvi_roles': res['scvi_roles'],
            'comprehension_ave': res['comprehension_ave'], 'sus': res['sus'], 'sus_roles': res['sus_roles'],
            'participants': sorted([{'kod': p['kod'], 'rola': p['rola'], 'dostep': p['dostep'], 'w_grupie_cvi': p['w_grupie_cvi'], 'SUS': p['SUS'],
                                     'wybranych': p['wybranych_pozycji'], 'ocenionych': p['ocenionych_pozycji']} for p in res['participants']], key=lambda x: x['kod']),
            'comments': len(res['comments']),
        }
    with open(os.path.join(D_DIR, 'oczekiwane.json'), 'w') as f:
        json.dump(out, f, indent=1, ensure_ascii=False, default=float)
    print('zapisano admin/tests/dane/oczekiwane.json (%d wariantów)' % len(out))
finally:
    shutil.rmtree(tmp)
