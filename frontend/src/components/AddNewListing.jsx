import { Form, useActionData, Link, useNavigation } from 'react-router-dom';
import { useState } from 'react';

export default function AddNewListing() {
    const actionData = useActionData();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    const user = JSON.parse(localStorage.getItem('user'));
    
    const [itemType, setItemType] = useState(actionData?.values?.type || 'preloved');
    const [previewImages, setPreviewImages] = useState([]);
    
    // Handle type selection change
    const handleTypeChange = (e) => {
        setItemType(e.target.value);
    };
    
    // Handle image selection for preview only
    const handleImageChange = (e) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            
            // Limit to 5 images
            const limitedFiles = filesArray.slice(0, 5);
            
            // Create preview URLs
            const imagesPreviews = limitedFiles.map(file => URL.createObjectURL(file));
            setPreviewImages(imagesPreviews);
        }
    };
    
    return (
        <div>
            <h1>Add New Listing</h1>
            
            {actionData?.error && (
                <div style={{ color: 'red' }}>{actionData.error}</div>
            )}
            
            {actionData?.success && (
                <div style={{ color: 'green' }}>{actionData.success}</div>
            )}
            
            <Form method="post" encType="multipart/form-data">
                <div>
                    <label htmlFor="itemCode">Item Code:</label>
                    <input 
                        type="text" 
                        id="itemCode" 
                        name="itemCode" 
                        defaultValue={actionData?.values?.itemCode || ''}
                        required 
                    />
                </div>
                
                <div>
                    <label htmlFor="name">Name:</label>
                    <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        defaultValue={actionData?.values?.name || ''}
                        required 
                    />
                </div>
                
                <div>
                    <label htmlFor="price">Price:</label>
                    <input 
                        type="number" 
                        id="price" 
                        name="price" 
                        defaultValue={actionData?.values?.price || ''}
                        step="0.01" 
                        min="0" 
                        required 
                    />
                </div>
                
                <div>
                    <label htmlFor="owner">Owner:</label>
                    <input 
                        type="text" 
                        id="owner" 
                        name="owner" 
                        defaultValue={actionData?.values?.owner || ''}
                        required 
                    />
                </div>
                
                <div>
                    <label htmlFor="type">Type:</label>
                    <select 
                        id="type" 
                        name="type" 
                        value={itemType}
                        onChange={handleTypeChange}
                        required
                    >
                        <option value="preloved">Pre-loved</option>
                        <option value="brandnew">Brand New</option>
                    </select>
                </div>
                
                <div>
                    <label htmlFor="category">Category:</label>
                    <select 
                        id="category" 
                        name="category" 
                        defaultValue={actionData?.values?.category || ''}
                        required
                    >
                        <option value="">Select a category</option>
                        <option value="Sports & Outdoor">Sports & Outdoor</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Kids' Costumes">Kids' Costumes</option>
                        <option value="Toys & Games">Toys & Games</option>
                        <option value="Others">Others</option>
                        <option value="Adult Clothing">Adult Clothing</option>
                        <option value="School & Office">School & Office</option>
                        <option value="Home & Lifestyle">Home & Lifestyle</option>
                    </select>
                </div>
                
                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea 
                        id="description" 
                        name="description" 
                        defaultValue={actionData?.values?.description || ''}
                        rows="4" 
                    ></textarea>
                </div>
                
                {/* Condition field shows only when "preloved" is selected */}
                {itemType === 'preloved' && (
                    <div>
                        <label htmlFor="condition">Condition:</label>
                        <textarea 
                            id="condition" 
                            name="condition" 
                            defaultValue={actionData?.values?.condition || ''}
                            rows="2" 
                        ></textarea>
                    </div>
                )}
                
                {/* Simplified image upload section - no manual upload handling */}
                <div>
                    <label htmlFor="images">Product Images:</label>
                    <input 
                        type="file" 
                        id="images" 
                        name="images"
                        accept="image/*"
                        onChange={handleImageChange}
                        multiple
                        disabled={isSubmitting}
                    />
                    <p>You can select up to 5 images</p>
                    
                    {/* Preview images */}
                    {previewImages.length > 0 && (
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            {previewImages.map((url, index) => (
                                <img 
                                    key={index} 
                                    src={url} 
                                    alt={`Preview ${index + 1}`} 
                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
                                />
                            ))}
                        </div>
                    )}
                </div>
                
                <div>
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save New Listing'}
                    </button>
                    <Link to={`/${user.role}/inventory`}>
                        <button type="button">Cancel</button>
                    </Link>
                </div>
            </Form>
        </div>
    );
}