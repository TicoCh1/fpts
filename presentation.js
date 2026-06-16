(() => {
  "use strict";

  const payload = window.STATIC_PRESENTATION || {};
  const project = clone(payload.project || { slides: [], media: {} });
  const mediaSources = payload.mediaSources || {};
  const PAGE_TITLE_FONT_FAMILIES = [
    { label: "Arial", value: "Arial, Helvetica, sans-serif" },
    { label: "Helvetica Neue", value: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
    { label: "Georgia", value: "Georgia, 'Times New Roman', serif" },
    { label: "Times", value: "'Times New Roman', Times, serif" },
    { label: "Courier", value: "'Courier New', Consolas, monospace" },
    { label: "Mono", value: "'SFMono-Regular', Consolas, 'Liberation Mono', monospace" },
  ];
  const PAGE_TITLE_DEFAULT_FONT = PAGE_TITLE_FONT_FAMILIES[0].value;
  const PAGE_TITLE_DEFAULT_SIZE = 42;
  const PROJECTION_DATA_ROOT =
    payload.projectionDataRoot ||
    "data/Equirectangular";
  const PROJECTION_IMAGE_PATH =
    payload.projectionImagePath ||
    `${PROJECTION_DATA_ROOT}/37614_-0.135387772_51.50885765_202210.jpg`;
  const PROJECTION_FOCUS_X = 20 / 32;
  const PROJECTION_FOCUS_Y = 0.5;
  const PROJECTION_GRID_WIDTH = 192;
  const PROJECTION_GRID_HEIGHT = 96;
  const PROJECTION_LAT_LON_STEP_DEGREES = 10;
  const PROJECTION_LAT_LON_SAMPLES = 192;
  const PROJECTION_LAT_LON_OFFSET = 0.018;
  const PROJECTION_PLANE_WIDTH = 8;
  const PROJECTION_PLANE_HEIGHT = 4;
  const PROJECTION_SPHERE_RADIUS = 3.05;
  const PROJECTION_ZOOM_MIN = -0.5;
  const PROJECTION_ZOOM_MAX = 1.5;
  const PROJECTION_ZOOM_RANGE = PROJECTION_ZOOM_MAX - PROJECTION_ZOOM_MIN;
  const PROJECTION_ZOOM_SURFACE = PROJECTION_ZOOM_MIN + 0.5 * PROJECTION_ZOOM_RANGE;
  const PROJECTION_OUTSIDE_CAMERA_DISTANCE = 10.2;
  const PROJECTION_FAR_CAMERA_DISTANCE = 16;
  const PROJECTION_INSIDE_CAMERA_DISTANCE = 0.03;
  const PROJECTION_STREETVIEW_WIDE_FOV = 90;
  const PROJECTION_STREETVIEW_TELE_FOV = 26.2;
  const PROJECTION_PITCH_LIMIT = Math.PI / 2 - 0.08;
  const BRICK_HOUSE_SPOTLIGHT_STAGE = { width: 1280, height: 360 };
  const BRICK_HOUSE_SPOTLIGHT_VERSION = 2;
  const BRICK_HOUSE_SPOTLIGHT_DEFAULT = {
    version: BRICK_HOUSE_SPOTLIGHT_VERSION,
    enabled: true,
    opacity: 0.78,
    radius: 70,
    feather: 78,
    glow: 0.3,
  };
  const BRICK_HOUSE_SPOTLIGHT_PRESETS = {
    2: {
      left: { x: 17.5, y: 31 },
      right: { x: 57, y: 23 },
    },
    3: {
      left: { x: 29, y: 63 },
      right: { x: 58, y: 76 },
    },
  };
  const MAP_PCA_DATA_ROOT =
    payload.mapPcaDataRoot ||
    "data/pcatsne";
  const DCC_LINK_DATA_ROOT =
    payload.dccLinkDataRoot ||
    "data/GlobalArchitectureVisualize";
  const DCC_LINK_WORLD_PATH = `${DCC_LINK_DATA_ROOT}/prototypes/map-32x9/assets/world.geojson`;
  const DCC_LINK_FLOW_PATH = `${DCC_LINK_DATA_ROOT}/prototypes/map-32x9/assets/capital_flow_events.json`;
  const DCC_LINK_STAGE = { width: 3200, height: 900 };
  const DCC_LINK_DPR_LIMIT = 2;
  const DCC_LINK_TARGET_FRAME_MS = 33;
  const PCA_VISUL_DATA_PATH =
    payload.pcaVisulDataPath ||
    "data/PCAVisualize/data/pca10_output.csv";
  const PCA_VISUL_POINT_SIZE = 2.1;
  const PCA_VISUL_BASE_GRAY = pcaVisulSrgbToLinear(0.82);
  const PCA_VISUL_PRIMARY_LUMINANCE = {
    red: 0.2126,
    green: 0.7152,
    blue: 0.0722,
  };
  const PCA_VISUL_FOCUS_X = 20 / 32;
  const PCA_VISUL_FOCUS_Y = 0.5;
  const PCA_VISUL_INITIAL_CAMERA = {
    yaw: Math.atan2(2.45, 2.55),
    pitch: Math.PI / 2,
    radius: 2,
  };
  const EMB_COSSIM_DATA_ROOT =
    payload.embCossimDataRoot ||
    "data/EmbCoscorVisual";
  const EMB_COSSIM_SOURCES_PATH = EMB_COSSIM_DATA_ROOT + "/semantic-image-sources.json";
  const EMB_COSSIM_FOCUS_X = 20 / 32;
  const EMB_COSSIM_FIXED_ZOOM = 0.06;
  const MAP_PCA_CENTER = { lon: -0.11559, lat: 51.51024 };
  const MAP_PCA_FOCUS_X = 20 / 32;
  const MAP_PCA_FOCUS_Y = 0.5;
  const MAP_PCA_MIN_AXIS_METERS = 2000 * 1.8;
  const MAP_PCA_MAX_AXIS_METERS = 32000 * 1.8;
  const MAP_PCA_FIXED_AXIS_BLEND = 0.75;
  const MAP_PCA_SCALE_WHEEL_LOG_STEP = Math.log(MAP_PCA_MAX_AXIS_METERS / MAP_PCA_MIN_AXIS_METERS) * 0.045;
  const MAP_PCA_MIN_ZOOM = 15;
  const MAP_PCA_MAX_ZOOM = 10;
  const MAP_PCA_EARTH_RADIUS_METERS = 6371008.8;
  const MAP_PCA_TILE_SIZE = 256;
  const MAP_PCA_RECORD_BYTES = 12;
  const MAP_PCA_BASE_POINT_RADIUS = 3;
  const MAP_PCA_CROSSFADE_HOLD_FRACTION = 0.2;
  const MAP_PCA_CROSSFADE_ACTIVE_FRACTION = 1 - MAP_PCA_CROSSFADE_HOLD_FRACTION;
  const MAP_PCA_WEB_MERCATOR_HALF_WORLD_METERS = 20037508.342789244;
  const MAP_PCA_GRID_VERTEX_FLOATS = 6;
  const MAP_PCA_GRID_TRANSPARENCY = 0.66;
  const MAP_PCA_GRID_LINE_WIDTH = 1.5;
  const MAP_PCA_GRID_LINE_COLOR = new Float32Array([1, 1, 1, 1]);
  const MAP_PCA_FULL_MERCATOR_BOUNDS = new Float32Array([0, 0, 1, 1]);
  const MAP_PCA_COLOR_MATRIX_IDENTITY = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
  const MAP_PCA_COLOR_MATRIX_SWAP_GB = new Float32Array([1, 0, 0, 0, 0, 1, 0, 1, 0]);
  const MAP_PCA_COLOR_MATRIX_SWAP_RG = new Float32Array([0, 1, 0, 1, 0, 0, 0, 0, 1]);
  const MAP_PCA_COLOR_MATRIX_SWAP_RG_THEN_GB = new Float32Array([0, 0, 1, 1, 0, 0, 0, 1, 0]);
  const MAP_PCA_COLOR_MATRIX_SWAP_RG_THEN_RB = new Float32Array([0, 1, 0, 0, 0, 1, 1, 0, 0]);
  const MAP_PCA_COLOR_MATRICES = {
    identity: MAP_PCA_COLOR_MATRIX_IDENTITY,
    swap_gb: MAP_PCA_COLOR_MATRIX_SWAP_GB,
    swap_rg: MAP_PCA_COLOR_MATRIX_SWAP_RG,
    swap_rg_then_gb: MAP_PCA_COLOR_MATRIX_SWAP_RG_THEN_GB,
    swap_rg_then_rb: MAP_PCA_COLOR_MATRIX_SWAP_RG_THEN_RB,
  };
  const MAP_PCA_GROUPED_MANIFEST_PATH = `${MAP_PCA_DATA_ROOT}/webmercator_grid_rgb48_grouped/manifest.json`;
  const MAP_PCA_GRID_MANIFEST_PATH = `${MAP_PCA_DATA_ROOT}/webmercator_grid_rgb48/manifest.json`;
  const MAP_PCA_LAYERS = [
    {
      id: "webmercator-center:wm02km_center",
      label: "2 km",
      radiusMeters: 2000,
      boundaryMeters: 2000 * 1.8,
      centerPath: "webmercator_grid_rgb48/2km/2km_0_0",
      groupedId: "wm02km_grid",
      colorMatrix: MAP_PCA_COLOR_MATRIX_SWAP_RG_THEN_RB,
      legacyIds: ["r02km_bbox", "wm02km_grid", "webmercator-grid:wm02km_grid"],
    },
    {
      id: "webmercator-center:wm04km_center",
      label: "4 km",
      radiusMeters: 4000,
      boundaryMeters: 4000 * 1.8,
      centerPath: "webmercator_grid_rgb48/4km/4km_0_0",
      groupedId: "wm04km_grid",
      colorMatrix: MAP_PCA_COLOR_MATRIX_SWAP_RG_THEN_RB,
      legacyIds: ["r04km_bbox", "wm04km_grid", "webmercator-grid:wm04km_grid"],
    },
    {
      id: "webmercator-center:wm08km_center",
      label: "8 km",
      radiusMeters: 8000,
      boundaryMeters: 8000 * 1.8,
      centerPath: "webmercator_grid_rgb48/8km/8km_0_0",
      groupedId: "wm08km_grid",
      colorMatrix: MAP_PCA_COLOR_MATRIX_SWAP_RG_THEN_RB,
      legacyIds: ["r08km_bbox", "wm08km_grid", "webmercator-grid:wm08km_grid"],
    },
    {
      id: "webmercator-center:wm16km_center",
      label: "16 km",
      radiusMeters: 16000,
      boundaryMeters: 16000 * 1.8,
      centerPath: "webmercator_grid_rgb48/16km/16km_0_0",
      groupedId: "wm16km_grid",
      colorMatrix: MAP_PCA_COLOR_MATRIX_SWAP_RG,
      legacyIds: ["r16km_bbox", "wm16km_grid", "webmercator-grid:wm16km_grid"],
    },
    {
      id: "webmercator-center:wm32km_all_london",
      label: "32 km",
      radiusMeters: 32000,
      boundaryMeters: 32000 * 1.8,
      centerPath: "webmercator_grid_rgb48/32km_all_london",
      groupedId: "wm32km_all_london",
      colorMatrix: MAP_PCA_COLOR_MATRIX_SWAP_RG,
      legacyIds: ["r32km_all_london", "wm32km_all_london", "webmercator-grid:wm32km_all_london"],
    },
  ].map((layer) => ({
    ...layer,
    binPath: `${MAP_PCA_DATA_ROOT}/${layer.centerPath}/points.bin`,
    manifestPath: `${MAP_PCA_DATA_ROOT}/${layer.centerPath}/points.json`,
  }));
  const MAP_PCA_INTERVAL_BOUNDARIES = [
    0,
    MAP_PCA_LAYERS[0].boundaryMeters,
    MAP_PCA_LAYERS[1].boundaryMeters,
    MAP_PCA_LAYERS[2].boundaryMeters,
    MAP_PCA_LAYERS[3].boundaryMeters,
    MAP_PCA_LAYERS[4].boundaryMeters,
    Number.POSITIVE_INFINITY,
  ];
  const mapPcaDataCache = {
    data: null,
    promise: null,
  };
  const dccLinkDataCache = {
    data: null,
    promise: null,
  };
  const pcaVisulDataCache = {
    data: null,
    promise: null,
  };
  const TURING_FOCUS_X = 20 / 32;
  const TURING_STEPS_PER_SECOND = 2;
  const TURING_RUNTIME_SPEED_MULTIPLIER = 2;
  const TURING_RULE_CODE = "1RB1LB_1LA0LC_1RZ1LD_1RD0RA";
  const TURING_HALT_STEPS = 107;
  const TURING_BUSY_ONES = 13;
  const TURING_SEED_ONES = 0;
  const TURING_TAPE_MIN = -34;
  const TURING_TAPE_MAX = 46;
  const TURING_REFERENCE_CRT_DEFAULTS = {
    enabled: true,
    smoothing: true,
    showShapes: false,
    pixelSize: 4,
    scanlineIntensity: 0.5,
    scanlineCount: 256,
    adaptiveIntensity: 0.3,
    brightness: 1.5,
    contrast: 1.05,
    saturation: 1.1,
    bloomIntensity: 0.5,
    bloomThreshold: 0.5,
    rgbShift: 1.0,
    vignetteStrength: 0.3,
    curvature: 0.1,
    flickerStrength: 0.01,
  };
  const TURING_REFERENCE_CRT_CONTROLS = [
    { key: "pixelSize", min: 1, max: 12 },
    { key: "scanlineIntensity", min: 0, max: 1 },
    { key: "scanlineCount", min: 50, max: 1200 },
    { key: "adaptiveIntensity", min: 0, max: 1 },
    { key: "brightness", min: 0.6, max: 1.8 },
    { key: "contrast", min: 0.6, max: 1.8 },
    { key: "saturation", min: 0, max: 2 },
    { key: "bloomIntensity", min: 0, max: 1.5 },
    { key: "bloomThreshold", min: 0, max: 1 },
    { key: "rgbShift", min: 0, max: 1 },
    { key: "vignetteStrength", min: 0, max: 2 },
    { key: "curvature", min: 0, max: 0.5 },
    { key: "flickerStrength", min: 0, max: 0.15 },
  ];
  const TURING_RULES = {
    A: {
      0: { write: 1, move: 1, next: "B" },
      1: { write: 1, move: -1, next: "B" },
    },
    B: {
      0: { write: 1, move: -1, next: "A" },
      1: { write: 0, move: -1, next: "C" },
    },
    C: {
      0: { write: 1, move: 1, next: "Z" },
      1: { write: 1, move: -1, next: "D" },
    },
    D: {
      0: { write: 1, move: 1, next: "D" },
      1: { write: 0, move: 1, next: "A" },
    },
  };
  const TURING_STATE_LABELS = {
    A: "A: launch sweep",
    B: "B: return sweep",
    C: "C: halt gate",
    D: "D: build run",
    Z: "Z: halted",
  };
  const turingRuntime = new Map();
  const STREETVIEW_DATA_ROOT =
    payload.streetviewDataRoot ||
    "data/screensaver-panos";
  const STREETVIEW_MANIFEST_PATH = payload.streetviewManifestPath || `${STREETVIEW_DATA_ROOT}/manifest.json`;
  const STREETVIEW_GRID_COLUMNS = 16;
  const STREETVIEW_GRID_ROWS = 5;
  const STREETVIEW_TILE_COUNT = STREETVIEW_GRID_COLUMNS * STREETVIEW_GRID_ROWS;
  const STREETVIEW_CITY_COLUMNS = STREETVIEW_GRID_COLUMNS / 2;
  const STREETVIEW_DEFAULT_FOV_RADIANS = degreesToRadians(45);
  const STREETVIEW_MIN_FOV_RADIANS = degreesToRadians(34);
  const STREETVIEW_MAX_FOV_RADIANS = degreesToRadians(66);
  const STREETVIEW_ZOOM_STEP_DEGREES = 6;
  const STREETVIEW_ZOOM_MAX_STEP_MULTIPLIER = 3;
  const STREETVIEW_ZOOM_STEP_DURATION_MS = 1000;
  const STREETVIEW_YAW_STEP_DEGREES = 45;
  const STREETVIEW_YAW_MAX_STEP_MULTIPLIER = 3;
  const STREETVIEW_YAW_STEP_DURATIONS_MS = [0, 2000, 3000, 4000];
  const STREETVIEW_PITCH_MIN_DEGREES = -20;
  const STREETVIEW_PITCH_MAX_DEGREES = 0;
  const STREETVIEW_PITCH_STEP_DEGREES = 10;
  const STREETVIEW_MIN_PITCH_RADIANS = degreesToRadians(STREETVIEW_PITCH_MIN_DEGREES);
  const STREETVIEW_MAX_PITCH_RADIANS = degreesToRadians(STREETVIEW_PITCH_MAX_DEGREES);
  const STREETVIEW_SWITCH_PROBABILITY_SCALE = 0.5;
  const STREETVIEW_MIN_IDLE_DELAY_MS = 1000;
  const STREETVIEW_MIN_BROWSE_ACTIONS_BEFORE_SWITCH = 2;
  const STREETVIEW_TILE_TRANSITION_INTERVAL_MS = 18;
  const STREETVIEW_TILE_TRANSITION_FADE_MS = 260;
  const STREETVIEW_PAGE_TRANSITION_MS =
    (STREETVIEW_TILE_COUNT - 1) * STREETVIEW_TILE_TRANSITION_INTERVAL_MS + STREETVIEW_TILE_TRANSITION_FADE_MS;
  const STREETVIEW_PRELOAD_CONCURRENCY = 12;
  const PAGE_WINDOW_SEQUENCE_TOTAL_MS = 3000;
  const PAGE_WINDOW_ITEM_ANIMATION_MS = 420;
  const PAGE_WINDOW_ITEM_STAGGER_MS = 55;
  const STUDIOS_AI_REVEAL_BATCH_SIZE = 5;
  const STUDIOS_AI_REVEAL_ITEM_INTERVAL_MS = 55;

  const stage = document.getElementById("stage");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const counter = document.getElementById("counter");
  const semanticLink = document.createElement("a");
  semanticLink.className = "semantic-webapp-link";
  semanticLink.textContent = "Semantic WebApp";
  semanticLink.title = "Open Semantic WebApp";
  semanticLink.hidden = true;
  semanticLink.addEventListener("click", (event) => {
    if (semanticLink.hidden || semanticLink.getAttribute("aria-hidden") === "true") event.preventDefault();
  });
  document.body.appendChild(semanticLink);
  const slides = Array.isArray(project.slides) ? project.slides : [];

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const lerp = (start, end, t) => start + (end - start) * t;
  const wrap01 = (value) => ((value % 1) + 1) % 1;
  const round = (value, digits = 3) => Number.parseFloat(Number(value).toFixed(digits));
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  let slideIndex = initialSlideIndex();
  let currentSurface = null;
  let transitionFromSlide = null;
  let specialCleanup = null;
  let navigationToken = 0;
  let isNavigating = false;
  let wheelAccumulator = 0;
  let lastWheelTurnAt = 0;
  let streetviewExitOverlay = null;
  let studiosAiRevealSlideId = null;
  let studiosAiRevealStep = 0;
  let studiosAiRevealTargetStep = 0;
  let studiosAiRevealTimer = null;
  const hiddenPreviewWindowIds = new Set();
  const previewWindowToggleTimers = new Map();
  const preloadPromises = new Map();
  const assetPreloadPromises = new Map();
  const projectionImagePromises = new Map();
  const streetviewManifestPromises = new Map();
  const streetviewImagePromises = new Map();
  const FADE_DURATION_MS = 460;

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function defaultTransform() {
    return { offsetX: 0, offsetY: 0, scale: 1, fit: "contain" };
  }

  function defaultPageTitleSlot() {
    return {
      enabled: false,
      text: "",
      fontFamily: PAGE_TITLE_DEFAULT_FONT,
      fontSize: PAGE_TITLE_DEFAULT_SIZE,
    };
  }

  function normalizePageTitleFontFamily(value) {
    const font = String(value || "");
    if (font === "Helvetica, Arial, sans-serif") return "'Helvetica Neue', Helvetica, Arial, sans-serif";
    return PAGE_TITLE_FONT_FAMILIES.some((item) => item.value === font) ? font : PAGE_TITLE_DEFAULT_FONT;
  }

  function normalizePageTitleSlot(source = {}) {
    const fontSize = Number(source.fontSize ?? PAGE_TITLE_DEFAULT_SIZE);
    return {
      ...defaultPageTitleSlot(),
      ...source,
      enabled: source.enabled === true,
      text: typeof source.text === "string" ? source.text : "",
      fontFamily: normalizePageTitleFontFamily(source.fontFamily),
      fontSize: clamp(Number.isFinite(fontSize) ? fontSize : PAGE_TITLE_DEFAULT_SIZE, 12, 180),
    };
  }

  function defaultPageTitle() {
    return {
      ...defaultPageTitleSlot(),
      left: defaultPageTitleSlot(),
      right: defaultPageTitleSlot(),
    };
  }

  function defaultDiagramMath() {
    return {
      scrolls: [null, null, null, null],
      overlay: null,
      duration: 18,
      gap: 6,
      fade: 18,
      overlayOpacity: 1,
    };
  }

  function defaultMapPca() {
    return {
      scaleMeters: MAP_PCA_MIN_AXIS_METERS,
      axisBlend: MAP_PCA_FIXED_AXIS_BLEND,
      lockedLayerId: null,
      offsetX: 0,
      offsetY: 0,
    };
  }

  function normalizeMapPcaLockedLayerId(value) {
    if (!value) return null;
    const id = String(value);
    const direct = MAP_PCA_LAYERS.find((layer) => layer.id === id);
    if (direct) return direct.id;
    const legacy = MAP_PCA_LAYERS.find((layer) => layer.legacyIds?.includes(id));
    return legacy ? legacy.id : null;
  }

  function defaultGlowShadow() {
    return {
      enabled: true,
      radius: 34,
      fadeoff: 26,
      opacity: 0.82,
    };
  }

  function isDiagramMathTitle(title = "") {
    return String(title).trim().toLowerCase() === "diagram-math";
  }

  function isDiagramMathSlide(slide) {
    return slide?.specialType === "diagram-math" || isDiagramMathTitle(slide?.title);
  }

  function isMapPcaTitle(title = "") {
    return String(title).trim().toLowerCase() === "map-pca";
  }

  function isMapPcaSlide(slide) {
    return slide?.specialType === "map-pca" || isMapPcaTitle(slide?.title);
  }

  function isTitleSpectrumTitle(title = "") {
    return String(title).trim().toLowerCase() === "title";
  }

  function isTitleSpectrumSlide(slide) {
    return slide?.specialType === "title-spectrum" || isTitleSpectrumTitle(slide?.title);
  }

  function isPcaVisulTitle(title = "") {
    return String(title).trim().toLowerCase() === "pcavisul";
  }

  function isPcaVisulSlide(slide) {
    return slide?.specialType === "pca-visul" || isPcaVisulTitle(slide?.title);
  }

  function isEmbCossimTitle(title = "") {
    return String(title).trim().toLowerCase() === "emb-cossim";
  }

  function isEmbCossimSlide(slide) {
    return slide?.specialType === "emb-cossim" || isEmbCossimTitle(slide?.title);
  }

  function isProjectionTitle(title = "") {
    return String(title).trim().toLowerCase() === "projection";
  }

  function isProjectionSlide(slide) {
    return slide?.specialType === "projection" || isProjectionTitle(slide?.title);
  }

  function isDccLinkTitle(title = "") {
    return String(title).trim().toLowerCase() === "dcc-link";
  }

  function isDccLinkSlide(slide) {
    return slide?.specialType === "dcc-link" || isDccLinkTitle(slide?.title);
  }

  function isStreetviewTitle(title = "") {
    const value = String(title).trim().toLowerCase();
    return value === "streetview" || value === "streetviews ?";
  }

  function isStreetviewSlide(slide) {
    return slide?.specialType === "streetview" || isStreetviewTitle(slide?.title);
  }

  function isSampleTitle(title = "") {
    return String(title).trim().toLowerCase() === "sample";
  }

  function isSampleSlide(slide) {
    return slide?.specialType === "sample" || isSampleTitle(slide?.title);
  }

  function isStudiosAiRevealSlide(slide) {
    return String(slide?.title || "").trim().toLowerCase() === "studios" && slide?.studiosAiReveal?.enabled !== false;
  }

  function isTuringMachineTitle(title = "") {
    return String(title).trim().toLowerCase() === "turing-machine";
  }

  function isTuringMachineSlide(slide) {
    return slide?.specialType === "turing-machine" || isTuringMachineTitle(slide?.title);
  }

  function isLockedSpecialSlide(slide) {
    return (
      isTitleSpectrumSlide(slide) ||
      isDiagramMathSlide(slide) ||
      isPcaVisulSlide(slide) ||
      isProjectionSlide(slide) ||
      isEmbCossimSlide(slide) ||
      isMapPcaSlide(slide) ||
      isDccLinkSlide(slide) ||
      isStreetviewSlide(slide) ||
      isSampleSlide(slide) ||
      isTuringMachineSlide(slide)
    );
  }

  function supportsPageTitleOverlay(slide) {
    return Boolean(slide && !slide.special && !isLockedSpecialSlide(slide));
  }

  function ensurePageTitle(slide) {
    const current = slide?.pageTitle || {};
    const hasLegacyTitle =
      current.enabled === true || typeof current.text === "string" || Boolean(current.fontFamily) || Number.isFinite(Number(current.fontSize));
    slide.pageTitle = {
      ...normalizePageTitleSlot(current),
      left: normalizePageTitleSlot(current.left && typeof current.left === "object" ? current.left : hasLegacyTitle ? current : {}),
      right: normalizePageTitleSlot(current.right && typeof current.right === "object" ? current.right : {}),
    };
    return slide.pageTitle;
  }

  function studiosAiRevealVisibleStep(slide) {
    if (!isStudiosAiRevealSlide(slide)) return slide?.windows?.length || 0;
    if (studiosAiRevealSlideId !== slide.id) return 0;
    return clamp(studiosAiRevealStep, 0, slide.windows?.length || 0);
  }

  function slidePageNumber(slide) {
    const index = slides.findIndex((item) => item.id === slide?.id);
    return index >= 0 ? index + 1 : 0;
  }

  function usesBoundWindowPageLogic(slide) {
    if (!slide || isStudiosAiRevealSlide(slide)) return false;
    if (isBrickHouseSpotlightSlide(slide)) return true;
    const pageNumber = slidePageNumber(slide);
    if (pageNumber === 34 || pageNumber === 39) return false;
    return (slide.windows || []).length === 1;
  }

  function usesIndependentWindowTransition(slide) {
    if (!slide || isStudiosAiRevealSlide(slide)) return false;
    return (slide.windows || []).length > 0 && !usesBoundWindowPageLogic(slide);
  }

  function usesSingleWindowClickToggle(slide) {
    const pageNumber = slidePageNumber(slide);
    return (pageNumber === 29 || pageNumber === 32) && (slide?.windows || []).length === 1;
  }

  function usesPreviewWindowClickToggle(slide) {
    return usesIndependentWindowTransition(slide) || usesSingleWindowClickToggle(slide);
  }

  function hasSpecialWheelInteraction(slide) {
    return (
      isStudiosAiRevealSlide(slide) ||
      isMapPcaSlide(slide) ||
      isPcaVisulSlide(slide) ||
      isProjectionSlide(slide) ||
      isEmbCossimSlide(slide)
    );
  }

  function previewWindowKey(slideId, windowId) {
    return `${slideId}:${windowId}`;
  }

  function pageWindowOrderMap(slide, skippedKeys = new Set()) {
    const entries = (slide?.windows || [])
      .filter((win) => !skippedKeys.has(previewWindowKey(slide.id, win.id)))
      .map((win) => previewWindowKey(slide.id, win.id));
    return new Map(shuffle(entries).map((key, index) => [key, index]));
  }

  function pageWindowStepDelay(orderMap) {
    const count = orderMap?.size || 0;
    return count > 1 ? PAGE_WINDOW_SEQUENCE_TOTAL_MS / count : 0;
  }

  function pageWindowTransitionTotal(orderMap) {
    const count = orderMap?.size || 0;
    return count ? Math.max(PAGE_WINDOW_ITEM_ANIMATION_MS, (count - 1) * pageWindowStepDelay(orderMap) + PAGE_WINDOW_ITEM_ANIMATION_MS) : 0;
  }

  function pageWindowTransitionDuration(fromSlide, toSlide) {
    const outgoingCount = usesIndependentWindowTransition(fromSlide) ? fromSlide.windows.length : 0;
    const incomingCount = usesIndependentWindowTransition(toSlide) ? toSlide.windows.length : 0;
    const outgoingMs = outgoingCount
      ? Math.max(PAGE_WINDOW_ITEM_ANIMATION_MS, ((outgoingCount - 1) * PAGE_WINDOW_SEQUENCE_TOTAL_MS) / outgoingCount + PAGE_WINDOW_ITEM_ANIMATION_MS)
      : 0;
    const incomingMs = incomingCount
      ? Math.max(PAGE_WINDOW_ITEM_ANIMATION_MS, ((incomingCount - 1) * PAGE_WINDOW_SEQUENCE_TOTAL_MS) / incomingCount + PAGE_WINDOW_ITEM_ANIMATION_MS)
      : 0;
    return Math.max(outgoingMs, incomingMs);
  }

  function transitionWindowDelay(options, slide, win) {
    if (!options?.transitionRole || !options.orderMap) return null;
    const key = previewWindowKey(slide.id, win.id);
    const order = options.orderMap.get(key);
    if (!Number.isFinite(order)) return options.transitionRole === "out" ? null : 0;
    return order * pageWindowStepDelay(options.orderMap);
  }

  function ensureGlowShadow() {
    const current = project.glowShadow || project.shadow || {};
    const radius = Number(current.radius ?? 34);
    const fadeoff = Number(current.fadeoff ?? 26);
    const opacity = Number(current.opacity ?? 0.82);
    project.glowShadow = {
      ...defaultGlowShadow(),
      ...current,
      enabled: current.enabled !== false,
      radius: clamp(Number.isFinite(radius) ? radius : 34, 0, 240),
      fadeoff: clamp(Number.isFinite(fadeoff) ? fadeoff : 26, 0, 240),
      opacity: clamp(Number.isFinite(opacity) ? opacity : 0.82, 0, 1),
    };
    return project.glowShadow;
  }

  function ensureDiagramMath(slide) {
    const current = slide.diagramMath || {};
    slide.specialType = "diagram-math";
    slide.special = false;
    slide.ratioW = 16;
    slide.ratioH = 9;
    slide.diagramMath = {
      ...defaultDiagramMath(),
      ...current,
      scrolls: Array.from({ length: 4 }, (_, index) => current.scrolls?.[index] || null),
      duration: Number(current.duration || 18),
      gap: Number(current.gap ?? 6),
      fade: Number(current.fade ?? 18),
      overlayOpacity: Number(current.overlayOpacity ?? 1),
    };
    return slide.diagramMath;
  }

  function ensureMapPca(slide) {
    const current = slide.mapPca || {};
    const scaleMeters = Number(current.scaleMeters ?? current.scaleAxisMeters ?? MAP_PCA_MIN_AXIS_METERS);
    const lockedLayerId = normalizeMapPcaLockedLayerId(current.lockedLayerId);
    const offsetX = Number(current.offsetX ?? 0);
    const offsetY = Number(current.offsetY ?? 0);
    slide.specialType = "map-pca";
    slide.special = false;
    slide.ratioW = 16;
    slide.ratioH = 9;
    slide.mapPca = {
      ...defaultMapPca(),
      ...current,
      scaleMeters: clamp(
        Number.isFinite(scaleMeters) ? scaleMeters : MAP_PCA_MIN_AXIS_METERS,
        MAP_PCA_MIN_AXIS_METERS,
        MAP_PCA_MAX_AXIS_METERS,
      ),
      axisBlend: MAP_PCA_FIXED_AXIS_BLEND,
      lockedLayerId,
      offsetX: Number.isFinite(offsetX) ? offsetX : 0,
      offsetY: Number.isFinite(offsetY) ? offsetY : 0,
    };
    return slide.mapPca;
  }

  function defaultTitleSpectrum() {
    return { overlay: null };
  }

  function defaultSample() {
    return {
      overlay: null,
      transform: defaultTransform(),
      radius: 42,
      feather: 18,
      opacity: 1,
    };
  }

  function ensureTitleSpectrum(slide) {
    const current = slide.titleSpectrum || {};
    slide.specialType = "title-spectrum";
    slide.special = false;
    slide.ratioW = 16;
    slide.ratioH = 9;
    slide.titleSpectrum = {
      ...defaultTitleSpectrum(),
      ...current,
      overlay: current.overlay || null,
    };
    return slide.titleSpectrum;
  }

  function ensureSample(slide) {
    const current = slide.sample || {};
    const defaults = defaultSample();
    const radius = Number(current.radius ?? defaults.radius);
    const feather = Number(current.feather ?? defaults.feather);
    const opacity = Number(current.opacity ?? defaults.opacity);
    slide.title = "SAMPLE";
    slide.specialType = "sample";
    slide.special = false;
    slide.ratioW = 16;
    slide.ratioH = 9;
    slide.sample = {
      ...defaults,
      ...current,
      overlay: current.overlay || null,
      transform: { ...defaultTransform(), ...(current.transform || {}) },
      radius: clamp(Number.isFinite(radius) ? radius : defaults.radius, 4, 140),
      feather: clamp(Number.isFinite(feather) ? feather : defaults.feather, 0, 120),
      opacity: clamp(Number.isFinite(opacity) ? opacity : defaults.opacity, 0, 1),
    };
    return slide.sample;
  }

  function defaultPcaVisul() {
    return {
      red: 1,
      green: 1,
      blue: 1,
      map: 0,
    };
  }

  function ensurePcaVisul(slide) {
    const current = slide.pcaVisul || {};
    const defaults = defaultPcaVisul();
    slide.specialType = "pca-visul";
    slide.special = false;
    slide.ratioW = 16;
    slide.ratioH = 9;
    slide.pcaVisul = {
      red: clamp(Number(current.red ?? defaults.red), 0, 1),
      green: clamp(Number(current.green ?? defaults.green), 0, 1),
      blue: clamp(Number(current.blue ?? defaults.blue), 0, 1),
      map: clamp(Number(current.map ?? defaults.map), 0, 1),
    };
    return slide.pcaVisul;
  }

  function defaultEmbCossim() {
    return {
      displayMode: 2,
    };
  }

  function defaultProjection() {
    return {
      morph: 0,
      zoom: 0.25,
      imagePath: PROJECTION_IMAGE_PATH,
    };
  }

  function ensureEmbCossim(slide) {
    const current = slide.embCossim || {};
    const displayMode = Math.round(Number(current.displayMode ?? 2));
    slide.title = "EMB-COSSIM";
    slide.specialType = "emb-cossim";
    slide.special = false;
    slide.ratioW = 16;
    slide.ratioH = 9;
    slide.embCossim = {
      ...defaultEmbCossim(),
      ...current,
      displayMode: clamp(Number.isFinite(displayMode) ? displayMode : 2, 1, 4),
    };
    return slide.embCossim;
  }

  function ensureProjection(slide) {
    const current = slide.projection || {};
    const defaults = defaultProjection();
    const morph = Number(current.morph ?? defaults.morph);
    const zoom = Number(current.zoom ?? defaults.zoom);
    slide.title = "PROJECTION";
    slide.specialType = "projection";
    slide.special = false;
    slide.ratioW = 16;
    slide.ratioH = 9;
    slide.projection = {
      ...defaults,
      ...current,
      morph: clamp(Number.isFinite(morph) ? morph : defaults.morph, 0, 1),
      zoom: clamp(Number.isFinite(zoom) ? zoom : defaults.zoom, 0, 1),
      imagePath: typeof current.imagePath === "string" && current.imagePath ? current.imagePath : PROJECTION_IMAGE_PATH,
    };
    return slide.projection;
  }

  function defaultDccLink() {
    return {
      worldPath: DCC_LINK_WORLD_PATH,
      flowPath: DCC_LINK_FLOW_PATH,
    };
  }

  function defaultStreetview() {
    return {
      manifestPath: STREETVIEW_MANIFEST_PATH,
    };
  }

  function ensureDccLink(slide) {
    const current = slide.dccLink || {};
    slide.specialType = "dcc-link";
    slide.special = false;
    slide.ratioW = 16;
    slide.ratioH = 9;
    slide.dccLink = {
      ...defaultDccLink(),
      ...current,
      worldPath: typeof current.worldPath === "string" && current.worldPath ? current.worldPath : DCC_LINK_WORLD_PATH,
      flowPath: typeof current.flowPath === "string" && current.flowPath ? current.flowPath : DCC_LINK_FLOW_PATH,
    };
    return slide.dccLink;
  }

  function ensureStreetview(slide) {
    const current = slide.streetview || {};
    slide.title = "STREETVIEW";
    slide.specialType = "streetview";
    slide.special = false;
    slide.ratioW = 16;
    slide.ratioH = 9;
    slide.streetview = {
      ...defaultStreetview(),
      ...current,
      manifestPath:
        typeof current.manifestPath === "string" && current.manifestPath ? current.manifestPath : STREETVIEW_MANIFEST_PATH,
    };
    return slide.streetview;
  }

  function normalizeTuringReferenceCrt(current = {}) {
    const normalized = {
      ...TURING_REFERENCE_CRT_DEFAULTS,
      ...current,
      enabled: current.enabled !== false,
      smoothing: current.smoothing !== false,
      showShapes: current.showShapes === true,
    };
    TURING_REFERENCE_CRT_CONTROLS.forEach((control) => {
      const value = Number(current[control.key] ?? TURING_REFERENCE_CRT_DEFAULTS[control.key]);
      normalized[control.key] = clamp(
        Number.isFinite(value) ? value : TURING_REFERENCE_CRT_DEFAULTS[control.key],
        control.min,
        control.max,
      );
    });
    return normalized;
  }

  function defaultTuringMachine() {
    return {
      speed: TURING_STEPS_PER_SECOND,
      seedOnes: TURING_SEED_ONES,
      cycleSteps: TURING_HALT_STEPS,
      cycleStart: 0,
      haltSteps: TURING_HALT_STEPS,
      busyOnes: TURING_BUSY_ONES,
      ruleCode: TURING_RULE_CODE,
      hideRotors: false,
      referenceCrt: { ...TURING_REFERENCE_CRT_DEFAULTS },
    };
  }

  function ensureTuringMachine(slide) {
    const current = slide.turingMachine || {};
    const speed = Number(current.speed ?? TURING_STEPS_PER_SECOND);
    slide.specialType = "turing-machine";
    slide.special = false;
    slide.ratioW = 16;
    slide.ratioH = 9;
    slide.turingMachine = {
      ...defaultTuringMachine(),
      ...current,
      speed: clamp(Number.isFinite(speed) ? speed : TURING_STEPS_PER_SECOND, 0.25, 12),
      seedOnes: TURING_SEED_ONES,
      cycleSteps: TURING_HALT_STEPS,
      cycleStart: 0,
      haltSteps: TURING_HALT_STEPS,
      busyOnes: TURING_BUSY_ONES,
      ruleCode: TURING_RULE_CODE,
      hideRotors: current.hideRotors === true,
      referenceCrt: normalizeTuringReferenceCrt(current.referenceCrt),
    };
    return slide.turingMachine;
  }

  function initialSlideIndex() {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("slide") || window.location.hash.replace(/^#/, "");
    if (!requested) return 0;
    const byId = slides.findIndex((slide) => slide.id === requested || slide.title === requested);
    if (byId >= 0) return byId;
    const byNumber = Number(requested);
    if (Number.isFinite(byNumber)) return clamp(Math.round(byNumber) - 1, 0, Math.max(0, slides.length - 1));
    return 0;
  }

  function localFileURL(sourcePath) {
    const normalized = String(sourcePath || "").replaceAll("\\", "/");
    if (!normalized) return "";
    if (/^(?:https?:|data:|blob:)/i.test(normalized)) return normalized;
    if (/^[A-Za-z]:\//.test(normalized) || normalized.startsWith("//")) return "";
    return normalized.split("/").map((part) => encodeURIComponent(part)).join("/");
  }

  function mediaUrl(mediaId) {
    const sourcePath = mediaSources[mediaId];
    return sourcePath ? localFileURL(sourcePath) : "";
  }

  function isPngMedia(media) {
    if (!media || media.kind !== "image") return false;
    return /png/i.test(media.mime || "") || /\.png$/i.test(media.name || media.path || "");
  }

  function windowUsesAlphaMedia(win) {
    return isPngMedia(project.media?.[win?.mediaId]);
  }

  function brickHouseSpotlightPage(slide) {
    const match = String(slide?.title || "")
      .trim()
      .toLowerCase()
      .match(/^brick\s*\/\s*house\s*([23])$/);
    return match ? Number(match[1]) : 0;
  }

  function isBrickHouseSpotlightSlide(slide) {
    return Boolean(brickHouseSpotlightPage(slide) || slide?.brickHouseSpotlight?.uploadSides?.length);
  }

  function defaultBrickHouseSpotlight(slide) {
    const page = brickHouseSpotlightPage(slide) || 2;
    const preset = BRICK_HOUSE_SPOTLIGHT_PRESETS[page] || BRICK_HOUSE_SPOTLIGHT_PRESETS[2];
    return {
      ...BRICK_HOUSE_SPOTLIGHT_DEFAULT,
      markers: {
        left: { ...preset.left },
        right: { ...preset.right },
      },
    };
  }

  function normalizeBrickHouseMarker(marker, fallback, side) {
    const minX = side === "right" ? 50 : 0;
    const maxX = side === "left" ? 50 : 100;
    const x = Number(marker?.x ?? fallback.x);
    const y = Number(marker?.y ?? fallback.y);
    return {
      x: clamp(Number.isFinite(x) ? x : fallback.x, minX, maxX),
      y: clamp(Number.isFinite(y) ? y : fallback.y, 0, 100),
    };
  }

  function brickHouseSpotlightConfig(slide) {
    const defaults = defaultBrickHouseSpotlight(slide);
    const current = slide?.brickHouseSpotlight || {};
    const markerSource = current.version === BRICK_HOUSE_SPOTLIGHT_VERSION ? current.markers : null;
    const uploadLocalMarkers = Array.isArray(current.uploadSides) && current.uploadSides.length > 0;
    const radius = Number(current.radius ?? defaults.radius);
    const feather = Number(current.feather ?? defaults.feather);
    const opacity = Number(current.opacity ?? defaults.opacity);
    const glow = Number(current.glow ?? defaults.glow);
    return {
      ...defaults,
      ...current,
      version: BRICK_HOUSE_SPOTLIGHT_VERSION,
      enabled: current.enabled !== false,
      opacity: clamp(Number.isFinite(opacity) ? opacity : defaults.opacity, 0, 0.95),
      radius: clamp(Number.isFinite(radius) ? radius : defaults.radius, 8, 220),
      feather: clamp(Number.isFinite(feather) ? feather : defaults.feather, 0, 260),
      glow: clamp(Number.isFinite(glow) ? glow : defaults.glow, 0, 1),
      markers: {
        left: normalizeBrickHouseMarker(markerSource?.left, defaults.markers.left, uploadLocalMarkers ? "upload" : "left"),
        right: normalizeBrickHouseMarker(markerSource?.right, defaults.markers.right, uploadLocalMarkers ? "upload" : "right"),
      },
    };
  }

  function hiddenBrickHouseSpotlightConfig(config) {
    return {
      ...config,
      opacity: 0,
      glow: 0,
      markers: {
        left: { ...config.markers.left },
        right: { ...config.markers.right },
      },
    };
  }

  function brickHouseSpotlightTransitionFrom(fromSlide, toConfig) {
    if (!isBrickHouseSpotlightSlide(fromSlide)) return hiddenBrickHouseSpotlightConfig(toConfig);
    const fromConfig = brickHouseSpotlightConfig(fromSlide);
    return fromConfig.enabled ? fromConfig : hiddenBrickHouseSpotlightConfig(toConfig);
  }

  function slideMediaIds(slide) {
    const ids = new Set();
    if (!slide) return ids;
    const background = slide.background || {};
    ["strip", "left", "right"].forEach((slot) => {
      if (background[slot]) ids.add(background[slot]);
    });
    (slide.windows || []).forEach((win) => {
      if (win.mediaId) ids.add(win.mediaId);
    });
    (slide.diagramMath?.scrolls || []).forEach((mediaId) => {
      if (mediaId) ids.add(mediaId);
    });
    if (slide.diagramMath?.overlay) ids.add(slide.diagramMath.overlay);
    if (slide.titleSpectrum?.overlay) ids.add(slide.titleSpectrum.overlay);
    if (slide.sample?.overlay) ids.add(slide.sample.overlay);
    return ids;
  }

  function preloadAsset(mediaId) {
    const media = mediaId ? project.media?.[mediaId] : null;
    const url = mediaId ? mediaUrl(mediaId) : "";
    if (!media || !url) return Promise.resolve();
    if (assetPreloadPromises.has(url)) return assetPreloadPromises.get(url);

    const promise = new Promise((resolve) => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        resolve();
      };
      window.setTimeout(finish, 15000);
      if (media.kind === "video") {
        const video = document.createElement("video");
        video.preload = "auto";
        video.muted = true;
        video.playsInline = true;
        video.addEventListener("loadeddata", finish, { once: true });
        video.addEventListener("error", finish, { once: true });
        video.src = url;
        video.load();
        return;
      }
      const image = new Image();
      image.decoding = "async";
      image.onload = finish;
      image.onerror = finish;
      image.src = url;
      if (image.decode) image.decode().then(finish).catch(finish);
    });

    assetPreloadPromises.set(url, promise);
    return promise;
  }

  function getStreetviewManifest(config = {}) {
    const manifestPath = config.manifestPath || STREETVIEW_MANIFEST_PATH;
    if (!streetviewManifestPromises.has(manifestPath)) {
      const manifestPromise = fetchStreetviewManifest({ ...config, manifestPath }).then((manifest) =>
        normalizeStreetviewManifest(manifest, { ...config, manifestPath }),
      ).catch((error) => {
        streetviewManifestPromises.delete(manifestPath);
        throw error;
      });
      streetviewManifestPromises.set(manifestPath, manifestPromise);
    }
    return streetviewManifestPromises.get(manifestPath);
  }

  function preloadStreetviewImage(sourcePath) {
    const url = localFileURL(sourcePath);
    if (streetviewImagePromises.has(url)) return streetviewImagePromises.get(url);
    const promise = loadStreetviewImage(url).catch((error) => {
      streetviewImagePromises.delete(url);
      throw error;
    });
    streetviewImagePromises.set(url, promise);
    return promise;
  }

  async function preloadStreetviewImages(items, onProgress = null) {
    const total = items.length;
    if (!total) return;
    let cursor = 0;
    let loaded = 0;
    const workerCount = Math.min(STREETVIEW_PRELOAD_CONCURRENCY, total);
    const workers = Array.from({ length: workerCount }, async () => {
      while (cursor < total) {
        const item = items[cursor];
        cursor += 1;
        await preloadStreetviewImage(item.sourcePath);
        loaded += 1;
        if (onProgress) onProgress(loaded, total);
      }
    });
    await Promise.all(workers);
  }

  async function preloadStreetviewAssets(config) {
    const manifest = await getStreetviewManifest(config);
    await preloadStreetviewImages(manifest.items);
  }

  function loadProjectionImage(imagePath = PROJECTION_IMAGE_PATH) {
    const sourcePath = imagePath || PROJECTION_IMAGE_PATH;
    const url = localFileURL(sourcePath);
    if (projectionImagePromises.has(url)) return projectionImagePromises.get(url);
    const promise = new Promise((resolve, reject) => {
      const image = new Image();
      image.decoding = "async";
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Failed to load PROJECTION panorama image"));
      image.src = url;
    }).catch((error) => {
      projectionImagePromises.delete(url);
      throw error;
    });
    projectionImagePromises.set(url, promise);
    return promise;
  }

  function preloadSlide(index) {
    if (index < 0 || index >= slides.length) return Promise.resolve();
    if (preloadPromises.has(index)) return preloadPromises.get(index);

    const slide = slides[index];
    const tasks = Array.from(slideMediaIds(slide), (mediaId) => preloadAsset(mediaId));
    if (isMapPcaSlide(slide)) {
      tasks.push(getMapPcaPointCloudData().then(() => undefined));
    }
    if (isPcaVisulSlide(slide)) {
      tasks.push(getPcaVisulData().then(() => undefined));
    }
    if (isProjectionSlide(slide)) {
      tasks.push(loadProjectionImage(ensureProjection(slide).imagePath).then(() => undefined));
    }
    if (isDccLinkSlide(slide)) {
      tasks.push(getDccLinkData(ensureDccLink(slide)).then(() => undefined));
    }
    if (isStreetviewSlide(slide)) {
      tasks.push(preloadStreetviewAssets(ensureStreetview(slide)));
    }
    const promise = Promise.allSettled(tasks).then(() => undefined);
    preloadPromises.set(index, promise);
    return promise;
  }

  function preloadUpcomingSlide() {
    preloadSlide(slideIndex + 1);
  }

  function preloadPrioritySlides() {
    slides.forEach((slide, index) => {
      if (isStreetviewSlide(slide)) preloadSlide(index);
      if (isProjectionSlide(slide)) preloadSlide(index);
    });
  }

  function applyGlowShadowVars() {
    const shadow = ensureGlowShadow();
    const radius = shadow.enabled ? Math.max(0, Number(shadow.radius || 0)) : 0;
    const fadeoff = shadow.enabled ? Math.max(0, Number(shadow.fadeoff || 0)) : 0;
    const opacity = shadow.enabled ? clamp(Number(shadow.opacity ?? 0.82), 0, 1) : 0;
    if (!radius || !opacity) {
      stage.style.setProperty("--glow-shadow-box", "none");
      stage.style.setProperty("--glow-shadow-filter", "none");
      return;
    }

    const blur = Math.min(radius, Math.max(0, fadeoff));
    const spread = Math.max(0, radius - blur);
    const alpha = round(opacity, 3);
    const softAlpha = round(opacity * 0.42, 3);
    stage.style.setProperty("--glow-shadow-box", `0 0 ${blur}px ${spread}px rgba(0, 0, 0, ${alpha})`);
    stage.style.setProperty(
      "--glow-shadow-filter",
      `drop-shadow(0 0 ${Math.max(1, blur)}px rgba(0, 0, 0, ${alpha})) drop-shadow(0 0 ${Math.max(
        1,
        radius,
      )}px rgba(0, 0, 0, ${softAlpha}))`,
    );
  }

  function transformCss(transform = defaultTransform()) {
    return `translate(${transform.offsetX || 0}%, ${transform.offsetY || 0}%) scale(${transform.scale || 1})`;
  }

  function applyStudiosAiCenterClip(el, win) {
    const left = Number(win?.x || 0);
    const width = Math.max(0.001, Number(win?.w || 0));
    const clipLeft = clamp(((50 - left) / width) * 100, 0, 100);
    if (clipLeft <= 0) return;
    el.style.clipPath = `inset(0 0 0 ${round(clipLeft, 3)}%)`;
    el.dataset.studiosClipLeft = String(round(clipLeft, 3));
  }

  function mediaElement(mediaId, transform, emptyText) {
    const crop = document.createElement("div");
    crop.className = "media-crop";
    const media = mediaId ? project.media?.[mediaId] : null;
    const url = mediaId ? mediaUrl(mediaId) : "";

    if (!media || !url) {
      const empty = document.createElement("div");
      empty.className = "empty-media";
      empty.textContent = media ? "Media path not resolved" : emptyText;
      crop.appendChild(empty);
      return crop;
    }

    const el = document.createElement(media.kind === "video" ? "video" : "img");
    el.className = "media-content";
    el.src = url;
    el.style.objectFit = "contain";
    el.style.transform = transformCss(transform);
    el.dataset.mediaContent = "true";
    if (media.kind === "video") {
      el.muted = true;
      el.loop = true;
      el.autoplay = true;
      el.playsInline = true;
      el.preload = "metadata";
    } else {
      el.alt = media.name || "";
      el.draggable = false;
    }
    crop.appendChild(el);
    return crop;
  }

  function brickHouseSpotlightCanvas(config, fromConfig = null, animate = false) {
    const canvas = document.createElement("canvas");
    canvas.className = "brick-house-spotlight-canvas";
    canvas.width = BRICK_HOUSE_SPOTLIGHT_STAGE.width;
    canvas.height = BRICK_HOUSE_SPOTLIGHT_STAGE.height * 2;
    if (animate && fromConfig) animateBrickHouseSpotlight(canvas, fromConfig, config);
    else drawBrickHouseSpotlight(canvas, config);
    return canvas;
  }

  function brickHouseSpotlightSides(config) {
    const sides = Array.isArray(config?.uploadSides) ? config.uploadSides.filter((side) => side === "left" || side === "right") : [];
    return sides.length ? sides : ["left", "right"];
  }

  function drawBrickHouseSpotlight(canvas, config) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    if (!config?.enabled) return;

    ctx.save();
    ctx.fillStyle = `rgba(0, 0, 0, ${config.opacity})`;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = "destination-out";
    brickHouseSpotlightSides(config).forEach((side) => {
      const marker = config.markers[side];
      const x = (marker.x / 100) * width;
      const y = (marker.y / 100) * height;
      const spotlightScale = height / BRICK_HOUSE_SPOTLIGHT_STAGE.height;
      const radius = config.radius * spotlightScale;
      const feather = config.feather * spotlightScale;
      const gradient = ctx.createRadialGradient(x, y, Math.max(0.01, radius * 0.2), x, y, radius + feather);
      gradient.addColorStop(0, "rgba(0, 0, 0, 1)");
      gradient.addColorStop(Math.min(0.98, radius / Math.max(1, radius + feather)), "rgba(0, 0, 0, 0.98)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    });
    ctx.globalCompositeOperation = "source-over";
    brickHouseSpotlightSides(config).forEach((side) => {
      const marker = config.markers[side];
      const x = (marker.x / 100) * width;
      const y = (marker.y / 100) * height;
      const glowRadius = Math.max(config.radius * 1.05, 24);
      const glow = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
      glow.addColorStop(0, `rgba(255, 235, 150, ${config.glow})`);
      glow.addColorStop(0.32, `rgba(255, 220, 105, ${config.glow * 0.42})`);
      glow.addColorStop(1, "rgba(255, 220, 105, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = `rgba(255, 240, 180, ${Math.min(0.72, config.glow + 0.22)})`;
      ctx.lineWidth = 1.5 * (height / BRICK_HOUSE_SPOTLIGHT_STAGE.height);
      ctx.beginPath();
      ctx.arc(x, y, Math.max(7, config.radius * 0.13), 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.restore();
  }

  function animateBrickHouseSpotlight(canvas, fromConfig, toConfig) {
    const startedAt = performance.now();
    const duration = FADE_DURATION_MS + 300;
    const tick = (now) => {
      if (!canvas.isConnected) return;
      const t = clamp((now - startedAt) / duration, 0, 1);
      drawBrickHouseSpotlight(canvas, lerpBrickHouseSpotlight(fromConfig, toConfig, t));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function lerpBrickHouseSpotlight(fromConfig, toConfig, t) {
    const lerpMarker = (side) => ({
      x: lerp(fromConfig.markers[side].x, toConfig.markers[side].x, t),
      y: lerp(fromConfig.markers[side].y, toConfig.markers[side].y, t),
    });
    return {
      ...toConfig,
      opacity: lerp(fromConfig.opacity, toConfig.opacity, t),
      radius: lerp(fromConfig.radius, toConfig.radius, t),
      feather: lerp(fromConfig.feather, toConfig.feather, t),
      glow: lerp(fromConfig.glow, toConfig.glow, t),
      markers: {
        left: lerpMarker("left"),
        right: lerpMarker("right"),
      },
    };
  }

  function easeInOutCubic(value) {
    const t = clamp(value, 0, 1);
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function backgroundSlot(slot, slide) {
    const el = document.createElement("div");
    el.className = "bg-slot";
    el.dataset.slot = slot;
    const transforms = slide.background?.transforms || {};
    const label = slot === "strip" ? "32:9 background" : slot === "left" ? "Left background" : "Right background";
    el.appendChild(mediaElement(slide.background?.[slot], transforms[slot] || defaultTransform(), label));
    return el;
  }

  function pageTitleConfigForSlot(slide, slot) {
    const pageTitle = ensurePageTitle(slide);
    if (slot === "left" || slot === "right") return pageTitle[slot] || defaultPageTitleSlot();
    return pageTitle;
  }

  function pageTitleOverlay(slide, slot = "strip") {
    if (!supportsPageTitleOverlay(slide)) return null;
    const config = pageTitleConfigForSlot(slide, slot);
    if (!config.enabled) return null;
    const text = String(config.text || slide.title || "").trim();
    if (!text) return null;
    const el = document.createElement("div");
    el.className = "page-title-overlay";
    if (slot === "left" || slot === "right") el.classList.add(`is-${slot}`);
    el.dataset.titleSlot = slot;
    el.textContent = text;
    el.style.fontFamily = config.fontFamily;
    el.style.fontSize = `${round((config.fontSize / 1280) * 100, 5)}cqw`;
    return el;
  }

  function pageTitleOverlays(slide) {
    if (!supportsPageTitleOverlay(slide)) return [];
    const slots = slide.background?.mode === "split" ? ["left", "right"] : ["strip"];
    return slots.map((slot) => pageTitleOverlay(slide, slot)).filter(Boolean);
  }

  function createPageWindowTransition(fromSlide, toSlide) {
    if (!usesIndependentWindowTransition(fromSlide) && !usesIndependentWindowTransition(toSlide)) return null;
    const outgoingOrder = usesIndependentWindowTransition(fromSlide)
      ? pageWindowOrderMap(fromSlide, hiddenPreviewWindowIds)
      : new Map();
    const incomingOrder = usesIndependentWindowTransition(toSlide) ? pageWindowOrderMap(toSlide) : new Map();
    return {
      fromSlide,
      fromSlideId: fromSlide?.id || null,
      toSlideId: toSlide?.id || null,
      outgoingOrder,
      incomingOrder,
      totalMs: Math.max(pageWindowTransitionTotal(outgoingOrder), pageWindowTransitionTotal(incomingOrder)),
    };
  }

  function currentWindowTransitionOptions(slide, transition) {
    if (!transition || transition.toSlideId !== slide?.id || !usesIndependentWindowTransition(slide)) return {};
    return { transitionRole: "in", orderMap: transition.incomingOrder };
  }

  function renderOutgoingWindowTransition(root, transition) {
    if (!transition?.fromSlideId || !transition.fromSlide || !usesIndependentWindowTransition(transition.fromSlide)) return;
    renderWindowLayers(root, transition.fromSlide, { transitionRole: "out", orderMap: transition.outgoingOrder });
  }

  function render(animate = true) {
    const slide = slides[slideIndex];
    const previousSurface = currentSurface;
    const previousCleanup = specialCleanup;
    const shouldAnimate = Boolean(animate && previousSurface);
    const fromSlide = shouldAnimate ? transitionFromSlide : null;
    const streetviewExit = shouldAnimate && isStreetviewSlide(fromSlide);
    const streetviewEnter = shouldAnimate && !streetviewExit && isStreetviewSlide(slide);
    const pageWindowTransition = shouldAnimate && !streetviewExit ? createPageWindowTransition(fromSlide, slide) : null;
    if (streetviewExit && previousSurface) captureStreetviewExitOverlay(previousSurface);
    transitionFromSlide = null;
    specialCleanup = null;

    if (!shouldAnimate) {
      if (previousCleanup) previousCleanup();
      stage.replaceChildren();
    } else if (streetviewExit) {
      if (previousCleanup) previousCleanup();
      if (previousSurface?.parentNode === stage) previousSurface.remove();
    } else {
      previousSurface.classList.add("is-leaving");
    }

    stage.className = "stage";
    stage.classList.add("is-play-mode");
    const surface = document.createElement("div");
    surface.className = shouldAnimate && !streetviewExit ? "slide-surface is-entering" : "slide-surface";
    const uploadTitleFit = isTitleSpectrumSlide(slide);
    const uploadDiagramWidthFit = isDiagramMathSlide(slide);
    const uploadSpecialCrop = isMapPcaSlide(slide) || isPcaVisulSlide(slide) || isProjectionSlide(slide) || isEmbCossimSlide(slide) || isDccLinkSlide(slide) || isStreetviewSlide(slide) || isTuringMachineSlide(slide);
    surface.classList.add(uploadTitleFit ? "is-upload-title-fit" : uploadDiagramWidthFit ? "is-upload-diagram-width-fit" : uploadSpecialCrop ? "is-upload-special-crop" : "is-upload-normal-crop");
    if (slide.uploadSideFull) surface.classList.add("is-upload-side-full");
    surface.classList.toggle("is-streetview-enter", streetviewEnter);
    surface.classList.toggle("is-window-transition", Boolean(pageWindowTransition));
    currentSurface = surface;

    if (!slide) {
      surface.appendChild(emptyStage("No slides"));
      stage.appendChild(surface);
      updateNav();
      return;
    }

    stage.classList.toggle("is-special", Boolean(slide.special));
    stage.classList.toggle("is-diagram-math", isDiagramMathSlide(slide));
    stage.classList.toggle("is-title-spectrum", isTitleSpectrumSlide(slide));
    stage.classList.toggle("is-map-pca", isMapPcaSlide(slide));
    stage.classList.toggle("is-pca-visul", isPcaVisulSlide(slide));
    stage.classList.toggle("is-emb-cossim", isEmbCossimSlide(slide));
    stage.classList.toggle("is-projection", isProjectionSlide(slide));
    stage.classList.toggle("is-dcc-link", isDccLinkSlide(slide));
    stage.classList.toggle("is-streetview", isStreetviewSlide(slide));
    stage.classList.toggle("is-sample", isSampleSlide(slide));
    stage.classList.toggle("is-studios-ai-reveal", isStudiosAiRevealSlide(slide));
    stage.classList.toggle("is-turing-machine", isTuringMachineSlide(slide));
    applyGlowShadowVars();
    if (isStudiosAiRevealSlide(slide) && studiosAiRevealSlideId !== slide.id) {
      activateStudiosAiRevealSlide(slide, 1);
    }
    const windowTransitionOptions = currentWindowTransitionOptions(slide, pageWindowTransition);

    if (isTitleSpectrumSlide(slide)) {
      renderTitleSpectrumStage(surface, slide);
    } else if (isDiagramMathSlide(slide)) {
      renderDiagramMathStage(surface, slide);
    } else if (isMapPcaSlide(slide)) {
      renderMapPcaStage(surface, slide);
    } else if (isPcaVisulSlide(slide)) {
      renderPcaVisulStage(surface, slide);
    } else if (isProjectionSlide(slide)) {
      renderProjectionStage(surface, slide);
    } else if (isEmbCossimSlide(slide)) {
      renderEmbCossimStage(surface, slide);
    } else if (isDccLinkSlide(slide)) {
      renderDccLinkStage(surface, slide);
    } else if (isStreetviewSlide(slide)) {
      renderStreetviewStage(surface, slide, shouldAnimate);
    } else if (isSampleSlide(slide)) {
      renderSampleStage(surface, slide, windowTransitionOptions);
    } else if (isTuringMachineSlide(slide)) {
      renderTuringMachineStage(surface, slide, windowTransitionOptions);
    } else {
      renderNormalStage(surface, slide, fromSlide, shouldAnimate, windowTransitionOptions);
    }
    renderOutgoingWindowTransition(surface, pageWindowTransition);

    stage.appendChild(surface);
    renderStreetviewExitOverlay();
    updateNav();
    runFadeIn(
      shouldAnimate && !streetviewExit,
      surface,
      previousSurface,
      previousCleanup,
      Math.max(FADE_DURATION_MS, pageWindowTransition?.totalMs || 0, streetviewEnter ? STREETVIEW_PAGE_TRANSITION_MS : 0),
    );
    if (streetviewExit) {
      surface.classList.remove("is-entering", "is-visible");
    }
    preloadUpcomingSlide();
  }

  function runFadeIn(animate, surface, previousSurface, previousCleanup, holdMs = FADE_DURATION_MS) {
    if (!animate) return;
    surface.getBoundingClientRect();
    surface.classList.add("is-visible");
    window.setTimeout(() => {
      if (previousSurface?.parentNode === stage) previousSurface.remove();
      if (previousCleanup) previousCleanup();
      qsa(".window-layer.is-page-transition-in", surface).forEach((el) => {
        el.classList.remove("is-page-transition-in");
        el.style.removeProperty("--page-window-delay");
        el.style.removeProperty("--page-window-duration");
      });
      qsa(".window-layer.is-page-transition-out", surface).forEach((el) => el.remove());
      surface.classList.remove("is-entering", "is-visible", "is-streetview-enter", "is-window-transition");
    }, Math.max(FADE_DURATION_MS, holdMs) + 40);
  }

  function emptyStage(text) {
    const el = document.createElement("div");
    el.className = "empty-media";
    el.textContent = text;
    return el;
  }

  function renderNormalStage(root, slide, fromSlide = null, animate = false, windowOptions = {}) {
    const background = document.createElement("div");
    background.className = "background-layer";
    if (slide.background?.mode === "split") background.classList.add("is-upload-split-center");
    if (slide.background?.mode === "split") {
      background.appendChild(backgroundSlot("left", slide));
      background.appendChild(backgroundSlot("right", slide));
    } else {
      background.appendChild(backgroundSlot("strip", slide));
    }
    root.appendChild(background);

    const spotlightConfig = isBrickHouseSpotlightSlide(slide) ? brickHouseSpotlightConfig(slide) : null;
    if (spotlightConfig?.enabled) {
      const fromConfig = animate ? brickHouseSpotlightTransitionFrom(fromSlide, spotlightConfig) : null;
      root.appendChild(brickHouseSpotlightCanvas(spotlightConfig, fromConfig, animate));
    }
    renderWindowLayers(root, slide, windowOptions);
    pageTitleOverlays(slide).forEach((titleOverlay) => root.appendChild(titleOverlay));
  }

  function renderSampleStage(root, slide, windowOptions = {}) {
    const sample = ensureSample(slide);
    const background = document.createElement("div");
    background.className = "background-layer";
    if (slide.background?.mode === "split") background.classList.add("is-upload-split-center");
    if (slide.background?.mode === "split") {
      background.appendChild(backgroundSlot("left", slide));
      background.appendChild(backgroundSlot("right", slide));
    } else {
      background.appendChild(backgroundSlot("strip", slide));
    }
    root.appendChild(background);
    const fadeLayer = sampleFadeLayer(sample);
    root.appendChild(fadeLayer);
    specialCleanup = mountSampleMouseFade(root, fadeLayer, sample);
    renderWindowLayers(root, slide, windowOptions);
  }

  function sampleFadeLayer(sample) {
    const layer = document.createElement("div");
    layer.className = "sample-fade-layer";
    layer.style.setProperty("--sample-opacity", String(sample.opacity));
    layer.appendChild(mediaElement(sample.overlay, sample.transform || defaultTransform(), "SAMPLE layer not linked"));
    return layer;
  }

  function mountSampleMouseFade(root, layer, sample) {
    let lastX = 0.5;
    let lastY = 0.5;
    let resizeObserver = null;
    const sync = () => {
      const rect = layer.getBoundingClientRect();
      const base = Math.max(1, Math.min(rect.width, rect.height));
      const radius = base * (sample.radius / 100);
      const feather = base * (sample.feather / 100);
      layer.style.setProperty("--sample-x", `${round(lastX * rect.width, 2)}px`);
      layer.style.setProperty("--sample-y", `${round(lastY * rect.height, 2)}px`);
      layer.style.setProperty("--sample-radius", `${round(radius, 2)}px`);
      layer.style.setProperty("--sample-inner", `${round(Math.max(0, radius - feather), 2)}px`);
      layer.style.setProperty("--sample-opacity", String(sample.opacity));
    };
    const move = (event) => {
      const rect = layer.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      lastX = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      lastY = clamp((event.clientY - rect.top) / rect.height, 0, 1);
      sync();
    };
    sync();
    root.addEventListener("pointermove", move);
    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(sync);
      resizeObserver.observe(layer);
    }
    return () => {
      root.removeEventListener("pointermove", move);
      resizeObserver?.disconnect();
    };
  }

  function renderWindowLayers(root, slide, options = {}) {
    const studiosReveal = isStudiosAiRevealSlide(slide);
    const studiosRevealStep = studiosAiRevealVisibleStep(slide);
    const independentToggle = usesPreviewWindowClickToggle(slide) && options.transitionRole !== "out";
    (slide.windows || []).forEach((win, index) => {
      const transitionDelay = transitionWindowDelay(options, slide, win);
      if (options.transitionRole === "out" && transitionDelay === null) return;
      const visibleInPreview = studiosReveal ? index < studiosRevealStep : true;
      const previewHidden = independentToggle && hiddenPreviewWindowIds.has(previewWindowKey(slide.id, win.id));
      const alphaMedia = windowUsesAlphaMedia(win);
      const winEl = document.createElement("div");
      winEl.className = "window-layer";
      if (!slide.specialType) {
        const uploadWindowAspect = (Number(win.w || 0) / Math.max(0.001, Number(win.h || 0))) * (16 / 9);
        const uploadWindowRight = Math.max(0, 100 - Number(win.x || 0) - Number(win.w || 0));
        winEl.classList.add("is-upload-fixed-aspect-window");
        winEl.style.setProperty("--upload-window-w", String(Number(win.w || 0)));
        winEl.style.setProperty("--upload-window-h", String(Number(win.h || 0)));
        winEl.style.setProperty("--upload-window-aspect", String(uploadWindowAspect));
        winEl.style.setProperty("--upload-window-right", uploadWindowRight + "%");
        if (slide.background?.mode === "split" && Number(win.x || 0) >= 50) winEl.classList.add("is-upload-right-anchored-window");
      }
      winEl.dataset.windowId = win.id;
      winEl.dataset.slideId = slide.id;
      winEl.dataset.windowIndex = String(index);
      winEl.style.left = `${win.x}%`;
      winEl.style.top = `${win.y}%`;
      winEl.style.width = `${win.w}%`;
      winEl.style.height = `${win.h}%`;
      winEl.style.zIndex = String(10 + index);
      winEl.style.setProperty("--studios-reveal-index", String(index));
      if (transitionDelay !== null) {
        winEl.style.setProperty("--page-window-delay", `${transitionDelay}ms`);
        winEl.style.setProperty("--page-window-duration", `${PAGE_WINDOW_ITEM_ANIMATION_MS}ms`);
      }
      if (studiosReveal) applyStudiosAiCenterClip(winEl, win);
      winEl.classList.toggle("is-studios-ai-window", studiosReveal);
      winEl.classList.toggle("is-reveal-visible", studiosReveal && visibleInPreview);
      winEl.classList.toggle("is-page-transition-in", options.transitionRole === "in");
      winEl.classList.toggle("is-page-transition-out", options.transitionRole === "out");
      winEl.classList.toggle("is-preview-toggleable-window", independentToggle);
      winEl.classList.toggle("is-preview-hidden", previewHidden);
      winEl.classList.toggle("is-alpha-media", alphaMedia);
      winEl.setAttribute("aria-hidden", studiosReveal && !visibleInPreview ? "true" : "false");
      if (alphaMedia) {
        const shadow = ensureGlowShadow();
        if (shadow.enabled && shadow.opacity > 0 && (shadow.radius > 0 || shadow.fadeoff > 0)) {
          const safeId = String(win.id || index).replace(/[^\w-]/g, "-");
          const filterId = `window-alpha-glow-static-${safeId}`;
          winEl.appendChild(diagramOverlayGlowFilter(filterId, shadow));
          const shadowFrame = document.createElement("div");
          shadowFrame.className = "window-alpha-shadow-frame";
          shadowFrame.style.filter = `url(#${filterId})`;
          const shadowCrop = document.createElement("div");
          shadowCrop.className = "window-alpha-crop";
          const shadowCarrier = mediaElement(win.mediaId, win.transform || defaultTransform(), "");
          shadowCarrier.classList.add("window-alpha-shadow");
          shadowCrop.appendChild(shadowCarrier);
          shadowFrame.appendChild(shadowCrop);
          winEl.appendChild(shadowFrame);
        }
        const contentFrame = document.createElement("div");
        contentFrame.className = "window-alpha-content-frame";
        const alphaContent = mediaElement(win.mediaId, win.transform || defaultTransform(), "Empty window");
        alphaContent.classList.add("window-alpha-content");
        contentFrame.appendChild(alphaContent);
        winEl.appendChild(contentFrame);
      } else {
        winEl.appendChild(mediaElement(win.mediaId, win.transform || defaultTransform(), "Empty window"));
      }
      root.appendChild(winEl);
    });
  }

  function appendInteractionHint(root, title, lines) {
    const hint = document.createElement("aside");
    hint.className = "interaction-hint";
    hint.setAttribute("aria-label", `${title} interaction hint`);
    const heading = document.createElement("strong");
    heading.className = "interaction-hint-title";
    heading.textContent = title;
    const list = document.createElement("ul");
    list.className = "interaction-hint-list";
    lines.forEach((line) => {
      const item = document.createElement("li");
      item.textContent = line;
      list.appendChild(item);
    });
    hint.append(heading, list);
    root.appendChild(hint);
  }

  function renderProjectionStage(stage, slide) {
    const config = ensureProjection(slide);
    const root = document.createElement("div");
    root.className = "projection-stage";
    root.innerHTML = `
      <canvas class="projection-canvas" aria-label="Equirectangular projection viewer"></canvas>
      <section class="projection-control-stack" aria-label="Projection controls">
        <label class="projection-slider-panel">
          <span>Zoom</span>
          <input data-projection-zoom type="range" min="0" max="1" step="0.001" value="${round(config.zoom, 3)}" />
          <output data-projection-zoom-output>${round(config.zoom, 3).toFixed(3)}</output>
        </label>
        <label class="projection-slider-panel">
          <span>2:1</span>
          <input data-projection-morph type="range" min="0" max="1" step="0.001" value="${round(config.morph, 3)}" />
          <span>Sphere</span>
        </label>
      </section>
      <div class="projection-loading" data-projection-loading>
        <div class="projection-loading-panel" data-projection-loading-label>Loading projection image</div>
      </div>
    `;
    appendInteractionHint(root, "Interaction", [
      "Drag canvas to rotate or pan.",
      "Wheel or Zoom slider changes view depth.",
      "Morph slider blends 2:1 plane and sphere.",
      "Double-click resets the view.",
    ]);
    stage.appendChild(root);
    specialCleanup = mountProjectionViewer(root, slide);
  }

  function mountProjectionViewer(root, slide) {
    const config = ensureProjection(slide);
    const canvas = qs(".projection-canvas", root);
    const controlStack = qs(".projection-control-stack", root);
    const morphInput = qs("[data-projection-morph]", root);
    const zoomInput = qs("[data-projection-zoom]", root);
    const zoomOutput = qs("[data-projection-zoom-output]", root);
    const loading = qs("[data-projection-loading]", root);
    const loadingLabel = qs("[data-projection-loading-label]", root);
    const viewer = {
      morph: config.morph,
      targetMorph: config.morph,
      zoom: projectionFromNormalizedZoom(config.zoom),
      targetZoom: projectionFromNormalizedZoom(config.zoom),
      yaw: 0,
      pitch: 0,
      flatPan: [0, 0],
      pointer: null,
      fov: 48,
    };
    let destroyed = false;
    let raf = 0;
    let glState = null;
    const resizeObserver = new ResizeObserver(() => draw());
    resizeObserver.observe(root);

    syncProjectionControls();
    bindProjectionEvents();
    getProjectionImage(config.imagePath)
      .then((image) => {
        if (destroyed) return;
        glState = createProjectionGlState(canvas, image);
        loading.classList.add("is-hidden");
        draw();
      })
      .catch((error) => {
        if (destroyed) return;
        loading.classList.add("has-error");
        loadingLabel.textContent = error instanceof Error ? error.message : "Projection image failed to load";
      });

    raf = requestAnimationFrame(tick);

    function bindProjectionEvents() {
      morphInput.addEventListener("input", () => {
        const value = clamp(Number(morphInput.value), 0, 1);
        viewer.targetMorph = Number.isFinite(value) ? value : 0;
        config.morph = viewer.targetMorph;
        syncProjectionControls();
        draw();
      });
      zoomInput.addEventListener("input", () => {
        setProjectionZoomTarget(projectionFromNormalizedZoom(Number(zoomInput.value)));
      });
      controlStack.addEventListener("pointerdown", (event) => event.stopPropagation());
      controlStack.addEventListener("wheel", (event) => event.stopPropagation(), { passive: true });
      canvas.addEventListener("wheel", handleWheel, { passive: false });
      canvas.addEventListener("pointerdown", handlePointerDown);
      canvas.addEventListener("pointermove", handlePointerMove);
      canvas.addEventListener("pointerup", clearPointer);
      canvas.addEventListener("pointercancel", clearPointer);
      canvas.addEventListener("dblclick", resetProjectionView);
    }

    function syncProjectionControls() {
      config.morph = clamp(Number(config.morph ?? viewer.targetMorph), 0, 1);
      config.zoom = clamp(Number(config.zoom ?? projectionToNormalizedZoom(viewer.targetZoom)), 0, 1);
      morphInput.value = round(config.morph, 3);
      morphInput.style.setProperty("--value", `${config.morph * 100}%`);
      zoomInput.value = round(config.zoom, 3);
      zoomInput.style.setProperty("--value", `${config.zoom * 100}%`);
      zoomOutput.textContent = config.zoom.toFixed(3);
    }

    function tick() {
      if (destroyed) return;
      viewer.morph += (viewer.targetMorph - viewer.morph) * 0.13;
      viewer.zoom += (viewer.targetZoom - viewer.zoom) * 0.14;
      if (Math.abs(viewer.morph - viewer.targetMorph) < 0.0004) viewer.morph = viewer.targetMorph;
      if (Math.abs(viewer.zoom - viewer.targetZoom) < 0.0004) viewer.zoom = viewer.targetZoom;
      draw();
      raf = requestAnimationFrame(tick);
    }

    function draw() {
      if (destroyed || !glState) return;
      drawProjectionScene(glState, viewer);
    }

    function setProjectionZoomTarget(value) {
      viewer.targetZoom = clamp(Number.isFinite(value) ? value : 0, PROJECTION_ZOOM_MIN, PROJECTION_ZOOM_MAX);
      config.zoom = projectionToNormalizedZoom(viewer.targetZoom);
      syncProjectionControls();
      draw();
    }

    function handleWheel(event) {
      event.preventDefault();
      event.stopPropagation();
      const delta = -(event.deltaY || event.deltaX || 0) * (event.ctrlKey ? 0.003 : 0.0012);
      setProjectionZoomTarget(viewer.targetZoom + delta);
    }

    function handlePointerDown(event) {
      if (event.button !== undefined && event.button !== 0) return;
      event.preventDefault();
      event.stopPropagation();
      const mode = projectionInteractionMode(viewer);
      const camera = projectionCameraInfo(canvas, viewer);
      viewer.pointer = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        yaw: viewer.yaw,
        pitch: viewer.pitch,
        pan: [...viewer.flatPan],
        mode,
        anchorDirection: mode === "inside" ? projectionWorldDirectionFromClient(canvas, viewer, camera, event.clientX, event.clientY) : null,
      };
      canvas.setPointerCapture?.(event.pointerId);
      canvas.classList.add("is-dragging");
    }

    function handlePointerMove(event) {
      const pointer = viewer.pointer;
      if (!pointer || pointer.id !== event.pointerId) return;
      event.preventDefault();
      event.stopPropagation();
      const dx = event.clientX - pointer.x;
      const dy = event.clientY - pointer.y;
      if (pointer.mode === "flat") {
        const camera = projectionCameraInfo(canvas, viewer);
        const unitsPerPixel = projectionFlatUnitsPerPixel(canvas, camera);
        viewer.flatPan[0] = clamp(pointer.pan[0] - dx * unitsPerPixel, -PROJECTION_PLANE_WIDTH * 0.5, PROJECTION_PLANE_WIDTH * 0.5);
        viewer.flatPan[1] = clamp(pointer.pan[1] + dy * unitsPerPixel, -PROJECTION_PLANE_HEIGHT * 0.5, PROJECTION_PLANE_HEIGHT * 0.5);
        draw();
        return;
      }
      if (pointer.mode === "inside") {
        projectionSolveInsideDrag(canvas, viewer, pointer.anchorDirection, event.clientX, event.clientY);
        draw();
        return;
      }
      const speed = 0.005;
      viewer.yaw = projectionWrapAngle(pointer.yaw - dx * speed);
      viewer.pitch = clamp(pointer.pitch + dy * speed, -PROJECTION_PITCH_LIMIT, PROJECTION_PITCH_LIMIT);
      draw();
    }

    function clearPointer(event) {
      const pointer = viewer.pointer;
      if (!pointer || (event.pointerId !== undefined && pointer.id !== event.pointerId)) return;
      event.preventDefault();
      event.stopPropagation();
      canvas.releasePointerCapture?.(event.pointerId);
      canvas.classList.remove("is-dragging");
      viewer.pointer = null;
    }

    function resetProjectionView() {
      viewer.yaw = 0;
      viewer.pitch = 0;
      viewer.flatPan = [0, 0];
      setProjectionZoomTarget(0);
    }

    return () => {
      destroyed = true;
      if (raf) cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      if (glState) disposeProjectionGlState(glState);
    };
  }

  async function getProjectionImage(imagePath = PROJECTION_IMAGE_PATH) {
    return loadProjectionImage(imagePath || PROJECTION_IMAGE_PATH);
  }

  function createProjectionGlState(canvas, image) {
    const gl = canvas.getContext("webgl", { alpha: false, antialias: true, powerPreference: "high-performance" });
    if (!gl) throw new Error("WebGL is not available for PROJECTION.");
    const meshProgram = createProjectionProgram(gl, projectionMeshVertexShaderSource(), projectionMeshFragmentShaderSource());
    const lineProgram = createProjectionProgram(gl, projectionLineVertexShaderSource(), projectionLineFragmentShaderSource());
    const mesh = createProjectionMorphGeometry(PROJECTION_GRID_WIDTH, PROJECTION_GRID_HEIGHT);
    const gridOutside = createProjectionLatLonGridGeometry(PROJECTION_LAT_LON_STEP_DEGREES, PROJECTION_LAT_LON_SAMPLES, 1);
    const gridInside = createProjectionLatLonGridGeometry(PROJECTION_LAT_LON_STEP_DEGREES, PROJECTION_LAT_LON_SAMPLES, -1);
    const floor = createProjectionFloorLineGeometry();
    return {
      canvas,
      gl,
      meshProgram,
      lineProgram,
      texture: createProjectionTexture(gl, image),
      mesh,
      gridOutside,
      gridInside,
      floor,
      buffers: {
        meshPlane: createProjectionBuffer(gl, mesh.plane),
        meshSphere: createProjectionBuffer(gl, mesh.sphere),
        meshUv: createProjectionBuffer(gl, mesh.uvs),
        meshIndex: createProjectionElementBuffer(gl, mesh.indices),
        gridOutsidePlane: createProjectionBuffer(gl, gridOutside.plane),
        gridOutsideSphere: createProjectionBuffer(gl, gridOutside.sphere),
        gridInsidePlane: createProjectionBuffer(gl, gridInside.plane),
        gridInsideSphere: createProjectionBuffer(gl, gridInside.sphere),
        floorPlane: createProjectionBuffer(gl, floor.plane),
        floorSphere: createProjectionBuffer(gl, floor.sphere),
      },
      meshLocations: {
        matrix: gl.getUniformLocation(meshProgram, "u_matrix"),
        anchorShift: gl.getUniformLocation(meshProgram, "u_anchorShift"),
        morph: gl.getUniformLocation(meshProgram, "u_morph"),
        texture: gl.getUniformLocation(meshProgram, "u_texture"),
        plane: gl.getAttribLocation(meshProgram, "a_plane"),
        sphere: gl.getAttribLocation(meshProgram, "a_sphere"),
        uv: gl.getAttribLocation(meshProgram, "a_uv"),
      },
      lineLocations: {
        matrix: gl.getUniformLocation(lineProgram, "u_matrix"),
        anchorShift: gl.getUniformLocation(lineProgram, "u_anchorShift"),
        morph: gl.getUniformLocation(lineProgram, "u_morph"),
        color: gl.getUniformLocation(lineProgram, "u_color"),
        plane: gl.getAttribLocation(lineProgram, "a_plane"),
        sphere: gl.getAttribLocation(lineProgram, "a_sphere"),
      },
    };
  }

  function drawProjectionScene(glState, viewer) {
    const { canvas, gl } = glState;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    const camera = projectionCameraInfo(canvas, viewer);
    const matrix = pcaVisulMat4Multiply(
      pcaVisulMat4Perspective((camera.fov * Math.PI) / 180, width / height, 0.01, 120),
      pcaVisulMat4LookAt(camera.eye, camera.target, [0, 1, 0]),
    );
    const anchorShift = new Float32Array([PROJECTION_FOCUS_X * 2 - 1, 1 - PROJECTION_FOCUS_Y * 2]);
    const chromeOpacity =
      (1 - projectionSmoothstep(0.16, 0.92, viewer.morph)) * (1 - projectionSmoothstep(0.52, 0.9, viewer.zoom));

    gl.viewport(0, 0, width, height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.disable(gl.CULL_FACE);
    gl.disable(gl.BLEND);

    if (chromeOpacity > 0.01) {
      drawProjectionLineBuffer(glState, glState.buffers.floorPlane, glState.buffers.floorSphere, glState.floor.count, matrix, anchorShift, viewer.morph, [
        0.18,
        0.2,
        0.22,
        0.28 * chromeOpacity,
      ]);
    }

    gl.useProgram(glState.meshProgram);
    gl.uniformMatrix4fv(glState.meshLocations.matrix, false, matrix);
    gl.uniform2fv(glState.meshLocations.anchorShift, anchorShift);
    gl.uniform1f(glState.meshLocations.morph, viewer.morph);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, glState.texture);
    gl.uniform1i(glState.meshLocations.texture, 0);
    projectionBindAttribute(gl, glState.meshLocations.plane, glState.buffers.meshPlane, 3);
    projectionBindAttribute(gl, glState.meshLocations.sphere, glState.buffers.meshSphere, 3);
    projectionBindAttribute(gl, glState.meshLocations.uv, glState.buffers.meshUv, 2);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glState.buffers.meshIndex);
    gl.drawElements(gl.TRIANGLES, glState.mesh.indices.length, gl.UNSIGNED_SHORT, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthMask(false);
    drawProjectionLineBuffer(glState, glState.buffers.gridOutsidePlane, glState.buffers.gridOutsideSphere, glState.gridOutside.count, matrix, anchorShift, viewer.morph, [0, 0, 0, 0.72]);
    drawProjectionLineBuffer(glState, glState.buffers.gridInsidePlane, glState.buffers.gridInsideSphere, glState.gridInside.count, matrix, anchorShift, viewer.morph, [0, 0, 0, 0.55]);
    gl.depthMask(true);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  function drawProjectionLineBuffer(glState, planeBuffer, sphereBuffer, count, matrix, anchorShift, morph, color) {
    const { gl } = glState;
    gl.useProgram(glState.lineProgram);
    gl.uniformMatrix4fv(glState.lineLocations.matrix, false, matrix);
    gl.uniform2fv(glState.lineLocations.anchorShift, anchorShift);
    gl.uniform1f(glState.lineLocations.morph, morph);
    gl.uniform4fv(glState.lineLocations.color, color);
    projectionBindAttribute(gl, glState.lineLocations.plane, planeBuffer, 3);
    projectionBindAttribute(gl, glState.lineLocations.sphere, sphereBuffer, 3);
    gl.drawArrays(gl.LINES, 0, count);
  }

  function disposeProjectionGlState(glState) {
    const { gl } = glState;
    Object.values(glState.buffers).forEach((buffer) => gl.deleteBuffer(buffer));
    gl.deleteTexture(glState.texture);
    gl.deleteProgram(glState.meshProgram);
    gl.deleteProgram(glState.lineProgram);
  }

  function createProjectionTexture(gl, image) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.bindTexture(gl.TEXTURE_2D, null);
    return texture;
  }

  function createProjectionBuffer(gl, data) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return buffer;
  }

  function createProjectionElementBuffer(gl, data) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    return buffer;
  }

  function projectionBindAttribute(gl, location, buffer, size) {
    if (location < 0) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
  }

  function createProjectionMorphGeometry(widthSegments, heightSegments) {
    const columns = widthSegments + 1;
    const rows = heightSegments + 1;
    const vertexCount = columns * rows;
    const plane = new Float32Array(vertexCount * 3);
    const sphere = new Float32Array(vertexCount * 3);
    const uvs = new Float32Array(vertexCount * 2);
    const indices = new Uint16Array(widthSegments * heightSegments * 6);
    let vertexIndex = 0;
    for (let y = 0; y < rows; y += 1) {
      const v = y / heightSegments;
      const latitude = Math.PI * (0.5 - v);
      for (let x = 0; x < columns; x += 1) {
        const u = x / widthSegments;
        const longitude = (u - 0.5) * Math.PI * 2;
        projectionWriteSurfaceVertex(plane, sphere, vertexIndex, u, v, 0, latitude, longitude);
        uvs[vertexIndex * 2] = u;
        uvs[vertexIndex * 2 + 1] = v;
        vertexIndex += 1;
      }
    }
    let index = 0;
    for (let y = 0; y < heightSegments; y += 1) {
      for (let x = 0; x < widthSegments; x += 1) {
        const a = y * columns + x;
        const b = a + 1;
        const c = a + columns;
        const d = c + 1;
        indices[index] = a;
        indices[index + 1] = c;
        indices[index + 2] = b;
        indices[index + 3] = b;
        indices[index + 4] = c;
        indices[index + 5] = d;
        index += 6;
      }
    }
    return { plane, sphere, uvs, indices };
  }

  function createProjectionLatLonGridGeometry(stepDegrees, samples, offsetDirection) {
    const longitudes = projectionDegreeStops(-180, 180, stepDegrees);
    const latitudes = projectionDegreeStops(-90, 90, stepDegrees);
    const vertexCount = (longitudes.length + latitudes.length) * samples * 2;
    const plane = new Float32Array(vertexCount * 3);
    const sphere = new Float32Array(vertexCount * 3);
    const surfaceOffset = PROJECTION_LAT_LON_OFFSET * offsetDirection;
    let vertexIndex = 0;
    for (const longitude of longitudes) {
      const u = (longitude + 180) / 360;
      for (let step = 0; step < samples; step += 1) {
        vertexIndex = projectionWriteLatLonVertex(plane, sphere, vertexIndex, u, step / samples, surfaceOffset);
        vertexIndex = projectionWriteLatLonVertex(plane, sphere, vertexIndex, u, (step + 1) / samples, surfaceOffset);
      }
    }
    for (const latitude of latitudes) {
      const v = (90 - latitude) / 180;
      for (let step = 0; step < samples; step += 1) {
        vertexIndex = projectionWriteLatLonVertex(plane, sphere, vertexIndex, step / samples, v, surfaceOffset);
        vertexIndex = projectionWriteLatLonVertex(plane, sphere, vertexIndex, (step + 1) / samples, v, surfaceOffset);
      }
    }
    return { plane, sphere, count: vertexCount };
  }

  function createProjectionFloorLineGeometry() {
    const vertices = [];
    const divisions = 22;
    const size = 22;
    const y = -PROJECTION_SPHERE_RADIUS;
    for (let i = 0; i <= divisions; i += 1) {
      const t = -size * 0.5 + (i / divisions) * size;
      vertices.push(-size * 0.5, y, t, size * 0.5, y, t);
      vertices.push(t, y, -size * 0.5, t, y, size * 0.5);
    }
    vertices.push(-5.4, 0, -0.01, 5.4, 0, -0.01);
    const plane = new Float32Array(vertices);
    const sphere = new Float32Array(vertices);
    return { plane, sphere, count: vertices.length / 3 };
  }

  function projectionDegreeStops(min, max, step) {
    const stops = [];
    for (let value = min; value <= max; value += step) stops.push(value);
    return stops;
  }

  function projectionWriteLatLonVertex(plane, sphere, vertexIndex, u, v, surfaceOffset) {
    const latitude = Math.PI * (0.5 - v);
    const longitude = (u - 0.5) * Math.PI * 2;
    projectionWriteSurfaceVertex(plane, sphere, vertexIndex, u, v, surfaceOffset, latitude, longitude);
    return vertexIndex + 1;
  }

  function projectionWriteSurfaceVertex(plane, sphere, vertexIndex, u, v, surfaceOffset, latitude, longitude) {
    const i3 = vertexIndex * 3;
    plane[i3] = (u - 0.5) * PROJECTION_PLANE_WIDTH;
    plane[i3 + 1] = (0.5 - v) * PROJECTION_PLANE_HEIGHT;
    plane[i3 + 2] = 0;
    const sphereRadius = PROJECTION_SPHERE_RADIUS + surfaceOffset;
    const cosLatitude = Math.cos(latitude);
    sphere[i3] = sphereRadius * Math.sin(longitude) * cosLatitude;
    sphere[i3 + 1] = sphereRadius * Math.sin(latitude);
    sphere[i3 + 2] = -sphereRadius * Math.cos(longitude) * cosLatitude;
  }

  function projectionCameraInfo(canvas, viewer) {
    const orbitDirection = projectionOrbitDirection(viewer.yaw, viewer.pitch);
    const planeIntent = 1 - projectionSmoothstep(0.12, 0.5, viewer.morph);
    const flatAlpha = planeIntent * projectionSmoothstep(PROJECTION_ZOOM_SURFACE, 0.82, viewer.zoom);
    const streetViewActive = projectionStreetViewActive(viewer);
    let eye = projectionScale3(orbitDirection, projectionExternalCameraDistance(viewer.zoom));
    let target = [0, 0, 0];
    let fov = 48;
    if (streetViewActive) {
      eye = projectionScale3(orbitDirection, PROJECTION_INSIDE_CAMERA_DISTANCE);
      target = projectionScale3(orbitDirection, PROJECTION_SPHERE_RADIUS);
      fov = projectionStreetViewFov(viewer.zoom);
    }
    const flatZoom = projectionEaseOutCubic(
      clamp((viewer.zoom - PROJECTION_ZOOM_SURFACE) / (PROJECTION_ZOOM_MAX - PROJECTION_ZOOM_SURFACE), 0, 1),
    );
    const flatDistance = lerp(7.2, 1.05, flatZoom);
    const flatEye = [viewer.flatPan[0], viewer.flatPan[1], flatDistance];
    const flatTarget = [viewer.flatPan[0], viewer.flatPan[1], 0];
    eye = projectionLerp3(eye, flatEye, flatAlpha);
    target = projectionLerp3(target, flatTarget, flatAlpha);
    viewer.fov = fov;
    return { eye, target, fov, aspect: Math.max(1, canvas.clientWidth) / Math.max(1, canvas.clientHeight) };
  }

  function projectionInteractionMode(viewer) {
    if (viewer.morph < 0.28 && viewer.zoom > PROJECTION_ZOOM_SURFACE) return "flat";
    if (projectionStreetViewActive(viewer)) return "inside";
    return "orbit";
  }

  function projectionStreetViewActive(viewer) {
    return viewer.morph > 0.74 && viewer.zoom > PROJECTION_ZOOM_SURFACE;
  }

  function projectionExternalCameraDistance(zoom) {
    if (zoom <= 0) {
      const farZoom = clamp((zoom - PROJECTION_ZOOM_MIN) / (0 - PROJECTION_ZOOM_MIN), 0, 1);
      return lerp(PROJECTION_FAR_CAMERA_DISTANCE, PROJECTION_OUTSIDE_CAMERA_DISTANCE, projectionEaseOutCubic(farZoom));
    }
    const externalZoom = clamp(zoom / PROJECTION_ZOOM_SURFACE, 0, 1);
    return lerp(PROJECTION_OUTSIDE_CAMERA_DISTANCE, PROJECTION_SPHERE_RADIUS, projectionEaseOutCubic(externalZoom));
  }

  function projectionStreetViewFov(zoom) {
    const streetZoom = clamp((zoom - PROJECTION_ZOOM_SURFACE) / (PROJECTION_ZOOM_MAX - PROJECTION_ZOOM_SURFACE), 0, 1);
    return lerp(PROJECTION_STREETVIEW_WIDE_FOV, PROJECTION_STREETVIEW_TELE_FOV, projectionEaseOutCubic(streetZoom));
  }

  function projectionToNormalizedZoom(value) {
    return clamp((value - PROJECTION_ZOOM_MIN) / PROJECTION_ZOOM_RANGE, 0, 1);
  }

  function projectionFromNormalizedZoom(value) {
    return PROJECTION_ZOOM_MIN + clamp(Number(value), 0, 1) * PROJECTION_ZOOM_RANGE;
  }

  function projectionSmoothstep(edge0, edge1, value) {
    const t = clamp((value - edge0) / (edge1 - edge0 || 1), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function projectionEaseOutCubic(value) {
    const t = clamp(value, 0, 1);
    return 1 - Math.pow(1 - t, 3);
  }

  function projectionFlatUnitsPerPixel(canvas, camera) {
    const distance = Math.max(0.01, pcaVisulDot3(projectionSubtract3(camera.eye, camera.target), projectionOrbitDirection(0, 0)));
    const visibleHeight = 2 * Math.tan((camera.fov * Math.PI) / 360) * Math.abs(distance);
    return visibleHeight / Math.max(1, canvas.clientHeight);
  }

  function projectionWorldDirectionFromClient(canvas, viewer, camera, clientX, clientY) {
    const ndc = projectionCameraNdcFromClient(canvas, clientX, clientY);
    const tanY = Math.tan((camera.fov * Math.PI) / 360);
    const tanX = tanY * camera.aspect;
    const basis = projectionViewBasis(viewer.yaw, viewer.pitch);
    return pcaVisulNormalize3(
      projectionAdd3(projectionAdd3(basis.forward, projectionScale3(basis.right, ndc.x * tanX)), projectionScale3(basis.up, ndc.y * tanY)),
    );
  }

  function projectionSolveInsideDrag(canvas, viewer, anchorDirection, clientX, clientY) {
    if (!anchorDirection) return;
    const targetNdc = projectionCameraNdcFromClient(canvas, clientX, clientY);
    const camera = projectionCameraInfo(canvas, viewer);
    let yaw = viewer.yaw;
    let pitch = viewer.pitch;
    const h = 0.0008;
    for (let iteration = 0; iteration < 8; iteration += 1) {
      const current = projectionDirectionToNdc(anchorDirection, yaw, pitch, camera.fov, camera.aspect);
      const errorX = current.x - targetNdc.x;
      const errorY = current.y - targetNdc.y;
      if (Math.abs(errorX) + Math.abs(errorY) < 0.00005) break;
      const yawStep = projectionDirectionToNdc(anchorDirection, yaw + h, pitch, camera.fov, camera.aspect);
      const pitchStep = projectionDirectionToNdc(anchorDirection, yaw, pitch + h, camera.fov, camera.aspect);
      const j00 = (yawStep.x - current.x) / h;
      const j10 = (yawStep.y - current.y) / h;
      const j01 = (pitchStep.x - current.x) / h;
      const j11 = (pitchStep.y - current.y) / h;
      const determinant = j00 * j11 - j01 * j10;
      if (Math.abs(determinant) < 0.000001) break;
      const yawDelta = clamp((-errorX * j11 + j01 * errorY) / determinant, -0.18, 0.18);
      const pitchDelta = clamp((errorX * j10 - j00 * errorY) / determinant, -0.18, 0.18);
      yaw = projectionWrapAngle(yaw + yawDelta);
      pitch = clamp(pitch + pitchDelta, -PROJECTION_PITCH_LIMIT, PROJECTION_PITCH_LIMIT);
    }
    viewer.yaw = yaw;
    viewer.pitch = pitch;
  }

  function projectionDirectionToNdc(direction, yaw, pitch, fov, aspect) {
    const tanY = Math.tan((fov * Math.PI) / 360);
    const tanX = tanY * aspect;
    const basis = projectionViewBasis(yaw, pitch);
    const z = Math.max(0.0001, pcaVisulDot3(direction, basis.forward));
    return {
      x: pcaVisulDot3(direction, basis.right) / (z * tanX),
      y: pcaVisulDot3(direction, basis.up) / (z * tanY),
    };
  }

  function projectionCameraNdcFromClient(canvas, clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1 - (PROJECTION_FOCUS_X * 2 - 1),
      y: 1 - ((clientY - rect.top) / Math.max(1, rect.height)) * 2 - (1 - PROJECTION_FOCUS_Y * 2),
    };
  }

  function projectionViewBasis(yaw, pitch) {
    const forward = projectionOrbitDirection(yaw, pitch);
    const right = pcaVisulNormalize3(pcaVisulCross3(forward, [0, 1, 0]));
    const up = pcaVisulCross3(right, forward);
    return { forward, right, up };
  }

  function projectionOrbitDirection(yaw, pitch) {
    const cosPitch = Math.cos(pitch);
    return pcaVisulNormalize3([Math.sin(yaw) * cosPitch, Math.sin(pitch), Math.cos(yaw) * cosPitch]);
  }

  function projectionWrapAngle(value) {
    const twoPi = Math.PI * 2;
    return ((value + Math.PI) % twoPi + twoPi) % twoPi - Math.PI;
  }

  function projectionLerp3(a, b, t) {
    return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
  }

  function projectionAdd3(a, b) {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  }

  function projectionSubtract3(a, b) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  }

  function projectionScale3(a, scalar) {
    return [a[0] * scalar, a[1] * scalar, a[2] * scalar];
  }

  function projectionMeshVertexShaderSource() {
    return `
      precision highp float;
      attribute vec3 a_plane;
      attribute vec3 a_sphere;
      attribute vec2 a_uv;
      uniform mat4 u_matrix;
      uniform vec2 u_anchorShift;
      uniform float u_morph;
      varying vec2 v_uv;
      void main() {
        vec3 position = mix(a_plane, a_sphere, u_morph);
        vec4 clip = u_matrix * vec4(position, 1.0);
        clip.xy += u_anchorShift * clip.w;
        gl_Position = clip;
        v_uv = a_uv;
      }
    `;
  }

  function projectionMeshFragmentShaderSource() {
    return `
      precision mediump float;
      uniform sampler2D u_texture;
      varying vec2 v_uv;
      void main() {
        gl_FragColor = texture2D(u_texture, v_uv);
      }
    `;
  }

  function projectionLineVertexShaderSource() {
    return `
      precision highp float;
      attribute vec3 a_plane;
      attribute vec3 a_sphere;
      uniform mat4 u_matrix;
      uniform vec2 u_anchorShift;
      uniform float u_morph;
      void main() {
        vec3 position = mix(a_plane, a_sphere, u_morph);
        vec4 clip = u_matrix * vec4(position, 1.0);
        clip.xy += u_anchorShift * clip.w;
        gl_Position = clip;
      }
    `;
  }

  function projectionLineFragmentShaderSource() {
    return `
      precision mediump float;
      uniform vec4 u_color;
      void main() {
        if (u_color.a <= 0.001) discard;
        gl_FragColor = u_color;
      }
    `;
  }

  function createProjectionProgram(gl, vertexSource, fragmentSource) {
    const vertexShader = createProjectionShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = createProjectionShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const message = gl.getProgramInfoLog(program) || "Unable to link PROJECTION shader program";
      gl.deleteProgram(program);
      throw new Error(message);
    }
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return program;
  }

  function createProjectionShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader) || "Unable to compile PROJECTION shader";
      gl.deleteShader(shader);
      throw new Error(message);
    }
    return shader;
  }

  function renderTitleSpectrumStage(root, slide) {
    const titleSpectrum = ensureTitleSpectrum(slide);
    const spectrumRoot = document.createElement("div");
    spectrumRoot.className = "title-spectrum-stage";
    spectrumRoot.innerHTML = `<canvas class="title-spectrum-canvas" aria-label="Animated color-space spectrum bands"></canvas>`;

    const overlayMedia = titleSpectrum.overlay ? project.media?.[titleSpectrum.overlay] : null;
    const overlayUrl = titleSpectrum.overlay ? mediaUrl(titleSpectrum.overlay) : "";
    if (overlayMedia && overlayUrl) spectrumRoot.appendChild(titleSpectrumOverlayElement(overlayMedia, overlayUrl));

    root.appendChild(spectrumRoot);
    specialCleanup = mountTitleSpectrumAnimation(spectrumRoot);
  }

  function renderStreetviewStage(root, slide, animateEnter = false) {
    const config = ensureStreetview(slide);
    const streetviewRoot = document.createElement("div");
    streetviewRoot.className = "streetview-stage";
    streetviewRoot.innerHTML = `
      <canvas class="streetview-canvas" aria-label="STREETVIEW city screensaver"></canvas>
      <div class="streetview-loading is-preload-wait" data-streetview-loading>
        <div class="streetview-loading-panel">Loading STREETVIEW panoramas</div>
      </div>
    `;
    root.appendChild(streetviewRoot);
    specialCleanup = mountStreetviewViewer(streetviewRoot, config, { animateEnter });
  }

  function mountStreetviewViewer(root, config, options = {}) {
    const canvas = qs(".streetview-canvas", root);
    const loading = qs("[data-streetview-loading]", root);
    const loadingPanel = qs(".streetview-loading-panel", root);
    let destroyed = false;
    let raf = 0;
    let glState = null;
    let manifest = null;
    let tiles = [];
    let enterOrder = [];
    let enterIndexByTile = [];
    let enterStartedAt = 0;
    const swapQueues = { london: [], shanghai: [] };

    getStreetviewManifest(config)
      .then((loadedManifest) => {
        if (destroyed) return null;
        manifest = loadedManifest;
        glState = createStreetviewGlState(canvas);
        tiles = initializeStreetviewTiles(manifest.items);
        enterOrder = shuffle(Array.from({ length: STREETVIEW_TILE_COUNT }, (_, index) => index));
        enterIndexByTile = streetviewOrderIndex(enterOrder);
        return loadStreetviewTextures(glState, manifest.items, (loaded, total) => {
          if (loadingPanel) loadingPanel.textContent = `Loading STREETVIEW panoramas ${loaded}/${total}`;
        });
      })
      .then(() => {
        if (destroyed || !manifest) return;
        loading?.classList.add("is-hidden");
        enterStartedAt = options.animateEnter ? performance.now() : 0;
        draw();
      })
      .catch((error) => {
        if (destroyed) return;
        loading?.classList.remove("is-preload-wait");
        loading?.classList.add("has-error");
        if (loadingPanel) loadingPanel.textContent = error instanceof Error ? error.message : "STREETVIEW failed to load";
      });

    function draw() {
      if (destroyed || !glState || !manifest) return;
      drawStreetview(glState, canvas, tiles, {
        swapQueues,
        enterStartedAt,
        enterIndexByTile,
      });
      raf = requestAnimationFrame(draw);
    }

    return () => {
      destroyed = true;
      if (raf) cancelAnimationFrame(raf);
      if (glState) disposeStreetviewGlState(glState);
    };
  }

  async function fetchStreetviewManifest(config) {
    const manifestPath = config.manifestPath || STREETVIEW_MANIFEST_PATH;
    const response = await fetch(localFileURL(manifestPath), { cache: "no-store" });
    if (!response.ok) throw new Error(`Failed to load STREETVIEW manifest: ${response.status} ${response.statusText}`);
    const text = await response.text();
    return JSON.parse(text.replace(/^\uFEFF/, ""));
  }

  function normalizeStreetviewManifest(manifest, config) {
    const manifestPath = config.manifestPath || STREETVIEW_MANIFEST_PATH;
    const items = (Array.isArray(manifest?.items) ? manifest.items : [])
      .filter((item) => item?.id && item?.file && (item.city === "london" || item.city === "shanghai"))
      .map((item) => ({ ...item, sourcePath: streetviewAssetPath(manifestPath, item.file) }));
    if (items.filter((item) => item.city === "london").length < 40 || items.filter((item) => item.city === "shanghai").length < 40) {
      throw new Error("STREETVIEW needs 40 London and 40 Shanghai panoramas.");
    }
    return { ...manifest, items };
  }

  function streetviewAssetPath(manifestPath, source) {
    const cleanSource = String(source || "")
      .split(/[?#]/)[0]
      .replace(/\\/g, "/");
    if (/^[A-Za-z]:\//.test(cleanSource) || cleanSource.startsWith("//")) return cleanSource;
    const manifestDir = String(manifestPath || STREETVIEW_MANIFEST_PATH)
      .replace(/\\/g, "/")
      .replace(/\/[^/]*$/, "");
    const rel = cleanSource.startsWith("/screensaver-panos/")
      ? cleanSource.slice("/screensaver-panos/".length)
      : cleanSource.replace(/^\/+/, "");
    return `${manifestDir}/${rel}`;
  }

  function initializeStreetviewTiles(items) {
    const londonIndexes = shuffle(items.map((item, index) => (item.city === "london" ? index : -1)).filter((index) => index >= 0));
    const shanghaiIndexes = shuffle(items.map((item, index) => (item.city === "shanghai" ? index : -1)).filter((index) => index >= 0));
    const cityCounters = { london: 0, shanghai: 0 };
    const now = performance.now();
    return Array.from({ length: STREETVIEW_TILE_COUNT }, (_, slotIndex) => {
      const city = streetviewTileCity(slotIndex);
      const sourceIndexes = city === "london" ? londonIndexes : shanghaiIndexes;
      const itemIndex = sourceIndexes[cityCounters[city] % sourceIndexes.length];
      cityCounters[city] += 1;
      return createStreetviewTileState(slotIndex, city, itemIndex, now);
    });
  }

  function createStreetviewTileState(slotIndex, city, itemIndex, now) {
    const tile = {
      slotIndex,
      city,
      itemIndex,
      yaw: Math.random() * Math.PI * 2,
      pitch: streetviewRandomPitch(),
      fov: STREETVIEW_DEFAULT_FOV_RADIANS,
      action: streetviewPlaceholderAction(now),
      lastAction: "idle",
      nextSwitchDeadline: now + randomBetween(14000, 34000),
      browseActionsSinceSwitch: 0,
      queuedForSwap: false,
    };
    tile.action = streetviewNextAction(tile, now - randomBetween(0, 3000), "switch");
    return tile;
  }

  function streetviewTileCity(slotIndex) {
    return slotIndex % STREETVIEW_GRID_COLUMNS < STREETVIEW_CITY_COLUMNS ? "london" : "shanghai";
  }

  function drawStreetview(glState, canvas, tiles, context) {
    const { gl } = glState;
    resizeStreetviewCanvas(canvas, gl);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(glState.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, glState.buffer);
    gl.enableVertexAttribArray(glState.locations.position);
    gl.vertexAttribPointer(glState.locations.position, 2, gl.FLOAT, false, 0, 0);

    const now = performance.now();
    const cellWidth = Math.floor(canvas.width / STREETVIEW_GRID_COLUMNS);
    const cellHeight = Math.floor(canvas.height / STREETVIEW_GRID_ROWS);
    const widthRemainder = canvas.width - cellWidth * STREETVIEW_GRID_COLUMNS;
    const heightRemainder = canvas.height - cellHeight * STREETVIEW_GRID_ROWS;
    for (let index = 0; index < tiles.length; index += 1) {
      const tile = tiles[index];
      advanceStreetviewTileAction(tile, tiles, context.swapQueues, now);
      const frame = streetviewTileFrame(tile, now);
      const texture = glState.textures[tile.itemIndex];
      if (!texture) continue;
      const column = index % STREETVIEW_GRID_COLUMNS;
      const row = Math.floor(index / STREETVIEW_GRID_COLUMNS);
      const viewportWidth = cellWidth + (column === STREETVIEW_GRID_COLUMNS - 1 ? widthRemainder : 0);
      const viewportHeight = cellHeight + (row === STREETVIEW_GRID_ROWS - 1 ? heightRemainder : 0);
      const viewportX = column * cellWidth;
      const viewportY = canvas.height - (row + 1) * cellHeight - (row === STREETVIEW_GRID_ROWS - 1 ? heightRemainder : 0);
      const alpha = frame.alpha * streetviewEntryAlpha(index, now, context.enterStartedAt, context.enterIndexByTile);
      if (alpha <= 0.001) continue;
      gl.viewport(viewportX, viewportY, viewportWidth, viewportHeight);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(glState.locations.texture, 0);
      gl.uniform1f(glState.locations.yaw, frame.yaw);
      gl.uniform1f(glState.locations.pitch, frame.pitch);
      gl.uniform1f(glState.locations.fovY, frame.fov);
      gl.uniform1f(glState.locations.aspect, viewportWidth / Math.max(viewportHeight, 1));
      gl.uniform1f(glState.locations.alpha, alpha);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  }

  function advanceStreetviewTileAction(tile, tiles, swapQueues, now) {
    const action = tile.action;
    const elapsed = now - action.startedAt;
    if (action.kind === "wait-switch") {
      if (!tile.queuedForSwap) queueStreetviewTileSwap(tile, tiles, swapQueues, now);
      return;
    }
    if (action.kind === "swap" && action.switchAt !== undefined && !action.switched && elapsed >= action.switchAt) {
      performStreetviewPairSwap(tile, tiles);
    }
    if (elapsed < action.duration) return;
    const frame = streetviewTileFrame(tile, now);
    tile.yaw = frame.yaw;
    tile.pitch = frame.pitch;
    tile.fov = frame.fov;
    tile.lastAction = action.kind === "swap" ? "switch" : action.kind;
    if (action.kind === "swap") {
      tile.nextSwitchDeadline = now + randomBetween(16000, 44000);
      tile.browseActionsSinceSwitch = 0;
    } else if (action.kind === "pan" || action.kind === "zoom") {
      tile.browseActionsSinceSwitch += 1;
    }
    tile.action = streetviewNextAction(tile, now, tile.lastAction);
  }

  function queueStreetviewTileSwap(tile, tiles, swapQueues, now) {
    tile.queuedForSwap = true;
    const queue = swapQueues[tile.city] || [];
    if (!queue.includes(tile)) queue.push(tile);
    while (queue.length >= 2) {
      const first = queue.shift();
      const second = queue.shift();
      if (!first || !second || first === second) continue;
      if (first.action.kind !== "wait-switch" || second.action.kind !== "wait-switch") continue;
      startStreetviewPairSwap(first, second, now);
      break;
    }
    swapQueues[tile.city] = queue;
  }

  function startStreetviewPairSwap(first, second, now) {
    const duration = randomBetween(1050, 1900);
    const switchAt = duration * randomBetween(0.42, 0.58);
    const pairId = `${first.slotIndex}:${second.slotIndex}:${Math.round(now)}`;
    [first, second].forEach((tile, index) => {
      tile.queuedForSwap = false;
      tile.action = {
        kind: "swap",
        startedAt: now,
        duration,
        fromYaw: tile.yaw,
        toYaw: tile.yaw,
        fromPitch: tile.pitch,
        toPitch: tile.pitch,
        fromFov: tile.fov,
        toFov: tile.fov,
        switchAt,
        switched: false,
        pairId,
        partnerSlotIndex: index === 0 ? second.slotIndex : first.slotIndex,
      };
    });
  }

  function performStreetviewPairSwap(tile, tiles) {
    const action = tile.action;
    if (action.switched) return;
    const partner = tiles[action.partnerSlotIndex];
    if (!partner || partner.action?.pairId !== action.pairId) {
      action.switched = true;
      return;
    }
    ["itemIndex", "yaw", "pitch", "fov"].forEach((field) => {
      const value = tile[field];
      tile[field] = partner[field];
      partner[field] = value;
    });
    [tile, partner].forEach((item) => {
      item.action.fromYaw = item.yaw;
      item.action.toYaw = item.yaw;
      item.action.fromPitch = item.pitch;
      item.action.toPitch = item.pitch;
      item.action.fromFov = item.fov;
      item.action.toFov = item.fov;
      item.action.switched = true;
    });
  }

  function streetviewTileFrame(tile, now) {
    const action = tile.action;
    const elapsed = clamp(now - action.startedAt, 0, action.duration);
    const progress = action.duration > 0 ? elapsed / action.duration : 1;
    if (action.kind === "idle" || action.kind === "wait-switch") {
      return { yaw: tile.yaw, pitch: tile.pitch, fov: tile.fov, alpha: 1 };
    }
    if (action.kind === "swap" && action.switchAt !== undefined) {
      if (elapsed < action.switchAt) {
        return { yaw: tile.yaw, pitch: tile.pitch, fov: tile.fov, alpha: 1 - easeInOutCubic(elapsed / Math.max(action.switchAt, 1)) };
      }
      const fadeInProgress = (elapsed - action.switchAt) / Math.max(action.duration - action.switchAt, 1);
      return { yaw: tile.yaw, pitch: tile.pitch, fov: tile.fov, alpha: easeInOutCubic(fadeInProgress) };
    }
    const actionProgress = action.kind === "pan" || action.kind === "zoom" ? progress : easeInOutCubic(progress);
    return {
      yaw: lerp(action.fromYaw, action.toYaw, actionProgress),
      pitch: lerp(action.fromPitch, action.toPitch, actionProgress),
      fov: lerp(action.fromFov, action.toFov, actionProgress),
      alpha: 1,
    };
  }

  function streetviewNextAction(tile, now, previousKind) {
    const canSwitch = tile.browseActionsSinceSwitch >= STREETVIEW_MIN_BROWSE_ACTIONS_BEFORE_SWITCH;
    const kind = now >= tile.nextSwitchDeadline && canSwitch ? "switch" : chooseStreetviewNextAction(previousKind, canSwitch);
    if (kind === "switch") {
      return {
        kind: "wait-switch",
        startedAt: now,
        duration: Number.POSITIVE_INFINITY,
        fromYaw: tile.yaw,
        toYaw: tile.yaw,
        fromPitch: tile.pitch,
        toPitch: tile.pitch,
        fromFov: tile.fov,
        toFov: tile.fov,
      };
    }
    if (kind === "pan") {
      const yawPan = streetviewRandomYawPan();
      return {
        kind,
        startedAt: now,
        duration: yawPan.duration,
        fromYaw: tile.yaw,
        toYaw: tile.yaw + yawPan.delta,
        fromPitch: tile.pitch,
        toPitch: streetviewRandomPitchTarget(tile.pitch),
        fromFov: tile.fov,
        toFov: tile.fov,
      };
    }
    if (kind === "zoom") {
      const zoom = streetviewRandomZoomTarget(tile.fov);
      return {
        kind,
        startedAt: now,
        duration: zoom.duration,
        fromYaw: tile.yaw,
        toYaw: tile.yaw,
        fromPitch: tile.pitch,
        toPitch: tile.pitch,
        fromFov: tile.fov,
        toFov: zoom.targetFov,
      };
    }
    return {
      kind: "idle",
      startedAt: now,
      duration: randomBetween(STREETVIEW_MIN_IDLE_DELAY_MS, 2400),
      fromYaw: tile.yaw,
      toYaw: tile.yaw,
      fromPitch: tile.pitch,
      toPitch: tile.pitch,
      fromFov: tile.fov,
      toFov: tile.fov,
    };
  }

  function chooseStreetviewNextAction(previousKind, canSwitch) {
    const chains = {
      idle: [["pan", 0.44], ["zoom", 0.22], ["switch", 0.18 * STREETVIEW_SWITCH_PROBABILITY_SCALE], ["idle", 0.16]],
      pan: [["pan", 0.24], ["zoom", 0.24], ["idle", 0.3], ["switch", 0.22 * STREETVIEW_SWITCH_PROBABILITY_SCALE]],
      zoom: [["pan", 0.38], ["idle", 0.28], ["zoom", 0.14], ["switch", 0.2 * STREETVIEW_SWITCH_PROBABILITY_SCALE]],
      switch: [["idle", 0.46], ["pan", 0.34], ["zoom", 0.2]],
    };
    const roll = Math.random();
    let total = 0;
    for (const [kind, probability] of chains[previousKind] || chains.idle) {
      if (kind === "switch" && !canSwitch) continue;
      total += probability;
      if (roll <= total) return kind;
    }
    return "idle";
  }

  function streetviewPlaceholderAction(now) {
    return {
      kind: "idle",
      startedAt: now,
      duration: 1,
      fromYaw: 0,
      toYaw: 0,
      fromPitch: 0,
      toPitch: 0,
      fromFov: STREETVIEW_DEFAULT_FOV_RADIANS,
      toFov: STREETVIEW_DEFAULT_FOV_RADIANS,
    };
  }

  function streetviewEntryAlpha(tileIndex, now, startedAt, orderIndexByTile) {
    if (!startedAt) return 1;
    const orderIndex = orderIndexByTile?.[tileIndex] ?? tileIndex;
    const elapsed = now - startedAt - orderIndex * STREETVIEW_TILE_TRANSITION_INTERVAL_MS;
    return clamp(elapsed / STREETVIEW_TILE_TRANSITION_FADE_MS, 0, 1);
  }

  function createStreetviewGlState(canvas) {
    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: true,
    });
    if (!gl) throw new Error("WebGL is unavailable for STREETVIEW.");
    const program = createStreetviewProgram(gl, streetviewVertexShaderSource(), streetviewFragmentShaderSource());
    const buffer = gl.createBuffer();
    if (!buffer) throw new Error("Could not create STREETVIEW geometry buffer.");
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    return {
      gl,
      program,
      buffer,
      textures: [],
      locations: {
        position: gl.getAttribLocation(program, "a_position"),
        texture: gl.getUniformLocation(program, "u_texture"),
        yaw: gl.getUniformLocation(program, "u_yaw"),
        pitch: gl.getUniformLocation(program, "u_pitch"),
        fovY: gl.getUniformLocation(program, "u_fov_y"),
        aspect: gl.getUniformLocation(program, "u_aspect"),
        alpha: gl.getUniformLocation(program, "u_alpha"),
      },
    };
  }

  async function loadStreetviewTextures(glState, items, onProgress) {
    let loaded = 0;
    glState.textures = new Array(items.length).fill(null);
    await Promise.all(
      items.map(async (item, index) => {
        const image = await preloadStreetviewImage(item.sourcePath);
        glState.textures[index] = createStreetviewTexture(glState.gl, image);
        loaded += 1;
        onProgress?.(loaded, items.length);
      }),
    );
  }

  function loadStreetviewImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error(`Failed to load STREETVIEW pano: ${src}`));
      image.src = src;
    });
  }

  function createStreetviewTexture(gl, image) {
    const texture = gl.createTexture();
    if (!texture) throw new Error("Could not create STREETVIEW texture.");
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    return texture;
  }

  function resizeStreetviewCanvas(canvas, gl) {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    if (canvas.width === width && canvas.height === height) return;
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
  }

  function disposeStreetviewGlState(glState) {
    const { gl } = glState;
    glState.textures.forEach((texture) => {
      if (texture) gl.deleteTexture(texture);
    });
    if (glState.buffer) gl.deleteBuffer(glState.buffer);
    if (glState.program) gl.deleteProgram(glState.program);
  }

  function streetviewVertexShaderSource() {
    return `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;
  }

  function streetviewFragmentShaderSource() {
    return `
      precision highp float;
      varying vec2 v_uv;
      uniform sampler2D u_texture;
      uniform float u_yaw;
      uniform float u_pitch;
      uniform float u_fov_y;
      uniform float u_aspect;
      uniform float u_alpha;
      const float PI = 3.14159265358979323846264;
      void main() {
        float tan_half_fov = tan(u_fov_y * 0.5);
        vec2 screen = vec2(v_uv.x * 2.0 - 1.0, 1.0 - v_uv.y * 2.0);
        vec3 direction = normalize(vec3(screen.x * tan_half_fov * u_aspect, screen.y * tan_half_fov, 1.0));
        float pitch_cosine = cos(u_pitch);
        float pitch_sine = sin(u_pitch);
        vec3 pitched = vec3(direction.x, pitch_cosine * direction.y + pitch_sine * direction.z, -pitch_sine * direction.y + pitch_cosine * direction.z);
        float cosine = cos(u_yaw);
        float sine = sin(u_yaw);
        vec3 world = vec3(cosine * pitched.x + sine * pitched.z, pitched.y, -sine * pitched.x + cosine * pitched.z);
        float longitude = atan(world.x, world.z);
        float latitude = asin(clamp(world.y, -1.0, 1.0));
        vec2 pano_uv = vec2(longitude / (2.0 * PI) + 0.5, 0.5 - latitude / PI);
        vec4 color = texture2D(u_texture, pano_uv);
        gl_FragColor = vec4(color.rgb, color.a * u_alpha);
      }
    `;
  }

  function createStreetviewProgram(gl, vertexSource, fragmentSource) {
    const vertexShader = createStreetviewShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = createStreetviewShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    if (!program) throw new Error("Could not create STREETVIEW shader program.");
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const message = gl.getProgramInfoLog(program) || "Unable to link STREETVIEW shader program";
      gl.deleteProgram(program);
      throw new Error(message);
    }
    return program;
  }

  function createStreetviewShader(gl, type, source) {
    const shader = gl.createShader(type);
    if (!shader) throw new Error("Could not create STREETVIEW shader.");
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader) || "Unable to compile STREETVIEW shader";
      gl.deleteShader(shader);
      throw new Error(message);
    }
    return shader;
  }

  function streetviewRandomYawPan() {
    const stepMultiplier = randomInteger(1, STREETVIEW_YAW_MAX_STEP_MULTIPLIER);
    return {
      delta: randomSign() * degreesToRadians(STREETVIEW_YAW_STEP_DEGREES * stepMultiplier),
      duration: STREETVIEW_YAW_STEP_DURATIONS_MS[stepMultiplier] || STREETVIEW_YAW_STEP_DURATIONS_MS[1],
    };
  }

  function streetviewRandomZoomTarget(currentFov) {
    const candidates = [];
    [-1, 1].forEach((direction) => {
      for (let stepMultiplier = 1; stepMultiplier <= STREETVIEW_ZOOM_MAX_STEP_MULTIPLIER; stepMultiplier += 1) {
        const targetFov = currentFov + direction * degreesToRadians(STREETVIEW_ZOOM_STEP_DEGREES * stepMultiplier);
        if (targetFov >= STREETVIEW_MIN_FOV_RADIANS && targetFov <= STREETVIEW_MAX_FOV_RADIANS) {
          candidates.push({ targetFov, stepMultiplier });
        }
      }
    });
    const candidate = candidates[randomInteger(0, candidates.length - 1)] || { targetFov: currentFov, stepMultiplier: 1 };
    return { targetFov: candidate.targetFov, duration: STREETVIEW_ZOOM_STEP_DURATION_MS * candidate.stepMultiplier };
  }

  function streetviewRandomPitch() {
    const stepCount = Math.floor((STREETVIEW_PITCH_MAX_DEGREES - STREETVIEW_PITCH_MIN_DEGREES) / STREETVIEW_PITCH_STEP_DEGREES);
    return degreesToRadians(STREETVIEW_PITCH_MIN_DEGREES + randomInteger(0, stepCount) * STREETVIEW_PITCH_STEP_DEGREES);
  }

  function streetviewRandomPitchTarget(currentPitch) {
    const currentDegrees = clamp(
      Math.round(radiansToDegrees(currentPitch) / STREETVIEW_PITCH_STEP_DEGREES) * STREETVIEW_PITCH_STEP_DEGREES,
      STREETVIEW_PITCH_MIN_DEGREES,
      STREETVIEW_PITCH_MAX_DEGREES,
    );
    const candidates = [];
    for (let degrees = STREETVIEW_PITCH_MIN_DEGREES; degrees <= STREETVIEW_PITCH_MAX_DEGREES; degrees += STREETVIEW_PITCH_STEP_DEGREES) {
      if (degrees !== currentDegrees) candidates.push(degrees);
    }
    const targetDegrees = candidates[randomInteger(0, candidates.length - 1)] ?? currentDegrees;
    return clamp(degreesToRadians(targetDegrees), STREETVIEW_MIN_PITCH_RADIANS, STREETVIEW_MAX_PITCH_RADIANS);
  }

  function captureStreetviewExitOverlay(surface) {
    const canvas = qs(".streetview-canvas", surface);
    if (!canvas || !canvas.width || !canvas.height) return;
    if (streetviewExitOverlay?.raf) cancelAnimationFrame(streetviewExitOverlay.raf);
    const snapshot = document.createElement("canvas");
    snapshot.width = canvas.width;
    snapshot.height = canvas.height;
    const ctx = snapshot.getContext("2d");
    if (!ctx) return;
    try {
      ctx.drawImage(canvas, 0, 0);
    } catch {
      return;
    }
    streetviewExitOverlay = {
      snapshot,
      order: shuffle(Array.from({ length: STREETVIEW_TILE_COUNT }, (_, index) => index)),
      startedAt: performance.now(),
      raf: 0,
    };
  }

  function renderStreetviewExitOverlay() {
    const overlay = streetviewExitOverlay;
    if (!overlay?.snapshot) return;
    const root = document.createElement("div");
    root.className = "streetview-exit-overlay";
    const canvas = document.createElement("canvas");
    canvas.className = "streetview-exit-canvas";
    canvas.width = overlay.snapshot.width;
    canvas.height = overlay.snapshot.height;
    root.appendChild(canvas);
    stage.appendChild(root);
    drawStreetviewExitOverlayFrame(canvas, overlay);
  }

  function drawStreetviewExitOverlayFrame(canvas, overlay) {
    if (!canvas.isConnected) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const elapsed = performance.now() - overlay.startedAt;
    const cellWidth = Math.floor(canvas.width / STREETVIEW_GRID_COLUMNS);
    const cellHeight = Math.floor(canvas.height / STREETVIEW_GRID_ROWS);
    const widthRemainder = canvas.width - cellWidth * STREETVIEW_GRID_COLUMNS;
    const heightRemainder = canvas.height - cellHeight * STREETVIEW_GRID_ROWS;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let orderIndex = 0; orderIndex < overlay.order.length; orderIndex += 1) {
      const tileIndex = overlay.order[orderIndex];
      const hideElapsed = elapsed - orderIndex * STREETVIEW_TILE_TRANSITION_INTERVAL_MS;
      const alpha = 1 - clamp(hideElapsed / STREETVIEW_TILE_TRANSITION_FADE_MS, 0, 1);
      if (alpha <= 0.001) continue;
      const column = tileIndex % STREETVIEW_GRID_COLUMNS;
      const row = Math.floor(tileIndex / STREETVIEW_GRID_COLUMNS);
      const sx = column * cellWidth;
      const sy = row * cellHeight;
      const sw = cellWidth + (column === STREETVIEW_GRID_COLUMNS - 1 ? widthRemainder : 0);
      const sh = cellHeight + (row === STREETVIEW_GRID_ROWS - 1 ? heightRemainder : 0);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.drawImage(overlay.snapshot, sx, sy, sw, sh, sx, sy, sw, sh);
      ctx.restore();
    }
    if (elapsed >= STREETVIEW_PAGE_TRANSITION_MS) {
      streetviewExitOverlay = null;
      canvas.parentElement?.remove();
      return;
    }
    overlay.raf = requestAnimationFrame(() => drawStreetviewExitOverlayFrame(canvas, overlay));
  }

  function degreesToRadians(value) {
    return (value * Math.PI) / 180;
  }

  function radiansToDegrees(value) {
    return (value * 180) / Math.PI;
  }

  function randomBetween(minimum, maximum) {
    return minimum + Math.random() * (maximum - minimum);
  }

  function randomInteger(minimum, maximum) {
    return Math.floor(randomBetween(minimum, maximum + 1));
  }

  function randomSign() {
    return Math.random() > 0.5 ? 1 : -1;
  }

  function shuffle(items) {
    for (let index = items.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
    }
    return items;
  }

  function streetviewOrderIndex(order) {
    const indices = [];
    order.forEach((tileIndex, orderIndex) => {
      indices[tileIndex] = orderIndex;
    });
    return indices;
  }

  function renderDiagramMathStage(root, slide) {
    const diagram = ensureDiagramMath(slide);
    const diagramRoot = document.createElement("div");
    diagramRoot.className = "diagram-math-stage";
    diagramRoot.style.setProperty("--diagram-gap", `${diagram.gap}%`);
    diagramRoot.style.setProperty("--diagram-duration", `${diagram.duration}s`);
    diagramRoot.style.setProperty("--diagram-fade", `${diagram.fade}%`);

    const grid = document.createElement("div");
    grid.className = "diagram-grid";
    const panelCount = Math.max(1, diagram.scrolls.length);
    const panelWidth = 100 / panelCount;

    diagram.scrolls.forEach((mediaId, index) => {
      const panel = document.createElement("div");
      panel.className = "diagram-panel";
      panel.dataset.diagramSlot = String(index);
      panel.style.setProperty("--diagram-center", `${((index + 0.5) / panelCount) * 100}%`);
      panel.style.setProperty("--diagram-panel-width", `calc(${panelWidth}% - var(--diagram-gap))`);

      const media = mediaId ? project.media?.[mediaId] : null;
      const url = mediaId ? mediaUrl(mediaId) : "";
      if (media && url) {
        const track = document.createElement("div");
        track.className = "diagram-scroll-track";
        track.style.animationDuration = `${diagram.duration + index * 1.7}s`;
        for (let repeat = 0; repeat < 2; repeat += 1) {
          const item = document.createElement(media.kind === "video" ? "video" : "img");
          item.className = "diagram-scroll-item";
          item.src = url;
          if (media.kind === "video") {
            item.muted = true;
            item.loop = true;
            item.autoplay = true;
            item.playsInline = true;
          } else {
            item.alt = media.name || "";
            item.draggable = false;
          }
          track.appendChild(item);
        }
        panel.appendChild(track);
      } else {
        const empty = document.createElement("div");
        empty.className = "diagram-empty";
        empty.textContent = `Scroll ${index + 1}`;
        panel.appendChild(empty);
      }
      grid.appendChild(panel);
    });

    diagramRoot.appendChild(grid);

    const overlayMedia = diagram.overlay ? project.media?.[diagram.overlay] : null;
    const overlayUrl = diagram.overlay ? mediaUrl(diagram.overlay) : "";
    if (overlayMedia && overlayUrl) {
      const shadow = ensureGlowShadow();
      if (shadow.enabled && shadow.opacity > 0 && (shadow.radius > 0 || shadow.fadeoff > 0)) {
        const filterId = "diagram-overlay-alpha-glow-static";
        diagramRoot.appendChild(diagramOverlayGlowFilter(filterId, shadow));
        const shadowOverlay = diagramOverlayElement(overlayMedia, overlayUrl, diagram.overlayOpacity);
        shadowOverlay.classList.add("diagram-overlay-shadow");
        shadowOverlay.style.filter = `url(#${filterId})`;
        diagramRoot.appendChild(shadowOverlay);
      }
      diagramRoot.appendChild(diagramOverlayElement(overlayMedia, overlayUrl, diagram.overlayOpacity));
    }

    root.appendChild(diagramRoot);
  }

  function diagramOverlayElement(media, url, opacity) {
    const overlay = document.createElement(media.kind === "video" ? "video" : "img");
    overlay.className = "diagram-overlay";
    overlay.src = url;
    overlay.style.opacity = String(opacity);
    if (media.kind === "video") {
      overlay.muted = true;
      overlay.loop = true;
      overlay.autoplay = true;
      overlay.playsInline = true;
    } else {
      overlay.alt = media.name || "";
      overlay.draggable = false;
    }
    return overlay;
  }

  function diagramOverlayGlowFilter(filterId, shadow) {
    const namespace = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(namespace, "svg");
    svg.classList.add("svg-filter-defs");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    svg.setAttribute("width", "0");
    svg.setAttribute("height", "0");

    const filter = document.createElementNS(namespace, "filter");
    filter.setAttribute("id", filterId);
    filter.setAttribute("x", "-30%");
    filter.setAttribute("y", "-30%");
    filter.setAttribute("width", "160%");
    filter.setAttribute("height", "160%");
    filter.setAttribute("color-interpolation-filters", "sRGB");

    const radius = Math.max(0, Number(shadow.radius || 0));
    const fadeoff = Math.max(0, Number(shadow.fadeoff || 0));
    const blurRadius = Math.min(radius, fadeoff);
    const spreadRadius = Math.max(0, radius - blurRadius);

    const dilate = document.createElementNS(namespace, "feMorphology");
    dilate.setAttribute("in", "SourceAlpha");
    dilate.setAttribute("operator", "dilate");
    dilate.setAttribute("radius", String(round(spreadRadius, 2)));
    dilate.setAttribute("result", "expanded-alpha");

    const blur = document.createElementNS(namespace, "feGaussianBlur");
    blur.setAttribute("in", "expanded-alpha");
    blur.setAttribute("stdDeviation", String(round(Math.max(0.01, blurRadius / 2), 2)));
    blur.setAttribute("result", "soft-alpha");

    const flood = document.createElementNS(namespace, "feFlood");
    flood.setAttribute("flood-color", "#000000");
    flood.setAttribute("flood-opacity", String(round(shadow.opacity ?? 0.82, 3)));
    flood.setAttribute("result", "shadow-color");

    const composite = document.createElementNS(namespace, "feComposite");
    composite.setAttribute("in", "shadow-color");
    composite.setAttribute("in2", "soft-alpha");
    composite.setAttribute("operator", "in");
    composite.setAttribute("result", "shadow");

    filter.append(dilate, blur, flood, composite);
    svg.appendChild(filter);
    return svg;
  }

  function renderDccLinkStage(stage, slide) {
    ensureDccLink(slide);
    const root = document.createElement("div");
    root.className = "dcc-link-stage";
    root.innerHTML = `
      <canvas class="dcc-link-canvas dcc-link-map" aria-label="DCC-LINK global architecture flow map"></canvas>
      <canvas class="dcc-link-canvas dcc-link-beams" aria-hidden="true"></canvas>
      <canvas class="dcc-link-canvas dcc-link-points" aria-hidden="true"></canvas>
      <div class="dcc-link-legend" aria-hidden="true">
        <span><i style="--color: #ff0000"></i>Design</span>
        <span><i style="--color: #00ff00"></i>Construction</span>
        <span><i style="--color: #0000ff"></i>Capital</span>
      </div>
      <div class="dcc-link-timeline" aria-hidden="true"></div>
      <div class="dcc-link-status" aria-live="polite">Loading</div>
    `;
    stage.appendChild(root);
    specialCleanup = mountDccLinkViewer(root, slide);
  }

  function mountDccLinkViewer(root, slide) {
    const config = ensureDccLink(slide);
    const mapCanvas = qs(".dcc-link-map", root);
    const beamCanvas = qs(".dcc-link-beams", root);
    const pointCanvas = qs(".dcc-link-points", root);
    const status = qs(".dcc-link-status", root);
    const timeline = qs(".dcc-link-timeline", root);
    const mapCtx = mapCanvas.getContext("2d");
    const beamCtx = beamCanvas.getContext("2d");
    const pointCtx = pointCanvas.getContext("2d");
    const colors = {
      oceanA: "#000000",
      oceanB: "#000000",
      grid: "rgba(255, 255, 255, 0.13)",
      gridMajor: "rgba(255, 255, 255, 0.24)",
      land: "#0a0a0a",
      landLight: "#0a0a0a",
      border: "rgba(255, 255, 255, 0.26)",
      frame: "rgba(255, 255, 255, 0.28)",
    };
    const view = {
      fill: false,
      cropSouth: true,
      crop55: true,
      showGrid: true,
      showPoints: true,
      animate: true,
      scrollDegrees: 0,
      speedDegreesPerSecond: 4,
      currentYearIndex: 0,
      yearProgress: 0,
      yearDurationSeconds: 1,
      flowLaunchMonths: 2,
      flowRetractMonths: 2,
      flowStartTime: 0,
      lastFrameTime: 0,
      lastDrawTime: 0,
      mapStrip: null,
      mapStripKey: "",
    };
    let destroyed = false;
    let raf = 0;
    let world = null;
    let flowData = null;
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvases();
      draw();
    });

    resizeObserver.observe(root);
    resizeCanvases();
    buildYearTimeline();

    getDccLinkData(config)
      .then((data) => {
        if (destroyed) return;
        world = data.world;
        flowData = data.flowData;
        view.yearDurationSeconds = flowData.meta?.yearDurationSeconds || 1;
        view.flowLaunchMonths = flowData.meta?.beamLaunchMonths || view.flowLaunchMonths;
        view.flowRetractMonths = flowData.meta?.beamRetractMonths || view.flowRetractMonths;
        view.flowStartTime = performance.now();
        status.hidden = true;
        buildYearTimeline();
        draw();
      })
      .catch((error) => {
        if (destroyed) return;
        status.textContent = error.message;
      });

    raf = requestAnimationFrame(tick);

    function resizeCanvases() {
      const rect = root.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, DCC_LINK_DPR_LIMIT);
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));
      [mapCanvas, beamCanvas, pointCanvas].forEach((canvas) => {
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }
      });
      const sx = width / DCC_LINK_STAGE.width;
      const sy = height / DCC_LINK_STAGE.height;
      mapCtx.setTransform(sx, 0, 0, sy, 0, 0);
      beamCtx.setTransform(sx, 0, 0, sy, 0, 0);
      pointCtx.setTransform(sx, 0, 0, sy, 0, 0);
    }

    function tick(time) {
      if (destroyed) return;
      if (!view.lastFrameTime) view.lastFrameTime = time;
      const dt = Math.min((time - view.lastFrameTime) / 1000, 0.1);
      view.lastFrameTime = time;
      if (view.animate) view.scrollDegrees = (view.scrollDegrees + dt * view.speedDegreesPerSecond) % 360;
      if (time - view.lastDrawTime >= DCC_LINK_TARGET_FRAME_MS) {
        view.lastDrawTime = time;
        draw();
      }
      raf = requestAnimationFrame(tick);
    }

    function draw() {
      updateFlowClock();
      mapCtx.clearRect(0, 0, DCC_LINK_STAGE.width, DCC_LINK_STAGE.height);
      beamCtx.clearRect(0, 0, DCC_LINK_STAGE.width, DCC_LINK_STAGE.height);
      pointCtx.clearRect(0, 0, DCC_LINK_STAGE.width, DCC_LINK_STAGE.height);
      mapCtx.fillStyle = "#000";
      mapCtx.fillRect(0, 0, DCC_LINK_STAGE.width, DCC_LINK_STAGE.height);
      const projection = getDccProjection(view);
      drawCachedMap(projection);
      drawFrame();
      drawBeamLayer(projection);
      drawArrivedPointLayer(projection);
      updateYearTimeline();
    }

    function drawCachedMap(projection) {
      const key = dccMapStripKey(projection);
      if (!view.mapStrip || view.mapStripKey !== key) {
        view.mapStrip = renderMapStrip(projection);
        view.mapStripKey = key;
      }
      if (!view.mapStrip) return;
      mapCtx.save();
      mapCtx.beginPath();
      mapCtx.rect(0, 0, DCC_LINK_STAGE.width, DCC_LINK_STAGE.height);
      mapCtx.clip();
      for (const shift of projection.wrapShifts) {
        const x = projection.x0 + projection.scrollX + shift;
        if (x > DCC_LINK_STAGE.width || x + projection.width < 0) continue;
        mapCtx.drawImage(view.mapStrip, x, 0, projection.width, DCC_LINK_STAGE.height);
      }
      mapCtx.restore();
    }

    function renderMapStrip(projection) {
      const strip = document.createElement("canvas");
      strip.width = Math.max(1, Math.round(projection.width));
      strip.height = DCC_LINK_STAGE.height;
      const stripCtx = strip.getContext("2d");
      const stripProjection = { ...projection, x0: 0, scrollX: 0, wrapShifts: [0] };
      drawOcean(stripCtx, stripProjection);
      if (view.showGrid) drawGraticule(stripCtx, stripProjection);
      if (world) drawWorld(stripCtx, stripProjection);
      return strip;
    }

    function drawOcean(ctx, projection) {
      const gradient = ctx.createLinearGradient(0, 0, 0, DCC_LINK_STAGE.height);
      gradient.addColorStop(0, colors.oceanA);
      gradient.addColorStop(0.52, colors.oceanB);
      gradient.addColorStop(1, colors.oceanA);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, projection.width, DCC_LINK_STAGE.height);
    }

    function drawGraticule(ctx, projection) {
      ctx.lineWidth = 1;
      for (let lon = -180; lon <= 180; lon += 30) {
        const a = dccProject(lon, projection.latTop, projection);
        const b = dccProject(lon, projection.latBottom, projection);
        ctx.strokeStyle = lon === 0 ? colors.gridMajor : colors.grid;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    function drawWorld(ctx, projection) {
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      for (const feature of world.features || []) {
        if (projection.hideAntarctica && feature.properties?.name === "Antarctica") continue;
        const geometry = feature.geometry;
        if (!geometry) continue;
        ctx.beginPath();
        if (geometry.type === "Polygon") addPolygonPath(ctx, geometry.coordinates, projection);
        if (geometry.type === "MultiPolygon") {
          geometry.coordinates.forEach((polygon) => addPolygonPath(ctx, polygon, projection));
        }
        const fill = ctx.createLinearGradient(0, 0, projection.width, DCC_LINK_STAGE.height);
        fill.addColorStop(0, colors.land);
        fill.addColorStop(1, colors.landLight);
        ctx.fillStyle = fill;
        ctx.fill("evenodd");
        ctx.strokeStyle = colors.border;
        ctx.lineWidth = 1.1;
        ctx.stroke();
      }
    }

    function addPolygonPath(ctx, polygon, projection) {
      for (const ring of polygon) {
        let previous = null;
        for (let i = 0; i < ring.length; i += 1) {
          const [lon, lat] = ring[i];
          const current = dccProject(lon, lat, projection);
          const jumpsAcrossMap = previous && Math.abs(current.x - previous.x) > projection.width * 0.48;
          if (i === 0 || jumpsAcrossMap) ctx.moveTo(current.x, current.y);
          else ctx.lineTo(current.x, current.y);
          previous = current;
        }
      }
    }

    function drawFrame() {
      mapCtx.strokeStyle = colors.frame;
      mapCtx.lineWidth = 2;
      mapCtx.strokeRect(1, 1, DCC_LINK_STAGE.width - 2, DCC_LINK_STAGE.height - 2);
    }

    function drawBeamLayer(projection) {
      if (!flowData) return;
      const batches = activeFlowBatches();
      if (!batches.length) return;
      beamCtx.save();
      beamCtx.globalCompositeOperation = "lighter";
      beamCtx.lineCap = "round";
      beamCtx.lineWidth = 1.35;
      for (const shift of projection.wrapShifts) {
        for (const batch of batches) {
          for (const flow of batch.flows) {
            const [fromLon, fromLat, toLon, toLat, intensity] = flow;
            const targetLon = closestDccTargetLongitude(fromLon, toLon);
            const from = dccProject(fromLon, fromLat, projection, shift);
            const to = dccProject(targetLon, toLat, projection, shift);
            const segment = dccFlowSegmentAtTimeline(view, from, to, dccFlowMonthStart(flow) + batch.yearOffset);
            if (!segment || !dccSegmentCouldIntersectStage(segment[0], segment[1])) continue;
            const [red, green, blue, alpha] = dccFlowColor(flow[8], intensity);
            beamCtx.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
            beamCtx.beginPath();
            beamCtx.moveTo(segment[0].x, segment[0].y);
            beamCtx.lineTo(segment[1].x, segment[1].y);
            beamCtx.stroke();
          }
        }
      }
      beamCtx.restore();
    }

    function drawArrivedPointLayer(projection) {
      if (!view.showPoints || !flowData) return;
      const strip = renderArrivedPointStrip(projection);
      if (!strip) return;
      pointCtx.save();
      pointCtx.beginPath();
      pointCtx.rect(0, 0, DCC_LINK_STAGE.width, DCC_LINK_STAGE.height);
      pointCtx.clip();
      for (const shift of projection.wrapShifts) {
        const x = projection.x0 + projection.scrollX + shift;
        if (x > DCC_LINK_STAGE.width || x + projection.width < 0) continue;
        pointCtx.drawImage(strip, x, 0, projection.width, DCC_LINK_STAGE.height);
      }
      pointCtx.restore();
    }

    function renderArrivedPointStrip(projection) {
      const years = flowData?.years || [];
      if (!years.length) return null;
      const strip = document.createElement("canvas");
      strip.width = Math.max(1, Math.round(projection.width));
      strip.height = DCC_LINK_STAGE.height;
      const stripCtx = strip.getContext("2d");
      const stripProjection = { ...projection, x0: 0, scrollX: 0, wrapShifts: [0] };
      stripCtx.save();
      stripCtx.globalCompositeOperation = "lighter";
      stripCtx.globalAlpha = 0.92;
      drawArrivedPointType(stripCtx, stripProjection, "design", "#ff0000");
      drawArrivedPointType(stripCtx, stripProjection, "construction", "#00ff00");
      drawArrivedPointType(stripCtx, stripProjection, "capital", "#0000ff");
      stripCtx.restore();
      return strip;
    }

    function drawArrivedPointType(ctx, projection, type, color) {
      ctx.fillStyle = color;
      for (const flow of arrivedPointFlows(type)) {
        const [, , toLon, toLat] = flow;
        const point = dccProject(toLon, toLat, projection);
        if (point.x < -8 || point.x > projection.width + 8 || point.y < -8 || point.y > DCC_LINK_STAGE.height + 8) {
          continue;
        }
        ctx.beginPath();
        ctx.arc(point.x, point.y, type === "design" ? 2.4 : 3.1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function activeFlowBatches() {
      const years = flowData?.years || [];
      if (!years.length) return [];
      const currentIndex = view.currentYearIndex % years.length;
      const batches = [{ flows: flowData.flowsByYear[years[currentIndex]] || [], yearOffset: 0 }];
      if (currentIndex > 0) batches.push({ flows: flowData.flowsByYear[years[currentIndex - 1]] || [], yearOffset: -1 });
      return batches.filter((batch) => batch.flows.length);
    }

    function arrivedPointFlows(type) {
      const years = flowData?.years || [];
      if (!years.length) return [];
      const currentIndex = view.currentYearIndex % years.length;
      const currentTime = currentIndex + view.yearProgress;
      const flows = [];
      for (let yearIndex = 0; yearIndex <= currentIndex; yearIndex += 1) {
        const yearFlows = flowData.flowsByYear[years[yearIndex]] || [];
        for (const flow of yearFlows) {
          if (flow[8] === type && dccFlowArrivalTime(view, flow, yearIndex) <= currentTime) flows.push(flow);
        }
      }
      return flows;
    }

    function updateFlowClock() {
      if (!flowData?.years?.length || !view.flowStartTime) return;
      const elapsed = Math.max(0, (performance.now() - view.flowStartTime) / 1000);
      const total = elapsed / view.yearDurationSeconds;
      view.currentYearIndex = Math.floor(total) % flowData.years.length;
      view.yearProgress = total - Math.floor(total);
    }

    function buildYearTimeline() {
      const start = Number(flowData?.meta?.startYear) || 2000;
      const end = Number(flowData?.meta?.endYear) || 2025;
      timeline.innerHTML = "";
      timeline.style.gridTemplateColumns = `repeat(${end - start + 1}, minmax(0, 1fr))`;
      for (let year = start; year <= end; year += 1) {
        const item = document.createElement("span");
        item.className = "dcc-link-year";
        item.dataset.year = String(year);
        item.textContent = String(year);
        timeline.appendChild(item);
      }
    }

    function updateYearTimeline() {
      const years = flowData?.years || [];
      const year = years.length ? years[view.currentYearIndex % years.length] : "2000";
      Array.from(timeline.children).forEach((item) => item.classList.toggle("active", item.dataset.year === year));
    }

    return () => {
      destroyed = true;
      if (raf) cancelAnimationFrame(raf);
      resizeObserver.disconnect();
    };
  }

  async function getDccLinkData(config) {
    if (dccLinkDataCache.data) return dccLinkDataCache.data;
    if (dccLinkDataCache.promise) return dccLinkDataCache.promise;

    dccLinkDataCache.promise = (async () => {
      const [worldResponse, flowResponse] = await Promise.all([
        fetch(localFileURL(config.worldPath || DCC_LINK_WORLD_PATH), { cache: "no-store" }),
        fetch(localFileURL(config.flowPath || DCC_LINK_FLOW_PATH), { cache: "no-store" }),
      ]);
      if (!worldResponse.ok) {
        throw new Error(`Failed to load DCC-LINK world data: ${worldResponse.status} ${worldResponse.statusText}`);
      }
      if (!flowResponse.ok) {
        throw new Error(`Failed to load DCC-LINK flow data: ${flowResponse.status} ${flowResponse.statusText}`);
      }
      const data = {
        world: await worldResponse.json(),
        flowData: await flowResponse.json(),
      };
      dccLinkDataCache.data = data;
      return data;
    })().catch((error) => {
      dccLinkDataCache.promise = null;
      throw error;
    });

    return dccLinkDataCache.promise;
  }

  function getDccProjection(view) {
    let latTop = 90;
    let latBottom = -90;
    if (view.cropSouth) latBottom = Math.max(latBottom, -70);
    if (view.crop55) {
      latTop = Math.min(latTop, 85);
      latBottom = Math.max(latBottom, -60);
    }
    const latSpan = latTop - latBottom;
    const width = view.fill ? DCC_LINK_STAGE.width : DCC_LINK_STAGE.height * (360 / latSpan);
    return {
      x0: view.fill ? 0 : (DCC_LINK_STAGE.width - width) / 2,
      y0: 0,
      width,
      height: DCC_LINK_STAGE.height,
      latTop,
      latBottom,
      hideAntarctica: view.cropSouth || view.crop55,
      scrollX: ((view.scrollDegrees % 360) / 360) * width,
      wrapShifts: makeDccWrapShifts(width),
    };
  }

  function makeDccWrapShifts(width) {
    const repeatCount = Math.ceil(DCC_LINK_STAGE.width / width) + 3;
    return Array.from({ length: repeatCount * 2 + 1 }, (_, index) => (index - repeatCount) * width);
  }

  function dccMapStripKey(projection) {
    return [
      Math.round(projection.width),
      projection.latTop,
      projection.latBottom,
      projection.hideAntarctica,
      projection.wrapShifts.length,
    ].join("|");
  }

  function dccProject(lon, lat, projection, shift = 0) {
    return {
      x: projection.x0 + ((lon + 180) / 360) * projection.width + projection.scrollX + shift,
      y: projection.y0 + ((projection.latTop - lat) / (projection.latTop - projection.latBottom)) * projection.height,
    };
  }

  function closestDccTargetLongitude(fromLon, toLon) {
    let adjusted = toLon;
    const delta = adjusted - fromLon;
    if (delta > 180) adjusted -= 360;
    if (delta < -180) adjusted += 360;
    return adjusted;
  }

  function dccFlowMonthStart(flow) {
    const month = Math.max(1, Math.min(12, Number(flow[9]) || 1));
    return month / 12;
  }

  function dccFlowArrivalTime(view, flow, yearIndex) {
    const launchMonths = Math.max(0.01, Number(view.flowLaunchMonths) || 2);
    return yearIndex + dccFlowMonthStart(flow) + launchMonths / 12;
  }

  function dccFlowSegmentAtTimeline(view, from, to, startProgress) {
    const elapsedMonths = (view.yearProgress - startProgress) * 12;
    const launchMonths = Math.max(0.01, Number(view.flowLaunchMonths) || 2);
    const retractMonths = Math.max(0.01, Number(view.flowRetractMonths) || 2);
    const totalMonths = launchMonths + retractMonths;
    if (elapsedMonths < 0 || elapsedMonths > totalMonths) return null;
    if (elapsedMonths <= launchMonths) {
      return [from, dccInterpolatePoint(from, to, elapsedMonths / launchMonths)];
    }
    const retractProgress = (elapsedMonths - launchMonths) / retractMonths;
    return [dccInterpolatePoint(from, to, retractProgress), to];
  }

  function dccInterpolatePoint(from, to, t) {
    return {
      x: from.x + (to.x - from.x) * t,
      y: from.y + (to.y - from.y) * t,
    };
  }

  function dccSegmentCouldIntersectStage(from, to) {
    const minX = Math.min(from.x, to.x);
    const maxX = Math.max(from.x, to.x);
    const minY = Math.min(from.y, to.y);
    const maxY = Math.max(from.y, to.y);
    return maxX >= -80 && minX <= DCC_LINK_STAGE.width + 80 && maxY >= -80 && minY <= DCC_LINK_STAGE.height + 80;
  }

  function dccFlowColor(type, intensity) {
    const channel = Math.round(Math.max(16, Math.min(255, Number(intensity) || 16)));
    const alpha = round(0.52 + (channel / 255) * 0.42, 3);
    if (type === "design") return [channel, 0, 0, alpha];
    if (type === "construction") return [0, channel, 0, alpha];
    return [0, 0, channel, alpha];
  }


  function titleSpectrumOverlayElement(media, url) {
    const overlay = document.createElement(media.kind === "video" ? "video" : "img");
    overlay.className = "title-spectrum-overlay";
    overlay.src = url;
    if (media.kind === "video") {
      overlay.muted = true;
      overlay.loop = true;
      overlay.autoplay = true;
      overlay.playsInline = true;
    } else {
      overlay.alt = media.name || "";
      overlay.draggable = false;
    }
    return overlay;
  }

  function mountTitleSpectrumAnimation(root) {
    const canvas = qs(".title-spectrum-canvas", root);
    const ctx = canvas.getContext("2d", { alpha: false });
    const bands = ["srgb", "ycbcr", "hsv", "oklab"];
    const absorptionLines = bands.map((_, bandIndex) => createTitleSpectrumAbsorptionLines(bandIndex));
    let destroyed = false;
    let raf = 0;
    const startTime = performance.now();

    const render = (time = performance.now()) => {
      if (destroyed) return;
      if (!canvas.clientWidth || !canvas.clientHeight) {
        raf = requestAnimationFrame(render);
        return;
      }
      drawTitleSpectrum(ctx, canvas, bands, absorptionLines, Math.max(0, time - startTime) / 1000);
      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      destroyed = true;
      if (raf) cancelAnimationFrame(raf);
    };
  }

  function drawTitleSpectrum(ctx, canvas, bands, absorptionLines, seconds) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    ctx.clearRect(0, 0, width, height);
    const bandHeight = height / bands.length;
    const colorOffset = seconds * 0.018;
    const visibleSpectrumSpan = 2 / 3;
    const maxX = Math.max(1, width - 1);
    bands.forEach((space, bandIndex) => {
      const y = Math.round(bandIndex * bandHeight);
      const h = Math.ceil((bandIndex + 1) * bandHeight) - y;
      const imageData = ctx.createImageData(width, h);
      const pixels = imageData.data;

      for (let x = 0; x < width; x += 1) {
        const t = wrap01((x / maxX) * visibleSpectrumSpan - colorOffset);
        const [r, g, b] = titleSpectrumColor(space, t);
        for (let yy = 0; yy < h; yy += 1) {
          const rowShade = 0.92 + (yy / Math.max(1, h - 1)) * 0.14;
          const index = (yy * width + x) * 4;
          pixels[index] = clamp(Math.round(r * rowShade), 0, 255);
          pixels[index + 1] = clamp(Math.round(g * rowShade), 0, 255);
          pixels[index + 2] = clamp(Math.round(b * rowShade), 0, 255);
          pixels[index + 3] = 255;
        }
      }

      ctx.putImageData(imageData, 0, y);
      drawTitleSpectrumAbsorption(ctx, absorptionLines[bandIndex], width, y, h, seconds, dpr);
      ctx.fillStyle = "rgba(0, 0, 0, 0.86)";
      ctx.fillRect(0, y, width, Math.max(1, Math.round(dpr)));
    });
    ctx.fillStyle = "rgba(0, 0, 0, 0.95)";
    ctx.fillRect(0, height - Math.max(1, Math.round(dpr)), width, Math.max(1, Math.round(dpr)));
  }

  function drawTitleSpectrumAbsorption(ctx, lines, width, y, height, seconds, dpr) {
    const baseMove = seconds * 10 * dpr;
    lines.forEach((line) => {
      const x = (((line.x * width + baseMove * line.speed) % (width + 80 * dpr)) + width) % (width + 80 * dpr) - 40 * dpr;
      const lineWidth = Math.max(1, line.width * dpr);
      const gradient = ctx.createLinearGradient(x - lineWidth * 1.6, 0, x + lineWidth * 1.6, 0);
      gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
      gradient.addColorStop(0.5, `rgba(0, 0, 0, ${line.opacity})`);
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(x - lineWidth * 1.6, y, lineWidth * 3.2, height);
    });
  }

  function createTitleSpectrumAbsorptionLines(bandIndex) {
    let seed = 1031 + bandIndex * 7919;
    const random = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    return Array.from({ length: 130 }, () => ({
      x: random(),
      width: 0.55 + random() ** 2 * 5.5,
      opacity: 0.08 + random() ** 1.8 * 0.42,
      speed: 0.78 + random() * 0.52,
    }));
  }

  function titleSpectrumColor(space, t) {
    const stops = [
      { t: 0, rgb: [0, 0, 255] },
      { t: 1 / 3, rgb: [0, 255, 0] },
      { t: 2 / 3, rgb: [255, 0, 0] },
      { t: 1, rgb: [0, 0, 255] },
    ];
    const index = stops.findIndex((stop, stopIndex) => stopIndex < stops.length - 1 && t >= stop.t && t <= stops[stopIndex + 1].t);
    const start = stops[Math.max(0, index)];
    const end = stops[Math.max(1, index + 1)];
    const localT = clamp((t - start.t) / Math.max(0.0001, end.t - start.t), 0, 1);
    if (space === "ycbcr") return titleSpectrumYcbcrMix(start.rgb, end.rgb, localT);
    if (space === "hsv") return titleSpectrumHsvMix(start.rgb, end.rgb, localT);
    if (space === "oklab") return titleSpectrumOklabMix(start.rgb, end.rgb, localT);
    return titleSpectrumRgbMix(start.rgb, end.rgb, localT);
  }

  function titleSpectrumRgbMix(a, b, t) {
    return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
  }

  function titleSpectrumYcbcrMix(a, b, t) {
    const from = titleSpectrumRgbToYcbcr(a);
    const to = titleSpectrumRgbToYcbcr(b);
    return titleSpectrumYcbcrToRgb([lerp(from[0], to[0], t), lerp(from[1], to[1], t), lerp(from[2], to[2], t)]);
  }

  function titleSpectrumRgbToYcbcr([r, g, b]) {
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;
    const y = 0.299 * rn + 0.587 * gn + 0.114 * bn;
    return [y, (bn - y) * 0.564, (rn - y) * 0.713];
  }

  function titleSpectrumYcbcrToRgb([y, cb, cr]) {
    return [
      clamp((y + 1.403 * cr) * 255, 0, 255),
      clamp((y - 0.344 * cb - 0.714 * cr) * 255, 0, 255),
      clamp((y + 1.773 * cb) * 255, 0, 255),
    ];
  }

  function titleSpectrumHsvMix(a, b, t) {
    const from = titleSpectrumRgbToHsv(a);
    const to = titleSpectrumRgbToHsv(b);
    let hueDelta = to[0] - from[0];
    if (Math.abs(hueDelta) > 180) hueDelta += hueDelta > 0 ? -360 : 360;
    return titleSpectrumHsvToRgb([(from[0] + hueDelta * t + 360) % 360, lerp(from[1], to[1], t), lerp(from[2], to[2], t)]);
  }

  function titleSpectrumRgbToHsv([r, g, b]) {
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;
    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    const delta = max - min;
    let h = 0;
    if (delta) {
      if (max === rn) h = 60 * (((gn - bn) / delta) % 6);
      else if (max === gn) h = 60 * ((bn - rn) / delta + 2);
      else h = 60 * ((rn - gn) / delta + 4);
    }
    return [(h + 360) % 360, max ? delta / max : 0, max];
  }

  function titleSpectrumHsvToRgb([h, s, v]) {
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;
    let rgb = [0, 0, 0];
    if (h < 60) rgb = [c, x, 0];
    else if (h < 120) rgb = [x, c, 0];
    else if (h < 180) rgb = [0, c, x];
    else if (h < 240) rgb = [0, x, c];
    else if (h < 300) rgb = [x, 0, c];
    else rgb = [c, 0, x];
    return rgb.map((value) => (value + m) * 255);
  }

  function titleSpectrumOklabMix(a, b, t) {
    const from = titleSpectrumRgbToOklab(a);
    const to = titleSpectrumRgbToOklab(b);
    return titleSpectrumOklabToRgb([lerp(from[0], to[0], t), lerp(from[1], to[1], t), lerp(from[2], to[2], t)]);
  }

  function titleSpectrumRgbToOklab([r, g, b]) {
    const rn = pcaVisulSrgbToLinear(r / 255);
    const gn = pcaVisulSrgbToLinear(g / 255);
    const bn = pcaVisulSrgbToLinear(b / 255);
    const l = Math.cbrt(0.4122214708 * rn + 0.5363325363 * gn + 0.0514459929 * bn);
    const m = Math.cbrt(0.2119034982 * rn + 0.6806995451 * gn + 0.1073969566 * bn);
    const s = Math.cbrt(0.0883024619 * rn + 0.2817188376 * gn + 0.6299787005 * bn);
    return [
      0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
      1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
      0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
    ];
  }

  function titleSpectrumOklabToRgb([L, a, b]) {
    const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
    return [
      titleSpectrumLinearToSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s) * 255,
      titleSpectrumLinearToSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s) * 255,
      titleSpectrumLinearToSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s) * 255,
    ].map((value) => clamp(value, 0, 255));
  }

  function titleSpectrumLinearToSrgb(value) {
    const clamped = clamp(value, 0, 1);
    if (clamped <= 0.0031308) return 12.92 * clamped;
    return 1.055 * clamped ** (1 / 2.4) - 0.055;
  }


  function renderTuringMachineStage(stage, slide, windowOptions = {}) {
    const config = ensureTuringMachine(slide);
    let runtime = turingRuntime.get(slide.id);
    if (!runtime || runtime.ruleCode !== config.ruleCode) runtime = createTuringRuntime(config.seedOnes, config.ruleCode);
    turingRuntime.set(slide.id, runtime);
    const rotorMarkup = Array.from({ length: 40 }, (_, index) => `<span class="turing-rotor" data-turing-rotor="${index}"></span>`).join("");

    const root = document.createElement("div");
    root.className = "turing-machine-stage";
    root.dataset.haltSteps = String(config.haltSteps);
    root.dataset.busyOnes = String(config.busyOnes);
    root.innerHTML = `
      <div class="turing-dom-layer">
        <div class="turing-field" aria-hidden="true"></div>
        <div class="turing-rotor-bank ${config.hideRotors ? "is-disabled" : ""}" aria-hidden="true">${rotorMarkup}</div>
        <div class="turing-title">
          <span>4-state / 2-symbol busy beaver / brady 1983</span>
          <strong>
            <span>Entscheidungsproblem</span>
            <span>Turing Machine</span>
          </strong>
          <code>${config.ruleCode}</code>
          <div class="turing-rule-inline">
            <div class="turing-rule-heading">halts after ${config.haltSteps} steps / leaves ${config.busyOnes} ones</div>
            <div class="turing-rule-grid">
              <span></span><strong>0</strong><strong>1</strong>
              <strong>A</strong><span>1 R B</span><span>1 L B</span>
              <strong>B</strong><span>1 L A</span><span>0 L C</span>
              <strong>C</strong><span>1 R Z</span><span>1 L D</span>
              <strong>D</strong><span>1 R D</span><span>0 R A</span>
            </div>
          </div>
        </div>
        <div class="turing-machine-head">
          <div class="turing-state-gauge" data-turing-state-gauge>
            <span class="turing-gauge-label is-a">A</span>
            <span class="turing-gauge-label is-b">B</span>
            <span class="turing-gauge-label is-c">C</span>
            <span class="turing-gauge-label is-d">D</span>
            <span class="turing-gauge-needle is-a" data-gauge-state="A"></span>
            <span class="turing-gauge-needle is-b" data-gauge-state="B"></span>
            <span class="turing-gauge-needle is-c" data-gauge-state="C"></span>
            <span class="turing-gauge-needle is-d" data-gauge-state="D"></span>
            <span class="turing-gauge-hub" data-turing-state>A</span>
          </div>
          <div class="turing-head-label">read / write head</div>
        </div>
        <div class="turing-head-line" aria-hidden="true"></div>
        <div class="turing-tape-viewport">
          <div class="turing-tape-track"></div>
        </div>
        <div class="turing-status">
          <span data-turing-step>step 0</span>
          <span data-turing-read>read 0</span>
          <span data-turing-rule>A,0 -> 1,R,B</span>
        </div>
      </div>
      <canvas class="turing-reference-crt-canvas" aria-hidden="true"></canvas>
    `;
    stage.appendChild(root);
    renderWindowLayers(stage, slide, windowOptions);

    const track = qs(".turing-tape-track", root);
    for (let pos = TURING_TAPE_MIN; pos <= TURING_TAPE_MAX; pos += 1) {
      const cell = document.createElement("div");
      cell.className = "turing-cell";
      cell.dataset.pos = String(pos);
      cell.innerHTML = `<span class="turing-cell-index">${pos}</span><strong>0</strong>`;
      track.appendChild(cell);
    }

    const crtCleanup = initTuringReferenceCrtShader(root, config.referenceCrt, runtime, config);
    const timer = window.setInterval(() => {
      if (runtime.halted && runtime.haltedAtMs !== null && performance.now() - runtime.haltedAtMs >= 1000) {
        Object.assign(runtime, createTuringRuntime(config.seedOnes, config.ruleCode));
      } else {
        stepTuringRuntime(runtime);
      }
      updateTuringMachineView(root, runtime);
    }, 1000 / (config.speed * TURING_RUNTIME_SPEED_MULTIPLIER));
    const resizeObserver = new ResizeObserver(() => updateTuringMachineView(root, runtime));
    resizeObserver.observe(root);
    updateTuringMachineView(root, runtime);

    specialCleanup = () => {
      window.clearInterval(timer);
      resizeObserver.disconnect();
      crtCleanup();
    };
  }

  function createTuringRuntime(seedOnes = TURING_SEED_ONES, ruleCode = TURING_RULE_CODE) {
    const tape = new Map();
    for (let pos = 0; pos < seedOnes; pos += 1) tape.set(pos, 1);
    return {
      ruleCode,
      tape,
      head: 0,
      state: "A",
      step: 0,
      halted: false,
      haltStep: null,
      haltedAtMs: null,
      lastRead: 0,
      lastRule: TURING_RULES.A[0],
    };
  }

  function stepTuringRuntime(runtime) {
    if (runtime.halted) return;
    const read = runtime.tape.get(runtime.head) || 0;
    const rule = TURING_RULES[runtime.state]?.[read];
    if (!rule) {
      runtime.halted = true;
      runtime.haltStep = runtime.step;
      runtime.haltedAtMs = performance.now();
      return;
    }
    if (rule.write) runtime.tape.set(runtime.head, rule.write);
    else runtime.tape.delete(runtime.head);
    runtime.head += rule.move;
    runtime.step += 1;
    runtime.lastRead = read;
    runtime.lastRule = rule;
    if (rule.next === "Z") {
      runtime.state = "Z";
      runtime.halted = true;
      runtime.haltStep = runtime.step;
      runtime.haltedAtMs = performance.now();
      return;
    }
    runtime.state = rule.next;
  }

  function countTuringOnes(runtime) {
    let count = 0;
    runtime.tape.forEach((value) => {
      if (value === 1) count += 1;
    });
    return count;
  }

  function updateTuringMachineView(root, runtime) {
    const width = root.clientWidth || 1280;
    const haltSteps = Number(root.dataset.haltSteps || TURING_HALT_STEPS);
    const busyOnes = Number(root.dataset.busyOnes || TURING_BUSY_ONES);
    const visualUnit = clamp(width / 1280, 0.72, 0.86);
    const cellSize = 54 * visualUnit;
    const focusX = width * TURING_FOCUS_X;
    const track = qs(".turing-tape-track", root);
    const cells = qsa(".turing-cell", track);
    const translateX = focusX - (runtime.head - TURING_TAPE_MIN + 0.5) * cellSize;
    root.style.setProperty("--turing-unit", String(visualUnit));
    root.style.setProperty("--turing-focus-x", `${TURING_FOCUS_X * 100}%`);
    track.style.setProperty("--turing-cell-size", `${cellSize}px`);
    track.style.transform = `translateX(${translateX}px)`;

    cells.forEach((cell) => {
      const pos = Number(cell.dataset.pos);
      const value = runtime.tape.get(pos) || 0;
      const symbol = qs("strong", cell);
      symbol.textContent = String(value);
      cell.classList.toggle("is-one", value === 1);
      cell.classList.toggle("is-zero", value === 0);
      cell.classList.toggle("is-head", pos === runtime.head);
      cell.classList.toggle("is-origin", pos === 0);
    });
    qsa(".turing-rotor", root).forEach((rotor, index) => {
      const samplePos = runtime.head + ((index % 11) - 5);
      const lit = (runtime.tape.get(samplePos) || 0) === 1;
      const phaseHit = (runtime.step + index * 7 + runtime.state.charCodeAt(0)) % 17 < 4;
      const turn = runtime.step * (index % 5 === 0 ? -9 : 7) + index * 23;
      const normalizedTurn = ((turn % 360) + 360) % 360;
      rotor.classList.toggle("is-lit", lit);
      rotor.classList.toggle("is-hot", phaseHit);
      rotor.style.setProperty("--rotor-turn", `${normalizedTurn}deg`);
    });

    const currentRead = runtime.tape.get(runtime.head) || 0;
    const rule = TURING_RULES[runtime.state]?.[currentRead] || runtime.lastRule;
    qs("[data-turing-state]", root).textContent = runtime.state;
    qsa("[data-gauge-state]", root).forEach((needle) => {
      needle.classList.toggle("is-active", !runtime.halted && needle.dataset.gaugeState === runtime.state);
    });
    if (runtime.halted) {
      qs("[data-turing-step]", root).textContent = `halted at step ${runtime.haltStep ?? runtime.step} / ${countTuringOnes(runtime)} ones`;
      qs("[data-turing-read]", root).textContent = `BB(4): S=${haltSteps}, Sigma=${busyOnes}`;
      qs("[data-turing-rule]", root).textContent = "halt state Z";
      return;
    }
    qs("[data-turing-step]", root).textContent = `step ${runtime.step} / halt at ${haltSteps}`;
    qs("[data-turing-read]", root).textContent = `${TURING_STATE_LABELS[runtime.state]} - read ${currentRead}`;
    qs("[data-turing-rule]", root).textContent = `${runtime.state},${currentRead} -> ${rule.write},${
      rule.move > 0 ? "R" : "L"
    },${rule.next}`;
  }

  function initTuringReferenceCrtShader(root, referenceParams = TURING_REFERENCE_CRT_DEFAULTS, runtime = null, config = defaultTuringMachine()) {
    const canvas = qs(".turing-reference-crt-canvas", root);
    if (!canvas) return () => {};
    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      powerPreference: "low-power",
    });
    if (!gl) {
      canvas.remove();
      return () => {};
    }

    const sceneCanvas = document.createElement("canvas");
    const sceneCtx = sceneCanvas.getContext("2d");
    const noiseCanvas = document.createElement("canvas");
    const noiseCtx = noiseCanvas.getContext("2d", { willReadFrequently: true });
    let noiseImage = null;

    const vertexSource = `#version 300 es
      precision highp float;
      const vec2 pos[4] = vec2[4](
        vec2(-1.0, -1.0),
        vec2(1.0, -1.0),
        vec2(-1.0, 1.0),
        vec2(1.0, 1.0)
      );
      const vec2 uvData[4] = vec2[4](
        vec2(0.0, 0.0),
        vec2(1.0, 0.0),
        vec2(0.0, 1.0),
        vec2(1.0, 1.0)
      );
      out vec2 vUv;
      void main() {
        vUv = uvData[gl_VertexID];
        gl_Position = vec4(pos[gl_VertexID], 0.0, 1.0);
      }
    `;
    const fragmentSource = `#version 300 es
      precision highp float;
      uniform sampler2D uTexture;
      uniform bool uEnabled;
      uniform float scanlineIntensity;
      uniform float scanlineCount;
      uniform float time;
      uniform float yOffset;
      uniform float brightness;
      uniform float contrast;
      uniform float saturation;
      uniform float bloomIntensity;
      uniform float bloomThreshold;
      uniform float rgbShift;
      uniform float adaptiveIntensity;
      uniform float vignetteStrength;
      uniform float curvature;
      uniform float flickerStrength;
      in vec2 vUv;
      out vec4 fragColor;

      const float PI = 3.14159265;
      const vec3 LUMA = vec3(0.299, 0.587, 0.114);
      const float BLOOM_THRESHOLD_FACTOR = 0.5;
      const float BLOOM_FACTOR_MULT = 1.5;
      const float RGB_SHIFT_SCALE = 0.005;
      const float RGB_SHIFT_INTENSITY = 0.08;

      vec2 curveRemapUV(vec2 uv, float curveStrength) {
        vec2 coords = uv * 2.0 - 1.0;
        float curveAmount = curveStrength * 0.25;
        float dist = dot(coords, coords);
        coords = coords * (1.0 + dist * curveAmount);
        return coords * 0.5 + 0.5;
      }

      vec4 sampleBloom(sampler2D tex, vec2 uv, float radius, vec4 centerSample) {
        vec2 o = vec2(radius);
        vec4 c = centerSample * 0.4;
        vec4 cross = (
          texture(tex, uv + vec2(o.x, 0.0)) +
          texture(tex, uv - vec2(o.x, 0.0)) +
          texture(tex, uv + vec2(0.0, o.y)) +
          texture(tex, uv - vec2(0.0, o.y))
        ) * 0.15;
        return c + cross;
      }

      float vignetteApprox(vec2 uv, float strength) {
        vec2 vigCoord = uv * 2.0 - 1.0;
        float dist = max(abs(vigCoord.x), abs(vigCoord.y));
        return 1.0 - dist * dist * strength;
      }

      void main() {
        if (!uEnabled) {
          fragColor = texture(uTexture, vUv);
          return;
        }
        vec2 uv = vUv;
        if (curvature > 0.001) {
          uv = curveRemapUV(uv, curvature);
          if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
            fragColor = vec4(0.0);
            return;
          }
        }

        vec4 pixel = texture(uTexture, uv);
        if (bloomIntensity > 0.001) {
          float pixelLum = dot(pixel.rgb, LUMA);
          float bloomThresholdHalf = bloomThreshold * BLOOM_THRESHOLD_FACTOR;
          if (pixelLum > bloomThresholdHalf) {
            vec4 bloomSample = sampleBloom(uTexture, uv, 0.005, pixel);
            bloomSample.rgb *= brightness;
            float bloomLum = dot(bloomSample.rgb, LUMA);
            float bloomFactor = bloomIntensity * max(0.0, (bloomLum - bloomThreshold) * BLOOM_FACTOR_MULT);
            pixel.rgb += bloomSample.rgb * bloomFactor;
          }
        }
        if (rgbShift > 0.005) {
          float shift = rgbShift * RGB_SHIFT_SCALE;
          pixel.r += texture(uTexture, vec2(uv.x + shift, uv.y)).r * RGB_SHIFT_INTENSITY;
          pixel.b += texture(uTexture, vec2(uv.x - shift, uv.y)).b * RGB_SHIFT_INTENSITY;
        }

        pixel.rgb *= brightness;
        float luminance = dot(pixel.rgb, LUMA);
        pixel.rgb = (pixel.rgb - 0.5) * contrast + 0.5;
        pixel.rgb = mix(vec3(luminance), pixel.rgb, saturation);

        float lightingMask = 1.0;
        if (scanlineIntensity > 0.001) {
          float scanlineY = (uv.y + yOffset) * scanlineCount;
          float scanlinePattern = abs(sin(scanlineY * PI));
          float adaptiveFactor = 1.0;
          if (adaptiveIntensity > 0.001) {
            float yPattern = sin(uv.y * 30.0) * 0.5 + 0.5;
            adaptiveFactor = 1.0 - yPattern * adaptiveIntensity * 0.2;
          }
          lightingMask *= 1.0 - scanlinePattern * scanlineIntensity * adaptiveFactor;
        }
        if (flickerStrength > 0.001) {
          lightingMask *= 1.0 + sin(time * 110.0) * flickerStrength;
        }
        if (vignetteStrength > 0.001) {
          lightingMask *= vignetteApprox(uv, vignetteStrength);
        }
        pixel.rgb *= lightingMask;
        fragColor = pixel;
      }
    `;

    const compileShader = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const message = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error(message || "Could not compile reference CRT shader.");
      }
      return shader;
    };

    let program;
    try {
      const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource);
      const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
      program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const message = gl.getProgramInfoLog(program);
        gl.deleteProgram(program);
        throw new Error(message || "Could not link reference CRT shader.");
      }
    } catch (error) {
      console.warn("Reference CRT shader disabled:", error);
      canvas.remove();
      return () => {};
    }

    const uniforms = {
      uTexture: gl.getUniformLocation(program, "uTexture"),
      uEnabled: gl.getUniformLocation(program, "uEnabled"),
      scanlineIntensity: gl.getUniformLocation(program, "scanlineIntensity"),
      scanlineCount: gl.getUniformLocation(program, "scanlineCount"),
      time: gl.getUniformLocation(program, "time"),
      yOffset: gl.getUniformLocation(program, "yOffset"),
      brightness: gl.getUniformLocation(program, "brightness"),
      contrast: gl.getUniformLocation(program, "contrast"),
      saturation: gl.getUniformLocation(program, "saturation"),
      bloomIntensity: gl.getUniformLocation(program, "bloomIntensity"),
      bloomThreshold: gl.getUniformLocation(program, "bloomThreshold"),
      rgbShift: gl.getUniformLocation(program, "rgbShift"),
      adaptiveIntensity: gl.getUniformLocation(program, "adaptiveIntensity"),
      vignetteStrength: gl.getUniformLocation(program, "vignetteStrength"),
      curvature: gl.getUniformLocation(program, "curvature"),
      flickerStrength: gl.getUniformLocation(program, "flickerStrength"),
    };
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.enable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const filter = referenceParams.smoothing ? gl.LINEAR : gl.NEAREST;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    canvas.dataset.crtShader = "git-reference-webgl-crt-shader";
    canvas.dataset.crtLayering = "windows-over-crt-over-turing";
    root.classList.add("is-webgl-rendered");

    let raf = 0;
    let disposed = false;
    let frameCount = 0;
    let sourceWidth = 0;
    let sourceHeight = 0;

    const resize = () => {
      const rect = root.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));
      const pixelSize = clamp(Math.round(Number(referenceParams.pixelSize) || 4), 1, 12);
      const lowWidth = Math.max(96, Math.round(width / pixelSize));
      const lowHeight = Math.max(27, Math.round(height / pixelSize));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
      if (sourceWidth !== lowWidth || sourceHeight !== lowHeight) {
        sourceWidth = lowWidth;
        sourceHeight = lowHeight;
        sceneCanvas.width = sourceWidth;
        sceneCanvas.height = sourceHeight;
        noiseCanvas.width = sourceWidth;
        noiseCanvas.height = sourceHeight;
        noiseImage = noiseCtx.createImageData(sourceWidth, sourceHeight);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, sourceWidth, sourceHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      }
      const filter = referenceParams.smoothing ? gl.LINEAR : gl.NEAREST;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
      canvas.dataset.pixelSize = String(pixelSize);
    };

    const hashNoise = (x, y, frame) => {
      let n = (x * 374761393 + y * 668265263 + frame * 69069) >>> 0;
      n = (n ^ (n >>> 13)) >>> 0;
      n = Math.imul(n, 1274126177) >>> 0;
      return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
    };

    const drawRoundRect = (ctx, x, y, width, height, radius) => {
      const r = Math.min(radius, width * 0.5, height * 0.5);
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + width - r, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + r);
      ctx.lineTo(x + width, y + height - r);
      ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
      ctx.lineTo(x + r, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    };

    const drawCenteredText = (ctx, text, x, y, color, font) => {
      ctx.save();
      ctx.fillStyle = color;
      ctx.font = font;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, x, y);
      ctx.restore();
    };

    const drawRotor = (ctx, cx, cy, radius, index, rt) => {
      const samplePos = rt.head + ((index % 11) - 5);
      const lit = (rt.tape.get(samplePos) || 0) === 1;
      const phaseHit = (rt.step + index * 7 + rt.state.charCodeAt(0)) % 17 < 4;
      const turn = ((rt.step * (index % 5 === 0 ? -9 : 7) + index * 23) % 360 + 360) % 360;
      const angle = (turn - 90) * Math.PI / 180;

      ctx.save();
      ctx.shadowBlur = phaseHit ? 14 : lit ? 9 : 5;
      ctx.shadowColor = phaseHit ? "rgba(210, 122, 68, 0.52)" : "rgba(134, 55, 43, 0.28)";
      const outer = ctx.createRadialGradient(cx, cy, radius * 0.12, cx, cy, radius);
      outer.addColorStop(0, phaseHit ? "#f1d5a6" : "#c8b8a2");
      outer.addColorStop(0.12, "rgba(241, 213, 166, 0)");
      outer.addColorStop(0.28, phaseHit ? "#8e3e2e" : "#5b2a20");
      outer.addColorStop(0.56, "#1c1717");
      outer.addColorStop(0.68, phaseHit ? "#d47f48" : "#a6553c");
      outer.addColorStop(1, "#161316");
      ctx.fillStyle = outer;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = lit || phaseHit ? "rgba(232, 190, 118, 0.98)" : "rgba(202, 132, 65, 0.76)";
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "rgba(235, 212, 178, 0.48)";
      ctx.setLineDash([1.5, 2.2]);
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.53, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = "#e6d3b7";
      ctx.lineWidth = 2;
      ctx.shadowBlur = 5;
      ctx.shadowColor = "rgba(232, 196, 145, 0.72)";
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * radius * 0.58, cy + Math.sin(angle) * radius * 0.58);
      ctx.stroke();
      ctx.restore();
    };

    const drawReferenceShapes = (ctx, time, width, height) => {
      const base = Math.min(width, height);
      const cx = width * 0.5;
      const cy = height * 0.46;
      const orbit = base * 0.18;
      const size = base * 0.12;
      const colors = ["rgba(180, 74, 38, 0.42)", "rgba(214, 154, 68, 0.36)", "rgba(112, 52, 42, 0.46)"];
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      colors.forEach((color, index) => {
        const angle = time * 0.45 + index * (Math.PI * 2 / 3);
        const x = cx + Math.cos(angle) * orbit;
        const y = cy + Math.sin(angle) * orbit;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(time * (0.8 + index * 0.16));
        ctx.fillStyle = color;
        if (index === 0) {
          ctx.fillRect(-size * 0.5, -size * 0.5, size, size);
        } else if (index === 1) {
          ctx.beginPath();
          ctx.arc(0, 0, size * 0.48, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.moveTo(0, -size * 0.58);
          ctx.lineTo(size * 0.52, size * 0.44);
          ctx.lineTo(-size * 0.52, size * 0.44);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      });
      ctx.restore();
    };

    const drawNoiseOverlay = (time) => {
      if (!noiseImage) return;
      const frame = Math.floor(time * 14);
      const data = noiseImage.data;
      for (let y = 0; y < sourceHeight; y += 1) {
        const scan = y % 2 === 0 ? 0.62 : 1;
        for (let x = 0; x < sourceWidth; x += 1) {
          const n = hashNoise(x >> 1, y >> 1, frame);
          const fine = hashNoise(x, y, frame + 17);
          const i = (y * sourceWidth + x) * 4;
          const warm = 18 + n * 54;
          data[i] = warm * scan;
          data[i + 1] = (14 + fine * 30) * scan;
          data[i + 2] = (10 + n * 22) * scan;
          data[i + 3] = 12 + n * 24;
        }
      }
      noiseCtx.putImageData(noiseImage, 0, 0);
      sceneCtx.save();
      sceneCtx.setTransform(1, 0, 0, 1, 0, 0);
      sceneCtx.globalCompositeOperation = "screen";
      sceneCtx.drawImage(noiseCanvas, 0, 0);
      sceneCtx.restore();
    };

    const drawTuringScene = (time) => {
      const rt = runtime || createTuringRuntime();
      const stageW = 1280;
      const stageH = 360;
      const unit = 0.86;
      const focusX = stageW * TURING_FOCUS_X;
      sceneCtx.save();
      sceneCtx.setTransform(sourceWidth / stageW, 0, 0, sourceHeight / stageH, 0, 0);
      sceneCtx.clearRect(0, 0, stageW, stageH);

      const bg = sceneCtx.createLinearGradient(0, 0, 0, stageH);
      bg.addColorStop(0, "#090b0d");
      bg.addColorStop(0.52, "#151010");
      bg.addColorStop(1, "#030303");
      sceneCtx.fillStyle = bg;
      sceneCtx.fillRect(0, 0, stageW, stageH);
      sceneCtx.globalCompositeOperation = "screen";
      let glow = sceneCtx.createRadialGradient(stageW * 0.625, stageH * 0.34, 0, stageW * 0.625, stageH * 0.34, stageW * 0.32);
      glow.addColorStop(0, "rgba(163, 75, 58, 0.2)");
      glow.addColorStop(1, "rgba(163, 75, 58, 0)");
      sceneCtx.fillStyle = glow;
      sceneCtx.fillRect(0, 0, stageW, stageH);
      glow = sceneCtx.createRadialGradient(stageW * 0.16, stageH * 0.78, 0, stageW * 0.16, stageH * 0.78, stageW * 0.28);
      glow.addColorStop(0, "rgba(28, 63, 82, 0.18)");
      glow.addColorStop(1, "rgba(28, 63, 82, 0)");
      sceneCtx.fillStyle = glow;
      sceneCtx.fillRect(0, 0, stageW, stageH);
      sceneCtx.globalCompositeOperation = "source-over";

      sceneCtx.strokeStyle = "rgba(226, 190, 144, 0.05)";
      sceneCtx.lineWidth = 1;
      for (let x = 0; x <= stageW; x += 44 * unit) {
        sceneCtx.beginPath();
        sceneCtx.moveTo(x, 0);
        sceneCtx.lineTo(x, stageH);
        sceneCtx.stroke();
      }
      for (let y = 0; y <= stageH; y += 44 * unit) {
        sceneCtx.beginPath();
        sceneCtx.moveTo(0, y);
        sceneCtx.lineTo(stageW, y);
        sceneCtx.stroke();
      }

      if (!config.hideRotors) {
        const left = stageW * 0.03;
        const top = stageH * 0.2;
        const areaW = stageW * 0.94;
        const areaH = stageH * 0.41;
        const gap = 10 * unit;
        const cellW = (areaW - gap * 19) / 20;
        const cellH = (areaH - gap) / 2;
        for (let index = 0; index < 40; index += 1) {
          const col = index % 20;
          const row = Math.floor(index / 20);
          const cx = left + col * (cellW + gap) + cellW * 0.5;
          const cy = top + row * (cellH + gap) + cellH * 0.5;
          drawRotor(sceneCtx, cx, cy, Math.min(cellW, cellH) * 0.36, index, rt);
        }
      }

      sceneCtx.fillStyle = "#9fafbc";
      sceneCtx.font = `${12 * unit}px "Courier New", Consolas, monospace`;
      sceneCtx.textAlign = "left";
      sceneCtx.textBaseline = "alphabetic";
      sceneCtx.fillText("4-state / 2-symbol busy beaver / brady 1983", 38, 35);
      sceneCtx.fillStyle = "#f3eadf";
      sceneCtx.shadowBlur = 14 * unit;
      sceneCtx.shadowColor = "rgba(0, 0, 0, 0.85)";
      sceneCtx.font = `800 ${46 * 0.4 * unit}px Arial, sans-serif`;
      sceneCtx.fillText("Entscheidungsproblem", 38, 56);
      sceneCtx.fillText("Turing Machine", 38, 76);
      sceneCtx.shadowBlur = 0;
      sceneCtx.fillStyle = "#c98752";
      sceneCtx.font = `${11 * unit}px "Courier New", Consolas, monospace`;
      sceneCtx.fillText(config.ruleCode, 38, 98);

      const tableX = 38;
      const tableY = 110;
      const colW = 96 * unit;
      const rowH = 16 * unit;
      sceneCtx.fillStyle = "#d3a16e";
      sceneCtx.font = `${10 * unit}px "Courier New", Consolas, monospace`;
      sceneCtx.fillText(`halts after ${config.haltSteps} steps / leaves ${config.busyOnes} ones`, tableX, tableY);
      const rows = [
        ["", "0", "1"],
        ["A", "1 R B", "1 L B"],
        ["B", "1 L A", "0 L C"],
        ["C", "1 R Z", "1 L D"],
        ["D", "1 R D", "0 R A"],
      ];
      rows.forEach((row, rowIndex) => {
        row.forEach((text, colIndex) => {
          const x = tableX + colIndex * colW;
          const y = tableY + 12 * unit + rowIndex * rowH;
          sceneCtx.fillStyle = colIndex === 0 ? "#e6d8c5" : "rgba(232, 213, 184, 0.07)";
          if (colIndex > 0 && rowIndex > 0) {
            drawRoundRect(sceneCtx, x, y - 10 * unit, colW - 5 * unit, 13 * unit, 3 * unit);
            sceneCtx.fill();
          }
          sceneCtx.fillStyle = rowIndex === 0 || colIndex === 0 ? "#e6d8c5" : "#e6d8c5";
          sceneCtx.font = `${10 * unit}px "Courier New", Consolas, monospace`;
          sceneCtx.fillText(text, x + 5 * unit, y);
        });
      });

      const gaugeR = 44 * unit;
      const gaugeCx = focusX;
      const gaugeCy = stageH * 0.31 + gaugeR;
      const gauge = sceneCtx.createRadialGradient(gaugeCx, gaugeCy, gaugeR * 0.1, gaugeCx, gaugeCy, gaugeR);
      gauge.addColorStop(0, "rgba(231, 202, 154, 0.95)");
      gauge.addColorStop(0.12, "rgba(231, 202, 154, 0)");
      gauge.addColorStop(0.38, "rgba(23, 18, 17, 0.95)");
      gauge.addColorStop(0.65, "rgba(92, 45, 35, 0.94)");
      gauge.addColorStop(1, "rgba(14, 12, 12, 0.98)");
      sceneCtx.shadowBlur = 28 * unit;
      sceneCtx.shadowColor = "rgba(196, 91, 58, 0.3)";
      sceneCtx.fillStyle = gauge;
      sceneCtx.beginPath();
      sceneCtx.arc(gaugeCx, gaugeCy, gaugeR, 0, Math.PI * 2);
      sceneCtx.fill();
      sceneCtx.shadowBlur = 0;
      sceneCtx.strokeStyle = "rgba(237, 193, 121, 0.82)";
      sceneCtx.lineWidth = 1.2 * unit;
      sceneCtx.stroke();
      sceneCtx.strokeStyle = "rgba(235, 210, 173, 0.38)";
      sceneCtx.beginPath();
      sceneCtx.moveTo(gaugeCx, gaugeCy - gaugeR * 0.76);
      sceneCtx.lineTo(gaugeCx, gaugeCy + gaugeR * 0.76);
      sceneCtx.moveTo(gaugeCx - gaugeR * 0.76, gaugeCy);
      sceneCtx.lineTo(gaugeCx + gaugeR * 0.76, gaugeCy);
      sceneCtx.stroke();
      drawCenteredText(sceneCtx, "A", gaugeCx, gaugeCy - gaugeR * 0.72, "#ecd6b6", `800 ${12 * unit}px Arial, sans-serif`);
      drawCenteredText(sceneCtx, "B", gaugeCx + gaugeR * 0.7, gaugeCy, "#ecd6b6", `800 ${12 * unit}px Arial, sans-serif`);
      drawCenteredText(sceneCtx, "C", gaugeCx, gaugeCy + gaugeR * 0.72, "#ecd6b6", `800 ${12 * unit}px Arial, sans-serif`);
      drawCenteredText(sceneCtx, "D", gaugeCx - gaugeR * 0.7, gaugeCy, "#ecd6b6", `800 ${12 * unit}px Arial, sans-serif`);
      ["A", "B", "C", "D"].forEach((stateName, index) => {
        const active = !rt.halted && rt.state === stateName;
        const angle = (-90 + index * 90) * Math.PI / 180;
        sceneCtx.strokeStyle = active ? "#f2c276" : "rgba(106, 82, 62, 0.7)";
        sceneCtx.lineWidth = active ? 3 * unit : 2 * unit;
        sceneCtx.shadowBlur = active ? 12 * unit : 0;
        sceneCtx.shadowColor = "rgba(224, 126, 71, 0.72)";
        sceneCtx.beginPath();
        sceneCtx.moveTo(gaugeCx, gaugeCy);
        sceneCtx.lineTo(gaugeCx + Math.cos(angle) * gaugeR * 0.42, gaugeCy + Math.sin(angle) * gaugeR * 0.42);
        sceneCtx.stroke();
      });
      sceneCtx.shadowBlur = 0;
      sceneCtx.fillStyle = "#201615";
      sceneCtx.beginPath();
      sceneCtx.arc(gaugeCx, gaugeCy, 12 * unit, 0, Math.PI * 2);
      sceneCtx.fill();
      sceneCtx.strokeStyle = "rgba(237, 193, 121, 0.8)";
      sceneCtx.stroke();
      drawCenteredText(sceneCtx, rt.state, gaugeCx, gaugeCy, "#f2dfbd", `800 ${13 * unit}px Arial, sans-serif`);
      drawCenteredText(sceneCtx, "READ / WRITE HEAD", gaugeCx, gaugeCy + gaugeR + 17 * unit, "#b4c1ca", `${11 * unit}px "Courier New", Consolas, monospace`);
      const headLine = sceneCtx.createLinearGradient(focusX, stageH * 0.48, focusX, stageH * 0.77);
      headLine.addColorStop(0, "rgba(205, 112, 70, 0)");
      headLine.addColorStop(0.5, "rgba(225, 177, 105, 0.95)");
      headLine.addColorStop(1, "rgba(205, 112, 70, 0)");
      sceneCtx.strokeStyle = headLine;
      sceneCtx.lineWidth = 2 * unit;
      sceneCtx.beginPath();
      sceneCtx.moveTo(focusX, stageH * 0.48);
      sceneCtx.lineTo(focusX, stageH * 0.77);
      sceneCtx.stroke();

      const tapeY = stageH - stageH * 0.17 - 86 * unit;
      const tapeH = 86 * unit;
      sceneCtx.fillStyle = "rgba(6, 6, 7, 0.62)";
      sceneCtx.fillRect(0, tapeY, stageW, tapeH);
      sceneCtx.strokeStyle = "rgba(220, 171, 111, 0.18)";
      sceneCtx.beginPath();
      sceneCtx.moveTo(0, tapeY);
      sceneCtx.lineTo(stageW, tapeY);
      sceneCtx.moveTo(0, tapeY + tapeH);
      sceneCtx.lineTo(stageW, tapeY + tapeH);
      sceneCtx.stroke();

      const cellSize = 54 * unit;
      const cellH = 60 * unit;
      const trackY = tapeY + 13 * unit;
      const translateX = focusX - (rt.head - TURING_TAPE_MIN + 0.5) * cellSize;
      for (let pos = TURING_TAPE_MIN; pos <= TURING_TAPE_MAX; pos += 1) {
        const x = translateX + (pos - TURING_TAPE_MIN) * cellSize;
        if (x > stageW || x + cellSize < 0) continue;
        const value = rt.tape.get(pos) || 0;
        sceneCtx.fillStyle = value === 1 ? "rgba(92, 45, 35, 0.96)" : "rgba(20, 20, 21, 0.96)";
        sceneCtx.fillRect(x, trackY, cellSize, cellH);
        sceneCtx.strokeStyle = pos === rt.head ? "rgba(236, 190, 111, 0.94)" : "rgba(232, 213, 184, 0.14)";
        sceneCtx.lineWidth = pos === rt.head ? 2 : 1;
        sceneCtx.strokeRect(x, trackY, cellSize, cellH);
        if (pos === 0) {
          sceneCtx.strokeStyle = "rgba(205, 145, 92, 0.38)";
          sceneCtx.strokeRect(x + 2, trackY + 2, cellSize - 4, cellH - 4);
        }
        sceneCtx.fillStyle = "rgba(232, 213, 184, 0.28)";
        sceneCtx.font = `${9 * unit}px "Courier New", Consolas, monospace`;
        sceneCtx.textAlign = "left";
        sceneCtx.textBaseline = "top";
        sceneCtx.fillText(String(pos), x + 5 * unit, trackY + 4 * unit);
        drawCenteredText(sceneCtx, String(value), x + cellSize * 0.5, trackY + cellH * 0.57, value === 1 ? "#f1dfbf" : "#68737b", `800 ${24 * unit}px Arial, sans-serif`);
      }

      const currentRead = rt.tape.get(rt.head) || 0;
      const rule = TURING_RULES[rt.state]?.[currentRead] || rt.lastRule;
      sceneCtx.fillStyle = "#d5c5ad";
      sceneCtx.font = `${13 * unit}px "Courier New", Consolas, monospace`;
      sceneCtx.textBaseline = "middle";
      sceneCtx.textAlign = "left";
      if (rt.halted) {
        sceneCtx.fillText(`halted at step ${rt.haltStep ?? rt.step} / ${countTuringOnes(rt)} ones`, 38, stageH * 0.94);
        sceneCtx.textAlign = "center";
        sceneCtx.fillText(`BB(4): S=${config.haltSteps}, Sigma=${config.busyOnes}`, stageW * 0.5, stageH * 0.94);
        sceneCtx.textAlign = "right";
        sceneCtx.fillText("halt state Z", stageW - 38, stageH * 0.94);
      } else {
        sceneCtx.fillText(`step ${rt.step} / halt at ${config.haltSteps}`, 38, stageH * 0.94);
        sceneCtx.textAlign = "center";
        sceneCtx.fillText(`${TURING_STATE_LABELS[rt.state]} - read ${currentRead}`, stageW * 0.5, stageH * 0.94);
        sceneCtx.textAlign = "right";
        sceneCtx.fillText(`${rt.state},${currentRead} -> ${rule.write},${rule.move > 0 ? "R" : "L"},${rule.next}`, stageW - 38, stageH * 0.94);
      }

      if (referenceParams.showShapes) drawReferenceShapes(sceneCtx, time, stageW, stageH);
      sceneCtx.restore();
      drawNoiseOverlay(time);
    };

    const render = (timeMs) => {
      if (disposed) return;
      const time = timeMs * 0.001;
      resize();
      drawTuringScene(time);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, sceneCanvas);

      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.useProgram(program);
      gl.bindVertexArray(vao);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.activeTexture(gl.TEXTURE0);
      gl.uniform1i(uniforms.uTexture, 0);
      gl.uniform1i(uniforms.uEnabled, referenceParams.enabled ? 1 : 0);
      gl.uniform1f(uniforms.scanlineIntensity, referenceParams.scanlineIntensity);
      gl.uniform1f(uniforms.scanlineCount, referenceParams.scanlineCount);
      gl.uniform1f(uniforms.time, time);
      gl.uniform1f(uniforms.yOffset, 0);
      gl.uniform1f(uniforms.brightness, referenceParams.brightness);
      gl.uniform1f(uniforms.contrast, referenceParams.contrast);
      gl.uniform1f(uniforms.saturation, referenceParams.saturation);
      gl.uniform1f(uniforms.bloomIntensity, referenceParams.bloomIntensity);
      gl.uniform1f(uniforms.bloomThreshold, referenceParams.bloomThreshold);
      gl.uniform1f(uniforms.rgbShift, referenceParams.rgbShift);
      gl.uniform1f(uniforms.adaptiveIntensity, referenceParams.adaptiveIntensity);
      gl.uniform1f(uniforms.vignetteStrength, referenceParams.vignetteStrength);
      gl.uniform1f(uniforms.curvature, referenceParams.curvature);
      gl.uniform1f(uniforms.flickerStrength, referenceParams.flickerStrength);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      canvas.dataset.crtFrame = String(frameCount);
      frameCount += 1;
      raf = window.requestAnimationFrame(render);
    };
    render(performance.now());

    return () => {
      disposed = true;
      window.cancelAnimationFrame(raf);
      gl.deleteTexture(texture);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
    };
  }



  function renderEmbCossimStage(stage, slide) {
    const config = ensureEmbCossim(slide);
    const labels = {
      1: "points",
      2: "text tags",
      3: "images",
      4: "coordinates",
    };
    const root = document.createElement("div");
    root.className = "emb-cossim-stage";
    root.innerHTML = `
      <canvas class="emb-cossim-canvas" aria-label="EMB-COSSIM embedding and cosine visualization"></canvas>
      <section class="emb-cossim-control-dock" aria-label="EMB-COSSIM display controls">
        <label class="emb-cossim-control-field">
          <span data-emb-cossim-mode-label>${labels[config.displayMode] || labels[2]}</span>
          <input data-emb-cossim-display-slider type="range" min="1" max="4" step="1" value="${config.displayMode}" />
          <span class="emb-cossim-mode-axis" aria-hidden="true">
            <i style="--tick: 0%">points</i>
            <i style="--tick: 33.333%">text</i>
            <i style="--tick: 66.667%">images</i>
            <i style="--tick: 100%">coords</i>
          </span>
        </label>
      </section>
      <div class="emb-cossim-loading" data-emb-cossim-loading>
        <div class="emb-cossim-loading-panel">Loading EMB-COSSIM</div>
      </div>
    `;
    appendInteractionHint(root, "Interaction", [
      "Drag canvas to orbit the embedding.",
      "Use the mode slider for points, text, images, or coordinates.",
      "Click two white anchors to show cosine angle.",
    ]);
    stage.appendChild(root);
    let cleanup = null;
    let cancelled = false;
    const frame = requestAnimationFrame(() => {
      if (cancelled) return;
      cleanup = mountEmbCossimViewerNative(root, slide);
    });
    specialCleanup = () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      if (cleanup) cleanup();
    };
  }

  function mountEmbCossimViewerNative(root, slide) {
    const config = ensureEmbCossim(slide);
    const canvas = qs(".emb-cossim-canvas", root);
    const controlDock = qs(".emb-cossim-control-dock", root);
    const displaySlider = qs("[data-emb-cossim-display-slider]", root);
    const displayModeLabel = qs("[data-emb-cossim-mode-label]", root);
    const loading = qs("[data-emb-cossim-loading]", root);
    const loadingPanel = qs(".emb-cossim-loading-panel", root);
    const labelLayer = document.createElement("div");
    labelLayer.className = "emb-cossim-label-layer";
    root.appendChild(labelLayer);

    const GRID_Y = -2.8;
    const GRID_ORIGIN = [0, GRID_Y, 0];
    const HOUSE_POSITION = [0, 0.15, 0];
    const DISPLAY_POINT_SIZE = { width: 16, height: 16 };
    const DISPLAY_IMAGE_SIZE = { width: 82, height: 58 };
    const cleanupFns = [];
    const selectedAnchors = [];
    const semanticImageSources = new Map();
    const selectionLabel = document.createElement("div");
    selectionLabel.className = "emb-cossim-scene-label theta";
    selectionLabel.hidden = true;
    labelLayer.appendChild(selectionLabel);

    const initialCamera = [8.5, 5.6, 9.2];
    const direction = embCossimNormalize3(embCossimSub3(initialCamera, HOUSE_POSITION));
    const orbit = {
      yaw: Math.atan2(direction[0], direction[2]),
      pitch: Math.asin(clamp(direction[1], -1, 1)),
      radius: lerp(5, 20, EMB_COSSIM_FIXED_ZOOM),
      autoRotate: true,
      pointer: null,
      fov: 48,
    };

    let destroyed = false;
    let raf = 0;
    let lastTime = performance.now();
    let pointerStart = null;
    let displayMode = Math.round(clamp(Number(config.displayMode ?? 2), 1, 4));
    let data = null;
    let glState = null;
    const resizeObserver = new ResizeObserver(() => draw());

    const addListener = (target, type, handler, options) => {
      target?.addEventListener(type, handler, options);
      cleanupFns.push(() => target?.removeEventListener(type, handler, options));
    };
    const stopStageEvent = (event) => event.stopPropagation();
    const stopStageWheel = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };

    ["click", "dblclick"].forEach((type) => addListener(canvas, type, stopStageEvent));
    addListener(canvas, "wheel", stopStageWheel, { passive: false });
    addListener(canvas, "contextmenu", (event) => {
      event.preventDefault();
      event.stopPropagation();
    });
    ["pointerdown", "pointermove", "pointerup", "pointercancel", "click", "input"].forEach((type) => {
      addListener(controlDock, type, stopStageEvent);
    });
    addListener(controlDock, "wheel", stopStageWheel, { passive: false });

    try {
      data = createEmbCossimData();
      glState = createEmbCossimGlState(canvas, data);
      bindSemanticSelection();
      bindUiControls();
      loadSemanticImageSources();
      resizeObserver.observe(root);
      loading?.classList.add("is-hidden");
      draw();
      raf = requestAnimationFrame(tick);
    } catch (error) {
      loading?.classList.add("has-error");
      if (loadingPanel) loadingPanel.textContent = error instanceof Error ? error.message : "EMB-COSSIM failed to load";
    }

    function createEmbCossimData() {
      const random = embCossimSeededRandom(20260521);
      const semanticRandom = embCossimSeededRandom(20260522);
      const anchors = [
        { label: "house", position: [0, 0.15, 0] },
        { label: "home", position: [-0.82, 0.55, -0.26] },
        { label: "family", position: [-1.72, 1.08, -0.58] },
        { label: "household", position: [-1.24, 0.82, 0.12] },
        { label: "dwelling", position: [-0.46, 0.28, 0.16] },
        { label: "villa", position: [0.62, 0.18, 0.66] },
        { label: "townhouse", position: [1.18, 0.02, 1.16] },
        { label: "terrace", position: [2.02, -0.22, 1.88] },
        { label: "rowhouse", position: [1.54, -0.08, 1.42] },
        { label: "courtyard", position: [0.52, 0.28, 1.58] },
        { label: "backyard", position: [1.04, 0.56, 1.34] },
        { label: "garden", position: [1.18, 0.86, 1.1] },
        { label: "residence", position: [0.72, 0.48, -0.56] },
        { label: "occupier", position: [1.34, 0.82, -1.02] },
        { label: "settlement", position: [2.16, 1.18, -1.58] },
        { label: "inhabitant", position: [1.0, 0.74, -0.82] },
        { label: "neighborhood", position: [1.68, 0.98, -1.34] },
        { label: "community", position: [2.48, 1.28, -1.88] },
        { label: "apartment", position: [0.82, 0.0, 0.22] },
      ].map((anchor) => ({
        ...anchor,
        selected: false,
        position: embCossimRotateY(anchor.position, ((semanticRandom() - 0.5) * 60 * Math.PI) / 180),
      }));
      const houseAnchor = anchors.find((anchor) => anchor.label === "house") || anchors[0];
      const cloudPositions = new Float32Array(5400 * 3);
      const cloudColors = new Float32Array(5400 * 3);
      for (let i = 0; i < 5400; i += 1) {
        const position = embCossimSampleGlobalGaussian(random);
        cloudPositions.set(position, i * 3);
        const distanceSquared = embCossimDistanceSquared(position, houseAnchor.position);
        const brightness = 0.055 + 0.42 * Math.exp(-distanceSquared / 13.2);
        cloudColors.set([brightness, brightness, brightness], i * 3);
      }
      anchors.forEach((anchor) => {
        anchor.cardPosition = embCossimAdd3(anchor.position, [0, 0.24, 0]);
        createSemanticCard(anchor);
      });
      const markerData = new Float32Array(anchors.length * 4);
      updateMarkerData(anchors, markerData);
      return {
        anchors,
        cloudPositions,
        cloudColors,
        gridLines: new Float32Array(createEmbCossimGridLines()),
        pathLines: new Float32Array(createEmbCossimPathLines(anchors)),
        markerData,
        selectionLines: new Float32Array(0),
        selectionSector: new Float32Array(0),
        selectionLabelPosition: null,
      };
    }

    function createEmbCossimGlState(targetCanvas, visualData) {
      const gl = targetCanvas.getContext("webgl", { alpha: false, antialias: true, powerPreference: "high-performance" });
      if (!gl) throw new Error("WebGL is not available for EMB-COSSIM.");
      const lineProgram = embCossimCreateProgram(gl, embCossimLineVertexShaderSource(), embCossimLineFragmentShaderSource());
      const pointProgram = embCossimCreateProgram(gl, embCossimPointVertexShaderSource(), embCossimPointFragmentShaderSource());
      const markerProgram = embCossimCreateProgram(gl, embCossimMarkerVertexShaderSource(), embCossimMarkerFragmentShaderSource());
      return {
        canvas: targetCanvas,
        gl,
        lineProgram,
        pointProgram,
        markerProgram,
        buffers: {
          cloudPosition: embCossimCreateBuffer(gl, visualData.cloudPositions),
          cloudColor: embCossimCreateBuffer(gl, visualData.cloudColors),
          gridLines: embCossimCreateBuffer(gl, visualData.gridLines),
          pathLines: embCossimCreateBuffer(gl, visualData.pathLines),
          markers: embCossimCreateBuffer(gl, visualData.markerData, gl.DYNAMIC_DRAW),
          selectionLines: embCossimCreateBuffer(gl, visualData.selectionLines, gl.DYNAMIC_DRAW),
          selectionSector: embCossimCreateBuffer(gl, visualData.selectionSector, gl.DYNAMIC_DRAW),
        },
        counts: {
          cloud: visualData.cloudPositions.length / 3,
          gridLines: visualData.gridLines.length / 7,
          pathLines: visualData.pathLines.length / 7,
          markers: visualData.markerData.length / 4,
          selectionLines: 0,
          selectionSector: 0,
        },
        lineLocations: {
          matrix: gl.getUniformLocation(lineProgram, "u_matrix"),
          anchorShift: gl.getUniformLocation(lineProgram, "u_anchorShift"),
          position: gl.getAttribLocation(lineProgram, "a_position"),
          color: gl.getAttribLocation(lineProgram, "a_color"),
        },
        pointLocations: {
          matrix: gl.getUniformLocation(pointProgram, "u_matrix"),
          anchorShift: gl.getUniformLocation(pointProgram, "u_anchorShift"),
          pointSize: gl.getUniformLocation(pointProgram, "u_pointSize"),
          alpha: gl.getUniformLocation(pointProgram, "u_alpha"),
          position: gl.getAttribLocation(pointProgram, "a_position"),
          color: gl.getAttribLocation(pointProgram, "a_color"),
        },
        markerLocations: {
          matrix: gl.getUniformLocation(markerProgram, "u_matrix"),
          anchorShift: gl.getUniformLocation(markerProgram, "u_anchorShift"),
          dpr: gl.getUniformLocation(markerProgram, "u_dpr"),
          position: gl.getAttribLocation(markerProgram, "a_position"),
          selected: gl.getAttribLocation(markerProgram, "a_selected"),
        },
      };
    }

    function bindSemanticSelection() {
      addListener(canvas, "pointerdown", handlePointerDown);
      addListener(canvas, "pointermove", handlePointerMove);
      addListener(canvas, "pointerup", handlePointerUp);
      addListener(canvas, "pointercancel", clearPointer);
    }

    function bindUiControls() {
      syncDisplayControl();
      addListener(displaySlider, "input", () => {
        displayMode = Math.round(clamp(Number(displaySlider.value || 1), 1, 4));
        config.displayMode = displayMode;
        syncDisplayControl();
        updateDisplayMode(true);
        draw();
      });
      updateDisplayMode(false);
    }

    function handlePointerDown(event) {
      if (event.button !== undefined && event.button !== 0) return;
      event.preventDefault();
      event.stopPropagation();
      orbit.autoRotate = false;
      pointerStart = { x: event.clientX, y: event.clientY };
      orbit.pointer = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        yaw: orbit.yaw,
        pitch: orbit.pitch,
      };
      canvas.setPointerCapture?.(event.pointerId);
    }

    function handlePointerMove(event) {
      event.preventDefault();
      event.stopPropagation();
      if (!orbit.pointer || orbit.pointer.id !== event.pointerId) {
        canvas.style.cursor = pickSemanticAnchor(event) ? "pointer" : "grab";
        return;
      }
      const dx = event.clientX - orbit.pointer.x;
      const dy = event.clientY - orbit.pointer.y;
      orbit.yaw = orbit.pointer.yaw - dx * 0.006;
      orbit.pitch = clamp(orbit.pointer.pitch + dy * 0.006, -Math.PI / 2 + 0.01, Math.PI / 2 - 0.01);
      draw();
    }

    function handlePointerUp(event) {
      if (!orbit.pointer || (event.pointerId !== undefined && orbit.pointer.id !== event.pointerId)) return;
      event.preventDefault();
      event.stopPropagation();
      const movement = pointerStart ? Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) : Infinity;
      clearPointer(event);
      if (movement > 5) return;
      const anchor = pickSemanticAnchor(event);
      if (anchor) selectSemanticAnchor(anchor);
    }

    function clearPointer(event) {
      if (event?.pointerId !== undefined) canvas.releasePointerCapture?.(event.pointerId);
      orbit.pointer = null;
      pointerStart = null;
    }

    function syncDisplayControl() {
      const labels = {
        1: "points",
        2: "text tags",
        3: "images",
        4: "coordinates",
      };
      displayMode = Math.round(clamp(Number(displayMode || 2), 1, 4));
      if (displaySlider) displaySlider.value = String(displayMode);
      if (displayModeLabel) displayModeLabel.textContent = labels[displayMode] || labels[1];
    }

    function updateDisplayMode(animate = true) {
      syncDisplayControl();
      data?.anchors.forEach((anchor) => {
        if (displayMode === 3 && anchor.displayImage && !anchor.displayImage.getAttribute("src")) setSemanticImage(anchor);
        applySemanticDisplayMode(anchor, displayMode, animate);
      });
    }

    function selectSemanticAnchor(anchor) {
      const existingIndex = selectedAnchors.indexOf(anchor);
      if (existingIndex >= 0) {
        selectedAnchors.splice(existingIndex, 1);
      } else if (selectedAnchors.length >= 2) {
        selectedAnchors.splice(0, selectedAnchors.length, anchor);
      } else {
        selectedAnchors.push(anchor);
      }
      updateSelection();
      draw();
    }

    function updateSelection() {
      data.anchors.forEach((anchor) => {
        anchor.selected = selectedAnchors.includes(anchor);
        anchor.displayElement.classList.toggle("selected", anchor.selected);
      });
      updateMarkerData(data.anchors, data.markerData);
      embCossimUpdateBuffer(glState.gl, glState.buffers.markers, data.markerData);
      if (selectedAnchors.length !== 2) {
        data.selectionLines = new Float32Array(0);
        data.selectionSector = new Float32Array(0);
        data.selectionLabelPosition = null;
        selectionLabel.hidden = true;
      } else {
        updateSelectionGeometry(selectedAnchors[0], selectedAnchors[1]);
      }
      embCossimUpdateBuffer(glState.gl, glState.buffers.selectionLines, data.selectionLines);
      embCossimUpdateBuffer(glState.gl, glState.buffers.selectionSector, data.selectionSector);
      glState.counts.selectionLines = data.selectionLines.length / 7;
      glState.counts.selectionSector = data.selectionSector.length / 7;
    }

    function updateSelectionGeometry(firstAnchor, secondAnchor) {
      const origin = GRID_ORIGIN;
      const first = firstAnchor.position;
      const second = secondAnchor.position;
      const firstVector = embCossimSub3(first, origin);
      const secondVector = embCossimSub3(second, origin);
      const firstLength = embCossimLength3(firstVector);
      const secondLength = embCossimLength3(secondVector);
      if (firstLength < 0.001 || secondLength < 0.001) return;
      const firstDir = embCossimScale3(firstVector, 1 / firstLength);
      const secondDir = embCossimScale3(secondVector, 1 / secondLength);
      const cosine = clamp(embCossimDot3(firstDir, secondDir), -1, 1);
      const theta = Math.acos(cosine);
      const radius = Math.min(1.5, firstLength, secondLength);
      const arcPoints = [];
      for (let i = 0; i <= 44; i += 1) {
        arcPoints.push(embCossimAdd3(origin, embCossimScale3(embCossimSlerpDir(firstDir, secondDir, theta, i / 44), radius)));
      }
      const lineVertices = [];
      appendEmbCossimLine(lineVertices, origin, first, [1, 1, 1, 0.86], [1, 1, 1, 0.86]);
      appendEmbCossimLine(lineVertices, origin, second, [1, 1, 1, 0.86], [1, 1, 1, 0.86]);
      for (let i = 0; i < arcPoints.length - 1; i += 1) {
        appendEmbCossimLine(lineVertices, arcPoints[i], arcPoints[i + 1], [1, 1, 1, 0.95], [1, 1, 1, 0.95]);
      }
      const sectorVertices = [];
      for (let i = 0; i < arcPoints.length - 1; i += 1) {
        appendEmbCossimVertex(sectorVertices, origin, [1, 1, 1, 0.22]);
        appendEmbCossimVertex(sectorVertices, arcPoints[i], [1, 1, 1, 0.22]);
        appendEmbCossimVertex(sectorVertices, arcPoints[i + 1], [1, 1, 1, 0.22]);
      }
      data.selectionLabelPosition = embCossimAdd3(origin, embCossimScale3(embCossimSlerpDir(firstDir, secondDir, theta, 0.5), radius + 0.22));
      selectionLabel.textContent = `\u03b8 = ${((theta * 180) / Math.PI).toFixed(0)}\u00b0  cos(\u03b8) = ${cosine.toFixed(2)}`;
      selectionLabel.hidden = false;
      data.selectionLines = new Float32Array(lineVertices);
      data.selectionSector = new Float32Array(sectorVertices);
    }

    function pickSemanticAnchor(event) {
      if (!data) return null;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      let best = null;
      let bestDistance = 16;
      data.anchors.forEach((anchor) => {
        if (!anchor.screen || anchor.screen.behind) return;
        const distance = Math.hypot(anchor.screen.x - x, anchor.screen.y - y);
        if (distance < bestDistance) {
          best = anchor;
          bestDistance = distance;
        }
      });
      return best;
    }

    async function loadSemanticImageSources() {
      try {
        const response = await fetch(localFileURL(EMB_COSSIM_SOURCES_PATH), { cache: "no-store" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const sources = await response.json();
        sources.forEach((source) => {
          semanticImageSources.set(source.term, localFileURL(embCossimAssetPath(source.imageUrl)));
        });
        if (displayMode === 3) updateDisplayMode(false);
      } catch {
        // Image mode still works as empty framed placeholders if metadata is unavailable.
      }
    }

    function tick(now) {
      if (destroyed) return;
      const delta = Math.min(80, now - lastTime);
      lastTime = now;
      if (orbit.autoRotate) orbit.yaw += delta * 0.00001885;
      draw();
      raf = requestAnimationFrame(tick);
    }

    function draw() {
      if (destroyed || !glState || !data) return;
      const { gl } = glState;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      orbit.fov = canvas.clientWidth < 620 ? 62 : canvas.clientWidth < 980 ? 55 : 48;
      const matrix = embCossimViewProjectionMatrix(width / height);
      const anchorShift = new Float32Array([EMB_COSSIM_FOCUS_X * 2 - 1, 0]);

      gl.viewport(0, 0, width, height);
      gl.clearColor(0.0196, 0.0235, 0.0235, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.depthMask(false);

      drawEmbCossimLineBuffer(glState.buffers.gridLines, glState.counts.gridLines, matrix, anchorShift, gl.LINES);
      drawEmbCossimPointCloud(matrix, anchorShift, dpr);
      drawEmbCossimLineBuffer(glState.buffers.pathLines, glState.counts.pathLines, matrix, anchorShift, gl.LINES);
      drawEmbCossimLineBuffer(glState.buffers.selectionSector, glState.counts.selectionSector, matrix, anchorShift, gl.TRIANGLES);
      drawEmbCossimLineBuffer(glState.buffers.selectionLines, glState.counts.selectionLines, matrix, anchorShift, gl.LINES);
      drawEmbCossimMarkers(matrix, anchorShift, dpr);
      gl.depthMask(true);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      updateProjectedDom(matrix, canvas.clientWidth, canvas.clientHeight);
    }

    function drawEmbCossimPointCloud(matrix, anchorShift, dpr) {
      const { gl } = glState;
      gl.useProgram(glState.pointProgram);
      gl.uniformMatrix4fv(glState.pointLocations.matrix, false, matrix);
      gl.uniform2fv(glState.pointLocations.anchorShift, anchorShift);
      gl.uniform1f(glState.pointLocations.pointSize, 10 * dpr);
      gl.uniform1f(glState.pointLocations.alpha, 0.76);
      embCossimBindAttribute(gl, glState.pointLocations.position, glState.buffers.cloudPosition, 3);
      embCossimBindAttribute(gl, glState.pointLocations.color, glState.buffers.cloudColor, 3);
      gl.drawArrays(gl.POINTS, 0, glState.counts.cloud);
    }

    function drawEmbCossimMarkers(matrix, anchorShift, dpr) {
      const { gl } = glState;
      gl.useProgram(glState.markerProgram);
      gl.uniformMatrix4fv(glState.markerLocations.matrix, false, matrix);
      gl.uniform2fv(glState.markerLocations.anchorShift, anchorShift);
      gl.uniform1f(glState.markerLocations.dpr, dpr);
      gl.bindBuffer(gl.ARRAY_BUFFER, glState.buffers.markers);
      gl.enableVertexAttribArray(glState.markerLocations.position);
      gl.vertexAttribPointer(glState.markerLocations.position, 3, gl.FLOAT, false, 16, 0);
      gl.enableVertexAttribArray(glState.markerLocations.selected);
      gl.vertexAttribPointer(glState.markerLocations.selected, 1, gl.FLOAT, false, 16, 12);
      gl.drawArrays(gl.POINTS, 0, glState.counts.markers);
    }

    function drawEmbCossimLineBuffer(buffer, count, matrix, anchorShift, mode) {
      if (!count) return;
      const { gl } = glState;
      gl.useProgram(glState.lineProgram);
      gl.uniformMatrix4fv(glState.lineLocations.matrix, false, matrix);
      gl.uniform2fv(glState.lineLocations.anchorShift, anchorShift);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(glState.lineLocations.position);
      gl.vertexAttribPointer(glState.lineLocations.position, 3, gl.FLOAT, false, 28, 0);
      gl.enableVertexAttribArray(glState.lineLocations.color);
      gl.vertexAttribPointer(glState.lineLocations.color, 4, gl.FLOAT, false, 28, 12);
      gl.drawArrays(mode, 0, count);
    }

    function updateProjectedDom(matrix, width, height) {
      const anchorShift = [EMB_COSSIM_FOCUS_X * 2 - 1, 0];
      data.anchors.forEach((anchor) => {
        const projectedPoint = embCossimProject(anchor.position, matrix, width, height, anchorShift);
        const projectedCard = embCossimProject(anchor.cardPosition, matrix, width, height, anchorShift);
        anchor.screen = projectedPoint;
        anchor.displayElement.hidden = projectedCard.behind;
        if (!projectedCard.behind) {
          anchor.displayElement.style.transform = `translate(${projectedCard.x}px, ${projectedCard.y}px) translate(-50%, -50%)`;
        }
      });
      if (data.selectionLabelPosition && !selectionLabel.hidden) {
        const projectedLabel = embCossimProject(data.selectionLabelPosition, matrix, width, height, anchorShift);
        selectionLabel.hidden = projectedLabel.behind;
        if (!projectedLabel.behind) {
          selectionLabel.style.transform = `translate(${projectedLabel.x}px, ${projectedLabel.y}px) translate(-50%, -50%)`;
        }
      }
    }

    function createSemanticCard(anchor) {
      const div = document.createElement("div");
      div.className = "emb-cossim-semantic-card";
      div.dataset.mode = "points";
      div.style.position = "absolute";
      const textPane = document.createElement("div");
      textPane.className = "emb-cossim-semantic-card-pane emb-cossim-semantic-card-text";
      textPane.textContent = anchor.label;
      const imagePane = document.createElement("div");
      imagePane.className = "emb-cossim-semantic-card-pane emb-cossim-semantic-card-image";
      const img = document.createElement("img");
      img.alt = anchor.label;
      img.loading = "lazy";
      img.decoding = "async";
      img.width = 512;
      img.height = 512;
      imagePane.appendChild(img);
      const coordPane = document.createElement("div");
      coordPane.className = "emb-cossim-semantic-card-pane emb-cossim-semantic-card-coord";
      coordPane.textContent = formatEmbCossimCoord(anchor.position);
      div.append(textPane, imagePane, coordPane);
      labelLayer.appendChild(div);
      anchor.displayElement = div;
      anchor.displayImage = img;
      anchor.displaySizes = {
        1: DISPLAY_POINT_SIZE,
        2: measureSemanticCardMode(anchor, "text"),
        3: DISPLAY_IMAGE_SIZE,
        4: measureSemanticCardMode(anchor, "coord"),
      };
      applySemanticDisplayMode(anchor, 1, false);
    }

    function measureSemanticCardMode(anchor, modeName) {
      const probe = document.createElement("div");
      probe.className = "emb-cossim-semantic-card emb-cossim-semantic-card-measure";
      probe.dataset.mode = modeName;
      const pane = document.createElement("div");
      pane.className = `emb-cossim-semantic-card-pane emb-cossim-semantic-card-${modeName}`;
      pane.textContent = modeName === "coord" ? formatEmbCossimCoord(anchor.position) : anchor.label;
      probe.appendChild(pane);
      labelLayer.appendChild(probe);
      const rect = probe.getBoundingClientRect();
      const size = {
        width: Math.ceil(rect.width || probe.offsetWidth || 1),
        height: Math.ceil(rect.height || probe.offsetHeight || 1),
      };
      probe.remove();
      return size;
    }

    function applySemanticDisplayMode(anchor, mode, animate) {
      const element = anchor.displayElement;
      const size = anchor.displaySizes[mode] || DISPLAY_POINT_SIZE;
      element.classList.toggle("no-transition", !animate);
      element.dataset.mode = modeToDisplayName(mode);
      element.style.width = `${size.width}px`;
      element.style.height = `${size.height}px`;
      element.classList.toggle("is-empty", mode === 1);
      if (!animate) {
        element.offsetWidth;
        element.classList.remove("no-transition");
      }
    }

    function modeToDisplayName(mode) {
      if (mode === 2) return "text";
      if (mode === 3) return "image";
      if (mode === 4) return "coord";
      return "points";
    }

    function setSemanticImage(anchor) {
      const imageUrl = semanticImageSources.get(anchor.label);
      if (!imageUrl) return;
      const img = anchor.displayImage;
      if (img && img.getAttribute("src") !== imageUrl) img.src = imageUrl;
    }

    function embCossimAssetPath(sourceUrl) {
      const value = String(sourceUrl || "").replaceAll("\\", "/");
      if (/^[a-zA-Z]:\//.test(value)) return value;
      return `${EMB_COSSIM_DATA_ROOT}/${value.replace(/^\.?\//, "")}`;
    }

    function createEmbCossimPathLines(anchors) {
      const lines = [];
      [
        { labels: ["house", "home", "household", "family"], alpha: 0.18 },
        { labels: ["house", "villa", "townhouse", "rowhouse", "terrace"], alpha: 0.18 },
        { labels: ["house", "residence", "inhabitant", "occupier", "neighborhood", "settlement", "community"], alpha: 0.16 },
        { labels: ["house", "dwelling", "apartment"], alpha: 0.14 },
        { labels: ["villa", "courtyard", "backyard", "garden"], alpha: 0.14 },
      ].forEach((path) => {
        const points = path.labels.map((label) => anchors.find((anchor) => anchor.label === label)).filter(Boolean);
        for (let i = 0; i < points.length - 1; i += 1) {
          appendEmbCossimLine(lines, points[i].position, points[i + 1].position, [1, 1, 1, path.alpha], [1, 1, 1, path.alpha]);
        }
      });
      return lines;
    }

    function createEmbCossimGridLines() {
      const vertices = [];
      const radius = 14.5;
      const fadeStart = 8.25;
      const divisions = 104;
      const color = [0.8745, 0.9059, 0.851, 1];
      for (let line = -14; line <= 14; line += 1) {
        appendGridLineSegments(vertices, [line, GRID_Y, -radius], [line, GRID_Y, radius], divisions, radius, fadeStart, color);
        appendGridLineSegments(vertices, [-radius, GRID_Y, line], [radius, GRID_Y, line], divisions, radius, fadeStart, color);
      }
      return vertices;
    }

    function appendGridLineSegments(vertices, from, to, divisions, radius, fadeStart, color) {
      let previous = from;
      let previousAlpha = embCossimGridAlpha(previous, radius, fadeStart);
      for (let i = 1; i <= divisions; i += 1) {
        const t = i / divisions;
        const current = [lerp(from[0], to[0], t), lerp(from[1], to[1], t), lerp(from[2], to[2], t)];
        const currentAlpha = embCossimGridAlpha(current, radius, fadeStart);
        if (previousAlpha > 0.002 || currentAlpha > 0.002) {
          appendEmbCossimLine(
            vertices,
            previous,
            current,
            [color[0], color[1], color[2], previousAlpha],
            [color[0], color[1], color[2], currentAlpha],
          );
        }
        previous = current;
        previousAlpha = currentAlpha;
      }
    }

    function embCossimGridAlpha(point, radius, fadeStart) {
      const distance = Math.hypot(point[0], point[2]);
      if (distance >= radius) return 0;
      return 0.3 * (1 - smoothstep(fadeStart, radius, distance));
    }

    function updateMarkerData(anchors, markerData) {
      anchors.forEach((anchor, index) => {
        const offset = index * 4;
        markerData[offset] = anchor.position[0];
        markerData[offset + 1] = anchor.position[1];
        markerData[offset + 2] = anchor.position[2];
        markerData[offset + 3] = anchor.selected ? 1 : 0;
      });
    }

    function embCossimSampleGlobalGaussian(random) {
      return embCossimRotateY([embCossimNormalRandom(random) * 2.8, 0.42 + embCossimNormalRandom(random) * 1.05, embCossimNormalRandom(random) * 2.45], -0.18);
    }

    function embCossimViewProjectionMatrix(aspect) {
      const camera = embCossimCameraPosition();
      const projection = pcaVisulMat4Perspective((orbit.fov * Math.PI) / 180, aspect, 0.1, 120);
      const view = pcaVisulMat4LookAt(camera, HOUSE_POSITION, [0, 1, 0]);
      return pcaVisulMat4Multiply(projection, view);
    }

    function embCossimCameraPosition() {
      const cosPitch = Math.cos(orbit.pitch);
      return [
        HOUSE_POSITION[0] + Math.sin(orbit.yaw) * cosPitch * orbit.radius,
        HOUSE_POSITION[1] + Math.sin(orbit.pitch) * orbit.radius,
        HOUSE_POSITION[2] + Math.cos(orbit.yaw) * cosPitch * orbit.radius,
      ];
    }

    function embCossimProject(point, matrix, width, height, anchorShift) {
      const clip = embCossimTransformPoint(matrix, point);
      clip[0] += anchorShift[0] * clip[3];
      clip[1] += anchorShift[1] * clip[3];
      if (clip[3] <= 0.0001) return { x: 0, y: 0, behind: true };
      const ndcX = clip[0] / clip[3];
      const ndcY = clip[1] / clip[3];
      return {
        x: (ndcX * 0.5 + 0.5) * width,
        y: (-ndcY * 0.5 + 0.5) * height,
        behind: ndcX < -1.8 || ndcX > 1.8 || ndcY < -1.8 || ndcY > 1.8,
      };
    }

    function embCossimTransformPoint(matrix, point) {
      const x = point[0], y = point[1], z = point[2];
      return [
        matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12],
        matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13],
        matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14],
        matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15],
      ];
    }

    function embCossimLineVertexShaderSource() {
      return `
        precision highp float;
        attribute vec3 a_position;
        attribute vec4 a_color;
        uniform mat4 u_matrix;
        uniform vec2 u_anchorShift;
        varying vec4 v_color;
        void main() {
          vec4 clip = u_matrix * vec4(a_position, 1.0);
          clip.xy += u_anchorShift * clip.w;
          gl_Position = clip;
          v_color = a_color;
        }
      `;
    }

    function embCossimLineFragmentShaderSource() {
      return `
        precision mediump float;
        varying vec4 v_color;
        void main() {
          if (v_color.a <= 0.001) discard;
          gl_FragColor = v_color;
        }
      `;
    }

    function embCossimPointVertexShaderSource() {
      return `
        precision highp float;
        attribute vec3 a_position;
        attribute vec3 a_color;
        uniform mat4 u_matrix;
        uniform vec2 u_anchorShift;
        uniform float u_pointSize;
        uniform float u_alpha;
        varying vec4 v_color;
        void main() {
          vec4 clip = u_matrix * vec4(a_position, 1.0);
          clip.xy += u_anchorShift * clip.w;
          gl_Position = clip;
          gl_PointSize = clamp(u_pointSize / max(0.1, clip.w), 1.0, 4.5);
          v_color = vec4(a_color, u_alpha);
        }
      `;
    }

    function embCossimPointFragmentShaderSource() {
      return `
        precision mediump float;
        varying vec4 v_color;
        void main() {
          vec2 delta = gl_PointCoord - vec2(0.5);
          float alpha = 1.0 - smoothstep(0.42, 0.5, length(delta));
          if (alpha <= 0.001) discard;
          gl_FragColor = vec4(v_color.rgb, v_color.a * alpha);
        }
      `;
    }

    function embCossimMarkerVertexShaderSource() {
      return `
        precision highp float;
        attribute vec3 a_position;
        attribute float a_selected;
        uniform mat4 u_matrix;
        uniform vec2 u_anchorShift;
        uniform float u_dpr;
        varying float v_selected;
        void main() {
          vec4 clip = u_matrix * vec4(a_position, 1.0);
          clip.xy += u_anchorShift * clip.w;
          gl_Position = clip;
          gl_PointSize = mix(18.0, 23.0, a_selected) * u_dpr;
          v_selected = a_selected;
        }
      `;
    }

    function embCossimMarkerFragmentShaderSource() {
      return `
        precision mediump float;
        varying float v_selected;
        void main() {
          vec2 p = gl_PointCoord;
          float outer = step(0.18, p.x) * step(p.x, 0.82) * step(0.18, p.y) * step(p.y, 0.82);
          float inner = step(0.37, p.x) * step(p.x, 0.63) * step(0.37, p.y) * step(p.y, 0.63);
          float border = outer * (1.0 - inner);
          float alpha = max(border * mix(0.72, 1.0, v_selected), inner * mix(0.88, 0.98, v_selected));
          if (alpha <= 0.001) discard;
          gl_FragColor = vec4(vec3(1.0), alpha);
        }
      `;
    }

    function embCossimCreateProgram(gl, vertexSource, fragmentSource) {
      const vertexShader = embCossimCreateShader(gl, gl.VERTEX_SHADER, vertexSource);
      const fragmentShader = embCossimCreateShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
      const program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const message = gl.getProgramInfoLog(program) || "Unable to link EMB-COSSIM shader program";
        gl.deleteProgram(program);
        throw new Error(message);
      }
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return program;
    }

    function embCossimCreateShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const message = gl.getShaderInfoLog(shader) || "Unable to compile EMB-COSSIM shader";
        gl.deleteShader(shader);
        throw new Error(message);
      }
      return shader;
    }

    function embCossimCreateBuffer(gl, bufferData, usage = gl.STATIC_DRAW) {
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, bufferData, usage);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      return buffer;
    }

    function embCossimUpdateBuffer(gl, buffer, bufferData) {
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.DYNAMIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    function embCossimBindAttribute(gl, location, buffer, size) {
      if (location < 0) return;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
    }

    function appendEmbCossimLine(vertices, from, to, fromColor, toColor) {
      appendEmbCossimVertex(vertices, from, fromColor);
      appendEmbCossimVertex(vertices, to, toColor);
    }

    function appendEmbCossimVertex(vertices, position, color) {
      vertices.push(position[0], position[1], position[2], color[0], color[1], color[2], color[3]);
    }

    function embCossimSlerpDir(firstDir, secondDir, theta, t) {
      if (theta < 0.0001) return embCossimNormalize3(embCossimAdd3(embCossimScale3(firstDir, 1 - t), embCossimScale3(secondDir, t)));
      const sinTheta = Math.sin(theta);
      return embCossimNormalize3(
        embCossimAdd3(embCossimScale3(firstDir, Math.sin((1 - t) * theta) / sinTheta), embCossimScale3(secondDir, Math.sin(t * theta) / sinTheta)),
      );
    }

    function embCossimRotateY(position, angle) {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const [x, y, z] = position;
      return [x * cos - z * sin, y, x * sin + z * cos];
    }

    function embCossimSeededRandom(seed) {
      let value = seed >>> 0;
      return () => {
        value = (value * 1664525 + 1013904223) >>> 0;
        return value / 4294967296;
      };
    }

    function embCossimNormalRandom(random) {
      const u1 = Math.max(random(), Number.EPSILON);
      const u2 = random();
      return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    }

    function formatEmbCossimCoord(position) {
      return `(${position.map((value) => value.toFixed(2)).join(", ")})`;
    }

    function smoothstep(edge0, edge1, value) {
      const t = clamp((value - edge0) / (edge1 - edge0 || 1), 0, 1);
      return t * t * (3 - 2 * t);
    }

    function embCossimAdd3(a, b) {
      return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
    }

    function embCossimSub3(a, b) {
      return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    }

    function embCossimScale3(vector, scalar) {
      return [vector[0] * scalar, vector[1] * scalar, vector[2] * scalar];
    }

    function embCossimLength3(vector) {
      return Math.hypot(vector[0], vector[1], vector[2]);
    }

    function embCossimNormalize3(vector) {
      const length = embCossimLength3(vector) || 1;
      return [vector[0] / length, vector[1] / length, vector[2] / length];
    }

    function embCossimDot3(a, b) {
      return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    }

    function embCossimDistanceSquared(a, b) {
      const dx = a[0] - b[0];
      const dy = a[1] - b[1];
      const dz = a[2] - b[2];
      return dx * dx + dy * dy + dz * dz;
    }

    return () => {
      destroyed = true;
      if (raf) cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      cleanupFns.forEach((cleanup) => cleanup());
      if (glState) {
        const { gl } = glState;
        Object.values(glState.buffers).forEach((buffer) => gl.deleteBuffer(buffer));
        gl.deleteProgram(glState.lineProgram);
        gl.deleteProgram(glState.pointProgram);
        gl.deleteProgram(glState.markerProgram);
      }
      labelLayer.remove();
    };
  }

  function renderPcaVisulStage(stage, slide) {
    const config = ensurePcaVisul(slide);
    const slider = (key, label, source) => `
      <label class="pca-visul-slider-row ${key}">
        <span class="pca-visul-slider-meta">
          <strong>${label}</strong>
          <small>${source}</small>
        </span>
        <input data-pca-visul-control="${key}" type="range" min="0" max="1" value="${round(config[key], 3)}" step="0.001" />
        <output data-pca-visul-output="${key}">${round(config[key], 2).toFixed(2)}</output>
      </label>
    `;
    const root = document.createElement("div");
    root.className = "pca-visul-stage";
    root.innerHTML = `
      <canvas class="pca-visul-canvas" aria-label="PCA Visualize point cloud"></canvas>
      <div class="pca-visul-hud">
        <div class="pca-visul-readout">
          <span data-pca-visul-count>0 points</span>
          <span data-pca-visul-mode>PCA space</span>
        </div>
      </div>
      <aside class="pca-visul-panel" aria-label="PCAVISUL controls">
        <header class="pca-visul-panel-header">
          <h2>PCA Visualization</h2>
          <span>pc1, pc2, pc3 -> lat, -1, lon</span>
        </header>
        <div class="pca-visul-slider-group">
          ${slider("red", "R", "pc1")}
          ${slider("green", "G", "pc2")}
          ${slider("blue", "B", "pc3")}
          ${slider("map", "M", "map")}
        </div>
      </aside>
      <div class="pca-visul-loading" data-pca-visul-loading>
        <div class="pca-visul-loading-panel">
          <div data-pca-visul-loading-label>Loading PCA Visualize CSV</div>
        </div>
      </div>
    `;
    appendInteractionHint(root, "Interaction", [
      "Drag canvas to orbit the point cloud.",
      "Wheel zooms in and out.",
      "R, G, B sliders remap PCA color axes.",
      "M slider morphs PCA space into map space.",
    ]);
    stage.appendChild(root);
    specialCleanup = mountPcaVisulViewer(root, slide);
  }

  function mountPcaVisulViewer(root, slide) {
    const config = ensurePcaVisul(slide);
    const canvas = qs(".pca-visul-canvas", root);
    const panel = qs(".pca-visul-panel", root);
    const loading = qs("[data-pca-visul-loading]", root);
    const loadingLabel = qs("[data-pca-visul-loading-label]", root);
    const pointCountEl = qs("[data-pca-visul-count]", root);
    const modeLabelEl = qs("[data-pca-visul-mode]", root);
    const inputs = {
      red: qs('[data-pca-visul-control="red"]', root),
      green: qs('[data-pca-visul-control="green"]', root),
      blue: qs('[data-pca-visul-control="blue"]', root),
      map: qs('[data-pca-visul-control="map"]', root),
    };
    const outputs = {
      red: qs('[data-pca-visul-output="red"]', root),
      green: qs('[data-pca-visul-output="green"]', root),
      blue: qs('[data-pca-visul-output="blue"]', root),
      map: qs('[data-pca-visul-output="map"]', root),
    };
    const orbit = {
      yaw: PCA_VISUL_INITIAL_CAMERA.yaw,
      pitch: PCA_VISUL_INITIAL_CAMERA.pitch,
      radius: PCA_VISUL_INITIAL_CAMERA.radius,
      autoRotate: true,
      pointer: null,
    };
    let destroyed = false;
    let raf = 0;
    let lastTime = performance.now();
    let data = pcaVisulDataCache.data;
    let glState = null;
    const resizeObserver = new ResizeObserver(() => draw());
    resizeObserver.observe(root);

    syncPcaVisulControls();
    bindPcaVisulControlEvents();

    getPcaVisulData()
      .then((loadedData) => {
        if (destroyed) return;
        data = loadedData;
        pointCountEl.textContent = `${pcaVisulFormatInteger(data.count)} points`;
        loading.classList.add("is-hidden");
        draw();
      })
      .catch((error) => {
        if (destroyed) return;
        loading.classList.add("has-error");
        loadingLabel.textContent = error instanceof Error ? error.message : "PCA Visualize data load failed";
        modeLabelEl.textContent = "Data load failed";
      });

    raf = requestAnimationFrame(tick);

    function bindPcaVisulControlEvents() {
      Object.entries(inputs).forEach(([key, input]) => {
        input.addEventListener("input", () => {
          const value = Number(input.value);
          config[key] = clamp(Number.isFinite(value) ? value : config[key], 0, 1);
          syncPcaVisulControls();
          draw();
          
        });
      });
      panel.addEventListener("pointerdown", (event) => event.stopPropagation());
      panel.addEventListener("wheel", (event) => event.stopPropagation(), { passive: true });
      canvas.addEventListener("pointerdown", handlePointerDown);
      canvas.addEventListener("pointermove", handlePointerMove);
      canvas.addEventListener("pointerup", clearPointer);
      canvas.addEventListener("pointercancel", clearPointer);
      canvas.addEventListener("wheel", handleWheel, { passive: false });
    }

    function syncPcaVisulControls() {
      Object.entries(inputs).forEach(([key, input]) => {
        const value = clamp(Number(config[key] ?? (key === "map" ? 0 : 1)), 0, 1);
        config[key] = Number.isFinite(value) ? value : key === "map" ? 0 : 1;
        input.value = String(config[key]);
        input.style.setProperty("--value", `${config[key] * 100}%`);
        outputs[key].textContent = config[key].toFixed(2);
      });
      modeLabelEl.textContent =
        config.map <= 0.01 ? "PCA space" : config.map >= 0.99 ? "Map space" : `M ${config.map.toFixed(2)}`;
    }

    function tick(now) {
      if (destroyed) return;
      const delta = Math.min(80, now - lastTime);
      lastTime = now;
      if (orbit.autoRotate) orbit.yaw += delta * 0.00018;
      draw();
      raf = requestAnimationFrame(tick);
    }

    function draw() {
      if (!data || destroyed) return;
      if (!glState) glState = createPcaVisulGlState(canvas, data);
      drawPcaVisulScene(glState, data, config, orbit);
    }

    function handlePointerDown(event) {
      if (event.button !== undefined && event.button !== 0) return;
      event.preventDefault();
      event.stopPropagation();
      orbit.pointer = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        yaw: orbit.yaw,
        pitch: orbit.pitch,
      };
      canvas.setPointerCapture?.(event.pointerId);
    }

    function handlePointerMove(event) {
      if (!orbit.pointer || orbit.pointer.id !== event.pointerId) return;
      event.preventDefault();
      event.stopPropagation();
      const dx = event.clientX - orbit.pointer.x;
      const dy = event.clientY - orbit.pointer.y;
      if (Math.hypot(dx, dy) > 5) orbit.autoRotate = false;
      orbit.yaw = orbit.pointer.yaw - dx * 0.006;
      orbit.pitch = clamp(orbit.pointer.pitch + dy * 0.006, -Math.PI / 2, Math.PI / 2);
      draw();
    }

    function clearPointer(event) {
      if (!orbit.pointer || (event.pointerId !== undefined && orbit.pointer.id !== event.pointerId)) return;
      event.preventDefault();
      event.stopPropagation();
      canvas.releasePointerCapture?.(event.pointerId);
      orbit.pointer = null;
    }

    function handleWheel(event) {
      event.preventDefault();
      event.stopPropagation();
      orbit.autoRotate = false;
      const delta = event.deltaY || event.deltaX;
      orbit.radius = clamp(orbit.radius * Math.exp(delta * 0.001), 2, 8);
      draw();
    }

    return () => {
      destroyed = true;
      if (raf) cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      if (glState) disposePcaVisulGlState(glState);
    };
  }

  async function getPcaVisulData() {
    if (pcaVisulDataCache.data) return pcaVisulDataCache.data;
    if (pcaVisulDataCache.promise) return pcaVisulDataCache.promise;

    pcaVisulDataCache.promise = (async () => {
      const response = await fetch(localFileURL(PCA_VISUL_DATA_PATH), { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Failed to load PCAVISUL CSV: ${response.status} ${response.statusText}`);
      }
      const text = await response.text();
      const rows = parsePcaVisulCsv(text);
      const data = preparePcaVisulBuffers(rows);
      pcaVisulDataCache.data = data;
      return data;
    })().catch((error) => {
      pcaVisulDataCache.promise = null;
      throw error;
    });

    return pcaVisulDataCache.promise;
  }

  function parsePcaVisulCsv(text) {
    const lines = String(text || "")
      .trim()
      .split(/\r?\n/)
      .filter(Boolean);
    if (lines.length < 2) throw new Error("PCAVISUL CSV is empty.");
    const headers = lines.shift().split(",").map((header) => header.trim());
    const index = Object.fromEntries(headers.map((header, i) => [header, i]));
    const required = ["lat", "lon", "pc1", "pc2", "pc3"];
    required.forEach((field) => {
      if (!(field in index)) throw new Error(`PCAVISUL CSV missing column: ${field}`);
    });
    return lines
      .map((line) => {
        const cells = line.split(",");
        const row = {
          lat: Number(cells[index.lat]),
          lon: Number(cells[index.lon]),
          pc1: Number(cells[index.pc1]),
          pc2: Number(cells[index.pc2]),
          pc3: Number(cells[index.pc3]),
        };
        return Object.values(row).every(Number.isFinite) ? row : null;
      })
      .filter(Boolean);
  }

  function preparePcaVisulBuffers(rows) {
    if (!rows.length) throw new Error("PCAVISUL CSV has no valid rows.");
    const bounds = {
      lat: pcaVisulExtent(rows, "lat"),
      lon: pcaVisulExtent(rows, "lon"),
      pc1: pcaVisulExtent(rows, "pc1"),
      pc2: pcaVisulExtent(rows, "pc2"),
      pc3: pcaVisulExtent(rows, "pc3"),
    };
    const count = rows.length;
    const pcaPositions = new Float32Array(count * 3);
    const mapPositions = new Float32Array(count * 3);
    const targetColors = new Float32Array(count * 3);
    rows.forEach((row, rowIndex) => {
      const i = rowIndex * 3;
      const pc1 = pcaVisulNormalizeSym(row.pc1, bounds.pc1);
      const pc2 = pcaVisulNormalizeSym(row.pc2, bounds.pc2);
      const pc3 = pcaVisulNormalizeSym(row.pc3, bounds.pc3);
      const lat = pcaVisulNormalizeSym(row.lat, bounds.lat);
      const lon = pcaVisulNormalizeSym(row.lon, bounds.lon);
      pcaPositions[i] = pc1;
      pcaPositions[i + 1] = pc2;
      pcaPositions[i + 2] = pc3;
      mapPositions[i] = lat;
      mapPositions[i + 1] = -1;
      mapPositions[i + 2] = lon;
      targetColors[i] = pcaVisulPerceptualPrimaryChannel(pcaVisulRemap01(pc1), PCA_VISUL_PRIMARY_LUMINANCE.red);
      targetColors[i + 1] = pcaVisulPerceptualPrimaryChannel(pcaVisulRemap01(pc2), PCA_VISUL_PRIMARY_LUMINANCE.green);
      targetColors[i + 2] = pcaVisulPerceptualPrimaryChannel(pcaVisulRemap01(pc3), PCA_VISUL_PRIMARY_LUMINANCE.blue);
    });
    return {
      count,
      pcaPositions,
      mapPositions,
      targetColors,
      cubeLines: new Float32Array(createPcaVisulCubeLinePositions()),
      gridLines: new Float32Array(createPcaVisulMapGridPositions()),
    };
  }

  function createPcaVisulGlState(canvas, data) {
    const gl = canvas.getContext("webgl", { alpha: false, antialias: true, powerPreference: "high-performance" });
    if (!gl) throw new Error("WebGL is not available for PCAVISUL.");
    const pointProgram = createPcaVisulProgram(gl, pcaVisulPointVertexShaderSource(), pcaVisulPointFragmentShaderSource());
    const lineProgram = createPcaVisulProgram(gl, pcaVisulLineVertexShaderSource(), pcaVisulLineFragmentShaderSource());
    const glState = {
      canvas,
      gl,
      pointProgram,
      lineProgram,
      buffers: {
        pca: createPcaVisulBuffer(gl, data.pcaPositions),
        map: createPcaVisulBuffer(gl, data.mapPositions),
        color: createPcaVisulBuffer(gl, data.targetColors),
        cube: createPcaVisulBuffer(gl, data.cubeLines),
        grid: createPcaVisulBuffer(gl, data.gridLines),
      },
      pointLocations: {
        matrix: gl.getUniformLocation(pointProgram, "u_matrix"),
        anchorShift: gl.getUniformLocation(pointProgram, "u_anchorShift"),
        mapMix: gl.getUniformLocation(pointProgram, "u_mapMix"),
        pointSize: gl.getUniformLocation(pointProgram, "u_pointSize"),
        red: gl.getUniformLocation(pointProgram, "u_red"),
        green: gl.getUniformLocation(pointProgram, "u_green"),
        blue: gl.getUniformLocation(pointProgram, "u_blue"),
        baseGray: gl.getUniformLocation(pointProgram, "u_baseGray"),
        pca: gl.getAttribLocation(pointProgram, "a_pca"),
        map: gl.getAttribLocation(pointProgram, "a_map"),
        color: gl.getAttribLocation(pointProgram, "a_color"),
      },
      lineLocations: {
        matrix: gl.getUniformLocation(lineProgram, "u_matrix"),
        anchorShift: gl.getUniformLocation(lineProgram, "u_anchorShift"),
        color: gl.getUniformLocation(lineProgram, "u_color"),
        position: gl.getAttribLocation(lineProgram, "a_position"),
      },
    };
    return glState;
  }

  function drawPcaVisulScene(glState, data, config, orbit) {
    const { canvas, gl } = glState;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    const matrix = pcaVisulViewProjectionMatrix(width / height, orbit);
    const anchorShift = new Float32Array([PCA_VISUL_FOCUS_X * 2 - 1, 1 - PCA_VISUL_FOCUS_Y * 2]);
    gl.viewport(0, 0, width, height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.useProgram(glState.lineProgram);
    gl.uniformMatrix4fv(glState.lineLocations.matrix, false, matrix);
    gl.uniform2fv(glState.lineLocations.anchorShift, anchorShift);
    pcaVisulBindAttribute(gl, glState.lineLocations.position, glState.buffers.grid, 3);
    gl.uniform4f(glState.lineLocations.color, 0.965, 0.945, 0.85, 0.1 + config.map * 0.32);
    gl.drawArrays(gl.LINES, 0, data.gridLines.length / 3);
    pcaVisulBindAttribute(gl, glState.lineLocations.position, glState.buffers.cube, 3);
    gl.uniform4f(glState.lineLocations.color, 0.957, 0.969, 0.984, 0.76);
    gl.drawArrays(gl.LINES, 0, data.cubeLines.length / 3);

    gl.useProgram(glState.pointProgram);
    gl.uniformMatrix4fv(glState.pointLocations.matrix, false, matrix);
    gl.uniform2fv(glState.pointLocations.anchorShift, anchorShift);
    gl.uniform1f(glState.pointLocations.mapMix, config.map);
    gl.uniform1f(glState.pointLocations.pointSize, PCA_VISUL_POINT_SIZE * dpr);
    gl.uniform1f(glState.pointLocations.red, config.red);
    gl.uniform1f(glState.pointLocations.green, config.green);
    gl.uniform1f(glState.pointLocations.blue, config.blue);
    gl.uniform1f(glState.pointLocations.baseGray, PCA_VISUL_BASE_GRAY);
    pcaVisulBindAttribute(gl, glState.pointLocations.pca, glState.buffers.pca, 3);
    pcaVisulBindAttribute(gl, glState.pointLocations.map, glState.buffers.map, 3);
    pcaVisulBindAttribute(gl, glState.pointLocations.color, glState.buffers.color, 3);
    gl.depthMask(false);
    gl.drawArrays(gl.POINTS, 0, data.count);
    gl.depthMask(true);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  function disposePcaVisulGlState(glState) {
    const { gl } = glState;
    Object.values(glState.buffers).forEach((buffer) => gl.deleteBuffer(buffer));
    gl.deleteProgram(glState.pointProgram);
    gl.deleteProgram(glState.lineProgram);
  }

  function createPcaVisulBuffer(gl, data) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return buffer;
  }

  function pcaVisulBindAttribute(gl, location, buffer, size) {
    if (location < 0) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
  }

  function pcaVisulPointVertexShaderSource() {
    return `
      precision highp float;
      attribute vec3 a_pca;
      attribute vec3 a_map;
      attribute vec3 a_color;
      uniform mat4 u_matrix;
      uniform vec2 u_anchorShift;
      uniform float u_mapMix;
      uniform float u_pointSize;
      uniform float u_red;
      uniform float u_green;
      uniform float u_blue;
      uniform float u_baseGray;
      varying vec3 v_color;
      void main() {
        vec3 position = mix(a_pca, a_map, u_mapMix);
        vec4 clip = u_matrix * vec4(position, 1.0);
        clip.xy += u_anchorShift * clip.w;
        gl_Position = clip;
        gl_PointSize = u_pointSize;
        float activation = max(max(u_red, u_green), u_blue);
        vec3 channelWeights = vec3(u_red, u_green, u_blue);
        v_color = clamp(vec3(u_baseGray * (1.0 - activation)) + a_color * channelWeights, 0.0, 1.0);
      }
    `;
  }

  function pcaVisulPointFragmentShaderSource() {
    return `
      precision mediump float;
      varying vec3 v_color;
      void main() {
        vec2 delta = gl_PointCoord - vec2(0.5);
        float alpha = smoothstep(0.5, 0.42, length(delta)) * 0.96;
        if (alpha <= 0.001) discard;
        gl_FragColor = vec4(v_color, alpha);
      }
    `;
  }

  function pcaVisulLineVertexShaderSource() {
    return `
      precision highp float;
      attribute vec3 a_position;
      uniform mat4 u_matrix;
      uniform vec2 u_anchorShift;
      void main() {
        vec4 clip = u_matrix * vec4(a_position, 1.0);
        clip.xy += u_anchorShift * clip.w;
        gl_Position = clip;
      }
    `;
  }

  function pcaVisulLineFragmentShaderSource() {
    return `
      precision mediump float;
      uniform vec4 u_color;
      void main() {
        gl_FragColor = u_color;
      }
    `;
  }

  function createPcaVisulProgram(gl, vertexSource, fragmentSource) {
    const vertexShader = createPcaVisulShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = createPcaVisulShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const message = gl.getProgramInfoLog(program) || "Unable to link PCAVISUL shader program";
      gl.deleteProgram(program);
      throw new Error(message);
    }
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return program;
  }

  function createPcaVisulShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader) || "Unable to compile PCAVISUL shader";
      gl.deleteShader(shader);
      throw new Error(message);
    }
    return shader;
  }

  function pcaVisulViewProjectionMatrix(aspect, orbit) {
    const eye = pcaVisulCameraPosition(orbit);
    const projection = pcaVisulMat4Perspective((20 * Math.PI) / 180, aspect, 0.01, 100);
    const view = pcaVisulMat4LookAt(eye, [0, 0, 0], [0, 1, 0]);
    return pcaVisulMat4Multiply(projection, view);
  }

  function pcaVisulCameraPosition(orbit) {
    const cosPitch = Math.cos(orbit.pitch);
    return [
      Math.sin(orbit.yaw) * cosPitch * orbit.radius,
      Math.sin(orbit.pitch) * orbit.radius,
      Math.cos(orbit.yaw) * cosPitch * orbit.radius,
    ];
  }

  function pcaVisulMat4Perspective(fovy, aspect, near, far) {
    const f = 1 / Math.tan(fovy / 2);
    const nf = 1 / (near - far);
    return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]);
  }

  function pcaVisulMat4LookAt(eye, center, up) {
    const z = pcaVisulNormalize3([eye[0] - center[0], eye[1] - center[1], eye[2] - center[2]]);
    const x = pcaVisulNormalize3(pcaVisulCross3(up, z));
    const y = pcaVisulCross3(z, x);
    return new Float32Array([
      x[0],
      y[0],
      z[0],
      0,
      x[1],
      y[1],
      z[1],
      0,
      x[2],
      y[2],
      z[2],
      0,
      -pcaVisulDot3(x, eye),
      -pcaVisulDot3(y, eye),
      -pcaVisulDot3(z, eye),
      1,
    ]);
  }

  function pcaVisulMat4Multiply(a, b) {
    const out = new Float32Array(16);
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    const b00 = b[0], b01 = b[1], b02 = b[2], b03 = b[3];
    const b10 = b[4], b11 = b[5], b12 = b[6], b13 = b[7];
    const b20 = b[8], b21 = b[9], b22 = b[10], b23 = b[11];
    const b30 = b[12], b31 = b[13], b32 = b[14], b33 = b[15];
    out[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
    out[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
    out[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
    out[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
    out[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
    out[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
    out[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
    out[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
    out[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
    out[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
    out[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
    out[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
    out[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
    out[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
    out[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
    out[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;
    return out;
  }

  function pcaVisulNormalize3(vector) {
    const length = Math.hypot(vector[0], vector[1], vector[2]) || 1;
    return [vector[0] / length, vector[1] / length, vector[2] / length];
  }

  function pcaVisulCross3(a, b) {
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  }

  function pcaVisulDot3(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  function createPcaVisulCubeLinePositions() {
    const vertices = [
      [-1, -1, -1],
      [1, -1, -1],
      [1, 1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, 1],
      [-1, 1, 1],
    ];
    const edges = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 4],
      [0, 4],
      [1, 5],
      [2, 6],
      [3, 7],
    ];
    const positions = [];
    edges.forEach(([a, b]) => appendPcaVisulDashedSegment(positions, vertices[a], vertices[b], 0.075, 0.045));
    return positions;
  }

  function appendPcaVisulDashedSegment(positions, from, to, dash, gap) {
    const length = Math.hypot(to[0] - from[0], to[1] - from[1], to[2] - from[2]);
    const step = dash + gap;
    for (let start = 0; start < length; start += step) {
      const end = Math.min(start + dash, length);
      const a = start / length;
      const b = end / length;
      positions.push(
        lerp(from[0], to[0], a),
        lerp(from[1], to[1], a),
        lerp(from[2], to[2], a),
        lerp(from[0], to[0], b),
        lerp(from[1], to[1], b),
        lerp(from[2], to[2], b),
      );
    }
  }

  function createPcaVisulMapGridPositions() {
    const positions = [];
    const divisions = 8;
    for (let i = 0; i <= divisions; i += 1) {
      const t = -1 + (i / divisions) * 2;
      positions.push(-1, -1, t, 1, -1, t);
      positions.push(t, -1, -1, t, -1, 1);
    }
    return positions;
  }

  function pcaVisulExtent(rows, key) {
    let min = Infinity;
    let max = -Infinity;
    rows.forEach((row) => {
      min = Math.min(min, row[key]);
      max = Math.max(max, row[key]);
    });
    return { min, max };
  }

  function pcaVisulNormalizeSym(value, { min, max }) {
    const span = max - min;
    if (!span) return 0;
    return ((value - min) / span) * 2 - 1;
  }

  function pcaVisulRemap01(value) {
    return clamp((value + 1) * 0.5, 0, 1);
  }

  function pcaVisulPerceptualPrimaryChannel(value, primaryLuminance) {
    const targetLightness = pcaVisulCieLightness(primaryLuminance);
    const lightness = clamp(value, 0, 1) * targetLightness;
    const luminance = pcaVisulInverseCieLightness(lightness);
    return clamp(luminance / primaryLuminance, 0, 1);
  }

  function pcaVisulCieLightness(luminance) {
    const epsilon = 216 / 24389;
    const kappa = 24389 / 27;
    if (luminance <= epsilon) return kappa * luminance;
    return 116 * Math.cbrt(luminance) - 16;
  }

  function pcaVisulInverseCieLightness(lightness) {
    const kappa = 24389 / 27;
    if (lightness <= 8) return lightness / kappa;
    return Math.pow((lightness + 16) / 116, 3);
  }

  function pcaVisulSrgbToLinear(value) {
    if (value <= 0.04045) return value / 12.92;
    return Math.pow((value + 0.055) / 1.055, 2.4);
  }

  function pcaVisulFormatInteger(value) {
    return new Intl.NumberFormat("en-US").format(value);
  }

  function renderMapPcaStage(stage, slide) {
    const mapPca = ensureMapPca(slide);
    const layerChips = MAP_PCA_LAYERS.map(
      (layer) => `
        <button class="map-pca-layer-chip" type="button" data-map-pca-layer="${layer.id}">
          <span>${layer.label}</span>
          <strong>0%</strong>
        </button>
      `,
    ).join("");
    const root = document.createElement("div");
    root.className = "map-pca-stage";
    root.innerHTML = `
      <div class="map-pca-tile-layer" aria-hidden="true"></div>
      <canvas class="map-pca-canvas" aria-label="PCA t-SNE point cloud map"></canvas>
      <aside class="map-pca-panel" aria-label="MAP-PCA controls">
        <div class="map-pca-heading">
          <strong>MAP-PCA</strong>
        </div>
        <label class="map-pca-control">
          <span class="visually-hidden">Scale</span>
          <input data-map-pca-scale type="range" min="${MAP_PCA_MIN_AXIS_METERS}" max="${MAP_PCA_MAX_AXIS_METERS}" value="${mapPca.scaleMeters}" step="10" />
        </label>
        <div class="map-pca-layer-readout">${layerChips}</div>
        <div class="map-pca-status" data-map-pca-status hidden>Loading point clouds</div>
      </aside>
      <div class="map-pca-loading" data-map-pca-loading>
        <div class="map-pca-loading-panel">
          <div class="map-pca-loading-title">Loading PCA/t-SNE point clouds</div>
          <div class="map-pca-loading-track"><div data-map-pca-loading-bar></div></div>
          <div class="map-pca-loading-meta">
            <span data-map-pca-loading-label>Waiting</span>
            <span data-map-pca-loading-percent>0%</span>
          </div>
        </div>
      </div>
    `;
    appendInteractionHint(root, "Interaction", [
      "Drag map to pan.",
      "Wheel or scale slider changes PCA scale.",
      "Click layer chips to lock or unlock a scale.",
      "Right-click recenters the map.",
    ]);
    stage.appendChild(root);
    specialCleanup = mountMapPcaViewer(root, slide);
  }

  function mountMapPcaViewer(root, slide) {
    const mapPca = ensureMapPca(slide);
    const tileLayer = qs(".map-pca-tile-layer", root);
    const canvas = qs(".map-pca-canvas", root);
    const scaleSlider = qs("[data-map-pca-scale]", root);
    const statusEl = qs("[data-map-pca-status]", root);
    const loading = qs("[data-map-pca-loading]", root);
    const loadingBar = qs("[data-map-pca-loading-bar]", root);
    const loadingLabel = qs("[data-map-pca-loading-label]", root);
    const loadingPercent = qs("[data-map-pca-loading-percent]", root);
    const chips = qsa("[data-map-pca-layer]", root);
    let destroyed = false;
    let frame = 0;
    let animationFrame = 0;
    let displayScaleMeters = mapPca.scaleMeters;
    let targetScaleMeters = mapPca.scaleMeters;
    let data = mapPcaDataCache.data;
    let glState = null;
    let recenterFrame = 0;
    let dragState = null;
    const resizeObserver = new ResizeObserver(() => requestDraw());

    scaleSlider.value = String(mapPca.scaleMeters);
    mapPca.axisBlend = MAP_PCA_FIXED_AXIS_BLEND;
    scaleSlider.disabled = !data;
    resizeObserver.observe(root);

    scaleSlider.addEventListener("input", () => {
      mapPca.scaleMeters = clamp(Number(scaleSlider.value) || MAP_PCA_MIN_AXIS_METERS, MAP_PCA_MIN_AXIS_METERS, MAP_PCA_MAX_AXIS_METERS);
      targetScaleMeters = mapPca.scaleMeters;
      displayScaleMeters = mapPca.scaleMeters;
      requestDraw();
    });
    root.addEventListener("wheel", handleMapPcaWheel, { passive: false });
    canvas.addEventListener("contextmenu", handleMapPcaContextMenu);
    canvas.addEventListener("pointerdown", handleMapPcaPointerDown);
    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        const layerId = chip.dataset.mapPcaLayer;
        mapPca.lockedLayerId = mapPca.lockedLayerId === layerId ? null : layerId;
        requestDraw();
      });
    });

    getMapPcaPointCloudData((label, loadedBytes, totalBytes) => {
      if (destroyed) return;
      updateLoading(label, loadedBytes, totalBytes);
    })
      .then((loadedData) => {
        if (destroyed) return;
        data = loadedData;
        scaleSlider.disabled = false;
        loading.classList.add("is-hidden");
        updateLoading("Ready", loadedData.totalBytes, loadedData.totalBytes);
        requestDraw();
      })
      .catch((error) => {
        if (destroyed) return;
        statusEl.textContent = error instanceof Error ? error.message : "Point cloud preload failed";
        statusEl.classList.add("has-warning");
        loading.classList.add("has-error");
        loadingLabel.textContent = statusEl.textContent;
      });

    requestDraw();

    function requestDraw() {
      if (destroyed || frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        draw();
      });
    }

    function draw() {
      const width = root.clientWidth || 1;
      const height = root.clientHeight || 1;
      const displayMapPca = { ...mapPca, scaleMeters: displayScaleMeters };
      const metrics = mapPcaMetrics(width, height, displayMapPca);
      renderMapPcaTiles(tileLayer, width, height, metrics.zoom, displayMapPca);
      syncMapPcaControls(displayMapPca, metrics, { statusEl, chips }, data);
      if (!data) {
        clearMapPcaCanvas(canvas);
        return;
      }
      if (!glState) glState = createMapPcaGlState(canvas);
      drawMapPcaPointCloud(glState, data, metrics);
    }

    function requestScaleAnimation() {
      if (destroyed || animationFrame) return;
      animationFrame = requestAnimationFrame(animateScale);
    }

    function animateScale() {
      animationFrame = 0;
      if (destroyed) return;
      const delta = targetScaleMeters - displayScaleMeters;
      if (Math.abs(delta) < 0.5) {
        displayScaleMeters = targetScaleMeters;
        requestDraw();
        return;
      }
      displayScaleMeters += delta * 0.18;
      requestDraw();
      requestScaleAnimation();
    }

    function updateLoading(label, loadedBytes = 0, totalBytes = 1) {
      const percent = clamp((loadedBytes / Math.max(1, totalBytes)) * 100, 0, 100);
      loadingBar.style.width = `${percent}%`;
      loadingLabel.textContent = label;
      loadingPercent.textContent = `${Math.round(percent)}%`;
    }

    function handleMapPcaWheel(event) {
      event.preventDefault();
      event.stopPropagation();
      const delta = event.deltaY || event.deltaX;
      if (!delta) return;
      const direction = delta > 0 ? 1 : -1;
      const normalized = clamp(Math.abs(delta) / 120, 0.18, 1.6);
      const logScale = Math.log(targetScaleMeters) + direction * MAP_PCA_SCALE_WHEEL_LOG_STEP * normalized;
      mapPca.scaleMeters = clamp(Math.exp(logScale), MAP_PCA_MIN_AXIS_METERS, MAP_PCA_MAX_AXIS_METERS);
      targetScaleMeters = mapPca.scaleMeters;
      scaleSlider.value = String(mapPca.scaleMeters);
      requestScaleAnimation();
    }

    function handleMapPcaContextMenu(event) {
      event.preventDefault();
      event.stopPropagation();
      startMapPcaRecenterAnimation();
    }

    function handleMapPcaPointerDown(event) {
      if (event.button === 2) {
        event.preventDefault();
        event.stopPropagation();
        startMapPcaRecenterAnimation();
        return;
      }
      if (event.button !== 0) return;
      event.preventDefault();
      event.stopPropagation();
      stopMapPcaRecenterAnimation();
      canvas.setPointerCapture?.(event.pointerId);
      canvas.classList.add("is-dragging");
      dragState = { pointerId: event.pointerId, lastX: event.clientX, lastY: event.clientY };
      canvas.addEventListener("pointermove", handleMapPcaPointerMove);
      canvas.addEventListener("pointerup", handleMapPcaPointerEnd);
      canvas.addEventListener("pointercancel", handleMapPcaPointerEnd);
    }

    function handleMapPcaPointerMove(event) {
      if (!dragState || event.pointerId !== dragState.pointerId) return;
      event.preventDefault();
      const dx = event.clientX - dragState.lastX;
      const dy = event.clientY - dragState.lastY;
      dragState.lastX = event.clientX;
      dragState.lastY = event.clientY;
      const zoom = mapPcaZoomForScaleControlValue(displayScaleMeters);
      const worldSize = MAP_PCA_TILE_SIZE * 2 ** zoom;
      mapPca.offsetX = Number(mapPca.offsetX || 0) - dx / Math.max(1, worldSize);
      mapPca.offsetY = Number(mapPca.offsetY || 0) - dy / Math.max(1, worldSize);
      requestDraw();
    }

    function handleMapPcaPointerEnd(event) {
      if (!dragState || event.pointerId !== dragState.pointerId) return;
      canvas.releasePointerCapture?.(event.pointerId);
      canvas.classList.remove("is-dragging");
      canvas.removeEventListener("pointermove", handleMapPcaPointerMove);
      canvas.removeEventListener("pointerup", handleMapPcaPointerEnd);
      canvas.removeEventListener("pointercancel", handleMapPcaPointerEnd);
      dragState = null;
    }

    function startMapPcaRecenterAnimation() {
      stopMapPcaRecenterAnimation();
      const startX = Number(mapPca.offsetX || 0);
      const startY = Number(mapPca.offsetY || 0);
      if (Math.hypot(startX, startY) < 0.0000001) return;
      const startedAt = performance.now();
      const duration = 620;
      const tick = (now) => {
        if (destroyed) return;
        const t = clamp((now - startedAt) / duration, 0, 1);
        const eased = easeInOutCubic(t);
        mapPca.offsetX = lerp(startX, 0, eased);
        mapPca.offsetY = lerp(startY, 0, eased);
        requestDraw();
        if (t < 1) {
          recenterFrame = requestAnimationFrame(tick);
          return;
        }
        recenterFrame = 0;
        mapPca.offsetX = 0;
        mapPca.offsetY = 0;
        requestDraw();
      };
      recenterFrame = requestAnimationFrame(tick);
    }

    function stopMapPcaRecenterAnimation() {
      if (!recenterFrame) return;
      cancelAnimationFrame(recenterFrame);
      recenterFrame = 0;
    }

    return () => {
      destroyed = true;
      if (frame) cancelAnimationFrame(frame);
      if (animationFrame) cancelAnimationFrame(animationFrame);
      if (recenterFrame) cancelAnimationFrame(recenterFrame);
      resizeObserver.disconnect();
      if (glState) disposeMapPcaGlState(glState);
    };
  }

  function syncMapPcaControls(mapPca, metrics, elsForMap, data) {
    const chipOpacities = metrics.effectiveOpacities || metrics.opacities;
    elsForMap.chips.forEach((chip, index) => {
      const opacity = chipOpacities[index] || 0;
      chip.classList.toggle("is-active", opacity > 0.001);
      chip.classList.toggle("is-locked", mapPca.lockedLayerId === chip.dataset.mapPcaLayer);
      chip.style.setProperty("--opacity", String(opacity));
      const value = qs("strong", chip);
      if (value) value.textContent = `${Math.round(opacity * 100)}%`;
    });
    const activeLabels = MAP_PCA_LAYERS.filter((_, index) => chipOpacities[index] > 0.001).map((layer) => layer.label);
    const activeDataLayers = data ? mapPcaActiveDataLayers(data, mapPca) : [];
    const activePointCount = activeDataLayers.reduce((sum, layer) => sum + (layer.count || 0), 0);
    const totalPoints = activePointCount ? ` - ${mapPcaFormatInteger(activePointCount)} points` : "";
    const lockLabel = mapPca.lockedLayerId ? " locked" : "";
    if (elsForMap.statusEl) {
      elsForMap.statusEl.textContent = `${activeLabels.join(" + ")}${lockLabel}${totalPoints}`;
      elsForMap.statusEl.classList.remove("has-warning");
    }
  }

  async function getMapPcaPointCloudData(onProgress) {
    if (mapPcaDataCache.data) return mapPcaDataCache.data;
    if (mapPcaDataCache.promise) return mapPcaDataCache.promise;

    mapPcaDataCache.promise = (async () => {
      onProgress?.("Reading point cloud manifests", 0, 1);
      const centerManifests = await Promise.all(
        MAP_PCA_LAYERS.map(async (layer) => {
          const response = await fetch(localFileURL(layer.manifestPath), { cache: "no-store" });
          if (!response.ok) {
            throw new Error(`Failed to load ${layer.label} manifest: ${response.status} ${response.statusText}`);
          }
          return response.json();
        }),
      );
      const groupedManifestResponse = await fetch(localFileURL(MAP_PCA_GROUPED_MANIFEST_PATH), { cache: "no-store" });
      if (!groupedManifestResponse.ok) {
        throw new Error(`Failed to load grouped patch manifest: ${groupedManifestResponse.status} ${groupedManifestResponse.statusText}`);
      }
      const groupedManifest = await groupedManifestResponse.json();
      const gridManifestResponse = await fetch(localFileURL(MAP_PCA_GRID_MANIFEST_PATH), { cache: "no-store" });
      if (!gridManifestResponse.ok) {
        throw new Error(`Failed to load patch grid manifest: ${gridManifestResponse.status} ${gridManifestResponse.statusText}`);
      }
      const gridManifest = await gridManifestResponse.json();

      const layers = MAP_PCA_LAYERS.map((layer, index) => {
        const manifest = centerManifests[index];
        const count = Number(manifest.count || 0);
        return {
          ...layer,
          count,
          byteLength: Number(manifest.byteLength || count * MAP_PCA_RECORD_BYTES),
          mercatorBounds: mapPcaMercatorBoundsForLonLatBounds(manifest.bounds),
        };
      });
      const groupedLayers = mapPcaBuildGroupedLayers(groupedManifest);
      const gridVerticesByIndex = mapPcaBuildPatchGridVertices(groupedLayers, gridManifest);
      const allLayers = [...layers, ...groupedLayers];
      const totalBytes = allLayers.reduce((sum, layer) => sum + layer.byteLength, 0);
      let loadedBeforeCurrent = 0;
      for (const layer of allLayers) {
        layer.arrayBuffer = await fetchMapPcaArrayBuffer(layer, (bytesLoaded) => {
          onProgress?.(`Loading ${layer.label}`, loadedBeforeCurrent + bytesLoaded, totalBytes);
        });
        loadedBeforeCurrent += layer.byteLength;
        onProgress?.(`${layer.label} ready`, loadedBeforeCurrent, totalBytes);
      }
      mapPcaDataCache.data = {
        layers,
        groupedLayers,
        allLayers,
        gridVerticesByIndex,
        totalBytes,
        totalPoints: layers.reduce((sum, layer) => sum + layer.count, 0),
        groupedTotalPoints: groupedLayers.reduce((sum, layer) => sum + layer.count, 0),
      };
      return mapPcaDataCache.data;
    })().catch((error) => {
      mapPcaDataCache.promise = null;
      throw error;
    });

    return mapPcaDataCache.promise;
  }

  function mapPcaBuildGroupedLayers(groupedManifest) {
    const groupedByRadius = new Map(
      (groupedManifest.layers || []).map((layer) => [Math.round(Number(layer.radiusMeters || 0)), layer]),
    );
    return MAP_PCA_LAYERS.map((scaleLayer, index) => {
      const manifestLayer = groupedByRadius.get(Math.round(scaleLayer.radiusMeters)) || {};
      const count = Number(manifestLayer.count || 0);
      return {
        id: `webmercator-grid:${manifestLayer.id || scaleLayer.groupedId}`,
        label: scaleLayer.label,
        radiusMeters: Number(manifestLayer.radiusMeters || scaleLayer.radiusMeters),
        boundaryMeters: Number(manifestLayer.boundaryMeters || scaleLayer.boundaryMeters),
        colorMatrix: mapPcaColorMatrixForLayer(manifestLayer, scaleLayer),
        count,
        byteLength: Number(manifestLayer.byteLength || count * MAP_PCA_RECORD_BYTES),
        mercatorBounds: mapPcaMercatorBoundsForLonLatBounds(manifestLayer.bounds),
        binPath: mapPcaDataPathFromManifestUrl(
          manifestLayer.url,
          `${MAP_PCA_DATA_ROOT}/webmercator_grid_rgb48_grouped/${scaleLayer.groupedId}/points.bin`,
        ),
        manifestPath: mapPcaDataPathFromManifestUrl(
          manifestLayer.manifestUrl,
          `${MAP_PCA_DATA_ROOT}/webmercator_grid_rgb48_grouped/${scaleLayer.groupedId}/points.json`,
        ),
        scaleIndex: index,
      };
    });
  }

  function mapPcaColorMatrixForLayer(manifestLayer, scaleLayer) {
    const radiusMeters = Math.round(Number(manifestLayer.radiusMeters || scaleLayer.radiusMeters || 0));
    if ([2000, 4000, 8000].includes(radiusMeters)) return MAP_PCA_COLOR_MATRIX_SWAP_RG_THEN_RB;
    return MAP_PCA_COLOR_MATRICES[manifestLayer.colorMatrix] || scaleLayer.colorMatrix || MAP_PCA_COLOR_MATRIX_IDENTITY;
  }

  function mapPcaDataPathFromManifestUrl(url, fallback) {
    if (!url) return fallback;
    const normalized = String(url).replace(/\\/g, "/");
    const prefix = "./data/";
    if (normalized.startsWith(prefix)) return `${MAP_PCA_DATA_ROOT}/${normalized.slice(prefix.length)}`;
    if (/^[A-Za-z]:\//.test(normalized)) return normalized;
    return fallback;
  }

  function mapPcaBuildPatchGridVertices(groupedLayers, gridManifest) {
    const centerMeters = mapPcaLonLatToWebMercatorMeters(MAP_PCA_CENTER.lon, MAP_PCA_CENTER.lat);
    const layerByRadius = new Map(groupedLayers.map((layer, index) => [Math.round(layer.radiusMeters), { layer, index }]));
    const edgeMapsByIndex = new Map();

    for (const group of gridManifest.groups || []) {
      const radiusMeters = Number(group.radiusMeters);
      const match = layerByRadius.get(Math.round(radiusMeters));
      if (!match || !Number.isFinite(radiusMeters) || radiusMeters <= 0) continue;
      if (!edgeMapsByIndex.has(match.index)) edgeMapsByIndex.set(match.index, new Map());
      const edgeMap = edgeMapsByIndex.get(match.index);
      for (const patch of group.patches || []) {
        const gridX = Number(patch.grid?.x);
        const gridY = Number(patch.grid?.y);
        if (!Number.isFinite(gridX) || !Number.isFinite(gridY)) continue;
        mapPcaAppendPatchEdges(edgeMap, gridX, gridY);
      }
    }

    return Object.fromEntries(
      [...edgeMapsByIndex.entries()].map(([index, edgeMap]) => [
        index,
        mapPcaUniqueGridEdgesToVertices(centerMeters, groupedLayers[index]?.radiusMeters || 0, edgeMap),
      ]),
    );
  }

  function mapPcaAppendPatchEdges(edgeMap, gridX, gridY) {
    const west = 2 * gridX - 1;
    const east = 2 * gridX + 1;
    const south = 2 * gridY - 1;
    const north = 2 * gridY + 1;
    mapPcaAddUniqueGridEdge(edgeMap, [west, south], [east, south]);
    mapPcaAddUniqueGridEdge(edgeMap, [east, south], [east, north]);
    mapPcaAddUniqueGridEdge(edgeMap, [east, north], [west, north]);
    mapPcaAddUniqueGridEdge(edgeMap, [west, north], [west, south]);
  }

  function mapPcaAddUniqueGridEdge(edgeMap, start, end) {
    const [a, b] = mapPcaCompareGridNodes(start, end) <= 0 ? [start, end] : [end, start];
    const key = `${a[0]},${a[1]}|${b[0]},${b[1]}`;
    if (!edgeMap.has(key)) edgeMap.set(key, { start: a, end: b });
  }

  function mapPcaCompareGridNodes(a, b) {
    if (a[0] !== b[0]) return a[0] - b[0];
    return a[1] - b[1];
  }

  function mapPcaUniqueGridEdgesToVertices(centerMeters, radiusMeters, edgeMap) {
    if (!Number.isFinite(radiusMeters) || radiusMeters <= 0) return new Float32Array();
    const vertices = [];
    for (const edge of edgeMap.values()) {
      const start = mapPcaGridNodeToMercatorXY(centerMeters, radiusMeters, edge.start);
      const end = mapPcaGridNodeToMercatorXY(centerMeters, radiusMeters, edge.end);
      mapPcaAppendLineQuad(vertices, start, end);
    }
    return new Float32Array(vertices);
  }

  function mapPcaAppendLineQuad(vertices, start, end) {
    mapPcaAppendGridVertex(vertices, start, end, -1, 0);
    mapPcaAppendGridVertex(vertices, start, end, -1, 1);
    mapPcaAppendGridVertex(vertices, start, end, 1, 1);
    mapPcaAppendGridVertex(vertices, start, end, -1, 0);
    mapPcaAppendGridVertex(vertices, start, end, 1, 1);
    mapPcaAppendGridVertex(vertices, start, end, 1, 0);
  }

  function mapPcaAppendGridVertex(vertices, start, end, side, along) {
    vertices.push(start[0], start[1], end[0], end[1], side, along);
  }

  async function fetchMapPcaArrayBuffer(layer, onProgress) {
    const response = await fetch(localFileURL(layer.binPath), { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to load ${layer.label}: ${response.status} ${response.statusText}`);
    }
    const reader = response.body?.getReader();
    if (!reader) {
      const arrayBuffer = await response.arrayBuffer();
      onProgress?.(layer.byteLength);
      return arrayBuffer;
    }

    const chunks = [];
    let received = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      received += value.byteLength;
      onProgress?.(Math.min(received, layer.byteLength));
    }
    const merged = new Uint8Array(received);
    let offset = 0;
    chunks.forEach((chunk) => {
      merged.set(chunk, offset);
      offset += chunk.byteLength;
    });
    onProgress?.(layer.byteLength);
    return merged.buffer;
  }

  function mapPcaActiveDataLayers(data, mapPca) {
    return mapPca.lockedLayerId ? data.groupedLayers : data.layers;
  }

  function mapPcaMetrics(width, height, mapPca) {
    const zoom = mapPcaZoomForScaleControlValue(mapPca.scaleMeters);
    const axisMetrics = mapPcaScreenAxisMeters(width, height, zoom, mapPca.axisBlend, mapPca);
    const opacities = mapPcaLayerOpacitiesForDisplay(axisMetrics.scaleAxisMeters, mapPca.lockedLayerId);
    const coverageOpacities = mapPcaLayerOpacitiesForDisplay(axisMetrics.longAxisMeters, mapPca.lockedLayerId);
    const lockedLayerIndex = mapPca.lockedLayerId ? MAP_PCA_LAYERS.findIndex((layer) => layer.id === mapPca.lockedLayerId) : -1;
    const effectiveOpacities = mapPcaEffectiveLayerOpacities(opacities);
    return {
      ...axisMetrics,
      zoom,
      opacities,
      coverageOpacities,
      effectiveOpacities,
      lockedLayerId: mapPca.lockedLayerId,
      lockedLayerIndex,
      focus: mapPcaFocus(mapPca),
    };
  }

  function mapPcaEffectiveLayerOpacities(opacities) {
    const effective = opacities.slice();
    const active = effective.map((opacity, index) => (opacity > 0.001 ? index : -1)).filter((index) => index >= 0);
    if (!active.length) return effective;
    const displayEndIndex = Math.max(...active);
    for (let index = displayEndIndex + 1; index < effective.length; index += 1) {
      effective[index] = Math.max(effective[index] || 0, 1);
    }
    return effective;
  }

  function mapPcaScreenAxisMeters(width, height, zoom, axisBlend, mapPca = null) {
    const west = mapPcaScreenToLonLat(0, height / 2, width, height, zoom, mapPca);
    const east = mapPcaScreenToLonLat(width, height / 2, width, height, zoom, mapPca);
    const north = mapPcaScreenToLonLat(width / 2, 0, width, height, zoom, mapPca);
    const south = mapPcaScreenToLonLat(width / 2, height, width, height, zoom, mapPca);
    const horizontalMeters = mapPcaHaversineMeters(west.lon, west.lat, east.lon, east.lat);
    const verticalMeters = mapPcaHaversineMeters(north.lon, north.lat, south.lon, south.lat);
    const longAxisMeters = Math.max(horizontalMeters, verticalMeters);
    const shortAxisMeters = Math.min(horizontalMeters, verticalMeters);
    return {
      longAxisMeters,
      shortAxisMeters,
      scaleAxisMeters: lerp(longAxisMeters, shortAxisMeters, clamp(axisBlend, 0, 1)),
    };
  }

  function mapPcaScreenToLonLat(screenX, screenY, width, height, zoom, mapPca = null) {
    const focus = mapPcaFocus(mapPca);
    const worldSize = MAP_PCA_TILE_SIZE * 2 ** zoom;
    const x = focus.x + (screenX - width * MAP_PCA_FOCUS_X) / worldSize;
    const y = focus.y + (screenY - height * MAP_PCA_FOCUS_Y) / worldSize;
    return mapPcaMercatorToLonLat(x, y);
  }

  function mapPcaFocus(mapPca = null) {
    const base = mapPcaLonLatToMercator(MAP_PCA_CENTER.lon, MAP_PCA_CENTER.lat);
    return {
      x: base.x + Number(mapPca?.offsetX || 0),
      y: base.y + Number(mapPca?.offsetY || 0),
    };
  }

  function mapPcaTileUrl(tileZoom, x, y) {
    return `https://basemaps.cartocdn.com/dark_nolabels/${tileZoom}/${x}/${y}.png`;
  }

  function renderMapPcaTiles(tileLayer, width, height, zoom, mapPca = null) {
    const focus = mapPcaFocus(mapPca);
    const tileZoom = clamp(Math.floor(zoom), 0, 19);
    const tilesPerAxis = 2 ** tileZoom;
    const worldSize = MAP_PCA_TILE_SIZE * 2 ** zoom;
    const tileSize = MAP_PCA_TILE_SIZE * 2 ** (zoom - tileZoom);
    const focusX = width * MAP_PCA_FOCUS_X;
    const focusY = height * MAP_PCA_FOCUS_Y;
    const west = focus.x + (0 - focusX) / worldSize;
    const east = focus.x + (width - focusX) / worldSize;
    const north = focus.y + (0 - focusY) / worldSize;
    const south = focus.y + (height - focusY) / worldSize;
    const minX = Math.floor(Math.min(west, east) * tilesPerAxis) - 1;
    const maxX = Math.floor(Math.max(west, east) * tilesPerAxis) + 1;
    const minY = Math.max(0, Math.floor(Math.min(north, south) * tilesPerAxis) - 1);
    const maxY = Math.min(tilesPerAxis - 1, Math.floor(Math.max(north, south) * tilesPerAxis) + 1);
    if (!tileLayer.__mapPcaTileCache) tileLayer.__mapPcaTileCache = new Map();
    tileLayer.__mapPcaTileTick = (tileLayer.__mapPcaTileTick || 0) + 1;
    const cache = tileLayer.__mapPcaTileCache;
    const tick = tileLayer.__mapPcaTileTick;
    const activeKeys = new Set();

    for (let x = minX; x <= maxX; x += 1) {
      const wrappedX = ((x % tilesPerAxis) + tilesPerAxis) % tilesPerAxis;
      for (let y = minY; y <= maxY; y += 1) {
        const left = focusX + (x / tilesPerAxis - focus.x) * worldSize;
        const top = focusY + (y / tilesPerAxis - focus.y) * worldSize;
        const key = `${tileZoom}/${wrappedX}/${y}`;
        activeKeys.add(key);
        let img = cache.get(key);
        if (!img) {
          img = document.createElement("img");
          img.className = "map-pca-tile";
          img.alt = "";
          img.decoding = "async";
          img.draggable = false;
          img.addEventListener("load", () => img.classList.add("is-loaded"), { once: true });
          img.addEventListener("error", () => {
            img.classList.add("is-unavailable");
            img.style.display = "none";
          }, { once: true });
          img.src = mapPcaTileUrl(tileZoom, wrappedX, y);
          cache.set(key, img);
          tileLayer.appendChild(img);
        }
        img.dataset.lastSeen = String(tick);
        img.classList.remove("is-stale");
        img.style.display = "block";
        img.style.width = `${tileSize + 1}px`;
        img.style.height = `${tileSize + 1}px`;
        img.style.transform = `translate3d(${left}px, ${top}px, 0)`;
      }
    }

    cache.forEach((img, key) => {
      if (activeKeys.has(key)) return;
      img.classList.add("is-stale");
      img.style.display = "none";
    });
    if (cache.size > 260) {
      Array.from(cache.entries())
        .filter(([, img]) => img.classList.contains("is-stale"))
        .sort(([, a], [, b]) => Number(a.dataset.lastSeen || 0) - Number(b.dataset.lastSeen || 0))
        .slice(0, cache.size - 220)
        .forEach(([key, img]) => {
          img.remove();
          cache.delete(key);
        });
    }
  }

  function clearMapPcaCanvas(canvas) {
    const gl = canvas.getContext("webgl");
    if (!gl) return;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  function createMapPcaGlState(canvas) {
    const gl = canvas.getContext("webgl", { alpha: true, antialias: false });
    if (!gl) throw new Error("WebGL is not available for MAP-PCA.");
    const program = createMapPcaProgram(gl, mapPcaVertexShaderSource(), mapPcaFragmentShaderSource());
    const gridProgram = createMapPcaProgram(gl, mapPcaGridVertexShaderSource(), mapPcaGridFragmentShaderSource());
    return {
      canvas,
      gl,
      program,
      gridProgram,
      buffers: new Map(),
      gridBuffers: new Map(),
      locations: {
        resolution: gl.getUniformLocation(program, "u_resolution"),
        anchor: gl.getUniformLocation(program, "u_anchor"),
        focus: gl.getUniformLocation(program, "u_focus"),
        worldSize: gl.getUniformLocation(program, "u_worldSize"),
        pointSize: gl.getUniformLocation(program, "u_pointSize"),
        opacity: gl.getUniformLocation(program, "u_opacity"),
        colorMatrix: gl.getUniformLocation(program, "u_colorMatrix"),
        overlapBounds: gl.getUniformLocation(program, "u_overlapBounds"),
        useCoverageBoost: gl.getUniformLocation(program, "u_useCoverageBoost"),
      },
      attributes: {
        position: gl.getAttribLocation(program, "a_pos"),
        color: gl.getAttribLocation(program, "a_color"),
      },
      gridLocations: {
        resolution: gl.getUniformLocation(gridProgram, "u_resolution"),
        anchor: gl.getUniformLocation(gridProgram, "u_anchor"),
        focus: gl.getUniformLocation(gridProgram, "u_focus"),
        worldSize: gl.getUniformLocation(gridProgram, "u_worldSize"),
        lineWidth: gl.getUniformLocation(gridProgram, "u_lineWidth"),
        color: gl.getUniformLocation(gridProgram, "u_color"),
      },
      gridAttributes: {
        start: gl.getAttribLocation(gridProgram, "a_start"),
        end: gl.getAttribLocation(gridProgram, "a_end"),
        side: gl.getAttribLocation(gridProgram, "a_side"),
        along: gl.getAttribLocation(gridProgram, "a_along"),
      },
    };
  }

  function drawMapPcaPointCloud(glState, data, metrics) {
    const { canvas, gl, program, locations, attributes } = glState;
    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    ensureMapPcaGlBuffers(glState, data);
    gl.viewport(0, 0, width, height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.disable(gl.DEPTH_TEST);
    gl.depthMask(false);

    const focus = metrics.focus || mapPcaFocus();
    const pointSize = mapPcaPointRadiusForZoom(metrics.zoom, MAP_PCA_BASE_POINT_RADIUS) * dpr;
    gl.uniform2f(locations.resolution, width, height);
    gl.uniform2f(locations.anchor, width * MAP_PCA_FOCUS_X, height * MAP_PCA_FOCUS_Y);
    gl.uniform2f(locations.focus, focus.x, focus.y);
    gl.uniform1f(locations.worldSize, MAP_PCA_TILE_SIZE * 2 ** metrics.zoom * dpr);
    gl.uniform1f(locations.pointSize, pointSize);

    const activeLayers = metrics.lockedLayerId ? data.groupedLayers : data.layers;
    const displayActive = metrics.opacities.map((opacity, index) => (opacity > 0.001 ? index : -1)).filter((index) => index >= 0);
    if (!displayActive.length) {
      drawMapPcaPatchGrid(glState, data, metrics, width, height, dpr);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.depthMask(true);
      return;
    }
    const renderStartIndex = Math.min(...displayActive);
    const renderEndIndex = activeLayers.length - 1;

    for (let layerIndex = renderEndIndex; layerIndex >= renderStartIndex; layerIndex -= 1) {
      const layer = activeLayers[layerIndex];
      const buffer = glState.buffers.get(layer.id);
      if (!buffer || !layer.count) continue;
      const useCoverageBoost = layerIndex > renderStartIndex;
      const overlapBounds = useCoverageBoost ? activeLayers[layerIndex - 1].mercatorBounds : MAP_PCA_FULL_MERCATOR_BOUNDS;
      gl.uniform1f(locations.opacity, metrics.opacities[layerIndex] || 0);
      gl.uniformMatrix3fv(locations.colorMatrix, false, layer.colorMatrix);
      gl.uniform4fv(locations.overlapBounds, overlapBounds);
      gl.uniform1f(locations.useCoverageBoost, useCoverageBoost ? 1 : 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(attributes.position);
      gl.vertexAttribPointer(attributes.position, 2, gl.FLOAT, false, MAP_PCA_RECORD_BYTES, 0);
      gl.enableVertexAttribArray(attributes.color);
      gl.vertexAttribPointer(attributes.color, 4, gl.UNSIGNED_BYTE, true, MAP_PCA_RECORD_BYTES, 8);
      gl.drawArrays(gl.POINTS, 0, layer.count);
    }
    drawMapPcaPatchGrid(glState, data, metrics, width, height, dpr);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.depthMask(true);
  }

  function drawMapPcaPatchGrid(glState, data, metrics, width, height, dpr) {
    if (!metrics.lockedLayerId || metrics.lockedLayerIndex < 0 || !glState.gridProgram) return;
    const vertices = data.gridVerticesByIndex?.[metrics.lockedLayerIndex];
    if (!vertices?.length) return;
    const buffer = glState.gridBuffers.get(metrics.lockedLayerIndex);
    if (!buffer) return;

    const { gl, gridProgram, gridLocations, gridAttributes } = glState;
    const focus = metrics.focus || mapPcaFocus();
    gl.useProgram(gridProgram);
    gl.uniform2f(gridLocations.resolution, width, height);
    gl.uniform2f(gridLocations.anchor, width * MAP_PCA_FOCUS_X, height * MAP_PCA_FOCUS_Y);
    gl.uniform2f(gridLocations.focus, focus.x, focus.y);
    gl.uniform1f(gridLocations.worldSize, MAP_PCA_TILE_SIZE * 2 ** metrics.zoom * dpr);
    gl.uniform1f(gridLocations.lineWidth, MAP_PCA_GRID_LINE_WIDTH * dpr);
    gl.uniform4f(
      gridLocations.color,
      MAP_PCA_GRID_LINE_COLOR[0],
      MAP_PCA_GRID_LINE_COLOR[1],
      MAP_PCA_GRID_LINE_COLOR[2],
      1 - MAP_PCA_GRID_TRANSPARENCY,
    );
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(gridAttributes.start);
    gl.vertexAttribPointer(gridAttributes.start, 2, gl.FLOAT, false, MAP_PCA_GRID_VERTEX_FLOATS * 4, 0);
    gl.enableVertexAttribArray(gridAttributes.end);
    gl.vertexAttribPointer(gridAttributes.end, 2, gl.FLOAT, false, MAP_PCA_GRID_VERTEX_FLOATS * 4, 8);
    gl.enableVertexAttribArray(gridAttributes.side);
    gl.vertexAttribPointer(gridAttributes.side, 1, gl.FLOAT, false, MAP_PCA_GRID_VERTEX_FLOATS * 4, 16);
    gl.enableVertexAttribArray(gridAttributes.along);
    gl.vertexAttribPointer(gridAttributes.along, 1, gl.FLOAT, false, MAP_PCA_GRID_VERTEX_FLOATS * 4, 20);
    gl.drawArrays(gl.TRIANGLES, 0, Math.floor(vertices.length / MAP_PCA_GRID_VERTEX_FLOATS));
  }

  function ensureMapPcaGlBuffers(glState, data) {
    data.allLayers.forEach((layer) => {
      if (glState.buffers.has(layer.id) || !layer.arrayBuffer) return;
      const buffer = glState.gl.createBuffer();
      glState.gl.bindBuffer(glState.gl.ARRAY_BUFFER, buffer);
      glState.gl.bufferData(glState.gl.ARRAY_BUFFER, layer.arrayBuffer, glState.gl.STATIC_DRAW);
      glState.buffers.set(layer.id, buffer);
    });
    Object.entries(data.gridVerticesByIndex || {}).forEach(([index, vertices]) => {
      if (glState.gridBuffers.has(Number(index)) || !vertices?.length) return;
      const buffer = glState.gl.createBuffer();
      glState.gl.bindBuffer(glState.gl.ARRAY_BUFFER, buffer);
      glState.gl.bufferData(glState.gl.ARRAY_BUFFER, vertices, glState.gl.STATIC_DRAW);
      glState.gridBuffers.set(Number(index), buffer);
    });
    glState.gl.bindBuffer(glState.gl.ARRAY_BUFFER, null);
  }

  function disposeMapPcaGlState(glState) {
    glState.buffers.forEach((buffer) => glState.gl.deleteBuffer(buffer));
    glState.buffers.clear();
    glState.gridBuffers.forEach((buffer) => glState.gl.deleteBuffer(buffer));
    glState.gridBuffers.clear();
    if (glState.program) glState.gl.deleteProgram(glState.program);
    if (glState.gridProgram) glState.gl.deleteProgram(glState.gridProgram);
  }

  function mapPcaVertexShaderSource() {
    return `
      precision highp float;
      uniform vec2 u_resolution;
      uniform vec2 u_anchor;
      uniform vec2 u_focus;
      uniform float u_worldSize;
      uniform float u_pointSize;
      uniform mat3 u_colorMatrix;
      attribute vec2 a_pos;
      attribute vec4 a_color;
      varying vec4 v_color;
      varying vec2 v_pos;
      void main() {
        vec2 screen = u_anchor + (a_pos - u_focus) * u_worldSize;
        vec2 clip = vec2((screen.x / u_resolution.x) * 2.0 - 1.0, 1.0 - (screen.y / u_resolution.y) * 2.0);
        gl_Position = vec4(clip, 0.0, 1.0);
        gl_PointSize = u_pointSize;
        v_color = vec4(u_colorMatrix * a_color.rgb, a_color.a);
        v_pos = a_pos;
      }
    `;
  }

  function mapPcaFragmentShaderSource() {
    return `
      precision highp float;
      uniform float u_opacity;
      uniform vec4 u_overlapBounds;
      uniform float u_useCoverageBoost;
      varying vec4 v_color;
      varying vec2 v_pos;
      void main() {
        vec2 delta = gl_PointCoord - vec2(0.5);
        float dist = length(delta);
        float insideOverlap =
          step(u_overlapBounds.x, v_pos.x) *
          step(v_pos.x, u_overlapBounds.z) *
          step(u_overlapBounds.y, v_pos.y) *
          step(v_pos.y, u_overlapBounds.w);
        float coverageOpacity = mix(1.0, u_opacity, insideOverlap);
        float opacity = mix(u_opacity, coverageOpacity, u_useCoverageBoost);
        float alpha = smoothstep(0.5, 0.42, dist) * opacity * v_color.a;
        if (alpha <= 0.001) discard;
        gl_FragColor = vec4(v_color.rgb, alpha);
      }
    `;
  }

  function mapPcaGridVertexShaderSource() {
    return `
      precision highp float;
      uniform vec2 u_resolution;
      uniform vec2 u_anchor;
      uniform vec2 u_focus;
      uniform float u_worldSize;
      uniform float u_lineWidth;
      attribute vec2 a_start;
      attribute vec2 a_end;
      attribute float a_side;
      attribute float a_along;
      void main() {
        vec2 startScreen = u_anchor + (a_start - u_focus) * u_worldSize;
        vec2 endScreen = u_anchor + (a_end - u_focus) * u_worldSize;
        vec2 segment = endScreen - startScreen;
        float segmentLength = max(length(segment), 0.0001);
        vec2 normal = vec2(-segment.y, segment.x) / segmentLength;
        vec2 screen = mix(startScreen, endScreen, a_along) + normal * a_side * u_lineWidth * 0.5;
        vec2 clip = vec2((screen.x / u_resolution.x) * 2.0 - 1.0, 1.0 - (screen.y / u_resolution.y) * 2.0);
        gl_Position = vec4(clip, 0.0, 1.0);
      }
    `;
  }

  function mapPcaGridFragmentShaderSource() {
    return `
      precision highp float;
      uniform vec4 u_color;
      void main() {
        gl_FragColor = u_color;
      }
    `;
  }

  function createMapPcaProgram(gl, vertexSource, fragmentSource) {
    const vertexShader = createMapPcaShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = createMapPcaShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const message = gl.getProgramInfoLog(program) || "Unable to link MAP-PCA shader program";
      gl.deleteProgram(program);
      throw new Error(message);
    }
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return program;
  }

  function createMapPcaShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader) || "Unable to compile MAP-PCA shader";
      gl.deleteShader(shader);
      throw new Error(message);
    }
    return shader;
  }

  function mapPcaLayerOpacitiesForDisplay(axisMeters, lockedLayerId = null) {
    if (lockedLayerId) return MAP_PCA_LAYERS.map((layer) => (layer.id === lockedLayerId ? 1 : 0));
    return mapPcaLayerOpacitiesForAxis(axisMeters);
  }

  function mapPcaLayerOpacitiesForAxis(axisMeters) {
    const opacities = new Array(MAP_PCA_LAYERS.length).fill(0);
    if (axisMeters <= MAP_PCA_INTERVAL_BOUNDARIES[1]) {
      opacities[0] = 1;
      return opacities;
    }
    if (axisMeters >= MAP_PCA_INTERVAL_BOUNDARIES[5]) {
      opacities[4] = 1;
      return opacities;
    }
    for (let interval = 1; interval <= 4; interval += 1) {
      const start = MAP_PCA_INTERVAL_BOUNDARIES[interval];
      const end = MAP_PCA_INTERVAL_BOUNDARIES[interval + 1];
      if (axisMeters < start || axisMeters > end) continue;
      const width = end - start;
      const fadeEnd = start + width * MAP_PCA_CROSSFADE_ACTIVE_FRACTION;
      if (axisMeters >= fadeEnd) {
        opacities[interval] = 1;
        return opacities;
      }
      const t = clamp((axisMeters - start) / Math.max(fadeEnd - start, 1), 0, 1);
      const [fromOpacity, toOpacity] = mapPcaBrightnessCompensatedWeights(t);
      opacities[interval - 1] = fromOpacity;
      opacities[interval] = toOpacity;
      return opacities;
    }
    opacities[4] = 1;
    return opacities;
  }

  function mapPcaBrightnessCompensatedWeights(t) {
    const from = 1 - t;
    const to = t;
    const energy = Math.hypot(from, to) || 1;
    return [from / energy, to / energy];
  }

  function mapPcaZoomForScaleControlValue(scaleMeters) {
    const scaleT = Math.log2(scaleMeters / MAP_PCA_MIN_AXIS_METERS) / Math.log2(MAP_PCA_MAX_AXIS_METERS / MAP_PCA_MIN_AXIS_METERS);
    return lerp(MAP_PCA_MIN_ZOOM, MAP_PCA_MAX_ZOOM, clamp(scaleT, 0, 1));
  }

  function mapPcaPointRadiusForZoom(zoom, radius) {
    if (zoom <= 8) return radius / 32;
    if (zoom <= 13) return mapPcaExponentialInterpolate(zoom, 8, radius / 32, 13, radius, 2);
    if (zoom <= 18) return mapPcaExponentialInterpolate(zoom, 13, radius, 18, radius * 32, 2);
    return radius * 32;
  }

  function mapPcaExponentialInterpolate(value, inputMin, outputMin, inputMax, outputMax, base) {
    const progress = clamp((value - inputMin) / (inputMax - inputMin), 0, 1);
    const t = base === 1 ? progress : (Math.pow(base, progress * (inputMax - inputMin)) - 1) / (Math.pow(base, inputMax - inputMin) - 1);
    return outputMin + t * (outputMax - outputMin);
  }

  function mapPcaMercatorBoundsForLonLatBounds(bounds) {
    if (!bounds) return MAP_PCA_FULL_MERCATOR_BOUNDS;
    const west = Number(bounds.west);
    const south = Number(bounds.south);
    const east = Number(bounds.east);
    const north = Number(bounds.north);
    if (![west, south, east, north].every(Number.isFinite)) return MAP_PCA_FULL_MERCATOR_BOUNDS;
    const northwest = mapPcaLonLatToMercator(west, north);
    const southeast = mapPcaLonLatToMercator(east, south);
    return new Float32Array([
      Math.min(northwest.x, southeast.x),
      Math.min(northwest.y, southeast.y),
      Math.max(northwest.x, southeast.x),
      Math.max(northwest.y, southeast.y),
    ]);
  }

  function mapPcaLonLatToMercator(lon, lat) {
    const clampedLat = clamp(lat, -85.05112878, 85.05112878);
    const sinLat = Math.sin(mapPcaDegreesToRadians(clampedLat));
    return {
      x: (lon + 180) / 360,
      y: 0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI),
    };
  }

  function mapPcaMercatorToLonLat(x, y) {
    const lon = x * 360 - 180;
    const lat = (Math.atan(Math.sinh(Math.PI * (1 - 2 * y))) * 180) / Math.PI;
    return { lon, lat };
  }

  function mapPcaLonLatToWebMercatorMeters(lon, lat) {
    const clampedLat = clamp(lat, -85.05112878, 85.05112878);
    const latRadians = mapPcaDegreesToRadians(clampedLat);
    return {
      x: (lon / 180) * MAP_PCA_WEB_MERCATOR_HALF_WORLD_METERS,
      y: (Math.log(Math.tan(Math.PI / 4 + latRadians / 2)) / Math.PI) * MAP_PCA_WEB_MERCATOR_HALF_WORLD_METERS,
    };
  }

  function mapPcaWebMercatorMetersToMercatorXY(x, y) {
    const worldMeters = MAP_PCA_WEB_MERCATOR_HALF_WORLD_METERS * 2;
    return [
      (x + MAP_PCA_WEB_MERCATOR_HALF_WORLD_METERS) / worldMeters,
      (MAP_PCA_WEB_MERCATOR_HALF_WORLD_METERS - y) / worldMeters,
    ];
  }

  function mapPcaGridNodeToMercatorXY(centerMeters, radiusMeters, node) {
    return mapPcaWebMercatorMetersToMercatorXY(
      centerMeters.x + node[0] * radiusMeters,
      centerMeters.y + node[1] * radiusMeters,
    );
  }

  function mapPcaHaversineMeters(lonA, latA, lonB, latB) {
    const lat1 = mapPcaDegreesToRadians(latA);
    const lat2 = mapPcaDegreesToRadians(latB);
    const deltaLat = mapPcaDegreesToRadians(latB - latA);
    const deltaLon = mapPcaDegreesToRadians(lonB - lonA);
    const sinHalfLat = Math.sin(deltaLat / 2);
    const sinHalfLon = Math.sin(deltaLon / 2);
    const a = sinHalfLat * sinHalfLat + Math.cos(lat1) * Math.cos(lat2) * sinHalfLon * sinHalfLon;
    return 2 * MAP_PCA_EARTH_RADIUS_METERS * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function mapPcaDegreesToRadians(degrees) {
    return (degrees * Math.PI) / 180;
  }

  function mapPcaFormatAxisBlend(axisBlend) {
    if (axisBlend <= 0.005) return "Long axis";
    if (axisBlend >= 0.995) return "Short axis";
    return `${Math.round(axisBlend * 100)}% short`;
  }

  function mapPcaFormatKm(meters) {
    if (meters >= 10000) return `${Math.round(meters / 1000)} km`;
    return `${(meters / 1000).toFixed(1)} km`;
  }

  function mapPcaFormatInteger(value) {
    return new Intl.NumberFormat("en-US").format(value);
  }

  function activateStudiosAiRevealSlide(slide, direction = 1) {
    stopStudiosAiRevealAnimation();
    if (!isStudiosAiRevealSlide(slide)) {
      studiosAiRevealSlideId = null;
      studiosAiRevealStep = 0;
      studiosAiRevealTargetStep = 0;
      return;
    }
    const total = slide.windows?.length || 0;
    studiosAiRevealSlideId = slide.id;
    studiosAiRevealStep = direction < 0 ? total : 0;
    studiosAiRevealTargetStep = studiosAiRevealStep;
  }

  function syncStudiosAiRevealWindowVisibility() {
    const slide = slides[slideIndex];
    if (!isStudiosAiRevealSlide(slide)) return;
    const revealStep = studiosAiRevealVisibleStep(slide);
    qsa(".window-layer.is-studios-ai-window", currentSurface || stage).forEach((el, fallbackIndex) => {
      const index = Number.isFinite(Number(el.dataset.windowIndex)) ? Number(el.dataset.windowIndex) : fallbackIndex;
      const visible = index < revealStep;
      el.classList.toggle("is-reveal-visible", visible);
      el.setAttribute("aria-hidden", visible ? "false" : "true");
    });
  }

  function setStudiosAiRevealTarget(targetStep) {
    const slide = slides[slideIndex];
    if (!isStudiosAiRevealSlide(slide)) return false;
    const total = slide.windows?.length || 0;
    studiosAiRevealTargetStep = clamp(Math.round(targetStep), 0, total);
    startStudiosAiRevealAnimation();
    return true;
  }

  function startStudiosAiRevealAnimation() {
    if (studiosAiRevealTimer) return;
    studiosAiRevealTimer = window.setTimeout(advanceStudiosAiRevealAnimation, STUDIOS_AI_REVEAL_ITEM_INTERVAL_MS);
  }

  function stopStudiosAiRevealAnimation() {
    if (!studiosAiRevealTimer) return;
    window.clearTimeout(studiosAiRevealTimer);
    studiosAiRevealTimer = null;
  }

  function advanceStudiosAiRevealAnimation() {
    studiosAiRevealTimer = null;
    const slide = slides[slideIndex];
    if (!isStudiosAiRevealSlide(slide) || studiosAiRevealStep === studiosAiRevealTargetStep) return;
    studiosAiRevealStep += Math.sign(studiosAiRevealTargetStep - studiosAiRevealStep);
    syncStudiosAiRevealWindowVisibility();
    startStudiosAiRevealAnimation();
  }

  function wheelBatchCount(event) {
    const delta = Math.abs(event.deltaY || event.deltaX || 0);
    if (!delta) return 0;
    const lineMode = typeof WheelEvent !== "undefined" ? WheelEvent.DOM_DELTA_LINE : 1;
    const pageMode = typeof WheelEvent !== "undefined" ? WheelEvent.DOM_DELTA_PAGE : 2;
    const unit = event.deltaMode === lineMode ? 3 : event.deltaMode === pageMode ? 1 : 100;
    return clamp(Math.max(1, Math.round(delta / unit)), 1, 12);
  }

  function handleStudiosAiRevealWheel(event, dominantDelta) {
    const slide = slides[slideIndex];
    if (!isStudiosAiRevealSlide(slide) || !dominantDelta) return false;
    const total = slide.windows?.length || 0;
    if (studiosAiRevealSlideId !== slide.id) activateStudiosAiRevealSlide(slide, dominantDelta > 0 ? 1 : -1);
    const direction = dominantDelta > 0 ? 1 : -1;
    const currentTarget = studiosAiRevealTargetStep;
    const atForwardEnd = direction > 0 && currentTarget >= total;
    const atBackwardEnd = direction < 0 && currentTarget <= 0;
    event.preventDefault();
    event.stopPropagation();
    if (atForwardEnd || atBackwardEnd) return true;
    wheelAccumulator = 0;
    const nextTarget = currentTarget + direction * wheelBatchCount(event) * STUDIOS_AI_REVEAL_BATCH_SIZE;
    setStudiosAiRevealTarget(nextTarget);
    return true;
  }

  function setPreviewToggleTimer(key, callback, delay = PAGE_WINDOW_ITEM_ANIMATION_MS) {
    const previous = previewWindowToggleTimers.get(key);
    if (previous) window.clearTimeout(previous);
    const timer = window.setTimeout(() => {
      previewWindowToggleTimers.delete(key);
      callback();
    }, delay);
    previewWindowToggleTimers.set(key, timer);
  }

  function clearPreviewToggleTimers() {
    previewWindowToggleTimers.forEach((timer) => window.clearTimeout(timer));
    previewWindowToggleTimers.clear();
  }

  function handlePreviewWindowToggle(event) {
    const slide = slides[slideIndex];
    if (!usesPreviewWindowClickToggle(slide)) return;
    const hiddenAtPoint = qsa(".window-layer.is-preview-hidden", currentSurface || stage)
      .filter((el) => {
        const rect = el.getBoundingClientRect();
        return event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      })
      .sort((a, b) => Number(b.style.zIndex || 0) - Number(a.style.zIndex || 0))[0];
    const winEl = hiddenAtPoint || event.target.closest(".window-layer.is-preview-toggleable-window");
    if (!winEl || winEl.dataset.slideId !== slide.id) return;

    event.preventDefault();
    event.stopPropagation();
    const key = previewWindowKey(slide.id, winEl.dataset.windowId);
    const hidden = hiddenPreviewWindowIds.has(key);
    winEl.style.setProperty("--page-window-delay", "0ms");
    winEl.style.setProperty("--page-window-duration", `${PAGE_WINDOW_ITEM_ANIMATION_MS}ms`);
    winEl.classList.remove("is-preview-hiding", "is-preview-showing");
    if (hidden) {
      hiddenPreviewWindowIds.delete(key);
      winEl.classList.remove("is-preview-hidden");
      winEl.classList.add("is-preview-showing");
      winEl.setAttribute("aria-hidden", "false");
      setPreviewToggleTimer(key, () => winEl.classList.remove("is-preview-showing"));
      return;
    }

    hiddenPreviewWindowIds.add(key);
    winEl.classList.add("is-preview-hiding");
    winEl.setAttribute("aria-hidden", "true");
    setPreviewToggleTimer(key, () => {
      winEl.classList.add("is-preview-hidden");
      winEl.classList.remove("is-preview-hiding");
    });
  }

  function semanticJumpEnabledForIndex(index) {
    const pageNumber = index + 1;
    return pageNumber >= 5 && pageNumber <= 19 && pageNumber !== 11;
  }

  function semanticWebappBaseUrl() {
    const params = new URLSearchParams(window.location.search);
    const configured = params.get("semanticUrl") || window.WEBPRESENTATION_SEMANTIC_APP_URL || "";
    if (configured) {
      try {
        return new URL(configured, window.location.href).href;
      } catch {
        // Fall back to the GitHub Pages sibling route below.
      }
    }
    if ((window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost") && window.location.port === "4383") {
      return "http://127.0.0.1:4174/";
    }
    return "https://ticoch1.github.io/semanticmapdemo/";
  }

  function presentationReturnUrlForIndex(index) {
    const url = new URL(window.location.href);
    url.searchParams.set("slide", String(index + 1));
    url.searchParams.delete("returnTo");
    url.hash = "";
    return url.href;
  }

  function semanticWebappUrlForIndex(index) {
    const url = new URL(semanticWebappBaseUrl(), window.location.href);
    url.searchParams.set("returnTo", presentationReturnUrlForIndex(index));
    return url.href;
  }

  function updateSemanticWebappLink() {
    const enabled = semanticJumpEnabledForIndex(slideIndex);
    semanticLink.hidden = !enabled;
    semanticLink.setAttribute("aria-hidden", enabled ? "false" : "true");
    if (enabled) semanticLink.href = semanticWebappUrlForIndex(slideIndex);
  }

  function updateNav() {
    updateSemanticWebappLink();
    const slide = slides[slideIndex];
    prevBtn.disabled = slideIndex <= 0;
    nextBtn.disabled = slideIndex >= slides.length - 1;
    counter.textContent = slide ? `${slideIndex + 1}/${slides.length} ${slide.title || ""}` : "0/0";
  }

  async function goTo(index, options = {}) {
    const targetIndex = clamp(index, 0, Math.max(0, slides.length - 1));
    const fast = options.fast === true;
    const animate = options.animate !== false;
    if (targetIndex === slideIndex || (isNavigating && !fast)) return;

    const token = ++navigationToken;
    isNavigating = true;
    const fromSlide = slides[slideIndex] || null;
    const toSlide = slides[targetIndex] || null;
    const direction = targetIndex > slideIndex ? 1 : -1;
    stopStudiosAiRevealAnimation();
    clearPreviewToggleTimers();
    activateStudiosAiRevealSlide(toSlide, direction);
    await preloadSlide(targetIndex);
    if (token !== navigationToken) return;

    transitionFromSlide = fromSlide;
    const navigationGuardMs = animate
      ? isStreetviewSlide(transitionFromSlide) || isStreetviewSlide(toSlide)
        ? STREETVIEW_PAGE_TRANSITION_MS
        : Math.max(FADE_DURATION_MS, pageWindowTransitionDuration(fromSlide, toSlide)) + 90
      : 0;
    slideIndex = targetIndex;
    render(animate);
    hiddenPreviewWindowIds.clear();
    if (!navigationGuardMs) {
      if (token === navigationToken) isNavigating = false;
      return;
    }
    window.setTimeout(() => {
      if (token === navigationToken) isNavigating = false;
    }, navigationGuardMs);
  }

  function next() {
    return goTo(slideIndex + 1);
  }

  function prev() {
    return goTo(slideIndex - 1);
  }

  function handleWheel(event) {
    if (!slides.length || event.defaultPrevented) return;
    const dominantDelta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
    if (!dominantDelta) return;
    if (handleStudiosAiRevealWheel(event, dominantDelta)) return;
    if (hasSpecialWheelInteraction(slides[slideIndex])) {
      event.preventDefault();
      event.stopPropagation();
      wheelAccumulator = 0;
      return;
    }
    event.preventDefault();

    const now = performance.now();
    if (now - lastWheelTurnAt < 620 || isNavigating) return;
    wheelAccumulator += dominantDelta;
    if (Math.abs(wheelAccumulator) < 90) return;

    const direction = wheelAccumulator > 0 ? 1 : -1;
    wheelAccumulator = 0;
    lastWheelTurnAt = now;
    if (direction > 0) next();
    else prev();
  }

  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);
  stage.addEventListener("click", handlePreviewWindowToggle);
  window.addEventListener("wheel", handleWheel, { passive: false });
  window.addEventListener("keydown", (event) => {
    if (event.defaultPrevented) return;
    if (event.key === "PageDown") {
      event.preventDefault();
      goTo(slideIndex + 1, { fast: true, animate: false });
    } else if (event.key === "PageUp") {
      event.preventDefault();
      goTo(slideIndex - 1, { fast: true, animate: false });
    } else if (event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === " ") {
      event.preventDefault();
      next();
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      prev();
    } else if (event.key === "Home") {
      event.preventDefault();
      goTo(0);
    } else if (event.key === "End") {
      event.preventDefault();
      goTo(slides.length - 1);
    }
  });

  window.__STATIC_PREVIEW_DEBUG__ = {
    goTo,
    next,
    prev,
    preloadSlide,
    slides,
    get index() {
      return slideIndex;
    },
    get currentSlide() {
      return slides[slideIndex] || null;
    },
  };

  preloadSlide(slideIndex);
  preloadPrioritySlides();
  render(false);
})();
