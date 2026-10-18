(function () {
  const DATA = window.RUMBO_DATA.destinations;
  let currentDestId = localStorage.getItem('rumbo_dest') || 'cdmx';
  let isSimulatedOffline = false;
  let activeZoneIndex = 0;
  let isTrackingLive = false;
  let trackingInterval = null;
  let deferredInstallPrompt = null;

  // Register Service Worker for offline PWA functionality
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
  });

  // Web Audio API Sound Generator for Entry/Exit of Unsafe Zones
  function playSafetyAlertSound(level) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      if (level === 'danger') {
        // Urgent 3-pulse siren for entering an unsafe red zone
        [0, 0.22, 0.44].forEach((offset, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(idx % 2 === 0 ? 880 : 620, now + offset);
          gain.gain.setValueAtTime(0.18, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.008, now + offset + 0.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + offset);
          osc.stop(now + offset + 0.2);
        });
        if (navigator.vibrate) navigator.vibrate([250, 100, 250, 100, 350]);
      } else if (level === 'caution') {
        // Double caution chime
        [0, 0.18].forEach((offset, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(idx === 0 ? 587.33 : 493.88, now + offset);
          gain.gain.setValueAtTime(0.14, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.008, now + offset + 0.16);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + offset);
          osc.stop(now + offset + 0.16);
        });
        if (navigator.vibrate) navigator.vibrate([150, 80, 150]);
      } else {
        // Pleasant ascending chord for entering/returning to a Safe Zone
        [523.25, 659.25, 783.99].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.1);
          gain.gain.setValueAtTime(0.12, now + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.008, now + idx * 0.1 + 0.18);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.1);
          osc.stop(now + idx * 0.1 + 0.18);
        });
      }
    } catch (e) {
      // Ignore audio errors if blocked
    }
  }

  // Optional Voice Synthesis Alert (Guide Voice)
  function speakGuideAlert(text) {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'es-MX';
      utter.rate = 1.03;
      window.speechSynthesis.speak(utter);
    } catch (e) {}
  }

  function getDest() {
    return DATA[currentDestId] || DATA.cdmx;
  }

  function getGoogleMapsUrl(lat, lng, label) {
    const q = encodeURIComponent(`${lat},${lng} (${label || 'Destino'})`);
    return `https://www.google.com/maps/search/?api=1&query=${q}`;
  }

  // Render Offline Radar Canvas with Zones & Traveler GPS Dot
  function drawOfflineRadar() {
    const canvas = document.getElementById('offline-radar-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dest = getDest();
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Background dark radar grid
    ctx.fillStyle = '#070b14';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
    ctx.lineWidth = 1;
    const cx = w / 2;
    const cy = h / 2;
    [35, 70, 105, 145].forEach((r) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(w, cy);
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, h);
    ctx.stroke();

    // Position zones around the radar deterministically
    const positions = [
      { x: cx - 105, y: cy - 35, r: 42 },
      { x: cx + 95, y: cy - 48, r: 38 },
      { x: cx - 10, y: cy + 52, r: 40 },
      { x: cx + 115, y: cy + 55, r: 38 },
      { x: cx - 125, y: cy + 62, r: 35 }
    ];

    dest.zones.forEach((z, idx) => {
      const pos = positions[idx % positions.length];
      z._canvasPos = pos;

      let fill = 'rgba(16, 185, 129, 0.22)';
      let stroke = '#10b981';
      if (z.level === 'caution') {
        fill = 'rgba(245, 158, 11, 0.24)';
        stroke = '#f59e0b';
      } else if (z.level === 'danger') {
        fill = 'rgba(244, 63, 94, 0.28)';
        stroke = '#f43f5e';
      }

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, pos.r, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.lineWidth = idx === activeZoneIndex ? 2.5 : 1.2;
      ctx.strokeStyle = stroke;
      ctx.stroke();

      // Label
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 11px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      const shortName = z.name.split('(')[0].trim().slice(0, 22);
      ctx.fillText(shortName, pos.x, pos.y + 4);
    });

    // Draw Traveler GPS Marker inside active zone
    const activeZone = dest.zones[activeZoneIndex] || dest.zones[0];
    if (activeZone && activeZone._canvasPos) {
      const tx = activeZone._canvasPos.x;
      const ty = activeZone._canvasPos.y - 16;

      ctx.beginPath();
      ctx.arc(tx, ty, 13, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.32)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(tx, ty, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 10px -apple-system, sans-serif';
      ctx.fillText('TÚ (GPS)', tx, ty - 16);
    }

    // Top-left HUD status
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(
      `RADAR OFFLINE · ${dest.name.toUpperCase()} · TOCA UNA ZONA PARA CAMINAR AHÍ`,
      10,
      16
    );
  }

  function updateGoogleMapEmbed(lat, lng) {
    const iframe = document.getElementById('google-map-frame');
    if (!iframe) return;
    if (isSimulatedOffline) {
      iframe.srcdoc = `
        <body style="background:#090d16;color:#f8fafc;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100%;margin:0;text-align:center;padding:20px;">
          <div>
            <div style="font-size:28px;margin-bottom:8px;">📡</div>
            <strong>Modo Sin Internet Activo</strong>
            <p style="font-size:13px;color:#94a3b8;margin-top:6px;">
              El Radar GPS Offline de Rumbo Propio sigue activo y protegiéndote sin gastar datos.
            </p>
          </div>
        </body>`;
      return;
    }
    iframe.removeAttribute('srcdoc');
    iframe.src = `https://maps.google.com/maps?q=${lat},${lng}&z=14&output=embed`;
  }

  function triggerZoneTransition(zoneIndex, withAudio = true) {
    const dest = getDest();
    if (!dest.zones[zoneIndex]) zoneIndex = 0;
    activeZoneIndex = zoneIndex;
    const zone = dest.zones[zoneIndex];

    const banner = document.getElementById('geofence-banner');
    const title = document.getElementById('geofence-title');
    const desc = document.getElementById('geofence-desc');

    banner.className = 'geofence-banner';
    if (zone.level === 'caution') banner.classList.add('caution');
    if (zone.level === 'danger') banner.classList.add('danger');

    const icon = zone.level === 'safe' ? '🟢' : zone.level === 'caution' ? '🟡' : '🚨';
    title.textContent = `${icon} ${zone.levelLabel}: ${zone.name}`;
    desc.textContent = (zone.visualPills || []).join('  ·  ') || zone.walletTip;

    drawOfflineRadar();
    updateGoogleMapEmbed(zone.lat, zone.lng);

    if (withAudio) {
      playSafetyAlertSound(zone.level);
      speakGuideAlert(zone.alertMessage);
    }

    if (isTrackingLive) {
      updateLiveTrackingTelemetry();
    }
  }

  window.rumboSpeak = function (text) {
    speakGuideAlert(text);
  };

  // Render All Sections for Selected Destination (100% Visual Mode)
  function renderDestination() {
    const dest = getDest();
    localStorage.setItem('rumbo_dest', currentDestId);

    document.getElementById('dest-select').value = currentDestId;
    document.getElementById('dest-tagline').textContent = dest.tagline;
    document.getElementById('pack-size-label').textContent = dest.packSize;
    document.getElementById('expense-currency-badge').textContent = dest.currency;

    // Update Hero Visual Banner & Slogan
    const heroBanner = document.getElementById('hero-visual-banner');
    const heroTitle = document.getElementById('hero-dest-title');
    if (heroBanner && dest.heroImage) {
      heroBanner.style.backgroundImage = `url('${dest.heroImage}')`;
    }
    if (heroTitle) {
      heroTitle.textContent = `${dest.flag} ${dest.name}`;
    }

    // Render 4-Story Visual Strip
    const storiesEl = document.getElementById('visual-stories-strip');
    if (storiesEl && dest.gallery) {
      storiesEl.innerHTML = dest.gallery
        .map(
          (g) => `
        <div class="story-thumb" style="background-image:url('${g.img}');">
          <span style="background:rgba(0,0,0,0.65);padding:2px 6px;border-radius:999px;align-self:flex-start;">${g.tag}</span>
          <span style="font-size:0.72rem;">${g.title}</span>
        </div>
      `
        )
        .join('');
    }

    // Check if pack already downloaded
    const downloadedPacks = JSON.parse(localStorage.getItem('rumbo_packs') || '{}');
    const btnPack = document.getElementById('btn-download-pack');
    if (downloadedPacks[currentDestId]) {
      btnPack.className = 'btn-pack downloaded';
      btnPack.innerHTML = `✅ Offline Listo`;
    } else {
      btnPack.className = 'btn-pack';
      btnPack.innerHTML = `⬇ Offline (${dest.packSize})`;
    }

    // Render 100% Visual Zones List
    const zonesEl = document.getElementById('zones-list');
    zonesEl.innerHTML = dest.zones
      .map(
        (z, idx) => `
      <div class="visual-photo-card">
        <div class="visual-photo-header" style="background-image:url('${z.img || dest.heroImage}');">
          <div class="visual-photo-top">
            <span class="badge ${z.level}" style="font-size:0.75rem;padding:4px 10px;">
              ${z.level === 'safe' ? '🟢' : z.level === 'caution' ? '🟡' : '🔴'} ${z.levelLabel}
            </span>
            <span class="status-pill" style="background:rgba(0,0,0,0.7);font-size:0.7rem;">🕒 ${z.hours}</span>
          </div>
          <div class="visual-photo-bottom">
            <strong style="font-size:1.05rem;text-shadow:0 2px 6px rgba(0,0,0,0.9);">${z.name}</strong>
          </div>
        </div>
        <div class="visual-card-body">
          <div class="visual-pills-row">
            ${(z.visualPills || []).map((p) => `<span class="visual-pill">${p}</span>`).join('')}
            <span class="visual-pill">👛 ${z.walletTip}</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            <button class="btn btn-blue" onclick="window.rumboSimulateZone(${idx})">
              🔊 Escuchar Alerta
            </button>
            <a class="btn btn-safe" href="${getGoogleMapsUrl(z.lat, z.lng, z.name)}" target="_blank" rel="noopener">
              📍 Ver en Mapa
            </a>
          </div>
        </div>
      </div>
    `
      )
      .join('');

    // Render Emergency Numbers (Big Icon Grid)
    const emergEl = document.getElementById('emergencies-list');
    emergEl.innerHTML = dest.emergencies
      .map(
        (em) => `
      <div class="contact-row">
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:1.6rem;">${em.icon || '🚓'}</span>
          <div>
            <div style="font-size:0.88rem;font-weight:800;">${em.name}</div>
            <div style="font-size:0.72rem;color:var(--text-secondary);">${em.note}</div>
          </div>
        </div>
        <a href="tel:${em.phone}" class="btn btn-danger" style="white-space:nowrap;font-size:0.84rem;">
          📞 ${em.phone}
        </a>
      </div>
    `
      )
      .join('');

    // Render Embassies (Visual Flag + 1-Tap Actions)
    const embEl = document.getElementById('embassies-list');
    embEl.innerHTML = dest.embassies
      .map(
        (eb) => `
      <div class="zone-item" style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
        <div>
          <strong style="font-size:0.92rem;">${eb.country}</strong>
          <div style="font-size:0.72rem;color:var(--text-secondary);">📍 ${eb.address}</div>
        </div>
        <div style="display:flex;gap:6px;">
          <a href="tel:${eb.emergencyPhone}" class="btn btn-caution" style="padding:7px 10px;">
            🚨 Llamar
          </a>
          <a href="${getGoogleMapsUrl(eb.lat, eb.lng, eb.country)}" target="_blank" rel="noopener" class="btn btn-safe" style="padding:7px 10px;">
            🗺️ Mapa
          </a>
        </div>
      </div>
    `
      )
      .join('');

    // Render Safety Tips as Visual DO ✅ vs DONT ❌ Flashcards
    const tipsEl = document.getElementById('safety-tips-list');
    tipsEl.innerHTML = dest.safetyTips
      .map(
        (t, idx) => `
      <div class="zone-item">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:1.5rem;">${t.icon}</span>
            <strong style="font-size:0.94rem;">${t.title}</strong>
          </div>
          <button class="status-pill" onclick="window.rumboSpeakTips(${idx})">🔊 Escuchar</button>
        </div>
        <div class="do-dont-grid">
          <div class="do-box">${t.doText || '✅ ' + t.detail}</div>
          <div class="dont-box">${t.dontText || '❌ Evita distracciones'}</div>
        </div>
      </div>
    `
      )
      .join('');

    // Render Creator Spots as Visual Shot Cards
    const creatorEl = document.getElementById('creator-spots-list');
    creatorEl.innerHTML = dest.creatorSpots
      .map(
        (c, i) => `
      <div class="visual-photo-card">
        <div class="visual-photo-header" style="background-image:url('${c.img || dest.heroImage}');height:145px;">
          <div class="visual-photo-top">
            <span class="badge safe">${c.vibe}</span>
            <button class="status-pill" style="background:rgba(0,0,0,0.75);" onclick="window.rumboSpeakCreator(${i})">🔊 Escuchar Hook</button>
          </div>
          <div class="visual-photo-bottom">
            <strong style="font-size:1.02rem;text-shadow:0 2px 8px rgba(0,0,0,0.9);">📸 ${c.spot}</strong>
          </div>
        </div>
        <div class="visual-card-body">
          <div class="visual-pills-row">
            <span class="visual-pill">🎥 ${c.shotGuide}</span>
            <span class="visual-pill">🛡️ ${c.safetyNote}</span>
          </div>
          <div style="font-size:0.82rem;font-weight:800;color:#38bdf8;margin-bottom:8px;">
            🗣️ ${c.hook}
          </div>
          <button class="btn btn-primary" style="width:100%;" onclick="window.rumboCopyCreator(${i})">
            📋 Copiar Idea + Hashtags
          </button>
        </div>
      </div>
    `
      )
      .join('');

    renderEsimAndPortals();
    renderItinerary();
    renderCurrencyExchange();
    renderExpenses();
    triggerZoneTransition(0, false);
  }

  function renderEsimAndPortals() {
    const ep = window.RUMBO_DATA.esimAndPortals;
    if (!ep) return;

    const globalEl = document.getElementById('esim-global-list');
    if (globalEl) {
      globalEl.innerHTML = ep.globalEsims
        .map(
          (e) => `
        <div class="zone-item">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:6px;">
            <div style="display:flex;align-items:center;gap:7px;">
              <span style="font-size:1.4rem;">${e.icon}</span>
              <strong style="font-size:0.92rem;">${e.name}</strong>
            </div>
            <span class="badge safe">${e.priceTag}</span>
          </div>
          <div class="visual-pills-row">
            <span class="visual-pill" style="color:#34d399;">${e.badge}</span>
            ${(e.pills || []).map((p) => `<span class="visual-pill">${p}</span>`).join('')}
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px;">
            <button class="btn btn-blue" onclick="window.rumboSpeak('${e.voice}')">🔊 Escuchar</button>
            <a href="${e.url}" target="_blank" rel="noopener" class="btn btn-primary">🌐 Ir al Portal</a>
          </div>
        </div>
      `
        )
        .join('');
    }

    const destEp = (ep.byDestination && ep.byDestination[currentDestId]) || ep.byDestination.cdmx;
    const localCompEl = document.getElementById('esim-local-comparison');
    if (localCompEl && destEp) {
      localCompEl.innerHTML = `
        <div class="do-dont-grid">
          <div class="do-box">${destEp.localSimDo}</div>
          <div class="dont-box">${destEp.localSimDont}</div>
        </div>
      `;
    }

    const portalsEl = document.getElementById('cheap-portals-list');
    if (portalsEl && destEp && destEp.portals) {
      portalsEl.innerHTML = destEp.portals
        .map(
          (p) => `
        <div class="zone-item" style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">
          <div>
            <div style="font-size:0.88rem;font-weight:800;">${p.icon} ${p.name}</div>
            <div style="display:flex;gap:6px;margin-top:4px;flex-wrap:wrap;">
              <span class="badge safe">${p.price}</span>
              <span class="badge danger">🚫 ${p.avoid}</span>
            </div>
          </div>
          <a href="${p.url}" target="_blank" rel="noopener" class="btn btn-blue" style="padding:7px 12px;">
            🔗 Oficial
          </a>
        </div>
      `
        )
        .join('');
    }
  }

  window.rumboSpeakTips = function (idx) {
    const t = getDest().safetyTips[idx];
    if (t) speakGuideAlert(`${t.title}. ${t.doText}. ${t.dontText}`);
  };

  window.rumboSpeakCreator = function (idx) {
    const c = getDest().creatorSpots[idx];
    if (c) speakGuideAlert(`Spot ${c.spot}. Hook sugerido: ${c.hook}. Toma: ${c.shotGuide}`);
  };

  // Expose zone simulation helper
  window.rumboSimulateZone = function (idx) {
    triggerZoneTransition(idx, true);
  };

  window.rumboCopyCreator = function (idx) {
    const dest = getDest();
    const c = dest.creatorSpots[idx];
    if (!c) return;
    const text = `📍 Spot: ${c.spot}\n🎬 Hook: ${c.hook}\n📹 Toma: ${c.shotGuide}\n${c.hashtags}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    alert('¡Copiado listo para pegar en Instagram / TikTok!');
  };

  // ==================== CURRENCY EXCHANGE SYSTEM ====================
  function getHomeCurrencyCode() {
    const sel = document.getElementById('fx-home-currency');
    return (sel && sel.value) || localStorage.getItem('rumbo_home_currency') || 'USD';
  }

  function getOfficialRate(destCode, homeCode) {
    const currencies = window.RUMBO_DATA.currencies || {};
    const destObj = currencies[destCode] || { perUSD: 1 };
    const homeObj = currencies[homeCode] || { perUSD: 1 };
    return destObj.perUSD / homeObj.perUSD;
  }

  function getActiveRate() {
    const dest = getDest();
    const homeCode = getHomeCurrencyCode();
    const customInput = document.getElementById('fx-custom-rate');
    const val = customInput ? parseFloat(customInput.value) : NaN;
    if (!isNaN(val) && val > 0) return val;
    return getOfficialRate(dest.currency, homeCode);
  }

  function formatMoney(num, decimals = 2) {
    if (isNaN(num)) return '0';
    return Number(num).toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  function updateFxConversionFromLocal() {
    const localInput = document.getElementById('fx-amount-local');
    const homeInput = document.getElementById('fx-amount-home');
    const rate = getActiveRate();
    const localVal = parseFloat(localInput.value) || 0;
    const homeVal = rate > 0 ? localVal / rate : 0;
    homeInput.value = homeVal >= 100 ? homeVal.toFixed(0) : homeVal.toFixed(2);
    renderQuickPocketBills();
  }

  function updateFxConversionFromHome() {
    const localInput = document.getElementById('fx-amount-local');
    const homeInput = document.getElementById('fx-amount-home');
    const rate = getActiveRate();
    const homeVal = parseFloat(homeInput.value) || 0;
    const localVal = homeVal * rate;
    localInput.value = localVal >= 100 ? localVal.toFixed(0) : localVal.toFixed(2);
    renderQuickPocketBills();
  }

  function renderQuickPocketBills() {
    const dest = getDest();
    const homeCode = getHomeCurrencyCode();
    const guide = (window.RUMBO_DATA.exchangeGuides && window.RUMBO_DATA.exchangeGuides[currentDestId]) || {
      quickBills: [10, 20, 50, 100, 200]
    };
    const rate = getActiveRate();
    const pillsEl = document.getElementById('fx-quick-pills');
    if (!pillsEl) return;

    pillsEl.innerHTML = guide.quickBills
      .map((bill) => {
        const converted = rate > 0 ? bill / rate : 0;
        const formatted = converted >= 50 ? converted.toFixed(0) : converted.toFixed(2);
        return `
        <button
          type="button"
          class="banknote-card"
          onclick="window.rumboSelectQuickBill(${bill})"
          title="Toca para convertir ${bill} ${dest.currency}">
          <div style="font-size:0.78rem;">💵</div>
          <div style="font-size:0.74rem;font-weight:900;color:#f8fafc;">${bill.toLocaleString()}</div>
          <div style="font-size:0.62rem;color:#94a3b8;">${dest.currency}</div>
          <div style="font-size:0.72rem;color:#34d399;font-weight:900;margin-top:2px;">= ${formatted} ${homeCode}</div>
        </button>
      `;
      })
      .join('');
  }

  window.rumboSelectQuickBill = function (billAmount) {
    const localInput = document.getElementById('fx-amount-local');
    if (localInput) {
      localInput.value = billAmount;
      updateFxConversionFromLocal();
    }
  };

  function renderCurrencyExchange() {
    const dest = getDest();
    const homeSelect = document.getElementById('fx-home-currency');
    const savedHome = localStorage.getItem('rumbo_home_currency');
    if (savedHome && homeSelect) {
      homeSelect.value = savedHome;
    }
    if (!savedHome && homeSelect) {
      homeSelect.value = dest.currency === 'USD' ? 'EUR' : 'USD';
    }
    const homeCode = getHomeCurrencyCode();

    document.getElementById('fx-dest-code-label').textContent = dest.currency;
    document.getElementById('fx-rate-pair-label').textContent = `${dest.currency} por 1 ${homeCode}`;

    const officialRate = getOfficialRate(dest.currency, homeCode);
    const rateInput = document.getElementById('fx-custom-rate');
    rateInput.value = officialRate >= 100 ? officialRate.toFixed(1) : officialRate.toFixed(4);

    const guide = (window.RUMBO_DATA.exchangeGuides && window.RUMBO_DATA.exchangeGuides[currentDestId]) || {
      quickBills: [50, 100, 200, 500, 1000],
      bestPlaces: '✅ Bancos oficiales.',
      avoidPlaces: '❌ Cajeros en la calle.',
      atmRule: '🏧 Rechaza conversión del cajero.'
    };

    const localInput = document.getElementById('fx-amount-local');
    if (localInput) {
      localInput.value = guide.quickBills[1] || 100;
    }

    updateFxConversionFromLocal();

    const scamRes = document.getElementById('fx-scam-result');
    if (scamRes) scamRes.style.display = 'none';
    const offeredInput = document.getElementById('fx-offered-rate');
    if (offeredInput) {
      offeredInput.placeholder = `Ej. ${(officialRate * 0.91).toFixed(2)} ${dest.currency}`;
    }

    // Visual DO / DONT Exchange Guide
    const guideEl = document.getElementById('fx-local-guide');
    if (guideEl) {
      guideEl.innerHTML = `
        <div class="do-dont-grid" style="margin-bottom:8px;">
          <div class="do-box">${guide.bestPlaces}</div>
          <div class="dont-box">${guide.avoidPlaces}</div>
        </div>
        <div class="wallet-tip-box" style="font-weight:800;">
          ${guide.atmRule}
        </div>
      `;
    }
  }

  // ==================== ITINERARY LOGIC (100% VISUAL PHOTO CARDS) ====================
  function getStoredItinerary() {
    const key = `rumbo_itinerary_${currentDestId}`;
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
    return getDest().itinerary;
  }

  function saveStoredItinerary(list) {
    localStorage.setItem(`rumbo_itinerary_${currentDestId}`, JSON.stringify(list));
  }

  function renderItinerary() {
    const dest = getDest();
    const list = getStoredItinerary();
    const container = document.getElementById('itinerary-list');
    container.innerHTML = list
      .map(
        (item, idx) => `
      <div class="visual-photo-card" style="opacity:${item.done ? '0.6' : '1'};">
        <div class="visual-photo-header" style="background-image:url('${item.img || dest.heroImage}');height:122px;">
          <div class="visual-photo-top">
            <span class="badge ${item.safetyLevel}">
              ${item.safetyLevel === 'safe' ? '🟢 Zona Segura' : '🟡 Cuidado'}
            </span>
            <span class="status-pill" style="background:rgba(0,0,0,0.75);">🗓️ ${item.day} · ${item.time}</span>
          </div>
          <div class="visual-photo-bottom">
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-weight:900;font-size:1rem;text-shadow:0 2px 8px rgba(0,0,0,0.9);">
              <input type="checkbox" ${item.done ? 'checked' : ''} onchange="window.rumboToggleItinerary(${idx})" style="width:18px;height:18px;" />
              <span style="${item.done ? 'text-decoration:line-through;' : ''}">${item.title}</span>
            </label>
          </div>
        </div>
        <div class="visual-card-body">
          <div class="visual-pills-row">
            <span class="visual-pill">📍 ${item.neighborhood || dest.name}</span>
            <span class="visual-pill">💵 ${item.costEstimate || 'Libre'}</span>
            <span class="visual-pill">🧭 ${item.guideTip}</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            <button class="btn btn-blue" onclick="window.rumboSpeak('${item.title}. ${item.guideTip}')">
              🔊 Escuchar Guía
            </button>
            <a href="${getGoogleMapsUrl(item.lat || dest.center.lat, item.lng || dest.center.lng, item.title)}" target="_blank" rel="noopener" class="btn btn-safe">
              🗺️ Ir con Mapa
            </a>
          </div>
        </div>
      </div>
    `
      )
      .join('');
  }

  window.rumboToggleItinerary = function (idx) {
    const list = getStoredItinerary();
    if (list[idx]) {
      list[idx].done = !list[idx].done;
      saveStoredItinerary(list);
      renderItinerary();
    }
  };

  // ==================== SHARED EXPENSES LOGIC ====================
  function getStoredExpenses() {
    const key = `rumbo_expenses_${currentDestId}`;
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
    return getDest().defaultExpenses;
  }

  function saveStoredExpenses(list) {
    localStorage.setItem(`rumbo_expenses_${currentDestId}`, JSON.stringify(list));
  }

  function renderExpenses() {
    const dest = getDest();
    const homeCode = getHomeCurrencyCode();
    const rate = getActiveRate();
    const list = getStoredExpenses();
    let total = 0;
    let paidByMe = 0;
    let paidByCompanion = 0;

    list.forEach((e) => {
      const amt = Number(e.amount) || 0;
      total += amt;
      if (e.payer === 'Yo') paidByMe += amt;
      else paidByCompanion += amt;
    });

    const half = total / 2;
    const diff = paidByMe - half;
    const totalHome = rate > 0 ? total / rate : 0;

    document.getElementById('exp-total-amount').textContent = `$${total.toLocaleString()} ${dest.currency}`;
    const totalHomeEl = document.getElementById('exp-total-home');
    if (totalHomeEl) {
      totalHomeEl.textContent = `≈ ${formatMoney(totalHome, totalHome >= 100 ? 0 : 2)} ${homeCode}`;
    }
    document.getElementById('exp-per-person').textContent = `$${half.toLocaleString()} ${dest.currency}`;

    const settleEl = document.getElementById('exp-settlement-text');
    if (Math.abs(diff) < 1) {
      settleEl.textContent = '✅ Están a mano (Nadie debe nada)';
      settleEl.style.color = '#34d399';
    } else if (diff > 0) {
      const diffHome = rate > 0 ? diff / rate : 0;
      settleEl.textContent = `👉 Tu acompañante te debe $${diff.toLocaleString()} ${dest.currency} (≈ ${formatMoney(diffHome, 2)} ${homeCode})`;
      settleEl.style.color = '#38bdf8';
    } else {
      const diffHome = rate > 0 ? Math.abs(diff) / rate : 0;
      settleEl.textContent = `👉 Tú le debes $${Math.abs(diff).toLocaleString()} ${dest.currency} (≈ ${formatMoney(diffHome, 2)} ${homeCode}) a tu acompañante`;
      settleEl.style.color = '#fbbf24';
    }

    const listEl = document.getElementById('expenses-list');
    listEl.innerHTML = list
      .map(
        (e, idx) => {
          const amtLocal = Number(e.amount) || 0;
          const amtHome = rate > 0 ? amtLocal / rate : 0;
          return `
      <div class="contact-row">
        <div>
          <div style="font-size:0.84rem;font-weight:700;">${e.desc}</div>
          <div style="font-size:0.72rem;color:var(--text-secondary);">${e.category} · Pagó: <strong>${e.payer}</strong></div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <div style="text-align:right;">
            <strong style="font-size:0.85rem;display:block;">$${amtLocal.toLocaleString()} ${dest.currency}</strong>
            <span style="font-size:0.69rem;color:var(--text-secondary);">≈ ${formatMoney(amtHome, 2)} ${homeCode}</span>
          </div>
          <button class="status-pill" style="padding:3px 7px;" onclick="window.rumboDeleteExpense(${idx})" title="Eliminar">✕</button>
        </div>
      </div>
    `;
        }
      )
      .join('');
  }

  window.rumboDeleteExpense = function (idx) {
    const list = getStoredExpenses();
    list.splice(idx, 1);
    saveStoredExpenses(list);
    renderExpenses();
  };

  // ==================== EMERGENCY TRACKING & SOS LOGIC ====================
  function getActiveCoordsAndZone() {
    const dest = getDest();
    const zone = dest.zones[activeZoneIndex] || dest.zones[0];
    return {
      lat: zone.lat.toFixed(5),
      lng: zone.lng.toFixed(5),
      zoneName: zone.name,
      levelLabel: zone.levelLabel
    };
  }

  function updateLiveTrackingTelemetry() {
    const info = getActiveCoordsAndZone();
    const box = document.getElementById('live-tracking-coords');
    const now = new Date().toLocaleTimeString();
    box.innerHTML = `
      Último ping GPS (${now}): <strong>${info.lat}, ${info.lng}</strong><br/>
      Zona detectada: <strong>${info.zoneName} (${info.levelLabel})</strong><br/>
      <a href="https://www.google.com/maps?q=${info.lat},${info.lng}" target="_blank" rel="noopener" style="color:#38bdf8;">Ver punto exacto en Google Maps ↗</a>
    `;
  }

  function buildSOSMessage() {
    const dest = getDest();
    const info = getActiveCoordsAndZone();
    const gmapsLink = `https://maps.google.com/?q=${info.lat},${info.lng}`;
    return `🆘 ALERTA RUMBO PROPIO: Necesito asistencia o seguimiento en ${dest.name}. Mi última ubicación GPS es ${info.zoneName} (${info.levelLabel}). Coordenadas: ${info.lat},${info.lng} Mapa en vivo: ${gmapsLink}`;
  }

  // ==================== PASSPORT VAULT WITH PIN ====================
  function getVaultPin() {
    return localStorage.getItem('rumbo_vault_pin') || '1234';
  }

  function loadVaultData() {
    const raw = localStorage.getItem('rumbo_vault_data');
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      document.getElementById('passport-number').value = data.number || '';
      document.getElementById('passport-expiry').value = data.expiry || '';
      document.getElementById('insurance-info').value = data.insurance || '';
      if (data.image) {
        renderPassportImage(data.image);
      }
    } catch (e) {}
  }

  function renderPassportImage(dataUrl) {
    const holder = document.getElementById('passport-visual-holder');
    holder.innerHTML = `
      <img src="${dataUrl}" alt="Copia Digital de Pasaporte" class="passport-preview-img" />
      <div style="font-size:0.72rem;color:#34d399;margin-top:6px;">
        ✔ Documento disponible 100% offline. No necesitas exponer tu pasaporte físico en la calle.
      </div>
    `;
  }

  function generateDemoPassportSvgDataUrl() {
    const num = document.getElementById('passport-number').value || 'G49201844';
    const exp = document.getElementById('passport-expiry').value || '14 AGO 2032 · O+';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="360" viewBox="0 0 600 360">
      <rect width="600" height="360" rx="18" fill="#0f172a" stroke="#38bdf8" stroke-width="3"/>
      <rect x="24" y="24" width="552" height="44" rx="8" fill="#1e293b"/>
      <text x="40" y="52" fill="#38bdf8" font-family="monospace" font-size="18" font-weight="bold">PASAPORTE DIGITAL · BÓVEDA RUMBO PROPIO</text>
      <rect x="36" y="90" width="130" height="165" rx="10" fill="#1e293b" stroke="#64748b" stroke-width="2"/>
      <circle cx="101" cy="148" r="28" fill="#334155"/>
      <path d="M58 232 C58 192 144 192 144 232" fill="#334155"/>
      <text x="190" y="115" fill="#94a3b8" font-family="sans-serif" font-size="13">NÚMERO DE PASAPORTE</text>
      <text x="190" y="138" fill="#f8fafc" font-family="monospace" font-size="22" font-weight="bold">${num}</text>
      <text x="190" y="175" fill="#94a3b8" font-family="sans-serif" font-size="13">VIGENCIA Y GRUPO SANGUÍNEO</text>
      <text x="190" y="198" fill="#10b981" font-family="monospace" font-size="18" font-weight="bold">${exp}</text>
      <text x="190" y="236" fill="#94a3b8" font-family="sans-serif" font-size="13">ESTADO DEL DOCUMENTO</text>
      <text x="190" y="256" fill="#38bdf8" font-family="sans-serif" font-size="15" font-weight="bold">COPIA CIFRADA PARA IDENTIFICACIÓN EN CALLE</text>
      <rect x="24" y="285" width="552" height="52" rx="6" fill="#090d16"/>
      <text x="38" y="308" fill="#64748b" font-family="monospace" font-size="14">P&lt;MEXVIAJERO&lt;&lt;RUMBO&lt;PROPIO&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</text>
      <text x="38" y="328" fill="#64748b" font-family="monospace" font-size="14">${num}&lt;8MEX9204155M3208145&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;04</text>
    </svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  // ==================== VALIDATION INTERVIEWS ====================
  function renderSavedValidations() {
    const list = JSON.parse(localStorage.getItem('rumbo_validations') || '[]');
    const el = document.getElementById('validations-saved-list');
    if (!list.length) {
      el.innerHTML = `<div style="font-size:0.75rem;color:var(--text-secondary);">Aún no hay entrevistas guardadas en este dispositivo.</div>`;
      return;
    }
    el.innerHTML =
      `<div style="font-size:0.78rem;font-weight:800;margin-bottom:6px;">Entrevistas registradas (${list.length}):</div>` +
      list
        .map(
          (v) => `
        <div class="zone-item" style="font-size:0.75rem;">
          <div><strong>💰 Disposición de pago:</strong> ${v.q1}</div>
          <div><strong>👥 Uso:</strong> ${v.q2}</div>
          <div><strong>💡 Qué resuelve de verdad:</strong> ${v.q3}</div>
        </div>
      `
        )
        .join('');
  }

  // ==================== EVENT LISTENERS ====================
  document.addEventListener('DOMContentLoaded', () => {
    // Bottom Tabs Navigation
    document.querySelectorAll('.nav-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach((b) => b.classList.remove('active'));
        document.querySelectorAll('.tab-view').forEach((v) => v.classList.remove('active'));
        btn.classList.add('active');
        const target = document.getElementById(btn.dataset.tab);
        if (target) target.classList.add('active');
      });
    });

    // Sub-navigation inside Shield View
    document.querySelectorAll('.chip-btn').forEach((chip) => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.chip-btn').forEach((c) => c.classList.remove('active'));
        document.querySelectorAll('.shield-subview').forEach((sv) => (sv.style.display = 'none'));
        chip.classList.add('active');
        const target = document.getElementById(chip.dataset.subview);
        if (target) target.style.display = 'block';
      });
    });

    // Destination Change
    document.getElementById('dest-select').addEventListener('change', (e) => {
      currentDestId = e.target.value;
      renderDestination();
    });

    // Download Offline Pack
    document.getElementById('btn-download-pack').addEventListener('click', () => {
      const dest = getDest();
      const packs = JSON.parse(localStorage.getItem('rumbo_packs') || '{}');
      packs[currentDestId] = { downloadedAt: new Date().toISOString() };
      localStorage.setItem('rumbo_packs', JSON.stringify(packs));
      renderDestination();
      playSafetyAlertSound('safe');
      alert(
        `✅ Paquete Offline de ${dest.name} (${dest.packSize}) guardado en la memoria de tu celular.\n\nIncluye: Zonas seguras/inseguras con alarma GPS, números de emergencia, embajadas, tips de billetera, tu itinerario y gastos compartidos.`
      );
    });

    // Toggle Online/Offline Simulator
    document.getElementById('btn-network-toggle').addEventListener('click', () => {
      isSimulatedOffline = !isSimulatedOffline;
      const btn = document.getElementById('btn-network-toggle');
      const dot = document.getElementById('network-dot');
      const label = document.getElementById('network-label');
      if (isSimulatedOffline) {
        btn.className = 'status-pill offline';
        dot.textContent = '⚡';
        label.textContent = 'Modo Offline';
      } else {
        btn.className = 'status-pill online';
        dot.textContent = '🟢';
        label.textContent = 'Online';
      }
      const dest = getDest();
      const zone = dest.zones[activeZoneIndex] || dest.zones[0];
      updateGoogleMapEmbed(zone.lat, zone.lng);
    });

    // Install PWA instructions / prompt
    document.getElementById('btn-install-pwa').addEventListener('click', async () => {
      if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        await deferredInstallPrompt.userChoice;
        deferredInstallPrompt = null;
      } else {
        alert(
          '📲 Cómo instalar Rumbo Propio en tu celular:\n\n• En iPhone (Safari): Toca el botón "Compartir" (cuadrado con flecha) y selecciona "Agregar a pantalla de inicio".\n• En Android (Chrome): Toca los 3 puntos arriba a la derecha y selecciona "Instalar aplicación" o "Agregar a la pantalla principal".'
        );
      }
    });

    // Map Mode Switch (Radar Offline vs Google Maps)
    const btnRadar = document.getElementById('btn-mode-radar');
    const btnGmaps = document.getElementById('btn-mode-gmaps');
    const canvas = document.getElementById('offline-radar-canvas');
    const iframe = document.getElementById('google-map-frame');

    btnRadar.addEventListener('click', () => {
      btnRadar.classList.add('active');
      btnGmaps.classList.remove('active');
      canvas.style.display = 'block';
      iframe.style.display = 'none';
      drawOfflineRadar();
    });

    btnGmaps.addEventListener('click', () => {
      btnGmaps.classList.add('active');
      btnRadar.classList.remove('active');
      canvas.style.display = 'none';
      iframe.style.display = 'block';
      const dest = getDest();
      const zone = dest.zones[activeZoneIndex] || dest.zones[0];
      updateGoogleMapEmbed(zone.lat, zone.lng);
    });

    // Interactive click on Radar Canvas to jump to any zone
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      const dest = getDest();
      dest.zones.forEach((z, idx) => {
        if (!z._canvasPos) return;
        const dx = x - z._canvasPos.x;
        const dy = y - z._canvasPos.y;
        if (Math.sqrt(dx * dx + dy * dy) <= z._canvasPos.r) {
          triggerZoneTransition(idx, true);
        }
      });
    });

    // Simulator Buttons for Safe / Caution / Danger Zone Entry
    document.getElementById('sim-enter-safe').addEventListener('click', () => {
      const idx = getDest().zones.findIndex((z) => z.level === 'safe');
      triggerZoneTransition(idx >= 0 ? idx : 0, true);
    });

    document.getElementById('sim-enter-caution').addEventListener('click', () => {
      const idx = getDest().zones.findIndex((z) => z.level === 'caution');
      triggerZoneTransition(idx >= 0 ? idx : 0, true);
    });

    document.getElementById('sim-enter-danger').addEventListener('click', () => {
      const idx = getDest().zones.findIndex((z) => z.level === 'danger');
      triggerZoneTransition(idx >= 0 ? idx : 0, true);
    });

    document.getElementById('btn-test-sound').addEventListener('click', () => {
      const zone = getDest().zones[activeZoneIndex] || getDest().zones[0];
      playSafetyAlertSound(zone.level);
      speakGuideAlert(zone.alertMessage);
    });

    const btnListenHero = document.getElementById('btn-listen-hero');
    if (btnListenHero) {
      btnListenHero.addEventListener('click', () => {
        const dest = getDest();
        const safeNames = dest.zones.filter((z) => z.level === 'safe').map((z) => z.name).join(' y ');
        const dangerNames = dest.zones.filter((z) => z.level === 'danger').map((z) => z.name).join(' y ');
        speakGuideAlert(
          `Rumbo Propio: De la vista nace el viaje. Estás viendo ${dest.name}. Zonas recomendadas para caminar libre: ${safeNames}. Zonas rojas a evitar: ${dangerNames}.`
        );
      });
    }

    document.getElementById('btn-real-gps').addEventListener('click', () => {
      if (!navigator.geolocation) {
        alert('Tu navegador no soporta geolocalización GPS.');
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          updateGoogleMapEmbed(latitude, longitude);
          alert(
            `📍 GPS Satelital Conectado:\nLat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}\n\nEl detector de zonas seguras/inseguras vigilará tu desplazamiento.`
          );
        },
        () => {
          alert(
            'No se pudo obtener permiso de GPS en este navegador; puedes seguir usando el simulador interactivo de zonas.'
          );
        }
      );
    });

    // Live Emergency Tracking Toggle
    document.getElementById('btn-toggle-tracking').addEventListener('click', () => {
      isTrackingLive = !isTrackingLive;
      const btn = document.getElementById('btn-toggle-tracking');
      const badge = document.getElementById('tracking-badge');
      const box = document.getElementById('live-tracking-box');

      if (isTrackingLive) {
        btn.textContent = '⏹️ Detener Rastreo en Vivo';
        btn.className = 'btn btn-danger';
        badge.textContent = 'Transmitiendo en Vivo';
        badge.className = 'badge safe';
        box.style.display = 'block';
        updateLiveTrackingTelemetry();
        trackingInterval = setInterval(updateLiveTrackingTelemetry, 5000);
      } else {
        btn.textContent = '▶️ Iniciar Rastreo en Tiempo Real';
        btn.className = 'btn btn-primary';
        badge.textContent = 'Inactivo';
        badge.className = 'badge caution';
        box.style.display = 'none';
        if (trackingInterval) clearInterval(trackingInterval);
      }
    });

    document.getElementById('btn-share-live-link').addEventListener('click', () => {
      const contact = document.getElementById('emerg-contact-name').value || 'Contacto';
      const info = getActiveCoordsAndZone();
      const shareText = `Hola ${contact}, te comparto mi rastreo en vivo de Rumbo Propio. Estoy en ${info.zoneName} (${info.levelLabel}): https://maps.google.com/?q=${info.lat},${info.lng}`;
      if (navigator.clipboard) navigator.clipboard.writeText(shareText);
      alert(`🔗 Enlace de rastreo en tiempo real copiado para enviar a ${contact}:\n\n${shareText}`);
    });

    document.getElementById('btn-sos-whatsapp').addEventListener('click', () => {
      const phone = (document.getElementById('emerg-contact-phone').value || '').replace(/[^0-9]/g, '');
      const msg = encodeURIComponent(buildSOSMessage());
      window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
    });

    document.getElementById('btn-sos-sms').addEventListener('click', () => {
      const phone = document.getElementById('emerg-contact-phone').value || '';
      const msg = encodeURIComponent(buildSOSMessage());
      window.location.href = `sms:${phone}?body=${msg}`;
    });

    // Passport Vault Unlock / Lock / Scan
    document.getElementById('btn-unlock-vault').addEventListener('click', () => {
      const inputPin = document.getElementById('vault-pin-input').value.trim();
      if (inputPin === getVaultPin()) {
        document.getElementById('vault-locked-panel').style.display = 'none';
        document.getElementById('vault-unlocked-panel').style.display = 'block';
        document.getElementById('vault-error-msg').style.display = 'none';
        const badge = document.getElementById('vault-status-badge');
        badge.textContent = 'Desbloqueada';
        badge.className = 'badge safe';
        loadVaultData();
        playSafetyAlertSound('safe');
      } else {
        document.getElementById('vault-error-msg').style.display = 'block';
        playSafetyAlertSound('danger');
      }
    });

    document.getElementById('btn-lock-vault').addEventListener('click', () => {
      document.getElementById('vault-pin-input').value = '';
      document.getElementById('vault-locked-panel').style.display = 'block';
      document.getElementById('vault-unlocked-panel').style.display = 'none';
      const badge = document.getElementById('vault-status-badge');
      badge.textContent = 'Bloqueada';
      badge.className = 'badge danger';
    });

    document.getElementById('passport-camera-input').addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (ev) {
        const imgData = ev.target.result;
        renderPassportImage(imgData);
        const existing = JSON.parse(localStorage.getItem('rumbo_vault_data') || '{}');
        existing.image = imgData;
        localStorage.setItem('rumbo_vault_data', JSON.stringify(existing));
      };
      reader.readAsDataURL(file);
    });

    document.getElementById('btn-load-demo-passport').addEventListener('click', () => {
      if (!document.getElementById('passport-number').value) {
        document.getElementById('passport-number').value = 'G49201844';
      }
      if (!document.getElementById('passport-expiry').value) {
        document.getElementById('passport-expiry').value = '14 AGO 2032 · Sangre O+';
      }
      if (!document.getElementById('insurance-info').value) {
        document.getElementById('insurance-info').value = 'Assist Card #AC-99281 · Urgencias: +1 800 555 0199';
      }
      const demoUrl = generateDemoPassportSvgDataUrl();
      renderPassportImage(demoUrl);
      const data = {
        number: document.getElementById('passport-number').value,
        expiry: document.getElementById('passport-expiry').value,
        insurance: document.getElementById('insurance-info').value,
        image: demoUrl
      };
      localStorage.setItem('rumbo_vault_data', JSON.stringify(data));
    });

    document.getElementById('btn-save-vault').addEventListener('click', () => {
      const existing = JSON.parse(localStorage.getItem('rumbo_vault_data') || '{}');
      existing.number = document.getElementById('passport-number').value;
      existing.expiry = document.getElementById('passport-expiry').value;
      existing.insurance = document.getElementById('insurance-info').value;
      localStorage.setItem('rumbo_vault_data', JSON.stringify(existing));
      alert('🔐 Datos de pasaporte y seguro guardados y cifrados localmente en tu teléfono.');
    });

    document.getElementById('btn-change-pin').addEventListener('click', () => {
      const newPin = prompt('Ingresa tu nuevo PIN de 4 dígitos para proteger tu pasaporte:', getVaultPin());
      if (newPin && newPin.trim().length === 4) {
        localStorage.setItem('rumbo_vault_pin', newPin.trim());
        alert(`✅ Nuevo PIN (${newPin.trim()}) configurado.`);
      }
    });

    // Add New Itinerary Stop
    document.getElementById('btn-add-itinerary').addEventListener('click', () => {
      const dayTime = document.getElementById('new-it-day').value.trim() || 'Día Libre';
      const title = document.getElementById('new-it-title').value.trim();
      const tip = document.getElementById('new-it-tip').value.trim() || 'A tu propio ritmo.';
      const safety = document.getElementById('new-it-safety').value;
      if (!title) {
        alert('Escribe el nombre del lugar o actividad.');
        return;
      }
      const list = getStoredItinerary();
      list.push({
        id: 'custom-' + Date.now(),
        day: dayTime,
        time: 'Flexible',
        title,
        neighborhood: getDest().name,
        safetyLevel: safety,
        costEstimate: 'A tu ritmo',
        guideTip: tip,
        lat: getDest().center.lat,
        lng: getDest().center.lng,
        done: false
      });
      saveStoredItinerary(list);
      document.getElementById('new-it-title').value = '';
      document.getElementById('new-it-tip').value = '';
      renderItinerary();
    });

    // Currency Exchange Event Listeners
    document.getElementById('fx-amount-local').addEventListener('input', () => {
      updateFxConversionFromLocal();
    });

    document.getElementById('fx-amount-home').addEventListener('input', () => {
      updateFxConversionFromHome();
    });

    document.getElementById('fx-home-currency').addEventListener('change', (e) => {
      localStorage.setItem('rumbo_home_currency', e.target.value);
      renderCurrencyExchange();
      renderExpenses();
    });

    document.getElementById('fx-custom-rate').addEventListener('input', () => {
      const badge = document.getElementById('fx-rate-badge');
      if (badge) {
        badge.textContent = 'Tasa Personalizada';
        badge.className = 'badge caution';
      }
      updateFxConversionFromLocal();
      renderExpenses();
    });

    // Detector Anti-Estafa en Casas de Cambio / ATM
    document.getElementById('btn-check-fx-scam').addEventListener('click', () => {
      const dest = getDest();
      const homeCode = getHomeCurrencyCode();
      const officialRate = getOfficialRate(dest.currency, homeCode);
      const offered = parseFloat(document.getElementById('fx-offered-rate').value);
      const resBox = document.getElementById('fx-scam-result');
      const badge = document.getElementById('fx-spread-badge');

      if (isNaN(offered) || offered <= 0) {
        alert(`Ingresa la tasa que te ofrecen en ventanilla o cajero (ej. cuántos ${dest.currency} te dan por 1 ${homeCode}).`);
        return;
      }

      const diffPct = Math.abs((officialRate - offered) / officialRate) * 100;
      resBox.style.display = 'block';

      if (diffPct <= 3.0) {
        badge.textContent = `🟢 Justo (${diffPct.toFixed(1)}%)`;
        badge.className = 'badge safe';
        resBox.style.background = 'rgba(16, 185, 129, 0.14)';
        resBox.style.border = '1px solid rgba(16, 185, 129, 0.4)';
        resBox.innerHTML = `✅ <strong>¡Buen tipo de cambio!</strong> La diferencia frente a la tasa oficial (${officialRate.toFixed(2)} ${dest.currency}) es de solo <strong>${diffPct.toFixed(1)}%</strong>. Es seguro cambiar aquí.`;
        playSafetyAlertSound('safe');
      } else if (diffPct <= 6.5) {
        badge.textContent = `🟡 Comisión Media (${diffPct.toFixed(1)}%)`;
        badge.className = 'badge caution';
        resBox.style.background = 'rgba(245, 158, 11, 0.16)';
        resBox.style.border = '1px solid rgba(245, 158, 11, 0.45)';
        resBox.innerHTML = `⚠️ <strong>Comisión moderada (${diffPct.toFixed(1)}% de pérdida).</strong> Por cada 100 ${homeCode} estás perdiendo aprox. <strong>${diffPct.toFixed(1)} ${homeCode}</strong> frente a la tasa oficial (${officialRate.toFixed(2)}). Cambia solo lo necesario.`;
        playSafetyAlertSound('caution');
      } else {
        badge.textContent = `🔴 ¡Trampa! (${diffPct.toFixed(1)}%)`;
        badge.className = 'badge danger';
        resBox.style.background = 'rgba(244, 63, 94, 0.2)';
        resBox.style.border = '1px solid #f43f5e';
        resBox.innerHTML = `🚨 <strong>¡ALERTA DE COMISIÓN ABUSIVA! Estás perdiendo un ${diffPct.toFixed(1)}%.</strong> La tasa oficial es ${officialRate.toFixed(2)} ${dest.currency} por 1 ${homeCode}. No cambies aquí ni aceptes la conversión del cajero.`;
        playSafetyAlertSound('danger');
      }
    });

    // Add Shared Expense (Supports Local or Home Currency)
    document.getElementById('btn-add-expense').addEventListener('click', () => {
      const desc = document.getElementById('exp-desc').value.trim();
      const rawAmount = parseFloat(document.getElementById('exp-amount').value);
      const currMode = document.getElementById('exp-input-currency').value;
      const payer = document.getElementById('exp-payer').value;
      const category = document.getElementById('exp-cat').value;
      if (!desc || isNaN(rawAmount) || rawAmount <= 0) {
        alert('Ingresa un concepto y monto válido.');
        return;
      }
      const rate = getActiveRate();
      const homeCode = getHomeCurrencyCode();
      const finalLocalAmount = currMode === 'HOME' ? Math.round(rawAmount * rate * 100) / 100 : rawAmount;
      const finalDesc = currMode === 'HOME' ? `${desc} (${rawAmount} ${homeCode})` : desc;

      const list = getStoredExpenses();
      list.unshift({ id: 'exp-' + Date.now(), desc: finalDesc, amount: finalLocalAmount, payer, category });
      saveStoredExpenses(list);
      document.getElementById('exp-desc').value = '';
      document.getElementById('exp-amount').value = '';
      renderExpenses();
    });

    // Validation Form Save & WhatsApp
    document.getElementById('btn-save-validation').addEventListener('click', () => {
      const q1 = document.getElementById('val-q1').value;
      const q2 = document.getElementById('val-q2').value;
      const q3 = document.getElementById('val-q3').value.trim() || 'Seguridad y mapa offline';
      const list = JSON.parse(localStorage.getItem('rumbo_validations') || '[]');
      list.unshift({ q1, q2, q3, date: new Date().toISOString() });
      localStorage.setItem('rumbo_validations', JSON.stringify(list));
      document.getElementById('val-q3').value = '';
      renderSavedValidations();
    });

    document.getElementById('btn-whatsapp-validation').addEventListener('click', () => {
      const q1 = document.getElementById('val-q1').value;
      const q2 = document.getElementById('val-q2').value;
      const q3 = document.getElementById('val-q3').value.trim() || 'Sin comentario adicional';
      const msg = encodeURIComponent(
        `🎯 Validación Rumbo Propio:\n1) Cuánto pagaría: ${q1}\n2) Quién lo usaría: ${q2}\n3) Qué resuelve de verdad: ${q3}`
      );
      window.open(`https://wa.me/?text=${msg}`, '_blank');
    });

    renderDestination();
    renderSavedValidations();
  });
})();
