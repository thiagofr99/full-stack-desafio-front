import React, {useState} from 'react';
import { useHistory} from 'react-router-dom';

import './style.css';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import api from '../../services/api'
import Loading from '../../layout/Loading';


export default function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [loadOn, setLoadOn] = useState(false);

  const history = useHistory();

  const [signup, setSignup] = useState(false);
  
  async function cadastrar(e){
    e.preventDefault();

    setLoadOn(true);

    const data = {
        name,
        email,
        password,
    }

    try{

      const response = await api.post('auth/signup',data);
      
      sessionStorage.setItem('accessToken',response.data.token)      
      
      login(e);

    } catch (err){      
      toast.error('Erro ao criar conta! Tente novamente!', {
        position: toast.POSITION.TOP_CENTER
      })
      setLoadOn(false);      
      //alert('Login failed! Try agains!')
    }
  }

  async function login(e){
    e.preventDefault();

    setLoadOn(true);

    const data = {
        email,
        password,
    }

    try{

      const response = await api.post('auth/signin',data);
      
      sessionStorage.setItem('accessToken',response.data.token)      
      
      history.push('/principal')

    } catch (err){      
      toast.error('Login falhou! Tente novamente!', {
        position: toast.POSITION.TOP_CENTER
      })
      setLoadOn(false);      
      //alert('Login failed! Try agains!')
    }

  };

  async function cadastro(e){
    e.preventDefault();

    setSignup((atual)=> !atual);
  }

    return (
    <div className="container">
        {loadOn? <Loading></Loading>:
          <div>
            <section className='form'>
              {signup ? 
              <div>
                  <form onSubmit={cadastrar}>
                    <h1>Crie sua conta.</h1>
                    <input className="email" type="text" name="userName" id="userName" placeholder="Digite o seu email." value={email} onChange={e => setEmail(e.target.value)}/>
                    <input className="senha" type="password" name="senha" id="senha" placeholder="Digite sua senha" value={password} onChange={e => setPassword(e.target.value)}/>
                    <input className="email" type="text" name="nome" id="name" placeholder="Digite seu nome" value={name} onChange={e => setName(e.target.value)}/>
                    <input className="submit" type="submit" value="Cadastrar"/>                
                  </form>
                  <button onClick={cadastro} className="submit" type="submit">Possuo conta</button>
              </div>
                 :
              <div>
                <form onSubmit={login}>
                  <h1>Acesse sua conta.</h1>
                  <input className="email" type="text" name="userName" id="userName" placeholder="Digite o seu email." value={email} onChange={e => setEmail(e.target.value)}/>
                  <input className="senha" type="password" name="senha" id="senha" placeholder="Digite sua senha" value={password} onChange={e => setPassword(e.target.value)}/>
                  <input className="submit" type="submit" value="Logar"/>                
                  </form>
                  <button onClick={cadastro} className="submit" type="submit">Cadastre-se</button>
              </div>
                
            }              
              
            </section>
          </div>
        } 
        
    </div>
    
    
    );
  }
  
  