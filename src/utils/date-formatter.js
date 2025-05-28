/**
 * Date and time formatting utilities for Vietnamese locale
 */

// Format date to Vietnamese format (DD/MM/YYYY)
export const formatDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  }).format(d);
};

// Format time to Vietnamese format (HH:mm)
export const formatTime = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(d);
};

// Format date and time together
export const formatDateTime = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(d);
};

// Get current time string
export const getCurrentTime = () => {
  return formatTime(new Date());
};

// Get current date string
export const getCurrentDate = () => {
  return formatDate(new Date());
};

// Get current date-time string
export const getCurrentDateTime = () => {
  return formatDateTime(new Date());
};

// Calculate time difference in minutes
export const getTimeDifferenceInMinutes = (startTime, endTime = new Date()) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return Math.floor((end - start) / (1000 * 60));
};

// Format duration (in minutes) to readable format
export const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes} phút`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} giờ`;
  }
  
  return `${hours} giờ ${remainingMinutes} phút`;
};

// Check if date is today
export const isToday = (date) => {
  const today = new Date();
  const checkDate = new Date(date);
  
  return today.toDateString() === checkDate.toDateString();
};

// Check if date is yesterday
export const isYesterday = (date) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const checkDate = new Date(date);
  
  return yesterday.toDateString() === checkDate.toDateString();
};

// Get relative time description
export const getRelativeTime = (date) => {
  if (isToday(date)) {
    return `Hôm nay, ${formatTime(date)}`;
  } else if (isYesterday(date)) {
    return `Hôm qua, ${formatTime(date)}`;
  } else {
    return formatDateTime(date);
  }
};

// Generate date range for reports
export const getDateRange = (period) => {
  const today = new Date();
  const startDate = new Date();
  
  switch (period) {
    case 'today':
      return {
        start: formatDate(today),
        end: formatDate(today)
      };
    
    case 'yesterday':
      startDate.setDate(today.getDate() - 1);
      return {
        start: formatDate(startDate),
        end: formatDate(startDate)
      };
    
    case 'week':
      startDate.setDate(today.getDate() - 7);
      return {
        start: formatDate(startDate),
        end: formatDate(today)
      };
    
    case 'month':
      startDate.setMonth(today.getMonth() - 1);
      return {
        start: formatDate(startDate),
        end: formatDate(today)
      };
    
    case 'quarter':
      startDate.setMonth(today.getMonth() - 3);
      return {
        start: formatDate(startDate),
        end: formatDate(today)
      };
    
    default:
      return {
        start: formatDate(today),
        end: formatDate(today)
      };
  }
}; 