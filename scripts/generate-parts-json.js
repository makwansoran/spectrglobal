/**
 * Generates data/suspension-parts.json, data/engine-parts.json,
 * data/body-parts.json, and data/small-parts-cleaning.json from the
 * workbook data that was parsed from the supplier spreadsheets.
 *
 * Run: node scripts/generate-parts-json.js
 */
"use strict";

const fs = require("fs");
const path = require("path");

function slug(str) {
  return String(str)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function specs(...pairs) {
  return pairs
    .filter(([, v]) => String(v || "").trim())
    .map(([label, value]) => ({ label, value: String(value).trim() }));
}

// ─── Suspension Parts ────────────────────────────────────────────────────────

const suspensionProducts = [
  // [id, name, type, brand, compatibility, costKr, retailKr, inStock, supplier, specText, application, springRate, dampingForce]
  ["SUS-001","KYB Excel-G Shock Absorber Front","Shock Absorber","KYB","Universal","New",450,562.5,"AutoDoc","OE Design, Comfort Focused","Sedan","15-20","3500","1200"],
  ["SUS-002","Monroe OESpectrum Strut Assembly","Strut","Monroe","VW Golf/Jetta","New",850,1062.5,"AutoDoc","Full Assembly, Front Wheel Drive","Hatchback","18-22","3800","1350"],
  ["SUS-003","Bilstein B4 Shock - Rear","Shock Absorber","Bilstein","BMW 3-Series","New",680,850,"RockAuto","Premium, Performance Tuned","Executive Sedan","20-25","4200","1500"],
  ["SUS-004","Lesjöfors Coil Spring Front","Coil Spring","Lesjöfors","Ford Focus","New",320,400,"AutoDoc","Linear Rate Spring","Compact Car","16-18","2500","980"],
  ["SUS-005","TRW Ball Joint Assembly","Ball Joint","TRW","Universal","New",180,225,"RockAuto","Tapered Design","Universal","12-15","2000","850"],
  ["SUS-006","Lemförder Control Arm","Control Arm","Lemförder","Mercedes C-Class","New",520,650,"AutoDoc","Reinforced Steel","SUV","22-28","4500","1800"],
  ["SUS-007","Hutchinson Suspension Bush Kit","Suspension Bushings","Hutchinson","Peugeot","New",280,350,"AutoDoc","Rubber-Metal, Vibration Damping","All Models","8-12","1500","600"],
  ["SUS-008","Sachs Strut Top Mount","Strut Mount","Sachs","Opel","New",150,187.5,"RockAuto","Reinforced, OE Equivalent","MPV","15-18","3000","1100"],
  ["SUS-009","Meyle Drag Link","Drag Link","Meyle","Ford Transit","New",420,525,"AutoDoc","Heavy Duty Steel","Commercial Vehicle","25-30","5000","2000"],
  ["SUS-010","Moog Wheel Hub Assembly","Hub Assembly","Moog","Audi A4","New",750,937.5,"RockAuto","Sealed, Pre-Greased","Mid-Size Sedan","16-20","3200","1250"],
  ["SUS-011","Vibracoustic Engine Mount","Engine Mount","Vibracoustic","VW Passat","New",380,475,"AutoDoc","Hydraulic, Sound Insulation","Transverse Engine","10-15","2800","900"],
  ["SUS-012","Boge Shock Absorber Rear - Pair","Shock Absorber","Boge","Hyundai i30","New",520,650,"AutoDoc","Twin Tube, OE Quality","Compact SUV","18-22","3600","1400"],
  ["SUS-013","SKF Wheel Bearing Kit","Wheel Bearing","SKF","Universal","New",280,350,"RockAuto","Angular Contact, 40mm ID","Universal","20-25","3000","1100"],
  ["SUS-014","Koni Sport Adjustable Damper","Damper","Koni","Audi S4","New",1200,1500,"SpecialistSupply","Adjustable Damping (16 clicks)","Performance Car","30-35","6000","2200"],
  ["SUS-015","ZF Lenkstoßdämpfer Steering Damper","Steering Damper","ZF","BMW 5-Series","New",890,1112.5,"AutoDoc","Rotary Type, OE Spec","Luxury Sedan","12-16","3500","1300"],
];

const suspensionData = suspensionProducts.map(
  ([sku, name, type, brand, compat, condition, costKr, retailKr, supplier, specText, application, springRate, dampingForce]) => ({
    id: slug(name),
    name,
    category: "Suspension",
    sku,
    price: retailKr,
    stock: 10,
    description: `${type} - ${brand} - ${compat}`,
    image_url: "",
    article_number: sku,
    ean_code: "",
    delivery_time: "2-5 days",
    features: [specText, `Application: ${application}`, `Spring rate: ${springRate} N/mm`, `Damping force: ${dampingForce} N`].filter(Boolean),
    reviews: [],
    specifications: specs(
      ["Brand", brand],
      ["Category", "Suspension"],
      ["Product type", type],
      ["Compatibility", compat],
      ["Condition", condition],
      ["Specifications", specText],
      ["Application", application],
      ["Spring rate (N/mm)", springRate],
      ["Damping force (N)", dampingForce],
      ["Supplier", supplier],
      ["Supplier link", "https://www.autodoc.no/suspension"]
    ),
    vehicles: [],
    active: true,
  })
);

// ─── Engine Parts ────────────────────────────────────────────────────────────

const engineProducts = [
  // [sku, name, type, brand, engineType, costKr, retailKr, supplier, specText, engineApps, material, tempRange, durability]
  ["ENG-001","Elring Head Gasket Set","Gasket","Elring","VW 1.9 TDI",280,350,"AutoDoc","Complete Gasket Set, 1.9L Diesel","VW Passat, Golf, Jetta","Fiber Composite","200-250°C","80,000 km"],
  ["ENG-002","Kolbenschmidt Piston Ring Set","Piston Ring","Kolbenschmidt","BMW N52",420,525,"AutoDoc","Piston Rings 83mm bore","BMW 2.0L N52","Steel","300-350°C","100,000 km"],
  ["ENG-003","Goetze Cylinder Head Gasket","Head Gasket","Goetze","Mercedes M270",380,475,"RockAuto","Multilayer Steel, OEM Spec","Mercedes 1.6L","Steel+Copper","250-280°C","120,000 km"],
  ["ENG-004","Mahle Piston Assembly","Piston","Mahle","Ford EcoBoost",650,812.5,"AutoDoc","Complete Piston + Pin Assembly","Ford 1.5L EcoBoost","Aluminum","280-320°C","150,000 km"],
  ["ENG-005","SKF Main Bearing Set","Bearing","SKF","Audi 2.0 TFSI",520,650,"RockAuto","Main Bearing Set, Std/+0.25","Audi 2.0L TFSI","Copper-Lead","200-240°C","120,000 km"],
  ["ENG-006","INA Rod Bearing Kit","Bearing","INA","Opel 1.6",280,350,"AutoDoc","Rod Bearing Kit, Precision Fit","Opel 1.6L","Copper-Tin","180-220°C","100,000 km"],
  ["ENG-007","Continental Timing Belt","Timing Belt","Continental","VW Passat",450,562.5,"AutoDoc","118 teeth, OE Replacement","VW Passat 1.8T","Rubber+Steel","100-120°C","80,000 km"],
  ["ENG-008","Gates Timing Belt Tensioner","Timing Tensioner","Gates","Ford Focus",180,225,"RockAuto","Tensioner Assembly, Sealed Bearing","Ford Focus 2.0L","Aluminum","80-100°C","60,000 km"],
  ["ENG-009","Liqui Moly Engine Flush 300ml","Engine Cleaner","Liqui Moly","All Gasoline",120,150,"AutoDoc","Detergent Formula, 300ml","Gasoline Engines","Synthetic Oil","-20 to 100°C","Single Use"],
  ["ENG-010","Motorcraft Valve Cover Gasket","Valve Cover Gasket","Motorcraft","Ford EcoSport",95,118.75,"AutoDoc","Cork+Rubber, OE Quality","Ford EcoSport 1.5L","Cork","120-140°C","120,000 km"],
  ["ENG-011","Viton Oil Seal Kit","Oil Seal","Viton","General Purpose",140,175,"RockAuto","Viton FKM, High Temp","Various Applications","Viton Rubber","150-200°C","80,000 km"],
  ["ENG-012","FEBI Bilstein Exhaust Manifold Gasket","Exhaust Gasket","FEBI","Audi A4",75,93.75,"AutoDoc","Soft Fiber, Pre-Formed","Audi A4 2.0L","Fiber","400-600°C","100,000 km"],
  ["ENG-013","Bosch Spark Plug Set (4)","Spark Plugs","Bosch","VW Golf",185,231.25,"AutoDoc","Gap 1.1mm, Heat Range: Hot","VW Golf 1.4L","Platinum","300-400°C","30,000 km"],
  ["ENG-014","NGK Glow Plug Heater (5 units)","Glow Plugs","NGK","VW 1.9 TDI",320,400,"RockAuto","11V, 5 piece set","VW Diesel 1.9L","Ceramic","900-1200°C","60,000 km"],
  ["ENG-015","Pierburg Fuel Injector Seal","Injector Seal","Pierburg","VW 1.6 FSI",240,300,"AutoDoc","FKM Viton, High Pressure Seal","VW FSI Engines","Viton","150-200°C","80,000 km"],
  ["ENG-016","Hayden Engine Coolant Temperature Sensor","Temp Sensor","Hayden","BMW 3-Series",185,231.25,"AutoDoc","NTC Thermistor, -40 to +130°C","BMW 3-Series","Ceramic","-40 to 130°C","120,000 km"],
  ["ENG-017","Sachs Damper Pulley","Crankshaft Damper","Sachs","Mercedes C200",380,475,"RockAuto","Elastomer Damper, Vibration Control","Mercedes 2.0L","Rubber+Steel","80-120°C","150,000 km"],
  ["ENG-018","Swag Intake Manifold Gasket","Intake Gasket","Swag","Opel Vectra",65,81.25,"AutoDoc","Fiber Composite, Pre-Formed","Opel 1.4L","Fiber","150-180°C","100,000 km"],
];

const engineData = engineProducts.map(
  ([sku, name, type, brand, engineType, costKr, retailKr, supplier, specText, engineApps, material, tempRange, durability]) => ({
    id: slug(name),
    name,
    category: "Engine Parts",
    sku,
    price: retailKr,
    stock: 10,
    description: `${type} - ${brand} - ${engineType}`,
    image_url: "",
    article_number: sku,
    ean_code: "",
    delivery_time: "2-5 days",
    features: [specText, `Engine applications: ${engineApps}`, `Material: ${material}`, `Temperature rating: ${tempRange}`].filter(Boolean),
    reviews: [],
    specifications: specs(
      ["Brand", brand],
      ["Category", "Engine Parts"],
      ["Product type", type],
      ["Engine type", engineType],
      ["Specifications", specText],
      ["Engine applications", engineApps],
      ["Material", material],
      ["Temperature rating", tempRange],
      ["Durability", durability],
      ["Supplier", supplier],
      ["Supplier link", "https://www.autodoc.no/engine"]
    ),
    vehicles: [],
    active: true,
  })
);

// ─── Body Parts ──────────────────────────────────────────────────────────────

const bodyProducts = [
  // [sku, name, type, brand, vehicleModel, costKr, retailKr, supplier, material, colorFinish, dimensions, installHrs]
  ["BODY-001","Front Fender Panel - Left","Fender","Aftermarket","VW Golf VI",850,1062.5,"AutoDoc","Steel","Black","1700 x 800 x 50 mm",2.5],
  ["BODY-002","Rear Door Assembly Complete","Door","OEM","BMW 3-Series",2400,3000,"CarParts","Steel with Glass","Black","2050 x 950 x 100 mm",4],
  ["BODY-003","Side View Mirror - Driver","Mirror","Aftermarket","Ford Focus",380,475,"AutoDoc","Plastic + Glass","Chrome","350 x 280 x 150 mm",1],
  ["BODY-004","Door Handle Interior Chrome","Handle","Aftermarket","VW Passat",95,118.75,"AutoDoc","Plastic","Chrome","120 x 50 x 30 mm",0.5],
  ["BODY-005","Weatherstrip Seal Kit Door","Weatherstrip","OEM","Universal",240,300,"AutoDoc","Rubber","Black","300 m total",3],
  ["BODY-006","Hood Panel Assembly - Aluminum","Hood","Aftermarket","Audi A4",1200,1500,"CarParts","Aluminum","Silver","1600 x 900 x 40 mm",1.5],
  ["BODY-007","Trunk/Boot Lid with Hinge","Trunk Lid","OEM","Mercedes C200",1800,2250,"CarParts","Steel","Black","1800 x 550 x 80 mm",2],
  ["BODY-008","Window Regulator Motor - Front","Window Motor","Aftermarket","Opel Corsa",280,350,"AutoDoc","Plastic Motor","Black","280 x 200 x 100 mm",1.5],
  ["BODY-009","Bumper Cover Front - Black","Bumper","Aftermarket","Ford Fiesta",420,525,"AutoDoc","Plastic","Black","1800 x 400 x 100 mm",1],
  ["BODY-010","Door Trim Panel Set (4 pieces)","Trim Panel","OEM","BMW 5-Series",680,850,"CarParts","Plastic","Leather/Alcantara","4 panels assorted",3],
  ["BODY-011","Roof Rack Crossbars - Silver","Roof Rack","Aftermarket","VW Tiguan",520,650,"AutoDoc","Aluminum","Silver/Black","1600 x 100 x 80 mm",1.5],
  ["BODY-012","Wing Mirror Glass Heated","Mirror Glass","Aftermarket","Audi A6",180,225,"AutoDoc","Glass + Heating","Tinted","350 x 280 x 50 mm",1],
  ["BODY-013","Windshield Trim Molding","Trim","OEM","Mercedes GLC",240,300,"CarParts","Plastic/Chrome","Chrome","1800 x 50 x 30 mm",1],
  ["BODY-014","Door Window Seal Rubber Kit","Rubber Seal","OEM","Universal",120,150,"AutoDoc","Rubber","Black","4 m total",1.5],
  ["BODY-015","Grille Front Honeycomb Pattern","Grille","Aftermarket","BMW 3-Series",280,350,"AutoDoc","Plastic","Chrome/Black","850 x 350 x 80 mm",1.5],
  ["BODY-016","Fender Flare Extension Kit (4)","Fender Flare","Aftermarket","Ford Ranger",450,562.5,"CarParts","Rubber","Black","4 pieces, 900 mm each",2.5],
  ["BODY-017","Chrome Door Handle Trim Ring","Handle Ring","Aftermarket","Audi A3",60,75,"AutoDoc","Chrome Plated","Chrome","120 x 80 x 20 mm",0.25],
  ["BODY-018","Tailgate Handle Assembly","Tailgate Handle","OEM","Ford Transit",280,350,"CarParts","Plastic","Black","280 x 180 x 100 mm",1.5],
  ["BODY-019","Side Molding Strip Adhesive","Molding","Aftermarket","Universal",85,106.25,"AutoDoc","Rubber + Adhesive","Black","2000 x 20 mm",0.5],
  ["BODY-020","License Plate Light Housing","Light Housing","OEM","VW Golf",75,93.75,"AutoDoc","Plastic","Black/Clear","140 x 80 x 50 mm",0.5],
];

const bodyData = bodyProducts.map(
  ([sku, name, type, brand, vehicleModel, costKr, retailKr, supplier, material, colorFinish, dimensions, installHrs]) => ({
    id: slug(name),
    name,
    category: "Body Parts",
    sku,
    price: retailKr,
    stock: 10,
    description: `${type} - ${brand} - ${vehicleModel}`,
    image_url: "",
    article_number: sku,
    ean_code: "",
    delivery_time: "2-5 days",
    features: [`Material: ${material}`, `Color/Finish: ${colorFinish}`, `Dimensions: ${dimensions}`, `Install time: ${installHrs} hrs`].filter(Boolean),
    reviews: [],
    specifications: specs(
      ["Brand", brand],
      ["Category", "Body Parts"],
      ["Product type", type],
      ["Vehicle model", vehicleModel],
      ["Material", material],
      ["Color/Finish", colorFinish],
      ["Dimensions", dimensions],
      ["Installation time", `${installHrs} hrs`],
      ["OEM equivalent", "Yes"],
      ["Supplier", supplier],
      ["Supplier link", "https://www.autodoc.no/body"]
    ),
    vehicles: [],
    active: true,
  })
);

// ─── Small Parts & Cleaning ──────────────────────────────────────────────────

// Fasteners & Hardware (25 products)
const fasteners = [
  ["Hex Head Bolt M6","Bolt","M6x20mm","Steel Zn","50 pcs","DIN 933","Engine/Chassis"],
  ["Hex Head Bolt M8","Bolt","M8x30mm","Steel Zn","50 pcs","DIN 933","General Assembly"],
  ["Hex Head Bolt M10","Bolt","M10x40mm","Steel Zn","25 pcs","DIN 933","Heavy Duty"],
  ["Carriage Bolt","Bolt","M6-M10","Steel Zn","50 pcs","DIN 603","Panels/Brackets"],
  ["Stainless Bolt Set","Bolt","Mixed M5-M10","Stainless","100 pcs","A2","Corrosion Resistant"],
  ["Phillips Head Screw","Screw","M3-M6","Steel Zn","200 pcs","DIN 7985","Trim/Plastic"],
  ["Pozidriv Screw","Screw","M3-M6","Steel Zn","200 pcs","DIN 7962","Better Grip"],
  ["Wood Screw Assortment","Screw","3.5-6.0mm","Steel Zn","150 pcs","DIN 97","Body Panels"],
  ["Self-Tapping Screw","Screw","M4-M5","Steel Zn","100 pcs","DIN 7971","Plastic/Thin Metal"],
  ["Stainless Screw Set","Screw","M3-M5","Stainless","150 pcs","A2","Exterior"],
  ["Hex Nut M6","Nut","M6","Steel Zn","100 pcs","DIN 934","Engine/Chassis"],
  ["Hex Nut M8","Nut","M8","Steel Zn","50 pcs","DIN 934","General Assembly"],
  ["Hex Nut M10","Nut","M10","Steel Zn","50 pcs","DIN 934","Heavy Duty"],
  ["Nylon Insert Lock Nut","Nut","M6-M10","Steel/Nylon","50 pcs","DIN 985","Vibration Resistant"],
  ["Stainless Nut Set","Nut","M5-M10","Stainless","100 pcs","A2","Corrosion Resistant"],
  ["Flat Washer M6","Washer","M6","Steel Zn","100 pcs","DIN 125","Bolt/Screw"],
  ["Flat Washer M8","Washer","M8","Steel Zn","100 pcs","DIN 125","General Use"],
  ["Spring Lock Washer","Washer","M6-M10","Steel Zn","100 pcs","DIN 127","Anti-Vibration"],
  ["Rubber Washer Set","Washer","M4-M8","Rubber","50 pcs","NBR","Sealing/Sound"],
  ["Stainless Washer","Washer","M6-M10","Stainless","100 pcs","A2","Exterior"],
  ["Cable Clip","Clip","Various","Plastic/Metal","20 pcs","Generic","Wiring"],
  ["Spring Clip Assortment","Clip","Various","Steel Zn","30 pcs","DIN 315","Fastening"],
  ["Hose Clamp Small","Clamp","6-16mm","Stainless","10 pcs","Various","Hoses/Tubes"],
  ["Wire Retainer Clip","Clip","3-5mm","Steel","20 pcs","Generic","Trim/Panels"],
  ["Spring Return Clip","Clip","Various","Steel Zn","15 pcs","DIN 666","Panels"],
].map(([name, type, size, material, qty, brand, application]) => ({
  id: "fastener-" + slug(name),
  name,
  category: "Fasteners & Hardware",
  sku: "FAST-" + slug(name).toUpperCase().slice(0, 24),
  price: 0,
  stock: 100,
  description: `${type} - ${size} - ${material}`,
  image_url: "",
  article_number: "FAST-" + slug(name).toUpperCase().slice(0, 24),
  ean_code: "",
  delivery_time: "2-5 days",
  features: [`Size: ${size}`, `Material: ${material}`, `Package: ${qty}`, `Application: ${application}`],
  reviews: [],
  specifications: specs(
    ["Brand/Standard", brand],
    ["Category", "Fasteners & Hardware"],
    ["Product type", type],
    ["Size/Spec", size],
    ["Material", material],
    ["Package quantity", qty],
    ["Application", application],
    ["Supplier link", "https://www.autodoc.no/car-parts/fasteners"]
  ),
  vehicles: [],
  active: true,
}));

// Cleaning Products (22 products)
const cleaningProducts = [
  ["Car Wash Shampoo","Exterior Cleaner","500ml","20-30 cars","ADBL","Body/Paint","pH Neutral"],
  ["Premium Car Shampoo","Exterior Cleaner","1L","30-40 cars","Meguiars","Body/Paint","Wax Safe"],
  ["Foaming Car Wash","Foam Cleaner","500ml","15-20 cars","Turtle Wax","Body/Paint","Thick Foam"],
  ["Waterless Wash","No-Water Cleaner","500ml","10-15 cars","Chemical Guys","Quick Clean","Dry Clean"],
  ["Upholstery Cleaner","Interior Cleaner","400ml","50-100 applications","Turtle Wax","Fabric/Carpet","Stain Removal"],
  ["Leather Conditioner","Leather Care","300ml","20-30 applications","Colourlock","Leather Seats","Protection"],
  ["Plastic Trim Restorer","Trim Cleaner","300ml","30-50 applications","Sonax","Plastics/Rubber","UV Protection"],
  ["Dashboard Cleaner","Interior Cleaner","500ml","40-60 applications","Meguiars","Dashboard","Matte Finish"],
  ["Glass Cleaner","Window Cleaner","500ml","30-40 applications","Turtle Wax","Windows/Glass","Streak Free"],
  ["Odor Eliminator","Air Freshener","150ml","Up to 30 days","Odorgon","Interior","Long Lasting"],
  ["Engine Degreaser","Engine Cleaner","500ml","1-2 engines","Liqui Moly","Engine Bay","Biodegradable"],
  ["Undercarriage Cleaner","Underbody Wash","1L","1 vehicle","Shell","Undercarriage","Rust Protection"],
  ["Wheel Cleaner Spray","Wheel Cleaner","500ml","20-30 wheels","Sonax","Wheels/Rims","Non-Corrosive"],
  ["Tire Shine","Tire Dressing","500ml","30-50 tires","Chemical Guys","Tires","Wet Look"],
  ["Car Wax Liquid","Protective Wax","500ml","4-6 applications","Meguiars","Paint Protection","Water Repellent"],
  ["Ceramic Coating","Nano Coating","50ml","1-2 applications","Gyeon","Paint Protection","9H Hardness"],
  ["Polish & Cut","Paint Polish","500ml","2-4 applications","Turtle Wax","Paint","Swirl Removal"],
  ["Glass Sealant","Glass Coating","100ml","6-8 applications","Chemical Guys","Windows/Glass","Water Beading"],
  ["Brake Fluid Cleaner","System Cleaner","300ml","1-2 vehicles","Pentosin","Brake System","Residue Free"],
  ["Fuel Injector Cleaner","Fuel Additive","200ml","Per tank","Liqui Moly","Fuel System","Performance"],
  ["A/C Conditioner Cleaner","HVAC Cleaner","150ml","1 vehicle","Bosch","AC System","Odor Control"],
  ["Windshield Washer Fluid","Cleaning Fluid","2L","Multiple uses","Comma","Windshield","All Season"],
].map(([name, type, container, coverage, brand, application, feature]) => ({
  id: "cleaning-" + slug(name),
  name,
  category: "Car Care & Cleaning",
  sku: "CLEAN-" + slug(name).toUpperCase().slice(0, 22),
  price: 0,
  stock: 50,
  description: `${type} - ${container} - ${application}`,
  image_url: "",
  article_number: "CLEAN-" + slug(name).toUpperCase().slice(0, 22),
  ean_code: "",
  delivery_time: "2-5 days",
  features: [`${feature}`, `Container: ${container}`, `Coverage: ${coverage}`, `Application: ${application}`],
  reviews: [],
  specifications: specs(
    ["Brand", brand],
    ["Category", "Car Care & Cleaning"],
    ["Product type", type],
    ["Container size", container],
    ["Coverage", coverage],
    ["Application", application],
    ["Key feature", feature],
    ["Supplier link", "https://www.autodoc.no/car-care"]
  ),
  vehicles: [],
  active: true,
}));

// Small Parts & Accessories (18 products)
const smallParts = [
  ["V-Belt Kit","Belts","Serpentine Belt","Various","Dayco","All Vehicles","Engine Drive"],
  ["Hose Assortment","Hoses","Coolant Hoses","6-16mm","Various","All Vehicles","Cooling System"],
  ["Radiator Hose","Hoses","Upper/Lower","Various","Gates","All Vehicles","Coolant Flow"],
  ["Gasket Set","Gaskets","Head Gasket","Various","Elring","Various Models","Engine Sealing"],
  ["O-Ring Assortment","Seals","Rubber Seals","50-100 pcs","Viton","All Vehicles","Fluid Sealing"],
  ["Valve Cover Gasket","Gaskets","Rubber/Cork","Various","Genuine","Various Models","Oil Sealing"],
  ["Wire Connectors","Connectors","Crimp Terminal","100 pcs","AMP","All Vehicles","Electrical"],
  ["Spark Plug Socket","Tools","Socket Set","M14-M18","Various","All Vehicles","Maintenance"],
  ["Battery Terminal Covers","Covers","Rubber/Plastic","Pair","Various","All Vehicles","Protection"],
  ["Detail Brush Set","Tools","Soft Bristle","3-5 pcs","Chemical Guys","All Vehicles","Detailing"],
  ["Microfiber Towel","Towels","Microfiber","5 pcs","Turtle Wax","All Vehicles","Cleaning"],
  ["Applicator Pads","Tools","Foam Pads","5 pcs","Gyeon","All Vehicles","Coating Application"],
  ["Air Freshener","Fragrance","Hanging/Clip","1 pc","Odorgon","All Vehicles","Interior Scent"],
  ["Cabin Air Vent Clip","Clips","Plastic Clip","1 pc","Generic","All Vehicles","Vent Mounting"],
  ["Air Filter Frame","Frames","Plastic","Various","Generic","All Vehicles","Filter Support"],
  ["Car Cover Small","Covers","Protective Cover","1 pc","CARSUN","All Vehicles","Storage"],
  ["Door Edge Guard","Guards","Rubber Guard","4 pcs","3M","All Vehicles","Door Protection"],
  ["Floor Mats","Mats","Rubber/Nylon","4 pcs","WeatherTech","All Vehicles","Interior Protection"],
].map(([name, category, type, size, brand, vehicleType, purpose]) => ({
  id: "small-" + slug(name),
  name,
  category: "Small Parts & Accessories",
  sku: "SML-" + slug(name).toUpperCase().slice(0, 24),
  price: 0,
  stock: 30,
  description: `${type} - ${brand} - ${purpose}`,
  image_url: "",
  article_number: "SML-" + slug(name).toUpperCase().slice(0, 24),
  ean_code: "",
  delivery_time: "2-5 days",
  features: [`${purpose}`, `Type: ${type}`, `Size/Qty: ${size}`, `Vehicle type: ${vehicleType}`],
  reviews: [],
  specifications: specs(
    ["Brand", brand],
    ["Category", "Small Parts & Accessories"],
    ["Product type", type],
    ["Size/Quantity", size],
    ["Vehicle type", vehicleType],
    ["Purpose", purpose],
    ["Supplier link", "https://www.autodoc.no/car-parts"]
  ),
  vehicles: [],
  active: true,
}));

// ─── Write files ─────────────────────────────────────────────────────────────

const dataDir = path.join(__dirname, "..", "data");

function writeData(filename, records) {
  const out = path.join(dataDir, filename);
  fs.writeFileSync(out, JSON.stringify(records, null, 2) + "\n");
  console.log(`Wrote ${records.length} products → ${filename}`);
}

writeData("suspension-parts.json", suspensionData);
writeData("engine-parts.json", engineData);
writeData("body-parts.json", bodyData);
writeData("small-parts-cleaning.json", [...fasteners, ...cleaningProducts, ...smallParts]);
