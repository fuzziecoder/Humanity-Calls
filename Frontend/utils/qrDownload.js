/** Download an inline SVG (e.g. from react-qr-code) as a PNG file. */
export function downloadSvgAsPng(svgElement, filename = "qr-code.png") {
  if (!svgElement) return;

  const svgData = new XMLSerializer().serializeToString(svgElement);
  const rect = svgElement.getBoundingClientRect();
  const baseSize = Math.max(rect.width || 256, rect.height || 256);
  const scale = 4;
  const canvas = document.createElement("canvas");
  canvas.width = baseSize * scale;
  canvas.height = baseSize * scale;

  const img = new Image();
  img.onload = () => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
}
