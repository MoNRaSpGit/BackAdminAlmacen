import net from "net";

export const imprimirTicketPrueba = (req, res) => {
  const printerIP = "192.168.1.123";
  const printerPort = 9100;

  const mensaje = `
  =====================================
          🧾 TICKET DE PRUEBA
  =====================================
  Producto: Pan de campo
  Precio: $120
  Fecha: ${new Date().toLocaleString()}
  =====================================
  GRACIAS POR SU COMPRA 💚
  `;

  try {
    const client = new net.Socket();

    client.connect(printerPort, printerIP, () => {
      console.log("✅ Conectado a la impresora");
      client.write(mensaje + "\n\n\n");
      client.end();
      res.json({ success: true, message: "Ticket enviado a impresión" });
    });

    client.on("error", (err) => {
      console.error("❌ Error al conectar:", err);
      res.status(500).json({ success: false, error: err.message });
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
