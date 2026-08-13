import { useMemo, useRef, useState } from "react";
import "./App.css";

const zones = [
  {
    id: "A",
    name: "Zone A",
    demand: "240K L/day",
    color: "green",
    description: "Residential and civic distribution",
  },
  {
    id: "B",
    name: "Zone B",
    demand: "310K L/day",
    color: "blue",
    description: "Industrial and commercial distribution",
  },
  {
    id: "C",
    name: "Zone C",
    demand: "420K L/day",
    color: "purple",
    description: "Hospital and high-demand district",
  },
  {
    id: "D",
    name: "Zone D",
    demand: "285K L/day",
    color: "orange",
    description: "Education and residential district",
  },
];

/*
 * 36 CITY-SCALE PIPELINE SECTIONS
 *
 * 24 horizontal sections
 * 12 vertical connecting sections
 *
 * These are the actual selectable pipeline sections
 * shown in the city overview.
 */
const citySegments = [
  // MAIN NETWORK - ROW 1
  { id: "P-01", x1: 8, y1: 42, x2: 20, y2: 42, zone: "A" },
  { id: "P-02", x1: 20, y1: 42, x2: 32, y2: 42, zone: "B" },
  { id: "P-03", x1: 32, y1: 42, x2: 44, y2: 42, zone: "C" },
  { id: "P-04", x1: 44, y1: 42, x2: 56, y2: 42, zone: "D" },
  { id: "P-05", x1: 56, y1: 42, x2: 68, y2: 42, zone: "A" },
  { id: "P-06", x1: 68, y1: 42, x2: 80, y2: 42, zone: "B" },
  { id: "P-07", x1: 80, y1: 42, x2: 92, y2: 42, zone: "C" },
  { id: "P-08", x1: 92, y1: 42, x2: 96, y2: 42, zone: "D" },

  // MAIN NETWORK - ROW 2
  { id: "P-09", x1: 8, y1: 58, x2: 20, y2: 58, zone: "A" },
  { id: "P-10", x1: 20, y1: 58, x2: 32, y2: 58, zone: "B" },
  { id: "P-11", x1: 32, y1: 58, x2: 44, y2: 58, zone: "C" },
  { id: "P-12", x1: 44, y1: 58, x2: 56, y2: 58, zone: "D" },
  { id: "P-13", x1: 56, y1: 58, x2: 68, y2: 58, zone: "A" },
  { id: "P-14", x1: 68, y1: 58, x2: 80, y2: 58, zone: "B" },
  { id: "P-15", x1: 80, y1: 58, x2: 92, y2: 58, zone: "C" },
  { id: "P-16", x1: 92, y1: 58, x2: 96, y2: 58, zone: "D" },

  // MAIN NETWORK - ROW 3
  { id: "P-17", x1: 8, y1: 74, x2: 20, y2: 74, zone: "A" },
  { id: "P-18", x1: 20, y1: 74, x2: 32, y2: 74, zone: "B" },
  { id: "P-19", x1: 32, y1: 74, x2: 44, y2: 74, zone: "C" },
  { id: "P-20", x1: 44, y1: 74, x2: 56, y2: 74, zone: "D" },
  { id: "P-21", x1: 56, y1: 74, x2: 68, y2: 74, zone: "A" },
  { id: "P-22", x1: 68, y1: 74, x2: 80, y2: 74, zone: "B" },
  { id: "P-23", x1: 80, y1: 74, x2: 92, y2: 74, zone: "C" },
  { id: "P-24", x1: 92, y1: 74, x2: 96, y2: 74, zone: "D" },

  // VERTICAL CONNECTIONS - UPPER
  { id: "P-25", x1: 20, y1: 42, x2: 20, y2: 58, zone: "A" },
  { id: "P-26", x1: 32, y1: 42, x2: 32, y2: 58, zone: "B" },
  { id: "P-27", x1: 44, y1: 42, x2: 44, y2: 58, zone: "C" },
  { id: "P-28", x1: 56, y1: 42, x2: 56, y2: 58, zone: "D" },
  { id: "P-29", x1: 68, y1: 42, x2: 68, y2: 58, zone: "A" },
  { id: "P-30", x1: 80, y1: 42, x2: 80, y2: 58, zone: "B" },

  // VERTICAL CONNECTIONS - LOWER
  { id: "P-31", x1: 20, y1: 58, x2: 20, y2: 74, zone: "C" },
  { id: "P-32", x1: 32, y1: 58, x2: 32, y2: 74, zone: "D" },
  { id: "P-33", x1: 44, y1: 58, x2: 44, y2: 74, zone: "A" },
  { id: "P-34", x1: 56, y1: 58, x2: 56, y2: 74, zone: "B" },
  { id: "P-35", x1: 68, y1: 58, x2: 68, y2: 74, zone: "C" },
  { id: "P-36", x1: 80, y1: 58, x2: 80, y2: 74, zone: "D" },
];

/*
 * 12 SURFACE BUILDINGS
 *
 * Each building has a service connection that visually
 * joins the city pipeline network.
 */
const cityBuildings = [
  {
    id: "b1",
    title: "RESIDENTIAL A",
    icon: "⌂",
    left: 8,
    top: 7,
    pipeX: 8,
    pipeY: 42,
    zone: "A",
  },
  {
    id: "b2",
    title: "RESIDENTIAL B",
    icon: "⌂",
    left: 20,
    top: 6,
    pipeX: 20,
    pipeY: 42,
    zone: "A",
  },
  {
    id: "b3",
    title: "COMMERCIAL",
    icon: "▦",
    left: 32,
    top: 7,
    pipeX: 32,
    pipeY: 42,
    zone: "B",
  },
  {
    id: "b4",
    title: "HOSPITAL",
    icon: "✚",
    left: 44,
    top: 5,
    pipeX: 44,
    pipeY: 42,
    zone: "C",
  },
  {
    id: "b5",
    title: "HOTEL",
    icon: "▤",
    left: 56,
    top: 8,
    pipeX: 56,
    pipeY: 42,
    zone: "C",
  },
  {
    id: "b6",
    title: "CITY HOSPITAL",
    icon: "✚",
    left: 68,
    top: 5,
    pipeX: 68,
    pipeY: 42,
    zone: "C",
  },
  {
    id: "b7",
    title: "MUNICIPAL OFFICE",
    icon: "▥",
    left: 80,
    top: 7,
    pipeX: 80,
    pipeY: 42,
    zone: "B",
  },
  {
    id: "b8",
    title: "SHOPPING MALL",
    icon: "▦",
    left: 92,
    top: 8,
    pipeX: 92,
    pipeY: 42,
    zone: "D",
  },
  {
    id: "b9",
    title: "GOVT SCHOOL",
    icon: "▤",
    left: 20,
    top: 61,
    pipeX: 20,
    pipeY: 74,
    zone: "D",
  },
  {
    id: "b10",
    title: "COLLEGE",
    icon: "▦",
    left: 32,
    top: 62,
    pipeX: 32,
    pipeY: 74,
    zone: "D",
  },
  {
    id: "b11",
    title: "INDUSTRIAL PLANT",
    icon: "▣",
    left: 56,
    top: 61,
    pipeX: 56,
    pipeY: 74,
    zone: "B",
  },
  {
    id: "b12",
    title: "APARTMENTS",
    icon: "▥",
    left: 80,
    top: 62,
    pipeX: 80,
    pipeY: 74,
    zone: "A",
  },
];

/*
 * Four city selection regions.
 * These appear INSIDE the city map instead of
 * creating unwanted Zone A/B/C/D buttons above it.
 */
const cityRegions = [
  {
    id: "A",
    label: "ZONE A",
    className: "region-a",
    left: "2%",
    top: "28%",
    width: "24%",
    height: "30%",
  },
  {
    id: "B",
    label: "ZONE B",
    className: "region-b",
    left: "26%",
    top: "28%",
    width: "24%",
    height: "30%",
  },
  {
    id: "C",
    label: "ZONE C",
    className: "region-c",
    left: "50%",
    top: "28%",
    width: "24%",
    height: "30%",
  },
  {
    id: "D",
    label: "ZONE D",
    className: "region-d",
    left: "74%",
    top: "28%",
    width: "24%",
    height: "30%",
  },
];

const sensors = [
  {
    id: "S-01",
    pressure: "5.4 bar",
    flow: "24 L/min",
    status: "NORMAL",
    location: "Zone A • North Main",
    purpose: "Measures pressure and flow to detect abnormal changes in the main supply line.",
  },
  {
    id: "S-02",
    pressure: "5.2 bar",
    flow: "28 L/min",
    status: "NORMAL",
    location: "Zone B • Industrial Line",
    purpose: "Monitors industrial demand pressure and flow for early leakage detection.",
  },
  {
    id: "S-03",
    pressure: "5.1 bar",
    flow: "31 L/min",
    status: "NORMAL",
    location: "Zone C • Hospital Line",
    purpose: "Monitors the hospital supply line where stable pressure and flow are critical.",
  },
  {
    id: "S-04",
    pressure: "5.3 bar",
    flow: "22 L/min",
    status: "NORMAL",
    location: "Zone D • East Main",
    purpose: "Monitors the eastern main line for pressure drops and unexpected flow loss.",
  },
  {
    id: "S-05",
    pressure: "5.0 bar",
    flow: "19 L/min",
    status: "NORMAL",
    location: "Zone A • South Branch",
    purpose: "Monitors the southern distribution branch for local flow imbalance.",
  },
  {
    id: "S-06",
    pressure: "5.2 bar",
    flow: "26 L/min",
    status: "NORMAL",
    location: "Zone B • Central Branch",
    purpose: "Monitors the central branch feeding commercial and industrial connections.",
  },
  {
    id: "S-07",
    pressure: "5.1 bar",
    flow: "30 L/min",
    status: "NORMAL",
    location: "Zone C • South Branch",
    purpose: "Monitors the southern high-demand branch for pressure and leakage anomalies.",
  },
  {
    id: "S-08",
    pressure: "5.3 bar",
    flow: "21 L/min",
    status: "NORMAL",
    location: "Zone D • East Branch",
    purpose: "Monitors the eastern branch for abnormal pressure and flow conditions.",
  },
];

function App() {
  const undergroundRef = useRef(null);

  const [selectedZone, setSelectedZone] = useState("B");
  const [selectedSegmentId, setSelectedSegmentId] = useState("P-27");
  const [leakActive, setLeakActive] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState(null);

  const selectedZoneData =
    zones.find((zone) => zone.id === selectedZone) || zones[1];

  const selectedSegment =
    citySegments.find((segment) => segment.id === selectedSegmentId) ||
    citySegments[26];

  /*
   * Each zone gets a 12-section underground network.
   * City sections are mapped to the underground sections
   * so the selected city pipe and selected underground
   * pipe always refer to the same monitored network.
   */
  const undergroundSegments = useMemo(() => {
    const zoneSegments = citySegments.filter(
      (segment) => segment.zone === selectedZone
    );

    // Keep one stable underground position for every city section.
    // If a zone has fewer than 12 city sections, the remaining slots stay
    // available visually but do not point to a different/leaking section.
    return Array.from({ length: 12 }, (_, index) => {
      const citySegment = zoneSegments[index] || null;

      return {
        id: `${selectedZone}-${String(index + 1).padStart(2, "0")}`,
        cityId: citySegment?.id || null,
        label: `${selectedZone}-${String(index + 1).padStart(2, "0")}`,
      };
    });
  }, [selectedZone]);

  const selectedUndergroundIndex = Math.max(
    0,
    undergroundSegments.findIndex(
      (segment) => segment.cityId === selectedSegmentId
    )
  );

  const selectZone = (zoneId, shouldScroll = true) => {
    const zoneSegments = citySegments.filter(
      (segment) => segment.zone === zoneId
    );

    const firstSegment = zoneSegments[0];

    setSelectedZone(zoneId);
    setSelectedSegmentId(firstSegment.id);
    setLeakActive(false);
    setSelectedSensor(null);

    if (shouldScroll) {
      setTimeout(() => {
        undergroundRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 80);
    }
  };

  const selectCitySegment = (segmentId) => {
    const segment = citySegments.find((item) => item.id === segmentId);

    if (!segment) {
      return;
    }

    setSelectedSegmentId(segmentId);
    setSelectedZone(segment.zone);
    setLeakActive(false);
    setSelectedSensor(null);

    setTimeout(() => {
      undergroundRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 80);
  };

  const selectUndergroundSegment = (cityId) => {
    const segment = citySegments.find((item) => item.id === cityId);

    if (!segment) {
      return;
    }

    setSelectedSegmentId(cityId);
    setSelectedZone(segment.zone);
    setLeakActive(false);
  };

  const toggleSimulation = () => {
    if (!selectedSegmentId) {
      return;
    }

    setLeakActive((current) => !current);
  };

  const selectSensor = (sensor) => {
    setSelectedSensor(sensor);
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">◇</div>

          <div>
            <h1>AQUATRACE</h1>
            <span>CITY WATER INTELLIGENCE</span>
          </div>
        </div>

        <div className={`top-status ${leakActive ? "danger-status" : ""}`}>
          <span className="status-dot"></span>
          {leakActive ? "LEAK EVENT ACTIVE" : "SYSTEM ONLINE"}
        </div>
      </header>

      <main className="dashboard">
        <div className="dashboard-heading">
          <div>
            <p className="eyebrow">
              DIGITAL TWIN • UNDERGROUND WATER INFRASTRUCTURE
            </p>

            <h2>City Water Network</h2>

            <p>
              Select any city zone or pipeline section and inspect its
              underground network in a live simulation.
            </p>
          </div>

          <div
            className={`network-badge ${
              leakActive ? "danger-badge" : ""
            }`}
          >
            <span></span>
            {leakActive ? "LEAK DETECTED" : "ALL NETWORKS NORMAL"}
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="visual-column">
            {/* ============================================================
                SECTION 1 — CITY VIEW
            ============================================================ */}

            <section className="visual-card city-card">
              <div className="visual-header">
                <div>
                  <span className="section-label">
                    1 • CITY OVERVIEW
                  </span>

                  <h3>Water Distribution Network</h3>
                </div>

                <span className="live">
                  <span></span>
                  LIVE
                </span>
              </div>

              <div className="city-instruction">
                <span className="instruction-number">01</span>

                <div>
                  <strong>Select a city portion or pipeline</strong>

                  <small>
                    Click a zone, building or any blue pipeline section.
                    The selected section will open below.
                  </small>
                </div>

                <div className="selected-zone-pill">
                  PIPE: {selectedSegment.id} • {selectedZoneData.name}
                </div>
              </div>

              <div className="city-scene">
                {/* CITY ROAD NETWORK */}
                <div className="road horizontal road-1"></div>
                <div className="road horizontal road-2"></div>
                <div className="road horizontal road-3"></div>

                <div className="road vertical road-4"></div>
                <div className="road vertical road-5"></div>
                <div className="road vertical road-6"></div>
                <div className="road vertical road-7"></div>

                {/* ZONE BOUNDARIES INSIDE CITY */}
                {cityRegions.map((region) => (
                  <button
                    key={region.id}
                    className={`city-zone-region ${region.className} ${
                      selectedZone === region.id ? "active" : ""
                    }`}
                    style={{
                      left: region.left,
                      top: region.top,
                      width: region.width,
                      height: region.height,
                    }}
                    onClick={() => selectZone(region.id)}
                  >
                    <span>{region.label}</span>
                  </button>
                ))}

                {/* PIPELINE NETWORK */}
                <svg
                  className="city-pipeline-svg"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  aria-label="City water pipeline network"
                >
                  {/* Service connections to buildings */}
                  {cityBuildings.map((building) => (
                    <line
                      key={`service-${building.id}`}
                      className="service-pipe"
                      x1={building.pipeX}
                      y1={building.top + 18}
                      x2={building.pipeX}
                      y2={building.pipeY}
                    />
                  ))}

                  {/* Main 36 selectable sections */}
                  {citySegments.map((segment) => {
                    const isSelected =
                      segment.id === selectedSegmentId;

                    return (
                      <g
                        key={segment.id}
                        className={`city-segment ${
                          isSelected ? "selected" : ""
                        }`}
                        onClick={() =>
                          selectCitySegment(segment.id)
                        }
                      >
                        <line
                          className="segment-hit-area"
                          x1={segment.x1}
                          y1={segment.y1}
                          x2={segment.x2}
                          y2={segment.y2}
                        />

                        <line
                          className="segment-visible-line"
                          x1={segment.x1}
                          y1={segment.y1}
                          x2={segment.x2}
                          y2={segment.y2}
                        />
                      </g>
                    );
                  })}

                  {/* Junctions */}
                  {[
                    [20, 42],
                    [32, 42],
                    [44, 42],
                    [56, 42],
                    [68, 42],
                    [80, 42],
                    [20, 58],
                    [32, 58],
                    [44, 58],
                    [56, 58],
                    [68, 58],
                    [80, 58],
                    [20, 74],
                    [32, 74],
                    [44, 74],
                    [56, 74],
                    [68, 74],
                    [80, 74],
                  ].map(([cx, cy], index) => (
                    <circle
                      key={`junction-${index}`}
                      className="city-junction"
                      cx={cx}
                      cy={cy}
                      r="0.85"
                    />
                  ))}
                </svg>

                {/* BUILDINGS */}
                {cityBuildings.map((building) => (
                  <CityBuilding
                    key={building.id}
                    building={building}
                    selected={selectedZone === building.zone}
                    onClick={() => selectZone(building.zone)}
                  />
                ))}

                {/* RESERVOIR */}
                <div className="city-reservoir">
                  <div className="reservoir-top"></div>
                  <div className="reservoir-water"></div>
                  <span>WATER RESERVOIR</span>
                </div>

                {/* CURRENT PIPE LABEL */}
                <div className="city-selected-pipe">
                  <span>SELECTED</span>
                  <strong>{selectedSegment.id}</strong>
                </div>
              </div>

              <div className="city-bottom-info">
                <div className="network-count">
                  <strong>36</strong>
                  <span>PIPE SECTIONS</span>
                </div>

                <div className="network-count">
                  <strong>12</strong>
                  <span>BUILDINGS</span>
                </div>

                <div className="network-count">
                  <strong>18</strong>
                  <span>JUNCTIONS</span>
                </div>

                <div className="network-count">
                  <strong>8</strong>
                  <span>SENSORS</span>
                </div>

                <div className="city-legend">
                  <div>
                    <i className="legend-pipe"></i>
                    Water Pipeline
                  </div>

                  <div>
                    <i className="legend-junction"></i>
                    Junction
                  </div>

                  <div>
                    <i className="legend-zone"></i>
                    Zone Boundary
                  </div>

                  <div>
                    <i className="legend-reservoir"></i>
                    Reservoir
                  </div>
                </div>
              </div>
            </section>

            {/* ============================================================
                SECTION 2 — UNDERGROUND VIEW
            ============================================================ */}

            <section
              className="visual-card underground-card"
              ref={undergroundRef}
            >
              <div className="visual-header">
                <div>
                  <span className="section-label">
                    2 • UNDERGROUND PIPELINE VIEW
                  </span>

                  <h3>
                    {selectedZoneData.name} • Large-scale pipeline network
                  </h3>

                  <p className="header-subtext">
                    Inspect the selected city pipeline section underground.
                  </p>
                </div>

                <span className="live">
                  <span></span>
                  LIVE
                </span>
              </div>

              <div className="underground-stats">
                <div>
                  <span>INSPECTING</span>
                  <strong>{selectedZoneData.name}</strong>
                </div>

                <div>
                  <span>SELECTED PIPE</span>
                  <strong>{selectedSegment.id}</strong>
                </div>

                <div>
                  <span>TOTAL LENGTH</span>
                  <strong>2.46 km</strong>
                </div>

                <div>
                  <span>SEGMENTS</span>
                  <strong>12</strong>
                </div>

                <div>
                  <span>VALVES</span>
                  <strong>4</strong>
                </div>

                <div>
                  <span>SENSORS</span>
                  <strong>8</strong>
                </div>
              </div>

              <div
                className={`underground-scene ${
                  leakActive ? "leak-active" : ""
                }`}
              >
                <div className="ground-level">
                  <span>GROUND LEVEL</span>
                </div>

                <div className="soil-grid"></div>

                {/* SURFACE BUILDINGS */}
                <div className="surface-buildings">
                  <SurfaceBuilding
                    title="RESIDENTIAL AREA"
                    icon="⌂"
                  />

                  <SurfaceBuilding
                    title="INDUSTRIAL AREA"
                    icon="▣"
                  />

                  <SurfaceBuilding
                    title="HOSPITAL"
                    icon="✚"
                  />

                  <SurfaceBuilding
                    title="SCHOOL"
                    icon="▤"
                  />

                  <SurfaceBuilding
                    title="APARTMENTS"
                    icon="▥"
                  />
                </div>

                {/* SERVICE CONNECTIONS FROM BUILDINGS */}
                <div className="surface-connection connection-1"></div>
                <div className="surface-connection connection-2"></div>
                <div className="surface-connection connection-3"></div>
                <div className="surface-connection connection-4"></div>
                <div className="surface-connection connection-5"></div>

                {/* RESERVOIR */}
                <div className="underground-reservoir">
                  <div className="tank-water"></div>
                  <span>RESERVOIR</span>
                </div>

                {/* SECONDARY PIPELINES */}
                <div className="secondary-pipe secondary-top"></div>
                <div className="secondary-pipe secondary-bottom"></div>

                {/* MAIN PIPELINE */}
                <div className="main-pipeline">
                  {undergroundSegments.map((segment, index) => {
                    const isSelected =
                      segment.cityId === selectedSegmentId;

                    return (
                      <button
                        key={segment.id}
                        className={`underground-segment ${
                          isSelected ? "selected" : ""
                        } ${
                          leakActive && isSelected ? "leaking" : ""
                        }`}
                        onClick={() =>
                          segment.cityId &&
                          selectUndergroundSegment(segment.cityId)
                        }
                      >
                        <span className="segment-number">
                          {segment.label}
                        </span>

                        {isSelected && (
                          <span className="selected-text">
                            SELECTED
                          </span>
                        )}

                        {leakActive && isSelected && (
                          <span className="break-marker">
                            <span className="break-ring"></span>
                            BREAK
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* VALVES */}
                <button className="underground-valve valve-1">
                  V1
                </button>

                <button className="underground-valve valve-2">
                  V2
                </button>

                <button className="underground-valve valve-3">
                  V3
                </button>

                <button className="underground-valve valve-4">
                  V4
                </button>

                {/* SENSORS */}
                <Sensor
                  sensor={sensors[0]}
                  className="sensor-1"
                  selected={selectedSensor?.id === "S-01"}
                  onClick={() => selectSensor(sensors[0])}
                />

                <Sensor
                  sensor={sensors[1]}
                  className="sensor-2"
                  selected={selectedSensor?.id === "S-02"}
                  onClick={() => selectSensor(sensors[1])}
                />

                <Sensor
                  sensor={sensors[2]}
                  className="sensor-3"
                  selected={selectedSensor?.id === "S-03"}
                  onClick={() => selectSensor(sensors[2])}
                />

                <Sensor
                  sensor={sensors[3]}
                  className="sensor-4"
                  selected={selectedSensor?.id === "S-04"}
                  onClick={() => selectSensor(sensors[3])}
                />

                <Sensor
                  sensor={sensors[4]}
                  className="sensor-5"
                  selected={selectedSensor?.id === "S-05"}
                  onClick={() => selectSensor(sensors[4])}
                />

                <Sensor
                  sensor={sensors[5]}
                  className="sensor-6"
                  selected={selectedSensor?.id === "S-06"}
                  onClick={() => selectSensor(sensors[5])}
                />

                <Sensor
                  sensor={sensors[6]}
                  className="sensor-7"
                  selected={selectedSensor?.id === "S-07"}
                  onClick={() => selectSensor(sensors[6])}
                />

                <Sensor
                  sensor={sensors[7]}
                  className="sensor-8"
                  selected={selectedSensor?.id === "S-08"}
                  onClick={() => selectSensor(sensors[7])}
                />

                <div
                  className="flow-marker flow-1"
                  style={{
                    animationDuration: leakActive ? "4.8s" : "3s",
                    opacity: leakActive ? 0.62 : 1,
                  }}
                ></div>
                <div
                  className="flow-marker flow-2"
                  style={{
                    animationDuration: leakActive ? "4.8s" : "3s",
                    opacity: leakActive ? 0.62 : 1,
                  }}
                ></div>
                <div
                  className="flow-marker flow-3"
                  style={{
                    animationDuration: leakActive ? "4.8s" : "3s",
                    opacity: leakActive ? 0.62 : 1,
                  }}
                ></div>
                <div
                  className="flow-marker flow-4"
                  style={{
                    animationDuration: leakActive ? "4.8s" : "3s",
                    opacity: leakActive ? 0.62 : 1,
                  }}
                ></div>
              </div>

              <div className="underground-footer">
                <div className="underground-legend">
                  <div>
                    <i className="legend-main-pipe"></i>
                    Pipeline
                  </div>

                  <div>
                    <i className="legend-valve"></i>
                    Valve
                  </div>

                  <div>
                    <i className="legend-sensor"></i>
                    Sensor
                  </div>

                  <div>
                    <i className="legend-junction"></i>
                    Junction
                  </div>

                  <div>
                    <i className="legend-selected"></i>
                    Selected Segment
                  </div>

                  <div>
                    <i className="legend-break"></i>
                    Leak Detected
                  </div>
                </div>

                <span>
                  Click any underground segment to change the monitored
                  pipeline.
                </span>
              </div>
            </section>
          </div>

          {/* ============================================================
              RIGHT CONTROL PANEL
          ============================================================ */}

          <aside className="control-panel">
            {/* CURRENT INSPECTION */}
            <section
              className={`panel-card selected-card ${
                leakActive ? "alert-card" : ""
              }`}
            >
              <span className="section-label">
                CURRENT INSPECTION
              </span>

              <div className="inspection-title">
                <div>
                  <h3>{selectedZoneData.name}</h3>

                  <p>
                    Pipeline section {selectedSegment.id}
                  </p>
                </div>

                <div className={`zone-circle zone-${selectedZone}`}>
                  {selectedZone}
                </div>
              </div>

              <div className="inspection-meta">
                <span>Demand</span>
                <strong>{selectedZoneData.demand}</strong>
              </div>

              <div className="inspection-description">
                {selectedZoneData.description}
              </div>
            </section>

            {/* CITY ZONES */}
            <section className="panel-card">
              <span className="section-label">CITY ZONES</span>

              <div className="zone-list">
                {zones.map((zone) => (
                  <button
                    key={zone.id}
                    className={`zone-row ${
                      selectedZone === zone.id ? "active" : ""
                    }`}
                    onClick={() => selectZone(zone.id)}
                  >
                    <div>
                      <span className={`zone-dot ${zone.color}`}></span>
                      <strong>{zone.name}</strong>
                    </div>

                    <small>{zone.demand}</small>
                  </button>
                ))}
              </div>
            </section>

            {/* TELEMETRY */}
            <section className="panel-card">
              <div className="telemetry-heading">
                <div>
                  <span className="section-label">
                    LIVE MONITORING
                  </span>

                  <h3>Network Telemetry</h3>
                </div>

                <span className="live">
                  <span></span>
                  LIVE
                </span>
              </div>

              <Metric
                label="NETWORK PRESSURE"
                value={leakActive ? "2.8" : "5.2"}
                unit="bar"
                width={leakActive ? "45%" : "82%"}
                danger={leakActive}
              />

              <Metric
                label="FLOW RATE"
                value={leakActive ? "62" : "100"}
                unit="L/min"
                width={leakActive ? "48%" : "76%"}
                danger={leakActive}
              />

              <Metric
                label="WATER LOSS"
                value={leakActive ? "38" : "0"}
                unit="L/min"
                width={leakActive ? "64%" : "0%"}
                danger={leakActive}
              />

              <div
                className={`normal-box ${
                  leakActive ? "alert-box" : ""
                }`}
              >
                <span></span>

                <div>
                  <small>NETWORK STATUS</small>

                  <strong>
                    {leakActive ? "LEAK DETECTED" : "NORMAL"}
                  </strong>
                </div>
              </div>

              <button
                className="break-button"
                onClick={toggleSimulation}
              >
                {leakActive
                  ? "↺ RESET SIMULATION"
                  : "⚡ SIMULATE PIPE BREAK"}
              </button>

              <p className="simulation-text">
                {leakActive
                  ? `Leak detected at selected section ${selectedSegment.id}.`
                  : `Break the selected section ${selectedSegment.id} to simulate leakage.`}
              </p>
            </section>

            {/* SENSOR DETAILS */}
            {selectedSensor && (
              <section className="panel-card sensor-detail-card">
                <div className="sensor-detail-heading">
                  <div>
                    <span className="section-label">
                      SENSOR DETAILS
                    </span>

                    <h3>{selectedSensor.id}</h3>
                  </div>

                  <button
                    className="close-sensor"
                    onClick={() => setSelectedSensor(null)}
                  >
                    ×
                  </button>
                </div>

                <div className="sensor-status-line">
                  <span></span>
                  {selectedSensor.status}
                </div>

                <div className="sensor-location">
                  {selectedSensor.location}
                </div>

                <div className="sensor-purpose-inline">
                  <small>USED FOR</small>
                  <strong>{selectedSensor.purpose}</strong>
                </div>

                <div className="sensor-detail-grid">
                  <div>
                    <small>PRESSURE</small>
                    <strong>{selectedSensor.pressure}</strong>
                  </div>

                  <div>
                    <small>FLOW</small>
                    <strong>{selectedSensor.flow}</strong>
                  </div>
                </div>
              </section>
            )}

            {/* AUTOMATED RESPONSE */}
            {leakActive && (
              <section className="panel-card detection-card">
                <span className="section-label">
                  AUTOMATED RESPONSE
                </span>

                <div className="detection-header">
                  <div className="warning-symbol">!</div>

                  <div>
                    <h3>Leak located</h3>

                    <p>
                      {selectedZoneData.name} •{" "}
                      {selectedSegment.id}
                    </p>
                  </div>
                </div>

                <div className="response-step">
                  <span>01</span>

                  <div>
                    <strong>Compare telemetry</strong>
                    <small>
                      Pressure drop + flow imbalance
                    </small>
                  </div>
                </div>

                <div className="response-step">
                  <span>02</span>

                  <div>
                    <strong>Locate abnormal section</strong>
                    <small>
                      Selected pipeline section identified
                    </small>
                  </div>
                </div>

                <div className="response-action">
                  <small>RECOMMENDED ACTION</small>

                  <strong>
                    Close{" "}
                    {selectedZone === "A"
                      ? "V1"
                      : selectedZone === "B"
                      ? "V2"
                      : selectedZone === "C"
                      ? "V3"
                      : "V4"}
                  </strong>
                </div>
              </section>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}

function CityBuilding({ building, selected, onClick }) {
  return (
    <button
      className={`city-building ${
        selected ? "building-selected" : ""
      }`}
      style={{
        left: `${building.left}%`,
        top: `${building.top}%`,
      }}
      onClick={onClick}
      title={`Select ${building.title}`}
    >
      <div className="building-body">
        <div className="building-roof"></div>

        <div className="building-windows"></div>

        <div className="building-icon">{building.icon}</div>
      </div>

      <span>{building.title}</span>
    </button>
  );
}

function SurfaceBuilding({ title, icon }) {
  return (
    <div className="surface-building">
      <div className="surface-body">
        <div className="surface-roof"></div>

        <div className="surface-windows"></div>

        <div className="surface-icon">{icon}</div>
      </div>

      <span>{title}</span>
    </div>
  );
}

function Sensor({ sensor, className, selected, onClick }) {
  return (
    <button
      type="button"
      className={`sensor ${className} ${
        selected ? "sensor-selected" : ""
      }`}
      onClick={onClick}
      title={`View ${sensor.id} details`}
      aria-label={`View ${sensor.id} details`}
    >
      <span></span>
      <label>{sensor.id}</label>
    </button>
  );
}

function Metric({
  label,
  value,
  unit,
  width,
  danger,
}) {
  return (
    <div className={`metric ${danger ? "danger-metric" : ""}`}>
      <div className="metric-heading">
        <span>{label}</span>

        <strong>
          {value} <small>{unit}</small>
        </strong>
      </div>

      <div className="metric-track">
        <div
          className="metric-value"
          style={{ width }}
        ></div>
      </div>
    </div>
  );
}

export default App;