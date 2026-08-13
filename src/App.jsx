import { useMemo, useRef, useState, useCallback, useEffect } from "react";
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
  const [closedValves, setClosedValves] = useState({
    V1: "open",
    V2: "open",
    V3: "open",
    V4: "open",
  });
  const [pumpClosed, setPumpClosed] = useState(false);
  const [auxiliaryActive, setAuxiliaryActive] = useState(false);
  const [logs, setLogs] = useState([
    { id: "init", timestamp: new Date().toLocaleTimeString(), message: "SCADA water intelligence twin initialized. System online.", type: "success" }
  ]);

  const [sensorHistory, setSensorHistory] = useState(() => {
    const initialHistory = {};
    sensors.forEach((s) => {
      const baseP = parseFloat(s.pressure) || 5.0;
      const baseF = parseFloat(s.flow) || 20.0;
      initialHistory[s.id] = Array.from({ length: 15 }, () => ({
        pressure: baseP,
        flow: baseF,
      }));
    });
    return initialHistory;
  });

  const addLog = useCallback((message, type = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [
      { id: Math.random().toString(), timestamp, message, type },
      ...prev.slice(0, 49),
    ]);
  }, []);

  const toggleValve = (valveId) => {
    setClosedValves((prev) => {
      const currentState = prev[valveId];
      if (currentState === "closed") {
        addLog(`Command sent: OPEN ${valveId}. Initiating actuator opening sequence...`, "info");
        return { ...prev, [valveId]: "open" };
      } else if (currentState === "open") {
        addLog(`Command sent: CLOSE ${valveId}. Valve actuator is closing...`, "warning");
        
        setTimeout(() => {
          setClosedValves((latest) => {
            if (latest[valveId] === "closing") {
              addLog(`Event: ${valveId} fully CLOSED. Downstream flow isolated.`, "success");
              return { ...latest, [valveId]: "closed" };
            }
            return latest;
          });
        }, 1500);

        return { ...prev, [valveId]: "closing" };
      }
      return prev;
    });
  };

  const getSegmentPressureFactor = (index) => {
    if (pumpClosed && !auxiliaryActive) return 0;
    
    const v1 = closedValves.V1;
    const v2 = closedValves.V2;
    const v3 = closedValves.V3;
    const v4 = closedValves.V4;

    // If pump is offline but auxiliary pump is active:
    if (pumpClosed && auxiliaryActive) {
      if (index >= 3 && v1 === "closed") return 0;
      if (index >= 6 && v2 === "closed") return 0;
      if (index >= 8 && v3 === "closed") return 0;
      if (index >= 10 && v4 === "closed") return 0;
      return 0.35;
    }

    // Main pump is online
    if (index >= 3 && index < 6 && v1 === "closed") return 0;
    if (index >= 6 && index < 8 && v2 === "closed") return 0;
    if (index >= 8 && index < 10 && v3 === "closed") return 0;
    if (index >= 10 && index < 12 && v4 === "closed") return 0;

    if (index >= 3 && index < 6 && v1 === "closing") return 0.4;
    if (index >= 6 && index < 8 && v2 === "closing") return 0.4;
    if (index >= 8 && index < 10 && v3 === "closing") return 0.4;
    if (index >= 10 && index < 12 && v4 === "closing") return 0.4;

    // Grid loop bypass calculation
    let multiplier = 1.0;
    if (index >= 6 && v1 === "closed") multiplier *= 0.65;
    if (index >= 8 && (v1 === "closed" || v2 === "closed")) multiplier *= 0.65;
    if (index >= 10 && (v1 === "closed" || v2 === "closed" || v3 === "closed")) multiplier *= 0.65;

    return multiplier;
  };

  const isSegmentPressurized = (index) => {
    return getSegmentPressureFactor(index) > 0.1;
  };

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

  const metrics = useMemo(() => {
    const leakIndex = selectedUndergroundIndex;
    const pressureFactor = getSegmentPressureFactor(leakIndex);
    const isLeaking = leakActive && pressureFactor > 0.05;

    if (pumpClosed) {
      if (auxiliaryActive) {
        if (isLeaking) {
          const loss = Math.round(38 * 0.35);
          const pressure = 1.8;
          const flow = 40;
          return {
            pressure,
            flowRate: flow,
            waterLoss: loss,
            status: "AUXILIARY FLOW - LEAK ACTIVE",
            statusClass: "danger-badge",
            pressureWidth: `${(pressure / 6) * 100}%`,
            flowWidth: `${(flow / 120) * 100}%`,
            lossWidth: `${(loss / 60) * 100}%`,
          };
        }

        return {
          pressure: 1.8,
          flowRate: 35,
          waterLoss: 0,
          status: "AUXILIARY FLOW ACTIVE",
          statusClass: "network-badge",
          pressureWidth: "30%",
          flowWidth: "29%",
          lossWidth: "0%",
        };
      }

      return {
        pressure: 0.0,
        flowRate: 0,
        waterLoss: 0,
        status: "PUMP OFFLINE",
        statusClass: "danger-badge",
        pressureWidth: "0%",
        flowWidth: "0%",
        lossWidth: "0%",
      };
    }

    if (isLeaking) {
      const loss = Math.round(38 * pressureFactor);
      const pressure = parseFloat((2.8 + 2.4 * (1.0 - pressureFactor)).toFixed(1));
      const flow = Math.round(62 + 38 * (1.0 - pressureFactor));
      
      const statusText = pressureFactor < 0.5 ? "LEAK ISOLATING..." : "LEAK DETECTED";
      const statusClass = pressureFactor < 0.5 ? "network-badge" : "danger-badge";

      return {
        pressure,
        flowRate: flow,
        waterLoss: loss,
        status: statusText,
        statusClass,
        pressureWidth: `${(pressure / 6) * 100}%`,
        flowWidth: `${(flow / 120) * 100}%`,
        lossWidth: `${(loss / 60) * 100}%`,
      };
    }

    // No active leak or leak is isolated
    const isLeakIsolated = leakActive && pressureFactor <= 0.05;
    const anyValveClosedOrClosing = 
      closedValves.V1 !== "open" || 
      closedValves.V2 !== "open" || 
      closedValves.V3 !== "open" || 
      closedValves.V4 !== "open";

    if (isLeakIsolated) {
      return {
        pressure: 5.4,
        flowRate: 30,
        waterLoss: 0,
        status: "LEAK ISOLATED (SAFE)",
        statusClass: "network-badge",
        pressureWidth: "85%",
        flowWidth: "30%",
        lossWidth: "0%",
      };
    }

    if (anyValveClosedOrClosing) {
      let flow = 100;
      let statusText = "MAINTENANCE ACTIVE";
      
      const isClosing = 
        closedValves.V1 === "closing" || 
        closedValves.V2 === "closing" || 
        closedValves.V3 === "closing" || 
        closedValves.V4 === "closing";
      
      if (isClosing) {
        statusText = "VALVE ACTUATING...";
      }

      if (closedValves.V1 === "closed" || closedValves.V1 === "closing") {
        flow = closedValves.V1 === "closing" ? 70 : 25;
      } else if (closedValves.V2 === "closed" || closedValves.V2 === "closing") {
        flow = closedValves.V2 === "closing" ? 80 : 50;
      } else if (closedValves.V3 === "closed" || closedValves.V3 === "closing") {
        flow = closedValves.V3 === "closing" ? 90 : 75;
      } else if (closedValves.V4 === "closed" || closedValves.V4 === "closing") {
        flow = closedValves.V4 === "closing" ? 95 : 90;
      }

      return {
        pressure: 5.5,
        flowRate: flow,
        waterLoss: 0,
        status: statusText,
        statusClass: "network-badge",
        pressureWidth: "88%",
        flowWidth: `${flow}%`,
        lossWidth: "0%",
      };
    }

    // Normal state
    return {
      pressure: 5.2,
      flowRate: 100,
      waterLoss: 0,
      status: "ALL NETWORKS NORMAL",
      statusClass: "network-badge",
      pressureWidth: "82%",
      flowWidth: "76%",
      lossWidth: "0%",
    };
  }, [pumpClosed, auxiliaryActive, leakActive, selectedUndergroundIndex, closedValves]);

  const selectZone = (zoneId, shouldScroll = true) => {
    const zoneSegments = citySegments.filter(
      (segment) => segment.zone === zoneId
    );

    const firstSegment = zoneSegments[0];

    setSelectedZone(zoneId);
    setSelectedSegmentId(firstSegment.id);
    setLeakActive(false);
    setSelectedSensor(null);
    setClosedValves({ V1: "open", V2: "open", V3: "open", V4: "open" });
    setPumpClosed(false);

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
    setClosedValves({ V1: "open", V2: "open", V3: "open", V4: "open" });
    setPumpClosed(false);

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
    setClosedValves({ V1: "open", V2: "open", V3: "open", V4: "open" });
    setPumpClosed(false);
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

  const handleRecommendedAction = () => {
    if (selectedUndergroundIndex < 3) {
      setPumpClosed(true);
    } else {
      const valve = selectedUndergroundIndex < 6 ? "V1" : selectedUndergroundIndex < 8 ? "V2" : selectedUndergroundIndex < 10 ? "V3" : "V4";
      toggleValve(valve);
    }
  };

  const isFlow1Active = !pumpClosed && (!leakActive || selectedUndergroundIndex >= 3 || !isSegmentPressurized(selectedUndergroundIndex));
  const isFlow2Active = !pumpClosed && closedValves.V1 !== "closed" && (!leakActive || selectedUndergroundIndex >= 6 || !isSegmentPressurized(selectedUndergroundIndex));
  const isFlow3Active = !pumpClosed && closedValves.V1 !== "closed" && closedValves.V2 !== "closed" && (!leakActive || selectedUndergroundIndex >= 8 || !isSegmentPressurized(selectedUndergroundIndex));
  const isFlow4Active = !pumpClosed && closedValves.V1 !== "closed" && closedValves.V2 !== "closed" && closedValves.V3 !== "closed" && (!leakActive || selectedUndergroundIndex >= 10 || !isSegmentPressurized(selectedUndergroundIndex));

  const getFlowStyle = (markerId) => {
    let active = true;
    let closing = false;
    
    if (markerId === 1) {
      active = isFlow1Active;
    } else if (markerId === 2) {
      active = isFlow2Active;
      closing = closedValves.V1 === "closing";
    } else if (markerId === 3) {
      active = isFlow3Active;
      closing = closedValves.V1 === "closing" || closedValves.V2 === "closing";
    } else if (markerId === 4) {
      active = isFlow4Active;
      closing = closedValves.V1 === "closing" || closedValves.V2 === "closing" || closedValves.V3 === "closing";
    }

    if (!active) return { opacity: 0, transition: "opacity 0.4s ease" };
    
    const baseDuration = leakActive ? 4.8 : 3.0;
    const duration = closing ? baseDuration * 2.0 : baseDuration;
    const opacity = closing ? 0.25 : (leakActive ? 0.62 : 1.0);

    return {
      animationDuration: `${duration}s`,
      opacity,
      transition: "opacity 0.4s ease, background 0.4s ease"
    };
  };

  const isFirstPumpLog = useRef(true);
  useEffect(() => {
    if (isFirstPumpLog.current) {
      isFirstPumpLog.current = false;
      return;
    }
    if (pumpClosed) {
      addLog(`ALERT: Reservoir Main Pump shut down. System pressure dropping.`, "danger");
      addLog(`System: Attempting emergency reroute to Auxiliary Supply...`, "warning");
      const timer = setTimeout(() => {
        setAuxiliaryActive(true);
        addLog(`Event: Auxiliary Gravity Bypass online. Flow secured for critical zones.`, "success");
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      addLog(`Event: Reservoir Main Pump online. System pressure building up.`, "success");
      setAuxiliaryActive(false);
    }
  }, [pumpClosed, addLog]);

  const isFirstLeakLog = useRef(true);
  useEffect(() => {
    if (isFirstLeakLog.current) {
      isFirstLeakLog.current = false;
      return;
    }
    if (leakActive) {
      addLog(`ALERT: Water pipe rupture detected at ${selectedZoneData.name} • Section ${selectedSegment.id}!`, "danger");
      addLog(`System: Automated leak-isolation sequence initiated.`, "warning");
      
      const timer = setTimeout(() => {
        if (selectedUndergroundIndex < 3) {
          setPumpClosed(true);
          addLog(`Auto-Response: Isolating rupture. Command sent: Shutdown Main Pump.`, "warning");
        } else {
          const valve = selectedUndergroundIndex < 6 ? "V1" : selectedUndergroundIndex < 8 ? "V2" : selectedUndergroundIndex < 10 ? "V3" : "V4";
          addLog(`Auto-Response: Isolating rupture. Command sent: Close ${valve}.`, "warning");
          toggleValve(valve);
        }
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      addLog(`Event: Rupture simulation reset. Restoring water distribution network.`, "info");
      setClosedValves({ V1: "open", V2: "open", V3: "open", V4: "open" });
      setPumpClosed(false);
    }
  }, [leakActive, selectedSegmentId, selectedUndergroundIndex, selectedZoneData.name, selectedSegment.id, addLog]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSensorHistory((prev) => {
        const next = { ...prev };
        sensors.forEach((s) => {
          const history = prev[s.id] || [];
          let pressure = parseFloat(s.pressure);
          let flow = parseFloat(s.flow);

          const sensorZone = s.id === "S-01" || s.id === "S-05" ? "A" :
                             s.id === "S-02" || s.id === "S-06" ? "B" :
                             s.id === "S-03" || s.id === "S-07" ? "C" : "D";

          const leakIndex = selectedUndergroundIndex;
          const isZoneLeaking = leakActive && selectedZone === sensorZone && getSegmentPressureFactor(leakIndex) > 0.05;

          if (pumpClosed) {
            pressure = 0;
            flow = 0;
          } else {
            const noiseP = (Math.random() - 0.5) * 0.12;
            const noiseF = (Math.random() - 0.5) * 0.8;
            
            if (isZoneLeaking) {
              const pressureFactor = getSegmentPressureFactor(leakIndex);
              pressure = Math.max(0.2, (pressure * 0.45) * pressureFactor + noiseP);
              flow = Math.max(0.0, (flow * 1.5) * pressureFactor + noiseF);
            } else {
              let pressurized = true;
              if (sensorZone === "B" && closedValves.V1 === "closed") pressurized = false;
              if (sensorZone === "C" && (closedValves.V1 === "closed" || closedValves.V2 === "closed")) pressurized = false;
              if (sensorZone === "D" && (closedValves.V1 === "closed" || closedValves.V2 === "closed" || closedValves.V3 === "closed")) pressurized = false;
              
              if (!pressurized) {
                pressure = 0;
                flow = 0;
              } else {
                pressure = pressure + noiseP;
                flow = flow + noiseF;
              }
            }
          }

          const newPoint = {
            pressure: parseFloat(pressure.toFixed(2)),
            flow: parseFloat(flow.toFixed(1)),
          };

          next[s.id] = [...history.slice(1), newPoint];
        });
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [pumpClosed, leakActive, selectedUndergroundIndex, selectedZone, closedValves]);

  const getSparklinePath = (points, type) => {
    if (!points || points.length === 0) return "";
    const maxVal = type === "pressure" ? 6 : 45;
    const coords = points.map((p, i) => {
      const val = type === "pressure" ? p.pressure : p.flow;
      const x = (i / 14) * 240;
      const y = 50 - Math.min(1.0, Math.max(0.0, val / maxVal)) * 42 - 4;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return `M ${coords.join(" L ")}`;
  };
  
  const getSparklineAreaPath = (points, type) => {
    const linePath = getSparklinePath(points, type);
    if (!linePath) return "";
    return `${linePath} L 240,50 L 0,50 Z`;
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

        <div className={`top-status ${metrics.statusClass === "danger-badge" ? "danger-status" : ""}`}>
          <span className="status-dot"></span>
          {metrics.status}
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

          <div className={`network-badge ${metrics.statusClass}`}>
            <span></span>
            {metrics.status}
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
                <button
                  className={`underground-reservoir ${pumpClosed ? "pump-closed" : ""}`}
                  onClick={() => setPumpClosed(!pumpClosed)}
                  title={`Click to ${pumpClosed ? "Start" : "Stop"} Reservoir Pump`}
                  style={{ background: "transparent", border: 0, cursor: "pointer", padding: 0 }}
                >
                  <div className="tank-water" style={{ height: pumpClosed ? "0px" : "32px", transition: "height 0.5s ease" }}></div>
                  <span style={{ color: pumpClosed ? "#ff6258" : "#71899a", transition: "color 0.3s ease" }}>
                    {pumpClosed ? "PUMP OFFLINE" : "RESERVOIR"}
                  </span>
                </button>

                {/* SECONDARY PIPELINES */}
                <div className={`secondary-pipe secondary-top ${(closedValves.V1 !== "open" || closedValves.V2 !== "open" || closedValves.V3 !== "open" || auxiliaryActive) ? "bypass-active" : ""}`}></div>
                <div className={`secondary-pipe secondary-bottom ${(closedValves.V1 !== "open" || closedValves.V2 !== "open" || closedValves.V3 !== "open" || auxiliaryActive) ? "bypass-active" : ""}`}></div>

                {/* MAIN PIPELINE */}
                <div className={`main-pipeline ${
                  pumpClosed && !auxiliaryActive
                    ? "pipeline-offline" 
                    : leakActive 
                      ? isSegmentPressurized(selectedUndergroundIndex) 
                        ? "pipeline-ruptured" 
                        : "pipeline-isolated" 
                      : ""
                }`}>
                  {undergroundSegments.map((segment, index) => {
                    const isSelected =
                      segment.cityId === selectedSegmentId;
                    const isLeaking = leakActive && isSelected;
                    const isPressurized = isSegmentPressurized(index);

                    return (
                      <button
                        key={segment.id}
                        className={`underground-segment ${
                          isSelected ? "selected" : ""
                        } ${
                          isLeaking && isPressurized ? "leaking" : ""
                        } ${
                          isLeaking && !isPressurized ? "isolated-leak" : ""
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

                        {isLeaking && (
                          <span className="break-marker">
                            <span className="break-ring" style={{
                              borderColor: isPressurized ? "#ff6258" : "#ffad33",
                              boxShadow: isPressurized 
                                ? "0 0 10px rgba(255, 77, 67, 0.8), 0 0 24px rgba(255, 77, 67, 0.35)"
                                : "0 0 10px rgba(255, 173, 51, 0.8), 0 0 24px rgba(255, 173, 51, 0.35)"
                            }}></span>
                            {isPressurized ? "BREAK" : "ISOLATED"}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* DYNAMIC LEAK SPRAY & SOIL SATURATION */}
                {leakActive && isSegmentPressurized(selectedUndergroundIndex) && (
                  <>
                    <div className="wet-soil-glow" style={{ left: `${7 + (selectedUndergroundIndex + 0.5) * (86 / 12)}%`, top: "59%" }}></div>
                    <div className="water-spray" style={{ left: `${7 + (selectedUndergroundIndex + 0.5) * (86 / 12)}%`, top: "59%" }}>
                      <div className="spray-geyser"></div>
                      <div className="spray-stream up-left"></div>
                      <div className="spray-stream up-right"></div>
                      <div className="spray-stream down-left"></div>
                      <div className="spray-stream down-right"></div>
                      <div className="droplet"></div>
                      <div className="droplet"></div>
                      <div className="droplet"></div>
                      <div className="droplet"></div>
                      <div className="droplet"></div>
                      <div className="droplet"></div>
                      <div className="droplet"></div>
                    </div>
                  </>
                )}

                {/* VALVES */}
                <button
                  className={`underground-valve valve-1 ${closedValves.V1 ? "closed" : ""}`}
                  onClick={() => toggleValve("V1")}
                  title={`Click to ${closedValves.V1 ? "Open" : "Close"} Valve 1`}
                >
                  <span style={{ transform: "rotate(-45deg)", display: "block" }}>V1</span>
                </button>

                <button
                  className={`underground-valve valve-2 ${closedValves.V2 ? "closed" : ""}`}
                  onClick={() => toggleValve("V2")}
                  title={`Click to ${closedValves.V2 ? "Open" : "Close"} Valve 2`}
                >
                  <span style={{ transform: "rotate(-45deg)", display: "block" }}>V2</span>
                </button>

                <button
                  className={`underground-valve valve-3 ${closedValves.V3 ? "closed" : ""}`}
                  onClick={() => toggleValve("V3")}
                  title={`Click to ${closedValves.V3 ? "Open" : "Close"} Valve 3`}
                >
                  <span style={{ transform: "rotate(-45deg)", display: "block" }}>V3</span>
                </button>

                <button
                  className={`underground-valve valve-4 ${closedValves.V4 ? "closed" : ""}`}
                  onClick={() => toggleValve("V4")}
                  title={`Click to ${closedValves.V4 ? "Open" : "Close"} Valve 4`}
                >
                  <span style={{ transform: "rotate(-45deg)", display: "block" }}>V4</span>
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
                  style={getFlowStyle(1)}
                ></div>
                <div
                  className="flow-marker flow-2"
                  style={getFlowStyle(2)}
                ></div>
                <div
                  className="flow-marker flow-3"
                  style={getFlowStyle(3)}
                ></div>
                <div
                  className="flow-marker flow-4"
                  style={getFlowStyle(4)}
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

            {/* ============================================================
                SECTION 3 — SCADA EVENT LOG CONSOLE
            ============================================================ */}
            <section className="visual-card scada-console-card">
              <div className="visual-header">
                <div>
                  <span className="section-label">
                    3 • SCADA NETWORK SYSTEM LOGS
                  </span>
                  <h3>Event Audit Trail</h3>
                </div>
                <button
                  className="close-sensor"
                  onClick={() => setLogs([{ id: "clear", timestamp: new Date().toLocaleTimeString(), message: "SCADA Event Log cleared by Operator.", type: "info" }])}
                  title="Clear Logs"
                  style={{ fontSize: "10px", padding: "0 10px", width: "auto", height: "24px" }}
                >
                  CLEAR
                </button>
              </div>

              <div className="scada-log-terminal">
                <div className="terminal-header">
                  <span className="terminal-dot red"></span>
                  <span className="terminal-dot yellow"></span>
                  <span className="terminal-dot green"></span>
                  <span className="terminal-title">operator@scada-server:~</span>
                </div>
                <div className="terminal-body">
                  {logs.map((log) => (
                    <div key={log.id} className={`terminal-row log-${log.type}`}>
                      <span className="log-time">[{log.timestamp}]</span>
                      <span className="log-text">{log.message}</span>
                    </div>
                  ))}
                </div>
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
                value={metrics.pressure.toFixed(1)}
                unit="bar"
                width={metrics.pressureWidth}
                danger={metrics.pressure < 4.0 && !pumpClosed}
              />

              <Metric
                label="FLOW RATE"
                value={metrics.flowRate}
                unit="L/min"
                width={metrics.flowWidth}
                danger={metrics.flowRate < 70 && !pumpClosed}
              />

              <Metric
                label="WATER LOSS"
                value={metrics.waterLoss}
                unit="L/min"
                width={metrics.lossWidth}
                danger={metrics.waterLoss > 0}
              />

              <div
                className={`normal-box ${
                  metrics.statusClass === "danger-badge" ? "alert-box" : ""
                }`}
              >
                <span></span>

                <div>
                  <small>NETWORK STATUS</small>

                  <strong>
                    {metrics.status}
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
                  ? isSegmentPressurized(selectedUndergroundIndex)
                    ? `Leak detected at selected section ${selectedSegment.id}.`
                    : `Leak at section ${selectedSegment.id} has been isolated by shutting off the upstream valve.`
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
                    <strong style={{ fontSize: "16px" }}>
                      {sensorHistory[selectedSensor.id] 
                        ? `${sensorHistory[selectedSensor.id][14].pressure.toFixed(2)} bar`
                        : selectedSensor.pressure}
                    </strong>
                    
                    {/* SVG Sparkline for Pressure */}
                    <div className="sensor-sparkline" style={{ marginTop: "10px", height: "45px" }}>
                      <svg viewBox="0 0 240 50" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
                        <defs>
                          <linearGradient id="pressure-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2ccaff" stopOpacity="0.2"/>
                            <stop offset="100%" stopColor="#2ccaff" stopOpacity="0"/>
                          </linearGradient>
                        </defs>
                        <path 
                          d={getSparklineAreaPath(sensorHistory[selectedSensor.id], "pressure")} 
                          fill="url(#pressure-grad)" 
                        />
                        <path 
                          d={getSparklinePath(sensorHistory[selectedSensor.id], "pressure")} 
                          fill="none" 
                          stroke="#2ccaff" 
                          strokeWidth="2" 
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>

                  <div>
                    <small>FLOW</small>
                    <strong style={{ fontSize: "16px" }}>
                      {sensorHistory[selectedSensor.id]
                        ? `${sensorHistory[selectedSensor.id][14].flow.toFixed(1)} L/min`
                        : selectedSensor.flow}
                    </strong>

                    {/* SVG Sparkline for Flow */}
                    <div className="sensor-sparkline" style={{ marginTop: "10px", height: "45px" }}>
                      <svg viewBox="0 0 240 50" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
                        <defs>
                          <linearGradient id="flow-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#35df99" stopOpacity="0.2"/>
                            <stop offset="100%" stopColor="#35df99" stopOpacity="0"/>
                          </linearGradient>
                        </defs>
                        <path 
                          d={getSparklineAreaPath(sensorHistory[selectedSensor.id], "flow")} 
                          fill="url(#flow-grad)" 
                        />
                        <path 
                          d={getSparklinePath(sensorHistory[selectedSensor.id], "flow")} 
                          fill="none" 
                          stroke="#35df99" 
                          strokeWidth="2" 
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* AUTOMATED RESPONSE */}
            {leakActive && isSegmentPressurized(selectedUndergroundIndex) && (
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

                <button
                  className="response-action"
                  onClick={handleRecommendedAction}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    border: "1px solid rgba(255, 94, 80, 0.16)",
                    background: "rgba(255, 70, 60, 0.04)",
                    borderRadius: "10px",
                    padding: "12px",
                    marginTop: "18px",
                    display: "block"
                  }}
                >
                  <small style={{ display: "block", color: "#866361", fontSize: "6px", fontWeight: "800", letterSpacing: "0.1em" }}>
                    EXECUTE RECOMMENDED ACTION
                  </small>

                  <strong style={{ display: "block", marginTop: "5px", color: "#ff796e", fontSize: "12px" }}>
                    {selectedUndergroundIndex < 3 ? "Shutdown Pump" : `Close ${selectedUndergroundIndex < 6 ? "V1" : selectedUndergroundIndex < 8 ? "V2" : selectedUndergroundIndex < 10 ? "V3" : "V4"}`}
                  </strong>
                </button>
              </section>
            )}

            {/* AUTOMATED RESPONSE SUCCESS */}
            {leakActive && !isSegmentPressurized(selectedUndergroundIndex) && (
              <section
                className="panel-card detection-card"
                style={{
                  borderColor: "rgba(48, 220, 148, 0.35)",
                  background: "linear-gradient(180deg, rgba(14, 42, 28, 0.95), rgba(10, 19, 29, 0.95))"
                }}
              >
                <span className="section-label" style={{ color: "#5ee0aa" }}>
                  AUTOMATED RESPONSE COMPLETE
                </span>

                <div className="detection-header">
                  <div
                    className="warning-symbol"
                    style={{
                      color: "#32db98",
                      borderColor: "rgba(48, 220, 148, 0.35)",
                      background: "rgba(48, 220, 148, 0.08)"
                    }}
                  >
                    ✓
                  </div>

                  <div>
                    <h3 style={{ color: "#dff0d4" }}>Leak Isolated</h3>

                    <p style={{ color: "#658c70" }}>
                      {selectedZoneData.name} •{" "}
                      {selectedSegment.id}
                    </p>
                  </div>
                </div>

                <div
                  className="response-action"
                  style={{
                    borderColor: "rgba(48, 220, 148, 0.2)",
                    background: "rgba(48, 220, 148, 0.04)"
                  }}
                >
                  <small style={{ color: "#61866b", display: "block", fontSize: "6px", fontWeight: "800", letterSpacing: "0.1em" }}>
                    STATUS
                  </small>

                  <strong style={{ color: "#32db98", display: "block", marginTop: "5px", fontSize: "12px" }}>
                    Section Isolated Successfully
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