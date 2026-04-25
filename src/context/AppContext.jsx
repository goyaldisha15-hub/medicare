import { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

const INITIAL_MEDICATIONS = [
  { id: 1, name: "Vitamin D3", dose: "1000 IU", time: "8:00 AM", taken: true, icon: "☀️" },
  { id: 2, name: "Omega-3", dose: "500 mg", time: "8:00 AM", taken: true, icon: "🐟" },
  { id: 3, name: "Metformin", dose: "500 mg", time: "2:00 PM", taken: false, icon: "💊" },
  { id: 4, name: "Lisinopril", dose: "10 mg", time: "9:00 PM", taken: false, icon: "❤️" },
];

export function AppProvider({ children }) {
  const [medications, setMedications] = useState(INITIAL_MEDICATIONS);
  const [symptomHistory, setSymptomHistory] = useState([]);
  const [globalLoading, setGlobalLoading] = useState(false);

  const toggleMedication = (id) => {
    setMedications((prev) =>
      prev.map((m) => (m.id === id ? { ...m, taken: !m.taken } : m))
    );
  };

  const addMedication = (med) => {
    setMedications((prev) => [...prev, { ...med, id: Date.now(), taken: false }]);
  };

  const deleteMedication = (id) => {
    setMedications((prev) => prev.filter((m) => m.id !== id));
  };

  const addSymptomRecord = (record) => {
    setSymptomHistory((prev) => [
      { ...record, id: Date.now(), date: new Date().toLocaleString() },
      ...prev,
    ]);
  };

  const value = {
    medications, toggleMedication, addMedication, deleteMedication,
    symptomHistory, addSymptomRecord,
    globalLoading, setGlobalLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used inside AppProvider");
  return ctx;
}