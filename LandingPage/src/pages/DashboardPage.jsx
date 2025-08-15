// src/pages/DashboardPage.jsx
import React, { useState } from 'react';
import { useAuth }        from '@/contexts/AuthContext';
import { useToast }       from '@/components/ui/use-toast';

export default function DashboardPage() {
  const { user, token, logout } = useAuth();
  const { toast }               = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin]         = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  // Helper to build auth headers
  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization:  `Bearer ${token}`
  });

  async function handleChangePassword(e) {
    e.preventDefault();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/change-password`,
        {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirm: confirmPassword
          })
        }
      );
      const data = await res.json();
      if (!res.ok) throw data;
      toast({ title: data.message });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast({ title: err.error || 'Error changing password', variant: 'destructive' });
    }
  }

  async function handleChangePin(e) {
    e.preventDefault();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/change-pin`,
        {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({
            currentPin,
            newPin,
            confirm: confirmPin
          })
        }
      );
      const data = await res.json();
      if (!res.ok) throw data;
      toast({ title: data.message });
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
    } catch (err) {
      toast({ title: err.error || 'Error changing PIN', variant: 'destructive' });
    }
  }

  return (
    <div className="space-y-8 p-8">
      <h1 className="text-2xl">Welcome, {user.firstName}!</h1>

      {/* Change Password Form */}
      <form onSubmit={handleChangePassword} className="space-y-2">
        <h2 className="font-semibold">Change Password</h2>
        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Save Password</button>
      </form>

      {/* Change PIN Form */}
      <form onSubmit={handleChangePin} className="space-y-2">
        <h2 className="font-semibold">Change PIN</h2>
        <input
          type="password"
          placeholder="Current PIN"
          value={currentPin}
          onChange={e => setCurrentPin(e.target.value)}
          required
          maxLength={4}
        />
        <input
          type="password"
          placeholder="New PIN"
          value={newPin}
          onChange={e => setNewPin(e.target.value)}
          required
          maxLength={4}
        />
        <input
          type="password"
          placeholder="Confirm New PIN"
          value={confirmPin}
          onChange={e => setConfirmPin(e.target.value)}
          required
          maxLength={4}
        />
        <button type="submit">Save PIN</button>
      </form>

      <button onClick={logout} className="mt-8 text-red-500">
        Log Out
      </button>
    </div>
  );
}
