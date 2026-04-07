const COUNTRIES = [
  {
    id:"japan",name:"Japan",nameLocal:"日本",flag:"🇯🇵",continent:"asia",
    capital:"Tokyo",population:"125M",area:"377,975 km²",language:"Japanese",
    subtitle:"Land of the Rising Sun",
    image:"https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
    heroImage:"https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80",
    tags:["Volcanic Islands","Cherry Blossoms","Ancient Temples"],
    description:"Japan is an archipelago of 6,852 islands stretching along the Pacific coast of East Asia. From the snow-capped peak of Mount Fuji to the subtropical beaches of Okinawa, Japan offers extraordinary geographic diversity. The country sits on the Pacific Ring of Fire, creating dramatic volcanic landscapes, natural hot springs, and frequent seismic activity that has shaped both the land and its culture.",
    geography:"Japan's terrain is predominantly mountainous, with about 73% of the country covered by mountains. The Japanese Alps run through the center of Honshu, the largest island, creating a dramatic spine of peaks exceeding 3,000 meters. Coastal plains host the major population centers, while dense forests cover the mountainous interior.",
    landmarks:[
      {icon:"🗻",name:"Mount Fuji",desc:"Iconic 3,776m stratovolcano and UNESCO World Heritage Site"},
      {icon:"⛩️",name:"Fushimi Inari Shrine",desc:"Thousands of vermillion torii gates in Kyoto"},
      {icon:"🏯",name:"Himeji Castle",desc:"Finest surviving example of Japanese castle architecture"},
      {icon:"🌸",name:"Yoshino Mountain",desc:"30,000 cherry trees creating spectacular spring displays"}
    ]
  },
  {
    id:"iceland",name:"Iceland",nameLocal:"Ísland",flag:"🇮🇸",continent:"europe",
    capital:"Reykjavik",population:"376K",area:"103,000 km²",language:"Icelandic",
    subtitle:"Land of Fire and Ice",
    image:"https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800&q=80",
    heroImage:"https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=1200&q=80",
    tags:["Glaciers","Geysers","Northern Lights"],
    description:"Iceland sits on the Mid-Atlantic Ridge where the North American and Eurasian tectonic plates diverge, creating one of Earth's most geologically active landscapes. This Nordic island nation features an otherworldly terrain of glaciers, volcanoes, geysers, and black sand beaches that feels like stepping onto another planet.",
    geography:"About 11% of Iceland is covered by glaciers, including Vatnajökull — Europe's largest ice cap. The highland interior is an uninhabited volcanic desert, while the coastline features dramatic fjords carved by ancient glaciers. Geothermal activity powers most of the country's energy needs.",
    landmarks:[
      {icon:"💎",name:"Jökulsárlón Glacier Lagoon",desc:"Stunning glacial lake with floating icebergs"},
      {icon:"🌋",name:"Eyjafjallajökull",desc:"Infamous glacier-capped volcano"},
      {icon:"💨",name:"Geysir Geothermal Area",desc:"Original geyser that gave all geysers their name"},
      {icon:"🌊",name:"Reynisfjara Black Sand Beach",desc:"Dramatic basalt columns and roaring Atlantic waves"}
    ]
  },
  {
    id:"brazil",name:"Brazil",nameLocal:"Brasil",flag:"🇧🇷",continent:"americas",
    capital:"Brasília",population:"215M",area:"8,515,767 km²",language:"Portuguese",
    subtitle:"The Amazon's Heart",
    image:"https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80",
    heroImage:"https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1200&q=80",
    tags:["Amazon Rainforest","Waterfalls","Coastal Beaches"],
    description:"Brazil encompasses nearly half of South America, containing the majority of the Amazon Rainforest — the world's largest tropical forest and the most biodiverse place on Earth. From the thundering Iguaçu Falls to the pristine beaches stretching over 7,000 km of coastline, Brazil's landscapes are as vast as they are varied.",
    geography:"The Amazon Basin dominates the north, while the Brazilian Highlands create a vast plateau in the central and southern regions. The Pantanal — the world's largest tropical wetland — sits in the west. The Atlantic Forest, one of the most threatened biomes on Earth, clings to the eastern coastline.",
    landmarks:[
      {icon:"🌳",name:"Amazon Rainforest",desc:"5.5 million km² of the world's most biodiverse ecosystem"},
      {icon:"💧",name:"Iguaçu Falls",desc:"275 waterfalls spanning nearly 3 km of cliff face"},
      {icon:"⛰️",name:"Sugarloaf Mountain",desc:"Iconic granite peak rising from Rio's harbor"},
      {icon:"🏖️",name:"Fernando de Noronha",desc:"Volcanic archipelago with pristine marine life"}
    ]
  },
  {
    id:"norway",name:"Norway",nameLocal:"Norge",flag:"🇳🇴",continent:"europe",
    capital:"Oslo",population:"5.4M",area:"385,207 km²",language:"Norwegian",
    subtitle:"Kingdom of Fjords",
    image:"https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&q=80",
    heroImage:"https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=1200&q=80",
    tags:["Fjords","Midnight Sun","Arctic Wilderness"],
    description:"Norway's western coastline is carved by deep fjords that penetrate far inland, creating some of the most dramatic scenery on Earth. Stretching from temperate southern coasts to Arctic territories above the polar circle, Norway offers midnight sun in summer and aurora borealis in winter.",
    geography:"The Scandinavian Mountains form Norway's spine, with glacially carved valleys and fjords defining the western coast. The coastline, if all fjords and islands are measured, stretches over 100,000 km. Northern Norway extends well above the Arctic Circle, encompassing the archipelago of Svalbard.",
    landmarks:[
      {icon:"🏔️",name:"Geirangerfjord",desc:"UNESCO fjord with 250m-high waterfalls"},
      {icon:"🪨",name:"Trolltunga",desc:"Dramatic cliff jutting 700m above lake Ringedalsvatnet"},
      {icon:"🌌",name:"Lofoten Islands",desc:"Dramatic peaks rising from the Arctic sea"},
      {icon:"❄️",name:"Svalbard",desc:"Arctic archipelago home to polar bears and glaciers"}
    ]
  },
  {
    id:"morocco",name:"Morocco",nameLocal:"المغرب",flag:"🇲🇦",continent:"africa",
    capital:"Rabat",population:"37M",area:"446,550 km²",language:"Arabic, Berber",
    subtitle:"Gateway to the Sahara",
    image:"https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800&q=80",
    heroImage:"https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1200&q=80",
    tags:["Sahara Desert","Atlas Mountains","Medinas"],
    description:"Morocco bridges Africa and Europe across the Strait of Gibraltar, creating a crossroads of cultures and landscapes. From the snow-capped Atlas Mountains to the endless dunes of the Sahara, and from the rugged Rif coastline to ancient desert oases, Morocco's geography is as colorful as its famous souks.",
    geography:"The Atlas Mountains divide Morocco into Atlantic and Saharan zones. The High Atlas contains North Africa's highest peak, Jebel Toubkal at 4,167m. East of the Atlas, the landscape transitions rapidly into the arid hammada and erg of the Sahara Desert.",
    landmarks:[
      {icon:"🏜️",name:"Erg Chebbi",desc:"Towering Saharan sand dunes reaching 150m high"},
      {icon:"🏔️",name:"Jebel Toubkal",desc:"North Africa's highest peak at 4,167m"},
      {icon:"🕌",name:"Ait Benhaddou",desc:"UNESCO fortified city along the former caravan route"},
      {icon:"🌿",name:"Todra Gorge",desc:"300m-high canyon walls in the eastern High Atlas"}
    ]
  },
  {
    id:"newzealand",name:"New Zealand",nameLocal:"Aotearoa",flag:"🇳🇿",continent:"oceania",
    capital:"Wellington",population:"5.1M",area:"268,021 km²",language:"English, Māori",
    subtitle:"Land of the Long White Cloud",
    image:"https://images.unsplash.com/photo-1469521669194-babb45599def?w=800&q=80",
    heroImage:"https://images.unsplash.com/photo-1469521669194-babb45599def?w=1200&q=80",
    tags:["Fjordlands","Volcanoes","Glaciers"],
    description:"New Zealand's isolation in the southwestern Pacific Ocean has created landscapes of extraordinary beauty and uniqueness. The two main islands offer dramatically different terrain — the volcanic North Island with its geothermal wonders, and the alpine South Island with its fjords, glaciers, and towering peaks.",
    geography:"The Southern Alps run the length of the South Island, with Aoraki/Mount Cook reaching 3,724m. Active volcanoes dot the North Island's central plateau, while fjords carved by ancient glaciers create Fiordland's dramatic coastline. Geothermal activity creates bubbling mud pools and erupting geysers in the Taupō Volcanic Zone.",
    landmarks:[
      {icon:"🌄",name:"Milford Sound",desc:"Fjord with sheer cliffs and cascading waterfalls"},
      {icon:"🌋",name:"Tongariro Alpine Crossing",desc:"Volcanic landscape of emerald lakes and red craters"},
      {icon:"🧊",name:"Franz Josef Glacier",desc:"Glacier descending into temperate rainforest"},
      {icon:"💫",name:"Waitomo Caves",desc:"Underground caves illuminated by thousands of glowworms"}
    ]
  },
  {
    id:"peru",name:"Peru",nameLocal:"Perú",flag:"🇵🇪",continent:"americas",
    capital:"Lima",population:"33M",area:"1,285,216 km²",language:"Spanish, Quechua",
    subtitle:"Empire of the Andes",
    image:"https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&q=80",
    heroImage:"https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&q=80",
    tags:["Andes Mountains","Amazon Basin","Ancient Ruins"],
    description:"Peru encompasses three dramatically different geographic zones: the arid Pacific coast, the towering Andes mountains, and the lush Amazon jungle. This vertical geography creates one of the most biodiverse countries on Earth, from cloud forests shrouded in mist to the world's deepest canyons.",
    geography:"The Andes divide Peru into three regions. The narrow coastal desert is one of the driest places on Earth. The highland sierra contains peaks over 6,000m and Lake Titicaca, the world's highest navigable lake. East of the Andes, the terrain drops into the vast Amazon Basin, covering 60% of the country.",
    landmarks:[
      {icon:"🏛️",name:"Machu Picchu",desc:"Iconic Inca citadel perched at 2,430m in the Andes"},
      {icon:"🏔️",name:"Colca Canyon",desc:"One of the world's deepest canyons at 3,270m deep"},
      {icon:"🌊",name:"Lake Titicaca",desc:"World's highest navigable lake at 3,812m elevation"},
      {icon:"📐",name:"Nazca Lines",desc:"Mysterious ancient geoglyphs spanning the desert floor"}
    ]
  },
  {
    id:"australia",name:"Australia",nameLocal:"Australia",flag:"🇦🇺",continent:"oceania",
    capital:"Canberra",population:"26M",area:"7,692,024 km²",language:"English",
    subtitle:"The Sunburnt Country",
    image:"https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&q=80",
    heroImage:"https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1200&q=80",
    tags:["Outback","Great Barrier Reef","Unique Wildlife"],
    description:"Australia is both a country and a continent, the world's smallest continent but sixth-largest country. Its vast interior — the Outback — is one of Earth's last great wildernesses, while its coastline features the Great Barrier Reef, the largest living structure on the planet visible from space.",
    geography:"The Great Dividing Range runs along the eastern coast, separating the fertile coastal strip from the arid interior. The vast central lowlands include desert, salt lakes, and grasslands. Western Australia features ancient rock formations billions of years old. The tropical north transitions through savannah to the temperate south.",
    landmarks:[
      {icon:"🪸",name:"Great Barrier Reef",desc:"2,300km reef system with 1,500+ fish species"},
      {icon:"🪨",name:"Uluru",desc:"Sacred 348m sandstone monolith in the Red Centre"},
      {icon:"🌊",name:"Twelve Apostles",desc:"Limestone stacks along the dramatic Great Ocean Road"},
      {icon:"🌿",name:"Daintree Rainforest",desc:"World's oldest tropical rainforest at 180 million years"}
    ]
  },
  {
    id:"switzerland",name:"Switzerland",nameLocal:"Schweiz",flag:"🇨🇭",continent:"europe",
    capital:"Bern",population:"8.8M",area:"41,285 km²",language:"German, French, Italian",
    subtitle:"Heart of the Alps",
    image:"https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80",
    heroImage:"https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1200&q=80",
    tags:["Alpine Peaks","Crystal Lakes","Glacial Valleys"],
    description:"Switzerland sits at the crossroads of Europe, its landscape defined by the magnificent Alps that cover about 60% of the country. Crystal-clear lakes, thundering waterfalls, and flower-filled meadows make it one of the most scenic countries in the world, a place where nature's grandeur is on display at every turn.",
    geography:"The Swiss Alps dominate the southern half of the country, with 48 peaks exceeding 4,000m. The Swiss Plateau between the Alps and the Jura Mountains hosts most of the population. Over 1,500 lakes dot the landscape, fed by extensive glacier systems that are among Europe's largest.",
    landmarks:[
      {icon:"🏔️",name:"Matterhorn",desc:"Iconic 4,478m pyramid peak on the Italian border"},
      {icon:"🚂",name:"Jungfraujoch",desc:"Europe's highest railway station at 3,454m"},
      {icon:"💧",name:"Lake Geneva",desc:"Europe's largest Alpine lake, 73km long"},
      {icon:"🧊",name:"Aletsch Glacier",desc:"Longest glacier in the Alps at 23km"}
    ]
  },
  {
    id:"kenya",name:"Kenya",nameLocal:"Kenya",flag:"🇰🇪",continent:"africa",
    capital:"Nairobi",population:"54M",area:"580,367 km²",language:"Swahili, English",
    subtitle:"Cradle of Humanity",
    image:"https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80",
    heroImage:"https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&q=80",
    tags:["Savannahs","Great Rift Valley","Wildlife Migration"],
    description:"Kenya straddles the equator on East Africa's coast, offering landscapes that define the African continent in the popular imagination. The Great Rift Valley slices through the country, creating a corridor of lakes, volcanoes, and escarpments. Kenya's savannahs host the greatest wildlife spectacle on Earth — the annual wildebeest migration.",
    geography:"The Great Rift Valley divides Kenya's western highlands from the eastern plateau. Mount Kenya, Africa's second-highest peak at 5,199m, rises from the central highlands. The landscape transitions from Indian Ocean beaches to semi-arid bushland, highland forests, and the vast savannahs of the Masai Mara.",
    landmarks:[
      {icon:"🦁",name:"Masai Mara",desc:"Home to the Great Migration of 2 million wildebeest"},
      {icon:"🏔️",name:"Mount Kenya",desc:"Africa's second-highest peak with glaciers on the equator"},
      {icon:"🦩",name:"Lake Nakuru",desc:"Alkaline lake famous for vast flamingo congregations"},
      {icon:"🐘",name:"Amboseli National Park",desc:"Elephant herds framed by Kilimanjaro's silhouette"}
    ]
  },
  {
    id:"china",name:"China",nameLocal:"中国",flag:"🇨🇳",continent:"asia",
    capital:"Beijing",population:"1.4B",area:"9,596,961 km²",language:"Mandarin",
    subtitle:"The Middle Kingdom",
    image:"https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80",
    heroImage:"https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1200&q=80",
    tags:["Karst Landscapes","Himalayan Plateau","River Valleys"],
    description:"China's vast territory encompasses nearly every type of landscape on Earth. From the world's highest plateau in Tibet to subtropical karst towers in Guilin, from the Gobi Desert to the rice terraces of Yunnan, China's geography spans an almost incomprehensible range of environments across its 9.6 million square kilometers.",
    geography:"The Tibetan Plateau — the 'Roof of the World' — averages 4,500m elevation. The terrain descends eastward through mountain ranges, basins, and plateaus to the densely populated eastern plains. Major rivers including the Yangtze and Yellow River have carved dramatic gorges and built vast deltas.",
    landmarks:[
      {icon:"🏯",name:"Zhangjiajie Pillars",desc:"Towering sandstone pillars that inspired Avatar's floating mountains"},
      {icon:"🌾",name:"Longji Rice Terraces",desc:"2,300-year-old terraces cascading down mountain slopes"},
      {icon:"🏔️",name:"Tiger Leaping Gorge",desc:"One of the world's deepest river canyons"},
      {icon:"🌈",name:"Zhangye Danxia",desc:"Rainbow mountains of layered colored sandstone"}
    ]
  },
  {
    id:"canada",name:"Canada",nameLocal:"Canada",flag:"🇨🇦",continent:"americas",
    capital:"Ottawa",population:"39M",area:"9,984,670 km²",language:"English, French",
    subtitle:"The Great White North",
    image:"https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800&q=80",
    heroImage:"https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200&q=80",
    tags:["Rocky Mountains","Arctic Tundra","Boreal Forests"],
    description:"Canada is the world's second-largest country, stretching from the Atlantic to the Pacific and northward into the Arctic Ocean. Its landscapes are defined by vast wilderness — endless boreal forests, the dramatic Rocky Mountains, pristine lakes numbering over 2 million, and the frozen Arctic territories.",
    geography:"The Canadian Shield — ancient Precambrian rock — forms the geological heart of the country. The Rocky Mountains and Coast Mountains create dramatic western landscapes, while the Prairies stretch flat across the center. The Arctic archipelago extends to within 800km of the North Pole.",
    landmarks:[
      {icon:"💎",name:"Lake Louise",desc:"Turquoise glacial lake in the Canadian Rockies"},
      {icon:"🌊",name:"Niagara Falls",desc:"Massive waterfalls straddling the US-Canada border"},
      {icon:"🏔️",name:"Banff National Park",desc:"Canada's first national park in the heart of the Rockies"},
      {icon:"🐻",name:"Churchill",desc:"Polar bear capital of the world on Hudson Bay"}
    ]
  },
  {
    id:"egypt",name:"Egypt",nameLocal:"مصر",flag:"🇪🇬",continent:"africa",
    capital:"Cairo",population:"104M",area:"1,010,408 km²",language:"Arabic",
    subtitle:"Gift of the Nile",
    image:"https://images.unsplash.com/photo-1539768942893-daf53e736b68?w=800&q=80",
    heroImage:"https://images.unsplash.com/photo-1539768942893-daf53e736b68?w=1200&q=80",
    tags:["Nile Valley","Sahara Desert","Ancient Monuments"],
    description:"Egypt is defined by the Nile, the world's longest river, which cuts a narrow ribbon of green through an otherwise desert landscape. This contrast between fertile valley and barren desert has shaped one of civilization's oldest and most enduring cultures, leaving monuments that have stood for over 4,500 years.",
    geography:"Over 95% of Egypt is desert, divided by the Nile into the Western (Libyan) Desert and the Eastern (Arabian) Desert. The Nile Delta fans out across the northern coast. The Sinai Peninsula, a triangular desert between Africa and Asia, contains Mount Sinai and the coral reefs of the Red Sea coast.",
    landmarks:[
      {icon:"🔺",name:"Pyramids of Giza",desc:"Last surviving Wonder of the Ancient World"},
      {icon:"🏛️",name:"Valley of the Kings",desc:"Royal tombs carved into limestone cliffs at Luxor"},
      {icon:"🐠",name:"Red Sea Coral Reefs",desc:"Some of the world's most pristine diving sites"},
      {icon:"🏜️",name:"White Desert",desc:"Surreal chalk formations sculpted by wind erosion"}
    ]
  },
  {
    id:"india",name:"India",nameLocal:"भारत",flag:"🇮🇳",continent:"asia",
    capital:"New Delhi",population:"1.4B",area:"3,287,263 km²",language:"Hindi, English",
    subtitle:"Subcontinent of Wonders",
    image:"https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80",
    heroImage:"https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80",
    tags:["Himalayas","Thar Desert","Tropical Coast"],
    description:"India is a subcontinent of staggering geographic diversity. The Himalayas form the world's highest wall along the north, while tropical beaches line the southern coast. Between these extremes lie vast river plains, arid deserts, dense jungles, and volcanic island chains — a complete world within a single nation.",
    geography:"The Himalayas and Karakoram ranges contain 9 of the world's 14 peaks above 8,000m. The Indo-Gangetic Plain, one of the most fertile regions on Earth, stretches across the north. The Deccan Plateau dominates the south, flanked by the Western and Eastern Ghats. The Thar Desert covers the northwest.",
    landmarks:[
      {icon:"🏔️",name:"Himalayas",desc:"World's highest mountain range with peaks above 8,000m"},
      {icon:"🌊",name:"Kerala Backwaters",desc:"900km network of lagoons and canals fringed by palms"},
      {icon:"🏜️",name:"Thar Desert",desc:"Great Indian Desert with golden sand dunes"},
      {icon:"🐅",name:"Sundarbans",desc:"World's largest mangrove forest and Royal Bengal Tiger habitat"}
    ]
  },
  {
    id:"chile",name:"Chile",nameLocal:"Chile",flag:"🇨🇱",continent:"americas",
    capital:"Santiago",population:"19M",area:"756,102 km²",language:"Spanish",
    subtitle:"The Narrow Country",
    image:"https://images.unsplash.com/photo-1478827536114-da961b7f86d2?w=800&q=80",
    heroImage:"https://images.unsplash.com/photo-1478827536114-da961b7f86d2?w=1200&q=80",
    tags:["Atacama Desert","Patagonia","Volcanic Lakes"],
    description:"Chile stretches 4,300 km along South America's western edge — longer than the US is wide — but averages only 177 km in width. This extreme geography creates a country that transitions from the world's driest desert in the north through Mediterranean valleys to glacial fjords and Patagonian ice fields in the south.",
    geography:"The Andes form Chile's eastern border, with numerous active volcanoes. The Atacama Desert in the north holds the record as Earth's driest non-polar desert. Central Chile enjoys a Mediterranean climate. Southern Chile dissolves into thousands of islands, fjords, and the massive Northern and Southern Patagonian Ice Fields.",
    landmarks:[
      {icon:"🏜️",name:"Atacama Desert",desc:"Driest non-polar desert with Mars-like landscapes"},
      {icon:"🏔️",name:"Torres del Paine",desc:"Granite towers rising above Patagonian steppe"},
      {icon:"🗿",name:"Easter Island",desc:"Remote Pacific island with mysterious moai statues"},
      {icon:"🧊",name:"Marble Caves",desc:"Azure blue caverns carved by Lake General Carrera"}
    ]
  },
  {
    id:"greece",name:"Greece",nameLocal:"Ελλάδα",flag:"🇬🇷",continent:"europe",
    capital:"Athens",population:"10.4M",area:"131,957 km²",language:"Greek",
    subtitle:"Birthplace of Western Civilization",
    image:"https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80",
    heroImage:"https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&q=80",
    tags:["Island Archipelagos","Mediterranean Coast","Ancient Ruins"],
    description:"Greece is a land where turquoise seas meet whitewashed clifftop villages, where ancient ruins crown rocky headlands, and where over 6,000 islands and islets scatter across the Aegean and Ionian seas. Its dramatic coastline — one of the longest in the world — creates an endless variety of beaches, coves, and harbors.",
    geography:"About 80% of Greece is mountainous, with Mount Olympus reaching 2,917m. The country includes the Peloponnese peninsula connected by the narrow Isthmus of Corinth, and vast island groups including the Cyclades, Dodecanese, and Ionian Islands. Only about 227 of its 6,000+ islands are inhabited.",
    landmarks:[
      {icon:"🏛️",name:"Santorini Caldera",desc:"Volcanic caldera with iconic blue-domed churches"},
      {icon:"⛰️",name:"Meteora",desc:"Monasteries perched atop 400m sandstone pillars"},
      {icon:"🏖️",name:"Navagio Beach",desc:"Shipwreck cove with turquoise waters and white cliffs"},
      {icon:"🗻",name:"Mount Olympus",desc:"Mythological home of the gods at 2,917m"}
    ]
  },
  {
    id:"southafrica",name:"South Africa",nameLocal:"Suid-Afrika",flag:"🇿🇦",continent:"africa",
    capital:"Pretoria",population:"60M",area:"1,221,037 km²",language:"11 official languages",
    subtitle:"Rainbow Nation",
    image:"https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80",
    heroImage:"https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200&q=80",
    tags:["Table Mountain","Safari Reserves","Cape Coast"],
    description:"South Africa sits at the continent's southern tip where the Atlantic and Indian Oceans meet. Its landscapes span from the flat-topped grandeur of Table Mountain to the wildlife-rich bushveld of Kruger, from the dramatic Drakensberg escarpment to the Garden Route's lush coastal forests.",
    geography:"The Great Escarpment divides the coastal lowlands from the interior plateau. The Drakensberg mountains reach 3,482m. The interior is dominated by the highveld grasslands and the semi-arid Karoo basin. The Western Cape has a Mediterranean climate, while the northeast hosts subtropical savannahs.",
    landmarks:[
      {icon:"⛰️",name:"Table Mountain",desc:"Iconic flat-topped mountain overlooking Cape Town"},
      {icon:"🦁",name:"Kruger National Park",desc:"Flagship reserve with the Big Five and 500+ bird species"},
      {icon:"🏔️",name:"Drakensberg Mountains",desc:"UNESCO site with 3,000-year-old San rock art"},
      {icon:"🌊",name:"Cape of Good Hope",desc:"Where Atlantic and Indian Oceans converge"}
    ]
  },
  {
    id:"thailand",name:"Thailand",nameLocal:"ประเทศไทย",flag:"🇹🇭",continent:"asia",
    capital:"Bangkok",population:"72M",area:"513,120 km²",language:"Thai",
    subtitle:"Land of Smiles",
    image:"https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&q=80",
    heroImage:"https://images.unsplash.com/photo-1528181304800-259b08848526?w=1200&q=80",
    tags:["Limestone Karsts","Tropical Islands","Jungle Mountains"],
    description:"Thailand's geography ranges from misty mountains in the north to limestone karst islands in the south, with vast rice paddies and river plains in between. The country's 3,219 km of coastline along the Andaman Sea and Gulf of Thailand feature some of the world's most beautiful tropical islands.",
    geography:"Northern Thailand is mountainous, with peaks reaching 2,565m. The Khorat Plateau dominates the northeast. The central plains, fed by the Chao Phraya River, form the country's rice bowl. Southern Thailand narrows into the Malay Peninsula, flanked by dramatic limestone karst formations.",
    landmarks:[
      {icon:"🏝️",name:"Phang Nga Bay",desc:"Emerald waters dotted with towering limestone karsts"},
      {icon:"⛰️",name:"Doi Inthanon",desc:"Thailand's highest peak with cloud forest trails"},
      {icon:"🏖️",name:"Phi Phi Islands",desc:"Stunning archipelago with crystal lagoons"},
      {icon:"🌿",name:"Khao Sok",desc:"Ancient rainforest older than the Amazon with limestone cliffs"}
    ]
  },
  {
    id:"italy",name:"Italy",nameLocal:"Italia",flag:"🇮🇹",continent:"europe",
    capital:"Rome",population:"59M",area:"301,340 km²",language:"Italian",
    subtitle:"The Beautiful Country",
    image:"https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80",
    heroImage:"https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1200&q=80",
    tags:["Dolomites","Amalfi Coast","Volcanic Islands"],
    description:"Italy's boot-shaped peninsula extends into the Mediterranean, offering a stunning variety of landscapes packed into a relatively compact area. From the jagged Dolomite peaks in the north to the sun-baked shores of Sicily, from the romantic lake district to the dramatic Amalfi cliffs, Italy is a masterwork of natural beauty.",
    geography:"The Alps form Italy's northern border, transitioning into the Apennine Mountains that run the length of the peninsula. The Po Valley in the north is Italy's largest plain. Active volcanoes — Etna, Stromboli, and Vesuvius — add drama to the southern landscape. Major islands include Sicily and Sardinia.",
    landmarks:[
      {icon:"🏔️",name:"Dolomites",desc:"Dramatic pale limestone peaks reaching 3,343m"},
      {icon:"🌊",name:"Amalfi Coast",desc:"Cliffside villages above turquoise Mediterranean waters"},
      {icon:"🌋",name:"Mount Etna",desc:"Europe's tallest and most active volcano at 3,357m"},
      {icon:"💧",name:"Lake Como",desc:"Glacial lake surrounded by villas and alpine slopes"}
    ]
  },
  {
    id:"namibia",name:"Namibia",nameLocal:"Namibia",flag:"🇳🇦",continent:"africa",
    capital:"Windhoek",population:"2.6M",area:"825,615 km²",language:"English",
    subtitle:"Land of Endless Horizons",
    image:"https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80",
    heroImage:"https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&q=80",
    tags:["Sand Dunes","Skeleton Coast","Desert-Adapted Wildlife"],
    description:"Namibia is one of the world's least densely populated countries, home to ancient deserts, shipwreck-strewn coastlines, and wildlife that has adapted to some of Earth's most extreme conditions. The Namib Desert — from which the country takes its name — is considered the oldest desert on Earth at 55–80 million years old.",
    geography:"The Namib Desert runs along the entire Atlantic coast, featuring some of the world's tallest sand dunes. The central plateau rises to 2,000m, transitioning into the Kalahari sands in the east. The Skeleton Coast in the northwest is a fog-bound graveyard of ships and whale bones.",
    landmarks:[
      {icon:"🏜️",name:"Sossusvlei",desc:"Towering red sand dunes up to 325m — among Earth's tallest"},
      {icon:"💀",name:"Skeleton Coast",desc:"Fog-shrouded coastline littered with shipwrecks"},
      {icon:"🌌",name:"NamibRand Reserve",desc:"Africa's first International Dark Sky Reserve"},
      {icon:"🐘",name:"Etosha Pan",desc:"Vast salt pan attracting enormous herds of wildlife"}
    ]
  },
  {
    id:"colombia",name:"Colombia",nameLocal:"Colombia",flag:"🇨🇴",continent:"americas",
    capital:"Bogotá",population:"52M",area:"1,141,748 km²",language:"Spanish",
    subtitle:"Gateway to South America",
    image:"https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&q=80",
    heroImage:"https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&q=80",
    tags:["Andes Ranges","Caribbean Coast","Cloud Forests"],
    description:"Colombia is the only South American country with coastlines on both the Pacific Ocean and the Caribbean Sea. The Andes split into three ranges here, creating isolated valleys with unique ecosystems. Colombia is the second most biodiverse country on Earth, with more bird species than any other nation.",
    geography:"Three Andean cordilleras run north-south, separated by deep river valleys. The eastern llanos (plains) stretch to Venezuela. The Pacific coast is one of the rainiest places on Earth, covered in dense Chocó rainforest. The Caribbean coast features deserts, mangroves, and the snow-capped Sierra Nevada de Santa Marta — the world's highest coastal mountain range.",
    landmarks:[
      {icon:"🌈",name:"Caño Cristales",desc:"'River of Five Colors' with aquatic plants creating rainbow hues"},
      {icon:"🏔️",name:"Cocora Valley",desc:"World's tallest palm trees reaching 60m in misty Andean cloud forest"},
      {icon:"🏜️",name:"Tatacoa Desert",desc:"Dramatic badlands of red and grey sculpted formations"},
      {icon:"🌊",name:"Tayrona National Park",desc:"Where Sierra Nevada mountains meet Caribbean beaches"}
    ]
  }
];
