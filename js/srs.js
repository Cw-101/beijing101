const SRS = (function () {
  var MINUTE = 60000, DAY = 86400000, CAP = 365 * DAY;
  
  function newCard(now) {
    return { due: now, interval: 0, ease: 2.5, reps: 0, lapses: 0, last: 0 };
  }
  
  function isDue(card, now) {
    return card.due <= now;
  }
  
  function grade(card, g, now) {
    const newCard = Object.assign({}, card);
    newCard.lapses = newCard.lapses || 0;
    
    if (g === 1) { // again
      newCard.lapses += 1;
      newCard.reps = 0;
      newCard.ease = Math.max(1.3, newCard.ease - 0.2);
      newCard.interval = 10 * MINUTE;
    } else if (g === 2) { // hard
      newCard.reps += 1;
      newCard.ease = Math.max(1.3, newCard.ease - 0.15);
      newCard.interval = newCard.interval ? Math.round(newCard.interval * 1.2) : 30 * MINUTE;
    } else if (g === 3) { // good
      newCard.reps += 1;
      newCard.interval = newCard.interval < DAY ? DAY : Math.round(newCard.interval * newCard.ease);
    } else if (g === 4) { // easy
      newCard.reps += 1;
      newCard.interval = newCard.interval < DAY ? 4 * DAY : Math.round(newCard.interval * newCard.ease * 1.3);
      newCard.ease = Math.min(3.2, newCard.ease + 0.15);
    }
    
    newCard.interval = Math.min(CAP, newCard.interval);
    newCard.due = now + newCard.interval;
    newCard.last = now;
    
    return newCard;
  }
  
  function queue(cards, now, opts) {
    opts = opts || {};
    const reviewCap = opts.reviewCap || 40;
    const newCap = opts.newCap || 10;
    
    const review = [];
    const fresh = [];
    
    Object.entries(cards).forEach(([key, card]) => {
      if (!card || card.due > now) return;   // not due yet, whatever its state
      if (card.reps > 0) review.push({ key, card });
      else fresh.push({ key, card });
    });
    
    // Sort review cards by oldest due first
    review.sort((a, b) => a.card.due - b.card.due);
    
    return {
      review: review.slice(0, reviewCap).map(item => item.key),
      fresh: fresh.slice(0, newCap).map(item => item.key)
    };
  }
  
  function preview(card, g, now) {
    // Create a copy of the card to preview what the grade would do
    const newCard = Object.assign({}, card);
    newCard.lapses = newCard.lapses || 0;
    
    if (g === 1) { // again
      return 10 * MINUTE;
    } else if (g === 2) { // hard
      return newCard.interval ? Math.round(newCard.interval * 1.2) : 30 * MINUTE;
    } else if (g === 3) { // good
      return newCard.interval < DAY ? DAY : Math.round(newCard.interval * newCard.ease);
    } else if (g === 4) { // easy
      return newCard.interval < DAY ? 4 * DAY : Math.round(newCard.interval * newCard.ease * 1.3);
    }
    return 0;
  }
  
  function human(ms) {
    if (ms < 1 * 60 * 60 * 1000) { // less than 1 hour
      return Math.round(ms / (1000 * 60)) + " min";
    } else if (ms < 2 * 24 * 60 * 60 * 1000) { // less than 2 days
      return "1 day";
    } else {
      return Math.round(ms / (1000 * 60 * 60 * 24)) + " days";
    }
  }
  
  return { MINUTE, DAY, newCard, grade, isDue, queue, preview, human };
})();
window.SRS = SRS;