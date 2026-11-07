// Editorial explanations and schematic models; none of the profile values are measurements.
export const FIELD_GUIDES = {
  volcano: {
    label: 'Volcanic systems', kicker: 'Beneath the surface', color: '#ff9466',
    title: 'Explore the anatomy of a volcano', subtitle: 'Hover, focus or tap a numbered feature. Reveal the interior to follow a possible magma pathway.',
    sections: [
      ['A landscape built in episodes', 'A volcanic cone is an accumulated record, rather than the product of a single event. Lava and fragmented volcanic material can build different layers around vents. A broad view reveals the overall form; a closer view asks how individual deposits relate to one another.', 'Read the visible outline first. Then identify what would require a geological map, an exposed section or a dated sample. A dark patch is an observation; calling it the youngest lava flow is an interpretation that needs evidence.'],
      ['From the interior to the surface', 'The cutaway separates a subsurface storage region, a connecting conduit and the opening at the surface. It is a simplified teaching diagram. Real volcanic plumbing can involve multiple storage zones and branching pathways rather than a neat central pipe.', 'Move between the surface and cutaway views. Notice how the same external shape can conceal very different possible internal arrangements. The drawing explains vocabulary; it does not show the measured interior of this particular mountain.'],
      ['Building a record of change', 'For a meaningful comparison, collect dated views from a consistent viewpoint. Record visibility, snow cover and the feature you are tracing. Use a landmark on stable ground as a reference before interpreting changes in the outline.', 'An apparent difference may come from lighting or camera position. Keep the original images and write down alternative explanations. Eruption forecasts require specialist monitoring, not visual appearance alone.'],
    ],
    spots: [['Crater', 'A surface opening or depression near a vent. Its visible shape does not reveal the whole plumbing system.', 50, 27], ['Layers', 'Successive deposits build the edifice. This striped section illustrates accumulation, not mapped strata.', 38, 59], ['Conduit', 'A possible pathway connecting subsurface magma to the surface; actual pathways can branch.', 50, 57], ['Storage region', 'A simplified representation of magma storage within the crust, not a giant empty cavern.', 50, 83]],
    profile: [8, 14, 28, 46, 67, 88, 80, 89, 65, 43, 25, 13, 7], profileLabel: 'Schematic cone cross-section',
    steps: ['Identify the cone', 'Trace visible deposits', 'Check dates and maps'],
    terms: [['Edifice', 'The volcanic structure built by accumulated deposits.'], ['Conduit', 'A pathway through which magma moves toward a vent.'], ['Relative age', 'An ordering of events, rather than an exact calendar date.']],
    rows: [['Dark surface patch', 'A distinct unit is visible', 'A geological map to identify its material'], ['Layer crossing another', 'One unit may postdate another', 'An exposed contact to test the relationship'], ['Changed summit outline', 'The two views differ', 'Matched viewpoints and dates']],
    source: ['USGS · Principal types of volcanoes', 'https://pubs.usgs.gov/gip/volc/types.html'],
  },
  dune: {
    label: 'Desert systems', kicker: 'A landscape in motion', color: '#efbe7c', title: 'Follow wind over a dune', subtitle: 'Explore the crest, slopes and low ground. Switch the overlay to trace a conceptual transport pathway.',
    sections: [
      ['Separate shape from movement', 'A dune photograph records a shape at one moment. To investigate motion, trace the same crest in repeated observations and record the viewing direction. Shadows can make a ridge appear to move even when only the illumination has changed.', 'Start with a sketch of ridges and intervening low ground. Mark uncertain boundaries with a dotted line. That preserves the difference between a feature you can identify confidently and one partly hidden by perspective.'],
      ['Two journeys through one landscape', 'The Namib case connects sediment transport with moisture supply. Keep these journeys on separate diagrams: a grain moving across the landscape is not the same process as water arriving in a habitat.', 'This overlay is a conceptual arrow, not a measured prevailing wind. To turn it into a local explanation, add dated wind observations, a map of the site and repeat photographs. Regional descriptions cannot establish conditions at every dune.'],
      ['Observe across different timescales', 'Morning and afternoon photographs can reveal changes in light and visibility. Repeated surveys over longer periods address a different question: whether the landform itself has changed. Choose an interval that matches your question.', 'A useful field record includes time, viewpoint, visible surface texture and uncertainty. Avoid using one particularly dramatic image as a summary of all conditions in a desert.'],
    ],
    spots: [['Crest', 'The ridge separates two faces in this schematic dune.', 45, 35], ['Gentle slope', 'Compare surface texture and crest position in repeated views.', 24, 55], ['Steeper face', 'The diagram emphasizes asymmetry; real dunes have a range of forms.', 59, 58], ['Interdune', 'Low ground provides a reference for comparing adjacent ridges.', 78, 76]],
    profile: [12, 18, 29, 44, 63, 82, 47, 19, 12, 29, 51, 28, 12], profileLabel: 'Schematic dune transect', steps: ['Sketch ridge lines', 'Separate sand and water', 'Repeat the viewpoint'],
    terms: [['Transect', 'A line across a landscape used to organize observations.'], ['Crest', 'The highest line along a ridge.'], ['Repeat survey', 'Observations made again using a comparable method.']],
    rows: [['Ridge line', 'The visible dune form', 'Repeat surveys to test movement'], ['A hazy morning', 'Reduced visibility at that time', 'Weather records to identify the cause'], ['Surface tracks', 'A local disturbance', 'Context before assigning an origin']],
    source: ['UNESCO · Namib Sand Sea', 'https://whc.unesco.org/en/list/1430/'],
  },
  reef: {
    label: 'Marine habitats', kicker: 'Life across a seascape', color: '#61d7d1', title: 'Explore a reef habitat mosaic', subtitle: 'Move between the shallow platform, reef edge and deeper water. Reveal the light overlay to compare viewing conditions.',
    sections: [
      ['A reef is more than one scene', 'An underwater photograph captures a small field of view. A reef study needs a way to connect that scene with neighboring habitats. Sketch where each observation was made and record whether you were looking down, across or along the reef.', 'Compare like with like. A sandy gap, a coral-covered patch and an open-water view answer different questions. Keep habitat categories visible in your notes rather than averaging every observation into a single impression.'],
      ['Light changes the observation', 'Many reef-building corals depend on a partnership with photosynthetic organisms. For these shallow-water systems, available light matters. Water clarity and depth affect how much light reaches the habitat.', 'The overlay illustrates the idea of changing illumination; it is not a light meter or a depth model. A darker photograph may reflect camera exposure, cloud, water clarity or depth. Record those possibilities before interpreting biological change.'],
      ['Design a repeatable comparison', 'Choose fixed locations or a clearly described transect. At each stop, record habitat, observation time and method. Repeat the same protocol so that differences are not simply produced by a change in the observer’s approach.', 'Keep sampling effort separate from findings. More photographs of one location do not automatically represent more of the reef. A good comparison documents both where observations exist and where information is still missing.'],
    ],
    spots: [['Shallow platform', 'A habitat near the water surface in this schematic scene.', 22, 59], ['Reef edge', 'A transition between the platform and sloping terrain.', 46, 70], ['Deeper water', 'Light and viewing conditions change across the water column.', 78, 65], ['Habitat patch', 'A small observation unit; one patch cannot represent an entire reef.', 33, 61]],
    profile: [78, 80, 77, 76, 70, 61, 49, 33, 25, 19, 13, 11, 9], profileLabel: 'Schematic reef-floor profile', steps: ['Locate habitat patches', 'Record viewing conditions', 'Repeat a sampling method'],
    terms: [['Habitat mosaic', 'Neighboring patches with different physical or biological characteristics.'], ['Sampling effort', 'The amount and distribution of observation work.'], ['Comparable survey', 'A repeat observation using a consistent method.']],
    rows: [['Coral-covered patch', 'Local cover in the view', 'A defined sampling area'], ['Low visibility', 'Limited observation distance', 'Conditions recorded at the same time'], ['Different colors', 'A visual difference', 'Consistent lighting and biological assessment']],
    source: ['NOAA · In what types of water do corals live?', 'https://oceanservice.noaa.gov/facts/coralwaters.html'],
  },
  fjord: {
    label: 'Glacial landscapes', kicker: 'Read below the waterline', color: '#8dcdf2', title: 'Reveal the hidden valley', subtitle: 'Explore a valley cross-section. Switch the water overlay off to expose the schematic valley floor.',
    sections: [
      ['Look at the whole cross-section', 'Glacial valleys often have a broad floor and steep sides. When the sea occupies a glacial valley, its surface hides part of that relief. A fjord photograph therefore shows a waterline rather than the complete shape of the valley.', 'The diagram separates rock and water. Removing the overlay is a way to think about hidden topography; it does not reconstruct the measured seabed at this place.'],
      ['Connect tributaries and the main valley', 'Smaller tributary glaciers and larger valley glaciers can erode to different depths. After ice retreats, a tributary valley may meet the main valley high above its floor. Waterfalls can draw attention to these relationships.', 'Use a map to follow drainage into the main valley. Then ask which parts of your explanation come from present-day water flow and which concern the earlier work of ice.'],
      ['Know which surface you measured', 'A shoreline position, a rock summit and a seabed point describe different parts of the same section. Record the reference surface for any height or depth before comparing measurements.', 'A reliable cross-section requires points along a defined line. Do not combine unrelated maximum heights and depths from a regional description into a profile that no one has measured.'],
    ],
    spots: [['Valley side', 'Steep relief forms one side of the schematic section.', 18, 35], ['Water surface', 'A visible reference plane, not the valley floor.', 51, 48], ['Valley floor', 'The submerged part requires bathymetric evidence in a real survey.', 50, 90], ['Tributary', 'Smaller valleys connect mountain drainage to the main trough.', 83, 35]],
    profile: [92, 78, 45, 19, 11, 8, 7, 8, 12, 22, 49, 79, 93], profileLabel: 'Schematic U-shaped valley', steps: ['Identify valley geometry', 'Separate water and rock', 'Seek underwater evidence'],
    terms: [['Bathymetry', 'Measurement of underwater depth and terrain.'], ['Hanging valley', 'A tributary valley whose floor stands above the main valley floor.'], ['Reference surface', 'The baseline against which a height or depth is described.']],
    rows: [['Steep valley walls', 'Visible relief', 'A cross-section to describe the full geometry'], ['Waterfall', 'A current drainage connection', 'Mapping before inferring valley history'], ['Sea surface', 'A visible water level', 'Bathymetry to locate the floor']],
    source: ['NPS · U-shaped valleys, fjords and hanging valleys', 'https://www.nps.gov/articles/ushapedvalleysfjordshangingvalleys.htm'],
  },
  terrace: {
    label: 'Cultural landscapes', kicker: 'Landform meets design', color: '#a8d89c', title: 'Read a terraced slope', subtitle: 'Explore platforms, retaining edges and the surrounding slope. Reveal a hypothetical water pathway.',
    sections: [
      ['Read the slope before the structure', 'A terrace changes the geometry of a slope by introducing flatter surfaces and edges. Begin with the larger landform: the ridge, valley and direction of slope. Then record how the built surfaces are arranged within that setting.', 'The illustration is a general stepped landscape. It does not identify the construction layers or function of individual terraces at a particular archaeological site.'],
      ['Ask how movement is organized', 'Paths, steps and platforms provide different ways of moving across relief. Trace the possible connections between them and note where the photograph or map stops providing evidence.', 'Use a separate line for a proposed water pathway. A visible slope suggests a direction worth investigating, but it does not prove where buried drainage channels run or how a historical structure was managed.'],
      ['Keep interpretation tied to evidence', 'A plan can reveal arrangement. An excavated section can reveal construction. A written account can describe use. These forms of evidence answer different questions and should not be substituted for one another.', 'Build a small evidence register: the claim, the source and the remaining uncertainty. When several explanations fit the same shape, record the alternatives rather than choosing the most appealing story.'],
    ],
    spots: [['Upper slope', 'The wider topography provides the setting for the built features.', 23, 29], ['Platform', 'A relatively level surface in the schematic stepped landscape.', 43, 55], ['Retaining edge', 'An edge separating levels; its actual construction requires local evidence.', 58, 64], ['Lower slope', 'A place to investigate connections with the wider drainage system.', 80, 81]],
    profile: [93, 93, 78, 78, 63, 63, 48, 48, 33, 33, 18, 18, 8], profileLabel: 'Schematic stepped slope', steps: ['Map the wider slope', 'Trace built connections', 'Separate use from appearance'],
    terms: [['Platform', 'A relatively level surface within a sloping setting.'], ['Evidence register', 'A record connecting each claim with its supporting source.'], ['Interpretation', 'An explanation proposed from observations and context.']],
    rows: [['Repeated steps', 'A visible arrangement', 'A measured plan'], ['A channel-like feature', 'A possible flow route', 'Construction evidence and local context'], ['Vegetation on a wall', 'Present surface cover', 'A dated survey before inferring change']],
    source: ['UNESCO · Historic Sanctuary of Machu Picchu', 'https://whc.unesco.org/en/list/274/'],
  },
  landscape: {
    label: 'Landscape observation', kicker: 'Look closer', color: '#b8a3ef', title: 'Read the layers of a landscape', subtitle: 'Explore landform, water, vegetation and human traces as separate layers of observation.',
    sections: [
      ['Start with a frame of reference', 'Locate the place within its wider setting before describing individual features. Use the map coordinates, a viewing direction and a recognizable reference point. A location is useful context, but it does not explain the history of everything visible there.', 'Separate the foreground, middle distance and horizon in a sketch. This helps distinguish a small nearby feature from a much larger feature farther away. Record which parts of the view are hidden.'],
      ['Read several layers together', 'Relief, water, vegetation and built structures may overlap in the same view. Describe them separately first. Then ask how they might be related: where a path follows a ridge, where vegetation changes or where water enters and leaves the scene.', 'Treat those relationships as questions to investigate. A boundary in a photograph can result from season, lighting, land use or a physical change in the terrain. The image alone may not distinguish those explanations.'],
      ['Make the next observation useful', 'Choose a question narrow enough to investigate. Instead of asking why the entire landscape looks this way, compare two visible features or follow one boundary through a series of observations.', 'Record the same information each time: place, date, method, observation and uncertainty. A small consistent record is easier to interpret than many unrelated photographs without context.'],
    ],
    spots: [['Relief', 'The arrangement of high and low ground.', 31, 30], ['Water', 'Trace visible connections and mark hidden sections as unknown.', 54, 79], ['Vegetation', 'Describe patterns before assigning causes.', 22, 68], ['Human traces', 'Look for paths or structures and investigate their context.', 79, 54]],
    profile: [15, 22, 43, 78, 94, 69, 34, 19, 29, 52, 65, 42, 20], profileLabel: 'Schematic landscape transect', steps: ['Locate the viewpoint', 'Separate visible layers', 'Choose a testable question'],
    terms: [['Viewpoint', 'The position and direction from which a scene is observed.'], ['Scale', 'The relationship between the area represented and the detail visible.'], ['Uncertainty', 'What remains unresolved by the available evidence.']],
    rows: [['A visible boundary', 'Two areas appear different', 'Repeat observations and local context'], ['A line across a slope', 'A linear feature exists', 'A closer view to identify its origin'], ['A change in color', 'Different appearance', 'Comparable lighting and season']],
    source: null,
  },
}
export function guideKey(node) {
  const byStudy = { 'sacred-landscape': 'volcano', 'volcanic-record': 'volcano', 'fog-and-sand': 'dune', 'reef-mosaic': 'reef', 'glacial-relief': 'fjord', 'mountain-settlement': 'terrace' }
  if (node.study) return byStudy[node.study.id]
  const name = `${node.landmark?.name || ''} ${node.landmark?.desc || ''}`.toLowerCase()
  if (/volcan|fuji|etna|caldera|geysir|geothermal|tongariro/.test(name)) return 'volcano'
  if (/dune|desert|sand sea|sossusvlei|erg chebbi/.test(name)) return 'dune'
  if (/reef|coral/.test(name)) return 'reef'
  if (/fjord|glaci|milford/.test(name)) return 'fjord'
  if (/terrace|machu/.test(name)) return 'terrace'
  return 'landscape'
}
