import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const url = 'http://localhost:4000/activity';
  const [data, setData] = useState(null);
  const [params, setParams] = useState({});

  const fetchData = () => {
    fetch(url)
      .then(res => res.json()
        .then(data => setData(data)))
  }

  useEffect(() => {
    fetchData()
  }, [])

  const startHandler = ({ target }) => {
    if (target.value.length === 2) { target.value += ':' };
    setParams({ ...params, start: target.value })
  }

  const finishHandler = ({ target }) => {
    if (target.value.length === 2) { target.value += ':' };
    setParams({ ...params, finish: target.value })
  }

  const createActivity = (params) => {
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => (res.status === 200)
      ? fetchData()
      : console.log('err'))
      .then(data => data)
  }

  const total = (type) => {
    let sum = 0;
    data.map(dis => dis.type === type
      ? sum += dis.distance
      : null)
    return sum;
  }

  const longest = (type) => {
    const maxDistance = data.map(activity => activity.type === type
      ? activity.distance
      : null)
    const [maximum] = data.filter(a => a.distance === Math.max(...maxDistance))
    const time = (new Date('2020-03-10T' + maximum.finish)
      - new Date('2020-03-10T' + maximum.start)) / 60000
    const formatedTime = time >= 60
      ? Math.trunc(time / 60) + ' h' + (time % 60 === 0 ? '' : time % 60 + ' m')
      : time % 60 + ' m'

    return [maximum.date, ' ', formatedTime, ' ', maximum.distance, ' km'];
  }

  const averageSpeed = ({ distance, finish, start }) => {
    const average = distance / (
      (new Date('2020-03-10T' + finish)
        - new Date('2020-03-10T' + start)) / 60000)
      * 60
    return average.toFixed(1) + 'km/hour';
  }

  const time = ({ finish, start }) => {
    const time = (new Date('2020-03-10T' + finish)
      - new Date('2020-03-10T' + start)) / 60000;
    return time >= 60
      ? Math.trunc(time / 60) + ' hour ' + (time % 60 === 0 ? '' : time % 60 + ' minutes')
      : time % 60 + ' minutes'
  }

  return (
    data &&
    <div>
      <p className='title'>Activity Tracker</p>
      <form className='form'>
        <input placeholder='Start Time' className={'params'} type='tel' onChange={(e) => startHandler(e)} />
        <input placeholder='Finish Time' className={'params'} type='tel' onChange={(e) => finishHandler(e)} />
        <input
          placeholder='Distance (km)'
          className={'params'}
          type='tel'
          onChange={(e) => setParams({ ...params, distance: e.target.value })}
        />
        <select className='params' onClick={(e) => setParams({ ...params, type: e.target.value })}>
          <option hidden>Choose type</option>
          <option>Run</option>
          <option>Ride</option>
        </select>
        <input className={'params'} type='button' onClick={() => createActivity(params)} value={'Save'} />
      </form>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div className='mainBlock'>
          {data.map(activity =>
            <div key={activity.id} className={'paramBlock'}>
              <div className={'params'}>
                {activity.date}
              </div>
              <div className={'params'}>
                {time(activity)}
              </div>
              <div className={'params'}>
                {activity.type}
              </div>
              <div className={'params'}>
                {activity.distance + 'km'}
              </div>
              <div>
                {averageSpeed(activity)}
              </div>
            </div>
          )}
        </div>
        <div>
          <div className='total'>
            <p>Total run distance: {total('Run') + 'km'}</p>
            <p>Total ride distance: {total('Ride') + 'km'}</p>
          </div>
          <div className='longest'>
            <p>Longest run: </p>
            <p>{longest('Run')}</p>
            <p>Longest ride: </p>
            <p>{longest('Ride')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
