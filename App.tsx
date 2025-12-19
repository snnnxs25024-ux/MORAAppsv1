import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Dashboard from './components/Dashboard';
import Scanner from './components/Scanner';
import Attendance from './components/Attendance';
import Profile from './components/Profile';
import DeliveryList from './components/DeliveryList';
import Performance from './components/Performance';
import { Package, DeliveryStatus, UserProfile, AppState } from './types';

const App: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [appState, setAppState] = useState<AppState>({
    isClockedIn: false,
    isShiftStarted: false,
    currentStep: 'ATTENDANCE',
    expectedCod: 0,
    expectedNonCod: 0
  });

  const [user] = useState<UserProfile>({
    id: 'u1',
    name: 'Andhika Pratama',
    employeeId: 'MORA-007',
    email: 'andhika.mora@gmail.com',
    phone: '0812-3456-7890',
    avatar: 'https://i.imgur.com/8Km9tLL.png',
    totalDeliveries: 1240,
    rating: 4.8,
    balance: 750000
  });

  const handleClockIn = () => {
    setAppState(prev => ({ ...prev, isClockedIn: true, currentStep: 'SETUP_TOTAL' }));
  };

  const handleSetupTotal = (cod: number, nonCod: number) => {
    setAppState(prev => ({ 
      ...prev, 
      expectedCod: cod, 
      expectedNonCod: nonCod, 
      currentStep: 'LOADING_SCAN' 
    }));
  };

  const handleAddPackage = (newPkg: Package) => {
    setPackages(prev => [newPkg, ...prev]);
  };

  const handleRemovePackage = (id: string) => {
    setPackages(prev => prev.filter(p => p.id !== id));
  };

  const handleFinishLoading = () => {
    setAppState(prev => ({ ...prev, currentStep: 'DELIVERING' }));
  };

  const handleUpdateStatus = (id: string, status: DeliveryStatus, data?: { recipientName?: string, proofImage?: string, cancelReason?: string }) => {
    setPackages(prev => prev.map(p => 
      p.id === id ? { ...p, status, ...data } : p
    ));
  };

  const handleStartHandover = () => {
    setAppState(prev => ({ ...prev, currentStep: 'HANDOVER' }));
  };

  const handleCompleteHandover = (photo: string, leader: string) => {
    setAppState(prev => ({ 
      ...prev, 
      handoverPhoto: photo, 
      handoverLeader: leader, 
      currentStep: 'COMPLETED' 
    }));
  };

  const handleResetShift = () => {
    setPackages([]);
    setAppState({
      isClockedIn: false,
      isShiftStarted: false,
      currentStep: 'ATTENDANCE',
      expectedCod: 0,
      expectedNonCod: 0
    });
  };

  return (
    <Router>
      <div className="flex flex-col h-screen bg-slate-50 overflow-hidden font-sans">
        <main className="flex-1 overflow-y-auto pb-32 p-4 md:p-8 max-w-5xl mx-auto w-full">
          <Routes>
            <Route path="/" element={
              <Dashboard 
                packages={packages} 
                user={user} 
                appState={appState} 
              />
            } />
            <Route path="/deliveries" element={
              <DeliveryList 
                packages={packages} 
                onUpdate={handleUpdateStatus} 
                onRemove={handleRemovePackage}
                appState={appState}
                onSetupTotal={handleSetupTotal}
                onFinishLoading={handleFinishLoading}
                onStartHandover={handleStartHandover}
                onCompleteHandover={handleCompleteHandover}
                onReset={handleResetShift}
              />
            } />
            <Route path="/performance" element={<Performance user={user} />} />
            <Route path="/scan" element={
              <Scanner 
                onScan={handleAddPackage} 
                onRemove={handleRemovePackage}
                mode={appState.currentStep === 'LOADING_SCAN' ? 'LOAD' : 'FIND'} 
                existingPackages={packages}
                appState={appState}
              />
            } />
            <Route path="/attendance" element={<Attendance isClockedIn={appState.isClockedIn} onClockIn={handleClockIn} />} />
            <Route path="/profile" element={<Profile user={user} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </Router>
  );
};

export default App;