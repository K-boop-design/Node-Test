import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
  });
  const [submit, setSubmit] = useState('');
  const [loading, setLoading] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
        withCredentials: true,
      
      });
  
      const result = await response.json();
      if (response.ok && result.ok) {
        setSubmit('Logged in successfully');
        navigate('/landing', { state: { username: form.username } });
      } else {
        setSubmit(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmit('Error submitting form');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <h1>Login</h1>
        </div>
        <div>
          <label>Username</label>
          <input type="text" name="username" value={form.username} onChange={handleChange} />
        </div>
        <div>
          <label>Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} />
        </div>
        <button type="submit">Submit</button>
      </form>
      <div>
        {submit && <h1>{submit}</h1>}
      </div>
    </>
  );
};

export default LoginForm;



