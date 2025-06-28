import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadData, saveData, initializeData } from '../data/mockData';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useState({
    users: [],
    patients: [],
    incidents: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize data on app load
    const initializedData = initializeData();
    setData(initializedData);
    setLoading(false);
  }, []);

  const updateData = (newData) => {
    setData(newData);
    saveData(newData);
  };

  // Patient management functions
  const addPatient = (patient) => {
    const newPatient = {
      ...patient,
      id: `p${Date.now()}` // Simple ID generation
    };
    const newData = {
      ...data,
      patients: [...data.patients, newPatient]
    };
    updateData(newData);
    return newPatient;
  };

  const updatePatient = (patientId, updatedPatient) => {
    const newData = {
      ...data,
      patients: data.patients.map(p => 
        p.id === patientId ? { ...p, ...updatedPatient } : p
      )
    };
    updateData(newData);
  };

  const deletePatient = (patientId) => {
    const newData = {
      ...data,
      patients: data.patients.filter(p => p.id !== patientId),
      incidents: data.incidents.filter(i => i.patientId !== patientId)
    };
    updateData(newData);
  };

  const getPatientById = (patientId) => {
    return data.patients.find(p => p.id === patientId);
  };

  // Incident management functions
  const addIncident = (incident) => {
    const newIncident = {
      ...incident,
      id: `i${Date.now()}`, // Simple ID generation
      files: incident.files || []
    };
    const newData = {
      ...data,
      incidents: [...data.incidents, newIncident]
    };
    updateData(newData);
    return newIncident;
  };

  const updateIncident = (incidentId, updatedIncident) => {
    const newData = {
      ...data,
      incidents: data.incidents.map(i => 
        i.id === incidentId ? { ...i, ...updatedIncident } : i
      )
    };
    updateData(newData);
  };

  const deleteIncident = (incidentId) => {
    const newData = {
      ...data,
      incidents: data.incidents.filter(i => i.id !== incidentId)
    };
    updateData(newData);
  };

  const getIncidentsByPatientId = (patientId) => {
    return data.incidents.filter(i => i.patientId === patientId);
  };

  const getIncidentById = (incidentId) => {
    return data.incidents.find(i => i.id === incidentId);
  };

  // File management functions
  const addFileToIncident = (incidentId, file) => {
    const incident = data.incidents.find(i => i.id === incidentId);
    if (incident) {
      const updatedIncident = {
        ...incident,
        files: [...(incident.files || []), file]
      };
      updateIncident(incidentId, updatedIncident);
    }
  };

  const removeFileFromIncident = (incidentId, fileName) => {
    const incident = data.incidents.find(i => i.id === incidentId);
    if (incident) {
      const updatedIncident = {
        ...incident,
        files: (incident.files || []).filter(f => f.name !== fileName)
      };
      updateIncident(incidentId, updatedIncident);
    }
  };

  // Statistics and dashboard data
  const getDashboardStats = () => {
    const totalPatients = data.patients.length;
    const totalAppointments = data.incidents.length;
    const completedTreatments = data.incidents.filter(i => i.status === 'Completed').length;
    const pendingTreatments = data.incidents.filter(i => i.status === 'Pending').length;
    const scheduledTreatments = data.incidents.filter(i => i.status === 'Scheduled').length;
    const totalRevenue = data.incidents
      .filter(i => i.status === 'Completed')
      .reduce((sum, i) => sum + (i.cost || 0), 0);

    return {
      totalPatients,
      totalAppointments,
      completedTreatments,
      pendingTreatments,
      scheduledTreatments,
      totalRevenue
    };
  };

  const getUpcomingAppointments = (limit = 10) => {
    const now = new Date();
    return data.incidents
      .filter(i => new Date(i.appointmentDate) >= now)
      .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
      .slice(0, limit)
      .map(incident => ({
        ...incident,
        patient: getPatientById(incident.patientId)
      }));
  };

  const getTopPatients = (limit = 5) => {
    const patientStats = data.patients.map(patient => {
      const patientIncidents = data.incidents.filter(i => i.patientId === patient.id);
      const totalSpent = patientIncidents
        .filter(i => i.status === 'Completed')
        .reduce((sum, i) => sum + (i.cost || 0), 0);
      const visitCount = patientIncidents.length;
      
      return {
        ...patient,
        totalSpent,
        visitCount
      };
    });

    return patientStats
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, limit);
  };

  const value = {
    data,
    loading,
    updateData,
    // Patient functions
    addPatient,
    updatePatient,
    deletePatient,
    getPatientById,
    // Incident functions
    addIncident,
    updateIncident,
    deleteIncident,
    getIncidentsByPatientId,
    getIncidentById,
    // File functions
    addFileToIncident,
    removeFileFromIncident,
    // Dashboard functions
    getDashboardStats,
    getUpcomingAppointments,
    getTopPatients
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

