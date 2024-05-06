import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../graphql/mutations';
import Auth from '../utils/auth'; 

const SignupForm = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [addUser, { error }] = useMutation(ADD_USER, {
    onCompleted: data => {
      Auth.login(data.addUser.token);
    }
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!formData.username || !formData.email || !formData.password) return;
    try {
      await addUser({ variables: formData });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        placeholder="Username"
        name="username"
        value={formData.username}
        onChange={e => setFormData({ ...formData, username: e.target.value })}
      />
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
      <button type="submit">Sign Up</button>
      {error && <p>Error: {error.message}</p>}
    </form>
  );
};

export default SignupForm;