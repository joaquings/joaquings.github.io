---
title: Buscando el software de playout perfecto para vMix
date: 2026-09-29
author: JAGS
summary: Bitácora no muy clara de mi investigación sobre sistemas de playout.
tags: [video][software][broadcast]
---

<article class="post">

  <p>
    Hace un tiempo me empezó a molestar una cosa bastante específica de trabajar con vMix.
  </p>

  <p>
    Y es que cuando tenés pocos videos, todo bien. Metés los archivos como inputs, les ponés un nombre más o menos decente y listo.
  </p>

  <p>
    El problema aparece cuando empezás a tener muchos.
  </p>

  <p>
    Aperturas, cierres, separadores, bumpers, publicidades, videos de invitados, loops, fondos, distintas versiones del mismo video, cosas que capaz usás una vez cada tres meses pero que <em>justo ese día</em> necesitás tener a mano.
  </p>

  <p>
    Y ahí vMix empieza a convertirse medio en un cajón de cosas.
  </p>

  <p>
    El problema ya no es reproducir un video. Eso vMix lo hace perfectamente.
  </p>

  <p>
    El problema es <strong>encontrar el video que querés reproducir cuando lo necesitás</strong>.
  </p>

  <p>
    Y si estás en medio de una transmisión, no tenés muchas ganas de ponerte a navegar carpetas buscando
    <code>apertura_programa_v7_FINAL_FINAL_ahora_si.mp4</code>.
  </p>

  <p>
    Quería un híbrido entre un media browser y un sistema de playout. Una biblioteca de contenido donde pudiera encontrar las cosas rápido, ver qué son, preparar algo y dispararlo cuando correspondiera.
  </p>

  <p>
    Pero sin reemplazar vMix. Ese era el problema.
  </p>

  <h2>¿Por qué no simplemente usar vMix?</h2>

  <p>
    Porque obviamente la respuesta más fácil sería: "usá vMix".
  </p>

  <p>
    Y sí. Durante mucho tiempo lo hice.
  </p>

  <p>
    vMix tiene playlists, triggers, scripting, NDI, etc. Podés hacer bastante sin salir de la aplicación.
  </p>

  <p>
    Pero hay una diferencia entre <strong>poder hacer algo</strong> y que sea cómodo hacerlo cuando estás operando.
  </p>

  <p>
    Si tengo cinco videos, probablemente ni me importe.
  </p>

  <p>
    Si tengo cincuenta, ya empieza a ser molesto.
  </p>

  <p>
    Si tengo cien o más, quiero otra cosa.
  </p>

  <p>
    Quiero poder mirar la interfaz y reconocer visualmente el contenido. Quiero poder buscarlo (por categorías o tags por ejemplo). Quiero saber cuánto dura, previsualizarlo. Quiero poder poner algo en cue mientras otra cosa está al aire.
  </p>

  <p>
    Y, sobre todo, quiero poder hacerlo rápido. Porque eso terminó siendo medio que uno de los criterios más importantes de toda esta búsqueda.
  </p>

  <p>
    No me sirve una herramienta técnicamente increíble si para poner un video al aire tengo que hacer siete pasos y acordarme dónde está cada cosa.
  </p>

  <h2>Entonces, ¿qué estaba buscando exactamente?</h2>

  <p>
    No estaba buscando otro main mixer, ni un sistema de automatización de televisión 24/7
  </p>

  <p>
    Quería algo bastante más específico, más o menos esto:
  </p>

  <pre><code>MEDIA LIBRARY
      ↓
MEDIA BROWSER
      ↓
   PLAYOUT VTR
      ↓ndi
     vMix
      ↓
     LIVE</code></pre>

  <p>
    La idea era separar un poco las tareas (pensando en que se puede escalar en el futuro a tenerlo en un puesto indepéndiente).
  </p>

  <p>
    Que una herramienta se encargara de manejar el contenido y que vMix siguiera haciendo lo que hace bien: cámaras, switching, gráficos, composición, streaming, grabación, etc.
  </p>

  <p>
    Y cuanto más buscaba, más me daba cuenta de que la parte complicada no era necesariamente el "sistema" de playout.
  </p>

  <p>
    Era la <strong>operación</strong>.
  </p>

  <h2>Preview / Program</h2>

  <p>
    Algo que empezó a aparecer como requisito bastante rápido fue el clásico Preview / Program.
  </p>

  <p>
    Si estoy al aire con un video, quiero poder buscar el siguiente sin tocar lo que está live.
  </p>

  <p>
    Algo así:
  </p>

  <pre><code>
  SEARCH → PREVIEW → CUE → TAKE
</code></pre>

  <p>
    Parece una boludez, pero cambia bastante la experiencia. Porque ya no estoy pensando "tengo que reproducir este archivo".
  </p>
  <p>
    Estoy pensando: "quiero poner el video del invitado".
  </p>

  <p>
    Lo busco. Lo veo. Pongo en cue. Y cuando llega el momento, <strong>Take</strong>.
  </p>

  <h2>El titán de los titanes.</h2>

  <p>
    Una de las primeras cosas que encontré cuando me puse a investigar. fue CasparCG.
  </p>

  <p>
    Si no lo conocés, básicamente es un <strong>playout server</strong> open source bastante conocido (y robusto) en el mundo broadcast.
  </p>

  <p>
    Y acá apareció algo interesante.
  </p>

  <p>
    CasparCG resolvía muy bien una parte del problema que estaba pensando.
  </p>

  <p>
    Tenés el contenido, tenés un motor de reproducción y podés sacar la señal hacia otro sistema.
  </p>

  <p>
    Conceptualmente:
  </p>

  <pre><code>
  MEDIA
  ↓
CasparCG
  ↓
vMix</code></pre>

  <p>
    Perfecto.
  </p>

  <p>
    Pero después apareció el clásico:
  </p>

  <blockquote>
    <p>"Bueno, ¿y cómo lo opero?"</p>
  </blockquote>

  <p>
    Porque una cosa es tener un muy buen motor de playout (no olvidemos que Caspar es un server-side) y otra es tener una interfaz que te permita encontrar y disparar contenido rápido.
  </p>

  <p>
    CasparCG me empezó a parecer interesante justamente por eso: me llevó a separar mentalmente el problema entre <strong>backend</strong> y <strong>UI</strong> (ponele).
  </p>

  <h2>¡Sorpresa! CasparCG tiene una interfaz.</h2>

  <p>
    Después apareció CasparCG Client, que básicamente agrega una interfaz para controlar CasparCG Server.
  </p>

  <p>
    Ok. Ahora no tengo solamente el motor de playout. Tengo una herramienta para manejarlo.
  </p>

  <p>
    Pero seguía con la misma pregunta:
  </p>

  <blockquote>
    <p>¿Esto me permite agarrar el contenido que necesito en dos segundos mientras estoy transmitiendo?</p>
  </blockquote>

  <p>
    Porque ese era el benchmark que me había inventado.
  </p>

  <p>
    No "¿puede reproducir un MP4?"
  </p>

  <p>
    Obviamente puede.
  </p>

  <p>
    La pregunta era:
  </p>

  <p>
    <strong>¿qué tan rápido puedo pasar de "necesito este video" a "está saliendo"?</strong>
  </p>

   <p>
    Momento standby para Caspar Client
  </p>

  <h2>La gracia del open source</h2>

  <p>
    Después llegué a SuperConductor, un UI alternativo a CasparCG Client, pero mucho más pulido. 
  </p>

  <p>
    Y este me llamó bastante la atención porque ya entra en una lógica más de control y operación.
  </p>

  <p>
    Puede trabajar con CasparCG (mejor dicho, está pensado para usar en conjunto a Caspar server)y también integrarse con otros sistemas, entre ellos vMix, ATEM y diferentes dispositivos. Joya.
  </p>

  <p>
    Tiene como distintos workspaces de rundown, assets, timeline, etc.
  </p>

  <p>
    O sea, empieza a aparecer esa idea de tener una capa por encima de los distintos sistemas técnicos. ✨ Un control system ✨
  </p>

  <p>
    Y esto me hizo pensar que quizás no estaba buscando "un software de video".
  </p>

  <p>
    Estaba buscando una especie de <strong>control room para contenidos</strong>. Inventé la pólvora. 
  </p>

  <p>
    Aunque después también apareció el otro problema: cuanto más completa es una herramienta, más cosas intenta resolver.
  </p>

  <p>
    Y yo no necesitaba una plataforma que me manejara absolutamente toda la operación broadcast del universo.
  </p>

  <p>
    Necesitaba encontrar un video rápido para no llegar tarde al vivo.
  </p>

  <h2>Otros flavors más específicos</h2>

  <p>
    Otra solución que apareció fue Dinesat Visual Radio.
  </p>

  <p>
    Y esta era particularmente interesante porque ya estaba mucho más cerca del mundo en el que estoy trabajando.
  </p>

  <p>
    Dinesat tiene una lógica de automatización y gestión de contenido audiovisual pensada para radio y visual radio, y además existe una integración directa con vMix. Ta, listo.
  </p>

  <p>
    La idea que estaba buscando no era para nada rara. Y... no.
  </p>

  <p>
    Separar la gestión/automatización del contenido de la producción visual tiene bastante sentido.
  </p>

  <p>
    El tema es que Dinesat está pensado para resolver un problema bastante más grande que el mío.
  </p>

  <p>
    Yo no estaba buscando automatizar una radio entera. O si...? No, por ahora no.
  </p>

  <p>
    Estaba buscando una herramienta para <strong>operar una biblioteca audiovisual durante una producción</strong>.
  </p>

  <h2>Las grandes ligas</h2>

  <p>
    También terminé cayendo en Sofie Automation, aka el software que usa la BBC para salir en vivo. Tuki.
  </p>

  <p>
    Sofie es un sistema de broadcast automation mucho más completo, con rundown, automatización, integración de dispositivos, playout y toda una infraestructura alrededor.
  </p>

  <p>
    Me sirve mucho como referencia para seguir nerdeando.
  </p>

  <p>
    Pero también me hizo pensar: capaz me fui al carajo pensando en la sobre ingeniería de todo esto.
  </p>

  <p>
    Porque mi problema no era construir una cadena de televisión. Era encontrar rápido un video. Humildemente.
  </p>


  <h2>SPX, H2R y la importancia de la interfaz</h2>

  <p>
    También aparecieron herramientas como SPX Graphics y H2R Graphics.
  </p>

  <p>
    No son exactamente lo que estaba buscando, pero tienen algo que me empezó a resultar cada vez más interesante: <strong>la interfaz pensada para el operador</strong>.
  </p>

  <p>
    Y esto parece bastante obvio, pero es fácil perderse cuando uno empieza a mirar herramientas por sus features.
  </p>

  <p>
    Podés tener un backend espectacular, APIs, OSC, NDI, CasparCG, scripting, automatización, integración con media servers y todas las buzzwords que quieras.
  </p>
  <p>
    Pero si en vivo necesitás hacer una búsqueda de 30 segundos para encontrar un contenido, medio que no importa.
  </p>

  <p>
    La interfaz debería hacer que el operador piense en <strong>qué quiere hacer</strong>, no en cómo está implementado.
  </p>


  <h2>Entonces, ¿qué aprendí de toda esta búsqueda?</h2>

  <p>
    Que al principio pensaba que estaba buscando un <strong>software de playout</strong>.
  </p>

  <p>
    Ahora no estoy tan seguro.
  </p>

  <p>
    Porque después de mirar todas estas herramientas, empecé a separar el problema en partes:
  </p>

  <h3>Playout</h3>

  <p>
    El motor que reproduce el contenido.
  </p>

  <p>
    CasparCG es un ejemplo bastante claro.
  </p>

  <h3>Automation</h3>

  <p>
    La parte que puede encargarse de secuencias, horarios, rundowns y lógica de emisión.
  </p>

  <p>
    Ahí aparecen soluciones como Dinesat o Sofie.
  </p>

  <h3>Producción</h3>

  <p>
    vMix.
  </p>

  <p>
    Cámaras, switching, gráficos, NDI, streaming, grabación, etc.
  </p>

  <h3>Operación</h3>

  <p>
    Y acá está lo que más me importa.
  </p>

  <p>
    <strong>¿Cómo encuentro lo que necesito?</strong>
  </p>

  <p>
    <strong>¿Cómo sé qué estoy por mandar?</strong>
  </p>

  <p>
    <strong>¿Cómo lo previsualizo?</strong>
  </p>

  <p>
    <strong>¿Cómo lo dejo preparado?</strong>
  </p>

  <p>
    <strong>¿Cómo lo disparo rápido?</strong>
  </p>

  <p>
    Esa última capa terminó siendo mucho más importante de lo que pensaba al principio.
  </p>

  <h2>Lo que me imagino ahora</h2>

  <p>
    Después de darle bastantes vueltas, la herramienta que tengo en la cabeza se parece más a esto:
  </p>

  <pre><code>                    MEDIA LIBRARY
                         │
                         ▼
              ┌────────────────────┐
              │    MEDIA BROWSER   │
              │                    │
              │ search / tags      │
              │ thumbnails         │
              │ metadata           │
              │ playlists          │
              └─────────┬──────────┘
                        │
                 PREVIEW / CUE
                        │
                        ▼
                      PLAYOUT
                        │
                        ▼
                       vMix
                        │
                        ▼
                     LIVE</code></pre>

  <p>
    Y probablemente tendría alguna integración con Stream Deck para determinadas cosas.
  </p>

  <p>
    Incluso podría tener una vista de rundown.
  </p>

  <p>
    Pero tampoco quiero que se transforme en un monstruo de 700 features.
  </p>

  <p>
    La idea sería bastante simple:
  </p>

  <blockquote>
    <p>
      <strong>Tengo una biblioteca enorme de contenido y necesito encontrar cualquier cosa en segundos y mandársela a vMix.</strong>
    </p>
  </blockquote>

  <h2>What if...?</h2>

  <p>
    Obviamente, después de investigar durante horas sobre software existente, apareció la pregunta inevitable:
  </p>

  <blockquote>
    <p>¿Y si lo hago yo?</p>
  </blockquote>

  <p>
    Porque técnicamente no parece una locura. Y además existe Claude.
  </p>

  <p>
    Podría tener un backend que indexe una carpeta o NAS, genere thumbnails, extraiga metadata y permita buscar.
  </p>

  <p>
    Una interfaz web podría mostrar los contenidos como botones/cards.
  </p>

  <p>
    CasparCG podría encargarse del playout.
  </p>

  <p>
    Y arriba de todo eso podría tener una interfaz bastante específica para mi forma de trabajar.
  </p>

  <p>
    El problema difícil no sería reproducir un MP4.
  </p>

  <p>
    El problema sería diseñar una interfaz que realmente sea rápida cuando estás transmitiendo y tenés que tomar una decisión en dos segundos.
  </p>

  <p>
    Y eso, honestamente, me parece bastante más interesante.
  </p>

  <h2>La búsqueda sigue</h2>

  <p>
    Después de mirar todo esto no terminé encontrando <strong>el software perfecto</strong>.
  </p>

  <p>
    Capaz el software que estoy buscando existe y simplemente todavía no lo encontré.
  </p>

  <p>
    Capaz estoy intentando resolver un problema que ya está resuelto de alguna forma que todavía no conozco. Probablemente.
  </p>

  <p>
    O capaz, y esta es la parte que me divierte, <strong>no existe exactamente como lo estoy imaginando</strong>.
  </p>

  <p>
    En ese caso, habrá que hacerlo.
  </p>

  <p>
    Y ahí ya tenemos otro rabbit hole.
  </p>

</article>