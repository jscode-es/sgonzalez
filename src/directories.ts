// ============================
// Directories
// ============================

const $ = process.env

// Cargar modulos de Node JS
import path from 'path'

// Configuración
$.root = process.cwd();

// Rutas de las carpetas
$.certificate = path.join($.root, 'certificate')
$.view = path.join($.root, 'view')

// Enrutado
$.web = path.join($.view, 'www')

// Contenido publico
$.contentPublic = path.join($.root, 'public')
$.rssFilePublic = path.join($.root, 'public', 'index.xml')
$.sitemapFilePublic = path.join($.root, 'public', 'sitemap.xml')

$.IP_PRO = '0.0.0.0'

// Enviorment
$.IP_HOST = $.NODE_ENV === 'development' ? '0.0.0.0' : $.IP_PRO

console.log({
    node: $.NODE_ENV,
    ip: $.IP_HOST
})

// Certificate
$.CERT = $.NODE_ENV === 'development' ? $.CERT_DEV : $.CERT_PRO
$.CERT_KEY = $.NODE_ENV === 'development' ? $.CERT_KEY_DEV : $.CERT_KEY_PRO
$.CERT_CA = $.NODE_ENV === 'development' ? $.CERT_CA_DEV : $.CERT_CA_PRO

// Host
$.HOST = $.NODE_ENV === 'development' ? $.HOST_DEV : $.HOST_PRO