/**
 * Mobile compatibility logic.
 * - sumDigits: total digit sum + intermediate-reduced single digit
 * - normalize: replace any 0 with the digit immediately to its LEFT
 *              (if 0 is at index 0, use the right neighbour)
 * - pairs: 9 consecutive 2-digit pairs
 * - alerts: kaal-sarp dosh, pitra dosh, repeated digits
 * - status table: data dictionary of pair meanings
 */

export const PAIR_DATA = {
  // Good
  "12": { s: "good", t: "Saves money & resources, attractive face, supportive life partner." },
  "21": { s: "average", t: "Attractive face, but tends to over-spend money." },
  "13": { s: "good", t: "Good advisor, good education, respected & popular in their circle. Strong combination for professionals." },
  "31": { s: "good", t: "Good advisor, good education, respected & popular in their circle. Strong combination for professionals." },
  "14": { s: "bad", t: "MOST troublesome — Loans, legal notices, indigestion / joint pain / bone issues, accidents / surgeries, slow recovery." },
  "41": { s: "bad", t: "MOST troublesome — Loans, legal notices, indigestion / joint pain / bone issues, accidents / surgeries, slow recovery." },
  "15": { s: "good", t: "Excellent for communication, brokerage, commission, marriage, dealers, traders, stock-market, agents, mediators." },
  "51": { s: "good", t: "Excellent for communication, brokerage, commission, marriage, dealers, traders, stock-market, agents, mediators." },
  "16": { s: "bad", t: "Spouse / life-partner health issues, married-life problems, job loss / career instability, financial loss, heart / kidney issues." },
  "61": { s: "bad", t: "Spouse / life-partner health issues, married-life problems, job loss / career instability, financial loss, heart / kidney issues." },
  "17": { s: "good", t: "Money work never stops. Govt job (90% chance), MNC career, possibility of 2 marriages (if 2 or 7 repeats in DOB), strong contacts, networking / MLM." },
  "71": { s: "good", t: "Money work never stops. Govt job (90% chance), MNC career, possibility of 2 marriages (if 2 or 7 repeats in DOB), strong contacts, networking / MLM." },
  "18": { s: "bad", t: "Spouse health issues, govt-related issues, frequent job changes, father–son ego/misunderstanding, possible father health issues." },
  "81": { s: "bad", t: "Spouse health issues, govt-related issues, frequent job changes, father–son ego/misunderstanding, possible father health issues." },
  "19": { s: "good", t: "Very good. You own what you want — leadership, prestige, recognition, society me naam." },
  "91": { s: "good", t: "Very good. You own what you want — leadership, prestige, recognition, society me naam." },
  "23": { s: "bad", t: "Win over enemies but multiple/extra-marital relations, late marriage, child-conceiving issues." },
  "32": { s: "bad", t: "Win over enemies but multiple/extra-marital relations, late marriage, child-conceiving issues." },
  "24": { s: "bad", t: "WORST — Depression, mood swings, negative thoughts, self-destructive tendencies, addictions, restless mind." },
  "42": { s: "bad", t: "WORST — Depression, mood swings, negative thoughts, self-destructive tendencies, addictions, restless mind." },
  "25": { s: "good", t: "Strong interest in occult science (astrology, numerology, tarot, healing). Magical & healing powers, air travel." },
  "52": { s: "good", t: "Strong interest in occult science (astrology, numerology, tarot, healing). Magical & healing powers, air travel." },
  "26": { s: "bad", t: "Never give to students. Education obstruction, distractions, love affairs, female–MIL friction, child-birth issues, less sperm count (male)." },
  "62": { s: "bad", t: "Never give to students. Education obstruction, distractions, love affairs, female–MIL friction, child-birth issues, less sperm count (male)." },
  "27": { s: "bad", t: "WORST — joint / muscle / knee / back / neck pain, career ups & downs, urinary infections, reproductive disease." },
  "72": { s: "bad", t: "WORST — joint / muscle / knee / back / neck pain, career ups & downs, urinary infections, reproductive disease." },
  "28": { s: "bad", t: "Vish-yog — partnership unsuitable, depression / suicidal tendencies, jealousy, hospital expenses, water leakage, possibility of 2 marriages in family." },
  "82": { s: "bad", t: "Vish-yog — partnership unsuitable, depression / suicidal tendencies, jealousy, hospital expenses, water leakage, possibility of 2 marriages in family." },
  "29": { s: "good", t: "Lakshmi-dhan yog — strong financial status, self-earned wealth, banking / accounts / finance career." },
  "92": { s: "good", t: "Lakshmi-dhan yog — strong financial status, self-earned wealth, banking / accounts / finance career." },
  "34": { s: "bad", t: "Breathing/respiration issues (asthma, sinus, lungs), parent-child friction, heart disease, paralysis tendencies, less confidence, stubbornness." },
  "43": { s: "bad", t: "Breathing/respiration issues (asthma, sinus, lungs), parent-child friction, heart disease, paralysis tendencies, less confidence, stubbornness." },
  "35": { s: "good", t: "Super intelligent, wise, social, travel-loving. Stay away from native land — online / WFH work suits." },
  "53": { s: "good", t: "Super intelligent, wise, social, travel-loving. Stay away from native land — online / WFH work suits." },
  "36": { s: "good", t: "Multi-talented, religious, follows rules, deep knowledge, self-respect very important." },
  "63": { s: "good", t: "Multi-talented, religious, follows rules, deep knowledge, self-respect very important." },
  "37": { s: "good", t: "Brings you to the top of your field — strong financial source, education, occult science, research / Ph.D / scientist." },
  "73": { s: "good", t: "Brings you to the top of your field — strong financial source, education, occult science, research / Ph.D / scientist." },
  "38": { s: "bad", t: "Real-estate / counselor / mediator favoured, but strict / ziddi nature; married life unsatisfactory, divorce / separation / early loss of life partner." },
  "83": { s: "bad", t: "Real-estate / counselor / mediator favoured, but strict / ziddi nature; married life unsatisfactory, divorce / separation / early loss of life partner." },
  "39": { s: "good", t: "Active, energetic, intelligent, hardworking, social-service / NGO / engineer / technical field. Honour & respect." },
  "93": { s: "good", t: "Active, energetic, intelligent, hardworking, social-service / NGO / engineer / technical field. Honour & respect." },
  "45": { s: "bad", t: "MOST problematic — intelligent but sister/daughter health issues, frequent court / hospital / medicine visits." },
  "54": { s: "bad", t: "MOST problematic — intelligent but sister/daughter health issues, frequent court / hospital / medicine visits." },
  "46": { s: "bad", t: "Skin diseases / psoriasis, extra-marital affairs, urinary / kidney / prostate issues, intercast marriage." },
  "64": { s: "bad", t: "Skin diseases / psoriasis, extra-marital affairs, urinary / kidney / prostate issues, intercast marriage." },
  "47": { s: "bad", t: "Never recommended — clever, jugaadu, strong willpower, but struggle, disappointments, frustration, cheating in relationships." },
  "74": { s: "bad", t: "Never recommended — clever, jugaadu, strong willpower, but struggle, disappointments, frustration, cheating in relationships." },
  "48": { s: "bad", t: "Dangerous — incurable / chronic disease, deficiency in marital pleasures, depression, addiction, blood disease, court cases, surgeries." },
  "84": { s: "bad", t: "Dangerous — incurable / chronic disease, deficiency in marital pleasures, depression, addiction, blood disease, court cases, surgeries." },
  "49": { s: "bad", t: "50/50 uniformed-job, criminal-minded / risky work, success only after hardship, bold, dabang nature." },
  "94": { s: "bad", t: "50/50 uniformed-job, criminal-minded / risky work, success only after hardship, bold, dabang nature." },
  "56": { s: "bad", t: "Hesitate to ask own money back, business losses, big landmark near home (mandir / superstore), failure in love." },
  "65": { s: "bad", t: "Hesitate to ask own money back, business losses, big landmark near home (mandir / superstore), failure in love." },
  "57": { s: "good", t: "Excellent — speakers, writers, poets, artists, public relations, advisors, businessmen." },
  "75": { s: "good", t: "Excellent — speakers, writers, poets, artists, public relations, advisors, businessmen." },
  "58": { s: "bad", t: "Money stuck / property losses, calculative mind, large-scale finance work but blocks." },
  "85": { s: "bad", t: "Money stuck / property losses, calculative mind, large-scale finance work but blocks." },
  "59": { s: "average", t: "Straight-forward — can damage relations through bad speech. Science / commerce stream, fewer but loyal relations, technical knowledge, successful businessman." },
  "95": { s: "average", t: "Straight-forward — can damage relations through bad speech. Science / commerce stream, fewer but loyal relations, technical knowledge, successful businessman." },
  "67": { s: "average", t: "Situational — chance of love marriage; spouse health issues, marital dissatisfaction. Music / luxury / artistic / perfectionist nature." },
  "76": { s: "average", t: "Situational — chance of love marriage; spouse health issues, marital dissatisfaction. Music / luxury / artistic / perfectionist nature." },
  "68": { s: "bad", t: "Eye / chest / breast / heart problems, organ-specific issues. Suitable for surgeons / medical staff only." },
  "86": { s: "bad", t: "Eye / chest / breast / heart problems, organ-specific issues. Suitable for surgeons / medical staff only." },
  "69": { s: "good", t: "Creative, talented — dance / choreography / event / wedding planners, designers. Good management & planning skills." },
  "96": { s: "good", t: "Creative, talented — dance / choreography / event / wedding planners, designers. Good management & planning skills." },
  "78": { s: "average", t: "Spiritual / healer, social worker, idealistic — values, honesty, traditions. Loneliness; not great for materialistic / married life." },
  "87": { s: "average", t: "Spiritual / healer, social worker, idealistic — values, honesty, traditions. Loneliness; not great for materialistic / married life." },
  "79": { s: "bad", t: "Success only after separation from father, career ups-downs, blood / joint / kidney problems, domestic life disturbance / divorce." },
  "97": { s: "bad", t: "Success only after separation from father, career ups-downs, blood / joint / kidney problems, domestic life disturbance / divorce." },
  "89": { s: "bad", t: "Argumentative (logical), works with principle. Chronic diseases in later age (last 6 digits more dangerous). Astrologers / consultants / advocates / brokers." },
  "98": { s: "bad", t: "Argumentative (logical), works with principle. Chronic diseases in later age (last 6 digits more dangerous). Astrologers / consultants / advocates / brokers." },
};

export const STATUS_FALLBACK = {
  good: "Generally favourable energy — supports growth, stability and positive flow when other combinations also align.",
  average: "Mixed / situational energy — may bring opportunity in some areas but caution in others. Watch the surrounding pairs.",
  bad: "Challenging vibration — may create resistance, slowdown or disturbance. A consultation can suggest a corrective number.",
};

export function reduceToSingle(n) {
  while (n > 9) {
    n = String(n).split("").reduce((a, c) => a + parseInt(c, 10), 0);
  }
  return n;
}

export function digitSumWithSteps(digits) {
  const total = digits.reduce((a, b) => a + b, 0);
  const steps = [total];
  let n = total;
  while (n > 9) {
    n = String(n).split("").reduce((a, c) => a + parseInt(c, 10), 0);
    steps.push(n);
  }
  return { total, single: n, steps };
}

/**
 * Replace each 0 with its LEFT neighbour digit. If 0 is at index 0, use the right neighbour.
 */
export function modifyZeros(digits) {
  const out = [...digits];
  for (let i = 0; i < out.length; i++) {
    if (out[i] === 0) {
      if (i === 0) {
        // find the next non-zero to the right
        let j = 1;
        while (j < out.length && out[j] === 0) j++;
        out[i] = j < out.length ? out[j] : 0;
      } else {
        out[i] = out[i - 1];
      }
    }
  }
  return out;
}

export function buildPairs(digits) {
  const pairs = [];
  for (let i = 0; i < digits.length - 1; i++) {
    pairs.push(`${digits[i]}${digits[i + 1]}`);
  }
  return pairs;
}

export function pairStatus(pair) {
  const data = PAIR_DATA[pair];
  if (data) return { status: data.s, detail: data.t };
  // Fallback: compute heuristic from digit sum
  const sum = pair.split("").reduce((a, c) => a + parseInt(c, 10), 0);
  const single = reduceToSingle(sum);
  // simple heuristic — odd singles tend favourable, but mark as average
  const status = [1, 3, 5, 6, 9].includes(single) ? "good" : [2, 7].includes(single) ? "average" : "bad";
  return { status, detail: STATUS_FALLBACK[status] };
}

export function detectAlerts(digits) {
  const alerts = [];
  const set = new Set(digits);
  // Kaal Sarp Dosh — 3, 4, 7 all present
  if (set.has(3) && set.has(4) && set.has(7)) {
    alerts.push({
      type: "kaal-sarp",
      title: "Kaal Sarp Dosh detected",
      message:
        "The digits 3, 4 and 7 appear together in this number — a classical indicator of Kaal Sarp Dosh, often felt as repeated obstacles, sudden setbacks and stagnation despite hard work.",
    });
  }
  // Pitra Dosh — 2, 7, 9 all present
  if (set.has(2) && set.has(7) && set.has(9)) {
    alerts.push({
      type: "pitra",
      title: "Pitra Dosh indicated",
      message:
        "The digits 2, 7 and 9 appear together — traditionally read as Pitra Dosh, suggesting unresolved ancestral karma that may surface as family-related difficulties.",
    });
  }
  // Repetitions > 2
  const counts = {};
  digits.forEach((d) => (counts[d] = (counts[d] || 0) + 1));
  Object.entries(counts).forEach(([d, c]) => {
    if (c > 2) {
      alerts.push({
        type: "repeat",
        title: `Digit ${d} repeats ${c} times`,
        message: `The digit ${d} repeats ${c} times in this number. A heavily repeated digit greatly amplifies its energy — both gifts and challenges of that number become more intense in the bearer's life.`,
      });
    }
  });
  return alerts;
}
