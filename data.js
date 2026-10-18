window.RUMBO_DATA = {
  slogan: 'DE LA VISTA NACE EL VIAJE',
  destinations: {
    cdmx: {
      id: 'cdmx',
      name: 'Ciudad de México',
      country: 'México',
      flag: '🇲🇽',
      currency: 'MXN',
      exchangeToUSD: 0.052,
      heroImage: 'https://images.unsplash.com/photo-1518659526054-190340b32735?auto=format&fit=crop&w=1000&q=80',
      gallery: [
        { title: 'Bellas Artes', img: 'https://images.unsplash.com/photo-1518659526054-190340b32735?auto=format&fit=crop&w=600&q=80', tag: '🟢 Día' },
        { title: 'Roma Norte', img: 'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?auto=format&fit=crop&w=600&q=80', tag: '🟢 Segura' },
        { title: 'Chapultepec', img: 'https://images.unsplash.com/photo-1568402102990-bc541580b59f?auto=format&fit=crop&w=600&q=80', tag: '📸 Imperdible' },
        { title: 'Coyoacán', img: 'https://images.unsplash.com/photo-1512813195386-6cf811ad3542?auto=format&fit=crop&w=600&q=80', tag: '🌮 Sabores' }
      ],
      tagline: 'Mira a dónde vas, camina libre y escucha las alertas sin leer textos largos.',
      packSize: '14.2 MB',
      center: { lat: 19.427, lng: -99.167 },
      emergencyGeneral: '911',
      zones: [
        {
          id: 'cdmx-roma-condesa',
          name: 'Roma Norte y Condesa',
          level: 'safe',
          levelLabel: 'CAMINA LIBRE',
          img: 'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?auto=format&fit=crop&w=600&q=80',
          lat: 19.4165,
          lng: -99.1695,
          radiusMeters: 1400,
          hours: '07:00 – 01:00',
          visualPills: ['🚶‍♂️ Peatonal', '☕ Cafés', '📵 Cel lejos del borde'],
          summary: 'Zona arbolada y segura para caminar a tu ritmo.',
          walletTip: 'No dejes el celular en mesas de banqueta.',
          alertMessage: 'Zona Segura: Roma Norte y Condesa. Camina con tranquilidad.'
        },
        {
          id: 'cdmx-polanco',
          name: 'Polanco y Chapultepec',
          level: 'safe',
          levelLabel: 'ALTA SEGURIDAD',
          img: 'https://images.unsplash.com/photo-1568402102990-bc541580b59f?auto=format&fit=crop&w=600&q=80',
          lat: 19.4319,
          lng: -99.1945,
          radiusMeters: 1500,
          hours: 'Todo el día',
          visualPills: ['🏛️ Museos', '💳 Pago Tarjeta', '👮 Vigilancia'],
          summary: 'Museos, parques y zonas comerciales vigiladas.',
          walletTip: 'Todo se paga con tarjeta; lleva poco efectivo.',
          alertMessage: 'Zona Segura: Polanco y Chapultepec.'
        },
        {
          id: 'cdmx-centro-zocalo',
          name: 'Centro Histórico / Zócalo',
          level: 'caution',
          levelLabel: 'CUIDA BOLSILLOS',
          img: 'https://images.unsplash.com/photo-1518659526054-190340b32735?auto=format&fit=crop&w=600&q=80',
          lat: 19.4326,
          lng: -99.1332,
          radiusMeters: 1100,
          hours: 'Solo 09:00 – 19:30',
          visualPills: ['🎒 Mochila al frente', '👛 Bolsillo delantero', '🌞 Solo de día'],
          summary: 'Increíble de día; mucha gente y carteristas en el Metro.',
          walletTip: 'Mochila al pecho y billetera adelante.',
          alertMessage: 'Precaución en Centro Histórico: pon tu mochila al frente y cuida tus bolsillos.'
        },
        {
          id: 'cdmx-doctores',
          name: 'Colonia Doctores',
          level: 'danger',
          levelLabel: 'NO CAMINAR · SOLO UBER',
          img: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
          lat: 19.419,
          lng: -99.146,
          radiusMeters: 950,
          hours: 'Evitar a pie',
          visualPills: ['🚫 No caminar', '📵 Guarda el cel', '🚕 Pide Uber puerta a puerta'],
          summary: 'Pegada a Roma Norte pero peligrosa a pie de noche.',
          walletTip: 'Guarda el teléfono y sal en Uber directo.',
          alertMessage: '¡ALERTA ROJA! Entraste a Colonia Doctores. Guarda el celular y regresa a Avenida Cuauhtémoc.'
        },
        {
          id: 'cdmx-tepito',
          name: 'Tepito / Morelos',
          level: 'danger',
          levelLabel: 'ZONA ROJA · EVITAR',
          img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
          lat: 19.4465,
          lng: -99.1275,
          radiusMeters: 1100,
          hours: 'No entrar',
          visualPills: ['🚨 Alto Riesgo', '📵 Sin cámaras', '↩️ Regresa al sur'],
          summary: 'Evita caminar al norte del Centro Histórico.',
          walletTip: 'No saques objetos de valor; regresa hacia Reforma.',
          alertMessage: '¡PELIGRO! Estás entrando a Tepito. Da media vuelta hacia el sur inmediatamente.'
        }
      ],
      emergencies: [
        { name: 'Emergencias', icon: '🚓', phone: '911', note: 'Policía y Ambulancia 24/7' },
        { name: 'Policía Turística', icon: '🛡️', phone: '+525552074155', note: 'Ayuda al viajero' },
        { name: 'Cruz Roja', icon: '🚑', phone: '+525553951111', note: 'Urgencias médicas' },
        { name: 'LOCATEL', icon: '☎️', phone: '+525556581111', note: 'Extravíos y apoyo' }
      ],
      embassies: [
        { country: '🇪🇸 España', phone: '+525552804508', emergencyPhone: '+525542468136', address: 'Galileo 114, Polanco', lat: 19.4318, lng: -99.1932 },
        { country: '🇺🇸 EE.UU.', phone: '+525550802000', emergencyPhone: '+525550802000', address: 'Reforma 305, Cuauhtémoc', lat: 19.4281, lng: -99.1669 },
        { country: '🇨🇴 Colombia', phone: '+525555254562', emergencyPhone: '+525525271193', address: 'Reforma 379, Cuauhtémoc', lat: 19.4265, lng: -99.1695 },
        { country: '🇦🇷 Argentina', phone: '+525555209430', emergencyPhone: '+525539016244', address: 'Palmas 1685, Lomas', lat: 19.4239, lng: -99.2335 }
      ],
      safetyTips: [
        {
          category: 'Billetera',
          icon: '👛',
          title: 'Billetera Señuelo',
          doText: '✅ Lleva $500 MXN y 1 tarjeta en bolsillo delantero',
          dontText: '❌ Nunca lleves todas tus tarjetas ni pasaporte en el bolsillo trasero',
          detail: 'Lleva efectivo chico a la mano y deja el resto seguro.'
        },
        {
          category: 'Transporte',
          icon: '🚕',
          title: 'Solo Apps con PIN',
          doText: '✅ Usa Uber o Didi y verifica la placa antes de subir',
          dontText: '❌ No pares taxis libres en la calle de noche',
          detail: 'Pide siempre transporte desde adentro del local.'
        },
        {
          category: 'Celular',
          icon: '📱',
          title: 'Mapa bajo techo',
          doText: '✅ Entra a una tienda o café para mirar el mapa',
          dontText: '❌ No saques el celular en la orilla de la banqueta',
          detail: 'Evita arrebatos rápidos en bicicleta o moto.'
        }
      ],
      itinerary: [
        {
          id: 'cdmx-it-1',
          day: 'Día 1',
          time: '09:00',
          title: 'Castillo de Chapultepec',
          img: 'https://images.unsplash.com/photo-1568402102990-bc541580b59f?auto=format&fit=crop&w=600&q=80',
          neighborhood: 'Chapultepec',
          safetyLevel: 'safe',
          costEstimate: '$95 MXN',
          guideTip: 'Entra a las 8:50 AM para fotos vacías sin grupos de tour.',
          lat: 19.4204,
          lng: -99.1819,
          done: false
        },
        {
          id: 'cdmx-it-2',
          day: 'Día 1',
          time: '14:30',
          title: 'Tacos y Cafés en Roma Norte',
          img: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80',
          neighborhood: 'Roma Norte',
          safetyLevel: 'safe',
          costEstimate: '$300 MXN',
          guideTip: 'Camina libre por Plaza Río de Janeiro y calle Colima.',
          lat: 19.4211,
          lng: -99.1604,
          done: false
        },
        {
          id: 'cdmx-it-3',
          day: 'Día 2',
          time: '10:00',
          title: 'Palacio de Bellas Artes y Mirador',
          img: 'https://images.unsplash.com/photo-1518659526054-190340b32735?auto=format&fit=crop&w=600&q=80',
          neighborhood: 'Centro Histórico',
          safetyLevel: 'caution',
          costEstimate: '$150 MXN',
          guideTip: 'Sube al piso 8 de Sears frente a Bellas Artes para la foto perfecta.',
          lat: 19.4352,
          lng: -99.1412,
          done: false
        }
      ],
      creatorSpots: [
        {
          id: 'cdmx-cr-1',
          spot: 'Balcón Secreto frente a Bellas Artes',
          img: 'https://images.unsplash.com/photo-1518659526054-190340b32735?auto=format&fit=crop&w=600&q=80',
          vibe: '🌅 Golden Hour · 17:30',
          bestTime: '17:30 hrs',
          hook: '“El ángulo secreto de CDMX que ningún tour te deja disfrutar con calma…”',
          shotGuide: 'Lente 0.5x desde la terraza del piso 8 mirando la cúpula dorada.',
          safetyNote: 'Interior seguro y vigilado.',
          hashtags: '#CDMX #DeLaVistaNaceElViaje #RumboPropio'
        },
        {
          id: 'cdmx-cr-2',
          spot: 'Biblioteca Vasconcelos (Efecto Matrix)',
          img: 'https://images.unsplash.com/photo-1507842229356-51c61504d3ab?auto=format&fit=crop&w=600&q=80',
          vibe: '🎬 Reel Viral · 10:30',
          bestTime: '10:30 hrs',
          hook: '“Parece otra dimensión, pero es gratis en Ciudad de México…”',
          shotGuide: 'Camina por el pasillo central inclinando el celular hacia arriba.',
          safetyNote: 'Toma fotos solo con celular; al salir usa transporte seguro.',
          hashtags: '#MexicoMagico #DeLaVistaNaceElViaje #RumboPropio'
        }
      ],
      defaultExpenses: [
        { id: 'e1', desc: '🚕 Uber Aeropuerto', amount: 240, payer: 'Yo', category: 'Transporte' },
        { id: 'e2', desc: '🌮 Cena de tacos', amount: 680, payer: 'Acompañante', category: 'Comida' },
        { id: 'e3', desc: '🎟️ Entradas Museos', amount: 380, payer: 'Yo', category: 'Entradas' }
      ]
    },

    roma: {
      id: 'roma',
      name: 'Roma',
      country: 'Italia',
      flag: '🇮🇹',
      currency: 'EUR',
      exchangeToUSD: 1.08,
      heroImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1000&q=80',
      gallery: [
        { title: 'Coliseo', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80', tag: '🏛️ Ícono' },
        { title: 'Fontana di Trevi', img: 'https://images.unsplash.com/photo-1525874684015-58379d421a52?auto=format&fit=crop&w=600&q=80', tag: '🌅 7 AM' },
        { title: 'Trastevere', img: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=600&q=80', tag: '🍝 Noche' },
        { title: 'Panteón', img: 'https://images.unsplash.com/photo-1555992828-ca4dbe41d294?auto=format&fit=crop&w=600&q=80', tag: '🟢 Seguro' }
      ],
      tagline: 'Enamórate de cada rincón sin caer en trampas de turistas ni carteristas.',
      packSize: '15.8 MB',
      center: { lat: 41.8967, lng: 12.4822 },
      emergencyGeneral: '112',
      zones: [
        {
          id: 'roma-trastevere',
          name: 'Trastevere y Piazza Navona',
          level: 'safe',
          levelLabel: 'CAMINA LIBRE',
          img: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=600&q=80',
          lat: 41.8892,
          lng: 12.4701,
          radiusMeters: 1100,
          hours: '07:00 – 02:00',
          visualPills: ['🍝 Peatonal', '🟢 Noche Segura', '🚫 No aceptes pulseras'],
          summary: 'Calles adoquinadas llenas de vida y muy seguras.',
          walletTip: 'Ignora a quienes te ofrecen pulseras "gratis".',
          alertMessage: 'Zona Segura: Trastevere. Disfruta tu paseo.'
        },
        {
          id: 'roma-coliseo-trevi',
          name: 'Coliseo y Fontana di Trevi (Metro)',
          level: 'caution',
          levelLabel: 'ALERTA CARTERISTAS',
          img: 'https://images.unsplash.com/photo-1525874684015-58379d421a52?auto=format&fit=crop&w=600&q=80',
          lat: 41.8902,
          lng: 12.4922,
          radiusMeters: 950,
          hours: '10:00 – 21:00',
          visualPills: ['🎒 Bolso al frente', '🚇 Cuidado en Metro', '🥀 No aceptes rosas'],
          summary: 'Mucha multitud; carteristas hábiles en vagones de Metro.',
          walletTip: 'Mano sobre tu cierre al subir al Metro o tomar selfies.',
          alertMessage: 'Precaución: Zona con carteristas. Asegura tu bolso al frente.'
        },
        {
          id: 'roma-termini-sur',
          name: 'Laterales de Estación Termini (Noche)',
          level: 'danger',
          levelLabel: 'EVITAR DE NOCHE',
          img: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
          lat: 41.8992,
          lng: 12.5038,
          radiusMeters: 850,
          hours: 'Evitar tras 21:30',
          visualPills: ['🌙 Riesgo nocturno', '🚕 Solo Taxi Blanco', '📵 Cel guardado'],
          summary: 'Calles traseras de la estación solitarias de noche.',
          walletTip: 'Sal solo por la fachada frontal iluminada.',
          alertMessage: '¡ALERTA ROJA! Estás en los laterales de Termini. Dirígete a la avenida principal.'
        }
      ],
      emergencies: [
        { name: 'Emergencia Europea', icon: '🚓', phone: '112', note: 'Policía y Ambulancia 24/7' },
        { name: 'Guardia Médica Turística', icon: '🏥', phone: '+390677306650', note: 'Médico en Trastevere' },
        { name: 'Radio Taxi Oficial', icon: '🚕', phone: '+39063570', note: 'Taxis blancos oficiales' }
      ],
      embassies: [
        { country: '🇲🇽 México', phone: '+39064416061', emergencyPhone: '+393394353085', address: 'Via Lazzaro Spallanzani 16', lat: 41.9125, lng: 12.5105 },
        { country: '🇪🇸 España', phone: '+39066871401', emergencyPhone: '+39335333438', address: 'Via Campo Marzio 34', lat: 41.9022, lng: 12.4777 },
        { country: '🇦🇷 Argentina', phone: '+390648073300', emergencyPhone: '+393495443484', address: 'Via Veneto 7', lat: 41.9041, lng: 12.4888 }
      ],
      safetyTips: [
        {
          category: 'Metro y Bus',
          icon: '🚇',
          title: 'Mano en el cierre en el Metro',
          doText: '✅ Lleva tu bolso cruzado al pecho en Termini y Spagna',
          dontText: '❌ Nunca lleves celular ni billetera en bolsillo trasero',
          detail: 'Aprovechan el empujón al abrirse las puertas.'
        },
        {
          category: 'Estafas',
          icon: '📿',
          title: 'Pulseras y Rosas "Gratis"',
          doText: '✅ Manos en los bolsillos y di firme "No, grazie"',
          dontText: '❌ No dejes que te aten hilos o pulseras en la muñeca',
          detail: 'Luego te rodean para exigirte €20.'
        }
      ],
      itinerary: [
        {
          id: 'roma-it-1',
          day: 'Día 1',
          time: '07:15',
          title: 'Fontana di Trevi Vacía',
          img: 'https://images.unsplash.com/photo-1525874684015-58379d421a52?auto=format&fit=crop&w=600&q=80',
          neighborhood: 'Centro Storico',
          safetyLevel: 'safe',
          costEstimate: 'Gratis',
          guideTip: 'A las 7:15 AM la tienes para ti solo antes de que lleguen los tours.',
          lat: 41.9009,
          lng: 12.4833,
          done: false
        },
        {
          id: 'roma-it-2',
          day: 'Día 1',
          time: '11:00',
          title: 'Coliseo y Foro Romano',
          img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80',
          neighborhood: 'Celio',
          safetyLevel: 'caution',
          costEstimate: '€18 EUR',
          guideTip: 'Entra al Foro por Via di San Gregorio para evitar la fila larga.',
          lat: 41.8902,
          lng: 12.4922,
          done: false
        }
      ],
      creatorSpots: [
        {
          id: 'roma-cr-1',
          spot: 'Cerradura Secreta del Aventino',
          img: 'https://images.unsplash.com/photo-1555992828-ca4dbe41d294?auto=format&fit=crop&w=600&q=80',
          vibe: '🔑 Toma Secreta · 16:30',
          bestTime: '16:30 hrs',
          hook: '“Mira por esta cerradura en Roma y verás 3 países a la vez…”',
          shotGuide: 'Pega el lente 1x al ojo de la cerradura y enfoca la cúpula.',
          safetyNote: 'Zona residencial muy tranquila.',
          hashtags: '#RomaSecreta #DeLaVistaNaceElViaje #RumboPropio'
        }
      ],
      defaultExpenses: [
        { id: 'r1', desc: '🚆 Tren Aeropuerto', amount: 28, payer: 'Yo', category: 'Transporte' },
        { id: 'r2', desc: '🍝 Cena Trastevere', amount: 44, payer: 'Acompañante', category: 'Comida' }
      ]
    },

    medellin: {
      id: 'medellin',
      name: 'Medellín',
      country: 'Colombia',
      flag: '🇨🇴',
      currency: 'COP',
      exchangeToUSD: 0.00025,
      heroImage: 'https://images.unsplash.com/photo-1599413987323-f12f62163b38?auto=format&fit=crop&w=1000&q=80',
      gallery: [
        { title: 'Comuna 13', img: 'https://images.unsplash.com/photo-1599413987323-f12f62163b38?auto=format&fit=crop&w=600&q=80', tag: '🎨 Arte' },
        { title: 'Provenza', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80', tag: '🟢 Peatonal' },
        { title: 'Laureles', img: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80', tag: '☕ Cafés' }
      ],
      tagline: 'Disfruta la eterna primavera viendo de un vistazo dónde sí y dónde no.',
      packSize: '13.6 MB',
      center: { lat: 6.2211, lng: -75.5735 },
      emergencyGeneral: '123',
      zones: [
        {
          id: 'med-laureles',
          name: 'Laureles y Provenza (El Poblado)',
          level: 'safe',
          levelLabel: 'CAMINA LIBRE',
          img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
          lat: 6.2089,
          lng: -75.5678,
          radiusMeters: 1200,
          hours: '07:00 – 00:00',
          visualPills: ['🌿 Peatonal', '☕ Cafés', '🟢 Vigilado'],
          summary: 'Corredores peatonales verdes llenos de cafés y restaurantes.',
          walletTip: 'No descuides tus objetos en mesas exteriores.',
          alertMessage: 'Zona Segura: Provenza y Laureles.'
        },
        {
          id: 'med-plaza-botero',
          name: 'Plaza Botero (Centro)',
          level: 'caution',
          levelLabel: 'SOLO DE DÍA',
          img: 'https://images.unsplash.com/photo-1599413987323-f12f62163b38?auto=format&fit=crop&w=600&q=80',
          lat: 6.2521,
          lng: -75.5683,
          radiusMeters: 850,
          hours: '09:00 – 16:30',
          visualPills: ['🌞 Solo de día', '💍 Sin joyas', '🚈 Sal por el Metro'],
          summary: 'Visítala de día y mantente dentro del perímetro del museo.',
          walletTip: 'Entra y sal directo por estación Parque Berrío.',
          alertMessage: 'Precaución en Centro: mantente en la plaza principal y guarda el celular.'
        },
        {
          id: 'med-prado-norte-centro',
          name: 'Norte del Centro / Barrio Prado (Noche)',
          level: 'danger',
          levelLabel: 'ZONA ROJA · EVITAR',
          img: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
          lat: 6.2585,
          lng: -75.5655,
          radiusMeters: 950,
          hours: 'No caminar',
          visualPills: ['🚫 No caminar', '📵 Guarda el cel', '🚈 Regresa al Metro'],
          summary: 'Calles solitarias fuera del anillo turístico del Museo.',
          walletTip: 'No tomes atajos a pie; usa Metro o Uber.',
          alertMessage: '¡ALERTA ROJA! Saliste del perímetro seguro del Centro. Regresa a la estación de Metro.'
        }
      ],
      emergencies: [
        { name: 'Emergencias Medellín', icon: '🚓', phone: '123', note: 'Policía y Salud 24/7' },
        { name: 'Policía de Turismo', icon: '🛡️', phone: '+573046289339', note: 'Atención al viajero' },
        { name: 'Clínica El Rosario', icon: '🏥', phone: '+576043269100', note: 'Urgencias El Poblado' }
      ],
      embassies: [
        { country: '🇲🇽 México', phone: '+576017477160', emergencyPhone: '+573138786028', address: 'Asistencia Consular Colombia', lat: 6.2089, lng: -75.5678 },
        { country: '🇪🇸 España', phone: '+576043123024', emergencyPhone: '+573164734216', address: 'Cra 43A #1A Sur-29, El Poblado', lat: 6.2035, lng: -75.5712 },
        { country: '🇺🇸 EE.UU.', phone: '+576012752000', emergencyPhone: '+576012752000', address: 'Emergencias Ciudadanos EE.UU.', lat: 6.2089, lng: -75.5678 }
      ],
      safetyTips: [
        {
          category: 'En la Calle',
          icon: '🛡️',
          title: 'Cero "Dar Papaya"',
          doText: '✅ Viste casual y guarda el teléfono al cruzar avenidas',
          dontText: '❌ No exhibas cadenas de oro, relojes caros ni iPhone en mano',
          detail: 'La discreción te da total tranquilidad.'
        },
        {
          category: 'Transporte',
          icon: '🚈',
          title: 'Metro de Día · App de Noche',
          doText: '✅ Usa el Metro/Metrocable de día y Uber/Didi de noche',
          dontText: '❌ No camines por el Centro después de las 5:00 PM',
          detail: 'El sistema Metro es limpísimo y muy seguro.'
        }
      ],
      itinerary: [
        {
          id: 'med-it-1',
          day: 'Día 1',
          time: '09:30',
          title: 'Comuna 13 + Metrocable',
          img: 'https://images.unsplash.com/photo-1599413987323-f12f62163b38?auto=format&fit=crop&w=600&q=80',
          neighborhood: 'San Javier',
          safetyLevel: 'safe',
          costEstimate: '$45,000 COP',
          guideTip: 'Recorre el circuito de las escaleras eléctricas entre 9 AM y 4 PM.',
          lat: 6.2459,
          lng: -75.6211,
          done: false
        }
      ],
      creatorSpots: [
        {
          id: 'med-cr-1',
          spot: 'Mirador Alto Comuna 13',
          img: 'https://images.unsplash.com/photo-1599413987323-f12f62163b38?auto=format&fit=crop&w=600&q=80',
          vibe: '🎨 Color y Arte · 10:00',
          bestTime: '10:00 hrs',
          hook: '“De barrio peligroso a galería al aire libre más vibrante…”',
          shotGuide: 'Graba subiendo el último tramo de escaleras eléctricas hacia el mirador.',
          safetyNote: 'Seguro dentro del corredor turístico.',
          hashtags: '#Medellin #DeLaVistaNaceElViaje #RumboPropio'
        }
      ],
      defaultExpenses: [
        { id: 'm1', desc: '🚕 Transporte Aeropuerto', amount: 110000, payer: 'Yo', category: 'Transporte' },
        { id: 'm2', desc: '🍛 Bandeja Paisa', amount: 95000, payer: 'Acompañante', category: 'Comida' }
      ]
    }
  },

  currencies: {
    USD: { code: 'USD', name: 'Dólar', flag: '🇺🇸', symbol: '$', perUSD: 1.0 },
    EUR: { code: 'EUR', name: 'Euro', flag: '🇪🇺', symbol: '€', perUSD: 0.925 },
    MXN: { code: 'MXN', name: 'Peso Mex', flag: '🇲🇽', symbol: '$', perUSD: 19.25 },
    COP: { code: 'COP', name: 'Peso Col', flag: '🇨🇴', symbol: '$', perUSD: 4050.0 },
    ARS: { code: 'ARS', name: 'Peso Arg', flag: '🇦🇷', symbol: '$', perUSD: 1180.0 },
    CLP: { code: 'CLP', name: 'Peso Chi', flag: '🇨🇱', symbol: '$', perUSD: 945.0 },
    PEN: { code: 'PEN', name: 'Sol Perú', flag: '🇵🇪', symbol: 'S/', perUSD: 3.74 },
    BRL: { code: 'BRL', name: 'Real Bras', flag: '🇧🇷', symbol: 'R$', perUSD: 5.48 },
    GBP: { code: 'GBP', name: 'Libra', flag: '🇬🇧', symbol: '£', perUSD: 0.77 }
  },

  exchangeGuides: {
    cdmx: {
      quickBills: [50, 100, 200, 500, 1000],
      bestPlaces: '✅ Aeropuerto T1 (Puertas 4 a 7) y Cajeros dentro de bancos (BBVA, Santander).',
      avoidPlaces: '❌ Cajeros sueltos en la calle y casas de cambio de noche.',
      atmRule: '🏧 En el cajero toca siempre "DECLINAR CONVERSIÓN" para ahorrar 10%.'
    },
    roma: {
      quickBills: [5, 10, 20, 50, 100],
      bestPlaces: '✅ Pago con celular/tarjeta y cajeros Bancomat de bancos (UniCredit, Intesa).',
      avoidPlaces: '❌ Cajeros azules "Euronet" y casas "Forexchange" (cobran 18%).',
      atmRule: '🏧 Elige siempre cobrar en EUROS ("Without Conversion").'
    },
    medellin: {
      quickBills: [10000, 20000, 50000, 100000, 200000],
      bestPlaces: '✅ Cajeros Bancolombia / Davivienda DENTRO de centros comerciales.',
      avoidPlaces: '❌ Cajeros abiertos a la calle.',
      atmRule: '🏧 Pide billetes de $10 mil y $20 mil para pagar taxis fácil.'
    }
  },

  esimAndPortals: {
    globalEsims: [
      {
        name: 'MobiMatter',
        icon: '⚡',
        priceTag: 'Desde $1.99 – $5 USD',
        badge: '🏆 Más Barata Mayorista',
        pills: ['📶 5G Local', '💳 Sin suscripción', '📲 QR en 1 min'],
        url: 'https://mobimatter.com',
        voice: 'MobiMatter: comparador mayorista de eSIM desde dos dólares, hasta sesenta por ciento más barato que en el aeropuerto.'
      },
      {
        name: 'eSIMDB (Comparador Mundial)',
        icon: '🔍',
        priceTag: 'Desde $1.50 USD',
        badge: '📊 Compara +70 marcas',
        pills: ['🌍 200 países', '💰 Filtra por GB/$', '🛡️ Sin sobreprecio'],
        url: 'https://esimdb.com',
        voice: 'eSIMDB: buscador que compara más de setenta marcas de eSIM para encontrar el precio más bajo por gigabyte.'
      },
      {
        name: 'Airalo / Nomad',
        icon: '✈️',
        priceTag: '$4.50 – $11 USD',
        badge: '⭐ Más Fácil de Instalar',
        pills: ['📲 App 1-clic', '🛬 Internet al aterrizar', '🔄 Recargable'],
        url: 'https://www.airalo.com',
        voice: 'Airalo y Nomad: ideales para instalar desde un botón antes de subir al avión y tener internet apenas aterrices.'
      },
      {
        name: 'Roamless (Saldo que NO vence)',
        icon: '♾️',
        priceTag: 'Pago por MB real',
        badge: '🔋 No Caduca Nunca',
        pills: ['🌎 1 sola eSIM mundial', '💵 Pagas lo que usas', '🔓 Sin vencimiento'],
        url: 'https://roamless.com',
        voice: 'Roamless: una sola eSIM para todos los países donde tu saldo nunca caduca.'
      }
    ],
    byDestination: {
      cdmx: {
        localSimDo: '✅ Chip "Bait" (en Walmart) o "Telcel Prepago" en cualquier OXXO: $100–$200 MXN ($5–$10 USD por 15 GB).',
        localSimDont: '❌ Kioscos dentro del aeropuerto que te venden el mismo chip en $40 USD.',
        portals: [
          { icon: '🎟️', name: 'INAH / Taquilla Oficial Museos', price: '$95 MXN ($5 USD)', avoid: 'Evita revendedores de $45 USD', url: 'https://www.inah.gob.mx' },
          { icon: '🚌', name: 'ADO Oficial (Puebla / Teotihuacán / Oaxaca)', price: 'Precio real de taquilla', avoid: 'Evita intermediarios con sobrecargo', url: 'https://www.ado.com.mx' },
          { icon: '🧳', name: 'Bounce / Stasher (Guardar maletas)', price: '$5 USD / día', avoid: 'En tiendas verificadas con seguro', url: 'https://usebounce.com' }
        ]
      },
      roma: {
        localSimDo: '✅ Máquina automática "Iliad Simbox" (€9.99 por 150 GB + UE) o TIM en tienda oficial.',
        localSimDont: '❌ Tiendas de souvenirs en Termini que cobran €40 por chips sin saldo.',
        portals: [
          { icon: '🏟️', name: 'ParcoColosseo.it (Web Oficial Coliseo)', price: '€18 EUR (Oficial)', avoid: 'Agencias cobran €60+ por lo mismo', url: 'https://ticketing.colosseo.it' },
          { icon: '🚄', name: 'Trenitalia / Italo Oficial (Trenes)', price: 'Desde €9.90 EUR', avoid: 'Compra directo sin comisión extra', url: 'https://www.trenitalia.com' },
          { icon: '🏛️', name: 'Musei Vaticani Oficial', price: '€20 EUR (Oficial)', avoid: 'Evita "revendedores de fila" en la calle', url: 'https://tickets.museivaticani.va' }
        ]
      },
      medellin: {
        localSimDo: '✅ Chip Claro o Tigo en tienda oficial de Centro Comercial (Santafé / El Tesoro): $25.000 COP ($6 USD por 15 GB).',
        localSimDont: '❌ Chips vendidos en la calle (bloquean tu celular si no registran tu pasaporte en tienda oficial).',
        portals: [
          { icon: '🚌', name: 'Pinbus.com / Terminal del Norte (Ir a Guatapé)', price: '$22.000 COP ($5.50 USD)', avoid: 'Tours cobran $45+ USD por llevarte apurado', url: 'https://www.pinbus.com' },
          { icon: '🚈', name: 'Tarjeta Cívica Eventual (Metro y Metrocable)', price: '$3.650 COP (<$1 USD)', avoid: 'Cómprala directo en taquilla del Metro', url: 'https://www.metrodemedellin.gov.co' }
        ]
      }
    }
  }
};

