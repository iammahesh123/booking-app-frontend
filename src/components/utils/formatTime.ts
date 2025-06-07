// utils/formatTime.ts
export const formatTime = (timeString: string): string => {
  if (!timeString) return '';
  
  // Split the time string by colon
  const parts = timeString.split(':');
  
  // Return only hours and minutes
  return `${parts[0]}:${parts[1]}`;
};