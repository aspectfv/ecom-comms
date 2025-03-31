const categoryMap = {
  'Adult Clothing': 'AC',
  'Clothing': 'CL', 
  'Electronics': 'EL',
  'Furniture': 'FU',
  'Home & Lifestyle': 'HL',
  'Home Decor': 'HD',
  'Kids\' Costumes': 'KC',
  'School & Office': 'SO',
  'Sports & Outdoor': 'SP',
  'Toys & Games': 'TG',
  'Others': 'OT'
};

const validCategories = Object.keys(categoryMap);

const getCategoryPrefix = (category) => {
  // Return the mapped prefix or first two letters if not in map
  return categoryMap[category] || category.substring(0, 2).toUpperCase();
};

module.exports = {
  getCategoryPrefix,
  categoryMap,        
  validCategories     
};