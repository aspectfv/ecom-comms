import { useState, useContext } from 'react';
import { useLoaderData, Link, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Card, 
  Container, 
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider, 
  FormControl, 
  InputAdornment, 
  InputLabel, 
  MenuItem, 
  Paper, 
  Select, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TextField, 
  Typography,
  Avatar,
  Menu,
  MenuItem as MuiMenuItem
} from '@mui/material';
import {
    Search as SearchIcon,
    Clear as ClearIcon,
    Add as AddIcon,
    FileDownload as FileDownloadIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
    Edit as EditIcon,
    PictureAsPdf as PdfIcon
} from '@mui/icons-material';
import { deleteItem } from '../services/api';
import { SearchContext } from './Management';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Inventory() {
    const inventoryItems = useLoaderData();
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    const { searchParams, updateSearchParams } = useContext(SearchContext);
    const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    const [isDeleting, setIsDeleting] = useState(false);
    
    // Export menu state
    const [exportMenuAnchorEl, setExportMenuAnchorEl] = useState(null);
    const isExportMenuOpen = Boolean(exportMenuAnchorEl);

    // Add state for dialog control
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const categories = ['All Categories', ...new Set(inventoryItems.map(item => item.category))].filter(Boolean);

    const filteredItems = inventoryItems.filter(item => {
        const searchQuery = searchParams.get('q') || '';
        const matchesSearch = !searchQuery ||
            item.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.owner.toLowerCase().includes(searchQuery.toLowerCase());

        const categoryParam = searchParams.get('category') || '';
        const matchesCategory = !categoryParam || item.category === categoryParam;

        return matchesSearch && matchesCategory;
    });

    const handleSearch = (e) => {
        e.preventDefault();
        updateSearchParams('q', searchInput);
    };

    const handleSearchInputChange = (e) => {
        setSearchInput(e.target.value);
    };

    const handleCategoryChange = (e) => {
        const value = e.target.value === 'All Categories' ? '' : e.target.value;
        setSelectedCategory(value);
        updateSearchParams('category', value);
    };
    
    // Handle export menu
    const handleExportMenuOpen = (event) => {
        setExportMenuAnchorEl(event.currentTarget);
    };
    
    const handleExportMenuClose = () => {
        setExportMenuAnchorEl(null);
    };

    const handleExportCSV = () => {
        handleExportMenuClose();
        
        if (!filteredItems || filteredItems.length === 0) {
            alert('No items to export.');
            return;
        }

        const headers = ['ITEM CODE', 'ITEM NAME', 'CATEGORY', 'TYPE', 'PRICE', 'OWNER'];
        const rows = filteredItems.map(item => [
            item.itemCode,
            item.name,
            item.category,
            item.type === 'preloved' ? 'Pre-loved' : 'Brand New',
            `₱${item.price.toFixed(2)}`,
            item.owner
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'inventory_list.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const handleExportPDF = () => {
        handleExportMenuClose();
        
        if (!filteredItems || filteredItems.length === 0) {
            alert('No items to export.');
            return;
        }
        
        // Initialize PDF document
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(18);
        doc.text('Inventory List', 14, 20);
        
        // Add date
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 26);
        
        // Define table columns and rows
        const tableColumn = ['Item Code', 'Item Name', 'Category', 'Type', 'Price', 'Owner'];
        const tableRows = filteredItems.map(item => [
            item.itemCode,
            item.name,
            item.category,
            item.type === 'preloved' ? 'Pre-loved' : 'Brand New',
            `₱${item.price.toFixed(2)}`,
            item.owner
        ]);
        
        // Use the imported autoTable function directly
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 30,
            styles: { fontSize: 8, cellPadding: 3 },
            headStyles: { fillColor: [66, 66, 66] },
            alternateRowStyles: { fillColor: [245, 245, 245] }
        });
        
        // Add total count - note the different way to get the final Y position
        const finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) || 30;
        doc.text(`Total Items: ${filteredItems.length}`, 14, finalY + 10);
        
        // Save the PDF
        doc.save('inventory_list.pdf');
    };

    const handleClearFilters = () => {
        setSearchInput('');
        setSelectedCategory('');
        setSearchParams({});
    };

    // Handle viewing item details
    const handleViewItem = (itemId) => {
        navigate(`/${user.role}/item/${itemId}`);
    };

    // Step 1: Open dialog when delete button is clicked
    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setConfirmDialogOpen(true);
    };

    // Step 2: Cancel deletion and close dialog
    const handleCancelDelete = () => {
        setItemToDelete(null);
        setConfirmDialogOpen(false);
    };

    // Step 3: Confirm and execute deletion
    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;

        try {
            setIsDeleting(true);
            await deleteItem(itemToDelete.id);

            // Close dialog and refresh data
            setConfirmDialogOpen(false);
            setItemToDelete(null);

            // Refresh page to update inventory
            navigate(0);
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Failed to delete item. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    // Add a new handler for editing items
    const handleEditItem = (itemId, e) => {
        e.stopPropagation();
        navigate(`/${user.role}/edit-listing/${itemId}`);
    };

    return (
        <Container maxWidth={false} sx={{ p: 3 }}>
            {/* Inventory content */}
            <Card sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1" fontWeight={600}>
                        Inventory
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            onClick={handleExportMenuOpen}
                            startIcon={<FileDownloadIcon />}
                            variant="outlined"
                        >
                            Export
                        </Button>
                        <Menu
                            anchorEl={exportMenuAnchorEl}
                            open={isExportMenuOpen}
                            onClose={handleExportMenuClose}
                        >
                            <MuiMenuItem onClick={handleExportCSV}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <FileDownloadIcon fontSize="small" />
                                    <Typography>Export as CSV</Typography>
                                </Box>
                            </MuiMenuItem>
                            <MuiMenuItem onClick={handleExportPDF}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <PdfIcon fontSize="small" />
                                    <Typography>Export as PDF</Typography>
                                </Box>
                            </MuiMenuItem>
                        </Menu>
                        <Button
                            component={Link}
                            to={`/${user.role}/add-new-listing`}
                            startIcon={<AddIcon />}
                            variant="contained"
                            color="primary"
                        >
                            Add New Listing
                        </Button>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={selectedCategory || ''}
                            onChange={handleCategoryChange}
                            label="Category"
                        >
                            {categories.map((category, index) => (
                                <MenuItem key={index} value={category === 'All Categories' ? '' : category}>
                                    {category}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Inventory Table */}
                <TableContainer component={Paper} elevation={0}>
                    <Table>
                        <TableHead>
                            <TableRow>
                <TableCell>IMAGE</TableCell>
                                <TableCell>ITEM CODE</TableCell>
                                <TableCell>ITEM NAME</TableCell>
                                <TableCell>CATEGORY</TableCell>
                                <TableCell>TYPE</TableCell>
                                <TableCell>PRICE</TableCell>
                                <TableCell>OWNER</TableCell>
                                <TableCell>ACTIONS</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredItems.length > 0 ? (
                                filteredItems.map(item => (
                                    <TableRow 
                    key={item.id} 
                    hover
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      }
                    }}
                    onClick={() => handleViewItem(item.id)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Avatar
                        src={item.images && item.images.length > 0 ? item.images[0] : ''}
                        alt={item.name}
                        variant="rounded"
                        sx={{ width: 50, height: 50 }}
                      />
                    </TableCell>
                                        <TableCell>{item.itemCode}</TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.category}</TableCell>
                                        <TableCell>{item.type === 'preloved' ? 'Pre-loved' : 'Brand New'}</TableCell>
                                        <TableCell>₱{item.price.toFixed(2)}</TableCell>
                                        <TableCell>{item.owner}</TableCell>
                                        <TableCell onClick={(e) => e.stopPropagation()}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewItem(item.id);
                          }}
                          startIcon={<VisibilityIcon />}
                          color="primary"
                          size="small"
                          variant="outlined"
                        >
                          View
                        </Button>
                                              {user.role === 'admin' && (
                        <Button
                          onClick={(e) => handleEditItem(item.id, e)}
                          startIcon={<EditIcon />}
                          color="secondary"
                          size="small"
                          variant="outlined"
                        >
                          Edit
                        </Button>
                      )}
                                              <Button
                                                  onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(item);
                          }}
                                                  disabled={isDeleting}
                                                  startIcon={<DeleteIcon />}
                                                  color="error"
                                                  size="small"
                                              >
                                                  Delete
                                              </Button>
                      </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
                                        <Typography variant="body1" color="text.secondary">
                                            No items found matching the selected filters.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={confirmDialogOpen}
                onClose={handleCancelDelete}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete "{itemToDelete?.name}"?
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
