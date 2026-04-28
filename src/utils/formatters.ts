
/**
 * Formats a price number into a string with the appropriate currency symbol and code.
 * @param price The price to format
 * @param currency The currency code ('USD' | 'CAD')
 * @returns Formatted price string
 */
export const formatPrice = (price: number, currency: 'USD' | 'CAD' = 'USD') => {
  const formatter = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  let formatted = formatter.format(price);
  
  // For Canada, explicitly show CAD to reinforce the brand identity if desired
  if (currency === 'CAD') {
    return `${formatted} CAD`;
  }
  
  return formatted;
};
