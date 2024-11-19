import 'dotenv/config';
import http from 'http';
import { url } from 'inspector';
import { handeStaticFileRequest } from './static-file.handler.js'

/**
 * 
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
 */

//Funktionen tar emot två paramterar, förfrågan och respons.
async function handleRequest(request, response){

  //Skapar en url för webbservern
  let url = new URL(request.url, 'http://' + request.headers.host);
  let path = url.pathname;

  //Delar upp varje segment vid / tecken. Sedan filtrerar bort '' och '..'.
  let pathSegments = path.split('/').filter(function(segment){
      if(segment === '' || segment === '..'){
          return false;
      } else{
          return true;
      }
  });
  console.log(pathSegments);

 if(pathSegments[0] === 'static'){
     await handeStaticFileRequest(pathSegments, request, response);
     return;
    //skicka en statisk fil
 }
 //Respons skicaks till begäran om webbservern inte stödjer eller känner igen förfrågninsgmetodensvaret.
 // då blir felet ett 501 och då skickas meddelandet till klienten och avslutar svaret
  response.writeHead(501, {'Content-Type': 'text/plain'});
  response.write('501 Not Implemented');
  response.end();

}
//Skapar en server som är öppen funktionen handelRequest med paramterarna request och response
let server = http.createServer(handleRequest);

//Öppnar serven för porten som finns i .env
server.listen(process.env.PORT);