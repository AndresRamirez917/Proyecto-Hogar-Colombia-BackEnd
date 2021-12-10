import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import { repository, RepositoryTags } from '@loopback/repository';
import { stringify } from 'querystring';
import { Empleado } from '../models';
import { EmpleadoRepository } from '../repositories';
const generador = require("password-generator");
const cryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken")
import { llaves } from '../config/llaves';
@injectable({scope: BindingScope.TRANSIENT})
                                    //24/11
export class AutenticacionService {

constructor(/* Add @inject to inject parameters */
  //token
  //con esta declaracion en el constructor ya tenemos acceso a la base de datos
  //que esta en el archivo EmpleadoRepository
  @repository(EmpleadoRepository) 
  //token
  public empleadorespository:EmpleadoRepository
  ) {}

  /*
   * Add service methods here
   */

//token 
generarclave(){
  let contrasena = generador(8, false)
  return contrasena
}

//token
cifrarclave(contrasena:string){
  //let contrasenacifrada = cryptoJS.MD5.hashStr(contrasena);
  let contrasenacifrada = (cryptoJS.enc.Latin1.parse(contrasena));
  return contrasenacifrada;
}
//token
identificarpersona(usuario:string, contrasena:string){
  try{
    //declaro una variable que tendra el valor del repository(base de datos) para buscar a la persona
    let c = this.empleadorespository.findOne({where: {email: usuario, contrasena: contrasena}});
    if(c){
      return c;
    }
    return false;
  }catch{
    return false;
  }
}

generartokenjwt(empleado:Empleado){
let token = jwt.sign({
  data:{
    id:empleado.id,
    email:empleado.email,
    nombre:empleado.nombre
  }
},

llaves.clavejwt);
return token;
}

validartokenjwt(token:string){
try{
  let datos = jwt.verify(token, llaves.clavejwt);
  return datos;
}catch{
  return false
}
}

}
