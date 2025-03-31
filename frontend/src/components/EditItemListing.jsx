import { Form, useActionData, Link, useLoaderData, useNavigate, useSubmit } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { 
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Alert,
  ImageList,
  ImageListItem,
  IconButton
} from '@mui/material';
import { ArrowBack, CloudUpload, DeleteOutline } from '@mui/icons-material';

export default function EditItemListing() {
  const item = useLoaderData();
  const actionData = useActionData();
  const navigate = useNavigate();
  const submit = useSubmit();
  const formRef = useRef(null);
  
  const [itemType, setItemType] = useState(item.type || 'preloved');
  const [previewImages, setPreviewImages] = useState([]);
  const [existingImages, setExistingImages] = useState(item.images || []);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  
  // Initialize preview images from existing item images
  useEffect(() => {
    if (item.images && item.images.length > 0) {
      setExistingImages(item.images);
    }
  }, [item]);
  
  // Clear error message after 5 seconds
  useEffect(() => {
    if (imageUploadError) {
      const timer = setTimeout(() => {
        setImageUploadError('');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [imageUploadError]);
  
  const handleTypeChange = (e) => {
    setItemType(e.target.value);
  };
  
  const handleImageChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Check if combined total exceeds 5 images
      const totalImagesCount = existingImages.length + filesArray.length;
      if (totalImagesCount > 5) {
        setImageUploadError(`You can only have a total of 5 images. You currently have ${existingImages.length} and selected ${filesArray.length} more.`);
        
        // Calculate how many new files we can add
        const remainingSlots = Math.max(0, 5 - existingImages.length);
        const limitedFiles = filesArray.slice(0, remainingSlots);
        
        // Store the actual file objects for submission
        setSelectedFiles(limitedFiles);
        
        // Create preview URLs
        const imagesPreviews = limitedFiles.map(file => URL.createObjectURL(file));
        setPreviewImages(imagesPreviews);
        
        return;
      }
      
      // Store the actual file objects for submission
      setSelectedFiles(filesArray);
      
      // Create preview URLs
      const imagesPreviews = filesArray.map(file => URL.createObjectURL(file));
      setPreviewImages(imagesPreviews);
    }
  };
  
  // Handle removing an existing image
  const handleRemoveExistingImage = (indexToRemove) => {
    setExistingImages(prevImages => 
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };
  
  // Handle removing a new preview image
  const handleRemoveNewImage = (indexToRemove) => {
    setPreviewImages(prevImages => 
      prevImages.filter((_, index) => index !== indexToRemove)
    );
    setSelectedFiles(prevFiles => 
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };
  
  // Handle form submission with image changes
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Create a new FormData object
    const formData = new FormData(formRef.current);
    
    // Remove all existing files from the formData
    formData.delete('images');
    
    // Add only the selected files (considering total limit of 5)
    selectedFiles.forEach(file => {
      formData.append('images', file);
    });
    
    // Add a list of existing images to keep (important for backend processing)
    formData.append('existingImages', JSON.stringify(existingImages));
    
    // Submit the form with the manually created FormData
    submit(formData, {
      method: 'put',
      encType: 'multipart/form-data',
    });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h1">Edit Item Listing</Typography>
        <Button
          component={Link}
          to={`/${user?.role}/inventory`}
          startIcon={<ArrowBack />}
          sx={{ color: 'text.primary' }}
        >
          Back to Inventory
        </Button>
      </Box>

      {/* Status Messages */}
      {actionData?.error && (
        <Paper elevation={0} sx={{ 
          backgroundColor: 'error.light', 
          color: 'error.dark',
          p: 2,
          mb: 3
        }}>
          <Typography variant="body1">{actionData.error}</Typography>
        </Paper>
      )}
      
      {actionData?.success && (
        <Paper elevation={0} sx={{ 
          backgroundColor: 'success.light', 
          color: 'success.dark',
          p: 2,
          mb: 3
        }}>
          <Typography variant="body1">{actionData.success}</Typography>
        </Paper>
      )}

      {/* Form Section */}
      <Card>
        <CardContent>
          <Form ref={formRef} method="put" encType="multipart/form-data" onSubmit={handleSubmit}>
            <input type="hidden" name="id" value={item.id} />
            
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="h3" gutterBottom>
                  Basic Information
                </Typography>
                <Divider sx={{ mb: 3 }} />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Item Code"
                  id="itemCode"
                  name="itemCode"
                  defaultValue={item.itemCode}
                  InputProps={{
                    readOnly: true,
                  }}
                  disabled
                  helperText="Item code cannot be changed"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name"
                  id="name"
                  name="name"
                  defaultValue={item.name}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Price"
                  id="price"
                  name="price"
                  type="number"
                  defaultValue={item.price}
                  inputProps={{ step: "0.01", min: "0" }}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Owner"
                  id="owner"
                  name="owner"
                  defaultValue={item.owner}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="type-label">Type</InputLabel>
                  <Select
                    labelId="type-label"
                    id="type"
                    name="type"
                    value={itemType}
                    onChange={handleTypeChange}
                    label="Type"
                    required
                  >
                    <MenuItem value="preloved">Pre-loved</MenuItem>
                    <MenuItem value="brandnew">Brand New</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    id="category"
                    name="category"
                    defaultValue={item.category}
                    label="Category"
                    required
                  >
                    <MenuItem value="">Select a category</MenuItem>
                    <MenuItem value="Adult Clothing">Adult Clothing</MenuItem>
                    <MenuItem value="Clothing">Clothing</MenuItem>
                    <MenuItem value="Electronics">Electronics</MenuItem>
                    <MenuItem value="Furniture">Furniture</MenuItem>
                    <MenuItem value="Home & Lifestyle">Home & Lifestyle</MenuItem>
                    <MenuItem value="Home Decor">Home Decor</MenuItem>
                    <MenuItem value="Kids' Costumes">Kids' Costumes</MenuItem>
                    <MenuItem value="School & Office">School & Office</MenuItem>
                    <MenuItem value="Sports & Outdoor">Sports & Outdoor</MenuItem>
                    <MenuItem value="Toys & Games">Toys & Games</MenuItem>
                    <MenuItem value="Others">Others</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  id="description"
                  name="description"
                  defaultValue={item.description}
                  multiline
                  rows={4}
                />
              </Grid>

              {/* Condition (only for preloved) */}
              {itemType === 'preloved' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Condition"
                    id="condition"
                    name="condition"
                    defaultValue={item.condition}
                    multiline
                    rows={2}
                  />
                </Grid>
              )}

              {/* Image Management */}
              <Grid item xs={12}>
                <Typography variant="h3" gutterBottom>
                  Product Images
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                {/* Image upload error message */}
                {imageUploadError && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    {imageUploadError}
                  </Alert>
                )}
                
                {/* Total count information */}
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Current images: {existingImages.length} | New images: {previewImages.length} | Total: {existingImages.length + previewImages.length}/5
                </Typography>
                
                {/* Existing Images Section */}
                {existingImages.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>Current Images</Typography>
                    <ImageList cols={3} rowHeight={160} sx={{ mb: 2 }}>
                      {existingImages.map((imageUrl, index) => (
                        <ImageListItem key={index} sx={{ position: 'relative' }}>
                          <img
                            src={imageUrl}
                            alt={`Current item image ${index + 1}`}
                            loading="lazy"
                            style={{ height: '100%', objectFit: 'cover' }}
                          />
                          <IconButton
                            size="small"
                            color="error"
                            sx={{
                              position: 'absolute',
                              top: 5,
                              right: 5,
                              bgcolor: 'rgba(255,255,255,0.8)',
                              '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                            }}
                            onClick={() => handleRemoveExistingImage(index)}
                          >
                            <DeleteOutline />
                          </IconButton>
                        </ImageListItem>
                      ))}
                    </ImageList>
                  </Box>
                )}
                
                {/* New Image Upload Section */}
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  disabled={isSubmitting || existingImages.length + previewImages.length >= 5}
                  sx={{ mb: 2 }}
                >
                  Add New Images
                  <input
                    type="file"
                    id="images"
                    name="images"
                    accept="image/*"
                    onChange={handleImageChange}
                    multiple
                    hidden
                  />
                </Button>
                <FormHelperText>
                  Maximum 5 images total (existing + new).
                </FormHelperText>

                {/* Preview of New Images */}
                {previewImages.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" gutterBottom>New Images to Upload</Typography>
                    <ImageList cols={3} rowHeight={160}>
                      {previewImages.map((url, index) => (
                        <ImageListItem key={index} sx={{ position: 'relative' }}>
                          <img
                            src={url}
                            alt={`New image preview ${index + 1}`}
                            loading="lazy"
                            style={{ height: '100%', objectFit: 'cover' }}
                          />
                          <IconButton
                            size="small"
                            color="error"
                            sx={{
                              position: 'absolute',
                              top: 5,
                              right: 5,
                              bgcolor: 'rgba(255,255,255,0.8)',
                              '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                            }}
                            onClick={() => handleRemoveNewImage(index)}
                          >
                            <DeleteOutline />
                          </IconButton>
                        </ImageListItem>
                      ))}
                    </ImageList>
                  </Box>
                )}
              </Grid>

              {/* Form Actions */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
                  </Button>
                  <Button
                    component={Link}
                    to={`/${user.role}/inventory`}
                    variant="outlined"
                  >
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Form>
        </CardContent>
      </Card>
    </Container>
  );
}