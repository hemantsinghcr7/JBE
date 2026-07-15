export const company = {
  name: "Jai Bhawani Enterprises",
  shortName: "JBE",
  gst: "27ADGPC2741P1ZE",
  phone: "+91 80438 37022",
  phoneTel: "+918043837022",
  address: {
    line1: "M-61, MIDC Ambad",
    city: "Nashik",
    pin: "422010",
    state: "Maharashtra",
    country: "India",
  },
  founded: 1998,
  tagline: "NON-FERROUS · EST. 1998",
  mapSrc:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1112.1171241450672!2d73.73951626961619!3d19.958477259398318!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bddecaee6f4de5d%3A0xcf19b6e86c605ab!2sM%2F61%2C%20Coca%20Cola%20Layer%20Rd%2C%20Mahajan%20Nagar%2C%20Nashik%2C%20Maharashtra%20422010%2C%20India!5e1!3m2!1sen!2sau!4v1781136416381!5m2!1sen!2sau",
};

export const stats = [
  { value: 28, suffix: "", unit: "YRS", label: "In the trade" },
  { value: 25, suffix: "+", unit: "", label: "Crew on ground" },
  { value: 2, suffix: "", unit: "", label: "Processing sites" },
  { value: 3, suffix: "", unit: "", label: "Owned trucks" },
];

export const materials = [
  {
    id: "aluminium",
    symbol: "AL",
    name: "Aluminium",
    matNo: "MAT / 01",
    description: "Sheet, castings, extrusion and can stock — mixed or sorted.",
    swatchClass: "swatch-al",
    grades: [
      { name: "Old sheet & utensil", code: "TAINT/TABOR" },
      { name: "Mixed castings", code: "TENSE" },
      { name: "Extrusion", code: "6063" },
      { name: "Beverage cans", code: "UBC" },
    ],
  },
  {
    id: "copper",
    symbol: "CU",
    name: "Copper",
    matNo: "MAT / 02",
    description: "Bright wire to No.2 — cable, busbar, motors and mixed lots.",
    swatchClass: "swatch-cu",
    grades: [
      { name: "Bare bright wire", code: "MILLBERRY" },
      { name: "No.1 wire", code: "BERRY" },
      { name: "No.1 solids", code: "CANDY" },
      { name: "No.2 copper", code: "BIRCH/CLIFF" },
    ],
  },
  {
    id: "brass",
    symbol: "BR",
    name: "Brass",
    matNo: "MAT / 03",
    description: "Solids, fittings and machine-shop turnings.",
    swatchClass: "swatch-br",
    grades: [
      { name: "Yellow brass solids", code: "HONEY" },
      { name: "Mixed brass", code: "MIXED" },
      { name: "Turnings & borings", code: "TURNINGS" },
    ],
  },
];

export const supplyItems = [
  { label: "Iron wire coil", colorClass: "i-fe" },
  { label: "Copper rods", colorClass: "i-cu" },
];

export const processSteps = [
  {
    no: "STEP 01",
    title: "Buy",
    body: "Factory scrap and yard lots. Our crew arrives at your gate, packs, weighs and loads — teams of 7 to 10, our trucks.",
  },
  {
    no: "STEP 02",
    title: "Process",
    body: "Sorted, segregated and baled by grade at two MIDC Ambad sites — 25 hands that know metal by sight and sound.",
  },
  {
    no: "STEP 03",
    title: "Supply",
    body: "Graded material delivered to manufacturers across Maharashtra and Gujarat — plus iron wire coil and copper rods.",
  },
];

export const howWeWork = [
  {
    tag: "How we work — 01",
    title: "Our crew, your gate",
    body: "We send our own people — teams of 7 to 10 — to pack, weigh and load at your factory. You don't lift a thing.",
  },
  {
    tag: "How we work — 02",
    title: "Own fleet",
    body: "Three owned trucks move material on our schedule — no waiting on hired transport to free up.",
  },
  {
    tag: "How we work — 03",
    title: "Grade-honest",
    body: "Material is weighed and graded in front of you, settled straight. It's why the same suppliers have stayed for decades.",
  },
];

export const timeline = [
  {
    when: "1998",
    what: "Founded in Ambad, Nashik",
    note: "One yard, one weighbridge, one family.",
  },
  {
    when: "Growth",
    what: "Second site & owned fleet",
    note: "Processing capacity doubled; three trucks on the road.",
  },
  {
    when: "Today",
    what: "Two states, export groundwork",
    note: "Supplying MH & GJ manufacturers; building cross-border lines.",
  },
];

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Materials", href: "#materials" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export const tickerItems = [
  "Aluminium scrap",
  "Copper scrap",
  "Brass scrap",
  "Iron wire coil",
  "Copper rods",
  "Buying · Processing · Supplying",
  "Nashik — Est. 1998",
];

export const contactRows = [
  {
    key: "Phone",
    value: company.phone,
    href: `tel:${company.phoneTel}`,
  },
  {
    key: "Address",
    value: `${company.address.line1}, ${company.address.city} ${company.address.pin}, ${company.address.state}, ${company.address.country}`,
  },
  { key: "GST", value: company.gst, mono: true },
  { key: "Serving", value: "Maharashtra & Gujarat" },
];

export const roleOptions = [
  "Seller — factory scrap",
  "Seller — yard lot",
  "Buyer — graded material",
  "Logistics / transport",
  "Other",
];
