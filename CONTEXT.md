# Online CV

Peerapob's personal CV, published as the root page of `jpeerapob.github.io` and exportable to PDF.

## Language

**CV**:
The single English-language career document about Peerapob, viewable as a web page and printable to PDF.
_Avoid_: Resume, profile

**CV Data**:
The one source of truth for every fact shown in the CV; nothing factual lives in the page itself.
_Avoid_: content, config

**Web View**:
The CV as seen in a browser on screen, following the viewer's light/dark preference.

**Print View**:
The CV as it appears when printed or saved as PDF: A4, always light, at most two pages, links shown as text.
_Avoid_: PDF version, export

**Anonymized Client**:
A customer of a project, described only by industry (e.g. "a Thai commercial bank") and never by name.
_Avoid_: customer name, client

**In-progress Certification**:
A certification being studied for but not yet earned; always labelled as such so it is never mistaken for a held one.

## Relationships

- The **Web View** and the **Print View** render the same **CV Data**; the **Print View** only restyles, it never adds or removes facts
- Every project in the **CV Data** names an **Anonymized Client**

## Flagged ambiguities

- "Since 2023" in an older slide referred to ServiceNow consulting; employment at MFEC starts in 2022 — the **CV** follows employment records.
