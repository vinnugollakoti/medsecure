import  { useEffect, useState } from 'react';
import axios from 'axios';

const DoctorsDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/data');
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading-message">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="dashboard-container">
      <h2>Doctors Dashboard</h2>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Problem</th>
            <th>Medicines</th>
            <th>Height (cm)</th>
            <th>Heart Rate (bpm)</th>
            <th>Weight (kg)</th>
            <th>Blood Group</th>
            <th>Access Policy</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.patientName}</td>
              <td>{item.problem}</td>
              <td>{item.medicines}</td>
              <td>{item.height}</td>
              <td>{item.heartRate}</td>
              <td>{item.weight}</td>
              <td>{item.bloodGroup}</td>
              <td>{item.accessPolicy}</td>
              <td>
                {item.image && (
                  <img src={item.image} alt="Patient" className="patient-image" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorsDashboard;
