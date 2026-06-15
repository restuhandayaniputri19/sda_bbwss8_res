const WaGwAdmin = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">WhatsApp Gateway Admin</h1>
      {/* Konten admin WhatsApp Gateway */}
      <p>Fitur ini masih dalam pengembangan. Harap tunggu pembaruan selanjutnya.</p>
      <ol>
        <li className="mb-2">1. Tampilkan status connect/disconnect ke WA Server</li>
        <li className="mb-2">2. Tampilkan No Telepon WA yang sedang connected</li>
        <li className="mb-2">3. Tombol Disconnect</li>
        <li className="mb-2">4. Tombol Connect, QRCode, scann, connected / Failed</li>
        <li className="mb-2">5. Tampilkan Daftar Group terasosiasi dengan nomor yang aktif</li>
      </ol>
      <p>Status: Connected Number: +62 812-3456-7890 <button className="ml-4 px-3 py-1 bg-red-500 text-white rounded">Disconnect</button></p>
      <p>Status: Disconnected <button className="ml-4 px-3 py-1 bg-green-500 text-white rounded">Connect</button></p>
    </div>
  );
}

export default WaGwAdmin;