// Finds location (GPS) data and other photo metadata in an image file.
// Used by check-content (content/photos/) and check-site (out/).
// JPEG, PNG and WebP are read properly. AVIF is only searched for an Exif block, since
// build-images never writes one; any Exif block in an AVIF is reported.

const XMP_GPS = /GPS(?:Latitude|Longitude)/;

/** Does the TIFF block (inside Exif) at `start` point to a GPS directory? */
function tiffHasGps(buf, start) {
  if (start + 8 > buf.length) return false;
  const order = buf.toString("latin1", start, start + 2);
  if (order !== "II" && order !== "MM") return false;
  const le = order === "II";
  const u16 = (o) => (le ? buf.readUInt16LE(o) : buf.readUInt16BE(o));
  const u32 = (o) => (le ? buf.readUInt32LE(o) : buf.readUInt32BE(o));
  const ifd0 = start + u32(start + 4);
  if (ifd0 + 2 > buf.length) return false;
  const count = u16(ifd0);
  for (let i = 0; i < count; i += 1) {
    const entry = ifd0 + 2 + i * 12;
    if (entry + 12 > buf.length) break;
    if (u16(entry) === 0x8825) return true; // GPSInfo
  }
  return false;
}

function jpegHasGps(buf) {
  let o = 2;
  while (o + 4 <= buf.length && buf[o] === 0xff) {
    const marker = buf[o + 1];
    if (marker === 0xda || marker === 0xd9) break; // image data starts: no more metadata
    const length = buf.readUInt16BE(o + 2);
    const data = o + 4;
    if (marker === 0xe1) {
      if (buf.toString("latin1", data, data + 6) === "Exif\0\0" && tiffHasGps(buf, data + 6))
        return true;
      if (XMP_GPS.test(buf.toString("latin1", data, data + length - 2))) return true;
    }
    o += 2 + length;
  }
  return false;
}

function pngHasGps(buf) {
  let o = 8;
  while (o + 8 <= buf.length) {
    const length = buf.readUInt32BE(o);
    const type = buf.toString("latin1", o + 4, o + 8);
    const data = o + 8;
    if (type === "eXIf" && tiffHasGps(buf, data)) return true;
    if (
      (type === "iTXt" || type === "tEXt") &&
      XMP_GPS.test(buf.toString("latin1", data, data + length))
    ) {
      return true;
    }
    if (type === "IEND") break;
    o = data + length + 4;
  }
  return false;
}

function webpHasGps(buf) {
  let o = 12;
  while (o + 8 <= buf.length) {
    const type = buf.toString("latin1", o, o + 4);
    const length = buf.readUInt32LE(o + 4);
    const data = o + 8;
    if (type === "EXIF") {
      const start = buf.toString("latin1", data, data + 6) === "Exif\0\0" ? data + 6 : data;
      if (tiffHasGps(buf, start)) return true;
    }
    if (type === "XMP " && XMP_GPS.test(buf.toString("latin1", data, data + length))) return true;
    o = data + length + (length % 2);
  }
  return false;
}

/** Returns a short reason if the image carries location or Exif data, otherwise null. */
export function locationProblem(buf) {
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8) {
    return jpegHasGps(buf) ? "contains a GPS location" : null;
  }
  if (buf.toString("latin1", 1, 4) === "PNG") {
    return pngHasGps(buf) ? "contains a GPS location" : null;
  }
  if (buf.toString("latin1", 0, 4) === "RIFF" && buf.toString("latin1", 8, 12) === "WEBP") {
    return webpHasGps(buf) ? "contains a GPS location" : null;
  }
  if (buf.toString("latin1", 4, 8) === "ftyp") {
    return buf.includes("Exif") ? "contains Exif data (camera details, possibly a location)" : null;
  }
  return null;
}
