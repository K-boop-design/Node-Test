import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'; 
import { useNavigate } from 'react-router-dom';


const Events = () => {
    const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    description: '',
    details: '',
    startDate: '',
    endDate: '',
    recurringInfo: '',
    category: '',
    tags: [],
    relevance: '',
    participationAccess: '',
    paymentMethod: '',
    pricingInfo: '',
    image: null
  });
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setForm({
        ...form,
        [name]: checked
      });
    } else if (type === 'file') {
      setForm({
        ...form,
        [name]: files[0]
      });
    } else if (type === 'select-multiple') {
      const options = e.target.options;
      const selectedOptions = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          selectedOptions.push(options[i].value);
        }
      }
      setForm({
        ...form,
        [name]: selectedOptions
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
    try {
      const formData = new FormData();
      for (const key in form) {
        formData.append(key, form[key]);
      }

      const response = await fetch('http://localhost:3001/events/submit', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setSubmitMessage('Form submitted successfully!');
        // setForm({
        //   name: '',
        //   description: '',
        //   details: '',
        //   startDate: '',
        //   endDate: '',
        //   recurringInfo: '',
        //   category: '',
        //   tags: [],
        //   relevance: '',
        //   participationAccess: '',
        //   paymentMethod: '',
        //   pricingInfo: '',
        //   image: null
        // });
        navigate('/evslist');
      } else {
        const errorMessage = await response.text();
        setSubmitMessage(`Failed to submit form: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitMessage('Error submitting form');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Form fields */}
        {/* Name */}
        <div>
          <label>Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} />
        </div>
        
        {/* Description */}
        <div>
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange}></textarea>
        </div>
        
        {/* Details and Lineup */}
        <div>
          <label>Details and Lineup</label>
          <textarea name="details" value={form.details} onChange={handleChange}></textarea>
        </div>
        
        {/* Start Date */}
        <div>
          <label>Start Date</label>
          <input type="date" name="startDate" value={form.startDate} onChange={handleChange} />
        </div>
        
        {/* End Date */}
        <div>
          <label>End Date</label>
          <input type="date" name="endDate" value={form.endDate} onChange={handleChange} />
        </div>
        
        {/* Recurring Info */}
        <div>
          <label>Recurring Info</label>
          <textarea name="recurringInfo" value={form.recurringInfo} onChange={handleChange}></textarea>
        </div>
        
        {/* Categories */}
        <div>
          <label>Categories</label>
          <select name="category" value={form.category} onChange={handleChange}>
            <option value="optionOne">Option one</option>
            <option value="optionTwo">Option two</option>
          </select>
        </div>
        
        {/* Tags */}
        <div>
          <label>Tags</label>
          <select name="tags" multiple value={form.tags} onChange={handleChange}>
            <option value="optionOne">Option one</option>
            <option value="optionTwo">Option two</option>
          </select>
        </div>
        
        {/* Relevance */}
        <div>
          <label>Relevance</label>
          <select name="relevance" value={form.relevance} onChange={handleChange}>
            <option value="endorsement">Endorsement</option>
            <option value="resource">Resource</option>
            <option value="hide">Hide</option>
          </select>
        </div>
        
        {/* Participation Access */}
        <div>
          <label>Participation Access</label>
          <select name="participationAccess" value={form.participationAccess} onChange={handleChange}>
            <option value="paid">Paid</option>
            <option value="inviteOnly">Invite only</option>
            <option value="open">Open</option>
          </select>
        </div>
        
       
        <div>
          <label>Payment Method</label>
          <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
            <option value="inAdvance">In advance</option>
            <option value="atDoor">At door</option>
            <option value="both">Both</option>
          </select>
        </div>
        
        
        <div>
          <label>Pricing Info</label>
          <textarea name="pricingInfo" value={form.pricingInfo} onChange={handleChange}></textarea>
        </div>

        <div>
          <label>Upload File</label>
          <input type="file" name="image" onChange={handleChange} />
        </div>
        
       
        <button type="submit">Submit</button>
      </form>

     
      {submitMessage && <div>{submitMessage}</div>}
    </>
  );
};

export default Events;
