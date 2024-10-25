// Inisialisasi peta
const map = L.map('map').setView([-6.914744, 107.609810], 13); // Koordinat Bandung

// Tambahkan layer dasar
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Data dummy untuk lokasi bangunan
const buildings = [
    { id: 1, name: "Building A", coords: [-6.914744, 107.609810] }, // Koordinat lokasi A
    { id: 2, name: "Building B", coords: [-6.917210, 107.609180] }  // Koordinat lokasi B
];

// Tambahkan marker untuk bangunan
buildings.forEach(building => {
    const marker = L.marker(building.coords).addTo(map);
    marker.bindPopup(building.name);
});

// Polygon dummy yang merepresentasikan area
const dummyPolygon = L.polygon([
    [-6.916500, 107.608500],
    [-6.916500, 107.610500],
    [-6.915500, 107.610500],
    [-6.915500, 107.608500]
]).addTo(map).bindPopup('Dummy Polygon Area');

// Fungsi untuk membuat buffer
function createBuffer(lat, lng, radius) {
    const bufferCircle = L.circle([lat, lng], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: radius // radius dalam meter
    }).addTo(map);
    
    return bufferCircle; // Mengembalikan objek buffer
}

// Fungsi untuk menampilkan informasi buffer di tabel
function updateBufferInfo(locationName, radius, intersection) {
    const bufferInfoTable = document.getElementById('buffer-info');
    const tbody = bufferInfoTable.querySelector('tbody');
    
    // Hapus baris sebelumnya
    tbody.innerHTML = '';
    
    // Buat baris baru untuk informasi buffer
    const row = tbody.insertRow();
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    
    cell1.innerHTML = locationName;
    cell2.innerHTML = radius;
    cell3.innerHTML = intersection
        ? `Buffer dengan radius ${radius} meter berpotongan dengan area polygon.`
        : `Buffer dengan radius ${radius} meter tidak berpotongan dengan area polygon.`;
    
    // Tampilkan tabel
    bufferInfoTable.style.display = 'table';
}

// Fungsi untuk memeriksa interseksi antara buffer dan polygon
function checkIntersection(buffer, polygon) {
    const bufferLatLng = buffer.getLatLng(); // Mendapatkan koordinat pusat buffer
    const bufferRadius = buffer.getRadius(); // Mendapatkan radius buffer

    // Mendapatkan titik-titik dari polygon
    const polygonLatLngs = polygon.getLatLngs()[0]; // Ambil titik-titik polygon

    // Cek apakah ada titik polygon yang berada dalam radius buffer
    return polygonLatLngs.some(latlng => {
        return bufferLatLng.distanceTo(latlng) <= bufferRadius;
    });
}

// Event listener untuk tombol buffer
document.getElementById('buffer-btn').addEventListener('click', () => {
    const selectedBuildingId = document.getElementById('building-select').value;
    
    // Pastikan ada bangunan yang dipilih
    if (selectedBuildingId) {
        const selectedBuilding = buildings.find(building => building.id == selectedBuildingId);
        const radius = 500; // Radius buffer dalam meter
        const bufferCircle = createBuffer(selectedBuilding.coords[0], selectedBuilding.coords[1], radius); // Menggunakan bangunan yang dipilih

        // Periksa interseksi antara buffer dan polygon
        const intersection = checkIntersection(bufferCircle, dummyPolygon);
        updateBufferInfo(selectedBuilding.name, radius, intersection); // Tampilkan informasi buffer di tabel
    } else {
        alert('Please select a building.');
    }
});
