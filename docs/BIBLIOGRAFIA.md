# SURGITOME — piśmiennictwo do zabiegów

Źródła pokazywane w aplikacji: panel „Opis” → „Piśmiennictwo” (bieżący zabieg i wariant) oraz „Źródła” w stopce panelu (całość). Plik powstaje z `src/core/12-bibliografia.js` poleceniem `node tools/bibliografia_md.js`.

- **Pozycji:** 219, w tym 208 z PMID i 11 spoza PubMed. Styl Vancouver (NLM): do 6 autorów, potem „et al.”; skróty czasopism wg katalogu NLM; rok wydania drukowanego.
- **Dobór:** dla każdego zabiegu wyszukiwanie w PubMed (konektor PubMed): opis oryginalny, aktualne wytyczne lub konsensus, źródła liczb i szczegółów pokazanych w modelu, endoskopia po zabiegu, kluczowe RCT i metaanalizy. Włączono wszystkie źródła z audytu medycznego z 5.10.2026.
- **Weryfikacja:** każdy opis złożono z rekordu PubMed (E-utilities efetch), więc PMID, tytuł i DOI pochodzą z jednego rekordu. Pierwszy autor i rok podane przy wyborze porównano z rekordem dla wszystkich PMID. Pozycje spoza PubMed (rejestry ClinicalTrials.gov, CORDIS, FDA 510(k), Brisbane 2000, Radiopaedia, mp.pl, poradniki) sprawdzono w źródle; data dostępu: 2026-10-05.
- **Role:** *opis oryginalny*, *wytyczne / konsensus*, *anatomia*, *technika*, *endoskopia*, *wyniki badań*, *rejestr badania*. W aplikacji pozycje idą w tej kolejności, a w obrębie roli chronologicznie. Pozycje wariantu dochodzą do pozycji wspólnych dla zabiegu.
- **Uzasadnia:** co w modelu dane źródło uzasadnia. Uzasadnienie służy do przeglądu i w aplikacji się nie wyświetla.

<!-- autor -->
## Uwagi do źródeł

Różnice między źródłami, a także między źródłami a modelem, wynikają z różnych technik i praktyki ośrodków. Decyzja autora (6.10.2026): teksty modeli zostają bez zmian, a gdy źródła się różnią, w piśmiennictwie zostają wszystkie.

- **Przykłady różnic (zachowano wszystkie źródła):**
  - Hepatikojejunostomia: w modelu pętla Roux 40–60 cm, u Feldera 2013 (PMID 23553273) ok. 20 cm.
  - RYGB: w modelu Roux 100–150 cm i BP 50–100 cm; w przeglądzie Mahawar 2016 (PMID 26749410) łącznie 100–200 cm.
  - ALPPS: powikłania wobec resekcji dwuetapowej według RCT LIGRO (PMID 28902669) i metaanalizy Eshmuminov 2016 (PMID 27633328).
  - Przeszczepienie wątroby w PSC: przewód–przewód (Pandanaboyana 2015) albo Roux-en-Y (Faleiro 2026).
- **Bez bezpośredniego źródła w PubMed:**
  - pętla 30–40 cm od więzadła Treitza w gastroenterostomii omijającej;
  - dostęp do brodawki po DS, SADI-S i BPD oraz wybór wylotu po OAGB (w PubMed są tylko opisy przypadków);
  - obraz ślepego kikuta przełyku po zespoleniu bok-do-boku.
- **Źródła z audytu o ograniczonym zakresie (zachowane):**
  - PMID 37413758: opis dwóch przypadków, układ struktur w więzadle wątrobowo-dwunastniczym podany we wstępie;
  - PMID 38243588 i 27251846: opisy przypadków (technika LPJ);
  - PMID 3833287 (Koskas 1985): anatomia plastyk zamostkowych;
  - PMID 18553046 (Hartwig 2008): rura Kirschnera–Akiyamy.
- **Resekcja jelita cienkiego:** Cochrane (Choy 2011) dotyczy zespoleń krętniczo-okrężniczych; metaanalizy dla zespoleń jelitowo-jelitowych nie znaleziono.
- **Opisy oryginalne spoza PubMed:**
  - Billroth, Roux 1893, Braun, Wölfler, Hartmann 1921, Cantlie 1898, Riedel i Sprengel (choledochoduodenostomia), Turnbull (ileostomia pętlowa), Cheatle;
  - zamiast nich podano przeglądy historyczne (Weil 1999, Hutchison 2010) i współczesne wytyczne;
  - monografię Couinauda z 1957 r. podano jako książkę.
<!-- /autor -->
## Przełyk

### Esofagektomia — warianty resekcji i rekonstrukcji (`esoph`)

1. Low DE, Alderson D, Cecconello I, Chang AC, Darling GE, DʼJourno XB, et al. International Consensus on Standardization of Data Collection for Complications Associated With Esophagectomy: Esophagectomy Complications Consensus Group (ECCG). Ann Surg. 2015;262(2):286-94. [PubMed 25607756](https://pubmed.ncbi.nlm.nih.gov/25607756/) · [doi:10.1097/SLA.0000000000001098](https://doi.org/10.1097/SLA.0000000000001098)  
   *wytyczne / konsensus* — Konsensus ECCG: definicje nieszczelności, martwicy rury i porażenia nerwu krtaniowego
2. Obermannová R, Alsina M, Cervantes A, Leong T, Lordick F, Nilsson M, et al.; ESMO Guidelines Committee. Oesophageal cancer: ESMO Clinical Practice Guideline for diagnosis, treatment and follow-up. Ann Oncol. 2022;33(10):992-1004. [PubMed 35914638](https://pubmed.ncbi.nlm.nih.gov/35914638/) · [doi:10.1016/j.annonc.2022.07.003](https://doi.org/10.1016/j.annonc.2022.07.003)  
   *wytyczne / konsensus* — Wytyczne ESMO: leczenie raka przełyku i połączenia przełykowo-żołądkowego
3. van Workum F, Verstegen MHP, Klarenbeek BR, Bouwense SAW, van Berge Henegouwen MI, Daams F, et al.; ICAN collaborative research group. Intrathoracic vs Cervical Anastomosis After Totally or Hybrid Minimally Invasive Esophagectomy for Esophageal Cancer: A Randomized Clinical Trial. JAMA Surg. 2021;156(7):601-10. [PubMed 33978698](https://pubmed.ncbi.nlm.nih.gov/33978698/) · [doi:10.1001/jamasurg.2021.1555](https://doi.org/10.1001/jamasurg.2021.1555)  
   *wyniki badań* — RCT ICAN: zespolenie szyjne — więcej nieszczelności i porażeń nerwu krtaniowego niż w klatce

*Tylko wariant `eso-il`:*

4. Lewis I. The surgical treatment of carcinoma of the oesophagus; with special reference to a new operation for growths of the middle third. Br J Surg. 1946;34:18-31. [PubMed 20994128](https://pubmed.ncbi.nlm.nih.gov/20994128/) · [doi:10.1002/bjs.18003413304](https://doi.org/10.1002/bjs.18003413304)  
   *opis oryginalny* — Opis oryginalny: dostęp brzuszny i prawostronna torakotomia, zespolenie w klatce
5. Fujiwara N, Sato H, Miyawaki Y, Ito M, Aoyama J, Ito S, et al. Effect of azygos arch preservation during thoracoscopic esophagectomy on facilitation of postoperative refilling. Langenbecks Arch Surg. 2020;405(8):1079-89. [PubMed 32986133](https://pubmed.ncbi.nlm.nih.gov/32986133/) · [doi:10.1007/s00423-020-01994-w](https://doi.org/10.1007/s00423-020-01994-w)  
   *anatomia* — Łuk żyły nieparzystej można zachować przy torakoskopowej esofagektomii
6. Fabbi M, De Pascale S, Ascari F, Petz WL, Fumagalli Romario U. Side-to-side esophagogastric anastomosis for minimally invasive Ivor-Lewis esophagectomy: operative technique and short-term outcomes. Updates Surg. 2021;73(5):1837-47. [PubMed 33900550](https://pubmed.ncbi.nlm.nih.gov/33900550/) · [doi:10.1007/s13304-021-01054-y](https://doi.org/10.1007/s13304-021-01054-y)  
   *technika* — Małoinwazyjny Ivor Lewis: technika zespolenia przełykowo-żołądkowego wewnątrz klatki piersiowej

*Tylko wariant `eso-il-ss`:*

7. Lewis I. The surgical treatment of carcinoma of the oesophagus; with special reference to a new operation for growths of the middle third. Br J Surg. 1946;34:18-31. [PubMed 20994128](https://pubmed.ncbi.nlm.nih.gov/20994128/) · [doi:10.1002/bjs.18003413304](https://doi.org/10.1002/bjs.18003413304)  
   *opis oryginalny* — Opis oryginalny operacji Ivor Lewisa z zespoleniem w klatce
8. Ben-David K, Sarosi GA, Cendan JC, Hochwald SN. Technique of minimally invasive Ivor Lewis esophagogastrectomy with intrathoracic stapled side-to-side anastomosis. J Gastrointest Surg. 2010;14(10):1613-8. [PubMed 20532663](https://pubmed.ncbi.nlm.nih.gov/20532663/) · [doi:10.1007/s11605-010-1244-5](https://doi.org/10.1007/s11605-010-1244-5)  
   *technika* — Zespolenie bok-do-boku staplerem liniowym (6 cm) wewnątrz klatki piersiowej
9. Ramchandani NK, Kesler KA, Rogers JD, Valsangkar N, Stokes SM, Jalal SI. An Ivor Lewis Esophagectomy Designed to Minimize Anastomotic Complications and Optimize Conduit Function. J Vis Exp. 2020;(158):e59255. [PubMed 32364542](https://pubmed.ncbi.nlm.nih.gov/32364542/) · [doi:10.3791/59255](https://doi.org/10.3791/59255)  
   *technika* — Przełyk ułożony wzdłuż linii zszywek rury; stapler liniowy, otwór zamknięty szwem
10. Fabbi M, De Pascale S, Ascari F, Petz WL, Fumagalli Romario U. Side-to-side esophagogastric anastomosis for minimally invasive Ivor-Lewis esophagectomy: operative technique and short-term outcomes. Updates Surg. 2021;73(5):1837-47. [PubMed 33900550](https://pubmed.ncbi.nlm.nih.gov/33900550/) · [doi:10.1007/s13304-021-01054-y](https://doi.org/10.1007/s13304-021-01054-y)  
   *technika* — Zespolenie bok-do-boku staplerem liniowym 3 cm w małoinwazyjnym Ivor Lewisie

*Tylko wariant `eso-mck`:*

11. McKeown KC. Total three-stage oesophagectomy for cancer of the oesophagus. Br J Surg. 1976;63(4):259-62. [PubMed 1276657](https://pubmed.ncbi.nlm.nih.gov/1276657/) · [doi:10.1002/bjs.1800630403](https://doi.org/10.1002/bjs.1800630403)  
   *opis oryginalny* — Opis oryginalny: esofagektomia z trzech dostępów, zespolenie na szyi
12. Chen Y, Xie Y, Zhang H, Li Z, Wu B, Li C, et al. Modified McKeown vs. traditional McKeown minimally invasive esophagectomy in improving short-term efficacy and the quality of life of esophageal cancers: a retrospective comparative cohort study. J Gastrointest Oncol. 2022;13(4):1579-88. [PubMed 36092321](https://pubmed.ncbi.nlm.nih.gov/36092321/) · [doi:10.21037/jgo-22-712](https://doi.org/10.21037/jgo-22-712)  
   *anatomia* — Zmodyfikowany McKeown z zachowaniem łuku żyły nieparzystej
13. Rice TW, Goldblum JR, Rybicki LA, Rajeswaran J, Murthy SC, Mason DP, et al. Fate of the esophagogastric anastomosis. J Thorac Cardiovasc Surg. 2011;141(4):875-80, 880.e1. [PubMed 21306741](https://pubmed.ncbi.nlm.nih.gov/21306741/) · [doi:10.1016/j.jtcvs.2010.12.022](https://doi.org/10.1016/j.jtcvs.2010.12.022)  
   *endoskopia* — Zespolenie przełykowo-żołądkowe ok. 20 cm od siekaczy w endoskopii kontrolnej
14. van Rossum PSN, Haverkamp L, Carvello M, Ruurda JP, van Hillegersberg R. Management and outcome of cervical versus intrathoracic manifestation of cervical anastomotic leakage after transthoracic esophagectomy for cancer. Dis Esophagus. 2017;30(1):1-8. [PubMed 26919029](https://pubmed.ncbi.nlm.nih.gov/26919029/) · [doi:10.1111/dote.12472](https://doi.org/10.1111/dote.12472)  
   *wyniki badań* — Nieszczelność zespolenia szyjnego w ponad połowie przypadków szerzy się do śródpiersia

*Tylko wariant `eso-mck-ss`:*

15. McKeown KC. Total three-stage oesophagectomy for cancer of the oesophagus. Br J Surg. 1976;63(4):259-62. [PubMed 1276657](https://pubmed.ncbi.nlm.nih.gov/1276657/) · [doi:10.1002/bjs.1800630403](https://doi.org/10.1002/bjs.1800630403)  
   *opis oryginalny* — Opis oryginalny esofagektomii z trzech dostępów z zespoleniem na szyi
16. Collard JM, Romagnoli R, Goncette L, Otte JB, Kestens PJ. Terminalized semimechanical side-to-side suture technique for cervical esophagogastrostomy. Ann Thorac Surg. 1998;65(3):814-7. [PubMed 9527220](https://pubmed.ncbi.nlm.nih.gov/9527220/) · [doi:10.1016/s0003-4975(97)01384-2](https://doi.org/10.1016/s0003-4975(97)01384-2)  
   *technika* — Szyjne zespolenie bok-do-boku: Endo-GIA, przednia ściana szyta ręcznie
17. Orringer MB, Marshall B, Iannettoni MD. Eliminating the cervical esophagogastric anastomotic leak with a side-to-side stapled anastomosis. J Thorac Cardiovasc Surg. 2000;119(2):277-88. [PubMed 10649203](https://pubmed.ncbi.nlm.nih.gov/10649203/) · [doi:10.1016/S0022-5223(00)70183-8](https://doi.org/10.1016/S0022-5223(00)70183-8)  
   *technika* — Szyjne zespolenie bok-do-boku staplerem zmniejsza nieszczelności i zwężenia
18. Rice TW, Goldblum JR, Rybicki LA, Rajeswaran J, Murthy SC, Mason DP, et al. Fate of the esophagogastric anastomosis. J Thorac Cardiovasc Surg. 2011;141(4):875-80, 880.e1. [PubMed 21306741](https://pubmed.ncbi.nlm.nih.gov/21306741/) · [doi:10.1016/j.jtcvs.2010.12.022](https://doi.org/10.1016/j.jtcvs.2010.12.022)  
   *endoskopia* — Zespolenie szyjne w endoskopii ok. 20 cm od siekaczy

*Tylko wariant `eso-the`:*

19. Orringer MB, Sloan H. Esophagectomy without thoracotomy. J Thorac Cardiovasc Surg. 1978;76(5):643-54. [PubMed 703369](https://pubmed.ncbi.nlm.nih.gov/703369/) · [doi:10.1016/S0022-5223(19)41012-X](https://doi.org/10.1016/S0022-5223(19)41012-X)  
   *opis oryginalny* — Opis oryginalny: tępa esofagektomia bez torakotomii, rura w łożu przełyku
20. Heitmiller RF. Impact of gastric tube diameter on upper mediastinal anatomy after transhiatal esophagectomy. Dis Esophagus. 2000;13(4):288-92. [PubMed 11284976](https://pubmed.ncbi.nlm.nih.gov/11284976/) · [doi:10.1046/j.1442-2050.2000.00134.x](https://doi.org/10.1046/j.1442-2050.2000.00134.x)  
   *anatomia* — Rura z krzywizny większej 4–5 cm na naczyniach żołądkowo-sieciowych prawych
21. Akiyama H, Hiyama M, Miyazono H. Total esophageal reconstruction after extraction of the esophagus. Ann Surg. 1975;182(5):547-52. [PubMed 1190859](https://pubmed.ncbi.nlm.nih.gov/1190859/) · [doi:10.1097/00000658-197511000-00002](https://doi.org/10.1097/00000658-197511000-00002)  
   *technika* — Wyłuszczenie przełyku bez torakotomii; tylne śródpiersie najkrótszą drogą rekonstrukcji
22. Rice TW, Goldblum JR, Rybicki LA, Rajeswaran J, Murthy SC, Mason DP, et al. Fate of the esophagogastric anastomosis. J Thorac Cardiovasc Surg. 2011;141(4):875-80, 880.e1. [PubMed 21306741](https://pubmed.ncbi.nlm.nih.gov/21306741/) · [doi:10.1016/j.jtcvs.2010.12.022](https://doi.org/10.1016/j.jtcvs.2010.12.022)  
   *endoskopia* — Zespolenie przełykowo-żołądkowe ok. 20 cm od siekaczy w endoskopii
23. Orringer MB, Marshall B, Iannettoni MD. Eliminating the cervical esophagogastric anastomotic leak with a side-to-side stapled anastomosis. J Thorac Cardiovasc Surg. 2000;119(2):277-88. [PubMed 10649203](https://pubmed.ncbi.nlm.nih.gov/10649203/) · [doi:10.1016/S0022-5223(00)70183-8](https://doi.org/10.1016/S0022-5223(00)70183-8)  
   *wyniki badań* — Nieszczelność szyjna prowadzi do zwężenia w ok. 50%; bok-do-boku zmniejsza ryzyko
24. Hulscher JB, van Sandick JW, de Boer AG, Wijnhoven BP, Tijssen JG, Fockens P, et al. Extended transthoracic resection compared with limited transhiatal resection for adenocarcinoma of the esophagus. N Engl J Med. 2002;347(21):1662-9. [PubMed 12444180](https://pubmed.ncbi.nlm.nih.gov/12444180/) · [doi:10.1056/NEJMoa022343](https://doi.org/10.1056/NEJMoa022343)  
   *wyniki badań* — RCT: przezrozworowa — mniej powikłań, ograniczona limfadenektomia vs przezpiersiowa
25. Orringer MB, Marshall B, Chang AC, Lee J, Pickens A, Lau CL. Two thousand transhiatal esophagectomies: changing trends, lessons learned. Ann Surg. 2007;246(3):363-72; discussion 372-4. [PubMed 17717440](https://pubmed.ncbi.nlm.nih.gov/17717440/) · [doi:10.1097/SLA.0b013e31814697f2](https://doi.org/10.1097/SLA.0b013e31814697f2)  
   *wyniki badań* — 2007 operacji przezrozworowych: żołądek jako substytut w 97%, nieszczelność 9–14%

*Tylko wariant `eso-aki`:*

26. Akiyama H, Hiyama M, Hashimoto C. Resection and reconstruction for carcinoma of the thoracic oesophagus. Br J Surg. 1976;63(3):206-9. [PubMed 1260249](https://pubmed.ncbi.nlm.nih.gov/1260249/) · [doi:10.1002/bjs.1800630310](https://doi.org/10.1002/bjs.1800630310)  
   *opis oryginalny* — Opis oryginalny: prawostronna torakotomia, laparotomia, rekonstrukcja żołądkiem drogą zamostkową
27. Akiyama H, Miyazono H, Tsurumaru M, Hashimoto C, Kawamura T. Use of the stomach as an esophageal substitute. Ann Surg. 1978;188(5):606-10. [PubMed 718285](https://pubmed.ncbi.nlm.nih.gov/718285/) · [doi:10.1097/00000658-197811000-00004](https://doi.org/10.1097/00000658-197811000-00004)  
   *opis oryginalny* — Izoperystaltyczny żołądek jako substytut przełyku; zespolenie szyjne
28. Koskas F, Gayet B. Anatomical study of retrosternal gastric esophagoplasties. Anat Clin. 1985;7(4):237-56. [PubMed 3833287](https://pubmed.ncbi.nlm.nih.gov/3833287/) · [doi:10.1007/BF01784641](https://doi.org/10.1007/BF01784641)  
   *anatomia* — Badanie anatomiczne zamostkowych plastyk żołądkowych, w tym stożka Akiyamy
29. Ngan SY, Wong J. Lengths of different routes for esophageal replacement. J Thorac Cardiovasc Surg. 1986;91(5):790-2. [PubMed 3702486](https://pubmed.ncbi.nlm.nih.gov/3702486/) · [doi:10.1016/S0022-5223(19)36003-9](https://doi.org/10.1016/S0022-5223(19)36003-9)  
   *anatomia* — Droga zamostkowa ok. 1,9 cm dłuższa niż tylnośródpiersiowa
30. Sugimachi K, Yaita A, Ueo H, Natsuda Y, Inokuchi K. A safer and more reliable operative technique for esophageal reconstruction using a gastric tube. Am J Surg. 1980;140(3):471-4. [PubMed 6999925](https://pubmed.ncbi.nlm.nih.gov/6999925/) · [doi:10.1016/0002-9610(80)90193-2](https://doi.org/10.1016/0002-9610(80)90193-2)  
   *technika* — Rura żołądkowa cięta 4 cm od krzywizny większej
31. Akiyama H, Tsurumaru M, Kawamura T, Ono Y. Principles of surgical treatment for carcinoma of the esophagus: analysis of lymph node involvement. Ann Surg. 1981;194(4):438-46. [PubMed 7283505](https://pubmed.ncbi.nlm.nih.gov/7283505/) · [doi:10.1097/00000658-198110000-00007](https://doi.org/10.1097/00000658-198110000-00007)  
   *technika* — Resekcja z wpustem i krzywizną mniejszą oraz limfadenektomią
32. Kitadani J, Hayata K, Goda T, Tominaga S, Fukuda N, Nakai T, et al. Whole stomach versus narrow gastric tube reconstruction after esophagectomy for esophageal cancer (ATHLETE trial): study protocol for a randomized controlled trial. Trials. 2025;26(1):111. [PubMed 40155976](https://pubmed.ncbi.nlm.nih.gov/40155976/) · [doi:10.1186/s13063-025-08823-9](https://doi.org/10.1186/s13063-025-08823-9)  
   *technika* — Wąska rura żołądkowa szerokości 3,5 cm wzdłuż krzywizny większej
33. Hartwig W, Strobel O, Schneider L, Hackert T, Hesse C, Büchler MW, et al. Fundus rotation gastroplasty vs. Kirschner-Akiyama gastric tube in esophageal resection: comparison of perioperative and long-term results. World J Surg. 2008;32(8):1695-702. [PubMed 18553046](https://pubmed.ncbi.nlm.nih.gov/18553046/) · [doi:10.1007/s00268-008-9648-z](https://doi.org/10.1007/s00268-008-9648-z)  
   *wyniki badań* — Rura Kirschnera–Akiyamy: wyniki okołooperacyjne i odległe vs gastroplastyka rotacyjna dna

*Tylko wariant `eso-col`:*

34. Ngan SY, Wong J. Lengths of different routes for esophageal replacement. J Thorac Cardiovasc Surg. 1986;91(5):790-2. [PubMed 3702486](https://pubmed.ncbi.nlm.nih.gov/3702486/) · [doi:10.1016/S0022-5223(19)36003-9](https://doi.org/10.1016/S0022-5223(19)36003-9)  
   *anatomia* — Długość dróg rekonstrukcji: zamostkowa vs tylnośródpiersiowa
35. Peters JH, Kronson JW, Katz M, DeMeester TR. Arterial anatomic considerations in colon interposition for esophageal replacement. Arch Surg. 1995;130(8):858-62; discussion 862-3. [PubMed 7632146](https://pubmed.ncbi.nlm.nih.gov/7632146/) · [doi:10.1001/archsurg.1995.01430080060009](https://doi.org/10.1001/archsurg.1995.01430080060009)  
   *anatomia* — Izoperystaltyczny przeszczep lewej okrężnicy na gałęzi wstępującej tętnicy okrężniczej lewej
36. DeMeester TR, Johansson KE, Franze I, Eypasch E, Lu CT, McGill JE, et al. Indications, surgical technique, and long-term functional results of colon interposition or bypass. Ann Surg. 1988;208(4):460-74. [PubMed 3178334](https://pubmed.ncbi.nlm.nih.gov/3178334/) · [doi:10.1097/00000658-198810000-00008](https://doi.org/10.1097/00000658-198810000-00008)  
   *technika* — Technika i wyniki odległe interpozycji okrężnicy; lewa okrężnica na tętnicy krezkowej dolnej
37. Boukerrouche A. Isoperistaltic left colic graft interposition via a retrosternal approach for esophageal reconstruction in patients with a caustic stricture: mortality, morbidity, and functional results. Surg Today. 2014;44(5):827-33. [PubMed 24150095](https://pubmed.ncbi.nlm.nih.gov/24150095/) · [doi:10.1007/s00595-013-0758-3](https://doi.org/10.1007/s00595-013-0758-3)  
   *technika* — Izoperystaltyczna lewa okrężnica drogą zamostkową po oparzeniu przełyku
38. Jeyasingham K, Lerut T, Belsey RH. Functional and mechanical sequelae of colon interposition for benign oesophageal disease. Eur J Cardiothorac Surg. 1999;15(3):327-31; discussion 331-2. [PubMed 10333031](https://pubmed.ncbi.nlm.nih.gov/10333031/) · [doi:10.1016/s1010-7940(99)00007-x](https://doi.org/10.1016/s1010-7940(99)00007-x)  
   *wyniki badań* — Odległe następstwa: narastające wydłużenie (redundancja) przeszczepu okrężniczego
39. Reslinger V, Tranchart H, D'Annunzio E, Poghosyan T, Quero L, Munoz-Bongrand N, et al. Esophageal reconstruction by colon interposition after esophagectomy for cancer analysis of current indications, operative outcomes, and long-term survival. J Surg Oncol. 2016;113(2):159-64. [PubMed 26699417](https://pubmed.ncbi.nlm.nih.gov/26699417/) · [doi:10.1002/jso.24118](https://doi.org/10.1002/jso.24118)  
   *wyniki badań* — Wskazania do interpozycji okrężnicy: m.in. przebyta gastrektomia, martwica rury żołądkowej

## Żołądek

### Resekcja dystalna żołądka — warianty rekonstrukcji (`dg`)

40. Weil PH, Buchberger R. From Billroth to PCV: a century of gastric surgery. World J Surg. 1999;23(7):736-42. [PubMed 10390597](https://pubmed.ncbi.nlm.nih.gov/10390597/) · [doi:10.1007/pl00012379](https://doi.org/10.1007/pl00012379)  
   *opis oryginalny* — Przegląd historyczny resekcji żołądka Billrotha (oryginał 1881 poza PubMed)
41. Japanese Gastric Cancer Association. Japanese Gastric Cancer Treatment Guidelines 2021 (6th edition). Gastric Cancer. 2023;26(1):1-25. [PubMed 36342574](https://pubmed.ncbi.nlm.nih.gov/36342574/) · [doi:10.1007/s10120-022-01331-8](https://doi.org/10.1007/s10120-022-01331-8)  
   *wytyczne / konsensus* — Wytyczne JGCA: metody rekonstrukcji po resekcji dystalnej (B-I, B-II, Roux-en-Y)
42. Shimada H, Fukagawa T, Haga Y, Oba K. Does remnant gastric cancer really differ from primary gastric cancer? A systematic review of the literature by the Task Force of Japanese Gastric Cancer Association. Gastric Cancer. 2016;19(2):339-49. [PubMed 26667370](https://pubmed.ncbi.nlm.nih.gov/26667370/) · [doi:10.1007/s10120-015-0582-0](https://doi.org/10.1007/s10120-015-0582-0)  
   *wyniki badań* — Rak kikuta żołądka: typowo 10–30 lat po resekcji
43. Lombardo F, Aiolfi A, Cavalli M, Mini E, Lastraioli C, Panizzo V, et al. Techniques for reconstruction after distal gastrectomy for cancer: updated network meta-analysis of randomized controlled trials. Langenbecks Arch Surg. 2022;407(1):75-86. [PubMed 35094151](https://pubmed.ncbi.nlm.nih.gov/35094151/) · [doi:10.1007/s00423-021-02411-6](https://doi.org/10.1007/s00423-021-02411-6)  
   *wyniki badań* — Metaanaliza sieciowa RCT: B-I, B-II, B-II+Braun, Roux-en-Y — porównanie wyników

*Tylko wariant `b1`:*

44. Nishizaki D, Ganeko R, Hoshino N, Hida K, Obama K, Furukawa TA, et al. Roux-en-Y versus Billroth-I reconstruction after distal gastrectomy for gastric cancer. Cochrane Database Syst Rev. 2021;9(9):CD012998. [PubMed 34523717](https://pubmed.ncbi.nlm.nih.gov/34523717/) · [doi:10.1002/14651858.CD012998.pub2](https://doi.org/10.1002/14651858.CD012998.pub2)  
   *wyniki badań* — Cochrane: po B-I więcej refluksu żółciowego niż po Roux-en-Y

*Tylko wariant `b2`:*

45. van der Merwe SW, van Wanrooij RLJ, Bronswijk M, Everett S, Lakhtakia S, Rimbas M, et al. Therapeutic endoscopic ultrasound: European Society of Gastrointestinal Endoscopy (ESGE) Guideline. Endoscopy. 2022;54(2):185-205. [PubMed 34937098](https://pubmed.ncbi.nlm.nih.gov/34937098/) · [doi:10.1055/a-1717-1391](https://doi.org/10.1055/a-1717-1391)  
   *wytyczne / konsensus* — ESGE: EUS-GE w zespole pętli doprowadzającej
46. Osnes M, Rosseland AR, Aabakken L. Endoscopic retrograde cholangiography and endoscopic papillotomy in patients with a previous Billroth-II resection. Gut. 1986;27(10):1193-8. [PubMed 3781333](https://pubmed.ncbi.nlm.nih.gov/3781333/) · [doi:10.1136/gut.27.10.1193](https://doi.org/10.1136/gut.27.10.1193)  
   *endoskopia* — ECPW po B-II: wejście pętlą doprowadzającą, brodawka w odwróconej orientacji
47. Bove V, Tringali A, Familiari P, Gigante G, Boškoski I, Perri V, et al. ERCP in patients with prior Billroth II gastrectomy: report of 30 years' experience. Endoscopy. 2015;47(7):611-6. [PubMed 25730282](https://pubmed.ncbi.nlm.nih.gov/25730282/) · [doi:10.1055/s-0034-1391567](https://doi.org/10.1055/s-0034-1391567)  
   *endoskopia* — ECPW po B-II (713 chorych): porażki z powodu długiej, zagiętej pętli doprowadzającej
48. Gkolfakis P, Papaefthymiou A, Facciorusso A, Tziatzios G, Ramai D, Dritsas S, et al. Comparison between Enteroscopy-, Laparoscopy- and Endoscopic Ultrasound-Assisted Endoscopic Retrograde Cholangio-Pancreatography in Patients with Surgically Altered Anatomy: A Systematic Review and Meta-Analysis. Life (Basel). 2022;12(10). [PubMed 36295081](https://pubmed.ncbi.nlm.nih.gov/36295081/) · [doi:10.3390/life12101646](https://doi.org/10.3390/life12101646)  
   *endoskopia* — Metaanaliza ECPW w zmienionej anatomii (B-II, Roux-en-Y): enteroskopia, laparoskopia, EDGE

*Tylko wariant `b2br`:*

49. Vogel SB, Drane WE, Woodward ER. Clinical and radionuclide evaluation of bile diversion by Braun enteroenterostomy: prevention and treatment of alkaline reflux gastritis. An alternative to Roux-en-Y diversion. Ann Surg. 1994;219(5):458-65; discussion 465-6. [PubMed 8185396](https://pubmed.ncbi.nlm.nih.gov/8185396/) · [doi:10.1097/00000658-199405000-00003](https://doi.org/10.1097/00000658-199405000-00003)  
   *technika* — Zespolenie Brauna ok. 30 cm od zespolenia żołądkowego odprowadza żółć od kikuta
50. Gkolfakis P, Papaefthymiou A, Facciorusso A, Tziatzios G, Ramai D, Dritsas S, et al. Comparison between Enteroscopy-, Laparoscopy- and Endoscopic Ultrasound-Assisted Endoscopic Retrograde Cholangio-Pancreatography in Patients with Surgically Altered Anatomy: A Systematic Review and Meta-Analysis. Life (Basel). 2022;12(10). [PubMed 36295081](https://pubmed.ncbi.nlm.nih.gov/36295081/) · [doi:10.3390/life12101646](https://doi.org/10.3390/life12101646)  
   *endoskopia* — ECPW w zmienionej anatomii po B-II: dostęp do brodawki
51. Chan DC, Fan YM, Lin CK, Chen CJ, Chen CY, Chao YC. Roux-en-Y reconstruction after distal gastrectomy to reduce enterogastric reflux and Helicobacter pylori infection. J Gastrointest Surg. 2007;11(12):1732-40. [PubMed 17876675](https://pubmed.ncbi.nlm.nih.gov/17876675/) · [doi:10.1007/s11605-007-0302-0](https://doi.org/10.1007/s11605-007-0302-0)  
   *wyniki badań* — Braun nie zmniejszył refluksu jelitowo-żołądkowego vs B-II; Roux-en-Y skuteczniejszy
52. Chang W, Delgado LM, Ng J, Tran B. Billroth II With Braun Anastomosis Versus Roux-En-Y Reconstruction Following Distal Gastrectomy: A Systematic Review and Meta-Analysis. World J Surg. 2026;50(3):693-702. [PubMed 41665541](https://pubmed.ncbi.nlm.nih.gov/41665541/) · [doi:10.1002/wjs.70256](https://doi.org/10.1002/wjs.70256)  
   *wyniki badań* — Metaanaliza: B-II+Braun szybszy, ale więcej refluksu żółciowego niż Roux-en-Y

*Tylko wariant `dgry`:*

53. Hutchison RL, Hutchison AL. César Roux and his original 1893 paper. Obes Surg. 2010;20(7):953-6. [PubMed 20373047](https://pubmed.ncbi.nlm.nih.gov/20373047/) · [doi:10.1007/s11695-010-0141-z](https://doi.org/10.1007/s11695-010-0141-z)  
   *opis oryginalny* — Angielskie tłumaczenie oryginalnej pracy Roux (1893) o zespoleniu w kształcie Y
54. Zhang LY, Irani S, Khashab MA. Biliary Endoscopy in Altered Anatomy. Gastrointest Endosc Clin N Am. 2022;32(3):563-82. [PubMed 35691697](https://pubmed.ncbi.nlm.nih.gov/35691697/) · [doi:10.1016/j.giec.2022.02.001](https://doi.org/10.1016/j.giec.2022.02.001)  
   *endoskopia* — ECPW po rekonstrukcjach Roux-en-Y: techniki dostępu do brodawki
55. Gkolfakis P, Papaefthymiou A, Facciorusso A, Tziatzios G, Ramai D, Dritsas S, et al. Comparison between Enteroscopy-, Laparoscopy- and Endoscopic Ultrasound-Assisted Endoscopic Retrograde Cholangio-Pancreatography in Patients with Surgically Altered Anatomy: A Systematic Review and Meta-Analysis. Life (Basel). 2022;12(10). [PubMed 36295081](https://pubmed.ncbi.nlm.nih.gov/36295081/) · [doi:10.3390/life12101646](https://doi.org/10.3390/life12101646)  
   *endoskopia* — Metaanaliza ECPW w zmienionej anatomii: enteroskopia vs laparoskopia vs EDGE
56. Gustavsson S, Ilstrup DM, Morrison P, Kelly KA. Roux-Y stasis syndrome after gastrectomy. Am J Surg. 1988;155(3):490-4. [PubMed 3344916](https://pubmed.ncbi.nlm.nih.gov/3344916/) · [doi:10.1016/s0002-9610(88)80120-x](https://doi.org/10.1016/s0002-9610(88)80120-x)  
   *wyniki badań* — Zespół zastoju w pętli Roux częstszy po zespoleniu żołądkowo-jelitowym
57. Chan DC, Fan YM, Lin CK, Chen CJ, Chen CY, Chao YC. Roux-en-Y reconstruction after distal gastrectomy to reduce enterogastric reflux and Helicobacter pylori infection. J Gastrointest Surg. 2007;11(12):1732-40. [PubMed 17876675](https://pubmed.ncbi.nlm.nih.gov/17876675/) · [doi:10.1007/s11605-007-0302-0](https://doi.org/10.1007/s11605-007-0302-0)  
   *wyniki badań* — Roux-en-Y: znacznie mniej refluksu jelitowo-żołądkowego niż Billroth II

### Gastrektomia całkowita z rekonstrukcją Roux-en-Y (`tg`)

58. Hutchison RL, Hutchison AL. César Roux and his original 1893 paper. Obes Surg. 2010;20(7):953-6. [PubMed 20373047](https://pubmed.ncbi.nlm.nih.gov/20373047/) · [doi:10.1007/s11695-010-0141-z](https://doi.org/10.1007/s11695-010-0141-z)  
   *opis oryginalny* — Oryginalna praca Roux (1893) w tłumaczeniu angielskim
59. Japanese Gastric Cancer Association. Japanese Gastric Cancer Treatment Guidelines 2021 (6th edition). Gastric Cancer. 2023;26(1):1-25. [PubMed 36342574](https://pubmed.ncbi.nlm.nih.gov/36342574/) · [doi:10.1007/s10120-022-01331-8](https://doi.org/10.1007/s10120-022-01331-8)  
   *wytyczne / konsensus* — Wytyczne JGCA: gastrektomia całkowita i rekonstrukcja Roux-en-Y
60. Donovan IA, Fielding JW, Bradby H, Sorgi M, Harding LK. Bile diversion after total gastrectomy. Br J Surg. 1982;69(7):389-90. [PubMed 7104607](https://pubmed.ncbi.nlm.nih.gov/7104607/) · [doi:10.1002/bjs.1800690711](https://doi.org/10.1002/bjs.1800690711)  
   *technika* — Pętla Roux ≥40 cm zapobiega refluksowi żółci do przełyku
61. Zhang LY, Irani S, Khashab MA. Biliary Endoscopy in Altered Anatomy. Gastrointest Endosc Clin N Am. 2022;32(3):563-82. [PubMed 35691697](https://pubmed.ncbi.nlm.nih.gov/35691697/) · [doi:10.1016/j.giec.2022.02.001](https://doi.org/10.1016/j.giec.2022.02.001)  
   *endoskopia* — ECPW po Roux-en-Y: brodawka osiągalna tylko wstecznie od strony dystalnej
62. Gkolfakis P, Papaefthymiou A, Facciorusso A, Tziatzios G, Ramai D, Dritsas S, et al. Comparison between Enteroscopy-, Laparoscopy- and Endoscopic Ultrasound-Assisted Endoscopic Retrograde Cholangio-Pancreatography in Patients with Surgically Altered Anatomy: A Systematic Review and Meta-Analysis. Life (Basel). 2022;12(10). [PubMed 36295081](https://pubmed.ncbi.nlm.nih.gov/36295081/) · [doi:10.3390/life12101646](https://doi.org/10.3390/life12101646)  
   *endoskopia* — Metaanaliza ECPW w zmienionej anatomii, w tym po Roux-en-Y
63. Gustavsson S, Ilstrup DM, Morrison P, Kelly KA. Roux-Y stasis syndrome after gastrectomy. Am J Surg. 1988;155(3):490-4. [PubMed 3344916](https://pubmed.ncbi.nlm.nih.gov/3344916/) · [doi:10.1016/s0002-9610(88)80120-x](https://doi.org/10.1016/s0002-9610(88)80120-x)  
   *wyniki badań* — Zastój rzadki po zespoleniu przełykowo-jelitowym; pętle >40 cm zwiększają ryzyko

### Gastroenterostomia omijająca (`gebp`)

64. Jue TL, Storm AC, Naveed M, Fishman DS, Qumseya BJ, McRee AJ, et al.; ASGE Standards of Practice Committee; (ASGE Standards of Practice Committee Chair, 2017-2020). ASGE guideline on the role of endoscopy in the management of benign and malignant gastroduodenal obstruction. Gastrointest Endosc. 2021;93(2):309-322.e4. [PubMed 33168194](https://pubmed.ncbi.nlm.nih.gov/33168194/) · [doi:10.1016/j.gie.2020.07.063](https://doi.org/10.1016/j.gie.2020.07.063)  
   *wytyczne / konsensus* — ASGE: gastroenterostomia chirurgiczna vs stent w niedrożności żołądkowo-dwunastniczej
65. van der Merwe SW, van Wanrooij RLJ, Bronswijk M, Everett S, Lakhtakia S, Rimbas M, et al. Therapeutic endoscopic ultrasound: European Society of Gastrointestinal Endoscopy (ESGE) Guideline. Endoscopy. 2022;54(2):185-205. [PubMed 34937098](https://pubmed.ncbi.nlm.nih.gov/34937098/) · [doi:10.1055/a-1717-1391](https://doi.org/10.1055/a-1717-1391)  
   *wytyczne / konsensus* — ESGE: EUS-GE alternatywą dla stentu lub operacji w złośliwej niedrożności odźwiernika
66. Lillemoe KD, Cameron JL, Hardacre JM, Sohn TA, Sauter PK, Coleman J, et al. Is prophylactic gastrojejunostomy indicated for unresectable periampullary cancer? A prospective randomized trial. Ann Surg. 1999;230(3):322-8; discussion 328-30. [PubMed 10493479](https://pubmed.ncbi.nlm.nih.gov/10493479/) · [doi:10.1097/00000658-199909000-00005](https://doi.org/10.1097/00000658-199909000-00005)  
   *wyniki badań* — RCT: profilaktyczna gastrojejunostomia w nieoperacyjnym raku okołobrodawkowym
67. Jeurnink SM, Steyerberg EW, van Hooft JE, van Eijck CH, Schwartz MP, Vleggaar FP, et al.; Dutch SUSTENT Study Group. Surgical gastrojejunostomy or endoscopic stent placement for the palliation of malignant gastric outlet obstruction (SUSTENT study): a multicenter randomized trial. Gastrointest Endosc. 2010;71(3):490-9. [PubMed 20003966](https://pubmed.ncbi.nlm.nih.gov/20003966/) · [doi:10.1016/j.gie.2009.09.042](https://doi.org/10.1016/j.gie.2009.09.042)  
   *wyniki badań* — RCT SUSTENT: stent przy krótkim przeżyciu, gastrojejunostomia przy przeżyciu ≥2 miesięcy

## Bariatria

### Rękawowa resekcja żołądka (sleeve gastrectomy) (`sleeve`)

68. Regan JP, Inabnet WB, Gagner M, Pomp A. Early experience with two-stage laparoscopic Roux-en-Y gastric bypass as an alternative in the super-super obese patient. Obes Surg. 2003;13(6):861-4. [PubMed 14738671](https://pubmed.ncbi.nlm.nih.gov/14738671/) · [doi:10.1381/096089203322618669](https://doi.org/10.1381/096089203322618669)  
   *opis oryginalny* — Pierwszy opis laparoskopowej SG jako pierwszego etapu leczenia otyłości olbrzymiej (zespół Gagnera).
69. Rosenthal RJ, Diaz AA, Arvidsson D, Baker RS, Basso N, Bellanger D, et al.; International Sleeve Gastrectomy Expert Panel. International Sleeve Gastrectomy Expert Panel Consensus Statement: best practice guidelines based on experience of >12,000 cases. Surg Obes Relat Dis. 2012;8(1):8-19. [PubMed 22248433](https://pubmed.ncbi.nlm.nih.gov/22248433/) · [doi:10.1016/j.soard.2011.10.019](https://doi.org/10.1016/j.soard.2011.10.019)  
   *wytyczne / konsensus* — Konsensus SG: resekcja od 2–6 cm przed odźwiernikiem, sonda kalibracyjna 32–36 Fr.
70. Ali M, El Chaar M, Ghiassi S, Rogers AM; American Society for Metabolic and Bariatric Surgery Clinical Issues Committee. American Society for Metabolic and Bariatric Surgery updated position statement on sleeve gastrectomy as a bariatric procedure. Surg Obes Relat Dis. 2017;13(10):1652-7. [PubMed 29054173](https://pubmed.ncbi.nlm.nih.gov/29054173/) · [doi:10.1016/j.soard.2017.08.007](https://doi.org/10.1016/j.soard.2017.08.007)  
   *wytyczne / konsensus* — Stanowisko ASMBS: SG jako samodzielny zabieg; refluks żołądkowo-przełykowy po rękawie.
71. Fisher OM, Chan DL, Talbot ML, Ramos A, Bashir A, Herrera MF, et al. Barrett's Oesophagus and Bariatric/Metabolic Surgery-IFSO 2020 Position Statement. Obes Surg. 2021;31(3):915-34. [PubMed 33460005](https://pubmed.ncbi.nlm.nih.gov/33460005/) · [doi:10.1007/s11695-020-05143-6](https://doi.org/10.1007/s11695-020-05143-6)  
   *wytyczne / konsensus* — IFSO: przełyk Barretta a chirurgia bariatryczna — ocena przełyku w obserwacji odległej.
72. Brown WA, Johari Halim Shah Y, Balalis G, Bashir A, Ramos A, Kow L, et al. IFSO Position Statement on the Role of Esophago-Gastro-Duodenal Endoscopy Prior to and after Bariatric and Metabolic Surgery Procedures. Obes Surg. 2020;30(8):3135-53. [PubMed 32472360](https://pubmed.ncbi.nlm.nih.gov/32472360/) · [doi:10.1007/s11695-020-04720-z](https://doi.org/10.1007/s11695-020-04720-z)  
   *endoskopia* — IFSO: endoskopia przed i po zabiegach bariatrycznych, w tym kontrola po SG.
73. Jaruvongvanich V, Matar R, Beran A, Maselli DB, Storm AC, Gómez V, et al. A protocolized approach to endoscopic hydrostatic versus pneumatic balloon dilation therapy for gastric sleeve stenosis: a multicenter study and meta-analysis. Surg Obes Relat Dis. 2020;16(10):1543-53. [PubMed 32641283](https://pubmed.ncbi.nlm.nih.gov/32641283/) · [doi:10.1016/j.soard.2020.05.009](https://doi.org/10.1016/j.soard.2020.05.009)  
   *endoskopia* — Zwężenie rękawa (0,7–4%): endoskopowe rozszerzanie balonem hydrostatycznym lub pneumatycznym.
74. Yeung KTD, Penney N, Ashrafian L, Darzi A, Ashrafian H. Does Sleeve Gastrectomy Expose the Distal Esophagus to Severe Reflux?: A Systematic Review and Meta-analysis. Ann Surg. 2020;271(2):257-65. [PubMed 30921053](https://pubmed.ncbi.nlm.nih.gov/30921053/) · [doi:10.1097/SLA.0000000000003275](https://doi.org/10.1097/SLA.0000000000003275)  
   *wyniki badań* — Metaanaliza: częsty refluks de novo, zapalenie przełyku i przełyk Barretta po SG.
75. Oshiro T, Ohta M, Nabekura T, Seki Y, Nagao Y, Tsuboi K, et al. Staple line leakage after laparoscopic sleeve gastrectomy in Japan: a nationwide survey. Surg Today. 2025;55(11):1535-41. [PubMed 40369377](https://pubmed.ncbi.nlm.nih.gov/40369377/) · [doi:10.1007/s00595-025-03057-3](https://doi.org/10.1007/s00595-025-03057-3)  
   *wyniki badań* — Przeciek z linii zszywek po SG w ponad 90% przy kącie Hisa.

### Pomostowanie żołądkowe Roux-en-Y (RYGB) (`rygb`)

76. Mason EE, Ito C. Gastric bypass in obesity. Surg Clin North Am. 1967;47(6):1345-51. [PubMed 6073761](https://pubmed.ncbi.nlm.nih.gov/6073761/) · [doi:10.1016/s0039-6109(16)38384-0](https://doi.org/10.1016/s0039-6109(16)38384-0)  
   *opis oryginalny* — Oryginalny opis pomostowania żołądkowego (gastric bypass) w leczeniu otyłości.
77. Wittgrove AC, Clark GW, Tremblay LJ. Laparoscopic Gastric Bypass, Roux-en-Y: Preliminary Report of Five Cases. Obes Surg. 1994;4(4):353-7. [PubMed 10742801](https://pubmed.ncbi.nlm.nih.gov/10742801/) · [doi:10.1381/096089294765558331](https://doi.org/10.1381/096089294765558331)  
   *opis oryginalny* — Pierwszy opis laparoskopowego RYGB z zespoleniem GJ na pętli Roux.
78. Mahawar KK, Kumar P, Parmar C, Graham Y, Carr WR, Jennings N, et al. Small Bowel Limb Lengths and Roux-en-Y Gastric Bypass: a Systematic Review. Obes Surg. 2016;26(3):660-71. [PubMed 26749410](https://pubmed.ncbi.nlm.nih.gov/26749410/) · [doi:10.1007/s11695-016-2050-2](https://doi.org/10.1007/s11695-016-2050-2)  
   *technika* — Długości pętli Roux i biliopankreatycznej w RYGB; łącznie optymalnie 100–200 cm.
79. Shah RJ, Smolkin M, Yen R, Ross A, Kozarek RA, Howell DA, et al. A multicenter, U.S. experience of single-balloon, double-balloon, and rotational overtube-assisted enteroscopy ERCP in patients with surgically altered pancreaticobiliary anatomy (with video). Gastrointest Endosc. 2013;77(4):593-600. [PubMed 23290720](https://pubmed.ncbi.nlm.nih.gov/23290720/) · [doi:10.1016/j.gie.2012.10.015](https://doi.org/10.1016/j.gie.2012.10.015)  
   *endoskopia* — ERCP wspomagane enteroskopią balonową w anatomii z długą pętlą, w tym po RYGB.
80. Evans JA, Muthusamy VR, Acosta RD, Bruining DH, Chandrasekhara V, Chathadi KV, et al.; American Society for Gastrointestinal Endoscopy Standards of Practice Committee. The role of endoscopy in the bariatric surgery patient. Gastrointest Endosc. 2015;81(5):1063-72. [PubMed 25733126](https://pubmed.ncbi.nlm.nih.gov/25733126/) · [doi:10.1016/j.gie.2014.09.044](https://doi.org/10.1016/j.gie.2014.09.044)  
   *endoskopia* — Wytyczne ASGE: endoskopia po RYGB — owrzodzenie brzeżne, zwężenie GJ, dostęp do ERCP.
81. Kedia P, Tyberg A, Kumta NA, Gaidhane M, Karia K, Sharaiha RZ, et al. EUS-directed transgastric ERCP for Roux-en-Y gastric bypass anatomy: a minimally invasive approach. Gastrointest Endosc. 2015;82(3):560-5. [PubMed 25952086](https://pubmed.ncbi.nlm.nih.gov/25952086/) · [doi:10.1016/j.gie.2015.03.1913](https://doi.org/10.1016/j.gie.2015.03.1913)  
   *endoskopia* — EDGE: ERCP przez żołądek wyłączony po założeniu stentu LAMS z dostępu EUS.
82. Kedia P, Tarnasky PR, Nieto J, Steele SL, Siddiqui A, Xu MM, et al. EUS-directed Transgastric ERCP (EDGE) Versus Laparoscopy-assisted ERCP (LA-ERCP) for Roux-en-Y Gastric Bypass (RYGB) Anatomy: A Multicenter Early Comparative Experience of Clinical Outcomes. J Clin Gastroenterol. 2019;53(4):304-8. [PubMed 29668560](https://pubmed.ncbi.nlm.nih.gov/29668560/) · [doi:10.1097/MCG.0000000000001037](https://doi.org/10.1097/MCG.0000000000001037)  
   *endoskopia* — EDGE vs ERCP wspomagane laparoskopowo po RYGB: podobna skuteczność, krótszy zabieg i pobyt.
83. Coblijn UK, Goucham AB, Lagarde SM, Kuiken SD, van Wagensveld BA. Development of ulcer disease after Roux-en-Y gastric bypass, incidence, risk factors, and patient presentation: a systematic review. Obes Surg. 2014;24(2):299-309. [PubMed 24234733](https://pubmed.ncbi.nlm.nih.gov/24234733/) · [doi:10.1007/s11695-013-1118-5](https://doi.org/10.1007/s11695-013-1118-5)  
   *wyniki badań* — Owrzodzenie brzeżne na GJ po RYGB: częstość ok. 4,6%, czynniki ryzyka.

### Jednozespoleniowe pomostowanie żołądkowe (OAGB / MGB) (`oagb`)

84. Rutledge R. The mini-gastric bypass: experience with the first 1,274 cases. Obes Surg. 2001;11(3):276-80. [PubMed 11433900](https://pubmed.ncbi.nlm.nih.gov/11433900/) · [doi:10.1381/096089201321336584](https://doi.org/10.1381/096089201321336584)  
   *opis oryginalny* — Oryginalny opis mini-gastric bypass: długi wąski zbiornik i pętla omega.
85. Carbajo M, García-Caballero M, Toledano M, Osorio D, García-Lanza C, Carmona JA. One-anastomosis gastric bypass by laparoscopy: results of the first 209 patients. Obes Surg. 2005;15(3):398-404. [PubMed 15826476](https://pubmed.ncbi.nlm.nih.gov/15826476/) · [doi:10.1381/0960892053576677](https://doi.org/10.1381/0960892053576677)  
   *opis oryginalny* — OAGB: zbiornik wzdłuż krzywizny mniejszej, zespolenie boczne z pętlą 200 cm od Treitza.
86. De Luca M, Piatto G, Merola G, Himpens J, Chevallier JM, Carbajo MA, et al. IFSO Update Position Statement on One Anastomosis Gastric Bypass (OAGB). Obes Surg. 2021;31(7):3251-78. [PubMed 33939059](https://pubmed.ncbi.nlm.nih.gov/33939059/) · [doi:10.1007/s11695-021-05413-x](https://doi.org/10.1007/s11695-021-05413-x)  
   *wytyczne / konsensus* — Stanowisko IFSO: OAGB jako uznany zabieg bariatryczny; technika, powikłania, obserwacja.
87. Bhasker AG, Prasad A, Shah S, Parmar C; OAGB-MGB Consensus Contributors. MGB-OAGB International Club-Results of a Modified Delphi Consensus on Controversies in OAGB. Obes Surg. 2024;34(12):4541-54. [PubMed 39560893](https://pubmed.ncbi.nlm.nih.gov/39560893/) · [doi:10.1007/s11695-024-07563-0](https://doi.org/10.1007/s11695-024-07563-0)  
   *technika* — Konsensus Delphi: pętla biliopankreatyczna 150–200 cm, dostosowana do ryzyka niedożywienia.
88. Robert M, Espalieu P, Pelascini E, Caiazzo R, Sterkers A, Khamphommala L, et al. Efficacy and safety of one anastomosis gastric bypass versus Roux-en-Y gastric bypass for obesity (YOMEGA): a multicentre, randomised, open-label, non-inferiority trial. Lancet. 2019;393(10178):1299-309. [PubMed 30851879](https://pubmed.ncbi.nlm.nih.gov/30851879/) · [doi:10.1016/S0140-6736(19)30475-1](https://doi.org/10.1016/S0140-6736(19)30475-1)  
   *wyniki badań* — RCT YOMEGA: OAGB z pętlą 200 cm — więcej powikłań odżywczych niż RYGB.
89. Mitra A, Bhambri A, Fehervari M, Parmar C. Long-Term Outcomes of One Anastomosis Gastric Bypass: A Systematic Review and Meta-Analysis of 5-Year and Beyond. Obes Surg. 2026;36(1):71-87. [PubMed 41094294](https://pubmed.ncbi.nlm.nih.gov/41094294/) · [doi:10.1007/s11695-025-08339-w](https://doi.org/10.1007/s11695-025-08339-w)  
   *wyniki badań* — Metaanaliza ≥5 lat po OAGB: refluks żółciowy ok. 4%, owrzodzenie brzeżne ok. 2%.

### Przełączenie dwunastnicze — warianty (`ds`)

90. Marceau P, Biron S, Bourque RA, Potvin M, Hould FS, Simard S. Biliopancreatic Diversion with a New Type of Gastrectomy. Obes Surg. 1993;3(1):29-35. [PubMed 10757900](https://pubmed.ncbi.nlm.nih.gov/10757900/) · [doi:10.1381/096089293765559728](https://doi.org/10.1381/096089293765559728)  
   *opis oryginalny* — Gastrektomia „parietalna” (rękaw) z odźwiernikiem i zespoleniem dwunastniczo-krętniczym — prekursor DS.
91. Parrott J, Frank L, Rabena R, Craggs-Dino L, Isom KA, Greiman L. American Society for Metabolic and Bariatric Surgery Integrated Health Nutritional Guidelines for the Surgical Weight Loss Patient 2016 Update: Micronutrients. Surg Obes Relat Dis. 2017;13(5):727-41. [PubMed 28392254](https://pubmed.ncbi.nlm.nih.gov/28392254/) · [doi:10.1016/j.soard.2016.12.018](https://doi.org/10.1016/j.soard.2016.12.018)  
   *wytyczne / konsensus* — Wytyczne ASMBS: suplementacja i kontrola niedoborów (A, D, E, K, żelazo, wapń) po BPD/DS.

*Tylko wariant `sadis`:*

92. Sánchez-Pernaute A, Rubio Herrera MA, Pérez-Aguirre E, García Pérez JC, Cabrerizo L, Díez Valladares L, et al. Proximal duodenal-ileal end-to-side bypass with sleeve gastrectomy: proposed technique. Obes Surg. 2007;17(12):1614-8. [PubMed 18040751](https://pubmed.ncbi.nlm.nih.gov/18040751/) · [doi:10.1007/s11695-007-9287-8](https://doi.org/10.1007/s11695-007-9287-8)  
   *opis oryginalny* — Oryginalny opis SADI-S: rękaw i zespolenie dwunastniczo-krętnicze koniec-do-boku, pętla omega.
93. Kallies K, Rogers AM; American Society for Metabolic and Bariatric Surgery Clinical Issues Committee. American Society for Metabolic and Bariatric Surgery updated statement on single-anastomosis duodenal switch. Surg Obes Relat Dis. 2020;16(7):825-30. [PubMed 32371036](https://pubmed.ncbi.nlm.nih.gov/32371036/) · [doi:10.1016/j.soard.2020.03.020](https://doi.org/10.1016/j.soard.2020.03.020)  
   *wytyczne / konsensus* — Stanowisko ASMBS 2020: SADI-S zaakceptowany jako zabieg bariatryczny; przegląd techniki i wyników.
94. Brown WA, de Leon Ballesteros GP, Ooi G, Higa K, Himpens J, Torres A, et al.; IFSO appointed task force reviewing the literature on SADI-S/OADS. Single Anastomosis Duodenal-Ileal Bypass with Sleeve Gastrectomy/One Anastomosis Duodenal Switch (SADI-S/OADS) IFSO Position Statement-Update 2020. Obes Surg. 2021;31(1):3-25. [PubMed 33409979](https://pubmed.ncbi.nlm.nih.gov/33409979/) · [doi:10.1007/s11695-020-05134-7](https://doi.org/10.1007/s11695-020-05134-7)  
   *wytyczne / konsensus* — Stanowisko IFSO 2020: SADI-S/OADS — wskazania, technika, konieczność długoterminowej opieki.
95. Sánchez-Pernaute A, Rubio MÁ, Cabrerizo L, Ramos-Levi A, Pérez-Aguirre E, Torres A. Single-anastomosis duodenoileal bypass with sleeve gastrectomy (SADI-S) for obese diabetic patients. Surg Obes Relat Dis. 2015;11(5):1092-8. [PubMed 26048517](https://pubmed.ncbi.nlm.nih.gov/26048517/) · [doi:10.1016/j.soard.2015.01.024](https://doi.org/10.1016/j.soard.2015.01.024)  
   *technika* — Technika SADI-S: sonda 54 Fr, wspólna pętla wydłużona z 200 do 250 cm.
96. Sánchez-Pernaute A, Herrera MÁR, Ferré NP, Rodríguez CS, Marcuello C, Pañella C, et al. Long-Term Results of Single-Anastomosis Duodeno-ileal Bypass with Sleeve Gastrectomy (SADI-S). Obes Surg. 2022;32(3):682-9. [PubMed 35032311](https://pubmed.ncbi.nlm.nih.gov/35032311/) · [doi:10.1007/s11695-021-05879-9](https://doi.org/10.1007/s11695-021-05879-9)  
   *wyniki badań* — Wyniki 10-letnie SADI-S; wspólna pętla 200–300 cm, rewizje z powodu hipoproteinemii.
97. Sánchez-Pernaute A, Lasses B, Antoñanzas LL, Rubio MÁ, Marcuello C, Ferré NP, et al. Revisional surgery for malnutrition after SADI-S: prevalence, indications, techniques and outcomes. Updates Surg. 2024;76(5):1879-85. [PubMed 38805173](https://pubmed.ncbi.nlm.nih.gov/38805173/) · [doi:10.1007/s13304-024-01900-9](https://doi.org/10.1007/s13304-024-01900-9)  
   *wyniki badań* — Niedożywienie po SADI-S z krótką pętlą: rewizje, najczęściej wydłużenie wspólnej pętli.

*Tylko wariant `bpdds`:*

98. Hess DS, Hess DW. Biliopancreatic diversion with a duodenal switch. Obes Surg. 1998;8(3):267-82. [PubMed 9678194](https://pubmed.ncbi.nlm.nih.gov/9678194/) · [doi:10.1381/096089298765554476](https://doi.org/10.1381/096089298765554476)  
   *opis oryginalny* — Oryginalny opis BPD-DS (Hess): rękaw z zachowanym odźwiernikiem, bez owrzodzeń brzeżnych.
99. Marceau P, Hould FS, Simard S, Lebel S, Bourque RA, Potvin M, et al. Biliopancreatic diversion with duodenal switch. World J Surg. 1998;22(9):947-54. [PubMed 9717420](https://pubmed.ncbi.nlm.nih.gov/9717420/) · [doi:10.1007/s002689900498](https://doi.org/10.1007/s002689900498)  
   *opis oryginalny* — BPD-DS (Marceau): rękaw zamiast resekcji dystalnej, kanał wspólny 100 cm, mniej niedoborów.
100. Ren CJ, Patterson E, Gagner M. Early results of laparoscopic biliopancreatic diversion with duodenal switch: a case series of 40 consecutive patients. Obes Surg. 2000;10(6):514-23; discussion 524. [PubMed 11175958](https://pubmed.ncbi.nlm.nih.gov/11175958/) · [doi:10.1381/096089200321593715](https://doi.org/10.1381/096089200321593715)  
   *technika* — Laparoskopowy BPD-DS: rękaw, zespolenie z dystalnymi 250 cm jelita krętego, kanał wspólny 100 cm.
101. Søvik TT, Aasheim ET, Taha O, Engström M, Fagerland MW, Björkman S, et al. Weight loss, cardiovascular risk factors, and quality of life after gastric bypass and duodenal switch: a randomized trial. Ann Intern Med. 2011;155(5):281-91. [PubMed 21893621](https://pubmed.ncbi.nlm.nih.gov/21893621/) · [doi:10.7326/0003-4819-155-5-201109060-00005](https://doi.org/10.7326/0003-4819-155-5-201109060-00005)  
   *wyniki badań* — RCT DS vs RYGB: większa utrata masy, więcej niedoborów (wit. A, D) po DS.

### Wyłączenie żółciowo-trzustkowe sposobem Scopinaro (`bpd`)

102. Scopinaro N, Gianetta E, Civalleri D, Bonalumi U, Bachi V. Bilio-pancreatic bypass for obesity: 1. An experimental study in dogs. Br J Surg. 1979;66(9):613-7. [PubMed 497644](https://pubmed.ncbi.nlm.nih.gov/497644/) · [doi:10.1002/bjs.1800660905](https://doi.org/10.1002/bjs.1800660905)  
   *opis oryginalny* — Oryginalny opis BPD (Scopinaro), cz. I: badanie doświadczalne na psach.
103. Scopinaro N, Gianetta E, Civalleri D, Bonalumi U, Bachi V. Bilio-pancreatic bypass for obesity: II. Initial experience in man. Br J Surg. 1979;66(9):618-20. [PubMed 497645](https://pubmed.ncbi.nlm.nih.gov/497645/) · [doi:10.1002/bjs.1800660906](https://doi.org/10.1002/bjs.1800660906)  
   *opis oryginalny* — BPD cz. II: pierwsze zastosowanie u ludzi, krótki wspólny odcinek jelita krętego.
104. Parrott J, Frank L, Rabena R, Craggs-Dino L, Isom KA, Greiman L. American Society for Metabolic and Bariatric Surgery Integrated Health Nutritional Guidelines for the Surgical Weight Loss Patient 2016 Update: Micronutrients. Surg Obes Relat Dis. 2017;13(5):727-41. [PubMed 28392254](https://pubmed.ncbi.nlm.nih.gov/28392254/) · [doi:10.1016/j.soard.2016.12.018](https://doi.org/10.1016/j.soard.2016.12.018)  
   *wytyczne / konsensus* — Wytyczne ASMBS: suplementacja mikroskładników i kontrola niedoborów po BPD.
105. Scopinaro N, Gianetta E, Adami GF, Friedman D, Traverso E, Marinari GM, et al. Biliopancreatic diversion for obesity at eighteen years. Surgery. 1996;119(3):261-8. [PubMed 8619180](https://pubmed.ncbi.nlm.nih.gov/8619180/) · [doi:10.1016/s0039-6060(96)80111-5](https://doi.org/10.1016/s0039-6060(96)80111-5)  
   *technika* — BPD „ad hoc stomach”: żołądek 200–500 ml, pętla alimentacyjna 200 cm, wspólna 50 cm.
106. Scopinaro N, Adami GF, Marinari GM, Gianetta E, Traverso E, Friedman D, et al. Biliopancreatic diversion. World J Surg. 1998;22(9):936-46. [PubMed 9717419](https://pubmed.ncbi.nlm.nih.gov/9717419/) · [doi:10.1007/s002689900497](https://doi.org/10.1007/s002689900497)  
   *wyniki badań* — BPD po 21 latach: owrzodzenie brzeżne, niedokrwistość, niedożywienie białkowe — konieczna suplementacja.

## Trzustka i drogi żółciowe

### Pankreatoduodenektomia sposobem Whipple’a — warianty zespolenia trzustkowego (`whip`)

107. Whipple AO, Parsons WB, Mullins CR. Treatment of carcinoma of the ampulla of Vater. Ann Surg. 1935;102(4):763-79. [PubMed 17856666](https://pubmed.ncbi.nlm.nih.gov/17856666/) · [doi:10.1097/00000658-193510000-00023](https://doi.org/10.1097/00000658-193510000-00023)  
   *opis oryginalny* — Opis oryginalny pankreatoduodenektomii (Whipple, Parsons, Mullins 1935)
108. Pennazio M, Rondonotti E, Despott EJ, Dray X, Keuchel M, Moreels T, et al. Small-bowel capsule endoscopy and device-assisted enteroscopy for diagnosis and treatment of small-bowel disorders: European Society of Gastrointestinal Endoscopy (ESGE) Guideline - Update 2022. Endoscopy. 2023;55(1):58-95. [PubMed 36423618](https://pubmed.ncbi.nlm.nih.gov/36423618/) · [doi:10.1055/a-1973-3796](https://doi.org/10.1055/a-1973-3796)  
   *wytyczne / konsensus* — ESGE: ECPW wspomagana enteroskopem jako pierwszy wybór w zmienionej anatomii
109. Child CG. Pancreaticojejunostomy and Other Problems Associated With the Surgical Management of Carcinoma Involving the Head of the Pancreas: Report of Five Additional Cases of Radical Pancreaticoduodenectomy. Ann Surg. 1944;119(6):845-55. [PubMed 17858411](https://pubmed.ncbi.nlm.nih.gov/17858411/) · [doi:10.1097/00000658-194406000-00004](https://doi.org/10.1097/00000658-194406000-00004)  
   *technika* — Rekonstrukcja Childa na jednej pętli: kolejno PJ, HJ, GJ
110. Schorn S, Demir IE, Vogel T, Schirren R, Reim D, Wilhelm D, et al. Mortality and postoperative complications after different types of surgical reconstruction following pancreaticoduodenectomy-a systematic review with meta-analysis. Langenbecks Arch Surg. 2019;404(2):141-57. [PubMed 30820662](https://pubmed.ncbi.nlm.nih.gov/30820662/) · [doi:10.1007/s00423-019-01762-5](https://doi.org/10.1007/s00423-019-01762-5)  
   *technika* — Porównanie typów rekonstrukcji po PD; rekonstrukcja Childa jako standard
111. Chahal P, Baron TH, Topazian MD, Petersen BT, Levy MJ, Gostout CJ. Endoscopic retrograde cholangiopancreatography in post-Whipple patients. Endoscopy. 2006;38(12):1241-5. [PubMed 17163326](https://pubmed.ncbi.nlm.nih.gov/17163326/) · [doi:10.1055/s-2006-945003](https://doi.org/10.1055/s-2006-945003)  
   *endoskopia* — ECPW po operacji Whipple'a: dotarcie pętlą doprowadzającą do HJ
112. Han S, Kolb JM, Edmundowicz SA, Attwell AR, Hammad HT, Wani S, et al. The Success and Safety of Endoscopic Retrograde Cholangiopancreatography in Surgically Altered Gastrointestinal Anatomy. Med Sci (Basel). 2025;13(1). [PubMed 39982243](https://pubmed.ncbi.nlm.nih.gov/39982243/) · [doi:10.3390/medsci13010018](https://doi.org/10.3390/medsci13010018)  
   *endoskopia* — Skuteczność i bezpieczeństwo ECPW w zmienionej anatomii, w tym dotarcie do HJ
113. Cheng Y, Briarava M, Lai M, Wang X, Tu B, Cheng N, et al. Pancreaticojejunostomy versus pancreaticogastrostomy reconstruction for the prevention of postoperative pancreatic fistula following pancreaticoduodenectomy. Cochrane Database Syst Rev. 2017;9(9):CD012257. [PubMed 28898386](https://pubmed.ncbi.nlm.nih.gov/28898386/) · [doi:10.1002/14651858.CD012257.pub2](https://doi.org/10.1002/14651858.CD012257.pub2)  
   *wyniki badań* — PG vs PJ (Cochrane): brak wyraźnej różnicy w częstości przetoki trzustkowej
114. Varghese C, Bhat S, Wang TH, O'Grady G, Pandanaboyana S. Impact of gastric resection and enteric anastomotic configuration on delayed gastric emptying after pancreaticoduodenectomy: a network meta-analysis of randomized trials. BJS Open. 2021;5(3). [PubMed 33989392](https://pubmed.ncbi.nlm.nih.gov/33989392/) · [doi:10.1093/bjsopen/zrab035](https://doi.org/10.1093/bjsopen/zrab035)  
   *wyniki badań* — Zakres resekcji żołądka i droga GJ (przed-/zaokrężnicza) a opóźnione opróżnianie żołądka

### Pankreatoduodenektomia z zachowaniem odźwiernika (Traverso-Longmire) (`pppd`)

115. Traverso LW, Longmire WP. Preservation of the pylorus in pancreaticoduodenectomy. Surg Gynecol Obstet. 1978;146(6):959-62. [PubMed 653575](https://pubmed.ncbi.nlm.nih.gov/653575/)  
   *opis oryginalny* — Opis oryginalny PD z zachowaniem odźwiernika (Traverso-Longmire)
116. Wente MN, Bassi C, Dervenis C, Fingerhut A, Gouma DJ, Izbicki JR, et al. Delayed gastric emptying (DGE) after pancreatic surgery: a suggested definition by the International Study Group of Pancreatic Surgery (ISGPS). Surgery. 2007;142(5):761-8. [PubMed 17981197](https://pubmed.ncbi.nlm.nih.gov/17981197/) · [doi:10.1016/j.surg.2007.05.005](https://doi.org/10.1016/j.surg.2007.05.005)  
   *wytyczne / konsensus* — ISGPS: definicja i stopnie opóźnionego opróżniania żołądka (DGE)
117. Child CG. Pancreaticojejunostomy and Other Problems Associated With the Surgical Management of Carcinoma Involving the Head of the Pancreas: Report of Five Additional Cases of Radical Pancreaticoduodenectomy. Ann Surg. 1944;119(6):845-55. [PubMed 17858411](https://pubmed.ncbi.nlm.nih.gov/17858411/) · [doi:10.1097/00000658-194406000-00004](https://doi.org/10.1097/00000658-194406000-00004)  
   *technika* — Rekonstrukcja Childa na jednej pętli: kolejno PJ, HJ, zespolenie z przewodem pokarmowym
118. Chahal P, Baron TH, Topazian MD, Petersen BT, Levy MJ, Gostout CJ. Endoscopic retrograde cholangiopancreatography in post-Whipple patients. Endoscopy. 2006;38(12):1241-5. [PubMed 17163326](https://pubmed.ncbi.nlm.nih.gov/17163326/) · [doi:10.1055/s-2006-945003](https://doi.org/10.1055/s-2006-945003)  
   *endoskopia* — ECPW po pankreatoduodenektomii: dotarcie pętlą doprowadzającą do HJ
119. Hüttner FJ, Fitzmaurice C, Schwarzer G, Seiler CM, Antes G, Büchler MW, et al. Pylorus-preserving pancreaticoduodenectomy (pp Whipple) versus pancreaticoduodenectomy (classic Whipple) for surgical treatment of periampullary and pancreatic carcinoma. Cochrane Database Syst Rev. 2016;2(2):CD006053. [PubMed 26905229](https://pubmed.ncbi.nlm.nih.gov/26905229/) · [doi:10.1002/14651858.CD006053.pub6](https://doi.org/10.1002/14651858.CD006053.pub6)  
   *wyniki badań* — Cochrane PPPD vs klasyczny Whipple: DGE i wyniki porównywalne
120. Cheng Y, Briarava M, Lai M, Wang X, Tu B, Cheng N, et al. Pancreaticojejunostomy versus pancreaticogastrostomy reconstruction for the prevention of postoperative pancreatic fistula following pancreaticoduodenectomy. Cochrane Database Syst Rev. 2017;9(9):CD012257. [PubMed 28898386](https://pubmed.ncbi.nlm.nih.gov/28898386/) · [doi:10.1002/14651858.CD012257.pub2](https://doi.org/10.1002/14651858.CD012257.pub2)  
   *wyniki badań* — PG vs PJ (Cochrane): brak wyraźnej różnicy w częstości przetoki trzustkowej
121. Hackert T, Probst P, Knebel P, Doerr-Harim C, Bruckner T, Klaiber U, et al. Pylorus Resection Does Not Reduce Delayed Gastric Emptying After Partial Pancreatoduodenectomy: A Blinded Randomized Controlled Trial (PROPP Study, DRKS00004191). Ann Surg. 2018;267(6):1021-7. [PubMed 28885510](https://pubmed.ncbi.nlm.nih.gov/28885510/) · [doi:10.1097/SLA.0000000000002480](https://doi.org/10.1097/SLA.0000000000002480)  
   *wyniki badań* — RCT PROPP: resekcja odźwiernika nie zmniejsza DGE
122. Klaiber U, Probst P, Strobel O, Michalski CW, Dörr-Harim C, Diener MK, et al. Meta-analysis of delayed gastric emptying after pylorus-preserving versus pylorus-resecting pancreatoduodenectomy. Br J Surg. 2018;105(4):339-49. [PubMed 29412453](https://pubmed.ncbi.nlm.nih.gov/29412453/) · [doi:10.1002/bjs.10771](https://doi.org/10.1002/bjs.10771)  
   *wyniki badań* — Metaanaliza: brak istotnej różnicy DGE między PPPD a PRPD

### Pankreatektomia dystalna ze splenektomią (`dp`)

123. Mayo WJ. I. The Surgery of the Pancreas: I. Injuries to the Pancreas in the Course of Operations on the Stomach. II. Injuries to the Pancreas in the Course of Operations on the Spleen. III. Resection of Half the Pancreas for Tumor. Ann Surg. 1913;58(2):145-50. [PubMed 17863043](https://pubmed.ncbi.nlm.nih.gov/17863043/) · [doi:10.1097/00000658-191308000-00001](https://doi.org/10.1097/00000658-191308000-00001)  
   *opis oryginalny* — Wczesny opis resekcji lewej połowy trzustki (Mayo 1913)
124. Davies JM, Lewis MP, Wimperis J, Rafi I, Ladhani S, Bolton-Maggs PH; British Committee for Standards in Haematology. Review of guidelines for the prevention and treatment of infection in patients with an absent or dysfunctional spleen: prepared on behalf of the British Committee for Standards in Haematology by a working party of the Haemato-Oncology task force. Br J Haematol. 2011;155(3):308-17. [PubMed 21988145](https://pubmed.ncbi.nlm.nih.gov/21988145/) · [doi:10.1111/j.1365-2141.2011.08843.x](https://doi.org/10.1111/j.1365-2141.2011.08843.x)  
   *wytyczne / konsensus* — Szczepienia i profilaktyka zakażeń po splenektomii (BCSH)
125. Bassi C, Marchegiani G, Dervenis C, Sarr M, Abu Hilal M, Adham M, et al.; International Study Group on Pancreatic Surgery (ISGPS). The 2016 update of the International Study Group (ISGPS) definition and grading of postoperative pancreatic fistula: 11 Years After. Surgery. 2017;161(3):584-91. [PubMed 28040257](https://pubmed.ncbi.nlm.nih.gov/28040257/) · [doi:10.1016/j.surg.2016.11.014](https://doi.org/10.1016/j.surg.2016.11.014)  
   *wytyczne / konsensus* — ISGPS 2016: definicja i stopnie przetoki trzustkowej z kikuta
126. Warshaw AL. Conservation of the spleen with distal pancreatectomy. Arch Surg. 1988;123(5):550-3. [PubMed 3358679](https://pubmed.ncbi.nlm.nih.gov/3358679/) · [doi:10.1001/archsurg.1988.01400290032004](https://doi.org/10.1001/archsurg.1988.01400290032004)  
   *technika* — Zachowanie śledziony przy pankreatektomii dystalnej (technika Warshawa)
127. Diener MK, Seiler CM, Rossion I, Kleeff J, Glanemann M, Butturini G, et al. Efficacy of stapler versus hand-sewn closure after distal pancreatectomy (DISPACT): a randomised, controlled multicentre trial. Lancet. 2011;377(9776):1514-22. [PubMed 21529927](https://pubmed.ncbi.nlm.nih.gov/21529927/) · [doi:10.1016/S0140-6736(11)60237-7](https://doi.org/10.1016/S0140-6736(11)60237-7)  
   *technika* — DISPACT: zamknięcie kikuta staplerem vs szwem ręcznym, podobny odsetek przetok

### Hepatikojejunostomia na pętli Roux (`hj`)

128. Hepp J, Couinaud C. [Approach to and use of the left hepatic duct in reparation of the common bile duct]. Presse Med. 1956;64(41):947-8. [PubMed 13335941](https://pubmed.ncbi.nlm.nih.gov/13335941/)  
   *opis oryginalny* — Dostęp do przewodu wątrobowego lewego w naprawie dróg żółciowych (Hepp–Couinaud)
129. de'Angelis N, Catena F, Memeo R, Coccolini F, Martínez-Pérez A, Romeo OM, et al. 2020 WSES guidelines for the detection and management of bile duct injury during cholecystectomy. World J Emerg Surg. 2021;16(1):30. [PubMed 34112197](https://pubmed.ncbi.nlm.nih.gov/34112197/) · [doi:10.1186/s13017-021-00369-w](https://doi.org/10.1186/s13017-021-00369-w)  
   *wytyczne / konsensus* — WSES 2020: uszkodzenia dróg żółciowych, naprawa przez HJ na pętli Roux
130. Pennazio M, Rondonotti E, Despott EJ, Dray X, Keuchel M, Moreels T, et al. Small-bowel capsule endoscopy and device-assisted enteroscopy for diagnosis and treatment of small-bowel disorders: European Society of Gastrointestinal Endoscopy (ESGE) Guideline - Update 2022. Endoscopy. 2023;55(1):58-95. [PubMed 36423618](https://pubmed.ncbi.nlm.nih.gov/36423618/) · [doi:10.1055/a-1973-3796](https://doi.org/10.1055/a-1973-3796)  
   *wytyczne / konsensus* — ESGE: ECPW wspomagana enteroskopem jako pierwszy wybór w zmienionej anatomii
131. Lubikowski J, Post M, Białek A, Kordowski J, Milkiewicz P, Wójcicki M. Surgical management and outcome of bile duct injuries following cholecystectomy: a single-center experience. Langenbecks Arch Surg. 2011;396(5):699-707. [PubMed 21336816](https://pubmed.ncbi.nlm.nih.gov/21336816/) · [doi:10.1007/s00423-011-0745-3](https://doi.org/10.1007/s00423-011-0745-3)  
   *technika* — Naprawa uszkodzenia dróg żółciowych przez HJ sposobem Hepp–Couinaud
132. Felder SI, Menon VG, Nissen NN, Margulies DR, Lo S, Colquhoun SD. Hepaticojejunostomy using short-limb Roux-en-Y reconstruction. JAMA Surg. 2013;148(3):253-7; discussion 257-8. [PubMed 23553273](https://pubmed.ncbi.nlm.nih.gov/23553273/) · [doi:10.1001/jamasurg.2013.601](https://doi.org/10.1001/jamasurg.2013.601)  
   *technika* — Długość pętli Roux przy HJ; krótka pętla ułatwia dostęp endoskopowy
133. Fan F, Xu DP, Xiong ZX, Li HJ, Xin HB, Zhao H, et al. Clinical significance of intrapancreatic choledochal cyst excision in surgical management of type I choledochal cyst. J Int Med Res. 2018;46(3):1221-9. [PubMed 29322850](https://pubmed.ncbi.nlm.nih.gov/29322850/) · [doi:10.1177/0300060517728598](https://doi.org/10.1177/0300060517728598)  
   *technika* — Torbiel przewodu żółciowego wspólnego: wycięcie i HJ
134. Han S, Kolb JM, Edmundowicz SA, Attwell AR, Hammad HT, Wani S, et al. The Success and Safety of Endoscopic Retrograde Cholangiopancreatography in Surgically Altered Gastrointestinal Anatomy. Med Sci (Basel). 2025;13(1). [PubMed 39982243](https://pubmed.ncbi.nlm.nih.gov/39982243/) · [doi:10.3390/medsci13010018](https://doi.org/10.3390/medsci13010018)  
   *endoskopia* — ECPW w zmienionej anatomii: dotarcie do HJ przez pętlę Roux
135. Cocca S, Casoni Pattacini G, Grova A, Esposito S, Lupo M, Ferrante M, et al. Biliary drainage in patients with altered anatomy: Literature review of different endoscopic approaches. World J Gastroenterol. 2026;32(2):113071. [PubMed 41551827](https://pubmed.ncbi.nlm.nih.gov/41551827/) · [doi:10.3748/wjg.v32.i2.113071](https://doi.org/10.3748/wjg.v32.i2.113071)  
   *endoskopia* — Drenaż żółci w zmienionej anatomii: enteroskopia, EUS, dostęp przezskórny

### Choledochoduodenostomia bok-do-boku (`cdd`)

136. Escudero-Fabre A, Escallon A, Sack J, Halpern NB, Aldrete JS. Choledochoduodenostomy. Analysis of 71 cases followed for 5 to 15 years. Ann Surg. 1991;213(6):635-42; discussion 643-4. [PubMed 2039295](https://pubmed.ncbi.nlm.nih.gov/2039295/) · [doi:10.1097/00000658-199106000-00014](https://doi.org/10.1097/00000658-199106000-00014)  
   *technika* — Wyniki odległe CDD; warunek: przewód > 16 mm, zespolenie > 14 mm
137. Mavrogiannis C, Liatsos C, Romanos A, Goulas S, Dourakis S, Nakos A, et al. Sump syndrome: endoscopic treatment and late recurrence. Am J Gastroenterol. 1999;94(4):972-5. [PubMed 10201467](https://pubmed.ncbi.nlm.nih.gov/10201467/) · [doi:10.1111/j.1572-0241.1999.998_t.x](https://doi.org/10.1111/j.1572-0241.1999.998_t.x)  
   *endoskopia* — Zespół ślepego worka: leczenie endoskopowe (sfinkterotomia) i nawroty
138. Şal O, Serin KR, Ercan LD, Göksoy B, Al Hajeh A, Ekiz F, et al. Is Endoscopic Sphincterotomy Sufficient in the Treatment of Sump Syndrome? A 25-Year Experience. J Laparoendosc Adv Surg Tech A. 2024;34(5):430-3. [PubMed 38502847](https://pubmed.ncbi.nlm.nih.gov/38502847/) · [doi:10.1089/lap.2023.0519](https://doi.org/10.1089/lap.2023.0519)  
   *endoskopia* — Zespół ślepego worka po CDD: skuteczność sfinkterotomii endoskopowej
139. Leppard WM, Shary TM, Adams DB, Morgan KA. Choledochoduodenostomy: is it really so bad? J Gastrointest Surg. 2011;15(5):754-7. [PubMed 21347871](https://pubmed.ncbi.nlm.nih.gov/21347871/) · [doi:10.1007/s11605-011-1465-2](https://doi.org/10.1007/s11605-011-1465-2)  
   *wyniki badań* — CDD bok-do-boku w chorobach łagodnych bezpieczna; zespół ślepego worka rzadki

### Przewlekłe zapalenie trzustki — operacje drenujące (`drain`)

140. Andersen DK, Frey CF. The evolution of the surgical treatment of chronic pancreatitis. Ann Surg. 2010;251(1):18-32. [PubMed 20009754](https://pubmed.ncbi.nlm.nih.gov/20009754/) · [doi:10.1097/SLA.0b013e3181ae3471](https://doi.org/10.1097/SLA.0b013e3181ae3471)  
   *wytyczne / konsensus* — Przegląd ewolucji operacji drenujących i resekcyjnych w przewlekłym zapaleniu trzustki
141. Löhr JM, Dominguez-Munoz E, Rosendahl J, Besselink M, Mayerle J, Lerch MM, et al.; HaPanEU/UEG Working Group. United European Gastroenterology evidence-based guidelines for the diagnosis and therapy of chronic pancreatitis (HaPanEU). United European Gastroenterol J. 2017;5(2):153-99. [PubMed 28344786](https://pubmed.ncbi.nlm.nih.gov/28344786/) · [doi:10.1177/2050640616684695](https://doi.org/10.1177/2050640616684695)  
   *wytyczne / konsensus* — HaPanEU: wskazania do leczenia operacyjnego przewlekłego zapalenia trzustki

*Tylko wariant `puestow`:*

142. Puestow CB, Gillesby WJ. Retrograde surgical drainage of pancreas for chronic relapsing pancreatitis. AMA Arch Surg. 1958;76(6):898-907. [PubMed 13532132](https://pubmed.ncbi.nlm.nih.gov/13532132/) · [doi:10.1001/archsurg.1958.01280240056009](https://doi.org/10.1001/archsurg.1958.01280240056009)  
   *opis oryginalny* — Opis oryginalny wstecznego drenażu przewodu trzustkowego (Puestow, Gillesby)
143. Partington PF, Rochelle RE. Modified Puestow procedure for retrograde drainage of the pancreatic duct. Ann Surg. 1960;152(6):1037-43. [PubMed 13733040](https://pubmed.ncbi.nlm.nih.gov/13733040/) · [doi:10.1097/00000658-196012000-00015](https://doi.org/10.1097/00000658-196012000-00015)  
   *opis oryginalny* — Modyfikacja Partingtona–Rochelle’a: podłużne zespolenie bez resekcji ogona i splenektomii
144. Amini B, Jones J. Puestow procedure [Internet]. Radiopaedia.org; 2009 [updated 2020 Oct 10; cited 2026 Oct 5]. [doi:10.53347/rID-6971](https://doi.org/10.53347/rID-6971)  
   *anatomia* — Schemat i obraz radiologiczny po operacji Puestowa
145. Deie K, Uchida H, Kawashima H, Tanaka Y, Fujiogi M, Amano H, et al. Laparoscopic side-to-side pancreaticojejunostomy for chronic pancreatitis in children. J Minim Access Surg. 2016;12(4):370-2. [PubMed 27251846](https://pubmed.ncbi.nlm.nih.gov/27251846/) · [doi:10.4103/0972-9941.182655](https://doi.org/10.4103/0972-9941.182655)  
   *technika* — Laparoskopowe zespolenie trzustkowo-jelitowe bok-do-boku (dzieci)
146. Balduzzi A, Zwart MJW, Kempeneers RMA, Boermeester MA, Busch OR, Besselink MG. Robotic Lateral Pancreaticojejunostomy for Chronic Pancreatitis. J Vis Exp. 2019;(154):e60301. [PubMed 31885388](https://pubmed.ncbi.nlm.nih.gov/31885388/) · [doi:10.3791/60301](https://doi.org/10.3791/60301)  
   *technika* — Technika podłużnego zespolenia trzustkowo-jelitowego z pętlą Roux (robotycznie)
147. Tchouta LN, Schrope BA. Evolving Technique for Puestow-Type Procedure for Chronic Pancreatitis: The Combined Roux-en-Y Proximal End-to-Side and Distal Longitudinal Pancreatojejunostomy. Am J Case Rep. 2024;25:e942066. [PubMed 38243588](https://pubmed.ncbi.nlm.nih.gov/38243588/) · [doi:10.12659/AJCR.942066](https://doi.org/10.12659/AJCR.942066)  
   *technika* — LPJ przy poszerzonym przewodzie trzustkowym (≥ 6–7 mm)

*Tylko wariant `frey`:*

148. Frey CF, Smith GJ. Description and rationale of a new operation for chronic pancreatitis. Pancreas. 1987;2(6):701-7. [PubMed 3438308](https://pubmed.ncbi.nlm.nih.gov/3438308/) · [doi:10.1097/00006676-198711000-00014](https://doi.org/10.1097/00006676-198711000-00014)  
   *opis oryginalny* — Opis oryginalny: wydrążenie głowy trzustki z podłużnym zespoleniem (Frey)
149. Frey CF, Amikura K. Local resection of the head of the pancreas combined with longitudinal pancreaticojejunostomy in the management of patients with chronic pancreatitis. Ann Surg. 1994;220(4):492-504; discussion 504-7. [PubMed 7524454](https://pubmed.ncbi.nlm.nih.gov/7524454/) · [doi:10.1007/BF02348284](https://doi.org/10.1007/BF02348284)  
   *technika* — Miejscowa resekcja głowy z podłużnym PJ: technika i wyniki

## Wątroba

### Anatomia wątroby i segmenty Couinauda (`liver`)

150. Couinaud C. Le foie: études anatomiques et chirurgicales. Paris: Masson; 1957.   
   *opis oryginalny* — Monografia Couinauda — pierwotny opis 8 segmentów czynnościowych wątroby
151. Couinaud C. Liver anatomy: portal (and suprahepatic) or biliary segmentation. Dig Surg. 1999;16(6):459-67. [PubMed 10805544](https://pubmed.ncbi.nlm.nih.gov/10805544/) · [doi:10.1159/000018770](https://doi.org/10.1159/000018770)  
   *opis oryginalny* — Segmentacja wrotna i żył wątrobowych Couinauda — podstawa podziału na segmenty I–VIII
152. Strasberg SM, Belghiti J, Clavien PA, Gadzijev E, Garden JO, Lau WY, et al. The Brisbane 2000 terminology of liver anatomy and resections. HPB (Oxford). 2000;2(3):333-9. [doi:10.1016/S1365-182X(17)30755-4](https://doi.org/10.1016/S1365-182X(17)30755-4)  
   *wytyczne / konsensus* — Oryginalna terminologia IHPBA Brisbane 2000: segmenty, sekcje, hemiwątroby, nazwy resekcji
153. Strasberg SM. Nomenclature of hepatic anatomy and resections: a review of the Brisbane 2000 system. J Hepatobiliary Pancreat Surg. 2005;12(5):351-5. [PubMed 16258801](https://pubmed.ncbi.nlm.nih.gov/16258801/) · [doi:10.1007/s00534-005-0999-7](https://doi.org/10.1007/s00534-005-0999-7)  
   *wytyczne / konsensus* — Nazewnictwo Brisbane 2000; po prawej „sekcja” i „sektor” to synonimy
154. Wakabayashi G, Cherqui D, Geller DA, Abu Hilal M, Berardi G, Ciria R, et al. The Tokyo 2020 terminology of liver anatomy and resections: Updates of the Brisbane 2000 system. J Hepatobiliary Pancreat Sci. 2022;29(1):6-15. [PubMed 34866349](https://pubmed.ncbi.nlm.nih.gov/34866349/) · [doi:10.1002/jhbp.1091](https://doi.org/10.1002/jhbp.1091)  
   *wytyczne / konsensus* — Tokyo 2020: aktualizacja Brisbane, granice segmentów i resekcje segmentarne
155. Bismuth H. Surgical anatomy and anatomical surgery of the liver. World J Surg. 1982;6(1):3-9. [PubMed 7090393](https://pubmed.ncbi.nlm.nih.gov/7090393/) · [doi:10.1007/BF01656368](https://doi.org/10.1007/BF01656368)  
   *anatomia* — Anatomia chirurgiczna: płaszczyzny żył wątrobowych, szypuły Glissona, segment I
156. Hyidar Z, Ahmed U, Abid H, Ahmed I. A deviant anterior portal vein in the hepatoduodenal ligament with aberrant origin of hepatic arteries directly from the celiac trunk: A case report of two patients underwent pylorus preserving pancreatoduodenectomy (PPPD). Int J Surg Case Rep. 2023;108:108459. [PubMed 37413758](https://pubmed.ncbi.nlm.nih.gov/37413758/) · [doi:10.1016/j.ijscr.2023.108459](https://doi.org/10.1016/j.ijscr.2023.108459)  
   *anatomia* — Położenie struktur w więzadle wątrobowo-dwunastniczym: PV z tyłu, CBD bocznie, HA przyśrodkowo

### Guz w wątrobie — metastazektomia lub resekcja anatomiczna (`lv-guz`)

157. Strasberg SM, Belghiti J, Clavien PA, Gadzijev E, Garden JO, Lau WY, et al. The Brisbane 2000 terminology of liver anatomy and resections. HPB (Oxford). 2000;2(3):333-9. [doi:10.1016/S1365-182X(17)30755-4](https://doi.org/10.1016/S1365-182X(17)30755-4)  
   *wytyczne / konsensus* — Oryginalna terminologia IHPBA Brisbane 2000: segmenty, sekcje, hemiwątroby, nazwy resekcji
158. Strasberg SM. Nomenclature of hepatic anatomy and resections: a review of the Brisbane 2000 system. J Hepatobiliary Pancreat Surg. 2005;12(5):351-5. [PubMed 16258801](https://pubmed.ncbi.nlm.nih.gov/16258801/) · [doi:10.1007/s00534-005-0999-7](https://doi.org/10.1007/s00534-005-0999-7)  
   *wytyczne / konsensus* — Nazwy zakresów: bisegmentektomia, sekcjonektomia, hemihepatektomia, trisekcjonektomia
159. Adams RB, Aloia TA, Loyer E, Pawlik TM, Taouli B, Vauthey JN; Americas Hepato-Pancreato-Biliary Association; Society of Surgical Oncology; Society for Surgery of the Alimentary Tract. Selection for hepatic resection of colorectal liver metastases: expert consensus statement. HPB (Oxford). 2013;15(2):91-103. [PubMed 23297719](https://pubmed.ncbi.nlm.nih.gov/23297719/) · [doi:10.1111/j.1477-2574.2012.00557.x](https://doi.org/10.1111/j.1477-2574.2012.00557.x)  
   *wytyczne / konsensus* — Kwalifikacja do resekcji przerzutów CRC; wystarczająca FLR zależnie od uszkodzenia miąższu

*Tylko wariant `lv-guz-meta`:*

160. Pawlik TM, Scoggins CR, Zorzi D, Abdalla EK, Andres A, Eng C, et al. Effect of surgical margin status on survival and site of recurrence after hepatic resection for colorectal metastases. Ann Surg. 2005;241(5):715-22, discussion 722-4. [PubMed 15849507](https://pubmed.ncbi.nlm.nih.gov/15849507/) · [doi:10.1097/01.sla.0000160703.75808.7d](https://doi.org/10.1097/01.sla.0000160703.75808.7d)  
   *wyniki badań* — Przerzuty CRC: liczy się margines R0; szerokość ≥1 mm nie zmienia przeżycia

*Tylko wariant `lv-guz-anat`:*

161. Makuuchi M, Hasegawa H, Yamazaki S. Ultrasonically guided subsegmentectomy. Surg Gynecol Obstet. 1985;161(4):346-50. [PubMed 2996162](https://pubmed.ncbi.nlm.nih.gov/2996162/)  
   *opis oryginalny* — Systematyczna (sub)segmentektomia anatomiczna wg szypuły wrotnej pod kontrolą USG
162. Clavien PA, Petrowsky H, DeOliveira ML, Graf R. Strategies for safer liver surgery and partial liver transplantation. N Engl J Med. 2007;356(15):1545-59. [PubMed 17429086](https://pubmed.ncbi.nlm.nih.gov/17429086/) · [doi:10.1056/NEJMra065156](https://doi.org/10.1056/NEJMra065156)  
   *wytyczne / konsensus* — Bezpieczna objętość pozostałej wątroby (FLR) zależy od czynności miąższu
163. Wakabayashi G, Cherqui D, Geller DA, Abu Hilal M, Berardi G, Ciria R, et al. The Tokyo 2020 terminology of liver anatomy and resections: Updates of the Brisbane 2000 system. J Hepatobiliary Pancreat Sci. 2022;29(1):6-15. [PubMed 34866349](https://pubmed.ncbi.nlm.nih.gov/34866349/) · [doi:10.1002/jhbp.1091](https://doi.org/10.1002/jhbp.1091)  
   *wytyczne / konsensus* — Definicje anatomicznej segmentektomii i mniejszych resekcji (Tokyo 2020)
164. Abdalla EK, Denys A, Chevalier P, Nemr RA, Vauthey JN. Total and segmental liver volume variations: implications for liver surgery. Surgery. 2004;135(4):404-10. [PubMed 15041964](https://pubmed.ncbi.nlm.nih.gov/15041964/) · [doi:10.1016/j.surg.2003.08.024](https://doi.org/10.1016/j.surg.2003.08.024)  
   *anatomia* — Udział segmentów w objętości wątroby (prawa ~2/3, lewa ~1/3, II+III ~16%)
165. Hasegawa K, Kokudo N, Imamura H, Matsuyama Y, Aoki T, Minagawa M, et al. Prognostic impact of anatomic resection for hepatocellular carcinoma. Ann Surg. 2005;242(2):252-9. [PubMed 16041216](https://pubmed.ncbi.nlm.nih.gov/16041216/) · [doi:10.1097/01.sla.0000171307.37401.db](https://doi.org/10.1097/01.sla.0000171307.37401.db)  
   *wyniki badań* — Resekcja anatomiczna korzystniejsza od nieanatomicznej w raku wątrobowokomórkowym

### Bisegmentektomia II/III (`lv-b23`)

166. Strasberg SM, Belghiti J, Clavien PA, Gadzijev E, Garden JO, Lau WY, et al. The Brisbane 2000 terminology of liver anatomy and resections. HPB (Oxford). 2000;2(3):333-9. [doi:10.1016/S1365-182X(17)30755-4](https://doi.org/10.1016/S1365-182X(17)30755-4)  
   *wytyczne / konsensus* — Oryginalna terminologia IHPBA Brisbane 2000: segmenty, sekcje, hemiwątroby, nazwy resekcji
167. Strasberg SM. Nomenclature of hepatic anatomy and resections: a review of the Brisbane 2000 system. J Hepatobiliary Pancreat Surg. 2005;12(5):351-5. [PubMed 16258801](https://pubmed.ncbi.nlm.nih.gov/16258801/) · [doi:10.1007/s00534-005-0999-7](https://doi.org/10.1007/s00534-005-0999-7)  
   *wytyczne / konsensus* — Bisegmentektomia II/III = sekcjonektomia boczna lewa (Brisbane 2000)
168. Bismuth H. Surgical anatomy and anatomical surgery of the liver. World J Surg. 1982;6(1):3-9. [PubMed 7090393](https://pubmed.ncbi.nlm.nih.gov/7090393/) · [doi:10.1007/BF01656368](https://doi.org/10.1007/BF01656368)  
   *anatomia* — Żyła wątrobowa lewa między segmentami II i III; anatomia lewej wątroby
169. Couinaud C. Liver anatomy: portal (and suprahepatic) or biliary segmentation. Dig Surg. 1999;16(6):459-67. [PubMed 10805544](https://pubmed.ncbi.nlm.nih.gov/10805544/) · [doi:10.1159/000018770](https://doi.org/10.1159/000018770)  
   *anatomia* — Szczelina pępkowa oddziela segment IV od segmentów II i III
170. Starzl TE, Bell RH, Beart RW, Putnam CW. Hepatic trisegmentectomy and other liver resections. Surg Gynecol Obstet. 1975;141(3):429-37. [PubMed 1162576](https://pubmed.ncbi.nlm.nih.gov/1162576/)  
   *technika* — Szypuły II/III podwiązywać na lewo od szczeliny pępkowej, by nie odnaczynić IV

### Prawa hemihepatektomia (`lv-rh`)

171. Lortat-Jacob JL, Robert HG. [Well defined technic for right hepatectomy]. Presse Med. 1952;60(26):549-51. [PubMed 14948909](https://pubmed.ncbi.nlm.nih.gov/14948909/)  
   *opis oryginalny* — Pierwszy opis „regulowanej” prawej hepatektomii z kontrolą szypuły we wnęce
172. Strasberg SM, Belghiti J, Clavien PA, Gadzijev E, Garden JO, Lau WY, et al. The Brisbane 2000 terminology of liver anatomy and resections. HPB (Oxford). 2000;2(3):333-9. [doi:10.1016/S1365-182X(17)30755-4](https://doi.org/10.1016/S1365-182X(17)30755-4)  
   *wytyczne / konsensus* — Oryginalna terminologia IHPBA Brisbane 2000: segmenty, sekcje, hemiwątroby, nazwy resekcji
173. Strasberg SM. Nomenclature of hepatic anatomy and resections: a review of the Brisbane 2000 system. J Hepatobiliary Pancreat Surg. 2005;12(5):351-5. [PubMed 16258801](https://pubmed.ncbi.nlm.nih.gov/16258801/) · [doi:10.1007/s00534-005-0999-7](https://doi.org/10.1007/s00534-005-0999-7)  
   *wytyczne / konsensus* — Prawa hemihepatektomia = usunięcie segmentów V–VIII (Brisbane 2000)
174. Clavien PA, Petrowsky H, DeOliveira ML, Graf R. Strategies for safer liver surgery and partial liver transplantation. N Engl J Med. 2007;356(15):1545-59. [PubMed 17429086](https://pubmed.ncbi.nlm.nih.gov/17429086/) · [doi:10.1056/NEJMra065156](https://doi.org/10.1056/NEJMra065156)  
   *wytyczne / konsensus* — Minimalna bezpieczna FLR zależy od czynności wątroby (zdrowa vs uszkodzona)
175. Bismuth H. Surgical anatomy and anatomical surgery of the liver. World J Surg. 1982;6(1):3-9. [PubMed 7090393](https://pubmed.ncbi.nlm.nih.gov/7090393/) · [doi:10.1007/BF01656368](https://doi.org/10.1007/BF01656368)  
   *anatomia* — Płaszczyzna Cantliego wzdłuż żyły wątrobowej pośrodkowej dzieli wątrobę na prawą i lewą
176. Abdalla EK, Denys A, Chevalier P, Nemr RA, Vauthey JN. Total and segmental liver volume variations: implications for liver surgery. Surgery. 2004;135(4):404-10. [PubMed 15041964](https://pubmed.ncbi.nlm.nih.gov/15041964/) · [doi:10.1016/j.surg.2003.08.024](https://doi.org/10.1016/j.surg.2003.08.024)  
   *anatomia* — Lewa wątroba (II–IV) to średnio ok. 1/3 objętości (zakres 17–49%)

### Lewa hemihepatektomia (`lv-lh`)

177. Strasberg SM, Belghiti J, Clavien PA, Gadzijev E, Garden JO, Lau WY, et al. The Brisbane 2000 terminology of liver anatomy and resections. HPB (Oxford). 2000;2(3):333-9. [doi:10.1016/S1365-182X(17)30755-4](https://doi.org/10.1016/S1365-182X(17)30755-4)  
   *wytyczne / konsensus* — Oryginalna terminologia IHPBA Brisbane 2000: segmenty, sekcje, hemiwątroby, nazwy resekcji
178. Strasberg SM. Nomenclature of hepatic anatomy and resections: a review of the Brisbane 2000 system. J Hepatobiliary Pancreat Surg. 2005;12(5):351-5. [PubMed 16258801](https://pubmed.ncbi.nlm.nih.gov/16258801/) · [doi:10.1007/s00534-005-0999-7](https://doi.org/10.1007/s00534-005-0999-7)  
   *wytyczne / konsensus* — Lewa hemihepatektomia = usunięcie segmentów II–IV, segment I osobno
179. Bismuth H. Surgical anatomy and anatomical surgery of the liver. World J Surg. 1982;6(1):3-9. [PubMed 7090393](https://pubmed.ncbi.nlm.nih.gov/7090393/) · [doi:10.1007/BF01656368](https://doi.org/10.1007/BF01656368)  
   *anatomia* — Płaszczyzna Cantliego (żyła wątrobowa pośrodkowa) jako granica lewej wątroby

### ALPPS — podział wątroby i podwiązanie prawej gałęzi żyły wrotnej (resekcja dwuetapowa) (`lv-alpps`)

180. Schnitzbauer AA, Lang SA, Goessmann H, Nadalin S, Baumgart J, Farkas SA, et al. Right portal vein ligation combined with in situ splitting induces rapid left lateral liver lobe hypertrophy enabling 2-staged extended right hepatic resection in small-for-size settings. Ann Surg. 2012;255(3):405-14. [PubMed 22330038](https://pubmed.ncbi.nlm.nih.gov/22330038/) · [doi:10.1097/SLA.0b013e31824856f5](https://doi.org/10.1097/SLA.0b013e31824856f5)  
   *opis oryginalny* — Podwiązanie prawej PV + podział in situ; przerost II/III w medianie 9 dni
181. de Santibañes E, Clavien PA. Playing Play-Doh to prevent postoperative liver failure: the "ALPPS" approach. Ann Surg. 2012;255(3):415-7. [PubMed 22330039](https://pubmed.ncbi.nlm.nih.gov/22330039/) · [doi:10.1097/SLA.0b013e318248577d](https://doi.org/10.1097/SLA.0b013e318248577d)  
   *opis oryginalny* — Wprowadzenie nazwy i akronimu ALPPS
182. Strasberg SM, Belghiti J, Clavien PA, Gadzijev E, Garden JO, Lau WY, et al. The Brisbane 2000 terminology of liver anatomy and resections. HPB (Oxford). 2000;2(3):333-9. [doi:10.1016/S1365-182X(17)30755-4](https://doi.org/10.1016/S1365-182X(17)30755-4)  
   *wytyczne / konsensus* — Oryginalna terminologia IHPBA Brisbane 2000: segmenty, sekcje, hemiwątroby, nazwy resekcji
183. Oldhafer KJ, Stavrou GA, van Gulik TM; Core Group. ALPPS--Where Do We Stand, Where Do We Go?: Eight Recommendations From the First International Expert Meeting. Ann Surg. 2016;263(5):839-41. [PubMed 26756771](https://pubmed.ncbi.nlm.nih.gov/26756771/) · [doi:10.1097/SLA.0000000000001633](https://doi.org/10.1097/SLA.0000000000001633)  
   *wytyczne / konsensus* — Zalecenia I międzynarodowego spotkania ekspertów ALPPS (Hamburg 2015)
184. Starzl TE, Bell RH, Beart RW, Putnam CW. Hepatic trisegmentectomy and other liver resections. Surg Gynecol Obstet. 1975;141(3):429-37. [PubMed 1162576](https://pubmed.ncbi.nlm.nih.gov/1162576/)  
   *technika* — Trisegmentektomia prawa (IV–VIII) — technika etapu II
185. Schadde E, Ardiles V, Robles-Campos R, Malago M, Machado M, Hernandez-Alejandro R, et al.; ALPPS Registry Group. Early survival and safety of ALPPS: first report of the International ALPPS Registry. Ann Surg. 2014;260(5):829-36; discussion 836-8. [PubMed 25379854](https://pubmed.ncbi.nlm.nih.gov/25379854/) · [doi:10.1097/SLA.0000000000000947](https://doi.org/10.1097/SLA.0000000000000947)  
   *wyniki badań* — Rejestr ALPPS: FLR +80% w medianie 7 dni; śmiertelność 90-dniowa 9%
186. Eshmuminov D, Raptis DA, Linecker M, Wirsching A, Lesurtel M, Clavien PA. Meta-analysis of associating liver partition with portal vein ligation and portal vein occlusion for two-stage hepatectomy. Br J Surg. 2016;103(13):1768-82. [PubMed 27633328](https://pubmed.ncbi.nlm.nih.gov/27633328/) · [doi:10.1002/bjs.10290](https://doi.org/10.1002/bjs.10290)  
   *wyniki badań* — ALPPS vs PVE: większy przerost, tendencja do większej chorobowości i śmiertelności
187. Sandström P, Røsok BI, Sparrelid E, Larsen PN, Larsson AL, Lindell G, et al. ALPPS Improves Resectability Compared With Conventional Two-stage Hepatectomy in Patients With Advanced Colorectal Liver Metastasis: Results From a Scandinavian Multicenter Randomized Controlled Trial (LIGRO Trial). Ann Surg. 2018;267(5):833-40. [PubMed 28902669](https://pubmed.ncbi.nlm.nih.gov/28902669/) · [doi:10.1097/SLA.0000000000002511](https://doi.org/10.1097/SLA.0000000000002511)  
   *wyniki badań* — RCT LIGRO: ALPPS zwiększa resekcyjność vs klasyczna dwuetapowa, powikłania podobne

### Przeszczepienie wątroby (OLTx) — warianty rekonstrukcji żylnej i żółciowej (`oltx`)

188. Starzl TE, Marchioro TL, Vonkaulla KN, Hermann G, Brittain RS, Waddell WR. Homotransplantation of the liver in humans. Surg Gynecol Obstet. 1963;117:659-76. [PubMed 14100514](https://pubmed.ncbi.nlm.nih.gov/14100514/)  
   *opis oryginalny* — Pierwsze ortotopowe przeszczepienia wątroby u ludzi — technika klasyczna
189. European Association for the Study of the Liver. EASL Clinical Practice Guidelines: Liver transplantation. J Hepatol. 2016;64(2):433-85. [PubMed 26597456](https://pubmed.ncbi.nlm.nih.gov/26597456/) · [doi:10.1016/j.jhep.2015.10.006](https://doi.org/10.1016/j.jhep.2015.10.006)  
   *wytyczne / konsensus* — Wytyczne EASL: wskazania, kwalifikacja i opieka po przeszczepieniu wątroby
190. Arain MA, Attam R, Freeman ML. Advances in endoscopic management of biliary tract complications after liver transplantation. Liver Transpl. 2013;19(5):482-98. [PubMed 23417867](https://pubmed.ncbi.nlm.nih.gov/23417867/) · [doi:10.1002/lt.23624](https://doi.org/10.1002/lt.23624)  
   *endoskopia* — ECPW po przewód–przewód; po Roux-en-Y dostęp enteroskopowy lub przezskórny
191. Pandanaboyana S, Bell R, Bartlett AJ, McCall J, Hidalgo E. Meta-analysis of Duct-to-duct versus Roux-en-Y biliary reconstruction following liver transplantation for primary sclerosing cholangitis. Transpl Int. 2015;28(4):485-91. [PubMed 25557556](https://pubmed.ncbi.nlm.nih.gov/25557556/) · [doi:10.1111/tri.12513](https://doi.org/10.1111/tri.12513)  
   *wyniki badań* — PSC: przewód–przewód vs Roux-en-Y — podobne zwężenia, więcej zapaleń dróg żółciowych po Roux
192. Faleiro MD, de M Ogawa T, Correia PP, Perim V, Riella J, Siddiqui F, et al. Updated Systematic Review and Meta-Analysis of Duct-to-duct Versus Hepaticojejunostomy Reconstruction After Liver Transplantation for Primary Sclerosing Cholangitis. Transplantation. 2026;110(4):e774-e784. [PubMed 41572464](https://pubmed.ncbi.nlm.nih.gov/41572464/) · [doi:10.1097/TP.0000000000005639](https://doi.org/10.1097/TP.0000000000005639)  
   *wyniki badań* — PSC: Roux-en-Y związane z lepszym przeżyciem chorych i przeszczepów niż przewód–przewód

*Tylko wariant `oltx-classic-d2d`:*

193. Dumonceau JM, Tringali A, Papanikolaou IS, Blero D, Mangiavillano B, Schmidt A, et al. Endoscopic biliary stenting: indications, choice of stents, and results: European Society of Gastrointestinal Endoscopy (ESGE) Clinical Guideline - Updated October 2017. Endoscopy. 2018;50(9):910-30. [PubMed 30086596](https://pubmed.ncbi.nlm.nih.gov/30086596/) · [doi:10.1055/a-0659-9864](https://doi.org/10.1055/a-0659-9864)  
   *endoskopia* — ESGE: łagodne zwężenia dróg żółciowych — mnogie stenty plastikowe lub FCSEMS

*Tylko wariant `oltx-pb-d2d`:*

194. Tzakis A, Todo S, Starzl TE. Orthotopic liver transplantation with preservation of the inferior vena cava. Ann Surg. 1989;210(5):649-52. [PubMed 2818033](https://pubmed.ncbi.nlm.nih.gov/2818033/) · [doi:10.1097/00000658-198911000-00013](https://doi.org/10.1097/00000658-198911000-00013)  
   *opis oryginalny* — Piggyback: przeszczepienie z zachowaniem IVC biorcy
195. Belghiti J, Panis Y, Sauvanet A, Gayet B, Fékété F. A new technique of side to side caval anastomosis during orthotopic hepatic transplantation without inferior vena caval occlusion. Surg Gynecol Obstet. 1992;175(3):270-2. [PubMed 1514163](https://pubmed.ncbi.nlm.nih.gov/1514163/)  
   *technika* — Zespolenie kawo-kawalne bok-do-boku bez zaciskania IVC (Belghiti)
196. Dumonceau JM, Tringali A, Papanikolaou IS, Blero D, Mangiavillano B, Schmidt A, et al. Endoscopic biliary stenting: indications, choice of stents, and results: European Society of Gastrointestinal Endoscopy (ESGE) Clinical Guideline - Updated October 2017. Endoscopy. 2018;50(9):910-30. [PubMed 30086596](https://pubmed.ncbi.nlm.nih.gov/30086596/) · [doi:10.1055/a-0659-9864](https://doi.org/10.1055/a-0659-9864)  
   *endoskopia* — ESGE: łagodne zwężenia dróg żółciowych — mnogie stenty plastikowe lub FCSEMS

*Tylko wariant `oltx-pb-roux`:*

197. Tzakis A, Todo S, Starzl TE. Orthotopic liver transplantation with preservation of the inferior vena cava. Ann Surg. 1989;210(5):649-52. [PubMed 2818033](https://pubmed.ncbi.nlm.nih.gov/2818033/) · [doi:10.1097/00000658-198911000-00013](https://doi.org/10.1097/00000658-198911000-00013)  
   *opis oryginalny* — Piggyback: przeszczepienie z zachowaniem IVC biorcy
198. Belghiti J, Panis Y, Sauvanet A, Gayet B, Fékété F. A new technique of side to side caval anastomosis during orthotopic hepatic transplantation without inferior vena caval occlusion. Surg Gynecol Obstet. 1992;175(3):270-2. [PubMed 1514163](https://pubmed.ncbi.nlm.nih.gov/1514163/)  
   *technika* — Zespolenie kawo-kawalne bok-do-boku bez zaciskania IVC (Belghiti)

## Jelito cienkie

### Resekcja jelita cienkiego — warianty zespolenia (`sb`)

199. Choy PY, Bissett IP, Docherty JG, Parry BR, Merrie A, Fitzgerald A. Stapled versus handsewn methods for ileocolic anastomoses. Cochrane Database Syst Rev. 2011;(9):CD004320. [PubMed 21901690](https://pubmed.ncbi.nlm.nih.gov/21901690/) · [doi:10.1002/14651858.CD004320.pub3](https://doi.org/10.1002/14651858.CD004320.pub3)  
   *wyniki badań* — Stapler vs szew ręczny: mniej nieszczelności po staplerze (Cochrane; zespolenia krętniczo-okrężnicze)

*Tylko wariant `sb-e2e`:*

200. Burch JM, Franciose RJ, Moore EE, Biffl WL, Offner PJ. Single-layer continuous versus two-layer interrupted intestinal anastomosis: a prospective randomized trial. Ann Surg. 2000;231(6):832-7. [PubMed 10816626](https://pubmed.ncbi.nlm.nih.gov/10816626/) · [doi:10.1097/00000658-200006000-00007](https://doi.org/10.1097/00000658-200006000-00007)  
   *technika* — Szew jednowarstwowy ciągły równie bezpieczny jak dwuwarstwowy, krótszy czas (RCT)

*Tylko wariant `sb-iso`:*

201. Steichen FM. The use of staplers in anatomical side-to-side and functional end-to-end enteroanastomoses. Surgery. 1968;64(5):948-53. [PubMed 5687844](https://pubmed.ncbi.nlm.nih.gov/5687844/)  
   *opis oryginalny* — Opis oryginalny zespolenia bok-do-boku staplerem liniowym

*Tylko wariant `sb-anti`:*

202. Steichen FM. The use of staplers in anatomical side-to-side and functional end-to-end enteroanastomoses. Surgery. 1968;64(5):948-53. [PubMed 5687844](https://pubmed.ncbi.nlm.nih.gov/5687844/)  
   *opis oryginalny* — Opis oryginalny FEEA: stapler liniowy i poprzeczne zamknięcie końców

## Jelito grube

### Wybór zakresu resekcji w raku jelita grubego (`zakres`)

203. Heald RJ, Husband EM, Ryall RD. The mesorectum in rectal cancer surgery--the clue to pelvic recurrence? Br J Surg. 1982;69(10):613-6. [PubMed 6751457](https://pubmed.ncbi.nlm.nih.gov/6751457/) · [doi:10.1002/bjs.1800691019](https://doi.org/10.1002/bjs.1800691019)  
   *opis oryginalny* — Całkowite wycięcie mezorektum (TME) — opis oryginalny
204. You YN, Hardiman KM, Bafford A, Poylin V, Francone TD, Davis K, et al.; On Behalf of the Clinical Practice Guidelines Committee of the American Society of Colon and Rectal Surgeons. The American Society of Colon and Rectal Surgeons Clinical Practice Guidelines for the Management of Rectal Cancer. Dis Colon Rectum. 2020;63(9):1191-222. [PubMed 33216491](https://pubmed.ncbi.nlm.nih.gov/33216491/) · [doi:10.1097/DCR.0000000000001762](https://doi.org/10.1097/DCR.0000000000001762)  
   *wytyczne / konsensus* — Odbytnica: PME w górnej, TME w środkowej i dolnej części; APR
205. Vogel JD, Felder SI, Bhama AR, Hawkins AT, Langenfeld SJ, Shaffer VO, et al. The American Society of Colon and Rectal Surgeons Clinical Practice Guidelines for the Management of Colon Cancer. Dis Colon Rectum. 2022;65(2):148-77. [PubMed 34775402](https://pubmed.ncbi.nlm.nih.gov/34775402/) · [doi:10.1097/DCR.0000000000002323](https://doi.org/10.1097/DCR.0000000000002323)  
   *wytyczne / konsensus* — Zakres resekcji wg drenażu chłonnego; podwiązanie naczynia zaopatrującego u odejścia
206. Kinugasa Y, Uehara K, Yamaguchi K, Saito Y, Murofushi K, Sugai T, et al.; Japanese Society for Cancer of the Colon and Rectum. Japanese Society for Cancer of the Colon and Rectum (JSCCR) guidelines 2024 for the treatment of colorectal cancer. Int J Clin Oncol. 2025;30(12):2410-63. [PubMed 41186794](https://pubmed.ncbi.nlm.nih.gov/41186794/) · [doi:10.1007/s10147-025-02899-8](https://doi.org/10.1007/s10147-025-02899-8)  
   *wytyczne / konsensus* — Limfadenektomia D3 i długość resekcji jelita wg naczyń zaopatrujących (JSCCR 2024)
207. Hohenberger W, Weber K, Matzel K, Papadopoulos T, Merkel S. Standardized surgery for colonic cancer: complete mesocolic excision and central ligation--technical notes and outcome. Colorectal Dis. 2009;11(4):354-64; discussion 364-5. [PubMed 19016817](https://pubmed.ncbi.nlm.nih.gov/19016817/) · [doi:10.1111/j.1463-1318.2008.01735.x](https://doi.org/10.1111/j.1463-1318.2008.01735.x)  
   *technika* — CME z centralnym podwiązaniem naczyń — zakres resekcji okrężnicy z krezką
208. Kruszewski WJ, Szajewski M, Ciesielski M, Buczek T, Kawecki K, Walczak J. Level of inferior mesenteric artery ligation does not affect rectal cancer treatment outcomes despite better cancer-specific survival after low ligation-randomized trial results. Colorectal Dis. 2021;23(10):2575-83. [PubMed 34251082](https://pubmed.ncbi.nlm.nih.gov/34251082/) · [doi:10.1111/codi.15798](https://doi.org/10.1111/codi.15798)  
   *wyniki badań* — RCT (Gdańsk): podwiązanie IMA poniżej LC równoważne wysokiemu
209. Aiolfi A, Cammarata F, Rausa E, Bonitta G, Biondi A, Bonavina L, et al. Prognostic impact of low versus high inferior mesenteric artery ligation in rectosigmoid cancer: individual patient data meta-analysis of randomized trials. BJS Open. 2026;10(5). [PubMed 42725584](https://pubmed.ncbi.nlm.nih.gov/42725584/) · [doi:10.1093/bjsopen/zrag120](https://doi.org/10.1093/bjsopen/zrag120)  
   *wyniki badań* — Niskie vs wysokie podwiązanie IMA: bez różnicy przeżycia (metaanaliza IPD RCT)
210. Sassun R, Sileo A, Ng JC, Mari G, Brucchi F, Ferrari D, et al. Low Versus High Ligation of Inferior Mesenteric Artery in Rectal and Sigmoid Cancers: A Systematic Review, Meta-analysis, and Trial Sequential Analysis of Randomized Controlled Trials. Ann Surg Oncol. 2026;33(1):210-9. [PubMed 41139188](https://pubmed.ncbi.nlm.nih.gov/41139188/) · [doi:10.1245/s10434-025-18642-6](https://doi.org/10.1245/s10434-025-18642-6)  
   *wyniki badań* — Metaanaliza RCT: niskie podwiązanie IMA bezpieczne onkologicznie, mniej nieszczelności

### Prawostronna hemikolektomia — warianty zespolenia (`rh`)

211. Vogel JD, Felder SI, Bhama AR, Hawkins AT, Langenfeld SJ, Shaffer VO, et al. The American Society of Colon and Rectal Surgeons Clinical Practice Guidelines for the Management of Colon Cancer. Dis Colon Rectum. 2022;65(2):148-77. [PubMed 34775402](https://pubmed.ncbi.nlm.nih.gov/34775402/) · [doi:10.1097/DCR.0000000000002323](https://doi.org/10.1097/DCR.0000000000002323)  
   *wytyczne / konsensus* — Hemikolektomia prawa: zakres z krezką, podwiązanie IC i RC u odejścia
212. Haywood M, Molyneux C, Mahadevan V, Srinivasaiah N. Right colic artery anatomy: a systematic review of cadaveric studies. Tech Coloproctol. 2017;21(12):937-43. [PubMed 29196959](https://pubmed.ncbi.nlm.nih.gov/29196959/) · [doi:10.1007/s10151-017-1717-6](https://doi.org/10.1007/s10151-017-1717-6)  
   *anatomia* — Tętnica prawa okrężnicy: zmienne odejście, w części przypadków brak
213. Negoi I, Beuran M, Hostiuc S, Negoi RI, Inoue Y. Surgical Anatomy of the Superior Mesenteric Vessels Related to Colon and Pancreatic Surgery: A Systematic Review and Meta-Analysis. Sci Rep. 2018;8(1):4184. [PubMed 29520096](https://pubmed.ncbi.nlm.nih.gov/29520096/) · [doi:10.1038/s41598-018-22641-x](https://doi.org/10.1038/s41598-018-22641-x)  
   *anatomia* — Zmienność naczyń krezkowych górnych (IC, RC, MC) w chirurgii okrężnicy
214. Hohenberger W, Weber K, Matzel K, Papadopoulos T, Merkel S. Standardized surgery for colonic cancer: complete mesocolic excision and central ligation--technical notes and outcome. Colorectal Dis. 2009;11(4):354-64; discussion 364-5. [PubMed 19016817](https://pubmed.ncbi.nlm.nih.gov/19016817/) · [doi:10.1111/j.1463-1318.2008.01735.x](https://doi.org/10.1111/j.1463-1318.2008.01735.x)  
   *technika* — CME i centralne podwiązanie naczyń w hemikolektomii prawej
215. Choy PY, Bissett IP, Docherty JG, Parry BR, Merrie A, Fitzgerald A. Stapled versus handsewn methods for ileocolic anastomoses. Cochrane Database Syst Rev. 2011;(9):CD004320. [PubMed 21901690](https://pubmed.ncbi.nlm.nih.gov/21901690/) · [doi:10.1002/14651858.CD004320.pub3](https://doi.org/10.1002/14651858.CD004320.pub3)  
   *wyniki badań* — Zespolenie krętniczo-okrężnicze staplerem: mniej nieszczelności niż szew ręczny (Cochrane)
216. Ibáñez N, Abrisqueta J, Luján J, Hernández Q, Rufete MD, Parrilla P. Isoperistaltic versus antiperistaltic ileocolic anastomosis. Does it really matter? Results from a randomised clinical trial (ISOVANTI). Surg Endosc. 2019;33(9):2850-7. [PubMed 30426254](https://pubmed.ncbi.nlm.nih.gov/30426254/) · [doi:10.1007/s00464-018-6580-7](https://doi.org/10.1007/s00464-018-6580-7)  
   *wyniki badań* — Zespolenie krętniczo-okrężnicze izo- vs antyperystaltyczne: podobne wyniki (RCT ISOVANTI)
217. Komorowski AL. Laparoskopowa hemikolektomia prawostronna – porównanie wyników zespolenia wewnątrz- i zewnątrzbrzusznego [Internet]. Medycyna Praktyczna – Chirurgia; 2021 Sep 2 [cited 2026 Oct 5]. [online](https://www.mp.pl/chirurgia/przeglad-badan/278584,laparoskopowa-hemikolektomia-prawostronna-porownanie-wynikow-zespolenia-wewnatrz-i-zewnatrzbrzusznego)  
   *wyniki badań* — Zespolenie wewnątrz- vs zewnątrzustrojowe w laparoskopowej hemikolektomii prawej (komentarz PL)
218. Ren H, Lu S, Sun Y, Zhang Q, Shen Y. The effectiveness and safety of isoperistaltic versus antiperistaltic side-to-side ileocolic anastomosis in minimally invasive radical right hemicolectomy: a systematic review and meta-analysis. Int J Colorectal Dis. 2026;41(1). [PubMed 42234166](https://pubmed.ncbi.nlm.nih.gov/42234166/) · [doi:10.1007/s00384-026-05160-4](https://doi.org/10.1007/s00384-026-05160-4)  
   *wyniki badań* — Metaanaliza izo vs anty w hemikolektomii prawej: obie bezpieczne, brak wyraźnej przewagi

*Tylko wariant `rh-anti`:*

219. Steichen FM. The use of staplers in anatomical side-to-side and functional end-to-end enteroanastomoses. Surgery. 1968;64(5):948-53. [PubMed 5687844](https://pubmed.ncbi.nlm.nih.gov/5687844/)  
   *opis oryginalny* — Opis oryginalny FEEA (functional end-to-end anastomosis) staplerem liniowym

*Tylko wariant `rh-ext`:*

220. Milone M, Manigrasso M, Elmore U, Maione F, Gennarelli N, Rondelli F, et al. Short- and long-term outcomes after transverse versus extended colectomy for transverse colon cancer. A systematic review and meta-analysis. Int J Colorectal Dis. 2019;34(2):201-7. [PubMed 30402767](https://pubmed.ncbi.nlm.nih.gov/30402767/) · [doi:10.1007/s00384-018-3186-4](https://doi.org/10.1007/s00384-018-3186-4)  
   *wyniki badań* — Rak poprzecznicy: resekcja segmentarna vs poszerzona — porównywalne wyniki onkologiczne
221. Morarasu S, Clancy C, Cronin CT, Matsuda T, Heneghan HM, Winter DC. Segmental versus extended colectomy for tumours of the transverse colon: a systematic review and meta-analysis. Colorectal Dis. 2021;23(3):625-34. [PubMed 33064881](https://pubmed.ncbi.nlm.nih.gov/33064881/) · [doi:10.1111/codi.15403](https://doi.org/10.1111/codi.15403)  
   *wyniki badań* — Rak poprzecznicy: poszerzona daje więcej węzłów, przeżycie i nawroty podobne

### Lewostronna hemikolektomia — warianty zespolenia (`lh`)

222. Vogel JD, Felder SI, Bhama AR, Hawkins AT, Langenfeld SJ, Shaffer VO, et al. The American Society of Colon and Rectal Surgeons Clinical Practice Guidelines for the Management of Colon Cancer. Dis Colon Rectum. 2022;65(2):148-77. [PubMed 34775402](https://pubmed.ncbi.nlm.nih.gov/34775402/) · [doi:10.1097/DCR.0000000000002323](https://doi.org/10.1097/DCR.0000000000002323)  
   *wytyczne / konsensus* — Zakres resekcji z krezką i podwiązaniem naczyń u odejścia (ASCRS 2022)
223. Hohenberger W, Weber K, Matzel K, Papadopoulos T, Merkel S. Standardized surgery for colonic cancer: complete mesocolic excision and central ligation--technical notes and outcome. Colorectal Dis. 2009;11(4):354-64; discussion 364-5. [PubMed 19016817](https://pubmed.ncbi.nlm.nih.gov/19016817/) · [doi:10.1111/j.1463-1318.2008.01735.x](https://doi.org/10.1111/j.1463-1318.2008.01735.x)  
   *technika* — CME z centralnym podwiązaniem naczyń — także w lewej połowie okrężnicy

*Tylko wariant `lh-anti`:*

224. Steichen FM. The use of staplers in anatomical side-to-side and functional end-to-end enteroanastomoses. Surgery. 1968;64(5):948-53. [PubMed 5687844](https://pubmed.ncbi.nlm.nih.gov/5687844/)  
   *opis oryginalny* — Opis oryginalny FEEA staplerem liniowym z poprzecznym zamknięciem końców

### Resekcja odbytnicy — warianty zespolenia EEA (`ar`)

225. Knight CD, Griffen FD. An improved technique for low anterior resection of the rectum using the EEA stapler. Surgery. 1980;88(5):710-4. [PubMed 7434211](https://pubmed.ncbi.nlm.nih.gov/7434211/)  
   *opis oryginalny* — Opis oryginalny podwójnego staplowania: stapler okrężny przez zamknięty kikut odbytnicy
226. Heald RJ, Husband EM, Ryall RD. The mesorectum in rectal cancer surgery--the clue to pelvic recurrence? Br J Surg. 1982;69(10):613-6. [PubMed 6751457](https://pubmed.ncbi.nlm.nih.gov/6751457/) · [doi:10.1002/bjs.1800691019](https://doi.org/10.1002/bjs.1800691019)  
   *opis oryginalny* — TME — wycięcie odbytnicy z całym mezorektum (opis oryginalny)
227. You YN, Hardiman KM, Bafford A, Poylin V, Francone TD, Davis K, et al.; On Behalf of the Clinical Practice Guidelines Committee of the American Society of Colon and Rectal Surgeons. The American Society of Colon and Rectal Surgeons Clinical Practice Guidelines for the Management of Rectal Cancer. Dis Colon Rectum. 2020;63(9):1191-222. [PubMed 33216491](https://pubmed.ncbi.nlm.nih.gov/33216491/) · [doi:10.1097/DCR.0000000000001762](https://doi.org/10.1097/DCR.0000000000001762)  
   *wytyczne / konsensus* — Przednia resekcja z TME, margines dystalny, ileostomia protekcyjna przy niskim zespoleniu
228. Langenfeld SJ, Davis BR, Vogel JD, Davids JS, Temple LKF, Cologne KG, et al.; Clinical Practice Guidelines Committee of the American Society of Colon and Rectal Surgeons. The American Society of Colon and Rectal Surgeons Clinical Practice Guidelines for the Management of Rectal Cancer 2023 Supplement. Dis Colon Rectum. 2024;67(1):18-31. [PubMed 37647138](https://pubmed.ncbi.nlm.nih.gov/37647138/) · [doi:10.1097/DCR.0000000000003057](https://doi.org/10.1097/DCR.0000000000003057)  
   *wytyczne / konsensus* — Aktualizacja 2023 wytycznych ASCRS dla raka odbytnicy
229. Cohen Z, Myers E, Langer B, Taylor B, Railton RH, Jamieson C. Double stapling technique for low anterior resection. Dis Colon Rectum. 1983;26(4):231-5. [PubMed 6839891](https://pubmed.ncbi.nlm.nih.gov/6839891/) · [doi:10.1007/BF02562484](https://doi.org/10.1007/BF02562484)  
   *technika* — Technika podwójnego staplowania w niskiej przedniej resekcji odbytnicy

*Tylko wariant `ar-center`:*

230. Zhuo C, Liang L, Ying M, Li Q, Li D, Li Y, et al. Laparoscopic Low Anterior Resection and Eversion Technique Combined With a Nondog Ear Anastomosis for Mid- and Distal Rectal Neoplasms: A Preliminary and Feasibility Study. Medicine (Baltimore). 2015;94(50):e2285. [PubMed 26683958](https://pubmed.ncbi.nlm.nih.gov/26683958/) · [doi:10.1097/MD.0000000000002285](https://doi.org/10.1097/MD.0000000000002285)  
   *technika* — Klasyczne podwójne staplowanie tworzy dwa „psie uszy” po bokach pierścienia
231. Lee S, Ahn B, Lee S. The Relationship Between the Number of Intersections of Staple Lines and Anastomotic Leakage After the Use of a Double Stapling Technique in Laparoscopic Colorectal Surgery. Surg Laparosc Endosc Percutan Tech. 2017;27(4):273-81. [PubMed 28614172](https://pubmed.ncbi.nlm.nih.gov/28614172/) · [doi:10.1097/SLE.0000000000000422](https://doi.org/10.1097/SLE.0000000000000422)  
   *wyniki badań* — Liczba skrzyżowań linii zszywek a nieszczelność zespolenia
232. Liu S, Guo J, Cheng Z, Wei M, Dong Z, Nie Z, et al. Removal of the "dog-ear" during laparoscopic anterior resection with double stapling technique reduces the anastomotic leakage: a prospective cohort study. Tech Coloproctol. 2025;29(1):143. [PubMed 40681878](https://pubmed.ncbi.nlm.nih.gov/40681878/) · [doi:10.1007/s10151-025-03178-4](https://doi.org/10.1007/s10151-025-03178-4)  
   *wyniki badań* — Usunięcie „psich uszu” zmniejsza nieszczelność i krwawienie z zespolenia

*Tylko wariant `ar-racket`:*

233. Lee S, Ahn B, Lee S. The Relationship Between the Number of Intersections of Staple Lines and Anastomotic Leakage After the Use of a Double Stapling Technique in Laparoscopic Colorectal Surgery. Surg Laparosc Endosc Percutan Tech. 2017;27(4):273-81. [PubMed 28614172](https://pubmed.ncbi.nlm.nih.gov/28614172/) · [doi:10.1097/SLE.0000000000000422](https://doi.org/10.1097/SLE.0000000000000422)  
   *wyniki badań* — Mniej skrzyżowań linii zszywek — mniej powikłań zespolenia (analiza jednoczynnikowa)
234. Cavallaro P, Lee GC, Kanters A, Valente M, Holubar SD, Champagne B, et al. Fact or fiction? Does the position of the end-to-end (EEA) stapler spike matter for colorectal anastomoses using a double-stapled technique? Colorectal Dis. 2024;26(1):137-44. [PubMed 38083875](https://pubmed.ncbi.nlm.nih.gov/38083875/) · [doi:10.1111/codi.16833](https://doi.org/10.1111/codi.16833)  
   *wyniki badań* — Kolec staplera w rogu linii kikuta vs przez środek: podobna szczelność

*Tylko wariant `ar-side`:*

235. Cavallaro P, Lee GC, Kanters A, Valente M, Holubar SD, Champagne B, et al. Fact or fiction? Does the position of the end-to-end (EEA) stapler spike matter for colorectal anastomoses using a double-stapled technique? Colorectal Dis. 2024;26(1):137-44. [PubMed 38083875](https://pubmed.ncbi.nlm.nih.gov/38083875/) · [doi:10.1111/codi.16833](https://doi.org/10.1111/codi.16833)  
   *technika* — Koniec okrężnicy do przedniej ściany odbytnicy („reverse Baker”) bez skrzyżowań linii zszywek

### Kolektomia całkowita z zespoleniem krętniczo-odbytniczym (`ira`)

236. Herzig DO, Buie WD, Weiser MR, You YN, Rafferty JF, Feingold D, et al. Clinical Practice Guidelines for the Surgical Treatment of Patients With Lynch Syndrome. Dis Colon Rectum. 2017;60(2):137-43. [PubMed 28059909](https://pubmed.ncbi.nlm.nih.gov/28059909/) · [doi:10.1097/DCR.0000000000000785](https://doi.org/10.1097/DCR.0000000000000785)  
   *wytyczne / konsensus* — Zespół Lyncha: kolektomia całkowita z IRA jako opcja przy raku okrężnicy
237. Holubar SD, Lightner AL, Poylin V, Vogel JD, Gaertner W, Davis B, et al.; Prepared on behalf of the Clinical Practice Guidelines Committee of the American Society of Colon and Rectal Surgeons. The American Society of Colon and Rectal Surgeons Clinical Practice Guidelines for the Surgical Management of Ulcerative Colitis. Dis Colon Rectum. 2021;64(7):783-804. [PubMed 33853087](https://pubmed.ncbi.nlm.nih.gov/33853087/) · [doi:10.1097/DCR.0000000000002037](https://doi.org/10.1097/DCR.0000000000002037)  
   *wytyczne / konsensus* — WZJG: kolektomia z IRA jako opcja u wybranych chorych
238. Spinelli A, Bonovas S, Burisch J, Kucharzik T, Adamina M, Annese V, et al. ECCO Guidelines on Therapeutics in Ulcerative Colitis: Surgical Treatment. J Crohns Colitis. 2022;16(2):179-89. [PubMed 34635910](https://pubmed.ncbi.nlm.nih.gov/34635910/) · [doi:10.1093/ecco-jcc/jjab177](https://doi.org/10.1093/ecco-jcc/jjab177)  
   *wytyczne / konsensus* — ECCO 2022: miejsce IRA w chirurgicznym leczeniu WZJG
239. Poylin VY, Shaffer VO, Felder SI, Goldstein LE, Goldberg JE, Kalady MF, et al.; Clinical Practice Guidelines Committee of the American Society of Colon and Rectal Surgeons. The American Society of Colon and Rectal Surgeons Clinical Practice Guidelines for the Management of Inherited Adenomatous Polyposis Syndromes. Dis Colon Rectum. 2024;67(2):213-27. [PubMed 37682806](https://pubmed.ncbi.nlm.nih.gov/37682806/) · [doi:10.1097/DCR.0000000000003072](https://doi.org/10.1097/DCR.0000000000003072)  
   *wytyczne / konsensus* — Polipowatość: kolektomia z IRA przy oszczędzonej odbytnicy; nadzór endoskopowy odbytnicy
240. Alavi K, Thorsen AJ, Fang SH, Burgess PL, Trevisani G, Lightner AL, et al.; Clinical Practice Guidelines Committee of the American Society of Colon and Rectal Surgeons. The American Society of Colon and Rectal Surgeons Clinical Practice Guidelines for the Evaluation and Management of Chronic Constipation. Dis Colon Rectum. 2024;67(10):1244-57. [PubMed 39250791](https://pubmed.ncbi.nlm.nih.gov/39250791/) · [doi:10.1097/DCR.0000000000003430](https://doi.org/10.1097/DCR.0000000000003430)  
   *wytyczne / konsensus* — Zaparcie z inercją okrężnicy: kolektomia całkowita z IRA u wybranych

### Proktokolektomia ze zbiornikiem J (IPAA) (`ipaa`)

241. Parks AG, Nicholls RJ. Proctocolectomy without ileostomy for ulcerative colitis. Br Med J. 1978;2(6130):85-8. [PubMed 667572](https://pubmed.ncbi.nlm.nih.gov/667572/) · [doi:10.1136/bmj.2.6130.85](https://doi.org/10.1136/bmj.2.6130.85)  
   *opis oryginalny* — Opis oryginalny proktokolektomii odtwórczej ze zbiornikiem z jelita krętego
242. Utsunomiya J, Iwama T, Imajo M, Matsuo S, Sawai S, Yaegashi K, et al. Total colectomy, mucosal proctectomy, and ileoanal anastomosis. Dis Colon Rectum. 1980;23(7):459-66. [PubMed 6777128](https://pubmed.ncbi.nlm.nih.gov/6777128/) · [doi:10.1007/BF02987076](https://doi.org/10.1007/BF02987076)  
   *opis oryginalny* — Opis oryginalny zbiornika J z zespoleniem krętniczo-odbytowym
243. Holubar SD, Lightner AL, Poylin V, Vogel JD, Gaertner W, Davis B, et al.; Prepared on behalf of the Clinical Practice Guidelines Committee of the American Society of Colon and Rectal Surgeons. The American Society of Colon and Rectal Surgeons Clinical Practice Guidelines for the Surgical Management of Ulcerative Colitis. Dis Colon Rectum. 2021;64(7):783-804. [PubMed 33853087](https://pubmed.ncbi.nlm.nih.gov/33853087/) · [doi:10.1097/DCR.0000000000002037](https://doi.org/10.1097/DCR.0000000000002037)  
   *wytyczne / konsensus* — WZJG: IPAA zabiegiem z wyboru, zwykle z ileostomią protekcyjną
244. Geiger JD, Teitelbaum DH, Hirschl RB, Coran AG. A new operative technique for restorative proctocolectomy: the endorectal pull-through combined with a double-stapled ileo-anal anastomosis. Surgery. 2003;134(3):492-5. [PubMed 14555938](https://pubmed.ncbi.nlm.nih.gov/14555938/) · [doi:10.1067/s0039-6060(03)00087-4](https://doi.org/10.1067/s0039-6060(03)00087-4)  
   *technika* — Zespolenie krętniczo-odbytowe techniką podwójnego staplowania
245. Justiniano CF, Hull TL. Construction of J- and S-Pouches. Dis Colon Rectum. 2022;65(S1):S20-S25. [PubMed 35895866](https://pubmed.ncbi.nlm.nih.gov/35895866/) · [doi:10.1097/DCR.0000000000002561](https://doi.org/10.1097/DCR.0000000000002561)  
   *technika* — Budowa zbiornika J: ramiona, staplowanie, zespolenie z kanałem odbytu
246. Maspero M, Liska D, Kessler H, Lipman J, Steele SR, Hull T, et al. Redo IPAA for long rectal cuff syndrome after ileoanal pouch for inflammatory bowel disease. Tech Coloproctol. 2024;28(1):38. [PubMed 38451358](https://pubmed.ncbi.nlm.nih.gov/38451358/) · [doi:10.1007/s10151-023-02909-9](https://doi.org/10.1007/s10151-023-02909-9)  
   *technika* — Mankiet odbytniczy optymalnie 1–2 cm; długi mankiet daje objawy
247. Elder K, Lopez R, Kiran RP, Remzi FH, Shen B. Endoscopic features associated with ileal pouch failure. Inflamm Bowel Dis. 2013;19(6):1202-9. [PubMed 23542533](https://pubmed.ncbi.nlm.nih.gov/23542533/) · [doi:10.1097/MIB.0b013e318280e77c](https://doi.org/10.1097/MIB.0b013e318280e77c)  
   *endoskopia* — Endoskopowy obraz „sowich oczu” i mankietu a niewydolność zbiornika
248. Shen B, Kochhar GS, Navaneethan U, Cross RK, Farraye FA, Iacucci M, et al. Endoscopic evaluation of surgically altered bowel in inflammatory bowel disease: a consensus guideline from the Global Interventional Inflammatory Bowel Disease Group. Lancet Gastroenterol Hepatol. 2021;6(6):482-97. [PubMed 33872568](https://pubmed.ncbi.nlm.nih.gov/33872568/) · [doi:10.1016/S2468-1253(20)30394-0](https://doi.org/10.1016/S2468-1253(20)30394-0)  
   *endoskopia* — Konsensus: punkty orientacyjne endoskopii po IPAA i innych operacjach w IBD
249. Hembree AE, Scherl E. Diagnosis and Management of Cuffitis: A Systematic Review. Dis Colon Rectum. 2022;65(S1):S85-S91. [PubMed 36399769](https://pubmed.ncbi.nlm.nih.gov/36399769/) · [doi:10.1097/DCR.0000000000002593](https://doi.org/10.1097/DCR.0000000000002593)  
   *endoskopia* — Zapalenie mankietu (cuffitis): rozpoznanie endoskopowe i leczenie
250. Shen B. Endoscopic Evaluation of the Ileal Pouch. Dis Colon Rectum. 2024;67(S1):S52-S69. [PubMed 38276962](https://pubmed.ncbi.nlm.nih.gov/38276962/) · [doi:10.1097/DCR.0000000000003269](https://doi.org/10.1097/DCR.0000000000003269)  
   *endoskopia* — Pouchoskopia: anatomia zbiornika, szczyt J, wlot pętli, mankiet
251. Kirat HT, Kiran RP, Oncel M, Shen B, Fazio VW, Remzi FH. Management of leak from the tip of the "J" in ileal pouch-anal anastomosis. Dis Colon Rectum. 2011;54(4):454-9. [PubMed 21383566](https://pubmed.ncbi.nlm.nih.gov/21383566/) · [doi:10.1007/DCR.0b013e31820481be](https://doi.org/10.1007/DCR.0b013e31820481be)  
   *wyniki badań* — Nieszczelność ślepego szczytu J: rozpoznanie i leczenie

### Operacja Hartmanna (`hartmann`)

252. Hall J, Hardiman K, Lee S, Lightner A, Stocchi L, Paquette IM, et al.; Prepared on behalf of the Clinical Practice Guidelines Committee of the American Society of Colon and Rectal Surgeons. The American Society of Colon and Rectal Surgeons Clinical Practice Guidelines for the Treatment of Left-Sided Colonic Diverticulitis. Dis Colon Rectum. 2020;63(6):728-47. [PubMed 32384404](https://pubmed.ncbi.nlm.nih.gov/32384404/) · [doi:10.1097/DCR.0000000000001679](https://doi.org/10.1097/DCR.0000000000001679)  
   *wytyczne / konsensus* — Zapalenie uchyłków z zapaleniem otrzewnej: Hartmann lub resekcja z zespoleniem
253. Sartelli M, Weber DG, Kluger Y, Ansaloni L, Coccolini F, Abu-Zidan F, et al. 2020 update of the WSES guidelines for the management of acute colonic diverticulitis in the emergency setting. World J Emerg Surg. 2020;15(1):32. [PubMed 32381121](https://pubmed.ncbi.nlm.nih.gov/32381121/) · [doi:10.1186/s13017-020-00313-4](https://doi.org/10.1186/s13017-020-00313-4)  
   *wytyczne / konsensus* — WSES 2020: Hartmann u chorych niestabilnych lub z kałowym zapaleniem otrzewnej
254. Bridoux V, Regimbeau JM, Ouaissi M, Mathonnet M, Mauvais F, Houivet E, et al. Hartmann's Procedure or Primary Anastomosis for Generalized Peritonitis due to Perforated Diverticulitis: A Prospective Multicenter Randomized Trial (DIVERTI). J Am Coll Surg. 2017;225(6):798-805. [PubMed 28943323](https://pubmed.ncbi.nlm.nih.gov/28943323/) · [doi:10.1016/j.jamcollsurg.2017.09.004](https://doi.org/10.1016/j.jamcollsurg.2017.09.004)  
   *wyniki badań* — DIVERTI: Hartmann vs zespolenie pierwotne w perforacyjnym zapaleniu uchyłków
255. Lambrichts DPV, Vennix S, Musters GD, Mulder IM, Swank HA, Hoofwijk AGM, et al.; LADIES trial collaborators. Hartmann's procedure versus sigmoidectomy with primary anastomosis for perforated diverticulitis with purulent or faecal peritonitis (LADIES): a multicentre, parallel-group, randomised, open-label, superiority trial. Lancet Gastroenterol Hepatol. 2019;4(8):599-610. [PubMed 31178342](https://pubmed.ncbi.nlm.nih.gov/31178342/) · [doi:10.1016/S2468-1253(19)30174-8](https://doi.org/10.1016/S2468-1253(19)30174-8)  
   *wyniki badań* — LADIES: resekcja z zespoleniem vs Hartmann w ropnym zapaleniu otrzewnej

### Ileostomia — warianty (`ileo`)

256. Brooke BN. The management of an ileostomy, including its complications. Lancet. 1952;2(6725):102-4. [PubMed 14939845](https://pubmed.ncbi.nlm.nih.gov/14939845/) · [doi:10.1016/s0140-6736(52)92149-1](https://doi.org/10.1016/s0140-6736(52)92149-1)  
   *opis oryginalny* — Wywinięcie ramienia wydzielniczego ileostomii (Brooke) — opis oryginalny
257. Kozłowski JT, Wilkołaska E. Poradnik dla osób ze stomią [Internet]. Lublin: Centrum Onkologii Ziemi Lubelskiej; 2012 [cited 2026 Oct 5]. [online](https://cozl.eu/images/downloads/poradniki/poradnik_dla_osob_ze_stomia_COZL_2013.pdf)  
   *wytyczne / konsensus* — Poradnik dla chorych: rodzaje stomii, pielęgnacja, sprzęt stomijny
258. Davis BR, Valente MA, Goldberg JE, Lightner AL, Feingold DL, Paquette IM; Prepared on behalf of the Clinical Practice Guidelines Committee of the American Society of Colon and Rectal Surgeons. The American Society of Colon and Rectal Surgeons Clinical Practice Guidelines for Ostomy Surgery. Dis Colon Rectum. 2022;65(10):1173-90. [PubMed 35616386](https://pubmed.ncbi.nlm.nih.gov/35616386/) · [doi:10.1097/DCR.0000000000002498](https://doi.org/10.1097/DCR.0000000000002498)  
   *wytyczne / konsensus* — Wytyczne ASCRS: wyłonienie, lokalizacja i powikłania stomii
259. Mikulewicz J. Stomia – i co dalej? Wskazówki praktyczne [Internet]. Olsztyn: Wojewódzki Szpital Specjalistyczny w Olsztynie; [2023] [cited 2026 Oct 5]. [online](https://wss.olsztyn.pl/wp-content/uploads/2023/08/postepowanie_po_stomii.pdf)  
   *wytyczne / konsensus* — Wskazówki praktyczne dla chorego po wyłonieniu stomii
260. Franklyn J, Varghese G, Mittal R, Rebekah G, Jesudason MR, Perakath B. A prospective randomized controlled trial comparing early postoperative complications in patients undergoing loop colostomy with and without a stoma rod. Colorectal Dis. 2017;19(7):675-80. [PubMed 28067986](https://pubmed.ncbi.nlm.nih.gov/28067986/) · [doi:10.1111/codi.13600](https://doi.org/10.1111/codi.13600)  
   *wyniki badań* — RCT: pręcik przy kolostomii pętlowej nie zapobiega retrakcji
261. Du R, Zhou J, Wang F, Li D, Tong G, Ding X, et al. Whether stoma support rods have application value in loop enterostomy: a systematic review and meta-analysis. World J Surg Oncol. 2020;18(1):269. [PubMed 33092619](https://pubmed.ncbi.nlm.nih.gov/33092619/) · [doi:10.1186/s12957-020-02029-w](https://doi.org/10.1186/s12957-020-02029-w)  
   *wyniki badań* — Pręcik przy stomii pętlowej: więcej powikłań, nie zalecany rutynowo
262. Gialamas E, Meyer J, Abbassi Z, Popeskou S, Buchs NC, Ris F. The Use of a Stoma Rod/Bridge to Prevent Retraction: A Systematic Review. J Wound Ostomy Continence Nurs. 2021;48(1):39-43. [PubMed 33427808](https://pubmed.ncbi.nlm.nih.gov/33427808/) · [doi:10.1097/WON.0000000000000730](https://doi.org/10.1097/WON.0000000000000730)  
   *wyniki badań* — Pręcik nie zapobiega retrakcji stomii pętlowej, zwiększa powikłania
263. Miyo M, Uemura M, Ozato Y, Nishimura J, Nakata K, Suzuki Y, et al.; Clinical Study Group of Osaka University, Colorectal Group (CSGO-CG). Influence of the rotation of the diverting loop ileostomy in rectal cancer surgery on small-bowel obstruction: A multicenter prospective study conducted by the Clinical Study Group of Osaka University, Colorectal Group. Surgery. 2025;178:108874. [PubMed 39516112](https://pubmed.ncbi.nlm.nih.gov/39516112/) · [doi:10.1016/j.surg.2024.09.032](https://doi.org/10.1016/j.surg.2024.09.032)  
   *wyniki badań* — Ileostomia pętlowa ≤ 30 cm od zastawki: mniej niedrożności; obrót pętli bez znaczenia

## Badania

### ETHOS — leczenie endoskopowe czy operacja we wczesnym raku okrężnicy (`ethos`)

264. Argilés G, Tabernero J, Labianca R, Hochhauser D, Salazar R, Iveson T, et al.; ESMO Guidelines Committee. Localised colon cancer: ESMO Clinical Practice Guidelines for diagnosis, treatment and follow-up. Ann Oncol. 2020;31(10):1291-305. [PubMed 32702383](https://pubmed.ncbi.nlm.nih.gov/32702383/) · [doi:10.1016/j.annonc.2020.06.022](https://doi.org/10.1016/j.annonc.2020.06.022)  
   *wytyczne / konsensus* — ESMO 2020: leczenie i schemat obserwacji w raku okrężnicy
265. Ferlitsch M, Hassan C, Bisschops R, Bhandari P, Dinis-Ribeiro M, Risio M, et al. Colorectal polypectomy and endoscopic mucosal resection: European Society of Gastrointestinal Endoscopy (ESGE) Guideline - Update 2024. Endoscopy. 2024;56(7):516-45. [PubMed 38670139](https://pubmed.ncbi.nlm.nih.gov/38670139/) · [doi:10.1055/a-2304-3219](https://doi.org/10.1055/a-2304-3219)  
   *wytyczne / konsensus* — ESGE 2024: przy podejrzeniu raka powierzchownego resekcja en bloc, m.in. EFTR
266. Schmidt A, Beyna T, Schumacher B, Meining A, Richter-Schrag HJ, Messmann H, et al. Colonoscopic full-thickness resection using an over-the-scope device: a prospective multicentre study in various indications. Gut. 2018;67(7):1280-9. [PubMed 28798042](https://pubmed.ncbi.nlm.nih.gov/28798042/) · [doi:10.1136/gutjnl-2016-313677](https://doi.org/10.1136/gutjnl-2016-313677)  
   *technika* — EFTR nasadką FTRD (OTSC) w jelicie grubym — badanie WALL RESECT
267. Zwager LW, Bastiaansen BAJ, Montazeri NSM, Hompes R, Barresi V, Ichimasa K, et al. Deep Submucosal Invasion Is Not an Independent Risk Factor for Lymph Node Metastasis in T1 Colorectal Cancer: A Meta-Analysis. Gastroenterology. 2022;163(1):174-89. [PubMed 35436498](https://pubmed.ncbi.nlm.nih.gov/35436498/) · [doi:10.1053/j.gastro.2022.04.010](https://doi.org/10.1053/j.gastro.2022.04.010)  
   *wyniki badań* — Głęboki naciek podśluzówki nie jest niezależnym czynnikiem ryzyka przerzutów węzłowych T1
268. European Commission. Early colorectal cancer: patient-targeted and organ preserving treatment (ECOPOP). Grant agreement ID 101156165, HORIZON-HLTH-2024-DISEASE-03-08 [Internet]. Luxembourg: CORDIS; 2025 [cited 2026 Oct 5]. [doi:10.3030/101156165](https://doi.org/10.3030/101156165)  
   *rejestr badania* — Projekt Horyzont Europa ECOPOP: leczenie oszczędzające narząd we wczesnym raku jelita grubego
269. Endoscopic Therapy Or Surgery for Early Colon Cancer (ETHOS). ClinicalTrials.gov identifier: NCT06940947 [Internet]. Bethesda (MD): National Library of Medicine (US); 2025 Apr 15 [updated 2025 Nov 17; cited 2026 Oct 5]. [online](https://clinicaltrials.gov/study/NCT06940947)  
   *rejestr badania* — Rejestracja ETHOS: kryteria włączenia, ramiona EFTR vs operacja, punkty końcowe

### SCAR — operacja czy resekcja endoskopowa po niedoszczętnym usunięciu wczesnego raka okrężnicy (`scar`)

270. Argilés G, Tabernero J, Labianca R, Hochhauser D, Salazar R, Iveson T, et al.; ESMO Guidelines Committee. Localised colon cancer: ESMO Clinical Practice Guidelines for diagnosis, treatment and follow-up. Ann Oncol. 2020;31(10):1291-305. [PubMed 32702383](https://pubmed.ncbi.nlm.nih.gov/32702383/) · [doi:10.1016/j.annonc.2020.06.022](https://doi.org/10.1016/j.annonc.2020.06.022)  
   *wytyczne / konsensus* — ESMO 2020: postępowanie po endoskopowym usunięciu raka pT1 i obserwacja
271. Schmidt A, Beyna T, Schumacher B, Meining A, Richter-Schrag HJ, Messmann H, et al. Colonoscopic full-thickness resection using an over-the-scope device: a prospective multicentre study in various indications. Gut. 2018;67(7):1280-9. [PubMed 28798042](https://pubmed.ncbi.nlm.nih.gov/28798042/) · [doi:10.1136/gutjnl-2016-313677](https://doi.org/10.1136/gutjnl-2016-313677)  
   *technika* — EFTR nasadką FTRD (OTSC) w jelicie grubym — badanie WALL RESECT
272. Zwager LW, Bastiaansen BAJ, van der Spek BW, Heine DN, Schreuder RM, Perk LE, et al.; Dutch eFTR Group. Endoscopic full-thickness resection of T1 colorectal cancers: a retrospective analysis from a multicenter Dutch eFTR registry. Endoscopy. 2022;54(5):475-85. [PubMed 34488228](https://pubmed.ncbi.nlm.nih.gov/34488228/) · [doi:10.1055/a-1637-9051](https://doi.org/10.1055/a-1637-9051)  
   *wyniki badań* — Rejestr eFTR: 198 wycięć blizny po niedoszczętnej resekcji raka T1
273. Zwager LW, Moons LMG, Farina Sarasqueta A, Laclé MM, Albers SC, Hompes R, et al.; the Dutch eFTR Working Group. Long-term oncological outcomes of endoscopic full-thickness resection after previous incomplete resection of low-risk T1 CRC (LOCAL-study): study protocol of a national prospective cohort study. BMC Gastroenterol. 2022;22(1):516. [PubMed 36513968](https://pubmed.ncbi.nlm.nih.gov/36513968/) · [doi:10.1186/s12876-022-02591-5](https://doi.org/10.1186/s12876-022-02591-5)  
   *wyniki badań* — Protokół LOCAL: wyniki odległe eFTR po niedoszczętnej resekcji raka T1 niskiego ryzyka
274. Surgery Versus Endoscopic Resection for Incompletely Removed Early Colon CAnceR (SCAR). ClinicalTrials.gov identifier: NCT06057350 [Internet]. Bethesda (MD): National Library of Medicine (US); 2023 Aug 12 [updated 2024 Feb 15; cited 2026 Oct 5]. [online](https://clinicaltrials.gov/study/NCT06057350)  
   *rejestr badania* — Rejestracja SCAR: eFTR blizny vs resekcja segmentarna po niedoszczętnym usunięciu raka T1
275. European Commission. Early colorectal cancer: patient-targeted and organ preserving treatment (ECOPOP). Grant agreement ID 101156165, HORIZON-HLTH-2024-DISEASE-03-08 [Internet]. Luxembourg: CORDIS; 2025 [cited 2026 Oct 5]. [doi:10.3030/101156165](https://doi.org/10.3030/101156165)  
   *rejestr badania* — Projekt Horyzont Europa ECOPOP: leczenie oszczędzające narząd we wczesnym raku jelita grubego

## Narzędzia

### Narzędzia

276. U.S. Food and Drug Administration. 510(k) premarket notification K103263: Endo GIA Single Use Duet TRS Reload with Tri-Staple Technology (Covidien) [Internet]. Silver Spring (MD): FDA; 2010 [cited 2026 Oct 5]. [online](https://www.accessdata.fda.gov/cdrh_docs/pdf10/K103263.pdf)  
   *technika* — Stapler liniowy Endo GIA: ładunek Tri-Staple — po 3 rzędy zszywek z każdej strony linii cięcia
277. U.S. Food and Drug Administration. 510(k) premarket notification K133938: Endo GIA Reinforced Reload with Tri-Staple Technology (Covidien) [Internet]. Silver Spring (MD): FDA; 2014 [cited 2026 Oct 5]. [online](https://www.accessdata.fda.gov/cdrh_docs/pdf13/K133938.pdf)  
   *technika* — Stapler liniowy Endo GIA: ładunek wzmocniony Tri-Staple — po 3 rzędy zszywek z każdej strony

