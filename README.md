# SURGITOME: interactive 3D atlas of postoperative gastrointestinal anatomy

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.23185125.svg)](https://doi.org/10.5281/zenodo.23185125)

**Author:** Piotr Spychalski, MD, PhD — colorectal surgeon and clinical researcher, Assistant Professor at the Department of Oncological, Transplant and General Surgery, Medical University of Gdańsk (Gdański Uniwersytet Medyczny), Gdańsk, Poland
**ORCID:** [0000-0001-7111-4660](https://orcid.org/0000-0001-7111-4660) · **E-mail:** piotr.spychalski@gumed.edu.pl · [Institutional profile](https://ppm.gumed.edu.pl/info/author/GUM3f5d1d8de0c54365ba7ffa8465799e64/)

SURGITOME is an interactive, schematic 3D atlas of **postoperative gastrointestinal anatomy**, created by Piotr Spychalski, MD, PhD. It shows, step by step, what the digestive tract looks like after a given operation: what is resected, how the reconstruction and anastomoses are made (linear and circular staplers, sutures), what the endoscopist sees after surgery, and how the postoperative anatomy appears on schematic cross-sectional CT.

> **Citation:** Spychalski P. *SURGITOME: interactive 3D atlas of postoperative gastrointestinal anatomy* [software]. Zenodo; 2026. doi:[10.5281/zenodo.23185125](https://doi.org/10.5281/zenodo.23185125). See [How to cite](#how-to-cite).

## Purpose and audience

SURGITOME was designed by a colorectal surgeon to explain **schematically** how anatomy looks after surgical procedures — a gap that textbooks, operative notes and imaging reports rarely fill. It is intended for:

- **Medical students** learning gastrointestinal surgery and postoperative anatomy.
- **Physicians of other specialties** who meet operated patients — endoscopists and gastroenterologists (e.g. finding the afferent limb, the papilla or a blind stump), radiologists, internists, oncologists, emergency and ICU physicians.
- **Surgical trainees** preparing for operations or studying anastomotic configurations (isoperistaltic vs antiperistaltic, end-to-end vs side-to-side, double stapling).
- **Patients**, with their doctor — to explain the extent of resection and the reconstruction in an understandable, visual way.

A recurring clinical problem motivated the tool: after anastomoses such as side-to-side oesophagogastric anastomosis, endoscopists may misinterpret a normal blind stump as pathology. SURGITOME shows these situations explicitly, including the endoscopic view and the choice of route at each fork.

## What it shows

For every procedure and variant a fixed sequence of frames:

1. Normal anatomy (or the pathological starting point).
2. Extent of resection.
3. Stapler / transection animation.
4. Removal of the specimen.
5. Reconstruction and anastomosis (with animated linear stapler, circular stapler (EEA, end-to-end anastomosis) and running suture).
6. Postoperative endoscopy — first-person virtual endoscope, with a choice of route at forks (e.g. biliopancreatic vs alimentary limb) and a navigation minimap.
7. Schematic cross-sectional CT with a slice-by-slice sweep.

Other features: rotatable 3D models, labels, Polish/English interface, favourites for teaching sessions, procedure search, mobile version, keyboard and presentation-clicker control, a short guided tour on the first visit.

### Procedures (29 operations, 57 variants)

Plus two teaching slides: liver anatomy and choosing the extent of colorectal resection.

- **Oesophagus:** Oesophagectomy (Ivor Lewis; Ivor Lewis — side-to-side; McKeown; McKeown — side-to-side; Transhiatal (Orringer); Akiyama; Colon interposition)
- **Stomach:** Distal gastrectomy (Billroth I; Billroth II; Billroth II + Braun; Roux-en-Y), Total gastrectomy, Bypass gastroenterostomy
- **Bariatric surgery:** Sleeve gastrectomy, Roux-en-Y bypass (RYGB), One-anastomosis bypass (OAGB), Duodenal switch (SADI-S; BPD-DS), BPD (Scopinaro)
- **Pancreas and bile ducts:** Whipple (classic) (PJ + HJ + GJ; PG + HJ + GJ), Traverso-Longmire (PPPD) (PJ + HJ + DJ; PG + HJ + DJ), Distal pancreatectomy, Hepaticojejunostomy (Roux-en-Y), Choledochoduodenostomy, Drainage procedures (Puestow, Frey) (Puestow (Partington–Rochelle); Frey)
- **Liver:** Liver anatomy (hilum: portal vein, hepatic artery and bile ducts with their branches, hepatic veins and IVC; Couinaud segments I–VIII highlighted on click and pulled apart with a slider; Brisbane 2000 terminology), Liver transplantation (OLTx: classic or piggyback caval reconstruction × duct-to-duct or Roux-en-Y hepaticojejunostomy; recipient hepatectomy, implantation and the sequence of anastomoses), Liver resections: tumour slide (drag the tumour — metastasectomy with margin or anatomical resection of the involved segments with the name of the procedure and the remnant volume), Bisegmentectomy II/III, Right and Left hemihepatectomy (inflow control, demarcation, transection, stumps), ALPPS (stage I, hypertrophy of segments II/III, stage II)
- **Small bowel:** Small bowel resection (End-to-end (sutured); Isoperistaltic; Antiperistaltic (FEEA))
- **Large bowel:** Choosing the extent of resection (drag the tumour: the resection, mesentery and vessels to ligate are highlighted; ASCRS 2022, rectum PME/TME/APR), Right hemicolectomy (Isoperistaltic; Antiperistaltic (FEEA); Extended — isoperistaltic), Left hemicolectomy (End-to-end (EEA); Isoperistaltic; Antiperistaltic (FEEA)), Rectal resection (Line through the centre; Tennis racket; Anterior wall), Total colectomy (IRA), J-pouch (IPAA), Hartmann, Ileostomy (Loop — functioning upper; Loop — functioning lower; Double-barrel — functioning upper; Double-barrel — functioning lower)

## Trials view

A separate, hidden view shows the randomised trials of the **ECOPOP** project side by side: two treatment arms in a **split screen**, on a shared timeline (same frames, same animation speed) and with linked cameras (the link can be switched off, so each half can be rotated on its own). It is not listed in the main navigation: search for a trial by name (e.g. *ETHOS*, *SCAR*, *EFTR*, *ECOPOP*) and star it to keep it in Favourites.

- **ETHOS** — *Endoscopic THerapy Or Surgery for early colon cancer* (NCT06940947): **A** endoscopic full-thickness resection (eFTR: FTRD cap, OTSC clip, snare resection; organ, mesentery and lymph nodes preserved) vs **B** segmental colectomy with lymphadenectomy (shown as right hemicolectomy: vessels ligated at their origin, mesentery with lymph nodes removed with the specimen).
- **SCAR** — *Surgery versus Endoscopic Resection for incompletely removed early colon CAnceR* (NCT06057350): **A** eFTR of the scar after endoscopic resection vs **B** segmental colectomy.

Frames: starting point (both halves identical: lesion or scar, ink tattoos) → intervention → state after treatment. The description panel lists population, arms, endpoints, follow-up, the author's role and funding — information from trial registries and project materials; details follow the current protocol version.

## Important disclaimer

SURGITOME is a **schematic educational tool**. Limb lengths are shortened and proportions are not to scale; techniques vary between centres. It is **not** a medical device and must not be used for diagnosis, treatment planning or intraoperative guidance. When used to explain surgery to patients, it should accompany — not replace — the explanation given by the treating physician.

## About the author

**Piotr Spychalski, MD, PhD** is a colorectal surgeon and clinical researcher from Gdańsk, Poland.

- **Clinical:** specialist in general surgery working in the colorectal surgery unit of the Department of Oncological, Transplant and General Surgery, University Clinical Centre (UCK), Gdańsk; postgraduate training in practical coloproctology (Jagiellonian University Medical Centre of Postgraduate Education); certified da Vinci console surgeon.
- **Academic:** Assistant Professor at the Medical University of Gdańsk; Scientific Coordinator of the Laboratory of Research in Organ Medicine; PhD with distinction for the thesis *Epidemiology of colorectal cancer and its precursor lesions*; assistant supervisor of two completed doctoral dissertations.
- **International training:** Clinical Scholars Research Training, Harvard Medical School (2023–2024); visiting professor, Università degli Studi di Milano (2023); research internships at the Clinical Effectiveness Group, University of Oslo, and the Danish Centre for Particle Therapy, Aarhus University; clinical-scientific internship at the Division of Gastrointestinal Surgery, European Institute of Oncology (IEO), Milan.
- **Research focus:** randomised health-services and comparative-effectiveness trials in colorectal surgery and endoscopy, colorectal cancer screening and epidemiology, organ-preserving treatment of early colorectal cancer, quality of colorectal surgery.
- **Output:** co-author of papers in *JAMA*, *The Lancet* (NordICC trial), *Clinical Gastroenterology and Hepatology*, *Radiotherapy and Oncology* and other journals; h-index 13, 513 citations (Web of Science, May 2026).
- **Teaching:** simulation courses in colorectal surgery at the Medical Simulation Centre of the Medical University of Gdańsk and UCK — *laparoscopic techniques in colorectal surgery* and *intestinal anastomoses: hand-sewn and stapled techniques*. SURGITOME grew out of this teaching: its anastomosis animations mirror the techniques taught in these courses.
- **Societies:** European Society for Medical Oncology (ESMO), European Society of Surgical Oncology (ESSO; Young Surgeons and Alumni Club), European Society of Coloproctology (ESCP).

### Research projects

- **CORAL trial — *COlon resections: Assessing Robotic And Laparoscopic approach in textbook outcomes*.** Principal Investigator. Funded by the Polish Medical Research Agency (Agencja Badań Medycznych, ABM; call ABM/2025/2), approx. PLN 12 million (≈ EUR 2.8 million). The trial compares robotic and laparoscopic colon resection, with textbook outcome as the measure of surgical quality.
- **ECOPOP — *Early COlorectal cancer: Patient-targeted and Organ Preserving treatment*.** Horizon Europe (HORIZON-HLTH-2024-DISEASE; grant no. 101156165), coordinated by the University of Oslo (project leader Prof. Michael Bretthauer); five-year project started in 2025. ECOPOP runs three international randomised trials — **ETHOS, SCAR and T-REX** — comparing organ-preserving strategies for early colorectal cancer (endoscopic resection, active surveillance) with standard treatment (surgery, chemoradiotherapy), together with satellite studies on biomarkers, carbon footprint (environmental impact) and computer-aided diagnosis. Piotr Spychalski is a lead co-author of the application, co-applicant and site investigator in Gdańsk; **co-PI of ETHOS** and **main investigator of T-REX**; the Medical University of Gdańsk is a site of SCAR. Project website: ecopop.gumed.edu.pl
- Other: randomised health-services study of preventive subcutaneous negative-pressure wound therapy vs primary closure after emergency laparotomy (NCT05684198, PI); STOP-HOS-1 randomised trial of intensified omeprazole to prevent high-output ileostomy (protocol published 2026).

### Selected publications

1. Pilonis ND, **Spychalski P**, Kalager M, Løberg M, Wieszczy P, Didkowska J, Wojciechowska U, Kobiela J, Regula J, Rösch T, Bretthauer M, Kaminski MF. Adenoma Detection Rates by Physicians and Subsequent Colorectal Cancer Risk. JAMA. 2025 Feb 4;333(5):400-407.
2. Kaminski MF, Kalager M, Løberg M, Emilsson L, Macios A, Samy F, Shi J, Fielding S, Hernán MA, Garborg K, Rupinski M, Dekker E, Spaander M, Holme Ø, Zauber AG, Pilonis ND, Didkowska J, **Spychalski P**, Hoff G, Regula J, Adami HO, Bretthauer M; NordICC Study Group*. Long-term effects of colonoscopy screening on colorectal cancer incidence and mortality: a multicountry, population-based randomised controlled trial. Lancet. 2026 May 9;407(10541):1787-1795.
3. **Spychalski P**, Polomska K, Pilonis ND. Minimum Case Volume Recommendations for Complex Surgery. JAMA. 2026 Mar 3
4. **Spychalski P** (corresponding author, co-first author), Kobiela J (co-first author), Wieszczy P, Pisera M, Pilonis N, Rupinski M, Bugajski M, Regula J, Kaminski MF, Mortality and Rate of Hospitalization in a Colonoscopy Screening Program From a Randomized Health Services Study Clinical Gastroenterology and Hepatology
5. **Spychalski P** (corresponding author), Kobiela J, Wieszczy P, Bugajski M, Reguła J, Kaminski MF, Adenoma to Colorectal Cancer Estimated Transition Rates Stratified by BMI Categories – A Cross-Sectional Analysis of Asymptomatic Individuals from Screening Colonoscopy Program. Cancers 2022, 14(1), 62;
6. **Spychalski P** (co-first author), Patel A, Corrao G, Jereczek-Fossa BA, Glynne-Jones R, Garcia-Aguilar J, Kobiela J. Neoadjuvant short-course radiotherapy with consolidation chemotherapy for locally advanced rectal cancer: a systematic review and meta-analysis. Acta Oncol. 2021 Jul 24:1-9.
7. **Spychalski P** (co-first author), Perdyan A, Kacperczyk J, Rostkowska O, Kobiela J. Circulating Tumor DNA in KRAS positive colorectal cancer patients as a prognostic factor - a systematic review and meta-analysis [published online ahead of print, 2020 Aug 1]. Crit Rev Oncol Hematol. 2020;154:103065.
8. **Spychalski P** (corresponding author), Kobiela J, Antoszewska MM, Błażyńska-Spychalska A, Jereczek-Fossa BA, Høyer M Patient specific outcomes of charged particle therapy for hepatocellular carcinoma – a systematic review and quantitative analysis. Radiother Oncol,
9. Kobiela J, **Spychalski P** (corresponding author), Łaski D, Błażyńska-Spychalska A, Łachiński AJ, Śledziński Z, Hull T. Structured box training improves stability of retraction while multitasking in colorectal surgery simulation. J Surg Res 2018; 229: 82–89
10. Kobiela J, Bertani E, Petz W, Crosta C, De Roberto G, Borin S, Ribero D, Baldassari D, **Spychalski P** (corresponding author), Spinoglio G. Double indocyanine green technique of robotic right colectomy: Introduction of a new technique. J Minim Access Surg. 2018 Jun 27
11. Sylwestrzak T, Ciosek M, Połomska K, Kobiela J, **Spychalski P**. Study of Treatment with Intensified Omeprazole to Prevent High-Output Stoma-A Protocol for a Randomized, Parallel-Group, Open-Label, Superiority Trial in Adults Undergoing Ileostomy (STOP-HOS-1). J Clin Med. 2026 Feb 28;15(5):1841.
12. Wilczyński M, **Spychalski P**, Proczko-Stepaniak M, Bigda J, Szymański M, Dobrzycka M, Rostkowska O, Kaska Ł. Comparison of the Long-term Outcomes of RYGB and OAGB as Conversion Procedures After Failed LSG - a Case-Control Study. J Gastrointest Surg. 2022 Jul 5. doi: 10.1007/s11605-022-05395-w. Epub ahead of print. PMID: 35790676.

Full list: `docs/PUBLICATIONS.md` · up-to-date record: ORCID [0000-0001-7111-4660](https://orcid.org/0000-0001-7111-4660).

## Development

SURGITOME was built with the help of an AI assistant (Claude, Anthropic) for programming the models and drafting the descriptions. The concept, choice of procedures and medical content are my own; I have personally reviewed all models, descriptions and anatomical data and take full responsibility for them. Schematic educational tool, not a medical device. Clinical feedback on oesophagectomy anastomoses: Maciej Wilczyński.

References for every procedure (original descriptions, current guidelines, sources of the details shown in the models, endoscopy after surgery; Vancouver style with PubMed and DOI links): in the app under *Description → References* and *Sources* in the panel footer; full list with the claim each source supports: `docs/BIBLIOGRAFIA.md`.

Technical documentation (architecture, modules, data conventions, test suite): `docs/TECHNICAL.md`.

## How to cite

If you use SURGITOME in teaching, research or publications, please cite the version archived in Zenodo:

> Spychalski P. *SURGITOME: interactive 3D atlas of postoperative gastrointestinal anatomy* [software]. Zenodo; 2026. doi:[10.5281/zenodo.23185125](https://doi.org/10.5281/zenodo.23185125)

Concept DOI (all versions, always resolves to the latest): [10.5281/zenodo.23185125](https://doi.org/10.5281/zenodo.23185125). Version 1.0.0: [10.5281/zenodo.23185126](https://doi.org/10.5281/zenodo.23185126). To cite a specific version, use its version DOI from the [Zenodo record](https://doi.org/10.5281/zenodo.23185125). Machine-readable metadata: `CITATION.cff` (GitHub: *Cite this repository*) and `.zenodo.json`.

## License

© 2026 Piotr Spychalski. SURGITOME is dual-licensed:

| Part | Licence | File |
| --- | --- | --- |
| **Code**: program logic, user interface, build and test scripts (`src/app/`, `src/shell.html`, `build.js`, `tests/`, `tools/`) | [MIT License](https://opensource.org/licenses/MIT) | `LICENSE` |
| **Content**: 3D anatomical models and their data (mainly `src/core/`), illustrations (every frame, endoscopic view and schematic CT section rendered by the application, including screenshots and recordings), texts (descriptions, labels, Polish and English interface texts, documentation) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | `LICENSE-CONTENT` |

Where code and content share a file (for example anatomical data written as JavaScript), the program logic is under MIT and the content under CC BY 4.0. Reuse of the content, including commercial reuse, requires attribution to the author (see *How to cite*).

Third-party components keep their own licences and are not part of this repository: [three.js](https://threejs.org/) 0.147.0 (MIT License, © three.js authors) and the [Atkinson Hyperlegible](https://fonts.google.com/specimen/Atkinson+Hyperlegible) font (SIL Open Font License 1.1, Braille Institute of America), both loaded from public CDNs.

---

# SURGITOME — interaktywna anatomia pooperacyjna 3D (po polsku)

**Autor:** dr n. med. Piotr Spychalski — chirurg kolorektalny i badacz kliniczny, adiunkt w Katedrze i Klinice Chirurgii Onkologicznej, Transplantacyjnej i Ogólnej Gdańskiego Uniwersytetu Medycznego · ORCID [0000-0001-7111-4660](https://orcid.org/0000-0001-7111-4660) · piotr.spychalski@gumed.edu.pl

SURGITOME to interaktywny, schematyczny atlas 3D **anatomii przewodu pokarmowego po operacjach**, stworzony przez dr. Piotra Spychalskiego. Pokazuje krok po kroku zakres resekcji, rekonstrukcję i zespolenia (staplery liniowe i okrężne, szwy), obraz endoskopowy po operacji oraz schematyczne przekroje TK (tomografia komputerowa).

## Dla kogo

- **Studenci medycyny** — nauka chirurgii przewodu pokarmowego i anatomii pooperacyjnej.
- **Lekarze innych specjalności** — endoskopiści i gastroenterolodzy (np. odnalezienie pętli doprowadzającej, brodawki, ślepego kikuta), radiolodzy, interniści, onkolodzy, lekarze SOR i intensywnej terapii.
- **Lekarze w trakcie specjalizacji chirurgicznej** — konfiguracje zespoleń (izo- i antyperystaltyczne, koniec-do-końca, bok-do-boku, podwójne staplowanie).
- **Pacjenci**, razem z lekarzem — wyjaśnienie zakresu resekcji i rekonstrukcji w zrozumiały, obrazowy sposób.

## Zabiegi (29 operacji, 57 wariantów)

Do tego dwa slajdy dydaktyczne: anatomia wątroby i wybór zakresu resekcji jelita grubego.

- **Przełyk:** Esofagektomia (Ivor Lewis; Ivor Lewis — bok-do-boku; McKeown; McKeown — bok-do-boku; Przezrozworowa (Orringer); Akiyama; Interpozycja okrężnicy)
- **Żołądek:** Resekcja dystalna (Billroth I; Billroth II; Billroth II + Braun; Roux-en-Y), Gastrektomia całkowita, Gastroenterostomia omijająca
- **Bariatria:** Rękawowa resekcja (sleeve), Bypass Roux-en-Y (RYGB), Bypass jednozespoleniowy (OAGB), Przełączenie dwunastnicze (SADI-S; BPD-DS), BPD (Scopinaro)
- **Trzustka i drogi żółciowe:** Whipple (klasyczny) (PJ + HJ + GJ; PG + HJ + GJ), Traverso-Longmire (PPPD) (PJ + HJ + DJ; PG + HJ + DJ), Pankreatektomia dystalna, Hepatikojejunostomia (Roux-en-Y), Choledochoduodenostomia, Operacje drenujące (Puestow, Frey) (Puestow (Partington–Rochelle); Frey)
- **Wątroba:** Anatomia wątroby (wnęka: żyła wrotna, tętnica wątrobowa i drogi żółciowe z podziałem, żyły wątrobowe i IVC; segmenty Couinauda I–VIII wyróżniane kliknięciem i rozsuwane suwakiem; nazewnictwo Brisbane 2000), Przeszczepienie wątroby (OLTx: rekonstrukcja żylna klasyczna lub piggyback × przewód–przewód lub hepatikojejunostomia na pętli Roux-en-Y; hepatektomia biorcy, wszczepienie i kolejne zespolenia), Resekcje wątroby: slajd z guzem (przesuwany guz — metastazektomia z marginesem albo resekcja anatomiczna objętych segmentów z nazwą zabiegu i objętością pozostałej wątroby), Bisegmentektomia II/III, Prawa i lewa hemihepatektomia (kontrola dopływu, linia demarkacyjna, przecięcie miąższu, kikuty), ALPPS (etap I, przerost segmentów II/III, etap II)
- **Jelito cienkie:** Resekcja jelita cienkiego (Koniec-do-końca (szew); Izoperystaltyczne; Antyperystaltyczne (FEEA))
- **Jelito grube:** Wybór zakresu resekcji (przesuwany guz podświetla zakres resekcji, krezkę i naczynia do podwiązania; ASCRS 2022, odbytnica PME/TME/APR), Hemikolektomia prawa (Izoperystaltyczne; Antyperystaltyczne (FEEA); Poszerzona — izoperystaltyczne), Hemikolektomia lewa (Koniec-do-końca (EEA); Izoperystaltyczne; Antyperystaltyczne (FEEA)), Resekcja odbytnicy (Linia przez środek; Rakieta tenisowa; Przednia ściana), Kolektomia całkowita (IRA), Zbiornik J (IPAA), Hartmann, Ileostomia (Pętlowa — wydzielnicza górna; Pętlowa — wydzielnicza dolna; Dwulufowa — wydzielnicza górna; Dwulufowa — wydzielnicza dolna)

## Widok badań

Osobny, ukryty widok pokazuje badania randomizowane projektu **ECOPOP**: dwa ramiona obok siebie (**split screen**), na wspólnej osi czasu (te same kadry, to samo tempo animacji) i ze zsynchronizowaną kamerą (synchronizację można wyłączyć). Widoku nie ma w głównej nawigacji: badanie wyszukuje się po nazwie (np. *ETHOS*, *SCAR*, *EFTR*, *ECOPOP*), a gwiazdka dodaje je do Ulubionych.

- **ETHOS** (NCT06940947): **A** pełnościenna resekcja endoskopowa (eFTR: nasadka FTRD, klips OTSC, odcięcie pętlą; narząd, krezka i węzły chłonne zachowane) vs **B** resekcja segmentarna z limfadenektomią (tu: hemikolektomia prawa — podwiązanie naczyń u odejścia, krezka z węzłami usuwana z preparatem).
- **SCAR** (NCT06057350): **A** eFTR blizny po resekcji endoskopowej vs **B** resekcja segmentarna.

Kadry: punkt wyjścia (obie połowy identyczne: zmiana lub blizna, tatuaże) → interwencja → stan po leczeniu. Panel „Opis” zawiera populację, ramiona, punkty końcowe, obserwację, rolę autora i finansowanie — informacje z rejestrów badań i materiałów projektu; szczegóły wg aktualnej wersji protokołu.

## Zastrzeżenie

Narzędzie **schematyczne i edukacyjne**: długości pętli skrócone, proporcje nieanatomiczne, techniki różnią się między ośrodkami. Nie jest wyrobem medycznym i nie służy do diagnostyki, planowania leczenia ani nawigacji śródoperacyjnej. W rozmowie z pacjentem uzupełnia — nie zastępuje — wyjaśnień lekarza prowadzącego.

## O autorze

**Dr n. med. Piotr Spychalski** — specjalista chirurgii ogólnej w oddziale chirurgii kolorektalnej Kliniki Chirurgii Onkologicznej, Transplantacyjnej i Ogólnej UCK w Gdańsku, adiunkt Gdańskiego Uniwersytetu Medycznego i koordynator naukowy Laboratorium Badań Medycyny Narządowej; doktorat z wyróżnieniem (*Epidemiologia raka jelita grubego i jego zmian prekursorowych*). Szkolenia: Harvard Medical School (Clinical Scholars Research Training), Uniwersytet w Mediolanie (visiting professor), Uniwersytet w Oslo, Uniwersytet w Aarhus, European Institute of Oncology w Mediolanie; certyfikowany chirurg konsoli da Vinci; studia podyplomowe z proktologii praktycznej (UJ).

- **CORAL** — randomizowane porównanie resekcji okrężnicy robotycznej i laparoskopowej z oceną jakości przez *textbook outcome*; kierownik badania (PI); finansowanie Agencji Badań Medycznych (ABM/2025/2), ok. 12 mln zł.
- **ECOPOP** — Horizon Europe (grant nr 101156165, koordynator Uniwersytet w Oslo): trzy międzynarodowe badania randomizowane (ETHOS, SCAR, T-REX) porównujące strategie oszczędzające narząd we wczesnym raku jelita grubego (resekcja endoskopowa, aktywna obserwacja) z leczeniem standardowym (operacja, chemioradioterapia); współautor wniosku, współwnioskodawca i badacz ośrodka w Gdańsku; **współkierownik badania ETHOS (co-PI)** i **główny badacz (main investigator) badania T-REX**; GUMed jest ośrodkiem badania SCAR.
- Publikacje m.in. w *JAMA*, *The Lancet*, *Clinical Gastroenterology and Hepatology*; indeks h = 13 (Web of Science, maj 2026). Pełna lista: `docs/PUBLICATIONS.md`.
- Prowadzi kursy symulacyjne z chirurgii kolorektalnej w Centrum Symulacji Medycznej GUMed i UCK (techniki laparoskopowe; zespolenia jelitowe ręczne i staplerowe).

SURGITOME stworzyłem z pomocą asystenta AI (Claude, Anthropic), który wspierał programowanie modeli i redakcję opisów. Koncepcja, dobór zabiegów i treść medyczna są moje. Wszystkie modele, opisy i dane anatomiczne osobiście sprawdziłem i odpowiadam za ich poprawność. Narzędzie edukacyjne, schematyczne, nie jest wyrobem medycznym.

Piśmiennictwo do każdego zabiegu (opisy oryginalne, aktualne wytyczne, źródła szczegółów pokazanych w modelach, endoskopia po zabiegu; styl Vancouver z odnośnikami do PubMed i DOI): w aplikacji w panelu *Opis → Piśmiennictwo* i pod *Źródła* w stopce panelu; pełna lista z uzasadnieniem każdej pozycji: `docs/BIBLIOGRAFIA.md`.

## Jak cytować

Jeśli korzystasz z SURGITOME w dydaktyce, badaniach lub publikacjach, zacytuj wersję zarchiwizowaną w Zenodo:

> Spychalski P. *SURGITOME: interactive 3D atlas of postoperative gastrointestinal anatomy* [software]. Zenodo; 2026. doi:[10.5281/zenodo.23185125](https://doi.org/10.5281/zenodo.23185125)

DOI koncepcyjny (wszystkie wersje, zawsze prowadzi do najnowszej): [10.5281/zenodo.23185125](https://doi.org/10.5281/zenodo.23185125). Wersja 1.0.0: [10.5281/zenodo.23185126](https://doi.org/10.5281/zenodo.23185126). Aby zacytować konkretną wersję, użyj jej DOI z [rekordu w Zenodo](https://doi.org/10.5281/zenodo.23185125). Metadane: `CITATION.cff` i `.zenodo.json`.

## Licencja

© 2026 Piotr Spychalski. Kod (logika programu, interfejs, skrypty budowania i testy) jest udostępniony na licencji **MIT** (`LICENSE`). Treści, czyli modele anatomiczne 3D i ich dane, ilustracje (kadry, obraz endoskopowy, przekroje TK, także zrzuty ekranu i nagrania) oraz teksty, są udostępnione na licencji **CC BY 4.0** (`LICENSE-CONTENT`). Wykorzystanie treści, także komercyjne, wymaga podania autora. Komponenty zewnętrzne (three.js, font Atkinson Hyperlegible) mają własne licencje.
