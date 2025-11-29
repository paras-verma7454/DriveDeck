async function fetchMakes(): Promise<string[]> {
  const res = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/GetAllManufacturers?format=json');
  const data = await res.json();
  // console.log("Make:",data.Results);
  const uniqueMakes = new Set<string>();
  data.Results.forEach((item: { Mfr_CommonName: string }) => {
    if (item.Mfr_CommonName) {
      uniqueMakes.add(item.Mfr_CommonName);
    }
  });
  return Array.from(uniqueMakes).sort();
}
function getYears(start = 2023, end = 1990): number[] {
  let years: number[] = [];
  for (let y = start; y >= end; y--) years.push(y);
  return years;
}
async function fetchModels(make: string, year: string): Promise<string[]> {
  const url = `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${make}?format=json`;
  const res = await fetch(url);
  const data = await res.json();
  // console.log("Model:",data);
  const uniqueModels = new Set<string>();
  data.Results.forEach((item: { Model_Name: string }) => {
    if (item.Model_Name) {
      uniqueModels.add(item.Model_Name);
    }
  });
  return Array.from(uniqueModels).sort();
}
