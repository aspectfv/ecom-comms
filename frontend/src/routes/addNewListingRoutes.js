import { redirect } from 'react-router-dom';
import { createItem, uploadImage, uploadImages } from '../services/api';

export const addNewListingAction = async ({ request }) => {
    try {
        const formData = await request.formData();

        // Add this after getting formData
        console.log("FormData contents:");
        formData.forEach((value, key) => {
            if (value instanceof File) {
                console.log(`${key}: File named ${value.name}, size: ${value.size} bytes, type: ${value.type}`);
            } else {
                console.log(`${key}: ${value}`);
            }
        });
                
        // Extract basic item data
        const itemData = {
            itemCode: formData.get('itemCode'),
            name: formData.get('name'),
            price: Number(formData.get('price')),
            owner: formData.get('owner'),
            type: formData.get('type'),
            category: formData.get('category'),
            description: formData.get('description'),
            condition: formData.get('condition') || undefined,
            images: [] // Initialize the images array
        };

        // Quick validation of essential numeric fields
        if (isNaN(itemData.price) || itemData.price <= 0) {
            return { 
                error: 'Price must be a valid positive number',
                values: itemData 
            };
        }

        // Handle image uploads if present
        const imageFiles = formData.getAll('images');

        if (imageFiles && imageFiles.length > 0 && imageFiles[0] instanceof File && imageFiles[0].size > 0) {
            try {
                // Upload images based on how many there are
                let response;
                
                if (imageFiles.length === 1) {
                    // Create FormData for single image
                    const imgFormData = new FormData();
                    imgFormData.append('image', imageFiles[0]);
                    response = await uploadImage(imgFormData);
                    itemData.images.push(response.data.imageUrl);

                    console.log("image ", response.data.imageUrl)
                } else {
                    // Create FormData for multiple images
                    const imgFormData = new FormData();
                    imageFiles.forEach(file => {
                        imgFormData.append('images', file);
                    });
                    response = await uploadImages(imgFormData);
                    itemData.images.push(...response.data.imageUrls);
                }
            } catch (error) {
                console.error('Error uploading images:', error);
                return { 
                    error: 'Failed to upload images. Please try again.',
                    values: itemData 
                };
            }
        }
        
        // Get the user's role for redirection
        const user = JSON.parse(localStorage.getItem('user'));
        
        // Send the API request to create the item
        const response = await createItem(itemData);
        
        // Redirect to the inventory page
        return redirect(`/${user.role}/inventory`);
    } catch (error) {
        console.error('Error creating item:', error);
        return { error: error.response?.data?.message || 'Failed to create item' };
    }
};