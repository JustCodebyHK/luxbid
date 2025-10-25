// INR currency formatting and countdown utilities
window.inr = function(amount){
  const n = Number(amount||0);
  return '₹' + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n);
}

window.formatDateTime = function(ts){
  const d = new Date(ts);
  return d.toLocaleString();
}

window.formatCountdown = function(deadlineTs){
  const diff = Math.max(0, deadlineTs - Date.now());
  const s = Math.floor(diff/1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  if (d>0) return `${d}d ${h}h ${m}m`;
  if (h>0) return `${h}h ${m}m ${ss}s`;
  if (m>0) return `${m}m ${ss}s`;
  return `${ss}s`;
}

window.selectImg = function(arr){
  if (Array.isArray(arr) && arr.length) return arr[0];
  return 'https://images.unsplash.com/photo-1505691723518-36a5ac3b2d95?q=80&w=1200&auto=format&fit=crop';
}
