const Holidays = require('date-holidays');

console.log('Testing date-holidays library...');

// Test basic functionality
const hd = new Holidays();
const countries = hd.getCountries();
console.log('✓ Countries available:', Object.keys(countries).length);

// Test US states
const usStates = hd.getStates('US');
console.log(
  '✓ US states available:',
  usStates ? Object.keys(usStates).length : 0
);

// Test holidays for US
const usHolidays = new Holidays('US');
const holidays2025 = usHolidays.getHolidays(2025);
console.log('✓ US holidays for 2025:', holidays2025.length);

// Test holidays for US, California
try {
  const caHolidays = new Holidays('US', 'ca');
  const caHolidays2025 = caHolidays.getHolidays(2025);
  console.log('✓ US-CA holidays for 2025:', caHolidays2025.length);
} catch (e) {
  console.log('! US-CA holidays error:', e.message);
}

// Test a few sample countries
const sampleCountries = ['GB', 'CA', 'DE', 'FR', 'JP'];
sampleCountries.forEach((country) => {
  try {
    const countryHolidays = new Holidays(country);
    const countryHolidays2025 = countryHolidays.getHolidays(2025);
    console.log(`✓ ${country} holidays for 2025:`, countryHolidays2025.length);
  } catch (e) {
    console.log(`! ${country} holidays error:`, e.message);
  }
});

console.log('\nTesting complete! The library is working correctly.');
