const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const INPUT_JPG = 'C:/Users/mahmu/.gemini/antigravity/brain/9231ddca-14ed-4cd7-bc9a-23a403505783/.user_uploaded/media_1795030054404_0d37a3a5.jpg';
const OUTPUT_FULL = path.join(__dirname, '..', '..', 'frontend', 'public', 'logo.png');
const OUTPUT_ICON = path.join(__dirname, '..', '..', 'frontend', 'public', 'logo-icon.png');

async function processLogo() {
  try {
    if (!fs.existsSync(INPUT_JPG)) return;

    const { data, info } = await sharp(INPUT_JPG)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const W = info.width;
    const H = info.height;

    const cropX = Math.round(W * 0.22);
    const cropY = Math.round(H * 0.15);
    const cropW = Math.round(W * 0.56);
    const cropH = Math.round(H * 0.58);

    const cw = cropW;
    const ch = cropH;
    const buf = Buffer.alloc(cw * ch * 4);

    for (let y = 0; y < ch; y++) {
      for (let x = 0; x < cw; x++) {
        const srcIdx = ((cropY + y) * W + (cropX + x)) * 4;
        const dstIdx = (y * cw + x) * 4;
        buf[dstIdx] = data[srcIdx];
        buf[dstIdx + 1] = data[srcIdx + 1];
        buf[dstIdx + 2] = data[srcIdx + 2];
        buf[dstIdx + 3] = 255;
      }
    }

    // Compute Sobel gradient magnitude and luminance on cropped image
    const grad = new Float32Array(cw * ch);
    const lum = new Float32Array(cw * ch);
    for (let y = 0; y < ch; y++) {
      for (let x = 0; x < cw; x++) {
        const i = (y * cw + x) * 4;
        lum[y * cw + x] = 0.299 * buf[i] + 0.587 * buf[i + 1] + 0.114 * buf[i + 2];
      }
    }
    for (let y = 1; y < ch - 1; y++) {
      for (let x = 1; x < cw - 1; x++) {
        const gx =
          -lum[(y - 1) * cw + (x - 1)] + lum[(y - 1) * cw + (x + 1)] +
          -2 * lum[y * cw + (x - 1)] + 2 * lum[y * cw + (x + 1)] +
          -lum[(y + 1) * cw + (x - 1)] + lum[(y + 1) * cw + (x + 1)];
        const gy =
          -lum[(y - 1) * cw + (x - 1)] - 2 * lum[(y - 1) * cw + x] - lum[(y - 1) * cw + (x + 1)] +
          lum[(y + 1) * cw + (x - 1)] + 2 * lum[(y + 1) * cw + x] + lum[(y + 1) * cw + (x + 1)];
        grad[y * cw + x] = Math.sqrt(gx * gx + gy * gy) / 4.0;
      }
    }

    // Estimate smooth background across the crop box using empty regions
    const bgSamples = [];
    for (let y = 0; y < ch; y += 4) {
      const ny = y / ch;
      for (let x = 0; x < cw; x += 4) {
        const nx = x / cw;
        const isEmptyRegion =
          ny < 0.03 ||
          ny > 0.97 ||
          nx < 0.02 ||
          nx > 0.98 ||
          (nx < 0.26 && ny < 0.49) ||
          (nx > 0.74 && ny < 0.49) ||
          (nx < 0.31 && ny > 0.85) ||
          (nx > 0.70 && ny > 0.83) ||
          (ny >= 0.565 && ny <= 0.582) ||
          (ny >= 0.802 && ny <= 0.820 && nx > 0.22);

        if (isEmptyRegion) {
          const i = (y * cw + x) * 4;
          bgSamples.push({ nx, ny, r: buf[i], g: buf[i + 1], b: buf[i + 2] });
        }
      }
    }

    const GW = 33, GH = 33;
    const bgGridR = new Float32Array(GW * GH);
    const bgGridG = new Float32Array(GW * GH);
    const bgGridB = new Float32Array(GW * GH);

    for (let gy = 0; gy < GH; gy++) {
      const ny = gy / (GH - 1);
      for (let gx = 0; gx < GW; gx++) {
        const nx = gx / (GW - 1);
        let sumW = 0, sr = 0, sg = 0, sb = 0;
        for (const s of bgSamples) {
          const d2 = (nx - s.nx) * (nx - s.nx) + (ny - s.ny) * (ny - s.ny) + 0.002;
          const w = 1.0 / (d2 * d2);
          sumW += w;
          sr += s.r * w;
          sg += s.g * w;
          sb += s.b * w;
        }
        const gIdx = gy * GW + gx;
        bgGridR[gIdx] = sr / sumW;
        bgGridG[gIdx] = sg / sumW;
        bgGridB[gIdx] = sb / sumW;
      }
    }

    function getLocalBg(nx, ny) {
      const fx = Math.max(0, Math.min(GW - 1.001, nx * (GW - 1)));
      const fy = Math.max(0, Math.min(GH - 1.001, ny * (GH - 1)));
      const x0 = Math.floor(fx), y0 = Math.floor(fy);
      const tx = fx - x0, ty = fy - y0;
      const i00 = y0 * GW + x0;
      const i10 = i00 + 1;
      const i01 = i00 + GW;
      const i11 = i01 + 1;
      const w00 = (1 - tx) * (1 - ty);
      const w10 = tx * (1 - ty);
      const w01 = (1 - tx) * ty;
      const w11 = tx * ty;
      return [
        bgGridR[i00] * w00 + bgGridR[i10] * w10 + bgGridR[i01] * w01 + bgGridR[i11] * w11,
        bgGridG[i00] * w00 + bgGridG[i10] * w10 + bgGridG[i01] * w01 + bgGridG[i11] * w11,
        bgGridB[i00] * w00 + bgGridB[i10] * w10 + bgGridB[i01] * w01 + bgGridB[i11] * w11,
      ];
    }

    const isBg = new Uint8Array(cw * ch);
    const queue = new Int32Array(cw * ch);
    let qHead = 0, qTail = 0;

    function canBeBackground(x, y) {
      const nx = x / cw;
      const ny = y / ch;
      const idx = (y * cw + x) * 4;
      const r = buf[idx], g = buf[idx + 1], b = buf[idx + 2];

      // Gold pixels are NEVER background
      if (r - b >= 9 || (r > 85 && g > 70 && r - b >= 4)) return false;

      const [br, bg, bb] = getLocalBg(nx, ny);
      const dr = r - br, dg = g - bg, db = b - bb;
      const colorDist = Math.sqrt(dr * dr + dg * dg + db * db);
      const lumDiff = (r + g + b) - (br + bg + bb);
      const blueShift = (b - r) - (bb - br);

      if (grad[y * cw + x] > 13.5) return false;

      if (lumDiff < -10 && Math.abs(r - b) < 10 && blueShift < 4) {
        return true;
      }

      return colorDist < 11.5 && blueShift < 4.5;
    }

    function seed(x, y) {
      if (x < 0 || x >= cw || y < 0 || y >= ch) return;
      const p = y * cw + x;
      if (isBg[p]) return;
      isBg[p] = 1;
      queue[qTail++] = p;
    }

    // Seed outer borders and empty regions for emblem flood-fill
    for (let y = 0; y < ch; y++) {
      const ny = y / ch;
      for (let x = 0; x < cw; x++) {
        const nx = x / cw;
        if (
          x < 4 || x >= cw - 4 || y < 4 || y >= ch - 4 ||
          (nx < 0.27 && ny < 0.50) ||
          (nx < 0.335 && ny < 0.532) ||
          (nx < 0.448 && ny < 0.340 && (buf[(y * cw + x) * 4] - buf[(y * cw + x) * 4 + 2] < 10)) ||
          (nx > 0.74 && ny < 0.50) ||
          (ny >= 0.549 && ny <= 0.585)
        ) {
          seed(x, y);
        }
      }
    }

    const dx4 = [-1, 1, 0, 0];
    const dy4 = [0, 0, -1, 1];
    while (qHead < qTail) {
      const p = queue[qHead++];
      const x = p % cw;
      const y = (p - x) / cw;
      for (let d = 0; d < 4; d++) {
        const nx = x + dx4[d];
        const ny = y + dy4[d];
        if (nx >= 0 && nx < cw && ny >= 0 && ny < ch) {
          const np = ny * cw + nx;
          if (!isBg[np] && canBeBackground(nx, ny)) {
            isBg[np] = 1;
            queue[qTail++] = np;
          }
        }
      }
    }

    // Clean text section (ny >= 0.556):
    // First handle gold zones ("ŞAH" and "İNŞAAT")
    const gX0 = Math.round(cw * 0.440);
    const gX1 = Math.round(cw * 0.992);
    const gY0 = Math.round(ch * 0.604);
    const gY1 = Math.round(ch * 0.800);

    for (let y = Math.round(ch * 0.556); y < ch; y++) {
      const ny = y / ch;
      for (let x = 0; x < cw; x++) {
        const nx = x / cw;
        const p = y * cw + x;
        const idx = p * 4;
        const r = buf[idx], g = buf[idx + 1], b = buf[idx + 2];
        const isGoldText = (r - b >= 10 && r >= 65) || (r >= 110 && g >= 88 && r - b >= 5);

        if (y < gY0 || y >= gY1 || x < gX0 || x >= gX1) {
          isBg[p] = isGoldText ? 0 : 1;
        } else if (
          (nx >= 0.912 && nx <= 0.960 && ny >= 0.636 && ny <= 0.716 && r + g + b < 176) ||
          (nx >= 0.808 && nx <= 0.844 && ny >= 0.606 && ny <= 0.726 && r + g + b < 150)
        ) {
          // Inside counter-hole of P and inner U cavity
          isBg[p] = 1;
        } else {
          isBg[p] = 0; // Will be carved by edge-bounded cavity flood-fill below
        }
      }
    }

    // Edge-bounded flood-fill for "GROUP" box [gX0..gX1, gY0..gY1]:
    // Seed the perimeter of the GROUP box and the interior cavities of G, R, O, U, P,
    // and walk through smooth background / drop-shadow pixels until hitting the crisp 3D bevel edge (grad >= 9.0)
    const refSeedR = new Float32Array(cw * ch);
    const refSeedG = new Float32Array(cw * ch);
    const refSeedB = new Float32Array(cw * ch);
    qHead = 0;
    qTail = 0;

    function seedGroupBg(sx, sy, radius = 0) {
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const x = sx + dx, y = sy + dy;
          if (x < gX0 || x >= gX1 || y < gY0 || y >= gY1) continue;
          const p = y * cw + x;
          if (isBg[p]) continue;
          const idx = p * 4;
          isBg[p] = 1;
          refSeedR[p] = buf[idx];
          refSeedG[p] = buf[idx + 1];
          refSeedB[p] = buf[idx + 2];
          queue[qTail++] = p;
        }
      }
    }

    // Perimeter seeds around GROUP box
    for (let x = gX0; x < gX1; x++) {
      seedGroupBg(x, gY0, 0);
      seedGroupBg(x, gY1 - 1, 0);
    }
    for (let y = gY0; y < gY1; y++) {
      seedGroupBg(gX0, y, 0);
      seedGroupBg(gX1 - 1, y, 0);
    }

    // Interior cavity seeds for G, R, O, U, P and gaps between letters
    const cavitySeeds = [
      [0.495, 0.700], // Inside G bowl
      [0.520, 0.675], // Inside G upper opening
      [0.548, 0.620], // Gap above G-R
      [0.602, 0.665], // Inside R top loop
      [0.598, 0.770], // Inside R bottom arch
      [0.653, 0.630], // Gap between R and O (top)
      [0.653, 0.775], // Gap between R and O (bottom)
      [0.715, 0.700], // Inside O center hole
      [0.778, 0.775], // Gap between O and U (bottom)
      [0.825, 0.680], // Inside U cavity
      [0.888, 0.775], // Gap between U and P (bottom)
      [0.935, 0.665], // Inside P loop
      [0.945, 0.765], // Below P loop
    ];
    for (const [cnx, cny] of cavitySeeds) {
      seedGroupBg(Math.round(cw * cnx), Math.round(ch * cny), 2);
    }

    while (qHead < qTail) {
      const p = queue[qHead++];
      const x = p % cw;
      const y = (p - x) / cw;
      const pidx = p * 4;
      const pr = buf[pidx], pg = buf[pidx + 1], pb = buf[pidx + 2];
      const sr = refSeedR[p], sg = refSeedG[p], sb = refSeedB[p];

      for (let d = 0; d < 4; d++) {
        const nx = x + dx4[d];
        const ny = y + dy4[d];
        if (nx >= gX0 && nx < gX1 && ny >= gY0 && ny < gY1) {
          const np = ny * cw + nx;
          if (!isBg[np]) {
            const nidx = np * 4;
            const nr = buf[nidx], ng = buf[nidx + 1], nb = buf[nidx + 2];
            const stepDist = Math.abs(nr - pr) + Math.abs(ng - pg) + Math.abs(nb - pb);
            const seedLumDiff = (nr + ng + nb) - (sr + sg + sb);
            const seedBlueDiff = (nb - nr) - (sb - sr);

            // Traverse smooth background, stop at crisp 3D bevel edge (grad >= 8.8) or dark 3D letter extrusion
            if (
              grad[np] < 8.8 &&
              stepDist <= 10 &&
              seedLumDiff > -7.5 &&
              seedLumDiff < 11 &&
              seedBlueDiff < 4.2
            ) {
              isBg[np] = 1;
              // Update seed reference only when not deep in a dark shadow
              if (seedLumDiff > -8) {
                refSeedR[np] = sr * 0.85 + nr * 0.15;
                refSeedG[np] = sg * 0.85 + ng * 0.15;
                refSeedB[np] = sb * 0.85 + nb * 0.15;
              } else {
                refSeedR[np] = sr;
                refSeedG[np] = sg;
                refSeedB[np] = sb;
              }
              queue[qTail++] = np;
            }
          }
        }
      }
    }

    // Remove small isolated noise specks above the İNŞAAT line (preserve the dot on İ in İNŞAAT!)
    const visited = new Uint8Array(cw * ch);
    const comp = [];
    const maxCleanupY = Math.round(ch * 0.805);
    for (let p = 0; p < cw * maxCleanupY; p++) {
      if (!isBg[p] && !visited[p]) {
        comp.length = 0;
        visited[p] = 1;
        comp.push(p);
        let head = 0;
        while (head < comp.length) {
          const cur = comp[head++];
          const cx = cur % cw;
          const cy = (cur - cx) / cw;
          for (let d = 0; d < 4; d++) {
            const nx = cx + dx4[d], ny = cy + dy4[d];
            if (nx >= 0 && nx < cw && ny >= 0 && ny < maxCleanupY) {
              const np = ny * cw + nx;
              if (!isBg[np] && !visited[np]) {
                visited[np] = 1;
                comp.push(np);
              }
            }
          }
        }
        if (comp.length < 55) {
          for (const cp of comp) isBg[cp] = 1;
        }
      }
    }

    // Apply alpha with smooth edge feathering and brighten GROUP / dark slate fills for dark UI backgrounds
    for (let y = 0; y < ch; y++) {
      for (let x = 0; x < cw; x++) {
        const p = y * cw + x;
        const idx = p * 4;
        if (isBg[p]) {
          buf[idx + 3] = 0;
        } else {
          let bgNeighbors = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) continue;
              const xx = x + dx, yy = y + dy;
              if (xx < 0 || xx >= cw || yy < 0 || yy >= ch || isBg[yy * cw + xx]) {
                bgNeighbors++;
              }
            }
          }
          if (bgNeighbors >= 6) {
            buf[idx + 3] = 65;
          } else if (bgNeighbors >= 4) {
            buf[idx + 3] = 150;
          } else if (bgNeighbors >= 2) {
            buf[idx + 3] = 220;
          } else {
            buf[idx + 3] = 255;
          }

          // Boost brightness of the slate-blue "GROUP" letters & building fills so they stand out cleanly on dark backgrounds
          const r = buf[idx], g = buf[idx + 1], b = buf[idx + 2];
          if (b >= r && r < 145) {
            buf[idx] = Math.min(255, Math.round(r * 1.48 + 26));
            buf[idx + 1] = Math.min(255, Math.round(g * 1.48 + 30));
            buf[idx + 2] = Math.min(255, Math.round(b * 1.48 + 38));
          }
        }
      }
    }

    await sharp(buf, { raw: { width: cw, height: ch, channels: 4 } })
      .png()
      .toFile(OUTPUT_FULL);

    // Extract icon-only (emblem above text) from the cleaned buffer
    const iconLeft = Math.round(cw * 0.255);
    const iconTop = 0;
    const iconWidth = Math.round(cw * 0.50);
    const iconHeight = Math.round(ch * 0.556);

    await sharp(buf, { raw: { width: cw, height: ch, channels: 4 } })
      .extract({ left: iconLeft, top: iconTop, width: iconWidth, height: iconHeight })
      .png()
      .toFile(OUTPUT_ICON);

    console.log('✅ Şeffaf logo güncellendi (frontend/public/logo.png)');
  } catch (err) {
    console.error('Logo işleme hatası:', err.message);
  }
}

module.exports = processLogo;
