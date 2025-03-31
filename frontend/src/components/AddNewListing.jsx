import { Form, useActionData, Link, useNavigation, useSubmit } from 'react-router-dom';
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
  Alert
} from '@mui/material';
import { ArrowBack, CloudUpload, DeleteOutline } from '@mui/icons-material';

export default function AddNewListing() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const user = JSON.parse(localStorage.getItem('user'));
  const submit = useSubmit();
  const formRef = useRef(null);
  
  const [itemType, setItemType] = useState(actionData?.values?.type || 'preloved');
  const [previewImages, setPreviewImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]); // This will store the actual file objects
  const [imageUploadError, setImageUploadError] = useState('');
  
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
      
      // Check if user tried to upload more than 5 images
      if (filesArray.length > 5) {
        setImageUploadError('You can only upload up to 5 images. Only the first 5 images will be used.');
      }
      
      // Limit to 5 images
      const limitedFiles = filesArray.slice(0, 5);
      
      // Store the actual file objects for submission
      setSelectedFiles(limitedFiles);
      
      // Create preview URLs
      const imagesPreviews = limitedFiles.map(file => URL.createObjectURL(file));
      setPreviewImages(imagesPreviews);
    }
  };

  // Handle form submission to manually control what files are sent
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create a new FormData object
    const formData = new FormData(formRef.current);
    
    // Remove all existing files from the formData
    formData.delete('images');
    
    // Add only the selected files (max 5)
    selectedFiles.forEach(file => {
      formData.append('images', file);
    });
    
    // Submit the form with the manually created FormData
    submit(formData, {
      method: 'post',
      encType: 'multipart/form-data',
    });
  };
  
  // Optional: Add ability to remove individual previews
  const handleRemoveImage = (indexToRemove) => {
    setPreviewImages(prevImages => 
      prevImages.filter((_, index) => index !== indexToRemove)
    );
    setSelectedFiles(prevFiles => 
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h1">Add New Listing</Typography>
        <Button
          component={Link}
          to={`/${user.role}/inventory`}
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
          <Form ref={formRef} method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
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
                  defaultValue={actionData?.values?.itemCode || ''}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name"
                  id="name"
                  name="name"
                  defaultValue={actionData?.values?.name || ''}
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
                  defaultValue={actionData?.values?.price || ''}
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
                  defaultValue={actionData?.values?.owner || ''}
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
                    defaultValue={actionData?.values?.category || ''}
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
                  defaultValue={actionData?.values?.description || ''}
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
                    defaultValue={actionData?.values?.condition || ''}
                    multiline
                    rows={2}
                  />
                </Grid>
              )}

              {/* Image Upload */}
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
                
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  disabled={isSubmitting || previewImages.length >= 5}
                  sx={{ mb: 2 }}
                >
                  Upload Images
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
                  <strong>Maximum 5 images allowed.</strong> Currently selected: {previewImages.length}/5
                </FormHelperText>

                {/* Preview Images */}
                {previewImages.length > 0 && (
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 2, 
                    mt: 2,
                    flexWrap: 'wrap'
                  }}>
                    {previewImages.map((url, index) => (
                      <Box
                        key={index}
                        sx={{
                          position: 'relative',
                          width: 100,
                          height: 100,
                        }}
                      >
                        <Box
                          component="img"
                          src={url}
                          alt={`Preview ${index + 1}`}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: 1
                          }}
                        />
                        <Button
                          size="small"
                          color="error"
                          sx={{
                            position: 'absolute',
                            top: -10,
                            right: -10,
                            minWidth: 'auto',
                            width: 24,
                            height: 24,
                            p: 0,
                            bgcolor: 'background.paper',
                            borderRadius: '50%',
                          }}
                          onClick={() => handleRemoveImage(index)}
                        >
                          <DeleteOutline fontSize="small" />
                        </Button>
                      </Box>
                    ))}
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
                    {isSubmitting ? 'Saving...' : 'Save New Listing'}
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
