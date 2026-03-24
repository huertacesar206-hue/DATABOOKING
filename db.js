const firebaseConfig = {
    apiKey: "AIzaSyDGHqKCrrs3xIeFb-cbNFVEFXfkLygm520",
    authDomain: "databooking-fae65.firebaseapp.com",
    projectId: "databooking-fae65",
    storageBucket: "databooking-fae65.firebasestorage.app",
    messagingSenderId: "501705302593",
    appId: "1:501705302593:web:5ac0f0e8f9fb3d06af1cc0"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const inicializarBD = async () => {
    if (!localStorage.getItem('usuarios')) {
        const cuentasIniciales = [
            { id: 1, username: 'admin@gmail.com', nombre: 'Admin', password: 'admin123', rol: 'admin', foto_perfil: '' },
            { id: 2, username: 'estudiante@gmail.com', nombre: 'Estudiante', password: '12345', rol: 'usuario', foto_perfil: '' }
        ];
        localStorage.setItem('usuarios', JSON.stringify(cuentasIniciales));
    }
    
    if (!localStorage.getItem('favoritos')) localStorage.setItem('favoritos', JSON.stringify([]));
    if (!localStorage.getItem('compras')) localStorage.setItem('compras', JSON.stringify([]));

    try {
        const snapshot = await db.collection("libros").get();
        let librosCache = [];
        snapshot.forEach(doc => librosCache.push(doc.data()));
        localStorage.setItem('libros', JSON.stringify(librosCache));
    } catch (error) {
        console.error("Error sincronizando con Firebase:", error);
    }
};

const obtenerLibros = async (categoria = null) => {
    try {
        const snapshot = await db.collection("libros").get();
        let libros = [];
        snapshot.forEach(doc => libros.push(doc.data()));
        localStorage.setItem('libros', JSON.stringify(libros));
        
        if (categoria) {
            libros = libros.filter(l => l.categoria.toLowerCase() === categoria.toLowerCase());
        }
        return libros.sort((a, b) => b.id - a.id);
    } catch (error) {
        return JSON.parse(localStorage.getItem('libros')) || [];
    }
};

const obtenerFavoritos = () => {
    const idUsuario = localStorage.getItem('usuario_id');
    const favs = JSON.parse(localStorage.getItem('favoritos')) || [];
    const libros = JSON.parse(localStorage.getItem('libros')) || []; 
    const misFavsIds = favs.filter(f => f.id_usuario === idUsuario).map(f => f.id_libro);
    return libros.filter(l => misFavsIds.includes(l.id.toString()));
};

inicializarBD();