export type WasteCategory = "Wet" | "Dry" | "E-Waste" | "Hazardous";

export type ClassificationResult = {
  category: WasteCategory;
  confidence: number;
  title: string;
  summary: string;
  steps: string[];
  safety: string;
  dropoff: string;
  matched: string;
  isFallback?: boolean;
};

type WasteRule = Omit<ClassificationResult, "matched" | "isFallback"> & {
  terms: string[];
};

export const categoryMeta: Record<WasteCategory, {
  label: string;
  short: string;
  color: string;
  soft: string;
}> = {
  Wet: {
    label: "Wet waste",
    short: "Compostable",
    color: "#2F9E71",
    soft: "#E8F6ED",
  },
  Dry: {
    label: "Dry waste",
    short: "Recoverable",
    color: "#1782B4",
    soft: "#E7F3F9",
  },
  "E-Waste": {
    label: "E-waste",
    short: "Recoverable tech",
    color: "#7357D9",
    soft: "#EFEAFE",
  },
  Hazardous: {
    label: "Hazardous",
    short: "Special handling",
    color: "#C46A37",
    soft: "#FFF1E6",
  },
};

const rules: WasteRule[] = [
  {
    terms: ["banana peel", "banana skin", "fruit peel", "apple core", "orange peel"],
    category: "Wet",
    confidence: 98,
    title: "Organic kitchen scraps",
    summary: "This item is biodegradable and belongs in the wet / compost stream.",
    steps: ["Remove stickers, rubber bands, or packaging", "Place in a ventilated compost or wet-waste bin"],
    safety: "Keep the bin lined with newspaper or a compostable liner to reduce leakage.",
    dropoff: "Use your apartment, campus, or community compost collection.",
  },
  {
    terms: ["food scraps", "vegetable scraps", "vegetable peel", "kitchen waste", "leftover food", "cooked food"],
    category: "Wet",
    confidence: 96,
    title: "Food and vegetable scraps",
    summary: "Food scraps break down into nutrient-rich compost when kept out of dry recyclables.",
    steps: ["Drain excess liquid and remove non-food pieces", "Add to your wet-waste or compost caddy"],
    safety: "Do not mix in batteries, plastic wrappers, or cleaning chemicals.",
    dropoff: "Community compost hubs and municipal wet-waste pickups accept this stream.",
  },
  {
    terms: ["coffee grounds", "tea leaves", "tea bag", "eggshell", "egg shell"],
    category: "Wet",
    confidence: 95,
    title: "Compostable kitchen matter",
    summary: "A natural organic material that can be processed with food and garden waste.",
    steps: ["Empty out any staples, tags, or plastic mesh", "Add to the wet-waste or home compost stream"],
    safety: "Avoid sealing wet organics in plastic bags for long periods.",
    dropoff: "A neighborhood compost point is the best destination.",
  },
  {
    terms: ["grass", "leaves", "garden waste", "flower", "plant trimmings"],
    category: "Wet",
    confidence: 94,
    title: "Garden organics",
    summary: "Plant matter can be composted instead of sent to landfill.",
    steps: ["Shake off soil, stones, and plastic ties", "Bundle loosely or add to the green-waste bin"],
    safety: "Never add diseased plants or treated wood without checking local rules.",
    dropoff: "Use municipal green-waste collection or a community garden compost bay.",
  },
  {
    terms: ["cardboard", "corrugated box", "shipping box", "paper box"],
    category: "Dry",
    confidence: 97,
    title: "Paperboard and cardboard",
    summary: "Clean, dry cardboard is a high-value fibre material for recycling.",
    steps: ["Flatten the box and remove tape, foam, and plastic film", "Keep it dry and place with paper recyclables"],
    safety: "Grease and food residue can contaminate the paper stream.",
    dropoff: "Put it in your dry-recyclables cart or take it to a paper recovery center.",
  },
  {
    terms: ["paper", "newspaper", "magazine", "notebook", "office paper"],
    category: "Dry",
    confidence: 97,
    title: "Paper products",
    summary: "Most clean paper can be recovered into new paper products.",
    steps: ["Remove plastic covers, foil, and food residue", "Keep loose or place in a paper bag before recycling"],
    safety: "Shredded paper may need a separate bag depending on your local collector.",
    dropoff: "Use the dry-waste stream or a campus paper collection point.",
  },
  {
    terms: ["plastic bottle", "water bottle", "pet bottle", "soft drink bottle"],
    category: "Dry",
    confidence: 96,
    title: "Rigid plastic bottle",
    summary: "This bottle is recyclable when it is empty, clean, and dry.",
    steps: ["Empty and quick-rinse; keep the cap on if your local program allows", "Crush lightly and place with dry recyclables"],
    safety: "Never put a bottle with chemical residue into mixed recycling.",
    dropoff: "Dry-waste collection, reverse-vending points, or a PET recovery center.",
  },
  {
    terms: ["glass jar", "glass bottle", "jar"],
    category: "Dry",
    confidence: 95,
    title: "Glass container",
    summary: "Glass can be recycled repeatedly when it is separated from food residue.",
    steps: ["Empty and rinse; remove metal lids for separate recycling", "Place carefully in a rigid dry-waste container"],
    safety: "Wrap broken glass and label it so collection workers are protected.",
    dropoff: "Use a glass bank or the dry-waste collection point that accepts glass.",
  },
  {
    terms: ["aluminum can", "tin can", "metal can", "soda can", "food can"],
    category: "Dry",
    confidence: 96,
    title: "Metal packaging",
    summary: "Aluminum and steel packaging have strong recovery value.",
    steps: ["Empty and rinse the can", "Let it dry, then add to the dry recyclables stream"],
    safety: "Do not crush aerosol cans or cans that held hazardous chemicals.",
    dropoff: "Dry recyclables or a local metal recovery dealer.",
  },
  {
    terms: ["pizza box", "greasy pizza box", "food-stained cardboard"],
    category: "Wet",
    confidence: 92,
    title: "Food-stained cardboard",
    summary: "Grease and food residue make the cardboard unsuitable for paper recycling.",
    steps: ["Tear away the clean, dry lid for the dry stream", "Put the greasy base into wet waste or compost"],
    safety: "Remove plastic pizza-saver tripods, foil, and sauce tubs first.",
    dropoff: "Use the wet-waste bin for the stained section.",
  },
  {
    terms: ["old smartphone", "mobile phone", "cell phone", "phone"],
    category: "E-Waste",
    confidence: 99,
    title: "Mobile device",
    summary: "Phones contain recoverable metals and a lithium battery; keep them out of bins.",
    steps: ["Back up and factory-reset personal data, then remove the SIM card", "Take the device to an authorized e-waste or take-back point"],
    safety: "Do not crush, puncture, or place the phone in household recycling.",
    dropoff: "Use an electronics retailer take-back program or certified e-waste recycler.",
  },
  {
    terms: ["laptop", "tablet", "ipad", "computer", "desktop"],
    category: "E-Waste",
    confidence: 99,
    title: "Computing device",
    summary: "Computers contain valuable metals and components that require specialist recovery.",
    steps: ["Sign out, back up, and securely erase personal data", "Keep the device dry and deliver it to an e-waste center"],
    safety: "If the battery is swollen, do not power on or transport it loosely.",
    dropoff: "Certified e-waste processors, brand take-back schemes, or campus IT collection.",
  },
  {
    terms: ["charger", "charging cable", "usb cable", "adapter", "power cord"],
    category: "E-Waste",
    confidence: 98,
    title: "Cable or power adapter",
    summary: "Cables and adapters are small electronics, not general plastic waste.",
    steps: ["Gather loose cables together and keep plugs intact", "Place in a small e-waste collection box"],
    safety: "Do not cut cords or leave exposed copper where it can injure handlers.",
    dropoff: "Electronics take-back bins or a certified e-waste recycler.",
  },
  {
    terms: ["keyboard", "mouse", "headphones", "earbuds", "remote control", "router"],
    category: "E-Waste",
    confidence: 97,
    title: "Small electronic accessory",
    summary: "Small electronics should be collected together for parts and material recovery.",
    steps: ["Remove loose batteries if it is safe to do so", "Bundle the accessory and take it to an e-waste point"],
    safety: "Keep electronics away from moisture and do not dismantle them at home.",
    dropoff: "Retail take-back boxes, repair cafes, or certified e-waste collection.",
  },
  {
    terms: ["broken lithium battery", "lithium battery", "power bank", "portable charger"],
    category: "Hazardous",
    confidence: 99,
    title: "Lithium battery",
    summary: "Lithium cells can ignite if damaged, shorted, or placed in a waste truck.",
    steps: ["Tape the terminals with non-conductive tape; do not puncture or charge", "Store cool and dry, then use a battery drop-off point"],
    safety: "If swollen, hot, leaking, or smoking, isolate it outdoors away from combustibles and contact local emergency guidance.",
    dropoff: "Battery collection boxes or a household hazardous-waste facility.",
  },
  {
    terms: ["paint", "paint can", "varnish", "wood stain"],
    category: "Hazardous",
    confidence: 99,
    title: "Paint and coatings",
    summary: "Liquid paints and coatings can contaminate soil and water if poured into drains.",
    steps: ["Keep the lid closed and label the container clearly", "Take remaining liquid to a household hazardous-waste collection day"],
    safety: "Never pour paint, thinner, or varnish into a sink, toilet, or storm drain.",
    dropoff: "Municipal hazardous-waste depots or paint take-back programs.",
  },
  {
    terms: ["bleach", "cleaning chemical", "disinfectant", "toilet cleaner", "drain cleaner"],
    category: "Hazardous",
    confidence: 99,
    title: "Household cleaning chemical",
    summary: "Chemical cleaners need controlled handling to protect people and waterways.",
    steps: ["Keep in the original, closed container; never mix products", "Deliver to a household hazardous-waste facility"],
    safety: "Do not mix bleach with acids or ammonia. If exposed, follow the product label and seek help.",
    dropoff: "Household hazardous-waste depot or a municipal chemical collection event.",
  },
  {
    terms: ["medicine", "medication", "pills", "syringe", "medical waste"],
    category: "Hazardous",
    confidence: 99,
    title: "Medicine or clinical item",
    summary: "Medicines and sharps require controlled take-back so they do not enter waterways or injure workers.",
    steps: ["Keep in original packaging; place sharps in a sealed puncture-resistant container", "Return to a pharmacy or approved medical-waste point"],
    safety: "Never flush medication or place loose needles in any household bin.",
    dropoff: "Pharmacy take-back, clinic collection, or an approved sharps program.",
  },
  {
    terms: ["aerosol", "spray can", "insecticide", "pesticide", "bug spray"],
    category: "Hazardous",
    confidence: 99,
    title: "Pressurized or toxic container",
    summary: "Pressurized and pesticide containers need specialist handling even when they look empty.",
    steps: ["Do not puncture, burn, or crush the container", "Take it to a hazardous-waste or approved aerosol collection point"],
    safety: "Keep away from heat and store upright until drop-off.",
    dropoff: "Household hazardous-waste depots or chemical retailer take-back schemes.",
  },
  {
    terms: ["thermometer", "mercury", "fluorescent tube", "cfl bulb", "compact fluorescent"],
    category: "Hazardous",
    confidence: 99,
    title: "Mercury-containing item",
    summary: "Some lamps and thermometers contain mercury and must not be broken or binned.",
    steps: ["Keep intact in a rigid box; never vacuum a broken mercury lamp", "Use a hazardous-waste or lamp-recycling collection point"],
    safety: "If broken, leave the area, ventilate if safe, and follow local public-health guidance.",
    dropoff: "Specialty lamp recycling or a municipal hazardous-waste facility.",
  },
  {
    terms: ["styrofoam", "thermocol", "foam packaging", "bubble wrap", "plastic wrapper", "snack packet"],
    category: "Dry",
    confidence: 87,
    title: "Lightweight packaging",
    summary: "This material is dry but may need a specialized drop-off because it is hard to sort curbside.",
    steps: ["Brush off food and keep the pieces dry", "Bag together and check whether your local dry-waste partner accepts it"],
    safety: "Never burn foam or plastic packaging; toxic smoke can be released.",
    dropoff: "A flexible-plastics or packaging take-back point where available.",
  },
  {
    terms: ["clothes", "old clothes", "textile", "shoes", "fabric"],
    category: "Dry",
    confidence: 88,
    title: "Textile and footwear",
    summary: "Usable textiles should be reused first; worn textiles can be recovered through specialist partners.",
    steps: ["Wash and dry; pair shoes and remove wet or moldy items", "Donate, repair, or place in a textile collection bag"],
    safety: "Do not mix damp textiles into paper or food-waste bins.",
    dropoff: "Charity shops, repair hubs, or textile take-back containers.",
  },
  {
    terms: ["cooking oil", "used oil", "motor oil", "grease"],
    category: "Hazardous",
    confidence: 93,
    title: "Used oil or grease",
    summary: "Oil can clog drains and contaminate water, while motor oil requires controlled recovery.",
    steps: ["Cool and seal household cooking oil in a leakproof container", "Take it to an oil collection point; never pour it down a drain"],
    safety: "Keep motor oil separate from cooking oil and away from children or heat.",
    dropoff: "Used-oil collection, mechanic take-back, or a household hazardous-waste depot.",
  },
];

const fallback: ClassificationResult = {
  category: "Dry",
  confidence: 58,
  title: "Let’s make the call together",
  summary: "We could not find a confident match in the local waste rules library yet.",
  steps: ["Keep the item separate, clean, and dry while you check its material", "Ask your local collection partner before placing it in a bin"],
  safety: "If it contains a battery, chemical, sharp edge, liquid, or unknown powder, treat it as hazardous until confirmed.",
  dropoff: "A local recycling center or municipal helpline can confirm the correct stream.",
  matched: "No close match",
  isFallback: true,
};

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
}

export function classifyWaste(query: string): ClassificationResult {
  const normalized = normalize(query);
  if (!normalized) return fallback;

  const tokens = new Set(normalized.split(" "));
  let best: { rule: WasteRule; score: number; term: string } | null = null;

  for (const rule of rules) {
    for (const term of rule.terms) {
      const phrase = normalize(term);
      const phraseTokens = phrase.split(" ");
      const exactPhrase = normalized.includes(phrase);
      const matchingTokens = phraseTokens.filter((token) => tokens.has(token)).length;
      const tokenScore = matchingTokens / phraseTokens.length;
      const score = exactPhrase ? 1.2 + tokenScore : tokenScore;
      if (!best || score > best.score) best = { rule, score, term };
    }
  }

  if (!best || best.score < 0.46) return fallback;
  const confidence = Math.min(99, Math.max(best.rule.confidence - (best.score < 0.9 ? 7 : 0), 62));
  return { ...best.rule, confidence, matched: best.term };
}

export const quickQueries = [
  "broken lithium battery",
  "greasy pizza box",
  "old smartphone",
  "paint can",
  "coffee grounds",
];

export const categoryGuides: Array<{
  category: WasteCategory;
  eyebrow: string;
  description: string;
  examples: string[];
}> = [
  { category: "Wet", eyebrow: "Return to soil", description: "Food and garden matter that can break down naturally.", examples: ["Fruit peels", "Coffee grounds", "Garden cuttings"] },
  { category: "Dry", eyebrow: "Recover & reuse", description: "Clean materials that can be sorted, recycled, or donated.", examples: ["Paper & cardboard", "Glass jars", "Textiles"] },
  { category: "E-Waste", eyebrow: "Recover the tech", description: "Devices and accessories with valuable parts and batteries.", examples: ["Phones", "Cables", "Laptops"] },
  { category: "Hazardous", eyebrow: "Protect people", description: "Items needing specialist handling to keep toxins out of the environment.", examples: ["Batteries", "Paint", "Medicine"] },
];

export const systemPrompt = {
  role: "system",
  content: "You are an AI Sustainability Assistant specialized in waste management. Classify user queries into [Wet, Dry, E-Waste, Hazardous]. Provide 2 preparation steps and a safety rule.",
};
