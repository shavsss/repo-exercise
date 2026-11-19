# פרסום סבב 9 (ארכיטקטורה, תוכנה והצד הארגוני-עסקי): הצעדים המדויקים

נכתב ב-19.11.2026 בענף `claude/adoring-sagan-30ce0y` (מבוסס על `integrate/2026-11-17`). **לא פורסם.** המסמך הזה הוא ההוראות לשיחה הבאה. הרקע והמספרים ב-[`ARCH_SOFTWARE_SOURCES.md`](ARCH_SOFTWARE_SOURCES.md).

## מה משתנה בפרסום

| אפליקציה | קבצים | גודל | מאגר הקבצים |
|---|---|---|---|
| גילואה (`LtW5eytwQFZ4wAXhDSAw3k`) | `lib/index.json`, `lib/text/W92.json` … `lib/text/W97.json` | כ-6.3MB (האינדקס 4.69MB, הטקסט 1.64MB) | בלי שינוי: המסמכים החדשים נארזים בלי איורים (`TEXT_ONLY` ב-`eng/tools/pack.py`) |
| לנצ'סטר (`1tTftT3T7L7p67ofNzvfc9`) | `lib/index.json`, `lib/text/W93.json`, `lib/text/W97.json` | כ-2.66MB | בלי שינוי (`--text-only`) |

- **קוד האפליקציות לא השתנה** בסבב הזה (`eng/app/src`, `core/app/src` כמו ב-`integrate/2026-11-17`, שממנו פורסמו גילואה v140 ולנצ'סטר v156). לכן אין צורך לפרסם `app.js` ו-`app.css`. אם בכל זאת מפרסמים קוד, בונים מהענף הזה בלבד.
- **אין אריזה מלאה של `lib/`.** הרצה של `eng/tools/pack.py` בלי `--only` תבחר עוד מסמכים כבדים למאגר הקבצים (`choose_asset_docs`, עד `LIB_BUDGET`), והמאגר מלא (3.4MB פנויים מתוך 1GiB). רק אריזה של המסמכים החדשים עם `--only`.
- הגרסה של גילואה עולה מכ-261.3MB לכ-263.0MB, מתוך 268.4MB (256MiB). נשארים כ-5.4MB.

## 0. לפני הכול

```bash
git pull
bash tools/prepublish_check.sh          # חייב לעבור: HEAD מכיל את origin/main ואת ה-commit החי (c8340b2)
```

## 1. כלים (פעם אחת לסביבה)

```bash
pip install scipy pymupdf               # המחלץ (scipy) והאורז (core/tools/sections.py צריך pymupdf)
apt-get install -y tesseract-ocr        # שני עמודים ב-W92 ועמודים ב-W93 (Conway, סריקה) עוברים OCR
```

## 2. חילוץ (תוצרים ב-`eng/build/lib/`, לא ב-git)

```bash
mkdir -p tmp/r9
printf "W96\nW92\nW93\nW95\nW94\nW97\n" | xargs -P 6 -I{} sh -c 'python3 eng/tools/extract.py {} > tmp/r9/extract_{}.log 2>&1; echo "{} exit $?"'
mkdir -p core/build/lib && cp -r eng/build/lib/W93 eng/build/lib/W97 core/build/lib/    # לנצ'סטר משתמשת באותם שני מסמכים
```

ציפייה (נמדד ב-19.11): W92 586 עמודים, W93 102, W94 59, W95 51, W96 134, W97 73. כל אחד יוצא עם `exit 0`.

## 3. האינדקסים שפורסמו

Artifact `action: "read"`, `path: "lib/index.json"`, לכל אפליקציה, ולהעתיק ל-`tmp/r9/eng_published_index.json` ו-`tmp/r9/core_published_index.json`. לבדוק שה-`version` הוא של הגרסה החיה (ב-19.11: גילואה `136739aff884`, לנצ'סטר לפי מה שחוזר). אם פורסם משהו אחרי 19.11, האינדקס החדש הוא הבסיס.

## 4. אריזה של המסמכים החדשים בלבד

```bash
PACK_OUT=tmp/r9/eng/lib  python3 eng/tools/pack.py  --only W92 W93 W94 W95 W96 W97 --base tmp/r9/eng_published_index.json  > tmp/r9/pack_eng.log 2>&1
PACK_OUT=tmp/r9/core/lib python3 core/tools/pack.py --only W93 W97 --text-only W93 W97 --base tmp/r9/core_published_index.json > tmp/r9/pack_core.log 2>&1
```

בלוג: `0 figures in 0 files, 0 page images` לכל מסמך, ומספר הכותרות (W92: 116, מתוכן העניינים שנכתב לקובץ).
האינדקס נבנה עם הסילבוס ותוכנית הלימודים העדכניים (`syllabus.py` טוען את `tools/curriculum/round9.py`), כך שאין צורך גם ב-`patch_index.py`.

## 5. בדיקה מול נתוני הלומד (חובה)

dump של נתוני הלומד מכל אפליקציה לפי `docs/BACKUP.md` (רשימת האוספים, ArtifactData `list`), ואז:

```bash
python3 tools/curriculum/validate.py --app eng  --old tmp/r9/eng_published_index.json  --new tmp/r9/eng/lib/index.json  --dump <dump של גילואה>
python3 tools/curriculum/validate.py --app core --old tmp/r9/core_published_index.json --new tmp/r9/core/lib/index.json --dump <dump של לנצ'סטר>
```

ב-19.11 הבדיקה עברה עם dump ריק (`[eng] OK`, `[core] OK`, 9 מודולים חדשים בגילואה ו-1 בלנצ'סטר, M22.16 מ-adv ל-core). הבדיקה עם הנתונים האמיתיים (סעיפים 3–4 של validate) עוד לא נעשתה.

## 6. פרסום (פעימה אחת לכל אפליקציה, מתחת ל-64MB ו-255 קבצים)

גילואה: Artifact publish עם `url: https://claude.ai/artifact/LtW5eytwQFZ4wAXhDSAw3k`, `file_path: eng/app/artifact/index.html`, בלי `capabilities` (נשמרות), בלי `icon`, ו-`files`:

```json
{
  "lib/index.json": "tmp/r9/eng/lib/index.json",
  "lib/text/W92.json": "tmp/r9/eng/lib/text/W92.json",
  "lib/text/W93.json": "tmp/r9/eng/lib/text/W93.json",
  "lib/text/W94.json": "tmp/r9/eng/lib/text/W94.json",
  "lib/text/W95.json": "tmp/r9/eng/lib/text/W95.json",
  "lib/text/W96.json": "tmp/r9/eng/lib/text/W96.json",
  "lib/text/W97.json": "tmp/r9/eng/lib/text/W97.json"
}
```

לנצ'סטר: אותו דבר עם `url: https://claude.ai/artifact/1tTftT3T7L7p67ofNzvfc9`, `file_path: core/app/artifact/index.html`, ו-`files`: `lib/index.json`, `lib/text/W93.json`, `lib/text/W97.json` מ-`tmp/r9/core/lib/`.

**לפני הפעימה:** לוודא ש-`index.html` שבענף זהה לזה שפורסם (Artifact `read` בלי `path`). אם הוא שונה, לפרסם את מה שפורסם.

## 7. אחרי הפרסום

1. Artifact `list` עם `scope: "files"` לגילואה: סכום הגדלים מתחת ל-268,435,456 בתים (צפי כ-263.0MB), ומספר הקבצים 263 מתוך 511.
2. לפתוח את גילואה: M27.1, M27.12 ו-M27.13 במקומות 10–12 בסדר, אחרי P1; M27.4, M27.5 ו-M27.8 מיד אחרי M27.3; תג מקור `[[W93:5]]` פותח את Parnas.
3. לנצ'סטר: M15.8 מיד אחרי M15.6.
4. שורת `- פרסום:` ב-`docs/STATUS.md` עם הגרסאות, הענף וה-commit.

## אם רוצים גם את האיורים של המסמכים החדשים

כ-2.9MB של WebP (כ-3.9MB אחרי base64), בעיקר W93–W96. במאגר הקבצים אין מקום. אפשרות אחת: להוריד את המסמך מ-`TEXT_ONLY` ולארוז ל-`lib/` (נכנס, אבל לוקח כ-70% מהמרווח שנשאר בגרסה). האפשרות המומלצת: קודם לפנות מקום במאגר (ARCH_SOFTWARE_SOURCES.md, סעיף 4, אפשרות ד).
