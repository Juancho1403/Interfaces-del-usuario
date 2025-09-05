import React, { useEffect, useRef, useState } from 'react';
import './VideoViewer.css'; // opcional

/* Helpers para subtítulos (los mantuve) */
const parseTimestampToSeconds = (ts) => {
  const parts = ts.split(':').map(p => p.replace(',', '.'));
  let secs = 0;
  if (parts.length === 3) {
    secs = Number(parts[0]) * 3600 + Number(parts[1]) * 60 + Number(parts[2]);
  } else if (parts.length === 2) {
    secs = Number(parts[0]) * 60 + Number(parts[1]);
  } else {
    secs = Number(parts[0]);
  }
  return secs;
};

const parseVTTorSRT = (text) => {
  const cues = [];
  text = text.replace(/\r\n/g, '\n');
  text = text.replace(/^WEBVTT[^\n]*\n*/i, '');
  const blocks = text.split(/\n{2,}/);
  for (const block of blocks) {
    const match = block.match(/(\d{1,2}:\d{2}:\d{2}[.,]\d{3}|\d{1,2}:\d{2}[.,]\d{3}).*?-->\s*(\d{1,2}:\d{2}:\d{2}[.,]\d{3}|\d{1,2}:\d{2}[.,]\d{3})/);
    if (match) {
      const start = parseTimestampToSeconds(match[1].replace(',', '.'));
      const end = parseTimestampToSeconds(match[2].replace(',', '.'));
      const lines = block.split('\n').filter(l => !/^\s*\d+\s*$/.test(l) && !/-->/.test(l));
      const cueText = lines.join('\n').trim();
      cues.push({ start, end, text: cueText });
    }
  }
  return cues;
};

const srtToVttText = (srtText) => {
  const normalized = srtText.replace(/\r\n/g, '\n');
  return 'WEBVTT\n\n' + normalized.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2');
};

/**
 * VideoViewerSimple con subtítulos nativos funcionales y audio externo totalmente operativo
 * Props:
 *  - video: { file: string|File, name, audioTracks: [{id,name,language,src|file|url}], subtitles: [...] }
 *  - onClose: fn
 */
const VideoViewerSimple = ({ video = {}, onClose }) => {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const createdUrlsRef = useRef([]);

  const [videoSrc, setVideoSrc] = useState(() => {
    const f = video?.file;
    if (f instanceof File) {
      const u = URL.createObjectURL(f);
      createdUrlsRef.current.push(u);
      return u;
    }
    return typeof f === 'string' ? f : null;
  });

  const [audioTracks, setAudioTracks] = useState(() => {
    const tracks = Array.isArray(video?.audioTracks) ? video.audioTracks : [];
    const normalized = tracks.map((t, i) => {
      const src = t.src ?? t.file ?? t.url ?? null;
      if (src instanceof File) {
        const u = URL.createObjectURL(src);
        createdUrlsRef.current.push(u);
        return { id: t.id ?? `audio_${i}`, name: t.name ?? src.name, language: t.language ?? '', src: u };
      }
      return { id: t.id ?? `audio_${i}`, name: t.name ?? `Pista ${i + 1}`, language: t.language ?? '', src: src ?? null };
    });
    const base = [{ id: 'original', name: 'Audio Original', language: video?.info?.language || 'und', src: null }];
    return base.concat(normalized);
  });

  // Subtítulos normalizados
  const [subtitles, setSubtitles] = useState(() => {
    const subs = Array.isArray(video?.subtitles) ? video.subtitles : [];
    const normalized = subs.map((s, i) => {
      const src = s.src ?? s.file ?? s.url ?? null;
      if (src instanceof File) {
        const u = URL.createObjectURL(src);
        createdUrlsRef.current.push(u);
        return { id: s.id ?? `sub_${i}`, name: s.name ?? src.name, language: s.language ?? '', src: u };
      }
      return { id: s.id ?? `sub_${i}`, name: s.name ?? `Sub ${i + 1}`, language: s.language ?? '', src: src ?? null };
    });
    return [{ id: 'disabled', name: 'Desactivado', language: 'none', src: null }, ...normalized];
  });

  const [currentSubtitle, setCurrentSubtitle] = useState('disabled');
  const [subtitleText, setSubtitleText] = useState(''); // overlay fallback
  const [currentAudioTrack, setCurrentAudioTrack] = useState('original');

  // Estados de reproducción (útiles para decidir si reproducir audio externo al cambiar pista)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // When video prop changes, recreate objectURLs and reset arrays
  useEffect(() => {
    const f = video?.file;
    if (f instanceof File) {
      const u = URL.createObjectURL(f);
      createdUrlsRef.current.push(u);
      setVideoSrc(u);
    } else if (typeof f === 'string') {
      setVideoSrc(f);
    } else {
      setVideoSrc(null);
    }

    if (Array.isArray(video?.audioTracks)) {
      const incoming = video.audioTracks.map((t, i) => {
        const s = t.src ?? t.file ?? t.url ?? null;
        if (s instanceof File) {
          const u = URL.createObjectURL(s);
          createdUrlsRef.current.push(u);
          return { id: t.id ?? `audio_${i}`, name: t.name ?? s.name, language: t.language ?? '', src: u };
        }
        return { id: t.id ?? `audio_${i}`, name: t.name ?? `Pista ${i + 1}`, language: t.language ?? '', src: s ?? null };
      });
      setAudioTracks([{ id: 'original', name: 'Audio Original', language: video?.info?.language || 'und', src: null }, ...incoming]);
      setCurrentAudioTrack('original');
    }

    if (Array.isArray(video?.subtitles)) {
      const incoming = video.subtitles.map((s, i) => {
        const src = s.src ?? s.file ?? s.url ?? null;
        if (src instanceof File) {
          const u = URL.createObjectURL(src);
          createdUrlsRef.current.push(u);
          return { id: s.id ?? `sub_${i}`, name: s.name ?? src.name, language: s.language ?? '', src: u };
        }
        return { id: s.id ?? `sub_${i}`, name: s.name ?? `Sub ${i + 1}`, language: s.language ?? '', src: src ?? null };
      });
      setSubtitles([{ id: 'disabled', name: 'Desactivado', language: 'none', src: null }, ...incoming]);
      setCurrentSubtitle('disabled');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video]);

  // cleanup objectURLs
  useEffect(() => {
    return () => {
      createdUrlsRef.current.forEach(u => {
        try { URL.revokeObjectURL(u); } catch {}
      });
      createdUrlsRef.current = [];
    };
  }, []);

  // Apply native textTrack mode (showing/hidden)
  const applySubtitleMode = (subtitleId) => {
    const v = videoRef.current;
    if (!v) return;
    const tracks = v.textTracks || [];
    for (let i = 0; i < tracks.length; i++) {
      const t = tracks[i];
      const match = subtitleId !== 'disabled' &&
        (t.label === subtitleId || t.language === subtitleId || String(i) === String(subtitleId));
      try {
        t.mode = match ? 'showing' : 'hidden';
      } catch {
        try { t.mode = match ? 'showing' : 'disabled'; } catch {}
      }
    }
  };

  // Listeners: activeCues for native subtitles + audio sync + playing state
  useEffect(() => {
    const v = videoRef.current;
    const a = audioRef.current;
    if (!v) return;

    const onLoaded = () => applySubtitleMode(currentSubtitle);

    const onTime = () => {
      const now = v.currentTime || 0;

      // leer activeCues si el navegador las expone
      let shown = false;
      const tt = v.textTracks || [];
      for (let i = 0; i < tt.length; i++) {
        try {
          const track = tt[i];
          if (track.mode === 'showing' && track.activeCues && track.activeCues.length > 0) {
            const t = Array.from(track.activeCues).map(c => c.text).join('\n');
            setSubtitleText(t);
            shown = true;
            break;
          }
        } catch {}
      }
      if (!shown) setSubtitleText('');

      // sync external audio if selected
      if (a && currentAudioTrack !== 'original' && a.src) {
        const diff = Math.abs((a.currentTime || 0) - now);
        if (diff > 0.35) {
          try { a.currentTime = now; } catch {}
        }
      }
    };

    const onPlayVideo = () => setIsVideoPlaying(true);
    const onPauseVideo = () => setIsVideoPlaying(false);

    const onPlayAudio = () => setIsAudioPlaying(true);
    const onPauseAudio = () => setIsAudioPlaying(false);

    const onRate = () => {
      if (a) a.playbackRate = v.playbackRate || 1;
    };

    v.addEventListener('loadedmetadata', onLoaded);
    v.addEventListener('timeupdate', onTime);
    v.addEventListener('play', onPlayVideo);
    v.addEventListener('pause', onPauseVideo);
    v.addEventListener('ratechange', onRate);

    if (a) {
      a.addEventListener('play', onPlayAudio);
      a.addEventListener('pause', onPauseAudio);
      a.addEventListener('ratechange', onRate);
    }

    return () => {
      v.removeEventListener('loadedmetadata', onLoaded);
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('play', onPlayVideo);
      v.removeEventListener('pause', onPauseVideo);
      v.removeEventListener('ratechange', onRate);

      if (a) {
        a.removeEventListener('play', onPlayAudio);
        a.removeEventListener('pause', onPauseAudio);
        a.removeEventListener('ratechange', onRate);
      }
    };
  }, [currentSubtitle, currentAudioTrack]);

  // Efecto central: cuando cambia currentAudioTrack aplicamos/mutear, asignamos src y sincronizamos.
  useEffect(() => {
    const v = videoRef.current;
    const a = audioRef.current;
    const selected = audioTracks.find(t => t.id === currentAudioTrack);

    if (!selected || currentAudioTrack === 'original') {
      // volver al audio original del video
      if (v) v.muted = false;
      if (a) {
        a.pause();
        a.src = '';
      }
      return;
    }

    // pista externa seleccionada
    if (v) v.muted = true;
    if (!a) return;

    const wasPlaying = v && !v.paused;

    // Si es la misma src, no reasignar (para evitar reload)
    if (a.src !== selected.src) {
      a.src = selected.src;
    }
    // sincronizar tiempo y velocidad
    try { a.currentTime = v?.currentTime || 0; } catch {}
    try { a.playbackRate = v?.playbackRate || 1; } catch {}

    // si el video está reproduciéndose, lanzar audio externo
    if (wasPlaying) {
      a.play().catch(() => {});
    } else {
      // no reproducir automáticamente si el video está en pausa; el usuario decide
      // (pero dejamos el src listo)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAudioTrack, audioTracks]);

  // handle change: sólo setea el estado (el efecto hace el resto)
  const handleAudioTrackChange = (trackId) => {
    setCurrentAudioTrack(trackId);
  };

  // añadir pista de audio local (y seleccionarla)
  const addAudioTrack = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const u = URL.createObjectURL(file);
      createdUrlsRef.current.push(u);
      const newTrack = { id: `audio_${Date.now()}`, name: file.name, language: 'und', src: u };
      setAudioTracks(prev => {
        const next = [...prev, newTrack];
        // seleccionar inmediatamente la nueva pista
        setCurrentAudioTrack(newTrack.id);
        return next;
      });
    };
    input.click();
  };

  // añadir subtítulo local (.vtt .srt)
  const addSubtitleFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.vtt,.srt,text/vtt,text/plain';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        let content = ev.target.result;
        const isVtt = file.name.toLowerCase().endsWith('.vtt') || content.trim().startsWith('WEBVTT');
        if (!isVtt) content = srtToVttText(content);
        const blob = new Blob([content], { type: 'text/vtt' });
        const url = URL.createObjectURL(blob);
        createdUrlsRef.current.push(url);
        const newSub = {
          id: `sub_${Date.now()}`,
          name: file.name,
          language: file.name.toLowerCase().includes('es') ? 'es' : file.name.toLowerCase().includes('en') ? 'en' : '',
          src: url
        };
        setSubtitles(prev => [...prev, newSub]);
        setTimeout(() => setCurrentSubtitle(newSub.id), 150);
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // Forzar sincronía manual
  const forceSync = () => {
    const v = videoRef.current;
    const a = audioRef.current;
    if (!v || !a) return;
    try { a.currentTime = v.currentTime || 0; } catch {}
  };

  const getActiveTrackLabel = () => {
    const sel = audioTracks.find(t => t.id === currentAudioTrack);
    if (!sel || currentAudioTrack === 'original') return 'Audio original (dentro del video)';
    return `${sel.name}${sel.language ? ` (${sel.language})` : ''}`;
  };

  return (
    <div className="video-viewer-modal" style={{
      position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.6)', zIndex: 9999, padding: 16
    }}>
      <div className="video-viewer-content" style={{ width: '100%', maxWidth: 980, borderRadius: 10, overflow: 'hidden', background: '#111', padding: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h4 style={{ margin: 0, color: '#fff' }}>{video.name || 'Video'}</h4>
          <div>
            <button className="btn btn-sm" onClick={() => {
              if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
              if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ''; }
              onClose && onClose();
            }}>Cerrar</button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
          <video
            ref={videoRef}
            src={videoSrc}
            controls
            muted={currentAudioTrack !== 'original'}
            style={{ width: '100%', maxHeight: '65vh', borderRadius: 8, background: '#000' }}
          >
            {subtitles.filter(s => s.id !== 'disabled' && s.src).map(s => (
              <track
                key={s.id}
                kind="subtitles"
                srcLang={s.language || ''}
                label={s.name}
                src={s.src}
              />
            ))}
            Tu navegador no soporta el elemento <code>video</code>.
          </video>
          <audio ref={audioRef} style={{ display: 'none' }} />
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <label style={{ color: '#ddd' }}>Pista de audio:</label>
            <select value={currentAudioTrack} onChange={(e) => handleAudioTrackChange(e.target.value)} style={{ padding: '6px 8px' }}>
              {audioTracks.map(a => <option key={a.id} value={a.id}>{a.name}{a.language ? ` (${a.language})` : ''}</option>)}
            </select>
            <button className="btn btn-sm" onClick={addAudioTrack}>+ Añadir</button>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <label style={{ color: '#ddd' }}>Subtítulos:</label>
            <select value={currentSubtitle} onChange={(e) => setCurrentSubtitle(e.target.value)} style={{ padding: '6px 8px' }}>
              {subtitles.map(s => <option key={s.id} value={s.id}>{s.name}{s.language ? ` (${s.language})` : ''}</option>)}
            </select>
            <button className="btn btn-sm" onClick={addSubtitleFile}>+ Añadir</button>
          </div>

          <div style={{ color: '#ddd', fontSize: 14, display: 'flex', gap: 12, alignItems: 'center' }}>
            <div>
              <div>Activo: <strong style={{ color: '#fff' }}>{getActiveTrackLabel()}</strong></div>
              <div style={{ fontSize: 12, color: '#bdbdbd' }}>
                {currentAudioTrack === 'original'
                  ? (isVideoPlaying ? 'Reproduciendo (video)' : 'Pausado (video)')
                  : (isAudioPlaying ? 'Reproduciendo (audio externo)' : 'Pausado (audio externo)')}
              </div>
            </div>
            <button className="btn btn-sm btn-outline-light" onClick={forceSync} title="Forzar sincronía">Forzar sincronía</button>
          </div>
        </div>

        {/* overlay opcional */}
        <div className="subtitle-overlay" aria-live="polite" style={{ textAlign: 'center', marginTop: 12 }}>
          {subtitleText ? (
            <div style={{
              display: 'inline-block',
              background: 'rgba(0,0,0,0.65)',
              color: 'white',
              padding: '8px 12px',
              borderRadius: 6,
              maxWidth: '90%',
              fontSize: 16,
              lineHeight: 1.3
            }}>
              {subtitleText.split('\n').map((line, i) => <div key={i}>{line}</div>)}
            </div>
          ) : null}
        </div>

      </div>
    </div>
  );
};

export default VideoViewerSimple;
