"use strict";

const STORAGE_KEY = "ecobuild-demo-state-v1";

const defaultAssumptions = {
  beamWidth: 0.23,
  beamDepth: 0.3,
  columnWidth: 0.23,
  columnDepth: 0.23,
  slabThickness: 0.125,
  plasterThickness: 12,
  doorArea: 2,
  windowArea: 1.5,
  sharedBeamFactor: 0.75,
  dryVolumeFactor: 1.54,
  cementDensity: 1440,
  sandDensity: 1600,
  aggregateDensity: 1500,
  cementBagWeight: 50,
  mortarJoint: 0.01,
  plasterDryFactor: 1.27,
  plasterMixSand: 4,
  foundationConcretePerSqm: 0.1,
  slabSteelIntensity: 100,
  beamSteelIntensity: 150,
  columnSteelIntensity: 180,
  foundationSteelIntensity: 100,
  cementWastage: 3,
  sandWastage: 5,
  aggregateWastage: 5,
  brickWastage: 5,
  steelWastage: 3
};

const assumptionLabels = {
  beamWidth: "Assumed beam width (mm)",
  beamDepth: "Assumed beam depth (mm)",
  columnWidth: "Assumed column width (mm)",
  columnDepth: "Assumed column depth (mm)",
  slabThickness: "Assumed slab thickness (mm)",
  plasterThickness: "Assumed plaster thickness (mm)",
  doorArea: "Assumed door area per room (m²; 1 door)",
  windowArea: "Assumed window area per room (m²; 1 window)",
  sharedBeamFactor: "Shared beam factor",
  dryVolumeFactor: "Concrete dry volume factor",
  cementDensity: "Cement density (kg/m3)",
  sandDensity: "Sand density (kg/m3)",
  aggregateDensity: "Aggregate density (kg/m3)",
  cementBagWeight: "Cement bag weight (kg)",
  mortarJoint: "Mortar joint allowance (m)",
  plasterDryFactor: "Plaster dry factor",
  plasterMixSand: "Plaster mix sand ratio",
  foundationConcretePerSqm: "Foundation concrete (m3/m2)",
  slabSteelIntensity: "Slab steel (kg/m3)",
  beamSteelIntensity: "Beam steel (kg/m3)",
  columnSteelIntensity: "Column steel (kg/m3)",
  foundationSteelIntensity: "Foundation steel (kg/m3)",
  cementWastage: "Cement wastage (%)",
  sandWastage: "Sand wastage (%)",
  aggregateWastage: "Aggregate wastage (%)",
  brickWastage: "Brick/block wastage (%)",
  steelWastage: "Steel wastage (%)"
};

const materialSeed = [
  {
    id: "opc",
    name: "OPC",
    category: "Cement",
    unit: "kg",
    price: 7.6,
    currency: "INR",
    carbonFactor: 0.93,
    carbonUnit: "kg CO2e/kg",
    density: 1440,
    recycledContent: "0%",
    notes: "Ordinary Portland cement baseline.",
    source: "Illustrative demo factor",
    lastUpdated: "2026-10-06",
    optional: false
  },
  {
    id: "burntClayBrick",
    name: "Burnt clay brick",
    category: "Masonry",
    unit: "nos",
    price: 8,
    currency: "INR",
    carbonFactor: 0.5,
    carbonUnit: "kg CO2e/nos",
    density: null,
    recycledContent: "0%",
    notes: "Conventional walling material.",
    source: "Illustrative demo factor",
    lastUpdated: "2026-10-06",
    optional: false
  },
  {
    id: "naturalCoarseAggregate",
    name: "Natural coarse aggregate",
    category: "Aggregate",
    unit: "kg",
    price: 0.9,
    currency: "INR",
    carbonFactor: 0.008,
    carbonUnit: "kg CO2e/kg",
    density: 1500,
    recycledContent: "0%",
    notes: "Conventional quarried aggregate.",
    source: "Illustrative demo factor",
    lastUpdated: "2026-10-06",
    optional: false
  },
  {
    id: "naturalSand",
    name: "Natural sand",
    category: "Sand",
    unit: "kg",
    price: 1,
    currency: "INR",
    carbonFactor: 0.005,
    carbonUnit: "kg CO2e/kg",
    density: 1600,
    recycledContent: "0%",
    notes: "River/natural sand baseline.",
    source: "Illustrative demo factor",
    lastUpdated: "2026-10-06",
    optional: false
  },
  {
    id: "conventionalSteel",
    name: "Conventional steel",
    category: "Steel",
    unit: "kg",
    price: 65,
    currency: "INR",
    carbonFactor: 2.4,
    carbonUnit: "kg CO2e/kg",
    density: 7850,
    recycledContent: "Varies",
    notes: "Baseline reinforcement steel estimate.",
    source: "Illustrative demo factor",
    lastUpdated: "2026-10-06",
    optional: false
  },
  {
    id: "newTimber",
    name: "New timber",
    category: "Wood",
    unit: "kg",
    price: 110,
    currency: "INR",
    carbonFactor: 0.35,
    carbonUnit: "kg CO2e/kg",
    density: 600,
    recycledContent: "0%",
    notes: "Optional conventional timber input.",
    source: "Illustrative demo factor",
    lastUpdated: "2026-10-06",
    optional: true
  },
  {
    id: "conventionalAluminium",
    name: "Conventional aluminium",
    category: "Metal",
    unit: "kg",
    price: 240,
    currency: "INR",
    carbonFactor: 8.5,
    carbonUnit: "kg CO2e/kg",
    density: 2700,
    recycledContent: "Varies",
    notes: "Optional aluminium input.",
    source: "Illustrative demo factor",
    lastUpdated: "2026-10-06",
    optional: true
  },
  {
    id: "conventionalGlass",
    name: "Conventional glass",
    category: "Glass",
    unit: "m2",
    price: 850,
    currency: "INR",
    carbonFactor: 18,
    carbonUnit: "kg CO2e/m2",
    density: null,
    recycledContent: "Varies",
    notes: "Optional glazing input.",
    source: "Illustrative demo factor",
    lastUpdated: "2026-10-06",
    optional: true
  },
  {
    id: "conventionalConcretePaver",
    name: "Conventional concrete paver",
    category: "Paving",
    unit: "m2",
    price: 650,
    currency: "INR",
    carbonFactor: 22,
    carbonUnit: "kg CO2e/m2",
    density: null,
    recycledContent: "0%",
    notes: "Optional external paving input.",
    source: "Illustrative demo factor",
    lastUpdated: "2026-10-06",
    optional: true
  },
  {
    id: "conventionalAsphalt",
    name: "Conventional asphalt",
    category: "Roadwork",
    unit: "m2",
    price: 900,
    currency: "INR",
    carbonFactor: 32,
    carbonUnit: "kg CO2e/m2",
    density: null,
    recycledContent: "0%",
    notes: "Optional driveway/road input.",
    source: "Illustrative demo factor",
    lastUpdated: "2026-10-06",
    optional: true
  }
];

const alternativeSeed = [
  alt("ppc", "opc", "PPC", "kg", 1, 7, 0.6, "General RCC, plaster, masonry", "Lower clinker content and good durability.", "Slower early strength; verify curing and formwork removal timing.", "Use for general concrete where specifications permit."),
  alt("psc", "opc", "PSC", "kg", 1, 7.2, 0.5, "Mass concrete and aggressive exposure", "Low heat and strong durability potential.", "Availability can vary; slower early strength.", "Use where slag cement is locally available and accepted."),
  alt("lc3", "opc", "LC3", "kg", 1, 8, 0.55, "General construction", "Lower clinker and reduced embodied carbon.", "Supply and standards adoption may vary.", "Potential alternative - verify standards compliance."),
  alt("ggbs", "opc", "GGBS blended cement/concrete", "kg", 1, 7.4, 0.45, "Durable concrete and mass pours", "Very low carbon factor when slag is responsibly sourced.", "Needs slag supply and mix design confirmation.", "Use as partial replacement after mix approval."),
  alt("flyAshBlend", "opc", "Fly-ash blended concrete", "kg", 1, 7.1, 0.52, "General concrete", "Uses industrial by-product and lowers clinker demand.", "Fly ash quality and availability must be checked.", "Use after confirming grade, strength gain, and curing."),
  alt("calcinedClay", "opc", "Calcined-clay blended cement", "kg", 1, 7.9, 0.56, "General cement replacement", "Reduces clinker and can use abundant clay sources.", "Market availability can be limited.", "Potential alternative - verify supplier certification."),
  alt("flyAshBrick", "burntClayBrick", "Fly-ash brick", "nos", 1, 6.5, 0.25, "Load-bearing and infill masonry", "Uses industrial by-product and can reduce firing emissions.", "Check strength class, water absorption, and supply consistency.", "Recommended for suitable masonry after local approval."),
  alt("aacBlock", "burntClayBrick", "AAC block", "nos", 0.064, 55, 6.7, "Infill and partition walls", "Lightweight, insulating, and fewer joints.", "Needs suitable mortar and finish; moisture detailing required.", "Use for non-load-bearing walls where detailing is suitable."),
  alt("clcBlock", "burntClayBrick", "CLC block", "nos", 0.064, 48, 4.8, "Non-load-bearing walls", "Lightweight and thermally efficient.", "Quality varies by producer.", "Use after checking density and compressive strength."),
  alt("compressedEarthBlock", "burntClayBrick", "Compressed earth block", "nos", 1.1, 7, 0.12, "Low-rise walling", "Low embodied energy and local material potential.", "Needs moisture protection and engineering review.", "Use in suitable low-rise applications."),
  alt("stabilizedEarthBlock", "burntClayBrick", "Stabilized earth block", "nos", 1.1, 7.5, 0.16, "Low-rise walls", "Lower carbon than fired clay masonry.", "Requires stabilization design and weather protection.", "Use after verifying local soil and durability."),
  alt("recycledCoarseAggregate", "naturalCoarseAggregate", "Recycled coarse aggregate", "kg", 1, 0.8, 0.0045, "Non-structural concrete and base layers", "Diverts construction waste and reduces virgin aggregate use.", "Higher water absorption; structural replacement may be limited.", "Use for non-structural or approved replacement ratios."),
  alt("recycledConcreteAggregate", "naturalCoarseAggregate", "Recycled concrete aggregate", "kg", 1, 0.85, 0.005, "Concrete and road base", "Reduces quarrying and reuses demolition waste.", "Quality control and contamination checks required.", "Use where grading and strength tests pass."),
  alt("recycledFineAggregate", "naturalSand", "Recycled fine aggregate", "kg", 1, 0.9, 0.006, "Mortar and concrete after testing", "Reuses processed fines.", "Can affect workability and water demand.", "Use only after grading and mix checks."),
  alt("mSand", "naturalSand", "Manufactured sand (M-sand)", "kg", 1, 1.2, 0.012, "Concrete and plaster", "Reduces river sand extraction.", "Crushing energy can increase CO2e; grading control needed.", "Use where grading and fines are compliant."),
  alt("highRecycledSteel", "conventionalSteel", "High-recycled-content steel", "kg", 1, 68, 1.15, "Reinforcement steel", "Lower embodied carbon when recycled content is verified.", "Certification and grade must be checked.", "Use certified grade such as Fe500D where available."),
  alt("eafSteel", "conventionalSteel", "EAF / recycled-content steel", "kg", 1, 70, 1, "Reinforcement steel", "Can substantially reduce emissions compared with BF-BOF steel.", "Market access and power grid intensity vary.", "Use when grade and mill declarations are verified."),
  alt("reclaimedTimber", "newTimber", "Reclaimed/reused timber", "kg", 1, 75, 0.08, "Interior timber and non-critical joinery", "Avoids new extraction and can carry low additional carbon.", "Needs grading, pest checks, and dimensional suitability.", "Use where reuse quality is documented."),
  alt("certifiedTimber", "newTimber", "Sustainably sourced timber", "kg", 1, 125, 0.22, "Timber elements and joinery", "Improved sourcing assurance.", "Cost and certification availability vary.", "Use certified supply chains where possible."),
  alt("bamboo", "newTimber", "Bamboo where technically suitable", "kg", 1.1, 95, 0.18, "Screens, flooring, light elements", "Fast-renewing material with useful strength-to-weight ratio.", "Durability, detailing, and code acceptance need review.", "Use for technically suitable non-critical elements."),
  alt("recycledAluminium", "conventionalAluminium", "Recycled aluminium", "kg", 1, 260, 1.8, "Frames and facade elements", "Much lower embodied carbon than primary aluminium.", "Verify recycled content and finish requirements.", "Use for profiles where supplier declarations are available."),
  alt("recycledGlass", "conventionalGlass", "High-recycled-content glass", "m2", 1, 900, 12, "Glazing", "Can reduce raw material and furnace impacts.", "Thermal performance and safety specs still govern selection.", "Use where performance specification is satisfied."),
  alt("recycledPavers", "conventionalConcretePaver", "Recycled aggregate pavers", "m2", 1, 620, 14, "External paving", "Uses recycled aggregate and can lower virgin material use.", "Check strength, finish, and water absorption.", "Use for suitable external paved areas."),
  alt("reclaimedAsphalt", "conventionalAsphalt", "Reclaimed asphalt pavement", "m2", 1, 780, 18, "Driveways and road base", "Reuses asphalt and reduces binder demand.", "Requires plant capability and quality control.", "Use where RAP mix design is approved."),
  alt("cdRoadBase", "conventionalConcretePaver", "Recycled C&D aggregate road base", "m2", 1, 430, 8, "Road base and sub-base", "High reuse value for demolition waste.", "Not a finished paver substitute without design changes.", "Use as base layer after geotechnical approval."),
  alt("gypsumBoard", "conventionalGlass", "Recycled-content gypsum board", "m2", 1, 320, 5, "Interior partitions", "Uses recycled gypsum and paper.", "Replaces board area, not glazing; include only in expanded model.", "Track in future fit-out module."),
  alt("celluloseInsulation", "newTimber", "Cellulose insulation", "kg", 1, 80, 0.1, "Insulation cavities", "High recycled paper content.", "Moisture detailing and fire treatment required.", "Use for suitable insulated assemblies."),
  alt("mineralWool", "newTimber", "Mineral wool with recycled content", "kg", 1, 120, 0.65, "Thermal and acoustic insulation", "Fire resistance and recycled mineral content.", "Can be higher carbon than cellulose.", "Use where fire/acoustic performance is required."),
  alt("recycledRoofing", "conventionalConcretePaver", "Recycled-content roofing products", "m2", 1, 700, 13, "Roofing products", "Can reduce virgin material demand.", "Product-specific durability matters.", "Use after checking roof specification.")
];

function alt(id, replaces, name, unit, quantityFactor, price, carbonFactor, application, advantages, limitations, recommendedUse) {
  return {
    id,
    replaces,
    name,
    unit,
    quantityFactor,
    price,
    carbonFactor,
    application,
    advantages,
    limitations,
    recommendedUse,
    technicalNotes: "Potential alternative - verify technical suitability.",
    suitable: true
  };
}

let materials = clone(materialSeed);
let alternatives = clone(alternativeSeed);
let assumptions = clone(defaultAssumptions);
let rooms = [];
let selectedAlternatives = {};
let lastResult = null;

const id = (value) => document.getElementById(value);
const money = (value) => `${"\u20b9"}${Math.round(value).toLocaleString("en-IN")}`;
const number = (value, digits = 0) => Number(value || 0).toLocaleString("en-IN", {
  maximumFractionDigits: digits,
  minimumFractionDigits: digits
});
const pct = (value) => `${number(value, 1)}%`;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

// The calculation model stores lengths in metres, while the assumptions UI
// presents building dimensions in millimetres to match normal construction practice.
const millimetreAssumptions = new Set([
  "beamWidth",
  "beamDepth",
  "columnWidth",
  "columnDepth",
  "slabThickness"
]);

function assumptionValueForDisplay(key, value) {
  return millimetreAssumptions.has(key) ? Number(value) * 1000 : Number(value);
}

function assumptionValueFromDisplay(key, value) {
  return millimetreAssumptions.has(key) ? Number(value) / 1000 : Number(value);
}

function normalizeAssumptions(saved = {}) {
  const normalized = { ...clone(defaultAssumptions), ...(saved || {}) };

  // Migrate saved browser data from versions that stored one square columnSize.
  if (saved.columnWidth == null && Number.isFinite(Number(saved.columnSize))) {
    normalized.columnWidth = Number(saved.columnSize);
  }
  if (saved.columnDepth == null && Number.isFinite(Number(saved.columnSize))) {
    normalized.columnDepth = Number(saved.columnSize);
  }
  delete normalized.columnSize;

  for (const [key, defaultValue] of Object.entries(defaultAssumptions)) {
    const value = Number(normalized[key]);
    if (!Number.isFinite(value) || value < 0) normalized[key] = defaultValue;
    else normalized[key] = value;
  }
  return normalized;
}

function clampInt(value, min, max) {
  return Math.max(min, Math.min(max, Math.round(Number(value) || min)));
}

function readNumber(elementId, options = {}) {
  const element = id(elementId);
  const value = Number(element.value);
  const min = options.min ?? 0;
  const allowZero = options.allowZero ?? false;
  const valid = Number.isFinite(value) && (allowZero ? value >= min : value > min);
  element.classList.toggle("invalid", !valid);
  return { value, valid, label: options.label || elementId };
}

function getMaterial(materialId) {
  return materials.find((material) => material.id === materialId);
}

function getAlternative(alternativeId) {
  return alternatives.find((alternative) => alternative.id === alternativeId);
}

function alternativesFor(materialId) {
  return alternatives.filter((alternative) => alternative.replaces === materialId && alternative.suitable);
}

function calculateRoomArea(room) {
  return room.length * room.width;
}

function calculateWallArea(room, sharedFactor, openingArea) {
  return Math.max(0, 2 * (room.length + room.width) * sharedFactor * room.height - openingArea);
}

function calculateSlabVolume(area, slabThickness) {
  return area * slabThickness;
}

function calculateBeamLength(room, sharedFactor) {
  return 2 * (room.length + room.width) * sharedFactor;
}

function calculateBeamVolume(length, settings) {
  return length * settings.beamWidth * settings.beamDepth;
}

function estimateColumnGrid(rooms, storeys) {
  // The input form does not capture room coordinates. For a transparent
  // preliminary estimate, each storey's rooms are assumed to be arranged
  // sequentially in one row, with front and rear column grid lines.
  // Shared room-boundary intersections are deduplicated by their coordinates.
  const xGrid = new Set();
  let maximumBuildingWidth = 0;

  for (let storey = 1; storey <= storeys; storey += 1) {
    const floorRooms = rooms
      .filter((room) => room.storey === storey)
      .sort((a, b) => a.room - b.room);

    let runningLength = 0;
    xGrid.add((0).toFixed(3));

    for (const room of floorRooms) {
      runningLength += Math.max(0, Number(room.length) || 0);
      xGrid.add(runningLength.toFixed(3));
      maximumBuildingWidth = Math.max(
        maximumBuildingWidth,
        Math.max(0, Number(room.width) || 0)
      );
    }
  }

  const xCoordinates = [...xGrid].map(Number).sort((a, b) => a - b);
  const yCoordinates = [...new Set([0, maximumBuildingWidth].map((value) => Number(value.toFixed(3))))];
  const intersections = new Set();

  for (const x of xCoordinates) {
    for (const y of yCoordinates) {
      intersections.add(`${x.toFixed(3)}|${y.toFixed(3)}`);
    }
  }

  return {
    count: intersections.size,
    xCoordinates,
    yCoordinates,
    intersections: [...intersections]
  };
}

function calculateColumnVolume(columnCount, storeyHeights, settings) {
  const totalHeight = storeyHeights.reduce((sum, height) => sum + height, 0);
  return columnCount * settings.columnWidth * settings.columnDepth * totalHeight;
}

function calculateConcreteVolume(parts) {
  return parts.slabVolume + parts.beamVolume + parts.columnVolume + parts.foundationVolume;
}

function calculateConcreteMix(volume, mix, settings) {
  const totalRatio = mix.cement + mix.sand + mix.aggregate;
  const dryVolume = volume * settings.dryVolumeFactor;
  return {
    cement: (dryVolume * mix.cement / totalRatio) * settings.cementDensity,
    sand: (dryVolume * mix.sand / totalRatio) * settings.sandDensity,
    aggregate: (dryVolume * mix.aggregate / totalRatio) * settings.aggregateDensity
  };
}

function calculateBrickQuantity(wallArea, brick, settings) {
  const effectiveFaceArea = (brick.lengthM + settings.mortarJoint) * (brick.heightM + settings.mortarJoint);
  return wallArea / effectiveFaceArea;
}

function calculatePlasterQuantity(area, thicknessMm, settings) {
  const wetVolume = area * (thicknessMm / 1000);
  const dryVolume = wetVolume * settings.plasterDryFactor;
  const cement = dryVolume / (1 + settings.plasterMixSand) * settings.cementDensity;
  const sand = dryVolume * settings.plasterMixSand / (1 + settings.plasterMixSand) * settings.sandDensity;
  return { wetVolume, dryVolume, cement, sand };
}

function calculateFlooringQuantity(area, thicknessMm, settings) {
  return calculatePlasterQuantity(area, thicknessMm, settings);
}

function calculateSteelQuantity(parts, settings) {
  return parts.slabVolume * settings.slabSteelIntensity
    + parts.beamVolume * settings.beamSteelIntensity
    + parts.columnVolume * settings.columnSteelIntensity
    + parts.foundationVolume * settings.foundationSteelIntensity;
}

function applyWastage(quantity, percentValue) {
  return quantity * (1 + percentValue / 100);
}

function calculateMaterialCost(quantity, price) {
  return quantity * price;
}

function calculateEmbodiedCarbon(quantity, carbonFactor) {
  return quantity * carbonFactor;
}

function calculateAlternativeCost(quantity, alternative) {
  return quantity * alternative.quantityFactor * alternative.price;
}

function calculateCarbonDifference(alternativeCarbon, conventionalCarbon) {
  return alternativeCarbon - conventionalCarbon;
}

function calculateCarbonReductionPercentage(conventionalCarbon, alternativeCarbon) {
  if (!conventionalCarbon) return 0;
  return ((conventionalCarbon - alternativeCarbon) / conventionalCarbon) * 100;
}

function calculateEstimate(input) {
  const storeyHeights = Array.from({ length: input.storeys }, (_, storeyIndex) => {
    const storeyRooms = input.rooms.filter((room) => room.storey === storeyIndex + 1);
    return Math.max(...storeyRooms.map((room) => room.height), 0);
  });

  let slabArea = 0;
  let wallArea = 0;
  let beamLength = 0;
  const openingAreaPerRoom = assumptions.doorArea + assumptions.windowArea;

  for (const room of input.rooms) {
    const sharedFactor = input.roomsPerStorey > 1 ? assumptions.sharedBeamFactor : 1;
    slabArea += calculateRoomArea(room);
    wallArea += calculateWallArea(room, sharedFactor, openingAreaPerRoom);
    beamLength += calculateBeamLength(room, sharedFactor);
  }

  const footprintArea = input.rooms
    .filter((room) => room.storey === 1)
    .reduce((sum, room) => sum + calculateRoomArea(room), 0);

  const slabVolume = calculateSlabVolume(slabArea, assumptions.slabThickness);
  const beamVolume = calculateBeamVolume(beamLength, assumptions);
  const columnGrid = estimateColumnGrid(input.rooms, input.storeys);
  const columnsPerStorey = columnGrid.count;
  const columnVolume = calculateColumnVolume(columnsPerStorey, storeyHeights, assumptions);
  const foundationVolume = footprintArea * assumptions.foundationConcretePerSqm;
  const concreteVolume = calculateConcreteVolume({ slabVolume, beamVolume, columnVolume, foundationVolume });
  const concreteMix = calculateConcreteMix(concreteVolume, input.mix, assumptions);
  const plaster = calculatePlasterQuantity(wallArea * 2, assumptions.plasterThickness, assumptions);
  const flooring = calculateFlooringQuantity(slabArea, input.flooringThickness, assumptions);
  const brickQuantity = calculateBrickQuantity(wallArea, input.brick, assumptions);
  const steelQuantity = calculateSteelQuantity({ slabVolume, beamVolume, columnVolume, foundationVolume }, assumptions);

  const rawQuantities = {
    opc: concreteMix.cement + plaster.cement + flooring.cement,
    naturalSand: concreteMix.sand + plaster.sand + flooring.sand,
    naturalCoarseAggregate: concreteMix.aggregate,
    burntClayBrick: brickQuantity,
    conventionalSteel: steelQuantity,
    newTimber: input.optional.newTimber,
    conventionalAluminium: input.optional.aluminium,
    conventionalGlass: input.optional.glass,
    conventionalConcretePaver: input.optional.paver,
    conventionalAsphalt: input.optional.asphalt
  };

  const finalQuantities = {
    opc: applyWastage(rawQuantities.opc, assumptions.cementWastage),
    naturalSand: applyWastage(rawQuantities.naturalSand, assumptions.sandWastage),
    naturalCoarseAggregate: applyWastage(rawQuantities.naturalCoarseAggregate, assumptions.aggregateWastage),
    burntClayBrick: applyWastage(rawQuantities.burntClayBrick, assumptions.brickWastage),
    conventionalSteel: applyWastage(rawQuantities.conventionalSteel, assumptions.steelWastage),
    newTimber: rawQuantities.newTimber,
    conventionalAluminium: rawQuantities.conventionalAluminium,
    conventionalGlass: rawQuantities.conventionalGlass,
    conventionalConcretePaver: rawQuantities.conventionalConcretePaver,
    conventionalAsphalt: rawQuantities.conventionalAsphalt
  };

  const lineItems = materials
    .map((material) => {
      const calculatedQuantity = rawQuantities[material.id] || 0;
      const quantity = finalQuantities[material.id] || 0;
      const cost = calculateMaterialCost(quantity, material.price);
      const carbon = calculateEmbodiedCarbon(quantity, material.carbonFactor);
      return { material, calculatedQuantity, quantity, cost, carbon };
    })
    .filter((item) => item.quantity > 0.0001 || !item.material.optional);

  const comparison = lineItems.map((item) => {
    const alternativesList = alternativesFor(item.material.id);
    const selectedId = selectedAlternatives[item.material.id] || pickBestAlternative(item, alternativesList)?.id || "";
    selectedAlternatives[item.material.id] = selectedId;
    const selected = selectedId ? getAlternative(selectedId) : null;
    const alternativeQuantity = selected ? item.quantity * selected.quantityFactor : item.quantity;
    const alternativeCost = selected ? calculateAlternativeCost(item.quantity, selected) : item.cost;
    const alternativeCarbon = selected ? calculateEmbodiedCarbon(alternativeQuantity, selected.carbonFactor) : item.carbon;
    const costDifference = alternativeCost - item.cost;
    const carbonDifference = calculateCarbonDifference(alternativeCarbon, item.carbon);
    const carbonReduction = calculateCarbonReductionPercentage(item.carbon, alternativeCarbon);
    const recommendation = classifyRecommendation(item.cost, costDifference, carbonReduction, selected);
    return {
      ...item,
      alternativesList,
      selected,
      alternativeQuantity,
      alternativeCost,
      alternativeCarbon,
      costDifference,
      carbonDifference,
      carbonReduction,
      recommendation
    };
  });

  const totals = comparison.reduce((acc, item) => {
    acc.conventionalCost += item.cost;
    acc.alternativeCost += item.alternativeCost;
    acc.conventionalCarbon += item.carbon;
    acc.alternativeCarbon += item.alternativeCarbon;
    return acc;
  }, {
    conventionalCost: 0,
    alternativeCost: 0,
    conventionalCarbon: 0,
    alternativeCarbon: 0
  });

  totals.costDifference = totals.alternativeCost - totals.conventionalCost;
  totals.carbonDifference = totals.alternativeCarbon - totals.conventionalCarbon;
  totals.carbonReduction = calculateCarbonReductionPercentage(totals.conventionalCarbon, totals.alternativeCarbon);

  return {
    input,
    slabArea,
    wallArea,
    beamLength,
    slabVolume,
    beamVolume,
    columnVolume,
    columnsPerStorey,
    uniqueColumnCount: columnGrid.count,
    columnGrid,
    foundationVolume,
    concreteVolume,
    plaster,
    flooring,
    rawQuantities,
    finalQuantities,
    lineItems,
    comparison,
    totals
  };
}

function pickBestAlternative(item, alternativesList) {
  if (!alternativesList.length) return null;
  const ranked = alternativesList.map((alternative) => {
    const altQuantity = item.quantity * alternative.quantityFactor;
    const altCost = altQuantity * alternative.price;
    const altCarbon = altQuantity * alternative.carbonFactor;
    const reduction = calculateCarbonReductionPercentage(item.carbon, altCarbon);
    const costDelta = altCost - item.cost;
    return { alternative, score: reduction * 3 - Math.max(0, costDelta / Math.max(item.cost, 1) * 35) };
  });
  ranked.sort((a, b) => b.score - a.score);
  return ranked[0].alternative;
}

function classifyRecommendation(conventionalCost, costDifference, carbonReduction, alternative) {
  if (!alternative) {
    return { rank: "grey", label: "Keep conventional", text: "No alternative selected" };
  }
  const costPercent = conventionalCost ? (costDifference / conventionalCost) * 100 : 0;
  if (carbonReduction > 5 && costPercent < -1) {
    return { rank: "green", label: "Recommended", text: "Lower cost and lower CO2e" };
  }
  if (carbonReduction > 5 && costPercent <= 5) {
    return { rank: "blue", label: "Recommended", text: "Similar cost with lower CO2e" };
  }
  if (carbonReduction >= 15 && costPercent > 5) {
    return { rank: "yellow", label: "Consider", text: "Higher cost but significantly lower CO2e" };
  }
  if (carbonReduction < -1 && costPercent > 1) {
    return { rank: "red", label: "Avoid", text: "Higher cost and higher CO2e" };
  }
  return { rank: "grey", label: "Review", text: "No meaningful advantage" };
}

function syncRoomsFromControls() {
  const storeys = clampInt(id("storeys").value, 1, 12);
  const roomsPerStorey = clampInt(id("roomsPerStorey").value, 1, 12);
  id("storeys").value = storeys;
  id("roomsPerStorey").value = roomsPerStorey;
  const nextRooms = [];
  for (let storey = 1; storey <= storeys; storey += 1) {
    for (let room = 1; room <= roomsPerStorey; room += 1) {
      const existing = rooms.find((item) => item.storey === storey && item.room === room);
      nextRooms.push(existing || { storey, room, length: 4, width: 3, height: 3 });
    }
  }
  rooms = nextRooms;
  renderRooms();
  id("roomMetric").textContent = String(rooms.length);
  saveState();
}

function renderRooms() {
  const roomGrid = id("roomGrid");
  roomGrid.innerHTML = rooms.map((room, index) => `
    <article class="room-panel">
      <h3>Storey ${room.storey} - Room ${room.room}</h3>
      <div class="input-grid three">
        ${roomInput(index, "length", "Length")}
        ${roomInput(index, "width", "Width")}
        ${roomInput(index, "height", "Height")}
      </div>
    </article>
  `).join("");

  roomGrid.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => {
      const index = Number(input.dataset.roomIndex);
      const key = input.dataset.roomKey;
      rooms[index][key] = Number(input.value);
      saveState();
    });
  });
}

function roomInput(index, key, label) {
  return `
    <label>
      <span>${label}</span>
      <div class="unit-input">
        <input type="number" min="0.1" step="0.05" value="${rooms[index][key]}" data-room-index="${index}" data-room-key="${key}">
        <span>m</span>
      </div>
    </label>
  `;
}

function renderAssumptions() {
  assumptions = normalizeAssumptions(assumptions);

  id("assumptionGrid").innerHTML = Object.entries(assumptionLabels).map(([key, label]) => {
    const displayValue = assumptionValueForDisplay(key, assumptions[key]);
    return `
      <label>
        <span>${label}</span>
        <input
          type="number"
          step="any"
          min="0"
          value="${displayValue}"
          data-assumption="${key}"
        >
      </label>
    `;
  }).join("");

  id("assumptionGrid").querySelectorAll("input").forEach((input) => {
    const key = input.dataset.assumption;

    input.addEventListener("input", () => {
      if (input.value.trim() === "") return;
      const displayedValue = Number(input.value);
      if (!Number.isFinite(displayedValue) || displayedValue < 0) return;

      assumptions[key] = assumptionValueFromDisplay(key, displayedValue);
      saveState();
      if (lastResult) calculateAndRender();
    });

    input.addEventListener("change", () => {
      if (input.value.trim() === "" || !Number.isFinite(Number(input.value)) || Number(input.value) < 0) {
        input.value = assumptionValueForDisplay(key, assumptions[key]);
      }
    });
  });
}

function renderMaterialRateTable() {
  const body = materials.map((material) => `
    <tr>
      <td class="left">
        <strong>${material.name}</strong><br>
        <span class="helper-text">${material.category}</span>
      </td>
      <td>${material.unit}</td>
      <td><input type="number" min="0" step="any" value="${material.price}" data-material="${material.id}" data-field="price" aria-label="${material.name} price"></td>
      <td><input type="number" min="0" step="any" value="${material.carbonFactor}" data-material="${material.id}" data-field="carbonFactor" aria-label="${material.name} carbon factor"></td>
      <td class="left">${material.source}</td>
      <td>${material.lastUpdated}</td>
    </tr>
  `).join("");

  id("materialRateTable").innerHTML = `
    <thead>
      <tr>
        <th class="left">Material</th>
        <th>Unit</th>
        <th>Price (${materials[0].currency})</th>
        <th>CO2e factor</th>
        <th class="left">Data source</th>
        <th>Last updated</th>
      </tr>
    </thead>
    <tbody>${body}</tbody>
  `;

  id("materialRateTable").querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => {
      const material = getMaterial(input.dataset.material);
      material[input.dataset.field] = Number(input.value);
      saveState();
      if (lastResult) calculateAndRender();
    });
  });
}

function renderAdminAlternativeTable() {
  const body = alternatives.map((alternative) => {
    const replaced = getMaterial(alternative.replaces);
    return `
      <tr>
        <td class="left"><strong>${alternative.name}</strong><br><span class="helper-text">Replaces ${replaced ? replaced.name : alternative.replaces}</span></td>
        <td>${alternative.unit}</td>
        <td><input type="number" min="0" step="any" value="${alternative.quantityFactor}" data-alt="${alternative.id}" data-field="quantityFactor"></td>
        <td><input type="number" min="0" step="any" value="${alternative.price}" data-alt="${alternative.id}" data-field="price"></td>
        <td><input type="number" min="0" step="any" value="${alternative.carbonFactor}" data-alt="${alternative.id}" data-field="carbonFactor"></td>
        <td class="left">${alternative.technicalNotes}</td>
      </tr>
    `;
  }).join("");

  id("adminAlternativeTable").innerHTML = `
    <thead>
      <tr>
        <th class="left">Alternative</th>
        <th>Unit</th>
        <th>Qty factor</th>
        <th>Price</th>
        <th>CO2e factor</th>
        <th class="left">Technical note</th>
      </tr>
    </thead>
    <tbody>${body}</tbody>
  `;

  id("adminAlternativeTable").querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => {
      const alternative = getAlternative(input.dataset.alt);
      alternative[input.dataset.field] = Number(input.value);
      saveState();
      if (lastResult) calculateAndRender();
    });
  });
}

function readInputs() {
  const required = [
    readNumber("storeys", { min: 0, label: "Number of storeys" }),
    readNumber("roomsPerStorey", { min: 0, label: "Rooms per storey" }),
    readNumber("cementRatio", { min: 0, label: "Cement ratio" }),
    readNumber("sandRatio", { min: 0, label: "Sand ratio" }),
    readNumber("aggregateRatio", { min: 0, label: "Aggregate ratio" }),
    readNumber("brickLength", { min: 0, label: "Brick length" }),
    readNumber("brickWidth", { min: 0, label: "Brick width" }),
    readNumber("brickHeight", { min: 0, label: "Brick height" }),
    readNumber("flooringThickness", { min: 0, label: "Flooring thickness" })
  ];

  const nonNegative = [
    readNumber("newTimberQty", { min: 0, allowZero: true, label: "New timber" }),
    readNumber("aluminiumQty", { min: 0, allowZero: true, label: "Aluminium" }),
    readNumber("glassQty", { min: 0, allowZero: true, label: "Glass" }),
    readNumber("paverQty", { min: 0, allowZero: true, label: "Pavers" }),
    readNumber("asphaltQty", { min: 0, allowZero: true, label: "Asphalt" })
  ];

  const roomErrors = [];
  id("roomGrid").querySelectorAll("input").forEach((input) => {
    const valid = Number(input.value) > 0;
    input.classList.toggle("invalid", !valid);
    if (!valid) roomErrors.push("room dimensions");
  });

  const invalid = [...required, ...nonNegative].filter((item) => !item.valid).map((item) => item.label);
  if (roomErrors.length) invalid.push("room dimensions");

  if (invalid.length) {
    return { ok: false, message: `Please correct: ${[...new Set(invalid)].join(", ")}.` };
  }

  return {
    ok: true,
    value: {
      projectName: id("projectName").value.trim() || "Untitled project",
      projectLocation: id("projectLocation").value.trim() || "Not specified",
      storeys: Number(id("storeys").value),
      roomsPerStorey: Number(id("roomsPerStorey").value),
      flooringThickness: Number(id("flooringThickness").value),
      rooms: clone(rooms),
      mix: {
        cement: Number(id("cementRatio").value),
        sand: Number(id("sandRatio").value),
        aggregate: Number(id("aggregateRatio").value)
      },
      brick: {
        lengthM: Number(id("brickLength").value) / 100,
        widthM: Number(id("brickWidth").value) / 100,
        heightM: Number(id("brickHeight").value) / 100
      },
      optional: {
        newTimber: Number(id("newTimberQty").value),
        aluminium: Number(id("aluminiumQty").value),
        glass: Number(id("glassQty").value),
        paver: Number(id("paverQty").value),
        asphalt: Number(id("asphaltQty").value)
      }
    }
  };
}

function calculateAndRender() {
  const input = readInputs();
  const error = id("errorMessage");
  if (!input.ok) {
    error.textContent = input.message;
    return;
  }
  error.textContent = "";
  lastResult = calculateEstimate(input.value);
  renderResults(lastResult);
  saveState();
}

function renderResults(result) {
  id("emptyResults").hidden = true;
  id("resultsContent").hidden = false;
  id("downloadReportButton").disabled = false;
  renderComparisonTable(result);
  renderSummary(result);
  renderBreakdowns(result);
  renderQuantityTable(result);
  renderUsedAssumptions(result);
}

function renderComparisonTable(result) {
  const rows = result.comparison.map((item) => {
    const optionHtml = [
      `<option value="">Keep conventional</option>`,
      ...item.alternativesList.map((alternative) => `<option value="${alternative.id}" ${item.selected && item.selected.id === alternative.id ? "selected" : ""}>${alternative.name}</option>`)
    ].join("");
    return `
      <tr>
        <td class="left"><strong>${item.material.name}</strong><br><span class="helper-text">${item.material.category}</span></td>
        <td class="left">
          <select data-select-alternative="${item.material.id}" aria-label="Alternative for ${item.material.name}">${optionHtml}</select>
          ${item.selected ? `<div class="helper-text">${item.selected.technicalNotes}</div>` : ""}
        </td>
        <td>${number(item.quantity, 1)} ${item.material.unit}</td>
        <td>${number(item.alternativeQuantity, 1)} ${item.selected ? item.selected.unit : item.material.unit}</td>
        <td>${money(item.cost)}</td>
        <td>${money(item.alternativeCost)}</td>
        <td class="${item.costDifference <= 0 ? "positive" : "negative"}">${money(item.costDifference)}</td>
        <td>${number(item.carbon, 1)} kg</td>
        <td>${number(item.alternativeCarbon, 1)} kg</td>
        <td class="${item.carbonDifference <= 0 ? "positive" : "negative"}">${number(item.carbonDifference, 1)} kg</td>
        <td class="${item.carbonReduction >= 0 ? "positive" : "negative"}">${pct(item.carbonReduction)}</td>
        <td class="left">
          <span class="status-pill rank-${item.recommendation.rank}">${item.recommendation.label}</span>
          <div class="helper-text">${item.recommendation.text}</div>
        </td>
      </tr>
    `;
  }).join("");

  id("comparisonTable").innerHTML = `
    <thead>
      <tr>
        <th class="left">General Material</th>
        <th class="left">Suggested Alternative</th>
        <th>General Quantity</th>
        <th>Alternative Quantity</th>
        <th>General Cost</th>
        <th>Alternative Cost</th>
        <th>Cost Difference</th>
        <th>General CO2e</th>
        <th>Alternative CO2e</th>
        <th>CO2e Difference</th>
        <th>CO2e Reduction %</th>
        <th class="left">Recommendation</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  `;

  id("comparisonTable").querySelectorAll("select").forEach((select) => {
    select.addEventListener("change", () => {
      selectedAlternatives[select.dataset.selectAlternative] = select.value;
      calculateAndRender();
    });
  });
}

function renderSummary(result) {
  const { totals } = result;
  id("summaryGrid").innerHTML = `
    <article class="summary-tile">
      <p>Conventional design</p>
      <span>Total material cost</span>
      <strong class="amount">${money(totals.conventionalCost)}</strong>
      <span>Total embodied CO2e</span>
      <strong>${number(totals.conventionalCarbon, 0)} kg</strong>
    </article>
    <article class="summary-tile">
      <p>Sustainable alternative design</p>
      <span>Total material cost</span>
      <strong class="amount">${money(totals.alternativeCost)}</strong>
      <span>Total embodied CO2e</span>
      <strong>${number(totals.alternativeCarbon, 0)} kg</strong>
    </article>
    <article class="summary-tile">
      <p>Overall difference</p>
      <span>Potential cost difference</span>
      <strong class="${totals.costDifference <= 0 ? "positive" : "negative"}">${money(totals.costDifference)}</strong>
      <span>Potential CO2e reduction</span>
      <strong class="${totals.carbonDifference <= 0 ? "positive" : "negative"}">${number(-totals.carbonDifference, 0)} kg (${pct(totals.carbonReduction)})</strong>
      <span class="helper-text">Estimated potential saving/reduction - not guaranteed.</span>
    </article>
  `;
}

function renderBreakdowns(result) {
  const maxCost = Math.max(...result.lineItems.map((item) => item.cost), 1);
  const maxCarbon = Math.max(...result.lineItems.map((item) => item.carbon), 1);
  id("costBreakdown").innerHTML = result.lineItems.map((item) => barRow(item.material.name, item.cost, maxCost, money(item.cost))).join("");
  id("carbonBreakdown").innerHTML = result.lineItems.map((item) => {
    const share = result.totals.conventionalCarbon ? item.carbon / result.totals.conventionalCarbon * 100 : 0;
    return barRow(item.material.name, item.carbon, maxCarbon, `${number(item.carbon, 0)} kg (${pct(share)})`);
  }).join("");
  const top = [...result.lineItems].sort((a, b) => b.carbon - a.carbon)[0];
  id("topCarbonContributor").textContent = top ? `Highest carbon contributor: ${top.material.name}.` : "";
}

function barRow(label, value, max, display) {
  const width = Math.max(3, Math.min(100, value / max * 100));
  return `
    <div class="bar-row">
      <span>${label}</span>
      <span class="bar-track"><span class="bar-fill" style="width: ${width}%"></span></span>
      <strong>${display}</strong>
    </div>
  `;
}

function renderQuantityTable(result) {
  const rows = result.lineItems.map((item) => `
    <tr>
      <td class="left">${item.material.name}</td>
      <td>${number(item.calculatedQuantity, 1)}</td>
      <td>${number(item.quantity, 1)}</td>
      <td>${item.material.unit}</td>
      <td>${money(item.material.price)}</td>
      <td>${money(item.cost)}</td>
      <td>${item.material.carbonFactor}</td>
      <td>${number(item.carbon, 1)} kg</td>
    </tr>
  `).join("");
  id("quantityTable").innerHTML = `
    <thead>
      <tr>
        <th class="left">Material</th>
        <th>Calculated quantity</th>
        <th>Final quantity incl. wastage</th>
        <th>Unit</th>
        <th>Rate</th>
        <th>Estimated cost</th>
        <th>CO2e factor</th>
        <th>Estimated CO2e</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  `;
}

function renderUsedAssumptions(result) {
  const items = [
    `Concrete total: ${number(result.concreteVolume, 2)} m3`,
    `Slab volume: ${number(result.slabVolume, 2)} m3`,
    `Beam volume: ${number(result.beamVolume, 2)} m3`,
    `Column volume: ${number(result.columnVolume, 2)} m3`,
    `Estimated unique column grid intersections: ${number(result.uniqueColumnCount, 0)} (rooms assumed sequentially in one row; shared boundary intersections counted once)`,
    `Standard column dimensions assumed: ${number(assumptions.columnWidth * 1000, 0)} × ${number(assumptions.columnDepth * 1000, 0)} mm; confirm with structural design.`,
    `Foundation volume: ${number(result.foundationVolume, 2)} m3`,
    `Preliminary beam length based on room geometry: ${number(result.beamLength, 1)} m`,
    `Net wall area: ${number(result.wallArea, 1)} m2`,
    `Plaster volume: ${number(result.plaster.wetVolume, 2)} m3`,
    `Flooring bed volume: ${number(result.flooring.wetVolume, 2)} m3`,
    `Steel intensities are estimating assumptions, not reinforcement design.`
  ];
  const assumptionItems = Object.entries(assumptionLabels).map(([key, label]) => {
    const value = assumptionValueForDisplay(key, assumptions[key]);
    const precision = millimetreAssumptions.has(key) ? 0 : 3;
    return `${label}: ${number(value, precision)}`;
  });
  id("usedAssumptions").innerHTML = [...items, ...assumptionItems].map((item) => `<span>${item}</span>`).join("");
}

function resetInputs() {
  id("projectName").value = "Sample residential estimate";
  id("projectLocation").value = "Local market demo";
  id("storeys").value = 2;
  id("roomsPerStorey").value = 2;
  id("cementRatio").value = 1;
  id("sandRatio").value = 1.5;
  id("aggregateRatio").value = 3;
  id("brickLength").value = 19;
  id("brickWidth").value = 9;
  id("brickHeight").value = 9;
  id("flooringThickness").value = 25;
  id("newTimberQty").value = 0;
  id("aluminiumQty").value = 0;
  id("glassQty").value = 0;
  id("paverQty").value = 0;
  id("asphaltQty").value = 0;
  // Reset the main project inputs but preserve any custom advanced assumptions.
  assumptions = normalizeAssumptions(assumptions);
  renderAssumptions();
  rooms = [];
  syncRoomsFromControls();
  lastResult = null;
  id("emptyResults").hidden = false;
  id("resultsContent").hidden = true;
  id("downloadReportButton").disabled = true;
  id("errorMessage").textContent = "";
  saveState();
}

function resetRates() {
  materials = clone(materialSeed);
  alternatives = clone(alternativeSeed);
  selectedAlternatives = {};
  renderMaterialRateTable();
  renderAdminAlternativeTable();
  saveState();
  if (lastResult) calculateAndRender();
}

function copyFirstRoom() {
  if (!rooms.length) return;
  const first = rooms[0];
  rooms = rooms.map((room) => ({
    ...room,
    length: first.length,
    width: first.width,
    height: first.height
  }));
  renderRooms();
  saveState();
}

function openAdminDialog() {
  const dialog = id("adminDialog");
  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

function unlockAdmin() {
  const ok = id("adminCode").value.trim().toUpperCase() === "ECOBUILD";
  id("adminCode").classList.toggle("invalid", !ok);
  id("adminPanel").hidden = !ok;
  if (ok) renderAdminAlternativeTable();
}

function saveState() {
  const state = {
    materials,
    alternatives,
    assumptions,
    rooms,
    selectedAlternatives,
    fields: collectFieldValues()
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("Unable to save state", error);
  }
}

function collectFieldValues() {
  const fieldIds = [
    "projectName", "projectLocation", "storeys", "roomsPerStorey",
    "cementRatio", "sandRatio", "aggregateRatio", "brickLength", "brickWidth", "brickHeight",
    "flooringThickness", "newTimberQty", "aluminiumQty",
    "glassQty", "paverQty", "asphaltQty"
  ];
  return Object.fromEntries(fieldIds.map((fieldId) => [fieldId, id(fieldId).value]));
}

function hydrateFields(fields) {
  if (!fields) return;
  Object.entries(fields).forEach(([fieldId, value]) => {
    const element = id(fieldId);
    if (element) element.value = value;
  });
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const state = JSON.parse(raw);
    materials = state.materials || clone(materialSeed);
    alternatives = state.alternatives || clone(alternativeSeed);
    assumptions = normalizeAssumptions(state.assumptions || {});
    rooms = state.rooms || [];
    selectedAlternatives = state.selectedAlternatives || {};
    hydrateFields(state.fields);
  } catch (error) {
    console.warn("Unable to load saved state", error);
  }
}

function bindEvents() {
  // Update room sections after the user finishes editing either number field.
  ["storeys", "roomsPerStorey"].forEach((fieldId) => {
    const field = id(fieldId);
    field.addEventListener("change", syncRoomsFromControls);
    field.addEventListener("blur", syncRoomsFromControls);
  });
  id("copyFirstRoomButton").addEventListener("click", copyFirstRoom);
  id("calculateButton").addEventListener("click", calculateAndRender);
  id("resetFormButton").addEventListener("click", resetInputs);
  id("resetRatesButton").addEventListener("click", resetRates);
  id("downloadReportButton").addEventListener("click", () => window.print());
  id("openAdminButton").addEventListener("click", openAdminDialog);
  id("unlockAdminButton").addEventListener("click", unlockAdmin);

  document.querySelectorAll("input").forEach((input) => {
    if (!input.closest("#roomGrid") && !input.closest("#assumptionGrid") && !input.closest("#materialRateTable") && !input.closest("#adminAlternativeTable")) {
      input.addEventListener("input", saveState);
    }
  });

  const sections = [...document.querySelectorAll(".section-card, .results-section")];
  const navLinks = [...document.querySelectorAll(".section-nav a")];
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`));
  }, { rootMargin: "-25% 0px -65% 0px", threshold: [0.2, 0.45, 0.7] });
  sections.forEach((section) => observer.observe(section));
}

function init() {
  loadState();
  if (!rooms.length) {
    syncRoomsFromControls();
  } else {
    renderRooms();
    id("roomMetric").textContent = String(rooms.length);
  }
  renderAssumptions();
  renderMaterialRateTable();
  renderAdminAlternativeTable();
  bindEvents();
}

init();
