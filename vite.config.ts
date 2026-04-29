import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    https: {
      key: "alure-privateKey.key",
      cert: "alure.crt",
    },
  },
})

/* EN ESTA PAGINA GENERAMOS CERTIFICADOS 
https://regery.com/en/security/ssl-tools/self-signed-certificate-generator */

/*poner esto en la consola para determinar un ceritificado y una key propia local 
      Last login: Wed Mar 18 05:56:15 on console
eduardoureno@EduardoIBruce ~ % openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout private.key -out certificate.crt
Generating a 2048 bit RSA private key
..............................................................................+++++
.........................................+++++
writing new private key to 'private.key'
-----
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) []:MX
State or Province Name (full name) []:Zacatecas
Locality Name (eg, city) []:Zacatecas
Organization Name (eg, company) []:ITZ
Organizational Unit Name (eg, section) []:Sistemas y Computación
Common Name (eg, fully qualified host name) []:ITZ
Email Address []:l22450193@itz.edu.mx
eduardoureno@EduardoIBruce ~ % 
 */
//key: "private.key",
//cert: "certificate.crt",
