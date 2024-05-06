import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../graphql/mutations';
import Auth from '../utils/auth';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [login, { error }] = useMutation(LOGIN_USER, {
    onCompleted: data => {
      Auth.login(data.login.token);
    }
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await login({ variables: formData });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="email"
        placeholder="Email"
        name="email"
        value={formData.email}
        onChange={e => setFormData({ ...formData, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        name="password"
        value={formData.password}
        onChange={e => setFormData({ ...formData, password: e.target.value })}
      />
      <button type="submit">Login</button>
      {error && <p>Error: {error.message}</p>}
    </form>
  );
};

export default LoginForm;