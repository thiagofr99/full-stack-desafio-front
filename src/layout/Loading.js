import './style.css'

import load from '../assets/Glossy-Loading-Images/256x256.svg'

function Loading(){
    return(
        <div className={"loader_container"}>
            <img className={"loader"} src={load} alt="Loading" />
        </div>
    )
}

export default Loading