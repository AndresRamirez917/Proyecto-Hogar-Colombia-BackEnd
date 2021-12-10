//token
import { HttpErrors,Request} from "@loopback/rest";
import { UserProfile } from "@loopback/security";
import { AutenticacionService } from "../services";
import parseBearerToken from "parse-bearer-token";
import { service } from "@loopback/core";
import { AuthenticationStrategy } from "@loopback/authentication";
//import { inject } from "@loopback/context";
//import { authenticate } from '@loopback/authentication';
//import {registerAuthenticationStrategy} from '@loopback/authentication';
//mport { HttpErrors, Request } from "@loopback/rest";


export class EstrategiaAdministrador implements AuthenticationStrategy{
   name: string= "admin";

    constructor(
        @service(AutenticacionService)
        public servicioautenticacion : AutenticacionService
    ){}
    
    //si comento esta misma linea que esta dentro del archivo AuthenticationStrategy
    //el authenticate de este archivo no muestra error, no se ha probado si funciona
    //comente la linea para mirar mañana si esto funciona, ojo la linea venia sin comentar
    //luego se va al archivo aplications.ts y se agregan dos lineas
    async authenticate(request: Request): Promise<UserProfile | undefined>{
    let token = parseBearerToken(request);
    if(token){
        let datos = this.servicioautenticacion.validartokenjwt(token);
        if(datos){
            let perfil: UserProfile = Object.assign({
                nombre: datos.data.nombre
            });
            return perfil;
        }else{
            throw new HttpErrors[401]("El token incluído no es válido"); 
        }

    }else{
        throw new HttpErrors[401]("No se ha incluído un token en la solicitud");
    }
   } 
}
