export function getInstagramUrl(input) {
  if (!input || !input.trim()) return '';
  const val = input.trim();
  if (val.startsWith('http://') || val.startsWith('https://')) return val;
  const username = val
    .replace(/^@/, '')
    .replace(/^(www\.)?instagram\.com\//i, '')
    .replace(/\/+$/, '');
  return username ? `https://www.instagram.com/${username}` : '';
}

export function getInstagramHandle(input) {
  if (!input || !input.trim()) return '';
  return input
    .trim()
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
    .replace(/^@/, '')
    .replace(/\/+$/, '');
}

export function getFacebookUrl(input) {
  if (!input || !input.trim()) return '';
  const val = input.trim();
  if (val.startsWith('http://') || val.startsWith('https://')) return val;
  const username = val
    .replace(/^@/, '')
    .replace(/^(www\.)?facebook\.com\//i, '')
    .replace(/\/+$/, '');
  return username ? `https://www.facebook.com/${username}` : '';
}

export function getFacebookHandle(input) {
  if (!input || !input.trim()) return '';
  return input
    .trim()
    .replace(/^https?:\/\/(www\.)?facebook\.com\//i, '')
    .replace(/^@/, '')
    .replace(/\/+$/, '');
}

export function getWhatsappNumber(input, fallbackPhone = '') {
  const raw = (input && input.trim()) ? input : fallbackPhone;
  if (!raw) return '905001234567';
  let digits = raw.replace(/\D/g, '');
  if (!digits) return '905001234567';
  // 05xx xxx xx xx (11 haneli) -> 905xxxxxxxxx
  if (digits.length === 11 && digits.startsWith('0')) {
    digits = '90' + digits.slice(1);
  }
  // 5xx xxx xx xx (10 haneli) -> 905xxxxxxxxx
  else if (digits.length === 10 && digits.startsWith('5')) {
    digits = '90' + digits;
  }
  return digits;
}

export function getWhatsappUrl(input, fallbackPhone = '') {
  const num = getWhatsappNumber(input, fallbackPhone);
  return `https://wa.me/${num}`;
}

