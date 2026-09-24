/**
 * Word Processor Auto-Correct Engine
 * Automatically monitors common typos and abbreviations and replaces them as the user types.
 */

export interface AutoCorrectEntry {
  from: string;
  to: string;
  category: 'typo' | 'contraction' | 'symbol' | 'abbreviation' | 'custom';
}

export const BUILT_IN_AUTOCORRECT: AutoCorrectEntry[] = [
  // Common Misspellings & Typos
  { from: 'teh', to: 'the', category: 'typo' },
  { from: 'taht', to: 'that', category: 'typo' },
  { from: 'adn', to: 'and', category: 'typo' },
  { from: 'waht', to: 'what', category: 'typo' },
  { from: 'wiht', to: 'with', category: 'typo' },
  { from: 'thier', to: 'their', category: 'typo' },
  { from: 'hte', to: 'the', category: 'typo' },
  { from: 'wich', to: 'which', category: 'typo' },
  { from: 'recieve', to: 'receive', category: 'typo' },
  { from: 'recieved', to: 'received', category: 'typo' },
  { from: 'recieving', to: 'receiving', category: 'typo' },
  { from: 'seperate', to: 'separate', category: 'typo' },
  { from: 'seperated', to: 'separated', category: 'typo' },
  { from: 'definately', to: 'definitely', category: 'typo' },
  { from: 'occured', to: 'occurred', category: 'typo' },
  { from: 'untill', to: 'until', category: 'typo' },
  { from: 'accomodate', to: 'accommodate', category: 'typo' },
  { from: 'goverment', to: 'government', category: 'typo' },
  { from: 'beleive', to: 'believe', category: 'typo' },
  { from: 'beleived', to: 'believed', category: 'typo' },
  { from: 'calender', to: 'calendar', category: 'typo' },
  { from: 'tommorow', to: 'tomorrow', category: 'typo' },
  { from: 'tommorrow', to: 'tomorrow', category: 'typo' },
  { from: 'becuase', to: 'because', category: 'typo' },
  { from: 'becasue', to: 'because', category: 'typo' },
  { from: 'truely', to: 'truly', category: 'typo' },
  { from: 'alot', to: 'a lot', category: 'typo' },
  { from: 'adress', to: 'address', category: 'typo' },
  { from: 'alright', to: 'all right', category: 'typo' },
  { from: 'commitee', to: 'committee', category: 'typo' },
  { from: 'enviroment', to: 'environment', category: 'typo' },
  { from: 'embarass', to: 'embarrass', category: 'typo' },
  { from: 'maintainance', to: 'maintenance', category: 'typo' },
  { from: 'neccessary', to: 'necessary', category: 'typo' },
  { from: 'noticable', to: 'noticeable', category: 'typo' },
  { from: 'occurence', to: 'occurrence', category: 'typo' },
  { from: 'peice', to: 'piece', category: 'typo' },
  { from: 'priviledge', to: 'privilege', category: 'typo' },
  { from: 'recommand', to: 'recommend', category: 'typo' },
  { from: 'succesful', to: 'successful', category: 'typo' },
  { from: 'suprise', to: 'surprise', category: 'typo' },
  { from: 'wierd', to: 'weird', category: 'typo' },
  { from: 'acheive', to: 'achieve', category: 'typo' },
  { from: 'freind', to: 'friend', category: 'typo' },

  // Contractions (missing apostrophe)
  { from: 'dont', to: "don't", category: 'contraction' },
  { from: 'cant', to: "can't", category: 'contraction' },
  { from: 'wont', to: "won't", category: 'contraction' },
  { from: 'didnt', to: "didn't", category: 'contraction' },
  { from: 'couldnt', to: "couldn't", category: 'contraction' },
  { from: 'shouldnt', to: "shouldn't", category: 'contraction' },
  { from: 'wouldnt', to: "wouldn't", category: 'contraction' },
  { from: 'isnt', to: "isn't", category: 'contraction' },
  { from: 'arent', to: "aren't", category: 'contraction' },
  { from: 'hasnt', to: "hasn't", category: 'contraction' },
  { from: 'havent', to: "haven't", category: 'contraction' },
  { from: 'youre', to: "you're", category: 'contraction' },
  { from: 'theyre', to: "they're", category: 'contraction' },
  { from: 'weve', to: "we've", category: 'contraction' },
  { from: 'youve', to: "you've", category: 'contraction' },
  { from: 'theyve', to: "they've", category: 'contraction' },
  { from: 'im', to: "I'm", category: 'contraction' },
  { from: 'ive', to: "I've", category: 'contraction' },

  // Symbols, Math & Abbreviations
  { from: '(c)', to: '©', category: 'symbol' },
  { from: '(r)', to: '®', category: 'symbol' },
  { from: '(tm)', to: '™', category: 'symbol' },
  { from: '-->', to: '→', category: 'symbol' },
  { from: '<--', to: '←', category: 'symbol' },
  { from: '<->', to: '↔', category: 'symbol' },
  { from: '==>', to: '⇒', category: 'symbol' },
  { from: '<==', to: '⇐', category: 'symbol' },
  { from: ':)', to: '🙂', category: 'symbol' },
  { from: ':-)', to: '🙂', category: 'symbol' },
  { from: ':(', to: '🙁', category: 'symbol' },
  { from: ':-(', to: '🙁', category: 'symbol' },
  { from: ':D', to: '😃', category: 'symbol' },
  { from: ':-D', to: '😃', category: 'symbol' },
  { from: ';)', to: '😉', category: 'symbol' },
  { from: '1/2', to: '½', category: 'symbol' },
  { from: '1/4', to: '¼', category: 'symbol' },
  { from: '3/4', to: '¾', category: 'symbol' },
  { from: '...', to: '…', category: 'symbol' },
  { from: '--', to: '—', category: 'symbol' },
  { from: '+-', to: '±', category: 'symbol' },
  { from: '!=', to: '≠', category: 'symbol' },
  { from: '>=', to: '≥', category: 'symbol' },
  { from: '<=', to: '≤', category: 'symbol' },
  { from: 'approx', to: '≈', category: 'symbol' },
  { from: 'deg', to: '°', category: 'symbol' }
];

const STORAGE_KEY = 'docuword_autocorrect_rules';
const ENABLED_STORAGE_KEY = 'docuword_autocorrect_enabled';

/**
 * Load active auto-correct dictionary (built-in + user customized)
 */
export function getAutoCorrectRules(): AutoCorrectEntry[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading autocorrect rules:', e);
  }
  return BUILT_IN_AUTOCORRECT;
}

export function saveAutoCorrectRules(rules: AutoCorrectEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rules));
  } catch (e) {
    console.error('Error saving autocorrect rules:', e);
  }
}

export function isAutoCorrectEnabled(): boolean {
  try {
    const val = localStorage.getItem(ENABLED_STORAGE_KEY);
    return val === null ? true : val === 'true';
  } catch {
    return true;
  }
}

export function setAutoCorrectEnabled(enabled: boolean) {
  try {
    localStorage.setItem(ENABLED_STORAGE_KEY, String(enabled));
  } catch (e) {
    console.error('Error setting autocorrect enabled:', e);
  }
}

/**
 * Match casing of replacement to the original typed word
 * e.g. "teh" -> "the", "Teh" -> "The", "TEH" -> "THE"
 */
function preserveCasing(original: string, replacement: string): string {
  if (original === original.toUpperCase() && original.length > 1) {
    return replacement.toUpperCase();
  }
  if (original[0] === original[0].toUpperCase()) {
    return replacement.charAt(0).toUpperCase() + replacement.slice(1);
  }
  return replacement;
}

/**
 * Attempts to auto-correct the word directly before the current cursor.
 * Triggered on Space, Enter, or punctuation keys.
 * 
 * Returns true if an auto-correction was applied.
 */
export function performAutoCorrect(triggerKey: string): boolean {
  if (!isAutoCorrectEnabled()) return false;

  const sel = window.getSelection();
  if (!sel || !sel.rangeCount || !sel.isCollapsed) return false;

  const range = sel.getRangeAt(0);
  const node = range.startContainer;
  if (node.nodeType !== Node.TEXT_NODE) return false;

  const textNode = node as Text;
  const cursorOffset = range.startOffset;
  const textBefore = textNode.textContent?.slice(0, cursorOffset) || '';

  if (!textBefore) return false;

  // Extract the word/token immediately preceding the cursor
  const tokenMatch = textBefore.match(/([^\s]+)$/);
  if (!tokenMatch) return false;

  const rawWord = tokenMatch[1];
  const wordStartOffset = cursorOffset - rawWord.length;

  const rules = getAutoCorrectRules();

  // 1. Check if rawWord + triggerKey forms a symbol (e.g. "(c" + ")" -> "©", "--" + ">" -> "→")
  const combined = rawWord + triggerKey;
  const symbolRule = rules.find((r) => r.category === 'symbol' && r.from === combined);

  if (symbolRule) {
    try {
      const replaceRange = document.createRange();
      replaceRange.setStart(textNode, wordStartOffset);
      replaceRange.setEnd(textNode, cursorOffset);
      replaceRange.deleteContents();

      const insertedNode = document.createTextNode(symbolRule.to);
      replaceRange.insertNode(insertedNode);

      const newRange = document.createRange();
      newRange.setStart(insertedNode, insertedNode.length);
      newRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(newRange);

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  // 2. Check if rawWord by itself matches a rule (on Space, Enter, or punctuation)
  const matchedRule = rules.find((r) => {
    if (r.category === 'symbol') {
      return r.from === rawWord;
    }
    return r.from.toLowerCase() === rawWord.toLowerCase();
  });

  if (!matchedRule) return false;

  const correctedText =
    matchedRule.category === 'symbol'
      ? matchedRule.to
      : preserveCasing(rawWord, matchedRule.to);

  const suffix = triggerKey === ' ' ? ' ' : triggerKey === 'Enter' ? '' : triggerKey;

  try {
    const replaceRange = document.createRange();
    replaceRange.setStart(textNode, wordStartOffset);
    replaceRange.setEnd(textNode, cursorOffset);
    replaceRange.deleteContents();

    const insertText = correctedText + suffix;
    const insertedNode = document.createTextNode(insertText);
    replaceRange.insertNode(insertedNode);

    const newRange = document.createRange();
    newRange.setStart(insertedNode, insertedNode.length);
    newRange.collapse(true);
    sel.removeAllRanges();
    sel.addRange(newRange);

    return true;
  } catch (err) {
    console.error('Auto-correct replacement failed:', err);
    return false;
  }
}
