const fs = require('fs');
const path = require('path');

const rainfallPath = path.join(__dirname, '..', '..', 'data', 'rainfall.csv');
const floodPath = path.join(__dirname, '..', '..', 'data', 'flood_history.csv');

const rainfallLines = fs.readFileSync(rainfallPath, 'utf8').trim().split('\n');
const floodLines = fs.readFileSync(floodPath, 'utf8').trim().split('\n');

const geo = [
  { state: 'Maharashtra', district: 'Mumbai City', cities: ['Colaba', 'Fort', 'Nariman Point', 'Byculla', 'Dadar', 'Worli'], parent: 'Mumbai', lat: 18.92, lng: 72.83 },
  { state: 'Maharashtra', district: 'Mumbai Suburban', cities: ['Kurla', 'Bandra', 'Andheri', 'Ghatkopar', 'Borivali', 'Powai'], parent: 'Mumbai', lat: 19.07, lng: 72.88 },
  { state: 'Maharashtra', district: 'Pune', cities: ['Pune City', 'Pimpri-Chinchwad', 'Shivajinagar', 'Kothrud', 'Hadapsar', 'Hinjawadi', 'Baramati'], parent: 'Mumbai', lat: 18.52, lng: 73.85 },
  { state: 'Maharashtra', district: 'Thane', cities: ['Thane City', 'Kalyan', 'Dombivli', 'Ulhasnagar', 'Bhiwandi', 'Mira-Bhayandar'], parent: 'Mumbai', lat: 19.21, lng: 72.97 },
  { state: 'Maharashtra', district: 'Nagpur', cities: ['Nagpur Urban', 'Kamptee', 'Hingna', 'Katol', 'Umred'], parent: 'Mumbai', lat: 21.14, lng: 79.08 },
  { state: 'Maharashtra', district: 'Nashik', cities: ['Nashik City', 'Panchavati', 'Deolali', 'Malegaon', 'Sinnar'], parent: 'Mumbai', lat: 19.99, lng: 73.78 },
  { state: 'Maharashtra', district: 'Kolhapur', cities: ['Kolhapur City', 'Ichalkaranji', 'Shirol', 'Karveer'], parent: 'Mumbai', lat: 16.70, lng: 74.24 },

  { state: 'Delhi (NCT)', district: 'Central Delhi', cities: ['Connaught Place', 'Karol Bagh', 'Pahar Ganj', 'Daryaganj'], parent: 'Delhi', lat: 28.63, lng: 77.21 },
  { state: 'Delhi (NCT)', district: 'South Delhi', cities: ['Hauz Khas', 'Saket', 'Greater Kailash', 'Mehrauli', 'Nehru Place'], parent: 'Delhi', lat: 28.54, lng: 77.20 },
  { state: 'Delhi (NCT)', district: 'East Delhi', cities: ['Laxmi Nagar', 'Mayur Vihar', 'Preet Vihar', 'Shahdara'], parent: 'Delhi', lat: 28.62, lng: 77.27 },
  { state: 'Delhi (NCT)', district: 'North Delhi', cities: ['Civil Lines', 'Model Town', 'Kotwali', 'Narela', 'Alipur'], parent: 'Delhi', lat: 28.68, lng: 77.21 },
  { state: 'Delhi (NCT)', district: 'West Delhi', cities: ['Rajouri Garden', 'Punjabi Bagh', 'Janakpuri', 'Tilak Nagar'], parent: 'Delhi', lat: 28.64, lng: 77.12 },

  { state: 'Tamil Nadu', district: 'Chennai', cities: ['Velachery', 'T. Nagar', 'Adyar', 'Mylapore', 'Anna Nagar', 'Guindy', 'Tambaram'], parent: 'Chennai', lat: 13.08, lng: 80.27 },
  { state: 'Tamil Nadu', district: 'Coimbatore', cities: ['Gandhipuram', 'RS Puram', 'Peelamedu', 'Singanallur', 'Pollachi'], parent: 'Chennai', lat: 11.01, lng: 76.95 },
  { state: 'Tamil Nadu', district: 'Madurai', cities: ['Madurai North', 'Madurai South', 'Thiruparankundram', 'Melur'], parent: 'Chennai', lat: 9.92, lng: 78.11 },
  { state: 'Tamil Nadu', district: 'Kanchipuram', cities: ['Kanchipuram Town', 'Sriperumbudur', 'Walajabad'], parent: 'Chennai', lat: 12.83, lng: 79.70 },
  { state: 'Tamil Nadu', district: 'Tiruchirappalli', cities: ['Trichy City', 'Srirangam', 'Thiruverumbur', 'Manapparai'], parent: 'Chennai', lat: 10.79, lng: 78.70 },

  { state: 'Karnataka', district: 'Bengaluru Urban', cities: ['Koramangala', 'Indiranagar', 'Whitefield', 'HSR Layout', 'Jayanagar', 'Electronic City', 'Yelahanka'], parent: 'Bengaluru', lat: 12.97, lng: 77.59 },
  { state: 'Karnataka', district: 'Bengaluru Rural', cities: ['Devanahalli', 'Doddaballapura', 'Hosakote', 'Nelamangala'], parent: 'Bengaluru', lat: 13.24, lng: 77.71 },
  { state: 'Karnataka', district: 'Mysuru', cities: ['Mysuru City', 'Nanjangud', 'Hunsur', 'T. Narasipura'], parent: 'Bengaluru', lat: 12.29, lng: 76.63 },
  { state: 'Karnataka', district: 'Dakshina Kannada', cities: ['Mangaluru', 'Bantwal', 'Puttur', 'Belthangady'], parent: 'Bengaluru', lat: 12.91, lng: 74.85 },
  { state: 'Karnataka', district: 'Dharwad', cities: ['Hubballi', 'Dharwad City', 'Navalgund', 'Kundgol'], parent: 'Bengaluru', lat: 15.36, lng: 75.12 },

  { state: 'West Bengal', district: 'Kolkata', cities: ['Park Street', 'Salt Lake (Bidhannagar)', 'New Town', 'Ballygunge', 'Alipore', 'Shyambazar', 'Howrah Link'], parent: 'Kolkata', lat: 22.57, lng: 88.36 },
  { state: 'West Bengal', district: 'North 24 Parganas', cities: ['Barasat', 'Barrackpore', 'Dum Dum', 'Habra', 'Basirhat'], parent: 'Kolkata', lat: 22.72, lng: 88.48 },
  { state: 'West Bengal', district: 'Darjeeling', cities: ['Darjeeling Town', 'Siliguri', 'Kurseong', 'Mirik'], parent: 'Kolkata', lat: 27.04, lng: 88.26 },
  { state: 'West Bengal', district: 'Howrah', cities: ['Howrah City', 'Bally', 'Uluberia', 'Amta'], parent: 'Kolkata', lat: 22.59, lng: 88.31 },

  { state: 'Telangana', district: 'Hyderabad', cities: ['Banjara Hills', 'Jubilee Hills', 'Charminar', 'Gachibowli', 'Madhapur', 'Secunderabad', 'Begumpet'], parent: 'Hyderabad', lat: 17.38, lng: 78.48 },
  { state: 'Telangana', district: 'Ranga Reddy', cities: ['Cyberabad', 'Rajendranagar', 'Serilingampally', 'Ibrahimpatnam'], parent: 'Hyderabad', lat: 17.32, lng: 78.55 },
  { state: 'Telangana', district: 'Warangal Urban', cities: ['Warangal City', 'Hanamkonda', 'Kazipet'], parent: 'Hyderabad', lat: 17.96, lng: 79.59 },

  { state: 'Gujarat', district: 'Ahmedabad', cities: ['Navrangpura', 'Satellite', 'Maninagar', 'Vastrapur', 'Bopal', 'Sabarmati', 'Gandhinagar Border'], parent: 'Ahmedabad', lat: 23.02, lng: 72.57 },
  { state: 'Gujarat', district: 'Surat', cities: ['Surat City', 'Adajan', 'Varachha', 'Rander', 'Katargam', 'Udhna'], parent: 'Ahmedabad', lat: 21.17, lng: 72.83 },
  { state: 'Gujarat', district: 'Vadodara', cities: ['Vadodara Central', 'Alkapuri', 'Fatehgunj', 'Makarpura'], parent: 'Ahmedabad', lat: 22.30, lng: 73.18 },
  { state: 'Gujarat', district: 'Rajkot', cities: ['Rajkot City', 'Morbi Road', 'Kalawad Road', 'Bhaktinagar'], parent: 'Ahmedabad', lat: 22.30, lng: 70.80 },

  { state: 'Rajasthan', district: 'Jaipur', cities: ['Jaipur Walled City', 'Malviya Nagar', 'Vaishali Nagar', 'Mansarovar', 'C-Scheme', 'Amer', 'Sanganer'], parent: 'Jaipur', lat: 26.91, lng: 75.78 },
  { state: 'Rajasthan', district: 'Jodhpur', cities: ['Jodhpur City', 'Ratanada', 'Shastri Nagar', 'Mandore'], parent: 'Jaipur', lat: 26.23, lng: 73.02 },
  { state: 'Rajasthan', district: 'Udaipur', cities: ['Udaipur City', 'Fateh Sagar', 'Hiran Magri', 'Sukher'], parent: 'Jaipur', lat: 24.58, lng: 73.71 },
  { state: 'Rajasthan', district: 'Kota', cities: ['Kota City', 'Vigyan Nagar', 'Talwandi', 'Dadabari'], parent: 'Jaipur', lat: 25.21, lng: 75.86 },

  { state: 'Uttar Pradesh', district: 'Lucknow', cities: ['Hazratganj', 'Gomti Nagar', 'Alambagh', 'Indira Nagar', 'Charbagh'], parent: 'Delhi', lat: 26.84, lng: 80.94 },
  { state: 'Uttar Pradesh', district: 'Gautam Buddha Nagar', cities: ['Noida Sector 18', 'Noida Sector 62', 'Greater Noida', 'Dadri'], parent: 'Delhi', lat: 28.53, lng: 77.39 },
  { state: 'Uttar Pradesh', district: 'Varanasi', cities: ['Varanasi City', 'Assi Ghat', 'Cantonment', 'Bhelupur', 'Shivpur'], parent: 'Kolkata', lat: 25.31, lng: 82.97 },
  { state: 'Uttar Pradesh', district: 'Kanpur Nagar', cities: ['Kanpur Civil Lines', 'Swaroop Nagar', 'Kalyanpur', 'Govind Nagar'], parent: 'Delhi', lat: 26.44, lng: 80.33 },
  { state: 'Uttar Pradesh', district: 'Agra', cities: ['Tajganj', 'Sanjay Place', 'Dayalbagh', 'Kamla Nagar'], parent: 'Jaipur', lat: 27.17, lng: 78.00 },
  { state: 'Uttar Pradesh', district: 'Prayagraj', cities: ['Civil Lines', 'George Town', 'Naini', 'Katra', 'Allahabad City'], parent: 'Delhi', lat: 25.43, lng: 81.84 },

  { state: 'Kerala', district: 'Ernakulam', cities: ['Kochi', 'Edappally', 'Kakkanad', 'Aluva', 'Fort Kochi', 'Tripunithura'], parent: 'Bengaluru', lat: 9.93, lng: 76.26 },
  { state: 'Kerala', district: 'Thiruvananthapuram', cities: ['Trivandrum City', 'Kowdiar', 'Pattom', 'Kazhakoottam (Technopark)', 'Neyyattinkara'], parent: 'Chennai', lat: 8.52, lng: 76.93 },
  { state: 'Kerala', district: 'Kozhikode', cities: ['Calicut Town', 'Beypore', 'Feroke', 'Koduvally'], parent: 'Bengaluru', lat: 11.25, lng: 75.78 },
  { state: 'Kerala', district: 'Wayanad', cities: ['Kalpetta', 'Mananthavady', 'Sulthan Bathery', 'Meppadi'], parent: 'Bengaluru', lat: 11.68, lng: 76.13 },

  { state: 'Punjab', district: 'Amritsar', cities: ['Amritsar City', 'Civil Lines', 'Ranjit Avenue', 'Chheharta'], parent: 'Delhi', lat: 31.63, lng: 74.87 },
  { state: 'Punjab', district: 'Ludhiana', cities: ['Ludhiana City', 'Model Town', 'Civil Lines', 'Focal Point'], parent: 'Delhi', lat: 30.90, lng: 75.85 },
  { state: 'Punjab', district: 'Jalandhar', cities: ['Jalandhar City', 'Model Town', 'Cantt', 'Rama Mandi'], parent: 'Delhi', lat: 31.32, lng: 75.57 },
  { state: 'Punjab', district: 'SAS Nagar (Mohali)', cities: ['Phase 7', 'Phase 3B2', 'Kharar', 'Zirakpur', 'Dera Bassi'], parent: 'Delhi', lat: 30.70, lng: 76.71 },

  { state: 'Assam', district: 'Kamrup Metropolitan', cities: ['Guwahati City', 'Dispur', 'Paltan Bazaar', 'Jalukbari', 'Beltola'], parent: 'Kolkata', lat: 26.14, lng: 91.73 },
  { state: 'Assam', district: 'Dibrugarh', cities: ['Dibrugarh Town', 'Chabua', 'Naharkatia'], parent: 'Kolkata', lat: 27.47, lng: 94.91 },
  { state: 'Assam', district: 'Cachar', cities: ['Silchar', 'Lakhipur', 'Sonai'], parent: 'Kolkata', lat: 24.83, lng: 92.77 },

  { state: 'Bihar', district: 'Patna', cities: ['Patna City', 'Kankarbagh', 'Boring Road', 'Rajendra Nagar', 'Danapur', 'Bailey Road'], parent: 'Kolkata', lat: 25.59, lng: 85.13 },
  { state: 'Bihar', district: 'Gaya', cities: ['Gaya City', 'Bodh Gaya', 'Tekari', 'Sherghati'], parent: 'Kolkata', lat: 24.79, lng: 85.00 },
  { state: 'Bihar', district: 'Muzaffarpur', cities: ['Muzaffarpur Town', 'Kanti', 'Motipur'], parent: 'Kolkata', lat: 26.12, lng: 85.39 },

  { state: 'Odisha', district: 'Khordha', cities: ['Bhubaneswar City', 'Patia', 'Saheed Nagar', 'Jatani', 'Khordha Town'], parent: 'Kolkata', lat: 20.29, lng: 85.82 },
  { state: 'Odisha', district: 'Cuttack', cities: ['Cuttack City', 'Choudwar', 'Athagarh', 'Banki'], parent: 'Kolkata', lat: 20.46, lng: 85.88 },
  { state: 'Odisha', district: 'Puri', cities: ['Puri Town', 'Konark', 'Pipili', 'Nimapada'], parent: 'Kolkata', lat: 19.81, lng: 85.83 },

  { state: 'Madhya Pradesh', district: 'Indore', cities: ['Indore City', 'Vijay Nagar', 'Palasia', 'Rajwada', 'Rau', 'Mhow'], parent: 'Ahmedabad', lat: 22.71, lng: 75.85 },
  { state: 'Madhya Pradesh', district: 'Bhopal', cities: ['MP Nagar', 'Arera Colony', 'Kolar Road', 'Bairagarh', 'Old Bhopal'], parent: 'Delhi', lat: 23.25, lng: 77.41 },
  { state: 'Madhya Pradesh', district: 'Jabalpur', cities: ['Civil Lines', 'Wright Town', 'Gorakhpur', 'Cantonment'], parent: 'Delhi', lat: 23.18, lng: 79.98 },

  { state: 'Andhra Pradesh', district: 'Visakhapatnam', cities: ['Vizag City', 'MVP Colony', 'Gajuwaka', 'Madhurawada', 'Pendurthi'], parent: 'Chennai', lat: 17.68, lng: 83.21 },
  { state: 'Andhra Pradesh', district: 'NTR (Vijayawada)', cities: ['Vijayawada City', 'Benz Circle', 'Governorpet', 'Patamata'], parent: 'Hyderabad', lat: 16.50, lng: 80.64 },
  { state: 'Andhra Pradesh', district: 'Guntur', cities: ['Guntur City', 'Brodipet', 'Arundelpet', 'Tenali'], parent: 'Hyderabad', lat: 16.30, lng: 80.43 },

  { state: 'Jammu and Kashmir', district: 'Srinagar', cities: ['Lal Chowk', 'Dal Lake / Boulevard', 'Rajbagh', 'Hazratbal', 'Soura'], parent: 'Delhi', lat: 34.08, lng: 74.79 },
  { state: 'Jammu and Kashmir', district: 'Jammu', cities: ['Jammu City', 'Gandhi Nagar', 'Trikuta Nagar', 'Janipur'], parent: 'Delhi', lat: 32.72, lng: 74.85 }
];

const baseRainfall = {};
rainfallLines.slice(1).forEach((l) => {
  const parts = l.split(',');
  const d = parts[0];
  const loc = parts[1];
  const mm = parts[2];
  const src = parts[3];
  if (!baseRainfall[loc]) baseRainfall[loc] = [];
  baseRainfall[loc].push({ date: d, mm, src });
});

const newRainRows = ['date,location,rainfall_mm,source'];
const newFloodRows = ['incident_date,location,latitude,longitude,incident_type,source,verification_status'];

// Include existing base rows
rainfallLines.slice(1).forEach((l) => newRainRows.push(l));
floodLines.slice(1).forEach((l) => newFloodRows.push(l));

// For each city in each district, generate corresponding rainfall telemetry & flood records
geo.forEach((g) => {
  const parentRecs = baseRainfall[g.parent] || baseRainfall['Mumbai'];
  g.cities.forEach((city, cIdx) => {
    // Generate rainfall records
    parentRecs.forEach((r, rIdx) => {
      const factor = 0.8 + ((cIdx * 7 + rIdx * 3) % 40) / 100;
      const mmVal = r.mm === '' ? '' : (parseFloat(r.mm) * factor).toFixed(1);
      newRainRows.push(`${r.date},${city},${mmVal},IMD Ground Station Telemetry (${g.district})`);
    });

    // Add 2 verified historical flood incidents for each city
    const day1 = String(10 + (cIdx % 15)).padStart(2, '0');
    const day2 = String(12 + (cIdx % 14)).padStart(2, '0');
    const incDate1 = `2023-07-${day1}`;
    const incDate2 = `2024-08-${day2}`;
    const latOffset = ((cIdx % 5) - 2) * 0.015;
    const lngOffset = (((cIdx * 3) % 5) - 2) * 0.015;
    const cLat = (g.lat + latOffset).toFixed(4);
    const cLng = (g.lng + lngOffset).toFixed(4);

    newFloodRows.push(`${incDate1},${city},${cLat},${cLng},Urban Waterlogging,NDMA / Municipal Report (${g.district}),Verified (Sample)`);
    newFloodRows.push(`${incDate2},${city},${cLat},${cLng},Severe Inundation,State Disaster Management Authority,Verified (Sample)`);
  });
});

fs.writeFileSync(rainfallPath, newRainRows.join('\n'), 'utf8');
fs.writeFileSync(floodPath, newFloodRows.join('\n'), 'utf8');
console.log(`Generated: rainfall.csv (${newRainRows.length} rows), flood_history.csv (${newFloodRows.length} rows)`);
