import {showAlert} from './alert.js'


const login = async(email,password)=>{
    try{
        const res = await axios({
            method:'POST',
            url:'https://starfish-app-28zzy.ondigitalocean.app/api/v1/users/login',
            data:{
                email,
                password,
            },
        })
        if(res.data.status==='success'){
            showAlert('success','logged in successfully')
            window.setTimeout(()=>{
                location.assign('/')
            },1500)
        }
        // withoutkjdhlksjdhflksjdhflkjshdflkjhsdflkjhsdfkj
        var obj = res.data.data.user
        document.cookie =' token = '+JSON.stringify(obj) 

    }catch(err){
        let message = typeof err.response !== 'undefined'? err.response.data.message:err.message
        showAlert('error', 'Error : Incorrect email or password', message)
        showAlert('error', 'Error : Incorrect email or password')

    }
}


document.querySelector('.form').addEventListener('submit',(e)=>{
    e.preventDefault()
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    login(email,password)

})

