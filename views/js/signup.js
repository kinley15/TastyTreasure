import {showAlert} from "./alert.js"

export const signup = async(name,email,password,passwordConfirm)=>{
    try{
        const res = await axios({
            method:'POST',
            url:'https://starfish-app-28zzy.ondigitalocean.app/api/v1/users/signup',
            data:{
                name,
                email,
                password,
                passwordConfirm,
            },
        })
        if(res.data.status==='success'){
            showAlert('success','Account created successfully')
            window.setTimeout(()=>{
                location.assign('/')
            },1500)
        }

    }catch(err){
        let message = typeof err.response !== 'undefined'? 
        err.response.data.error
        :err.message
        showAlert('error',`Error: ${message}`,message)
    }
}
document.querySelector('.form').addEventListener('submit',(e)=>{
    e.preventDefault()
    e.preventDefault()
    const name = document.getElementById('name').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const passwordConfirm = document.getElementById('password-confirm').value
    signup(name,email,password,passwordConfirm)

})