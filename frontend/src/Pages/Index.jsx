import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import API_URL from '../_helpers';
import AnalysisGraph from '../Components/Graphs/AnalysisGraph';
  // Import the Loader component
import './Index.css';
import Loader from '../Components/Loader/Loader';

const Index = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [outputImage, setOutputImage] = useState(null);
    const [extraData, setExtraData] = useState(null);
    const [inputImageURL, setInputImageURL] = useState(null);
    const [loading, setLoading] = useState(false); // Loading state

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);

        if (file) {
            const imageURL = URL.createObjectURL(file);
            setInputImageURL(imageURL);
        }
    };

    const preprocessData = (data) => {
        const processedData = {};
        Object.keys(data).forEach(key => {
            processedData[key] = Math.round(data[key] * 100 * 100) / 100;
        });
        return processedData;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            alert('Please select an image to upload');
            return;
        }

        setLoading(true);  // Show loader before making the API request

        const formData = new FormData();
        formData.append('email', Cookies.get('email'));
        formData.append('image', selectedFile);

        try {
            const response = await axios.post(`${API_URL}/process-image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.status === 'success') {
                setOutputImage(response.data.output_image);
                setExtraData(preprocessData(response.data.data));
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            alert('An error occurred: ' + error.response.data.message);
        } finally {
            setLoading(false);  // Hide loader after processing
        }
    };

    return (
        <div className="container mt-5">
            {loading && <Loader/>}  {/* Show loader when loading */}
            <div className="row">
                <div className="col-lg-5 col-md-5 col-sm-10">
                    <div className="card shadow p-4" style={{ backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
                        <h2 className="text-center poppins-semibold">Image Upload and Analysis</h2>
                        <form onSubmit={handleSubmit} className="mt-4">
                            <div className="form-group">
                                <label htmlFor="imageUpload" className="poppins-medium">Upload Image:</label>
                                <input 
                                    type="file" 
                                    className="form-control-file shadow-sm" 
                                    id="imageUpload"
                                    onChange={handleFileChange} 
                                    accept="image/*" 
                                />
                            </div>
                            {inputImageURL && (
                                <div className="mt-4 text-center">
                                    <h4 className="poppins-medium">Input Image</h4>
                                    <img src={inputImageURL} alt="Input" className="img-fluid shadow-sm" style={{ borderRadius: '10px' }} />
                                </div>
                            )}
                            <button type="submit" className="btn btn-primary mt-4 w-100 poppins-medium">Submit</button>
                        </form>
                    </div>
                </div>
                <div className="col-lg-5 col-md-5 col-sm-10">
                    <div className="card shadow p-4" style={{ backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
                        <h3 className="text-center poppins-semibold">Output</h3>
                        {outputImage && (
                            <div className="mt-4 text-center">
                                <h4 className="poppins-medium">Processed Output</h4>
                                {/* <img src={`data:image/png;base64,${outputImage}`} alt="Output" className="img-fluid shadow-sm" style={{ borderRadius: '10px' }} /> */}
                            </div>
                        )}
                        {extraData && (
                            <div className="mt-4">
                                <h4 className="poppins-medium">Additional Data:</h4>
                                <pre>{JSON.stringify(extraData, null, 2)}</pre>
                                <div className="mt-4">
                                    <AnalysisGraph analysisData={extraData} />
                                </div>
                                <br></br>
                                <br></br>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;
