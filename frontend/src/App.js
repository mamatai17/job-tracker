import React, { useEffect, useState } from 'react';
import api from './api';
import LoginForm from './LoginForm';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [applications, setApplications] = useState([]);
  const [formData, setFormData] = useState({
    company: '',
    job_title: '',
    notes: '',
    status: '',
    application_date: ''
  });

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ ...formData });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      fetchApplications();
    }
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/applications/');
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    fetchApplications();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setApplications([]);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/applications/', formData);
    fetchApplications();
    setFormData({
      company: '',
      job_title: '',
      notes: '',
      status: '',
      application_date: ''
    });
  };

  const startEdit = (job) => {
    setEditId(job.id);
    setEditData({
      company: job.company,
      job_title: job.job_title,
      status: job.status,
      notes: job.notes,
      application_date: job.application_date.slice(0, 10)
    });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const saveEdit = async () => {
    await api.put(`/applications/${editId}`, editData);
    setEditId(null);
    fetchApplications();
  };

  const cancelEdit = () => {
    setEditId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      await api.delete(`/applications/${id}`);
      fetchApplications();
    }
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div>
      <nav className="navbar navbar-dark bg-primary">
        <div className='container-fluid'>
          <a className='navbar-brand' href='#'>Job Tracker</a>
          <button className='btn btn-danger' onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className='container'>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label>Company</label>
            <input name='company' className='form-control' value={formData.company} onChange={handleChange} />
          </div>
          <div className='mb-3'>
            <label>Job Title</label>
            <input name='job_title' className='form-control' value={formData.job_title} onChange={handleChange} />
          </div>
          <div className='mb-3'>
            <label>Status</label>
            <select name='status' className='form-control' onChange={handleChange} value={formData.status}>
              <option value=''>Select</option>
              <option value='Applied'>Applied</option>
              <option value='Interview'>Interview</option>
              <option value='Offer'>Offer</option>
              <option value='Rejected'>Rejected</option>
            </select>
          </div>
          <div className='mb-3'>
            <label>Application Date</label>
            <input type='date' name='application_date' className='form-control' value={formData.application_date} onChange={handleChange} />
          </div>
          <div className='mb-3'>
            <label>Notes</label>
            <input name='notes' className='form-control' value={formData.notes} onChange={handleChange} />
          </div>
          <button type='submit' className='btn btn-primary'>Add</button>
        </form>

        <hr />

        <h4>Applications</h4>
        <table className='table table-striped'>
          <thead>
            <tr>
              <th>Company</th>
              <th>Job Title</th>
              <th>Status</th>
              <th>Date</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app.id}>
                {editId === app.id ? (
                  <>
                    <td><input name="company" value={editData.company} onChange={handleEditChange} className="form-control" /></td>
                    <td><input name="job_title" value={editData.job_title} onChange={handleEditChange} className="form-control" /></td>
                    <td>
                      <select name='status' value={editData.status} onChange={handleEditChange} className='form-control'>
                        <option value=''>Select</option>
                        <option value='Applied'>Applied</option>
                        <option value='Interview'>Interview</option>
                        <option value='Offer'>Offer</option>
                        <option value='Rejected'>Rejected</option>
                      </select>
                    </td>
                    <td><input type="date" name="application_date" value={editData.application_date} onChange={handleEditChange} className="form-control" /></td>
                    <td><input name="notes" value={editData.notes} onChange={handleEditChange} className="form-control" /></td>
                    <td>
                      <button className='btn btn-success btn-sm me-2' onClick={saveEdit}>Save</button>
                      <button className='btn btn-secondary btn-sm' onClick={cancelEdit}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{app.company}</td>
                    <td>{app.job_title}</td>
                    <td>{app.status}</td>
                    <td>{app.application_date}</td>
                    <td>{app.notes}</td>
                    <td>
                      <button className='btn btn-outline-primary btn-sm me-2' onClick={() => startEdit(app)}>Edit</button>
                      <button className='btn btn-outline-danger btn-sm' onClick={() => handleDelete(app.id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
