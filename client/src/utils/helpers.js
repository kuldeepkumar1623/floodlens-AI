export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? 'Invalid Date' : d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const formatNumber = (num, decimals = 1) => {
  if (num === null || num === undefined || isNaN(num)) return 'N/A';
  return Number(num).toFixed(decimals);
};

export const getQualityColor = (label) => {
  const map = {
    'Sufficient': '#0d904f',
    'Partial': '#e37400',
    'Outdated': '#d93025',
    'Insufficient': '#d93025',
  };
  return map[label] || '#5f6368';
};

export const getQualityBgColor = (label) => {
  const map = {
    'Sufficient': '#e6f4ea',
    'Partial': '#fef7e0',
    'Outdated': '#fce8e6',
    'Insufficient': '#fce8e6',
  };
  return map[label] || '#f1f3f4';
};

export const getQualityIcon = (label) => {
  const map = {
    'Sufficient': '✅',
    'Partial': '⚠️',
    'Outdated': '⏳',
    'Insufficient': '❌',
  };
  return map[label] || '❓';
};
