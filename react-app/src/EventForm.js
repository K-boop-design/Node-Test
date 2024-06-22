import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EventForm = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    image: null
  });
  const [submit, setSubmit] = useState('');
  const [loading, setLoading] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setForm({
        ...form,
        [name]: files[0]
      });
    } else {
      setForm({
        ...form,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      for (const key in form) {
        formData.append(key, form[key]);
      }
  
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        body: formData,
      });
  
      const result = await response.json();
      if (response.ok) {
        setSubmit('Registration successful!');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setSubmit(result.message);
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
          <h1>Registration</h1>
        </div>
        <div>
          <label>Username</label>
          <input type="text" name="username" value={form.username} onChange={handleChange} />
        </div>
        <div>
          <label>Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} />
        </div>
        <div>
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} />
        </div>
        <div>
          <label>Upload File</label>
          <input type="file" name="image" onChange={handleChange} />
        </div>
        <button type="submit">Submit</button>
      </form>
      <div>
        {submit}
      </div>
    </>
  );
};

export default EventForm;







