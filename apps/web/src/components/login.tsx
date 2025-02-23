import { AppDispatch, loginUser } from '@makefilm/fe-business-logic';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

export const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ password, username }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input onChange={(e) => setUsername(e.target.value)} placeholder="Username" type="text" value={username} />
      <input onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" value={password} />
      <button type="submit">Login</button>
    </form>
  );
};
