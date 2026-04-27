

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCookie } from '../middelwaie/cookie';
import backend_Url from '../backend_url_return_function/backendUrl';

const EditFoodItem = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Extract the ID passed via React Router state
    const foodId = location.state?.id;

    // State for the form data
   // State for the form data
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        discount: 0, // <-- Add this line
        availability: true,
        description:'',
        pic_url: '' 
    });

    // State for the actual image file to be uploaded
    const [selectedFile, setSelectedFile] = useState(null);

    // UI states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 1. Fetch the single food details on component mount
    useEffect(() => {
        const fetchFoodDetails = async () => {
            if (!foodId) {
                setError("No food ID provided.");
                setLoading(false);
                return;
            }

            try {
                // Note: Using POST here because the fetch API doesn't allow a body in GET requests
                const response = await fetch(`${backend_Url}/production/singleFoodDetails`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ _id: foodId }),
                });

                const result = await response.json();
                console.log(result);

                if (result.success) {
                    setFormData({
                        title: result.data.title,
                        price: result.data.price,
                        discount: result.data.discount || 0, // <-- Add this line
                        availability: result.data.availability,
                        description: result.data.description,
                        pic_url: result.data.pic_url
                    });
                } else {
                    setError(result.message || "Failed to fetch food details.");
                }
            } catch (err) {
                setError("An error occurred while fetching data.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFoodDetails();
    }, [foodId]);

    // 2. Handle standard text/number/checkbox input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // 3. Handle file selection
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    // 4. Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = getCookie('authToken');
            // Because we have a file, we MUST use FormData, not JSON
            const submitData = new FormData();

            // Append standard fields
            submitData.append('_id', foodId);
            submitData.append('title', formData.title);
            submitData.append('price', formData.price);
            submitData.append('discount', formData.discount); // <-- Add this line
            submitData.append('description', formData.description);
            submitData.append('availability', formData.availability);

            // Append the token from localStorage
            if (token) {
                submitData.append('token', token);
            }

            // Append the file ONLY if the user selected a new one
            // The name 'pic_url_file' MUST match your backend upload.single('pic_url_file')
            if (selectedFile) {
                submitData.append('pic_url_file', selectedFile);
            }

            const response = await fetch(`${backend_Url}/production/edit/product`, {
                method: "PATCH",
                // Do NOT set "Content-Type" manually when using FormData. 
                // The browser sets it automatically with the correct boundary string.
                headers: {
                    // It is common practice to also send the token here, just in case your 
                    // 'authenticateJWT' middleware looks for it in the headers instead of the body
                    "Authorization": `Bearer ${token}`
                },
                body: submitData
            });

            const result = await response.json();

            if (result.success) {
                alert("Food item updated successfully!");
                navigate('/'); // Redirect to your products list
            } else {
                setError(result.message || "Failed to update food item.");
            }
        } catch (err) {
            setError("An error occurred while updating.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
       <div className="min-h-screen w-screen flex items-center justify-center bg-amber-500 p-4">
    <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Edit Food Item</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Title Input */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                <input 
                    type="text" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleInputChange} 
                    required 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200"
                    placeholder="Enter item name"
                />
            </div>

                   {/* description Input */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">description</label>
                <input 
                    type="text" 
                    name="description" 
                    value={formData.description} 
                    onChange={handleInputChange} 
                    required 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200"
                    placeholder="Enter item name"
                />
            </div>

            {/* Price Input */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹)</label>
                <input 
                    type="number" 
                    name="price" 
                    value={formData.price} 
                    onChange={handleInputChange} 
                    required 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200"
                    placeholder="0.00"
                />
            </div>

            {/* Discount Input (NEW) */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Discount (%)</label>
                <input 
                    type="number" 
                    name="discount" 
                    value={formData.discount} 
                    onChange={handleInputChange} 
                    min="0"
                    max="100"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200"
                    placeholder="0"
                />
            </div>

            {/* Availability Checkbox */}
            <div className="flex items-center p-3.5 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                <input 
                    type="checkbox" 
                    name="availability" 
                    id="availability-toggle"
                    checked={formData.availability} 
                    onChange={handleInputChange} 
                    className="w-5 h-5 text-indigo-600 bg-white border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="availability-toggle" className="ml-3 text-sm font-medium text-gray-700 cursor-pointer select-none">
                    Available for sale
                </label>
            </div>

            {/* Image Upload */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Update Image</label>
                <input 
                    type="file" 
                    name="pic_url_file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2.5 file:px-4
                        file:rounded-lg file:border-0
                        file:text-sm file:font-semibold
                        file:bg-indigo-50 file:text-indigo-700
                        hover:file:bg-indigo-100 file:cursor-pointer
                        transition-all duration-200"
                />
                
                {/* Show current image if a new one hasn't been selected yet */}
                {!selectedFile && formData.pic_url && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-200 inline-block">
                        <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">Current Image</p>
                        <img 
                            src={formData.pic_url} 
                            alt="Current food" 
                            className="w-24 h-24 object-cover rounded-lg shadow-sm border border-gray-200" 
                        />
                    </div>
                )}
            </div>

            {/* Submit Button */}
            <button 
                type="submit" 
                disabled={loading}
                className={`mt-2 w-full py-3.5 px-4 rounded-xl text-blue-800 font-semibold tracking-wide transition-all duration-200 shadow-md ${
                    loading 
                    ? "bg-indigo-400 cursor-not-allowed" 
                    : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg active:scale-[0.98]"
                }`}
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                    </span>
                ) : "Save Changes"}
            </button>

        </form>
    </div>
</div>
    );
};

export default EditFoodItem;