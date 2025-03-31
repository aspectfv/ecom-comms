import { redirect } from 'react-router-dom';
import { getItemById, updateItem, uploadImage, uploadImages } from '../services/api';

export const editItemListingLoader = async ({ params }) => {
    try {
        // Check user authorization - admin only
        const userData = localStorage.getItem('user');
        if (!userData) {
            throw new Response('Unauthorized', { status: 401 });
        }

        const { role } = JSON.parse(userData);
        if (role !== 'admin') {
            throw new Response('Forbidden', { status: 403 });
        }

        // Fetch the item details
        const response = await getItemById(params.id);
        return response.data;
    } catch (error) {
        console.error('Error loading item for editing:', error);
        throw new Response('Failed to load item details', { status: 500 });
    }
};

export const editItemListingAction = async ({ request, params }) => {
    try {
        const formData = await request.formData();
        const itemId = params.id;

        // Extract basic item data
        const itemData = {
            name: formData.get('name'),
            price: Number(formData.get('price')),
            owner: formData.get('owner'),
            type: formData.get('type'),
            category: formData.get('category'),
            description: formData.get('description'),
            condition: formData.get('condition') || undefined,
        };

        // Get the existing images to keep
        const existingImagesJson = formData.get('existingImages');
        let existingImages = [];
        if (existingImagesJson) {
            try {
                existingImages = JSON.parse(existingImagesJson);
            } catch (e) {
                console.error('Error parsing existing images JSON:', e);
            }
        }

        // Set the images array with existing images
        itemData.images = [...existingImages];

        // Handle new image uploads if present
        const imageFiles = formData.getAll('images');
        const validImageFiles = imageFiles.filter(
            file => file instanceof File && file.size > 0
        );

        if (validImageFiles.length > 0) {
            try {
                let response;
                
                if (validImageFiles.length === 1) {
                    // Upload single image
                    const imgFormData = new FormData();
                    imgFormData.append('image', validImageFiles[0]);
                    response = await uploadImage(imgFormData);
                    itemData.images.push(response.data.imageUrl);
                } else {
                    // Upload multiple images
                    const imgFormData = new FormData();
                    validImageFiles.forEach(file => {
                        imgFormData.append('images', file);
                    });
                    response = await uploadImages(imgFormData);
                    itemData.images.push(...response.data.imageUrls);
                }
            } catch (error) {
                console.error('Error uploading new images:', error);
                return { 
                    error: 'Failed to upload new images. Please try again.',
                    values: itemData 
                };
            }
        }

        // Update the item with the API
        await updateItem(itemId, itemData);
        
        // Redirect back to inventory page
        const user = JSON.parse(localStorage.getItem('user'));
        return redirect(`/${user.role}/inventory`);
    } catch (error) {
        console.error('Error updating item:', error);
        return { 
            error: error.response?.data?.message || 'Failed to update item',
        };
    }
};