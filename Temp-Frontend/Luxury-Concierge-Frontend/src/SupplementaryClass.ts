import UserInterface from "./interfaces/UserInterface";

class Supplementaries{

    static serverLink = "http://localhost:8080/"
    static clientLink = "http://localhost:5173/"

    static generateUserJson(id:number = NaN, username:string = "", password:string = "", firstname:string = "", 
        lastname:string = "", email:string = "", address:string = "", birthday:Date = new Date() ) : UserInterface
    {
        return {
            "id":id,
            "username":username,
            "password": password,
            "firstname": firstname,
            "lastname" : lastname,
            "email" : email,
            "address" : address,
            "birthday" : birthday
        }
    }

}

export default Supplementaries