/**
 * Real-Time Spell-Check Utility & Dictionary Engine
 * Provides word verification, suggestion algorithms, and DOM annotation with red wavy underlines.
 */

// User dictionary stored in localStorage
const USER_DICT_KEY = 'docuword_custom_dictionary';
const SPELLCHECK_ENABLED_KEY = 'docuword_spellcheck_enabled';

// In-memory set of words ignored for current session
const ignoredWords = new Set<string>();

/**
 * Base English Dictionary (Curated list of frequently used English words,
 * technical, business, and common vocabulary)
 */
const BASE_WORDS = new Set<string>([
  // Pronouns, articles, conjunctions, prepositions
  'a', 'about', 'above', 'across', 'act', 'active', 'activity', 'add', 'afraid', 'after', 'again', 'against',
  'age', 'ago', 'agree', 'air', 'all', 'almost', 'alone', 'along', 'already', 'also', 'although', 'always',
  'am', 'among', 'amount', 'an', 'and', 'anger', 'angry', 'animal', 'another', 'answer', 'any', 'anyone',
  'anything', 'appear', 'apple', 'apply', 'approach', 'april', 'are', 'area', 'arm', 'around', 'arrive',
  'art', 'article', 'as', 'ask', 'at', 'attack', 'august', 'aunt', 'author', 'auto', 'autumn', 'available',
  'away', 'baby', 'back', 'bad', 'bag', 'ball', 'bank', 'bar', 'base', 'basic', 'bat', 'be', 'bear',
  'beat', 'beautiful', 'beauty', 'because', 'become', 'bed', 'before', 'begin', 'behind', 'believe',
  'belong', 'below', 'beneath', 'beside', 'best', 'better', 'between', 'beyond', 'big', 'bill', 'bird',
  'birth', 'bit', 'black', 'block', 'blood', 'blow', 'blue', 'board', 'boat', 'body', 'bone', 'book',
  'border', 'born', 'both', 'bottle', 'bottom', 'box', 'boy', 'branch', 'brave', 'bread', 'break',
  'breakfast', 'breath', 'bridge', 'bright', 'bring', 'broad', 'brother', 'brown', 'build', 'building',
  'burn', 'business', 'busy', 'but', 'buy', 'by', 'cake', 'call', 'calm', 'camera', 'camp', 'can',
  'cannot', 'capital', 'captain', 'car', 'card', 'care', 'careful', 'carry', 'case', 'cat', 'catch',
  'cause', 'celebrate', 'center', 'centre', 'century', 'certain', 'chair', 'chance', 'change', 'character',
  'charge', 'cheap', 'check', 'cheese', 'chicken', 'chief', 'child', 'children', 'choose', 'church',
  'circle', 'city', 'claim', 'class', 'clean', 'clear', 'climb', 'clock', 'close', 'cloth', 'clothes',
  'cloud', 'club', 'coat', 'coffee', 'cold', 'collect', 'college', 'color', 'colour', 'come', 'comfort',
  'common', 'company', 'compare', 'complete', 'complex', 'compose', 'computer', 'condition', 'confirm',
  'connect', 'consider', 'contain', 'continue', 'control', 'cook', 'cool', 'copy', 'corn', 'corner',
  'correct', 'cost', 'cotton', 'could', 'count', 'country', 'course', 'court', 'cover', 'cow', 'crack',
  'cream', 'create', 'cross', 'crowd', 'cry', 'cup', 'current', 'custom', 'cut', 'daily', 'dance',
  'danger', 'dark', 'daughter', 'day', 'dead', 'deal', 'dear', 'death', 'december', 'decide', 'decision',
  'deep', 'degree', 'delight', 'deliver', 'demand', 'department', 'depend', 'describe', 'desert',
  'design', 'desire', 'desk', 'destroy', 'detail', 'determine', 'develop', 'device', 'die', 'difference',
  'different', 'difficult', 'dinner', 'direction', 'director', 'discover', 'discuss', 'disease', 'distance',
  'distant', 'divide', 'division', 'do', 'doctor', 'document', 'dog', 'dollar', 'door', 'double', 'doubt',
  'down', 'draw', 'dream', 'dress', 'drink', 'drive', 'drop', 'dry', 'due', 'during', 'duty', 'each',
  'eager', 'ear', 'early', 'earn', 'earth', 'ease', 'east', 'easy', 'eat', 'edge', 'educate', 'education',
  'effect', 'effort', 'egg', 'eight', 'either', 'electric', 'element', 'elephant', 'else', 'empty',
  'end', 'enemy', 'energy', 'engine', 'engineer', 'enjoy', 'enough', 'enter', 'entire', 'environment',
  'equal', 'escape', 'especially', 'establish', 'even', 'evening', 'event', 'ever', 'every', 'everybody',
  'everyone', 'everything', 'exact', 'examination', 'example', 'except', 'exchange', 'excite', 'exercise',
  'exist', 'expect', 'expensive', 'experience', 'experiment', 'explain', 'express', 'extend', 'eye',
  'face', 'fact', 'factory', 'fail', 'fair', 'fall', 'family', 'famous', 'far', 'farm', 'fast', 'fat',
  'father', 'fault', 'favor', 'favourite', 'fear', 'feather', 'february', 'feed', 'feel', 'female',
  'fence', 'fever', 'few', 'field', 'fight', 'figure', 'fill', 'film', 'final', 'finally', 'financial',
  'find', 'fine', 'finger', 'finish', 'fire', 'first', 'fish', 'fit', 'five', 'fix', 'flag', 'flat',
  'flight', 'floor', 'flower', 'fly', 'follow', 'food', 'foot', 'for', 'force', 'foreign', 'forest',
  'forget', 'forgive', 'fork', 'form', 'formal', 'forward', 'found', 'four', 'fox', 'free', 'freedom',
  'fresh', 'friend', 'friendly', 'from', 'front', 'fruit', 'full', 'fun', 'function', 'funny', 'further',
  'future', 'gain', 'game', 'garden', 'gas', 'gate', 'gather', 'general', 'generally', 'generation',
  'gentle', 'get', 'gift', 'girl', 'give', 'glad', 'glass', 'glove', 'go', 'goal', 'god', 'gold',
  'golden', 'good', 'govern', 'government', 'grace', 'grain', 'grand', 'grant', 'grass', 'grateful',
  'gray', 'grey', 'great', 'green', 'ground', 'group', 'grow', 'guard', 'guess', 'guest', 'guide',
  'gun', 'habit', 'hair', 'half', 'hall', 'hammer', 'hand', 'handle', 'hang', 'happen', 'happy',
  'hard', 'hardly', 'hat', 'hate', 'have', 'he', 'head', 'health', 'hear', 'heart', 'heat', 'heavy',
  'help', 'her', 'here', 'hero', 'herself', 'hide', 'high', 'hill', 'him', 'himself', 'his', 'history',
  'hit', 'hold', 'hole', 'holiday', 'home', 'honest', 'honor', 'hope', 'horse', 'hospital', 'host',
  'hot', 'hotel', 'hour', 'house', 'how', 'however', 'huge', 'human', 'humor', 'hundred', 'hungry',
  'hunt', 'hurry', 'hurt', 'husband', 'ice', 'idea', 'identify', 'idle', 'if', 'ill', 'image',
  'imagine', 'immediate', 'important', 'improve', 'in', 'inch', 'include', 'increase', 'indeed',
  'industry', 'influence', 'inform', 'information', 'ink', 'insect', 'inside', 'instant', 'instead',
  'instrument', 'intend', 'interest', 'international', 'into', 'introduce', 'invent', 'invite', 'iron',
  'island', 'issue', 'it', 'item', 'itself', 'jacket', 'january', 'jar', 'job', 'join', 'joke',
  'journey', 'joy', 'judge', 'juice', 'july', 'jump', 'june', 'just', 'justice', 'keep', 'kettle',
  'key', 'kick', 'kid', 'kill', 'kind', 'king', 'kiss', 'kitchen', 'knee', 'knife', 'knock', 'know',
  'knowledge', 'labor', 'labour', 'lack', 'lady', 'lake', 'lamp', 'land', 'language', 'large', 'last',
  'late', 'laugh', 'law', 'lawyer', 'lay', 'lead', 'leader', 'leaf', 'learn', 'least', 'leather',
  'leave', 'left', 'leg', 'lend', 'length', 'less', 'lesson', 'let', 'letter', 'level', 'library',
  'lie', 'life', 'lift', 'light', 'like', 'likely', 'limit', 'line', 'lion', 'lip', 'liquid', 'list',
  'listen', 'little', 'live', 'load', 'local', 'lock', 'logic', 'lonely', 'long', 'look', 'loose',
  'lord', 'lose', 'loss', 'lot', 'loud', 'love', 'lovely', 'low', 'luck', 'lucky', 'lunch', 'machine',
  'mad', 'magazine', 'mail', 'main', 'major', 'make', 'male', 'man', 'manage', 'manager', 'manner',
  'many', 'map', 'march', 'mark', 'market', 'marry', 'mass', 'master', 'match', 'material', 'matter',
  'may', 'maybe', 'me', 'meal', 'mean', 'meaning', 'measure', 'meat', 'media', 'medical', 'meet',
  'meeting', 'member', 'memory', 'mention', 'menu', 'message', 'metal', 'method', 'middle', 'might',
  'mile', 'military', 'milk', 'million', 'mind', 'mine', 'mineral', 'minister', 'minute', 'mirror',
  'miss', 'mistake', 'mix', 'model', 'modern', 'moment', 'monday', 'money', 'monkey', 'month', 'moon',
  'moral', 'more', 'morning', 'most', 'mother', 'motion', 'motor', 'mountain', 'mouth', 'move', 'movie',
  'much', 'mud', 'music', 'must', 'my', 'myself', 'name', 'narrow', 'nation', 'native', 'natural',
  'nature', 'near', 'neat', 'necessary', 'neck', 'need', 'needle', 'neighbor', 'neither', 'nerve',
  'nest', 'net', 'network', 'never', 'new', 'news', 'newspaper', 'next', 'nice', 'night', 'nine',
  'no', 'noble', 'nobody', 'noise', 'none', 'noon', 'nor', 'north', 'nose', 'not', 'note', 'notice',
  'novel', 'november', 'now', 'number', 'nurse', 'nut', 'object', 'obtain', 'obvious', 'occasion',
  'occur', 'ocean', 'october', 'of', 'off', 'offer', 'office', 'officer', 'official', 'often', 'oil',
  'old', 'on', 'once', 'one', 'only', 'open', 'operate', 'opinion', 'opportunity', 'opposite', 'or',
  'orange', 'order', 'ordinary', 'organize', 'origin', 'other', 'otherwise', 'ought', 'our', 'ourselves',
  'out', 'outside', 'over', 'own', 'pack', 'package', 'page', 'pain', 'paint', 'pair', 'pale', 'paper',
  'parent', 'park', 'part', 'particular', 'party', 'pass', 'passage', 'past', 'path', 'patience',
  'patient', 'pattern', 'pause', 'pay', 'peace', 'pen', 'pencil', 'people', 'per', 'perfect', 'perform',
  'performance', 'perhaps', 'period', 'permit', 'person', 'personal', 'pet', 'photograph', 'photo',
  'phrase', 'physical', 'piano', 'pick', 'picture', 'piece', 'pig', 'pile', 'pilot', 'pin', 'pink',
  'pipe', 'place', 'plain', 'plan', 'plane', 'planet', 'plant', 'plastic', 'plate', 'play', 'pleasant',
  'please', 'pleasure', 'plenty', 'pocket', 'poem', 'poet', 'point', 'poison', 'police', 'policy',
  'polite', 'political', 'politics', 'pool', 'poor', 'popular', 'population', 'port', 'position',
  'positive', 'possible', 'post', 'pot', 'potato', 'pound', 'pour', 'powder', 'power', 'powerful',
  'practice', 'praise', 'pray', 'precious', 'prefer', 'prepare', 'present', 'president', 'press',
  'pretty', 'prevent', 'price', 'pride', 'priest', 'primary', 'prince', 'princess', 'print', 'prison',
  'private', 'prize', 'probable', 'problem', 'process', 'produce', 'product', 'profession', 'program',
  'progress', 'promise', 'proper', 'property', 'proposal', 'protect', 'proud', 'prove', 'provide',
  'public', 'pull', 'pump', 'punish', 'pure', 'purple', 'purpose', 'push', 'put', 'quality', 'quarter',
  'queen', 'question', 'quick', 'quiet', 'quite', 'race', 'radio', 'rail', 'rain', 'raise', 'range',
  'rank', 'rapid', 'rare', 'rate', 'rather', 'raw', 'reach', 'read', 'ready', 'real', 'realize',
  'reason', 'receive', 'recent', 'recognize', 'record', 'red', 'reduce', 'refuse', 'regard', 'region',
  'regular', 'relation', 'relationship', 'relative', 'release', 'remain', 'remember', 'remind', 'remove',
  'repair', 'repeat', 'replace', 'reply', 'report', 'represent', 'require', 'research', 'respect',
  'responsible', 'rest', 'restaurant', 'result', 'return', 'rich', 'ride', 'right', 'ring', 'rise',
  'risk', 'river', 'road', 'rock', 'roll', 'roof', 'room', 'root', 'rope', 'rough', 'round', 'route',
  'row', 'royal', 'rub', 'rubber', 'rule', 'ruler', 'run', 'rush', 'sad', 'safe', 'sail', 'salt',
  'same', 'sand', 'saturday', 'save', 'say', 'scale', 'scene', 'school', 'science', 'scientist',
  'score', 'scratch', 'scream', 'screen', 'sea', 'search', 'season', 'seat', 'second', 'secret',
  'secretary', 'section', 'security', 'see', 'seed', 'seek', 'seem', 'seldom', 'select', 'self',
  'sell', 'send', 'sense', 'sentence', 'separate', 'september', 'series', 'serious', 'serve', 'service',
  'set', 'settle', 'seven', 'several', 'severe', 'shade', 'shadow', 'shake', 'shall', 'shame', 'shape',
  'share', 'sharp', 'she', 'sheep', 'sheet', 'shelf', 'shine', 'ship', 'shirt', 'shock', 'shoe',
  'shoot', 'shop', 'shore', 'short', 'should', 'shoulder', 'shout', 'show', 'shut', 'sick', 'side',
  'sight', 'sign', 'signal', 'silence', 'silent', 'silk', 'silver', 'similar', 'simple', 'since',
  'sincere', 'sing', 'single', 'sink', 'sister', 'sit', 'situation', 'six', 'size', 'skill', 'skin',
  'skirt', 'sky', 'sleep', 'slide', 'slight', 'slip', 'slow', 'small', 'smart', 'smell', 'smile',
  'smoke', 'smooth', 'snake', 'snow', 'so', 'soap', 'social', 'society', 'sock', 'soft', 'soil',
  'soldier', 'solid', 'solution', 'solve', 'some', 'somebody', 'someone', 'something', 'sometimes',
  'son', 'song', 'soon', 'sore', 'sorry', 'sort', 'soul', 'sound', 'soup', 'sour', 'south', 'space',
  'speak', 'special', 'specific', 'speech', 'speed', 'spell', 'spend', 'spirit', 'split', 'spoon',
  'sport', 'spot', 'spread', 'spring', 'square', 'stage', 'stair', 'stamp', 'stand', 'standard',
  'star', 'stare', 'start', 'state', 'station', 'stay', 'steady', 'steal', 'steam', 'steel', 'steep',
  'step', 'stick', 'stiff', 'still', 'stomach', 'stone', 'stop', 'store', 'storm', 'story', 'straight',
  'strange', 'stranger', 'strategy', 'street', 'strength', 'stretch', 'strike', 'string', 'strong',
  'structure', 'struggle', 'student', 'study', 'stuff', 'stupid', 'style', 'subject', 'substance',
  'succeed', 'success', 'successful', 'such', 'sudden', 'sugar', 'suggest', 'suit', 'summer', 'sun',
  'sunday', 'supply', 'support', 'suppose', 'sure', 'surface', 'surprise', 'sweet', 'swim', 'system',
  'table', 'tail', 'take', 'tale', 'talk', 'tall', 'tape', 'target', 'taste', 'tax', 'tea', 'teach',
  'teacher', 'team', 'tear', 'technology', 'telephone', 'tell', 'temperature', 'ten', 'tend', 'term',
  'terrible', 'test', 'text', 'than', 'thank', 'that', 'the', 'theater', 'theatre', 'their', 'them',
  'theme', 'themselves', 'then', 'theory', 'there', 'therefore', 'these', 'they', 'thick', 'thin',
  'thing', 'think', 'third', 'thirst', 'thirteen', 'thirty', 'this', 'thorough', 'those', 'though',
  'thought', 'thousand', 'thread', 'threat', 'three', 'through', 'throw', 'thursday', 'thus', 'ticket',
  'tide', 'tie', 'tight', 'time', 'tin', 'tiny', 'tip', 'tire', 'tired', 'title', 'to', 'today',
  'toe', 'together', 'tomorrow', 'tonight', 'too', 'tool', 'tooth', 'top', 'total', 'touch', 'tough',
  'toward', 'tower', 'town', 'toy', 'track', 'trade', 'traffic', 'train', 'travel', 'treat', 'tree',
  'tremble', 'trick', 'trip', 'trouble', 'true', 'truly', 'trust', 'truth', 'try', 'tube', 'tuesday',
  'tune', 'turn', 'twelve', 'twenty', 'twice', 'two', 'type', 'ugly', 'umbrella', 'uncle', 'under',
  'understand', 'unit', 'unite', 'university', 'unless', 'until', 'up', 'upon', 'upper', 'urgency',
  'urgent', 'us', 'use', 'useful', 'usual', 'usually', 'valley', 'valuable', 'value', 'variety',
  'various', 'vegetable', 'vehicle', 'venture', 'verb', 'very', 'vessel', 'victory', 'video', 'view',
  'village', 'violent', 'virtual', 'visit', 'visitor', 'voice', 'vote', 'wage', 'wait', 'waiter',
  'wake', 'walk', 'wall', 'want', 'war', 'warm', 'warn', 'wash', 'waste', 'watch', 'water', 'wave',
  'way', 'we', 'weak', 'wealth', 'weapon', 'wear', 'weather', 'wedding', 'wednesday', 'week', 'weigh',
  'weight', 'welcome', 'well', 'west', 'western', 'wet', 'what', 'whatever', 'wheat', 'wheel', 'when',
  'whenever', 'where', 'whether', 'which', 'while', 'whip', 'whisper', 'whistle', 'white', 'who',
  'whole', 'whose', 'why', 'wide', 'widow', 'wife', 'wild', 'will', 'win', 'wind', 'window', 'wine',
  'wing', 'winter', 'wire', 'wise', 'wish', 'with', 'within', 'without', 'woman', 'wonder', 'wood',
  'wool', 'word', 'work', 'worker', 'world', 'worry', 'worse', 'worth', 'would', 'wound', 'wrap',
  'write', 'writer', 'wrong', 'yard', 'year', 'yellow', 'yes', 'yesterday', 'yet', 'yield', 'you',
  'young', 'your', 'yourself', 'zero',

  // Common Business, Tech, Software, Documents & Acronyms
  'platform', 'architecture', 'application', 'deliverable', 'component', 'template', 'document',
  'database', 'interface', 'dashboard', 'analytics', 'milestone', 'infrastructure', 'software',
  'hardware', 'cloud', 'devops', 'enterprise', 'protocol', 'network', 'latency', 'bandwidth',
  'throughput', 'cache', 'encryption', 'security', 'compliance', 'audit', 'agenda', 'minutes',
  'executive', 'directorate', 'client', 'server', 'request', 'response', 'payload', 'algorithm',
  'optimization', 'performance', 'benchmark', 'consensus', 'cluster', 'deployment', 'sprint',
  'scrum', 'stakeholder', 'budget', 'allocation', 'projection', 'contract', 'vendor', 'sla',
  'soc', 'iso', 'hybrid', 'paxos', 'raft', 'quorum', 'deterministic', 'partition', 'apac',
  'tokyo', 'singapore', 'california', 'london', 'york', 'elena', 'david', 'sarah', 'robert',
  'chen', 'jenkins', 'martinez', 'rostova', 'apex', 'memo', 'resume', 'curriculum', 'vitae',
  'summary', 'overview', 'appendix', 'citation', 'bibliography', 'footnote', 'header', 'footer'
]);

/**
 * Get the custom user dictionary from localStorage
 */
export function getCustomDictionary(): Set<string> {
  try {
    const data = localStorage.getItem(USER_DICT_KEY);
    if (data) {
      const arr = JSON.parse(data);
      if (Array.isArray(arr)) {
        return new Set(arr.map((w: string) => w.toLowerCase()));
      }
    }
  } catch (err) {
    console.error('Error loading custom dictionary:', err);
  }
  return new Set<string>();
}

/**
 * Add a word to the custom dictionary
 */
export function addToCustomDictionary(word: string) {
  const custom = getCustomDictionary();
  custom.add(word.toLowerCase());
  try {
    localStorage.setItem(USER_DICT_KEY, JSON.stringify(Array.from(custom)));
  } catch (err) {
    console.error('Error saving custom dictionary:', err);
  }
}

/**
 * Mark a word as ignored for this session
 */
export function ignoreWordForSession(word: string) {
  ignoredWords.add(word.toLowerCase());
}

/**
 * Check if spellcheck is enabled
 */
export function isSpellCheckEnabled(): boolean {
  try {
    const val = localStorage.getItem(SPELLCHECK_ENABLED_KEY);
    return val === null ? true : val === 'true';
  } catch {
    return true;
  }
}

export function setSpellCheckEnabled(enabled: boolean) {
  try {
    localStorage.setItem(SPELLCHECK_ENABLED_KEY, String(enabled));
  } catch (e) {
    console.error('Error setting spellcheck enabled:', e);
  }
}

/**
 * Calculate Levenshtein edit distance between two strings
 */
function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Check if a word is spelled correctly
 */
export function checkWord(word: string): boolean {
  if (!word || word.length <= 1) return true;

  // Ignore numbers, hex, currency, symbols
  if (/^[\d$€£¥%#@&+=_]+$/.test(word)) return true;
  // Ignore URLs or emails
  if (word.includes('/') || word.includes('@') || word.startsWith('http')) return true;
  // Ignore all uppercase acronyms of 2-5 chars (e.g. NASA, CEO, API, SLA, TPS)
  if (word === word.toUpperCase() && word.length <= 6) return true;

  const clean = word.toLowerCase().replace(/^[^\w]+|[^\w]+$/g, '');
  if (!clean || clean.length <= 1) return true;

  if (ignoredWords.has(clean)) return true;
  if (BASE_WORDS.has(clean)) return true;

  const custom = getCustomDictionary();
  if (custom.has(clean)) return true;

  // Check simple plural or past tense forms
  if (clean.endsWith('s') && BASE_WORDS.has(clean.slice(0, -1))) return true;
  if (clean.endsWith('es') && BASE_WORDS.has(clean.slice(0, -2))) return true;
  if (clean.endsWith('ed') && BASE_WORDS.has(clean.slice(0, -2))) return true;
  if (clean.endsWith('ing') && BASE_WORDS.has(clean.slice(0, -3))) return true;
  if (clean.endsWith('ly') && BASE_WORDS.has(clean.slice(0, -2))) return true;

  return false;
}

/**
 * Get spelling suggestions for a misspelled word
 */
export function getSpellSuggestions(word: string, maxSuggestions: number = 5): string[] {
  const clean = word.toLowerCase().replace(/^[^\w]+|[^\w]+$/g, '');
  if (!clean) return [];

  const candidates: { word: string; dist: number }[] = [];
  const maxDistance = clean.length <= 4 ? 1 : 2;

  // Search through BASE_WORDS
  for (const dictWord of BASE_WORDS) {
    if (Math.abs(dictWord.length - clean.length) > maxDistance) continue;
    if (clean.length > 5 && dictWord[0] !== clean[0]) continue;

    const dist = levenshteinDistance(clean, dictWord);
    if (dist <= maxDistance) {
      candidates.push({ word: dictWord, dist });
    }
  }

  // Sort by edit distance then alphabetical
  candidates.sort((a, b) => a.dist - b.dist || a.word.localeCompare(b.word));

  const results = candidates.slice(0, maxSuggestions).map((c) => {
    // Preserve capitalization
    if (word[0] === word[0].toUpperCase() && word.length > 1) {
      return c.word.charAt(0).toUpperCase() + c.word.slice(1);
    }
    return c.word;
  });

  return results;
}

/**
 * Highlight misspelled words in the container element using red wavy underlines
 */
export function highlightSpellingErrors(container: HTMLElement) {
  if (!isSpellCheckEnabled()) {
    clearSpellCheckHighlights(container);
    return;
  }

  // Find all existing .spell-error spans and verify if any have been corrected
  const existingSpans = container.querySelectorAll<HTMLSpanElement>('span.spell-error');
  existingSpans.forEach((span) => {
    const text = span.textContent || '';
    if (checkWord(text)) {
      const parent = span.parentNode;
      if (parent) {
        const textNode = document.createTextNode(text);
        parent.replaceChild(textNode, span);
        parent.normalize();
      }
    }
  });

  // Get active cursor info so we don't disrupt the active word being typed
  const sel = window.getSelection();
  let activeTextNode: Node | null = null;
  let activeOffset: number = -1;
  if (sel && sel.isCollapsed && sel.anchorNode) {
    activeTextNode = sel.anchorNode;
    activeOffset = sel.anchorOffset;
  }

  // Walk all text nodes
  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') return NodeFilter.FILTER_REJECT;
        if (parent.classList.contains('spell-error')) return NodeFilter.FILTER_REJECT;
        if (parent.getAttribute('contenteditable') === 'false') return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  const textNodesToProcess: Text[] = [];
  let current: Node | null = walker.nextNode();
  while (current) {
    textNodesToProcess.push(current as Text);
    current = walker.nextNode();
  }

  for (const textNode of textNodesToProcess) {
    const fullText = textNode.textContent || '';
    if (!fullText.trim()) continue;

    // Match alphabetic words (and contractions like don't)
    const wordRegex = /\b[A-Za-z]+(?:'[A-Za-z]+)?\b/g;
    let match: RegExpExecArray | null;
    const misspelledMatches: { word: string; index: number; length: number }[] = [];

    while ((match = wordRegex.exec(fullText)) !== null) {
      const word = match[0];
      const matchIndex = match.index;

      // If this is the active text node and cursor is inside this word, skip it while typing
      if (
        textNode === activeTextNode &&
        activeOffset >= matchIndex &&
        activeOffset <= matchIndex + word.length
      ) {
        continue;
      }

      if (!checkWord(word)) {
        misspelledMatches.push({ word, index: matchIndex, length: word.length });
      }
    }

    if (misspelledMatches.length === 0) continue;

    // Replace the text node with fragments containing .spell-error spans
    const fragment = document.createDocumentFragment();
    let lastIndex = 0;

    for (const m of misspelledMatches) {
      if (m.index > lastIndex) {
        fragment.appendChild(document.createTextNode(fullText.slice(lastIndex, m.index)));
      }

      const span = document.createElement('span');
      span.className = 'spell-error';
      span.setAttribute('data-spell-word', m.word);
      span.textContent = m.word;
      fragment.appendChild(span);

      lastIndex = m.index + m.length;
    }

    if (lastIndex < fullText.length) {
      fragment.appendChild(document.createTextNode(fullText.slice(lastIndex)));
    }

    if (textNode.parentNode) {
      textNode.parentNode.replaceChild(fragment, textNode);
    }
  }
}

/**
 * Remove all .spell-error highlights from container
 */
export function clearSpellCheckHighlights(container: HTMLElement) {
  const spans = container.querySelectorAll<HTMLSpanElement>('span.spell-error');
  spans.forEach((span) => {
    const text = span.textContent || '';
    const parent = span.parentNode;
    if (parent) {
      const textNode = document.createTextNode(text);
      parent.replaceChild(textNode, span);
      parent.normalize();
    }
  });
}
