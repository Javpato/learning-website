# CV — Javier Gomez Mijangos

Tailored CV for the **Bending Spoons First Ascent France** application.

## Files

| File | Description |
|------|-------------|
| `cv-en.html` | English CV — self-contained (avatar embedded as a base64 `data:` URI, inline CSS, print stylesheet). |
| `cv-fr.html` | French version, same design. |
| `javier-gomez-mijangos-cv-en.pdf` | Print-ready A4 PDF rendered from `cv-en.html`. |
| `javier-gomez-mijangos-cv-fr.pdf` | Print-ready A4 PDF rendered from `cv-fr.html`. |

The photo is the real headshot from the `javpato.github.io` portfolio (`avatar.jpg`),
embedded inline as a base64 `data:` URI so the files are fully self-contained and make no
network requests. Content is drawn from that portfolio site plus the `learning-website` repo.

Contact details, education, skills, projects, and the HUB71 experience are already filled in —
review them and tweak anything you'd like to phrase differently.

## Regenerate the PDFs

After editing an HTML file, re-render its PDF (uses Chromium's headless print-to-PDF):

```bash
chromium --headless=new --no-pdf-header-footer \
  --print-to-pdf=javier-gomez-mijangos-cv-en.pdf \
  "file://$PWD/cv-en.html"
```

(Replace `chromium` with your Chrome/Chromium binary; repeat for the `-fr` file.)
Any modern browser's **Print → Save as PDF** on the HTML file also works.
