/**
 * find_missing_translations.cjs
 *
 * Varre a pasta src/ do projeto procurando:
 *  1) Todas as chamadas t("...") / t('...') com string literal
 *  2) Todos os valores de campos comuns de texto (name, description, lore, etc.)
 *     em arquivos de "banco de dados" (items.ts, monsters.ts, skills.ts, origins.ts, etc.)
 *
 * Depois compara essa lista com as chaves já existentes em
 * src/core/engine/translation.ts (o objeto DICTIONARY) e mostra:
 *  - quantas strings existem no total
 *  - quantas já têm tradução
 *  - quantas AINDA FALTAM (e quais são elas)
 *
 * Uso:
 *   node find_missing_translations.cjs
 *
 * Gera dois arquivos na pasta atual:
 *   all_translatable_strings.txt   -> todas as strings encontradas
 *   missing_translations.txt       -> só as que faltam traduzir
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(process.cwd(), 'src');
const TRANSLATION_FILE = path.join(SRC_DIR, 'core', 'engine', 'translation.ts');

// Campos de objetos que costumam conter texto traduzível nos "bancos de dados"
const TEXT_FIELD_KEYS = [
  'name', 'description', 'title', 'subtitle', 'label', 'message', 'desc',
  'roleName', 'traitName', 'traitDescription', 'lore', 'rewardText',
  'secretDescription', 'issuer', 'baseEffectText'
];

function walk(dir, exts, results = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules') continue;
      walk(full, exts, results);
    } else if (exts.some(e => entry.name.endsWith(e))) {
      results.push(full);
    }
  }
  return results;
}

function extractQuotedStrings(content, regex) {
  const found = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    let str = match[2];
    // ignora strings vazias, muito curtas, ou que parecem código/classe CSS
    if (!str || str.trim().length < 2) continue;
    if (/^[a-z0-9_\-.:/#\[\]{}]+$/i.test(str) && !/[áéíóúâêôãõçÁÉÍÓÚÂÊÔÃÕÇ ]/.test(str)) continue;
    found.push(str.trim());
  }
  return found;
}

function extractFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const strings = new Set();

  // 1) chamadas t("...") ou t('...')  (ignora template literals com ${})
  const tCallRegex = /\bt\(\s*(["'])((?:\\.|(?!\1)[^\\])*)\1\s*\)/g;
  extractQuotedStrings(content, tCallRegex).forEach(s => strings.add(s));

  // 2) campos de texto tipo name: '...', description: "...", etc.
  for (const key of TEXT_FIELD_KEYS) {
    const fieldRegex = new RegExp(`\\b${key}\\s*:\\s*(["'])((?:\\\\.|(?!\\1)[^\\\\])*)\\1`, 'g');
    extractQuotedStrings(content, fieldRegex).forEach(s => strings.add(s));
  }

  return strings;
}

function main() {
  if (!fs.existsSync(SRC_DIR)) {
    console.error('Não encontrei a pasta src/. Rode este script na raiz do projeto.');
    process.exit(1);
  }

  const files = walk(SRC_DIR, ['.ts', '.tsx']);
  const allStrings = new Set();

  for (const file of files) {
    try {
      const strs = extractFromFile(file);
      strs.forEach(s => allStrings.add(s));
    } catch (e) {
      console.error(`Erro lendo ${file}:`, e.message);
    }
  }

  let translationContent = '';
  if (fs.existsSync(TRANSLATION_FILE)) {
    translationContent = fs.readFileSync(TRANSLATION_FILE, 'utf-8');
  } else {
    console.warn('Aviso: não encontrei translation.ts no caminho esperado. Ajuste TRANSLATION_FILE no script.');
  }

  const missing = [];
  const found = [];

  const baseItems = new Set([
    "Lâmina", "Rifle", "Disparador", "Ferramenta", "Canhão", "Bastão", "Colete",
    "Chassi", "Capacete", "Calça", "Bota", "Botas", "Braçadeira", "Grevas", "Luva",
    "Macacão", "Manopla", "Máscara", "Módulo", "Interface", "Núcleo", "Perneira",
    "Pisante", "Placa", "Propulsor", "Protetor", "Solado", "Sensor", "Visor",
    "Coroa", "Estabilizador", "Exo-Braço", "Chip", "Bateria", "Blindagem", "Capacitor",
    "Chave"
  ]);

  const types = new Set([
    "Universal", "Voltaico", "Matricial", "Mutante", "Iniciante", "Engrenado",
    "Remoto", "Orgânico", "Massivo", "Necro-Sintético", "Telescópico", "Furtivo", "Cirúrgico",
    "Letal"
  ]);

  const conditions = new Set([
    "Enferrujado", "Padrão", "Usado", "Sucateado", "Genérico", "Reforçado",
    "Militar", "Avançado", "Otimizado", "Customizado", "Experimental", "Sintético",
    "Quântico", "Protótipo"
  ]);

  function isProceduralItem(s) {
    let rest = s;
    if (s.startsWith("Kinetix ")) rest = s.substring(8);
    else if (s.startsWith("AeroDynamics ")) rest = s.substring(13);
    else if (s.startsWith("OmniCorp ")) rest = s.substring(9);

    const words = rest.split(" ");
    if (words.length === 4 && words[0] === "Chassi" && words[1] === "Inferior") {
      return types.has(words[2]) && conditions.has(words[3]);
    }
    if (words.length === 5 && words[0] === "Protetor" && words[1] === "de" && words[2] === "Pulso") {
      return types.has(words[3]) && conditions.has(words[4]);
    }
    if (words.length === 3 && words[0] === "Chave" && words[1] === "Letal") {
      return conditions.has(words[2]);
    }
    if (words.length === 5 && words[2] === "Obsoleto" && words[3] === "e" && words[4] === "Letal") {
      return baseItems.has(words[0]) && types.has(words[1]);
    }
    if (words.length === 6 && words[0] === "Chassi" && words[1] === "Inferior" && words[3] === "Obsoleto" && words[4] === "e" && words[5] === "Letal") {
      return types.has(words[2]);
    }
    if (words.length === 3) {
      return baseItems.has(words[0]) && types.has(words[1]) && conditions.has(words[2]);
    }
    return false;
  }

  // Parse all dictionary keys from translationContent and unescape them
  const dictKeys = new Set();
  const keyRegex = /^\s*(["'])((?:\\.|(?!\1)[^\\])*)\1\s*:/gm;
  let keyMatch;
  while ((keyMatch = keyRegex.exec(translationContent)) !== null) {
    const rawKey = keyMatch[2];
    const unescapedKey = rawKey.replace(/\\(.)/g, '$1');
    dictKeys.add(unescapedKey);
  }

  for (const str of allStrings) {
    if (str.startsWith("//") || str.startsWith("/*")) {
      continue;
    }

    if (isProceduralItem(str)) {
      found.push(str);
      continue;
    }

    // Unescape the extracted string so we compare standard strings
    const unescapedStr = str.replace(/\\(.)/g, '$1');

    if (dictKeys.has(unescapedStr)) {
      found.push(str);
    } else {
      missing.push(str);
    }
  }

  const sortedAll = Array.from(allStrings).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  const sortedMissing = missing.sort((a, b) => a.localeCompare(b, 'pt-BR'));

  fs.writeFileSync('all_translatable_strings.txt', sortedAll.join('\n'), 'utf-8');
  fs.writeFileSync('missing_translations.txt', sortedMissing.join('\n'), 'utf-8');

  console.log('==============================================');
  console.log(`Total de strings únicas encontradas: ${allStrings.size}`);
  console.log(`Já traduzidas (no DICTIONARY):        ${found.length}`);
  console.log(`FALTANDO traduzir:                    ${missing.length}`);
  console.log('==============================================');
  console.log('Arquivos gerados:');
  console.log(' - all_translatable_strings.txt (lista completa)');
  console.log(' - missing_translations.txt (só o que falta)');
  console.log('');
  if (missing.length > 0) {
    console.log('Primeiras 20 strings faltando (exemplo):');
    sortedMissing.slice(0, 20).forEach(s => console.log(' - ' + s));
  }
}

main();
