import { Injectable } from "@nestjs/common";

@Injectable({})
export class AuthService {
    login(){
        return {msg:"sign up"}
    }
    signup(){
        return {msg:"sign in"}
    }
    refreshToken(){
        
    }
}