import { useState } from 'react';
import axios from "axios";

const PatientsDashboard = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    problem: '',
    medicines: '',
    height: '',
    heartRate: '',
    weight: '',
    bloodGroup: '',
    accessPolicy: '',
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null); // State for image preview

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setImagePreview(reader.result); // Set the image preview

        try {
          const response = await axios.post(
            'https://api.cloudinary.com/v1_1/dvw9vd875/image/upload',
            {
              file: reader.result,
              upload_preset: "gfgcloud",
            }
          );
          console.log('File uploaded successfully:', response.data);
          setFormData((prevData) => ({
            ...prevData,
            image: response.data.url,
          }));
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/data", {
        patientName: formData.patientName,
        problem: formData.problem,
        medicines: formData.medicines,
        height: formData.height,
        heartRate: formData.heartRate,
        weight: formData.weight,
        bloodGroup: formData.bloodGroup,
        accessPolicy: formData.accessPolicy,
        image: formData.image,
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.status) {
          console.log("Data stored successfully");
        }
      })
      .catch((err) => {
        console.error("Error storing data:", err);
      });
  };
  

  return (
    <div className="dashboard-container">
      <h2>Patient Dashboard</h2>
      <form onSubmit={handleSubmit} className="dashboard-form">
        <div className="form-group">
          <label>Patient Name:</label>
          <input 
            type="text" 
            name="patientName" 
            value={formData.patientName} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Problem:</label>
          <input 
            type="text" 
            name="problem" 
            value={formData.problem} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Medicines Used:</label>
          <input 
            type="text" 
            name="medicines" 
            value={formData.medicines} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Height (cm):</label>
          <input 
            type="number" 
            name="height" 
            value={formData.height} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Heart Rate (bpm):</label>
          <input 
            type="number" 
            name="heartRate" 
            value={formData.heartRate} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Weight (kg):</label>
          <input 
            type="number" 
            name="weight" 
            value={formData.weight} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Blood Group:</label>
          <select 
            name="bloodGroup" 
            value={formData.bloodGroup} 
            onChange={handleChange} 
            required 
          >
            <option value="">Select...</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        </div>
        <div className="form-group">
          <label>Access Policy to Department:</label>
          <input 
            type="text" 
            name="accessPolicy" 
            value={formData.accessPolicy} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Upload Image:</label>
          <input 
            type="file" 
            name="image" 
            accept="image/*" 
            onChange={handleImageChange} 
            required 
          />
          {imagePreview && (
            <div className="image-preview">
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{ width: '100px', height: '100px', marginTop: '10px' }} 
              />
            </div>
          )}
        </div>
        <button type="submit" className="btn-submit">Submit</button>
      </form>
    </div>
  );
};

export default PatientsDashboard;
