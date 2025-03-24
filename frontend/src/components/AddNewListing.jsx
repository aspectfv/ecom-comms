import { Form, useActionData, Link } from 'react-router-dom';

export default function AddNewListing() {
    const actionData = useActionData();
    const user = JSON.parse(localStorage.getItem('user')); // Get user data for role-based routing

    return (
        <div>
            <h1>Add New Listing</h1>
            
            {actionData?.error && (
                <div style={{ color: 'red' }}>{actionData.error}</div>
            )}
            
            {actionData?.success && (
                <div style={{ color: 'green' }}>{actionData.success}</div>
            )}
            
            <Form method="post">
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
                        defaultValue={actionData?.values?.type || 'preloved'}
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
                        <option value="Clothing">Clothing</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Home Decor">Home Decor</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Sports & Outdoor">Sports & Outdoor</option>
                        <option value="Toys & Games">Toys & Games</option>
                        <option value="School & Office">School & Office</option>
                        <option value="Adult Clothing">Adult Clothing</option>
                        <option value="Kids' Costumes">Kids' Costumes</option>
                        <option value="Others">Others</option>
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
                
                {/* Condition field shows only when "preloved" is selected in the form data */}
                {(!actionData?.values?.type || actionData?.values?.type === 'preloved') && (
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
                
                <div>
                    <button type="submit">Save New Listing</button>
                    <Link to={`/${user.role}/inventory`}>
                        <button type="button">Cancel</button>
                    </Link>
                </div>
            </Form>
        </div>
    );
}