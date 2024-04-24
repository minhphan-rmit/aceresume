import { onCLS } from 'web-vitals';

function sendToAnalytics(metric:any) {
  console.log(metric);
  // Send to analytics endpoint as before
}

export function reportWebVitals() {
  onCLS(sendToAnalytics); // Updated method to measure Cumulative Layout Shift
}
