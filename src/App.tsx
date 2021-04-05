import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import logo from './logo.svg'
import './App.scss'
import DPlayer from 'dplayer';
import TVListConfig from './tv.config.json'

type TVtype = {
  title: string,
  src: 'string',
  img: 'string'
}

const TVList = TVListConfig as TVtype[]

const randomTV: () => TVtype = () => TVList[Math.floor(Math.random() * TVList.length)]

function App() {
  const dplayer = useRef<DPlayer>()
  const [currentTV, setCurrentTV] = useState<TVtype>()
  const originTitle = useRef(window.document.title)
  const [showbangumi, setShowbangumi] = useState(false)
  const prevTV = useRef<TVtype>()
  const prevDeg = useRef(0)

  const containerDeg = useMemo(() => {
    if (!currentTV) return 0
    
    if (currentTV !== prevTV.current) {
      if (!prevTV.current) {
        prevTV.current = TVList[0]
      }

      let delt = TVList.indexOf(currentTV) - TVList.indexOf(prevTV.current)

      let deltDeg = delt * -1 * 360 / TVList.length
      deltDeg = Math.abs(deltDeg) > 180 
        ? deltDeg > 0 
          ? -360 + deltDeg : 
            360 + deltDeg 
          : deltDeg
      let deg = prevDeg.current + deltDeg
      prevDeg.current = deg
      prevTV.current = currentTV
    }
    return prevDeg.current
  }, [currentTV])

  const setTVInfo = useCallback((tv: TVtype) => {
    setCurrentTV(tv)
    window.document.title = originTitle.current + ' - ' + tv.title
    window.location.hash = encodeURIComponent(tv.src)
  }, [])

  // init
  useEffect(() => {
    let tv = randomTV()
    if (window.location.hash) {

      let tvSrc = decodeURIComponent(window.location.hash.slice(1, window.location.hash.length))
      console.log(tvSrc)
      let tvTarget = TVList.find(tv => tv.src === tvSrc)
      if (tvTarget) {
        tv = tvTarget
      }
    }
    setTVInfo(tv)
  }, [])

  const createDplayer = useCallback(() => {
    if (!currentTV) return

    dplayer.current = new DPlayer({
      container: document.getElementById('dplayer'),
      autoplay: import.meta.env.MODE === 'production',
      video: {
        url: currentTV.src,
        type: 'hls'
      },
      preload: "none"
    });
  }, [currentTV])

  useEffect(() => {
    if (!currentTV) return

    if (dplayer.current) {
      dplayer.current.destroy()
      createDplayer()
    } else {
      createDplayer()
    }
  }, [currentTV, createDplayer])


  return (
    <div className="App" id="App">
      <h2>Nihon TV</h2>
      <div className="selector" onWheel={e => {
        const prev = currentTV
        const prevIndex = TVList.indexOf(prev!)
        let nextIndex
        if (e.deltaY > 0) {
          nextIndex = prevIndex + 1
        } else {
          nextIndex = prevIndex - 1
        }
        nextIndex = nextIndex > TVList.length - 1
          ? 0 
          : nextIndex < 0 
            ? TVList.length - 1
            : nextIndex
        setTVInfo(TVList[nextIndex])
      }}>
        <div className="container" style={{transform: `translateX(-50%) rotateY(${containerDeg}deg)`}}>
        {
            TVList.map((tv, index, arr) => (
              <div 
                className="tvImg" 
                key={tv.title} 
                style={{transform: `rotateY(${index * 360 / arr.length }deg ) translateZ(300px)`}}
                onClick={() => {
                  setTVInfo(tv)
                }}
              >
                <img src={`img/${tv.img}`}/>
              </div>
            ))
          }
        </div>      
      </div>
      <div style={{padding: '0 0 20px'}}>
        <span>TV：</span>
        <select
          value={currentTV?.src}
          onChange={e => {
            const tv = TVList.find(tv => tv.src === e.target.value)
            setTVInfo(tv!)
          }}
        >
          {TVList.map(tv => <option key={tv.src} value={tv.src}>{ tv.title }</option>)}
        </select>
        <button　onClick={() => setShowbangumi(prev => !prev)} style={{marginLeft: '0.8rem'}}>番組表</button>
      </div>
      <div id="dplayer"/>
      {showbangumi && <iframe src="https://tv.yahoo.co.jp/listings" width="100%" style={{height: '85vh', marginTop: '1rem'}} frameBorder={0}/>}
    </div>
  )
}

export default App
