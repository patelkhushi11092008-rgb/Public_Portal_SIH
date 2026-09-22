import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_PROJECTS, MOCK_FOUR_TIER_SAMPLE } from '../constants/mockData';

const ObservationContext = createContext(null);

const STORAGE_KEY = 'jannirikshan_citizen_observations';

// Seed observations from mock data
const INITIAL_OBSERVATIONS = [
  {
    id: 'JN-OBS-2025-9942',
    projectId: 'JN-2025-FL-042',
    projectName: 'Sector 62 Elevated Corridor & Underpass',
    category: 'Work Inactivity / Delay',
    observedWorkStatus: 'WORK_STOPPED',
    submittedBy: 'Resident (Ward 14-B Citizen Contributor)',
    reporterType: 'Local Resident',
    timestamp: '2025-02-18 04:45 PM',
    location: 'Pillar 18, Opp. Metro Gate 3, Sector 62',
    coordinates: {
      latitude: 28.6280,
      longitude: 77.3670,
      accuracy: '±12m',
    },
    content: 'Work has been idle for 6 consecutive days. Barricading damaged near Pillar 18 causing traffic bottlenecks. Construction machinery parked without active labor.',
    workerCountEstimate: '0 workers (Site idle)',
    machineryPresent: ['Crane (Stationary)', 'Excavator (Parked)'],
    photos: [
      {
        url: '',
        caption: 'Geo-tagged camera evidence showing unoccupied crane and broken safety netting near Pillar 18.',
        name: 'site_evidence_p18.jpg',
        size: '2.4 MB',
      },
    ],
    photoCaption: 'Geo-tagged camera evidence showing unoccupied crane and broken safety netting.',
    observationStatus: 'CORROBORATED',
    tier: 'CITIZEN',
    aarohanSyncStatus: 'QUEUED_FOR_AAROHAN',
    aarohanPipelineId: 'AAROHAN-PIPE-9942-IN',
    createdAt: '2025-02-18T16:45:00.000Z',
  },
  {
    id: 'JN-OBS-2025-8814',
    projectId: 'JN-2025-DR-108',
    projectName: 'Trunk Stormwater Drainage Channel Revamp',
    category: 'Active Construction Progress',
    observedWorkStatus: 'ACTIVE',
    submittedBy: 'Civic Auditor (East Canal Zone)',
    reporterType: 'Civic Auditor',
    timestamp: '2025-02-19 11:15 AM',
    location: 'South District Canal Link, Near Culvert 4',
    coordinates: {
      latitude: 28.5912,
      longitude: 77.3195,
      accuracy: '±8m',
    },
    content: 'Pre-cast culverts arrived on site and being installed with hydraulic cranes. Two excavation teams operating smoothly. Safety signs properly placed along service road.',
    workerCountEstimate: '20+ workers',
    machineryPresent: ['Hydraulic Crane', 'Excavator', 'Cement Mixer'],
    photos: [
      {
        url: '',
        caption: 'Culvert placement along trench line. Active workforce present.',
        name: 'culvert_laying_active.jpg',
        size: '1.8 MB',
      },
    ],
    photoCaption: 'Culvert placement along trench line. Active workforce present.',
    observationStatus: 'VERIFIED',
    tier: 'CITIZEN',
    aarohanSyncStatus: 'PROCESSED_IN_AAROHAN',
    aarohanPipelineId: 'AAROHAN-PIPE-8814-IN',
    createdAt: '2025-02-19T11:15:00.000Z',
  },
  {
    id: 'JN-OBS-2025-7201',
    projectId: 'JN-2025-HL-019',
    projectName: 'District Multi-Specialty Hospital 200-Bed Block',
    category: 'Safety Hazard / Structural Concern',
    observedWorkStatus: 'WORK_STOPPED',
    submittedBy: 'Daily Commuter (Civil Hospital Gate)',
    reporterType: 'Daily Commuter',
    timestamp: '2025-02-17 09:30 AM',
    location: 'Sector 19 Civil Hospital Complex, East Wing',
    coordinates: {
      latitude: 28.5721,
      longitude: 77.3482,
      accuracy: '±15m',
    },
    content: 'Iron scaffolding on 3rd floor exterior appears loose after heavy winds. No active construction crews seen since last week. Perimeter gates chained shut.',
    workerCountEstimate: '0 workers (Site idle)',
    machineryPresent: ['Scaffolding Tower (Unsecured)'],
    photos: [
      {
        url: '',
        caption: 'Scaffolding displacement on eastern wing facade.',
        name: 'hospital_scaffolding.jpg',
        size: '3.1 MB',
      },
    ],
    photoCaption: 'Scaffolding displacement on eastern wing facade.',
    observationStatus: 'DISPUTED',
    tier: 'CITIZEN',
    aarohanSyncStatus: 'FLAGGED_FOR_INSPECTION',
    aarohanPipelineId: 'AAROHAN-PIPE-7201-IN',
    createdAt: '2025-02-17T09:30:00.000Z',
  },
];

export function ObservationProvider({ children }) {
  const [observations, setObservations] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Could not read observations from localStorage', err);
    }
    return INITIAL_OBSERVATIONS;
  });

  // Persist whenever observations change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(observations));
    } catch (err) {
      console.warn('Could not save observations to localStorage', err);
    }
  }, [observations]);

  /**
   * Adds a new citizen observation and structures it for AAROHAN ingestion.
   */
  const addObservation = (data) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const observationId = `JN-OBS-${new Date().getFullYear()}-${randomSuffix}`;
    const pipelineId = `AAROHAN-PIPE-${randomSuffix}-STAGED`;

    const project = MOCK_PROJECTS.find((p) => p.id === data.projectId) || {
      id: data.projectId || 'JN-PROJECT-UNKNOWN',
      name: data.projectName || 'Public Infrastructure Project',
    };

    const newEntry = {
      id: observationId,
      projectId: project.id,
      projectName: project.name,
      category: data.category || 'General Observation',
      observedWorkStatus: data.observedWorkStatus || 'ACTIVE',
      submittedBy: data.reporterName
        ? `${data.reporterName} (${data.reporterType || 'Citizen'})`
        : `Citizen Observer (${data.reporterType || 'Local Resident'})`,
      reporterType: data.reporterType || 'Local Resident',
      timestamp: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      location: data.location || project.location || 'Municipal Project Site',
      coordinates: data.coordinates || {
        latitude: 28.6280,
        longitude: 77.3670,
        accuracy: '±10m (Estimated)',
      },
      content: data.description,
      workerCountEstimate: data.workerCountEstimate || 'Not specified',
      machineryPresent: data.machineryPresent || [],
      photos: data.photos || [],
      photoCaption: data.photos?.[0]?.caption || 'Citizen photographic submission',
      observationStatus: 'SUBMITTED',
      tier: 'CITIZEN',
      // Internal platform ingestion metadata:
      aarohanSyncStatus: 'QUEUED_FOR_AAROHAN',
      aarohanPipelineId: pipelineId,
      aarohanPayload: {
        schemaVersion: '1.2.0-AAROHAN-CIVIC',
        sourcePortal: 'JanNirikshan-Public',
        targetEngine: 'AAROHAN Internal Vision & Triage Core',
        ingestionQueue: 'RAW_CITIZEN_STAGING',
        projectReference: project.id,
        observationType: data.category,
        claimedStatus: data.observedWorkStatus,
        geotag: data.coordinates,
        evidenceCount: (data.photos || []).length,
        submittedTimestampISO: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
    };

    setObservations((prev) => [newEntry, ...prev]);
    return newEntry;
  };

  const getObservationsByProjectId = (projectId) => {
    return observations.filter((obs) => obs.projectId === projectId);
  };

  const getObservationById = (id) => {
    return observations.find((obs) => obs.id === id);
  };

  return (
    <ObservationContext.Provider
      value={{
        observations,
        addObservation,
        getObservationsByProjectId,
        getObservationById,
      }}
    >
      {children}
    </ObservationContext.Provider>
  );
}

export function useObservations() {
  const ctx = useContext(ObservationContext);
  if (!ctx) {
    throw new Error('useObservations must be used within an ObservationProvider');
  }
  return ctx;
}
