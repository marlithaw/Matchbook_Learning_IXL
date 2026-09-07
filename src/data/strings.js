// Bilingual copy, grade metadata, subject metadata, and external links.
// Ported verbatim from the design prototype (design/IXL at Home.dc.html).
// Spanish copy is translated but not yet reviewed by a native-speaking staff
// member (see README "Open items").

export const GRADES = [
  { g: 'K', slug: 'kindergarten', badge: 'K', en: 'Kindergarten', es: 'Kínder' },
  { g: '1', slug: 'grade-1', badge: '1', en: '1st Grade', es: '1er Grado' },
  { g: '2', slug: 'grade-2', badge: '2', en: '2nd Grade', es: '2do Grado' },
  { g: '3', slug: 'grade-3', badge: '3', en: '3rd Grade', es: '3er Grado' },
  { g: '4', slug: 'grade-4', badge: '4', en: '4th Grade', es: '4to Grado' },
  { g: '5', slug: 'grade-5', badge: '5', en: '5th Grade', es: '5to Grado' },
  { g: '6', slug: 'grade-6', badge: '6', en: '6th Grade', es: '6to Grado' },
  { g: '7', slug: 'grade-7', badge: '7', en: '7th Grade', es: '7mo Grado' },
  { g: '8', slug: 'grade-8', badge: '8', en: '8th Grade', es: '8vo Grado' },
]

// IREAD is shown only for grades 2–4; fluency only for K–4 (by display name).
export const FLU_KEY = { K: 'Kindergarten', 1: '1st Grade', 2: '2nd Grade', 3: '3rd Grade', 4: '4th Grade' }
export const IREAD_GRADES = ['2', '3', '4']

export const RESEARCH =
  'https://www.ixl.com/materials/us/research/IXL_Implementation_Fidelity_and_Usage_Recommendations.pdf'
export const VID_EN = 'https://youtu.be/FjBfPtW4PHE'
export const VID_ES = 'https://youtu.be/ZnYg3ohGJm4'
export const VID_SCORE = 'https://youtu.be/im7RK-vylyo'
export const HELP = 'https://www.ixl.com/help-center'

export const MONTHS = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  es: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
}
export const DAYS = {
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  es: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
}
export const WEEKDAY_NAMES = {
  en: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  es: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'],
}

export const SUBJ = {
  math: { color: 'var(--charcoal)', en: 'Math', es: 'Matemáticas' },
  ela: { color: 'var(--spark-red)', en: 'Reading', es: 'Lectura' },
  fluency: { color: '#B07000', en: 'Fluency', es: 'Fluidez' },
  iread: { color: '#7A5A00', en: 'IREAD', es: 'IREAD' },
}

export const T = {
  allGrades: { en: 'All grades', es: 'Todos los grados' },
  langBtn: { en: 'Español', es: 'English' },
  textSize: { en: 'Larger text', es: 'Texto más grande' },
  heroKicker: { en: 'Nightly practice, K through 8', es: 'Práctica de cada noche, K a 8' },
  heroTitle: { en: "Tonight's work, already picked out.", es: 'El trabajo de esta noche, ya escogido.' },
  heroLede: {
    en: "One math skill and one reading skill on IXL, every school night. Your child's teacher already chose them for this exact week. Tap a grade and the buttons take you straight to tonight's skills.",
    es: 'Una destreza de matemáticas y una de lectura en IXL, cada noche escolar. La maestra de su hijo ya las escogió para esta semana exacta. Toque un grado y los botones lo llevan directo a las destrezas de esta noche.',
  },
  activateBadge: { en: 'Ready to learn', es: 'Listos para aprender' },
  activateLeadQ: { en: 'Need to log in?', es: '¿Necesita iniciar sesión?' },
  activateLead: {
    en: 'Students will need their **IXL username and password** to complete their weekly assignments. Check your **ParentSquare** messages for your student’s IXL login information.',
    es: 'Los estudiantes necesitarán su **usuario y contraseña de IXL** para completar las tareas de la semana. Revise sus mensajes de **ParentSquare** para encontrar la información de acceso de IXL de su estudiante.',
  },
  activateTitle: { en: 'Three steps to get started', es: 'Tres pasos para empezar' },
  activateStep1a: { en: 'Find the login in ParentSquare.', es: 'Encuentre el acceso en ParentSquare.' },
  activateStep1b: {
    en: 'Your child’s IXL username and password are posted there.',
    es: 'Ahí está el usuario y la contraseña de IXL de su hijo.',
  },
  activateStep2a: { en: 'Sign in to IXL.', es: 'Inicie sesión en IXL.' },
  activateStep2b: { en: 'One sign-in activates it.', es: 'Con un inicio de sesión se activa.' },
  activateStep3a: { en: 'Pick your grade below', es: 'Elija su grado abajo' },
  activateStep3b: { en: 'and tap tonight’s two skills.', es: 'y toque las dos destrezas de esta noche.' },
  activateFree: { en: 'No cost to families.', es: 'Sin costo para las familias.' },
  activateNote: {
    en: 'Until your child signs in, the skills will open but won’t save their work or SmartScore.',
    es: 'Hasta que su hijo inicie sesión, las destrezas se abren pero no guardan su trabajo ni el SmartScore.',
  },
  avatarKicker: { en: 'Welcome, families', es: 'Bienvenidas, familias' },
  avatarTitle: { en: 'How this works', es: 'Cómo funciona' },
  avatarScript: {
    en: 'Welcome to IXL at Home, from Matchbook Learning. Here is the whole idea. Every school night your child has two skills to practice: one math and one reading. The teacher already picked them for this exact week, so there is nothing for you to look up. Tap your child’s grade and tonight’s two skills are right there. Tap a skill and IXL opens straight to it. When the SmartScore reaches eighty, your child is done for the night. Then read a real book together for twenty minutes, in any language you speak at home. That is it. Fifteen minutes to an hour, five nights a week. If anything gets stuck, call the front office. We would rather hear from you in September than in May.',
    es: 'Bienvenidos a IXL en Casa, de Matchbook Learning. Esta es la idea completa. Cada noche escolar su hijo tiene dos destrezas para practicar: una de matemáticas y una de lectura. La maestra ya las escogió para esta semana exacta, así que usted no tiene nada que buscar. Toque el grado de su hijo y las dos destrezas de esta noche están ahí. Toque una destreza y IXL abre directo en ella. Cuando el SmartScore llega a ochenta, su hijo terminó por esta noche. Después lean juntos un libro de verdad veinte minutos, en el idioma que hablen en casa. Eso es todo. De quince minutos a una hora, cinco noches a la semana. Si algo se complica, llame a la oficina. Preferimos escucharlo en septiembre y no en mayo.',
  },
  playBtn: { en: 'Play the welcome', es: 'Escuchar la bienvenida' },
  stopBtn: { en: 'Stop', es: 'Detener' },
  noSpeech: { en: 'Read-aloud is not available on this browser.', es: 'La lectura en voz alta no está disponible en este navegador.' },
  savedTitle: { en: 'Your grades', es: 'Sus grados' },
  removeWord: { en: 'Remove', es: 'Quitar' },
  pickTitle: { en: "Find your child's grade", es: 'Busque el grado de su hijo' },
  pickSub: {
    en: 'Tap a grade. Everything your child needs is on that one page, and we will remember it next time.',
    es: 'Toque un grado. Todo lo que su hijo necesita está en esa página, y lo recordaremos la próxima vez.',
  },
  weekLabel: { en: 'Where we are right now', es: 'En dónde estamos ahora' },
  tonightTitle: { en: "Tonight's practice", es: 'La práctica de esta noche' },
  tabTonight: { en: 'Tonight', es: 'Esta noche' },
  tabWeek: { en: 'Whole week', es: 'Toda la semana' },
  todayTag: { en: 'Today', es: 'Hoy' },
  reqLabel: { en: 'Required tonight', es: 'Requerido esta noche' },
  reqNote: {
    en: 'Tap each one and it opens the exact skill. Check it off when the SmartScore hits 80.',
    es: 'Toque cada una y abre la destreza exacta. Márquela cuando el SmartScore llegue a 80.',
  },
  optLabel: { en: 'Optional extra practice', es: 'Práctica adicional opcional' },
  optNote: {
    en: 'Only if your child wants more, or needs more. Never instead of the two above.',
    es: 'Solo si su hijo quiere más, o necesita más. Nunca en lugar de las dos de arriba.',
  },
  streakLabel: { en: 'This week', es: 'Esta semana' },
  nightsDone: { en: 'of 5 nights done', es: 'de 5 noches hechas' },
  markDone: { en: 'Mark done', es: 'Marcar hecho' },
  markUndone: { en: 'Undo', es: 'Deshacer' },
  codeWord: { en: 'Skill code', es: 'Código' },
  noWork: { en: 'Nothing assigned for this day.', es: 'Nada asignado para este día.' },
  weekNavLabel: { en: 'Go to a week', es: 'Ir a una semana' },
  weekDoneBadge: { en: 'All nights done', es: 'Todas las noches hechas' },
  weekArchiveNote: {
    en: 'Every week stays here — the checkmarks you make are saved for each week on its own. Tap any week to review it.',
    es: 'Cada semana se queda aquí — las marcas que hace se guardan por separado para cada semana. Toque cualquier semana para repasarla.',
  },
  weekWord: { en: 'Week', es: 'Semana' },
  dayWord: { en: 'Day', es: 'Día' },
  printBtn: { en: 'Print this week', es: 'Imprimir la semana' },
  printFoot: {
    en: 'One math skill and one reading skill each night, plus 20 minutes reading a real book. Stop at a SmartScore of 80. Questions: (317) 226-4263.',
    es: 'Una destreza de matemáticas y una de lectura cada noche, más 20 minutos leyendo un libro de verdad. Pare en un SmartScore de 80. Preguntas: (317) 226-4263.',
  },
  beforeStart: {
    en: 'Nightly practice starts Monday, August 31. Below is Week 1, Day 1.',
    es: 'La práctica de cada noche empieza el lunes 31 de agosto. Abajo está la Semana 1, Día 1.',
  },
  weekendMsg: { en: 'Weekend. Below is what is waiting on Monday.', es: 'Fin de semana. Abajo está lo que espera el lunes.' },
  afterEnd: { en: 'The assigned weeks are finished. Below is the last week.', es: 'Las semanas asignadas terminaron. Abajo está la última semana.' },
  plusTitle: { en: 'Plus 20 minutes of reading, off the screen', es: 'Y 20 minutos de lectura, fuera de la pantalla' },
  plusBody: {
    en: 'A real book, every night, in any language you speak at home. It does not replace anything above. You reading to your child counts. Your child reading to you counts. Twenty minutes.',
    es: 'Un libro de verdad, cada noche, en el idioma que hablen en casa. No reemplaza nada de lo anterior. Que usted le lea a su hijo cuenta. Que su hijo le lea a usted cuenta. Veinte minutos.',
  },
  backTitle: { en: 'Is this too hard right now?', es: '¿Esto es demasiado difícil ahora?' },
  backBody: {
    en: 'Then go back. Learning is sequential. A child who cannot do this grade’s work is missing something from an earlier grade, and the fix is to go get it, not to keep struggling. Going back is not falling behind. It is how a child catches up.',
    es: 'Entonces regrese. El aprendizaje es secuencial. A un niño que no puede hacer el trabajo de este grado le falta algo de un grado anterior, y la solución es ir a buscarlo, no seguir batallando. Regresar no es quedarse atrás. Es cómo un niño se pone al día.',
  },
  backBtn: { en: 'Go to', es: 'Ir a' },
  backNoneK: {
    en: 'Kindergarten is where the sequence starts. If your child is struggling here, call us. We want to know.',
    es: 'Kínder es donde empieza la secuencia. Si su hijo tiene dificultades aquí, llámenos. Queremos saberlo.',
  },
  learnTitle: { en: 'Everything else you might ask', es: 'Todo lo demás que podría preguntar' },
  startTitle: { en: 'Start here if IXL is new to you', es: 'Empiece aquí si IXL es nuevo para usted' },
  startSub: { en: 'Ten minutes now saves you an hour of frustration later.', es: 'Diez minutos ahora le ahorran una hora de frustración después.' },
  vEn: { en: 'Getting started with IXL', es: 'Cómo empezar con IXL' },
  vEnD: { en: 'How to log in, find a skill, and know when your child is done.', es: 'Cómo entrar, encontrar una destreza y saber cuándo su hijo terminó.' },
  vEs: { en: 'Cómo empezar con IXL (in Spanish)', es: 'Cómo empezar con IXL (en español)' },
  vEsD: { en: 'The same walkthrough, in Spanish.', es: 'El mismo recorrido, en español.' },
  vSc: { en: 'About the SmartScore', es: 'Sobre el SmartScore' },
  vScD: { en: 'What the number means and when your child can stop.', es: 'Qué significa el número y cuándo su hijo puede parar.' },
  vHelp: { en: 'IXL Help Center', es: 'Centro de Ayuda de IXL' },
  vHelpD: { en: 'Login trouble, app questions, anything technical.', es: 'Problemas para entrar, preguntas de la app, cualquier cosa técnica.' },
  tagVideo: { en: 'Video', es: 'Video' },
  tagLink: { en: 'Link', es: 'Enlace' },
  appTitle: { en: 'Put IXL on your phone', es: 'Instale IXL en su teléfono' },
  app1: { en: 'Download the free IXL Learning app on any phone, tablet, or computer.', es: 'Descargue la app gratuita IXL Learning en cualquier teléfono, tableta o computadora.' },
  app2: { en: 'Search for Matchbook Learning and select your child’s class.', es: 'Busque Matchbook Learning y seleccione la clase de su hijo.' },
  app3: { en: 'Log in with your child’s username and code from the school. You do not need school Wi-Fi.', es: 'Inicie sesión con el usuario y código que le dio la escuela. No necesita el Wi-Fi de la escuela.' },
  appTip: {
    en: 'Stuck on a problem? Every IXL skill has a short how-to video called Watch a tutorial, with Spanish subtitles. Click CC.',
    es: '¿Atorado en un problema? Cada destreza de IXL tiene un video corto llamado Ver un tutorial, con subtítulos en español. Haga clic en CC.',
  },
  scoreTitle: { en: 'How do I know when they are done?', es: '¿Cómo sé cuándo terminaron?' },
  scoreSub: {
    en: 'IXL gives every skill a SmartScore out of 100. It is not a grade. It goes up when your child answers correctly and drops when they miss, so it lands where their real understanding is.',
    es: 'IXL le da a cada destreza un SmartScore de 100. No es una calificación. Sube cuando su hijo contesta bien y baja cuando falla, así que refleja lo que de verdad entiende.',
  },
  s80: { en: 'They have got it. This is the finish line for tonight.', es: 'Ya lo tienen. Esta es la meta de esta noche.' },
  s80b: { en: 'Proficient.', es: 'Competente.' },
  s90: { en: 'Harder questions unlock here.', es: 'Aquí se abren preguntas más difíciles.' },
  s90b: { en: 'Excellent.', es: 'Excelente.' },
  s100: { en: 'Worth celebrating out loud.', es: 'Vale la pena celebrarlo en voz alta.' },
  s100b: { en: 'Mastered.', es: 'Dominado.' },
  scoreTip: {
    en: 'Stop at 80. Pushing a tired child from 80 to 100 teaches them to hate the thing you want them to love.',
    es: 'Pare en 80. Empujar a un niño cansado de 80 a 100 le enseña a odiar lo que usted quiere que ame.',
  },
  fluTitle: { en: 'What we mean by fluency', es: 'Qué queremos decir con fluidez' },
  fluBody: {
    en: 'Fluency means knowing it by heart. Not working it out. Knowing it. You should be able to ask your child in the car, with the radio on, and get the answer in about one second. What is six times eight? Forty-eight. No pause, no counting on fingers.',
    es: 'Fluidez significa saberlo de memoria. No resolverlo. Saberlo. Usted debería poder preguntarle a su hijo en el carro, con el radio puesto, y recibir la respuesta en un segundo. ¿Cuánto es seis por ocho? Cuarenta y ocho. Sin pausa, sin contar con los dedos.',
  },
  fluWhy: {
    en: 'That is why fluency gets its own slot. A child who has to stop and calculate six times eight has no attention left for the actual problem in front of them. Fluency is what frees up the thinking.',
    es: 'Por eso la fluidez tiene su propio espacio. A un niño que tiene que detenerse a calcular seis por ocho no le queda atención para el problema que tiene enfrente. La fluidez es lo que libera el pensamiento.',
  },
  fluSeeAll: { en: 'See the full fluency list', es: 'Ver la lista completa' },
  fluLess: { en: 'Show fewer', es: 'Mostrar menos' },
  whyTitle: { en: 'Why we are asking this of you', es: 'Por qué le pedimos esto' },
  whyOurs: {
    en: 'Our expectation is simple: one math skill and one reading skill on IXL every school night, five nights a week, plus twenty minutes of reading a real book. Usually 15 minutes to an hour. More is great, but that is enough. Fluency and IREAD practice are optional.',
    es: 'Nuestra expectativa es simple: una destreza de matemáticas y una de lectura en IXL cada noche escolar, cinco noches a la semana, más veinte minutos de lectura de un libro de verdad. Normalmente de 15 minutos a 1 hora. Hacer más está muy bien, pero eso es suficiente. La práctica de fluidez e IREAD es opcional.',
  },
  whyOurs2: {
    en: "What we promise you is this: your child's teacher chose these exact skills, sees the practice, and plans around it. It is not busywork and it is not separate from the school day. It is the same learning, continued at your kitchen table.",
    es: 'Lo que sí le prometemos es esto: la maestra de su hijo escogió estas destrezas exactas, ve la práctica y planifica con ella. No es trabajo de relleno ni algo aparte del día escolar. Es el mismo aprendizaje, continuado en la mesa de su cocina.',
  },
  whyIxl: {
    en: 'IXL studied its own students and found that those who practiced 30 to 40 minutes a week per subject, and reached proficiency on at least two skills a week, scored measurably higher on their MAP tests. That is IXL’s research on IXL’s users, and we are passing it along as theirs.',
    es: 'IXL estudió a sus propios estudiantes y encontró que quienes practicaron de 30 a 40 minutos por semana en cada materia, y alcanzaron competencia en al menos dos destrezas por semana, sacaron puntajes más altos en sus exámenes MAP. Esa es la investigación de IXL sobre los usuarios de IXL, y se la pasamos como suya.',
  },
  srcLabel: { en: 'Source:', es: 'Fuente:' },
  srcName: { en: 'IXL Implementation Fidelity and Usage Recommendations, September 2022', es: 'IXL Implementation Fidelity and Usage Recommendations, septiembre de 2022' },
  helpTitle: { en: 'Stuck? Ask us.', es: '¿Atorado? Pregúntenos.' },
  helpBody: {
    en: 'Login not working, no device at home, your child needs a tutor, or you just want someone to walk you through this once. Call or text the front office, or stop in. We would rather hear from you in September than in May.',
    es: 'El acceso no funciona, no hay dispositivo en casa, su hijo necesita un tutor, o simplemente quiere que alguien le explique esto una vez. Llame o mande un mensaje a la oficina, o pase por la escuela. Preferimos escucharlo en septiembre y no en mayo.',
  },
  callBtn: { en: 'Call', es: 'Llamar' },
  textBtn: { en: 'Send a text', es: 'Enviar mensaje' },
  foot: {
    en: 'Matchbook Learning at Wendell Phillips School 63 · 1163 North Belmont Avenue, Indianapolis, IN 46222',
    es: 'Matchbook Learning at Wendell Phillips School 63 · 1163 North Belmont Avenue, Indianapolis, IN 46222',
  },
}
