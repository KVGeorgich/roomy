// Small Russian copy fixes on top of the merged localisation.
// Edits strings.json values only, then regenerates S.g.cs and the .resx files.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const locDir = path.join(root, 'src', 'Roomy', 'Localization');
const manifestPath = path.join(locDir, 'strings.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const fixes = {
  // untranslated
  Minutes60: '60 минут',
  // Windows 11 path has "Система" between Параметры and Память
  StoragePath: 'Параметры → Система → Память → Временные файлы → Предыдущие установки Windows',
  // "от админа" is slang; use the wording Windows itself uses
  RestartAsAdmin: 'Перезапустить от имени администратора',
  AdminLockHint: 'Перезапустите Roomy от имени администратора, чтобы проверить и файлы Windows Update.',
  WindowsLocksNote: 'Windows блокирует эти файлы. Перезапустите Roomy от имени администратора, чтобы их проверить.',
  NoAdminWorries: 'Не страшно — Roomy работает и без прав администратора.',
  // reads better
  AdminLockTitle: 'Windows не даёт очистить самые крупные остатки.',
  InUseSkipped: 'Занятые файлы пропускаются и не удаляются принудительно.',
  KeepInTrayHint: 'При закрытии окна проверки продолжаются. Чтобы выйти, используйте «Выйти» в трее.',
  CatTempDesc: 'Мусор, который приложения создают во время работы и забывают убрать. Только файлы старше суток.',
  ItemTempFolder: 'Временная папка',
  ItemWindowsTemp: 'Временная папка Windows',
  PickSomething: 'Выберите, что очистить',
  WeeklyTitle: 'Roomy нашёл {0} кандидатов на очистку',
  InUseSkippedMessage: '{0} было занято открытыми приложениями, поэтому мы его не трогали. Закройте их и запустите сканирование снова, чтобы освободить.',
  // proper Russian plural for days (2 дня / 5 дней)
  AgoDays: '{0} дней назад',
  AgoDaysOne: '{0} день назад',
  AgoDaysFew: '{0} дня назад',
};

let changed = 0;
for (const s of manifest.strings) {
  if (Object.prototype.hasOwnProperty.call(fixes, s.key) && s.ru !== fixes[s.key]) {
    s.ru = fixes[s.key];
    changed += 1;
  }
}
// add the day plural keys if they are not there yet
const have = new Set(manifest.strings.map((s) => s.key));
for (const key of ['AgoDaysOne', 'AgoDaysFew']) {
  if (!have.has(key)) {
    manifest.strings.push({ key, en: '{0} days ago', ru: fixes[key] });
    changed += 1;
  }
}
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(`правок в strings.json: ${changed}, всего строк: ${manifest.strings.length}`);
