import {selectLayerName} from './experienceSlice';
import { useSelector } from 'react-redux';

const Navigation = ({ start, authored, toggleCreate}) => {
  
  const layerName = useSelector(selectLayerName);

  const renderAuthored = ()=>{
    return authored.map(a=>{
      const textWeight = layerName==a ? "font-bold" : "font-normal"; 
      return <a key={a} className={`p-2 text-white ${textWeight} text-xs`} style={{opacity:layerName==a?1:0.6}} href={encodeURI(`?layers=${a}`)}>{a}</a>
    })
  }
    return <nav className="flex items-center flex-wrap bg-teal-500 p-1">
      <div className="flex items-center text-white">   

      <svg width="66" height="42" viewBox="0 0 33 21" style={{fillRule:"evenodd",clipRule:"evenodd",strokeLinecap:"round",strokeLinejoin:"round",strokeMiterlimit:"1.5"}}>
        <path d="M1.425,11.233c1.484,-2.368 3.867,-5.752 8.591,-8.263c4.267,-2.268 9.378,-2.597 10.538,-2.634c11.581,-0.375 11.745,9.075 11.758,9.983c0.149,2.891 -0.988,5.991 -2.709,6.365c-2.557,0.556 -5.645,0.675 -8.484,0.823c-0,-0 -0.485,-2.705 -3.147,-2.523c-3.078,0.211 -3.057,2.749 -3.057,2.749l-5.478,0.034c-3.169,-0.217 -6.251,-0.923 -9.112,-2.878c0.099,-1.076 0.424,-2.577 1.1,-3.656Z"  style={{fill:"none",stroke:"#fff",strokeWidth:0.65}}/>
        <path d="M18.03,16.213c1.187,0 2.15,0.921 2.15,2.056c0,1.135 -0.963,2.056 -2.15,2.056c-1.187,0 -2.151,-0.921 -2.151,-2.056c-0,-1.135 0.964,-2.056 2.151,-2.056Zm-0,1.273c0.452,-0 0.819,0.351 0.819,0.783c0,0.433 -0.367,0.784 -0.819,0.784c-0.453,-0 -0.82,-0.351 -0.82,-0.784c-0,-0.432 0.367,-0.783 0.82,-0.783Z" style={{fill:"none",stroke:"#fff",strokeWidth:0.61}} />
        <path d="M3.191,11.01c-0,0 5.163,-9.036 17.356,-9.416c10.119,-0.316 10.542,8.541 10.542,8.541c-0.983,0.081 -1.454,0.569 -1.498,0.911c-0.093,0.724 0.607,1.131 1.224,1.14c-0.301,1.964 -0.921,2.796 -2.169,3.24c-1.608,0.572 -6.789,0.413 -6.789,0.413c-0,-0 -0.524,-2.554 -3.759,-2.522c-2.696,0.027 -3.614,2.85 -3.614,2.85c-4.652,0.473 -8.768,-0.024 -12.101,-1.954c0.019,-0.386 0.149,-0.733 0.372,-1.045c-0,-0 1.62,-0.073 1.658,-1.111c0.035,-0.959 -1.222,-1.047 -1.222,-1.047Z" style={{fill:"none",stroke:"#fff",strokeWidth:0.65}}/>
        <path d="M21.831,5.29c0.027,-0.872 0.996,-1.574 2.185,-1.574c1.207,0 2.186,0.723 2.186,1.612c0,0.051 -0.003,0.101 -0.009,0.151l0.297,7.926l-4.358,0.089l-0.317,-8.204l0.016,0Z" style={{fill:"none",stroke:"#fff",strokeWidth:0.68}}/>
        <ellipse cx="24.137" cy="6.687" rx="1.042" ry="1.013" style={{fill:"none",stroke:"#fff",strokeWidth:0.54}}/>
        <path d="M17.87,5.83c-0.004,-0.204 -0.147,-0.367 -0.319,-0.363c-1.828,-0.053 -3.673,-0.044 -5.557,0.109c-0.172,0.003 -0.309,0.171 -0.305,0.375c0.092,0.837 0.1,1.693 0.051,2.564c0.004,0.203 0.147,0.366 0.319,0.363c1.87,-0.146 3.715,-0.137 5.557,-0.11c0.172,-0.003 0.308,-0.171 0.304,-0.375c-0.045,-0.854 -0.062,-1.709 -0.05,-2.563Z" style={{fill:"none",stroke:"#fff",strokeWidth:0.61}} />
      </svg>
        
      </div>
    
     <div>
      <span className="font-semibold text-xl tracking-tight pl-4 text-white">
        Future Mundane
      </span>
    </div>
    
    <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto pl-10">
      <div className="text-sm lg: flex-grow">
        {layerName.trim() != "" && <a onClick={start} className="block mt-4 lg:inline-block lg:mt-0 text-white  hover:font-bold mr-4">Start</a>}
        {layerName.trim() != "" && <a target="_blank" href={encodeURI(`/author?layers=${layerName}`)} className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">Edit</a>}
      </div>
    </div>

    <div className="flex flex-row">
      {renderAuthored()}
      <div className="p-2 text-xs font-bold text-white" onClick={()=>toggleCreate()}>upload</div> 
    </div>
  </nav>
};

export default Navigation;
