document.addEventListener('DOMContentLoaded', function() {

    const audio = document.getElementById('song-player'); 
    const preloader = document.getElementById('preloader');
    
    const clickSound = new Audio('https://www.fesliyanstudios.com/play-mp3/387');
    const swooshSound = new Audio('https://www.fesliyanstudios.com/play-mp3/570');
    
    document.querySelectorAll('.tab-button, .close-btn, .links-grid a, .player-ctrl-btn').forEach(element => {
        element.addEventListener('click', () => {
            if (element.matches('.links-grid a')) {
                swooshSound.currentTime = 0;
                swooshSound.play().catch(e => console.log("Error al reproducir swoosh:", e));
            } else {
                clickSound.currentTime = 0;
                clickSound.play().catch(e => console.log("Error al reproducir click:", e));
            }
        });
    });

    document.querySelectorAll('.typewriter').forEach((element, index) => {
        const text = element.textContent;
        element.innerHTML = '';
        element.style.opacity = 1;
        let i = 0;
        setTimeout(() => {
            const typing = setInterval(() => {
                if (i < text.length) {
                    i += 8; element.textContent = text.slice(0, i);
                } else {
                    clearInterval(typing);
                }
            }, 25);
        }, 500 + index * 100); 
    });

    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const xOffset = (clientX / innerWidth - 0.5) * -2;
        const yOffset = (clientY / innerHeight - 0.5) * -2;
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            /* parallax desactivado por rendimiento */
        }
    });

    const tabButtons = document.querySelectorAll('.tab-button');
    const closeButtons = document.querySelectorAll('.close-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const paneId = button.dataset.tab;
            document.getElementById(paneId).classList.add('active');
            if (paneId === 'stats-tab') { animateStats(); }
        });
    });
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.overlay-pane').classList.remove('active');
        });
    });
    function animateStats() {
        const bars = document.querySelectorAll('.overlay-pane.active .fill');
        bars.forEach(bar => {
            bar.style.transition = 'none';
            bar.style.width = '0%';
            void bar.offsetWidth; 
            bar.style.transition = 'width 1s ease-in-out';

            let rawVal = bar.getAttribute('data-p');
            if(rawVal) {
                const percentage = rawVal.replace('%', '').trim();
                setTimeout(() => {
                    bar.style.width = percentage + '%';
                }, 50);
            }
        });
    }
    
    // =================================================================
    // === CONFIGURACIÓN DE CANCIONES ===
    // =================================================================
    const songs = [
        {
            title: "Ladybug Pv",
            artist: "Noam Kaniel",
            src: "song.mp3",
            lyrics: 
[
  { "time": 7, "line": "Dime ahora, chica linda" },
  { "time": 11, "line": "Nunca podrías dejar de ser despistada" },
  { "time": 15, "line": "Demasiado perdida" },
  { "time": 16, "line": "¿Acaso no lo ves ya?" },
  { "time": 18, "line": "¿Sabes que me siento tan mal?" },
  { "time": 21, "line": "Cada amor que pasó por tu mente" },
  { "time": 25, "line": "Dar amor" },
  { "time": 27, "line": "Terminó mal" },
  { "time": 29, "line": "Quizá el amor pueda calmar tu dolor" },
  { "time": 33, "line": "Reconciliarse" },
  { "time": 35, "line": "Hacer que todo mejore" },
  { "time": 36, "line": "Mejore, mejore, mejore, mejore" },
  { "time": 54, "line": "¡Vamos, Ladybug! No dudes, hasta encontrar un camino" },
  { "time": 59, "line": "Por siempre" },
  { "time": 62, "line": "¡Vamos, Ladybug! Tenemos una meta, algún día estaremos bien" },
  { "time": 67, "line": "Juntos" },
  { "time": 69, "line": "¿Sabías que nunca podría ser suficiente?" },
  { "time": 72, "line": "Porque necesito lo que me arrebataron" },
  { "time": 76, "line": "Llevando todo hacia un amor mejor" },
  { "time": 79, "line": "Cuando lo necesites, hasta el final" },
  { "time": 83, "line": "Cuando todo te da vueltas en la cabeza" },
  { "time": 87, "line": "Dar amor" },
  { "time": 89, "line": "Terminó mal" },
  { "time": 91, "line": "Y el amor puede robarte el dolor" },
  { "time": 94, "line": "Reconciliarse" },
  { "time": 96, "line": "Hacer que todo mejore, mejore, mejore, mejore, mejore..." },
  { "time": 116, "line": "¡Vamos, Ladybug! No dudes, hasta encontrar un camino" },
  { "time": 120, "line": "Por siempre" },
  { "time": 123, "line": "¡Vamos, Ladybug! Tenemos una meta, algún día estaremos bien" },
  { "time": 128, "line": "Juntos" },
  { "time": 130, "line": "¡Vamos, Ladybug! No dudes, hasta encontrar un camino" },
  { "time": 135, "line": "Por siempre" },
  { "time": 138, "line": "¡Vamos, Ladybug! Tenemos una meta, algún día estaremos bien" },
  { "time": 143, "line": "Juntos" }
]
        }
    ];

    let currentSongIndex = 0;
    let currentLyricIndex = -1;

    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const songTitleEl = document.getElementById('song-title');
    const songArtistEl = document.getElementById('song-artist');
    const spotifyIcon = document.querySelector('.spotify-icon');
    
    const lyricsContainer = document.getElementById('lyrics-container');
    
    const playIcon = '<i class="fas fa-play"></i>';
    const pauseIcon = '<i class="fas fa-pause"></i>';

    function loadSong(songIndex) {
        const song = songs[songIndex];
        audio.src = song.src;
        songTitleEl.textContent = song.title;
        songArtistEl.textContent = song.artist;
        loadLyrics(song.lyrics);
        audio.pause();
        playPauseBtn.innerHTML = playIcon;
        spotifyIcon.classList.remove('is-spinning');
    }

    function loadLyrics(lyrics) {
        lyricsContainer.innerHTML = ''; 
        currentLyricIndex = -1; 

        if (!lyrics || lyrics.length === 0) {
            lyricsContainer.innerHTML = '<p class="lyric-line active">♪ No hay letra para esta canción ♪</p>';
            return;
        }

        lyrics.forEach((line, index) => {
            const p = document.createElement('p');
            p.textContent = line.line;
            p.classList.add('lyric-line');
            p.dataset.index = index; 
            lyricsContainer.appendChild(p);
        });
        
        lyricsContainer.style.transform = `translateY(0px)`;
    }

    playPauseBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().catch(e => console.error("Error al intentar reproducir:", e));
            playPauseBtn.innerHTML = pauseIcon;
            spotifyIcon.classList.add('is-spinning');
        } else {
            audio.pause();
            playPauseBtn.innerHTML = playIcon;
            spotifyIcon.classList.remove('is-spinning');
        }
    });

    prevBtn.addEventListener('click', () => {
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = songs.length - 1; 
        }
        loadSong(currentSongIndex);
        audio.play().catch(e => console.error("Error al intentar reproducir:", e)); 
        playPauseBtn.innerHTML = pauseIcon;
        spotifyIcon.classList.add('is-spinning');
    });

    nextBtn.addEventListener('click', () => {
        currentSongIndex++;
        if (currentSongIndex >= songs.length) {
            currentSongIndex = 0; 
        }
        loadSong(currentSongIndex);
        audio.play().catch(e => console.error("Error al intentar reproducir:", e)); 
        playPauseBtn.innerHTML = pauseIcon;
        spotifyIcon.classList.add('is-spinning');
    });

    audio.addEventListener('ended', () => {
        nextBtn.click(); 
    });

    audio.addEventListener('timeupdate', () => {
        const currentTime = audio.currentTime;
        const lyrics = songs[currentSongIndex].lyrics;

        if (!lyrics || lyrics.length === 0) return; 

        let newActiveIndex = -1;
        for (let i = lyrics.length - 1; i >= 0; i--) {
            if (currentTime >= lyrics[i].time) {
                newActiveIndex = i;
                break;
            }
        }

        if (newActiveIndex === currentLyricIndex) {
            return;
        }

        currentLyricIndex = newActiveIndex;

        lyricsContainer.querySelectorAll('.lyric-line').forEach(lineEl => {
            lineEl.classList.remove('active');
        });

        if (currentLyricIndex !== -1) {
            const activeLine = lyricsContainer.querySelector(`.lyric-line[data-index="${currentLyricIndex}"]`);
            if (activeLine) {
                activeLine.classList.add('active');
                const scrollOffset = activeLine.offsetTop - (100 / 2) + (activeLine.clientHeight / 2);
                lyricsContainer.style.transform = `translateY(-${scrollOffset}px)`;
            }
        } else {
            lyricsContainer.style.transform = `translateY(0px)`;
        }
    });

    loadSong(currentSongIndex);

    const fnafSticker=document.getElementById('fnaf-sticker');const honkSound=new Audio('https://www.myinstants.com/media/sounds/fnaf-nose-honk.mp3');fnafSticker.addEventListener('click',()=>{honkSound.currentTime=0;honkSound.play().catch(e => {})});
    const copyBtn = document.getElementById('copy-link-btn');
    const originalBtnText = copyBtn.innerHTML;
    copyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(window.location.href).then(() => {
            copyBtn.innerHTML = '<i class="fas fa-check"></i> ¡Copiado!';
            copyBtn.classList.add('copied');
            swooshSound.currentTime = 0;
            swooshSound.play().catch(err => {});
            setTimeout(() => {
                copyBtn.innerHTML = originalBtnText;
                copyBtn.classList.remove('copied');
            }, 2000);
        });
    });

    // OCULTAR PRELOADER AL FINAL
    preloader.classList.add('loaded');

});
                          

/* =====================================================
   EXTRAS: luces, partículas y amigos creadores
   ===================================================== */
document.addEventListener('DOMContentLoaded', function () {

    // ---- AMIGOS CREADORES: edita esta lista ----
    // nombre: su nombre | rol: qué crea | imagen: link o archivo de su avatar | url: su perfil
    const AMIGOS = [
        { nombre: "Amigo 1", rol: "Creadora de bots", imagen: "amigo1.png", url: "#" },
        { nombre: "Amigo 2", rol: "Escritor",         imagen: "amigo2.png", url: "#" },
        { nombre: "Amigo 3", rol: "Artista",          imagen: "amigo3.png", url: "#" },
        { nombre: "Amigo 4", rol: "Creador de bots",  imagen: "amigo4.png", url: "#" }
    ];
    const grid = document.getElementById('amigos-grid');
    if (grid) {
        grid.innerHTML = AMIGOS.map(a => `
            <a class="friend-card" href="${a.url}" target="_blank" rel="noopener">
                <span class="friend-av"><img src="${a.imagen}" alt="${a.nombre}" onerror="this.style.visibility='hidden'"></span>
                <b>${a.nombre}</b><small>${a.rol}</small>
            </a>`).join('');
    }

    // ---- Luces de hadas ----
    const lights = document.getElementById('fairy-lights');
    if (lights) {
        const cols = ['#9ad0ff', '#c7b8ff', '#ffffff', '#7fe3ff', '#b3c7ff'];
        for (let i = 0; i < 14; i++) {
            const b = document.createElement('i');
            b.style.setProperty('--i', i);
            b.style.setProperty('--bulb', cols[i % cols.length]);
            lights.appendChild(b);
        }
    }

    // ---- Partículas brillantes flotando ----
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const layer = document.createElement('div');
        layer.className = 'sparkle-layer';
        document.body.appendChild(layer);
        const sym = ['✦', '♡', '✧', '✚', '⋆', '❄'];
        for (let i = 0; i < 12; i++) {
            const s = document.createElement('span');
            s.textContent = sym[i % sym.length];
            s.style.cssText = `left:${Math.random() * 100}%;font-size:${10 + Math.random() * 16}px;animation-duration:${8 + Math.random() * 10}s;animation-delay:${-Math.random() * 14}s`;
            layer.appendChild(s);
        }
    }
});

/* =====================================================
   V3: interacción, mascota, decoraciones y stats de 5 divisiones
   ===================================================== */
document.addEventListener('DOMContentLoaded', function () {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const card = document.querySelector('.card-wrapper');
    const scroller = document.querySelector('.scroll-container');

    // ---- Stats: porcentaje -> X/5 (la barra se llena por divisiones) ----
    document.querySelectorAll('.stat-item').forEach(it => {
        const f = it.querySelector('.fill'); if (!f) return;
        const p = parseFloat(f.dataset.p) || 0;
        const v = Math.max(p > 0 ? 0.5 : 0, Math.round(p / 20 * 2) / 2);
        it.lastElementChild.textContent = '★ ' + v + '/5';
    });

    // ---- Barra de luz de scroll ----
    const sg = document.createElement('div');
    sg.className = 'scroll-glow'; sg.innerHTML = '<i></i>';
    document.querySelector('.tabs-header').after(sg);
    scroller.addEventListener('scroll', () => {
        const m = scroller.scrollHeight - scroller.clientHeight;
        sg.firstChild.style.width = (m > 0 ? scroller.scrollTop / m * 100 : 0) + '%';
    });

    // ---- Ecualizador junto a la canción ----
    const si = document.querySelector('.song-info');
    if (si) si.insertAdjacentHTML('beforeend', '<div class="eq"><i></i><i></i><i></i><i></i><i></i></div>');

    // ---- Divisores con caritas antes de cada subtítulo de la ficha ----
    const caras = ['(˶ᵔ ᵕ ᵔ˶)', '(っ◕‿◕)っ', '૮ ˶• ﻌ •˶ ა', '(ᵔ◡ᵔ)'];
    document.querySelectorAll('.paper-section h3').forEach((h, i) => {
        h.insertAdjacentHTML('beforebegin', `<div class="deco-strip"><i class="fas fa-xmark"></i><i class="fas fa-heart"></i><span>${caras[i % caras.length]}</span><i class="fas fa-heart"></i><i class="fas fa-xmark"></i></div>`);
    });
    document.querySelectorAll('.pane-inner .note-card').forEach(n => {
        n.insertAdjacentHTML('beforebegin', '<div class="deco-strip"><i class="fas fa-snowflake"></i><i class="fas fa-heart"></i><span>(ᵔᴥᵔ)</span><i class="fas fa-heart"></i><i class="fas fa-snowflake"></i></div>');
    });

    // ---- Decoraciones en los bordes de la tarjeta ----
    [['fa-heart','left:-16px;top:16%',26],['fa-xmark','right:-14px;top:12%',24],['fa-star','left:-14px;top:42%',22],['fa-snowflake','right:-16px;top:38%',26],
     ['fa-gem','left:-16px;top:68%',22],['fa-cloud','right:-18px;top:62%',28],['fa-moon','left:-12px;top:88%',22],['fa-paper-plane','right:-14px;top:86%',22]]
    .forEach(([ic, pos, sz], i) => {
        const d = document.createElement('i');
        d.className = `fas ${ic} deco`;
        d.style.cssText = `${pos};font-size:${sz}px;animation-delay:${-i * .5}s`;
        card.appendChild(d);
    });

    // ---- Chibis extra (pon la imagen y aparece; si no existe, no se ve) ----
    [['.paper-section','chibi_ficha.png','slot-ficha'],['.player-section','chibi_player.png','slot-player'],
     ['.character-gallery','chibi_bots.png','slot-bots'],['.card-wrapper','chibi_pie.png','slot-pie']]
    .forEach(([sel, file, cls]) => {
        const t = document.querySelector(sel); if (!t) return;
        const im = new Image(); im.src = file; im.alt = '';
        im.className = 'slot-chibi ' + cls; im.onerror = () => im.remove();
        t.appendChild(im);
    });

    // ---- Estrellitas al tocar y estela del cursor ----
    const sym = ['✦', '♡', '✧', '✚', '★', '❄', 'ෆ'];
    function burst(x, y, n) {
        if (document.querySelectorAll('.burst').length > 24) return;
        for (let i = 0; i < n; i++) {
            const s = document.createElement('span'), a = Math.random() * 6.28, d = 30 + Math.random() * 50;
            s.className = 'burst'; s.textContent = sym[Math.random() * sym.length | 0];
            s.style.cssText = `left:${x}px;top:${y}px;--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d}px;font-size:${10 + Math.random() * 12}px`;
            document.body.appendChild(s); setTimeout(() => s.remove(), 800);
        }
    }
    document.addEventListener('click', e => {
        burst(e.clientX, e.clientY, 6);
        const t = e.target.closest('.sticker,.peek,.slot-chibi,.deco,#mascot');
        if (t) { t.classList.remove('boing'); void t.offsetWidth; t.classList.add('boing'); t.addEventListener('animationend', () => t.classList.remove('boing'), { once: true }); }
    });

    // ---- Mascota que habla ----
    const msgs = ['¡Tú también importas! ♡', '(˶ᵔ ᵕ ᵔ˶) ¡Hola!', 'Dale play a la canción ♪', '¿Ya viste los stats? ✧', 'Gracias por estar aquí ♡', 'Los bots te esperan (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧', 'Toca los chibis, ¡reaccionan! ✦', 'Psst... (¬‿¬) el gato negro te observa', '¡Miau! ฅ^•ﻌ•^ฅ', 'Hoy te ves increíble ✧', '¿Y si le das play otra vez? ♪', 'Estoy hecho de brillitos ✦', 'No me toques tanto... jeje (˶ᵔ ᵕ ᵔ˶)', 'Un cafecito y seguimos ☕', '¡Sigue brillando! ★'];
    const m = document.createElement('button'), b = document.createElement('div');
    m.id = 'mascot'; m.setAttribute('aria-label', 'Mascota');
    // MASCOTA: guarda tu chibi como mascota.png (si no existe se ve la carita)
    m.innerHTML = '<img src="mascota.png" alt="" onerror="this.remove()"><span class="mface">ฅ^•ﻌ•^ฅ</span>';
    b.id = 'mascot-bubble';
    document.body.append(b, m);
    let bt, k = -1;
    function say(t) { b.textContent = t; b.classList.add('show'); clearTimeout(bt); bt = setTimeout(() => b.classList.remove('show'), 3500); }
    m.addEventListener('click', () => { let r; do { r = Math.random() * msgs.length | 0; } while (r === k); k = r; say(msgs[r]); });
    setTimeout(() => say('¡Bienvenid@! (˶ᵔ ᵕ ᵔ˶)'), 2500);
    // Reacciona a la música
    const au = document.getElementById('song-player');
    if (au) { au.addEventListener('play', () => say('♪ ¡Buena elección! ♪')); }
});

/* =====================================================
   V4: SONIDOS (sintetizados en el navegador, sin archivos)
   ===================================================== */
document.addEventListener('DOMContentLoaded', function () {
    let ac, on = true;
    const ctx = () => ac || (ac = new (window.AudioContext || window.webkitAudioContext)());
    function tone(f0, f1, d, type = 'sine', vol = .15, delay = 0) {
        try {
            const c = ctx(), t = c.currentTime + delay, o = c.createOscillator(), g = c.createGain();
            o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + d);
            g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + d);
            o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + d + .02);
        } catch (e) {}
    }
    const S = {
        pop:    () => tone(500 + Math.random() * 500, 1200, .09, 'sine', .12),
        boing:  () => { tone(200, 600, .12, 'sine', .2); tone(600, 150, .35, 'triangle', .2, .1); },
        bloop:  () => tone(900, 300, .15, 'sine', .18),
        squeak: () => { tone(1400, 2200, .08, 'square', .05); tone(2200, 1600, .1, 'square', .05, .08); },
        wow:    () => { tone(300, 700, .15, 'square', .05); tone(700, 350, .2, 'square', .05, .15); },
        meow:   () => { tone(500, 900, .18, 'sawtooth', .06); tone(900, 450, .3, 'sawtooth', .06, .18); },
        chime:  () => [784, 988, 1319, 1568].forEach((f, i) => tone(f, f * 1.001, .25, 'sine', .1, i * .07))
    };
    const fun = ['boing', 'bloop', 'squeak', 'wow', 'meow'];
    document.addEventListener('click', e => {
        if (!on) return;
        const t = e.target;
        if (t.closest('#sfx-toggle')) return;
        if (t.closest('#mascot')) return S.meow();
        if (t.closest('.sticker,.peek,.slot-chibi,.deco')) return S.boing();
        if (t.closest('.tab-button,.close-btn')) return S.chime();
        if (Math.random() < .3) S[fun[Math.random() * fun.length | 0]](); else S.pop();   // a veces suena algo chistoso
    });
    const au = document.getElementById('song-player');
    if (au) au.addEventListener('play', () => on && S.chime());
    const btn = document.createElement('button');
    btn.id = 'sfx-toggle'; btn.textContent = '🔊'; btn.setAttribute('aria-label', 'Sonidos');
    btn.addEventListener('click', () => { on = !on; btn.textContent = on ? '🔊' : '🔇'; if (on) S.chime(); });
    document.body.appendChild(btn);
});
