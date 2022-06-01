import React,{useState, useEffect} from "react";
import { useHistory} from "react-router-dom";

import { RiFindReplaceLine } from 'react-icons/ri';


import './style.css';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import api from '../../services/api'

export default function Principal(){

    const[nome, setNome] = useState("");

    const[currentPage, setCurrentPage] = useState(0);
    
    const[audit, setAudit] = useState("");

    const[meaning, setMeaning] = useState("");

    const[meanings, setMeanings] = useState([]);

    const [words, setWords] = useState([]);    

    const [wordsH, setWordsH] = useState([]);

    const [wordPart, setWordPart] = useState([]);
    
    const [infoWord, setInfoWord] = useState([]);

    const accessToken = sessionStorage.getItem('accessToken');

    const [bemVindo, setBemVindo] = useState("Bemvindo");

    const [opcao, setOpcao] = useState("default");
    
    const history = useHistory();  
    
    const [aux, setAux] = useState(0);    

    async function favorites(pagin) {
      wordsH.length === 0 ? setCurrentPage(0) : console.log("nada") ;
      if(wordsH.length > 0 && wordsH.length < 100 ){
          console.log("passou aqui")
      } else {
        const response = await api.get('/user/me/favorites', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          params: {
              page: pagin,
              limit: 100,
              direction: 'asc'
          }
        });
        setWordsH([ ...wordsH, ...response.data.results])    
      }
  
      
    }

    async function histories(pagin) {
      const response = await api.get('/user/me/history', {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        params: {
            page: pagin,
            limit: 100,
            direction: 'asc'
        }
    });
  
      setWordsH([ ...wordsH, ...response.data.results])
  
    }
  
    async function fetchMoreWords(pagin) {
      const response = await api.get('entries/en/', {
          headers: {
              Authorization: `Bearer ${accessToken}`
          },
          params: {
              page: pagin,
              limit: 100,
              direction: 'asc'
          }
      });

      setWords([ ...words, ...response.data.results])  
    }

    async function findWordPart(wordPart,pagin) {  
      console.log(wordPart)   
    
      try{
        const response = await api.get("entries/en/", {
          headers: {
              Authorization: `Bearer ${accessToken}`
          },
          params: {
              page: pagin,
              limit: 100,
              direction: 'asc',
              search: wordPart
          }
        });
        
        if(response.data.totalPages > 1 && response.data.page>1){
          setWords([ ...words, ...response.data.results])  
        } else {
          setWords(response.data.results)  
        }
          
      } catch (err) {
        console.log("erro");
      }
        
    
        
    }


    //UseEffect

    useEffect(()=> {            
      if( (wordsH.length > 0 && wordsH.length <100) || (opcao==="find" && words.length > 0 && words.length <100) ){
          console.log(words.length)
      } else {
        const intersectionObserver = new IntersectionObserver((entries)=> {        
          if(entries.some((entry)=> entry.isIntersecting)){          
            setCurrentPage((currentPageInsideState) => currentPageInsideState + 1) 
            
          }
  
        });
        intersectionObserver.observe(document.querySelector('#sentinela'));

        return () => intersectionObserver.disconnect();
      }
      
      
        
    },[words.length, opcao, wordsH.length]);

    useEffect(()=> {

      userMe();
      welcome();
      console.log(opcao)
      if( opcao === "default"){
        fetchMoreWords(currentPage);
      }
      if( opcao === "history"){
        histories(currentPage);
      }
      if( opcao === "favorites"){
        setWordsH([])
        favorites(currentPage);
      }

      if( opcao === "find"){        
        findWordPart(wordPart,currentPage)
      }

      
    },[currentPage, opcao]);


  async function logout() {
    sessionStorage.clear();
    history.push('/');
}





  async function proximo(e){
    try{
        if(meanings.length>aux){
          console.log(meanings.length)
          console.log(aux)
          setMeaning(meanings.at(aux).definition);
          setAux((auxAtual)=> auxAtual+1);      
        }
        
      
    } catch (err){

    }
    
  }

  async function anterior(e){
    try{
      if(aux>1){
        console.log(meanings.length)
        console.log(aux)
        setMeaning(meanings.at(aux).definition);
        setAux((auxAtual)=> auxAtual-1);      
      }   
      
    } catch (err){

    }
    
  }

  async function welcome() {
    const response = await api.get("/", {
      headers: {
          Authorization: `Bearer ${accessToken}`
      }
  });
    setBemVindo(response.data.Message)    
  }

  async function userMe() {
    const response = await api.get("/user/me/", {
      headers: {
          Authorization: `Bearer ${accessToken}`
      }
  });
    setNome(response.data.name)    
  }

  async function find(word) {
    setAudit("");
    try{
      const response = await api.get(`entries/en/${word}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
  
    setInfoWord(response.data);
    response.data.phonetics === undefined ? <audio src={""} controls> Navegador não suporta </audio> :
    response.data.phonetics.forEach( p=>{
        p.audio === undefined || p.audio  === '' ?  setAudit('') :
        setAudit(p.audio);   
      })

    response.data.meanings === undefined ? console.log("nada") :  
    response.data.meanings.at(0).definitions === undefined ? console.log("nada")  :  
    setMeaning(response.data.meanings.at(0).definitions.at(0).definition);    
    setMeanings(response.data.meanings.at(0).definitions)
    console.log(response.data.meanings.at(0).definitions)
    setAux(1)
    } catch {
      toast.warning('Palavra não encontrada no dicionário!', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true        
      });

      setAudit('');
      setInfoWord(['']);
      setAux(1);
      setMeaning('');

    }
    
  }

  async function addFavorite(word){
    try{

      await api.post(`/entries/en/${word}/favorite`,{},{
        headers: {
          Authorization: `Bearer ${accessToken}`
        } 
      });
      toast.success('Palavra adicionada como favorita!', {
        position: toast.POSITION.TOP_CENTER
      })

    } catch (err){      
      toast.atention('Falha ao adicionar palavra como favorita!', {
        position: toast.POSITION.TOP_CENTER
      })
                 
    }
  }

  async function removeFavorite(word){
    try{

      await api.delete(`/entries/en/${word}/unfavorite`,{
        headers: {
          Authorization: `Bearer ${accessToken}`
        } 
      });
      toast.success('Palavra removida das favoritas!', {
        position: toast.POSITION.TOP_CENTER
      })
      setWordsH(wordsH.filter(w=> w!==word))

    } catch (err){      
      toast.warning('Falha ao remover palavra como favorita!', {
        position: toast.POSITION.TOP_CENTER
      })
                 
    }
  }

  async function fav() {       
    setWordsH([])
    setCurrentPage(0);
    favorites(0);    
    setOpcao("favorites");

  }
  async function hist() {    
    setWordsH([]);
    setCurrentPage(0);
    histories(0);
    setOpcao("history");

  }
  async function def() {   
    setWords([]);
    setCurrentPage(0);  
    fetchMoreWords(0);
    setOpcao("default");

  }

  async function findWordPartAll(word) {    
    setWords([])
    setCurrentPage(0);  
    findWordPart(word,0);
    setOpcao("find");
  }
    
    
    return (
        <div className="container-geral">
          <header>
            <div className="container-2">
              <h2>{bemVindo}</h2>
              <h3 className="nome-header">Bem vindo {nome}</h3>
              <button onClick={logout} className="sair">Sair</button>
            </div>
              
          </header>
          <div className="flex-container">
              <div className="word-audio">
                  <div className="word-apresentation">
                        <h3>{infoWord.word}</h3>
                        <h3>{infoWord.phonetic}</h3>
                  </div>
                
                  <audio src={ audit } controls> Navegador não suporta </audio>
                  {meaning=== undefined ? ' ': <h3>Meanings</h3>}
                  {meaning!== undefined ? <p>{meaning}</p>: ' '  }
                  <div>                    
                    <button onClick={anterior} className="nav-meanings">Anterior</button>
                    <button onClick={proximo} className="nav-meanings">Próximo</button>                    
                  </div>
                  <div className="favorite-div">
                  {opcao==="favorites" && infoWord.word !== '' && infoWord.word !== undefined ? <button onClick={()=> removeFavorite(infoWord.word)} className="nav-favorite"> Remover Palavra</button>: ' '} 
                  <button onClick={()=> addFavorite(infoWord.word)} className="nav-favorite"> Favoritar Palavra</button>
                  </div>                  
                    
                  
              </div>
              

              <div className="container-list">
                  <button id="list-row" onClick={def} className={opcao==="default" || opcao==="find" ? "word-list":"favorites-desactive"}>Word List</button>
                  <button onClick={fav} className={opcao==="favorites" ? "word-list":"favorites-desactive"} >Favorites</button>
                  <button onClick={hist} className={opcao==="history" ? "word-list":"favorites-desactive"} >History</button>
                  {opcao==="default" || opcao==="find"? <div className="form-busca">
                      <input className="input-busca" type="text" name="buscar" value={wordPart} onChange={e=> setWordPart(e.target.value)} placeholder="Digite a palavra." id="" />
                      <button onClick={()=> findWordPartAll(wordPart)} className="button-busca"><RiFindReplaceLine/></button>
                  </div>: ' '} 

                  <div className="list-word">
                    
                      <div className="container-words">
                        <div className="grid-container">
                            { opcao!=="default" && opcao!=="find" ?                            
                              wordsH.map( word=> (
                                <div className="grid-item">
                                  <button onClick={()=> find(word.word)} className="word">{word.word}</button>                    
                                </div>))
                              : words.map( word=> (
                              <div className="grid-item">
                                <button onClick={()=> find(word)} className="word">{word}</button>                    
                              </div>
                            
                              ))
                             }
                        </div>                          
                          
                          <li id="sentinela"></li>
                      </div>                
                    
                                
                  </div>  
              </div>
          </div>         

          
        </div>
        
    );
}