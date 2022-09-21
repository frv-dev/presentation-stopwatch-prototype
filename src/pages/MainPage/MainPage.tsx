import { Button, Container, FormGroup, TextField } from '@mui/material';
import './MainPage.css';
import React, { useEffect, useState } from 'react';

interface IFormData {
  title: string,
  time: string,
  warningTimes: string,
  warningMessage: string,
  finalMessage: string,
}

interface IProcessedData {
  title: string,
  time: number,
  warningTimes: number[],
  warningMessage: string,
  finalMessage: string,
}

function MainPage() {
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [showFinalMessage, setShowFinalMessage] = useState<boolean>(false);

  const [timer, setTimer] = useState<NodeJS.Timer>();

  const [warningTimeToFinish, setWarningTimeToFinish] = useState<number>(0);

  const [formData, setFormData] = useState<IFormData>({
    title: "",
    time: "",
    warningTimes: "",
    warningMessage: "",
    finalMessage: "",
  });

  const [processedData, setProcessedData] = useState<IProcessedData>({
    title: "",
    time: 0,
    warningTimes: [],
    warningMessage: "",
    finalMessage: "",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setProcessedData(function (processedData: IProcessedData) {
        if (processedData.warningTimes.includes(processedData.time - 1)) {
          setShowWarning(true);
        }

        if (processedData.time - 1 === 0) {
          setShowFinalMessage(true);
          setShowWarning(false);
        }
        
        return {...processedData, time: processedData.time - 1};
      })
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (showWarning) {
      setTimeout(() => {
        setShowWarning(false);
      }, 20000);
    } else {
      setWarningTimeToFinish(0);
    }
  }, [showWarning]);

  function toggleRun(): void {
    setIsRunning(!isRunning);

    // TODO: When false empty everyone
  }

  function start(): void {
    processData();
    toggleRun();
  }

  function end(): void {
    emptyProcesedData();
    toggleRun();
  }

  function emptyProcesedData(): void {
    setProcessedData({
      title: "",
      time: 0,
      warningTimes: [],
      warningMessage: "",
      finalMessage: "",
    });

    setShowFinalMessage(false);
    setShowWarning(false);
  }

  function timeToSeconds(textTime: string): number {
    const time = textTime.split(':');

    if (time.length === 2) {
      return (parseInt(time[0]) * 60) + parseInt(time[1]);
    } else if (time.length === 3) {
      return (parseInt(time[0]) * 3600) + (parseInt(time[1]) * 60) + parseInt(time[2]);
    }

    return 0;
  }

  function secondsToTime(totalSeconds: number): string {
    let hours = 0, minutes = 0, seconds = 0;

    if (totalSeconds >= 3600) {
      hours = Math.floor(totalSeconds / 3600);

      totalSeconds = totalSeconds % 3600;
    }

    if (totalSeconds >= 60) {
      minutes = Math.floor(totalSeconds / 60);

      totalSeconds = totalSeconds % 60;
    }

    if (totalSeconds > 0) {
      seconds = totalSeconds;
    }

    return (
      (hours !== 0 ? String(hours) + ':' : '')
      + String(minutes).padStart(2, '0') + ':'
      + String(seconds).padStart(2, '0')
    );
  }

  function processData(): void {
    setProcessedData({
      title: formData.title,
      time: timeToSeconds(formData.time),
      warningTimes: formData.warningTimes
        .split(',')
        .map<number>((warningTime: string) => timeToSeconds(warningTime)),
      warningMessage: formData.warningMessage,
      finalMessage: formData.finalMessage,
    });
  }

  function showWarningText(): JSX.Element {    
    if (!(showWarning && !showFinalMessage)) {
      return <></>;
    }

    if (warningTimeToFinish === 0) {
      setWarningTimeToFinish(processedData.time);
    }

    return (
        <p className='message-text message-yellow'>
          <b>
            {processedData.warningMessage}
            <br/>
            Faltam: {secondsToTime(warningTimeToFinish)}
          </b>
        </p>
      );
  }

  function showFinalMessageText(): JSX.Element {    
    return showFinalMessage
      ? (
        <p className='blink-me message-text message-green'>
          <b>
            {processedData.finalMessage}
          </b>
        </p>
      )
      : <></>;
  }

  return isRunning ? (
    <div className='timer-window'>

      <p className='title'>
        <b>
          {processedData.title}
        </b>
      </p>

      <p className='timer'>
        <b>
          {secondsToTime(processedData.time)}
        </b>
      </p>

      <br />
      {showWarningText()}
      {showFinalMessageText()}
      <br />
      <Button variant='contained' onClick={end}>VOLTAR</Button>
    </div>
  ) : (
    <div id="main-form-container-father">
      <Container id="main-form-container" maxWidth="sm">
        <FormGroup id="main-form">
          <TextField id="title" label="Título" value={formData.title} onChange={event => setFormData({...formData, title: event.target.value})} margin='normal' className="inputs"/>
          <TextField id="time" label="Tempo" value={formData.time} onChange={event => setFormData({...formData, time: event.target.value})} margin='normal' className="inputs"/>
          <TextField id="warning-times" label="Tempo de avisos (separados por vírgula)" value={formData.warningTimes} onChange={event => setFormData({...formData, warningTimes: event.target.value})} margin='normal' className="inputs"/>
          <TextField id="warning-message" label="Mensagem de avisos" value={formData.warningMessage} onChange={event => setFormData({...formData, warningMessage: event.target.value})} margin='normal' className="inputs"/>
          <TextField id="final-message" label="Mensagem final" value={formData.finalMessage} onChange={event => setFormData({...formData, finalMessage: event.target.value})} margin='normal' className="inputs"/>

          <Button id="start-button" variant='contained' onClick={start}>INICIAR</Button>
        </FormGroup>
      </Container>
    </div>
  );
}

export default MainPage;
