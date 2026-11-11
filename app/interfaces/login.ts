export interface SuccessLoginResponse{
message:string,
user:UserResponse,
token:string


}
export interface FailedLoginResponse{
message:string,
statuseMsg:string


}

export interface UserResponse{

name:string,
email:string,
role:string




}