import React, { useCallback, useEffect, useRef, useState } from 'react'
import logo from './logo.svg'
import './App.scss'
import DPlayer from 'dplayer';
import TVListConfig from './tv.config.json'

type TVtype = {
  title: string,
  src: 'string'
}

const TVList = TVListConfig as TVtype[]

const randomTV: () => TVtype = () => TVList[Math.floor(Math.random() * TVList.length)]

function App() {
  const dplayer = useRef<DPlayer>()
  const [currentTV, setCurrentTV] = useState<TVtype>()
  const originTitle = useRef(window.document.title)
  const [showbangumi, setShowbangumi] = useState(false)

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
      autoplay: true,
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
