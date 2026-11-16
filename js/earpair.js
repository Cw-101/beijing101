/* Ear training: the three consonant contrasts the shipped corpus can actually teach.
 *
 * Data only — no DOM, no audio playback, no scoring. The UI calls itemsFor/pick to
 * choose a card and check to score an answer. Every hanzi here is a word already in
 * data/lessons.js, and every `audio` is the codepoint filename used by audio/.
 */
(function () {
  const CONTRASTS = [
    { id: 'zh-z', label: 'zh vs z', sides: ['zh', 'z'] },
    { id: 'sh-s', label: 'sh vs s', sides: ['sh', 's'] },
    { id: 'j-q-x', label: 'j / q / x', sides: ['j', 'q', 'x'] }
  ];

  const ITEMS = [
    { hanzi: "住", pinyin: "zhù", contrast: 'zh-z', side: 'zh', audio: '4f4f.mp3' },
    { hanzi: "站", pinyin: "zhàn", contrast: 'zh-z', side: 'zh', audio: '7ad9.mp3' },
    { hanzi: "专业", pinyin: "zhuānyè", contrast: 'zh-z', side: 'zh', audio: '4e13-4e1a.mp3' },
    { hanzi: "这儿", pinyin: "zhèr", contrast: 'zh-z', side: 'zh', audio: '8fd9-513f.mp3' },
    { hanzi: "再见", pinyin: "zàijiàn", contrast: 'zh-z', side: 'z', audio: '518d-89c1.mp3' },
    { hanzi: "怎么", pinyin: "zěnme", contrast: 'zh-z', side: 'z', audio: '600e-4e48.mp3' },
    { hanzi: "左", pinyin: "zuǒ", contrast: 'zh-z', side: 'z', audio: '5de6.mp3' },
    { hanzi: "昨天", pinyin: "zuótiān", contrast: 'zh-z', side: 'z', audio: '6628-5929.mp3' },
    { hanzi: "是", pinyin: "shì", contrast: 'sh-s', side: 'sh', audio: '662f.mp3' },
    { hanzi: "书", pinyin: "shū", contrast: 'sh-s', side: 'sh', audio: '4e66.mp3' },
    { hanzi: "十", pinyin: "shí", contrast: 'sh-s', side: 'sh', audio: '5341.mp3' },
    { hanzi: "什么", pinyin: "shénme", contrast: 'sh-s', side: 'sh', audio: '4ec0-4e48.mp3' },
    { hanzi: "谁", pinyin: "shéi", contrast: 'sh-s', side: 'sh', audio: '8c01.mp3' },
    { hanzi: "商店", pinyin: "shāngdiàn", contrast: 'sh-s', side: 'sh', audio: '5546-5e97.mp3' },
    { hanzi: "水", pinyin: "shuǐ", contrast: 'sh-s', side: 'sh', audio: '6c34.mp3' },
    { hanzi: "岁", pinyin: "suì", contrast: 'sh-s', side: 's', audio: '5c81.mp3' },
    { hanzi: "素", pinyin: "sù", contrast: 'sh-s', side: 's', audio: '7d20.mp3' },
    { hanzi: "所以", pinyin: "suǒyǐ", contrast: 'sh-s', side: 's', audio: '6240-4ee5.mp3' },
    { hanzi: "虽然", pinyin: "suīrán", contrast: 'sh-s', side: 's', audio: '867d-7136.mp3' },
    { hanzi: "叫", pinyin: "jiào", contrast: 'j-q-x', side: 'j', audio: '53eb.mp3' },
    { hanzi: "今年", pinyin: "jīnnián", contrast: 'j-q-x', side: 'j', audio: '4eca-5e74.mp3' },
    { hanzi: "几点", pinyin: "jǐ diǎn", contrast: 'j-q-x', side: 'j', audio: '51e0-70b9.mp3' },
    { hanzi: "今天", pinyin: "jīntiān", contrast: 'j-q-x', side: 'j', audio: '4eca-5929.mp3' },
    { hanzi: "家", pinyin: "jiā", contrast: 'j-q-x', side: 'j', audio: '5bb6.mp3' },
    { hanzi: "姐姐", pinyin: "jiějie", contrast: 'j-q-x', side: 'j', audio: '59d0-59d0.mp3' },
    { hanzi: "七", pinyin: "qī", contrast: 'j-q-x', side: 'q', audio: '4e03.mp3' },
    { hanzi: "前", pinyin: "qián", contrast: 'j-q-x', side: 'q', audio: '524d.mp3' },
    { hanzi: "晴", pinyin: "qíng", contrast: 'j-q-x', side: 'q', audio: '6674.mp3' },
    { hanzi: "请问", pinyin: "qǐngwèn", contrast: 'j-q-x', side: 'q', audio: '8bf7-95ee.mp3' },
    { hanzi: "谢谢", pinyin: "xièxie", contrast: 'j-q-x', side: 'x', audio: '8c22-8c22.mp3' },
    { hanzi: "学生", pinyin: "xuésheng", contrast: 'j-q-x', side: 'x', audio: '5b66-751f.mp3' },
    { hanzi: "姓", pinyin: "xìng", contrast: 'j-q-x', side: 'x', audio: '59d3.mp3' },
    { hanzi: "现在", pinyin: "xiànzài", contrast: 'j-q-x', side: 'x', audio: '73b0-5728.mp3' },
    { hanzi: "星期", pinyin: "xīngqī", contrast: 'j-q-x', side: 'x', audio: '661f-671f.mp3' },
    { hanzi: "喜欢", pinyin: "xǐhuan", contrast: 'j-q-x', side: 'x', audio: '559c-6b22.mp3' },
    { hanzi: "学习", pinyin: "xuéxí", contrast: 'j-q-x', side: 'x', audio: '5b66-4e60.mp3' },
    { hanzi: "想", pinyin: "xiǎng", contrast: 'j-q-x', side: 'x', audio: '60f3.mp3' },
  ];

  const TONE_ITEMS = [
    { hanzi: "妈", pinyin: "mā", tone: 1, audio: '5988.mp3' },
    { hanzi: "吃", pinyin: "chī", tone: 1, audio: '5403.mp3' },
    { hanzi: "书", pinyin: "shū", tone: 1, audio: '4e66.mp3' },
    { hanzi: "七", pinyin: "qī", tone: 1, audio: '4e03.mp3' },
    { hanzi: "一", pinyin: "yī", tone: 1, audio: '4e00.mp3' },
    { hanzi: "分", pinyin: "fēn", tone: 1, audio: '5206.mp3' },
    { hanzi: "麻", pinyin: "má", tone: 2, audio: '9ebb.mp3' },
    { hanzi: "零", pinyin: "líng", tone: 2, audio: '96f6.mp3' },
    { hanzi: "十", pinyin: "shí", tone: 2, audio: '5341.mp3' },
    { hanzi: "谁", pinyin: "shéi", tone: 2, audio: '8c01.mp3' },
    { hanzi: "前", pinyin: "qián", tone: 2, audio: '524d.mp3' },
    { hanzi: "晴", pinyin: "qíng", tone: 2, audio: '6674.mp3' },
    { hanzi: "马", pinyin: "mǎ", tone: 3, audio: '9a6c.mp3' },
    { hanzi: "女", pinyin: "nǚ", tone: 3, audio: '5973.mp3' },
    { hanzi: "我", pinyin: "wǒ", tone: 3, audio: '6211.mp3' },
    { hanzi: "五", pinyin: "wǔ", tone: 3, audio: '4e94.mp3' },
    { hanzi: "百", pinyin: "bǎi", tone: 3, audio: '767e.mp3' },
    { hanzi: "哪", pinyin: "nǎ", tone: 3, audio: '54ea.mp3' },
    { hanzi: "骂", pinyin: "mà", tone: 4, audio: '9a82.mp3' },
    { hanzi: "是", pinyin: "shì", tone: 4, audio: '662f.mp3' },
    { hanzi: "叫", pinyin: "jiào", tone: 4, audio: '53eb.mp3' },
    { hanzi: "姓", pinyin: "xìng", tone: 4, audio: '59d3.mp3' },
    { hanzi: "岁", pinyin: "suì", tone: 4, audio: '5c81.mp3' },
    { hanzi: "住", pinyin: "zhù", tone: 4, audio: '4f4f.mp3' },
  ];

  function itemsFor(contrastId) {
    return ITEMS.filter(function (item) { return item.contrast === contrastId; });
  }

  // FNV-1a over the seed: the card must change with the seed, but the same
  // seed and contrast must always give the same card.
  function hash(str) {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h;
  }

  function pick(seed, contrastId) {
    const pool = itemsFor(contrastId);
    if (!pool.length) return null;
    const n = typeof seed === 'number' && Number.isFinite(seed) ? seed : 0;
    return pool[hash(contrastId + '|' + n) % pool.length];
  }

  function check(item, side) {
    return !!item && item.side === side;
  }

  function pickTone(seed) {
    const n = typeof seed === 'number' && Number.isFinite(seed) ? seed : 0;
    return TONE_ITEMS[hash('tone|' + n) % TONE_ITEMS.length];
  }

  function checkTone(item, tone) {
    return !!item && item.tone === tone;
  }

  window.EAR = { CONTRASTS, ITEMS, itemsFor, pick, check, TONE_ITEMS, pickTone, checkTone };
})();
